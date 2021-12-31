'use strict';

var obsidian = require('obsidian');

function around(obj, factories) {
    const removers = Object.keys(factories).map(key => around1(obj, key, factories[key]));
    return removers.length === 1 ? removers[0] : function () { removers.forEach(r => r()); };
}
function around1(obj, method, createWrapper) {
    const original = obj[method], hadOwn = obj.hasOwnProperty(method);
    let current = createWrapper(original);
    // Let our wrapper inherit static props from the wrapping method,
    // and the wrapping method, props from the original method
    if (original)
        Object.setPrototypeOf(current, original);
    Object.setPrototypeOf(wrapper, current);
    obj[method] = wrapper;
    // Return a callback to allow safe removal
    return remove;
    function wrapper(...args) {
        // If we have been deactivated and are no longer wrapped, remove ourselves
        if (current === original && obj[method] === wrapper)
            remove();
        return current.apply(this, args);
    }
    function remove() {
        // If no other patches, just do a direct removal
        if (obj[method] === wrapper) {
            if (hadOwn)
                obj[method] = original;
            else
                delete obj[method];
        }
        if (current === original)
            return;
        // Else pass future calls through, and remove wrapper from the prototype chain
        current = original;
        Object.setPrototypeOf(wrapper, original || Function);
    }
}
function after(promise, cb) {
    return promise.then(cb, cb);
}
function serialize(asyncFunction) {
    let lastRun = Promise.resolve();
    function wrapper(...args) {
        return lastRun = new Promise((res, rej) => {
            after(lastRun, () => {
                asyncFunction.apply(this, args).then(res, rej);
            });
        });
    }
    wrapper.after = function () {
        return lastRun = new Promise((res, rej) => { after(lastRun, res); });
    };
    return wrapper;
}

function hotkeyToString(hotkey) {
    return obsidian.Keymap.compileModifiers(hotkey.modifiers)+"," + hotkey.key.toLowerCase()
}

function isPluginTab(id) {
    return id === "plugins" || id === "community-plugins";
}

function pluginSettingsAreOpen(app) {
    return settingsAreOpen(app) && isPluginTab(app.setting.activeTab?.id)
}

function settingsAreOpen(app) {
    return app.setting.containerEl.parentElement !== null
}

function isPluginViewer(ob) {
    return (
        ob instanceof obsidian.Modal &&
        ob.hasOwnProperty("autoload") &&
        typeof ob.showPlugin === "function" &&
        typeof ob.updateSearch === "function" &&
        typeof ob.searchEl == "object"
    );
}

function onElement(el, event, selector, callback, options=false) {
    el.on(event, selector, callback, options);
    return () => el.off(event, selector, callback, options);
}

class HotkeyHelper extends obsidian.Plugin {

    onload() {
        const workspace = this.app.workspace, plugin = this;
        this.lastSearch = {};   // last search used, indexed by tab

        this.registerEvent( workspace.on("plugin-settings:before-display", (settingsTab, tabId) => {
            this.hotkeyButtons = {};
            this.configButtons = {};
            this.globalsAdded = false;
            this.searchInput = null;
            const remove = around(obsidian.Setting.prototype, {
                addSearch(old) { return function(f) {
                    remove();
                    return old.call(this, i => {
                        plugin.searchInput = i; f?.(i);
                    })
                }}
            });
            setImmediate(remove);
        }) );
        this.registerEvent( workspace.on("plugin-settings:after-display",  () => this.refreshButtons(true)) );

        this.registerEvent( workspace.on("plugin-settings:plugin-control", (setting, manifest, enabled, tabId) => {
            this.globalsAdded || this.addGlobals(tabId, setting.settingEl);
            this.createExtraButtons(setting, manifest, enabled);
        }) );

        // Refresh the buttons when commands or setting tabs are added or removed
        const requestRefresh = obsidian.debounce(this.refreshButtons.bind(this), 50, true);
        function refresher(old) { return function(...args){ requestRefresh(); return old.apply(this, args); }; }
        this.register(around(app.commands, {addCommand:    refresher, removeCommand:    refresher}));
        this.register(around(app.setting,  {addPluginTab:  refresher, removePluginTab:  refresher}));
        this.register(around(app.setting,  {addSettingTab: refresher, removeSettingTab: refresher}));

        workspace.onLayoutReady(this.whenReady.bind(this));
        this.registerObsidianProtocolHandler("goto-plugin", ({id, show}) => {
            workspace.onLayoutReady(() => { this.gotoPlugin(id, show); });
        });
    }

    whenReady() {
        const app = this.app, plugin = this;

        // Save and restore current tab (workaround https://forum.obsidian.md/t/settings-dialog-resets-to-first-tab-every-time/18240)
        this.register(around(app.setting, {
            onOpen(old) { return function(...args) {
                old.apply(this, args);
                if (!obsidian.Platform.isMobile && plugin.lastTabId) this.openTabById(plugin.lastTabId);
            }},
            onClose(old) { return function(...args) {
                plugin.lastTabId = this.activeTab?.id;
                return old.apply(this, args);
            }}
        }));

        const corePlugins = this.getSettingsTab("plugins");
        const community   = this.getSettingsTab("community-plugins");

        // Hook into the display() method of the plugin settings tabs
        if (corePlugins) this.register(around(corePlugins, {display: this.addPluginSettingEvents.bind(this, corePlugins.id)}));
        if (community)   this.register(around(community,   {display: this.addPluginSettingEvents.bind(this, community.id)}));

        if (community)   this.register(
            // Trap opens of the community plugins viewer
            onElement(
                community.containerEl, "click",
                ".mod-cta, .installed-plugins-container .setting-item-info",
                () => this.enhanceViewer(),
                true
            )
        );

        // Now force a refresh if either plugins tab is currently visible (to show our new buttons)
        function refreshTabIfOpen() {
            if (pluginSettingsAreOpen(app)) app.setting.openTabById(app.setting.activeTab.id);
        }
        refreshTabIfOpen();

        // And do it again after we unload (to remove the old buttons)
        this.register(() => setImmediate(refreshTabIfOpen));

        // Tweak the hotkey settings tab to make filtering work on id prefixes as well as command names
        const hotkeysTab = this.getSettingsTab("hotkeys");
        if (hotkeysTab) {
            this.register(around(hotkeysTab, {
                display(old) { return function() { old.call(this); this.searchInputEl.focus(); }; },
                updateHotkeyVisibility(old) {
                    return function() {
                        const oldSearch = this.searchInputEl.value, oldCommands = app.commands.commands;
                        try {
                            if (oldSearch.endsWith(":") && !oldSearch.contains(" ")) {
                                // This is an incredibly ugly hack that relies on updateHotkeyVisibility() iterating app.commands.commands
                                // looking for hotkey conflicts *before* anything else.
                                let current = oldCommands;
                                let filtered = Object.fromEntries(Object.entries(app.commands.commands).filter(
                                    ([id, cmd]) => (id+":").startsWith(oldSearch)
                                ));
                                this.searchInputEl.value = "";
                                app.commands.commands = new Proxy(oldCommands, {ownKeys(){
                                    // The first time commands are iterated, return the whole thing;
                                    // after that, return the filtered list
                                    try { return Object.keys(current); } finally { current = filtered; }
                                }});
                            }
                            return old.call(this);
                        } finally {
                            this.searchInputEl.value = oldSearch;
                            app.commands.commands = oldCommands;
                        }
                    }
                }
            }));
        }

        // Add commands
        this.addCommand({
            id: "open-plugins",
            name: "Open the Community Plugins settings",
            callback: () => this.showSettings("community-plugins") || true
        });
        this.addCommand({
            id: "browse-plugins",
            name: "Browse or search the Community Plugins catalog",
            callback: () => this.gotoPlugin()
        });
    }

    createExtraButtons(setting, manifest, enabled) {
        setting.addExtraButton(btn => {
            btn.setIcon("gear");
            btn.onClick(() => this.showConfigFor(manifest.id.replace(/^workspace$/,"file")));
            btn.setTooltip("Options");
            btn.extraSettingsEl.toggle(enabled);
            this.configButtons[manifest.id] = btn;
        });
        setting.addExtraButton(btn => {
            btn.setIcon("any-key");
            btn.onClick(() => this.showHotkeysFor(manifest.id+":"));
            btn.extraSettingsEl.toggle(enabled);
            this.hotkeyButtons[manifest.id] = btn;
        });
    }

    // Add top-level items (search and pseudo-plugins)
    addGlobals(tabId, settingEl) {
        this.globalsAdded = true;

        // Add a search filter to shrink plugin list
        const containerEl = settingEl.parentElement;
        let searchEl;
        if (tabId !== "plugins" || this.searchInput) {
            // Replace the built-in search handler
            (searchEl = this.searchInput)?.onChange(changeHandler);
        } else {
            const tmp = new obsidian.Setting(containerEl).addSearch(s => {
                searchEl = s;
                s.setPlaceholder("Filter plugins...").onChange(changeHandler);
            });
            searchEl.containerEl.style.margin = 0;
            containerEl.createDiv("hotkey-search-container").append(searchEl.containerEl);
            tmp.settingEl.detach();
        }
        if (tabId === "community-plugins") {
            searchEl.inputEl.addEventListener("keyup", e => {
                if (e.keyCode === 13 && !obsidian.Keymap.getModifiers(e)) {
                    this.gotoPlugin();
                    return false;
                }
            });
        }
        const plugin = this;
        function changeHandler(seek){
            const find = (plugin.lastSearch[tabId] = seek).toLowerCase();
            function matchAndHighlight(el) {
                const text = el.textContent = el.textContent; // clear previous highlighting, if any
                const index = text.toLowerCase().indexOf(find);
                if (!~index) return false;
                el.textContent = text.substr(0, index);
                el.createSpan("suggestion-highlight").textContent = text.substr(index, find.length);
                el.insertAdjacentText("beforeend", text.substr(index+find.length));
                return true;
            }
            containerEl.findAll(".setting-item").forEach(e => {
                const nameMatches = matchAndHighlight(e.find(".setting-item-name"));
                const descMatches = matchAndHighlight(
                    e.find(".setting-item-description > div:last-child") ??
                    e.find(".setting-item-description")
                );
                e.toggle(nameMatches || descMatches);
            });
        }
        setImmediate(() => {
            if (!searchEl) return
            if (searchEl && typeof plugin.lastSearch[tabId] === "string") {
                searchEl.setValue(plugin.lastSearch[tabId]);
                searchEl.onChanged();
            }
            if (!obsidian.Platform.isMobile) searchEl.inputEl.select();
        });
        containerEl.append(settingEl);

        if (tabId === "plugins") {
            const editorName    = this.getSettingsTab("editor")?.name || "Editor";
            const workspaceName = this.getSettingsTab("file")?.name   || "Files & Links";
            this.createExtraButtons(
                new obsidian.Setting(settingEl.parentElement)
                    .setName("App").setDesc("Miscellaneous application commands (always enabled)"),
                {id: "app", name: "App"}, true
            );
            this.createExtraButtons(
                new obsidian.Setting(settingEl.parentElement)
                    .setName(editorName).setDesc("Core editing commands (always enabled)"),
                {id: "editor", name: editorName}, true
            );
            this.createExtraButtons(
                new obsidian.Setting(settingEl.parentElement)
                    .setName(workspaceName).setDesc("Core file and pane management commands (always enabled)"),
                {id: "workspace", name: workspaceName}, true
            );
            settingEl.parentElement.append(settingEl);
        }
    }

    enhanceViewer() {
        const plugin = this;
        setImmediate(around(obsidian.Modal.prototype, {
            open(old) {
                return function(...args) {
                    if (isPluginViewer(this)) {
                        setImmediate(() => {
                            if (plugin.lastSearch["community-plugins"]) {
                                // Detach the old search area, in case the empty search is still running
                                const newResults = this.searchResultEl.cloneNode();
                                this.searchContainerEl.replaceChild(newResults, this.searchResultEl);
                                this.searchResultEl = newResults;
                                // Force an update; use an event so that the "x" appears on search
                                this.searchEl.value = plugin.lastSearch["community-plugins"];
                                this.searchEl.dispatchEvent(new Event('input'));
                            }
                            this.searchEl.select();
                        });
                        plugin.currentViewer = this;
                        around(this, {
                            updateSearch: serialize,  // prevent race conditions

                            close(old) { return function(...args) {
                                plugin.currentViewer = null;
                                return old.apply(this, args);
                            }},

                            showPlugin(old) { return async function(manifest){
                                const res = await old.call(this, manifest);
                                if (plugin.app.plugins.plugins[manifest.id]) {
                                    const buttons = this.pluginContentEl.find("button").parentElement;
                                    const keyBtn = buttons.createEl("button", {prepend: true, text: "Hotkeys"});
                                    const cfgBtn = buttons.createEl("button", {prepend: true, text: "Options"});
                                    plugin.hotkeyButtons[manifest.id] = {
                                        setTooltip(tip) {keyBtn.title = tip;}, extraSettingsEl: keyBtn
                                    };
                                    plugin.configButtons[manifest.id] = {
                                        setTooltip() {}, extraSettingsEl: cfgBtn
                                    };
                                    plugin.refreshButtons(true);
                                    keyBtn.addEventListener("click",  () => {
                                        this.close(); plugin.showHotkeysFor(manifest.id+":");
                                    });
                                    cfgBtn.addEventListener("click",  () => {
                                        this.close(); plugin.showConfigFor(manifest.id);
                                    });
                                }
                                return res;
                            }}
                        });
                    }
                    return old.apply(this, args);
                }
            }
        }));
    }

    getSettingsTab(id) { return this.app.setting.settingTabs.filter(t => t.id === id).shift(); }

    addPluginSettingEvents(tabId, old) {
        const app = this.app;
        let in_event = false;

        function trigger(...args) {
            in_event = true;
            try { app.workspace.trigger(...args); } catch(e) { console.error(e); }
            in_event = false;
        }

        // Wrapper to add plugin-settings events
        return function display(...args) {
            if (in_event) return;
            trigger("plugin-settings:before-display", this, tabId);

            // Track which plugin each setting is for
            let manifests;
            if (tabId === "plugins") {
                manifests = Object.entries(app.internalPlugins.plugins).map(
                    ([id, {instance: {name}, _loaded:enabled}]) => {return {id, name, enabled};}
                );
            } else {
                manifests = Object.values(app.plugins.manifests);
                manifests.sort((e, t) => e.name.localeCompare(t.name));
            }
            let which = 0;

            // Trap the addition of the "uninstall" buttons next to each plugin
            const remove = around(obsidian.Setting.prototype, {
                addToggle(old) {
                    return function(...args) {
                        if (tabId === "plugins" && !in_event && (manifests[which]||{}).name === this.nameEl.textContent ) {
                            const manifest = manifests[which++];
                            trigger("plugin-settings:plugin-control", this, manifest, manifest.enabled, tabId);
                        }
                        return old.apply(this, args);
                    }
                },
                addExtraButton(old) {
                    return function(...args) {
                        // The only "extras" added to settings w/a description are on the plugins, currently,
                        // so only try to match those to plugin names
                        if (tabId !== "plugins" && this.descEl.childElementCount && !in_event) {
                            if ( (manifests[which]||{}).name === this.nameEl.textContent ) {
                                const manifest = manifests[which++], enabled = !!app.plugins.plugins[manifest.id];
                                trigger("plugin-settings:plugin-control", this, manifest, enabled, tabId);
                            }
                        }                        return old.apply(this, args);
                    }
                }
            });

            try {
                return old.apply(this, args);
            } finally {
                remove();
                trigger("plugin-settings:after-display", this);
            }
        }
    }

    gotoPlugin(id, show="info") {
        if (id && show === "hotkeys") return this.showHotkeysFor(id+":");
        if (id && show === "config")  {
            if (!this.showConfigFor(id)) this.app.setting.close();
            return;
        }

        this.showSettings("community-plugins");
        const remove = around(obsidian.Modal.prototype, {
            open(old) {
                return function(...args) {
                    remove();
                    if (id) this.autoload = id;
                    return old.apply(this, args);
                }
            }
        });
        this.app.setting.activeTab.containerEl.find(".mod-cta").click();
        // XXX handle nav to not-cataloged plugin
    }

    showSettings(id) {
        this.currentViewer?.close();  // close the plugin browser if open
        settingsAreOpen(this.app) || this.app.setting.open();
        if (id) {
            this.app.setting.openTabById(id);
            return this.app.setting.activeTab?.id === id ? this.app.setting.activeTab : false
        }
    }

    showHotkeysFor(search) {
        const tab = this.showSettings("hotkeys");
        if (tab && tab.searchInputEl && tab.updateHotkeyVisibility) {
            tab.searchInputEl.value = search;
            tab.updateHotkeyVisibility();
        }
    }

    showConfigFor(id) {
        if (this.showSettings(id)) return true;
        new Notice(
            `No settings tab for "${id}": it may not be installed or might not have settings.`
        );
        return false;
    }

    pluginEnabled(id) {
        return this.app.internalPlugins.plugins[id]?._loaded || this.app.plugins.plugins[id];
    }

    refreshButtons(force=false) {
        // Don't refresh when not displaying, unless rendering is in progress
        if (!pluginSettingsAreOpen(this.app) && !force) return;

        const hkm = this.app.hotkeyManager;
        const assignedKeyCount = {};

        // Get a list of commands by plugin
        const commands = Object.values(this.app.commands.commands).reduce((cmds, cmd)=>{
            const pid = cmd.id.split(":",2).shift();
            const hotkeys = (hkm.getHotkeys(cmd.id) || hkm.getDefaultHotkeys(cmd.id) || []).map(hotkeyToString);
            hotkeys.forEach(k => assignedKeyCount[k] = 1 + (assignedKeyCount[k]||0));
            (cmds[pid] || (cmds[pid]=[])).push({hotkeys, cmd});
            return cmds;
        }, {});

        // Plugin setting tabs by plugin
        const tabs = Object.values(this.app.setting.pluginTabs).reduce((tabs, tab)=> {
            tabs[tab.id] = tab; return tabs
        }, {});
        tabs["workspace"] = tabs["editor"] = true;

        for(const id of Object.keys(this.configButtons || {})) {
            const btn = this.configButtons[id];
            if (!tabs[id]) {
                btn.extraSettingsEl.hide();
                continue;
            }
            btn.extraSettingsEl.show();
        }

        for(const id of Object.keys(this.hotkeyButtons || {})) {
            const btn = this.hotkeyButtons[id];
            if (!commands[id]) {
                // Plugin is disabled or has no commands
                btn.extraSettingsEl.hide();
                continue;
            }
            const assigned = commands[id].filter(info => info.hotkeys.length);
            const conflicts = assigned.filter(info => info.hotkeys.filter(k => assignedKeyCount[k]>1).length).length;

            btn.setTooltip(
                `Configure hotkeys${"\n"}(${assigned.length}/${commands[id].length} assigned${
                    conflicts ? "; "+conflicts+" conflicting" : ""
                })`
            );
            btn.extraSettingsEl.toggleClass("mod-error", !!conflicts);
            btn.extraSettingsEl.show();
        }
    }
}

module.exports = HotkeyHelper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLnlhcm4vY2FjaGUvbW9ua2V5LWFyb3VuZC1ucG0tMi4xLjAtNzBkZjMyZDJhYy0xYmQ3MmQyNWY5LnppcC9ub2RlX21vZHVsZXMvbW9ua2V5LWFyb3VuZC9tanMvaW5kZXguanMiLCJzcmMvcGx1Z2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBhcm91bmQob2JqLCBmYWN0b3JpZXMpIHtcbiAgICBjb25zdCByZW1vdmVycyA9IE9iamVjdC5rZXlzKGZhY3RvcmllcykubWFwKGtleSA9PiBhcm91bmQxKG9iaiwga2V5LCBmYWN0b3JpZXNba2V5XSkpO1xuICAgIHJldHVybiByZW1vdmVycy5sZW5ndGggPT09IDEgPyByZW1vdmVyc1swXSA6IGZ1bmN0aW9uICgpIHsgcmVtb3ZlcnMuZm9yRWFjaChyID0+IHIoKSk7IH07XG59XG5mdW5jdGlvbiBhcm91bmQxKG9iaiwgbWV0aG9kLCBjcmVhdGVXcmFwcGVyKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBvYmpbbWV0aG9kXSwgaGFkT3duID0gb2JqLmhhc093blByb3BlcnR5KG1ldGhvZCk7XG4gICAgbGV0IGN1cnJlbnQgPSBjcmVhdGVXcmFwcGVyKG9yaWdpbmFsKTtcbiAgICAvLyBMZXQgb3VyIHdyYXBwZXIgaW5oZXJpdCBzdGF0aWMgcHJvcHMgZnJvbSB0aGUgd3JhcHBpbmcgbWV0aG9kLFxuICAgIC8vIGFuZCB0aGUgd3JhcHBpbmcgbWV0aG9kLCBwcm9wcyBmcm9tIHRoZSBvcmlnaW5hbCBtZXRob2RcbiAgICBpZiAob3JpZ2luYWwpXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihjdXJyZW50LCBvcmlnaW5hbCk7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHdyYXBwZXIsIGN1cnJlbnQpO1xuICAgIG9ialttZXRob2RdID0gd3JhcHBlcjtcbiAgICAvLyBSZXR1cm4gYSBjYWxsYmFjayB0byBhbGxvdyBzYWZlIHJlbW92YWxcbiAgICByZXR1cm4gcmVtb3ZlO1xuICAgIGZ1bmN0aW9uIHdyYXBwZXIoLi4uYXJncykge1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIGJlZW4gZGVhY3RpdmF0ZWQgYW5kIGFyZSBubyBsb25nZXIgd3JhcHBlZCwgcmVtb3ZlIG91cnNlbHZlc1xuICAgICAgICBpZiAoY3VycmVudCA9PT0gb3JpZ2luYWwgJiYgb2JqW21ldGhvZF0gPT09IHdyYXBwZXIpXG4gICAgICAgICAgICByZW1vdmUoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgLy8gSWYgbm8gb3RoZXIgcGF0Y2hlcywganVzdCBkbyBhIGRpcmVjdCByZW1vdmFsXG4gICAgICAgIGlmIChvYmpbbWV0aG9kXSA9PT0gd3JhcHBlcikge1xuICAgICAgICAgICAgaWYgKGhhZE93bilcbiAgICAgICAgICAgICAgICBvYmpbbWV0aG9kXSA9IG9yaWdpbmFsO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmpbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudCA9PT0gb3JpZ2luYWwpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vIEVsc2UgcGFzcyBmdXR1cmUgY2FsbHMgdGhyb3VnaCwgYW5kIHJlbW92ZSB3cmFwcGVyIGZyb20gdGhlIHByb3RvdHlwZSBjaGFpblxuICAgICAgICBjdXJyZW50ID0gb3JpZ2luYWw7XG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih3cmFwcGVyLCBvcmlnaW5hbCB8fCBGdW5jdGlvbik7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyKHByb21pc2UsIGNiKSB7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbihjYiwgY2IpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZShhc3luY0Z1bmN0aW9uKSB7XG4gICAgbGV0IGxhc3RSdW4gPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBmdW5jdGlvbiB3cmFwcGVyKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGxhc3RSdW4gPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgICAgICAgIGFmdGVyKGxhc3RSdW4sICgpID0+IHtcbiAgICAgICAgICAgICAgICBhc3luY0Z1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpLnRoZW4ocmVzLCByZWopO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB3cmFwcGVyLmFmdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbGFzdFJ1biA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4geyBhZnRlcihsYXN0UnVuLCByZXMpOyB9KTtcbiAgICB9O1xuICAgIHJldHVybiB3cmFwcGVyO1xufVxuIiwiaW1wb3J0IHtQbHVnaW4sIFBsYXRmb3JtLCBLZXltYXAsIFNldHRpbmcsIE1vZGFsLCBkZWJvdW5jZX0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQge2Fyb3VuZCwgc2VyaWFsaXplfSBmcm9tIFwibW9ua2V5LWFyb3VuZFwiO1xuXG5mdW5jdGlvbiBob3RrZXlUb1N0cmluZyhob3RrZXkpIHtcbiAgICByZXR1cm4gS2V5bWFwLmNvbXBpbGVNb2RpZmllcnMoaG90a2V5Lm1vZGlmaWVycykrXCIsXCIgKyBob3RrZXkua2V5LnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gaXNQbHVnaW5UYWIoaWQpIHtcbiAgICByZXR1cm4gaWQgPT09IFwicGx1Z2luc1wiIHx8IGlkID09PSBcImNvbW11bml0eS1wbHVnaW5zXCI7XG59XG5cbmZ1bmN0aW9uIHBsdWdpblNldHRpbmdzQXJlT3BlbihhcHApIHtcbiAgICByZXR1cm4gc2V0dGluZ3NBcmVPcGVuKGFwcCkgJiYgaXNQbHVnaW5UYWIoYXBwLnNldHRpbmcuYWN0aXZlVGFiPy5pZClcbn1cblxuZnVuY3Rpb24gc2V0dGluZ3NBcmVPcGVuKGFwcCkge1xuICAgIHJldHVybiBhcHAuc2V0dGluZy5jb250YWluZXJFbC5wYXJlbnRFbGVtZW50ICE9PSBudWxsXG59XG5cbmZ1bmN0aW9uIGlzUGx1Z2luVmlld2VyKG9iKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgb2IgaW5zdGFuY2VvZiBNb2RhbCAmJlxuICAgICAgICBvYi5oYXNPd25Qcm9wZXJ0eShcImF1dG9sb2FkXCIpICYmXG4gICAgICAgIHR5cGVvZiBvYi5zaG93UGx1Z2luID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgdHlwZW9mIG9iLnVwZGF0ZVNlYXJjaCA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgIHR5cGVvZiBvYi5zZWFyY2hFbCA9PSBcIm9iamVjdFwiXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gb25FbGVtZW50KGVsLCBldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrLCBvcHRpb25zPWZhbHNlKSB7XG4gICAgZWwub24oZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjaywgb3B0aW9ucylcbiAgICByZXR1cm4gKCkgPT4gZWwub2ZmKGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2ssIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3RrZXlIZWxwZXIgZXh0ZW5kcyBQbHVnaW4ge1xuXG4gICAgb25sb2FkKCkge1xuICAgICAgICBjb25zdCB3b3Jrc3BhY2UgPSB0aGlzLmFwcC53b3Jrc3BhY2UsIHBsdWdpbiA9IHRoaXM7XG4gICAgICAgIHRoaXMubGFzdFNlYXJjaCA9IHt9OyAgIC8vIGxhc3Qgc2VhcmNoIHVzZWQsIGluZGV4ZWQgYnkgdGFiXG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KCB3b3Jrc3BhY2Uub24oXCJwbHVnaW4tc2V0dGluZ3M6YmVmb3JlLWRpc3BsYXlcIiwgKHNldHRpbmdzVGFiLCB0YWJJZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5ob3RrZXlCdXR0b25zID0ge307XG4gICAgICAgICAgICB0aGlzLmNvbmZpZ0J1dHRvbnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsc0FkZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IGFyb3VuZChTZXR0aW5nLnByb3RvdHlwZSwge1xuICAgICAgICAgICAgICAgIGFkZFNlYXJjaChvbGQpIHsgcmV0dXJuIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbGQuY2FsbCh0aGlzLCBpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZWFyY2hJbnB1dCA9IGk7IGY/LihpKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXRJbW1lZGlhdGUocmVtb3ZlKTtcbiAgICAgICAgfSkgKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KCB3b3Jrc3BhY2Uub24oXCJwbHVnaW4tc2V0dGluZ3M6YWZ0ZXItZGlzcGxheVwiLCAgKCkgPT4gdGhpcy5yZWZyZXNoQnV0dG9ucyh0cnVlKSkgKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoIHdvcmtzcGFjZS5vbihcInBsdWdpbi1zZXR0aW5nczpwbHVnaW4tY29udHJvbFwiLCAoc2V0dGluZywgbWFuaWZlc3QsIGVuYWJsZWQsIHRhYklkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbHNBZGRlZCB8fCB0aGlzLmFkZEdsb2JhbHModGFiSWQsIHNldHRpbmcuc2V0dGluZ0VsKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRXh0cmFCdXR0b25zKHNldHRpbmcsIG1hbmlmZXN0LCBlbmFibGVkKTtcbiAgICAgICAgfSkgKTtcblxuICAgICAgICAvLyBSZWZyZXNoIHRoZSBidXR0b25zIHdoZW4gY29tbWFuZHMgb3Igc2V0dGluZyB0YWJzIGFyZSBhZGRlZCBvciByZW1vdmVkXG4gICAgICAgIGNvbnN0IHJlcXVlc3RSZWZyZXNoID0gZGVib3VuY2UodGhpcy5yZWZyZXNoQnV0dG9ucy5iaW5kKHRoaXMpLCA1MCwgdHJ1ZSk7XG4gICAgICAgIGZ1bmN0aW9uIHJlZnJlc2hlcihvbGQpIHsgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpeyByZXF1ZXN0UmVmcmVzaCgpOyByZXR1cm4gb2xkLmFwcGx5KHRoaXMsIGFyZ3MpOyB9OyB9XG4gICAgICAgIHRoaXMucmVnaXN0ZXIoYXJvdW5kKGFwcC5jb21tYW5kcywge2FkZENvbW1hbmQ6ICAgIHJlZnJlc2hlciwgcmVtb3ZlQ29tbWFuZDogICAgcmVmcmVzaGVyfSkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyKGFyb3VuZChhcHAuc2V0dGluZywgIHthZGRQbHVnaW5UYWI6ICByZWZyZXNoZXIsIHJlbW92ZVBsdWdpblRhYjogIHJlZnJlc2hlcn0pKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlcihhcm91bmQoYXBwLnNldHRpbmcsICB7YWRkU2V0dGluZ1RhYjogcmVmcmVzaGVyLCByZW1vdmVTZXR0aW5nVGFiOiByZWZyZXNoZXJ9KSk7XG5cbiAgICAgICAgd29ya3NwYWNlLm9uTGF5b3V0UmVhZHkodGhpcy53aGVuUmVhZHkuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJPYnNpZGlhblByb3RvY29sSGFuZGxlcihcImdvdG8tcGx1Z2luXCIsICh7aWQsIHNob3d9KSA9PiB7XG4gICAgICAgICAgICB3b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7IHRoaXMuZ290b1BsdWdpbihpZCwgc2hvdyk7IH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3aGVuUmVhZHkoKSB7XG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuYXBwLCBwbHVnaW4gPSB0aGlzO1xuXG4gICAgICAgIC8vIFNhdmUgYW5kIHJlc3RvcmUgY3VycmVudCB0YWIgKHdvcmthcm91bmQgaHR0cHM6Ly9mb3J1bS5vYnNpZGlhbi5tZC90L3NldHRpbmdzLWRpYWxvZy1yZXNldHMtdG8tZmlyc3QtdGFiLWV2ZXJ5LXRpbWUvMTgyNDApXG4gICAgICAgIHRoaXMucmVnaXN0ZXIoYXJvdW5kKGFwcC5zZXR0aW5nLCB7XG4gICAgICAgICAgICBvbk9wZW4ob2xkKSB7IHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgb2xkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmICghUGxhdGZvcm0uaXNNb2JpbGUgJiYgcGx1Z2luLmxhc3RUYWJJZCkgdGhpcy5vcGVuVGFiQnlJZChwbHVnaW4ubGFzdFRhYklkKTtcbiAgICAgICAgICAgIH19LFxuICAgICAgICAgICAgb25DbG9zZShvbGQpIHsgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBwbHVnaW4ubGFzdFRhYklkID0gdGhpcy5hY3RpdmVUYWI/LmlkO1xuICAgICAgICAgICAgICAgIHJldHVybiBvbGQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9fVxuICAgICAgICB9KSlcblxuICAgICAgICBjb25zdCBjb3JlUGx1Z2lucyA9IHRoaXMuZ2V0U2V0dGluZ3NUYWIoXCJwbHVnaW5zXCIpO1xuICAgICAgICBjb25zdCBjb21tdW5pdHkgICA9IHRoaXMuZ2V0U2V0dGluZ3NUYWIoXCJjb21tdW5pdHktcGx1Z2luc1wiKTtcblxuICAgICAgICAvLyBIb29rIGludG8gdGhlIGRpc3BsYXkoKSBtZXRob2Qgb2YgdGhlIHBsdWdpbiBzZXR0aW5ncyB0YWJzXG4gICAgICAgIGlmIChjb3JlUGx1Z2lucykgdGhpcy5yZWdpc3Rlcihhcm91bmQoY29yZVBsdWdpbnMsIHtkaXNwbGF5OiB0aGlzLmFkZFBsdWdpblNldHRpbmdFdmVudHMuYmluZCh0aGlzLCBjb3JlUGx1Z2lucy5pZCl9KSk7XG4gICAgICAgIGlmIChjb21tdW5pdHkpICAgdGhpcy5yZWdpc3Rlcihhcm91bmQoY29tbXVuaXR5LCAgIHtkaXNwbGF5OiB0aGlzLmFkZFBsdWdpblNldHRpbmdFdmVudHMuYmluZCh0aGlzLCBjb21tdW5pdHkuaWQpfSkpO1xuXG4gICAgICAgIGlmIChjb21tdW5pdHkpICAgdGhpcy5yZWdpc3RlcihcbiAgICAgICAgICAgIC8vIFRyYXAgb3BlbnMgb2YgdGhlIGNvbW11bml0eSBwbHVnaW5zIHZpZXdlclxuICAgICAgICAgICAgb25FbGVtZW50KFxuICAgICAgICAgICAgICAgIGNvbW11bml0eS5jb250YWluZXJFbCwgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIFwiLm1vZC1jdGEsIC5pbnN0YWxsZWQtcGx1Z2lucy1jb250YWluZXIgLnNldHRpbmctaXRlbS1pbmZvXCIsXG4gICAgICAgICAgICAgICAgKCkgPT4gdGhpcy5lbmhhbmNlVmlld2VyKCksXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIE5vdyBmb3JjZSBhIHJlZnJlc2ggaWYgZWl0aGVyIHBsdWdpbnMgdGFiIGlzIGN1cnJlbnRseSB2aXNpYmxlICh0byBzaG93IG91ciBuZXcgYnV0dG9ucylcbiAgICAgICAgZnVuY3Rpb24gcmVmcmVzaFRhYklmT3BlbigpIHtcbiAgICAgICAgICAgIGlmIChwbHVnaW5TZXR0aW5nc0FyZU9wZW4oYXBwKSkgYXBwLnNldHRpbmcub3BlblRhYkJ5SWQoYXBwLnNldHRpbmcuYWN0aXZlVGFiLmlkKTtcbiAgICAgICAgfVxuICAgICAgICByZWZyZXNoVGFiSWZPcGVuKCk7XG5cbiAgICAgICAgLy8gQW5kIGRvIGl0IGFnYWluIGFmdGVyIHdlIHVubG9hZCAodG8gcmVtb3ZlIHRoZSBvbGQgYnV0dG9ucylcbiAgICAgICAgdGhpcy5yZWdpc3RlcigoKSA9PiBzZXRJbW1lZGlhdGUocmVmcmVzaFRhYklmT3BlbikpO1xuXG4gICAgICAgIC8vIFR3ZWFrIHRoZSBob3RrZXkgc2V0dGluZ3MgdGFiIHRvIG1ha2UgZmlsdGVyaW5nIHdvcmsgb24gaWQgcHJlZml4ZXMgYXMgd2VsbCBhcyBjb21tYW5kIG5hbWVzXG4gICAgICAgIGNvbnN0IGhvdGtleXNUYWIgPSB0aGlzLmdldFNldHRpbmdzVGFiKFwiaG90a2V5c1wiKTtcbiAgICAgICAgaWYgKGhvdGtleXNUYWIpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXIoYXJvdW5kKGhvdGtleXNUYWIsIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5KG9sZCkgeyByZXR1cm4gZnVuY3Rpb24oKSB7IG9sZC5jYWxsKHRoaXMpOyB0aGlzLnNlYXJjaElucHV0RWwuZm9jdXMoKTsgfTsgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVIb3RrZXlWaXNpYmlsaXR5KG9sZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRTZWFyY2ggPSB0aGlzLnNlYXJjaElucHV0RWwudmFsdWUsIG9sZENvbW1hbmRzID0gYXBwLmNvbW1hbmRzLmNvbW1hbmRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2xkU2VhcmNoLmVuZHNXaXRoKFwiOlwiKSAmJiAhb2xkU2VhcmNoLmNvbnRhaW5zKFwiIFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGFuIGluY3JlZGlibHkgdWdseSBoYWNrIHRoYXQgcmVsaWVzIG9uIHVwZGF0ZUhvdGtleVZpc2liaWxpdHkoKSBpdGVyYXRpbmcgYXBwLmNvbW1hbmRzLmNvbW1hbmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvb2tpbmcgZm9yIGhvdGtleSBjb25mbGljdHMgKmJlZm9yZSogYW55dGhpbmcgZWxzZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnQgPSBvbGRDb21tYW5kcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlcmVkID0gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGFwcC5jb21tYW5kcy5jb21tYW5kcykuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFtpZCwgY21kXSkgPT4gKGlkK1wiOlwiKS5zdGFydHNXaXRoKG9sZFNlYXJjaClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXRFbC52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5jb21tYW5kcy5jb21tYW5kcyA9IG5ldyBQcm94eShvbGRDb21tYW5kcywge293bktleXMoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBmaXJzdCB0aW1lIGNvbW1hbmRzIGFyZSBpdGVyYXRlZCwgcmV0dXJuIHRoZSB3aG9sZSB0aGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHRoYXQsIHJldHVybiB0aGUgZmlsdGVyZWQgbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHsgcmV0dXJuIE9iamVjdC5rZXlzKGN1cnJlbnQpOyB9IGZpbmFsbHkgeyBjdXJyZW50ID0gZmlsdGVyZWQ7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2xkLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXRFbC52YWx1ZSA9IG9sZFNlYXJjaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuY29tbWFuZHMuY29tbWFuZHMgPSBvbGRDb21tYW5kcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBjb21tYW5kc1xuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwib3Blbi1wbHVnaW5zXCIsXG4gICAgICAgICAgICBuYW1lOiBcIk9wZW4gdGhlIENvbW11bml0eSBQbHVnaW5zIHNldHRpbmdzXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5zaG93U2V0dGluZ3MoXCJjb21tdW5pdHktcGx1Z2luc1wiKSB8fCB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiYnJvd3NlLXBsdWdpbnNcIixcbiAgICAgICAgICAgIG5hbWU6IFwiQnJvd3NlIG9yIHNlYXJjaCB0aGUgQ29tbXVuaXR5IFBsdWdpbnMgY2F0YWxvZ1wiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuZ290b1BsdWdpbigpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY3JlYXRlRXh0cmFCdXR0b25zKHNldHRpbmcsIG1hbmlmZXN0LCBlbmFibGVkKSB7XG4gICAgICAgIHNldHRpbmcuYWRkRXh0cmFCdXR0b24oYnRuID0+IHtcbiAgICAgICAgICAgIGJ0bi5zZXRJY29uKFwiZ2VhclwiKTtcbiAgICAgICAgICAgIGJ0bi5vbkNsaWNrKCgpID0+IHRoaXMuc2hvd0NvbmZpZ0ZvcihtYW5pZmVzdC5pZC5yZXBsYWNlKC9ed29ya3NwYWNlJC8sXCJmaWxlXCIpKSk7XG4gICAgICAgICAgICBidG4uc2V0VG9vbHRpcChcIk9wdGlvbnNcIik7XG4gICAgICAgICAgICBidG4uZXh0cmFTZXR0aW5nc0VsLnRvZ2dsZShlbmFibGVkKVxuICAgICAgICAgICAgdGhpcy5jb25maWdCdXR0b25zW21hbmlmZXN0LmlkXSA9IGJ0bjtcbiAgICAgICAgfSk7XG4gICAgICAgIHNldHRpbmcuYWRkRXh0cmFCdXR0b24oYnRuID0+IHtcbiAgICAgICAgICAgIGJ0bi5zZXRJY29uKFwiYW55LWtleVwiKTtcbiAgICAgICAgICAgIGJ0bi5vbkNsaWNrKCgpID0+IHRoaXMuc2hvd0hvdGtleXNGb3IobWFuaWZlc3QuaWQrXCI6XCIpKVxuICAgICAgICAgICAgYnRuLmV4dHJhU2V0dGluZ3NFbC50b2dnbGUoZW5hYmxlZClcbiAgICAgICAgICAgIHRoaXMuaG90a2V5QnV0dG9uc1ttYW5pZmVzdC5pZF0gPSBidG47XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB0b3AtbGV2ZWwgaXRlbXMgKHNlYXJjaCBhbmQgcHNldWRvLXBsdWdpbnMpXG4gICAgYWRkR2xvYmFscyh0YWJJZCwgc2V0dGluZ0VsKSB7XG4gICAgICAgIHRoaXMuZ2xvYmFsc0FkZGVkID0gdHJ1ZTtcblxuICAgICAgICAvLyBBZGQgYSBzZWFyY2ggZmlsdGVyIHRvIHNocmluayBwbHVnaW4gbGlzdFxuICAgICAgICBjb25zdCBjb250YWluZXJFbCA9IHNldHRpbmdFbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICBsZXQgc2VhcmNoRWw7XG4gICAgICAgIGlmICh0YWJJZCAhPT0gXCJwbHVnaW5zXCIgfHwgdGhpcy5zZWFyY2hJbnB1dCkge1xuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgYnVpbHQtaW4gc2VhcmNoIGhhbmRsZXJcbiAgICAgICAgICAgIChzZWFyY2hFbCA9IHRoaXMuc2VhcmNoSW5wdXQpPy5vbkNoYW5nZShjaGFuZ2VIYW5kbGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRtcCA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5hZGRTZWFyY2gocyA9PiB7XG4gICAgICAgICAgICAgICAgc2VhcmNoRWwgPSBzO1xuICAgICAgICAgICAgICAgIHMuc2V0UGxhY2Vob2xkZXIoXCJGaWx0ZXIgcGx1Z2lucy4uLlwiKS5vbkNoYW5nZShjaGFuZ2VIYW5kbGVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2VhcmNoRWwuY29udGFpbmVyRWwuc3R5bGUubWFyZ2luID0gMDtcbiAgICAgICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdihcImhvdGtleS1zZWFyY2gtY29udGFpbmVyXCIpLmFwcGVuZChzZWFyY2hFbC5jb250YWluZXJFbCk7XG4gICAgICAgICAgICB0bXAuc2V0dGluZ0VsLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWJJZCA9PT0gXCJjb21tdW5pdHktcGx1Z2luc1wiKSB7XG4gICAgICAgICAgICBzZWFyY2hFbC5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAxMyAmJiAhS2V5bWFwLmdldE1vZGlmaWVycyhlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdvdG9QbHVnaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGx1Z2luID0gdGhpcztcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlSGFuZGxlcihzZWVrKXtcbiAgICAgICAgICAgIGNvbnN0IGZpbmQgPSAocGx1Z2luLmxhc3RTZWFyY2hbdGFiSWRdID0gc2VlaykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIG1hdGNoQW5kSGlnaGxpZ2h0KGVsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGVsLnRleHRDb250ZW50ID0gZWwudGV4dENvbnRlbnQ7IC8vIGNsZWFyIHByZXZpb3VzIGhpZ2hsaWdodGluZywgaWYgYW55XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaW5kKTtcbiAgICAgICAgICAgICAgICBpZiAoIX5pbmRleCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gdGV4dC5zdWJzdHIoMCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgIGVsLmNyZWF0ZVNwYW4oXCJzdWdnZXN0aW9uLWhpZ2hsaWdodFwiKS50ZXh0Q29udGVudCA9IHRleHQuc3Vic3RyKGluZGV4LCBmaW5kLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgZWwuaW5zZXJ0QWRqYWNlbnRUZXh0KFwiYmVmb3JlZW5kXCIsIHRleHQuc3Vic3RyKGluZGV4K2ZpbmQubGVuZ3RoKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRhaW5lckVsLmZpbmRBbGwoXCIuc2V0dGluZy1pdGVtXCIpLmZvckVhY2goZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZU1hdGNoZXMgPSBtYXRjaEFuZEhpZ2hsaWdodChlLmZpbmQoXCIuc2V0dGluZy1pdGVtLW5hbWVcIikpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NNYXRjaGVzID0gbWF0Y2hBbmRIaWdobGlnaHQoXG4gICAgICAgICAgICAgICAgICAgIGUuZmluZChcIi5zZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb24gPiBkaXY6bGFzdC1jaGlsZFwiKSA/P1xuICAgICAgICAgICAgICAgICAgICBlLmZpbmQoXCIuc2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlLnRvZ2dsZShuYW1lTWF0Y2hlcyB8fCBkZXNjTWF0Y2hlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFzZWFyY2hFbCkgcmV0dXJuXG4gICAgICAgICAgICBpZiAoc2VhcmNoRWwgJiYgdHlwZW9mIHBsdWdpbi5sYXN0U2VhcmNoW3RhYklkXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHNlYXJjaEVsLnNldFZhbHVlKHBsdWdpbi5sYXN0U2VhcmNoW3RhYklkXSk7XG4gICAgICAgICAgICAgICAgc2VhcmNoRWwub25DaGFuZ2VkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIVBsYXRmb3JtLmlzTW9iaWxlKSBzZWFyY2hFbC5pbnB1dEVsLnNlbGVjdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29udGFpbmVyRWwuYXBwZW5kKHNldHRpbmdFbCk7XG5cbiAgICAgICAgaWYgKHRhYklkID09PSBcInBsdWdpbnNcIikge1xuICAgICAgICAgICAgY29uc3QgZWRpdG9yTmFtZSAgICA9IHRoaXMuZ2V0U2V0dGluZ3NUYWIoXCJlZGl0b3JcIik/Lm5hbWUgfHwgXCJFZGl0b3JcIjtcbiAgICAgICAgICAgIGNvbnN0IHdvcmtzcGFjZU5hbWUgPSB0aGlzLmdldFNldHRpbmdzVGFiKFwiZmlsZVwiKT8ubmFtZSAgIHx8IFwiRmlsZXMgJiBMaW5rc1wiO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFeHRyYUJ1dHRvbnMoXG4gICAgICAgICAgICAgICAgbmV3IFNldHRpbmcoc2V0dGluZ0VsLnBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIC5zZXROYW1lKFwiQXBwXCIpLnNldERlc2MoXCJNaXNjZWxsYW5lb3VzIGFwcGxpY2F0aW9uIGNvbW1hbmRzIChhbHdheXMgZW5hYmxlZClcIiksXG4gICAgICAgICAgICAgICAge2lkOiBcImFwcFwiLCBuYW1lOiBcIkFwcFwifSwgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRXh0cmFCdXR0b25zKFxuICAgICAgICAgICAgICAgIG5ldyBTZXR0aW5nKHNldHRpbmdFbC5wYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAuc2V0TmFtZShlZGl0b3JOYW1lKS5zZXREZXNjKFwiQ29yZSBlZGl0aW5nIGNvbW1hbmRzIChhbHdheXMgZW5hYmxlZClcIiksXG4gICAgICAgICAgICAgICAge2lkOiBcImVkaXRvclwiLCBuYW1lOiBlZGl0b3JOYW1lfSwgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRXh0cmFCdXR0b25zKFxuICAgICAgICAgICAgICAgIG5ldyBTZXR0aW5nKHNldHRpbmdFbC5wYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAuc2V0TmFtZSh3b3Jrc3BhY2VOYW1lKS5zZXREZXNjKFwiQ29yZSBmaWxlIGFuZCBwYW5lIG1hbmFnZW1lbnQgY29tbWFuZHMgKGFsd2F5cyBlbmFibGVkKVwiKSxcbiAgICAgICAgICAgICAgICB7aWQ6IFwid29ya3NwYWNlXCIsIG5hbWU6IHdvcmtzcGFjZU5hbWV9LCB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc2V0dGluZ0VsLnBhcmVudEVsZW1lbnQuYXBwZW5kKHNldHRpbmdFbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbmhhbmNlVmlld2VyKCkge1xuICAgICAgICBjb25zdCBwbHVnaW4gPSB0aGlzO1xuICAgICAgICBzZXRJbW1lZGlhdGUoYXJvdW5kKE1vZGFsLnByb3RvdHlwZSwge1xuICAgICAgICAgICAgb3BlbihvbGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNQbHVnaW5WaWV3ZXIodGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5sYXN0U2VhcmNoW1wiY29tbXVuaXR5LXBsdWdpbnNcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGV0YWNoIHRoZSBvbGQgc2VhcmNoIGFyZWEsIGluIGNhc2UgdGhlIGVtcHR5IHNlYXJjaCBpcyBzdGlsbCBydW5uaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Jlc3VsdHMgPSB0aGlzLnNlYXJjaFJlc3VsdEVsLmNsb25lTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaENvbnRhaW5lckVsLnJlcGxhY2VDaGlsZChuZXdSZXN1bHRzLCB0aGlzLnNlYXJjaFJlc3VsdEVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hSZXN1bHRFbCA9IG5ld1Jlc3VsdHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIGFuIHVwZGF0ZTsgdXNlIGFuIGV2ZW50IHNvIHRoYXQgdGhlIFwieFwiIGFwcGVhcnMgb24gc2VhcmNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoRWwudmFsdWUgPSBwbHVnaW4ubGFzdFNlYXJjaFtcImNvbW11bml0eS1wbHVnaW5zXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaEVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hFbC5zZWxlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLmN1cnJlbnRWaWV3ZXIgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJvdW5kKHRoaXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTZWFyY2g6IHNlcmlhbGl6ZSwgIC8vIHByZXZlbnQgcmFjZSBjb25kaXRpb25zXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZShvbGQpIHsgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLmN1cnJlbnRWaWV3ZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2xkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1BsdWdpbihvbGQpIHsgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uKG1hbmlmZXN0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2xkLmNhbGwodGhpcywgbWFuaWZlc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGx1Z2luLmFwcC5wbHVnaW5zLnBsdWdpbnNbbWFuaWZlc3QuaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBidXR0b25zID0gdGhpcy5wbHVnaW5Db250ZW50RWwuZmluZChcImJ1dHRvblwiKS5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5QnRuID0gYnV0dG9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7cHJlcGVuZDogdHJ1ZSwgdGV4dDogXCJIb3RrZXlzXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNmZ0J0biA9IGJ1dHRvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwge3ByZXBlbmQ6IHRydWUsIHRleHQ6IFwiT3B0aW9uc1wifSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uaG90a2V5QnV0dG9uc1ttYW5pZmVzdC5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG9vbHRpcCh0aXApIHtrZXlCdG4udGl0bGUgPSB0aXB9LCBleHRyYVNldHRpbmdzRWw6IGtleUJ0blxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLmNvbmZpZ0J1dHRvbnNbbWFuaWZlc3QuaWRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRvb2x0aXAoKSB7fSwgZXh0cmFTZXR0aW5nc0VsOiBjZmdCdG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5yZWZyZXNoQnV0dG9ucyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7IHBsdWdpbi5zaG93SG90a2V5c0ZvcihtYW5pZmVzdC5pZCtcIjpcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNmZ0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7IHBsdWdpbi5zaG93Q29uZmlnRm9yKG1hbmlmZXN0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9sZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBnZXRTZXR0aW5nc1RhYihpZCkgeyByZXR1cm4gdGhpcy5hcHAuc2V0dGluZy5zZXR0aW5nVGFicy5maWx0ZXIodCA9PiB0LmlkID09PSBpZCkuc2hpZnQoKTsgfVxuXG4gICAgYWRkUGx1Z2luU2V0dGluZ0V2ZW50cyh0YWJJZCwgb2xkKSB7XG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuYXBwO1xuICAgICAgICBsZXQgaW5fZXZlbnQgPSBmYWxzZTtcblxuICAgICAgICBmdW5jdGlvbiB0cmlnZ2VyKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGluX2V2ZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRyeSB7IGFwcC53b3Jrc3BhY2UudHJpZ2dlciguLi5hcmdzKTsgfSBjYXRjaChlKSB7IGNvbnNvbGUuZXJyb3IoZSk7IH1cbiAgICAgICAgICAgIGluX2V2ZW50ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXcmFwcGVyIHRvIGFkZCBwbHVnaW4tc2V0dGluZ3MgZXZlbnRzXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBkaXNwbGF5KC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChpbl9ldmVudCkgcmV0dXJuO1xuICAgICAgICAgICAgdHJpZ2dlcihcInBsdWdpbi1zZXR0aW5nczpiZWZvcmUtZGlzcGxheVwiLCB0aGlzLCB0YWJJZCk7XG5cbiAgICAgICAgICAgIC8vIFRyYWNrIHdoaWNoIHBsdWdpbiBlYWNoIHNldHRpbmcgaXMgZm9yXG4gICAgICAgICAgICBsZXQgbWFuaWZlc3RzO1xuICAgICAgICAgICAgaWYgKHRhYklkID09PSBcInBsdWdpbnNcIikge1xuICAgICAgICAgICAgICAgIG1hbmlmZXN0cyA9IE9iamVjdC5lbnRyaWVzKGFwcC5pbnRlcm5hbFBsdWdpbnMucGx1Z2lucykubWFwKFxuICAgICAgICAgICAgICAgICAgICAoW2lkLCB7aW5zdGFuY2U6IHtuYW1lfSwgX2xvYWRlZDplbmFibGVkfV0pID0+IHtyZXR1cm4ge2lkLCBuYW1lLCBlbmFibGVkfTt9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWFuaWZlc3RzID0gT2JqZWN0LnZhbHVlcyhhcHAucGx1Z2lucy5tYW5pZmVzdHMpO1xuICAgICAgICAgICAgICAgIG1hbmlmZXN0cy5zb3J0KChlLCB0KSA9PiBlLm5hbWUubG9jYWxlQ29tcGFyZSh0Lm5hbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB3aGljaCA9IDA7XG5cbiAgICAgICAgICAgIC8vIFRyYXAgdGhlIGFkZGl0aW9uIG9mIHRoZSBcInVuaW5zdGFsbFwiIGJ1dHRvbnMgbmV4dCB0byBlYWNoIHBsdWdpblxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlID0gYXJvdW5kKFNldHRpbmcucHJvdG90eXBlLCB7XG4gICAgICAgICAgICAgICAgYWRkVG9nZ2xlKG9sZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYklkID09PSBcInBsdWdpbnNcIiAmJiAhaW5fZXZlbnQgJiYgKG1hbmlmZXN0c1t3aGljaF18fHt9KS5uYW1lID09PSB0aGlzLm5hbWVFbC50ZXh0Q29udGVudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYW5pZmVzdCA9IG1hbmlmZXN0c1t3aGljaCsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyKFwicGx1Z2luLXNldHRpbmdzOnBsdWdpbi1jb250cm9sXCIsIHRoaXMsIG1hbmlmZXN0LCBtYW5pZmVzdC5lbmFibGVkLCB0YWJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2xkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhZGRFeHRyYUJ1dHRvbihvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBvbmx5IFwiZXh0cmFzXCIgYWRkZWQgdG8gc2V0dGluZ3Mgdy9hIGRlc2NyaXB0aW9uIGFyZSBvbiB0aGUgcGx1Z2lucywgY3VycmVudGx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc28gb25seSB0cnkgdG8gbWF0Y2ggdGhvc2UgdG8gcGx1Z2luIG5hbWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFiSWQgIT09IFwicGx1Z2luc1wiICYmIHRoaXMuZGVzY0VsLmNoaWxkRWxlbWVudENvdW50ICYmICFpbl9ldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggKG1hbmlmZXN0c1t3aGljaF18fHt9KS5uYW1lID09PSB0aGlzLm5hbWVFbC50ZXh0Q29udGVudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFuaWZlc3QgPSBtYW5pZmVzdHNbd2hpY2grK10sIGVuYWJsZWQgPSAhIWFwcC5wbHVnaW5zLnBsdWdpbnNbbWFuaWZlc3QuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyKFwicGx1Z2luLXNldHRpbmdzOnBsdWdpbi1jb250cm9sXCIsIHRoaXMsIG1hbmlmZXN0LCBlbmFibGVkLCB0YWJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvbGQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2xkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICByZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKFwicGx1Z2luLXNldHRpbmdzOmFmdGVyLWRpc3BsYXlcIiwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnb3RvUGx1Z2luKGlkLCBzaG93PVwiaW5mb1wiKSB7XG4gICAgICAgIGlmIChpZCAmJiBzaG93ID09PSBcImhvdGtleXNcIikgcmV0dXJuIHRoaXMuc2hvd0hvdGtleXNGb3IoaWQrXCI6XCIpO1xuICAgICAgICBpZiAoaWQgJiYgc2hvdyA9PT0gXCJjb25maWdcIikgIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG93Q29uZmlnRm9yKGlkKSkgdGhpcy5hcHAuc2V0dGluZy5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93U2V0dGluZ3MoXCJjb21tdW5pdHktcGx1Z2luc1wiKTtcbiAgICAgICAgY29uc3QgcmVtb3ZlID0gYXJvdW5kKE1vZGFsLnByb3RvdHlwZSwge1xuICAgICAgICAgICAgb3BlbihvbGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkKSB0aGlzLmF1dG9sb2FkID0gaWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbGQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmFwcC5zZXR0aW5nLmFjdGl2ZVRhYi5jb250YWluZXJFbC5maW5kKFwiLm1vZC1jdGFcIikuY2xpY2soKTtcbiAgICAgICAgLy8gWFhYIGhhbmRsZSBuYXYgdG8gbm90LWNhdGFsb2dlZCBwbHVnaW5cbiAgICB9XG5cbiAgICBzaG93U2V0dGluZ3MoaWQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50Vmlld2VyPy5jbG9zZSgpOyAgLy8gY2xvc2UgdGhlIHBsdWdpbiBicm93c2VyIGlmIG9wZW5cbiAgICAgICAgc2V0dGluZ3NBcmVPcGVuKHRoaXMuYXBwKSB8fCB0aGlzLmFwcC5zZXR0aW5nLm9wZW4oKTtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICB0aGlzLmFwcC5zZXR0aW5nLm9wZW5UYWJCeUlkKGlkKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcC5zZXR0aW5nLmFjdGl2ZVRhYj8uaWQgPT09IGlkID8gdGhpcy5hcHAuc2V0dGluZy5hY3RpdmVUYWIgOiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd0hvdGtleXNGb3Ioc2VhcmNoKSB7XG4gICAgICAgIGNvbnN0IHRhYiA9IHRoaXMuc2hvd1NldHRpbmdzKFwiaG90a2V5c1wiKTtcbiAgICAgICAgaWYgKHRhYiAmJiB0YWIuc2VhcmNoSW5wdXRFbCAmJiB0YWIudXBkYXRlSG90a2V5VmlzaWJpbGl0eSkge1xuICAgICAgICAgICAgdGFiLnNlYXJjaElucHV0RWwudmFsdWUgPSBzZWFyY2g7XG4gICAgICAgICAgICB0YWIudXBkYXRlSG90a2V5VmlzaWJpbGl0eSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd0NvbmZpZ0ZvcihpZCkge1xuICAgICAgICBpZiAodGhpcy5zaG93U2V0dGluZ3MoaWQpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICAgIGBObyBzZXR0aW5ncyB0YWIgZm9yIFwiJHtpZH1cIjogaXQgbWF5IG5vdCBiZSBpbnN0YWxsZWQgb3IgbWlnaHQgbm90IGhhdmUgc2V0dGluZ3MuYFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcGx1Z2luRW5hYmxlZChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHAuaW50ZXJuYWxQbHVnaW5zLnBsdWdpbnNbaWRdPy5fbG9hZGVkIHx8IHRoaXMuYXBwLnBsdWdpbnMucGx1Z2luc1tpZF07XG4gICAgfVxuXG4gICAgcmVmcmVzaEJ1dHRvbnMoZm9yY2U9ZmFsc2UpIHtcbiAgICAgICAgLy8gRG9uJ3QgcmVmcmVzaCB3aGVuIG5vdCBkaXNwbGF5aW5nLCB1bmxlc3MgcmVuZGVyaW5nIGlzIGluIHByb2dyZXNzXG4gICAgICAgIGlmICghcGx1Z2luU2V0dGluZ3NBcmVPcGVuKHRoaXMuYXBwKSAmJiAhZm9yY2UpIHJldHVybjtcblxuICAgICAgICBjb25zdCBoa20gPSB0aGlzLmFwcC5ob3RrZXlNYW5hZ2VyO1xuICAgICAgICBjb25zdCBhc3NpZ25lZEtleUNvdW50ID0ge307XG5cbiAgICAgICAgLy8gR2V0IGEgbGlzdCBvZiBjb21tYW5kcyBieSBwbHVnaW5cbiAgICAgICAgY29uc3QgY29tbWFuZHMgPSBPYmplY3QudmFsdWVzKHRoaXMuYXBwLmNvbW1hbmRzLmNvbW1hbmRzKS5yZWR1Y2UoKGNtZHMsIGNtZCk9PntcbiAgICAgICAgICAgIGNvbnN0IHBpZCA9IGNtZC5pZC5zcGxpdChcIjpcIiwyKS5zaGlmdCgpO1xuICAgICAgICAgICAgY29uc3QgaG90a2V5cyA9IChoa20uZ2V0SG90a2V5cyhjbWQuaWQpIHx8IGhrbS5nZXREZWZhdWx0SG90a2V5cyhjbWQuaWQpIHx8IFtdKS5tYXAoaG90a2V5VG9TdHJpbmcpO1xuICAgICAgICAgICAgaG90a2V5cy5mb3JFYWNoKGsgPT4gYXNzaWduZWRLZXlDb3VudFtrXSA9IDEgKyAoYXNzaWduZWRLZXlDb3VudFtrXXx8MCkpO1xuICAgICAgICAgICAgKGNtZHNbcGlkXSB8fCAoY21kc1twaWRdPVtdKSkucHVzaCh7aG90a2V5cywgY21kfSk7XG4gICAgICAgICAgICByZXR1cm4gY21kcztcbiAgICAgICAgfSwge30pO1xuXG4gICAgICAgIC8vIFBsdWdpbiBzZXR0aW5nIHRhYnMgYnkgcGx1Z2luXG4gICAgICAgIGNvbnN0IHRhYnMgPSBPYmplY3QudmFsdWVzKHRoaXMuYXBwLnNldHRpbmcucGx1Z2luVGFicykucmVkdWNlKCh0YWJzLCB0YWIpPT4ge1xuICAgICAgICAgICAgdGFic1t0YWIuaWRdID0gdGFiOyByZXR1cm4gdGFic1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIHRhYnNbXCJ3b3Jrc3BhY2VcIl0gPSB0YWJzW1wiZWRpdG9yXCJdID0gdHJ1ZTtcblxuICAgICAgICBmb3IoY29uc3QgaWQgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWdCdXR0b25zIHx8IHt9KSkge1xuICAgICAgICAgICAgY29uc3QgYnRuID0gdGhpcy5jb25maWdCdXR0b25zW2lkXTtcbiAgICAgICAgICAgIGlmICghdGFic1tpZF0pIHtcbiAgICAgICAgICAgICAgICBidG4uZXh0cmFTZXR0aW5nc0VsLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ0bi5leHRyYVNldHRpbmdzRWwuc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGNvbnN0IGlkIG9mIE9iamVjdC5rZXlzKHRoaXMuaG90a2V5QnV0dG9ucyB8fCB7fSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IHRoaXMuaG90a2V5QnV0dG9uc1tpZF07XG4gICAgICAgICAgICBpZiAoIWNvbW1hbmRzW2lkXSkge1xuICAgICAgICAgICAgICAgIC8vIFBsdWdpbiBpcyBkaXNhYmxlZCBvciBoYXMgbm8gY29tbWFuZHNcbiAgICAgICAgICAgICAgICBidG4uZXh0cmFTZXR0aW5nc0VsLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGFzc2lnbmVkID0gY29tbWFuZHNbaWRdLmZpbHRlcihpbmZvID0+IGluZm8uaG90a2V5cy5sZW5ndGgpO1xuICAgICAgICAgICAgY29uc3QgY29uZmxpY3RzID0gYXNzaWduZWQuZmlsdGVyKGluZm8gPT4gaW5mby5ob3RrZXlzLmZpbHRlcihrID0+IGFzc2lnbmVkS2V5Q291bnRba10+MSkubGVuZ3RoKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIGJ0bi5zZXRUb29sdGlwKFxuICAgICAgICAgICAgICAgIGBDb25maWd1cmUgaG90a2V5cyR7XCJcXG5cIn0oJHthc3NpZ25lZC5sZW5ndGh9LyR7Y29tbWFuZHNbaWRdLmxlbmd0aH0gYXNzaWduZWQke1xuICAgICAgICAgICAgICAgICAgICBjb25mbGljdHMgPyBcIjsgXCIrY29uZmxpY3RzK1wiIGNvbmZsaWN0aW5nXCIgOiBcIlwiXG4gICAgICAgICAgICAgICAgfSlgXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnRuLmV4dHJhU2V0dGluZ3NFbC50b2dnbGVDbGFzcyhcIm1vZC1lcnJvclwiLCAhIWNvbmZsaWN0cyk7XG4gICAgICAgICAgICBidG4uZXh0cmFTZXR0aW5nc0VsLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJLZXltYXAiLCJNb2RhbCIsIlBsdWdpbiIsIlNldHRpbmciLCJkZWJvdW5jZSIsIlBsYXRmb3JtIl0sIm1hcHBpbmdzIjoiOzs7O0FBQU8sU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRTtBQUN2QyxJQUFJLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFGLElBQUksT0FBTyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzdGLENBQUM7QUFDRCxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRTtBQUM3QyxJQUFJLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0RSxJQUFJLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQztBQUNBO0FBQ0EsSUFBSSxJQUFJLFFBQVE7QUFDaEIsUUFBUSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNqRCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUMxQjtBQUNBLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsSUFBSSxTQUFTLE9BQU8sQ0FBQyxHQUFHLElBQUksRUFBRTtBQUM5QjtBQUNBLFFBQVEsSUFBSSxPQUFPLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxPQUFPO0FBQzNELFlBQVksTUFBTSxFQUFFLENBQUM7QUFDckIsUUFBUSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pDLEtBQUs7QUFDTCxJQUFJLFNBQVMsTUFBTSxHQUFHO0FBQ3RCO0FBQ0EsUUFBUSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxPQUFPLEVBQUU7QUFDckMsWUFBWSxJQUFJLE1BQU07QUFDdEIsZ0JBQWdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUM7QUFDdkM7QUFDQSxnQkFBZ0IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkMsU0FBUztBQUNULFFBQVEsSUFBSSxPQUFPLEtBQUssUUFBUTtBQUNoQyxZQUFZLE9BQU87QUFDbkI7QUFDQSxRQUFRLE9BQU8sR0FBRyxRQUFRLENBQUM7QUFDM0IsUUFBUSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLElBQUksUUFBUSxDQUFDLENBQUM7QUFDN0QsS0FBSztBQUNMLENBQUM7QUFDTSxTQUFTLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFO0FBQ25DLElBQUksT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBQ00sU0FBUyxTQUFTLENBQUMsYUFBYSxFQUFFO0FBQ3pDLElBQUksSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BDLElBQUksU0FBUyxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDOUIsUUFBUSxPQUFPLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUs7QUFDbkQsWUFBWSxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU07QUFDakMsZ0JBQWdCLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDL0QsYUFBYSxDQUFDLENBQUM7QUFDZixTQUFTLENBQUMsQ0FBQztBQUNYLEtBQUs7QUFDTCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEdBQUcsWUFBWTtBQUNoQyxRQUFRLE9BQU8sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0UsS0FBSyxDQUFDO0FBQ04sSUFBSSxPQUFPLE9BQU8sQ0FBQztBQUNuQjs7QUNqREEsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQ2hDLElBQUksT0FBT0EsZUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUU7QUFDbkYsQ0FBQztBQUNEO0FBQ0EsU0FBUyxXQUFXLENBQUMsRUFBRSxFQUFFO0FBQ3pCLElBQUksT0FBTyxFQUFFLEtBQUssU0FBUyxJQUFJLEVBQUUsS0FBSyxtQkFBbUIsQ0FBQztBQUMxRCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLHFCQUFxQixDQUFDLEdBQUcsRUFBRTtBQUNwQyxJQUFJLE9BQU8sZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7QUFDekUsQ0FBQztBQUNEO0FBQ0EsU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFO0FBQzlCLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLEtBQUssSUFBSTtBQUN6RCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLGNBQWMsQ0FBQyxFQUFFLEVBQUU7QUFDNUIsSUFBSTtBQUNKLFFBQVEsRUFBRSxZQUFZQyxjQUFLO0FBQzNCLFFBQVEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7QUFDckMsUUFBUSxPQUFPLEVBQUUsQ0FBQyxVQUFVLEtBQUssVUFBVTtBQUMzQyxRQUFRLE9BQU8sRUFBRSxDQUFDLFlBQVksS0FBSyxVQUFVO0FBQzdDLFFBQVEsT0FBTyxFQUFFLENBQUMsUUFBUSxJQUFJLFFBQVE7QUFDdEMsTUFBTTtBQUNOLENBQUM7QUFDRDtBQUNBLFNBQVMsU0FBUyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ2pFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7QUFDN0MsSUFBSSxPQUFPLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBQ0Q7QUFDZSxNQUFNLFlBQVksU0FBU0MsZUFBTSxDQUFDO0FBQ2pEO0FBQ0EsSUFBSSxNQUFNLEdBQUc7QUFDYixRQUFRLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDNUQsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUM3QjtBQUNBLFFBQVEsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSztBQUNuRyxZQUFZLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3BDLFlBQVksSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDcEMsWUFBWSxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUN0QyxZQUFZLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLFlBQVksTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDQyxnQkFBTyxDQUFDLFNBQVMsRUFBRTtBQUNyRCxnQkFBZ0IsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sU0FBUyxDQUFDLEVBQUU7QUFDcEQsb0JBQW9CLE1BQU0sRUFBRSxDQUFDO0FBQzdCLG9CQUFvQixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSTtBQUMvQyx3QkFBd0IsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkQscUJBQXFCLENBQUM7QUFDdEIsaUJBQWlCLENBQUM7QUFDbEIsYUFBYSxDQUFDLENBQUM7QUFDZixZQUFZLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxTQUFTLENBQUMsRUFBRSxDQUFDO0FBQ2IsUUFBUSxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsK0JBQStCLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUM5RztBQUNBLFFBQVEsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFLO0FBQ2xILFlBQVksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0UsWUFBWSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNoRSxTQUFTLENBQUMsRUFBRSxDQUFDO0FBQ2I7QUFDQTtBQUNBLFFBQVEsTUFBTSxjQUFjLEdBQUdDLGlCQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xGLFFBQVEsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hILFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUUsYUFBYSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxZQUFZLEdBQUcsU0FBUyxFQUFFLGVBQWUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckcsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckc7QUFDQSxRQUFRLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMzRCxRQUFRLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSztBQUM1RSxZQUFZLFNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFFLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMO0FBQ0EsSUFBSSxTQUFTLEdBQUc7QUFDaEIsUUFBUSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDNUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtBQUMxQyxZQUFZLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLFNBQVMsR0FBRyxJQUFJLEVBQUU7QUFDbkQsZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3RDLGdCQUFnQixJQUFJLENBQUNDLGlCQUFRLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0YsYUFBYSxDQUFDO0FBQ2QsWUFBWSxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxTQUFTLEdBQUcsSUFBSSxFQUFFO0FBQ3BELGdCQUFnQixNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO0FBQ3RELGdCQUFnQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdDLGFBQWEsQ0FBQztBQUNkLFNBQVMsQ0FBQyxFQUFDO0FBQ1g7QUFDQSxRQUFRLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0QsUUFBUSxNQUFNLFNBQVMsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDckU7QUFDQTtBQUNBLFFBQVEsSUFBSSxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvSCxRQUFRLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0g7QUFDQSxRQUFRLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRO0FBQ3RDO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLGdCQUFnQixTQUFTLENBQUMsV0FBVyxFQUFFLE9BQU87QUFDOUMsZ0JBQWdCLDJEQUEyRDtBQUMzRSxnQkFBZ0IsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQzFDLGdCQUFnQixJQUFJO0FBQ3BCLGFBQWE7QUFDYixTQUFTLENBQUM7QUFDVjtBQUNBO0FBQ0EsUUFBUSxTQUFTLGdCQUFnQixHQUFHO0FBQ3BDLFlBQVksSUFBSSxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM5RixTQUFTO0FBQ1QsUUFBUSxnQkFBZ0IsRUFBRSxDQUFDO0FBQzNCO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQzVEO0FBQ0E7QUFDQSxRQUFRLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUQsUUFBUSxJQUFJLFVBQVUsRUFBRTtBQUN4QixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUM3QyxnQkFBZ0IsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25HLGdCQUFnQixzQkFBc0IsQ0FBQyxHQUFHLEVBQUU7QUFDNUMsb0JBQW9CLE9BQU8sV0FBVztBQUN0Qyx3QkFBd0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsV0FBVyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQ3hHLHdCQUF3QixJQUFJO0FBQzVCLDRCQUE0QixJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3JGO0FBQ0E7QUFDQSxnQ0FBZ0MsSUFBSSxPQUFPLEdBQUcsV0FBVyxDQUFDO0FBQzFELGdDQUFnQyxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNO0FBQzlHLG9DQUFvQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2pGLGlDQUFpQyxDQUFDLENBQUM7QUFDbkMsZ0NBQWdDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUM5RCxnQ0FBZ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxFQUFFO0FBQ3pGO0FBQ0E7QUFDQSxvQ0FBb0MsSUFBSSxFQUFFLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLEdBQUcsUUFBUSxDQUFDLEVBQUU7QUFDeEcsaUNBQWlDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLDZCQUE2QjtBQUM3Qiw0QkFBNEIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xELHlCQUF5QixTQUFTO0FBQ2xDLDRCQUE0QixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDakUsNEJBQTRCLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztBQUNoRSx5QkFBeUI7QUFDekIscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQixhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ3hCLFlBQVksRUFBRSxFQUFFLGNBQWM7QUFDOUIsWUFBWSxJQUFJLEVBQUUscUNBQXFDO0FBQ3ZELFlBQVksUUFBUSxFQUFFLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLElBQUk7QUFDMUUsU0FBUyxDQUFDLENBQUM7QUFDWCxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDeEIsWUFBWSxFQUFFLEVBQUUsZ0JBQWdCO0FBQ2hDLFlBQVksSUFBSSxFQUFFLGdEQUFnRDtBQUNsRSxZQUFZLFFBQVEsRUFBRSxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDN0MsU0FBUyxFQUFDO0FBQ1YsS0FBSztBQUNMO0FBQ0EsSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUNuRCxRQUFRLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJO0FBQ3RDLFlBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoQyxZQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0YsWUFBWSxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLFlBQVksR0FBRyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFDO0FBQy9DLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ2xELFNBQVMsQ0FBQyxDQUFDO0FBQ1gsUUFBUSxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSTtBQUN0QyxZQUFZLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkMsWUFBWSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDO0FBQ25FLFlBQVksR0FBRyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFDO0FBQy9DLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ2xELFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0FBQ2pDLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDakM7QUFDQTtBQUNBLFFBQVEsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUNwRCxRQUFRLElBQUksUUFBUSxDQUFDO0FBQ3JCLFFBQVEsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDckQ7QUFDQSxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25FLFNBQVMsTUFBTTtBQUNmLFlBQVksTUFBTSxHQUFHLEdBQUcsSUFBSUYsZ0JBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJO0FBQ2hFLGdCQUFnQixRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLGdCQUFnQixDQUFDLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzlFLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsWUFBWSxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELFlBQVksV0FBVyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDMUYsWUFBWSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25DLFNBQVM7QUFDVCxRQUFRLElBQUksS0FBSyxLQUFLLG1CQUFtQixFQUFFO0FBQzNDLFlBQVksUUFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJO0FBQzVELGdCQUFnQixJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLENBQUNILGVBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDakUsb0JBQW9CLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUN0QyxvQkFBb0IsT0FBTyxLQUFLLENBQUM7QUFDakMsaUJBQWlCO0FBQ2pCLGFBQWEsRUFBQztBQUNkLFNBQVM7QUFDVCxRQUFRLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQztBQUM1QixRQUFRLFNBQVMsYUFBYSxDQUFDLElBQUksQ0FBQztBQUNwQyxZQUFZLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7QUFDekUsWUFBWSxTQUFTLGlCQUFpQixDQUFDLEVBQUUsRUFBRTtBQUMzQyxnQkFBZ0IsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDO0FBQzdELGdCQUFnQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9ELGdCQUFnQixJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDMUMsZ0JBQWdCLEVBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkQsZ0JBQWdCLEVBQUUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BHLGdCQUFnQixFQUFFLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQztBQUNsRixnQkFBZ0IsT0FBTyxJQUFJLENBQUM7QUFDNUIsYUFBYTtBQUNiLFlBQVksV0FBVyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJO0FBQzlELGdCQUFnQixNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztBQUNwRixnQkFBZ0IsTUFBTSxXQUFXLEdBQUcsaUJBQWlCO0FBQ3JELG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxDQUFDO0FBQ3hFLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO0FBQ3ZELGlCQUFpQixDQUFDO0FBQ2xCLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsQ0FBQztBQUNyRCxhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVCxRQUFRLFlBQVksQ0FBQyxNQUFNO0FBQzNCLFlBQVksSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNO0FBQ2pDLFlBQVksSUFBSSxRQUFRLElBQUksT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsRUFBRTtBQUMxRSxnQkFBZ0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDNUQsZ0JBQWdCLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNyQyxhQUFhO0FBQ2IsWUFBWSxJQUFJLENBQUNLLGlCQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDOUQsU0FBUyxDQUFDLENBQUM7QUFDWCxRQUFRLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEM7QUFDQSxRQUFRLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUNqQyxZQUFZLE1BQU0sVUFBVSxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxJQUFJLFFBQVEsQ0FBQztBQUNsRixZQUFZLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxNQUFNLGVBQWUsQ0FBQztBQUN6RixZQUFZLElBQUksQ0FBQyxrQkFBa0I7QUFDbkMsZ0JBQWdCLElBQUlGLGdCQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUNwRCxxQkFBcUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxREFBcUQsQ0FBQztBQUNsRyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxJQUFJO0FBQzlDLGFBQWEsQ0FBQztBQUNkLFlBQVksSUFBSSxDQUFDLGtCQUFrQjtBQUNuQyxnQkFBZ0IsSUFBSUEsZ0JBQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO0FBQ3BELHFCQUFxQixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLHdDQUF3QyxDQUFDO0FBQzFGLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxFQUFFLElBQUk7QUFDdEQsYUFBYSxDQUFDO0FBQ2QsWUFBWSxJQUFJLENBQUMsa0JBQWtCO0FBQ25DLGdCQUFnQixJQUFJQSxnQkFBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFDcEQscUJBQXFCLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMseURBQXlELENBQUM7QUFDOUcsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLEVBQUUsSUFBSTtBQUM1RCxhQUFhLENBQUM7QUFDZCxZQUFZLFNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLGFBQWEsR0FBRztBQUNwQixRQUFRLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQztBQUM1QixRQUFRLFlBQVksQ0FBQyxNQUFNLENBQUNGLGNBQUssQ0FBQyxTQUFTLEVBQUU7QUFDN0MsWUFBWSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ3RCLGdCQUFnQixPQUFPLFNBQVMsR0FBRyxJQUFJLEVBQUU7QUFDekMsb0JBQW9CLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlDLHdCQUF3QixZQUFZLENBQUMsTUFBTTtBQUMzQyw0QkFBNEIsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLEVBQUU7QUFDeEU7QUFDQSxnQ0FBZ0MsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNuRixnQ0FBZ0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JHLGdDQUFnQyxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztBQUNqRTtBQUNBLGdDQUFnQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDN0YsZ0NBQWdDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEYsNkJBQTZCO0FBQzdCLDRCQUE0QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25ELHlCQUF5QixDQUFDLENBQUM7QUFDM0Isd0JBQXdCLE1BQU0sQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQ3BELHdCQUF3QixNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3JDLDRCQUE0QixZQUFZLEVBQUUsU0FBUztBQUNuRDtBQUNBLDRCQUE0QixLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxTQUFTLEdBQUcsSUFBSSxFQUFFO0FBQ2xFLGdDQUFnQyxNQUFNLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUM1RCxnQ0FBZ0MsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM3RCw2QkFBNkIsQ0FBQztBQUM5QjtBQUNBLDRCQUE0QixVQUFVLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxlQUFlLFFBQVEsQ0FBQztBQUM3RSxnQ0FBZ0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzRSxnQ0FBZ0MsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzdFLG9DQUFvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFDdEcsb0NBQW9DLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNoSCxvQ0FBb0MsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ2hILG9DQUFvQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUN4RSx3Q0FBd0MsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBRyxDQUFDLEVBQUUsZUFBZSxFQUFFLE1BQU07QUFDckcsc0NBQXFDO0FBQ3JDLG9DQUFvQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUN4RSx3Q0FBd0MsVUFBVSxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsTUFBTTtBQUNoRixzQ0FBcUM7QUFDckMsb0NBQW9DLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEUsb0NBQW9DLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEdBQUcsTUFBTTtBQUM1RSx3Q0FBd0MsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdGLHFDQUFxQyxDQUFDLENBQUM7QUFDdkMsb0NBQW9DLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEdBQUcsTUFBTTtBQUM1RSx3Q0FBd0MsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEYscUNBQXFDLENBQUMsQ0FBQztBQUN2QyxpQ0FBaUM7QUFDakMsZ0NBQWdDLE9BQU8sR0FBRyxDQUFDO0FBQzNDLDZCQUE2QixDQUFDO0FBQzlCLHlCQUF5QixFQUFDO0FBQzFCLHFCQUFxQjtBQUNyQixvQkFBb0IsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqRCxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDWixLQUFLO0FBQ0w7QUFDQSxJQUFJLGNBQWMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRTtBQUNoRztBQUNBLElBQUksc0JBQXNCLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtBQUN2QyxRQUFRLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDN0IsUUFBUSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDN0I7QUFDQSxRQUFRLFNBQVMsT0FBTyxDQUFDLEdBQUcsSUFBSSxFQUFFO0FBQ2xDLFlBQVksUUFBUSxHQUFHLElBQUksQ0FBQztBQUM1QixZQUFZLElBQUksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNsRixZQUFZLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDN0IsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLE9BQU8sU0FBUyxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDekMsWUFBWSxJQUFJLFFBQVEsRUFBRSxPQUFPO0FBQ2pDLFlBQVksT0FBTyxDQUFDLGdDQUFnQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuRTtBQUNBO0FBQ0EsWUFBWSxJQUFJLFNBQVMsQ0FBQztBQUMxQixZQUFZLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUNyQyxnQkFBZ0IsU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHO0FBQzNFLG9CQUFvQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ2hHLGlCQUFpQixDQUFDO0FBQ2xCLGFBQWEsTUFBTTtBQUNuQixnQkFBZ0IsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRSxnQkFBZ0IsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDdkUsYUFBYTtBQUNiLFlBQVksSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQzFCO0FBQ0E7QUFDQSxZQUFZLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQ0UsZ0JBQU8sQ0FBQyxTQUFTLEVBQUU7QUFDckQsZ0JBQWdCLFNBQVMsQ0FBQyxHQUFHLEVBQUU7QUFDL0Isb0JBQW9CLE9BQU8sU0FBUyxHQUFHLElBQUksRUFBRTtBQUM3Qyx3QkFBd0IsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUc7QUFDMUgsNEJBQTRCLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFLDRCQUE0QixPQUFPLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9HLHlCQUF5QjtBQUN6Qix3QkFBd0IsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGdCQUFnQixjQUFjLENBQUMsR0FBRyxFQUFFO0FBQ3BDLG9CQUFvQixPQUFPLFNBQVMsR0FBRyxJQUFJLEVBQUU7QUFDN0M7QUFDQTtBQUNBLHdCQUF3QixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUMvRiw0QkFBNEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHO0FBQzNGLGdDQUFnQyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNsSCxnQ0FBZ0MsT0FBTyxDQUFDLGdDQUFnQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFHLDZCQUE2QjtBQUM3Qix5QkFDQSx3QkFBd0IsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGFBQWEsQ0FBQyxDQUFDO0FBQ2Y7QUFDQSxZQUFZLElBQUk7QUFDaEIsZ0JBQWdCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsYUFBYSxTQUFTO0FBQ3RCLGdCQUFnQixNQUFNLEVBQUUsQ0FBQztBQUN6QixnQkFBZ0IsT0FBTyxDQUFDLCtCQUErQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9ELGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxVQUFVLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDaEMsUUFBUSxJQUFJLEVBQUUsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekUsUUFBUSxJQUFJLEVBQUUsSUFBSSxJQUFJLEtBQUssUUFBUSxHQUFHO0FBQ3RDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQy9DLFFBQVEsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDRixjQUFLLENBQUMsU0FBUyxFQUFFO0FBQy9DLFlBQVksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUN0QixnQkFBZ0IsT0FBTyxTQUFTLEdBQUcsSUFBSSxFQUFFO0FBQ3pDLG9CQUFvQixNQUFNLEVBQUUsQ0FBQztBQUM3QixvQkFBb0IsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDL0Msb0JBQW9CLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakQsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTLEVBQUM7QUFDVixRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hFO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxZQUFZLENBQUMsRUFBRSxFQUFFO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNwQyxRQUFRLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDN0QsUUFBUSxJQUFJLEVBQUUsRUFBRTtBQUNoQixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3QyxZQUFZLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUs7QUFDN0YsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRTtBQUMzQixRQUFRLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsUUFBUSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxJQUFJLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRTtBQUNwRSxZQUFZLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztBQUM3QyxZQUFZLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0FBQ3pDLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDL0MsUUFBUSxJQUFJLE1BQU07QUFDbEIsWUFBWSxDQUFDLHFCQUFxQixFQUFFLEVBQUUsQ0FBQyxzREFBc0QsQ0FBQztBQUM5RixTQUFTLENBQUM7QUFDVixRQUFRLE9BQU8sS0FBSyxDQUFDO0FBQ3JCLEtBQUs7QUFDTDtBQUNBLElBQUksYUFBYSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0YsS0FBSztBQUNMO0FBQ0EsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtBQUNoQztBQUNBLFFBQVEsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPO0FBQy9EO0FBQ0EsUUFBUSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztBQUMzQyxRQUFRLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQ3BDO0FBQ0E7QUFDQSxRQUFRLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRztBQUN2RixZQUFZLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNwRCxZQUFZLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2hILFlBQVksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckYsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBWSxPQUFPLElBQUksQ0FBQztBQUN4QixTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDZjtBQUNBO0FBQ0EsUUFBUSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUk7QUFDckYsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sSUFBSTtBQUMzQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDZixRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2xEO0FBQ0EsUUFBUSxJQUFJLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUMvRCxZQUFZLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0MsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzNCLGdCQUFnQixHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzNDLGdCQUFnQixTQUFTO0FBQ3pCLGFBQWE7QUFDYixZQUFZLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkMsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUMvRCxZQUFZLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0MsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQy9CO0FBQ0EsZ0JBQWdCLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDM0MsZ0JBQWdCLFNBQVM7QUFDekIsYUFBYTtBQUNiLFlBQVksTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5RSxZQUFZLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDckg7QUFDQSxZQUFZLEdBQUcsQ0FBQyxVQUFVO0FBQzFCLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTO0FBQzVGLG9CQUFvQixTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQUcsRUFBRTtBQUNsRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQ25CLGFBQWEsQ0FBQztBQUNkLFlBQVksR0FBRyxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0RSxZQUFZLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkMsU0FBUztBQUNULEtBQUs7QUFDTDs7OzsifQ==

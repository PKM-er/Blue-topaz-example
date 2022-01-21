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

        const enhanceViewer = () => this.enhanceViewer();

        if (community)   this.register(
            // Trap opens of the community plugins viewer from the settings panel
            onElement(
                community.containerEl, "click",
                ".mod-cta, .installed-plugins-container .setting-item-info",
                enhanceViewer,
                true
            )
        );

        // Trap opens of the community plugins viewer via URL
        this.register(
            around(app.workspace.protocolHandlers, {
                get(old) {
                    return function get(key) {
                        if (key === "show-plugin") enhanceViewer();
                        return old.call(this, key);
                    }
                }
            })
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
                if (!el) return false;
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
                const authorMatches = matchAndHighlight(
                    e.find(".setting-item-description > div:nth-child(2)")
                );
                e.toggle(nameMatches || descMatches || authorMatches);
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
                                    const removeBtns = [i18next.t("setting.options"), i18next.t("setting.hotkeys.name")];
                                    for (const b of buttons.findAll("button")) {
                                        if (removeBtns.indexOf(b.textContent) !== -1) b.detach();
                                    }
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
                    return function(cb) {
                        // The only "extras" added to settings w/a description are on the plugins, currently,
                        // so only try to match those to plugin names
                        if (tabId !== "plugins" && this.descEl.childElementCount && !in_event) {
                            if ( (manifests[which]||{}).name === this.nameEl.textContent ) {
                                const manifest = manifests[which++], enabled = !!app.plugins.plugins[manifest.id];
                                trigger("plugin-settings:plugin-control", this, manifest, enabled, tabId);
                            }
                        }                        return old.call(this, function(b) {
                            cb(b);
                            // Prevent core from showing buttons that lack hotkey counts/conflicts
                            if (!in_event && b.extraSettingsEl.find("svg.gear, svg.any-key")) b.extraSettingsEl.detach();
                        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLnlhcm4vY2FjaGUvbW9ua2V5LWFyb3VuZC1ucG0tMi4xLjAtNzBkZjMyZDJhYy0xYmQ3MmQyNWY5LnppcC9ub2RlX21vZHVsZXMvbW9ua2V5LWFyb3VuZC9tanMvaW5kZXguanMiLCJzcmMvcGx1Z2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBhcm91bmQob2JqLCBmYWN0b3JpZXMpIHtcbiAgICBjb25zdCByZW1vdmVycyA9IE9iamVjdC5rZXlzKGZhY3RvcmllcykubWFwKGtleSA9PiBhcm91bmQxKG9iaiwga2V5LCBmYWN0b3JpZXNba2V5XSkpO1xuICAgIHJldHVybiByZW1vdmVycy5sZW5ndGggPT09IDEgPyByZW1vdmVyc1swXSA6IGZ1bmN0aW9uICgpIHsgcmVtb3ZlcnMuZm9yRWFjaChyID0+IHIoKSk7IH07XG59XG5mdW5jdGlvbiBhcm91bmQxKG9iaiwgbWV0aG9kLCBjcmVhdGVXcmFwcGVyKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBvYmpbbWV0aG9kXSwgaGFkT3duID0gb2JqLmhhc093blByb3BlcnR5KG1ldGhvZCk7XG4gICAgbGV0IGN1cnJlbnQgPSBjcmVhdGVXcmFwcGVyKG9yaWdpbmFsKTtcbiAgICAvLyBMZXQgb3VyIHdyYXBwZXIgaW5oZXJpdCBzdGF0aWMgcHJvcHMgZnJvbSB0aGUgd3JhcHBpbmcgbWV0aG9kLFxuICAgIC8vIGFuZCB0aGUgd3JhcHBpbmcgbWV0aG9kLCBwcm9wcyBmcm9tIHRoZSBvcmlnaW5hbCBtZXRob2RcbiAgICBpZiAob3JpZ2luYWwpXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihjdXJyZW50LCBvcmlnaW5hbCk7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHdyYXBwZXIsIGN1cnJlbnQpO1xuICAgIG9ialttZXRob2RdID0gd3JhcHBlcjtcbiAgICAvLyBSZXR1cm4gYSBjYWxsYmFjayB0byBhbGxvdyBzYWZlIHJlbW92YWxcbiAgICByZXR1cm4gcmVtb3ZlO1xuICAgIGZ1bmN0aW9uIHdyYXBwZXIoLi4uYXJncykge1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIGJlZW4gZGVhY3RpdmF0ZWQgYW5kIGFyZSBubyBsb25nZXIgd3JhcHBlZCwgcmVtb3ZlIG91cnNlbHZlc1xuICAgICAgICBpZiAoY3VycmVudCA9PT0gb3JpZ2luYWwgJiYgb2JqW21ldGhvZF0gPT09IHdyYXBwZXIpXG4gICAgICAgICAgICByZW1vdmUoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgLy8gSWYgbm8gb3RoZXIgcGF0Y2hlcywganVzdCBkbyBhIGRpcmVjdCByZW1vdmFsXG4gICAgICAgIGlmIChvYmpbbWV0aG9kXSA9PT0gd3JhcHBlcikge1xuICAgICAgICAgICAgaWYgKGhhZE93bilcbiAgICAgICAgICAgICAgICBvYmpbbWV0aG9kXSA9IG9yaWdpbmFsO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmpbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudCA9PT0gb3JpZ2luYWwpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vIEVsc2UgcGFzcyBmdXR1cmUgY2FsbHMgdGhyb3VnaCwgYW5kIHJlbW92ZSB3cmFwcGVyIGZyb20gdGhlIHByb3RvdHlwZSBjaGFpblxuICAgICAgICBjdXJyZW50ID0gb3JpZ2luYWw7XG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih3cmFwcGVyLCBvcmlnaW5hbCB8fCBGdW5jdGlvbik7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyKHByb21pc2UsIGNiKSB7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbihjYiwgY2IpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZShhc3luY0Z1bmN0aW9uKSB7XG4gICAgbGV0IGxhc3RSdW4gPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBmdW5jdGlvbiB3cmFwcGVyKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGxhc3RSdW4gPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICAgICAgICAgIGFmdGVyKGxhc3RSdW4sICgpID0+IHtcbiAgICAgICAgICAgICAgICBhc3luY0Z1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpLnRoZW4ocmVzLCByZWopO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB3cmFwcGVyLmFmdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbGFzdFJ1biA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4geyBhZnRlcihsYXN0UnVuLCByZXMpOyB9KTtcbiAgICB9O1xuICAgIHJldHVybiB3cmFwcGVyO1xufVxuIiwiaW1wb3J0IHtQbHVnaW4sIFBsYXRmb3JtLCBLZXltYXAsIFNldHRpbmcsIE1vZGFsLCBkZWJvdW5jZX0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQge2Fyb3VuZCwgc2VyaWFsaXplfSBmcm9tIFwibW9ua2V5LWFyb3VuZFwiO1xuXG5mdW5jdGlvbiBob3RrZXlUb1N0cmluZyhob3RrZXkpIHtcbiAgICByZXR1cm4gS2V5bWFwLmNvbXBpbGVNb2RpZmllcnMoaG90a2V5Lm1vZGlmaWVycykrXCIsXCIgKyBob3RrZXkua2V5LnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gaXNQbHVnaW5UYWIoaWQpIHtcbiAgICByZXR1cm4gaWQgPT09IFwicGx1Z2luc1wiIHx8IGlkID09PSBcImNvbW11bml0eS1wbHVnaW5zXCI7XG59XG5cbmZ1bmN0aW9uIHBsdWdpblNldHRpbmdzQXJlT3BlbihhcHApIHtcbiAgICByZXR1cm4gc2V0dGluZ3NBcmVPcGVuKGFwcCkgJiYgaXNQbHVnaW5UYWIoYXBwLnNldHRpbmcuYWN0aXZlVGFiPy5pZClcbn1cblxuZnVuY3Rpb24gc2V0dGluZ3NBcmVPcGVuKGFwcCkge1xuICAgIHJldHVybiBhcHAuc2V0dGluZy5jb250YWluZXJFbC5wYXJlbnRFbGVtZW50ICE9PSBudWxsXG59XG5cbmZ1bmN0aW9uIGlzUGx1Z2luVmlld2VyKG9iKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgb2IgaW5zdGFuY2VvZiBNb2RhbCAmJlxuICAgICAgICBvYi5oYXNPd25Qcm9wZXJ0eShcImF1dG9sb2FkXCIpICYmXG4gICAgICAgIHR5cGVvZiBvYi5zaG93UGx1Z2luID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgdHlwZW9mIG9iLnVwZGF0ZVNlYXJjaCA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgIHR5cGVvZiBvYi5zZWFyY2hFbCA9PSBcIm9iamVjdFwiXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gb25FbGVtZW50KGVsLCBldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrLCBvcHRpb25zPWZhbHNlKSB7XG4gICAgZWwub24oZXZlbnQsIHNlbGVjdG9yLCBjYWxsYmFjaywgb3B0aW9ucylcbiAgICByZXR1cm4gKCkgPT4gZWwub2ZmKGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2ssIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb3RrZXlIZWxwZXIgZXh0ZW5kcyBQbHVnaW4ge1xuXG4gICAgb25sb2FkKCkge1xuICAgICAgICBjb25zdCB3b3Jrc3BhY2UgPSB0aGlzLmFwcC53b3Jrc3BhY2UsIHBsdWdpbiA9IHRoaXM7XG4gICAgICAgIHRoaXMubGFzdFNlYXJjaCA9IHt9OyAgIC8vIGxhc3Qgc2VhcmNoIHVzZWQsIGluZGV4ZWQgYnkgdGFiXG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KCB3b3Jrc3BhY2Uub24oXCJwbHVnaW4tc2V0dGluZ3M6YmVmb3JlLWRpc3BsYXlcIiwgKHNldHRpbmdzVGFiLCB0YWJJZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5ob3RrZXlCdXR0b25zID0ge307XG4gICAgICAgICAgICB0aGlzLmNvbmZpZ0J1dHRvbnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsc0FkZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IGFyb3VuZChTZXR0aW5nLnByb3RvdHlwZSwge1xuICAgICAgICAgICAgICAgIGFkZFNlYXJjaChvbGQpIHsgcmV0dXJuIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbGQuY2FsbCh0aGlzLCBpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZWFyY2hJbnB1dCA9IGk7IGY/LihpKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXRJbW1lZGlhdGUocmVtb3ZlKTtcbiAgICAgICAgfSkgKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KCB3b3Jrc3BhY2Uub24oXCJwbHVnaW4tc2V0dGluZ3M6YWZ0ZXItZGlzcGxheVwiLCAgKCkgPT4gdGhpcy5yZWZyZXNoQnV0dG9ucyh0cnVlKSkgKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoIHdvcmtzcGFjZS5vbihcInBsdWdpbi1zZXR0aW5nczpwbHVnaW4tY29udHJvbFwiLCAoc2V0dGluZywgbWFuaWZlc3QsIGVuYWJsZWQsIHRhYklkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbHNBZGRlZCB8fCB0aGlzLmFkZEdsb2JhbHModGFiSWQsIHNldHRpbmcuc2V0dGluZ0VsKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRXh0cmFCdXR0b25zKHNldHRpbmcsIG1hbmlmZXN0LCBlbmFibGVkKTtcbiAgICAgICAgfSkgKTtcblxuICAgICAgICAvLyBSZWZyZXNoIHRoZSBidXR0b25zIHdoZW4gY29tbWFuZHMgb3Igc2V0dGluZyB0YWJzIGFyZSBhZGRlZCBvciByZW1vdmVkXG4gICAgICAgIGNvbnN0IHJlcXVlc3RSZWZyZXNoID0gZGVib3VuY2UodGhpcy5yZWZyZXNoQnV0dG9ucy5iaW5kKHRoaXMpLCA1MCwgdHJ1ZSk7XG4gICAgICAgIGZ1bmN0aW9uIHJlZnJlc2hlcihvbGQpIHsgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpeyByZXF1ZXN0UmVmcmVzaCgpOyByZXR1cm4gb2xkLmFwcGx5KHRoaXMsIGFyZ3MpOyB9OyB9XG4gICAgICAgIHRoaXMucmVnaXN0ZXIoYXJvdW5kKGFwcC5jb21tYW5kcywge2FkZENvbW1hbmQ6ICAgIHJlZnJlc2hlciwgcmVtb3ZlQ29tbWFuZDogICAgcmVmcmVzaGVyfSkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyKGFyb3VuZChhcHAuc2V0dGluZywgIHthZGRQbHVnaW5UYWI6ICByZWZyZXNoZXIsIHJlbW92ZVBsdWdpblRhYjogIHJlZnJlc2hlcn0pKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlcihhcm91bmQoYXBwLnNldHRpbmcsICB7YWRkU2V0dGluZ1RhYjogcmVmcmVzaGVyLCByZW1vdmVTZXR0aW5nVGFiOiByZWZyZXNoZXJ9KSk7XG5cbiAgICAgICAgd29ya3NwYWNlLm9uTGF5b3V0UmVhZHkodGhpcy53aGVuUmVhZHkuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJPYnNpZGlhblByb3RvY29sSGFuZGxlcihcImdvdG8tcGx1Z2luXCIsICh7aWQsIHNob3d9KSA9PiB7XG4gICAgICAgICAgICB3b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7IHRoaXMuZ290b1BsdWdpbihpZCwgc2hvdyk7IH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3aGVuUmVhZHkoKSB7XG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuYXBwLCBwbHVnaW4gPSB0aGlzO1xuXG4gICAgICAgIC8vIFNhdmUgYW5kIHJlc3RvcmUgY3VycmVudCB0YWIgKHdvcmthcm91bmQgaHR0cHM6Ly9mb3J1bS5vYnNpZGlhbi5tZC90L3NldHRpbmdzLWRpYWxvZy1yZXNldHMtdG8tZmlyc3QtdGFiLWV2ZXJ5LXRpbWUvMTgyNDApXG4gICAgICAgIHRoaXMucmVnaXN0ZXIoYXJvdW5kKGFwcC5zZXR0aW5nLCB7XG4gICAgICAgICAgICBvbk9wZW4ob2xkKSB7IHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgb2xkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmICghUGxhdGZvcm0uaXNNb2JpbGUgJiYgcGx1Z2luLmxhc3RUYWJJZCkgdGhpcy5vcGVuVGFiQnlJZChwbHVnaW4ubGFzdFRhYklkKTtcbiAgICAgICAgICAgIH19LFxuICAgICAgICAgICAgb25DbG9zZShvbGQpIHsgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBwbHVnaW4ubGFzdFRhYklkID0gdGhpcy5hY3RpdmVUYWI/LmlkO1xuICAgICAgICAgICAgICAgIHJldHVybiBvbGQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9fVxuICAgICAgICB9KSlcblxuICAgICAgICBjb25zdCBjb3JlUGx1Z2lucyA9IHRoaXMuZ2V0U2V0dGluZ3NUYWIoXCJwbHVnaW5zXCIpO1xuICAgICAgICBjb25zdCBjb21tdW5pdHkgICA9IHRoaXMuZ2V0U2V0dGluZ3NUYWIoXCJjb21tdW5pdHktcGx1Z2luc1wiKTtcblxuICAgICAgICAvLyBIb29rIGludG8gdGhlIGRpc3BsYXkoKSBtZXRob2Qgb2YgdGhlIHBsdWdpbiBzZXR0aW5ncyB0YWJzXG4gICAgICAgIGlmIChjb3JlUGx1Z2lucykgdGhpcy5yZWdpc3Rlcihhcm91bmQoY29yZVBsdWdpbnMsIHtkaXNwbGF5OiB0aGlzLmFkZFBsdWdpblNldHRpbmdFdmVudHMuYmluZCh0aGlzLCBjb3JlUGx1Z2lucy5pZCl9KSk7XG4gICAgICAgIGlmIChjb21tdW5pdHkpICAgdGhpcy5yZWdpc3Rlcihhcm91bmQoY29tbXVuaXR5LCAgIHtkaXNwbGF5OiB0aGlzLmFkZFBsdWdpblNldHRpbmdFdmVudHMuYmluZCh0aGlzLCBjb21tdW5pdHkuaWQpfSkpO1xuXG4gICAgICAgIGNvbnN0IGVuaGFuY2VWaWV3ZXIgPSAoKSA9PiB0aGlzLmVuaGFuY2VWaWV3ZXIoKTtcblxuICAgICAgICBpZiAoY29tbXVuaXR5KSAgIHRoaXMucmVnaXN0ZXIoXG4gICAgICAgICAgICAvLyBUcmFwIG9wZW5zIG9mIHRoZSBjb21tdW5pdHkgcGx1Z2lucyB2aWV3ZXIgZnJvbSB0aGUgc2V0dGluZ3MgcGFuZWxcbiAgICAgICAgICAgIG9uRWxlbWVudChcbiAgICAgICAgICAgICAgICBjb21tdW5pdHkuY29udGFpbmVyRWwsIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBcIi5tb2QtY3RhLCAuaW5zdGFsbGVkLXBsdWdpbnMtY29udGFpbmVyIC5zZXR0aW5nLWl0ZW0taW5mb1wiLFxuICAgICAgICAgICAgICAgIGVuaGFuY2VWaWV3ZXIsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIFRyYXAgb3BlbnMgb2YgdGhlIGNvbW11bml0eSBwbHVnaW5zIHZpZXdlciB2aWEgVVJMXG4gICAgICAgIHRoaXMucmVnaXN0ZXIoXG4gICAgICAgICAgICBhcm91bmQoYXBwLndvcmtzcGFjZS5wcm90b2NvbEhhbmRsZXJzLCB7XG4gICAgICAgICAgICAgICAgZ2V0KG9sZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gXCJzaG93LXBsdWdpblwiKSBlbmhhbmNlVmlld2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2xkLmNhbGwodGhpcywga2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIClcblxuICAgICAgICAvLyBOb3cgZm9yY2UgYSByZWZyZXNoIGlmIGVpdGhlciBwbHVnaW5zIHRhYiBpcyBjdXJyZW50bHkgdmlzaWJsZSAodG8gc2hvdyBvdXIgbmV3IGJ1dHRvbnMpXG4gICAgICAgIGZ1bmN0aW9uIHJlZnJlc2hUYWJJZk9wZW4oKSB7XG4gICAgICAgICAgICBpZiAocGx1Z2luU2V0dGluZ3NBcmVPcGVuKGFwcCkpIGFwcC5zZXR0aW5nLm9wZW5UYWJCeUlkKGFwcC5zZXR0aW5nLmFjdGl2ZVRhYi5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVmcmVzaFRhYklmT3BlbigpO1xuXG4gICAgICAgIC8vIEFuZCBkbyBpdCBhZ2FpbiBhZnRlciB3ZSB1bmxvYWQgKHRvIHJlbW92ZSB0aGUgb2xkIGJ1dHRvbnMpXG4gICAgICAgIHRoaXMucmVnaXN0ZXIoKCkgPT4gc2V0SW1tZWRpYXRlKHJlZnJlc2hUYWJJZk9wZW4pKTtcblxuICAgICAgICAvLyBUd2VhayB0aGUgaG90a2V5IHNldHRpbmdzIHRhYiB0byBtYWtlIGZpbHRlcmluZyB3b3JrIG9uIGlkIHByZWZpeGVzIGFzIHdlbGwgYXMgY29tbWFuZCBuYW1lc1xuICAgICAgICBjb25zdCBob3RrZXlzVGFiID0gdGhpcy5nZXRTZXR0aW5nc1RhYihcImhvdGtleXNcIik7XG4gICAgICAgIGlmIChob3RrZXlzVGFiKSB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyKGFyb3VuZChob3RrZXlzVGFiLCB7XG4gICAgICAgICAgICAgICAgZGlzcGxheShvbGQpIHsgcmV0dXJuIGZ1bmN0aW9uKCkgeyBvbGQuY2FsbCh0aGlzKTsgdGhpcy5zZWFyY2hJbnB1dEVsLmZvY3VzKCk7IH07IH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlSG90a2V5VmlzaWJpbGl0eShvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkU2VhcmNoID0gdGhpcy5zZWFyY2hJbnB1dEVsLnZhbHVlLCBvbGRDb21tYW5kcyA9IGFwcC5jb21tYW5kcy5jb21tYW5kcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9sZFNlYXJjaC5lbmRzV2l0aChcIjpcIikgJiYgIW9sZFNlYXJjaC5jb250YWlucyhcIiBcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBpbmNyZWRpYmx5IHVnbHkgaGFjayB0aGF0IHJlbGllcyBvbiB1cGRhdGVIb3RrZXlWaXNpYmlsaXR5KCkgaXRlcmF0aW5nIGFwcC5jb21tYW5kcy5jb21tYW5kc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsb29raW5nIGZvciBob3RrZXkgY29uZmxpY3RzICpiZWZvcmUqIGFueXRoaW5nIGVsc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50ID0gb2xkQ29tbWFuZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJlZCA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhhcHAuY29tbWFuZHMuY29tbWFuZHMpLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChbaWQsIGNtZF0pID0+IChpZCtcIjpcIikuc3RhcnRzV2l0aChvbGRTZWFyY2gpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0RWwudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuY29tbWFuZHMuY29tbWFuZHMgPSBuZXcgUHJveHkob2xkQ29tbWFuZHMsIHtvd25LZXlzKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZmlyc3QgdGltZSBjb21tYW5kcyBhcmUgaXRlcmF0ZWQsIHJldHVybiB0aGUgd2hvbGUgdGhpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0aGF0LCByZXR1cm4gdGhlIGZpbHRlcmVkIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7IHJldHVybiBPYmplY3Qua2V5cyhjdXJyZW50KTsgfSBmaW5hbGx5IHsgY3VycmVudCA9IGZpbHRlcmVkOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9sZC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0RWwudmFsdWUgPSBvbGRTZWFyY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmNvbW1hbmRzLmNvbW1hbmRzID0gb2xkQ29tbWFuZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgY29tbWFuZHNcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcIm9wZW4tcGx1Z2luc1wiLFxuICAgICAgICAgICAgbmFtZTogXCJPcGVuIHRoZSBDb21tdW5pdHkgUGx1Z2lucyBzZXR0aW5nc1wiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuc2hvd1NldHRpbmdzKFwiY29tbXVuaXR5LXBsdWdpbnNcIikgfHwgdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImJyb3dzZS1wbHVnaW5zXCIsXG4gICAgICAgICAgICBuYW1lOiBcIkJyb3dzZSBvciBzZWFyY2ggdGhlIENvbW11bml0eSBQbHVnaW5zIGNhdGFsb2dcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLmdvdG9QbHVnaW4oKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNyZWF0ZUV4dHJhQnV0dG9ucyhzZXR0aW5nLCBtYW5pZmVzdCwgZW5hYmxlZCkge1xuICAgICAgICBzZXR0aW5nLmFkZEV4dHJhQnV0dG9uKGJ0biA9PiB7XG4gICAgICAgICAgICBidG4uc2V0SWNvbihcImdlYXJcIik7XG4gICAgICAgICAgICBidG4ub25DbGljaygoKSA9PiB0aGlzLnNob3dDb25maWdGb3IobWFuaWZlc3QuaWQucmVwbGFjZSgvXndvcmtzcGFjZSQvLFwiZmlsZVwiKSkpO1xuICAgICAgICAgICAgYnRuLnNldFRvb2x0aXAoXCJPcHRpb25zXCIpO1xuICAgICAgICAgICAgYnRuLmV4dHJhU2V0dGluZ3NFbC50b2dnbGUoZW5hYmxlZClcbiAgICAgICAgICAgIHRoaXMuY29uZmlnQnV0dG9uc1ttYW5pZmVzdC5pZF0gPSBidG47XG4gICAgICAgIH0pO1xuICAgICAgICBzZXR0aW5nLmFkZEV4dHJhQnV0dG9uKGJ0biA9PiB7XG4gICAgICAgICAgICBidG4uc2V0SWNvbihcImFueS1rZXlcIik7XG4gICAgICAgICAgICBidG4ub25DbGljaygoKSA9PiB0aGlzLnNob3dIb3RrZXlzRm9yKG1hbmlmZXN0LmlkK1wiOlwiKSlcbiAgICAgICAgICAgIGJ0bi5leHRyYVNldHRpbmdzRWwudG9nZ2xlKGVuYWJsZWQpXG4gICAgICAgICAgICB0aGlzLmhvdGtleUJ1dHRvbnNbbWFuaWZlc3QuaWRdID0gYnRuO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdG9wLWxldmVsIGl0ZW1zIChzZWFyY2ggYW5kIHBzZXVkby1wbHVnaW5zKVxuICAgIGFkZEdsb2JhbHModGFiSWQsIHNldHRpbmdFbCkge1xuICAgICAgICB0aGlzLmdsb2JhbHNBZGRlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gQWRkIGEgc2VhcmNoIGZpbHRlciB0byBzaHJpbmsgcGx1Z2luIGxpc3RcbiAgICAgICAgY29uc3QgY29udGFpbmVyRWwgPSBzZXR0aW5nRWwucGFyZW50RWxlbWVudDtcbiAgICAgICAgbGV0IHNlYXJjaEVsO1xuICAgICAgICBpZiAodGFiSWQgIT09IFwicGx1Z2luc1wiIHx8IHRoaXMuc2VhcmNoSW5wdXQpIHtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGJ1aWx0LWluIHNlYXJjaCBoYW5kbGVyXG4gICAgICAgICAgICAoc2VhcmNoRWwgPSB0aGlzLnNlYXJjaElucHV0KT8ub25DaGFuZ2UoY2hhbmdlSGFuZGxlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0bXAgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuYWRkU2VhcmNoKHMgPT4ge1xuICAgICAgICAgICAgICAgIHNlYXJjaEVsID0gcztcbiAgICAgICAgICAgICAgICBzLnNldFBsYWNlaG9sZGVyKFwiRmlsdGVyIHBsdWdpbnMuLi5cIikub25DaGFuZ2UoY2hhbmdlSGFuZGxlcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlYXJjaEVsLmNvbnRhaW5lckVsLnN0eWxlLm1hcmdpbiA9IDA7XG4gICAgICAgICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoXCJob3RrZXktc2VhcmNoLWNvbnRhaW5lclwiKS5hcHBlbmQoc2VhcmNoRWwuY29udGFpbmVyRWwpO1xuICAgICAgICAgICAgdG1wLnNldHRpbmdFbC5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFiSWQgPT09IFwiY29tbXVuaXR5LXBsdWdpbnNcIikge1xuICAgICAgICAgICAgc2VhcmNoRWwuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMgJiYgIUtleW1hcC5nZXRNb2RpZmllcnMoZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nb3RvUGx1Z2luKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IHRoaXM7XG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZUhhbmRsZXIoc2Vlayl7XG4gICAgICAgICAgICBjb25zdCBmaW5kID0gKHBsdWdpbi5sYXN0U2VhcmNoW3RhYklkXSA9IHNlZWspLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBmdW5jdGlvbiBtYXRjaEFuZEhpZ2hsaWdodChlbCkge1xuICAgICAgICAgICAgICAgIGlmICghZWwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZWwudGV4dENvbnRlbnQgPSBlbC50ZXh0Q29udGVudDsgLy8gY2xlYXIgcHJldmlvdXMgaGlnaGxpZ2h0aW5nLCBpZiBhbnlcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGZpbmQpO1xuICAgICAgICAgICAgICAgIGlmICghfmluZGV4KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgZWwudGV4dENvbnRlbnQgPSB0ZXh0LnN1YnN0cigwLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgZWwuY3JlYXRlU3BhbihcInN1Z2dlc3Rpb24taGlnaGxpZ2h0XCIpLnRleHRDb250ZW50ID0gdGV4dC5zdWJzdHIoaW5kZXgsIGZpbmQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBlbC5pbnNlcnRBZGphY2VudFRleHQoXCJiZWZvcmVlbmRcIiwgdGV4dC5zdWJzdHIoaW5kZXgrZmluZC5sZW5ndGgpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyRWwuZmluZEFsbChcIi5zZXR0aW5nLWl0ZW1cIikuZm9yRWFjaChlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lTWF0Y2hlcyA9IG1hdGNoQW5kSGlnaGxpZ2h0KGUuZmluZChcIi5zZXR0aW5nLWl0ZW0tbmFtZVwiKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVzY01hdGNoZXMgPSBtYXRjaEFuZEhpZ2hsaWdodChcbiAgICAgICAgICAgICAgICAgICAgZS5maW5kKFwiLnNldHRpbmctaXRlbS1kZXNjcmlwdGlvbiA+IGRpdjpsYXN0LWNoaWxkXCIpID8/XG4gICAgICAgICAgICAgICAgICAgIGUuZmluZChcIi5zZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIilcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvck1hdGNoZXMgPSBtYXRjaEFuZEhpZ2hsaWdodChcbiAgICAgICAgICAgICAgICAgICAgZS5maW5kKFwiLnNldHRpbmctaXRlbS1kZXNjcmlwdGlvbiA+IGRpdjpudGgtY2hpbGQoMilcIilcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGUudG9nZ2xlKG5hbWVNYXRjaGVzIHx8IGRlc2NNYXRjaGVzIHx8IGF1dGhvck1hdGNoZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghc2VhcmNoRWwpIHJldHVyblxuICAgICAgICAgICAgaWYgKHNlYXJjaEVsICYmIHR5cGVvZiBwbHVnaW4ubGFzdFNlYXJjaFt0YWJJZF0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBzZWFyY2hFbC5zZXRWYWx1ZShwbHVnaW4ubGFzdFNlYXJjaFt0YWJJZF0pO1xuICAgICAgICAgICAgICAgIHNlYXJjaEVsLm9uQ2hhbmdlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFQbGF0Zm9ybS5pc01vYmlsZSkgc2VhcmNoRWwuaW5wdXRFbC5zZWxlY3QoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnRhaW5lckVsLmFwcGVuZChzZXR0aW5nRWwpO1xuXG4gICAgICAgIGlmICh0YWJJZCA9PT0gXCJwbHVnaW5zXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRvck5hbWUgICAgPSB0aGlzLmdldFNldHRpbmdzVGFiKFwiZWRpdG9yXCIpPy5uYW1lIHx8IFwiRWRpdG9yXCI7XG4gICAgICAgICAgICBjb25zdCB3b3Jrc3BhY2VOYW1lID0gdGhpcy5nZXRTZXR0aW5nc1RhYihcImZpbGVcIik/Lm5hbWUgICB8fCBcIkZpbGVzICYgTGlua3NcIjtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRXh0cmFCdXR0b25zKFxuICAgICAgICAgICAgICAgIG5ldyBTZXR0aW5nKHNldHRpbmdFbC5wYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAuc2V0TmFtZShcIkFwcFwiKS5zZXREZXNjKFwiTWlzY2VsbGFuZW91cyBhcHBsaWNhdGlvbiBjb21tYW5kcyAoYWx3YXlzIGVuYWJsZWQpXCIpLFxuICAgICAgICAgICAgICAgIHtpZDogXCJhcHBcIiwgbmFtZTogXCJBcHBcIn0sIHRydWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUV4dHJhQnV0dG9ucyhcbiAgICAgICAgICAgICAgICBuZXcgU2V0dGluZyhzZXR0aW5nRWwucGFyZW50RWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgLnNldE5hbWUoZWRpdG9yTmFtZSkuc2V0RGVzYyhcIkNvcmUgZWRpdGluZyBjb21tYW5kcyAoYWx3YXlzIGVuYWJsZWQpXCIpLFxuICAgICAgICAgICAgICAgIHtpZDogXCJlZGl0b3JcIiwgbmFtZTogZWRpdG9yTmFtZX0sIHRydWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUV4dHJhQnV0dG9ucyhcbiAgICAgICAgICAgICAgICBuZXcgU2V0dGluZyhzZXR0aW5nRWwucGFyZW50RWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgLnNldE5hbWUod29ya3NwYWNlTmFtZSkuc2V0RGVzYyhcIkNvcmUgZmlsZSBhbmQgcGFuZSBtYW5hZ2VtZW50IGNvbW1hbmRzIChhbHdheXMgZW5hYmxlZClcIiksXG4gICAgICAgICAgICAgICAge2lkOiBcIndvcmtzcGFjZVwiLCBuYW1lOiB3b3Jrc3BhY2VOYW1lfSwgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHNldHRpbmdFbC5wYXJlbnRFbGVtZW50LmFwcGVuZChzZXR0aW5nRWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW5oYW5jZVZpZXdlcigpIHtcbiAgICAgICAgY29uc3QgcGx1Z2luID0gdGhpcztcbiAgICAgICAgc2V0SW1tZWRpYXRlKGFyb3VuZChNb2RhbC5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgIG9wZW4ob2xkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGx1Z2luVmlld2VyKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbHVnaW4ubGFzdFNlYXJjaFtcImNvbW11bml0eS1wbHVnaW5zXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERldGFjaCB0aGUgb2xkIHNlYXJjaCBhcmVhLCBpbiBjYXNlIHRoZSBlbXB0eSBzZWFyY2ggaXMgc3RpbGwgcnVubmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdSZXN1bHRzID0gdGhpcy5zZWFyY2hSZXN1bHRFbC5jbG9uZU5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hDb250YWluZXJFbC5yZXBsYWNlQ2hpbGQobmV3UmVzdWx0cywgdGhpcy5zZWFyY2hSZXN1bHRFbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0RWwgPSBuZXdSZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSBhbiB1cGRhdGU7IHVzZSBhbiBldmVudCBzbyB0aGF0IHRoZSBcInhcIiBhcHBlYXJzIG9uIHNlYXJjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaEVsLnZhbHVlID0gcGx1Z2luLmxhc3RTZWFyY2hbXCJjb21tdW5pdHktcGx1Z2luc1wiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hFbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoRWwuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5jdXJyZW50Vmlld2VyID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyb3VuZCh0aGlzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2VhcmNoOiBzZXJpYWxpemUsICAvLyBwcmV2ZW50IHJhY2UgY29uZGl0aW9uc1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2Uob2xkKSB7IHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5jdXJyZW50Vmlld2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9sZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dQbHVnaW4ob2xkKSB7IHJldHVybiBhc3luYyBmdW5jdGlvbihtYW5pZmVzdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9sZC5jYWxsKHRoaXMsIG1hbmlmZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5hcHAucGx1Z2lucy5wbHVnaW5zW21hbmlmZXN0LmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnV0dG9ucyA9IHRoaXMucGx1Z2luQ29udGVudEVsLmZpbmQoXCJidXR0b25cIikucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUJ0bnMgPSBbaTE4bmV4dC50KFwic2V0dGluZy5vcHRpb25zXCIpLCBpMThuZXh0LnQoXCJzZXR0aW5nLmhvdGtleXMubmFtZVwiKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGIgb2YgYnV0dG9ucy5maW5kQWxsKFwiYnV0dG9uXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbW92ZUJ0bnMuaW5kZXhPZihiLnRleHRDb250ZW50KSAhPT0gLTEpIGIuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXlCdG4gPSBidXR0b25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtwcmVwZW5kOiB0cnVlLCB0ZXh0OiBcIkhvdGtleXNcIn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2ZnQnRuID0gYnV0dG9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7cHJlcGVuZDogdHJ1ZSwgdGV4dDogXCJPcHRpb25zXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5ob3RrZXlCdXR0b25zW21hbmlmZXN0LmlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUb29sdGlwKHRpcCkge2tleUJ0bi50aXRsZSA9IHRpcH0sIGV4dHJhU2V0dGluZ3NFbDoga2V5QnRuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uY29uZmlnQnV0dG9uc1ttYW5pZmVzdC5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG9vbHRpcCgpIHt9LCBleHRyYVNldHRpbmdzRWw6IGNmZ0J0blxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnJlZnJlc2hCdXR0b25zKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTsgcGx1Z2luLnNob3dIb3RrZXlzRm9yKG1hbmlmZXN0LmlkK1wiOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2ZnQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTsgcGx1Z2luLnNob3dDb25maWdGb3IobWFuaWZlc3QuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2xkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGdldFNldHRpbmdzVGFiKGlkKSB7IHJldHVybiB0aGlzLmFwcC5zZXR0aW5nLnNldHRpbmdUYWJzLmZpbHRlcih0ID0+IHQuaWQgPT09IGlkKS5zaGlmdCgpOyB9XG5cbiAgICBhZGRQbHVnaW5TZXR0aW5nRXZlbnRzKHRhYklkLCBvbGQpIHtcbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XG4gICAgICAgIGxldCBpbl9ldmVudCA9IGZhbHNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHRyaWdnZXIoLi4uYXJncykge1xuICAgICAgICAgICAgaW5fZXZlbnQgPSB0cnVlO1xuICAgICAgICAgICAgdHJ5IHsgYXBwLndvcmtzcGFjZS50cmlnZ2VyKC4uLmFyZ3MpOyB9IGNhdGNoKGUpIHsgY29uc29sZS5lcnJvcihlKTsgfVxuICAgICAgICAgICAgaW5fZXZlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdyYXBwZXIgdG8gYWRkIHBsdWdpbi1zZXR0aW5ncyBldmVudHNcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGRpc3BsYXkoLi4uYXJncykge1xuICAgICAgICAgICAgaWYgKGluX2V2ZW50KSByZXR1cm47XG4gICAgICAgICAgICB0cmlnZ2VyKFwicGx1Z2luLXNldHRpbmdzOmJlZm9yZS1kaXNwbGF5XCIsIHRoaXMsIHRhYklkKTtcblxuICAgICAgICAgICAgLy8gVHJhY2sgd2hpY2ggcGx1Z2luIGVhY2ggc2V0dGluZyBpcyBmb3JcbiAgICAgICAgICAgIGxldCBtYW5pZmVzdHM7XG4gICAgICAgICAgICBpZiAodGFiSWQgPT09IFwicGx1Z2luc1wiKSB7XG4gICAgICAgICAgICAgICAgbWFuaWZlc3RzID0gT2JqZWN0LmVudHJpZXMoYXBwLmludGVybmFsUGx1Z2lucy5wbHVnaW5zKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgIChbaWQsIHtpbnN0YW5jZToge25hbWV9LCBfbG9hZGVkOmVuYWJsZWR9XSkgPT4ge3JldHVybiB7aWQsIG5hbWUsIGVuYWJsZWR9O31cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYW5pZmVzdHMgPSBPYmplY3QudmFsdWVzKGFwcC5wbHVnaW5zLm1hbmlmZXN0cyk7XG4gICAgICAgICAgICAgICAgbWFuaWZlc3RzLnNvcnQoKGUsIHQpID0+IGUubmFtZS5sb2NhbGVDb21wYXJlKHQubmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHdoaWNoID0gMDtcblxuICAgICAgICAgICAgLy8gVHJhcCB0aGUgYWRkaXRpb24gb2YgdGhlIFwidW5pbnN0YWxsXCIgYnV0dG9ucyBuZXh0IHRvIGVhY2ggcGx1Z2luXG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBhcm91bmQoU2V0dGluZy5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgICAgICBhZGRUb2dnbGUob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFiSWQgPT09IFwicGx1Z2luc1wiICYmICFpbl9ldmVudCAmJiAobWFuaWZlc3RzW3doaWNoXXx8e30pLm5hbWUgPT09IHRoaXMubmFtZUVsLnRleHRDb250ZW50ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hbmlmZXN0ID0gbWFuaWZlc3RzW3doaWNoKytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXIoXCJwbHVnaW4tc2V0dGluZ3M6cGx1Z2luLWNvbnRyb2xcIiwgdGhpcywgbWFuaWZlc3QsIG1hbmlmZXN0LmVuYWJsZWQsIHRhYklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvbGQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFkZEV4dHJhQnV0dG9uKG9sZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBvbmx5IFwiZXh0cmFzXCIgYWRkZWQgdG8gc2V0dGluZ3Mgdy9hIGRlc2NyaXB0aW9uIGFyZSBvbiB0aGUgcGx1Z2lucywgY3VycmVudGx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc28gb25seSB0cnkgdG8gbWF0Y2ggdGhvc2UgdG8gcGx1Z2luIG5hbWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFiSWQgIT09IFwicGx1Z2luc1wiICYmIHRoaXMuZGVzY0VsLmNoaWxkRWxlbWVudENvdW50ICYmICFpbl9ldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggKG1hbmlmZXN0c1t3aGljaF18fHt9KS5uYW1lID09PSB0aGlzLm5hbWVFbC50ZXh0Q29udGVudCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFuaWZlc3QgPSBtYW5pZmVzdHNbd2hpY2grK10sIGVuYWJsZWQgPSAhIWFwcC5wbHVnaW5zLnBsdWdpbnNbbWFuaWZlc3QuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyKFwicGx1Z2luLXNldHRpbmdzOnBsdWdpbi1jb250cm9sXCIsIHRoaXMsIG1hbmlmZXN0LCBlbmFibGVkLCB0YWJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvbGQuY2FsbCh0aGlzLCBmdW5jdGlvbihiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IoYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJldmVudCBjb3JlIGZyb20gc2hvd2luZyBidXR0b25zIHRoYXQgbGFjayBob3RrZXkgY291bnRzL2NvbmZsaWN0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5fZXZlbnQgJiYgYi5leHRyYVNldHRpbmdzRWwuZmluZChcInN2Zy5nZWFyLCBzdmcuYW55LWtleVwiKSkgYi5leHRyYVNldHRpbmdzRWwuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvbGQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRyaWdnZXIoXCJwbHVnaW4tc2V0dGluZ3M6YWZ0ZXItZGlzcGxheVwiLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdvdG9QbHVnaW4oaWQsIHNob3c9XCJpbmZvXCIpIHtcbiAgICAgICAgaWYgKGlkICYmIHNob3cgPT09IFwiaG90a2V5c1wiKSByZXR1cm4gdGhpcy5zaG93SG90a2V5c0ZvcihpZCtcIjpcIik7XG4gICAgICAgIGlmIChpZCAmJiBzaG93ID09PSBcImNvbmZpZ1wiKSAge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNob3dDb25maWdGb3IoaWQpKSB0aGlzLmFwcC5zZXR0aW5nLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dTZXR0aW5ncyhcImNvbW11bml0eS1wbHVnaW5zXCIpO1xuICAgICAgICBjb25zdCByZW1vdmUgPSBhcm91bmQoTW9kYWwucHJvdG90eXBlLCB7XG4gICAgICAgICAgICBvcGVuKG9sZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWQpIHRoaXMuYXV0b2xvYWQgPSBpZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9sZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuYXBwLnNldHRpbmcuYWN0aXZlVGFiLmNvbnRhaW5lckVsLmZpbmQoXCIubW9kLWN0YVwiKS5jbGljaygpO1xuICAgICAgICAvLyBYWFggaGFuZGxlIG5hdiB0byBub3QtY2F0YWxvZ2VkIHBsdWdpblxuICAgIH1cblxuICAgIHNob3dTZXR0aW5ncyhpZCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ZXI/LmNsb3NlKCk7ICAvLyBjbG9zZSB0aGUgcGx1Z2luIGJyb3dzZXIgaWYgb3BlblxuICAgICAgICBzZXR0aW5nc0FyZU9wZW4odGhpcy5hcHApIHx8IHRoaXMuYXBwLnNldHRpbmcub3BlbigpO1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwLnNldHRpbmcub3BlblRhYkJ5SWQoaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwLnNldHRpbmcuYWN0aXZlVGFiPy5pZCA9PT0gaWQgPyB0aGlzLmFwcC5zZXR0aW5nLmFjdGl2ZVRhYiA6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93SG90a2V5c0ZvcihzZWFyY2gpIHtcbiAgICAgICAgY29uc3QgdGFiID0gdGhpcy5zaG93U2V0dGluZ3MoXCJob3RrZXlzXCIpO1xuICAgICAgICBpZiAodGFiICYmIHRhYi5zZWFyY2hJbnB1dEVsICYmIHRhYi51cGRhdGVIb3RrZXlWaXNpYmlsaXR5KSB7XG4gICAgICAgICAgICB0YWIuc2VhcmNoSW5wdXRFbC52YWx1ZSA9IHNlYXJjaDtcbiAgICAgICAgICAgIHRhYi51cGRhdGVIb3RrZXlWaXNpYmlsaXR5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93Q29uZmlnRm9yKGlkKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3dTZXR0aW5ncyhpZCkpIHJldHVybiB0cnVlO1xuICAgICAgICBuZXcgTm90aWNlKFxuICAgICAgICAgICAgYE5vIHNldHRpbmdzIHRhYiBmb3IgXCIke2lkfVwiOiBpdCBtYXkgbm90IGJlIGluc3RhbGxlZCBvciBtaWdodCBub3QgaGF2ZSBzZXR0aW5ncy5gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwbHVnaW5FbmFibGVkKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcC5pbnRlcm5hbFBsdWdpbnMucGx1Z2luc1tpZF0/Ll9sb2FkZWQgfHwgdGhpcy5hcHAucGx1Z2lucy5wbHVnaW5zW2lkXTtcbiAgICB9XG5cbiAgICByZWZyZXNoQnV0dG9ucyhmb3JjZT1mYWxzZSkge1xuICAgICAgICAvLyBEb24ndCByZWZyZXNoIHdoZW4gbm90IGRpc3BsYXlpbmcsIHVubGVzcyByZW5kZXJpbmcgaXMgaW4gcHJvZ3Jlc3NcbiAgICAgICAgaWYgKCFwbHVnaW5TZXR0aW5nc0FyZU9wZW4odGhpcy5hcHApICYmICFmb3JjZSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGhrbSA9IHRoaXMuYXBwLmhvdGtleU1hbmFnZXI7XG4gICAgICAgIGNvbnN0IGFzc2lnbmVkS2V5Q291bnQgPSB7fTtcblxuICAgICAgICAvLyBHZXQgYSBsaXN0IG9mIGNvbW1hbmRzIGJ5IHBsdWdpblxuICAgICAgICBjb25zdCBjb21tYW5kcyA9IE9iamVjdC52YWx1ZXModGhpcy5hcHAuY29tbWFuZHMuY29tbWFuZHMpLnJlZHVjZSgoY21kcywgY21kKT0+e1xuICAgICAgICAgICAgY29uc3QgcGlkID0gY21kLmlkLnNwbGl0KFwiOlwiLDIpLnNoaWZ0KCk7XG4gICAgICAgICAgICBjb25zdCBob3RrZXlzID0gKGhrbS5nZXRIb3RrZXlzKGNtZC5pZCkgfHwgaGttLmdldERlZmF1bHRIb3RrZXlzKGNtZC5pZCkgfHwgW10pLm1hcChob3RrZXlUb1N0cmluZyk7XG4gICAgICAgICAgICBob3RrZXlzLmZvckVhY2goayA9PiBhc3NpZ25lZEtleUNvdW50W2tdID0gMSArIChhc3NpZ25lZEtleUNvdW50W2tdfHwwKSk7XG4gICAgICAgICAgICAoY21kc1twaWRdIHx8IChjbWRzW3BpZF09W10pKS5wdXNoKHtob3RrZXlzLCBjbWR9KTtcbiAgICAgICAgICAgIHJldHVybiBjbWRzO1xuICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgLy8gUGx1Z2luIHNldHRpbmcgdGFicyBieSBwbHVnaW5cbiAgICAgICAgY29uc3QgdGFicyA9IE9iamVjdC52YWx1ZXModGhpcy5hcHAuc2V0dGluZy5wbHVnaW5UYWJzKS5yZWR1Y2UoKHRhYnMsIHRhYik9PiB7XG4gICAgICAgICAgICB0YWJzW3RhYi5pZF0gPSB0YWI7IHJldHVybiB0YWJzXG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgdGFic1tcIndvcmtzcGFjZVwiXSA9IHRhYnNbXCJlZGl0b3JcIl0gPSB0cnVlO1xuXG4gICAgICAgIGZvcihjb25zdCBpZCBvZiBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZ0J1dHRvbnMgfHwge30pKSB7XG4gICAgICAgICAgICBjb25zdCBidG4gPSB0aGlzLmNvbmZpZ0J1dHRvbnNbaWRdO1xuICAgICAgICAgICAgaWYgKCF0YWJzW2lkXSkge1xuICAgICAgICAgICAgICAgIGJ0bi5leHRyYVNldHRpbmdzRWwuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnRuLmV4dHJhU2V0dGluZ3NFbC5zaG93KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoY29uc3QgaWQgb2YgT2JqZWN0LmtleXModGhpcy5ob3RrZXlCdXR0b25zIHx8IHt9KSkge1xuICAgICAgICAgICAgY29uc3QgYnRuID0gdGhpcy5ob3RrZXlCdXR0b25zW2lkXTtcbiAgICAgICAgICAgIGlmICghY29tbWFuZHNbaWRdKSB7XG4gICAgICAgICAgICAgICAgLy8gUGx1Z2luIGlzIGRpc2FibGVkIG9yIGhhcyBubyBjb21tYW5kc1xuICAgICAgICAgICAgICAgIGJ0bi5leHRyYVNldHRpbmdzRWwuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYXNzaWduZWQgPSBjb21tYW5kc1tpZF0uZmlsdGVyKGluZm8gPT4gaW5mby5ob3RrZXlzLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBjb25mbGljdHMgPSBhc3NpZ25lZC5maWx0ZXIoaW5mbyA9PiBpbmZvLmhvdGtleXMuZmlsdGVyKGsgPT4gYXNzaWduZWRLZXlDb3VudFtrXT4xKS5sZW5ndGgpLmxlbmd0aDtcblxuICAgICAgICAgICAgYnRuLnNldFRvb2x0aXAoXG4gICAgICAgICAgICAgICAgYENvbmZpZ3VyZSBob3RrZXlzJHtcIlxcblwifSgke2Fzc2lnbmVkLmxlbmd0aH0vJHtjb21tYW5kc1tpZF0ubGVuZ3RofSBhc3NpZ25lZCR7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZsaWN0cyA/IFwiOyBcIitjb25mbGljdHMrXCIgY29uZmxpY3RpbmdcIiA6IFwiXCJcbiAgICAgICAgICAgICAgICB9KWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBidG4uZXh0cmFTZXR0aW5nc0VsLnRvZ2dsZUNsYXNzKFwibW9kLWVycm9yXCIsICEhY29uZmxpY3RzKTtcbiAgICAgICAgICAgIGJ0bi5leHRyYVNldHRpbmdzRWwuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbIktleW1hcCIsIk1vZGFsIiwiUGx1Z2luIiwiU2V0dGluZyIsImRlYm91bmNlIiwiUGxhdGZvcm0iXSwibWFwcGluZ3MiOiI7Ozs7QUFBTyxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQ3ZDLElBQUksTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUYsSUFBSSxPQUFPLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDN0YsQ0FBQztBQUNELFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFO0FBQzdDLElBQUksTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RFLElBQUksSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDO0FBQ0E7QUFDQSxJQUFJLElBQUksUUFBUTtBQUNoQixRQUFRLE1BQU0s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

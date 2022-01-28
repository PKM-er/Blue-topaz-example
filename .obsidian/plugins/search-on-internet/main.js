'use strict';

var obsidian = require('obsidian');
var require$$0 = require('util');
var path = require('path');
var childProcess = require('child_process');
var fs = require('fs');
var os = require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var childProcess__default = /*#__PURE__*/_interopDefaultLegacy(childProcess);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var DEFAULT_QUERY = {
    tags: [],
    query: '{{query}}',
    name: '',
    encode: true,
};
var DEFAULT_SETTING = {
    searches: [{
            tags: [],
            query: 'https://www.google.com/search?&q={{query}}',
            name: 'Google',
            encode: true,
        }, {
            tags: [],
            query: 'https://en.wikipedia.org/wiki/Special:Search/{{query}}',
            name: 'Wikipedia',
            encode: true,
        }],
    useIframe: true,
};
var parseTags = function (inputs) {
    return inputs.split(',')
        .map(function (s) { return s.trim(); })
        .filter(function (s) { return /^#([A-Za-z])\w+$/.test(s); });
};
var SOISettingTab = /** @class */ (function (_super) {
    __extends(SOISettingTab, _super);
    function SOISettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    SOISettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        var plugin = this.plugin;
        new obsidian.Setting(containerEl)
            .setName('Open in iframe')
            .setDesc('If set to true, this will open your searches in an iframe within Obsidian. ' +
            'Otherwise, it will open in your default browser.')
            .addToggle(function (toggle) {
            toggle.setValue(_this.plugin.settings.useIframe)
                .onChange(function (new_value) {
                _this.plugin.settings.useIframe = new_value;
                _this.plugin.saveData(_this.plugin.settings);
            });
        });
        // Code mostly taken from https://github.com/SilentVoid13/Templater/blob/master/src/settings.ts
        plugin.settings.searches.forEach(function (search) {
            var div = containerEl.createEl('div');
            div.addClass('soi_div');
            new obsidian.Setting(div) //
                .addExtraButton(function (extra) {
                extra.setIcon('cross')
                    .setTooltip('Delete')
                    .onClick(function () {
                    var index = plugin.settings.searches.indexOf(search);
                    if (index > -1) {
                        plugin.settings.searches.splice(index, 1);
                        // Force refresh
                        _this.display();
                    }
                });
            })
                .addText(function (text) {
                return text.setPlaceholder('Search name')
                    .setValue(search.name)
                    .onChange(function (newValue) {
                    var index = plugin.settings.searches.indexOf(search);
                    if (index > -1) {
                        search.name = newValue;
                        plugin.saveSettings();
                        // title.textContent = newValue;
                    }
                });
            }).setName('Name')
                .setDesc('Name of the search. Click the cross to delete the search.');
            new obsidian.Setting(div)
                .setName('Encode')
                .setDesc('If set to true, this will encode raw text to be used in URLs. ' +
                'Otherwise, it will not encode your query.')
                .addToggle(function (toggle) {
                toggle.setValue(search.encode)
                    .onChange(function (newValue) {
                    var index = plugin.settings.searches.indexOf(search);
                    if (index > -1) {
                        search.encode = newValue;
                        plugin.saveSettings();
                    }
                });
            });
            new obsidian.Setting(div)
                .addTextArea(function (text) {
                var t = text.setPlaceholder('Search query')
                    .setValue(search.query)
                    .onChange(function (newQuery) {
                    var index = plugin.settings.searches.indexOf(search);
                    if (index > -1) {
                        search.query = newQuery;
                        plugin.saveSettings();
                    }
                });
                t.inputEl.setAttr('rows', 2);
                return t; //
            }).setName('URL')
                .setDesc('URL to open when executing the search. ' +
                'Use {{query}} to refer to the query, which is either the selected text, or the title of a note.');
            new obsidian.Setting(div).addText(function (text) {
                return text.setPlaceholder('')
                    .setValue(search.tags.join(', '))
                    .onChange(function (newValue) {
                    var index = plugin.settings.searches.indexOf(search);
                    if (index > -1) {
                        search.tags = parseTags(newValue);
                        plugin.saveSettings();
                    }
                });
            }).setName('Tags')
                .setDesc('Only add search to notes with these comma-separated tags. Leave empty to use all tags.');
        });
        var div = containerEl.createEl('div');
        div.addClass('soi_div2');
        var setting = new obsidian.Setting(containerEl)
            .addButton(function (button) {
            return button.setButtonText('Add Search').onClick(function () {
                plugin.settings.searches.push({
                    name: '',
                    query: '',
                    tags: [],
                    encode: true,
                });
                // Force refresh
                _this.display();
            });
        });
        setting.infoEl.remove();
        div.appendChild(containerEl.lastChild);
    };
    return SOISettingTab;
}(obsidian.PluginSettingTab));

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

let isDocker;

function hasDockerEnv() {
	try {
		fs__default['default'].statSync('/.dockerenv');
		return true;
	} catch (_) {
		return false;
	}
}

function hasDockerCGroup() {
	try {
		return fs__default['default'].readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch (_) {
		return false;
	}
}

var isDocker_1 = () => {
	if (isDocker === undefined) {
		isDocker = hasDockerEnv() || hasDockerCGroup();
	}

	return isDocker;
};

var isWsl_1 = createCommonjsModule(function (module) {




const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os__default['default'].release().toLowerCase().includes('microsoft')) {
		if (isDocker_1()) {
			return false;
		}

		return true;
	}

	try {
		return fs__default['default'].readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft') ?
			!isDocker_1() : false;
	} catch (_) {
		return false;
	}
};

if (process.env.__IS_WSL_TEST__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}
});

const {promisify} = require$$0__default['default'];






const pAccess = promisify(fs__default['default'].access);
const pReadFile = promisify(fs__default['default'].readFile);

// Path to included `xdg-open`.
const localXdgOpenPath = path__default['default'].join(__dirname, 'xdg-open');

/**
Get the mount point for fixed drives in WSL.

@inner
@returns {string} The mount point.
*/
const getWslDrivesMountPoint = (() => {
	// Default value for "root" param
	// according to https://docs.microsoft.com/en-us/windows/wsl/wsl-config
	const defaultMountPoint = '/mnt/';

	let mountPoint;

	return async function () {
		if (mountPoint) {
			// Return memoized mount point value
			return mountPoint;
		}

		const configFilePath = '/etc/wsl.conf';

		let isConfigFileExists = false;
		try {
			await pAccess(configFilePath, fs__default['default'].constants.F_OK);
			isConfigFileExists = true;
		} catch (_) {}

		if (!isConfigFileExists) {
			return defaultMountPoint;
		}

		const configContent = await pReadFile(configFilePath, {encoding: 'utf8'});
		const configMountPoint = /root\s*=\s*(.*)/g.exec(configContent);

		if (!configMountPoint) {
			return defaultMountPoint;
		}

		mountPoint = configMountPoint[1].trim();
		mountPoint = mountPoint.endsWith('/') ? mountPoint : mountPoint + '/';

		return mountPoint;
	};
})();

var open = async (target, options) => {
	if (typeof target !== 'string') {
		throw new TypeError('Expected a `target`');
	}

	options = {
		wait: false,
		background: false,
		allowNonzeroExitCode: false,
		...options
	};

	let command;
	let {app} = options;
	let appArguments = [];
	const cliArguments = [];
	const childProcessOptions = {};

	if (Array.isArray(app)) {
		appArguments = app.slice(1);
		app = app[0];
	}

	if (process.platform === 'darwin') {
		command = 'open';

		if (options.wait) {
			cliArguments.push('--wait-apps');
		}

		if (options.background) {
			cliArguments.push('--background');
		}

		if (app) {
			cliArguments.push('-a', app);
		}
	} else if (process.platform === 'win32' || (isWsl_1 && !isDocker_1())) {
		const mountPoint = await getWslDrivesMountPoint();

		command = isWsl_1 ?
			`${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` :
			`${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;

		cliArguments.push(
			'-NoProfile',
			'-NonInteractive',
			'–ExecutionPolicy',
			'Bypass',
			'-EncodedCommand'
		);

		if (!isWsl_1) {
			childProcessOptions.windowsVerbatimArguments = true;
		}

		const encodedArguments = ['Start'];

		if (options.wait) {
			encodedArguments.push('-Wait');
		}

		if (app) {
			// Double quote with double quotes to ensure the inner quotes are passed through.
			// Inner quotes are delimited for PowerShell interpretation with backticks.
			encodedArguments.push(`"\`"${app}\`""`, '-ArgumentList');
			appArguments.unshift(target);
		} else {
			encodedArguments.push(`"${target}"`);
		}

		if (appArguments.length > 0) {
			appArguments = appArguments.map(arg => `"\`"${arg}\`""`);
			encodedArguments.push(appArguments.join(','));
		}

		// Using Base64-encoded command, accepted by PowerShell, to allow special characters.
		target = Buffer.from(encodedArguments.join(' '), 'utf16le').toString('base64');
	} else {
		if (app) {
			command = app;
		} else {
			// When bundled by Webpack, there's no actual package file path and no local `xdg-open`.
			const isBundled = !__dirname || __dirname === '/';

			// Check if local `xdg-open` exists and is executable.
			let exeLocalXdgOpen = false;
			try {
				await pAccess(localXdgOpenPath, fs__default['default'].constants.X_OK);
				exeLocalXdgOpen = true;
			} catch (_) {}

			const useSystemXdgOpen = process.versions.electron ||
				process.platform === 'android' || isBundled || !exeLocalXdgOpen;
			command = useSystemXdgOpen ? 'xdg-open' : localXdgOpenPath;
		}

		if (appArguments.length > 0) {
			cliArguments.push(...appArguments);
		}

		if (!options.wait) {
			// `xdg-open` will block the process unless stdio is ignored
			// and it's detached from the parent even if it's unref'd.
			childProcessOptions.stdio = 'ignore';
			childProcessOptions.detached = true;
		}
	}

	cliArguments.push(target);

	if (process.platform === 'darwin' && appArguments.length > 0) {
		cliArguments.push('--args', ...appArguments);
	}

	const subprocess = childProcess__default['default'].spawn(command, cliArguments, childProcessOptions);

	if (options.wait) {
		return new Promise((resolve, reject) => {
			subprocess.once('error', reject);

			subprocess.once('close', exitCode => {
				if (options.allowNonzeroExitCode && exitCode > 0) {
					reject(new Error(`Exited with code ${exitCode}`));
					return;
				}

				resolve(subprocess);
			});
		});
	}

	subprocess.unref();

	return subprocess;
};

var SearchModal = /** @class */ (function (_super) {
    __extends(SearchModal, _super);
    function SearchModal(app, plugin, query) {
        var _this = _super.call(this, app) || this;
        _this.plugin = plugin;
        _this.setPlaceholder('');
        _this.query = query;
        _this.setInstructions([{ command: '↑↓', purpose: 'to navigate' },
            { command: '↵', purpose: "to search " + _this.query },
            { command: 'esc', purpose: 'to dismiss' }]);
        return _this;
    }
    SearchModal.prototype.onOpen = function () {
        _super.prototype.onOpen.call(this);
        // const {contentEl} = this;
        this.inputEl.focus();
    };
    SearchModal.prototype.onClose = function () {
        _super.prototype.onClose.call(this);
        var contentEl = this.contentEl;
        contentEl.empty();
    };
    SearchModal.prototype.getItemText = function (item) {
        return item.name;
    };
    SearchModal.prototype.renderSuggestion = function (item, el) {
        _super.prototype.renderSuggestion.call(this, item, el);
        el.innerHTML = "Search on: " + el.innerHTML;
    };
    SearchModal.prototype.getItems = function () {
        return this.plugin.settings.searches;
    };
    SearchModal.prototype.onChooseItem = function (item, evt) {
        this.plugin.openSearch(item, this.query);
    };
    return SearchModal;
}(obsidian.FuzzySuggestModal));

var SearchView = /** @class */ (function (_super) {
    __extends(SearchView, _super);
    function SearchView(plugin, leaf, query, site, url) {
        var _this = _super.call(this, leaf) || this;
        _this.query = query;
        _this.site = site;
        _this.url = url;
        _this.plugin = plugin;
        return _this;
    }
    SearchView.prototype.onOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.frame = document.createElement('iframe');
                this.frame.addClass("soi-site");
                this.frame.setAttr('style', 'height: 100%; width:100%');
                this.frame.setAttr('src', this.url);
                this.frame.setAttr('tabindex', '0');
                this.containerEl.children[1].appendChild(this.frame);
                return [2 /*return*/];
            });
        });
    };
    SearchView.prototype.getDisplayText = function () {
        return this.site + ": " + this.query;
    };
    SearchView.prototype.getViewType = function () {
        return 'Search on Internet';
    };
    return SearchView;
}(obsidian.ItemView));

var SearchOnInternetPlugin = /** @class */ (function (_super) {
    __extends(SearchOnInternetPlugin, _super);
    function SearchOnInternetPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearchOnInternetPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var plugin;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('loading search-on-internet');
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new SOISettingTab(this.app, this));
                        plugin = this;
                        this.registerEvent(this.app.workspace.on('file-menu', function (menu, file, source) {
                            var _a, _b;
                            if (file === null) {
                                return;
                            }
                            var fileTags = (_b = (_a = _this.app.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.map(function (t) { return t.tag; });
                            _this.settings.searches.forEach(function (search) {
                                if (search.tags.length === 0 ||
                                    (fileTags === null || fileTags === void 0 ? void 0 : fileTags.some(function (t) { return search.tags.contains(t); }))) {
                                    menu.addItem(function (item) {
                                        item.setTitle("Search " + search.name).setIcon('search')
                                            .onClick(function (evt) {
                                            plugin.openSearch(search, file.basename);
                                        });
                                    });
                                }
                            });
                        }));
                        this.addCommand({
                            id: 'search-on-internet',
                            name: 'Perform search',
                            callback: function () {
                                var query = _this.getSelectedText();
                                if (query === null || query === '') {
                                    var activeView = _this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                                    if (activeView == null) {
                                        return;
                                    }
                                    query = activeView.getDisplayText();
                                }
                                var modal = new SearchModal(plugin.app, plugin, query);
                                modal.open();
                            },
                        });
                        // Preview mode
                        this.onDom = function (event) {
                            var fileMenu = new obsidian.Menu(plugin.app);
                            // @ts-ignore
                            fileMenu.dom.classList.add('soi-file-menu');
                            // Functionality: Open external link in Iframe.
                            var emptyMenu = true;
                            if (event.target) {
                                // @ts-ignore
                                var classes = event.target.classList;
                                // @ts-ignore
                                if (classes.contains('cm-url') || classes.contains('external-link')) {
                                    // @ts-ignore
                                    var url_1 = classes.contains('cm-url') ? event.target.textContent : event.target.href;
                                    fileMenu.addItem(function (item) {
                                        item.setIcon('search').setTitle('Open in IFrame').onClick(function () {
                                            plugin.openSearch({
                                                tags: [],
                                                query: '{{query}}',
                                                name: '',
                                                encode: false,
                                            }, url_1, null);
                                        });
                                    });
                                    emptyMenu = false;
                                }
                            }
                            emptyMenu = emptyMenu && !plugin.handleContext(fileMenu);
                            if (!emptyMenu) {
                                fileMenu.showAtPosition({ x: event.x, y: event.y });
                                event.preventDefault();
                            }
                        };
                        this.onDomSettings = {};
                        document.on('contextmenu', '.markdown-preview-view', this.onDom, this.onDomSettings);
                        // Remove this ignore when the obsidian package is updated on npm
                        // Editor mode
                        // @ts-ignore
                        this.registerEvent(this.app.workspace.on('editor-menu', function (menu, editor, view) {
                            _this.handleContext(menu);
                        }));
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchOnInternetPlugin.prototype.getSelectedText = function () {
        var wSelection = window.getSelection();
        var docSelection = document === null || document === void 0 ? void 0 : document.getSelection();
        if (wSelection) {
            return wSelection.toString();
        }
        else if (document && docSelection.type != 'Control') {
            return docSelection.toString();
        }
        return null;
    };
    SearchOnInternetPlugin.prototype.handleContext = function (menu) {
        var _this = this;
        var query = this.getSelectedText();
        var hasSelection = !(query === null || query.trim() === '');
        if (!hasSelection) {
            return false;
        }
        var _loop_1 = function (searchsetting) {
            menu.addItem(function (item) {
                item.setTitle('Search on ' + searchsetting.name)
                    .setIcon('search')
                    .onClick(function (evt) { return _this.openSearch(searchsetting, query, null); });
            });
        };
        for (var _i = 0, _a = this.settings.searches; _i < _a.length; _i++) {
            var searchsetting = _a[_i];
            _loop_1(searchsetting);
        }
        return true;
    };
    SearchOnInternetPlugin.prototype.openSearch = function (search, query, activeView) {
        if (activeView === void 0) { activeView = null; }
        return __awaiter(this, void 0, void 0, function () {
            var encodedQuery, url, leaf, view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encodedQuery = query;
                        if (search.encode) {
                            encodedQuery = encodeURIComponent(query);
                        }
                        url = search.query.replace('{{title}}', encodedQuery)
                            .replace('{{query}}', encodedQuery);
                        console.log("SOI: Opening URL " + url);
                        if (!this.settings.useIframe) return [3 /*break*/, 4];
                        if (!activeView) return [3 /*break*/, 1];
                        activeView.frame.setAttr('src', url);
                        activeView.url = url;
                        return [3 /*break*/, 3];
                    case 1:
                        leaf = this.app.workspace.getLeaf(!(this.app.workspace.activeLeaf.view.getViewType() === 'empty'));
                        view = new SearchView(this, leaf, query, search.name, url);
                        return [4 /*yield*/, leaf.open(view)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, open(url)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SearchOnInternetPlugin.prototype.onunload = function () {
        console.log('unloading search-on-internet');
        document.off('contextmenu', '.markdown-preview-view', this.onDom, this.onDomSettings);
    };
    SearchOnInternetPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadedSettings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData()];
                    case 1:
                        loadedSettings = _a.sent();
                        if (loadedSettings && loadedSettings.hasOwnProperty('searches')) {
                            loadedSettings.searches = Array.from(loadedSettings.searches.map(function (s) { return Object.assign({}, DEFAULT_QUERY, s); }));
                            this.settings = loadedSettings;
                        }
                        else {
                            this.settings = DEFAULT_SETTING;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchOnInternetPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SearchOnInternetPlugin;
}(obsidian.Plugin));

module.exports = SearchOnInternetPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNldHRpbmdzLnRzIiwibm9kZV9tb2R1bGVzL2lzLWRvY2tlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy13c2wvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb3Blbi9pbmRleC5qcyIsIm1vZGFsLnRzIiwidmlldy50cyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBmcm9tKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7QXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgU2VhcmNoT25JbnRlcm5ldFBsdWdpbiBmcm9tICcuL21haW4nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlYXJjaFNldHRpbmcge1xuICAgIHRhZ3M6IHN0cmluZ1tdO1xuICAgIHF1ZXJ5OiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGVuY29kZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTT0lTZXR0aW5ncyB7XG4gICAgc2VhcmNoZXM6IFNlYXJjaFNldHRpbmdbXTtcbiAgICB1c2VJZnJhbWU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1FVRVJZOiBTZWFyY2hTZXR0aW5nID0ge1xuICB0YWdzOiBbXSxcbiAgcXVlcnk6ICd7e3F1ZXJ5fX0nLFxuICBuYW1lOiAnJyxcbiAgZW5jb2RlOiB0cnVlLFxufTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElORzogU09JU2V0dGluZ3MgPSB7XG4gIHNlYXJjaGVzOiBbe1xuICAgIHRhZ3M6IFtdIGFzIHN0cmluZ1tdLFxuICAgIHF1ZXJ5OiAnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/JnE9e3txdWVyeX19JyxcbiAgICBuYW1lOiAnR29vZ2xlJyxcbiAgICBlbmNvZGU6IHRydWUsXG4gIH0gYXMgU2VhcmNoU2V0dGluZywge1xuICAgIHRhZ3M6IFtdIGFzIHN0cmluZ1tdLFxuICAgIHF1ZXJ5OiAnaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU3BlY2lhbDpTZWFyY2gve3txdWVyeX19JyxcbiAgICBuYW1lOiAnV2lraXBlZGlhJyxcbiAgICBlbmNvZGU6IHRydWUsXG4gIH0gYXMgU2VhcmNoU2V0dGluZ10sXG4gIHVzZUlmcmFtZTogdHJ1ZSxcbn07XG5cbmNvbnN0IHBhcnNlVGFncyA9IGZ1bmN0aW9uKGlucHV0czogc3RyaW5nKTogc3RyaW5nW10ge1xuICByZXR1cm4gaW5wdXRzLnNwbGl0KCcsJylcbiAgICAgIC5tYXAoKHMpID0+IHMudHJpbSgpKVxuICAgICAgLmZpbHRlcigocykgPT4gL14jKFtBLVphLXpdKVxcdyskLy50ZXN0KHMpKTtcbn07XG5cblxuZXhwb3J0IGNsYXNzIFNPSVNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgICBwbHVnaW46IFNlYXJjaE9uSW50ZXJuZXRQbHVnaW47XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBTZWFyY2hPbkludGVybmV0UGx1Z2luKSB7XG4gICAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgY29uc3Qge2NvbnRhaW5lckVsfSA9IHRoaXM7XG5cbiAgICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2luO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAuc2V0TmFtZSgnT3BlbiBpbiBpZnJhbWUnKVxuICAgICAgICAgIC5zZXREZXNjKCdJZiBzZXQgdG8gdHJ1ZSwgdGhpcyB3aWxsIG9wZW4geW91ciBzZWFyY2hlcyBpbiBhbiBpZnJhbWUgd2l0aGluIE9ic2lkaWFuLiAnICtcbiAgICAgICAgICAgICAgICAnT3RoZXJ3aXNlLCBpdCB3aWxsIG9wZW4gaW4geW91ciBkZWZhdWx0IGJyb3dzZXIuJylcbiAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VJZnJhbWUpXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZUlmcmFtZSA9IG5ld192YWx1ZTtcbiAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgLy8gQ29kZSBtb3N0bHkgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vU2lsZW50Vm9pZDEzL1RlbXBsYXRlci9ibG9iL21hc3Rlci9zcmMvc2V0dGluZ3MudHNcbiAgICAgIHBsdWdpbi5zZXR0aW5ncy5zZWFyY2hlcy5mb3JFYWNoKChzZWFyY2gpID0+IHtcbiAgICAgICAgY29uc3QgZGl2ID0gY29udGFpbmVyRWwuY3JlYXRlRWwoJ2RpdicpO1xuICAgICAgICBkaXYuYWRkQ2xhc3MoJ3NvaV9kaXYnKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhkaXYpLy9cbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoZXh0cmEpID0+IHtcbiAgICAgICAgICAgICAgZXh0cmEuc2V0SWNvbignY3Jvc3MnKVxuICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoJ0RlbGV0ZScpXG4gICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGx1Z2luLnNldHRpbmdzLnNlYXJjaGVzLmluZGV4T2Yoc2VhcmNoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5zZWFyY2hlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIHJlZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRleHQuc2V0UGxhY2Vob2xkZXIoJ1NlYXJjaCBuYW1lJylcbiAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShzZWFyY2gubmFtZSlcbiAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBwbHVnaW4uc2V0dGluZ3Muc2VhcmNoZXMuaW5kZXhPZihzZWFyY2gpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaC5uYW1lID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgIC8vIHRpdGxlLnRleHRDb250ZW50ID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuc2V0TmFtZSgnTmFtZScpXG4gICAgICAgICAgICAuc2V0RGVzYygnTmFtZSBvZiB0aGUgc2VhcmNoLiBDbGljayB0aGUgY3Jvc3MgdG8gZGVsZXRlIHRoZSBzZWFyY2guJyk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoZGl2KVxuICAgICAgICAgICAgLnNldE5hbWUoJ0VuY29kZScpXG4gICAgICAgICAgICAuc2V0RGVzYygnSWYgc2V0IHRvIHRydWUsIHRoaXMgd2lsbCBlbmNvZGUgcmF3IHRleHQgdG8gYmUgdXNlZCBpbiBVUkxzLiAnICtcbiAgICAgICAgICAgICAgICAgICdPdGhlcndpc2UsIGl0IHdpbGwgbm90IGVuY29kZSB5b3VyIHF1ZXJ5LicpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHNlYXJjaC5lbmNvZGUpXG4gICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGx1Z2luLnNldHRpbmdzLnNlYXJjaGVzLmluZGV4T2Yoc2VhcmNoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzZWFyY2guZW5jb2RlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBuZXcgU2V0dGluZyhkaXYpXG4gICAgICAgICAgICAuYWRkVGV4dEFyZWEoKHRleHQpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdCA9IHRleHQuc2V0UGxhY2Vob2xkZXIoJ1NlYXJjaCBxdWVyeScpXG4gICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoc2VhcmNoLnF1ZXJ5KVxuICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdRdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHBsdWdpbi5zZXR0aW5ncy5zZWFyY2hlcy5pbmRleE9mKHNlYXJjaCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgc2VhcmNoLnF1ZXJ5ID0gbmV3UXVlcnk7XG4gICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdC5pbnB1dEVsLnNldEF0dHIoJ3Jvd3MnLCAyKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHQ7Ly9cbiAgICAgICAgICAgIH0pLnNldE5hbWUoJ1VSTCcpXG4gICAgICAgICAgICAuc2V0RGVzYygnVVJMIHRvIG9wZW4gd2hlbiBleGVjdXRpbmcgdGhlIHNlYXJjaC4gJyArXG4gICAgICAgICAgICAgICAgJ1VzZSB7e3F1ZXJ5fX0gdG8gcmVmZXIgdG8gdGhlIHF1ZXJ5LCB3aGljaCBpcyBlaXRoZXIgdGhlIHNlbGVjdGVkIHRleHQsIG9yIHRoZSB0aXRsZSBvZiBhIG5vdGUuJyk7XG4gICAgICAgIG5ldyBTZXR0aW5nKGRpdikuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0ZXh0LnNldFBsYWNlaG9sZGVyKCcnKVxuICAgICAgICAgICAgICAuc2V0VmFsdWUoc2VhcmNoLnRhZ3Muam9pbignLCAnKSlcbiAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGx1Z2luLnNldHRpbmdzLnNlYXJjaGVzLmluZGV4T2Yoc2VhcmNoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgc2VhcmNoLnRhZ3MgPSBwYXJzZVRhZ3MobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLnNldE5hbWUoJ1RhZ3MnKVxuICAgICAgICAgICAgLnNldERlc2MoJ09ubHkgYWRkIHNlYXJjaCB0byBub3RlcyB3aXRoIHRoZXNlIGNvbW1hLXNlcGFyYXRlZCB0YWdzLiBMZWF2ZSBlbXB0eSB0byB1c2UgYWxsIHRhZ3MuJyk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGl2ID0gY29udGFpbmVyRWwuY3JlYXRlRWwoJ2RpdicpO1xuICAgICAgZGl2LmFkZENsYXNzKCdzb2lfZGl2MicpO1xuXG4gICAgICBjb25zdCBzZXR0aW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uLnNldEJ1dHRvblRleHQoJ0FkZCBTZWFyY2gnKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnNlYXJjaGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgICAgICAgIHF1ZXJ5OiAnJyxcbiAgICAgICAgICAgICAgICB0YWdzOiBbXSxcbiAgICAgICAgICAgICAgICBlbmNvZGU6IHRydWUsXG4gICAgICAgICAgICAgIH0gYXMgU2VhcmNoU2V0dGluZyk7XG4gICAgICAgICAgICAgIC8vIEZvcmNlIHJlZnJlc2hcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIHNldHRpbmcuaW5mb0VsLnJlbW92ZSgpO1xuXG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoY29udGFpbmVyRWwubGFzdENoaWxkKTtcbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbmxldCBpc0RvY2tlcjtcblxuZnVuY3Rpb24gaGFzRG9ja2VyRW52KCkge1xuXHR0cnkge1xuXHRcdGZzLnN0YXRTeW5jKCcvLmRvY2tlcmVudicpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChfKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhhc0RvY2tlckNHcm91cCgpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gZnMucmVhZEZpbGVTeW5jKCcvcHJvYy9zZWxmL2Nncm91cCcsICd1dGY4JykuaW5jbHVkZXMoJ2RvY2tlcicpO1xuXHR9IGNhdGNoIChfKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuXHRpZiAoaXNEb2NrZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdGlzRG9ja2VyID0gaGFzRG9ja2VyRW52KCkgfHwgaGFzRG9ja2VyQ0dyb3VwKCk7XG5cdH1cblxuXHRyZXR1cm4gaXNEb2NrZXI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3QgaXNEb2NrZXIgPSByZXF1aXJlKCdpcy1kb2NrZXInKTtcblxuY29uc3QgaXNXc2wgPSAoKSA9PiB7XG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnbGludXgnKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKG9zLnJlbGVhc2UoKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdtaWNyb3NvZnQnKSkge1xuXHRcdGlmIChpc0RvY2tlcigpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHR0cnkge1xuXHRcdHJldHVybiBmcy5yZWFkRmlsZVN5bmMoJy9wcm9jL3ZlcnNpb24nLCAndXRmOCcpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ21pY3Jvc29mdCcpID9cblx0XHRcdCFpc0RvY2tlcigpIDogZmFsc2U7XG5cdH0gY2F0Y2ggKF8pIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG5cbmlmIChwcm9jZXNzLmVudi5fX0lTX1dTTF9URVNUX18pIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBpc1dzbDtcbn0gZWxzZSB7XG5cdG1vZHVsZS5leHBvcnRzID0gaXNXc2woKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHtwcm9taXNpZnl9ID0gcmVxdWlyZSgndXRpbCcpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IGlzV3NsID0gcmVxdWlyZSgnaXMtd3NsJyk7XG5jb25zdCBpc0RvY2tlciA9IHJlcXVpcmUoJ2lzLWRvY2tlcicpO1xuXG5jb25zdCBwQWNjZXNzID0gcHJvbWlzaWZ5KGZzLmFjY2Vzcyk7XG5jb25zdCBwUmVhZEZpbGUgPSBwcm9taXNpZnkoZnMucmVhZEZpbGUpO1xuXG4vLyBQYXRoIHRvIGluY2x1ZGVkIGB4ZGctb3BlbmAuXG5jb25zdCBsb2NhbFhkZ09wZW5QYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3hkZy1vcGVuJyk7XG5cbi8qKlxuR2V0IHRoZSBtb3VudCBwb2ludCBmb3IgZml4ZWQgZHJpdmVzIGluIFdTTC5cblxuQGlubmVyXG5AcmV0dXJucyB7c3RyaW5nfSBUaGUgbW91bnQgcG9pbnQuXG4qL1xuY29uc3QgZ2V0V3NsRHJpdmVzTW91bnRQb2ludCA9ICgoKSA9PiB7XG5cdC8vIERlZmF1bHQgdmFsdWUgZm9yIFwicm9vdFwiIHBhcmFtXG5cdC8vIGFjY29yZGluZyB0byBodHRwczovL2RvY3MubWljcm9zb2Z0LmNvbS9lbi11cy93aW5kb3dzL3dzbC93c2wtY29uZmlnXG5cdGNvbnN0IGRlZmF1bHRNb3VudFBvaW50ID0gJy9tbnQvJztcblxuXHRsZXQgbW91bnRQb2ludDtcblxuXHRyZXR1cm4gYXN5bmMgZnVuY3Rpb24gKCkge1xuXHRcdGlmIChtb3VudFBvaW50KSB7XG5cdFx0XHQvLyBSZXR1cm4gbWVtb2l6ZWQgbW91bnQgcG9pbnQgdmFsdWVcblx0XHRcdHJldHVybiBtb3VudFBvaW50O1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbmZpZ0ZpbGVQYXRoID0gJy9ldGMvd3NsLmNvbmYnO1xuXG5cdFx0bGV0IGlzQ29uZmlnRmlsZUV4aXN0cyA9IGZhbHNlO1xuXHRcdHRyeSB7XG5cdFx0XHRhd2FpdCBwQWNjZXNzKGNvbmZpZ0ZpbGVQYXRoLCBmcy5jb25zdGFudHMuRl9PSyk7XG5cdFx0XHRpc0NvbmZpZ0ZpbGVFeGlzdHMgPSB0cnVlO1xuXHRcdH0gY2F0Y2ggKF8pIHt9XG5cblx0XHRpZiAoIWlzQ29uZmlnRmlsZUV4aXN0cykge1xuXHRcdFx0cmV0dXJuIGRlZmF1bHRNb3VudFBvaW50O1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbmZpZ0NvbnRlbnQgPSBhd2FpdCBwUmVhZEZpbGUoY29uZmlnRmlsZVBhdGgsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG5cdFx0Y29uc3QgY29uZmlnTW91bnRQb2ludCA9IC9yb290XFxzKj1cXHMqKC4qKS9nLmV4ZWMoY29uZmlnQ29udGVudCk7XG5cblx0XHRpZiAoIWNvbmZpZ01vdW50UG9pbnQpIHtcblx0XHRcdHJldHVybiBkZWZhdWx0TW91bnRQb2ludDtcblx0XHR9XG5cblx0XHRtb3VudFBvaW50ID0gY29uZmlnTW91bnRQb2ludFsxXS50cmltKCk7XG5cdFx0bW91bnRQb2ludCA9IG1vdW50UG9pbnQuZW5kc1dpdGgoJy8nKSA/IG1vdW50UG9pbnQgOiBtb3VudFBvaW50ICsgJy8nO1xuXG5cdFx0cmV0dXJuIG1vdW50UG9pbnQ7XG5cdH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jICh0YXJnZXQsIG9wdGlvbnMpID0+IHtcblx0aWYgKHR5cGVvZiB0YXJnZXQgIT09ICdzdHJpbmcnKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBgdGFyZ2V0YCcpO1xuXHR9XG5cblx0b3B0aW9ucyA9IHtcblx0XHR3YWl0OiBmYWxzZSxcblx0XHRiYWNrZ3JvdW5kOiBmYWxzZSxcblx0XHRhbGxvd05vbnplcm9FeGl0Q29kZTogZmFsc2UsXG5cdFx0Li4ub3B0aW9uc1xuXHR9O1xuXG5cdGxldCBjb21tYW5kO1xuXHRsZXQge2FwcH0gPSBvcHRpb25zO1xuXHRsZXQgYXBwQXJndW1lbnRzID0gW107XG5cdGNvbnN0IGNsaUFyZ3VtZW50cyA9IFtdO1xuXHRjb25zdCBjaGlsZFByb2Nlc3NPcHRpb25zID0ge307XG5cblx0aWYgKEFycmF5LmlzQXJyYXkoYXBwKSkge1xuXHRcdGFwcEFyZ3VtZW50cyA9IGFwcC5zbGljZSgxKTtcblx0XHRhcHAgPSBhcHBbMF07XG5cdH1cblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcblx0XHRjb21tYW5kID0gJ29wZW4nO1xuXG5cdFx0aWYgKG9wdGlvbnMud2FpdCkge1xuXHRcdFx0Y2xpQXJndW1lbnRzLnB1c2goJy0td2FpdC1hcHBzJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMuYmFja2dyb3VuZCkge1xuXHRcdFx0Y2xpQXJndW1lbnRzLnB1c2goJy0tYmFja2dyb3VuZCcpO1xuXHRcdH1cblxuXHRcdGlmIChhcHApIHtcblx0XHRcdGNsaUFyZ3VtZW50cy5wdXNoKCctYScsIGFwcCk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgfHwgKGlzV3NsICYmICFpc0RvY2tlcigpKSkge1xuXHRcdGNvbnN0IG1vdW50UG9pbnQgPSBhd2FpdCBnZXRXc2xEcml2ZXNNb3VudFBvaW50KCk7XG5cblx0XHRjb21tYW5kID0gaXNXc2wgP1xuXHRcdFx0YCR7bW91bnRQb2ludH1jL1dpbmRvd3MvU3lzdGVtMzIvV2luZG93c1Bvd2VyU2hlbGwvdjEuMC9wb3dlcnNoZWxsLmV4ZWAgOlxuXHRcdFx0YCR7cHJvY2Vzcy5lbnYuU1lTVEVNUk9PVH1cXFxcU3lzdGVtMzJcXFxcV2luZG93c1Bvd2VyU2hlbGxcXFxcdjEuMFxcXFxwb3dlcnNoZWxsYDtcblxuXHRcdGNsaUFyZ3VtZW50cy5wdXNoKFxuXHRcdFx0Jy1Ob1Byb2ZpbGUnLFxuXHRcdFx0Jy1Ob25JbnRlcmFjdGl2ZScsXG5cdFx0XHQn4oCTRXhlY3V0aW9uUG9saWN5Jyxcblx0XHRcdCdCeXBhc3MnLFxuXHRcdFx0Jy1FbmNvZGVkQ29tbWFuZCdcblx0XHQpO1xuXG5cdFx0aWYgKCFpc1dzbCkge1xuXHRcdFx0Y2hpbGRQcm9jZXNzT3B0aW9ucy53aW5kb3dzVmVyYmF0aW1Bcmd1bWVudHMgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGNvbnN0IGVuY29kZWRBcmd1bWVudHMgPSBbJ1N0YXJ0J107XG5cblx0XHRpZiAob3B0aW9ucy53YWl0KSB7XG5cdFx0XHRlbmNvZGVkQXJndW1lbnRzLnB1c2goJy1XYWl0Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKGFwcCkge1xuXHRcdFx0Ly8gRG91YmxlIHF1b3RlIHdpdGggZG91YmxlIHF1b3RlcyB0byBlbnN1cmUgdGhlIGlubmVyIHF1b3RlcyBhcmUgcGFzc2VkIHRocm91Z2guXG5cdFx0XHQvLyBJbm5lciBxdW90ZXMgYXJlIGRlbGltaXRlZCBmb3IgUG93ZXJTaGVsbCBpbnRlcnByZXRhdGlvbiB3aXRoIGJhY2t0aWNrcy5cblx0XHRcdGVuY29kZWRBcmd1bWVudHMucHVzaChgXCJcXGBcIiR7YXBwfVxcYFwiXCJgLCAnLUFyZ3VtZW50TGlzdCcpO1xuXHRcdFx0YXBwQXJndW1lbnRzLnVuc2hpZnQodGFyZ2V0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZW5jb2RlZEFyZ3VtZW50cy5wdXNoKGBcIiR7dGFyZ2V0fVwiYCk7XG5cdFx0fVxuXG5cdFx0aWYgKGFwcEFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRhcHBBcmd1bWVudHMgPSBhcHBBcmd1bWVudHMubWFwKGFyZyA9PiBgXCJcXGBcIiR7YXJnfVxcYFwiXCJgKTtcblx0XHRcdGVuY29kZWRBcmd1bWVudHMucHVzaChhcHBBcmd1bWVudHMuam9pbignLCcpKTtcblx0XHR9XG5cblx0XHQvLyBVc2luZyBCYXNlNjQtZW5jb2RlZCBjb21tYW5kLCBhY2NlcHRlZCBieSBQb3dlclNoZWxsLCB0byBhbGxvdyBzcGVjaWFsIGNoYXJhY3RlcnMuXG5cdFx0dGFyZ2V0ID0gQnVmZmVyLmZyb20oZW5jb2RlZEFyZ3VtZW50cy5qb2luKCcgJyksICd1dGYxNmxlJykudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXHR9IGVsc2Uge1xuXHRcdGlmIChhcHApIHtcblx0XHRcdGNvbW1hbmQgPSBhcHA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFdoZW4gYnVuZGxlZCBieSBXZWJwYWNrLCB0aGVyZSdzIG5vIGFjdHVhbCBwYWNrYWdlIGZpbGUgcGF0aCBhbmQgbm8gbG9jYWwgYHhkZy1vcGVuYC5cblx0XHRcdGNvbnN0IGlzQnVuZGxlZCA9ICFfX2Rpcm5hbWUgfHwgX19kaXJuYW1lID09PSAnLyc7XG5cblx0XHRcdC8vIENoZWNrIGlmIGxvY2FsIGB4ZGctb3BlbmAgZXhpc3RzIGFuZCBpcyBleGVjdXRhYmxlLlxuXHRcdFx0bGV0IGV4ZUxvY2FsWGRnT3BlbiA9IGZhbHNlO1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0YXdhaXQgcEFjY2Vzcyhsb2NhbFhkZ09wZW5QYXRoLCBmcy5jb25zdGFudHMuWF9PSyk7XG5cdFx0XHRcdGV4ZUxvY2FsWGRnT3BlbiA9IHRydWU7XG5cdFx0XHR9IGNhdGNoIChfKSB7fVxuXG5cdFx0XHRjb25zdCB1c2VTeXN0ZW1YZGdPcGVuID0gcHJvY2Vzcy52ZXJzaW9ucy5lbGVjdHJvbiB8fFxuXHRcdFx0XHRwcm9jZXNzLnBsYXRmb3JtID09PSAnYW5kcm9pZCcgfHwgaXNCdW5kbGVkIHx8ICFleGVMb2NhbFhkZ09wZW47XG5cdFx0XHRjb21tYW5kID0gdXNlU3lzdGVtWGRnT3BlbiA/ICd4ZGctb3BlbicgOiBsb2NhbFhkZ09wZW5QYXRoO1xuXHRcdH1cblxuXHRcdGlmIChhcHBBcmd1bWVudHMubGVuZ3RoID4gMCkge1xuXHRcdFx0Y2xpQXJndW1lbnRzLnB1c2goLi4uYXBwQXJndW1lbnRzKTtcblx0XHR9XG5cblx0XHRpZiAoIW9wdGlvbnMud2FpdCkge1xuXHRcdFx0Ly8gYHhkZy1vcGVuYCB3aWxsIGJsb2NrIHRoZSBwcm9jZXNzIHVubGVzcyBzdGRpbyBpcyBpZ25vcmVkXG5cdFx0XHQvLyBhbmQgaXQncyBkZXRhY2hlZCBmcm9tIHRoZSBwYXJlbnQgZXZlbiBpZiBpdCdzIHVucmVmJ2QuXG5cdFx0XHRjaGlsZFByb2Nlc3NPcHRpb25zLnN0ZGlvID0gJ2lnbm9yZSc7XG5cdFx0XHRjaGlsZFByb2Nlc3NPcHRpb25zLmRldGFjaGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRjbGlBcmd1bWVudHMucHVzaCh0YXJnZXQpO1xuXG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyAmJiBhcHBBcmd1bWVudHMubGVuZ3RoID4gMCkge1xuXHRcdGNsaUFyZ3VtZW50cy5wdXNoKCctLWFyZ3MnLCAuLi5hcHBBcmd1bWVudHMpO1xuXHR9XG5cblx0Y29uc3Qgc3VicHJvY2VzcyA9IGNoaWxkUHJvY2Vzcy5zcGF3bihjb21tYW5kLCBjbGlBcmd1bWVudHMsIGNoaWxkUHJvY2Vzc09wdGlvbnMpO1xuXG5cdGlmIChvcHRpb25zLndhaXQpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0c3VicHJvY2Vzcy5vbmNlKCdlcnJvcicsIHJlamVjdCk7XG5cblx0XHRcdHN1YnByb2Nlc3Mub25jZSgnY2xvc2UnLCBleGl0Q29kZSA9PiB7XG5cdFx0XHRcdGlmIChvcHRpb25zLmFsbG93Tm9uemVyb0V4aXRDb2RlICYmIGV4aXRDb2RlID4gMCkge1xuXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoYEV4aXRlZCB3aXRoIGNvZGUgJHtleGl0Q29kZX1gKSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzb2x2ZShzdWJwcm9jZXNzKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0c3VicHJvY2Vzcy51bnJlZigpO1xuXG5cdHJldHVybiBzdWJwcm9jZXNzO1xufTtcbiIsImltcG9ydCB7QXBwLCBGdXp6eU1hdGNoLCBGdXp6eVN1Z2dlc3RNb2RhbCwgTW9kYWx9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7U2VhcmNoU2V0dGluZ30gZnJvbSAnLi9zZXR0aW5ncyc7XG5pbXBvcnQgU2VhcmNoT25JbnRlcm5ldFBsdWdpbiBmcm9tICcuL21haW4nO1xuXG5cbmV4cG9ydCBjbGFzcyBTZWFyY2hNb2RhbCBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPFNlYXJjaFNldHRpbmc+IHtcbiAgcGx1Z2luOiBTZWFyY2hPbkludGVybmV0UGx1Z2luO1xuICBxdWVyeTogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBTZWFyY2hPbkludGVybmV0UGx1Z2luLCBxdWVyeTogc3RyaW5nKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCcnKTtcbiAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgJyR7dGhpcy5xdWVyeX0nO1xuICAgIHRoaXMuc2V0SW5zdHJ1Y3Rpb25zKFt7Y29tbWFuZDogJ+KGkeKGkycsIHB1cnBvc2U6ICd0byBuYXZpZ2F0ZSd9LFxuICAgICAge2NvbW1hbmQ6ICfihrUnLCBwdXJwb3NlOiBgdG8gc2VhcmNoICR7dGhpcy5xdWVyeX1gfSxcbiAgICAgIHtjb21tYW5kOiAnZXNjJywgcHVycG9zZTogJ3RvIGRpc21pc3MnfV0pO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIHN1cGVyLm9uT3BlbigpO1xuICAgIC8vIGNvbnN0IHtjb250ZW50RWx9ID0gdGhpcztcbiAgICB0aGlzLmlucHV0RWwuZm9jdXMoKTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7XG4gICAgc3VwZXIub25DbG9zZSgpO1xuICAgIGNvbnN0IHtjb250ZW50RWx9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgfVxuXG5cbiAgZ2V0SXRlbVRleHQoaXRlbTogU2VhcmNoU2V0dGluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGl0ZW0ubmFtZTtcbiAgfVxuXG4gIHJlbmRlclN1Z2dlc3Rpb24oaXRlbTogRnV6enlNYXRjaDxTZWFyY2hTZXR0aW5nPiwgZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgc3VwZXIucmVuZGVyU3VnZ2VzdGlvbihpdGVtLCBlbCk7XG4gICAgZWwuaW5uZXJIVE1MID0gYFNlYXJjaCBvbjogYCArIGVsLmlubmVySFRNTDtcbiAgfVxuXG4gIGdldEl0ZW1zKCk6IFNlYXJjaFNldHRpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlYXJjaGVzO1xuICB9XG5cbiAgb25DaG9vc2VJdGVtKGl0ZW06IFNlYXJjaFNldHRpbmcsIGV2dDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnBsdWdpbi5vcGVuU2VhcmNoKGl0ZW0sIHRoaXMucXVlcnkpO1xuICB9XG59XG4iLCJpbXBvcnQge0l0ZW1WaWV3LCBXb3Jrc3BhY2VMZWFmfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgU2VhcmNoT25JbnRlcm5ldFBsdWdpbiBmcm9tICcuL21haW4nO1xuXG5leHBvcnQgY2xhc3MgU2VhcmNoVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgICBxdWVyeTogc3RyaW5nO1xuICAgIHNpdGU6IHN0cmluZztcbiAgICB1cmw6IHN0cmluZztcbiAgICBwbHVnaW46IFNlYXJjaE9uSW50ZXJuZXRQbHVnaW47XG5cbiAgICBmcmFtZTogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihwbHVnaW46IFNlYXJjaE9uSW50ZXJuZXRQbHVnaW4sIGxlYWY6IFdvcmtzcGFjZUxlYWYsIHF1ZXJ5OiBzdHJpbmcsIHNpdGU6IHN0cmluZywgdXJsOiBzdHJpbmcpIHtcbiAgICAgIHN1cGVyKGxlYWYpO1xuICAgICAgdGhpcy5xdWVyeT0gcXVlcnk7XG4gICAgICB0aGlzLnNpdGUgPSBzaXRlO1xuICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBhc3luYyBvbk9wZW4oKSB7XG4gICAgICB0aGlzLmZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgICB0aGlzLmZyYW1lLmFkZENsYXNzKGBzb2ktc2l0ZWApO1xuICAgICAgdGhpcy5mcmFtZS5zZXRBdHRyKCdzdHlsZScsICdoZWlnaHQ6IDEwMCU7IHdpZHRoOjEwMCUnKTtcbiAgICAgIHRoaXMuZnJhbWUuc2V0QXR0cignc3JjJywgdGhpcy51cmwpO1xuICAgICAgdGhpcy5mcmFtZS5zZXRBdHRyKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICB0aGlzLmNvbnRhaW5lckVsLmNoaWxkcmVuWzFdLmFwcGVuZENoaWxkKHRoaXMuZnJhbWUpO1xuXG5cbiAgICAgIC8vIFR1cm5zIG91dCBJRnJhbWVzIGFyZSB2ZXJ5IGhhcmQgdG8gY29udHJvbCB0aGUgY29udGV4dG1lbnUgb2YuIFNvIGxlYXZpbmcgdGhpcyBmb3Igbm93IVxuICAgICAgLy8gdGhpcy5mcmFtZS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlKSA9PiB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdhc2RmJyk7XG4gICAgICAvLyAgIHRoaXMucGx1Z2luLmhhbmRsZUNvbnRleHQoZSwgdGhpcyk7XG4gICAgICAvLyB9KTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIGAke3RoaXMuc2l0ZX06ICR7dGhpcy5xdWVyeX1gO1xuICAgIH1cblxuICAgIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gJ1NlYXJjaCBvbiBJbnRlcm5ldCc7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtFZGl0b3IsIEV2ZW50UmVmLCBNYXJrZG93blByZXZpZXdWaWV3LCBNYXJrZG93blZpZXcsIE1lbnUsIE1lbnVJdGVtLCBOb3RpY2UsIFBsdWdpbiwgVEZpbGV9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7U09JU2V0dGluZ1RhYiwgU09JU2V0dGluZ3MsIERFRkFVTFRfU0VUVElORywgU2VhcmNoU2V0dGluZywgREVGQVVMVF9RVUVSWX0gZnJvbSAnLi9zZXR0aW5ncyc7XG5pbXBvcnQgb3BlbiBmcm9tICdvcGVuJztcbmltcG9ydCB7U2VhcmNoTW9kYWx9IGZyb20gJy4vbW9kYWwnO1xuaW1wb3J0IHtTZWFyY2hWaWV3fSBmcm9tICcuL3ZpZXcnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaE9uSW50ZXJuZXRQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAgIHNldHRpbmdzOiBTT0lTZXR0aW5ncztcbiAgICBvbkRvbTogYW55O1xuICAgIG9uRG9tU2V0dGluZ3M6IGFueTtcblxuICAgIGFzeW5jIG9ubG9hZCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdsb2FkaW5nIHNlYXJjaC1vbi1pbnRlcm5ldCcpO1xuXG4gICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNPSVNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IHRoaXM7XG4gICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXG4gICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKCdmaWxlLW1lbnUnLCAobWVudSwgZmlsZTogVEZpbGUsIHNvdXJjZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmaWxlVGFncyA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpXG4gICAgICAgICAgICAgICAgPy50YWdzPy5tYXAoKHQpID0+IHQudGFnKTtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc2VhcmNoZXMuZm9yRWFjaCgoc2VhcmNoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChzZWFyY2gudGFncy5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVUYWdzPy5zb21lKCh0KSA9PiBzZWFyY2gudGFncy5jb250YWlucyh0KSkpIHtcbiAgICAgICAgICAgICAgICBtZW51LmFkZEl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0VGl0bGUoYFNlYXJjaCAke3NlYXJjaC5uYW1lfWApLnNldEljb24oJ3NlYXJjaCcpXG4gICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLm9wZW5TZWFyY2goc2VhcmNoLCBmaWxlLmJhc2VuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkpO1xuXG4gICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICBpZDogJ3NlYXJjaC1vbi1pbnRlcm5ldCcsXG4gICAgICAgIG5hbWU6ICdQZXJmb3JtIHNlYXJjaCcsXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgbGV0IHF1ZXJ5ID0gdGhpcy5nZXRTZWxlY3RlZFRleHQoKTtcblxuICAgICAgICAgIGlmIChxdWVyeSA9PT0gbnVsbCB8fCBxdWVyeSA9PT0gJycpIHtcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZVZpZXcgPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWVyeSA9IGFjdGl2ZVZpZXcuZ2V0RGlzcGxheVRleHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbW9kYWwgPSBuZXcgU2VhcmNoTW9kYWwocGx1Z2luLmFwcCwgcGx1Z2luLCBxdWVyeSk7XG4gICAgICAgICAgbW9kYWwub3BlbigpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFByZXZpZXcgbW9kZVxuICAgICAgdGhpcy5vbkRvbSA9IGZ1bmN0aW9uKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGZpbGVNZW51ID0gbmV3IE1lbnUocGx1Z2luLmFwcCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZmlsZU1lbnUuZG9tLmNsYXNzTGlzdC5hZGQoJ3NvaS1maWxlLW1lbnUnKTtcbiAgICAgICAgLy8gRnVuY3Rpb25hbGl0eTogT3BlbiBleHRlcm5hbCBsaW5rIGluIElmcmFtZS5cbiAgICAgICAgbGV0IGVtcHR5TWVudSA9IHRydWU7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQpIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgY29uc3QgY2xhc3NlczogRE9NVG9rZW5MaXN0ID0gZXZlbnQudGFyZ2V0LmNsYXNzTGlzdDtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgaWYgKGNsYXNzZXMuY29udGFpbnMoJ2NtLXVybCcpIHx8IGNsYXNzZXMuY29udGFpbnMoJ2V4dGVybmFsLWxpbmsnKSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uc3QgdXJsID0gY2xhc3Nlcy5jb250YWlucygnY20tdXJsJykgPyBldmVudC50YXJnZXQudGV4dENvbnRlbnQgOiBldmVudC50YXJnZXQuaHJlZjtcblxuICAgICAgICAgICAgZmlsZU1lbnUuYWRkSXRlbSgoaXRlbTogTWVudUl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgaXRlbS5zZXRJY29uKCdzZWFyY2gnKS5zZXRUaXRsZSgnT3BlbiBpbiBJRnJhbWUnKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICBwbHVnaW4ub3BlblNlYXJjaCh7XG4gICAgICAgICAgICAgICAgICB0YWdzOiBbXSxcbiAgICAgICAgICAgICAgICAgIHF1ZXJ5OiAne3txdWVyeX19JyxcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgICAgICAgICAgZW5jb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9LCB1cmwsIG51bGwpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZW1wdHlNZW51ID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVtcHR5TWVudSA9IGVtcHR5TWVudSAmJiAhcGx1Z2luLmhhbmRsZUNvbnRleHQoZmlsZU1lbnUpO1xuICAgICAgICBpZiAoIWVtcHR5TWVudSkge1xuICAgICAgICAgIGZpbGVNZW51LnNob3dBdFBvc2l0aW9uKHt4OiBldmVudC54LCB5OiBldmVudC55fSk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHRoaXMub25Eb21TZXR0aW5ncyA9IHt9O1xuICAgICAgZG9jdW1lbnQub24oJ2NvbnRleHRtZW51JywgJy5tYXJrZG93bi1wcmV2aWV3LXZpZXcnLCB0aGlzLm9uRG9tLCB0aGlzLm9uRG9tU2V0dGluZ3MpO1xuXG5cbiAgICAgIC8vIFJlbW92ZSB0aGlzIGlnbm9yZSB3aGVuIHRoZSBvYnNpZGlhbiBwYWNrYWdlIGlzIHVwZGF0ZWQgb24gbnBtXG4gICAgICAvLyBFZGl0b3IgbW9kZVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbignZWRpdG9yLW1lbnUnLFxuICAgICAgICAgIChtZW51OiBNZW51LCBlZGl0b3I6IEVkaXRvciwgdmlldzogTWFya2Rvd25WaWV3KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNvbnRleHQobWVudSApO1xuICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBnZXRTZWxlY3RlZFRleHQoKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IHdTZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBjb25zdCBkb2NTZWxlY3Rpb24gPSBkb2N1bWVudD8uZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBpZiAod1NlbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gd1NlbGVjdGlvbi50b1N0cmluZygpO1xuICAgICAgfSBlbHNlIGlmIChkb2N1bWVudCAmJiBkb2NTZWxlY3Rpb24udHlwZSAhPSAnQ29udHJvbCcpIHtcbiAgICAgICAgcmV0dXJuIGRvY1NlbGVjdGlvbi50b1N0cmluZygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaGFuZGxlQ29udGV4dChtZW51OiBNZW51KTogYm9vbGVhbiB7XG4gICAgICBjb25zdCBxdWVyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRUZXh0KCk7XG4gICAgICBjb25zdCBoYXNTZWxlY3Rpb24gPSAhKHF1ZXJ5ID09PSBudWxsIHx8IHF1ZXJ5LnRyaW0oKSA9PT0gJycpO1xuICAgICAgaWYgKCFoYXNTZWxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBzZWFyY2hzZXR0aW5nIG9mIHRoaXMuc2V0dGluZ3Muc2VhcmNoZXMpIHtcbiAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtOiBNZW51SXRlbSkgPT4ge1xuICAgICAgICAgIGl0ZW0uc2V0VGl0bGUoJ1NlYXJjaCBvbiAnICsgc2VhcmNoc2V0dGluZy5uYW1lKVxuICAgICAgICAgICAgICAuc2V0SWNvbignc2VhcmNoJylcbiAgICAgICAgICAgICAgLm9uQ2xpY2soKGV2dDogTW91c2VFdmVudCkgPT4gdGhpcy5vcGVuU2VhcmNoKHNlYXJjaHNldHRpbmcsIHF1ZXJ5LCBudWxsKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgb3BlblNlYXJjaChzZWFyY2g6IFNlYXJjaFNldHRpbmcsIHF1ZXJ5OiBzdHJpbmcsIGFjdGl2ZVZpZXc6IFNlYXJjaFZpZXc9bnVsbCkge1xuICAgICAgbGV0IGVuY29kZWRRdWVyeSA9IHF1ZXJ5O1xuICAgICAgaWYgKHNlYXJjaC5lbmNvZGUpIHtcbiAgICAgICAgZW5jb2RlZFF1ZXJ5PSBlbmNvZGVVUklDb21wb25lbnQocXVlcnkpO1xuICAgICAgfVxuICAgICAgY29uc3QgdXJsID0gc2VhcmNoLnF1ZXJ5LnJlcGxhY2UoJ3t7dGl0bGV9fScsIGVuY29kZWRRdWVyeSlcbiAgICAgICAgICAucmVwbGFjZSgne3txdWVyeX19JywgZW5jb2RlZFF1ZXJ5KTtcbiAgICAgIGNvbnNvbGUubG9nKGBTT0k6IE9wZW5pbmcgVVJMICR7dXJsfWApO1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudXNlSWZyYW1lKSB7XG4gICAgICAgIGlmIChhY3RpdmVWaWV3KSB7XG4gICAgICAgICAgYWN0aXZlVmlldy5mcmFtZS5zZXRBdHRyKCdzcmMnLCB1cmwpO1xuICAgICAgICAgIGFjdGl2ZVZpZXcudXJsID0gdXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZighKHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXcuZ2V0Vmlld1R5cGUoKSA9PT0gJ2VtcHR5JykpO1xuICAgICAgICAgIC8vIGNvbnN0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2Uuc3BsaXRBY3RpdmVMZWFmKHRoaXMuc2V0dGluZ3Muc3BsaXREaXJlY3Rpb24pO1xuICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgU2VhcmNoVmlldyh0aGlzLCBsZWFmLCBxdWVyeSwgc2VhcmNoLm5hbWUsIHVybCk7XG4gICAgICAgICAgYXdhaXQgbGVhZi5vcGVuKHZpZXcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBvcGVuKHVybCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgb251bmxvYWQoKSB7XG4gICAgICBjb25zb2xlLmxvZygndW5sb2FkaW5nIHNlYXJjaC1vbi1pbnRlcm5ldCcpO1xuICAgICAgZG9jdW1lbnQub2ZmKCdjb250ZXh0bWVudScsICcubWFya2Rvd24tcHJldmlldy12aWV3JywgdGhpcy5vbkRvbSwgdGhpcy5vbkRvbVNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgICBjb25zdCBsb2FkZWRTZXR0aW5ncyA9IGF3YWl0IHRoaXMubG9hZERhdGEoKSBhcyBhbnk7XG4gICAgICBpZiAobG9hZGVkU2V0dGluZ3MgJiYgbG9hZGVkU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ3NlYXJjaGVzJykpIHtcbiAgICAgICAgbG9hZGVkU2V0dGluZ3Muc2VhcmNoZXMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbG9hZGVkU2V0dGluZ3Muc2VhcmNoZXMubWFwKFxuICAgICAgICAgICAgICAgIChzOiBTZWFyY2hTZXR0aW5nKSA9PiBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1FVRVJZLCBzKSkpO1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gbG9hZGVkU2V0dGluZ3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gREVGQVVMVF9TRVRUSU5HO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gICAgfVxufVxuXG5cbiJdLCJuYW1lcyI6WyJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiIsImZzIiwib3MiLCJpc0RvY2tlciIsInJlcXVpcmUkJDAiLCJwYXRoIiwiaXNXc2wiLCJjaGlsZFByb2Nlc3MiLCJGdXp6eVN1Z2dlc3RNb2RhbCIsIkl0ZW1WaWV3IiwiTWFya2Rvd25WaWV3IiwiTWVudSIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxLQUFLLElBQUk7QUFDN0MsUUFBUSxNQUFNLElBQUksU0FBUyxDQUFDLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2xHLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQXVDRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekssWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzlDLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDeEUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FB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

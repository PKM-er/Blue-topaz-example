'use strict';

var obsidian = require('obsidian');

/******************************************************************************
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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function formatContent(content) {
    return content.split('\n');
}
function getAllExpandersQuery(content) {
    var accum = [];
    for (var i = 0; i < content.length; i++) {
        var line = content[i];
        if (line === '```expander') {
            for (var e = 0; e < content.length - i; e++) {
                var nextline = content[i + e];
                if (nextline === '```') {
                    accum.push({
                        start: i,
                        end: i + e,
                        query: content[i + 1],
                        template: e > 2 ? content.slice(i + 2, i + e).join('\n') : ''
                    });
                    break;
                }
            }
        }
    }
    return accum;
}
function getClosestQuery(queries, lineNumber) {
    if (queries.length === 0) {
        return undefined;
    }
    return queries.reduce(function (a, b) {
        return Math.abs(b.start - lineNumber) < Math.abs(a.start - lineNumber) ? b : a;
    });
}
function getLastLineToReplace(content, query, endline) {
    var lineFrom = query.end;
    for (var i = lineFrom + 1; i < content.length; i++) {
        if (content[i] === endline) {
            return i;
        }
    }
    return lineFrom + 1;
}
function trimContent(s) {
    var removeEmptyLines = function (s) {
        var lines = s.split('\n').map(function (e) { return e.trim(); });
        if (lines.length < 2) {
            return s;
        }
        if (lines.indexOf('') === 0) {
            return removeEmptyLines(lines.slice(1).join('\n'));
        }
        return s;
    };
    var removeFrontMatter = function (s, lookEnding) {
        if (lookEnding === void 0) { lookEnding = false; }
        var lines = s.split('\n');
        if (lookEnding && lines.indexOf('---') === 0) {
            return lines.slice(1).join('\n');
        }
        if (lookEnding) {
            return removeFrontMatter(lines.slice(1).join('\n'), true);
        }
        if (lines.indexOf('---') === 0) {
            return removeFrontMatter(lines.slice(1).join('\n'), true);
        }
        return s;
    };
    return removeFrontMatter(removeEmptyLines(s));
}

function highlight(lineStart, lineEnd, matchStart, matchEnd, lineContent) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(lineContent.slice(0, matchStart - lineStart)), false), [
        '=='
    ], false), __read(lineContent.slice(matchStart - lineStart, (matchStart - lineStart) + (matchEnd - matchStart))), false), [
        '=='
    ], false), __read(lineContent.slice((matchStart - lineStart) + (matchEnd - matchStart))), false).join('');
}
var sequences = [
    {
        name: '\\$count',
        loop: true,
        format: function (_p, _s, _content, _file, _d, index) { return index ? String(index + 1) : String(1); },
        desc: 'add index number to each produced file'
    },
    {
        name: '\\$filename',
        loop: true,
        format: function (_p, _s, _content, file) { return file.basename; },
        desc: 'name of the founded file'
    },
    {
        name: '\\$link',
        loop: true,
        format: function (p, _s, _content, file) { return p.app.fileManager.generateMarkdownLink(file, file.path); },
        desc: 'link based on Obsidian settings'
    },
    {
        name: '\\$lines:\\d+',
        loop: true,
        readContent: true,
        format: function (p, s, content, _file) {
            var digits = Number(s.split(':')[1]);
            return trimContent(content)
                .split('\n')
                .filter(function (_, i) { return i < digits; })
                .join('\n')
                .replace(new RegExp(p.config.lineEnding, 'g'), '');
        },
        desc: 'specified count of lines from the found file'
    },
    {
        name: '\\$characters:\\d+',
        loop: true,
        readContent: true,
        format: function (p, s, content, _file) {
            var digits = Number(s.split(':')[1]);
            return trimContent(content)
                .split('')
                .filter(function (_, i) { return i < digits; })
                .join('')
                .replace(new RegExp(p.config.lineEnding, 'g'), '');
        },
        desc: 'specified count of lines from the found file'
    },
    {
        name: '\\$frontmatter:[\\p\{L\}_-]+',
        loop: true,
        format: function (p, s, _content, file) { return p.getFrontMatter(s, file); },
        desc: 'value from the frontmatter key in the found file'
    },
    {
        name: '\\$lines+',
        loop: true,
        readContent: true,
        format: function (p, s, content, _file) { return content.replace(new RegExp(p.config.lineEnding, 'g'), ''); },
        desc: 'all content from the found file'
    },
    {
        name: '\\$ext',
        loop: true,
        format: function (_p, s, content, file) { return file.extension; },
        desc: 'return file extension'
    },
    {
        name: '\\$created:format:date',
        loop: true,
        format: function (_p, s, content, file) { return String(new Date(file.stat.ctime).toISOString()).split('T')[0]; },
        desc: 'created time formatted'
    },
    {
        name: '\\$created:format:time',
        loop: true,
        format: function (_p, s, content, file) { return String(new Date(file.stat.ctime).toISOString()).split(/([.T])/)[2]; },
        desc: 'created time formatted'
    },
    {
        name: '\\$created:format',
        loop: true,
        format: function (_p, s, content, file) { return String(new Date(file.stat.ctime).toISOString()); },
        desc: 'created time formatted'
    },
    {
        name: '\\$created',
        loop: true,
        format: function (_p, s, content, file) { return String(file.stat.ctime); },
        desc: 'created time'
    },
    {
        name: '\\$size',
        loop: true,
        format: function (_p, s, content, file) { return String(file.stat.size); },
        desc: 'size of the file'
    },
    {
        name: '\\$path',
        loop: true,
        format: function (_p, s, content, file) { return file.path; },
        desc: 'path to the found file'
    },
    {
        name: '\\$parent',
        loop: true,
        format: function (_p, s, content, file) { return file.parent.name; },
        desc: 'parent folder name'
    },
    {
        name: '^(.+|)\\$header:.+',
        loop: true,
        format: function (p, s, content, file) {
            var _a;
            var prefix = s.slice(0, s.indexOf('$'));
            var header = s.slice(s.indexOf('$')).replace('$header:', '').replace(/"/g, '');
            var neededLevel = header.split("#").length - 1;
            var neededTitle = header.replace(/^#+/g, '').trim();
            var metadata = p.app.metadataCache.getFileCache(file);
            return ((_a = metadata.headings) === null || _a === void 0 ? void 0 : _a.filter(function (e) {
                var tests = [
                    [neededTitle, e.heading.includes(neededTitle)],
                    [neededLevel, e.level === neededLevel]
                ].filter(function (e) { return e[0]; });
                if (tests.length) {
                    return tests.map(function (e) { return e[1]; }).every(function (e) { return e === true; });
                }
                return true;
            }).map(function (h) { return p.app.fileManager.generateMarkdownLink(file, file.basename, '#' + h.heading); }).map(function (link) { return prefix + link; }).join('\n')) || '';
        },
        desc: 'headings from founded files. $header:## - return all level 2 headings. $header:Title - return all heading which match the string. Can be prepended like: - !$header:## to transclude the headings.'
    },
    {
        name: '^(.+|)\\$blocks',
        readContent: true,
        loop: true,
        format: function (p, s, content, file) {
            var prefix = s.slice(0, s.indexOf('$'));
            return content
                .split('\n')
                .filter(function (e) { return /\^\w+$/.test(e); })
                .map(function (e) {
                return prefix + p.app.fileManager.generateMarkdownLink(file, file.basename, '#' + e.replace(/^.+?(\^\w+$)/, '$1'));
            })
                .join('\n');
        },
        desc: 'block ids from the found files. Can be prepended.'
    },
    {
        name: '^(.+|)\\$match:header', loop: true, format: function (p, s, content, file, results) {
            var _a;
            var prefix = s.slice(0, s.indexOf('$'));
            var metadata = p.app.metadataCache.getFileCache(file);
            var headings = (_a = metadata.headings) === null || _a === void 0 ? void 0 : _a.filter(function (h) { return results.result.content.filter(function (c) { return h.position.end.offset < c[0]; }).some(function (e) { return e; }); }).slice(-1);
            return headings
                .map(function (h) { return p.app.fileManager.generateMarkdownLink(file, file.path, '#' + h.heading); })
                .map(function (link) { return prefix + link; })
                .join('\n') || '';
        }, desc: 'extract found selections'
    },
    {
        name: '^(.+|)\\$matchline(:(\\+|-|)\\d+:\\d+|:(\\+|-|)\\d+|)',
        loop: true,
        format: function (_p, s, content, file, results) {
            var prefix = s.slice(0, s.indexOf('$matchline'));
            var _a = __read(s.slice(s.indexOf('$matchline')).split(':'), 3); _a[0]; var context = _a[1], limit = _a[2];
            var value = context || '';
            var limitValue = Number(limit);
            var isPlus = value.contains('+');
            var isMinus = value.contains('-');
            var isContext = !isPlus && !isMinus;
            var offset = Number(value.replace(/[+-]/, ''));
            var lines = results.content.split('\n');
            // Grab info about line content, index, text length and start/end character position
            var lineInfos = [];
            for (var i = 0; i < lines.length; i++) {
                var text = lines[i];
                if (i === 0) {
                    lineInfos.push({
                        num: 0,
                        start: 0,
                        end: text.length,
                        text: text
                    });
                    continue;
                }
                var start = lineInfos[i - 1].end + 1;
                lineInfos.push({
                    num: i,
                    start: start,
                    text: text,
                    end: text.length + start
                });
            }
            return results.result.content.map(function (_a) {
                var e_1, _b;
                var _c = __read(_a, 2), from = _c[0], to = _c[1];
                var matchedLines = lineInfos
                    .filter(function (_a) {
                    var start = _a.start, end = _a.end;
                    return start <= from && end >= to;
                })
                    .map(function (line) {
                    return __assign(__assign({}, line), { text: highlight(line.start, line.end, from, to, line.text) });
                });
                var resultLines = [];
                var _loop_1 = function (matchedLine) {
                    var prevLines = isMinus || isContext
                        ? lineInfos.filter(function (l) { return matchedLine.num - l.num > 0 && matchedLine.num - l.num < offset; })
                        : [];
                    var nextLines = isPlus || isContext
                        ? lineInfos.filter(function (l) { return l.num - matchedLine.num > 0 && l.num - matchedLine.num < offset; })
                        : [];
                    resultLines.push.apply(resultLines, __spreadArray(__spreadArray(__spreadArray([], __read(prevLines), false), [matchedLine], false), __read(nextLines), false));
                };
                try {
                    for (var matchedLines_1 = __values(matchedLines), matchedLines_1_1 = matchedLines_1.next(); !matchedLines_1_1.done; matchedLines_1_1 = matchedLines_1.next()) {
                        var matchedLine = matchedLines_1_1.value;
                        _loop_1(matchedLine);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (matchedLines_1_1 && !matchedLines_1_1.done && (_b = matchedLines_1.return)) _b.call(matchedLines_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return prefix + resultLines.map(function (e) { return e.text; }).join('\n');
            }).map(function (line) { return limitValue ? line.slice(0, limitValue) : line; }).join('\n');
        }, desc: 'extract line with matches'
    },
    {
        name: '^(.+|)\\$searchresult',
        loop: true,
        desc: '',
        format: function (_p, s, content, file, results) {
            var prefix = s.slice(0, s.indexOf('$searchresult'));
            return results.children.map(function (matchedFile) {
                return prefix + matchedFile.el.innerText;
            }).join('\n');
        }
    },
    {
        name: '^(.+|)\\$match', loop: true, format: function (_p, s, content, file, results) {
            if (!results.result.content) {
                console.warn('There is no content in results');
                return '';
            }
            function appendPrefix(prefix, line) {
                return prefix + line;
            }
            var prefixContent = s.slice(0, s.indexOf('$'));
            return results.result.content
                .map(function (_a) {
                var _b = __read(_a, 2), from = _b[0], to = _b[1];
                return results.content.slice(from, to);
            })
                .map(function (line) { return appendPrefix(prefixContent, line); })
                .join('\n');
        }, desc: 'extract found selections'
    },
];

var TextExpander = /** @class */ (function (_super) {
    __extends(TextExpander, _super);
    function TextExpander(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.config = {
            autoExpand: false,
            defaultTemplate: '- $link',
            delay: 300,
            excludeCurrent: true,
            lineEnding: '<-->',
            prefixes: {
                header: '^',
                footer: '>'
            }
        };
        _this.seqs = sequences;
        _this.search = _this.search.bind(_this);
        _this.initExpander = _this.initExpander.bind(_this);
        _this.reformatLinks = _this.reformatLinks.bind(_this);
        return _this;
    }
    TextExpander.prototype.getFrontMatter = function (s, r) {
        var _a = this.app.metadataCache.getCache(r.path).frontmatter, frontmatter = _a === void 0 ? null : _a;
        if (frontmatter) {
            return frontmatter[s.split(':')[1]] || '';
        }
        return '';
    };
    TextExpander.prototype.reformatLinks = function (links, mapFunc) {
        var _a, _b, _c, _d;
        if (mapFunc === void 0) { mapFunc = function (s) { return '[[' + s + ']]'; }; }
        var currentView = this.app.workspace.activeLeaf.view;
        if (currentView instanceof obsidian.FileView) {
            return (_b = (_a = links === null || links === void 0 ? void 0 : links.map(function (e) { return e.basename; }).filter(function (e) { return currentView.file.basename !== e; })) === null || _a === void 0 ? void 0 : _a.map(mapFunc)) === null || _b === void 0 ? void 0 : _b.join('\n');
        }
        return (_d = (_c = links === null || links === void 0 ? void 0 : links.map(function (e) { return e.basename; })) === null || _c === void 0 ? void 0 : _c.map(mapFunc)) === null || _d === void 0 ? void 0 : _d.join('\n');
    };
    TextExpander.prototype.search = function (s) {
        // @ts-ignore
        var globalSearchFn = this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch.bind(this);
        var search = function (query) { return globalSearchFn(query); };
        var leftSplitState = {
            // @ts-ignore
            collapsed: this.app.workspace.leftSplit.collapsed,
            // @ts-ignore
            tab: this.getSearchTabIndex()
        };
        search(s);
        if (leftSplitState.collapsed) {
            // @ts-ignore
            this.app.workspace.leftSplit.collapse();
        }
        // @ts-ignore
        if (leftSplitState.tab !== this.app.workspace.leftSplit.children[0].currentTab) {
            // @ts-ignore
            this.app.workspace.leftSplit.children[0].selectTabIndex(leftSplitState.tab);
        }
    };
    TextExpander.prototype.getSearchTabIndex = function () {
        var leftTabs = this.app.workspace.leftSplit.children[0].children;
        var searchTabId;
        this.app.workspace.iterateAllLeaves(function (leaf) {
            if (leaf.getViewState().type == "search") {
                searchTabId = leaf.id;
            }
        });
        return leftTabs.findIndex(function (item, index, array) {
            if (item.id == searchTabId) {
                return true;
            }
        });
    };
    TextExpander.prototype.getFoundAfterDelay = function () {
        return __awaiter(this, void 0, void 0, function () {
            var searchLeaf, view;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchLeaf = this.app.workspace.getLeavesOfType('search')[0];
                        return [4 /*yield*/, searchLeaf.open(searchLeaf.view)];
                    case 1:
                        view = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve) {
                                setTimeout(function () {
                                    // @ts-ignore
                                    var results = view.dom.resultDomLookup;
                                    return resolve(results);
                                }, _this.config.delay);
                            })];
                }
            });
        });
    };
    TextExpander.prototype.startTemplateMode = function (query, lastLine, prefixes) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var currentView, currentFileName, templateContent, isHeader, isFooter, isRepeat, heading, footer, repeatableContent, searchResults, files, filterFiles, format, changed, result, viewBeforeReplace;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currentView = this.app.workspace.activeLeaf.view;
                        currentFileName = '';
                        templateContent = query.template.split('\n');
                        isHeader = function (line) { return line.startsWith(prefixes.header); };
                        isFooter = function (line) { return line.startsWith(prefixes.footer); };
                        isRepeat = function (line) { return !isHeader(line) && !isFooter(line); };
                        heading = templateContent.filter(isHeader).map(function (s) { return s.slice(1); });
                        footer = templateContent.filter(isFooter).map(function (s) { return s.slice(1); });
                        repeatableContent = templateContent.filter(isRepeat).filter(function (e) { return e; }).length === 0
                            ? [this.config.defaultTemplate]
                            : templateContent.filter(isRepeat).filter(function (e) { return e; });
                        if (currentView instanceof obsidian.FileView) {
                            currentFileName = currentView.file.basename;
                        }
                        return [4 /*yield*/, this.getFoundAfterDelay()];
                    case 1:
                        searchResults = _b.sent();
                        files = Array.from(searchResults.keys());
                        filterFiles = this.config.excludeCurrent
                            ? files.filter(function (file) { return file.basename !== currentFileName; })
                            : files;
                        format = function (r, template, index) { return __awaiter(_this, void 0, void 0, function () {
                            var fileContent, _a;
                            var _this = this;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(new RegExp(this.seqs.filter(function (e) { return e.readContent; }).map(function (e) { return e.name; }).join('|')).test(template))) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.app.vault.cachedRead(r)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = '';
                                        _b.label = 3;
                                    case 3:
                                        fileContent = _a;
                                        return [2 /*return*/, this.seqs.reduce(function (acc, seq) {
                                                return acc.replace(new RegExp(seq.name, 'gu'), function (replace) { return seq.format(_this, replace, fileContent, r, searchResults.get(r), index); });
                                            }, template)];
                                }
                            });
                        }); };
                        return [4 /*yield*/, Promise.all(filterFiles
                                .map(function (file, i) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(repeatableContent.map(function (s) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, format(file, s, i)];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); }))];
                                        case 1:
                                            result = _a.sent();
                                            return [2 /*return*/, result.join('\n')];
                                    }
                                });
                            }); }))];
                    case 2:
                        changed = _b.sent();
                        result = [
                            ' ',
                            heading.join('\n'),
                            changed.join('\n'),
                            footer.join('\n'),
                            ' ',
                            this.config.lineEnding
                        ].filter(function (e) { return e; }).join('\n');
                        viewBeforeReplace = this.app.workspace.activeLeaf.view;
                        if (viewBeforeReplace instanceof obsidian.MarkdownView) {
                            if (viewBeforeReplace.file.basename !== currentFileName) {
                                return [2 /*return*/];
                            }
                        }
                        else {
                            return [2 /*return*/];
                        }
                        this.cm.replaceRange(result, { line: query.end + 1, ch: 0 }, { line: lastLine, ch: ((_a = this.cm.getLine(lastLine)) === null || _a === void 0 ? void 0 : _a.length) || 0 });
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    TextExpander.prototype.runQuery = function (query, content) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, lineEnding, prefixes, lastLine, newContent;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this.config, lineEnding = _b.lineEnding, prefixes = _b.prefixes;
                        if (!query) {
                            new Notification('Expand query not found');
                            return [2 /*return*/, Promise.resolve()];
                        }
                        lastLine = getLastLineToReplace(content, query, this.config.lineEnding);
                        this.cm.replaceRange('\n' + lineEnding, { line: query.end + 1, ch: 0 }, { line: lastLine, ch: ((_a = this.cm.getLine(lastLine)) === null || _a === void 0 ? void 0 : _a.length) || 0 });
                        newContent = formatContent(this.cm.getValue());
                        this.search(query.query);
                        return [4 /*yield*/, this.startTemplateMode(query, getLastLineToReplace(newContent, query, this.config.lineEnding), prefixes)];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    TextExpander.prototype.initExpander = function (all) {
        var _this = this;
        if (all === void 0) { all = false; }
        var currentView = this.app.workspace.activeLeaf.view;
        if (!(currentView instanceof obsidian.MarkdownView)) {
            return;
        }
        var cmDoc = this.cm = currentView.sourceMode.cmEditor;
        var curNum = cmDoc.getCursor().line;
        var content = cmDoc.getValue();
        var formatted = formatContent(content);
        var findQueries = getAllExpandersQuery(formatted);
        var closestQuery = getClosestQuery(findQueries, curNum);
        if (all) {
            findQueries.reduce(function (promise, query, i) {
                return promise.then(function () {
                    var newContent = formatContent(cmDoc.getValue());
                    var updatedQueries = getAllExpandersQuery(newContent);
                    return _this.runQuery(updatedQueries[i], newContent);
                });
            }, Promise.resolve());
        }
        else {
            this.runQuery(closestQuery, formatted);
        }
    };
    TextExpander.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.addSettingTab(new SettingTab(this.app, this));
                        this.addCommand({
                            id: 'editor-expand',
                            name: 'expand',
                            callback: this.initExpander,
                            hotkeys: []
                        });
                        this.addCommand({
                            id: 'editor-expand-all',
                            name: 'expand all',
                            callback: function () { return _this.initExpander(true); },
                            hotkeys: []
                        });
                        this.app.workspace.on('file-open', function () { return __awaiter(_this, void 0, void 0, function () {
                            var activeLeaf, activeView, isAllowedView;
                            return __generator(this, function (_a) {
                                if (!this.config.autoExpand) {
                                    return [2 /*return*/];
                                }
                                activeLeaf = this.app.workspace.activeLeaf;
                                if (!activeLeaf) {
                                    return [2 /*return*/];
                                }
                                activeView = activeLeaf.view;
                                isAllowedView = activeView instanceof obsidian.MarkdownView;
                                if (!isAllowedView) {
                                    return [2 /*return*/];
                                }
                                this.initExpander(true);
                                return [2 /*return*/];
                            });
                        }); });
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.config = __assign(__assign({}, this.config), data);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpander.prototype.onunload = function () {
        console.log('unloading plugin');
    };
    TextExpander.prototype.saveSettings = function () {
        this.saveData(this.config);
    };
    return TextExpander;
}(obsidian.Plugin));
var SettingTab = /** @class */ (function (_super) {
    __extends(SettingTab, _super);
    function SettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.app = app;
        _this.plugin = plugin;
        return _this;
    }
    SettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Text Expander' });
        new obsidian.Setting(containerEl)
            .setName('Auto Expand')
            .setDesc('Expand all queries in a file once you open it')
            .addToggle(function (toggle) {
            toggle
                .setValue(_this.plugin.config.autoExpand)
                .onChange(function (value) {
                _this.plugin.config.autoExpand = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Delay')
            .setDesc('Text expander don\' wait until search completed. It waits for a delay and paste result after that.')
            .addSlider(function (slider) {
            slider.setLimits(100, 10000, 100);
            slider.setValue(_this.plugin.config.delay);
            slider.onChange(function (value) {
                _this.plugin.config.delay = value;
                _this.plugin.saveSettings();
            });
            slider.setDynamicTooltip();
        });
        new obsidian.Setting(containerEl)
            .setName('Line ending')
            .setDesc('You can specify the text which will appear at the bottom of the generated text.')
            .addText(function (text) {
            text.setValue(_this.plugin.config.lineEnding)
                .onChange(function (val) {
                _this.plugin.config.lineEnding = val;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Default template')
            .setDesc('You can specify default template')
            .addText(function (text) {
            text.setValue(_this.plugin.config.defaultTemplate)
                .onChange(function (val) {
                _this.plugin.config.defaultTemplate = val;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Exclude current file')
            .setDesc('You can specify should text expander exclude results from current file or not')
            .addToggle(function (toggle) {
            toggle
                .setValue(_this.plugin.config.excludeCurrent)
                .onChange(function (value) {
                _this.plugin.config.excludeCurrent = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setHeading()
            .setName('Prefixes');
        new obsidian.Setting(containerEl)
            .setName('Header')
            .setDesc('Line prefixed by this symbol will be recognized as header')
            .addText(function (text) {
            text.setValue(_this.plugin.config.prefixes.header)
                .onChange(function (val) {
                _this.plugin.config.prefixes.header = val;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Footer')
            .setDesc('Line prefixed by this symbol will be recognized as footer')
            .addText(function (text) {
            text.setValue(_this.plugin.config.prefixes.footer)
                .onChange(function (val) {
                _this.plugin.config.prefixes.footer = val;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Sequences')
            .setDesc('REGEXP - DESCRIPTION')
            .setDesc((function () {
            var fragment = new DocumentFragment();
            var div = fragment.createEl('div');
            _this.plugin.seqs
                .map(function (e) { return e.name + ' - ' + (e.desc || ''); })
                .map(function (e) {
                var el = fragment.createEl('div');
                el.setText(e);
                el.setAttribute('style', "\n                                border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n                                margin-bottom: 0.5rem;\n                                padding-bottom: 0.5rem;\n                            ");
                return el;
            }).forEach(function (el) {
                div.appendChild(el);
            });
            fragment.appendChild(div);
            return fragment;
        })());
    };
    return SettingTab;
}(obsidian.PluginSettingTab));

module.exports = TextExpander;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsImhlbHBlcnMudHMiLCJzcmMvc2VxdWVuY2VzL3NlcXVlbmNlcy50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRJbihzdGF0ZSwgcmVjZWl2ZXIpIHtcclxuICAgIGlmIChyZWNlaXZlciA9PT0gbnVsbCB8fCAodHlwZW9mIHJlY2VpdmVyICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiByZWNlaXZlciAhPT0gXCJmdW5jdGlvblwiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB1c2UgJ2luJyBvcGVyYXRvciBvbiBub24tb2JqZWN0XCIpO1xyXG4gICAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgPT09IHN0YXRlIDogc3RhdGUuaGFzKHJlY2VpdmVyKTtcclxufVxyXG4iLCJleHBvcnQgaW50ZXJmYWNlIEV4cGFuZGVyUXVlcnkge1xuICAgIHN0YXJ0OiBudW1iZXJcbiAgICBlbmQ6IG51bWJlclxuICAgIHRlbXBsYXRlOiBzdHJpbmdcbiAgICBxdWVyeTogc3RyaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRDb250ZW50KGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gY29udGVudC5zcGxpdCgnXFxuJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbEV4cGFuZGVyc1F1ZXJ5KGNvbnRlbnQ6IHN0cmluZ1tdKTogRXhwYW5kZXJRdWVyeVtdIHtcbiAgICBsZXQgYWNjdW06IEV4cGFuZGVyUXVlcnlbXSA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBjb250ZW50W2ldXG5cbiAgICAgICAgaWYgKGxpbmUgPT09ICdgYGBleHBhbmRlcicpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgY29udGVudC5sZW5ndGggLSBpOyBlKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0bGluZSA9IGNvbnRlbnRbaSArIGVdIFxuICAgICAgICAgICAgICAgIGlmIChuZXh0bGluZSA9PT0gJ2BgYCcpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjdW0ucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGkgKyBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBjb250ZW50W2kgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogZSA+IDIgPyBjb250ZW50LnNsaWNlKGkgKyAyLCBpICsgZSkuam9pbignXFxuJykgOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY3VtXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDbG9zZXN0UXVlcnkocXVlcmllczogRXhwYW5kZXJRdWVyeVtdLCBsaW5lTnVtYmVyOiBudW1iZXIpOiBFeHBhbmRlclF1ZXJ5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAocXVlcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBxdWVyaWVzLnJlZHVjZSgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYi5zdGFydCAtIGxpbmVOdW1iZXIpIDwgTWF0aC5hYnMoYS5zdGFydCAtIGxpbmVOdW1iZXIpID8gYiA6IGE7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXN0TGluZVRvUmVwbGFjZShjb250ZW50OiBzdHJpbmdbXSwgcXVlcnk6IEV4cGFuZGVyUXVlcnksIGVuZGxpbmU6IHN0cmluZykge1xuICAgIGNvbnN0IGxpbmVGcm9tID0gcXVlcnkuZW5kXG5cbiAgICBmb3IgKHZhciBpID0gbGluZUZyb20gKyAxOyBpIDwgY29udGVudC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY29udGVudFtpXSA9PT0gZW5kbGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsaW5lRnJvbSArIDFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1Db250ZW50KHM6IHN0cmluZykge1xuICAgIGNvbnN0IHJlbW92ZUVtcHR5TGluZXMgPSAoczogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgY29uc3QgbGluZXMgPSBzLnNwbGl0KCdcXG4nKS5tYXAoZSA9PiBlLnRyaW0oKSlcbiAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBzXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGluZXMuaW5kZXhPZignJykgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZW1vdmVFbXB0eUxpbmVzKGxpbmVzLnNsaWNlKDEpLmpvaW4oJ1xcbicpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNcbiAgICB9XG4gICAgY29uc3QgcmVtb3ZlRnJvbnRNYXR0ZXIgPSAoczogc3RyaW5nLCBsb29rRW5kaW5nOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcgPT4ge1xuICAgICAgICBjb25zdCBsaW5lcyA9IHMuc3BsaXQoJ1xcbicpXG5cbiAgICAgICAgaWYgKGxvb2tFbmRpbmcgJiYgbGluZXMuaW5kZXhPZignLS0tJykgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5lcy5zbGljZSgxKS5qb2luKCdcXG4nKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvb2tFbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiByZW1vdmVGcm9udE1hdHRlcihsaW5lcy5zbGljZSgxKS5qb2luKCdcXG4nKSwgdHJ1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaW5lcy5pbmRleE9mKCctLS0nKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZUZyb250TWF0dGVyKGxpbmVzLnNsaWNlKDEpLmpvaW4oJ1xcbicpLCB0cnVlKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNcbiAgICB9XG5cbiAgICByZXR1cm4gcmVtb3ZlRnJvbnRNYXR0ZXIocmVtb3ZlRW1wdHlMaW5lcyhzKSlcbn0iLCJpbXBvcnQge1RGaWxlfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7dHJpbUNvbnRlbnR9IGZyb20gXCIuLi8uLi9oZWxwZXJzXCI7XG5pbXBvcnQgVGV4dEV4cGFuZGVyLCB7U2VhcmNoRGV0YWlsc30gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7b2ZmfSBmcm9tIFwiY29kZW1pcnJvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlcXVlbmNlcyB7XG4gICAgbG9vcDogYm9vbGVhblxuICAgIG5hbWU6IHN0cmluZ1xuICAgIGZvcm1hdDogKHBsdWdpbjogVGV4dEV4cGFuZGVyLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUsIHJlc3VsdHM/OiBTZWFyY2hEZXRhaWxzLCBpbmRleD86IG51bWJlcikgPT4gc3RyaW5nXG4gICAgZGVzYzogc3RyaW5nXG4gICAgcmVhZENvbnRlbnQ/OiBib29sZWFuXG4gICAgdXNpbmdTZWFyY2g/OiBib29sZWFuXG59XG5cbmludGVyZmFjZSBMaW5lSW5mbyB7XG4gICAgdGV4dDogc3RyaW5nXG4gICAgbnVtOiBudW1iZXJcbiAgICBzdGFydDogbnVtYmVyXG4gICAgZW5kOiBudW1iZXJcbn1cblxuZnVuY3Rpb24gaGlnaGxpZ2h0KGxpbmVTdGFydDogbnVtYmVyLCBsaW5lRW5kOiBudW1iZXIsIG1hdGNoU3RhcnQ6IG51bWJlciwgbWF0Y2hFbmQ6IG51bWJlciwgbGluZUNvbnRlbnQ6IHN0cmluZykge1xuICAgIHJldHVybiBbXG4gICAgICAgIC4uLmxpbmVDb250ZW50LnNsaWNlKDAsIG1hdGNoU3RhcnQgLSBsaW5lU3RhcnQpLFxuICAgICAgICAnPT0nLFxuICAgICAgICAuLi5saW5lQ29udGVudC5zbGljZShtYXRjaFN0YXJ0IC0gbGluZVN0YXJ0LCAobWF0Y2hTdGFydCAtIGxpbmVTdGFydCkgKyAobWF0Y2hFbmQgLSBtYXRjaFN0YXJ0KSksXG4gICAgICAgICc9PScsXG4gICAgICAgIC4uLmxpbmVDb250ZW50LnNsaWNlKChtYXRjaFN0YXJ0IC0gbGluZVN0YXJ0KSArIChtYXRjaEVuZCAtIG1hdGNoU3RhcnQpKSxcbiAgICBdLmpvaW4oJycpXG59XG5cbmNvbnN0IHNlcXVlbmNlczogU2VxdWVuY2VzW10gPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRjb3VudCcsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKF9wLCBfczogc3RyaW5nLCBfY29udGVudDogc3RyaW5nLCBfZmlsZTogVEZpbGUsIF9kLCBpbmRleCkgPT4gaW5kZXggPyBTdHJpbmcoaW5kZXggKyAxKSA6IFN0cmluZygxKSxcbiAgICAgICAgZGVzYzogJ2FkZCBpbmRleCBudW1iZXIgdG8gZWFjaCBwcm9kdWNlZCBmaWxlJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRmaWxlbmFtZScsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKF9wLCBfczogc3RyaW5nLCBfY29udGVudDogc3RyaW5nLCBmaWxlOiBURmlsZSkgPT4gZmlsZS5iYXNlbmFtZSxcbiAgICAgICAgZGVzYzogJ25hbWUgb2YgdGhlIGZvdW5kZWQgZmlsZSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1xcXFwkbGluaycsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKHAsIF9zOiBzdHJpbmcsIF9jb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlKSA9PiBwLmFwcC5maWxlTWFuYWdlci5nZW5lcmF0ZU1hcmtkb3duTGluayhmaWxlLCBmaWxlLnBhdGgpLFxuICAgICAgICBkZXNjOiAnbGluayBiYXNlZCBvbiBPYnNpZGlhbiBzZXR0aW5ncydcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1xcXFwkbGluZXM6XFxcXGQrJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgcmVhZENvbnRlbnQ6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKHAsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBfZmlsZTogVEZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpZ2l0cyA9IE51bWJlcihzLnNwbGl0KCc6JylbMV0pXG5cbiAgICAgICAgICAgIHJldHVybiB0cmltQ29udGVudChjb250ZW50KVxuICAgICAgICAgICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChfOiBzdHJpbmcsIGk6IG51bWJlcikgPT4gaSA8IGRpZ2l0cylcbiAgICAgICAgICAgICAgICAuam9pbignXFxuJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKHAuY29uZmlnLmxpbmVFbmRpbmcsICdnJyksICcnKVxuICAgICAgICB9LFxuICAgICAgICBkZXNjOiAnc3BlY2lmaWVkIGNvdW50IG9mIGxpbmVzIGZyb20gdGhlIGZvdW5kIGZpbGUnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJGNoYXJhY3RlcnM6XFxcXGQrJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgcmVhZENvbnRlbnQ6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKHAsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBfZmlsZTogVEZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpZ2l0cyA9IE51bWJlcihzLnNwbGl0KCc6JylbMV0pXG5cbiAgICAgICAgICAgIHJldHVybiB0cmltQ29udGVudChjb250ZW50KVxuICAgICAgICAgICAgICAgIC5zcGxpdCgnJylcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChfOiBzdHJpbmcsIGk6IG51bWJlcikgPT4gaSA8IGRpZ2l0cylcbiAgICAgICAgICAgICAgICAuam9pbignJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKHAuY29uZmlnLmxpbmVFbmRpbmcsICdnJyksICcnKVxuICAgICAgICB9LFxuICAgICAgICBkZXNjOiAnc3BlY2lmaWVkIGNvdW50IG9mIGxpbmVzIGZyb20gdGhlIGZvdW5kIGZpbGUnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJGZyb250bWF0dGVyOltcXFxccFxce0xcXH1fLV0rJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAocCwgczogc3RyaW5nLCBfY29udGVudDogc3RyaW5nLCBmaWxlOiBURmlsZSkgPT4gcC5nZXRGcm9udE1hdHRlcihzLCBmaWxlKSxcbiAgICAgICAgZGVzYzogJ3ZhbHVlIGZyb20gdGhlIGZyb250bWF0dGVyIGtleSBpbiB0aGUgZm91bmQgZmlsZSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1xcXFwkbGluZXMrJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgcmVhZENvbnRlbnQ6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKHAsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBfZmlsZTogVEZpbGUpID0+IGNvbnRlbnQucmVwbGFjZShuZXcgUmVnRXhwKHAuY29uZmlnLmxpbmVFbmRpbmcsICdnJyksICcnKSxcbiAgICAgICAgZGVzYzogJ2FsbCBjb250ZW50IGZyb20gdGhlIGZvdW5kIGZpbGUnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJGV4dCcsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKF9wLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IGZpbGUuZXh0ZW5zaW9uLFxuICAgICAgICBkZXNjOiAncmV0dXJuIGZpbGUgZXh0ZW5zaW9uJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRjcmVhdGVkOmZvcm1hdDpkYXRlJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAoX3AsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmaWxlOiBURmlsZSkgPT4gU3RyaW5nKG5ldyBEYXRlKGZpbGUuc3RhdC5jdGltZSkudG9JU09TdHJpbmcoKSkuc3BsaXQoJ1QnKVswXSxcbiAgICAgICAgZGVzYzogJ2NyZWF0ZWQgdGltZSBmb3JtYXR0ZWQnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJGNyZWF0ZWQ6Zm9ybWF0OnRpbWUnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChfcCwgczogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlKSA9PiBTdHJpbmcobmV3IERhdGUoZmlsZS5zdGF0LmN0aW1lKS50b0lTT1N0cmluZygpKS5zcGxpdCgvKFsuVF0pLylbMl0sXG4gICAgICAgIGRlc2M6ICdjcmVhdGVkIHRpbWUgZm9ybWF0dGVkJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRjcmVhdGVkOmZvcm1hdCcsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKF9wLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IFN0cmluZyhuZXcgRGF0ZShmaWxlLnN0YXQuY3RpbWUpLnRvSVNPU3RyaW5nKCkpLFxuICAgICAgICBkZXNjOiAnY3JlYXRlZCB0aW1lIGZvcm1hdHRlZCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1xcXFwkY3JlYXRlZCcsXG4gICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgIGZvcm1hdDogKF9wLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IFN0cmluZyhmaWxlLnN0YXQuY3RpbWUpLFxuICAgICAgICBkZXNjOiAnY3JlYXRlZCB0aW1lJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRzaXplJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAoX3AsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmaWxlOiBURmlsZSkgPT4gU3RyaW5nKGZpbGUuc3RhdC5zaXplKSxcbiAgICAgICAgZGVzYzogJ3NpemUgb2YgdGhlIGZpbGUnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdcXFxcJHBhdGgnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChfcCwgczogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlKSA9PiBmaWxlLnBhdGgsXG4gICAgICAgIGRlc2M6ICdwYXRoIHRvIHRoZSBmb3VuZCBmaWxlJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXFxcXCRwYXJlbnQnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChfcCwgczogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGZpbGU6IFRGaWxlKSA9PiBmaWxlLnBhcmVudC5uYW1lLFxuICAgICAgICBkZXNjOiAncGFyZW50IGZvbGRlciBuYW1lJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXiguK3wpXFxcXCRoZWFkZXI6LisnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChwLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHMuc2xpY2UoMCwgcy5pbmRleE9mKCckJykpXG4gICAgICAgICAgICBjb25zdCBoZWFkZXIgPSBzLnNsaWNlKHMuaW5kZXhPZignJCcpKS5yZXBsYWNlKCckaGVhZGVyOicsICcnKS5yZXBsYWNlKC9cIi9nLCAnJylcbiAgICAgICAgICAgIGNvbnN0IG5lZWRlZExldmVsID0gaGVhZGVyLnNwbGl0KFwiI1wiKS5sZW5ndGggLSAxXG4gICAgICAgICAgICBjb25zdCBuZWVkZWRUaXRsZSA9IGhlYWRlci5yZXBsYWNlKC9eIysvZywgJycpLnRyaW0oKVxuXG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHAuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpXG5cbiAgICAgICAgICAgIHJldHVybiBtZXRhZGF0YS5oZWFkaW5ncz8uZmlsdGVyKGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RzID0gW1xuICAgICAgICAgICAgICAgICAgICBbbmVlZGVkVGl0bGUsIGUuaGVhZGluZy5pbmNsdWRlcyhuZWVkZWRUaXRsZSldLFxuICAgICAgICAgICAgICAgICAgICBbbmVlZGVkTGV2ZWwsIGUubGV2ZWwgPT09IG5lZWRlZExldmVsXVxuICAgICAgICAgICAgICAgIF0uZmlsdGVyKGUgPT4gZVswXSlcblxuICAgICAgICAgICAgICAgIGlmICh0ZXN0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlc3RzLm1hcChlID0+IGVbMV0pLmV2ZXJ5KGUgPT4gZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubWFwKGggPT4gcC5hcHAuZmlsZU1hbmFnZXIuZ2VuZXJhdGVNYXJrZG93bkxpbmsoZmlsZSwgZmlsZS5iYXNlbmFtZSwgJyMnICsgaC5oZWFkaW5nKSlcbiAgICAgICAgICAgICAgICAubWFwKGxpbmsgPT4gcHJlZml4ICsgbGluaylcbiAgICAgICAgICAgICAgICAuam9pbignXFxuJykgfHwgJydcblxuICAgICAgICB9LFxuICAgICAgICBkZXNjOiAnaGVhZGluZ3MgZnJvbSBmb3VuZGVkIGZpbGVzLiAkaGVhZGVyOiMjIC0gcmV0dXJuIGFsbCBsZXZlbCAyIGhlYWRpbmdzLiAkaGVhZGVyOlRpdGxlIC0gcmV0dXJuIGFsbCBoZWFkaW5nIHdoaWNoIG1hdGNoIHRoZSBzdHJpbmcuIENhbiBiZSBwcmVwZW5kZWQgbGlrZTogLSAhJGhlYWRlcjojIyB0byB0cmFuc2NsdWRlIHRoZSBoZWFkaW5ncy4nXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdeKC4rfClcXFxcJGJsb2NrcycsXG4gICAgICAgIHJlYWRDb250ZW50OiB0cnVlLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBmb3JtYXQ6IChwLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHMuc2xpY2UoMCwgcy5pbmRleE9mKCckJykpXG5cbiAgICAgICAgICAgIHJldHVybiBjb250ZW50XG4gICAgICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZSA9PiAvXFxeXFx3KyQvLnRlc3QoZSkpXG4gICAgICAgICAgICAgICAgLm1hcChlID0+XG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCArIHAuYXBwLmZpbGVNYW5hZ2VyLmdlbmVyYXRlTWFya2Rvd25MaW5rKGZpbGUsIGZpbGUuYmFzZW5hbWUsICcjJyArIGUucmVwbGFjZSgvXi4rPyhcXF5cXHcrJCkvLCAnJDEnKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgICAgIH0sXG4gICAgICAgIGRlc2M6ICdibG9jayBpZHMgZnJvbSB0aGUgZm91bmQgZmlsZXMuIENhbiBiZSBwcmVwZW5kZWQuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnXiguK3wpXFxcXCRtYXRjaDpoZWFkZXInLCBsb29wOiB0cnVlLCBmb3JtYXQ6IChwLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUsIHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHMuc2xpY2UoMCwgcy5pbmRleE9mKCckJykpXG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHAuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpXG5cbiAgICAgICAgICAgIGNvbnN0IGhlYWRpbmdzID0gbWV0YWRhdGEuaGVhZGluZ3NcbiAgICAgICAgICAgICAgICA/LmZpbHRlcihoID0+IHJlc3VsdHMucmVzdWx0LmNvbnRlbnQuZmlsdGVyKGMgPT4gaC5wb3NpdGlvbi5lbmQub2Zmc2V0IDwgY1swXSkuc29tZShlID0+IGUpKVxuICAgICAgICAgICAgICAgIC5zbGljZSgtMSlcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRpbmdzXG4gICAgICAgICAgICAgICAgLm1hcChoID0+IHAuYXBwLmZpbGVNYW5hZ2VyLmdlbmVyYXRlTWFya2Rvd25MaW5rKGZpbGUsIGZpbGUucGF0aCwgJyMnICsgaC5oZWFkaW5nKSlcbiAgICAgICAgICAgICAgICAubWFwKGxpbmsgPT4gcHJlZml4ICsgbGluaylcbiAgICAgICAgICAgICAgICAuam9pbignXFxuJykgfHwgJydcbiAgICAgICAgfSwgZGVzYzogJ2V4dHJhY3QgZm91bmQgc2VsZWN0aW9ucydcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ14oLit8KVxcXFwkbWF0Y2hsaW5lKDooXFxcXCt8LXwpXFxcXGQrOlxcXFxkK3w6KFxcXFwrfC18KVxcXFxkK3wpJyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZm9ybWF0OiAoX3AsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmaWxlOiBURmlsZSwgcmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJlZml4ID0gcy5zbGljZSgwLCBzLmluZGV4T2YoJyRtYXRjaGxpbmUnKSk7XG4gICAgICAgICAgICBjb25zdCBba2V5d29yZCwgY29udGV4dCwgbGltaXRdID0gcy5zbGljZShzLmluZGV4T2YoJyRtYXRjaGxpbmUnKSkuc3BsaXQoJzonKVxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb250ZXh0IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgbGltaXRWYWx1ZSA9IE51bWJlcihsaW1pdClcbiAgICAgICAgICAgIGNvbnN0IGlzUGx1cyA9IHZhbHVlLmNvbnRhaW5zKCcrJyk7XG4gICAgICAgICAgICBjb25zdCBpc01pbnVzID0gdmFsdWUuY29udGFpbnMoJy0nKTtcbiAgICAgICAgICAgIGNvbnN0IGlzQ29udGV4dCA9ICFpc1BsdXMgJiYgIWlzTWludXM7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBOdW1iZXIodmFsdWUucmVwbGFjZSgvWystXS8sICcnKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gcmVzdWx0cy5jb250ZW50LnNwbGl0KCdcXG4nKTtcblxuICAgICAgICAgICAgLy8gR3JhYiBpbmZvIGFib3V0IGxpbmUgY29udGVudCwgaW5kZXgsIHRleHQgbGVuZ3RoIGFuZCBzdGFydC9lbmQgY2hhcmFjdGVyIHBvc2l0aW9uXG4gICAgICAgICAgICBjb25zdCBsaW5lSW5mb3M6IEFycmF5PExpbmVJbmZvPiA9IFtdXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGxpbmVzW2ldXG5cbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsaW5lSW5mb3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBudW06IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogdGV4dC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGxpbmVJbmZvc1tpLTFdLmVuZCArIDFcbiAgICAgICAgICAgICAgICBsaW5lSW5mb3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIG51bTogaSxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICAgICAgICAgIGVuZDogdGV4dC5sZW5ndGggKyBzdGFydFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzLnJlc3VsdC5jb250ZW50Lm1hcCgoW2Zyb20sIHRvXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRMaW5lcyA9IGxpbmVJbmZvc1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCh7IHN0YXJ0LCBlbmQgfSkgPT4gc3RhcnQgPD0gZnJvbSAmJiBlbmQgPj0gdG8pXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKGxpbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ubGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBoaWdobGlnaHQobGluZS5zdGFydCwgbGluZS5lbmQsIGZyb20sIHRvLCBsaW5lLnRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRMaW5lczogTGluZUluZm9bXSA9IFtdXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBtYXRjaGVkTGluZSBvZiBtYXRjaGVkTGluZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldkxpbmVzID0gaXNNaW51cyB8fCBpc0NvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBsaW5lSW5mb3MuZmlsdGVyKGwgPT4gbWF0Y2hlZExpbmUubnVtIC0gbC5udW0gPiAwICYmIG1hdGNoZWRMaW5lLm51bSAtIGwubnVtIDwgb2Zmc2V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFtdXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRMaW5lcyA9IGlzUGx1cyB8fCBpc0NvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBsaW5lSW5mb3MuZmlsdGVyKGwgPT4gbC5udW0gLSBtYXRjaGVkTGluZS5udW0gPiAwICYmIGwubnVtIC0gbWF0Y2hlZExpbmUubnVtIDwgb2Zmc2V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFtdXG5cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0TGluZXMucHVzaCggLi4ucHJldkxpbmVzLCBtYXRjaGVkTGluZSwgLi4ubmV4dExpbmVzIClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgcmVzdWx0TGluZXMubWFwKGUgPT4gZS50ZXh0KS5qb2luKCdcXG4nKVxuICAgICAgICAgICAgfSkubWFwKGxpbmUgPT4gbGltaXRWYWx1ZSA/IGxpbmUuc2xpY2UoMCwgbGltaXRWYWx1ZSkgOiBsaW5lKS5qb2luKCdcXG4nKVxuICAgICAgICB9LCBkZXNjOiAnZXh0cmFjdCBsaW5lIHdpdGggbWF0Y2hlcydcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ14oLit8KVxcXFwkc2VhcmNocmVzdWx0JyxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgZGVzYzogJycsXG4gICAgICAgIGZvcm1hdDogKF9wLCBzOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgZmlsZTogVEZpbGUsIHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHMuc2xpY2UoMCwgcy5pbmRleE9mKCckc2VhcmNocmVzdWx0JykpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMuY2hpbGRyZW4ubWFwKG1hdGNoZWRGaWxlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgbWF0Y2hlZEZpbGUuZWwuaW5uZXJUZXh0XG4gICAgICAgICAgICB9KS5qb2luKCdcXG4nKVxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdeKC4rfClcXFxcJG1hdGNoJywgbG9vcDogdHJ1ZSwgZm9ybWF0OiAoX3AsIHM6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBmaWxlOiBURmlsZSwgcmVzdWx0cykgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIXJlc3VsdHMucmVzdWx0LmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RoZXJlIGlzIG5vIGNvbnRlbnQgaW4gcmVzdWx0cycpXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFwcGVuZFByZWZpeChwcmVmaXg6IHN0cmluZywgbGluZTogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIGxpbmU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHByZWZpeENvbnRlbnQgPSBzLnNsaWNlKDAsIHMuaW5kZXhPZignJCcpKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMucmVzdWx0LmNvbnRlbnRcbiAgICAgICAgICAgICAgICAubWFwKChbZnJvbSwgdG9dKSA9PiByZXN1bHRzLmNvbnRlbnQuc2xpY2UoZnJvbSwgdG8pKVxuICAgICAgICAgICAgICAgIC5tYXAobGluZSA9PiBhcHBlbmRQcmVmaXgocHJlZml4Q29udGVudCwgbGluZSkpXG4gICAgICAgICAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgICAgIH0sIGRlc2M6ICdleHRyYWN0IGZvdW5kIHNlbGVjdGlvbnMnXG4gICAgfSxcbl1cblxuZXhwb3J0IGRlZmF1bHQgc2VxdWVuY2VzIiwiaW1wb3J0IHtcbiAgICBFeHBhbmRlclF1ZXJ5LFxuICAgIGZvcm1hdENvbnRlbnQsXG4gICAgZ2V0QWxsRXhwYW5kZXJzUXVlcnksXG4gICAgZ2V0Q2xvc2VzdFF1ZXJ5LFxuICAgIGdldExhc3RMaW5lVG9SZXBsYWNlXG59IGZyb20gJ2hlbHBlcnMnO1xuaW1wb3J0IHtcbiAgICBBcHAsXG4gICAgUGx1Z2luLFxuICAgIFBsdWdpblNldHRpbmdUYWIsXG4gICAgU2V0dGluZyxcbiAgICBURmlsZSxcbiAgICBGaWxlVmlldyxcbiAgICBNYXJrZG93blZpZXcsXG4gICAgUGx1Z2luTWFuaWZlc3Rcbn0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IENvZGVNaXJyb3IgZnJvbSAnY29kZW1pcnJvcidcbmltcG9ydCBzZXF1ZW5jZXMsIHtTZXF1ZW5jZXN9IGZyb20gXCIuL3NlcXVlbmNlcy9zZXF1ZW5jZXNcIjtcblxuaW50ZXJmYWNlIFBsdWdpblNldHRpbmdzIHtcbiAgICBkZWxheTogbnVtYmVyXG4gICAgbGluZUVuZGluZzogc3RyaW5nXG4gICAgZGVmYXVsdFRlbXBsYXRlOiBzdHJpbmdcbiAgICBleGNsdWRlQ3VycmVudDogYm9vbGVhblxuICAgIGF1dG9FeHBhbmQ6IGJvb2xlYW5cbiAgICBwcmVmaXhlczoge1xuICAgICAgICBoZWFkZXI6IHN0cmluZ1xuICAgICAgICBmb290ZXI6IHN0cmluZ1xuICAgIH1cbn1cblxudHlwZSBOdW1iZXJUdXBsZSA9IFtudW1iZXIsIG51bWJlcl1cblxuZXhwb3J0IGludGVyZmFjZSBTZWFyY2hEZXRhaWxzIHtcbiAgICBhcHA6IEFwcFxuICAgIGNoaWxkcmVuOiBhbnlbXVxuICAgIGNoaWxkcmVuRWw6IEhUTUxFbGVtZW50XG4gICAgY29sbGFwc2VFbDogSFRNTEVsZW1lbnRcbiAgICBjb2xsYXBzZWQ6IGJvb2xlYW5cbiAgICBjb2xsYXBzaWJsZTogYm9vbGVhblxuICAgIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudFxuICAgIGNvbnRlbnQ6IHN0cmluZ1xuICAgIGRvbTogYW55XG4gICAgZWw6IEhUTUxFbGVtZW50XG4gICAgZXh0cmFDb250ZXh0OiAoKSA9PiBib29sZWFuXG4gICAgZmlsZTogVEZpbGVcbiAgICBpbmZvOiBhbnlcbiAgICBvbk1hdGNoUmVuZGVyOiBhbnlcbiAgICBwdXNoZXJFbDogSFRNTEVsZW1lbnRcbiAgICByZXN1bHQ6IHtcbiAgICAgICAgZmlsZW5hbWU/OiBOdW1iZXJUdXBsZVtdXG4gICAgICAgIGNvbnRlbnQ/OiBOdW1iZXJUdXBsZVtdXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0RXhwYW5kZXIgZXh0ZW5kcyBQbHVnaW4ge1xuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvclxuXG4gICAgY29uZmlnOiBQbHVnaW5TZXR0aW5ncyA9IHtcbiAgICAgICAgYXV0b0V4cGFuZDogZmFsc2UsXG4gICAgICAgIGRlZmF1bHRUZW1wbGF0ZTogJy0gJGxpbmsnLFxuICAgICAgICBkZWxheTogMzAwLFxuICAgICAgICBleGNsdWRlQ3VycmVudDogdHJ1ZSxcbiAgICAgICAgbGluZUVuZGluZzogJzwtLT4nLFxuICAgICAgICBwcmVmaXhlczoge1xuICAgICAgICAgICAgaGVhZGVyOiAnXicsXG4gICAgICAgICAgICBmb290ZXI6ICc+J1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VxczogU2VxdWVuY2VzW10gPSBzZXF1ZW5jZXNcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFBsdWdpbk1hbmlmZXN0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcblxuICAgICAgICB0aGlzLnNlYXJjaCA9IHRoaXMuc2VhcmNoLmJpbmQodGhpcylcbiAgICAgICAgdGhpcy5pbml0RXhwYW5kZXIgPSB0aGlzLmluaXRFeHBhbmRlci5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMucmVmb3JtYXRMaW5rcyA9IHRoaXMucmVmb3JtYXRMaW5rcy5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0RnJvbnRNYXR0ZXIoczogc3RyaW5nLCByOiBURmlsZSkge1xuICAgICAgICBjb25zdCB7ZnJvbnRtYXR0ZXIgPSBudWxsfSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Q2FjaGUoci5wYXRoKVxuXG4gICAgICAgIGlmIChmcm9udG1hdHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGZyb250bWF0dGVyW3Muc3BsaXQoJzonKVsxXV0gfHwgJyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJydcbiAgICB9XG5cbiAgICByZWZvcm1hdExpbmtzKGxpbmtzOiBURmlsZVtdLCBtYXBGdW5jID0gKHM6IHN0cmluZykgPT4gJ1tbJyArIHMgKyAnXV0nKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlld1xuXG4gICAgICAgIGlmIChjdXJyZW50VmlldyBpbnN0YW5jZW9mIEZpbGVWaWV3KSB7XG4gICAgICAgICAgICByZXR1cm4gbGlua3M/Lm1hcChlID0+IGUuYmFzZW5hbWUpXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlID0+IGN1cnJlbnRWaWV3LmZpbGUuYmFzZW5hbWUgIT09IGUpXG4gICAgICAgICAgICAgICAgPy5tYXAobWFwRnVuYyk/LmpvaW4oJ1xcbicpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlua3M/Lm1hcChlID0+IGUuYmFzZW5hbWUpPy5tYXAobWFwRnVuYyk/LmpvaW4oJ1xcbicpXG4gICAgfVxuXG4gICAgc2VhcmNoKHM6IHN0cmluZykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IGdsb2JhbFNlYXJjaEZuID0gdGhpcy5hcHAuaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoJ2dsb2JhbC1zZWFyY2gnKS5pbnN0YW5jZS5vcGVuR2xvYmFsU2VhcmNoLmJpbmQodGhpcylcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gKHF1ZXJ5OiBzdHJpbmcpID0+IGdsb2JhbFNlYXJjaEZuKHF1ZXJ5KVxuXG4gICAgICAgIGNvbnN0IGxlZnRTcGxpdFN0YXRlID0ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29sbGFwc2VkOiB0aGlzLmFwcC53b3Jrc3BhY2UubGVmdFNwbGl0LmNvbGxhcHNlZCxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRhYjogdGhpcy5nZXRTZWFyY2hUYWJJbmRleCgpXG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2gocylcbiAgICAgICAgaWYgKGxlZnRTcGxpdFN0YXRlLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmxlZnRTcGxpdC5jb2xsYXBzZSgpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmIChsZWZ0U3BsaXRTdGF0ZS50YWIgIT09IHRoaXMuYXBwLndvcmtzcGFjZS5sZWZ0U3BsaXQuY2hpbGRyZW5bMF0uY3VycmVudFRhYikge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmxlZnRTcGxpdC5jaGlsZHJlblswXS5zZWxlY3RUYWJJbmRleChsZWZ0U3BsaXRTdGF0ZS50YWIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTZWFyY2hUYWJJbmRleCgpOiBudW1iZXIge1xuICAgICAgICBsZXQgbGVmdFRhYnMgPSB0aGlzLmFwcC53b3Jrc3BhY2UubGVmdFNwbGl0LmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xuICAgICAgICBsZXQgc2VhcmNoVGFiSWQ6IHN0cmluZztcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVBbGxMZWF2ZXMoKGxlYWY6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKGxlYWYuZ2V0Vmlld1N0YXRlKCkudHlwZSA9PSBcInNlYXJjaFwiKSB7IHNlYXJjaFRhYklkID0gbGVhZi5pZDsgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxlZnRUYWJzLmZpbmRJbmRleCgoaXRlbTogYW55LCBpbmRleDogbnVtYmVyLCBhcnJheTogYW55W10pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmlkID09IHNlYXJjaFRhYklkKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhc3luYyBnZXRGb3VuZEFmdGVyRGVsYXkoKTogUHJvbWlzZTxNYXA8VEZpbGUsIFNlYXJjaERldGFpbHM+PiB7XG4gICAgICAgIGNvbnN0IHNlYXJjaExlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKCdzZWFyY2gnKVswXVxuICAgICAgICBjb25zdCB2aWV3ID0gYXdhaXQgc2VhcmNoTGVhZi5vcGVuKHNlYXJjaExlYWYudmlldylcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSB2aWV3LmRvbS5yZXN1bHREb21Mb29rdXAgYXMgTWFwPFRGaWxlLCBTZWFyY2hEZXRhaWxzPlxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocmVzdWx0cylcbiAgICAgICAgICAgIH0sIHRoaXMuY29uZmlnLmRlbGF5KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFzeW5jIHN0YXJ0VGVtcGxhdGVNb2RlKHF1ZXJ5OiBFeHBhbmRlclF1ZXJ5LCBsYXN0TGluZTogbnVtYmVyLCBwcmVmaXhlczogUGx1Z2luU2V0dGluZ3NbXCJwcmVmaXhlc1wiXSkge1xuICAgICAgICBjb25zdCBjdXJyZW50VmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXdcbiAgICAgICAgbGV0IGN1cnJlbnRGaWxlTmFtZSA9ICcnXG5cbiAgICAgICAgY29uc3QgdGVtcGxhdGVDb250ZW50ID0gcXVlcnkudGVtcGxhdGUuc3BsaXQoJ1xcbicpXG5cbiAgICAgICAgY29uc3QgaXNIZWFkZXIgPSAobGluZTogc3RyaW5nKSA9PiBsaW5lLnN0YXJ0c1dpdGgocHJlZml4ZXMuaGVhZGVyKVxuICAgICAgICBjb25zdCBpc0Zvb3RlciA9IChsaW5lOiBzdHJpbmcpID0+IGxpbmUuc3RhcnRzV2l0aChwcmVmaXhlcy5mb290ZXIpXG4gICAgICAgIGNvbnN0IGlzUmVwZWF0ID0gKGxpbmU6IHN0cmluZykgPT4gIWlzSGVhZGVyKGxpbmUpICYmICFpc0Zvb3RlcihsaW5lKVxuXG4gICAgICAgIGNvbnN0IGhlYWRpbmcgPSB0ZW1wbGF0ZUNvbnRlbnQuZmlsdGVyKGlzSGVhZGVyKS5tYXAoKHMpID0+IHMuc2xpY2UoMSkpXG4gICAgICAgIGNvbnN0IGZvb3RlciA9IHRlbXBsYXRlQ29udGVudC5maWx0ZXIoaXNGb290ZXIpLm1hcCgocykgPT4gcy5zbGljZSgxKSlcbiAgICAgICAgY29uc3QgcmVwZWF0YWJsZUNvbnRlbnQgPVxuICAgICAgICAgICAgdGVtcGxhdGVDb250ZW50LmZpbHRlcihpc1JlcGVhdCkuZmlsdGVyKGUgPT4gZSkubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgPyBbdGhpcy5jb25maWcuZGVmYXVsdFRlbXBsYXRlXVxuICAgICAgICAgICAgICAgIDogdGVtcGxhdGVDb250ZW50LmZpbHRlcihpc1JlcGVhdCkuZmlsdGVyKGUgPT4gZSlcblxuICAgICAgICBpZiAoY3VycmVudFZpZXcgaW5zdGFuY2VvZiBGaWxlVmlldykge1xuICAgICAgICAgICAgY3VycmVudEZpbGVOYW1lID0gY3VycmVudFZpZXcuZmlsZS5iYXNlbmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VhcmNoUmVzdWx0cyA9IGF3YWl0IHRoaXMuZ2V0Rm91bmRBZnRlckRlbGF5KClcbiAgICAgICAgY29uc3QgZmlsZXMgPSBBcnJheS5mcm9tKHNlYXJjaFJlc3VsdHMua2V5cygpKVxuXG4gICAgICAgIGNvbnN0IGZpbHRlckZpbGVzID0gdGhpcy5jb25maWcuZXhjbHVkZUN1cnJlbnRcbiAgICAgICAgICAgID8gZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS5iYXNlbmFtZSAhPT0gY3VycmVudEZpbGVOYW1lKVxuICAgICAgICAgICAgOiBmaWxlc1xuXG4gICAgICAgIGNvbnN0IGZvcm1hdCA9IGFzeW5jIChyOiBURmlsZSwgdGVtcGxhdGU6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSAobmV3IFJlZ0V4cCh0aGlzLnNlcXMuZmlsdGVyKGUgPT4gZS5yZWFkQ29udGVudCkubWFwKGUgPT4gZS5uYW1lKS5qb2luKCd8JykpLnRlc3QodGVtcGxhdGUpKVxuICAgICAgICAgICAgICAgID8gYXdhaXQgdGhpcy5hcHAudmF1bHQuY2FjaGVkUmVhZChyKVxuICAgICAgICAgICAgICAgIDogJydcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vxcy5yZWR1Y2UoKGFjYywgc2VxKSA9PlxuICAgICAgICAgICAgICAgIGFjYy5yZXBsYWNlKG5ldyBSZWdFeHAoc2VxLm5hbWUsICdndScpLCByZXBsYWNlID0+IHNlcS5mb3JtYXQodGhpcywgcmVwbGFjZSwgZmlsZUNvbnRlbnQsIHIsIHNlYXJjaFJlc3VsdHMuZ2V0KHIpLCBpbmRleCkpLCB0ZW1wbGF0ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoYW5nZWQgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIGZpbHRlckZpbGVzXG4gICAgICAgICAgICAgICAgLm1hcChhc3luYyAoZmlsZSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBQcm9taXNlLmFsbChyZXBlYXRhYmxlQ29udGVudC5tYXAoYXN5bmMgKHMpID0+IGF3YWl0IGZvcm1hdChmaWxlLCBzLCBpKSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuam9pbignXFxuJylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICApXG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW1xuICAgICAgICAgICAgJyAnLFxuICAgICAgICAgICAgaGVhZGluZy5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgIGNoYW5nZWQuam9pbignXFxuJyksXG4gICAgICAgICAgICBmb290ZXIuam9pbignXFxuJyksXG4gICAgICAgICAgICAnICcsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5saW5lRW5kaW5nXG4gICAgICAgIF0uZmlsdGVyKGUgPT4gZSkuam9pbignXFxuJylcblxuICAgICAgICBjb25zdCB2aWV3QmVmb3JlUmVwbGFjZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXdcbiAgICAgICAgaWYgKHZpZXdCZWZvcmVSZXBsYWNlIGluc3RhbmNlb2YgTWFya2Rvd25WaWV3KSB7XG4gICAgICAgICAgICBpZiAodmlld0JlZm9yZVJlcGxhY2UuZmlsZS5iYXNlbmFtZSAhPT0gY3VycmVudEZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY20ucmVwbGFjZVJhbmdlKHJlc3VsdCxcbiAgICAgICAgICAgIHtsaW5lOiBxdWVyeS5lbmQgKyAxLCBjaDogMH0sXG4gICAgICAgICAgICB7bGluZTogbGFzdExpbmUsIGNoOiB0aGlzLmNtLmdldExpbmUobGFzdExpbmUpPy5sZW5ndGggfHwgMH0pXG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgYXN5bmMgcnVuUXVlcnkocXVlcnk6IEV4cGFuZGVyUXVlcnksIGNvbnRlbnQ6IHN0cmluZ1tdKSB7XG4gICAgICAgIGNvbnN0IHsgbGluZUVuZGluZywgcHJlZml4ZXMgfSA9IHRoaXMuY29uZmlnXG5cbiAgICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICAgICAgbmV3IE5vdGlmaWNhdGlvbignRXhwYW5kIHF1ZXJ5IG5vdCBmb3VuZCcpXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxhc3RMaW5lID0gZ2V0TGFzdExpbmVUb1JlcGxhY2UoY29udGVudCwgcXVlcnksIHRoaXMuY29uZmlnLmxpbmVFbmRpbmcpXG4gICAgICAgIHRoaXMuY20ucmVwbGFjZVJhbmdlKCdcXG4nICsgbGluZUVuZGluZyxcbiAgICAgICAgICAgIHtsaW5lOiBxdWVyeS5lbmQgKyAxLCBjaDogMH0sXG4gICAgICAgICAgICB7bGluZTogbGFzdExpbmUsIGNoOiB0aGlzLmNtLmdldExpbmUobGFzdExpbmUpPy5sZW5ndGggfHwgMH0pXG5cbiAgICAgICAgY29uc3QgbmV3Q29udGVudCA9IGZvcm1hdENvbnRlbnQodGhpcy5jbS5nZXRWYWx1ZSgpKVxuXG4gICAgICAgIHRoaXMuc2VhcmNoKHF1ZXJ5LnF1ZXJ5KVxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zdGFydFRlbXBsYXRlTW9kZShxdWVyeSwgZ2V0TGFzdExpbmVUb1JlcGxhY2UobmV3Q29udGVudCwgcXVlcnksIHRoaXMuY29uZmlnLmxpbmVFbmRpbmcpLCBwcmVmaXhlcylcbiAgICB9XG5cbiAgICBpbml0RXhwYW5kZXIoYWxsID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3XG5cbiAgICAgICAgaWYgKCEoY3VycmVudFZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNtRG9jID0gdGhpcy5jbSA9IGN1cnJlbnRWaWV3LnNvdXJjZU1vZGUuY21FZGl0b3JcbiAgICAgICAgY29uc3QgY3VyTnVtID0gY21Eb2MuZ2V0Q3Vyc29yKCkubGluZVxuICAgICAgICBjb25zdCBjb250ZW50ID0gY21Eb2MuZ2V0VmFsdWUoKVxuXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IGZvcm1hdENvbnRlbnQoY29udGVudClcbiAgICAgICAgbGV0IGZpbmRRdWVyaWVzID0gZ2V0QWxsRXhwYW5kZXJzUXVlcnkoZm9ybWF0dGVkKVxuICAgICAgICBjb25zdCBjbG9zZXN0UXVlcnkgPSBnZXRDbG9zZXN0UXVlcnkoZmluZFF1ZXJpZXMsIGN1ck51bSlcblxuICAgICAgICBpZiAoYWxsKSB7XG4gICAgICAgICAgICBmaW5kUXVlcmllcy5yZWR1Y2UoKHByb21pc2UsIHF1ZXJ5LCBpKSA9PlxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NvbnRlbnQgPSBmb3JtYXRDb250ZW50KGNtRG9jLmdldFZhbHVlKCkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRRdWVyaWVzID0gZ2V0QWxsRXhwYW5kZXJzUXVlcnkobmV3Q29udGVudClcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ydW5RdWVyeSh1cGRhdGVkUXVlcmllc1tpXSwgbmV3Q29udGVudClcbiAgICAgICAgICAgICAgICB9KSwgUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucnVuUXVlcnkoY2xvc2VzdFF1ZXJ5LCBmb3JtYXR0ZWQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBvbmxvYWQoKSB7XG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogJ2VkaXRvci1leHBhbmQnLFxuICAgICAgICAgICAgbmFtZTogJ2V4cGFuZCcsXG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5pbml0RXhwYW5kZXIsXG4gICAgICAgICAgICBob3RrZXlzOiBbXVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogJ2VkaXRvci1leHBhbmQtYWxsJyxcbiAgICAgICAgICAgIG5hbWU6ICdleHBhbmQgYWxsJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLmluaXRFeHBhbmRlcih0cnVlKSxcbiAgICAgICAgICAgIGhvdGtleXM6IFtdXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKCdmaWxlLW9wZW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmF1dG9FeHBhbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWN0aXZlTGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmXG4gICAgICAgICAgICBpZiAoIWFjdGl2ZUxlYWYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWN0aXZlVmlldyA9IGFjdGl2ZUxlYWYudmlld1xuICAgICAgICAgICAgY29uc3QgaXNBbGxvd2VkVmlldyA9IGFjdGl2ZVZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXdcbiAgICAgICAgICAgIGlmICghaXNBbGxvd2VkVmlldykge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmluaXRFeHBhbmRlcih0cnVlKVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMubG9hZERhdGEoKSBhcyBQbHVnaW5TZXR0aW5nc1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5jb25maWcsXG4gICAgICAgICAgICAgICAgLi4uZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb251bmxvYWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1bmxvYWRpbmcgcGx1Z2luJyk7XG4gICAgfVxuXG4gICAgc2F2ZVNldHRpbmdzKCkge1xuICAgICAgICB0aGlzLnNhdmVEYXRhKHRoaXMuY29uZmlnKVxuICAgIH1cbn1cblxuY2xhc3MgU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgIHBsdWdpbjogVGV4dEV4cGFuZGVyXG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBUZXh0RXhwYW5kZXIpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuXG4gICAgICAgIHRoaXMuYXBwID0gYXBwXG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luXG4gICAgfVxuXG4gICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHtjb250YWluZXJFbH0gPSB0aGlzO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywge3RleHQ6ICdTZXR0aW5ncyBmb3IgVGV4dCBFeHBhbmRlcid9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdBdXRvIEV4cGFuZCcpXG4gICAgICAgICAgICAuc2V0RGVzYygnRXhwYW5kIGFsbCBxdWVyaWVzIGluIGEgZmlsZSBvbmNlIHlvdSBvcGVuIGl0JylcbiAgICAgICAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IHtcbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmNvbmZpZy5hdXRvRXhwYW5kKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UodmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uY29uZmlnLmF1dG9FeHBhbmQgPSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnRGVsYXknKVxuICAgICAgICAgICAgLnNldERlc2MoJ1RleHQgZXhwYW5kZXIgZG9uXFwnIHdhaXQgdW50aWwgc2VhcmNoIGNvbXBsZXRlZC4gSXQgd2FpdHMgZm9yIGEgZGVsYXkgYW5kIHBhc3RlIHJlc3VsdCBhZnRlciB0aGF0LicpXG4gICAgICAgICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiB7XG4gICAgICAgICAgICAgICAgc2xpZGVyLnNldExpbWl0cygxMDAsIDEwMDAwLCAxMDApXG4gICAgICAgICAgICAgICAgc2xpZGVyLnNldFZhbHVlKHRoaXMucGx1Z2luLmNvbmZpZy5kZWxheSlcbiAgICAgICAgICAgICAgICBzbGlkZXIub25DaGFuZ2UodmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb25maWcuZGVsYXkgPSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgc2xpZGVyLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnTGluZSBlbmRpbmcnKVxuICAgICAgICAgICAgLnNldERlc2MoJ1lvdSBjYW4gc3BlY2lmeSB0aGUgdGV4dCB3aGljaCB3aWxsIGFwcGVhciBhdCB0aGUgYm90dG9tIG9mIHRoZSBnZW5lcmF0ZWQgdGV4dC4nKVxuICAgICAgICAgICAgLmFkZFRleHQodGV4dCA9PiB7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5jb25maWcubGluZUVuZGluZylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb25maWcubGluZUVuZGluZyA9IHZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnRGVmYXVsdCB0ZW1wbGF0ZScpXG4gICAgICAgICAgICAuc2V0RGVzYygnWW91IGNhbiBzcGVjaWZ5IGRlZmF1bHQgdGVtcGxhdGUnKVxuICAgICAgICAgICAgLmFkZFRleHQodGV4dCA9PiB7XG4gICAgICAgICAgICAgICAgdGV4dC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5jb25maWcuZGVmYXVsdFRlbXBsYXRlKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UodmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmNvbmZpZy5kZWZhdWx0VGVtcGxhdGUgPSB2YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0V4Y2x1ZGUgY3VycmVudCBmaWxlJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdZb3UgY2FuIHNwZWNpZnkgc2hvdWxkIHRleHQgZXhwYW5kZXIgZXhjbHVkZSByZXN1bHRzIGZyb20gY3VycmVudCBmaWxlIG9yIG5vdCcpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5jb25maWcuZXhjbHVkZUN1cnJlbnQpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb25maWcuZXhjbHVkZUN1cnJlbnQgPSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0SGVhZGluZygpXG4gICAgICAgICAgICAuc2V0TmFtZSgnUHJlZml4ZXMnKVxuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0hlYWRlcicpXG4gICAgICAgICAgICAuc2V0RGVzYygnTGluZSBwcmVmaXhlZCBieSB0aGlzIHN5bWJvbCB3aWxsIGJlIHJlY29nbml6ZWQgYXMgaGVhZGVyJylcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4ge1xuICAgICAgICAgICAgICAgIHRleHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uY29uZmlnLnByZWZpeGVzLmhlYWRlcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb25maWcucHJlZml4ZXMuaGVhZGVyID0gdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdGb290ZXInKVxuICAgICAgICAgICAgLnNldERlc2MoJ0xpbmUgcHJlZml4ZWQgYnkgdGhpcyBzeW1ib2wgd2lsbCBiZSByZWNvZ25pemVkIGFzIGZvb3RlcicpXG4gICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHtcbiAgICAgICAgICAgICAgICB0ZXh0LnNldFZhbHVlKHRoaXMucGx1Z2luLmNvbmZpZy5wcmVmaXhlcy5mb290ZXIpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSh2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uY29uZmlnLnByZWZpeGVzLmZvb3RlciA9IHZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnU2VxdWVuY2VzJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdSRUdFWFAgLSBERVNDUklQVElPTicpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFnbWVudCA9IG5ldyBEb2N1bWVudEZyYWdtZW50KClcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGl2ID0gZnJhZ21lbnQuY3JlYXRlRWwoJ2RpdicpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNlcXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBlLm5hbWUgKyAnIC0gJyArIChlLmRlc2MgfHwgJycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGZyYWdtZW50LmNyZWF0ZUVsKCdkaXYnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLnNldFRleHQoZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmctYm90dG9tOiAwLjVyZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVsKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChkaXYpXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZyYWdtZW50XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKVxuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJGaWxlVmlldyIsIk1hcmtkb3duVmlldyIs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QUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUM5QyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUNoSSxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxRyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3pGLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDdkYsb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxF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

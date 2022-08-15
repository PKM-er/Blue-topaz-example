'use strict';

var obsidian = require('obsidian');
var view = require('@codemirror/view');
var state = require('@codemirror/state');
var language = require('@codemirror/language');

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function recalculateNumericBullets(root) {
    function visit(parent) {
        let index = 1;
        for (const child of parent.getChildren()) {
            if (/\d+\./.test(child.getBullet())) {
                child.replateBullet(`${index++}.`);
            }
            visit(child);
        }
    }
    visit(root);
}

class DeleteAndMergeWithPreviousLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const cursor = root.getCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => cursor.ch === l.from.ch && cursor.line === l.from.line);
        if (lineNo === 0) {
            this.mergeWithPreviousItem(root, cursor, list);
        }
        else if (lineNo > 0) {
            this.mergeNotes(root, cursor, list, lines, lineNo);
        }
    }
    mergeNotes(root, cursor, list, lines, lineNo) {
        this.stopPropagation = true;
        this.updated = true;
        const prevLineNo = lineNo - 1;
        root.replaceCursor({
            line: cursor.line - 1,
            ch: lines[prevLineNo].text.length + lines[prevLineNo].from.ch,
        });
        lines[prevLineNo].text += lines[lineNo].text;
        lines.splice(lineNo, 1);
        list.replaceLines(lines.map((l) => l.text));
    }
    mergeWithPreviousItem(root, cursor, list) {
        if (root.getChildren()[0] === list && list.getChildren().length === 0) {
            return;
        }
        this.stopPropagation = true;
        const prev = root.getListUnderLine(cursor.line - 1);
        if (!prev) {
            return;
        }
        const bothAreEmpty = prev.isEmpty() && list.isEmpty();
        const prevIsEmptyAndSameLevel = prev.isEmpty() && !list.isEmpty() && prev.getLevel() == list.getLevel();
        const listIsEmptyAndPrevIsParent = list.isEmpty() && prev.getLevel() == list.getLevel() - 1;
        if (bothAreEmpty || prevIsEmptyAndSameLevel || listIsEmptyAndPrevIsParent) {
            this.updated = true;
            const parent = list.getParent();
            const prevEnd = prev.getLastLineContentEnd();
            if (!prev.getNotesIndent() && list.getNotesIndent()) {
                prev.setNotesIndent(prev.getFirstLineIndent() +
                    list.getNotesIndent().slice(list.getFirstLineIndent().length));
            }
            const oldLines = prev.getLines();
            const newLines = list.getLines();
            oldLines[oldLines.length - 1] += newLines[0];
            const resultLines = oldLines.concat(newLines.slice(1));
            prev.replaceLines(resultLines);
            parent.removeChild(list);
            for (const c of list.getChildren()) {
                list.removeChild(c);
                prev.addAfterAll(c);
            }
            root.replaceCursor(prevEnd);
            recalculateNumericBullets(root);
        }
    }
}

class DeleteAndMergeWithNextLineOperation {
    constructor(root) {
        this.root = root;
        this.deleteAndMergeWithPrevious =
            new DeleteAndMergeWithPreviousLineOperation(root);
    }
    shouldStopPropagation() {
        return this.deleteAndMergeWithPrevious.shouldStopPropagation();
    }
    shouldUpdate() {
        return this.deleteAndMergeWithPrevious.shouldUpdate();
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const cursor = root.getCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => cursor.ch === l.to.ch && cursor.line === l.to.line);
        if (lineNo === lines.length - 1) {
            const nextLine = lines[lineNo].to.line + 1;
            const nextList = root.getListUnderLine(nextLine);
            if (!nextList) {
                return;
            }
            root.replaceCursor(nextList.getFirstLineContentStart());
            this.deleteAndMergeWithPrevious.perform();
        }
        else if (lineNo >= 0) {
            root.replaceCursor(lines[lineNo + 1].from);
            this.deleteAndMergeWithPrevious.perform();
        }
    }
}

class DeleteTillLineStartOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => l.from.line === cursor.line);
        lines[lineNo].text = lines[lineNo].text.slice(cursor.ch - lines[lineNo].from.ch);
        list.replaceLines(lines.map((l) => l.text));
        root.replaceCursor(lines[lineNo].from);
    }
}

class DeleteShouldIgnoreBulletsFeature {
    constructor(plugin, settings, ime, obsidian, performOperation) {
        this.plugin = plugin;
        this.settings = settings;
        this.ime = ime;
        this.obsidian = obsidian;
        this.performOperation = performOperation;
        this.check = () => {
            return this.settings.stickCursor && !this.ime.isIMEOpened();
        };
        this.deleteAndMergeWithPreviousLine = (editor) => {
            return this.performOperation.performOperation((root) => new DeleteAndMergeWithPreviousLineOperation(root), editor);
        };
        this.deleteTillLineStart = (editor) => {
            return this.performOperation.performOperation((root) => new DeleteTillLineStartOperation(root), editor);
        };
        this.deleteAndMergeWithNextLine = (editor) => {
            return this.performOperation.performOperation((root) => new DeleteAndMergeWithNextLineOperation(root), editor);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(view.keymap.of([
                {
                    key: "Backspace",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.deleteAndMergeWithPreviousLine,
                    }),
                },
                {
                    key: "Delete",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.deleteAndMergeWithNextLine,
                    }),
                },
                {
                    mac: "m-Backspace",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.deleteTillLineStart,
                    }),
                },
            ]));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class EnsureCursorInListContentOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const contentStart = list.getFirstLineContentStart();
        const linePrefix = contentStart.line === cursor.line
            ? contentStart.ch
            : list.getNotesIndent().length;
        if (cursor.ch < linePrefix) {
            this.updated = true;
            root.replaceCursor({
                line: cursor.line,
                ch: linePrefix,
            });
        }
    }
}

class EnsureCursorIsInUnfoldedLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        if (!list.isFolded()) {
            return;
        }
        const foldRoot = list.getTopFoldRoot();
        const firstLineEnd = foldRoot.getLinesInfo()[0].to;
        if (cursor.line > firstLineEnd.line) {
            this.updated = true;
            root.replaceCursor(firstLineEnd);
        }
    }
}

class EnsureCursorInListContentFeature {
    constructor(plugin, settings, obsidian, performOperation) {
        this.plugin = plugin;
        this.settings = settings;
        this.obsidian = obsidian;
        this.performOperation = performOperation;
        this.transactionExtender = (tr) => {
            if (!this.settings.stickCursor || !tr.selection) {
                return null;
            }
            const editor = this.obsidian.getEditorFromState(tr.startState);
            setImmediate(() => {
                this.handleCursorActivity(editor);
            });
            return null;
        };
        this.handleCursorActivity = (editor) => {
            this.performOperation.performOperation((root) => new EnsureCursorIsInUnfoldedLineOperation(root), editor);
            this.performOperation.performOperation((root) => new EnsureCursorInListContentOperation(root), editor);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(state.EditorState.transactionExtender.of(this.transactionExtender));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class MoveLeftOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        if (!grandParent) {
            return;
        }
        this.updated = true;
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        const indentRmFrom = parent.getFirstLineIndent().length;
        const indentRmTill = list.getFirstLineIndent().length;
        parent.removeChild(list);
        grandParent.addAfter(parent, list);
        list.unindentContent(indentRmFrom, indentRmTill);
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const chDiff = indentRmTill - indentRmFrom;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch - chDiff,
        });
        recalculateNumericBullets(root);
    }
}

function isEmptyLineOrEmptyCheckbox(line) {
    return line === "" || line === "[ ] ";
}

class OutdentIfLineIsEmptyOperation {
    constructor(root) {
        this.root = root;
        this.moveLeftOp = new MoveLeftOperation(root);
    }
    shouldStopPropagation() {
        return this.moveLeftOp.shouldStopPropagation();
    }
    shouldUpdate() {
        return this.moveLeftOp.shouldUpdate();
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const lines = list.getLines();
        if (lines.length > 1 ||
            !isEmptyLineOrEmptyCheckbox(lines[0]) ||
            list.getLevel() === 1) {
            return;
        }
        this.moveLeftOp.perform();
    }
}

class EnterOutdentIfLineIsEmptyFeature {
    constructor(plugin, settings, ime, obsidian, performOperation) {
        this.plugin = plugin;
        this.settings = settings;
        this.ime = ime;
        this.obsidian = obsidian;
        this.performOperation = performOperation;
        this.check = () => {
            return this.settings.betterEnter && !this.ime.isIMEOpened();
        };
        this.run = (editor) => {
            return this.performOperation.performOperation((root) => new OutdentIfLineIsEmptyOperation(root), editor);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(state.Prec.highest(view.keymap.of([
                {
                    key: "Enter",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.run,
                    }),
                },
            ])));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

function cmpPos(a, b) {
    return a.line - b.line || a.ch - b.ch;
}
function maxPos(a, b) {
    return cmpPos(a, b) < 0 ? b : a;
}
function minPos(a, b) {
    return cmpPos(a, b) < 0 ? a : b;
}
class List {
    constructor(root, indent, bullet, spaceAfterBullet, firstLine, foldRoot) {
        this.root = root;
        this.indent = indent;
        this.bullet = bullet;
        this.spaceAfterBullet = spaceAfterBullet;
        this.foldRoot = foldRoot;
        this.parent = null;
        this.children = [];
        this.notesIndent = null;
        this.lines = [];
        this.lines.push(firstLine);
    }
    getNotesIndent() {
        return this.notesIndent;
    }
    setNotesIndent(notesIndent) {
        if (this.notesIndent !== null) {
            throw new Error(`Notes indent already provided`);
        }
        this.notesIndent = notesIndent;
    }
    addLine(text) {
        if (this.notesIndent === null) {
            throw new Error(`Unable to add line, notes indent should be provided first`);
        }
        this.lines.push(text);
    }
    replaceLines(lines) {
        if (lines.length > 1 && this.notesIndent === null) {
            throw new Error(`Unable to add line, notes indent should be provided first`);
        }
        this.lines = lines;
    }
    getLineCount() {
        return this.lines.length;
    }
    getRoot() {
        return this.root;
    }
    getChildren() {
        return this.children.concat();
    }
    getLinesInfo() {
        const startLine = this.root.getContentLinesRangeOf(this)[0];
        return this.lines.map((row, i) => {
            const line = startLine + i;
            const startCh = i === 0 ? this.getContentStartCh() : this.notesIndent.length;
            const endCh = startCh + row.length;
            return {
                text: row,
                from: { line, ch: startCh },
                to: { line, ch: endCh },
            };
        });
    }
    getLines() {
        return this.lines.concat();
    }
    getFirstLineContentStart() {
        const startLine = this.root.getContentLinesRangeOf(this)[0];
        return {
            line: startLine,
            ch: this.getContentStartCh(),
        };
    }
    getLastLineContentEnd() {
        const endLine = this.root.getContentLinesRangeOf(this)[1];
        const endCh = this.lines.length === 1
            ? this.getContentStartCh() + this.lines[0].length
            : this.notesIndent.length + this.lines[this.lines.length - 1].length;
        return {
            line: endLine,
            ch: endCh,
        };
    }
    getContentStartCh() {
        return this.indent.length + this.bullet.length + 1;
    }
    isFolded() {
        if (this.foldRoot) {
            return true;
        }
        if (this.parent) {
            return this.parent.isFolded();
        }
        return false;
    }
    isFoldRoot() {
        return this.foldRoot;
    }
    getTopFoldRoot() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let tmp = this;
        let foldRoot = null;
        while (tmp) {
            if (tmp.isFoldRoot()) {
                foldRoot = tmp;
            }
            tmp = tmp.parent;
        }
        return foldRoot;
    }
    getLevel() {
        if (!this.parent) {
            return 0;
        }
        return this.parent.getLevel() + 1;
    }
    unindentContent(from, till) {
        this.indent = this.indent.slice(0, from) + this.indent.slice(till);
        if (this.notesIndent !== null) {
            this.notesIndent =
                this.notesIndent.slice(0, from) + this.notesIndent.slice(till);
        }
        for (const child of this.children) {
            child.unindentContent(from, till);
        }
    }
    indentContent(indentPos, indentChars) {
        this.indent =
            this.indent.slice(0, indentPos) +
                indentChars +
                this.indent.slice(indentPos);
        if (this.notesIndent !== null) {
            this.notesIndent =
                this.notesIndent.slice(0, indentPos) +
                    indentChars +
                    this.notesIndent.slice(indentPos);
        }
        for (const child of this.children) {
            child.indentContent(indentPos, indentChars);
        }
    }
    getFirstLineIndent() {
        return this.indent;
    }
    getBullet() {
        return this.bullet;
    }
    getSpaceAfterBullet() {
        return this.spaceAfterBullet;
    }
    replateBullet(bullet) {
        this.bullet = bullet;
    }
    getParent() {
        return this.parent;
    }
    addBeforeAll(list) {
        this.children.unshift(list);
        list.parent = this;
    }
    addAfterAll(list) {
        this.children.push(list);
        list.parent = this;
    }
    removeChild(list) {
        const i = this.children.indexOf(list);
        this.children.splice(i, 1);
        list.parent = null;
    }
    addBefore(before, list) {
        const i = this.children.indexOf(before);
        this.children.splice(i, 0, list);
        list.parent = this;
    }
    addAfter(before, list) {
        const i = this.children.indexOf(before);
        this.children.splice(i + 1, 0, list);
        list.parent = this;
    }
    getPrevSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i > 0 ? this.children[i - 1] : null;
    }
    getNextSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i >= 0 && i < this.children.length ? this.children[i + 1] : null;
    }
    isEmpty() {
        return this.children.length === 0;
    }
    print() {
        let res = "";
        for (let i = 0; i < this.lines.length; i++) {
            res +=
                i === 0
                    ? this.indent + this.bullet + this.spaceAfterBullet
                    : this.notesIndent;
            res += this.lines[i];
            res += "\n";
        }
        for (const child of this.children) {
            res += child.print();
        }
        return res;
    }
}
class Root {
    constructor(start, end, selections) {
        this.start = start;
        this.end = end;
        this.rootList = new List(this, "", "", "", "", false);
        this.selections = [];
        this.replaceSelections(selections);
    }
    getRootList() {
        return this.rootList;
    }
    getRange() {
        return [Object.assign({}, this.start), Object.assign({}, this.end)];
    }
    getSelections() {
        return this.selections.map((s) => ({
            anchor: Object.assign({}, s.anchor),
            head: Object.assign({}, s.head),
        }));
    }
    hasSingleCursor() {
        if (!this.hasSingleSelection()) {
            return false;
        }
        const selection = this.selections[0];
        return (selection.anchor.line === selection.head.line &&
            selection.anchor.ch === selection.head.ch);
    }
    hasSingleSelection() {
        return this.selections.length === 1;
    }
    getCursor() {
        return Object.assign({}, this.selections[this.selections.length - 1].head);
    }
    replaceCursor(cursor) {
        this.selections = [{ anchor: cursor, head: cursor }];
    }
    replaceSelections(selections) {
        if (selections.length < 1) {
            throw new Error(`Unable to create Root without selections`);
        }
        this.selections = selections;
    }
    getListUnderCursor() {
        return this.getListUnderLine(this.getCursor().line);
    }
    getListUnderLine(line) {
        if (line < this.start.line || line > this.end.line) {
            return;
        }
        let result = null;
        let index = this.start.line;
        const visitArr = (ll) => {
            for (const l of ll) {
                const listFromLine = index;
                const listTillLine = listFromLine + l.getLineCount() - 1;
                if (line >= listFromLine && line <= listTillLine) {
                    result = l;
                }
                else {
                    index = listTillLine + 1;
                    visitArr(l.getChildren());
                }
                if (result !== null) {
                    return;
                }
            }
        };
        visitArr(this.rootList.getChildren());
        return result;
    }
    getContentLinesRangeOf(list) {
        let result = null;
        let line = this.start.line;
        const visitArr = (ll) => {
            for (const l of ll) {
                const listFromLine = line;
                const listTillLine = listFromLine + l.getLineCount() - 1;
                if (l === list) {
                    result = [listFromLine, listTillLine];
                }
                else {
                    line = listTillLine + 1;
                    visitArr(l.getChildren());
                }
                if (result !== null) {
                    return;
                }
            }
        };
        visitArr(this.rootList.getChildren());
        return result;
    }
    getChildren() {
        return this.rootList.getChildren();
    }
    print() {
        let res = "";
        for (const child of this.rootList.getChildren()) {
            res += child.print();
        }
        return res.replace(/\n$/, "");
    }
}

class CreateNewItemOperation {
    constructor(root, defaultIndentChars, getZoomRange) {
        this.root = root;
        this.defaultIndentChars = defaultIndentChars;
        this.getZoomRange = getZoomRange;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const lines = list.getLinesInfo();
        if (lines.length === 1 && isEmptyLineOrEmptyCheckbox(lines[0].text)) {
            return;
        }
        const cursor = root.getCursor();
        const lineUnderCursor = lines.find((l) => l.from.line === cursor.line);
        if (cursor.ch < lineUnderCursor.from.ch) {
            return;
        }
        const { oldLines, newLines } = lines.reduce((acc, line) => {
            if (cursor.line > line.from.line) {
                acc.oldLines.push(line.text);
            }
            else if (cursor.line === line.from.line) {
                const a = line.text.slice(0, cursor.ch - line.from.ch);
                const b = line.text.slice(cursor.ch - line.from.ch);
                acc.oldLines.push(a);
                acc.newLines.push(b);
            }
            else if (cursor.line < line.from.line) {
                acc.newLines.push(line.text);
            }
            return acc;
        }, {
            oldLines: [],
            newLines: [],
        });
        const codeBlockBacticks = oldLines.join("\n").split("```").length - 1;
        const isInsideCodeblock = codeBlockBacticks > 0 && codeBlockBacticks % 2 !== 0;
        if (isInsideCodeblock) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const zoomRange = this.getZoomRange.getZoomRange();
        const listIsZoomingRoot = Boolean(zoomRange &&
            list.getFirstLineContentStart().line >= zoomRange.from.line &&
            list.getLastLineContentEnd().line <= zoomRange.from.line);
        const hasChildren = !list.isEmpty();
        const childIsFolded = list.isFoldRoot();
        const endPos = list.getLastLineContentEnd();
        const endOfLine = cursor.line === endPos.line && cursor.ch === endPos.ch;
        const onChildLevel = listIsZoomingRoot || (hasChildren && !childIsFolded && endOfLine);
        const indent = onChildLevel
            ? hasChildren
                ? list.getChildren()[0].getFirstLineIndent()
                : list.getFirstLineIndent() + this.defaultIndentChars
            : list.getFirstLineIndent();
        const bullet = onChildLevel && hasChildren
            ? list.getChildren()[0].getBullet()
            : list.getBullet();
        const spaceAfterBullet = onChildLevel && hasChildren
            ? list.getChildren()[0].getSpaceAfterBullet()
            : list.getSpaceAfterBullet();
        const prefix = oldLines[0].match(/^\[.\]/) ? "[ ] " : "";
        const newList = new List(list.getRoot(), indent, bullet, spaceAfterBullet, prefix + newLines.shift(), false);
        if (newLines.length > 0) {
            newList.setNotesIndent(list.getNotesIndent());
            for (const line of newLines) {
                newList.addLine(line);
            }
        }
        if (onChildLevel) {
            list.addBeforeAll(newList);
        }
        else {
            if (!childIsFolded || !endOfLine) {
                const children = list.getChildren();
                for (const child of children) {
                    list.removeChild(child);
                    newList.addAfterAll(child);
                }
            }
            list.getParent().addAfter(list, newList);
        }
        list.replaceLines(oldLines);
        const newListStart = newList.getFirstLineContentStart();
        root.replaceCursor({
            line: newListStart.line,
            ch: newListStart.ch + prefix.length,
        });
        recalculateNumericBullets(root);
    }
}

class EnterShouldCreateNewItemFeature {
    constructor(plugin, settings, ime, obsidian, performOperation) {
        this.plugin = plugin;
        this.settings = settings;
        this.ime = ime;
        this.obsidian = obsidian;
        this.performOperation = performOperation;
        this.check = () => {
            return this.settings.betterEnter && !this.ime.isIMEOpened();
        };
        this.run = (editor) => {
            const zoomRange = editor.getZoomRange();
            const res = this.performOperation.performOperation((root) => new CreateNewItemOperation(root, this.obsidian.getDefaultIndentChars(), {
                getZoomRange: () => zoomRange,
            }), editor);
            if (res.shouldUpdate && zoomRange) {
                editor.zoomIn(zoomRange.from.line);
            }
            return res;
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(state.Prec.highest(view.keymap.of([
                {
                    key: "Enter",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.run,
                    }),
                },
            ])));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class FoldFeature {
    constructor(plugin, obsidian) {
        this.plugin = plugin;
        this.obsidian = obsidian;
        this.fold = (editor) => {
            return this.setFold(editor, "fold");
        };
        this.unfold = (editor) => {
            return this.setFold(editor, "unfold");
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "fold",
                name: "Fold the list",
                editorCallback: this.obsidian.createEditorCallback(this.fold),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "ArrowUp",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "unfold",
                name: "Unfold the list",
                editorCallback: this.obsidian.createEditorCallback(this.unfold),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "ArrowDown",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    setFold(editor, type) {
        if (!this.obsidian.getObsidianFoldSettings().foldIndent) {
            new obsidian.Notice(`Unable to ${type} because folding is disabled. Please enable "Fold indent" in Obsidian settings.`, 5000);
            return true;
        }
        const cursor = editor.getCursor();
        if (type === "fold") {
            editor.fold(cursor.line);
        }
        else {
            editor.unfold(cursor.line);
        }
        return true;
    }
}

function foldInside(view, from, to) {
    let found = null;
    language.foldedRanges(view.state).between(from, to, (from, to) => {
        if (!found || found.from > from)
            found = { from, to };
    });
    return found;
}
class MyEditor {
    constructor(e) {
        this.e = e;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.view = this.e.cm;
    }
    getCursor() {
        return this.e.getCursor();
    }
    getLine(n) {
        return this.e.getLine(n);
    }
    lastLine() {
        return this.e.lastLine();
    }
    listSelections() {
        return this.e.listSelections();
    }
    getRange(from, to) {
        return this.e.getRange(from, to);
    }
    replaceRange(replacement, from, to) {
        return this.e.replaceRange(replacement, from, to);
    }
    setSelections(selections) {
        this.e.setSelections(selections);
    }
    setValue(text) {
        this.e.setValue(text);
    }
    getValue() {
        return this.e.getValue();
    }
    offsetToPos(offset) {
        return this.e.offsetToPos(offset);
    }
    posToOffset(pos) {
        return this.e.posToOffset(pos);
    }
    fold(n) {
        const { view } = this;
        const l = view.lineBlockAt(view.state.doc.line(n + 1).from);
        const range = language.foldable(view.state, l.from, l.to);
        if (!range || range.from === range.to) {
            return;
        }
        view.dispatch({ effects: [language.foldEffect.of(range)] });
    }
    unfold(n) {
        const { view } = this;
        const l = view.lineBlockAt(view.state.doc.line(n + 1).from);
        const range = foldInside(view, l.from, l.to);
        if (!range) {
            return;
        }
        view.dispatch({ effects: [language.unfoldEffect.of(range)] });
    }
    getAllFoldedLines() {
        const c = language.foldedRanges(this.view.state).iter();
        const res = [];
        while (c.value) {
            res.push(this.offsetToPos(c.from).line);
            c.next();
        }
        return res;
    }
    triggerOnKeyDown(e) {
        view.runScopeHandlers(this.view, e, "editor");
    }
    getZoomRange() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const api = window.ObsidianZoomPlugin;
        if (!api || !api.getZoomRange) {
            return null;
        }
        return api.getZoomRange(this.e);
    }
    zoomOut() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const api = window.ObsidianZoomPlugin;
        if (!api || !api.zoomOut) {
            return;
        }
        api.zoomOut(this.e);
    }
    zoomIn(line) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const api = window.ObsidianZoomPlugin;
        if (!api || !api.zoomIn) {
            return;
        }
        api.zoomIn(this.e, line);
    }
}

class ListLinesViewPluginValue {
    constructor(settings, obsidian$1, parser, view) {
        this.settings = settings;
        this.obsidian = obsidian$1;
        this.parser = parser;
        this.view = view;
        this.lineElements = [];
        this.waitForEditor = () => {
            const oe = this.view.state.field(obsidian.editorViewField).editor;
            if (!oe) {
                setTimeout(this.waitForEditor, 0);
                return;
            }
            this.editor = new MyEditor(oe);
            this.scheduleRecalculate();
        };
        this.onScroll = (e) => {
            const { scrollLeft, scrollTop } = e.target;
            this.scroller.scrollTo(scrollLeft, scrollTop);
        };
        this.scheduleRecalculate = () => {
            clearImmediate(this.scheduled);
            this.scheduled = setImmediate(this.calculate);
        };
        this.calculate = () => {
            this.lines = [];
            if (this.settings.listLines &&
                this.obsidian.isDefaultThemeEnabled() &&
                this.view.viewportLineBlocks.length > 0 &&
                this.view.visibleRanges.length > 0) {
                const fromLine = this.editor.offsetToPos(this.view.viewport.from).line;
                const toLine = this.editor.offsetToPos(this.view.viewport.to).line;
                const lists = this.parser.parseRange(this.editor, fromLine, toLine);
                for (const list of lists) {
                    this.lastLine = list.getRange()[1].line;
                    for (const c of list.getChildren()) {
                        this.recursive(c);
                    }
                }
                this.lines.sort((a, b) => a.top === b.top ? a.left - b.left : a.top - b.top);
            }
            this.updateDom();
        };
        this.onClick = (e) => {
            e.preventDefault();
            const line = this.lines[Number(e.target.dataset.index)];
            switch (this.settings.listLineAction) {
                case "zoom-in":
                    this.zoomIn(line);
                    break;
                case "toggle-folding":
                    this.toggleFolding(line);
                    break;
            }
        };
        this.view.scrollDOM.addEventListener("scroll", this.onScroll);
        this.settings.onChange("listLines", this.scheduleRecalculate);
        this.prepareDom();
        this.waitForEditor();
    }
    prepareDom() {
        this.contentContainer = document.createElement("div");
        this.contentContainer.classList.add("outliner-plugin-list-lines-content-container");
        this.scroller = document.createElement("div");
        this.scroller.classList.add("outliner-plugin-list-lines-scroller");
        this.scroller.appendChild(this.contentContainer);
        this.view.dom.appendChild(this.scroller);
    }
    update(update) {
        if (update.docChanged ||
            update.viewportChanged ||
            update.geometryChanged ||
            update.transactions.some((tr) => tr.reconfigured)) {
            this.scheduleRecalculate();
        }
    }
    getNextSibling(list) {
        let listTmp = list;
        let p = listTmp.getParent();
        while (p) {
            const nextSibling = p.getNextSiblingOf(listTmp);
            if (nextSibling) {
                return nextSibling;
            }
            listTmp = p;
            p = listTmp.getParent();
        }
        return null;
    }
    recursive(list) {
        const children = list.getChildren();
        if (children.length === 0) {
            return;
        }
        for (const child of children) {
            if (!child.isEmpty()) {
                this.recursive(child);
            }
        }
        const fromOffset = this.editor.posToOffset({
            line: list.getFirstLineContentStart().line,
            ch: list.getFirstLineIndent().length,
        });
        const nextSibling = this.getNextSibling(list);
        const tillOffset = this.editor.posToOffset({
            line: nextSibling
                ? nextSibling.getFirstLineContentStart().line - 1
                : this.lastLine,
            ch: 0,
        });
        let visibleFrom = this.view.visibleRanges[0].from;
        let visibleTo = this.view.visibleRanges[this.view.visibleRanges.length - 1].to;
        const zoomRange = this.editor.getZoomRange();
        if (zoomRange) {
            visibleFrom = Math.max(visibleFrom, this.editor.posToOffset(zoomRange.from));
            visibleTo = Math.min(visibleTo, this.editor.posToOffset(zoomRange.to));
        }
        if (fromOffset > visibleTo || tillOffset < visibleFrom) {
            return;
        }
        const top = visibleFrom > 0 && fromOffset <= visibleFrom
            ? -20
            : this.view.lineBlockAt(fromOffset).top;
        const bottom = tillOffset > visibleTo
            ? this.view.lineBlockAt(visibleTo - 1).bottom
            : this.view.lineBlockAt(tillOffset).bottom;
        const height = bottom - top;
        if (height > 0 && !list.isFolded()) {
            const nextSibling = list.getParent().getNextSiblingOf(list);
            const hasNextSibling = !!nextSibling &&
                this.editor.posToOffset(nextSibling.getFirstLineContentStart()) <=
                    visibleTo;
            this.lines.push({
                top: top,
                left: this.getIndentSize(list),
                height: `calc(${height}px ${hasNextSibling ? "- 1em" : "- 1.8em"})`,
                list,
            });
        }
    }
    getIndentSize(list) {
        const { tabSize } = this.obsidian.getObsidianTabsSettings();
        const indent = list.getFirstLineIndent();
        const spaceSize = 4.5;
        let spaces = 0;
        for (const char of indent) {
            if (char === "\t") {
                spaces += tabSize;
            }
            else {
                spaces += 1;
            }
        }
        return spaces * spaceSize;
    }
    zoomIn(line) {
        const editor = new MyEditor(this.view.state.field(obsidian.editorViewField).editor);
        editor.zoomIn(line.list.getFirstLineContentStart().line);
    }
    toggleFolding(line) {
        const { list } = line;
        if (list.isEmpty()) {
            return;
        }
        let needToUnfold = true;
        const linesToToggle = [];
        for (const c of list.getChildren()) {
            if (c.isEmpty()) {
                continue;
            }
            if (!c.isFolded()) {
                needToUnfold = false;
            }
            linesToToggle.push(c.getFirstLineContentStart().line);
        }
        const editor = new MyEditor(this.view.state.field(obsidian.editorViewField).editor);
        for (const l of linesToToggle) {
            if (needToUnfold) {
                editor.unfold(l);
            }
            else {
                editor.fold(l);
            }
        }
    }
    updateDom() {
        const cmScroll = this.view.scrollDOM;
        const cmContent = this.view.contentDOM;
        const cmContentContainer = cmContent.parentElement;
        this.scroller.style.top = cmScroll.offsetTop + "px";
        this.contentContainer.style.height = cmContent.clientHeight + "px";
        this.contentContainer.style.marginLeft =
            cmContentContainer.offsetLeft + "px";
        this.contentContainer.style.marginTop =
            cmContent.firstElementChild.offsetTop - 24 + "px";
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lineElements.length === i) {
                const e = document.createElement("div");
                e.classList.add("outliner-plugin-list-line");
                e.dataset.index = String(i);
                e.addEventListener("mousedown", this.onClick);
                this.contentContainer.appendChild(e);
                this.lineElements.push(e);
            }
            const l = this.lines[i];
            const e = this.lineElements[i];
            e.style.top = l.top + "px";
            e.style.left = l.left + "px";
            e.style.height = l.height;
            e.style.display = "block";
        }
        for (let i = this.lines.length; i < this.lineElements.length; i++) {
            const e = this.lineElements[i];
            e.style.top = "0px";
            e.style.left = "0px";
            e.style.height = "0px";
            e.style.display = "none";
        }
    }
    destroy() {
        this.settings.removeCallback("listLines", this.scheduleRecalculate);
        this.view.scrollDOM.removeEventListener("scroll", this.onScroll);
        this.view.dom.removeChild(this.scroller);
        clearImmediate(this.scheduled);
    }
}
class LinesFeature {
    constructor(plugin, settings, obsidian, parser) {
        this.plugin = plugin;
        this.settings = settings;
        this.obsidian = obsidian;
        this.parser = parser;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(view.ViewPlugin.define((view) => new ListLinesViewPluginValue(this.settings, this.obsidian, this.parser, view)));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

const BETTER_LISTS_CLASS = "outliner-plugin-better-lists";
const BETTER_BULLETS_CLASS = "outliner-plugin-better-bullets";
const VERTICAL_LINES = "outliner-plugin-vertical-lines";
const KNOWN_CLASSES = [
    BETTER_LISTS_CLASS,
    BETTER_BULLETS_CLASS,
    VERTICAL_LINES,
];
class ListsStylesFeature {
    constructor(settings, obsidian) {
        this.settings = settings;
        this.obsidian = obsidian;
        this.syncListsStyles = () => {
            const classes = [];
            if (this.obsidian.isDefaultThemeEnabled()) {
                if (this.settings.styleLists) {
                    classes.push(BETTER_LISTS_CLASS);
                    classes.push(BETTER_BULLETS_CLASS);
                }
                if (this.settings.listLines) {
                    classes.push(VERTICAL_LINES);
                }
            }
            this.applyListsStyles(classes);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncListsStyles();
            this.interval = window.setInterval(() => {
                this.syncListsStyles();
            }, 1000);
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(this.interval);
            this.applyListsStyles([]);
        });
    }
    applyListsStyles(classes) {
        const toKeep = classes.filter((c) => KNOWN_CLASSES.contains(c));
        const toRemove = KNOWN_CLASSES.filter((c) => !toKeep.contains(c));
        for (const c of toKeep) {
            if (!document.body.classList.contains(c)) {
                document.body.classList.add(c);
            }
        }
        for (const c of toRemove) {
            if (document.body.classList.contains(c)) {
                document.body.classList.remove(c);
            }
        }
    }
}

class MoveCursorToPreviousUnfoldedLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = this.root.getListUnderCursor();
        const cursor = this.root.getCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => cursor.ch === l.from.ch && cursor.line === l.from.line);
        if (lineNo === 0) {
            this.moveCursorToPreviousUnfoldedItem(root, cursor);
        }
        else if (lineNo > 0) {
            this.moveCursorToPreviousNoteLine(root, lines, lineNo);
        }
    }
    moveCursorToPreviousNoteLine(root, lines, lineNo) {
        this.stopPropagation = true;
        this.updated = true;
        root.replaceCursor(lines[lineNo - 1].to);
    }
    moveCursorToPreviousUnfoldedItem(root, cursor) {
        const prev = root.getListUnderLine(cursor.line - 1);
        if (!prev) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        if (prev.isFolded()) {
            const foldRoot = prev.getTopFoldRoot();
            const firstLineEnd = foldRoot.getLinesInfo()[0].to;
            root.replaceCursor(firstLineEnd);
        }
        else {
            root.replaceCursor(prev.getLastLineContentEnd());
        }
    }
}

class MoveCursorToPreviousUnfoldedLineFeature {
    constructor(plugin, settings, ime, obsidian, performOperation) {
        this.plugin = plugin;
        this.settings = settings;
        this.ime = ime;
        this.obsidian = obsidian;
        this.performOperation = performOperation;
        this.check = () => {
            return this.settings.stickCursor && !this.ime.isIMEOpened();
        };
        this.run = (editor) => {
            return this.performOperation.performOperation((root) => new MoveCursorToPreviousUnfoldedLineOperation(root), editor);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(view.keymap.of([
                {
                    key: "ArrowLeft",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.run,
                    }),
                },
                {
                    win: "c-ArrowLeft",
                    linux: "c-ArrowLeft",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.run,
                    }),
                },
            ]));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class MoveDownOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const next = parent.getNextSiblingOf(list);
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        if (!next && grandParent) {
            const newParent = grandParent.getNextSiblingOf(parent);
            if (newParent) {
                this.updated = true;
                parent.removeChild(list);
                newParent.addBeforeAll(list);
            }
        }
        else if (next) {
            this.updated = true;
            parent.removeChild(list);
            parent.addAfter(next, list);
        }
        if (!this.updated) {
            return;
        }
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch,
        });
        recalculateNumericBullets(root);
    }
}

class MoveRightOperation {
    constructor(root, defaultIndentChars) {
        this.root = root;
        this.defaultIndentChars = defaultIndentChars;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const prev = parent.getPrevSiblingOf(list);
        if (!prev) {
            return;
        }
        this.updated = true;
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        const indentPos = list.getFirstLineIndent().length;
        let indentChars = "";
        if (indentChars === "" && !prev.isEmpty()) {
            indentChars = prev
                .getChildren()[0]
                .getFirstLineIndent()
                .slice(prev.getFirstLineIndent().length);
        }
        if (indentChars === "") {
            indentChars = list
                .getFirstLineIndent()
                .slice(parent.getFirstLineIndent().length);
        }
        if (indentChars === "" && !list.isEmpty()) {
            indentChars = list.getChildren()[0].getFirstLineIndent();
        }
        if (indentChars === "") {
            indentChars = this.defaultIndentChars;
        }
        parent.removeChild(list);
        prev.addAfterAll(list);
        list.indentContent(indentPos, indentChars);
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch + indentChars.length,
        });
        recalculateNumericBullets(root);
    }
}

class MoveUpOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const prev = parent.getPrevSiblingOf(list);
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        if (!prev && grandParent) {
            const newParent = grandParent.getPrevSiblingOf(parent);
            if (newParent) {
                this.updated = true;
                parent.removeChild(list);
                newParent.addAfterAll(list);
            }
        }
        else if (prev) {
            this.updated = true;
            parent.removeChild(list);
            parent.addBefore(prev, list);
        }
        if (!this.updated) {
            return;
        }
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch,
        });
        recalculateNumericBullets(root);
    }
}

class MoveItemsFeature {
    constructor(plugin, ime, obsidian, settings, performOperation) {
        this.plugin = plugin;
        this.ime = ime;
        this.obsidian = obsidian;
        this.settings = settings;
        this.performOperation = performOperation;
        this.check = () => {
            return this.settings.betterTab && !this.ime.isIMEOpened();
        };
        this.moveListElementDownCommand = (editor) => {
            const { shouldStopPropagation } = this.performOperation.performOperation((root) => new MoveDownOperation(root), editor);
            return shouldStopPropagation;
        };
        this.moveListElementUpCommand = (editor) => {
            const { shouldStopPropagation } = this.performOperation.performOperation((root) => new MoveUpOperation(root), editor);
            return shouldStopPropagation;
        };
        this.moveListElementRightCommand = (editor) => {
            if (this.ime.isIMEOpened()) {
                return true;
            }
            return this.moveListElementRight(editor).shouldStopPropagation;
        };
        this.moveListElementRight = (editor) => {
            return this.performOperation.performOperation((root) => new MoveRightOperation(root, this.obsidian.getDefaultIndentChars()), editor);
        };
        this.moveListElementLeftCommand = (editor) => {
            if (this.ime.isIMEOpened()) {
                return true;
            }
            return this.moveListElementLeft(editor).shouldStopPropagation;
        };
        this.moveListElementLeft = (editor) => {
            return this.performOperation.performOperation((root) => new MoveLeftOperation(root), editor);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "move-list-item-up",
                name: "Move list and sublists up",
                editorCallback: this.obsidian.createEditorCallback(this.moveListElementUpCommand),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: "ArrowUp",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "move-list-item-down",
                name: "Move list and sublists down",
                editorCallback: this.obsidian.createEditorCallback(this.moveListElementDownCommand),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: "ArrowDown",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "indent-list",
                name: "Indent the list and sublists",
                editorCallback: this.obsidian.createEditorCallback(this.moveListElementRightCommand),
                hotkeys: [],
            });
            this.plugin.addCommand({
                id: "outdent-list",
                name: "Outdent the list and sublists",
                editorCallback: this.obsidian.createEditorCallback(this.moveListElementLeftCommand),
                hotkeys: [],
            });
            this.plugin.registerEditorExtension(state.Prec.highest(view.keymap.of([
                {
                    key: "Tab",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.moveListElementRight,
                    }),
                },
                {
                    key: "s-Tab",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.moveListElementLeft,
                    }),
                },
            ])));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class SelectAllOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleSelection()) {
            return;
        }
        const selection = root.getSelections()[0];
        const [rootStart, rootEnd] = root.getRange();
        const selectionFrom = minPos(selection.anchor, selection.head);
        const selectionTo = maxPos(selection.anchor, selection.head);
        if (selectionFrom.line < rootStart.line ||
            selectionTo.line > rootEnd.line) {
            return false;
        }
        if (selectionFrom.line === rootStart.line &&
            selectionFrom.ch === rootStart.ch &&
            selectionTo.line === rootEnd.line &&
            selectionTo.ch === rootEnd.ch) {
            return false;
        }
        const list = root.getListUnderCursor();
        const contentStart = list.getFirstLineContentStart();
        const contentEnd = list.getLastLineContentEnd();
        if (selectionFrom.line < contentStart.line ||
            selectionTo.line > contentEnd.line) {
            return false;
        }
        this.stopPropagation = true;
        this.updated = true;
        if (selectionFrom.line === contentStart.line &&
            selectionFrom.ch === contentStart.ch &&
            selectionTo.line === contentEnd.line &&
            selectionTo.ch === contentEnd.ch) {
            // select all list
            root.replaceSelections([{ anchor: rootStart, head: rootEnd }]);
        }
        else {
            // select all line
            root.replaceSelections([{ anchor: contentStart, head: contentEnd }]);
        }
        return true;
    }
}

class SelectAllFeature {
    constructor(plugin, settings, ime, obsidian, performOperation) {
        this.plugin = plugin;
        this.settings = settings;
        this.ime = ime;
        this.obsidian = obsidian;
        this.performOperation = performOperation;
        this.check = () => {
            return this.settings.selectAll && !this.ime.isIMEOpened();
        };
        this.run = (editor) => {
            return this.performOperation.performOperation((root) => new SelectAllOperation(root), editor);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(view.keymap.of([
                {
                    key: "c-a",
                    mac: "m-a",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.run,
                    }),
                },
            ]));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class SelectTillLineStartOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => l.from.line === cursor.line);
        root.replaceSelections([{ head: lines[lineNo].from, anchor: cursor }]);
    }
}

class SelectionShouldIgnoreBulletsFeature {
    constructor(plugin, settings, ime, obsidian, performOperation) {
        this.plugin = plugin;
        this.settings = settings;
        this.ime = ime;
        this.obsidian = obsidian;
        this.performOperation = performOperation;
        this.check = () => {
            return this.settings.stickCursor && !this.ime.isIMEOpened();
        };
        this.run = (editor) => {
            return this.performOperation.performOperation((root) => new SelectTillLineStartOperation(root), editor);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(view.keymap.of([
                {
                    key: "m-s-ArrowLeft",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.run,
                    }),
                },
            ]));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class ObsidianOutlinerPluginSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin, settings) {
        super(app, plugin);
        this.settings = settings;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Improve the style of your lists")
            .setDesc("Styles are only compatible with built-in Obsidian themes and may not be compatible with other themes. Styles only work well with tab size 4.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.styleLists).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.styleLists = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Draw vertical indentation lines")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.listLines).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.listLines = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Vertical indentation line click action")
            .addDropdown((dropdown) => {
            dropdown
                .addOptions({
                none: "None",
                "zoom-in": "Zoom In",
                "toggle-folding": "Toggle Folding",
            })
                .setValue(this.settings.listLineAction)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.listLineAction = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Stick the cursor to the content")
            .setDesc("Don't let the cursor move to the bullet position.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.stickCursor).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.stickCursor = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Enhance the Enter key")
            .setDesc("Make the Enter key behave the same as other outliners.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.betterEnter).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.betterEnter = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Enhance the Tab key")
            .setDesc("Make Tab and Shift-Tab behave the same as other outliners.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.betterTab).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.betterTab = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Enhance the Ctrl+A or Cmd+A behavior")
            .setDesc("Press the hotkey once to select the current list item. Press the hotkey twice to select the entire list.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.selectAll).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.selectAll = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Debug mode")
            .setDesc("Open DevTools (Command+Option+I or Control+Shift+I) to copy the debug logs.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.debug).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.debug = value;
                yield this.settings.save();
            }));
        });
    }
}
class SettingsTabFeature {
    constructor(plugin, settings) {
        this.plugin = plugin;
        this.settings = settings;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addSettingTab(new ObsidianOutlinerPluginSettingTab(this.plugin.app, this.plugin, this.settings));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class CreateNoteLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const lineUnderCursor = list
            .getLinesInfo()
            .find((l) => l.from.line === cursor.line);
        if (cursor.ch < lineUnderCursor.from.ch) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        if (!list.getNotesIndent()) {
            list.setNotesIndent(list.getFirstLineIndent() + "  ");
        }
        const lines = list.getLinesInfo().reduce((acc, line) => {
            if (cursor.line === line.from.line) {
                acc.push(line.text.slice(0, cursor.ch - line.from.ch));
                acc.push(line.text.slice(cursor.ch - line.from.ch));
            }
            else {
                acc.push(line.text);
            }
            return acc;
        }, []);
        list.replaceLines(lines);
        root.replaceCursor({
            line: cursor.line + 1,
            ch: list.getNotesIndent().length,
        });
    }
}

class ShiftEnterShouldCreateNoteFeature {
    constructor(plugin, obsidian, settings, ime, performOperation) {
        this.plugin = plugin;
        this.obsidian = obsidian;
        this.settings = settings;
        this.ime = ime;
        this.performOperation = performOperation;
        this.check = () => {
            return this.settings.betterEnter && !this.ime.isIMEOpened();
        };
        this.run = (editor) => {
            return this.performOperation.performOperation((root) => new CreateNoteLineOperation(root), editor);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerEditorExtension(view.keymap.of([
                {
                    key: "s-Enter",
                    run: this.obsidian.createKeymapRunCallback({
                        check: this.check,
                        run: this.run,
                    }),
                },
            ]));
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}

class ApplyChangesService {
    applyChanges(editor, root) {
        const rootRange = root.getRange();
        const oldString = editor.getRange(rootRange[0], rootRange[1]);
        const newString = root.print();
        const fromLine = rootRange[0].line;
        const toLine = rootRange[1].line;
        for (let l = fromLine; l <= toLine; l++) {
            editor.unfold(l);
        }
        const changeFrom = Object.assign({}, rootRange[0]);
        const changeTo = Object.assign({}, rootRange[1]);
        let oldTmp = oldString;
        let newTmp = newString;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const nlIndex = oldTmp.lastIndexOf("\n");
            if (nlIndex < 0) {
                break;
            }
            const oldLine = oldTmp.slice(nlIndex);
            const newLine = newTmp.slice(-oldLine.length);
            if (oldLine !== newLine) {
                break;
            }
            oldTmp = oldTmp.slice(0, -oldLine.length);
            newTmp = newTmp.slice(0, -oldLine.length);
            const nlIndex2 = oldTmp.lastIndexOf("\n");
            changeTo.ch =
                nlIndex2 >= 0 ? oldTmp.length - nlIndex2 - 1 : oldTmp.length;
            changeTo.line--;
        }
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const nlIndex = oldTmp.indexOf("\n");
            if (nlIndex < 0) {
                break;
            }
            const oldLine = oldTmp.slice(0, nlIndex + 1);
            const newLine = newTmp.slice(0, oldLine.length);
            if (oldLine !== newLine) {
                break;
            }
            changeFrom.line++;
            oldTmp = oldTmp.slice(oldLine.length);
            newTmp = newTmp.slice(oldLine.length);
        }
        if (oldTmp !== newTmp) {
            editor.replaceRange(newTmp, changeFrom, changeTo);
        }
        editor.setSelections(root.getSelections());
        function recursive(list) {
            for (const c of list.getChildren()) {
                recursive(c);
            }
            if (list.isFoldRoot()) {
                editor.fold(list.getFirstLineContentStart().line);
            }
        }
        for (const c of root.getChildren()) {
            recursive(c);
        }
    }
}

class IMEService {
    constructor() {
        this.composition = false;
        this.onCompositionStart = () => {
            this.composition = true;
        };
        this.onCompositionEnd = () => {
            this.composition = false;
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            document.addEventListener("compositionstart", this.onCompositionStart);
            document.addEventListener("compositionend", this.onCompositionEnd);
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            document.removeEventListener("compositionend", this.onCompositionEnd);
            document.removeEventListener("compositionstart", this.onCompositionStart);
        });
    }
    isIMEOpened() {
        return this.composition;
    }
}

class LoggerService {
    constructor(settings) {
        this.settings = settings;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(method, ...args) {
        if (!this.settings.debug) {
            return;
        }
        console.info(method, ...args);
    }
    bind(method) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (...args) => this.log(method, ...args);
    }
}

class ObsidianService {
    constructor(app) {
        this.app = app;
    }
    isLegacyEditorEnabled() {
        const config = Object.assign({ legacyEditor: false }, this.app.vault.config);
        return config.legacyEditor;
    }
    isDefaultThemeEnabled() {
        const config = Object.assign({ cssTheme: "" }, this.app.vault.config);
        return config.cssTheme === "";
    }
    getObsidianTabsSettings() {
        return Object.assign({ useTab: true, tabSize: 4 }, this.app.vault.config);
    }
    getObsidianFoldSettings() {
        return Object.assign({ foldIndent: false }, this.app.vault.config);
    }
    getDefaultIndentChars() {
        const { useTab, tabSize } = this.getObsidianTabsSettings();
        return useTab ? "\t" : new Array(tabSize).fill(" ").join("");
    }
    getEditorFromState(state) {
        return new MyEditor(state.field(obsidian.editorViewField).editor);
    }
    createKeymapRunCallback(config) {
        const check = config.check || (() => true);
        const { run } = config;
        return (view) => {
            const editor = this.getEditorFromState(view.state);
            if (!check(editor)) {
                return false;
            }
            const { shouldUpdate, shouldStopPropagation } = run(editor);
            return shouldUpdate || shouldStopPropagation;
        };
    }
    createEditorCallback(cb) {
        return (editor) => {
            const myEditor = new MyEditor(editor);
            const shouldStopPropagation = cb(myEditor);
            if (!shouldStopPropagation &&
                window.event &&
                window.event.type === "keydown") {
                myEditor.triggerOnKeyDown(window.event);
            }
        };
    }
}

const bulletSign = `(?:[-*+]|\\d+\\.)`;
const listItemWithoutSpacesRe = new RegExp(`^${bulletSign}( |\t)`);
const listItemRe = new RegExp(`^[ \t]*${bulletSign}( |\t)`);
const stringWithSpacesRe = new RegExp(`^[ \t]+`);
const parseListItemRe = new RegExp(`^([ \t]*)(${bulletSign})( |\t)(.*)$`);
class ParserService {
    constructor(logger) {
        this.logger = logger;
    }
    parseRange(editor, fromLine = 0, toLine = editor.lastLine()) {
        const lists = [];
        for (let i = fromLine; i <= toLine; i++) {
            const line = editor.getLine(i);
            if (i === fromLine || this.isListItem(line)) {
                const list = this.parseWithLimits(editor, i, fromLine, toLine);
                if (list) {
                    lists.push(list);
                    i = list.getRange()[1].line;
                }
            }
        }
        return lists;
    }
    parse(editor, cursor = editor.getCursor()) {
        return this.parseWithLimits(editor, cursor.line, 0, editor.lastLine());
    }
    parseWithLimits(editor, parsingStartLine, limitFrom, limitTo) {
        const d = this.logger.bind("parseList");
        const error = (msg) => {
            d(msg);
            return null;
        };
        const line = editor.getLine(parsingStartLine);
        let listLookingPos = null;
        if (this.isListItem(line)) {
            listLookingPos = parsingStartLine;
        }
        else if (this.isLineWithIndent(line)) {
            let listLookingPosSearch = parsingStartLine - 1;
            while (listLookingPosSearch >= 0) {
                const line = editor.getLine(listLookingPosSearch);
                if (this.isListItem(line)) {
                    listLookingPos = listLookingPosSearch;
                    break;
                }
                else if (this.isLineWithIndent(line)) {
                    listLookingPosSearch--;
                }
                else {
                    break;
                }
            }
        }
        if (listLookingPos == null) {
            return null;
        }
        let listStartLine = null;
        let listStartLineLookup = listLookingPos;
        while (listStartLineLookup >= 0) {
            const line = editor.getLine(listStartLineLookup);
            if (!this.isListItem(line) && !this.isLineWithIndent(line)) {
                break;
            }
            if (this.isListItemWithoutSpaces(line)) {
                listStartLine = listStartLineLookup;
                if (listStartLineLookup <= limitFrom) {
                    break;
                }
            }
            listStartLineLookup--;
        }
        if (listStartLine === null) {
            return null;
        }
        let listEndLine = listLookingPos;
        let listEndLineLookup = listLookingPos;
        while (listEndLineLookup <= editor.lastLine()) {
            const line = editor.getLine(listEndLineLookup);
            if (!this.isListItem(line) && !this.isLineWithIndent(line)) {
                break;
            }
            if (!this.isEmptyLine(line)) {
                listEndLine = listEndLineLookup;
            }
            if (listEndLineLookup >= limitTo) {
                listEndLine = limitTo;
                break;
            }
            listEndLineLookup++;
        }
        if (listStartLine > parsingStartLine || listEndLine < parsingStartLine) {
            return null;
        }
        const root = new Root({ line: listStartLine, ch: 0 }, { line: listEndLine, ch: editor.getLine(listEndLine).length }, editor.listSelections().map((r) => ({
            anchor: { line: r.anchor.line, ch: r.anchor.ch },
            head: { line: r.head.line, ch: r.head.ch },
        })));
        let currentParent = root.getRootList();
        let currentList = null;
        let currentIndent = "";
        const foldedLines = editor.getAllFoldedLines();
        for (let l = listStartLine; l <= listEndLine; l++) {
            const line = editor.getLine(l);
            const matches = parseListItemRe.exec(line);
            if (matches) {
                const [, indent, bullet, spaceAfterBullet, content] = matches;
                const compareLength = Math.min(currentIndent.length, indent.length);
                const indentSlice = indent.slice(0, compareLength);
                const currentIndentSlice = currentIndent.slice(0, compareLength);
                if (indentSlice !== currentIndentSlice) {
                    const expected = currentIndentSlice
                        .replace(/ /g, "S")
                        .replace(/\t/g, "T");
                    const got = indentSlice.replace(/ /g, "S").replace(/\t/g, "T");
                    return error(`Unable to parse list: expected indent "${expected}", got "${got}"`);
                }
                if (indent.length > currentIndent.length) {
                    currentParent = currentList;
                    currentIndent = indent;
                }
                else if (indent.length < currentIndent.length) {
                    while (currentParent.getFirstLineIndent().length >= indent.length &&
                        currentParent.getParent()) {
                        currentParent = currentParent.getParent();
                    }
                    currentIndent = indent;
                }
                const foldRoot = foldedLines.includes(l);
                currentList = new List(root, indent, bullet, spaceAfterBullet, content, foldRoot);
                currentParent.addAfterAll(currentList);
            }
            else if (this.isLineWithIndent(line)) {
                if (!currentList) {
                    return error(`Unable to parse list: expected list item, got empty line`);
                }
                const indentToCheck = currentList.getNotesIndent() || currentIndent;
                if (line.indexOf(indentToCheck) !== 0) {
                    const expected = indentToCheck.replace(/ /g, "S").replace(/\t/g, "T");
                    const got = line
                        .match(/^[ \t]*/)[0]
                        .replace(/ /g, "S")
                        .replace(/\t/g, "T");
                    return error(`Unable to parse list: expected indent "${expected}", got "${got}"`);
                }
                if (!currentList.getNotesIndent()) {
                    const matches = line.match(/^[ \t]+/);
                    if (!matches || matches[0].length <= currentIndent.length) {
                        if (/^\s+$/.test(line)) {
                            continue;
                        }
                        return error(`Unable to parse list: expected some indent, got no indent`);
                    }
                    currentList.setNotesIndent(matches[0]);
                }
                currentList.addLine(line.slice(currentList.getNotesIndent().length));
            }
            else {
                return error(`Unable to parse list: expected list item or note, got "${line}"`);
            }
        }
        return root;
    }
    isEmptyLine(line) {
        return line.length === 0;
    }
    isLineWithIndent(line) {
        return stringWithSpacesRe.test(line);
    }
    isListItem(line) {
        return listItemRe.test(line);
    }
    isListItemWithoutSpaces(line) {
        return listItemWithoutSpacesRe.test(line);
    }
}

class PerformOperationService {
    constructor(parser, applyChanges) {
        this.parser = parser;
        this.applyChanges = applyChanges;
    }
    evalOperation(root, op, editor) {
        op.perform();
        if (op.shouldUpdate()) {
            this.applyChanges.applyChanges(editor, root);
        }
        return {
            shouldUpdate: op.shouldUpdate(),
            shouldStopPropagation: op.shouldStopPropagation(),
        };
    }
    performOperation(cb, editor, cursor = editor.getCursor()) {
        const root = this.parser.parse(editor, cursor);
        if (!root) {
            return { shouldUpdate: false, shouldStopPropagation: false };
        }
        const op = cb(root);
        return this.evalOperation(root, op, editor);
    }
}

const DEFAULT_SETTINGS = {
    styleLists: true,
    debug: false,
    stickCursor: true,
    betterEnter: true,
    betterTab: true,
    selectAll: true,
    listLines: true,
    listLineAction: "toggle-folding",
};
class SettingsService {
    constructor(storage) {
        this.storage = storage;
        this.handlers = new Map();
    }
    get styleLists() {
        return this.values.styleLists;
    }
    set styleLists(value) {
        this.set("styleLists", value);
    }
    get debug() {
        return this.values.debug;
    }
    set debug(value) {
        this.set("debug", value);
    }
    get stickCursor() {
        return this.values.stickCursor;
    }
    set stickCursor(value) {
        this.set("stickCursor", value);
    }
    get betterEnter() {
        return this.values.betterEnter;
    }
    set betterEnter(value) {
        this.set("betterEnter", value);
    }
    get betterTab() {
        return this.values.betterTab;
    }
    set betterTab(value) {
        this.set("betterTab", value);
    }
    get selectAll() {
        return this.values.selectAll;
    }
    set selectAll(value) {
        this.set("selectAll", value);
    }
    get listLines() {
        return this.values.listLines;
    }
    set listLines(value) {
        this.set("listLines", value);
    }
    get listLineAction() {
        return this.values.listLineAction;
    }
    set listLineAction(value) {
        this.set("listLineAction", value);
    }
    onChange(key, cb) {
        if (!this.handlers.has(key)) {
            this.handlers.set(key, new Set());
        }
        this.handlers.get(key).add(cb);
    }
    removeCallback(key, cb) {
        const handlers = this.handlers.get(key);
        if (handlers) {
            handlers.delete(cb);
        }
    }
    reset() {
        for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
            this.set(k, v);
        }
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.values = Object.assign({}, DEFAULT_SETTINGS, yield this.storage.loadData());
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.saveData(this.values);
        });
    }
    set(key, value) {
        this.values[key] = value;
        const callbacks = this.handlers.get(key);
        if (!callbacks) {
            return;
        }
        for (const cb of callbacks.values()) {
            cb(value);
        }
    }
}

class ObsidianOutlinerPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Loading obsidian-outliner`);
            this.obsidian = new ObsidianService(this.app);
            if (this.obsidian.isLegacyEditorEnabled()) {
                new obsidian.Notice(`Outliner plugin does not support legacy editor mode starting from version 2.0. Please disable the "Use legacy editor" option or manually install version 1.0 of Outliner plugin.`, 30000);
                return;
            }
            this.settings = new SettingsService(this);
            yield this.settings.load();
            this.logger = new LoggerService(this.settings);
            this.parser = new ParserService(this.logger);
            this.applyChanges = new ApplyChangesService();
            this.performOperation = new PerformOperationService(this.parser, this.applyChanges);
            this.ime = new IMEService();
            yield this.ime.load();
            this.features = [
                new SettingsTabFeature(this, this.settings),
                new ListsStylesFeature(this.settings, this.obsidian),
                new EnterOutdentIfLineIsEmptyFeature(this, this.settings, this.ime, this.obsidian, this.performOperation),
                new EnterShouldCreateNewItemFeature(this, this.settings, this.ime, this.obsidian, this.performOperation),
                new EnsureCursorInListContentFeature(this, this.settings, this.obsidian, this.performOperation),
                new MoveCursorToPreviousUnfoldedLineFeature(this, this.settings, this.ime, this.obsidian, this.performOperation),
                new DeleteShouldIgnoreBulletsFeature(this, this.settings, this.ime, this.obsidian, this.performOperation),
                new SelectionShouldIgnoreBulletsFeature(this, this.settings, this.ime, this.obsidian, this.performOperation),
                new FoldFeature(this, this.obsidian),
                new SelectAllFeature(this, this.settings, this.ime, this.obsidian, this.performOperation),
                new MoveItemsFeature(this, this.ime, this.obsidian, this.settings, this.performOperation),
                new ShiftEnterShouldCreateNoteFeature(this, this.obsidian, this.settings, this.ime, this.performOperation),
                new LinesFeature(this, this.settings, this.obsidian, this.parser),
            ];
            for (const feature of this.features) {
                yield feature.load();
            }
        });
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Unloading obsidian-outliner`);
            yield this.ime.unload();
            for (const feature of this.features) {
                yield feature.unload();
            }
        });
    }
}

module.exports = ObsidianOutlinerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9yb290L3JlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHMudHMiLCJzcmMvb3BlcmF0aW9ucy9EZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb24udHMiLCJzcmMvb3BlcmF0aW9ucy9EZWxldGVBbmRNZXJnZVdpdGhOZXh0TGluZU9wZXJhdGlvbi50cyIsInNyYy9vcGVyYXRpb25zL0RlbGV0ZVRpbGxMaW5lU3RhcnRPcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvRGVsZXRlU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUudHMiLCJzcmMvb3BlcmF0aW9ucy9FbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uLnRzIiwic3JjL29wZXJhdGlvbnMvRW5zdXJlQ3Vyc29ySXNJblVuZm9sZGVkTGluZU9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9FbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50RmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL01vdmVMZWZ0T3BlcmF0aW9uLnRzIiwic3JjL3V0aWxzL2lzRW1wdHlMaW5lT3JFbXB0eUNoZWNrYm94LnRzIiwic3JjL29wZXJhdGlvbnMvT3V0ZGVudElmTGluZUlzRW1wdHlPcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUudHMiLCJzcmMvcm9vdC9pbmRleC50cyIsInNyYy9vcGVyYXRpb25zL0NyZWF0ZU5ld0l0ZW1PcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvRW50ZXJTaG91bGRDcmVhdGVOZXdJdGVtT25DaGlsZExldmVsRmVhdHVyZS50cyIsInNyYy9mZWF0dXJlcy9Gb2xkRmVhdHVyZS50cyIsInNyYy9NeUVkaXRvci50cyIsInNyYy9mZWF0dXJlcy9MaW5lc0ZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvTGlzdHNTdHlsZXNGZWF0dXJlLnRzIiwic3JjL29wZXJhdGlvbnMvTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVPcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlLnRzIiwic3JjL29wZXJhdGlvbnMvTW92ZURvd25PcGVyYXRpb24udHMiLCJzcmMvb3BlcmF0aW9ucy9Nb3ZlUmlnaHRPcGVyYXRpb24udHMiLCJzcmMvb3BlcmF0aW9ucy9Nb3ZlVXBPcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvTW92ZUl0ZW1zRmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL1NlbGVjdEFsbE9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9TZWxlY3RBbGxGZWF0dXJlLnRzIiwic3JjL29wZXJhdGlvbnMvU2VsZWN0VGlsbExpbmVTdGFydE9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9TZWxlY3Rpb25TaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZS50cyIsInNyYy9mZWF0dXJlcy9TZXR0aW5nc1RhYkZlYXR1cmUudHMiLCJzcmMvb3BlcmF0aW9ucy9DcmVhdGVOb3RlTGluZU9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9TaGlmdEVudGVyU2hvdWxkQ3JlYXRlTm90ZUZlYXR1cmUudHMiLCJzcmMvc2VydmljZXMvQXBwbHlDaGFuZ2VzU2VydmljZS50cyIsInNyYy9zZXJ2aWNlcy9JTUVTZXJ2aWNlLnRzIiwic3JjL3NlcnZpY2VzL0xvZ2dlclNlcnZpY2UudHMiLCJzcmMvc2VydmljZXMvT2JzaWRpYW5TZXJ2aWNlLnRzIiwic3JjL3NlcnZpY2VzL1BhcnNlclNlcnZpY2UudHMiLCJzcmMvc2VydmljZXMvUGVyZm9ybU9wZXJhdGlvblNlcnZpY2UudHMiLCJzcmMvc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlLnRzIiwic3JjL09ic2lkaWFuT3V0bGluZXJQbHVnaW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xyXG4gICAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciA9PT0gc3RhdGUgOiBzdGF0ZS5oYXMocmVjZWl2ZXIpO1xyXG59XHJcbiIsImltcG9ydCB7IExpc3QsIFJvb3QgfSBmcm9tIFwiLlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0cyhyb290OiBSb290KSB7XG4gIGZ1bmN0aW9uIHZpc2l0KHBhcmVudDogUm9vdCB8IExpc3QpIHtcbiAgICBsZXQgaW5kZXggPSAxO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBwYXJlbnQuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgaWYgKC9cXGQrXFwuLy50ZXN0KGNoaWxkLmdldEJ1bGxldCgpKSkge1xuICAgICAgICBjaGlsZC5yZXBsYXRlQnVsbGV0KGAke2luZGV4Kyt9LmApO1xuICAgICAgfVxuXG4gICAgICB2aXNpdChjaGlsZCk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXQocm9vdCk7XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRpb24gfSBmcm9tIFwiLi9PcGVyYXRpb25cIjtcblxuaW1wb3J0IHsgTGlzdCwgTGlzdExpbmUsIFBvc2l0aW9uLCBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IHJlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHMgfSBmcm9tIFwiLi4vcm9vdC9yZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzXCI7XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb24gaW1wbGVtZW50cyBPcGVyYXRpb24ge1xuICBwcml2YXRlIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QpIHt9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVkO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVzID0gbGlzdC5nZXRMaW5lc0luZm8oKTtcblxuICAgIGNvbnN0IGxpbmVObyA9IGxpbmVzLmZpbmRJbmRleChcbiAgICAgIChsKSA9PiBjdXJzb3IuY2ggPT09IGwuZnJvbS5jaCAmJiBjdXJzb3IubGluZSA9PT0gbC5mcm9tLmxpbmVcbiAgICApO1xuXG4gICAgaWYgKGxpbmVObyA9PT0gMCkge1xuICAgICAgdGhpcy5tZXJnZVdpdGhQcmV2aW91c0l0ZW0ocm9vdCwgY3Vyc29yLCBsaXN0KTtcbiAgICB9IGVsc2UgaWYgKGxpbmVObyA+IDApIHtcbiAgICAgIHRoaXMubWVyZ2VOb3Rlcyhyb290LCBjdXJzb3IsIGxpc3QsIGxpbmVzLCBsaW5lTm8pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbWVyZ2VOb3RlcyhcbiAgICByb290OiBSb290LFxuICAgIGN1cnNvcjogUG9zaXRpb24sXG4gICAgbGlzdDogTGlzdCxcbiAgICBsaW5lczogTGlzdExpbmVbXSxcbiAgICBsaW5lTm86IG51bWJlclxuICApIHtcbiAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IHByZXZMaW5lTm8gPSBsaW5lTm8gLSAxO1xuXG4gICAgcm9vdC5yZXBsYWNlQ3Vyc29yKHtcbiAgICAgIGxpbmU6IGN1cnNvci5saW5lIC0gMSxcbiAgICAgIGNoOiBsaW5lc1twcmV2TGluZU5vXS50ZXh0Lmxlbmd0aCArIGxpbmVzW3ByZXZMaW5lTm9dLmZyb20uY2gsXG4gICAgfSk7XG5cbiAgICBsaW5lc1twcmV2TGluZU5vXS50ZXh0ICs9IGxpbmVzW2xpbmVOb10udGV4dDtcbiAgICBsaW5lcy5zcGxpY2UobGluZU5vLCAxKTtcblxuICAgIGxpc3QucmVwbGFjZUxpbmVzKGxpbmVzLm1hcCgobCkgPT4gbC50ZXh0KSk7XG4gIH1cblxuICBwcml2YXRlIG1lcmdlV2l0aFByZXZpb3VzSXRlbShyb290OiBSb290LCBjdXJzb3I6IFBvc2l0aW9uLCBsaXN0OiBMaXN0KSB7XG4gICAgaWYgKHJvb3QuZ2V0Q2hpbGRyZW4oKVswXSA9PT0gbGlzdCAmJiBsaXN0LmdldENoaWxkcmVuKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuXG4gICAgY29uc3QgcHJldiA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShjdXJzb3IubGluZSAtIDEpO1xuXG4gICAgaWYgKCFwcmV2KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYm90aEFyZUVtcHR5ID0gcHJldi5pc0VtcHR5KCkgJiYgbGlzdC5pc0VtcHR5KCk7XG4gICAgY29uc3QgcHJldklzRW1wdHlBbmRTYW1lTGV2ZWwgPVxuICAgICAgcHJldi5pc0VtcHR5KCkgJiYgIWxpc3QuaXNFbXB0eSgpICYmIHByZXYuZ2V0TGV2ZWwoKSA9PSBsaXN0LmdldExldmVsKCk7XG4gICAgY29uc3QgbGlzdElzRW1wdHlBbmRQcmV2SXNQYXJlbnQgPVxuICAgICAgbGlzdC5pc0VtcHR5KCkgJiYgcHJldi5nZXRMZXZlbCgpID09IGxpc3QuZ2V0TGV2ZWwoKSAtIDE7XG5cbiAgICBpZiAoYm90aEFyZUVtcHR5IHx8IHByZXZJc0VtcHR5QW5kU2FtZUxldmVsIHx8IGxpc3RJc0VtcHR5QW5kUHJldklzUGFyZW50KSB7XG4gICAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgICBjb25zdCBwYXJlbnQgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgICAgY29uc3QgcHJldkVuZCA9IHByZXYuZ2V0TGFzdExpbmVDb250ZW50RW5kKCk7XG5cbiAgICAgIGlmICghcHJldi5nZXROb3Rlc0luZGVudCgpICYmIGxpc3QuZ2V0Tm90ZXNJbmRlbnQoKSkge1xuICAgICAgICBwcmV2LnNldE5vdGVzSW5kZW50KFxuICAgICAgICAgIHByZXYuZ2V0Rmlyc3RMaW5lSW5kZW50KCkgK1xuICAgICAgICAgICAgbGlzdC5nZXROb3Rlc0luZGVudCgpLnNsaWNlKGxpc3QuZ2V0Rmlyc3RMaW5lSW5kZW50KCkubGVuZ3RoKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbGRMaW5lcyA9IHByZXYuZ2V0TGluZXMoKTtcbiAgICAgIGNvbnN0IG5ld0xpbmVzID0gbGlzdC5nZXRMaW5lcygpO1xuICAgICAgb2xkTGluZXNbb2xkTGluZXMubGVuZ3RoIC0gMV0gKz0gbmV3TGluZXNbMF07XG4gICAgICBjb25zdCByZXN1bHRMaW5lcyA9IG9sZExpbmVzLmNvbmNhdChuZXdMaW5lcy5zbGljZSgxKSk7XG5cbiAgICAgIHByZXYucmVwbGFjZUxpbmVzKHJlc3VsdExpbmVzKTtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcblxuICAgICAgZm9yIChjb25zdCBjIG9mIGxpc3QuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgICBsaXN0LnJlbW92ZUNoaWxkKGMpO1xuICAgICAgICBwcmV2LmFkZEFmdGVyQWxsKGMpO1xuICAgICAgfVxuXG4gICAgICByb290LnJlcGxhY2VDdXJzb3IocHJldkVuZCk7XG5cbiAgICAgIHJlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHMocm9vdCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBEZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb24gfSBmcm9tIFwiLi9EZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IE9wZXJhdGlvbiB9IGZyb20gXCIuL09wZXJhdGlvblwiO1xuXG5pbXBvcnQgeyBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcblxuZXhwb3J0IGNsYXNzIERlbGV0ZUFuZE1lcmdlV2l0aE5leHRMaW5lT3BlcmF0aW9uIGltcGxlbWVudHMgT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBkZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91czogRGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXNMaW5lT3BlcmF0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge1xuICAgIHRoaXMuZGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXMgPVxuICAgICAgbmV3IERlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzTGluZU9wZXJhdGlvbihyb290KTtcbiAgfVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91cy5zaG91bGRTdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91cy5zaG91bGRVcGRhdGUoKTtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBsaW5lcyA9IGxpc3QuZ2V0TGluZXNJbmZvKCk7XG5cbiAgICBjb25zdCBsaW5lTm8gPSBsaW5lcy5maW5kSW5kZXgoXG4gICAgICAobCkgPT4gY3Vyc29yLmNoID09PSBsLnRvLmNoICYmIGN1cnNvci5saW5lID09PSBsLnRvLmxpbmVcbiAgICApO1xuXG4gICAgaWYgKGxpbmVObyA9PT0gbGluZXMubGVuZ3RoIC0gMSkge1xuICAgICAgY29uc3QgbmV4dExpbmUgPSBsaW5lc1tsaW5lTm9dLnRvLmxpbmUgKyAxO1xuICAgICAgY29uc3QgbmV4dExpc3QgPSByb290LmdldExpc3RVbmRlckxpbmUobmV4dExpbmUpO1xuICAgICAgaWYgKCFuZXh0TGlzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByb290LnJlcGxhY2VDdXJzb3IobmV4dExpc3QuZ2V0Rmlyc3RMaW5lQ29udGVudFN0YXJ0KCkpO1xuICAgICAgdGhpcy5kZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91cy5wZXJmb3JtKCk7XG4gICAgfSBlbHNlIGlmIChsaW5lTm8gPj0gMCkge1xuICAgICAgcm9vdC5yZXBsYWNlQ3Vyc29yKGxpbmVzW2xpbmVObyArIDFdLmZyb20pO1xuICAgICAgdGhpcy5kZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91cy5wZXJmb3JtKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRpb24gfSBmcm9tIFwiLi9PcGVyYXRpb25cIjtcblxuaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVUaWxsTGluZVN0YXJ0T3BlcmF0aW9uIGltcGxlbWVudHMgT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVzID0gbGlzdC5nZXRMaW5lc0luZm8oKTtcbiAgICBjb25zdCBsaW5lTm8gPSBsaW5lcy5maW5kSW5kZXgoKGwpID0+IGwuZnJvbS5saW5lID09PSBjdXJzb3IubGluZSk7XG5cbiAgICBsaW5lc1tsaW5lTm9dLnRleHQgPSBsaW5lc1tsaW5lTm9dLnRleHQuc2xpY2UoXG4gICAgICBjdXJzb3IuY2ggLSBsaW5lc1tsaW5lTm9dLmZyb20uY2hcbiAgICApO1xuXG4gICAgbGlzdC5yZXBsYWNlTGluZXMobGluZXMubWFwKChsKSA9PiBsLnRleHQpKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3IobGluZXNbbGluZU5vXS5mcm9tKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsga2V5bWFwIH0gZnJvbSBcIkBjb2RlbWlycm9yL3ZpZXdcIjtcblxuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gXCIuL0ZlYXR1cmVcIjtcblxuaW1wb3J0IHsgTXlFZGl0b3IgfSBmcm9tIFwiLi4vTXlFZGl0b3JcIjtcbmltcG9ydCB7IERlbGV0ZUFuZE1lcmdlV2l0aE5leHRMaW5lT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvRGVsZXRlQW5kTWVyZ2VXaXRoTmV4dExpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IERlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzTGluZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL0RlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzTGluZU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgRGVsZXRlVGlsbExpbmVTdGFydE9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL0RlbGV0ZVRpbGxMaW5lU3RhcnRPcGVyYXRpb25cIjtcbmltcG9ydCB7IElNRVNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvSU1FU2VydmljZVwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgUGVyZm9ybU9wZXJhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvUGVyZm9ybU9wZXJhdGlvblNlcnZpY2VcIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIERlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIGltcGxlbWVudHMgRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbWU6IElNRVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBvYnNpZGlhbjogT2JzaWRpYW5TZXJ2aWNlLFxuICAgIHByaXZhdGUgcGVyZm9ybU9wZXJhdGlvbjogUGVyZm9ybU9wZXJhdGlvblNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24oXG4gICAgICBrZXltYXAub2YoW1xuICAgICAgICB7XG4gICAgICAgICAga2V5OiBcIkJhY2tzcGFjZVwiLFxuICAgICAgICAgIHJ1bjogdGhpcy5vYnNpZGlhbi5jcmVhdGVLZXltYXBSdW5DYWxsYmFjayh7XG4gICAgICAgICAgICBjaGVjazogdGhpcy5jaGVjayxcbiAgICAgICAgICAgIHJ1bjogdGhpcy5kZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmUsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6IFwiRGVsZXRlXCIsXG4gICAgICAgICAgcnVuOiB0aGlzLm9ic2lkaWFuLmNyZWF0ZUtleW1hcFJ1bkNhbGxiYWNrKHtcbiAgICAgICAgICAgIGNoZWNrOiB0aGlzLmNoZWNrLFxuICAgICAgICAgICAgcnVuOiB0aGlzLmRlbGV0ZUFuZE1lcmdlV2l0aE5leHRMaW5lLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbWFjOiBcIm0tQmFja3NwYWNlXCIsXG4gICAgICAgICAgcnVuOiB0aGlzLm9ic2lkaWFuLmNyZWF0ZUtleW1hcFJ1bkNhbGxiYWNrKHtcbiAgICAgICAgICAgIGNoZWNrOiB0aGlzLmNoZWNrLFxuICAgICAgICAgICAgcnVuOiB0aGlzLmRlbGV0ZVRpbGxMaW5lU3RhcnQsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICBdKVxuICAgICk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxuXG4gIHByaXZhdGUgY2hlY2sgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgJiYgIXRoaXMuaW1lLmlzSU1FT3BlbmVkKCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBkZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmUgPSAoZWRpdG9yOiBNeUVkaXRvcikgPT4ge1xuICAgIHJldHVybiB0aGlzLnBlcmZvcm1PcGVyYXRpb24ucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PiBuZXcgRGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXNMaW5lT3BlcmF0aW9uKHJvb3QpLFxuICAgICAgZWRpdG9yXG4gICAgKTtcbiAgfTtcblxuICBwcml2YXRlIGRlbGV0ZVRpbGxMaW5lU3RhcnQgPSAoZWRpdG9yOiBNeUVkaXRvcikgPT4ge1xuICAgIHJldHVybiB0aGlzLnBlcmZvcm1PcGVyYXRpb24ucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PiBuZXcgRGVsZXRlVGlsbExpbmVTdGFydE9wZXJhdGlvbihyb290KSxcbiAgICAgIGVkaXRvclxuICAgICk7XG4gIH07XG5cbiAgcHJpdmF0ZSBkZWxldGVBbmRNZXJnZVdpdGhOZXh0TGluZSA9IChlZGl0b3I6IE15RWRpdG9yKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBEZWxldGVBbmRNZXJnZVdpdGhOZXh0TGluZU9wZXJhdGlvbihyb290KSxcbiAgICAgIGVkaXRvclxuICAgICk7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRpb24gfSBmcm9tIFwiLi9PcGVyYXRpb25cIjtcblxuaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5cbmV4cG9ydCBjbGFzcyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uIGltcGxlbWVudHMgT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBjb250ZW50U3RhcnQgPSBsaXN0LmdldEZpcnN0TGluZUNvbnRlbnRTdGFydCgpO1xuICAgIGNvbnN0IGxpbmVQcmVmaXggPVxuICAgICAgY29udGVudFN0YXJ0LmxpbmUgPT09IGN1cnNvci5saW5lXG4gICAgICAgID8gY29udGVudFN0YXJ0LmNoXG4gICAgICAgIDogbGlzdC5nZXROb3Rlc0luZGVudCgpLmxlbmd0aDtcblxuICAgIGlmIChjdXJzb3IuY2ggPCBsaW5lUHJlZml4KSB7XG4gICAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuICAgICAgcm9vdC5yZXBsYWNlQ3Vyc29yKHtcbiAgICAgICAgbGluZTogY3Vyc29yLmxpbmUsXG4gICAgICAgIGNoOiBsaW5lUHJlZml4LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRpb24gfSBmcm9tIFwiLi9PcGVyYXRpb25cIjtcblxuaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5cbmV4cG9ydCBjbGFzcyBFbnN1cmVDdXJzb3JJc0luVW5mb2xkZWRMaW5lT3BlcmF0aW9uIGltcGxlbWVudHMgT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGlmICghbGlzdC5pc0ZvbGRlZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZm9sZFJvb3QgPSBsaXN0LmdldFRvcEZvbGRSb290KCk7XG4gICAgY29uc3QgZmlyc3RMaW5lRW5kID0gZm9sZFJvb3QuZ2V0TGluZXNJbmZvKClbMF0udG87XG5cbiAgICBpZiAoY3Vyc29yLmxpbmUgPiBmaXJzdExpbmVFbmQubGluZSkge1xuICAgICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcbiAgICAgIHJvb3QucmVwbGFjZUN1cnNvcihmaXJzdExpbmVFbmQpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgRWRpdG9yU3RhdGUsIFRyYW5zYWN0aW9uIH0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5cbmltcG9ydCB7IE15RWRpdG9yIH0gZnJvbSBcIi4uL015RWRpdG9yXCI7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVzL0ZlYXR1cmVcIjtcbmltcG9ydCB7IEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9FbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBFbnN1cmVDdXJzb3JJc0luVW5mb2xkZWRMaW5lT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvRW5zdXJlQ3Vyc29ySXNJblVuZm9sZGVkTGluZU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgUGVyZm9ybU9wZXJhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvUGVyZm9ybU9wZXJhdGlvblNlcnZpY2VcIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlIGltcGxlbWVudHMgRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBvYnNpZGlhbjogT2JzaWRpYW5TZXJ2aWNlLFxuICAgIHByaXZhdGUgcGVyZm9ybU9wZXJhdGlvbjogUGVyZm9ybU9wZXJhdGlvblNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24oXG4gICAgICBFZGl0b3JTdGF0ZS50cmFuc2FjdGlvbkV4dGVuZGVyLm9mKHRoaXMudHJhbnNhY3Rpb25FeHRlbmRlcilcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIHRyYW5zYWN0aW9uRXh0ZW5kZXIgPSAodHI6IFRyYW5zYWN0aW9uKTogbnVsbCA9PiB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yIHx8ICF0ci5zZWxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMub2JzaWRpYW4uZ2V0RWRpdG9yRnJvbVN0YXRlKHRyLnN0YXJ0U3RhdGUpO1xuXG4gICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlQ3Vyc29yQWN0aXZpdHkoZWRpdG9yKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIHByaXZhdGUgaGFuZGxlQ3Vyc29yQWN0aXZpdHkgPSAoZWRpdG9yOiBNeUVkaXRvcikgPT4ge1xuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBFbnN1cmVDdXJzb3JJc0luVW5mb2xkZWRMaW5lT3BlcmF0aW9uKHJvb3QpLFxuICAgICAgZWRpdG9yXG4gICAgKTtcblxuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uKHJvb3QpLFxuICAgICAgZWRpdG9yXG4gICAgKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IE9wZXJhdGlvbiB9IGZyb20gXCIuL09wZXJhdGlvblwiO1xuXG5pbXBvcnQgeyBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IHJlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHMgfSBmcm9tIFwiLi4vcm9vdC9yZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzXCI7XG5cbmV4cG9ydCBjbGFzcyBNb3ZlTGVmdE9wZXJhdGlvbiBpbXBsZW1lbnRzIE9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG5cbiAgICBpZiAoIWdyYW5kUGFyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVCZWZvcmUgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG4gICAgY29uc3QgaW5kZW50Um1Gcm9tID0gcGFyZW50LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aDtcbiAgICBjb25zdCBpbmRlbnRSbVRpbGwgPSBsaXN0LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aDtcblxuICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICBncmFuZFBhcmVudC5hZGRBZnRlcihwYXJlbnQsIGxpc3QpO1xuICAgIGxpc3QudW5pbmRlbnRDb250ZW50KGluZGVudFJtRnJvbSwgaW5kZW50Um1UaWxsKTtcblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVBZnRlciA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcbiAgICBjb25zdCBsaW5lRGlmZiA9IGxpc3RTdGFydExpbmVBZnRlciAtIGxpc3RTdGFydExpbmVCZWZvcmU7XG4gICAgY29uc3QgY2hEaWZmID0gaW5kZW50Um1UaWxsIC0gaW5kZW50Um1Gcm9tO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgKyBsaW5lRGlmZixcbiAgICAgIGNoOiBjdXJzb3IuY2ggLSBjaERpZmYsXG4gICAgfSk7XG5cbiAgICByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzKHJvb3QpO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3gobGluZTogc3RyaW5nKSB7XG4gIHJldHVybiBsaW5lID09PSBcIlwiIHx8IGxpbmUgPT09IFwiWyBdIFwiO1xufVxuIiwiaW1wb3J0IHsgTW92ZUxlZnRPcGVyYXRpb24gfSBmcm9tIFwiLi9Nb3ZlTGVmdE9wZXJhdGlvblwiO1xuaW1wb3J0IHsgT3BlcmF0aW9uIH0gZnJvbSBcIi4vT3BlcmF0aW9uXCI7XG5cbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3ggfSBmcm9tIFwiLi4vdXRpbHMvaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3hcIjtcblxuZXhwb3J0IGNsYXNzIE91dGRlbnRJZkxpbmVJc0VtcHR5T3BlcmF0aW9uIGltcGxlbWVudHMgT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBtb3ZlTGVmdE9wOiBNb3ZlTGVmdE9wZXJhdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QpIHtcbiAgICB0aGlzLm1vdmVMZWZ0T3AgPSBuZXcgTW92ZUxlZnRPcGVyYXRpb24ocm9vdCk7XG4gIH1cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZUxlZnRPcC5zaG91bGRTdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5tb3ZlTGVmdE9wLnNob3VsZFVwZGF0ZSgpO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBsaW5lcyA9IGxpc3QuZ2V0TGluZXMoKTtcblxuICAgIGlmIChcbiAgICAgIGxpbmVzLmxlbmd0aCA+IDEgfHxcbiAgICAgICFpc0VtcHR5TGluZU9yRW1wdHlDaGVja2JveChsaW5lc1swXSkgfHxcbiAgICAgIGxpc3QuZ2V0TGV2ZWwoKSA9PT0gMVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubW92ZUxlZnRPcC5wZXJmb3JtKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IFByZWMgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcbmltcG9ydCB7IGtleW1hcCB9IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5cbmltcG9ydCB7IE15RWRpdG9yIH0gZnJvbSBcIi4uL015RWRpdG9yXCI7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVzL0ZlYXR1cmVcIjtcbmltcG9ydCB7IE91dGRlbnRJZkxpbmVJc0VtcHR5T3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvT3V0ZGVudElmTGluZUlzRW1wdHlPcGVyYXRpb25cIjtcbmltcG9ydCB7IElNRVNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvSU1FU2VydmljZVwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgUGVyZm9ybU9wZXJhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvUGVyZm9ybU9wZXJhdGlvblNlcnZpY2VcIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlIGltcGxlbWVudHMgRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbWU6IElNRVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBvYnNpZGlhbjogT2JzaWRpYW5TZXJ2aWNlLFxuICAgIHByaXZhdGUgcGVyZm9ybU9wZXJhdGlvbjogUGVyZm9ybU9wZXJhdGlvblNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24oXG4gICAgICBQcmVjLmhpZ2hlc3QoXG4gICAgICAgIGtleW1hcC5vZihbXG4gICAgICAgICAge1xuICAgICAgICAgICAga2V5OiBcIkVudGVyXCIsXG4gICAgICAgICAgICBydW46IHRoaXMub2JzaWRpYW4uY3JlYXRlS2V5bWFwUnVuQ2FsbGJhY2soe1xuICAgICAgICAgICAgICBjaGVjazogdGhpcy5jaGVjayxcbiAgICAgICAgICAgICAgcnVuOiB0aGlzLnJ1bixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG5cbiAgcHJpdmF0ZSBjaGVjayA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5iZXR0ZXJFbnRlciAmJiAhdGhpcy5pbWUuaXNJTUVPcGVuZWQoKTtcbiAgfTtcblxuICBwcml2YXRlIHJ1biA9IChlZGl0b3I6IE15RWRpdG9yKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBPdXRkZW50SWZMaW5lSXNFbXB0eU9wZXJhdGlvbihyb290KSxcbiAgICAgIGVkaXRvclxuICAgICk7XG4gIH07XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY21wUG9zKGE6IFBvc2l0aW9uLCBiOiBQb3NpdGlvbikge1xuICByZXR1cm4gYS5saW5lIC0gYi5saW5lIHx8IGEuY2ggLSBiLmNoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF4UG9zKGE6IFBvc2l0aW9uLCBiOiBQb3NpdGlvbikge1xuICByZXR1cm4gY21wUG9zKGEsIGIpIDwgMCA/IGIgOiBhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWluUG9zKGE6IFBvc2l0aW9uLCBiOiBQb3NpdGlvbikge1xuICByZXR1cm4gY21wUG9zKGEsIGIpIDwgMCA/IGEgOiBiO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uIHtcbiAgY2g6IG51bWJlcjtcbiAgbGluZTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpc3RMaW5lIHtcbiAgdGV4dDogc3RyaW5nO1xuICBmcm9tOiBQb3NpdGlvbjtcbiAgdG86IFBvc2l0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlIHtcbiAgYW5jaG9yOiBQb3NpdGlvbjtcbiAgaGVhZDogUG9zaXRpb247XG59XG5cbmV4cG9ydCBjbGFzcyBMaXN0IHtcbiAgcHJpdmF0ZSBwYXJlbnQ6IExpc3QgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBjaGlsZHJlbjogTGlzdFtdID0gW107XG4gIHByaXZhdGUgbm90ZXNJbmRlbnQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcm9vdDogUm9vdCxcbiAgICBwcml2YXRlIGluZGVudDogc3RyaW5nLFxuICAgIHByaXZhdGUgYnVsbGV0OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBzcGFjZUFmdGVyQnVsbGV0OiBzdHJpbmcsXG4gICAgZmlyc3RMaW5lOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBmb2xkUm9vdDogYm9vbGVhblxuICApIHtcbiAgICB0aGlzLmxpbmVzLnB1c2goZmlyc3RMaW5lKTtcbiAgfVxuXG4gIGdldE5vdGVzSW5kZW50KCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLm5vdGVzSW5kZW50O1xuICB9XG5cbiAgc2V0Tm90ZXNJbmRlbnQobm90ZXNJbmRlbnQ6IHN0cmluZykge1xuICAgIGlmICh0aGlzLm5vdGVzSW5kZW50ICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdGVzIGluZGVudCBhbHJlYWR5IHByb3ZpZGVkYCk7XG4gICAgfVxuICAgIHRoaXMubm90ZXNJbmRlbnQgPSBub3Rlc0luZGVudDtcbiAgfVxuXG4gIGFkZExpbmUodGV4dDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMubm90ZXNJbmRlbnQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFVuYWJsZSB0byBhZGQgbGluZSwgbm90ZXMgaW5kZW50IHNob3VsZCBiZSBwcm92aWRlZCBmaXJzdGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5saW5lcy5wdXNoKHRleHQpO1xuICB9XG5cbiAgcmVwbGFjZUxpbmVzKGxpbmVzOiBzdHJpbmdbXSkge1xuICAgIGlmIChsaW5lcy5sZW5ndGggPiAxICYmIHRoaXMubm90ZXNJbmRlbnQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFVuYWJsZSB0byBhZGQgbGluZSwgbm90ZXMgaW5kZW50IHNob3VsZCBiZSBwcm92aWRlZCBmaXJzdGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5saW5lcyA9IGxpbmVzO1xuICB9XG5cbiAgZ2V0TGluZUNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzLmxlbmd0aDtcbiAgfVxuXG4gIGdldFJvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdDtcbiAgfVxuXG4gIGdldENoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmNvbmNhdCgpO1xuICB9XG5cbiAgZ2V0TGluZXNJbmZvKCk6IExpc3RMaW5lW10ge1xuICAgIGNvbnN0IHN0YXJ0TGluZSA9IHRoaXMucm9vdC5nZXRDb250ZW50TGluZXNSYW5nZU9mKHRoaXMpWzBdO1xuXG4gICAgcmV0dXJuIHRoaXMubGluZXMubWFwKChyb3csIGkpID0+IHtcbiAgICAgIGNvbnN0IGxpbmUgPSBzdGFydExpbmUgKyBpO1xuICAgICAgY29uc3Qgc3RhcnRDaCA9XG4gICAgICAgIGkgPT09IDAgPyB0aGlzLmdldENvbnRlbnRTdGFydENoKCkgOiB0aGlzLm5vdGVzSW5kZW50Lmxlbmd0aDtcbiAgICAgIGNvbnN0IGVuZENoID0gc3RhcnRDaCArIHJvdy5sZW5ndGg7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRleHQ6IHJvdyxcbiAgICAgICAgZnJvbTogeyBsaW5lLCBjaDogc3RhcnRDaCB9LFxuICAgICAgICB0bzogeyBsaW5lLCBjaDogZW5kQ2ggfSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBnZXRMaW5lcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXMuY29uY2F0KCk7XG4gIH1cblxuICBnZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKSB7XG4gICAgY29uc3Qgc3RhcnRMaW5lID0gdGhpcy5yb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YodGhpcylbMF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZTogc3RhcnRMaW5lLFxuICAgICAgY2g6IHRoaXMuZ2V0Q29udGVudFN0YXJ0Q2goKSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0TGFzdExpbmVDb250ZW50RW5kKCkge1xuICAgIGNvbnN0IGVuZExpbmUgPSB0aGlzLnJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZih0aGlzKVsxXTtcbiAgICBjb25zdCBlbmRDaCA9XG4gICAgICB0aGlzLmxpbmVzLmxlbmd0aCA9PT0gMVxuICAgICAgICA/IHRoaXMuZ2V0Q29udGVudFN0YXJ0Q2goKSArIHRoaXMubGluZXNbMF0ubGVuZ3RoXG4gICAgICAgIDogdGhpcy5ub3Rlc0luZGVudC5sZW5ndGggKyB0aGlzLmxpbmVzW3RoaXMubGluZXMubGVuZ3RoIC0gMV0ubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmU6IGVuZExpbmUsXG4gICAgICBjaDogZW5kQ2gsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q29udGVudFN0YXJ0Q2goKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5kZW50Lmxlbmd0aCArIHRoaXMuYnVsbGV0Lmxlbmd0aCArIDE7XG4gIH1cblxuICBpc0ZvbGRlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5mb2xkUm9vdCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaXNGb2xkZWQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0ZvbGRSb290KCkge1xuICAgIHJldHVybiB0aGlzLmZvbGRSb290O1xuICB9XG5cbiAgZ2V0VG9wRm9sZFJvb3QoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgbGV0IHRtcDogTGlzdCA9IHRoaXM7XG4gICAgbGV0IGZvbGRSb290OiBMaXN0IHwgbnVsbCA9IG51bGw7XG4gICAgd2hpbGUgKHRtcCkge1xuICAgICAgaWYgKHRtcC5pc0ZvbGRSb290KCkpIHtcbiAgICAgICAgZm9sZFJvb3QgPSB0bXA7XG4gICAgICB9XG4gICAgICB0bXAgPSB0bXAucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gZm9sZFJvb3Q7XG4gIH1cblxuICBnZXRMZXZlbCgpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRMZXZlbCgpICsgMTtcbiAgfVxuXG4gIHVuaW5kZW50Q29udGVudChmcm9tOiBudW1iZXIsIHRpbGw6IG51bWJlcikge1xuICAgIHRoaXMuaW5kZW50ID0gdGhpcy5pbmRlbnQuc2xpY2UoMCwgZnJvbSkgKyB0aGlzLmluZGVudC5zbGljZSh0aWxsKTtcbiAgICBpZiAodGhpcy5ub3Rlc0luZGVudCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5ub3Rlc0luZGVudCA9XG4gICAgICAgIHRoaXMubm90ZXNJbmRlbnQuc2xpY2UoMCwgZnJvbSkgKyB0aGlzLm5vdGVzSW5kZW50LnNsaWNlKHRpbGwpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQudW5pbmRlbnRDb250ZW50KGZyb20sIHRpbGwpO1xuICAgIH1cbiAgfVxuXG4gIGluZGVudENvbnRlbnQoaW5kZW50UG9zOiBudW1iZXIsIGluZGVudENoYXJzOiBzdHJpbmcpIHtcbiAgICB0aGlzLmluZGVudCA9XG4gICAgICB0aGlzLmluZGVudC5zbGljZSgwLCBpbmRlbnRQb3MpICtcbiAgICAgIGluZGVudENoYXJzICtcbiAgICAgIHRoaXMuaW5kZW50LnNsaWNlKGluZGVudFBvcyk7XG4gICAgaWYgKHRoaXMubm90ZXNJbmRlbnQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMubm90ZXNJbmRlbnQgPVxuICAgICAgICB0aGlzLm5vdGVzSW5kZW50LnNsaWNlKDAsIGluZGVudFBvcykgK1xuICAgICAgICBpbmRlbnRDaGFycyArXG4gICAgICAgIHRoaXMubm90ZXNJbmRlbnQuc2xpY2UoaW5kZW50UG9zKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLmluZGVudENvbnRlbnQoaW5kZW50UG9zLCBpbmRlbnRDaGFycyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Rmlyc3RMaW5lSW5kZW50KCkge1xuICAgIHJldHVybiB0aGlzLmluZGVudDtcbiAgfVxuXG4gIGdldEJ1bGxldCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWxsZXQ7XG4gIH1cblxuICBnZXRTcGFjZUFmdGVyQnVsbGV0KCkge1xuICAgIHJldHVybiB0aGlzLnNwYWNlQWZ0ZXJCdWxsZXQ7XG4gIH1cblxuICByZXBsYXRlQnVsbGV0KGJ1bGxldDogc3RyaW5nKSB7XG4gICAgdGhpcy5idWxsZXQgPSBidWxsZXQ7XG4gIH1cblxuICBnZXRQYXJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50O1xuICB9XG5cbiAgYWRkQmVmb3JlQWxsKGxpc3Q6IExpc3QpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQobGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgYWRkQWZ0ZXJBbGwobGlzdDogTGlzdCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChsaXN0KTtcbiAgICBsaXN0LnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICByZW1vdmVDaGlsZChsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihsaXN0KTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpLCAxKTtcbiAgICBsaXN0LnBhcmVudCA9IG51bGw7XG4gIH1cblxuICBhZGRCZWZvcmUoYmVmb3JlOiBMaXN0LCBsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihiZWZvcmUpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGksIDAsIGxpc3QpO1xuICAgIGxpc3QucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIGFkZEFmdGVyKGJlZm9yZTogTGlzdCwgbGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYmVmb3JlKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpICsgMSwgMCwgbGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgZ2V0UHJldlNpYmxpbmdPZihsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihsaXN0KTtcbiAgICByZXR1cm4gaSA+IDAgPyB0aGlzLmNoaWxkcmVuW2kgLSAxXSA6IG51bGw7XG4gIH1cblxuICBnZXROZXh0U2libGluZ09mKGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGxpc3QpO1xuICAgIHJldHVybiBpID49IDAgJiYgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoID8gdGhpcy5jaGlsZHJlbltpICsgMV0gOiBudWxsO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDA7XG4gIH1cblxuICBwcmludCgpIHtcbiAgICBsZXQgcmVzID0gXCJcIjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzICs9XG4gICAgICAgIGkgPT09IDBcbiAgICAgICAgICA/IHRoaXMuaW5kZW50ICsgdGhpcy5idWxsZXQgKyB0aGlzLnNwYWNlQWZ0ZXJCdWxsZXRcbiAgICAgICAgICA6IHRoaXMubm90ZXNJbmRlbnQ7XG4gICAgICByZXMgKz0gdGhpcy5saW5lc1tpXTtcbiAgICAgIHJlcyArPSBcIlxcblwiO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgcmVzICs9IGNoaWxkLnByaW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUm9vdCB7XG4gIHByaXZhdGUgcm9vdExpc3QgPSBuZXcgTGlzdCh0aGlzLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCBmYWxzZSk7XG4gIHByaXZhdGUgc2VsZWN0aW9uczogUmFuZ2VbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RhcnQ6IFBvc2l0aW9uLFxuICAgIHByaXZhdGUgZW5kOiBQb3NpdGlvbixcbiAgICBzZWxlY3Rpb25zOiBSYW5nZVtdXG4gICkge1xuICAgIHRoaXMucmVwbGFjZVNlbGVjdGlvbnMoc2VsZWN0aW9ucyk7XG4gIH1cblxuICBnZXRSb290TGlzdCgpIHtcbiAgICByZXR1cm4gdGhpcy5yb290TGlzdDtcbiAgfVxuXG4gIGdldFJhbmdlKCk6IFtQb3NpdGlvbiwgUG9zaXRpb25dIHtcbiAgICByZXR1cm4gW3sgLi4udGhpcy5zdGFydCB9LCB7IC4uLnRoaXMuZW5kIH1dO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9ucygpOiBSYW5nZVtdIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25zLm1hcCgocykgPT4gKHtcbiAgICAgIGFuY2hvcjogeyAuLi5zLmFuY2hvciB9LFxuICAgICAgaGVhZDogeyAuLi5zLmhlYWQgfSxcbiAgICB9KSk7XG4gIH1cblxuICBoYXNTaW5nbGVDdXJzb3IoKSB7XG4gICAgaWYgKCF0aGlzLmhhc1NpbmdsZVNlbGVjdGlvbigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25zWzBdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIHNlbGVjdGlvbi5hbmNob3IubGluZSA9PT0gc2VsZWN0aW9uLmhlYWQubGluZSAmJlxuICAgICAgc2VsZWN0aW9uLmFuY2hvci5jaCA9PT0gc2VsZWN0aW9uLmhlYWQuY2hcbiAgICApO1xuICB9XG5cbiAgaGFzU2luZ2xlU2VsZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbnMubGVuZ3RoID09PSAxO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKCkge1xuICAgIHJldHVybiB7IC4uLnRoaXMuc2VsZWN0aW9uc1t0aGlzLnNlbGVjdGlvbnMubGVuZ3RoIC0gMV0uaGVhZCB9O1xuICB9XG5cbiAgcmVwbGFjZUN1cnNvcihjdXJzb3I6IFBvc2l0aW9uKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25zID0gW3sgYW5jaG9yOiBjdXJzb3IsIGhlYWQ6IGN1cnNvciB9XTtcbiAgfVxuXG4gIHJlcGxhY2VTZWxlY3Rpb25zKHNlbGVjdGlvbnM6IFJhbmdlW10pIHtcbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBjcmVhdGUgUm9vdCB3aXRob3V0IHNlbGVjdGlvbnNgKTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb25zID0gc2VsZWN0aW9ucztcbiAgfVxuXG4gIGdldExpc3RVbmRlckN1cnNvcigpOiBMaXN0IHtcbiAgICByZXR1cm4gdGhpcy5nZXRMaXN0VW5kZXJMaW5lKHRoaXMuZ2V0Q3Vyc29yKCkubGluZSk7XG4gIH1cblxuICBnZXRMaXN0VW5kZXJMaW5lKGxpbmU6IG51bWJlcikge1xuICAgIGlmIChsaW5lIDwgdGhpcy5zdGFydC5saW5lIHx8IGxpbmUgPiB0aGlzLmVuZC5saW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDogTGlzdCA9IG51bGw7XG4gICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLnN0YXJ0LmxpbmU7XG5cbiAgICBjb25zdCB2aXNpdEFyciA9IChsbDogTGlzdFtdKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGwgb2YgbGwpIHtcbiAgICAgICAgY29uc3QgbGlzdEZyb21MaW5lID0gaW5kZXg7XG4gICAgICAgIGNvbnN0IGxpc3RUaWxsTGluZSA9IGxpc3RGcm9tTGluZSArIGwuZ2V0TGluZUNvdW50KCkgLSAxO1xuXG4gICAgICAgIGlmIChsaW5lID49IGxpc3RGcm9tTGluZSAmJiBsaW5lIDw9IGxpc3RUaWxsTGluZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kZXggPSBsaXN0VGlsbExpbmUgKyAxO1xuICAgICAgICAgIHZpc2l0QXJyKGwuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2aXNpdEFycih0aGlzLnJvb3RMaXN0LmdldENoaWxkcmVuKCkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdDogTGlzdCk6IFtudW1iZXIsIG51bWJlcl0gfCBudWxsIHtcbiAgICBsZXQgcmVzdWx0OiBbbnVtYmVyLCBudW1iZXJdIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGxpbmU6IG51bWJlciA9IHRoaXMuc3RhcnQubGluZTtcblxuICAgIGNvbnN0IHZpc2l0QXJyID0gKGxsOiBMaXN0W10pID0+IHtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsbCkge1xuICAgICAgICBjb25zdCBsaXN0RnJvbUxpbmUgPSBsaW5lO1xuICAgICAgICBjb25zdCBsaXN0VGlsbExpbmUgPSBsaXN0RnJvbUxpbmUgKyBsLmdldExpbmVDb3VudCgpIC0gMTtcblxuICAgICAgICBpZiAobCA9PT0gbGlzdCkge1xuICAgICAgICAgIHJlc3VsdCA9IFtsaXN0RnJvbUxpbmUsIGxpc3RUaWxsTGluZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGluZSA9IGxpc3RUaWxsTGluZSArIDE7XG4gICAgICAgICAgdmlzaXRBcnIobC5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmlzaXRBcnIodGhpcy5yb290TGlzdC5nZXRDaGlsZHJlbigpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy5yb290TGlzdC5nZXRDaGlsZHJlbigpO1xuICB9XG5cbiAgcHJpbnQoKSB7XG4gICAgbGV0IHJlcyA9IFwiXCI7XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgcmVzICs9IGNoaWxkLnByaW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5yZXBsYWNlKC9cXG4kLywgXCJcIik7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9wZXJhdGlvbiB9IGZyb20gXCIuL09wZXJhdGlvblwiO1xuXG5pbXBvcnQgeyBMaXN0LCBQb3NpdGlvbiwgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzIH0gZnJvbSBcIi4uL3Jvb3QvcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0c1wiO1xuaW1wb3J0IHsgaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3ggfSBmcm9tIFwiLi4vdXRpbHMvaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3hcIjtcblxuZXhwb3J0IGludGVyZmFjZSBHZXRab29tUmFuZ2Uge1xuICBnZXRab29tUmFuZ2UoKTogeyBmcm9tOiBQb3NpdGlvbjsgdG86IFBvc2l0aW9uIH0gfCBudWxsO1xufVxuXG5leHBvcnQgY2xhc3MgQ3JlYXRlTmV3SXRlbU9wZXJhdGlvbiBpbXBsZW1lbnRzIE9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcm9vdDogUm9vdCxcbiAgICBwcml2YXRlIGRlZmF1bHRJbmRlbnRDaGFyczogc3RyaW5nLFxuICAgIHByaXZhdGUgZ2V0Wm9vbVJhbmdlOiBHZXRab29tUmFuZ2VcbiAgKSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGluZXMgPSBsaXN0LmdldExpbmVzSW5mbygpO1xuXG4gICAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMSAmJiBpc0VtcHR5TGluZU9yRW1wdHlDaGVja2JveChsaW5lc1swXS50ZXh0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgbGluZVVuZGVyQ3Vyc29yID0gbGluZXMuZmluZCgobCkgPT4gbC5mcm9tLmxpbmUgPT09IGN1cnNvci5saW5lKTtcblxuICAgIGlmIChjdXJzb3IuY2ggPCBsaW5lVW5kZXJDdXJzb3IuZnJvbS5jaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgb2xkTGluZXMsIG5ld0xpbmVzIH0gPSBsaW5lcy5yZWR1Y2UoXG4gICAgICAoYWNjLCBsaW5lKSA9PiB7XG4gICAgICAgIGlmIChjdXJzb3IubGluZSA+IGxpbmUuZnJvbS5saW5lKSB7XG4gICAgICAgICAgYWNjLm9sZExpbmVzLnB1c2gobGluZS50ZXh0KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IubGluZSA9PT0gbGluZS5mcm9tLmxpbmUpIHtcbiAgICAgICAgICBjb25zdCBhID0gbGluZS50ZXh0LnNsaWNlKDAsIGN1cnNvci5jaCAtIGxpbmUuZnJvbS5jaCk7XG4gICAgICAgICAgY29uc3QgYiA9IGxpbmUudGV4dC5zbGljZShjdXJzb3IuY2ggLSBsaW5lLmZyb20uY2gpO1xuICAgICAgICAgIGFjYy5vbGRMaW5lcy5wdXNoKGEpO1xuICAgICAgICAgIGFjYy5uZXdMaW5lcy5wdXNoKGIpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvci5saW5lIDwgbGluZS5mcm9tLmxpbmUpIHtcbiAgICAgICAgICBhY2MubmV3TGluZXMucHVzaChsaW5lLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9sZExpbmVzOiBbXSxcbiAgICAgICAgbmV3TGluZXM6IFtdLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBjb2RlQmxvY2tCYWN0aWNrcyA9IG9sZExpbmVzLmpvaW4oXCJcXG5cIikuc3BsaXQoXCJgYGBcIikubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBpc0luc2lkZUNvZGVibG9jayA9XG4gICAgICBjb2RlQmxvY2tCYWN0aWNrcyA+IDAgJiYgY29kZUJsb2NrQmFjdGlja3MgJSAyICE9PSAwO1xuXG4gICAgaWYgKGlzSW5zaWRlQ29kZWJsb2NrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICBjb25zdCB6b29tUmFuZ2UgPSB0aGlzLmdldFpvb21SYW5nZS5nZXRab29tUmFuZ2UoKTtcbiAgICBjb25zdCBsaXN0SXNab29taW5nUm9vdCA9IEJvb2xlYW4oXG4gICAgICB6b29tUmFuZ2UgJiZcbiAgICAgICAgbGlzdC5nZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKS5saW5lID49IHpvb21SYW5nZS5mcm9tLmxpbmUgJiZcbiAgICAgICAgbGlzdC5nZXRMYXN0TGluZUNvbnRlbnRFbmQoKS5saW5lIDw9IHpvb21SYW5nZS5mcm9tLmxpbmVcbiAgICApO1xuXG4gICAgY29uc3QgaGFzQ2hpbGRyZW4gPSAhbGlzdC5pc0VtcHR5KCk7XG4gICAgY29uc3QgY2hpbGRJc0ZvbGRlZCA9IGxpc3QuaXNGb2xkUm9vdCgpO1xuICAgIGNvbnN0IGVuZFBvcyA9IGxpc3QuZ2V0TGFzdExpbmVDb250ZW50RW5kKCk7XG4gICAgY29uc3QgZW5kT2ZMaW5lID0gY3Vyc29yLmxpbmUgPT09IGVuZFBvcy5saW5lICYmIGN1cnNvci5jaCA9PT0gZW5kUG9zLmNoO1xuXG4gICAgY29uc3Qgb25DaGlsZExldmVsID1cbiAgICAgIGxpc3RJc1pvb21pbmdSb290IHx8IChoYXNDaGlsZHJlbiAmJiAhY2hpbGRJc0ZvbGRlZCAmJiBlbmRPZkxpbmUpO1xuXG4gICAgY29uc3QgaW5kZW50ID0gb25DaGlsZExldmVsXG4gICAgICA/IGhhc0NoaWxkcmVuXG4gICAgICAgID8gbGlzdC5nZXRDaGlsZHJlbigpWzBdLmdldEZpcnN0TGluZUluZGVudCgpXG4gICAgICAgIDogbGlzdC5nZXRGaXJzdExpbmVJbmRlbnQoKSArIHRoaXMuZGVmYXVsdEluZGVudENoYXJzXG4gICAgICA6IGxpc3QuZ2V0Rmlyc3RMaW5lSW5kZW50KCk7XG5cbiAgICBjb25zdCBidWxsZXQgPVxuICAgICAgb25DaGlsZExldmVsICYmIGhhc0NoaWxkcmVuXG4gICAgICAgID8gbGlzdC5nZXRDaGlsZHJlbigpWzBdLmdldEJ1bGxldCgpXG4gICAgICAgIDogbGlzdC5nZXRCdWxsZXQoKTtcblxuICAgIGNvbnN0IHNwYWNlQWZ0ZXJCdWxsZXQgPVxuICAgICAgb25DaGlsZExldmVsICYmIGhhc0NoaWxkcmVuXG4gICAgICAgID8gbGlzdC5nZXRDaGlsZHJlbigpWzBdLmdldFNwYWNlQWZ0ZXJCdWxsZXQoKVxuICAgICAgICA6IGxpc3QuZ2V0U3BhY2VBZnRlckJ1bGxldCgpO1xuXG4gICAgY29uc3QgcHJlZml4ID0gb2xkTGluZXNbMF0ubWF0Y2goL15cXFsuXFxdLykgPyBcIlsgXSBcIiA6IFwiXCI7XG5cbiAgICBjb25zdCBuZXdMaXN0ID0gbmV3IExpc3QoXG4gICAgICBsaXN0LmdldFJvb3QoKSxcbiAgICAgIGluZGVudCxcbiAgICAgIGJ1bGxldCxcbiAgICAgIHNwYWNlQWZ0ZXJCdWxsZXQsXG4gICAgICBwcmVmaXggKyBuZXdMaW5lcy5zaGlmdCgpLFxuICAgICAgZmFsc2VcbiAgICApO1xuXG4gICAgaWYgKG5ld0xpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5ld0xpc3Quc2V0Tm90ZXNJbmRlbnQobGlzdC5nZXROb3Rlc0luZGVudCgpKTtcbiAgICAgIGZvciAoY29uc3QgbGluZSBvZiBuZXdMaW5lcykge1xuICAgICAgICBuZXdMaXN0LmFkZExpbmUobGluZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9uQ2hpbGRMZXZlbCkge1xuICAgICAgbGlzdC5hZGRCZWZvcmVBbGwobmV3TGlzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2hpbGRJc0ZvbGRlZCB8fCAhZW5kT2ZMaW5lKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gbGlzdC5nZXRDaGlsZHJlbigpO1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgbGlzdC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgICAgbmV3TGlzdC5hZGRBZnRlckFsbChjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5nZXRQYXJlbnQoKS5hZGRBZnRlcihsaXN0LCBuZXdMaXN0KTtcbiAgICB9XG5cbiAgICBsaXN0LnJlcGxhY2VMaW5lcyhvbGRMaW5lcyk7XG5cbiAgICBjb25zdCBuZXdMaXN0U3RhcnQgPSBuZXdMaXN0LmdldEZpcnN0TGluZUNvbnRlbnRTdGFydCgpO1xuICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICBsaW5lOiBuZXdMaXN0U3RhcnQubGluZSxcbiAgICAgIGNoOiBuZXdMaXN0U3RhcnQuY2ggKyBwcmVmaXgubGVuZ3RoLFxuICAgIH0pO1xuXG4gICAgcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0cyhyb290KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgUHJlYyB9IGZyb20gXCJAY29kZW1pcnJvci9zdGF0ZVwiO1xuaW1wb3J0IHsga2V5bWFwIH0gZnJvbSBcIkBjb2RlbWlycm9yL3ZpZXdcIjtcblxuaW1wb3J0IHsgTXlFZGl0b3IgfSBmcm9tIFwiLi4vTXlFZGl0b3JcIjtcbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZXMvRmVhdHVyZVwiO1xuaW1wb3J0IHsgQ3JlYXRlTmV3SXRlbU9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL0NyZWF0ZU5ld0l0ZW1PcGVyYXRpb25cIjtcbmltcG9ydCB7IElNRVNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvSU1FU2VydmljZVwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgUGVyZm9ybU9wZXJhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvUGVyZm9ybU9wZXJhdGlvblNlcnZpY2VcIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIEVudGVyU2hvdWxkQ3JlYXRlTmV3SXRlbUZlYXR1cmUgaW1wbGVtZW50cyBGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGltZTogSU1FU2VydmljZSxcbiAgICBwcml2YXRlIG9ic2lkaWFuOiBPYnNpZGlhblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwZXJmb3JtT3BlcmF0aW9uOiBQZXJmb3JtT3BlcmF0aW9uU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckVkaXRvckV4dGVuc2lvbihcbiAgICAgIFByZWMuaGlnaGVzdChcbiAgICAgICAga2V5bWFwLm9mKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBrZXk6IFwiRW50ZXJcIixcbiAgICAgICAgICAgIHJ1bjogdGhpcy5vYnNpZGlhbi5jcmVhdGVLZXltYXBSdW5DYWxsYmFjayh7XG4gICAgICAgICAgICAgIGNoZWNrOiB0aGlzLmNoZWNrLFxuICAgICAgICAgICAgICBydW46IHRoaXMucnVuLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSlcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIGNoZWNrID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmJldHRlckVudGVyICYmICF0aGlzLmltZS5pc0lNRU9wZW5lZCgpO1xuICB9O1xuXG4gIHByaXZhdGUgcnVuID0gKGVkaXRvcjogTXlFZGl0b3IpID0+IHtcbiAgICBjb25zdCB6b29tUmFuZ2UgPSBlZGl0b3IuZ2V0Wm9vbVJhbmdlKCk7XG5cbiAgICBjb25zdCByZXMgPSB0aGlzLnBlcmZvcm1PcGVyYXRpb24ucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PlxuICAgICAgICBuZXcgQ3JlYXRlTmV3SXRlbU9wZXJhdGlvbihcbiAgICAgICAgICByb290LFxuICAgICAgICAgIHRoaXMub2JzaWRpYW4uZ2V0RGVmYXVsdEluZGVudENoYXJzKCksXG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2V0Wm9vbVJhbmdlOiAoKSA9PiB6b29tUmFuZ2UsXG4gICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgZWRpdG9yXG4gICAgKTtcblxuICAgIGlmIChyZXMuc2hvdWxkVXBkYXRlICYmIHpvb21SYW5nZSkge1xuICAgICAgZWRpdG9yLnpvb21Jbih6b29tUmFuZ2UuZnJvbS5saW5lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgTm90aWNlLCBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSBcIi4vRmVhdHVyZVwiO1xuXG5pbXBvcnQgeyBNeUVkaXRvciB9IGZyb20gXCIuLi9NeUVkaXRvclwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuXG5leHBvcnQgY2xhc3MgRm9sZEZlYXR1cmUgaW1wbGVtZW50cyBGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLCBwcml2YXRlIG9ic2lkaWFuOiBPYnNpZGlhblNlcnZpY2UpIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcImZvbGRcIixcbiAgICAgIG5hbWU6IFwiRm9sZCB0aGUgbGlzdFwiLFxuICAgICAgZWRpdG9yQ2FsbGJhY2s6IHRoaXMub2JzaWRpYW4uY3JlYXRlRWRpdG9yQ2FsbGJhY2sodGhpcy5mb2xkKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCJdLFxuICAgICAgICAgIGtleTogXCJBcnJvd1VwXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJ1bmZvbGRcIixcbiAgICAgIG5hbWU6IFwiVW5mb2xkIHRoZSBsaXN0XCIsXG4gICAgICBlZGl0b3JDYWxsYmFjazogdGhpcy5vYnNpZGlhbi5jcmVhdGVFZGl0b3JDYWxsYmFjayh0aGlzLnVuZm9sZCksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiQXJyb3dEb3duXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIHNldEZvbGQoZWRpdG9yOiBNeUVkaXRvciwgdHlwZTogXCJmb2xkXCIgfCBcInVuZm9sZFwiKSB7XG4gICAgaWYgKCF0aGlzLm9ic2lkaWFuLmdldE9ic2lkaWFuRm9sZFNldHRpbmdzKCkuZm9sZEluZGVudCkge1xuICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgYFVuYWJsZSB0byAke3R5cGV9IGJlY2F1c2UgZm9sZGluZyBpcyBkaXNhYmxlZC4gUGxlYXNlIGVuYWJsZSBcIkZvbGQgaW5kZW50XCIgaW4gT2JzaWRpYW4gc2V0dGluZ3MuYCxcbiAgICAgICAgNTAwMFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcblxuICAgIGlmICh0eXBlID09PSBcImZvbGRcIikge1xuICAgICAgZWRpdG9yLmZvbGQoY3Vyc29yLmxpbmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlZGl0b3IudW5mb2xkKGN1cnNvci5saW5lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgZm9sZCA9IChlZGl0b3I6IE15RWRpdG9yKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0Rm9sZChlZGl0b3IsIFwiZm9sZFwiKTtcbiAgfTtcblxuICBwcml2YXRlIHVuZm9sZCA9IChlZGl0b3I6IE15RWRpdG9yKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0Rm9sZChlZGl0b3IsIFwidW5mb2xkXCIpO1xuICB9O1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzICovXG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHtcbiAgZm9sZEVmZmVjdCxcbiAgZm9sZGFibGUsXG4gIGZvbGRlZFJhbmdlcyxcbiAgdW5mb2xkRWZmZWN0LFxufSBmcm9tIFwiQGNvZGVtaXJyb3IvbGFuZ3VhZ2VcIjtcbmltcG9ydCB7IEVkaXRvclZpZXcsIHJ1blNjb3BlSGFuZGxlcnMgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuXG5leHBvcnQgY2xhc3MgTXlFZGl0b3JQb3NpdGlvbiB7XG4gIGxpbmU6IG51bWJlcjtcbiAgY2g6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIE15RWRpdG9yUmFuZ2Uge1xuICBmcm9tOiBNeUVkaXRvclBvc2l0aW9uO1xuICB0bzogTXlFZGl0b3JQb3NpdGlvbjtcbn1cblxuZXhwb3J0IGNsYXNzIE15RWRpdG9yU2VsZWN0aW9uIHtcbiAgYW5jaG9yOiBNeUVkaXRvclBvc2l0aW9uO1xuICBoZWFkOiBNeUVkaXRvclBvc2l0aW9uO1xufVxuXG5mdW5jdGlvbiBmb2xkSW5zaWRlKHZpZXc6IEVkaXRvclZpZXcsIGZyb206IG51bWJlciwgdG86IG51bWJlcikge1xuICBsZXQgZm91bmQ6IHsgZnJvbTogbnVtYmVyOyB0bzogbnVtYmVyIH0gfCBudWxsID0gbnVsbDtcbiAgZm9sZGVkUmFuZ2VzKHZpZXcuc3RhdGUpLmJldHdlZW4oZnJvbSwgdG8sIChmcm9tLCB0bykgPT4ge1xuICAgIGlmICghZm91bmQgfHwgZm91bmQuZnJvbSA+IGZyb20pIGZvdW5kID0geyBmcm9tLCB0byB9O1xuICB9KTtcbiAgcmV0dXJuIGZvdW5kO1xufVxuXG5leHBvcnQgY2xhc3MgTXlFZGl0b3Ige1xuICBwcml2YXRlIHZpZXc6IEVkaXRvclZpZXc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlOiBFZGl0b3IpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHRoaXMudmlldyA9ICh0aGlzLmUgYXMgYW55KS5jbTtcbiAgfVxuXG4gIGdldEN1cnNvcigpOiBNeUVkaXRvclBvc2l0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5lLmdldEN1cnNvcigpO1xuICB9XG5cbiAgZ2V0TGluZShuOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmUuZ2V0TGluZShuKTtcbiAgfVxuXG4gIGxhc3RMaW5lKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZS5sYXN0TGluZSgpO1xuICB9XG5cbiAgbGlzdFNlbGVjdGlvbnMoKTogTXlFZGl0b3JTZWxlY3Rpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuZS5saXN0U2VsZWN0aW9ucygpO1xuICB9XG5cbiAgZ2V0UmFuZ2UoZnJvbTogTXlFZGl0b3JQb3NpdGlvbiwgdG86IE15RWRpdG9yUG9zaXRpb24pOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmUuZ2V0UmFuZ2UoZnJvbSwgdG8pO1xuICB9XG5cbiAgcmVwbGFjZVJhbmdlKFxuICAgIHJlcGxhY2VtZW50OiBzdHJpbmcsXG4gICAgZnJvbTogTXlFZGl0b3JQb3NpdGlvbixcbiAgICB0bzogTXlFZGl0b3JQb3NpdGlvblxuICApOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5lLnJlcGxhY2VSYW5nZShyZXBsYWNlbWVudCwgZnJvbSwgdG8pO1xuICB9XG5cbiAgc2V0U2VsZWN0aW9ucyhzZWxlY3Rpb25zOiBNeUVkaXRvclNlbGVjdGlvbltdKTogdm9pZCB7XG4gICAgdGhpcy5lLnNldFNlbGVjdGlvbnMoc2VsZWN0aW9ucyk7XG4gIH1cblxuICBzZXRWYWx1ZSh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmUuc2V0VmFsdWUodGV4dCk7XG4gIH1cblxuICBnZXRWYWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmUuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIG9mZnNldFRvUG9zKG9mZnNldDogbnVtYmVyKTogTXlFZGl0b3JQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuZS5vZmZzZXRUb1BvcyhvZmZzZXQpO1xuICB9XG5cbiAgcG9zVG9PZmZzZXQocG9zOiBNeUVkaXRvclBvc2l0aW9uKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5lLnBvc1RvT2Zmc2V0KHBvcyk7XG4gIH1cblxuICBmb2xkKG46IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHsgdmlldyB9ID0gdGhpcztcbiAgICBjb25zdCBsID0gdmlldy5saW5lQmxvY2tBdCh2aWV3LnN0YXRlLmRvYy5saW5lKG4gKyAxKS5mcm9tKTtcbiAgICBjb25zdCByYW5nZSA9IGZvbGRhYmxlKHZpZXcuc3RhdGUsIGwuZnJvbSwgbC50byk7XG5cbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmZyb20gPT09IHJhbmdlLnRvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmlldy5kaXNwYXRjaCh7IGVmZmVjdHM6IFtmb2xkRWZmZWN0Lm9mKHJhbmdlKV0gfSk7XG4gIH1cblxuICB1bmZvbGQobjogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgeyB2aWV3IH0gPSB0aGlzO1xuICAgIGNvbnN0IGwgPSB2aWV3LmxpbmVCbG9ja0F0KHZpZXcuc3RhdGUuZG9jLmxpbmUobiArIDEpLmZyb20pO1xuICAgIGNvbnN0IHJhbmdlID0gZm9sZEluc2lkZSh2aWV3LCBsLmZyb20sIGwudG8pO1xuXG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZpZXcuZGlzcGF0Y2goeyBlZmZlY3RzOiBbdW5mb2xkRWZmZWN0Lm9mKHJhbmdlKV0gfSk7XG4gIH1cblxuICBnZXRBbGxGb2xkZWRMaW5lcygpOiBudW1iZXJbXSB7XG4gICAgY29uc3QgYyA9IGZvbGRlZFJhbmdlcyh0aGlzLnZpZXcuc3RhdGUpLml0ZXIoKTtcbiAgICBjb25zdCByZXM6IG51bWJlcltdID0gW107XG4gICAgd2hpbGUgKGMudmFsdWUpIHtcbiAgICAgIHJlcy5wdXNoKHRoaXMub2Zmc2V0VG9Qb3MoYy5mcm9tKS5saW5lKTtcbiAgICAgIGMubmV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgdHJpZ2dlck9uS2V5RG93bihlOiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgcnVuU2NvcGVIYW5kbGVycyh0aGlzLnZpZXcsIGUsIFwiZWRpdG9yXCIpO1xuICB9XG5cbiAgZ2V0Wm9vbVJhbmdlKCk6IE15RWRpdG9yUmFuZ2UgfCBudWxsIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGNvbnN0IGFwaSA9ICh3aW5kb3cgYXMgYW55KS5PYnNpZGlhblpvb21QbHVnaW47XG5cbiAgICBpZiAoIWFwaSB8fCAhYXBpLmdldFpvb21SYW5nZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFwaS5nZXRab29tUmFuZ2UodGhpcy5lKTtcbiAgfVxuXG4gIHpvb21PdXQoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBjb25zdCBhcGkgPSAod2luZG93IGFzIGFueSkuT2JzaWRpYW5ab29tUGx1Z2luO1xuXG4gICAgaWYgKCFhcGkgfHwgIWFwaS56b29tT3V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXBpLnpvb21PdXQodGhpcy5lKTtcbiAgfVxuXG4gIHpvb21JbihsaW5lOiBudW1iZXIpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGNvbnN0IGFwaSA9ICh3aW5kb3cgYXMgYW55KS5PYnNpZGlhblpvb21QbHVnaW47XG5cbiAgICBpZiAoIWFwaSB8fCAhYXBpLnpvb21Jbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGFwaS56b29tSW4odGhpcy5lLCBsaW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIsIGVkaXRvclZpZXdGaWVsZCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQge1xuICBFZGl0b3JWaWV3LFxuICBQbHVnaW5WYWx1ZSxcbiAgVmlld1BsdWdpbixcbiAgVmlld1VwZGF0ZSxcbn0gZnJvbSBcIkBjb2RlbWlycm9yL3ZpZXdcIjtcblxuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gXCIuL0ZlYXR1cmVcIjtcblxuaW1wb3J0IHsgTXlFZGl0b3IgfSBmcm9tIFwiLi4vTXlFZGl0b3JcIjtcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgUGFyc2VyU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9QYXJzZXJTZXJ2aWNlXCI7XG5pbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmludGVyZmFjZSBMaW5lRGF0YSB7XG4gIHRvcDogbnVtYmVyO1xuICBsZWZ0OiBudW1iZXI7XG4gIGhlaWdodDogc3RyaW5nO1xuICBsaXN0OiBMaXN0O1xufVxuXG5jbGFzcyBMaXN0TGluZXNWaWV3UGx1Z2luVmFsdWUgaW1wbGVtZW50cyBQbHVnaW5WYWx1ZSB7XG4gIHByaXZhdGUgc2NoZWR1bGVkOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRJbW1lZGlhdGU+O1xuICBwcml2YXRlIHNjcm9sbGVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBjb250ZW50Q29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBlZGl0b3I6IE15RWRpdG9yO1xuICBwcml2YXRlIGxhc3RMaW5lOiBudW1iZXI7XG4gIHByaXZhdGUgbGluZXM6IExpbmVEYXRhW107XG4gIHByaXZhdGUgbGluZUVsZW1lbnRzOiBIVE1MRWxlbWVudFtdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgb2JzaWRpYW46IE9ic2lkaWFuU2VydmljZSxcbiAgICBwcml2YXRlIHBhcnNlcjogUGFyc2VyU2VydmljZSxcbiAgICBwcml2YXRlIHZpZXc6IEVkaXRvclZpZXdcbiAgKSB7XG4gICAgdGhpcy52aWV3LnNjcm9sbERPTS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpO1xuICAgIHRoaXMuc2V0dGluZ3Mub25DaGFuZ2UoXCJsaXN0TGluZXNcIiwgdGhpcy5zY2hlZHVsZVJlY2FsY3VsYXRlKTtcblxuICAgIHRoaXMucHJlcGFyZURvbSgpO1xuICAgIHRoaXMud2FpdEZvckVkaXRvcigpO1xuICB9XG5cbiAgcHJpdmF0ZSB3YWl0Rm9yRWRpdG9yID0gKCkgPT4ge1xuICAgIGNvbnN0IG9lID0gdGhpcy52aWV3LnN0YXRlLmZpZWxkKGVkaXRvclZpZXdGaWVsZCkuZWRpdG9yO1xuICAgIGlmICghb2UpIHtcbiAgICAgIHNldFRpbWVvdXQodGhpcy53YWl0Rm9yRWRpdG9yLCAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lZGl0b3IgPSBuZXcgTXlFZGl0b3Iob2UpO1xuICAgIHRoaXMuc2NoZWR1bGVSZWNhbGN1bGF0ZSgpO1xuICB9O1xuXG4gIHByaXZhdGUgcHJlcGFyZURvbSgpIHtcbiAgICB0aGlzLmNvbnRlbnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuY29udGVudENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFxuICAgICAgXCJvdXRsaW5lci1wbHVnaW4tbGlzdC1saW5lcy1jb250ZW50LWNvbnRhaW5lclwiXG4gICAgKTtcblxuICAgIHRoaXMuc2Nyb2xsZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuc2Nyb2xsZXIuY2xhc3NMaXN0LmFkZChcIm91dGxpbmVyLXBsdWdpbi1saXN0LWxpbmVzLXNjcm9sbGVyXCIpO1xuXG4gICAgdGhpcy5zY3JvbGxlci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnRDb250YWluZXIpO1xuICAgIHRoaXMudmlldy5kb20uYXBwZW5kQ2hpbGQodGhpcy5zY3JvbGxlcik7XG4gIH1cblxuICBwcml2YXRlIG9uU2Nyb2xsID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBzY3JvbGxMZWZ0LCBzY3JvbGxUb3AgfSA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIHRoaXMuc2Nyb2xsZXIuc2Nyb2xsVG8oc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wKTtcbiAgfTtcblxuICBwcml2YXRlIHNjaGVkdWxlUmVjYWxjdWxhdGUgPSAoKSA9PiB7XG4gICAgY2xlYXJJbW1lZGlhdGUodGhpcy5zY2hlZHVsZWQpO1xuICAgIHRoaXMuc2NoZWR1bGVkID0gc2V0SW1tZWRpYXRlKHRoaXMuY2FsY3VsYXRlKTtcbiAgfTtcblxuICB1cGRhdGUodXBkYXRlOiBWaWV3VXBkYXRlKSB7XG4gICAgaWYgKFxuICAgICAgdXBkYXRlLmRvY0NoYW5nZWQgfHxcbiAgICAgIHVwZGF0ZS52aWV3cG9ydENoYW5nZWQgfHxcbiAgICAgIHVwZGF0ZS5nZW9tZXRyeUNoYW5nZWQgfHxcbiAgICAgIHVwZGF0ZS50cmFuc2FjdGlvbnMuc29tZSgodHIpID0+IHRyLnJlY29uZmlndXJlZClcbiAgICApIHtcbiAgICAgIHRoaXMuc2NoZWR1bGVSZWNhbGN1bGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2FsY3VsYXRlID0gKCkgPT4ge1xuICAgIHRoaXMubGluZXMgPSBbXTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMuc2V0dGluZ3MubGlzdExpbmVzICYmXG4gICAgICB0aGlzLm9ic2lkaWFuLmlzRGVmYXVsdFRoZW1lRW5hYmxlZCgpICYmXG4gICAgICB0aGlzLnZpZXcudmlld3BvcnRMaW5lQmxvY2tzLmxlbmd0aCA+IDAgJiZcbiAgICAgIHRoaXMudmlldy52aXNpYmxlUmFuZ2VzLmxlbmd0aCA+IDBcbiAgICApIHtcbiAgICAgIGNvbnN0IGZyb21MaW5lID0gdGhpcy5lZGl0b3Iub2Zmc2V0VG9Qb3ModGhpcy52aWV3LnZpZXdwb3J0LmZyb20pLmxpbmU7XG4gICAgICBjb25zdCB0b0xpbmUgPSB0aGlzLmVkaXRvci5vZmZzZXRUb1Bvcyh0aGlzLnZpZXcudmlld3BvcnQudG8pLmxpbmU7XG4gICAgICBjb25zdCBsaXN0cyA9IHRoaXMucGFyc2VyLnBhcnNlUmFuZ2UodGhpcy5lZGl0b3IsIGZyb21MaW5lLCB0b0xpbmUpO1xuXG4gICAgICBmb3IgKGNvbnN0IGxpc3Qgb2YgbGlzdHMpIHtcbiAgICAgICAgdGhpcy5sYXN0TGluZSA9IGxpc3QuZ2V0UmFuZ2UoKVsxXS5saW5lO1xuXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBsaXN0LmdldENoaWxkcmVuKCkpIHtcbiAgICAgICAgICB0aGlzLnJlY3Vyc2l2ZShjKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmxpbmVzLnNvcnQoKGEsIGIpID0+XG4gICAgICAgIGEudG9wID09PSBiLnRvcCA/IGEubGVmdCAtIGIubGVmdCA6IGEudG9wIC0gYi50b3BcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVEb20oKTtcbiAgfTtcblxuICBwcml2YXRlIGdldE5leHRTaWJsaW5nKGxpc3Q6IExpc3QpOiBMaXN0IHwgbnVsbCB7XG4gICAgbGV0IGxpc3RUbXAgPSBsaXN0O1xuICAgIGxldCBwID0gbGlzdFRtcC5nZXRQYXJlbnQoKTtcbiAgICB3aGlsZSAocCkge1xuICAgICAgY29uc3QgbmV4dFNpYmxpbmcgPSBwLmdldE5leHRTaWJsaW5nT2YobGlzdFRtcCk7XG4gICAgICBpZiAobmV4dFNpYmxpbmcpIHtcbiAgICAgICAgcmV0dXJuIG5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgICAgbGlzdFRtcCA9IHA7XG4gICAgICBwID0gbGlzdFRtcC5nZXRQYXJlbnQoKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIHJlY3Vyc2l2ZShsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBsaXN0LmdldENoaWxkcmVuKCk7XG5cbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKCFjaGlsZC5pc0VtcHR5KCkpIHtcbiAgICAgICAgdGhpcy5yZWN1cnNpdmUoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZyb21PZmZzZXQgPSB0aGlzLmVkaXRvci5wb3NUb09mZnNldCh7XG4gICAgICBsaW5lOiBsaXN0LmdldEZpcnN0TGluZUNvbnRlbnRTdGFydCgpLmxpbmUsXG4gICAgICBjaDogbGlzdC5nZXRGaXJzdExpbmVJbmRlbnQoKS5sZW5ndGgsXG4gICAgfSk7XG4gICAgY29uc3QgbmV4dFNpYmxpbmcgPSB0aGlzLmdldE5leHRTaWJsaW5nKGxpc3QpO1xuICAgIGNvbnN0IHRpbGxPZmZzZXQgPSB0aGlzLmVkaXRvci5wb3NUb09mZnNldCh7XG4gICAgICBsaW5lOiBuZXh0U2libGluZ1xuICAgICAgICA/IG5leHRTaWJsaW5nLmdldEZpcnN0TGluZUNvbnRlbnRTdGFydCgpLmxpbmUgLSAxXG4gICAgICAgIDogdGhpcy5sYXN0TGluZSxcbiAgICAgIGNoOiAwLFxuICAgIH0pO1xuXG4gICAgbGV0IHZpc2libGVGcm9tID0gdGhpcy52aWV3LnZpc2libGVSYW5nZXNbMF0uZnJvbTtcbiAgICBsZXQgdmlzaWJsZVRvID1cbiAgICAgIHRoaXMudmlldy52aXNpYmxlUmFuZ2VzW3RoaXMudmlldy52aXNpYmxlUmFuZ2VzLmxlbmd0aCAtIDFdLnRvO1xuICAgIGNvbnN0IHpvb21SYW5nZSA9IHRoaXMuZWRpdG9yLmdldFpvb21SYW5nZSgpO1xuICAgIGlmICh6b29tUmFuZ2UpIHtcbiAgICAgIHZpc2libGVGcm9tID0gTWF0aC5tYXgoXG4gICAgICAgIHZpc2libGVGcm9tLFxuICAgICAgICB0aGlzLmVkaXRvci5wb3NUb09mZnNldCh6b29tUmFuZ2UuZnJvbSlcbiAgICAgICk7XG4gICAgICB2aXNpYmxlVG8gPSBNYXRoLm1pbih2aXNpYmxlVG8sIHRoaXMuZWRpdG9yLnBvc1RvT2Zmc2V0KHpvb21SYW5nZS50bykpO1xuICAgIH1cblxuICAgIGlmIChmcm9tT2Zmc2V0ID4gdmlzaWJsZVRvIHx8IHRpbGxPZmZzZXQgPCB2aXNpYmxlRnJvbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRvcCA9XG4gICAgICB2aXNpYmxlRnJvbSA+IDAgJiYgZnJvbU9mZnNldCA8PSB2aXNpYmxlRnJvbVxuICAgICAgICA/IC0yMFxuICAgICAgICA6IHRoaXMudmlldy5saW5lQmxvY2tBdChmcm9tT2Zmc2V0KS50b3A7XG4gICAgY29uc3QgYm90dG9tID1cbiAgICAgIHRpbGxPZmZzZXQgPiB2aXNpYmxlVG9cbiAgICAgICAgPyB0aGlzLnZpZXcubGluZUJsb2NrQXQodmlzaWJsZVRvIC0gMSkuYm90dG9tXG4gICAgICAgIDogdGhpcy52aWV3LmxpbmVCbG9ja0F0KHRpbGxPZmZzZXQpLmJvdHRvbTtcbiAgICBjb25zdCBoZWlnaHQgPSBib3R0b20gLSB0b3A7XG5cbiAgICBpZiAoaGVpZ2h0ID4gMCAmJiAhbGlzdC5pc0ZvbGRlZCgpKSB7XG4gICAgICBjb25zdCBuZXh0U2libGluZyA9IGxpc3QuZ2V0UGFyZW50KCkuZ2V0TmV4dFNpYmxpbmdPZihsaXN0KTtcbiAgICAgIGNvbnN0IGhhc05leHRTaWJsaW5nID1cbiAgICAgICAgISFuZXh0U2libGluZyAmJlxuICAgICAgICB0aGlzLmVkaXRvci5wb3NUb09mZnNldChuZXh0U2libGluZy5nZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKSkgPD1cbiAgICAgICAgICB2aXNpYmxlVG87XG5cbiAgICAgIHRoaXMubGluZXMucHVzaCh7XG4gICAgICAgIHRvcDogdG9wLFxuICAgICAgICBsZWZ0OiB0aGlzLmdldEluZGVudFNpemUobGlzdCksXG4gICAgICAgIGhlaWdodDogYGNhbGMoJHtoZWlnaHR9cHggJHtoYXNOZXh0U2libGluZyA/IFwiLSAxZW1cIiA6IFwiLSAxLjhlbVwifSlgLFxuICAgICAgICBsaXN0LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRJbmRlbnRTaXplKGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCB7IHRhYlNpemUgfSA9IHRoaXMub2JzaWRpYW4uZ2V0T2JzaWRpYW5UYWJzU2V0dGluZ3MoKTtcbiAgICBjb25zdCBpbmRlbnQgPSBsaXN0LmdldEZpcnN0TGluZUluZGVudCgpO1xuICAgIGNvbnN0IHNwYWNlU2l6ZSA9IDQuNTtcblxuICAgIGxldCBzcGFjZXMgPSAwO1xuICAgIGZvciAoY29uc3QgY2hhciBvZiBpbmRlbnQpIHtcbiAgICAgIGlmIChjaGFyID09PSBcIlxcdFwiKSB7XG4gICAgICAgIHNwYWNlcyArPSB0YWJTaXplO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3BhY2VzICs9IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwYWNlcyAqIHNwYWNlU2l6ZTtcbiAgfVxuXG4gIHByaXZhdGUgb25DbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZXNbTnVtYmVyKChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuZGF0YXNldC5pbmRleCldO1xuXG4gICAgc3dpdGNoICh0aGlzLnNldHRpbmdzLmxpc3RMaW5lQWN0aW9uKSB7XG4gICAgICBjYXNlIFwiem9vbS1pblwiOlxuICAgICAgICB0aGlzLnpvb21JbihsaW5lKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJ0b2dnbGUtZm9sZGluZ1wiOlxuICAgICAgICB0aGlzLnRvZ2dsZUZvbGRpbmcobGluZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHpvb21JbihsaW5lOiBMaW5lRGF0YSkge1xuICAgIGNvbnN0IGVkaXRvciA9IG5ldyBNeUVkaXRvcih0aGlzLnZpZXcuc3RhdGUuZmllbGQoZWRpdG9yVmlld0ZpZWxkKS5lZGl0b3IpO1xuXG4gICAgZWRpdG9yLnpvb21JbihsaW5lLmxpc3QuZ2V0Rmlyc3RMaW5lQ29udGVudFN0YXJ0KCkubGluZSk7XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZUZvbGRpbmcobGluZTogTGluZURhdGEpIHtcbiAgICBjb25zdCB7IGxpc3QgfSA9IGxpbmU7XG5cbiAgICBpZiAobGlzdC5pc0VtcHR5KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgbmVlZFRvVW5mb2xkID0gdHJ1ZTtcbiAgICBjb25zdCBsaW5lc1RvVG9nZ2xlOiBudW1iZXJbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYyBvZiBsaXN0LmdldENoaWxkcmVuKCkpIHtcbiAgICAgIGlmIChjLmlzRW1wdHkoKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICghYy5pc0ZvbGRlZCgpKSB7XG4gICAgICAgIG5lZWRUb1VuZm9sZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgbGluZXNUb1RvZ2dsZS5wdXNoKGMuZ2V0Rmlyc3RMaW5lQ29udGVudFN0YXJ0KCkubGluZSk7XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yID0gbmV3IE15RWRpdG9yKHRoaXMudmlldy5zdGF0ZS5maWVsZChlZGl0b3JWaWV3RmllbGQpLmVkaXRvcik7XG5cbiAgICBmb3IgKGNvbnN0IGwgb2YgbGluZXNUb1RvZ2dsZSkge1xuICAgICAgaWYgKG5lZWRUb1VuZm9sZCkge1xuICAgICAgICBlZGl0b3IudW5mb2xkKGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWRpdG9yLmZvbGQobCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVEb20oKSB7XG4gICAgY29uc3QgY21TY3JvbGwgPSB0aGlzLnZpZXcuc2Nyb2xsRE9NO1xuICAgIGNvbnN0IGNtQ29udGVudCA9IHRoaXMudmlldy5jb250ZW50RE9NO1xuICAgIGNvbnN0IGNtQ29udGVudENvbnRhaW5lciA9IGNtQ29udGVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgdGhpcy5zY3JvbGxlci5zdHlsZS50b3AgPSBjbVNjcm9sbC5vZmZzZXRUb3AgKyBcInB4XCI7XG4gICAgdGhpcy5jb250ZW50Q29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGNtQ29udGVudC5jbGllbnRIZWlnaHQgKyBcInB4XCI7XG4gICAgdGhpcy5jb250ZW50Q29udGFpbmVyLnN0eWxlLm1hcmdpbkxlZnQgPVxuICAgICAgY21Db250ZW50Q29udGFpbmVyLm9mZnNldExlZnQgKyBcInB4XCI7XG4gICAgdGhpcy5jb250ZW50Q29udGFpbmVyLnN0eWxlLm1hcmdpblRvcCA9XG4gICAgICAoY21Db250ZW50LmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50KS5vZmZzZXRUb3AgLSAyNCArIFwicHhcIjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMubGluZUVsZW1lbnRzLmxlbmd0aCA9PT0gaSkge1xuICAgICAgICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKFwib3V0bGluZXItcGx1Z2luLWxpc3QtbGluZVwiKTtcbiAgICAgICAgZS5kYXRhc2V0LmluZGV4ID0gU3RyaW5nKGkpO1xuICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbkNsaWNrKTtcbiAgICAgICAgdGhpcy5jb250ZW50Q29udGFpbmVyLmFwcGVuZENoaWxkKGUpO1xuICAgICAgICB0aGlzLmxpbmVFbGVtZW50cy5wdXNoKGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsID0gdGhpcy5saW5lc1tpXTtcbiAgICAgIGNvbnN0IGUgPSB0aGlzLmxpbmVFbGVtZW50c1tpXTtcbiAgICAgIGUuc3R5bGUudG9wID0gbC50b3AgKyBcInB4XCI7XG4gICAgICBlLnN0eWxlLmxlZnQgPSBsLmxlZnQgKyBcInB4XCI7XG4gICAgICBlLnN0eWxlLmhlaWdodCA9IGwuaGVpZ2h0O1xuICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSB0aGlzLmxpbmVzLmxlbmd0aDsgaSA8IHRoaXMubGluZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlID0gdGhpcy5saW5lRWxlbWVudHNbaV07XG4gICAgICBlLnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICBlLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgZS5zdHlsZS5oZWlnaHQgPSBcIjBweFwiO1xuICAgICAgZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnNldHRpbmdzLnJlbW92ZUNhbGxiYWNrKFwibGlzdExpbmVzXCIsIHRoaXMuc2NoZWR1bGVSZWNhbGN1bGF0ZSk7XG4gICAgdGhpcy52aWV3LnNjcm9sbERPTS5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpO1xuICAgIHRoaXMudmlldy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5zY3JvbGxlcik7XG4gICAgY2xlYXJJbW1lZGlhdGUodGhpcy5zY2hlZHVsZWQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaW5lc0ZlYXR1cmUgaW1wbGVtZW50cyBGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIG9ic2lkaWFuOiBPYnNpZGlhblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwYXJzZXI6IFBhcnNlclNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24oXG4gICAgICBWaWV3UGx1Z2luLmRlZmluZShcbiAgICAgICAgKHZpZXcpID0+XG4gICAgICAgICAgbmV3IExpc3RMaW5lc1ZpZXdQbHVnaW5WYWx1ZShcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MsXG4gICAgICAgICAgICB0aGlzLm9ic2lkaWFuLFxuICAgICAgICAgICAgdGhpcy5wYXJzZXIsXG4gICAgICAgICAgICB2aWV3XG4gICAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxufVxuIiwiaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gXCIuL0ZlYXR1cmVcIjtcblxuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuXG5jb25zdCBCRVRURVJfTElTVFNfQ0xBU1MgPSBcIm91dGxpbmVyLXBsdWdpbi1iZXR0ZXItbGlzdHNcIjtcbmNvbnN0IEJFVFRFUl9CVUxMRVRTX0NMQVNTID0gXCJvdXRsaW5lci1wbHVnaW4tYmV0dGVyLWJ1bGxldHNcIjtcbmNvbnN0IFZFUlRJQ0FMX0xJTkVTID0gXCJvdXRsaW5lci1wbHVnaW4tdmVydGljYWwtbGluZXNcIjtcbmNvbnN0IEtOT1dOX0NMQVNTRVMgPSBbXG4gIEJFVFRFUl9MSVNUU19DTEFTUyxcbiAgQkVUVEVSX0JVTExFVFNfQ0xBU1MsXG4gIFZFUlRJQ0FMX0xJTkVTLFxuXTtcblxuZXhwb3J0IGNsYXNzIExpc3RzU3R5bGVzRmVhdHVyZSBpbXBsZW1lbnRzIEZlYXR1cmUge1xuICBwcml2YXRlIGludGVydmFsOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgb2JzaWRpYW46IE9ic2lkaWFuU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnN5bmNMaXN0c1N0eWxlcygpO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5zeW5jTGlzdHNTdHlsZXMoKTtcbiAgICB9LCAxMDAwKTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIHRoaXMuYXBwbHlMaXN0c1N0eWxlcyhbXSk7XG4gIH1cblxuICBwcml2YXRlIHN5bmNMaXN0c1N0eWxlcyA9ICgpID0+IHtcbiAgICBjb25zdCBjbGFzc2VzID0gW107XG5cbiAgICBpZiAodGhpcy5vYnNpZGlhbi5pc0RlZmF1bHRUaGVtZUVuYWJsZWQoKSkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc3R5bGVMaXN0cykge1xuICAgICAgICBjbGFzc2VzLnB1c2goQkVUVEVSX0xJU1RTX0NMQVNTKTtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKEJFVFRFUl9CVUxMRVRTX0NMQVNTKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubGlzdExpbmVzKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaChWRVJUSUNBTF9MSU5FUyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseUxpc3RzU3R5bGVzKGNsYXNzZXMpO1xuICB9O1xuXG4gIHByaXZhdGUgYXBwbHlMaXN0c1N0eWxlcyhjbGFzc2VzOiBzdHJpbmdbXSkge1xuICAgIGNvbnN0IHRvS2VlcCA9IGNsYXNzZXMuZmlsdGVyKChjKSA9PiBLTk9XTl9DTEFTU0VTLmNvbnRhaW5zKGMpKTtcbiAgICBjb25zdCB0b1JlbW92ZSA9IEtOT1dOX0NMQVNTRVMuZmlsdGVyKChjKSA9PiAhdG9LZWVwLmNvbnRhaW5zKGMpKTtcblxuICAgIGZvciAoY29uc3QgYyBvZiB0b0tlZXApIHtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoYykpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKGMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgYyBvZiB0b1JlbW92ZSkge1xuICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKGMpKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShjKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE9wZXJhdGlvbiB9IGZyb20gXCIuL09wZXJhdGlvblwiO1xuXG5pbXBvcnQgeyBMaXN0TGluZSwgUG9zaXRpb24sIFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuXG5leHBvcnQgY2xhc3MgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVPcGVyYXRpb24gaW1wbGVtZW50cyBPcGVyYXRpb24ge1xuICBwcml2YXRlIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QpIHt9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVkO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5yb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGN1cnNvciA9IHRoaXMucm9vdC5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBsaW5lcyA9IGxpc3QuZ2V0TGluZXNJbmZvKCk7XG4gICAgY29uc3QgbGluZU5vID0gbGluZXMuZmluZEluZGV4KFxuICAgICAgKGwpID0+IGN1cnNvci5jaCA9PT0gbC5mcm9tLmNoICYmIGN1cnNvci5saW5lID09PSBsLmZyb20ubGluZVxuICAgICk7XG5cbiAgICBpZiAobGluZU5vID09PSAwKSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRJdGVtKHJvb3QsIGN1cnNvcik7XG4gICAgfSBlbHNlIGlmIChsaW5lTm8gPiAwKSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3JUb1ByZXZpb3VzTm90ZUxpbmUocm9vdCwgbGluZXMsIGxpbmVObyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlQ3Vyc29yVG9QcmV2aW91c05vdGVMaW5lKFxuICAgIHJvb3Q6IFJvb3QsXG4gICAgbGluZXM6IExpc3RMaW5lW10sXG4gICAgbGluZU5vOiBudW1iZXJcbiAgKSB7XG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICByb290LnJlcGxhY2VDdXJzb3IobGluZXNbbGluZU5vIC0gMV0udG8pO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkSXRlbShyb290OiBSb290LCBjdXJzb3I6IFBvc2l0aW9uKSB7XG4gICAgY29uc3QgcHJldiA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShjdXJzb3IubGluZSAtIDEpO1xuXG4gICAgaWYgKCFwcmV2KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICBpZiAocHJldi5pc0ZvbGRlZCgpKSB7XG4gICAgICBjb25zdCBmb2xkUm9vdCA9IHByZXYuZ2V0VG9wRm9sZFJvb3QoKTtcbiAgICAgIGNvbnN0IGZpcnN0TGluZUVuZCA9IGZvbGRSb290LmdldExpbmVzSW5mbygpWzBdLnRvO1xuICAgICAgcm9vdC5yZXBsYWNlQ3Vyc29yKGZpcnN0TGluZUVuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QucmVwbGFjZUN1cnNvcihwcmV2LmdldExhc3RMaW5lQ29udGVudEVuZCgpKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IGtleW1hcCB9IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5cbmltcG9ydCB7IE15RWRpdG9yIH0gZnJvbSBcIi4uL015RWRpdG9yXCI7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVzL0ZlYXR1cmVcIjtcbmltcG9ydCB7IE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IElNRVNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvSU1FU2VydmljZVwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgUGVyZm9ybU9wZXJhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvUGVyZm9ybU9wZXJhdGlvblNlcnZpY2VcIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZSBpbXBsZW1lbnRzIEZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgaW1lOiBJTUVTZXJ2aWNlLFxuICAgIHByaXZhdGUgb2JzaWRpYW46IE9ic2lkaWFuU2VydmljZSxcbiAgICBwcml2YXRlIHBlcmZvcm1PcGVyYXRpb246IFBlcmZvcm1PcGVyYXRpb25TZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyRWRpdG9yRXh0ZW5zaW9uKFxuICAgICAga2V5bWFwLm9mKFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogXCJBcnJvd0xlZnRcIixcbiAgICAgICAgICBydW46IHRoaXMub2JzaWRpYW4uY3JlYXRlS2V5bWFwUnVuQ2FsbGJhY2soe1xuICAgICAgICAgICAgY2hlY2s6IHRoaXMuY2hlY2ssXG4gICAgICAgICAgICBydW46IHRoaXMucnVuLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgd2luOiBcImMtQXJyb3dMZWZ0XCIsXG4gICAgICAgICAgbGludXg6IFwiYy1BcnJvd0xlZnRcIixcbiAgICAgICAgICBydW46IHRoaXMub2JzaWRpYW4uY3JlYXRlS2V5bWFwUnVuQ2FsbGJhY2soe1xuICAgICAgICAgICAgY2hlY2s6IHRoaXMuY2hlY2ssXG4gICAgICAgICAgICBydW46IHRoaXMucnVuLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgXSlcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIGNoZWNrID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yICYmICF0aGlzLmltZS5pc0lNRU9wZW5lZCgpO1xuICB9O1xuXG4gIHByaXZhdGUgcnVuID0gKGVkaXRvcjogTXlFZGl0b3IpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wZXJmb3JtT3BlcmF0aW9uLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAocm9vdCkgPT4gbmV3IE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lT3BlcmF0aW9uKHJvb3QpLFxuICAgICAgZWRpdG9yXG4gICAgKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IE9wZXJhdGlvbiB9IGZyb20gXCIuL09wZXJhdGlvblwiO1xuXG5pbXBvcnQgeyBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IHJlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHMgfSBmcm9tIFwiLi4vcm9vdC9yZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzXCI7XG5cbmV4cG9ydCBjbGFzcyBNb3ZlRG93bk9wZXJhdGlvbiBpbXBsZW1lbnRzIE9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgbmV4dCA9IHBhcmVudC5nZXROZXh0U2libGluZ09mKGxpc3QpO1xuXG4gICAgY29uc3QgbGlzdFN0YXJ0TGluZUJlZm9yZSA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcblxuICAgIGlmICghbmV4dCAmJiBncmFuZFBhcmVudCkge1xuICAgICAgY29uc3QgbmV3UGFyZW50ID0gZ3JhbmRQYXJlbnQuZ2V0TmV4dFNpYmxpbmdPZihwYXJlbnQpO1xuXG4gICAgICBpZiAobmV3UGFyZW50KSB7XG4gICAgICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgICAgbmV3UGFyZW50LmFkZEJlZm9yZUFsbChsaXN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5leHQpIHtcbiAgICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICBwYXJlbnQuYWRkQWZ0ZXIobmV4dCwgbGlzdCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnVwZGF0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0U3RhcnRMaW5lQWZ0ZXIgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG4gICAgY29uc3QgbGluZURpZmYgPSBsaXN0U3RhcnRMaW5lQWZ0ZXIgLSBsaXN0U3RhcnRMaW5lQmVmb3JlO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgKyBsaW5lRGlmZixcbiAgICAgIGNoOiBjdXJzb3IuY2gsXG4gICAgfSk7XG5cbiAgICByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzKHJvb3QpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRpb24gfSBmcm9tIFwiLi9PcGVyYXRpb25cIjtcblxuaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzIH0gZnJvbSBcIi4uL3Jvb3QvcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0c1wiO1xuXG5leHBvcnQgY2xhc3MgTW92ZVJpZ2h0T3BlcmF0aW9uIGltcGxlbWVudHMgT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290LCBwcml2YXRlIGRlZmF1bHRJbmRlbnRDaGFyczogc3RyaW5nKSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBwcmV2ID0gcGFyZW50LmdldFByZXZTaWJsaW5nT2YobGlzdCk7XG5cbiAgICBpZiAoIXByZXYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgbGlzdFN0YXJ0TGluZUJlZm9yZSA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcblxuICAgIGNvbnN0IGluZGVudFBvcyA9IGxpc3QuZ2V0Rmlyc3RMaW5lSW5kZW50KCkubGVuZ3RoO1xuICAgIGxldCBpbmRlbnRDaGFycyA9IFwiXCI7XG5cbiAgICBpZiAoaW5kZW50Q2hhcnMgPT09IFwiXCIgJiYgIXByZXYuaXNFbXB0eSgpKSB7XG4gICAgICBpbmRlbnRDaGFycyA9IHByZXZcbiAgICAgICAgLmdldENoaWxkcmVuKClbMF1cbiAgICAgICAgLmdldEZpcnN0TGluZUluZGVudCgpXG4gICAgICAgIC5zbGljZShwcmV2LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgaWYgKGluZGVudENoYXJzID09PSBcIlwiKSB7XG4gICAgICBpbmRlbnRDaGFycyA9IGxpc3RcbiAgICAgICAgLmdldEZpcnN0TGluZUluZGVudCgpXG4gICAgICAgIC5zbGljZShwYXJlbnQuZ2V0Rmlyc3RMaW5lSW5kZW50KCkubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBpZiAoaW5kZW50Q2hhcnMgPT09IFwiXCIgJiYgIWxpc3QuaXNFbXB0eSgpKSB7XG4gICAgICBpbmRlbnRDaGFycyA9IGxpc3QuZ2V0Q2hpbGRyZW4oKVswXS5nZXRGaXJzdExpbmVJbmRlbnQoKTtcbiAgICB9XG5cbiAgICBpZiAoaW5kZW50Q2hhcnMgPT09IFwiXCIpIHtcbiAgICAgIGluZGVudENoYXJzID0gdGhpcy5kZWZhdWx0SW5kZW50Q2hhcnM7XG4gICAgfVxuXG4gICAgcGFyZW50LnJlbW92ZUNoaWxkKGxpc3QpO1xuICAgIHByZXYuYWRkQWZ0ZXJBbGwobGlzdCk7XG4gICAgbGlzdC5pbmRlbnRDb250ZW50KGluZGVudFBvcywgaW5kZW50Q2hhcnMpO1xuXG4gICAgY29uc3QgbGlzdFN0YXJ0TGluZUFmdGVyID0gcm9vdC5nZXRDb250ZW50TGluZXNSYW5nZU9mKGxpc3QpWzBdO1xuICAgIGNvbnN0IGxpbmVEaWZmID0gbGlzdFN0YXJ0TGluZUFmdGVyIC0gbGlzdFN0YXJ0TGluZUJlZm9yZTtcblxuICAgIGNvbnN0IGN1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG4gICAgcm9vdC5yZXBsYWNlQ3Vyc29yKHtcbiAgICAgIGxpbmU6IGN1cnNvci5saW5lICsgbGluZURpZmYsXG4gICAgICBjaDogY3Vyc29yLmNoICsgaW5kZW50Q2hhcnMubGVuZ3RoLFxuICAgIH0pO1xuXG4gICAgcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0cyhyb290KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT3BlcmF0aW9uIH0gZnJvbSBcIi4vT3BlcmF0aW9uXCI7XG5cbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0cyB9IGZyb20gXCIuLi9yb290L3JlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHNcIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVVcE9wZXJhdGlvbiBpbXBsZW1lbnRzIE9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgcHJldiA9IHBhcmVudC5nZXRQcmV2U2libGluZ09mKGxpc3QpO1xuXG4gICAgY29uc3QgbGlzdFN0YXJ0TGluZUJlZm9yZSA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcblxuICAgIGlmICghcHJldiAmJiBncmFuZFBhcmVudCkge1xuICAgICAgY29uc3QgbmV3UGFyZW50ID0gZ3JhbmRQYXJlbnQuZ2V0UHJldlNpYmxpbmdPZihwYXJlbnQpO1xuXG4gICAgICBpZiAobmV3UGFyZW50KSB7XG4gICAgICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgICAgbmV3UGFyZW50LmFkZEFmdGVyQWxsKGxpc3QpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocHJldikge1xuICAgICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgIHBhcmVudC5hZGRCZWZvcmUocHJldiwgbGlzdCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnVwZGF0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0U3RhcnRMaW5lQWZ0ZXIgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG4gICAgY29uc3QgbGluZURpZmYgPSBsaXN0U3RhcnRMaW5lQWZ0ZXIgLSBsaXN0U3RhcnRMaW5lQmVmb3JlO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgKyBsaW5lRGlmZixcbiAgICAgIGNoOiBjdXJzb3IuY2gsXG4gICAgfSk7XG5cbiAgICByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzKHJvb3QpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyBQcmVjIH0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5pbXBvcnQgeyBrZXltYXAgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuXG5pbXBvcnQgeyBNeUVkaXRvciB9IGZyb20gXCIuLi9NeUVkaXRvclwiO1xuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlcy9GZWF0dXJlXCI7XG5pbXBvcnQgeyBNb3ZlRG93bk9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL01vdmVEb3duT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBNb3ZlTGVmdE9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL01vdmVMZWZ0T3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBNb3ZlUmlnaHRPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9Nb3ZlUmlnaHRPcGVyYXRpb25cIjtcbmltcG9ydCB7IE1vdmVVcE9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL01vdmVVcE9wZXJhdGlvblwiO1xuaW1wb3J0IHsgSU1FU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9JTUVTZXJ2aWNlXCI7XG5pbXBvcnQgeyBPYnNpZGlhblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvT2JzaWRpYW5TZXJ2aWNlXCI7XG5pbXBvcnQgeyBQZXJmb3JtT3BlcmF0aW9uU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9QZXJmb3JtT3BlcmF0aW9uU2VydmljZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuXG5leHBvcnQgY2xhc3MgTW92ZUl0ZW1zRmVhdHVyZSBpbXBsZW1lbnRzIEZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBpbWU6IElNRVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBvYnNpZGlhbjogT2JzaWRpYW5TZXJ2aWNlLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIHBlcmZvcm1PcGVyYXRpb246IFBlcmZvcm1PcGVyYXRpb25TZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwibW92ZS1saXN0LWl0ZW0tdXBcIixcbiAgICAgIG5hbWU6IFwiTW92ZSBsaXN0IGFuZCBzdWJsaXN0cyB1cFwiLFxuICAgICAgZWRpdG9yQ2FsbGJhY2s6IHRoaXMub2JzaWRpYW4uY3JlYXRlRWRpdG9yQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50VXBDb21tYW5kXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiQXJyb3dVcFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwibW92ZS1saXN0LWl0ZW0tZG93blwiLFxuICAgICAgbmFtZTogXCJNb3ZlIGxpc3QgYW5kIHN1Ymxpc3RzIGRvd25cIixcbiAgICAgIGVkaXRvckNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuLmNyZWF0ZUVkaXRvckNhbGxiYWNrKFxuICAgICAgICB0aGlzLm1vdmVMaXN0RWxlbWVudERvd25Db21tYW5kXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiQXJyb3dEb3duXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJpbmRlbnQtbGlzdFwiLFxuICAgICAgbmFtZTogXCJJbmRlbnQgdGhlIGxpc3QgYW5kIHN1Ymxpc3RzXCIsXG4gICAgICBlZGl0b3JDYWxsYmFjazogdGhpcy5vYnNpZGlhbi5jcmVhdGVFZGl0b3JDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnRSaWdodENvbW1hbmRcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwib3V0ZGVudC1saXN0XCIsXG4gICAgICBuYW1lOiBcIk91dGRlbnQgdGhlIGxpc3QgYW5kIHN1Ymxpc3RzXCIsXG4gICAgICBlZGl0b3JDYWxsYmFjazogdGhpcy5vYnNpZGlhbi5jcmVhdGVFZGl0b3JDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnRMZWZ0Q29tbWFuZFxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24oXG4gICAgICBQcmVjLmhpZ2hlc3QoXG4gICAgICAgIGtleW1hcC5vZihbXG4gICAgICAgICAge1xuICAgICAgICAgICAga2V5OiBcIlRhYlwiLFxuICAgICAgICAgICAgcnVuOiB0aGlzLm9ic2lkaWFuLmNyZWF0ZUtleW1hcFJ1bkNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgY2hlY2s6IHRoaXMuY2hlY2ssXG4gICAgICAgICAgICAgIHJ1bjogdGhpcy5tb3ZlTGlzdEVsZW1lbnRSaWdodCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAga2V5OiBcInMtVGFiXCIsXG4gICAgICAgICAgICBydW46IHRoaXMub2JzaWRpYW4uY3JlYXRlS2V5bWFwUnVuQ2FsbGJhY2soe1xuICAgICAgICAgICAgICBjaGVjazogdGhpcy5jaGVjayxcbiAgICAgICAgICAgICAgcnVuOiB0aGlzLm1vdmVMaXN0RWxlbWVudExlZnQsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxuXG4gIHByaXZhdGUgY2hlY2sgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuYmV0dGVyVGFiICYmICF0aGlzLmltZS5pc0lNRU9wZW5lZCgpO1xuICB9O1xuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50RG93bkNvbW1hbmQgPSAoZWRpdG9yOiBNeUVkaXRvcikgPT4ge1xuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLnBlcmZvcm1PcGVyYXRpb24ucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PiBuZXcgTW92ZURvd25PcGVyYXRpb24ocm9vdCksXG4gICAgICBlZGl0b3JcbiAgICApO1xuXG4gICAgcmV0dXJuIHNob3VsZFN0b3BQcm9wYWdhdGlvbjtcbiAgfTtcblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudFVwQ29tbWFuZCA9IChlZGl0b3I6IE15RWRpdG9yKSA9PiB7XG4gICAgY29uc3QgeyBzaG91bGRTdG9wUHJvcGFnYXRpb24gfSA9IHRoaXMucGVyZm9ybU9wZXJhdGlvbi5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBNb3ZlVXBPcGVyYXRpb24ocm9vdCksXG4gICAgICBlZGl0b3JcbiAgICApO1xuXG4gICAgcmV0dXJuIHNob3VsZFN0b3BQcm9wYWdhdGlvbjtcbiAgfTtcblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudFJpZ2h0Q29tbWFuZCA9IChlZGl0b3I6IE15RWRpdG9yKSA9PiB7XG4gICAgaWYgKHRoaXMuaW1lLmlzSU1FT3BlbmVkKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1vdmVMaXN0RWxlbWVudFJpZ2h0KGVkaXRvcikuc2hvdWxkU3RvcFByb3BhZ2F0aW9uO1xuICB9O1xuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50UmlnaHQgPSAoZWRpdG9yOiBNeUVkaXRvcikgPT4ge1xuICAgIHJldHVybiB0aGlzLnBlcmZvcm1PcGVyYXRpb24ucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PlxuICAgICAgICBuZXcgTW92ZVJpZ2h0T3BlcmF0aW9uKHJvb3QsIHRoaXMub2JzaWRpYW4uZ2V0RGVmYXVsdEluZGVudENoYXJzKCkpLFxuICAgICAgZWRpdG9yXG4gICAgKTtcbiAgfTtcblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudExlZnRDb21tYW5kID0gKGVkaXRvcjogTXlFZGl0b3IpID0+IHtcbiAgICBpZiAodGhpcy5pbWUuaXNJTUVPcGVuZWQoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubW92ZUxpc3RFbGVtZW50TGVmdChlZGl0b3IpLnNob3VsZFN0b3BQcm9wYWdhdGlvbjtcbiAgfTtcblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudExlZnQgPSAoZWRpdG9yOiBNeUVkaXRvcikgPT4ge1xuICAgIHJldHVybiB0aGlzLnBlcmZvcm1PcGVyYXRpb24ucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PiBuZXcgTW92ZUxlZnRPcGVyYXRpb24ocm9vdCksXG4gICAgICBlZGl0b3JcbiAgICApO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgT3BlcmF0aW9uIH0gZnJvbSBcIi4vT3BlcmF0aW9uXCI7XG5cbmltcG9ydCB7IFJvb3QsIG1heFBvcywgbWluUG9zIH0gZnJvbSBcIi4uL3Jvb3RcIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdEFsbE9wZXJhdGlvbiBpbXBsZW1lbnRzIE9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVTZWxlY3Rpb24oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHJvb3QuZ2V0U2VsZWN0aW9ucygpWzBdO1xuICAgIGNvbnN0IFtyb290U3RhcnQsIHJvb3RFbmRdID0gcm9vdC5nZXRSYW5nZSgpO1xuXG4gICAgY29uc3Qgc2VsZWN0aW9uRnJvbSA9IG1pblBvcyhzZWxlY3Rpb24uYW5jaG9yLCBzZWxlY3Rpb24uaGVhZCk7XG4gICAgY29uc3Qgc2VsZWN0aW9uVG8gPSBtYXhQb3Moc2VsZWN0aW9uLmFuY2hvciwgc2VsZWN0aW9uLmhlYWQpO1xuXG4gICAgaWYgKFxuICAgICAgc2VsZWN0aW9uRnJvbS5saW5lIDwgcm9vdFN0YXJ0LmxpbmUgfHxcbiAgICAgIHNlbGVjdGlvblRvLmxpbmUgPiByb290RW5kLmxpbmVcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBzZWxlY3Rpb25Gcm9tLmxpbmUgPT09IHJvb3RTdGFydC5saW5lICYmXG4gICAgICBzZWxlY3Rpb25Gcm9tLmNoID09PSByb290U3RhcnQuY2ggJiZcbiAgICAgIHNlbGVjdGlvblRvLmxpbmUgPT09IHJvb3RFbmQubGluZSAmJlxuICAgICAgc2VsZWN0aW9uVG8uY2ggPT09IHJvb3RFbmQuY2hcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBjb250ZW50U3RhcnQgPSBsaXN0LmdldEZpcnN0TGluZUNvbnRlbnRTdGFydCgpO1xuICAgIGNvbnN0IGNvbnRlbnRFbmQgPSBsaXN0LmdldExhc3RMaW5lQ29udGVudEVuZCgpO1xuXG4gICAgaWYgKFxuICAgICAgc2VsZWN0aW9uRnJvbS5saW5lIDwgY29udGVudFN0YXJ0LmxpbmUgfHxcbiAgICAgIHNlbGVjdGlvblRvLmxpbmUgPiBjb250ZW50RW5kLmxpbmVcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgIGlmIChcbiAgICAgIHNlbGVjdGlvbkZyb20ubGluZSA9PT0gY29udGVudFN0YXJ0LmxpbmUgJiZcbiAgICAgIHNlbGVjdGlvbkZyb20uY2ggPT09IGNvbnRlbnRTdGFydC5jaCAmJlxuICAgICAgc2VsZWN0aW9uVG8ubGluZSA9PT0gY29udGVudEVuZC5saW5lICYmXG4gICAgICBzZWxlY3Rpb25Uby5jaCA9PT0gY29udGVudEVuZC5jaFxuICAgICkge1xuICAgICAgLy8gc2VsZWN0IGFsbCBsaXN0XG4gICAgICByb290LnJlcGxhY2VTZWxlY3Rpb25zKFt7IGFuY2hvcjogcm9vdFN0YXJ0LCBoZWFkOiByb290RW5kIH1dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2VsZWN0IGFsbCBsaW5lXG4gICAgICByb290LnJlcGxhY2VTZWxlY3Rpb25zKFt7IGFuY2hvcjogY29udGVudFN0YXJ0LCBoZWFkOiBjb250ZW50RW5kIH1dKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsga2V5bWFwIH0gZnJvbSBcIkBjb2RlbWlycm9yL3ZpZXdcIjtcblxuaW1wb3J0IHsgTXlFZGl0b3IgfSBmcm9tIFwiLi4vTXlFZGl0b3JcIjtcbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZXMvRmVhdHVyZVwiO1xuaW1wb3J0IHsgU2VsZWN0QWxsT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvU2VsZWN0QWxsT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJTUVTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL0lNRVNlcnZpY2VcIjtcbmltcG9ydCB7IE9ic2lkaWFuU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9PYnNpZGlhblNlcnZpY2VcIjtcbmltcG9ydCB7IFBlcmZvcm1PcGVyYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1BlcmZvcm1PcGVyYXRpb25TZXJ2aWNlXCI7XG5pbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3RBbGxGZWF0dXJlIGltcGxlbWVudHMgRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbWU6IElNRVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBvYnNpZGlhbjogT2JzaWRpYW5TZXJ2aWNlLFxuICAgIHByaXZhdGUgcGVyZm9ybU9wZXJhdGlvbjogUGVyZm9ybU9wZXJhdGlvblNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFZGl0b3JFeHRlbnNpb24oXG4gICAgICBrZXltYXAub2YoW1xuICAgICAgICB7XG4gICAgICAgICAga2V5OiBcImMtYVwiLFxuICAgICAgICAgIG1hYzogXCJtLWFcIixcbiAgICAgICAgICBydW46IHRoaXMub2JzaWRpYW4uY3JlYXRlS2V5bWFwUnVuQ2FsbGJhY2soe1xuICAgICAgICAgICAgY2hlY2s6IHRoaXMuY2hlY2ssXG4gICAgICAgICAgICBydW46IHRoaXMucnVuLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgXSlcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIGNoZWNrID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLnNlbGVjdEFsbCAmJiAhdGhpcy5pbWUuaXNJTUVPcGVuZWQoKTtcbiAgfTtcblxuICBwcml2YXRlIHJ1biA9IChlZGl0b3I6IE15RWRpdG9yKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBTZWxlY3RBbGxPcGVyYXRpb24ocm9vdCksXG4gICAgICBlZGl0b3JcbiAgICApO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgT3BlcmF0aW9uIH0gZnJvbSBcIi4vT3BlcmF0aW9uXCI7XG5cbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuXG5leHBvcnQgY2xhc3MgU2VsZWN0VGlsbExpbmVTdGFydE9wZXJhdGlvbiBpbXBsZW1lbnRzIE9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBsaW5lcyA9IGxpc3QuZ2V0TGluZXNJbmZvKCk7XG4gICAgY29uc3QgbGluZU5vID0gbGluZXMuZmluZEluZGV4KChsKSA9PiBsLmZyb20ubGluZSA9PT0gY3Vyc29yLmxpbmUpO1xuXG4gICAgcm9vdC5yZXBsYWNlU2VsZWN0aW9ucyhbeyBoZWFkOiBsaW5lc1tsaW5lTm9dLmZyb20sIGFuY2hvcjogY3Vyc29yIH1dKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsga2V5bWFwIH0gZnJvbSBcIkBjb2RlbWlycm9yL3ZpZXdcIjtcblxuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gXCIuL0ZlYXR1cmVcIjtcblxuaW1wb3J0IHsgTXlFZGl0b3IgfSBmcm9tIFwiLi4vTXlFZGl0b3JcIjtcbmltcG9ydCB7IFNlbGVjdFRpbGxMaW5lU3RhcnRPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9TZWxlY3RUaWxsTGluZVN0YXJ0T3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJTUVTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL0lNRVNlcnZpY2VcIjtcbmltcG9ydCB7IE9ic2lkaWFuU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9PYnNpZGlhblNlcnZpY2VcIjtcbmltcG9ydCB7IFBlcmZvcm1PcGVyYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1BlcmZvcm1PcGVyYXRpb25TZXJ2aWNlXCI7XG5pbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25TaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSBpbXBsZW1lbnRzIEZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgaW1lOiBJTUVTZXJ2aWNlLFxuICAgIHByaXZhdGUgb2JzaWRpYW46IE9ic2lkaWFuU2VydmljZSxcbiAgICBwcml2YXRlIHBlcmZvcm1PcGVyYXRpb246IFBlcmZvcm1PcGVyYXRpb25TZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyRWRpdG9yRXh0ZW5zaW9uKFxuICAgICAga2V5bWFwLm9mKFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogXCJtLXMtQXJyb3dMZWZ0XCIsXG4gICAgICAgICAgcnVuOiB0aGlzLm9ic2lkaWFuLmNyZWF0ZUtleW1hcFJ1bkNhbGxiYWNrKHtcbiAgICAgICAgICAgIGNoZWNrOiB0aGlzLmNoZWNrLFxuICAgICAgICAgICAgcnVuOiB0aGlzLnJ1bixcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIF0pXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG5cbiAgcHJpdmF0ZSBjaGVjayA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5zdGlja0N1cnNvciAmJiAhdGhpcy5pbWUuaXNJTUVPcGVuZWQoKTtcbiAgfTtcblxuICBwcml2YXRlIHJ1biA9IChlZGl0b3I6IE15RWRpdG9yKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBTZWxlY3RUaWxsTGluZVN0YXJ0T3BlcmF0aW9uKHJvb3QpLFxuICAgICAgZWRpdG9yXG4gICAgKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgUGx1Z2luXzIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gXCIuL0ZlYXR1cmVcIjtcblxuaW1wb3J0IHsgTGlzdExpbmVBY3Rpb24sIFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuY2xhc3MgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUGx1Z2luXzIsIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzU2VydmljZSkge1xuICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcbiAgfVxuXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiSW1wcm92ZSB0aGUgc3R5bGUgb2YgeW91ciBsaXN0c1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiU3R5bGVzIGFyZSBvbmx5IGNvbXBhdGlibGUgd2l0aCBidWlsdC1pbiBPYnNpZGlhbiB0aGVtZXMgYW5kIG1heSBub3QgYmUgY29tcGF0aWJsZSB3aXRoIG90aGVyIHRoZW1lcy4gU3R5bGVzIG9ubHkgd29yayB3ZWxsIHdpdGggdGFiIHNpemUgNC5cIlxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLnN0eWxlTGlzdHMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc3R5bGVMaXN0cyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ3Muc2F2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRyYXcgdmVydGljYWwgaW5kZW50YXRpb24gbGluZXNcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5saXN0TGluZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MubGlzdExpbmVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVmVydGljYWwgaW5kZW50YXRpb24gbGluZSBjbGljayBhY3Rpb25cIilcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9ucyh7XG4gICAgICAgICAgICBub25lOiBcIk5vbmVcIixcbiAgICAgICAgICAgIFwiem9vbS1pblwiOiBcIlpvb20gSW5cIixcbiAgICAgICAgICAgIFwidG9nZ2xlLWZvbGRpbmdcIjogXCJUb2dnbGUgRm9sZGluZ1wiLFxuICAgICAgICAgIH0gYXMgeyBba2V5IGluIExpc3RMaW5lQWN0aW9uXTogc3RyaW5nIH0pXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MubGlzdExpbmVBY3Rpb24pXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5saXN0TGluZUFjdGlvbiA9IHZhbHVlIGFzIExpc3RMaW5lQWN0aW9uO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTdGljayB0aGUgY3Vyc29yIHRvIHRoZSBjb250ZW50XCIpXG4gICAgICAuc2V0RGVzYyhcIkRvbid0IGxldCB0aGUgY3Vyc29yIG1vdmUgdG8gdGhlIGJ1bGxldCBwb3NpdGlvbi5cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5zdGlja0N1cnNvcikub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5zdGlja0N1cnNvciA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ3Muc2F2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuaGFuY2UgdGhlIEVudGVyIGtleVwiKVxuICAgICAgLnNldERlc2MoXCJNYWtlIHRoZSBFbnRlciBrZXkgYmVoYXZlIHRoZSBzYW1lIGFzIG90aGVyIG91dGxpbmVycy5cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5iZXR0ZXJFbnRlcikub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5iZXR0ZXJFbnRlciA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ3Muc2F2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVuaGFuY2UgdGhlIFRhYiBrZXlcIilcbiAgICAgIC5zZXREZXNjKFwiTWFrZSBUYWIgYW5kIFNoaWZ0LVRhYiBiZWhhdmUgdGhlIHNhbWUgYXMgb3RoZXIgb3V0bGluZXJzLlwiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmJldHRlclRhYikub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5iZXR0ZXJUYWIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmhhbmNlIHRoZSBDdHJsK0Egb3IgQ21kK0EgYmVoYXZpb3JcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlByZXNzIHRoZSBob3RrZXkgb25jZSB0byBzZWxlY3QgdGhlIGN1cnJlbnQgbGlzdCBpdGVtLiBQcmVzcyB0aGUgaG90a2V5IHR3aWNlIHRvIHNlbGVjdCB0aGUgZW50aXJlIGxpc3QuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5zZWxlY3RBbGwpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc2VsZWN0QWxsID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGVidWcgbW9kZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiT3BlbiBEZXZUb29scyAoQ29tbWFuZCtPcHRpb24rSSBvciBDb250cm9sK1NoaWZ0K0kpIHRvIGNvcHkgdGhlIGRlYnVnIGxvZ3MuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5kZWJ1Zykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5kZWJ1ZyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ3Muc2F2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc1RhYkZlYXR1cmUgaW1wbGVtZW50cyBGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLCBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5nc1NlcnZpY2UpIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hZGRTZXR0aW5nVGFiKFxuICAgICAgbmV3IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5nVGFiKFxuICAgICAgICB0aGlzLnBsdWdpbi5hcHAsXG4gICAgICAgIHRoaXMucGx1Z2luLFxuICAgICAgICB0aGlzLnNldHRpbmdzXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRpb24gfSBmcm9tIFwiLi9PcGVyYXRpb25cIjtcblxuaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5cbmV4cG9ydCBjbGFzcyBDcmVhdGVOb3RlTGluZU9wZXJhdGlvbiBpbXBsZW1lbnRzIE9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGluZVVuZGVyQ3Vyc29yID0gbGlzdFxuICAgICAgLmdldExpbmVzSW5mbygpXG4gICAgICAuZmluZCgobCkgPT4gbC5mcm9tLmxpbmUgPT09IGN1cnNvci5saW5lKTtcblxuICAgIGlmIChjdXJzb3IuY2ggPCBsaW5lVW5kZXJDdXJzb3IuZnJvbS5jaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgaWYgKCFsaXN0LmdldE5vdGVzSW5kZW50KCkpIHtcbiAgICAgIGxpc3Quc2V0Tm90ZXNJbmRlbnQobGlzdC5nZXRGaXJzdExpbmVJbmRlbnQoKSArIFwiICBcIik7XG4gICAgfVxuXG4gICAgY29uc3QgbGluZXMgPSBsaXN0LmdldExpbmVzSW5mbygpLnJlZHVjZSgoYWNjLCBsaW5lKSA9PiB7XG4gICAgICBpZiAoY3Vyc29yLmxpbmUgPT09IGxpbmUuZnJvbS5saW5lKSB7XG4gICAgICAgIGFjYy5wdXNoKGxpbmUudGV4dC5zbGljZSgwLCBjdXJzb3IuY2ggLSBsaW5lLmZyb20uY2gpKTtcbiAgICAgICAgYWNjLnB1c2gobGluZS50ZXh0LnNsaWNlKGN1cnNvci5jaCAtIGxpbmUuZnJvbS5jaCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWNjLnB1c2gobGluZS50ZXh0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBbXSBhcyBzdHJpbmdbXSk7XG5cbiAgICBsaXN0LnJlcGxhY2VMaW5lcyhsaW5lcyk7XG5cbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgKyAxLFxuICAgICAgY2g6IGxpc3QuZ2V0Tm90ZXNJbmRlbnQoKS5sZW5ndGgsXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IGtleW1hcCB9IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5cbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tIFwiLi9GZWF0dXJlXCI7XG5cbmltcG9ydCB7IE15RWRpdG9yIH0gZnJvbSBcIi4uL015RWRpdG9yXCI7XG5pbXBvcnQgeyBDcmVhdGVOb3RlTGluZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL0NyZWF0ZU5vdGVMaW5lT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJTUVTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL0lNRVNlcnZpY2VcIjtcbmltcG9ydCB7IE9ic2lkaWFuU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9PYnNpZGlhblNlcnZpY2VcIjtcbmltcG9ydCB7IFBlcmZvcm1PcGVyYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1BlcmZvcm1PcGVyYXRpb25TZXJ2aWNlXCI7XG5pbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTaGlmdEVudGVyU2hvdWxkQ3JlYXRlTm90ZUZlYXR1cmUgaW1wbGVtZW50cyBGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgb2JzaWRpYW46IE9ic2lkaWFuU2VydmljZSxcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbWU6IElNRVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwZXJmb3JtT3BlcmF0aW9uOiBQZXJmb3JtT3BlcmF0aW9uU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckVkaXRvckV4dGVuc2lvbihcbiAgICAgIGtleW1hcC5vZihbXG4gICAgICAgIHtcbiAgICAgICAgICBrZXk6IFwicy1FbnRlclwiLFxuICAgICAgICAgIHJ1bjogdGhpcy5vYnNpZGlhbi5jcmVhdGVLZXltYXBSdW5DYWxsYmFjayh7XG4gICAgICAgICAgICBjaGVjazogdGhpcy5jaGVjayxcbiAgICAgICAgICAgIHJ1bjogdGhpcy5ydW4sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICBdKVxuICAgICk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxuXG4gIHByaXZhdGUgY2hlY2sgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIgJiYgIXRoaXMuaW1lLmlzSU1FT3BlbmVkKCk7XG4gIH07XG5cbiAgcHJpdmF0ZSBydW4gPSAoZWRpdG9yOiBNeUVkaXRvcikgPT4ge1xuICAgIHJldHVybiB0aGlzLnBlcmZvcm1PcGVyYXRpb24ucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PiBuZXcgQ3JlYXRlTm90ZUxpbmVPcGVyYXRpb24ocm9vdCksXG4gICAgICBlZGl0b3JcbiAgICApO1xuICB9O1xufVxuIiwiZXhwb3J0IGludGVyZmFjZSBBcHBseUNoYW5nZXNFZGl0b3JQb3NpdGlvbiB7XG4gIGxpbmU6IG51bWJlcjtcbiAgY2g6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcHBseUNoYW5nZXNFZGl0b3JTZWxlY3Rpb24ge1xuICBhbmNob3I6IEFwcGx5Q2hhbmdlc0VkaXRvclBvc2l0aW9uO1xuICBoZWFkOiBBcHBseUNoYW5nZXNFZGl0b3JQb3NpdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcHBseUNoYW5nZXNFZGl0b3Ige1xuICBnZXRSYW5nZShcbiAgICBmcm9tOiBBcHBseUNoYW5nZXNFZGl0b3JQb3NpdGlvbixcbiAgICB0bzogQXBwbHlDaGFuZ2VzRWRpdG9yUG9zaXRpb25cbiAgKTogc3RyaW5nO1xuICByZXBsYWNlUmFuZ2UoXG4gICAgcmVwbGFjZW1lbnQ6IHN0cmluZyxcbiAgICBmcm9tOiBBcHBseUNoYW5nZXNFZGl0b3JQb3NpdGlvbixcbiAgICB0bzogQXBwbHlDaGFuZ2VzRWRpdG9yUG9zaXRpb25cbiAgKTogdm9pZDtcbiAgc2V0U2VsZWN0aW9ucyhzZWxlY3Rpb25zOiBBcHBseUNoYW5nZXNFZGl0b3JTZWxlY3Rpb25bXSk6IHZvaWQ7XG4gIGZvbGQobjogbnVtYmVyKTogdm9pZDtcbiAgdW5mb2xkKG46IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXBwbHlDaGFuZ2VzTGlzdCB7XG4gIGlzRm9sZFJvb3QoKTogYm9vbGVhbjtcbiAgZ2V0Q2hpbGRyZW4oKTogQXBwbHlDaGFuZ2VzTGlzdFtdO1xuICBnZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKTogeyBsaW5lOiBudW1iZXIgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcHBseUNoYW5nZXNSb290IHtcbiAgZ2V0UmFuZ2UoKTogW0FwcGx5Q2hhbmdlc0VkaXRvclBvc2l0aW9uLCBBcHBseUNoYW5nZXNFZGl0b3JQb3NpdGlvbl07XG4gIGdldFNlbGVjdGlvbnMoKToge1xuICAgIGFuY2hvcjogQXBwbHlDaGFuZ2VzRWRpdG9yUG9zaXRpb247XG4gICAgaGVhZDogQXBwbHlDaGFuZ2VzRWRpdG9yUG9zaXRpb247XG4gIH1bXTtcbiAgcHJpbnQoKTogc3RyaW5nO1xuICBnZXRDaGlsZHJlbigpOiBBcHBseUNoYW5nZXNMaXN0W107XG59XG5cbmV4cG9ydCBjbGFzcyBBcHBseUNoYW5nZXNTZXJ2aWNlIHtcbiAgYXBwbHlDaGFuZ2VzKGVkaXRvcjogQXBwbHlDaGFuZ2VzRWRpdG9yLCByb290OiBBcHBseUNoYW5nZXNSb290KSB7XG4gICAgY29uc3Qgcm9vdFJhbmdlID0gcm9vdC5nZXRSYW5nZSgpO1xuICAgIGNvbnN0IG9sZFN0cmluZyA9IGVkaXRvci5nZXRSYW5nZShyb290UmFuZ2VbMF0sIHJvb3RSYW5nZVsxXSk7XG4gICAgY29uc3QgbmV3U3RyaW5nID0gcm9vdC5wcmludCgpO1xuXG4gICAgY29uc3QgZnJvbUxpbmUgPSByb290UmFuZ2VbMF0ubGluZTtcbiAgICBjb25zdCB0b0xpbmUgPSByb290UmFuZ2VbMV0ubGluZTtcblxuICAgIGZvciAobGV0IGwgPSBmcm9tTGluZTsgbCA8PSB0b0xpbmU7IGwrKykge1xuICAgICAgZWRpdG9yLnVuZm9sZChsKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFuZ2VGcm9tID0geyAuLi5yb290UmFuZ2VbMF0gfTtcbiAgICBjb25zdCBjaGFuZ2VUbyA9IHsgLi4ucm9vdFJhbmdlWzFdIH07XG4gICAgbGV0IG9sZFRtcCA9IG9sZFN0cmluZztcbiAgICBsZXQgbmV3VG1wID0gbmV3U3RyaW5nO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBubEluZGV4ID0gb2xkVG1wLmxhc3RJbmRleE9mKFwiXFxuXCIpO1xuICAgICAgaWYgKG5sSW5kZXggPCAwKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY29uc3Qgb2xkTGluZSA9IG9sZFRtcC5zbGljZShubEluZGV4KTtcbiAgICAgIGNvbnN0IG5ld0xpbmUgPSBuZXdUbXAuc2xpY2UoLW9sZExpbmUubGVuZ3RoKTtcbiAgICAgIGlmIChvbGRMaW5lICE9PSBuZXdMaW5lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgb2xkVG1wID0gb2xkVG1wLnNsaWNlKDAsIC1vbGRMaW5lLmxlbmd0aCk7XG4gICAgICBuZXdUbXAgPSBuZXdUbXAuc2xpY2UoMCwgLW9sZExpbmUubGVuZ3RoKTtcblxuICAgICAgY29uc3QgbmxJbmRleDIgPSBvbGRUbXAubGFzdEluZGV4T2YoXCJcXG5cIik7XG4gICAgICBjaGFuZ2VUby5jaCA9XG4gICAgICAgIG5sSW5kZXgyID49IDAgPyBvbGRUbXAubGVuZ3RoIC0gbmxJbmRleDIgLSAxIDogb2xkVG1wLmxlbmd0aDtcbiAgICAgIGNoYW5nZVRvLmxpbmUtLTtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBubEluZGV4ID0gb2xkVG1wLmluZGV4T2YoXCJcXG5cIik7XG4gICAgICBpZiAobmxJbmRleCA8IDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjb25zdCBvbGRMaW5lID0gb2xkVG1wLnNsaWNlKDAsIG5sSW5kZXggKyAxKTtcbiAgICAgIGNvbnN0IG5ld0xpbmUgPSBuZXdUbXAuc2xpY2UoMCwgb2xkTGluZS5sZW5ndGgpO1xuICAgICAgaWYgKG9sZExpbmUgIT09IG5ld0xpbmUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjaGFuZ2VGcm9tLmxpbmUrKztcbiAgICAgIG9sZFRtcCA9IG9sZFRtcC5zbGljZShvbGRMaW5lLmxlbmd0aCk7XG4gICAgICBuZXdUbXAgPSBuZXdUbXAuc2xpY2Uob2xkTGluZS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChvbGRUbXAgIT09IG5ld1RtcCkge1xuICAgICAgZWRpdG9yLnJlcGxhY2VSYW5nZShuZXdUbXAsIGNoYW5nZUZyb20sIGNoYW5nZVRvKTtcbiAgICB9XG5cbiAgICBlZGl0b3Iuc2V0U2VsZWN0aW9ucyhyb290LmdldFNlbGVjdGlvbnMoKSk7XG5cbiAgICBmdW5jdGlvbiByZWN1cnNpdmUobGlzdDogQXBwbHlDaGFuZ2VzTGlzdCkge1xuICAgICAgZm9yIChjb25zdCBjIG9mIGxpc3QuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgICByZWN1cnNpdmUoYyk7XG4gICAgICB9XG4gICAgICBpZiAobGlzdC5pc0ZvbGRSb290KCkpIHtcbiAgICAgICAgZWRpdG9yLmZvbGQobGlzdC5nZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKS5saW5lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBjIG9mIHJvb3QuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgcmVjdXJzaXZlKGMpO1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIElNRVNlcnZpY2Uge1xuICBwcml2YXRlIGNvbXBvc2l0aW9uID0gZmFsc2U7XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29tcG9zaXRpb25zdGFydFwiLCB0aGlzLm9uQ29tcG9zaXRpb25TdGFydCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbXBvc2l0aW9uZW5kXCIsIHRoaXMub25Db21wb3NpdGlvbkVuZCk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbXBvc2l0aW9uZW5kXCIsIHRoaXMub25Db21wb3NpdGlvbkVuZCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbXBvc2l0aW9uc3RhcnRcIiwgdGhpcy5vbkNvbXBvc2l0aW9uU3RhcnQpO1xuICB9XG5cbiAgaXNJTUVPcGVuZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9zaXRpb247XG4gIH1cblxuICBwcml2YXRlIG9uQ29tcG9zaXRpb25TdGFydCA9ICgpID0+IHtcbiAgICB0aGlzLmNvbXBvc2l0aW9uID0gdHJ1ZTtcbiAgfTtcblxuICBwcml2YXRlIG9uQ29tcG9zaXRpb25FbmQgPSAoKSA9PiB7XG4gICAgdGhpcy5jb21wb3NpdGlvbiA9IGZhbHNlO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4vU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3NTZXJ2aWNlKSB7fVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gIGxvZyhtZXRob2Q6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZGVidWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zb2xlLmluZm8obWV0aG9kLCAuLi5hcmdzKTtcbiAgfVxuXG4gIGJpbmQobWV0aG9kOiBzdHJpbmcpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHRoaXMubG9nKG1ldGhvZCwgLi4uYXJncyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgRWRpdG9yLCBlZGl0b3JWaWV3RmllbGQgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgRWRpdG9yU3RhdGUgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIjtcbmltcG9ydCB7IEVkaXRvclZpZXcgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuXG5pbXBvcnQgeyBNeUVkaXRvciB9IGZyb20gXCIuLi9NeUVkaXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9ic2lkaWFuVGFic1NldHRpbmdzIHtcbiAgdXNlVGFiOiBib29sZWFuO1xuICB0YWJTaXplOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JzaWRpYW5Gb2xkU2V0dGluZ3Mge1xuICBmb2xkSW5kZW50OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgT2JzaWRpYW5TZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICBpc0xlZ2FjeUVkaXRvckVuYWJsZWQoKSB7XG4gICAgY29uc3QgY29uZmlnOiB7IGxlZ2FjeUVkaXRvcjogYm9vbGVhbiB9ID0ge1xuICAgICAgbGVnYWN5RWRpdG9yOiBmYWxzZSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAuLi4odGhpcy5hcHAudmF1bHQgYXMgYW55KS5jb25maWcsXG4gICAgfTtcblxuICAgIHJldHVybiBjb25maWcubGVnYWN5RWRpdG9yO1xuICB9XG5cbiAgaXNEZWZhdWx0VGhlbWVFbmFibGVkKCkge1xuICAgIGNvbnN0IGNvbmZpZzogeyBjc3NUaGVtZTogc3RyaW5nIH0gPSB7XG4gICAgICBjc3NUaGVtZTogXCJcIixcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAuLi4odGhpcy5hcHAudmF1bHQgYXMgYW55KS5jb25maWcsXG4gICAgfTtcblxuICAgIHJldHVybiBjb25maWcuY3NzVGhlbWUgPT09IFwiXCI7XG4gIH1cblxuICBnZXRPYnNpZGlhblRhYnNTZXR0aW5ncygpOiBPYnNpZGlhblRhYnNTZXR0aW5ncyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZVRhYjogdHJ1ZSxcbiAgICAgIHRhYlNpemU6IDQsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgLi4uKHRoaXMuYXBwLnZhdWx0IGFzIGFueSkuY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBnZXRPYnNpZGlhbkZvbGRTZXR0aW5ncygpOiBPYnNpZGlhbkZvbGRTZXR0aW5ncyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZvbGRJbmRlbnQ6IGZhbHNlLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgIC4uLih0aGlzLmFwcC52YXVsdCBhcyBhbnkpLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0RGVmYXVsdEluZGVudENoYXJzKCkge1xuICAgIGNvbnN0IHsgdXNlVGFiLCB0YWJTaXplIH0gPSB0aGlzLmdldE9ic2lkaWFuVGFic1NldHRpbmdzKCk7XG5cbiAgICByZXR1cm4gdXNlVGFiID8gXCJcXHRcIiA6IG5ldyBBcnJheSh0YWJTaXplKS5maWxsKFwiIFwiKS5qb2luKFwiXCIpO1xuICB9XG5cbiAgZ2V0RWRpdG9yRnJvbVN0YXRlKHN0YXRlOiBFZGl0b3JTdGF0ZSkge1xuICAgIHJldHVybiBuZXcgTXlFZGl0b3Ioc3RhdGUuZmllbGQoZWRpdG9yVmlld0ZpZWxkKS5lZGl0b3IpO1xuICB9XG5cbiAgY3JlYXRlS2V5bWFwUnVuQ2FsbGJhY2soY29uZmlnOiB7XG4gICAgY2hlY2s/OiAoZWRpdG9yOiBNeUVkaXRvcikgPT4gYm9vbGVhbjtcbiAgICBydW46IChlZGl0b3I6IE15RWRpdG9yKSA9PiB7XG4gICAgICBzaG91bGRVcGRhdGU6IGJvb2xlYW47XG4gICAgICBzaG91bGRTdG9wUHJvcGFnYXRpb246IGJvb2xlYW47XG4gICAgfTtcbiAgfSkge1xuICAgIGNvbnN0IGNoZWNrID0gY29uZmlnLmNoZWNrIHx8ICgoKSA9PiB0cnVlKTtcbiAgICBjb25zdCB7IHJ1biB9ID0gY29uZmlnO1xuXG4gICAgcmV0dXJuICh2aWV3OiBFZGl0b3JWaWV3KTogYm9vbGVhbiA9PiB7XG4gICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmdldEVkaXRvckZyb21TdGF0ZSh2aWV3LnN0YXRlKTtcblxuICAgICAgaWYgKCFjaGVjayhlZGl0b3IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBzaG91bGRVcGRhdGUsIHNob3VsZFN0b3BQcm9wYWdhdGlvbiB9ID0gcnVuKGVkaXRvcik7XG5cbiAgICAgIHJldHVybiBzaG91bGRVcGRhdGUgfHwgc2hvdWxkU3RvcFByb3BhZ2F0aW9uO1xuICAgIH07XG4gIH1cblxuICBjcmVhdGVFZGl0b3JDYWxsYmFjayhjYjogKGVkaXRvcjogTXlFZGl0b3IpID0+IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gKGVkaXRvcjogRWRpdG9yKSA9PiB7XG4gICAgICBjb25zdCBteUVkaXRvciA9IG5ldyBNeUVkaXRvcihlZGl0b3IpO1xuICAgICAgY29uc3Qgc2hvdWxkU3RvcFByb3BhZ2F0aW9uID0gY2IobXlFZGl0b3IpO1xuXG4gICAgICBpZiAoXG4gICAgICAgICFzaG91bGRTdG9wUHJvcGFnYXRpb24gJiZcbiAgICAgICAgd2luZG93LmV2ZW50ICYmXG4gICAgICAgIHdpbmRvdy5ldmVudC50eXBlID09PSBcImtleWRvd25cIlxuICAgICAgKSB7XG4gICAgICAgIG15RWRpdG9yLnRyaWdnZXJPbktleURvd24od2luZG93LmV2ZW50IGFzIEtleWJvYXJkRXZlbnQpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IExpc3QsIFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9Mb2dnZXJTZXJ2aWNlXCI7XG5cbmNvbnN0IGJ1bGxldFNpZ24gPSBgKD86Wy0qK118XFxcXGQrXFxcXC4pYDtcblxuY29uc3QgbGlzdEl0ZW1XaXRob3V0U3BhY2VzUmUgPSBuZXcgUmVnRXhwKGBeJHtidWxsZXRTaWdufSggfFxcdClgKTtcbmNvbnN0IGxpc3RJdGVtUmUgPSBuZXcgUmVnRXhwKGBeWyBcXHRdKiR7YnVsbGV0U2lnbn0oIHxcXHQpYCk7XG5jb25zdCBzdHJpbmdXaXRoU3BhY2VzUmUgPSBuZXcgUmVnRXhwKGBeWyBcXHRdK2ApO1xuY29uc3QgcGFyc2VMaXN0SXRlbVJlID0gbmV3IFJlZ0V4cChgXihbIFxcdF0qKSgke2J1bGxldFNpZ259KSggfFxcdCkoLiopJGApO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRlclBvc2l0aW9uIHtcbiAgbGluZTogbnVtYmVyO1xuICBjaDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRlclNlbGVjdGlvbiB7XG4gIGFuY2hvcjogUmVhZGVyUG9zaXRpb247XG4gIGhlYWQ6IFJlYWRlclBvc2l0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRlciB7XG4gIGdldEN1cnNvcigpOiBSZWFkZXJQb3NpdGlvbjtcbiAgZ2V0TGluZShuOiBudW1iZXIpOiBzdHJpbmc7XG4gIGxhc3RMaW5lKCk6IG51bWJlcjtcbiAgbGlzdFNlbGVjdGlvbnMoKTogUmVhZGVyU2VsZWN0aW9uW107XG4gIGdldEFsbEZvbGRlZExpbmVzKCk6IG51bWJlcltdO1xufVxuXG5pbnRlcmZhY2UgUGFyc2VMaXN0TGlzdCB7XG4gIGdldEZpcnN0TGluZUluZGVudCgpOiBzdHJpbmc7XG4gIHNldE5vdGVzSW5kZW50KG5vdGVzSW5kZW50OiBzdHJpbmcpOiB2b2lkO1xuICBnZXROb3Rlc0luZGVudCgpOiBzdHJpbmcgfCBudWxsO1xuICBhZGRMaW5lKHRleHQ6IHN0cmluZyk6IHZvaWQ7XG4gIGdldFBhcmVudCgpOiBQYXJzZUxpc3RMaXN0IHwgbnVsbDtcbiAgYWRkQWZ0ZXJBbGwobGlzdDogUGFyc2VMaXN0TGlzdCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2dnZXI6IExvZ2dlclNlcnZpY2UpIHt9XG5cbiAgcGFyc2VSYW5nZShlZGl0b3I6IFJlYWRlciwgZnJvbUxpbmUgPSAwLCB0b0xpbmUgPSBlZGl0b3IubGFzdExpbmUoKSk6IFJvb3RbXSB7XG4gICAgY29uc3QgbGlzdHM6IFJvb3RbXSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IGZyb21MaW5lOyBpIDw9IHRvTGluZTsgaSsrKSB7XG4gICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoaSk7XG5cbiAgICAgIGlmIChpID09PSBmcm9tTGluZSB8fCB0aGlzLmlzTGlzdEl0ZW0obGluZSkpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMucGFyc2VXaXRoTGltaXRzKGVkaXRvciwgaSwgZnJvbUxpbmUsIHRvTGluZSk7XG5cbiAgICAgICAgaWYgKGxpc3QpIHtcbiAgICAgICAgICBsaXN0cy5wdXNoKGxpc3QpO1xuICAgICAgICAgIGkgPSBsaXN0LmdldFJhbmdlKClbMV0ubGluZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsaXN0cztcbiAgfVxuXG4gIHBhcnNlKGVkaXRvcjogUmVhZGVyLCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCkpOiBSb290IHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VXaXRoTGltaXRzKGVkaXRvciwgY3Vyc29yLmxpbmUsIDAsIGVkaXRvci5sYXN0TGluZSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VXaXRoTGltaXRzKFxuICAgIGVkaXRvcjogUmVhZGVyLFxuICAgIHBhcnNpbmdTdGFydExpbmU6IG51bWJlcixcbiAgICBsaW1pdEZyb206IG51bWJlcixcbiAgICBsaW1pdFRvOiBudW1iZXJcbiAgKTogUm9vdCB8IG51bGwge1xuICAgIGNvbnN0IGQgPSB0aGlzLmxvZ2dlci5iaW5kKFwicGFyc2VMaXN0XCIpO1xuICAgIGNvbnN0IGVycm9yID0gKG1zZzogc3RyaW5nKTogbnVsbCA9PiB7XG4gICAgICBkKG1zZyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRMaW5lKHBhcnNpbmdTdGFydExpbmUpO1xuXG4gICAgbGV0IGxpc3RMb29raW5nUG9zOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAgIGlmICh0aGlzLmlzTGlzdEl0ZW0obGluZSkpIHtcbiAgICAgIGxpc3RMb29raW5nUG9zID0gcGFyc2luZ1N0YXJ0TGluZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNMaW5lV2l0aEluZGVudChsaW5lKSkge1xuICAgICAgbGV0IGxpc3RMb29raW5nUG9zU2VhcmNoID0gcGFyc2luZ1N0YXJ0TGluZSAtIDE7XG4gICAgICB3aGlsZSAobGlzdExvb2tpbmdQb3NTZWFyY2ggPj0gMCkge1xuICAgICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobGlzdExvb2tpbmdQb3NTZWFyY2gpO1xuICAgICAgICBpZiAodGhpcy5pc0xpc3RJdGVtKGxpbmUpKSB7XG4gICAgICAgICAgbGlzdExvb2tpbmdQb3MgPSBsaXN0TG9va2luZ1Bvc1NlYXJjaDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTGluZVdpdGhJbmRlbnQobGluZSkpIHtcbiAgICAgICAgICBsaXN0TG9va2luZ1Bvc1NlYXJjaC0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxpc3RMb29raW5nUG9zID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBsaXN0U3RhcnRMaW5lOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgbGlzdFN0YXJ0TGluZUxvb2t1cCA9IGxpc3RMb29raW5nUG9zO1xuICAgIHdoaWxlIChsaXN0U3RhcnRMaW5lTG9va3VwID49IDApIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaXN0U3RhcnRMaW5lTG9va3VwKTtcbiAgICAgIGlmICghdGhpcy5pc0xpc3RJdGVtKGxpbmUpICYmICF0aGlzLmlzTGluZVdpdGhJbmRlbnQobGluZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pc0xpc3RJdGVtV2l0aG91dFNwYWNlcyhsaW5lKSkge1xuICAgICAgICBsaXN0U3RhcnRMaW5lID0gbGlzdFN0YXJ0TGluZUxvb2t1cDtcbiAgICAgICAgaWYgKGxpc3RTdGFydExpbmVMb29rdXAgPD0gbGltaXRGcm9tKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3RTdGFydExpbmVMb29rdXAtLTtcbiAgICB9XG5cbiAgICBpZiAobGlzdFN0YXJ0TGluZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGxpc3RFbmRMaW5lID0gbGlzdExvb2tpbmdQb3M7XG4gICAgbGV0IGxpc3RFbmRMaW5lTG9va3VwID0gbGlzdExvb2tpbmdQb3M7XG4gICAgd2hpbGUgKGxpc3RFbmRMaW5lTG9va3VwIDw9IGVkaXRvci5sYXN0TGluZSgpKSB7XG4gICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobGlzdEVuZExpbmVMb29rdXApO1xuICAgICAgaWYgKCF0aGlzLmlzTGlzdEl0ZW0obGluZSkgJiYgIXRoaXMuaXNMaW5lV2l0aEluZGVudChsaW5lKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5pc0VtcHR5TGluZShsaW5lKSkge1xuICAgICAgICBsaXN0RW5kTGluZSA9IGxpc3RFbmRMaW5lTG9va3VwO1xuICAgICAgfVxuICAgICAgaWYgKGxpc3RFbmRMaW5lTG9va3VwID49IGxpbWl0VG8pIHtcbiAgICAgICAgbGlzdEVuZExpbmUgPSBsaW1pdFRvO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxpc3RFbmRMaW5lTG9va3VwKys7XG4gICAgfVxuXG4gICAgaWYgKGxpc3RTdGFydExpbmUgPiBwYXJzaW5nU3RhcnRMaW5lIHx8IGxpc3RFbmRMaW5lIDwgcGFyc2luZ1N0YXJ0TGluZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KFxuICAgICAgeyBsaW5lOiBsaXN0U3RhcnRMaW5lLCBjaDogMCB9LFxuICAgICAgeyBsaW5lOiBsaXN0RW5kTGluZSwgY2g6IGVkaXRvci5nZXRMaW5lKGxpc3RFbmRMaW5lKS5sZW5ndGggfSxcbiAgICAgIGVkaXRvci5saXN0U2VsZWN0aW9ucygpLm1hcCgocikgPT4gKHtcbiAgICAgICAgYW5jaG9yOiB7IGxpbmU6IHIuYW5jaG9yLmxpbmUsIGNoOiByLmFuY2hvci5jaCB9LFxuICAgICAgICBoZWFkOiB7IGxpbmU6IHIuaGVhZC5saW5lLCBjaDogci5oZWFkLmNoIH0sXG4gICAgICB9KSlcbiAgICApO1xuXG4gICAgbGV0IGN1cnJlbnRQYXJlbnQ6IFBhcnNlTGlzdExpc3QgPSByb290LmdldFJvb3RMaXN0KCk7XG4gICAgbGV0IGN1cnJlbnRMaXN0OiBQYXJzZUxpc3RMaXN0IHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGN1cnJlbnRJbmRlbnQgPSBcIlwiO1xuXG4gICAgY29uc3QgZm9sZGVkTGluZXMgPSBlZGl0b3IuZ2V0QWxsRm9sZGVkTGluZXMoKTtcblxuICAgIGZvciAobGV0IGwgPSBsaXN0U3RhcnRMaW5lOyBsIDw9IGxpc3RFbmRMaW5lOyBsKyspIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsKTtcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSBwYXJzZUxpc3RJdGVtUmUuZXhlYyhsaW5lKTtcblxuICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgY29uc3QgWywgaW5kZW50LCBidWxsZXQsIHNwYWNlQWZ0ZXJCdWxsZXQsIGNvbnRlbnRdID0gbWF0Y2hlcztcblxuICAgICAgICBjb25zdCBjb21wYXJlTGVuZ3RoID0gTWF0aC5taW4oY3VycmVudEluZGVudC5sZW5ndGgsIGluZGVudC5sZW5ndGgpO1xuICAgICAgICBjb25zdCBpbmRlbnRTbGljZSA9IGluZGVudC5zbGljZSgwLCBjb21wYXJlTGVuZ3RoKTtcbiAgICAgICAgY29uc3QgY3VycmVudEluZGVudFNsaWNlID0gY3VycmVudEluZGVudC5zbGljZSgwLCBjb21wYXJlTGVuZ3RoKTtcblxuICAgICAgICBpZiAoaW5kZW50U2xpY2UgIT09IGN1cnJlbnRJbmRlbnRTbGljZSkge1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkID0gY3VycmVudEluZGVudFNsaWNlXG4gICAgICAgICAgICAucmVwbGFjZSgvIC9nLCBcIlNcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHQvZywgXCJUXCIpO1xuICAgICAgICAgIGNvbnN0IGdvdCA9IGluZGVudFNsaWNlLnJlcGxhY2UoLyAvZywgXCJTXCIpLnJlcGxhY2UoL1xcdC9nLCBcIlRcIik7XG5cbiAgICAgICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgICAgICBgVW5hYmxlIHRvIHBhcnNlIGxpc3Q6IGV4cGVjdGVkIGluZGVudCBcIiR7ZXhwZWN0ZWR9XCIsIGdvdCBcIiR7Z290fVwiYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5kZW50Lmxlbmd0aCA+IGN1cnJlbnRJbmRlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgY3VycmVudFBhcmVudCA9IGN1cnJlbnRMaXN0O1xuICAgICAgICAgIGN1cnJlbnRJbmRlbnQgPSBpbmRlbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZW50Lmxlbmd0aCA8IGN1cnJlbnRJbmRlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgY3VycmVudFBhcmVudC5nZXRGaXJzdExpbmVJbmRlbnQoKS5sZW5ndGggPj0gaW5kZW50Lmxlbmd0aCAmJlxuICAgICAgICAgICAgY3VycmVudFBhcmVudC5nZXRQYXJlbnQoKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY3VycmVudFBhcmVudCA9IGN1cnJlbnRQYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRJbmRlbnQgPSBpbmRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmb2xkUm9vdCA9IGZvbGRlZExpbmVzLmluY2x1ZGVzKGwpO1xuXG4gICAgICAgIGN1cnJlbnRMaXN0ID0gbmV3IExpc3QoXG4gICAgICAgICAgcm9vdCxcbiAgICAgICAgICBpbmRlbnQsXG4gICAgICAgICAgYnVsbGV0LFxuICAgICAgICAgIHNwYWNlQWZ0ZXJCdWxsZXQsXG4gICAgICAgICAgY29udGVudCxcbiAgICAgICAgICBmb2xkUm9vdFxuICAgICAgICApO1xuICAgICAgICBjdXJyZW50UGFyZW50LmFkZEFmdGVyQWxsKGN1cnJlbnRMaXN0KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0xpbmVXaXRoSW5kZW50KGxpbmUpKSB7XG4gICAgICAgIGlmICghY3VycmVudExpc3QpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgICAgICBgVW5hYmxlIHRvIHBhcnNlIGxpc3Q6IGV4cGVjdGVkIGxpc3QgaXRlbSwgZ290IGVtcHR5IGxpbmVgXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluZGVudFRvQ2hlY2sgPSBjdXJyZW50TGlzdC5nZXROb3Rlc0luZGVudCgpIHx8IGN1cnJlbnRJbmRlbnQ7XG5cbiAgICAgICAgaWYgKGxpbmUuaW5kZXhPZihpbmRlbnRUb0NoZWNrKSAhPT0gMCkge1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkID0gaW5kZW50VG9DaGVjay5yZXBsYWNlKC8gL2csIFwiU1wiKS5yZXBsYWNlKC9cXHQvZywgXCJUXCIpO1xuICAgICAgICAgIGNvbnN0IGdvdCA9IGxpbmVcbiAgICAgICAgICAgIC5tYXRjaCgvXlsgXFx0XSovKVswXVxuICAgICAgICAgICAgLnJlcGxhY2UoLyAvZywgXCJTXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx0L2csIFwiVFwiKTtcblxuICAgICAgICAgIHJldHVybiBlcnJvcihcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcGFyc2UgbGlzdDogZXhwZWN0ZWQgaW5kZW50IFwiJHtleHBlY3RlZH1cIiwgZ290IFwiJHtnb3R9XCJgXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY3VycmVudExpc3QuZ2V0Tm90ZXNJbmRlbnQoKSkge1xuICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSBsaW5lLm1hdGNoKC9eWyBcXHRdKy8pO1xuXG4gICAgICAgICAgaWYgKCFtYXRjaGVzIHx8IG1hdGNoZXNbMF0ubGVuZ3RoIDw9IGN1cnJlbnRJbmRlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoL15cXHMrJC8udGVzdChsaW5lKSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgICAgICBgVW5hYmxlIHRvIHBhcnNlIGxpc3Q6IGV4cGVjdGVkIHNvbWUgaW5kZW50LCBnb3Qgbm8gaW5kZW50YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjdXJyZW50TGlzdC5zZXROb3Rlc0luZGVudChtYXRjaGVzWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRMaXN0LmFkZExpbmUobGluZS5zbGljZShjdXJyZW50TGlzdC5nZXROb3Rlc0luZGVudCgpLmxlbmd0aCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgIGBVbmFibGUgdG8gcGFyc2UgbGlzdDogZXhwZWN0ZWQgbGlzdCBpdGVtIG9yIG5vdGUsIGdvdCBcIiR7bGluZX1cImBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIHByaXZhdGUgaXNFbXB0eUxpbmUobGluZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGxpbmUubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0xpbmVXaXRoSW5kZW50KGxpbmU6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmdXaXRoU3BhY2VzUmUudGVzdChsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNMaXN0SXRlbShsaW5lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbGlzdEl0ZW1SZS50ZXN0KGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0xpc3RJdGVtV2l0aG91dFNwYWNlcyhsaW5lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbGlzdEl0ZW1XaXRob3V0U3BhY2VzUmUudGVzdChsaW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXBwbHlDaGFuZ2VzU2VydmljZSB9IGZyb20gXCIuL0FwcGx5Q2hhbmdlc1NlcnZpY2VcIjtcbmltcG9ydCB7IFBhcnNlclNlcnZpY2UgfSBmcm9tIFwiLi9QYXJzZXJTZXJ2aWNlXCI7XG5cbmltcG9ydCB7IE15RWRpdG9yIH0gZnJvbSBcIi4uL015RWRpdG9yXCI7XG5pbXBvcnQgeyBPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9PcGVyYXRpb25cIjtcbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuXG5leHBvcnQgY2xhc3MgUGVyZm9ybU9wZXJhdGlvblNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBhcnNlcjogUGFyc2VyU2VydmljZSxcbiAgICBwcml2YXRlIGFwcGx5Q2hhbmdlczogQXBwbHlDaGFuZ2VzU2VydmljZVxuICApIHt9XG5cbiAgZXZhbE9wZXJhdGlvbihyb290OiBSb290LCBvcDogT3BlcmF0aW9uLCBlZGl0b3I6IE15RWRpdG9yKSB7XG4gICAgb3AucGVyZm9ybSgpO1xuXG4gICAgaWYgKG9wLnNob3VsZFVwZGF0ZSgpKSB7XG4gICAgICB0aGlzLmFwcGx5Q2hhbmdlcy5hcHBseUNoYW5nZXMoZWRpdG9yLCByb290KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2hvdWxkVXBkYXRlOiBvcC5zaG91bGRVcGRhdGUoKSxcbiAgICAgIHNob3VsZFN0b3BQcm9wYWdhdGlvbjogb3Auc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCksXG4gICAgfTtcbiAgfVxuXG4gIHBlcmZvcm1PcGVyYXRpb24oXG4gICAgY2I6IChyb290OiBSb290KSA9PiBPcGVyYXRpb24sXG4gICAgZWRpdG9yOiBNeUVkaXRvcixcbiAgICBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKClcbiAgKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMucGFyc2VyLnBhcnNlKGVkaXRvciwgY3Vyc29yKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuIHsgc2hvdWxkVXBkYXRlOiBmYWxzZSwgc2hvdWxkU3RvcFByb3BhZ2F0aW9uOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIGNvbnN0IG9wID0gY2Iocm9vdCk7XG5cbiAgICByZXR1cm4gdGhpcy5ldmFsT3BlcmF0aW9uKHJvb3QsIG9wLCBlZGl0b3IpO1xuICB9XG59XG4iLCJleHBvcnQgdHlwZSBMaXN0TGluZUFjdGlvbiA9IFwibm9uZVwiIHwgXCJ6b29tLWluXCIgfCBcInRvZ2dsZS1mb2xkaW5nXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzIHtcbiAgc3R5bGVMaXN0czogYm9vbGVhbjtcbiAgZGVidWc6IGJvb2xlYW47XG4gIHN0aWNrQ3Vyc29yOiBib29sZWFuO1xuICBiZXR0ZXJFbnRlcjogYm9vbGVhbjtcbiAgYmV0dGVyVGFiOiBib29sZWFuO1xuICBzZWxlY3RBbGw6IGJvb2xlYW47XG4gIGxpc3RMaW5lczogYm9vbGVhbjtcbiAgbGlzdExpbmVBY3Rpb246IExpc3RMaW5lQWN0aW9uO1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3MgPSB7XG4gIHN0eWxlTGlzdHM6IHRydWUsXG4gIGRlYnVnOiBmYWxzZSxcbiAgc3RpY2tDdXJzb3I6IHRydWUsXG4gIGJldHRlckVudGVyOiB0cnVlLFxuICBiZXR0ZXJUYWI6IHRydWUsXG4gIHNlbGVjdEFsbDogdHJ1ZSxcbiAgbGlzdExpbmVzOiB0cnVlLFxuICBsaXN0TGluZUFjdGlvbjogXCJ0b2dnbGUtZm9sZGluZ1wiLFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBTdG9yYWdlIHtcbiAgbG9hZERhdGEoKTogUHJvbWlzZTxPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3M+O1xuICBzYXZlRGF0YShzZXR0aWduczogT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzKTogUHJvbWlzZTx2b2lkPjtcbn1cblxudHlwZSBLID0ga2V5b2YgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzO1xudHlwZSBDYWxsYmFjazxUIGV4dGVuZHMgSz4gPSAoY2I6IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5nc1tUXSkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzU2VydmljZSBpbXBsZW1lbnRzIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyB7XG4gIHByaXZhdGUgc3RvcmFnZTogU3RvcmFnZTtcbiAgcHJpdmF0ZSB2YWx1ZXM6IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncztcbiAgcHJpdmF0ZSBoYW5kbGVyczogTWFwPEssIFNldDxDYWxsYmFjazxLPj4+O1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JhZ2U6IFN0b3JhZ2UpIHtcbiAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICAgIHRoaXMuaGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBnZXQgc3R5bGVMaXN0cygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuc3R5bGVMaXN0cztcbiAgfVxuICBzZXQgc3R5bGVMaXN0cyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwic3R5bGVMaXN0c1wiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLmRlYnVnO1xuICB9XG4gIHNldCBkZWJ1Zyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwiZGVidWdcIiwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IHN0aWNrQ3Vyc29yKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5zdGlja0N1cnNvcjtcbiAgfVxuICBzZXQgc3RpY2tDdXJzb3IodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldChcInN0aWNrQ3Vyc29yXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBiZXR0ZXJFbnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuYmV0dGVyRW50ZXI7XG4gIH1cbiAgc2V0IGJldHRlckVudGVyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJiZXR0ZXJFbnRlclwiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgYmV0dGVyVGFiKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5iZXR0ZXJUYWI7XG4gIH1cbiAgc2V0IGJldHRlclRhYih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwiYmV0dGVyVGFiXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzZWxlY3RBbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLnNlbGVjdEFsbDtcbiAgfVxuICBzZXQgc2VsZWN0QWxsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJzZWxlY3RBbGxcIiwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IGxpc3RMaW5lcygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMubGlzdExpbmVzO1xuICB9XG4gIHNldCBsaXN0TGluZXModmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldChcImxpc3RMaW5lc1wiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgbGlzdExpbmVBY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLmxpc3RMaW5lQWN0aW9uO1xuICB9XG4gIHNldCBsaXN0TGluZUFjdGlvbih2YWx1ZTogTGlzdExpbmVBY3Rpb24pIHtcbiAgICB0aGlzLnNldChcImxpc3RMaW5lQWN0aW9uXCIsIHZhbHVlKTtcbiAgfVxuXG4gIG9uQ2hhbmdlPFQgZXh0ZW5kcyBLPihrZXk6IFQsIGNiOiBDYWxsYmFjazxUPikge1xuICAgIGlmICghdGhpcy5oYW5kbGVycy5oYXMoa2V5KSkge1xuICAgICAgdGhpcy5oYW5kbGVycy5zZXQoa2V5LCBuZXcgU2V0KCkpO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlcnMuZ2V0KGtleSkuYWRkKGNiKTtcbiAgfVxuXG4gIHJlbW92ZUNhbGxiYWNrPFQgZXh0ZW5kcyBLPihrZXk6IFQsIGNiOiBDYWxsYmFjazxUPik6IHZvaWQge1xuICAgIGNvbnN0IGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycy5nZXQoa2V5KTtcblxuICAgIGlmIChoYW5kbGVycykge1xuICAgICAgaGFuZGxlcnMuZGVsZXRlKGNiKTtcbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhERUZBVUxUX1NFVFRJTkdTKSkge1xuICAgICAgdGhpcy5zZXQoayBhcyBrZXlvZiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3MsIHYpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy52YWx1ZXMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICBERUZBVUxUX1NFVFRJTkdTLFxuICAgICAgYXdhaXQgdGhpcy5zdG9yYWdlLmxvYWREYXRhKClcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgc2F2ZSgpIHtcbiAgICBhd2FpdCB0aGlzLnN0b3JhZ2Uuc2F2ZURhdGEodGhpcy52YWx1ZXMpO1xuICB9XG5cbiAgc2V0PFQgZXh0ZW5kcyBLPihrZXk6IFQsIHZhbHVlOiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3NbVF0pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlc1trZXldID0gdmFsdWU7XG4gICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5oYW5kbGVycy5nZXQoa2V5KTtcblxuICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjYiBvZiBjYWxsYmFja3MudmFsdWVzKCkpIHtcbiAgICAgIGNiKHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE5vdGljZSwgUGx1Z2luIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IERlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRGVsZXRlU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmVcIjtcbmltcG9ydCB7IEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudEZlYXR1cmVcIjtcbmltcG9ydCB7IEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmVcIjtcbmltcG9ydCB7IEVudGVyU2hvdWxkQ3JlYXRlTmV3SXRlbUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9FbnRlclNob3VsZENyZWF0ZU5ld0l0ZW1PbkNoaWxkTGV2ZWxGZWF0dXJlXCI7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRmVhdHVyZVwiO1xuaW1wb3J0IHsgRm9sZEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9Gb2xkRmVhdHVyZVwiO1xuaW1wb3J0IHsgTGluZXNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvTGluZXNGZWF0dXJlXCI7XG5pbXBvcnQgeyBMaXN0c1N0eWxlc0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9MaXN0c1N0eWxlc0ZlYXR1cmVcIjtcbmltcG9ydCB7IE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL01vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZVwiO1xuaW1wb3J0IHsgTW92ZUl0ZW1zRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL01vdmVJdGVtc0ZlYXR1cmVcIjtcbmltcG9ydCB7IFNlbGVjdEFsbEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9TZWxlY3RBbGxGZWF0dXJlXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25TaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL1NlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlXCI7XG5pbXBvcnQgeyBTZXR0aW5nc1RhYkZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9TZXR0aW5nc1RhYkZlYXR1cmVcIjtcbmltcG9ydCB7IFNoaWZ0RW50ZXJTaG91bGRDcmVhdGVOb3RlRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL1NoaWZ0RW50ZXJTaG91bGRDcmVhdGVOb3RlRmVhdHVyZVwiO1xuaW1wb3J0IHsgQXBwbHlDaGFuZ2VzU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL0FwcGx5Q2hhbmdlc1NlcnZpY2VcIjtcbmltcG9ydCB7IElNRVNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9JTUVTZXJ2aWNlXCI7XG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvTG9nZ2VyU2VydmljZVwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvT2JzaWRpYW5TZXJ2aWNlXCI7XG5pbXBvcnQgeyBQYXJzZXJTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvUGFyc2VyU2VydmljZVwiO1xuaW1wb3J0IHsgUGVyZm9ybU9wZXJhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9QZXJmb3JtT3BlcmF0aW9uU2VydmljZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9ic2lkaWFuT3V0bGluZXJQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBwcml2YXRlIGZlYXR1cmVzOiBGZWF0dXJlW107XG4gIHByb3RlY3RlZCBzZXR0aW5nczogU2V0dGluZ3NTZXJ2aWNlO1xuICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSBvYnNpZGlhbjogT2JzaWRpYW5TZXJ2aWNlO1xuICBwcml2YXRlIHBhcnNlcjogUGFyc2VyU2VydmljZTtcbiAgcHJpdmF0ZSBhcHBseUNoYW5nZXM6IEFwcGx5Q2hhbmdlc1NlcnZpY2U7XG4gIHByaXZhdGUgcGVyZm9ybU9wZXJhdGlvbjogUGVyZm9ybU9wZXJhdGlvblNlcnZpY2U7XG4gIHByaXZhdGUgaW1lOiBJTUVTZXJ2aWNlO1xuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBjb25zb2xlLmxvZyhgTG9hZGluZyBvYnNpZGlhbi1vdXRsaW5lcmApO1xuXG4gICAgdGhpcy5vYnNpZGlhbiA9IG5ldyBPYnNpZGlhblNlcnZpY2UodGhpcy5hcHApO1xuXG4gICAgaWYgKHRoaXMub2JzaWRpYW4uaXNMZWdhY3lFZGl0b3JFbmFibGVkKCkpIHtcbiAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgIGBPdXRsaW5lciBwbHVnaW4gZG9lcyBub3Qgc3VwcG9ydCBsZWdhY3kgZWRpdG9yIG1vZGUgc3RhcnRpbmcgZnJvbSB2ZXJzaW9uIDIuMC4gUGxlYXNlIGRpc2FibGUgdGhlIFwiVXNlIGxlZ2FjeSBlZGl0b3JcIiBvcHRpb24gb3IgbWFudWFsbHkgaW5zdGFsbCB2ZXJzaW9uIDEuMCBvZiBPdXRsaW5lciBwbHVnaW4uYCxcbiAgICAgICAgMzAwMDBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZXR0aW5ncyA9IG5ldyBTZXR0aW5nc1NlcnZpY2UodGhpcyk7XG4gICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5sb2FkKCk7XG5cbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXJTZXJ2aWNlKHRoaXMuc2V0dGluZ3MpO1xuXG4gICAgdGhpcy5wYXJzZXIgPSBuZXcgUGFyc2VyU2VydmljZSh0aGlzLmxvZ2dlcik7XG4gICAgdGhpcy5hcHBseUNoYW5nZXMgPSBuZXcgQXBwbHlDaGFuZ2VzU2VydmljZSgpO1xuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbiA9IG5ldyBQZXJmb3JtT3BlcmF0aW9uU2VydmljZShcbiAgICAgIHRoaXMucGFyc2VyLFxuICAgICAgdGhpcy5hcHBseUNoYW5nZXNcbiAgICApO1xuXG4gICAgdGhpcy5pbWUgPSBuZXcgSU1FU2VydmljZSgpO1xuICAgIGF3YWl0IHRoaXMuaW1lLmxvYWQoKTtcblxuICAgIHRoaXMuZmVhdHVyZXMgPSBbXG4gICAgICBuZXcgU2V0dGluZ3NUYWJGZWF0dXJlKHRoaXMsIHRoaXMuc2V0dGluZ3MpLFxuICAgICAgbmV3IExpc3RzU3R5bGVzRmVhdHVyZSh0aGlzLnNldHRpbmdzLCB0aGlzLm9ic2lkaWFuKSxcbiAgICAgIG5ldyBFbnRlck91dGRlbnRJZkxpbmVJc0VtcHR5RmVhdHVyZShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcbiAgICAgICAgdGhpcy5pbWUsXG4gICAgICAgIHRoaXMub2JzaWRpYW4sXG4gICAgICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvblxuICAgICAgKSxcbiAgICAgIG5ldyBFbnRlclNob3VsZENyZWF0ZU5ld0l0ZW1GZWF0dXJlKFxuICAgICAgICB0aGlzLFxuICAgICAgICB0aGlzLnNldHRpbmdzLFxuICAgICAgICB0aGlzLmltZSxcbiAgICAgICAgdGhpcy5vYnNpZGlhbixcbiAgICAgICAgdGhpcy5wZXJmb3JtT3BlcmF0aW9uXG4gICAgICApLFxuICAgICAgbmV3IEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlKFxuICAgICAgICB0aGlzLFxuICAgICAgICB0aGlzLnNldHRpbmdzLFxuICAgICAgICB0aGlzLm9ic2lkaWFuLFxuICAgICAgICB0aGlzLnBlcmZvcm1PcGVyYXRpb25cbiAgICAgICksXG4gICAgICBuZXcgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlKFxuICAgICAgICB0aGlzLFxuICAgICAgICB0aGlzLnNldHRpbmdzLFxuICAgICAgICB0aGlzLmltZSxcbiAgICAgICAgdGhpcy5vYnNpZGlhbixcbiAgICAgICAgdGhpcy5wZXJmb3JtT3BlcmF0aW9uXG4gICAgICApLFxuICAgICAgbmV3IERlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlKFxuICAgICAgICB0aGlzLFxuICAgICAgICB0aGlzLnNldHRpbmdzLFxuICAgICAgICB0aGlzLmltZSxcbiAgICAgICAgdGhpcy5vYnNpZGlhbixcbiAgICAgICAgdGhpcy5wZXJmb3JtT3BlcmF0aW9uXG4gICAgICApLFxuICAgICAgbmV3IFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlKFxuICAgICAgICB0aGlzLFxuICAgICAgICB0aGlzLnNldHRpbmdzLFxuICAgICAgICB0aGlzLmltZSxcbiAgICAgICAgdGhpcy5vYnNpZGlhbixcbiAgICAgICAgdGhpcy5wZXJmb3JtT3BlcmF0aW9uXG4gICAgICApLFxuICAgICAgbmV3IEZvbGRGZWF0dXJlKHRoaXMsIHRoaXMub2JzaWRpYW4pLFxuICAgICAgbmV3IFNlbGVjdEFsbEZlYXR1cmUoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIHRoaXMuc2V0dGluZ3MsXG4gICAgICAgIHRoaXMuaW1lLFxuICAgICAgICB0aGlzLm9ic2lkaWFuLFxuICAgICAgICB0aGlzLnBlcmZvcm1PcGVyYXRpb25cbiAgICAgICksXG4gICAgICBuZXcgTW92ZUl0ZW1zRmVhdHVyZShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGhpcy5pbWUsXG4gICAgICAgIHRoaXMub2JzaWRpYW4sXG4gICAgICAgIHRoaXMuc2V0dGluZ3MsXG4gICAgICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvblxuICAgICAgKSxcbiAgICAgIG5ldyBTaGlmdEVudGVyU2hvdWxkQ3JlYXRlTm90ZUZlYXR1cmUoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIHRoaXMub2JzaWRpYW4sXG4gICAgICAgIHRoaXMuc2V0dGluZ3MsXG4gICAgICAgIHRoaXMuaW1lLFxuICAgICAgICB0aGlzLnBlcmZvcm1PcGVyYXRpb25cbiAgICAgICksXG4gICAgICBuZXcgTGluZXNGZWF0dXJlKHRoaXMsIHRoaXMuc2V0dGluZ3MsIHRoaXMub2JzaWRpYW4sIHRoaXMucGFyc2VyKSxcbiAgICBdO1xuXG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIHRoaXMuZmVhdHVyZXMpIHtcbiAgICAgIGF3YWl0IGZlYXR1cmUubG9hZCgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9udW5sb2FkKCkge1xuICAgIGNvbnNvbGUubG9nKGBVbmxvYWRpbmcgb2JzaWRpYW4tb3V0bGluZXJgKTtcblxuICAgIGF3YWl0IHRoaXMuaW1lLnVubG9hZCgpO1xuXG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIHRoaXMuZmVhdHVyZXMpIHtcbiAgICAgIGF3YWl0IGZlYXR1cmUudW5sb2FkKCk7XG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOlsia2V5bWFwIiwiRWRpdG9yU3RhdGUiLCJQcmVjIiwiTm90aWNlIiwiZm9sZGVkUmFuZ2VzIiwiZm9sZGFibGUiLCJmb2xkRWZmZWN0IiwidW5mb2xkRWZmZWN0IiwicnVuU2NvcGVIYW5kbGVycyIsIm9ic2lkaWFuIiwiZWRpdG9yVmlld0ZpZWxkIiwiVmlld1BsdWdpbiIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMs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Q0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQy9CO0FBRUQsSUFBQSxJQUFJLEtBQUssR0FBQTtBQUNQLFFBQUEsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUMxQjtJQUNELElBQUksS0FBSyxDQUFDLEtBQWMsRUFBQTtBQUN0QixRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzFCO0FBRUQsSUFBQSxJQUFJLFdBQVcsR0FBQTtBQUNiLFFBQUEsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztLQUNoQztJQUNELElBQUksV0FBVyxDQUFDLEtBQWMsRUFBQTtBQUM1QixRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ2hDO0FBRUQsSUFBQSxJQUFJLFdBQVcsR0FBQTtBQUNiLFFBQUEsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztLQUNoQztJQUNELElBQUksV0FBVyxDQUFDLEtBQWMsRUFBQTtBQUM1QixRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ2hDO0FBRUQsSUFBQSxJQUFJLFNBQVMsR0FBQTtBQUNYLFFBQUEsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztLQUM5QjtJQUNELElBQUksU0FBUyxDQUFDLEtBQWMsRUFBQTtBQUMxQixRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzlCO0FBRUQsSUFBQSxJQUFJLFNBQVMsR0FBQTtBQUNYLFFBQUEsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztLQUM5QjtJQUNELElBQUksU0FBUyxDQUFDLEtBQWMsRUFBQTtBQUMxQixRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzlCO0FBRUQsSUFBQSxJQUFJ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

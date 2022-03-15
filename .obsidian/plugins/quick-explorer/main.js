'use strict';

var obsidian = require('obsidian');

function parseQuery (query) {
  var chunks = query.split(/([#.])/);
  var tagName = '';
  var id = '';
  var classNames = [];

  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    if (chunk === '#') {
      id = chunks[++i];
    } else if (chunk === '.') {
      classNames.push(chunks[++i]);
    } else if (chunk.length) {
      tagName = chunk;
    }
  }

  return {
    tag: tagName || 'div',
    id: id,
    className: classNames.join(' ')
  };
}

function createElement (query, ns) {
  var ref = parseQuery(query);
  var tag = ref.tag;
  var id = ref.id;
  var className = ref.className;
  var element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);

  if (id) {
    element.id = id;
  }

  if (className) {
    if (ns) {
      element.setAttribute('class', className);
    } else {
      element.className = className;
    }
  }

  return element;
}

function unmount (parent, child) {
  var parentEl = getEl(parent);
  var childEl = getEl(child);

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (childEl.parentNode) {
    doUnmount(child, childEl, parentEl);

    parentEl.removeChild(childEl);
  }

  return child;
}

function doUnmount (child, childEl, parentEl) {
  var hooks = childEl.__redom_lifecycle;

  if (hooksAreEmpty(hooks)) {
    childEl.__redom_lifecycle = {};
    return;
  }

  var traverse = parentEl;

  if (childEl.__redom_mounted) {
    trigger(childEl, 'onunmount');
  }

  while (traverse) {
    var parentHooks = traverse.__redom_lifecycle || {};

    for (var hook in hooks) {
      if (parentHooks[hook]) {
        parentHooks[hook] -= hooks[hook];
      }
    }

    if (hooksAreEmpty(parentHooks)) {
      traverse.__redom_lifecycle = null;
    }

    traverse = traverse.parentNode;
  }
}

function hooksAreEmpty (hooks) {
  if (hooks == null) {
    return true;
  }
  for (var key in hooks) {
    if (hooks[key]) {
      return false;
    }
  }
  return true;
}

/* global Node, ShadowRoot */

var hookNames = ['onmount', 'onremount', 'onunmount'];
var shadowRootAvailable = typeof window !== 'undefined' && 'ShadowRoot' in window;

function mount (parent, child, before, replace) {
  var parentEl = getEl(parent);
  var childEl = getEl(child);

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (child !== childEl) {
    childEl.__redom_view = child;
  }

  var wasMounted = childEl.__redom_mounted;
  var oldParent = childEl.parentNode;

  if (wasMounted && (oldParent !== parentEl)) {
    doUnmount(child, childEl, oldParent);
  }

  if (before != null) {
    if (replace) {
      parentEl.replaceChild(childEl, getEl(before));
    } else {
      parentEl.insertBefore(childEl, getEl(before));
    }
  } else {
    parentEl.appendChild(childEl);
  }

  doMount(child, childEl, parentEl, oldParent);

  return child;
}

function trigger (el, eventName) {
  if (eventName === 'onmount' || eventName === 'onremount') {
    el.__redom_mounted = true;
  } else if (eventName === 'onunmount') {
    el.__redom_mounted = false;
  }

  var hooks = el.__redom_lifecycle;

  if (!hooks) {
    return;
  }

  var view = el.__redom_view;
  var hookCount = 0;

  view && view[eventName] && view[eventName]();

  for (var hook in hooks) {
    if (hook) {
      hookCount++;
    }
  }

  if (hookCount) {
    var traverse = el.firstChild;

    while (traverse) {
      var next = traverse.nextSibling;

      trigger(traverse, eventName);

      traverse = next;
    }
  }
}

function doMount (child, childEl, parentEl, oldParent) {
  var hooks = childEl.__redom_lifecycle || (childEl.__redom_lifecycle = {});
  var remount = (parentEl === oldParent);
  var hooksFound = false;

  for (var i = 0, list = hookNames; i < list.length; i += 1) {
    var hookName = list[i];

    if (!remount) { // if already mounted, skip this phase
      if (child !== childEl) { // only Views can have lifecycle events
        if (hookName in child) {
          hooks[hookName] = (hooks[hookName] || 0) + 1;
        }
      }
    }
    if (hooks[hookName]) {
      hooksFound = true;
    }
  }

  if (!hooksFound) {
    childEl.__redom_lifecycle = {};
    return;
  }

  var traverse = parentEl;
  var triggered = false;

  if (remount || (traverse && traverse.__redom_mounted)) {
    trigger(childEl, remount ? 'onremount' : 'onmount');
    triggered = true;
  }

  while (traverse) {
    var parent = traverse.parentNode;
    var parentHooks = traverse.__redom_lifecycle || (traverse.__redom_lifecycle = {});

    for (var hook in hooks) {
      parentHooks[hook] = (parentHooks[hook] || 0) + hooks[hook];
    }

    if (triggered) {
      break;
    } else {
      if (traverse.nodeType === Node.DOCUMENT_NODE ||
        (shadowRootAvailable && (traverse instanceof ShadowRoot)) ||
        (parent && parent.__redom_mounted)
      ) {
        trigger(traverse, remount ? 'onremount' : 'onmount');
        triggered = true;
      }
      traverse = parent;
    }
  }
}

function setStyle (view, arg1, arg2) {
  var el = getEl(view);

  if (typeof arg1 === 'object') {
    for (var key in arg1) {
      setStyleValue(el, key, arg1[key]);
    }
  } else {
    setStyleValue(el, arg1, arg2);
  }
}

function setStyleValue (el, key, value) {
  if (value == null) {
    el.style[key] = '';
  } else {
    el.style[key] = value;
  }
}

/* global SVGElement */

var xlinkns = 'http://www.w3.org/1999/xlink';

function setAttrInternal (view, arg1, arg2, initial) {
  var el = getEl(view);

  var isObj = typeof arg1 === 'object';

  if (isObj) {
    for (var key in arg1) {
      setAttrInternal(el, key, arg1[key], initial);
    }
  } else {
    var isSVG = el instanceof SVGElement;
    var isFunc = typeof arg2 === 'function';

    if (arg1 === 'style' && typeof arg2 === 'object') {
      setStyle(el, arg2);
    } else if (isSVG && isFunc) {
      el[arg1] = arg2;
    } else if (arg1 === 'dataset') {
      setData(el, arg2);
    } else if (!isSVG && (arg1 in el || isFunc) && (arg1 !== 'list')) {
      el[arg1] = arg2;
    } else {
      if (isSVG && (arg1 === 'xlink')) {
        setXlink(el, arg2);
        return;
      }
      if (initial && arg1 === 'class') {
        arg2 = el.className + ' ' + arg2;
      }
      if (arg2 == null) {
        el.removeAttribute(arg1);
      } else {
        el.setAttribute(arg1, arg2);
      }
    }
  }
}

function setXlink (el, arg1, arg2) {
  if (typeof arg1 === 'object') {
    for (var key in arg1) {
      setXlink(el, key, arg1[key]);
    }
  } else {
    if (arg2 != null) {
      el.setAttributeNS(xlinkns, arg1, arg2);
    } else {
      el.removeAttributeNS(xlinkns, arg1, arg2);
    }
  }
}

function setData (el, arg1, arg2) {
  if (typeof arg1 === 'object') {
    for (var key in arg1) {
      setData(el, key, arg1[key]);
    }
  } else {
    if (arg2 != null) {
      el.dataset[arg1] = arg2;
    } else {
      delete el.dataset[arg1];
    }
  }
}

function text (str) {
  return document.createTextNode((str != null) ? str : '');
}

function parseArgumentsInternal (element, args, initial) {
  for (var i = 0, list = args; i < list.length; i += 1) {
    var arg = list[i];

    if (arg !== 0 && !arg) {
      continue;
    }

    var type = typeof arg;

    if (type === 'function') {
      arg(element);
    } else if (type === 'string' || type === 'number') {
      element.appendChild(text(arg));
    } else if (isNode(getEl(arg))) {
      mount(element, arg);
    } else if (arg.length) {
      parseArgumentsInternal(element, arg, initial);
    } else if (type === 'object') {
      setAttrInternal(element, arg, null, initial);
    }
  }
}

function ensureEl (parent) {
  return typeof parent === 'string' ? html(parent) : getEl(parent);
}

function getEl (parent) {
  return (parent.nodeType && parent) || (!parent.el && parent) || getEl(parent.el);
}

function isNode (arg) {
  return arg && arg.nodeType;
}

var htmlCache = {};

function html (query) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var element;

  var type = typeof query;

  if (type === 'string') {
    element = memoizeHTML(query).cloneNode(false);
  } else if (isNode(query)) {
    element = query.cloneNode(false);
  } else if (type === 'function') {
    var Query = query;
    element = new (Function.prototype.bind.apply( Query, [ null ].concat( args) ));
  } else {
    throw new Error('At least one argument required');
  }

  parseArgumentsInternal(getEl(element), args, true);

  return element;
}

var el = html;

html.extend = function extendHtml (query) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var clone = memoizeHTML(query);

  return html.bind.apply(html, [ this, clone ].concat( args ));
};

function memoizeHTML (query) {
  return htmlCache[query] || (htmlCache[query] = createElement(query));
}

function setChildren (parent) {
  var children = [], len = arguments.length - 1;
  while ( len-- > 0 ) children[ len ] = arguments[ len + 1 ];

  var parentEl = getEl(parent);
  var current = traverse(parent, children, parentEl.firstChild);

  while (current) {
    var next = current.nextSibling;

    unmount(parent, current);

    current = next;
  }
}

function traverse (parent, children, _current) {
  var current = _current;

  var childEls = new Array(children.length);

  for (var i = 0; i < children.length; i++) {
    childEls[i] = children[i] && getEl(children[i]);
  }

  for (var i$1 = 0; i$1 < children.length; i$1++) {
    var child = children[i$1];

    if (!child) {
      continue;
    }

    var childEl = childEls[i$1];

    if (childEl === current) {
      current = current.nextSibling;
      continue;
    }

    if (isNode(childEl)) {
      var next = current && current.nextSibling;
      var exists = child.__redom_index != null;
      var replace = exists && next === childEls[i$1 + 1];

      mount(parent, child, current, replace);

      if (replace) {
        current = next;
      }

      continue;
    }

    if (child.length != null) {
      current = traverse(parent, child, current);
    }
  }

  return current;
}

var ListPool = function ListPool (View, key, initData) {
  this.View = View;
  this.initData = initData;
  this.oldLookup = {};
  this.lookup = {};
  this.oldViews = [];
  this.views = [];

  if (key != null) {
    this.key = typeof key === 'function' ? key : propKey(key);
  }
};

ListPool.prototype.update = function update (data, context) {
  var ref = this;
    var View = ref.View;
    var key = ref.key;
    var initData = ref.initData;
  var keySet = key != null;

  var oldLookup = this.lookup;
  var newLookup = {};

  var newViews = new Array(data.length);
  var oldViews = this.views;

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var view = (void 0);

    if (keySet) {
      var id = key(item);

      view = oldLookup[id] || new View(initData, item, i, data);
      newLookup[id] = view;
      view.__redom_id = id;
    } else {
      view = oldViews[i] || new View(initData, item, i, data);
    }
    view.update && view.update(item, i, data, context);

    var el = getEl(view.el);

    el.__redom_view = view;
    newViews[i] = view;
  }

  this.oldViews = oldViews;
  this.views = newViews;

  this.oldLookup = oldLookup;
  this.lookup = newLookup;
};

function propKey (key) {
  return function (item) {
    return item[key];
  };
}

function list (parent, View, key, initData) {
  return new List(parent, View, key, initData);
}

var List = function List (parent, View, key, initData) {
  this.View = View;
  this.initData = initData;
  this.views = [];
  this.pool = new ListPool(View, key, initData);
  this.el = ensureEl(parent);
  this.keySet = key != null;
};

List.prototype.update = function update (data, context) {
    if ( data === void 0 ) data = [];

  var ref = this;
    var keySet = ref.keySet;
  var oldViews = this.views;

  this.pool.update(data, context);

  var ref$1 = this.pool;
    var views = ref$1.views;
    var lookup = ref$1.lookup;

  if (keySet) {
    for (var i = 0; i < oldViews.length; i++) {
      var oldView = oldViews[i];
      var id = oldView.__redom_id;

      if (lookup[id] == null) {
        oldView.__redom_index = null;
        unmount(this, oldView);
      }
    }
  }

  for (var i$1 = 0; i$1 < views.length; i$1++) {
    var view = views[i$1];

    view.__redom_index = i$1;
  }

  setChildren(this, views);

  if (keySet) {
    this.lookup = lookup;
  }
  this.views = views;
};

List.extend = function extendList (parent, View, key, initData) {
  return List.bind(List, parent, View, key, initData);
};

list.extend = List.extend;

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

class PopupMenu extends obsidian.Menu {
    constructor(parent) {
        super(parent instanceof obsidian.App ? parent : parent.app);
        this.parent = parent;
        this.match = "";
        this.resetSearchOnTimeout = obsidian.debounce(() => { this.match = ""; }, 1500, true);
        this.visible = false;
        this.firstMove = false;
        if (parent instanceof PopupMenu)
            parent.setChildMenu(this);
        this.scope = new obsidian.Scope;
        this.scope.register([], "ArrowUp", this.onArrowUp.bind(this));
        this.scope.register([], "ArrowDown", this.onArrowDown.bind(this));
        this.scope.register([], "Enter", this.onEnter.bind(this));
        this.scope.register([], "Escape", this.onEscape.bind(this));
        this.scope.register([], "ArrowLeft", this.onArrowLeft.bind(this));
        this.scope.register([], "Home", this.onHome.bind(this));
        this.scope.register([], "End", this.onEnd.bind(this));
        this.scope.register([], "ArrowRight", this.onArrowRight.bind(this));
        // Make obsidian.Menu think mousedowns on our child menu(s) are happening
        // on us, so we won't close before an actual click occurs
        const menu = this;
        around(this.dom, { contains(prev) {
                return function (target) {
                    const ret = prev.call(this, target) || menu.child?.dom.contains(target);
                    return ret;
                };
            } });
        this.dom.addClass("qe-popup-menu");
    }
    onEscape() {
        this.hide();
        return false;
    }
    onload() {
        this.scope.register(null, null, this.onKeyDown.bind(this));
        super.onload();
        this.visible = true;
        this.showSelected();
        this.firstMove = true;
        // We wait until now to register so that any initial mouseover of the old mouse position will be skipped
        this.register(onElement(this.dom, "mouseover", ".menu-item", (event, target) => {
            if (!this.firstMove && !target.hasClass("is-disabled") && !this.child) {
                this.select(this.items.findIndex(i => i.dom === target), false);
            }
            this.firstMove = false;
        }));
    }
    onunload() {
        this.visible = false;
        super.onunload();
    }
    // Override to avoid having a mouseover event handler
    addItem(cb) {
        const i = new obsidian.MenuItem(this);
        this.items.push(i);
        cb(i);
        return this;
    }
    onKeyDown(event) {
        const mod = obsidian.Keymap.getModifiers(event);
        if (event.key.length === 1 && !event.isComposing && (!mod || mod === "Shift")) {
            let match = this.match + event.key;
            // Throw away pieces of the match until something matches or nothing's left
            while (match && !this.searchFor(match))
                match = match.substr(1);
            this.match = match;
            this.resetSearchOnTimeout();
        }
        return false; // block all keys other than ours
    }
    searchFor(match) {
        const parts = match.split("").map(escapeRegex);
        return (this.find(new RegExp("^" + parts.join(""), "ui")) ||
            this.find(new RegExp("^" + parts.join(".*"), "ui")) ||
            this.find(new RegExp(parts.join(".*"), "ui")));
    }
    find(pattern) {
        let pos = Math.min(0, this.selected);
        for (let i = this.items.length; i; ++pos, i--) {
            if (this.items[pos]?.disabled)
                continue;
            if (this.items[pos]?.dom.textContent.match(pattern)) {
                this.select(pos);
                return true;
            }
        }
        return false;
    }
    onEnter(event) {
        const item = this.items[this.selected];
        if (item) {
            item.handleEvent(event);
            // Only hide if we don't have a submenu
            if (!this.child)
                this.hide();
        }
        return false;
    }
    select(n, scroll = true) {
        this.match = ""; // reset search on move
        super.select(n);
        if (scroll)
            this.showSelected();
    }
    showSelected() {
        const el = this.items[this.selected]?.dom;
        if (el) {
            const me = this.dom.getBoundingClientRect(), my = el.getBoundingClientRect();
            if (my.top < me.top || my.bottom > me.bottom)
                el.scrollIntoView();
        }
    }
    unselect() {
        this.items[this.selected]?.dom.removeClass("selected");
    }
    onEnd(e) {
        this.unselect();
        this.selected = this.items.length;
        this.onArrowUp(e);
        if (this.selected === this.items.length)
            this.selected = -1;
        return false;
    }
    onHome(e) {
        this.unselect();
        this.selected = -1;
        this.onArrowDown(e);
        return false;
    }
    onArrowLeft() {
        if (this.rootMenu() !== this) {
            this.hide();
        }
        return false;
    }
    onArrowRight() {
        // no-op in base class
        return false;
    }
    hide() {
        this.setChildMenu(); // hide child menu(s) first
        return super.hide();
    }
    setChildMenu(menu) {
        this.child?.hide();
        this.child = menu;
    }
    rootMenu() {
        return this.parent instanceof obsidian.App ? this : this.parent.rootMenu();
    }
    cascade(target, event, onClose, hOverlap = 15, vOverlap = 5) {
        const { left, right, top, bottom, width } = target.getBoundingClientRect();
        const centerX = left + Math.min(150, width / 3);
        const { innerHeight, innerWidth } = window;
        // Try to cascade down and to the right from the mouse or horizontal center
        // of the clicked item
        const point = { x: event ? event.clientX - hOverlap : centerX, y: bottom - vOverlap };
        // Measure the menu and see if it fits
        document.body.appendChild(this.dom);
        const { offsetWidth, offsetHeight } = this.dom;
        const fitsBelow = point.y + offsetHeight < innerHeight;
        const fitsRight = point.x + offsetWidth <= innerWidth;
        // If it doesn't fit underneath us, position it at the bottom of the screen, unless
        // the clicked item is close to the bottom (in which case, position it above so
        // the item will still be visible.)
        if (!fitsBelow) {
            point.y = (bottom > innerHeight - (bottom - top)) ? top + vOverlap : innerHeight;
        }
        // If it doesn't fit to the right, then position it at the right edge of the screen,
        // so long as it fits entirely above or below us.  Otherwise, position it using the
        // item center, so at least one side of the previous menu/item will still be seen.
        if (!fitsRight) {
            point.x = (offsetHeight < (bottom - vOverlap) || fitsBelow) ? innerWidth : centerX;
        }
        // Done!  Show our work.
        this.showAtPosition(point);
        // Flag the clicked item as active, until we close
        target.toggleClass("selected", true);
        this.onHide(() => {
            if (this.parent instanceof obsidian.App)
                target.toggleClass("selected", false);
            else if (this.parent instanceof PopupMenu)
                this.parent.setChildMenu();
            if (onClose)
                onClose();
        });
        return this;
    }
}
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function onElement(el, type, selector, listener, options = false) {
    el.on(type, selector, listener, options);
    return () => el.off(type, selector, listener, options);
}

function optName(name) {
    return i18next.t(`plugins.file-explorer.menu-opt-${name}`);
}
class ContextMenu extends PopupMenu {
    constructor(parent, file) {
        super(parent);
        const { workspace } = this.app;
        const haveFileExplorer = this.app.internalPlugins.plugins["file-explorer"].enabled;
        if (file instanceof obsidian.TFolder) {
            this.addItem(i => i.setTitle(optName("new-note")).setIcon("create-new").onClick(async (e) => {
                const newFile = await this.app.fileManager.createNewMarkdownFile(file);
                if (newFile)
                    await this.app.workspace.getLeaf(obsidian.Keymap.isModifier(e, "Mod")).openFile(newFile, {
                        active: !0, state: { mode: "source" }, eState: { rename: "all" }
                    });
            }));
            this.addItem(i => i.setTitle(optName("new-folder")).setIcon("folder").setDisabled(!haveFileExplorer).onClick(event => {
                if (haveFileExplorer) {
                    this.withExplorer(file)?.createAbstractFile("folder", file);
                }
                else {
                    new obsidian.Notice("The File Explorer core plugin must be enabled to create new folders");
                    event.stopPropagation();
                }
            }));
            this.addItem(i => i.setTitle(optName("set-attachment-folder")).setIcon("image-file").onClick(() => {
                this.app.setAttachmentFolder(file);
            }));
            this.addSeparator();
        }
        this.addItem(i => {
            i.setTitle(optName("rename")).setIcon("pencil").onClick(event => {
                this.app.fileManager.promptForFileRename(file);
            });
        });
        this.addItem(i => i.setTitle(optName("delete")).setIcon("trash").onClick(() => {
            if (file instanceof obsidian.TFolder) {
                this.app.fileManager.promptForFolderDeletion(file);
            }
            else if (file instanceof obsidian.TFile) {
                this.app.fileManager.promptForFileDeletion(file);
            }
        }));
        if (file instanceof obsidian.TFolder && haveFileExplorer) {
            this.addItem(i => i.setIcon("folder").setTitle(i18next.t('plugins.file-explorer.action-reveal-file')).onClick(() => {
                this.withExplorer(file);
            }));
        }
        if (file === workspace.getActiveFile()) {
            workspace.trigger("file-menu", this, file, "quick-explorer", workspace.activeLeaf);
        }
        else {
            workspace.trigger("file-menu", this, file, "quick-explorer");
        }
    }
    withExplorer(file) {
        const explorer = this.app.internalPlugins.plugins["file-explorer"];
        if (explorer.enabled) {
            explorer.instance.revealInFolder(file);
            return this.app.workspace.getLeavesOfType("file-explorer")[0].view;
        }
    }
}

const alphaSort = new Intl.Collator(undefined, { usage: "sort", sensitivity: "base", numeric: true }).compare;
const previewIcons = {
    markdown: "document",
    image: "image-file",
    audio: "audio-file",
    pdf: "pdf-file",
};
const viewtypeIcons = {
    ...previewIcons,
    // add third-party plugins
    excalidraw: "excalidraw-icon",
};
// Global auto preview mode
let autoPreview = true;
class FolderMenu extends PopupMenu {
    constructor(parent, folder, selectedFile, opener) {
        super(parent);
        this.parent = parent;
        this.folder = folder;
        this.selectedFile = selectedFile;
        this.opener = opener;
        this.parentFolder = this.parent instanceof FolderMenu ? this.parent.folder : null;
        this.fileCount = (file) => (file instanceof obsidian.TFolder ? file.children.map(this.fileCount).reduce((a, b) => a + b, 0) : (this.fileIcon(file) ? 1 : 0));
        this.refreshFiles = obsidian.debounce(() => this.loadFiles(this.folder, this.currentFile()), 100, true);
        this.showPopover = obsidian.debounce(() => {
            this.hidePopover();
            if (!autoPreview)
                return;
            this.maybeHover(this.currentItem()?.dom, file => this.app.workspace.trigger('link-hover', this, null, file.path, ""));
        }, 50, true);
        this.onItemHover = (event, targetEl) => {
            if (!autoPreview)
                this.maybeHover(targetEl, file => this.app.workspace.trigger('hover-link', {
                    event, source: hoverSource, hoverParent: this, targetEl, linktext: file.path
                }));
        };
        this.onItemClick = (event, target) => {
            const file = this.fileForDom(target);
            if (!file)
                return;
            if (!this.onClickFile(file, target, event)) {
                // Keep current menu tree open
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
        };
        this.onItemMenu = (event, target) => {
            const file = this.fileForDom(target);
            if (file) {
                const idx = this.itemForPath(file.path);
                if (idx >= 0 && this.selected != idx)
                    this.select(idx);
                new ContextMenu(this, file).cascade(target, event);
                // Keep current menu tree open
                event.stopPropagation();
            }
        };
        this.loadFiles(folder, selectedFile);
        this.scope.register([], "Tab", this.togglePreviewMode.bind(this));
        this.scope.register(["Mod"], "Enter", this.onEnter.bind(this));
        this.scope.register(["Alt"], "Enter", this.onKeyboardContextMenu.bind(this));
        this.scope.register([], "\\", this.onKeyboardContextMenu.bind(this));
        this.scope.register([], "F2", this.doRename.bind(this));
        this.scope.register(["Shift"], "F2", this.doMove.bind(this));
        // Scroll preview window up and down
        this.scope.register([], "PageUp", this.doScroll.bind(this, -1, false));
        this.scope.register([], "PageDown", this.doScroll.bind(this, 1, false));
        this.scope.register(["Mod"], "Home", this.doScroll.bind(this, 0, true));
        this.scope.register(["Mod"], "End", this.doScroll.bind(this, 1, true));
        const { dom } = this;
        const menuItem = ".menu-item[data-file-path]";
        dom.on("click", menuItem, this.onItemClick, true);
        dom.on("contextmenu", menuItem, this.onItemMenu);
        dom.on('mouseover', menuItem, this.onItemHover);
        dom.on("mousedown", menuItem, e => { e.stopPropagation(); }, true); // Fix drag cancelling
        dom.on('dragstart', menuItem, (event, target) => {
            startDrag(this.app, target.dataset.filePath, event);
        });
        // When we unload, reactivate parent menu's hover, if needed
        this.register(() => { autoPreview && this.parent instanceof FolderMenu && this.parent.showPopover(); });
        // Make obsidian.Menu think mousedowns on our popups are happening
        // on us, so we won't close before an actual click occurs
        const menu = this;
        around(this.dom, { contains(prev) {
                return function (target) {
                    const ret = prev.call(this, target) || menu._popover?.hoverEl.contains(target);
                    return ret;
                };
            } });
    }
    onArrowLeft() {
        super.onArrowLeft();
        if (this.rootMenu() === this)
            this.openBreadcrumb(this.opener?.previousElementSibling);
        return false;
    }
    onKeyboardContextMenu() {
        const target = this.items[this.selected]?.dom, file = target && this.fileForDom(target);
        if (file)
            new ContextMenu(this, file).cascade(target);
        return false;
    }
    doScroll(direction, toEnd, event) {
        const preview = this.hoverPopover?.hoverEl.find(".markdown-preview-view");
        if (preview) {
            preview.style.scrollBehavior = toEnd ? "auto" : "smooth";
            const oldTop = preview.scrollTop;
            const newTop = (toEnd ? 0 : preview.scrollTop) + direction * (toEnd ? preview.scrollHeight : preview.clientHeight);
            preview.scrollTop = newTop;
            if (!toEnd) {
                // Paging past the beginning or end
                if (newTop >= preview.scrollHeight) {
                    this.onArrowDown(event);
                }
                else if (newTop < 0) {
                    if (oldTop > 0)
                        preview.scrollTop = 0;
                    else
                        this.onArrowUp(event);
                }
            }
        }
        else {
            if (!autoPreview) {
                autoPreview = true;
                this.showPopover();
            }
            // No preview, just go to next or previous item
            else if (direction > 0)
                this.onArrowDown(event);
            else
                this.onArrowUp(event);
        }
        return false;
    }
    doRename() {
        const file = this.currentFile();
        if (file)
            this.app.fileManager.promptForFileRename(file);
        return false;
    }
    doMove() {
        const explorerPlugin = this.app.internalPlugins.plugins["file-explorer"];
        if (!explorerPlugin.enabled) {
            new obsidian.Notice("File explorer core plugin must be enabled to move files or folders");
            return false;
        }
        const modal = explorerPlugin.instance.moveFileModal;
        modal.setCurrentFile(this.currentFile());
        modal.open();
        return false;
    }
    currentItem() {
        return this.items[this.selected];
    }
    currentFile() {
        return this.fileForDom(this.currentItem()?.dom);
    }
    fileForDom(targetEl) {
        const { filePath } = targetEl?.dataset;
        if (filePath)
            return this.app.vault.getAbstractFileByPath(filePath);
    }
    itemForPath(filePath) {
        return this.items.findIndex(i => i.dom.dataset.filePath === filePath);
    }
    openBreadcrumb(element) {
        if (element && this.rootMenu() === this) {
            this.opener.previousElementSibling;
            element.click();
            return false;
        }
    }
    onArrowRight() {
        const file = this.currentFile();
        if (file instanceof obsidian.TFolder) {
            if (file !== this.selectedFile) {
                this.onClickFile(file, this.currentItem().dom);
            }
            else {
                this.openBreadcrumb(this.opener?.nextElementSibling);
            }
        }
        return false;
    }
    loadFiles(folder, selectedFile) {
        const folderNote = this.folderNote(this.folder);
        this.dom.empty();
        this.items = [];
        const allFiles = this.app.vault.getConfig("showUnsupportedFiles");
        const { children, parent } = folder;
        const items = children.slice().sort((a, b) => alphaSort(a.name, b.name));
        const folders = items.filter(f => f instanceof obsidian.TFolder);
        const files = items.filter(f => f instanceof obsidian.TFile && f !== folderNote && (allFiles || this.fileIcon(f)));
        folders.sort((a, b) => alphaSort(a.name, b.name));
        files.sort((a, b) => alphaSort(a.basename, b.basename));
        if (folderNote) {
            this.addFile(folderNote);
        }
        if (folders.length) {
            if (folderNote)
                this.addSeparator();
            folders.map(this.addFile, this);
        }
        if (files.length) {
            if (folders.length || folderNote)
                this.addSeparator();
            files.map(this.addFile, this);
        }
        this.select(selectedFile ? this.itemForPath(selectedFile.path) : 0);
    }
    fileIcon(file) {
        if (file instanceof obsidian.TFolder)
            return "folder";
        if (file instanceof obsidian.TFile) {
            const viewType = this.app.viewRegistry.getTypeByExtension(file.extension);
            if (viewType)
                return viewtypeIcons[viewType] ?? "document";
        }
    }
    addFile(file) {
        const icon = this.fileIcon(file);
        this.addItem(i => {
            i.setTitle(file.name);
            i.dom.dataset.filePath = file.path;
            i.dom.setAttr("draggable", "true");
            i.dom.addClass(file instanceof obsidian.TFolder ? "is-qe-folder" : "is-qe-file");
            if (icon)
                i.setIcon(icon);
            if (file instanceof obsidian.TFile) {
                i.setTitle(file.basename);
                if (file.extension !== "md")
                    i.dom.createDiv({ text: file.extension, cls: ["nav-file-tag", "qe-extension"] });
            }
            else if (file !== this.folder.parent) {
                const count = this.fileCount(file);
                if (count)
                    i.dom.createDiv({ text: "" + count, cls: "nav-file-tag qe-file-count" });
            }
            i.onClick(e => this.onClickFile(file, i.dom, e));
        });
    }
    togglePreviewMode() {
        if (autoPreview = !autoPreview)
            this.showPopover();
        else
            this.hidePopover();
        return false;
    }
    onload() {
        super.onload();
        this.registerEvent(this.app.vault.on("create", (file) => {
            if (this.folder === file.parent)
                this.refreshFiles();
        }));
        this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
            if (this.folder === file.parent) {
                // Destination was here; refresh the list
                const selectedFile = this.itemForPath(oldPath) >= 0 ? file : this.currentFile();
                this.loadFiles(this.folder, selectedFile);
            }
            else {
                // Remove it if it was moved out of here
                this.removeItemForPath(oldPath);
            }
        }));
        this.registerEvent(this.app.vault.on("delete", file => this.removeItemForPath(file.path)));
        // Activate preview immediately if applicable
        if (autoPreview && this.selected != -1)
            this.showPopover();
    }
    removeItemForPath(path) {
        const posn = this.itemForPath(path);
        if (posn < 0)
            return;
        const item = this.items[posn];
        if (this.selected > posn)
            this.selected -= 1;
        item.dom.detach();
        this.items.remove(item);
    }
    onEscape() {
        super.onEscape();
        if (this.parent instanceof PopupMenu)
            this.parent.onEscape();
        return false;
    }
    hide() {
        this.hidePopover();
        return super.hide();
    }
    setChildMenu(menu) {
        super.setChildMenu(menu);
        if (autoPreview && this.canShowPopover())
            this.showPopover();
    }
    select(idx, scroll = true) {
        const old = this.selected;
        super.select(idx, scroll);
        if (old !== this.selected) {
            // selected item changed; trigger new popover or hide the old one
            if (autoPreview)
                this.showPopover();
            else
                this.hidePopover();
        }
    }
    hidePopover() {
        this.hoverPopover?.hide();
    }
    canShowPopover() {
        return !this.child && this.visible;
    }
    maybeHover(targetEl, cb) {
        if (!this.canShowPopover())
            return;
        let file = this.fileForDom(targetEl);
        if (file instanceof obsidian.TFolder)
            file = this.folderNote(file);
        if (file instanceof obsidian.TFile && previewIcons[this.app.viewRegistry.getTypeByExtension(file.extension)]) {
            cb(file);
        }
    }
    folderNote(folder) {
        return this.app.vault.getAbstractFileByPath(this.folderNotePath(folder));
    }
    folderNotePath(folder) {
        return `${folder.path}/${folder.name}.md`;
    }
    get hoverPopover() { return this._popover; }
    set hoverPopover(popover) {
        if (popover && !this.canShowPopover()) {
            popover.hide();
            return;
        }
        this._popover = popover;
        if (autoPreview && popover && this.currentItem()) {
            // Position the popover so it doesn't overlap the menu horizontally (as long as it fits)
            // and so that its vertical position overlaps the selected menu item (placing the top a
            // bit above the current item, unless it would go off the bottom of the screen)
            const hoverEl = popover.hoverEl;
            hoverEl.show();
            const menu = this.dom.getBoundingClientRect(), selected = this.currentItem().dom.getBoundingClientRect(), container = hoverEl.offsetParent || document.documentElement, popupHeight = hoverEl.offsetHeight, left = Math.min(menu.right + 2, container.clientWidth - hoverEl.offsetWidth), top = Math.min(Math.max(0, selected.top - popupHeight / 8), container.clientHeight - popupHeight);
            hoverEl.style.top = top + "px";
            hoverEl.style.left = left + "px";
        }
    }
    onClickFile(file, target, event) {
        this.hidePopover();
        const idx = this.itemForPath(file.path);
        if (idx >= 0 && this.selected != idx)
            this.select(idx);
        if (file instanceof obsidian.TFile) {
            if (this.app.viewRegistry.isExtensionRegistered(file.extension)) {
                this.app.workspace.openLinkText(file.path, "", event && obsidian.Keymap.isModifier(event, "Mod"));
                // Close the entire menu tree
                this.rootMenu().hide();
                event?.stopPropagation();
                return true;
            }
            else {
                new obsidian.Notice(`.${file.extension} files cannot be opened in Obsidian; Use "Open in Default App" to open them externally`);
                // fall through
            }
        }
        else if (file === this.selectedFile) {
            // Targeting the initially-selected subfolder: go to next breadcrumb
            this.openBreadcrumb(this.opener?.nextElementSibling);
        }
        else {
            // Otherwise, pop a new menu for the subfolder
            const folderMenu = new FolderMenu(this, file, this.folderNote(file));
            folderMenu.cascade(target, event instanceof MouseEvent ? event : undefined);
        }
    }
}

const hoverSource = "quick-explorer:folder-menu";
function startDrag(app, path, event) {
    if (!path || path === "/")
        return;
    const file = app.vault.getAbstractFileByPath(path);
    if (!file)
        return;
    const { dragManager } = app;
    const dragData = file instanceof obsidian.TFile ? dragManager.dragFile(event, file) : dragManager.dragFolder(event, file);
    dragManager.onDragStart(event, dragData);
}
class Explorable {
    constructor() {
        this.nameEl = el("span", { class: "explorable-name" });
        this.sepEl = el("span", { class: "explorable-separator" });
        this.el = el("span", { draggable: true, class: "explorable titlebar-button" },
            this.nameEl,
            this.sepEl);
    }
    update(data, index, items) {
        const { file, path } = data;
        let name = file.name || path;
        this.sepEl.toggle(index < items.length - 1);
        this.nameEl.textContent = name;
        this.el.dataset.parentPath = file.parent?.path ?? "/";
        this.el.dataset.filePath = path;
    }
}
class Explorer extends obsidian.Component {
    constructor(app) {
        super();
        this.app = app;
        this.lastFile = null;
        this.lastPath = null;
        this.el = el("div", { id: "quick-explorer" });
        this.list = list(this.el, Explorable);
    }
    onload() {
        this.update(this.app.workspace.getActiveFile());
        this.registerEvent(this.app.workspace.on("file-open", this.update, this));
        this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.update(this.app.workspace.getActiveFile())));
        this.registerEvent(this.app.vault.on("rename", this.onFileChange, this));
        this.registerEvent(this.app.vault.on("delete", this.onFileDelete, this));
        this.el.on("contextmenu", ".explorable", (event, target) => {
            const { filePath } = target.dataset;
            const file = this.app.vault.getAbstractFileByPath(filePath);
            new ContextMenu(this.app, file).cascade(target, event);
        });
        this.el.on("click", ".explorable", (event, target) => {
            this.folderMenu(target, event.isTrusted && event);
        });
        this.el.on('dragstart', ".explorable", (event, target) => {
            startDrag(this.app, target.dataset.filePath, event);
        });
    }
    onFileChange(file) {
        if (file === this.lastFile)
            this.update(file);
    }
    onFileDelete(file) {
        if (file === this.lastFile)
            this.update();
    }
    folderMenu(opener = this.el.firstElementChild, event) {
        const { filePath, parentPath } = opener.dataset;
        const selected = this.app.vault.getAbstractFileByPath(filePath);
        const folder = this.app.vault.getAbstractFileByPath(parentPath);
        return new FolderMenu(this.app, folder, selected, opener).cascade(opener, event);
    }
    browseVault() {
        return this.folderMenu();
    }
    browseCurrent() {
        return this.folderMenu(this.el.lastElementChild);
    }
    browseFile(file) {
        if (file === this.app.workspace.getActiveFile())
            return this.browseCurrent();
        let menu;
        let opener = this.el.firstElementChild;
        const path = [], parts = file.path.split("/").filter(p => p);
        while (opener && parts.length) {
            path.push(parts[0]);
            if (opener.dataset.filePath !== path.join("/")) {
                menu = this.folderMenu(opener);
                path.pop();
                break;
            }
            parts.shift();
            opener = opener.nextElementSibling;
        }
        while (menu && parts.length) {
            path.push(parts.shift());
            const idx = menu.itemForPath(path.join("/"));
            if (idx == -1)
                break;
            menu.select(idx);
            if (parts.length || file instanceof obsidian.TFolder) {
                menu.onArrowRight();
                menu = menu.child;
            }
        }
        return menu;
    }
    update(file) {
        file ?? (file = this.app.vault.getAbstractFileByPath("/"));
        if (file == this.lastFile && file.path == this.lastPath)
            return;
        this.lastFile = file;
        this.lastPath = file.path;
        const parts = [];
        while (file) {
            parts.unshift({ file, path: file.path });
            file = file.parent;
        }
        if (parts.length > 1)
            parts.shift();
        this.list.update(parts);
    }
}

class quickExplorer extends obsidian.Plugin {
    onload() {
        this.app.workspace.onLayoutReady(() => {
            const buttonContainer = document.body.find(".titlebar .titlebar-button-container.mod-left");
            this.register(() => unmount(buttonContainer, this.explorer));
            mount(buttonContainer, this.explorer = new Explorer(this.app));
            this.addChild(this.explorer);
        });
        this.app.workspace.registerHoverLinkSource(hoverSource, {
            display: 'Quick Explorer', defaultMod: true
        });
        this.addCommand({ id: "browse-vault", name: "Browse vault", callback: () => { this.explorer?.browseVault(); }, });
        this.addCommand({ id: "browse-current", name: "Browse current folder", callback: () => { this.explorer?.browseCurrent(); }, });
        this.registerEvent(this.app.workspace.on("file-menu", (menu, file, source) => {
            let item;
            if (source !== "quick-explorer")
                menu.addItem(i => {
                    i.setIcon("folder").setTitle("Show in Quick Explorer").onClick(e => { this.explorer?.browseFile(file); });
                    item = i;
                });
            if (item) {
                const revealFile = i18next.t(`plugins.file-explorer.action-reveal-file`);
                const idx = menu.items.findIndex(i => i.titleEl.textContent === revealFile);
                menu.dom.insertBefore(item.dom, menu.items[idx + 1].dom);
                menu.items.remove(item);
                menu.items.splice(idx + 1, 0, item);
            }
        }));
        Object.defineProperty(obsidian.TFolder.prototype, "basename", { get() { return this.name; }, configurable: true });
    }
    onunload() {
        this.app.workspace.unregisterHoverLinkSource(hoverSource);
    }
}

module.exports = quickExplorer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzLy5wbnBtL3JlZG9tQDMuMjcuMS9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9tb25rZXktYXJvdW5kQDIuMy4wL25vZGVfbW9kdWxlcy9tb25rZXktYXJvdW5kL21qcy9pbmRleC5qcyIsInNyYy9tZW51cy50cyIsInNyYy9Db250ZXh0TWVudS50cyIsInNyYy9Gb2xkZXJNZW51LnRzIiwic3JjL0V4cGxvcmVyLnRzeCIsInNyYy9xdWljay1leHBsb3Jlci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gcGFyc2VRdWVyeSAocXVlcnkpIHtcbiAgdmFyIGNodW5rcyA9IHF1ZXJ5LnNwbGl0KC8oWyMuXSkvKTtcbiAgdmFyIHRhZ05hbWUgPSAnJztcbiAgdmFyIGlkID0gJyc7XG4gIHZhciBjbGFzc05hbWVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY2h1bmsgPSBjaHVua3NbaV07XG4gICAgaWYgKGNodW5rID09PSAnIycpIHtcbiAgICAgIGlkID0gY2h1bmtzWysraV07XG4gICAgfSBlbHNlIGlmIChjaHVuayA9PT0gJy4nKSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2goY2h1bmtzWysraV0pO1xuICAgIH0gZWxzZSBpZiAoY2h1bmsubGVuZ3RoKSB7XG4gICAgICB0YWdOYW1lID0gY2h1bms7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWc6IHRhZ05hbWUgfHwgJ2RpdicsXG4gICAgaWQ6IGlkLFxuICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lcy5qb2luKCcgJylcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCAocXVlcnksIG5zKSB7XG4gIHZhciByZWYgPSBwYXJzZVF1ZXJ5KHF1ZXJ5KTtcbiAgdmFyIHRhZyA9IHJlZi50YWc7XG4gIHZhciBpZCA9IHJlZi5pZDtcbiAgdmFyIGNsYXNzTmFtZSA9IHJlZi5jbGFzc05hbWU7XG4gIHZhciBlbGVtZW50ID0gbnMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZykgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cbiAgaWYgKGlkKSB7XG4gICAgZWxlbWVudC5pZCA9IGlkO1xuICB9XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGlmIChucykge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHVubW91bnQgKHBhcmVudCwgY2hpbGQpIHtcbiAgdmFyIHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgdmFyIGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZEVsLnBhcmVudE5vZGUpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKTtcblxuICAgIHBhcmVudEVsLnJlbW92ZUNoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiBkb1VubW91bnQgKGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCkge1xuICB2YXIgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsICdvbnVubW91bnQnKTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIHZhciBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlIHx8IHt9O1xuXG4gICAgZm9yICh2YXIgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5IChob29rcykge1xuICBpZiAoaG9va3MgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBob29rcykge1xuICAgIGlmIChob29rc1trZXldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiBnbG9iYWwgTm9kZSwgU2hhZG93Um9vdCAqL1xuXG52YXIgaG9va05hbWVzID0gWydvbm1vdW50JywgJ29ucmVtb3VudCcsICdvbnVubW91bnQnXTtcbnZhciBzaGFkb3dSb290QXZhaWxhYmxlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ1NoYWRvd1Jvb3QnIGluIHdpbmRvdztcblxuZnVuY3Rpb24gbW91bnQgKHBhcmVudCwgY2hpbGQsIGJlZm9yZSwgcmVwbGFjZSkge1xuICB2YXIgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICB2YXIgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkICE9PSBjaGlsZEVsKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX3ZpZXcgPSBjaGlsZDtcbiAgfVxuXG4gIHZhciB3YXNNb3VudGVkID0gY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQ7XG4gIHZhciBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgKG9sZFBhcmVudCAhPT0gcGFyZW50RWwpKSB7XG4gICAgZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBvbGRQYXJlbnQpO1xuICB9XG5cbiAgaWYgKGJlZm9yZSAhPSBudWxsKSB7XG4gICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50RWwuaW5zZXJ0QmVmb3JlKGNoaWxkRWwsIGdldEVsKGJlZm9yZSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChjaGlsZEVsKTtcbiAgfVxuXG4gIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpO1xuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlciAoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSAnb25tb3VudCcgfHwgZXZlbnROYW1lID09PSAnb25yZW1vdW50Jykge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAnb251bm1vdW50Jykge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGhvb2tzID0gZWwuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgaWYgKCFob29rcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB2aWV3ID0gZWwuX19yZWRvbV92aWV3O1xuICB2YXIgaG9va0NvdW50ID0gMDtcblxuICB2aWV3ICYmIHZpZXdbZXZlbnROYW1lXSAmJiB2aWV3W2V2ZW50TmFtZV0oKTtcblxuICBmb3IgKHZhciBob29rIGluIGhvb2tzKSB7XG4gICAgaWYgKGhvb2spIHtcbiAgICAgIGhvb2tDb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChob29rQ291bnQpIHtcbiAgICB2YXIgdHJhdmVyc2UgPSBlbC5maXJzdENoaWxkO1xuXG4gICAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgICB2YXIgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQgKGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KSB7XG4gIHZhciBob29rcyA9IGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgfHwgKGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fSk7XG4gIHZhciByZW1vdW50ID0gKHBhcmVudEVsID09PSBvbGRQYXJlbnQpO1xuICB2YXIgaG9va3NGb3VuZCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsaXN0ID0gaG9va05hbWVzOyBpIDwgbGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHZhciBob29rTmFtZSA9IGxpc3RbaV07XG5cbiAgICBpZiAoIXJlbW91bnQpIHsgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkgeyAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICB2YXIgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgKHRyYXZlcnNlICYmIHRyYXZlcnNlLl9fcmVkb21fbW91bnRlZCkpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIHJlbW91bnQgPyAnb25yZW1vdW50JyA6ICdvbm1vdW50Jyk7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIHZhciBwYXJlbnQgPSB0cmF2ZXJzZS5wYXJlbnROb2RlO1xuICAgIHZhciBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlIHx8ICh0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9KTtcblxuICAgIGZvciAodmFyIGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0cmF2ZXJzZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8XG4gICAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmICh0cmF2ZXJzZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpKSB8fFxuICAgICAgICAocGFyZW50ICYmIHBhcmVudC5fX3JlZG9tX21vdW50ZWQpXG4gICAgICApIHtcbiAgICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgcmVtb3VudCA/ICdvbnJlbW91bnQnIDogJ29ubW91bnQnKTtcbiAgICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZSAodmlldywgYXJnMSwgYXJnMikge1xuICB2YXIgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2V0U3R5bGVWYWx1ZShlbCwgYXJnMSwgYXJnMik7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0U3R5bGVWYWx1ZSAoZWwsIGtleSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICBlbC5zdHlsZVtrZXldID0gJyc7XG4gIH0gZWxzZSB7XG4gICAgZWwuc3R5bGVba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cbnZhciB4bGlua25zID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xuXG5mdW5jdGlvbiBzZXRBdHRyICh2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIHNldEF0dHJJbnRlcm5hbCh2aWV3LCBhcmcxLCBhcmcyKTtcbn1cblxuZnVuY3Rpb24gc2V0QXR0ckludGVybmFsICh2aWV3LCBhcmcxLCBhcmcyLCBpbml0aWFsKSB7XG4gIHZhciBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIHZhciBpc09iaiA9IHR5cGVvZiBhcmcxID09PSAnb2JqZWN0JztcblxuICBpZiAoaXNPYmopIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpc1NWRyA9IGVsIGluc3RhbmNlb2YgU1ZHRWxlbWVudDtcbiAgICB2YXIgaXNGdW5jID0gdHlwZW9mIGFyZzIgPT09ICdmdW5jdGlvbic7XG5cbiAgICBpZiAoYXJnMSA9PT0gJ3N0eWxlJyAmJiB0eXBlb2YgYXJnMiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNldFN0eWxlKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKGlzU1ZHICYmIGlzRnVuYykge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSBpZiAoYXJnMSA9PT0gJ2RhdGFzZXQnKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIChhcmcxICE9PSAnbGlzdCcpKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiAoYXJnMSA9PT0gJ3hsaW5rJykpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSAnY2xhc3MnKSB7XG4gICAgICAgIGFyZzIgPSBlbC5jbGFzc05hbWUgKyAnICcgKyBhcmcyO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFhsaW5rIChlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFhsaW5rKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rbnMsIGFyZzEsIGFyZzIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0RGF0YSAoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXREYXRhKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLmRhdGFzZXRbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZWwuZGF0YXNldFthcmcxXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdGV4dCAoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgoc3RyICE9IG51bGwpID8gc3RyIDogJycpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsIChlbGVtZW50LCBhcmdzLCBpbml0aWFsKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsaXN0ID0gYXJnczsgaSA8IGxpc3QubGVuZ3RoOyBpICs9IDEpIHtcbiAgICB2YXIgYXJnID0gbGlzdFtpXTtcblxuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgYXJnO1xuXG4gICAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFyZyhlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRleHQoYXJnKSk7XG4gICAgfSBlbHNlIGlmIChpc05vZGUoZ2V0RWwoYXJnKSkpIHtcbiAgICAgIG1vdW50KGVsZW1lbnQsIGFyZyk7XG4gICAgfSBlbHNlIGlmIChhcmcubGVuZ3RoKSB7XG4gICAgICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZywgaW5pdGlhbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsZW1lbnQsIGFyZywgbnVsbCwgaW5pdGlhbCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVuc3VyZUVsIChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09ICdzdHJpbmcnID8gaHRtbChwYXJlbnQpIDogZ2V0RWwocGFyZW50KTtcbn1cblxuZnVuY3Rpb24gZ2V0RWwgKHBhcmVudCkge1xuICByZXR1cm4gKHBhcmVudC5ub2RlVHlwZSAmJiBwYXJlbnQpIHx8ICghcGFyZW50LmVsICYmIHBhcmVudCkgfHwgZ2V0RWwocGFyZW50LmVsKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlIChhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiBhcmcubm9kZVR5cGU7XG59XG5cbnZhciBodG1sQ2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gaHRtbCAocXVlcnkpIHtcbiAgdmFyIGFyZ3MgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgYXJnc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICB2YXIgZWxlbWVudDtcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBlbGVtZW50ID0gbWVtb2l6ZUhUTUwocXVlcnkpLmNsb25lTm9kZShmYWxzZSk7XG4gIH0gZWxzZSBpZiAoaXNOb2RlKHF1ZXJ5KSkge1xuICAgIGVsZW1lbnQgPSBxdWVyeS5jbG9uZU5vZGUoZmFsc2UpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IChGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseSggUXVlcnksIFsgbnVsbCBdLmNvbmNhdCggYXJncykgKSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgYXJndW1lbnQgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG52YXIgZWwgPSBodG1sO1xudmFyIGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwgKHF1ZXJ5KSB7XG4gIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGFyZ3NbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgdmFyIGNsb25lID0gbWVtb2l6ZUhUTUwocXVlcnkpO1xuXG4gIHJldHVybiBodG1sLmJpbmQuYXBwbHkoaHRtbCwgWyB0aGlzLCBjbG9uZSBdLmNvbmNhdCggYXJncyApKTtcbn07XG5cbmZ1bmN0aW9uIG1lbW9pemVIVE1MIChxdWVyeSkge1xuICByZXR1cm4gaHRtbENhY2hlW3F1ZXJ5XSB8fCAoaHRtbENhY2hlW3F1ZXJ5XSA9IGNyZWF0ZUVsZW1lbnQocXVlcnkpKTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4gKHBhcmVudCkge1xuICB2YXIgY2hpbGRyZW4gPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgY2hpbGRyZW5bIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgdmFyIHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgdmFyIGN1cnJlbnQgPSB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkcmVuLCBwYXJlbnRFbC5maXJzdENoaWxkKTtcblxuICB3aGlsZSAoY3VycmVudCkge1xuICAgIHZhciBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlIChwYXJlbnQsIGNoaWxkcmVuLCBfY3VycmVudCkge1xuICB2YXIgY3VycmVudCA9IF9jdXJyZW50O1xuXG4gIHZhciBjaGlsZEVscyA9IG5ldyBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAodmFyIGkkMSA9IDA7IGkkMSA8IGNoaWxkcmVuLmxlbmd0aDsgaSQxKyspIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpJDFdO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkRWwgPSBjaGlsZEVsc1tpJDFdO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgdmFyIG5leHQgPSBjdXJyZW50ICYmIGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICB2YXIgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgdmFyIHJlcGxhY2UgPSBleGlzdHMgJiYgbmV4dCA9PT0gY2hpbGRFbHNbaSQxICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sIChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbnZhciBMaXN0UG9vbCA9IGZ1bmN0aW9uIExpc3RQb29sIChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHRoaXMuVmlldyA9IFZpZXc7XG4gIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgdGhpcy5sb29rdXAgPSB7fTtcbiAgdGhpcy5vbGRWaWV3cyA9IFtdO1xuICB0aGlzLnZpZXdzID0gW107XG5cbiAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgdGhpcy5rZXkgPSB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nID8ga2V5IDogcHJvcEtleShrZXkpO1xuICB9XG59O1xuXG5MaXN0UG9vbC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChkYXRhLCBjb250ZXh0KSB7XG4gIHZhciByZWYgPSB0aGlzO1xuICAgIHZhciBWaWV3ID0gcmVmLlZpZXc7XG4gICAgdmFyIGtleSA9IHJlZi5rZXk7XG4gICAgdmFyIGluaXREYXRhID0gcmVmLmluaXREYXRhO1xuICB2YXIga2V5U2V0ID0ga2V5ICE9IG51bGw7XG5cbiAgdmFyIG9sZExvb2t1cCA9IHRoaXMubG9va3VwO1xuICB2YXIgbmV3TG9va3VwID0ge307XG5cbiAgdmFyIG5ld1ZpZXdzID0gbmV3IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgdmFyIG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGRhdGFbaV07XG4gICAgdmFyIHZpZXcgPSAodm9pZCAwKTtcblxuICAgIGlmIChrZXlTZXQpIHtcbiAgICAgIHZhciBpZCA9IGtleShpdGVtKTtcblxuICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgbmV3TG9va3VwW2lkXSA9IHZpZXc7XG4gICAgICB2aWV3Ll9fcmVkb21faWQgPSBpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlldyA9IG9sZFZpZXdzW2ldIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICB9XG4gICAgdmlldy51cGRhdGUgJiYgdmlldy51cGRhdGUoaXRlbSwgaSwgZGF0YSwgY29udGV4dCk7XG5cbiAgICB2YXIgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgIGVsLl9fcmVkb21fdmlldyA9IHZpZXc7XG4gICAgbmV3Vmlld3NbaV0gPSB2aWV3O1xuICB9XG5cbiAgdGhpcy5vbGRWaWV3cyA9IG9sZFZpZXdzO1xuICB0aGlzLnZpZXdzID0gbmV3Vmlld3M7XG5cbiAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gIHRoaXMubG9va3VwID0gbmV3TG9va3VwO1xufTtcblxuZnVuY3Rpb24gcHJvcEtleSAoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QgKHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxudmFyIExpc3QgPSBmdW5jdGlvbiBMaXN0IChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgdGhpcy5WaWV3ID0gVmlldztcbiAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB0aGlzLnZpZXdzID0gW107XG4gIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgdGhpcy5lbCA9IGVuc3VyZUVsKHBhcmVudCk7XG4gIHRoaXMua2V5U2V0ID0ga2V5ICE9IG51bGw7XG59O1xuXG5MaXN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKGRhdGEsIGNvbnRleHQpIHtcbiAgICBpZiAoIGRhdGEgPT09IHZvaWQgMCApIGRhdGEgPSBbXTtcblxuICB2YXIgcmVmID0gdGhpcztcbiAgICB2YXIga2V5U2V0ID0gcmVmLmtleVNldDtcbiAgdmFyIG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICB0aGlzLnBvb2wudXBkYXRlKGRhdGEsIGNvbnRleHQpO1xuXG4gIHZhciByZWYkMSA9IHRoaXMucG9vbDtcbiAgICB2YXIgdmlld3MgPSByZWYkMS52aWV3cztcbiAgICB2YXIgbG9va3VwID0gcmVmJDEubG9va3VwO1xuXG4gIGlmIChrZXlTZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2xkVmlldyA9IG9sZFZpZXdzW2ldO1xuICAgICAgdmFyIGlkID0gb2xkVmlldy5fX3JlZG9tX2lkO1xuXG4gICAgICBpZiAobG9va3VwW2lkXSA9PSBudWxsKSB7XG4gICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgIHVubW91bnQodGhpcywgb2xkVmlldyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgdmlld3MubGVuZ3RoOyBpJDErKykge1xuICAgIHZhciB2aWV3ID0gdmlld3NbaSQxXTtcblxuICAgIHZpZXcuX19yZWRvbV9pbmRleCA9IGkkMTtcbiAgfVxuXG4gIHNldENoaWxkcmVuKHRoaXMsIHZpZXdzKTtcblxuICBpZiAoa2V5U2V0KSB7XG4gICAgdGhpcy5sb29rdXAgPSBsb29rdXA7XG4gIH1cbiAgdGhpcy52aWV3cyA9IHZpZXdzO1xufTtcblxuTGlzdC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRMaXN0IChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuZnVuY3Rpb24gcGxhY2UgKFZpZXcsIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgUGxhY2UoVmlldywgaW5pdERhdGEpO1xufVxuXG52YXIgUGxhY2UgPSBmdW5jdGlvbiBQbGFjZSAoVmlldywgaW5pdERhdGEpIHtcbiAgdGhpcy5lbCA9IHRleHQoJycpO1xuICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgdGhpcy52aWV3ID0gbnVsbDtcbiAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gIGlmIChWaWV3IGluc3RhbmNlb2YgTm9kZSkge1xuICAgIHRoaXMuX2VsID0gVmlldztcbiAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgIHRoaXMuX2VsID0gVmlldztcbiAgICB0aGlzLnZpZXcgPSBWaWV3O1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX1ZpZXcgPSBWaWV3O1xuICB9XG5cbiAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbn07XG5cblBsYWNlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKHZpc2libGUsIGRhdGEpIHtcbiAgdmFyIHBsYWNlaG9sZGVyID0gdGhpcy5fcGxhY2Vob2xkZXI7XG4gIHZhciBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gIGlmICh2aXNpYmxlKSB7XG4gICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICBtb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcblxuICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIFZpZXcgPSB0aGlzLl9WaWV3O1xuICAgICAgICB2YXIgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICB0aGlzLmVsID0gZ2V0RWwodmlldyk7XG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG5cbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aWV3ICYmIHRoaXMudmlldy51cGRhdGUgJiYgdGhpcy52aWV3LnVwZGF0ZShkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIsIHRoaXMuX2VsKTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLnZpZXcpO1xuICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIH1cbiAgfVxuICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xufTtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuZnVuY3Rpb24gcm91dGVyIChwYXJlbnQsIFZpZXdzLCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFJvdXRlcihwYXJlbnQsIFZpZXdzLCBpbml0RGF0YSk7XG59XG5cbnZhciBSb3V0ZXIgPSBmdW5jdGlvbiBSb3V0ZXIgKHBhcmVudCwgVmlld3MsIGluaXREYXRhKSB7XG4gIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICB0aGlzLlZpZXdzID0gVmlld3M7XG4gIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbn07XG5cblJvdXRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChyb3V0ZSwgZGF0YSkge1xuICBpZiAocm91dGUgIT09IHRoaXMucm91dGUpIHtcbiAgICB2YXIgVmlld3MgPSB0aGlzLlZpZXdzO1xuICAgIHZhciBWaWV3ID0gVmlld3Nbcm91dGVdO1xuXG4gICAgdGhpcy5yb3V0ZSA9IHJvdXRlO1xuXG4gICAgaWYgKFZpZXcgJiYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlIHx8IFZpZXcuZWwgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3ID0gVmlldyAmJiBuZXcgVmlldyh0aGlzLmluaXREYXRhLCBkYXRhKTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLmVsLCBbdGhpcy52aWV3XSk7XG4gIH1cbiAgdGhpcy52aWV3ICYmIHRoaXMudmlldy51cGRhdGUgJiYgdGhpcy52aWV3LnVwZGF0ZShkYXRhLCByb3V0ZSk7XG59O1xuXG52YXIgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG52YXIgc3ZnQ2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gc3ZnIChxdWVyeSkge1xuICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHZhciBlbGVtZW50O1xuXG4gIHZhciB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGVsZW1lbnQgPSBtZW1vaXplU1ZHKHF1ZXJ5KS5jbG9uZU5vZGUoZmFsc2UpO1xuICB9IGVsc2UgaWYgKGlzTm9kZShxdWVyeSkpIHtcbiAgICBlbGVtZW50ID0gcXVlcnkuY2xvbmVOb2RlKGZhbHNlKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIFF1ZXJ5ID0gcXVlcnk7XG4gICAgZWxlbWVudCA9IG5ldyAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoIFF1ZXJ5LCBbIG51bGwgXS5jb25jYXQoIGFyZ3MpICkpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkJyk7XG4gIH1cblxuICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGdldEVsKGVsZW1lbnQpLCBhcmdzLCB0cnVlKTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxudmFyIHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcgKHF1ZXJ5KSB7XG4gIHZhciBjbG9uZSA9IG1lbW9pemVTVkcocXVlcnkpO1xuXG4gIHJldHVybiBzdmcuYmluZCh0aGlzLCBjbG9uZSk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gbWVtb2l6ZVNWRyAocXVlcnkpIHtcbiAgcmV0dXJuIHN2Z0NhY2hlW3F1ZXJ5XSB8fCAoc3ZnQ2FjaGVbcXVlcnldID0gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpKTtcbn1cblxuZXhwb3J0IHsgTGlzdCwgTGlzdFBvb2wsIFBsYWNlLCBSb3V0ZXIsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByb3V0ZXIsIHMsIHNldEF0dHIsIHNldENoaWxkcmVuLCBzZXREYXRhLCBzZXRTdHlsZSwgc2V0WGxpbmssIHN2ZywgdGV4dCwgdW5tb3VudCB9O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZChvYmosIGZhY3Rvcmllcykge1xuICAgIGNvbnN0IHJlbW92ZXJzID0gT2JqZWN0LmtleXMoZmFjdG9yaWVzKS5tYXAoa2V5ID0+IGFyb3VuZDEob2JqLCBrZXksIGZhY3Rvcmllc1trZXldKSk7XG4gICAgcmV0dXJuIHJlbW92ZXJzLmxlbmd0aCA9PT0gMSA/IHJlbW92ZXJzWzBdIDogZnVuY3Rpb24gKCkgeyByZW1vdmVycy5mb3JFYWNoKHIgPT4gcigpKTsgfTtcbn1cbmZ1bmN0aW9uIGFyb3VuZDEob2JqLCBtZXRob2QsIGNyZWF0ZVdyYXBwZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IG9ialttZXRob2RdLCBoYWRPd24gPSBvYmouaGFzT3duUHJvcGVydHkobWV0aG9kKTtcbiAgICBsZXQgY3VycmVudCA9IGNyZWF0ZVdyYXBwZXIob3JpZ2luYWwpO1xuICAgIC8vIExldCBvdXIgd3JhcHBlciBpbmhlcml0IHN0YXRpYyBwcm9wcyBmcm9tIHRoZSB3cmFwcGluZyBtZXRob2QsXG4gICAgLy8gYW5kIHRoZSB3cmFwcGluZyBtZXRob2QsIHByb3BzIGZyb20gdGhlIG9yaWdpbmFsIG1ldGhvZFxuICAgIGlmIChvcmlnaW5hbClcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGN1cnJlbnQsIG9yaWdpbmFsKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yod3JhcHBlciwgY3VycmVudCk7XG4gICAgb2JqW21ldGhvZF0gPSB3cmFwcGVyO1xuICAgIC8vIFJldHVybiBhIGNhbGxiYWNrIHRvIGFsbG93IHNhZmUgcmVtb3ZhbFxuICAgIHJldHVybiByZW1vdmU7XG4gICAgZnVuY3Rpb24gd3JhcHBlciguLi5hcmdzKSB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYmVlbiBkZWFjdGl2YXRlZCBhbmQgYXJlIG5vIGxvbmdlciB3cmFwcGVkLCByZW1vdmUgb3Vyc2VsdmVzXG4gICAgICAgIGlmIChjdXJyZW50ID09PSBvcmlnaW5hbCAmJiBvYmpbbWV0aG9kXSA9PT0gd3JhcHBlcilcbiAgICAgICAgICAgIHJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gY3VycmVudC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICAvLyBJZiBubyBvdGhlciBwYXRjaGVzLCBqdXN0IGRvIGEgZGlyZWN0IHJlbW92YWxcbiAgICAgICAgaWYgKG9ialttZXRob2RdID09PSB3cmFwcGVyKSB7XG4gICAgICAgICAgICBpZiAoaGFkT3duKVxuICAgICAgICAgICAgICAgIG9ialttZXRob2RdID0gb3JpZ2luYWw7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ialttZXRob2RdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50ID09PSBvcmlnaW5hbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gRWxzZSBwYXNzIGZ1dHVyZSBjYWxscyB0aHJvdWdoLCBhbmQgcmVtb3ZlIHdyYXBwZXIgZnJvbSB0aGUgcHJvdG90eXBlIGNoYWluXG4gICAgICAgIGN1cnJlbnQgPSBvcmlnaW5hbDtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHdyYXBwZXIsIG9yaWdpbmFsIHx8IEZ1bmN0aW9uKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZGVkdXBlKGtleSwgb2xkRm4sIG5ld0ZuKSB7XG4gICAgY2hlY2tba2V5XSA9IGtleTtcbiAgICByZXR1cm4gY2hlY2s7XG4gICAgZnVuY3Rpb24gY2hlY2soLi4uYXJncykge1xuICAgICAgICByZXR1cm4gKG9sZEZuW2tleV0gPT09IGtleSA/IG9sZEZuIDogbmV3Rm4pLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBhZnRlcihwcm9taXNlLCBjYikge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW4oY2IsIGNiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemUoYXN5bmNGdW5jdGlvbikge1xuICAgIGxldCBsYXN0UnVuID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgZnVuY3Rpb24gd3JhcHBlciguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBsYXN0UnVuID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICBhZnRlcihsYXN0UnVuLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXN5bmNGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKS50aGVuKHJlcywgcmVqKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgd3JhcHBlci5hZnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGxhc3RSdW4gPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHsgYWZ0ZXIobGFzdFJ1biwgcmVzKTsgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gd3JhcHBlcjtcbn1cbiIsImltcG9ydCB7TWVudSwgQXBwLCBNZW51SXRlbSwgZGVib3VuY2UsIEtleW1hcCwgU2NvcGV9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHthcm91bmR9IGZyb20gXCJtb25rZXktYXJvdW5kXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwib2JzaWRpYW5cIiB7XG4gICAgaW50ZXJmYWNlIE1lbnUge1xuICAgICAgICBhcHA6IEFwcFxuICAgICAgICBkb206IEhUTUxEaXZFbGVtZW50XG4gICAgICAgIHNjb3BlOiBTY29wZVxuICAgICAgICBpdGVtczogTWVudUl0ZW1bXVxuXG4gICAgICAgIHNlbGVjdChuOiBudW1iZXIpOiB2b2lkXG4gICAgICAgIHNlbGVjdGVkOiBudW1iZXJcbiAgICAgICAgb25BcnJvd0Rvd24oZTogS2V5Ym9hcmRFdmVudCk6IGZhbHNlXG4gICAgICAgIG9uQXJyb3dVcChlOiBLZXlib2FyZEV2ZW50KTogZmFsc2VcbiAgICB9XG5cbiAgICBleHBvcnQgbmFtZXNwYWNlIEtleW1hcCB7XG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNb2RpZmllcnMoZXZlbnQ6IEV2ZW50KTogc3RyaW5nXG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIE1lbnVJdGVtIHtcbiAgICAgICAgZG9tOiBIVE1MRGl2RWxlbWVudFxuICAgICAgICB0aXRsZUVsOiBIVE1MRGl2RWxlbWVudFxuICAgICAgICBoYW5kbGVFdmVudChldmVudDogRXZlbnQpOiB2b2lkXG4gICAgICAgIGRpc2FibGVkOiBib29sZWFuXG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBNZW51UGFyZW50ID0gQXBwIHwgUG9wdXBNZW51O1xuXG5leHBvcnQgY2xhc3MgUG9wdXBNZW51IGV4dGVuZHMgTWVudSB7XG4gICAgLyoqIFRoZSBjaGlsZCBtZW51IHBvcHBlZCB1cCBvdmVyIHRoaXMgb25lICovXG4gICAgY2hpbGQ6IE1lbnVcblxuICAgIG1hdGNoOiBzdHJpbmcgPSBcIlwiXG4gICAgcmVzZXRTZWFyY2hPblRpbWVvdXQgPSBkZWJvdW5jZSgoKSA9PiB7dGhpcy5tYXRjaCA9IFwiXCI7fSwgMTUwMCwgdHJ1ZSlcbiAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2VcbiAgICBmaXJzdE1vdmU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIHBhcmVudDogTWVudVBhcmVudCkge1xuICAgICAgICBzdXBlcihwYXJlbnQgaW5zdGFuY2VvZiBBcHAgPyBwYXJlbnQgOiBwYXJlbnQuYXBwKTtcbiAgICAgICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIFBvcHVwTWVudSkgcGFyZW50LnNldENoaWxkTWVudSh0aGlzKTtcblxuICAgICAgICB0aGlzLnNjb3BlID0gbmV3IFNjb3BlO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93VXBcIiwgICB0aGlzLm9uQXJyb3dVcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJBcnJvd0Rvd25cIiwgdGhpcy5vbkFycm93RG93bi5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJFbnRlclwiLCAgICAgdGhpcy5vbkVudGVyLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkVzY2FwZVwiLCAgICB0aGlzLm9uRXNjYXBlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93TGVmdFwiLCB0aGlzLm9uQXJyb3dMZWZ0LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiSG9tZVwiLCB0aGlzLm9uSG9tZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJFbmRcIiwgIHRoaXMub25FbmQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiQXJyb3dSaWdodFwiLCB0aGlzLm9uQXJyb3dSaWdodC5iaW5kKHRoaXMpKTtcblxuICAgICAgICAvLyBNYWtlIG9ic2lkaWFuLk1lbnUgdGhpbmsgbW91c2Vkb3ducyBvbiBvdXIgY2hpbGQgbWVudShzKSBhcmUgaGFwcGVuaW5nXG4gICAgICAgIC8vIG9uIHVzLCBzbyB3ZSB3b24ndCBjbG9zZSBiZWZvcmUgYW4gYWN0dWFsIGNsaWNrIG9jY3Vyc1xuICAgICAgICBjb25zdCBtZW51ID0gdGhpcztcbiAgICAgICAgYXJvdW5kKHRoaXMuZG9tLCB7Y29udGFpbnMocHJldil7IHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IHByZXYuY2FsbCh0aGlzLCB0YXJnZXQpIHx8IG1lbnUuY2hpbGQ/LmRvbS5jb250YWlucyh0YXJnZXQpO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfX19KTtcbiAgICAgICAgdGhpcy5kb20uYWRkQ2xhc3MoXCJxZS1wb3B1cC1tZW51XCIpO1xuICAgIH1cblxuICAgIG9uRXNjYXBlKCkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9ubG9hZCgpIHtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihudWxsLCBudWxsLCB0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpKTtcbiAgICAgICAgc3VwZXIub25sb2FkKCk7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2hvd1NlbGVjdGVkKCk7XG4gICAgICAgIHRoaXMuZmlyc3RNb3ZlID0gdHJ1ZTtcbiAgICAgICAgLy8gV2Ugd2FpdCB1bnRpbCBub3cgdG8gcmVnaXN0ZXIgc28gdGhhdCBhbnkgaW5pdGlhbCBtb3VzZW92ZXIgb2YgdGhlIG9sZCBtb3VzZSBwb3NpdGlvbiB3aWxsIGJlIHNraXBwZWRcbiAgICAgICAgdGhpcy5yZWdpc3RlcihvbkVsZW1lbnQodGhpcy5kb20sIFwibW91c2VvdmVyXCIsIFwiLm1lbnUtaXRlbVwiLCAoZXZlbnQ6IE1vdXNlRXZlbnQsIHRhcmdldDogSFRNTERpdkVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5maXJzdE1vdmUgJiYgIXRhcmdldC5oYXNDbGFzcyhcImlzLWRpc2FibGVkXCIpICYmICF0aGlzLmNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5pdGVtcy5maW5kSW5kZXgoaSA9PiBpLmRvbSA9PT0gdGFyZ2V0KSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5maXJzdE1vdmUgPSBmYWxzZTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG9udW5sb2FkKCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgc3VwZXIub251bmxvYWQoKTtcbiAgICB9XG5cbiAgICAvLyBPdmVycmlkZSB0byBhdm9pZCBoYXZpbmcgYSBtb3VzZW92ZXIgZXZlbnQgaGFuZGxlclxuICAgIGFkZEl0ZW0oY2I6IChpOiBNZW51SXRlbSkgPT4gYW55KSB7XG4gICAgICAgIGNvbnN0IGkgPSBuZXcgTWVudUl0ZW0odGhpcyk7XG4gICAgICAgIHRoaXMuaXRlbXMucHVzaChpKTtcbiAgICAgICAgY2IoaSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBjb25zdCBtb2QgPSBLZXltYXAuZ2V0TW9kaWZpZXJzKGV2ZW50KTtcbiAgICAgICAgaWYgKGV2ZW50LmtleS5sZW5ndGggPT09IDEgJiYgIWV2ZW50LmlzQ29tcG9zaW5nICYmICghbW9kIHx8IG1vZCA9PT0gXCJTaGlmdFwiKSApIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHRoaXMubWF0Y2ggKyBldmVudC5rZXk7XG4gICAgICAgICAgICAvLyBUaHJvdyBhd2F5IHBpZWNlcyBvZiB0aGUgbWF0Y2ggdW50aWwgc29tZXRoaW5nIG1hdGNoZXMgb3Igbm90aGluZydzIGxlZnRcbiAgICAgICAgICAgIHdoaWxlIChtYXRjaCAmJiAhdGhpcy5zZWFyY2hGb3IobWF0Y2gpKSBtYXRjaCA9IG1hdGNoLnN1YnN0cigxKTtcbiAgICAgICAgICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTZWFyY2hPblRpbWVvdXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7ICAgLy8gYmxvY2sgYWxsIGtleXMgb3RoZXIgdGhhbiBvdXJzXG4gICAgfVxuXG4gICAgc2VhcmNoRm9yKG1hdGNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBtYXRjaC5zcGxpdChcIlwiKS5tYXAoZXNjYXBlUmVnZXgpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5maW5kKG5ldyBSZWdFeHAoXCJeXCIrIHBhcnRzLmpvaW4oXCJcIiksIFwidWlcIikpIHx8XG4gICAgICAgICAgICB0aGlzLmZpbmQobmV3IFJlZ0V4cChcIl5cIisgcGFydHMuam9pbihcIi4qXCIpLCBcInVpXCIpKSB8fFxuICAgICAgICAgICAgdGhpcy5maW5kKG5ldyBSZWdFeHAocGFydHMuam9pbihcIi4qXCIpLCBcInVpXCIpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZpbmQocGF0dGVybjogUmVnRXhwKSB7XG4gICAgICAgIGxldCBwb3MgPSBNYXRoLm1pbigwLCB0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgZm9yIChsZXQgaT10aGlzLml0ZW1zLmxlbmd0aDsgaTsgKytwb3MsIGktLSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbXNbcG9zXT8uZGlzYWJsZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbXNbcG9zXT8uZG9tLnRleHRDb250ZW50Lm1hdGNoKHBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QocG9zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBvbkVudGVyKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW3RoaXMuc2VsZWN0ZWRdO1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgaXRlbS5oYW5kbGVFdmVudChldmVudCk7XG4gICAgICAgICAgICAvLyBPbmx5IGhpZGUgaWYgd2UgZG9uJ3QgaGF2ZSBhIHN1Ym1lbnVcbiAgICAgICAgICAgIGlmICghdGhpcy5jaGlsZCkgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHNlbGVjdChuOiBudW1iZXIsIHNjcm9sbCA9IHRydWUpIHtcbiAgICAgICAgdGhpcy5tYXRjaCA9IFwiXCIgLy8gcmVzZXQgc2VhcmNoIG9uIG1vdmVcbiAgICAgICAgc3VwZXIuc2VsZWN0KG4pO1xuICAgICAgICBpZiAoc2Nyb2xsKSB0aGlzLnNob3dTZWxlY3RlZCgpO1xuICAgIH1cblxuICAgIHNob3dTZWxlY3RlZCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzLml0ZW1zW3RoaXMuc2VsZWN0ZWRdPy5kb207XG4gICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgY29uc3QgbWUgPSB0aGlzLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbXkgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmIChteS50b3AgPCBtZS50b3AgfHwgbXkuYm90dG9tID4gbWUuYm90dG9tKSBlbC5zY3JvbGxJbnRvVmlldygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5zZWxlY3QoKSB7XG4gICAgICAgIHRoaXMuaXRlbXNbdGhpcy5zZWxlY3RlZF0/LmRvbS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgIH1cblxuICAgIG9uRW5kKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgdGhpcy51bnNlbGVjdCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgICAgIHRoaXMub25BcnJvd1VwKGUpO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCA9PT0gdGhpcy5pdGVtcy5sZW5ndGgpIHRoaXMuc2VsZWN0ZWQgPSAtMTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uSG9tZShlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMudW5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IC0xO1xuICAgICAgICB0aGlzLm9uQXJyb3dEb3duKGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25BcnJvd0xlZnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnJvb3RNZW51KCkgIT09IHRoaXMpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkFycm93UmlnaHQoKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIG5vLW9wIGluIGJhc2UgY2xhc3NcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuc2V0Q2hpbGRNZW51KCk7ICAvLyBoaWRlIGNoaWxkIG1lbnUocykgZmlyc3RcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZE1lbnUobWVudT86IE1lbnUpIHtcbiAgICAgICAgdGhpcy5jaGlsZD8uaGlkZSgpO1xuICAgICAgICB0aGlzLmNoaWxkID0gbWVudTtcbiAgICB9XG5cbiAgICByb290TWVudSgpOiBQb3B1cE1lbnUge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBBcHAgPyB0aGlzIDogdGhpcy5wYXJlbnQucm9vdE1lbnUoKTtcbiAgICB9XG5cbiAgICBjYXNjYWRlKHRhcmdldDogSFRNTEVsZW1lbnQsIGV2ZW50PzogTW91c2VFdmVudCwgb25DbG9zZT86ICgpID0+IGFueSwgaE92ZXJsYXAgPSAxNSwgdk92ZXJsYXAgPSA1KSB7XG4gICAgICAgIGNvbnN0IHtsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIHdpZHRofSA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IGxlZnQrTWF0aC5taW4oMTUwLCB3aWR0aC8zKSwgY2VudGVyWSA9ICh0b3ArYm90dG9tKS8yO1xuICAgICAgICBjb25zdCB7aW5uZXJIZWlnaHQsIGlubmVyV2lkdGh9ID0gd2luZG93O1xuXG4gICAgICAgIC8vIFRyeSB0byBjYXNjYWRlIGRvd24gYW5kIHRvIHRoZSByaWdodCBmcm9tIHRoZSBtb3VzZSBvciBob3Jpem9udGFsIGNlbnRlclxuICAgICAgICAvLyBvZiB0aGUgY2xpY2tlZCBpdGVtXG4gICAgICAgIGNvbnN0IHBvaW50ID0ge3g6IGV2ZW50ID8gZXZlbnQuY2xpZW50WCAgLSBoT3ZlcmxhcCA6IGNlbnRlclggLCB5OiBib3R0b20gLSB2T3ZlcmxhcH07XG5cbiAgICAgICAgLy8gTWVhc3VyZSB0aGUgbWVudSBhbmQgc2VlIGlmIGl0IGZpdHNcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XG4gICAgICAgIGNvbnN0IHtvZmZzZXRXaWR0aCwgb2Zmc2V0SGVpZ2h0fSA9IHRoaXMuZG9tO1xuICAgICAgICBjb25zdCBmaXRzQmVsb3cgPSBwb2ludC55ICsgb2Zmc2V0SGVpZ2h0IDwgaW5uZXJIZWlnaHQ7XG4gICAgICAgIGNvbnN0IGZpdHNSaWdodCA9IHBvaW50LnggKyBvZmZzZXRXaWR0aCA8PSBpbm5lcldpZHRoO1xuXG4gICAgICAgIC8vIElmIGl0IGRvZXNuJ3QgZml0IHVuZGVybmVhdGggdXMsIHBvc2l0aW9uIGl0IGF0IHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbiwgdW5sZXNzXG4gICAgICAgIC8vIHRoZSBjbGlja2VkIGl0ZW0gaXMgY2xvc2UgdG8gdGhlIGJvdHRvbSAoaW4gd2hpY2ggY2FzZSwgcG9zaXRpb24gaXQgYWJvdmUgc29cbiAgICAgICAgLy8gdGhlIGl0ZW0gd2lsbCBzdGlsbCBiZSB2aXNpYmxlLilcbiAgICAgICAgaWYgKCFmaXRzQmVsb3cpIHtcbiAgICAgICAgICAgIHBvaW50LnkgPSAoYm90dG9tID4gaW5uZXJIZWlnaHQgLSAoYm90dG9tLXRvcCkpID8gdG9wICsgdk92ZXJsYXA6IGlubmVySGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgaXQgZG9lc24ndCBmaXQgdG8gdGhlIHJpZ2h0LCB0aGVuIHBvc2l0aW9uIGl0IGF0IHRoZSByaWdodCBlZGdlIG9mIHRoZSBzY3JlZW4sXG4gICAgICAgIC8vIHNvIGxvbmcgYXMgaXQgZml0cyBlbnRpcmVseSBhYm92ZSBvciBiZWxvdyB1cy4gIE90aGVyd2lzZSwgcG9zaXRpb24gaXQgdXNpbmcgdGhlXG4gICAgICAgIC8vIGl0ZW0gY2VudGVyLCBzbyBhdCBsZWFzdCBvbmUgc2lkZSBvZiB0aGUgcHJldmlvdXMgbWVudS9pdGVtIHdpbGwgc3RpbGwgYmUgc2Vlbi5cbiAgICAgICAgaWYgKCFmaXRzUmlnaHQpIHtcbiAgICAgICAgICAgIHBvaW50LnggPSAob2Zmc2V0SGVpZ2h0IDwgKGJvdHRvbSAtIHZPdmVybGFwKSB8fCBmaXRzQmVsb3cpID8gaW5uZXJXaWR0aCA6IGNlbnRlclg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEb25lISAgU2hvdyBvdXIgd29yay5cbiAgICAgICAgdGhpcy5zaG93QXRQb3NpdGlvbihwb2ludCk7XG5cbiAgICAgICAgLy8gRmxhZyB0aGUgY2xpY2tlZCBpdGVtIGFzIGFjdGl2ZSwgdW50aWwgd2UgY2xvc2VcbiAgICAgICAgdGFyZ2V0LnRvZ2dsZUNsYXNzKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMub25IaWRlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIEFwcCkgdGFyZ2V0LnRvZ2dsZUNsYXNzKFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBQb3B1cE1lbnUpIHRoaXMucGFyZW50LnNldENoaWxkTWVudSgpO1xuICAgICAgICAgICAgaWYgKG9uQ2xvc2UpIG9uQ2xvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbn1cblxuZnVuY3Rpb24gb25FbGVtZW50PEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudEV2ZW50TWFwPihcbiAgICBlbDogSFRNTEVsZW1lbnQsIHR5cGU6IEssIHNlbGVjdG9yOnN0cmluZyxcbiAgICBsaXN0ZW5lcjogKHRoaXM6IEhUTUxFbGVtZW50LCBldjogSFRNTEVsZW1lbnRFdmVudE1hcFtLXSwgZGVsZWdhdGVUYXJnZXQ6IEhUTUxFbGVtZW50KSA9PiBhbnksXG4gICAgb3B0aW9uczogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zID0gZmFsc2Vcbikge1xuICAgIGVsLm9uKHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgb3B0aW9ucylcbiAgICByZXR1cm4gKCkgPT4gZWwub2ZmKHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG59IiwiaW1wb3J0IHsgS2V5bWFwLCBNb2RhbCwgTm90aWNlLCBUQWJzdHJhY3RGaWxlLCBURmlsZSwgVEZvbGRlciwgVmlldyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgUG9wdXBNZW51LCBNZW51UGFyZW50IH0gZnJvbSBcIi4vbWVudXNcIjtcbmltcG9ydCB7aTE4bn0gZnJvbSBcImkxOG5leHRcIjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGNvbnN0IGkxOG5leHQ6IGkxOG5cbn1cblxuZGVjbGFyZSBtb2R1bGUgXCJvYnNpZGlhblwiIHtcbiAgICBpbnRlcmZhY2UgQXBwIHtcbiAgICAgICAgc2V0QXR0YWNobWVudEZvbGRlcihmb2xkZXI6IFRGb2xkZXIpOiB2b2lkXG4gICAgICAgIGludGVybmFsUGx1Z2luczoge1xuICAgICAgICAgICAgcGx1Z2luczoge1xuICAgICAgICAgICAgICAgIFwiZmlsZS1leHBsb3JlclwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGJvb2xlYW5cbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldmVhbEluRm9sZGVyKGZpbGU6IFRBYnN0cmFjdEZpbGUpOiB2b2lkXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlRmlsZU1vZGFsOiBNb2RhbCAmIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50RmlsZShmaWxlOiBUQWJzdHJhY3RGaWxlKTogdm9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGludGVyZmFjZSBGaWxlTWFuYWdlciB7XG4gICAgICAgIHByb21wdEZvckZvbGRlckRlbGV0aW9uKGZvbGRlcjogVEZvbGRlcik6IHZvaWRcbiAgICAgICAgcHJvbXB0Rm9yRmlsZURlbGV0aW9uKGZpbGU6IFRGaWxlKTogdm9pZFxuICAgICAgICBwcm9tcHRGb3JGaWxlUmVuYW1lKGZpbGU6IFRBYnN0cmFjdEZpbGUpOiB2b2lkXG4gICAgICAgIGNyZWF0ZU5ld01hcmtkb3duRmlsZShwYXJlbnRGb2xkZXI/OiBURm9sZGVyLCBwYXR0ZXJuPzogc3RyaW5nKTogUHJvbWlzZTxURmlsZT5cbiAgICB9XG59XG5cbmludGVyZmFjZSBGaWxlRXhwbG9yZXJWaWV3IGV4dGVuZHMgVmlldyB7XG4gICAgY3JlYXRlQWJzdHJhY3RGaWxlKGtpbmQ6IFwiZmlsZVwiIHwgXCJmb2xkZXJcIiwgcGFyZW50OiBURm9sZGVyLCBuZXdMZWFmPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD5cbiAgICBzdGFydFJlbmFtZUZpbGUoZmlsZTogVEFic3RyYWN0RmlsZSk6IFByb21pc2U8dm9pZD5cbn1cblxuZnVuY3Rpb24gb3B0TmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gaTE4bmV4dC50KGBwbHVnaW5zLmZpbGUtZXhwbG9yZXIubWVudS1vcHQtJHtuYW1lfWApO1xufVxuXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnUgZXh0ZW5kcyBQb3B1cE1lbnUge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogTWVudVBhcmVudCwgZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBzdXBlcihwYXJlbnQpO1xuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgICAgIGNvbnN0IGhhdmVGaWxlRXhwbG9yZXIgPSB0aGlzLmFwcC5pbnRlcm5hbFBsdWdpbnMucGx1Z2luc1tcImZpbGUtZXhwbG9yZXJcIl0uZW5hYmxlZDtcblxuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpID0+IGkuc2V0VGl0bGUob3B0TmFtZShcIm5ldy1ub3RlXCIpKS5zZXRJY29uKFwiY3JlYXRlLW5ld1wiKS5vbkNsaWNrKGFzeW5jIGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0ZpbGUgPSBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5jcmVhdGVOZXdNYXJrZG93bkZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0ZpbGUpIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKEtleW1hcC5pc01vZGlmaWVyKGUsIFwiTW9kXCIpKS5vcGVuRmlsZShuZXdGaWxlLCB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogITAsIHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSwgZVN0YXRlOiB7IHJlbmFtZTogXCJhbGxcIiB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpID0+IGkuc2V0VGl0bGUob3B0TmFtZShcIm5ldy1mb2xkZXJcIikpLnNldEljb24oXCJmb2xkZXJcIikuc2V0RGlzYWJsZWQoIWhhdmVGaWxlRXhwbG9yZXIpLm9uQ2xpY2soZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChoYXZlRmlsZUV4cGxvcmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2l0aEV4cGxvcmVyKGZpbGUpPy5jcmVhdGVBYnN0cmFjdEZpbGUoXCJmb2xkZXJcIiwgZmlsZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlRoZSBGaWxlIEV4cGxvcmVyIGNvcmUgcGx1Z2luIG11c3QgYmUgZW5hYmxlZCB0byBjcmVhdGUgbmV3IGZvbGRlcnNcIilcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRUaXRsZShvcHROYW1lKFwic2V0LWF0dGFjaG1lbnQtZm9sZGVyXCIpKS5zZXRJY29uKFwiaW1hZ2UtZmlsZVwiKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5zZXRBdHRhY2htZW50Rm9sZGVyKGZpbGUpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5hZGRTZXBhcmF0b3IoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZEl0ZW0oaSA9PiB7XG4gICAgICAgICAgICBpLnNldFRpdGxlKG9wdE5hbWUoXCJyZW5hbWVcIikpLnNldEljb24oXCJwZW5jaWxcIikub25DbGljayhldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvbXB0Rm9yRmlsZVJlbmFtZShmaWxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRUaXRsZShvcHROYW1lKFwiZGVsZXRlXCIpKS5zZXRJY29uKFwidHJhc2hcIikub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9tcHRGb3JGb2xkZXJEZWxldGlvbihmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb21wdEZvckZpbGVEZWxldGlvbihmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIgJiYgaGF2ZUZpbGVFeHBsb3Jlcikge1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRJY29uKFwiZm9sZGVyXCIpLnNldFRpdGxlKGkxOG5leHQudCgncGx1Z2lucy5maWxlLWV4cGxvcmVyLmFjdGlvbi1yZXZlYWwtZmlsZScpKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndpdGhFeHBsb3JlcihmaWxlKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsZSA9PT0gd29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkge1xuICAgICAgICAgICAgd29ya3NwYWNlLnRyaWdnZXIoXCJmaWxlLW1lbnVcIiwgdGhpcywgZmlsZSwgXCJxdWljay1leHBsb3JlclwiLCB3b3Jrc3BhY2UuYWN0aXZlTGVhZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3b3Jrc3BhY2UudHJpZ2dlcihcImZpbGUtbWVudVwiLCB0aGlzLCBmaWxlLCBcInF1aWNrLWV4cGxvcmVyXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2l0aEV4cGxvcmVyKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgY29uc3QgZXhwbG9yZXIgPSB0aGlzLmFwcC5pbnRlcm5hbFBsdWdpbnMucGx1Z2luc1tcImZpbGUtZXhwbG9yZXJcIl07XG4gICAgICAgIGlmIChleHBsb3Jlci5lbmFibGVkKSB7XG4gICAgICAgICAgICBleHBsb3Jlci5pbnN0YW5jZS5yZXZlYWxJbkZvbGRlcihmaWxlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFwiZmlsZS1leHBsb3JlclwiKVswXS52aWV3IGFzIEZpbGVFeHBsb3JlclZpZXdcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFRBYnN0cmFjdEZpbGUsIFRGaWxlLCBURm9sZGVyLCBLZXltYXAsIE5vdGljZSwgQXBwLCBNZW51LCBIb3ZlclBhcmVudCwgZGVib3VuY2UsIE1lbnVJdGVtIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBob3ZlclNvdXJjZSwgc3RhcnREcmFnIH0gZnJvbSBcIi4vRXhwbG9yZXJcIjtcbmltcG9ydCB7IFBvcHVwTWVudSwgTWVudVBhcmVudCB9IGZyb20gXCIuL21lbnVzXCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gXCIuL0NvbnRleHRNZW51XCI7XG5pbXBvcnQgeyBhcm91bmQgfSBmcm9tIFwibW9ua2V5LWFyb3VuZFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xuICAgIGludGVyZmFjZSBIb3ZlclBvcG92ZXIge1xuICAgICAgICBoaWRlKCk6IHZvaWRcbiAgICAgICAgaG92ZXJFbDogSFRNTERpdkVsZW1lbnRcbiAgICB9XG4gICAgaW50ZXJmYWNlIEFwcCB7XG4gICAgICAgIHZpZXdSZWdpc3RyeToge1xuICAgICAgICAgICAgaXNFeHRlbnNpb25SZWdpc3RlcmVkKGV4dDogc3RyaW5nKTogYm9vbGVhblxuICAgICAgICAgICAgZ2V0VHlwZUJ5RXh0ZW5zaW9uKGV4dDogc3RyaW5nKTogc3RyaW5nXG4gICAgICAgIH1cbiAgICB9XG4gICAgaW50ZXJmYWNlIFZhdWx0IHtcbiAgICAgICAgZ2V0Q29uZmlnKG9wdGlvbjogc3RyaW5nKTogYW55XG4gICAgICAgIGdldENvbmZpZyhvcHRpb246XCJzaG93VW5zdXBwb3J0ZWRGaWxlc1wiKTogYm9vbGVhblxuICAgIH1cbn1cblxuY29uc3QgYWxwaGFTb3J0ID0gbmV3IEludGwuQ29sbGF0b3IodW5kZWZpbmVkLCB7dXNhZ2U6IFwic29ydFwiLCBzZW5zaXRpdml0eTogXCJiYXNlXCIsIG51bWVyaWM6IHRydWV9KS5jb21wYXJlO1xuXG5jb25zdCBwcmV2aWV3SWNvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbWFya2Rvd246IFwiZG9jdW1lbnRcIixcbiAgICBpbWFnZTogXCJpbWFnZS1maWxlXCIsXG4gICAgYXVkaW86IFwiYXVkaW8tZmlsZVwiLFxuICAgIHBkZjogXCJwZGYtZmlsZVwiLFxufVxuXG5jb25zdCB2aWV3dHlwZUljb25zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIC4uLnByZXZpZXdJY29ucyxcbiAgICAvLyBhZGQgdGhpcmQtcGFydHkgcGx1Z2luc1xuICAgIGV4Y2FsaWRyYXc6IFwiZXhjYWxpZHJhdy1pY29uXCIsXG59O1xuXG5cbi8vIEdsb2JhbCBhdXRvIHByZXZpZXcgbW9kZVxubGV0IGF1dG9QcmV2aWV3ID0gdHJ1ZVxuXG5leHBvcnQgY2xhc3MgRm9sZGVyTWVudSBleHRlbmRzIFBvcHVwTWVudSB7XG5cbiAgICBwYXJlbnRGb2xkZXI6IFRGb2xkZXIgPSB0aGlzLnBhcmVudCBpbnN0YW5jZW9mIEZvbGRlck1lbnUgPyB0aGlzLnBhcmVudC5mb2xkZXIgOiBudWxsO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHBhcmVudDogTWVudVBhcmVudCwgcHVibGljIGZvbGRlcjogVEZvbGRlciwgcHVibGljIHNlbGVjdGVkRmlsZT86IFRBYnN0cmFjdEZpbGUsIHB1YmxpYyBvcGVuZXI/OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBzdXBlcihwYXJlbnQpO1xuICAgICAgICB0aGlzLmxvYWRGaWxlcyhmb2xkZXIsIHNlbGVjdGVkRmlsZSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sICAgICAgICBcIlRhYlwiLCAgIHRoaXMudG9nZ2xlUHJldmlld01vZGUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW1wiTW9kXCJdLCAgIFwiRW50ZXJcIiwgdGhpcy5vbkVudGVyLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtcIkFsdFwiXSwgICBcIkVudGVyXCIsIHRoaXMub25LZXlib2FyZENvbnRleHRNZW51LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCAgICAgICAgXCJcXFxcXCIsICAgIHRoaXMub25LZXlib2FyZENvbnRleHRNZW51LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCAgICAgICAgXCJGMlwiLCAgICB0aGlzLmRvUmVuYW1lLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtcIlNoaWZ0XCJdLCBcIkYyXCIsICAgIHRoaXMuZG9Nb3ZlLmJpbmQodGhpcykpO1xuXG4gICAgICAgIC8vIFNjcm9sbCBwcmV2aWV3IHdpbmRvdyB1cCBhbmQgZG93blxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCAgICAgICBcIlBhZ2VVcFwiLCB0aGlzLmRvU2Nyb2xsLmJpbmQodGhpcywgLTEsIGZhbHNlKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sICAgICBcIlBhZ2VEb3duXCIsIHRoaXMuZG9TY3JvbGwuYmluZCh0aGlzLCAgMSwgZmFsc2UpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXCJNb2RcIl0sICAgIFwiSG9tZVwiLCB0aGlzLmRvU2Nyb2xsLmJpbmQodGhpcywgIDAsIHRydWUpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXCJNb2RcIl0sICAgICBcIkVuZFwiLCB0aGlzLmRvU2Nyb2xsLmJpbmQodGhpcywgIDEsIHRydWUpKTtcblxuICAgICAgICBjb25zdCB7IGRvbSB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgbWVudUl0ZW0gPSBcIi5tZW51LWl0ZW1bZGF0YS1maWxlLXBhdGhdXCI7XG4gICAgICAgIGRvbS5vbihcImNsaWNrXCIsICAgICAgIG1lbnVJdGVtLCB0aGlzLm9uSXRlbUNsaWNrLCB0cnVlKTtcbiAgICAgICAgZG9tLm9uKFwiY29udGV4dG1lbnVcIiwgbWVudUl0ZW0sIHRoaXMub25JdGVtTWVudSApO1xuICAgICAgICBkb20ub24oJ21vdXNlb3ZlcicgICwgbWVudUl0ZW0sIHRoaXMub25JdGVtSG92ZXIpO1xuICAgICAgICBkb20ub24oXCJtb3VzZWRvd25cIiwgICBtZW51SXRlbSwgZSA9PiB7ZS5zdG9wUHJvcGFnYXRpb24oKX0sIHRydWUpOyAgLy8gRml4IGRyYWcgY2FuY2VsbGluZ1xuICAgICAgICBkb20ub24oJ2RyYWdzdGFydCcsICAgbWVudUl0ZW0sIChldmVudCwgdGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICBzdGFydERyYWcodGhpcy5hcHAsIHRhcmdldC5kYXRhc2V0LmZpbGVQYXRoLCBldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdoZW4gd2UgdW5sb2FkLCByZWFjdGl2YXRlIHBhcmVudCBtZW51J3MgaG92ZXIsIGlmIG5lZWRlZFxuICAgICAgICB0aGlzLnJlZ2lzdGVyKCgpID0+IHsgYXV0b1ByZXZpZXcgJiYgdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBGb2xkZXJNZW51ICYmIHRoaXMucGFyZW50LnNob3dQb3BvdmVyKCk7IH0pXG5cbiAgICAgICAgLy8gTWFrZSBvYnNpZGlhbi5NZW51IHRoaW5rIG1vdXNlZG93bnMgb24gb3VyIHBvcHVwcyBhcmUgaGFwcGVuaW5nXG4gICAgICAgIC8vIG9uIHVzLCBzbyB3ZSB3b24ndCBjbG9zZSBiZWZvcmUgYW4gYWN0dWFsIGNsaWNrIG9jY3Vyc1xuICAgICAgICBjb25zdCBtZW51ID0gdGhpcztcbiAgICAgICAgYXJvdW5kKHRoaXMuZG9tLCB7Y29udGFpbnMocHJldil7IHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IHByZXYuY2FsbCh0aGlzLCB0YXJnZXQpIHx8IG1lbnUuX3BvcG92ZXI/LmhvdmVyRWwuY29udGFpbnModGFyZ2V0KTtcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH19fSk7XG4gICAgfVxuXG4gICAgb25BcnJvd0xlZnQoKSB7XG4gICAgICAgIHN1cGVyLm9uQXJyb3dMZWZ0KCk7XG4gICAgICAgIGlmICh0aGlzLnJvb3RNZW51KCkgPT09IHRoaXMpIHRoaXMub3BlbkJyZWFkY3J1bWIodGhpcy5vcGVuZXI/LnByZXZpb3VzRWxlbWVudFNpYmxpbmcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25LZXlib2FyZENvbnRleHRNZW51KCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLml0ZW1zW3RoaXMuc2VsZWN0ZWRdPy5kb20sIGZpbGUgPSB0YXJnZXQgJiYgdGhpcy5maWxlRm9yRG9tKHRhcmdldCk7XG4gICAgICAgIGlmIChmaWxlKSBuZXcgQ29udGV4dE1lbnUodGhpcywgZmlsZSkuY2FzY2FkZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZG9TY3JvbGwoZGlyZWN0aW9uOiBudW1iZXIsIHRvRW5kOiBib29sZWFuLCBldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBjb25zdCBwcmV2aWV3ID0gdGhpcy5ob3ZlclBvcG92ZXI/LmhvdmVyRWwuZmluZChcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXdcIik7XG4gICAgICAgIGlmIChwcmV2aWV3KSB7XG4gICAgICAgICAgICBwcmV2aWV3LnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gdG9FbmQgPyBcImF1dG9cIjogXCJzbW9vdGhcIjtcbiAgICAgICAgICAgIGNvbnN0IG9sZFRvcCA9IHByZXZpZXcuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgY29uc3QgbmV3VG9wID0gKHRvRW5kID8gMCA6IHByZXZpZXcuc2Nyb2xsVG9wKSArIGRpcmVjdGlvbiAqICh0b0VuZCA/IHByZXZpZXcuc2Nyb2xsSGVpZ2h0IDogcHJldmlldy5jbGllbnRIZWlnaHQpO1xuICAgICAgICAgICAgcHJldmlldy5zY3JvbGxUb3AgPSBuZXdUb3A7XG4gICAgICAgICAgICBpZiAoIXRvRW5kKSB7XG4gICAgICAgICAgICAgICAgLy8gUGFnaW5nIHBhc3QgdGhlIGJlZ2lubmluZyBvciBlbmRcbiAgICAgICAgICAgICAgICBpZiAobmV3VG9wID49IHByZXZpZXcuc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25BcnJvd0Rvd24oZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3VG9wIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkVG9wID4gMCkgcHJldmlldy5zY3JvbGxUb3AgPSAwOyBlbHNlIHRoaXMub25BcnJvd1VwKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWF1dG9QcmV2aWV3KSB7IGF1dG9QcmV2aWV3ID0gdHJ1ZTsgdGhpcy5zaG93UG9wb3ZlcigpOyB9XG4gICAgICAgICAgICAvLyBObyBwcmV2aWV3LCBqdXN0IGdvIHRvIG5leHQgb3IgcHJldmlvdXMgaXRlbVxuICAgICAgICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uID4gMCkgdGhpcy5vbkFycm93RG93bihldmVudCk7IGVsc2UgdGhpcy5vbkFycm93VXAoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkb1JlbmFtZSgpIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuY3VycmVudEZpbGUoKVxuICAgICAgICBpZiAoZmlsZSkgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvbXB0Rm9yRmlsZVJlbmFtZShmaWxlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRvTW92ZSgpIHtcbiAgICAgICAgY29uc3QgZXhwbG9yZXJQbHVnaW4gPSB0aGlzLmFwcC5pbnRlcm5hbFBsdWdpbnMucGx1Z2luc1tcImZpbGUtZXhwbG9yZXJcIl07XG4gICAgICAgIGlmICghZXhwbG9yZXJQbHVnaW4uZW5hYmxlZCkge1xuICAgICAgICAgICAgbmV3IE5vdGljZShcIkZpbGUgZXhwbG9yZXIgY29yZSBwbHVnaW4gbXVzdCBiZSBlbmFibGVkIHRvIG1vdmUgZmlsZXMgb3IgZm9sZGVyc1wiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtb2RhbCA9IGV4cGxvcmVyUGx1Z2luLmluc3RhbmNlLm1vdmVGaWxlTW9kYWw7XG4gICAgICAgIG1vZGFsLnNldEN1cnJlbnRGaWxlKHRoaXMuY3VycmVudEZpbGUoKSk7XG4gICAgICAgIG1vZGFsLm9wZW4oKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY3VycmVudEl0ZW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zW3RoaXMuc2VsZWN0ZWRdO1xuICAgIH1cblxuICAgIGN1cnJlbnRGaWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlRm9yRG9tKHRoaXMuY3VycmVudEl0ZW0oKT8uZG9tKVxuICAgIH1cblxuICAgIGZpbGVGb3JEb20odGFyZ2V0RWw6IEhUTUxEaXZFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHsgZmlsZVBhdGggfSA9IHRhcmdldEVsPy5kYXRhc2V0O1xuICAgICAgICBpZiAoZmlsZVBhdGgpIHJldHVybiB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZVBhdGgpO1xuICAgIH1cblxuICAgIGl0ZW1Gb3JQYXRoKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmluZEluZGV4KGkgPT4gaS5kb20uZGF0YXNldC5maWxlUGF0aCA9PT0gZmlsZVBhdGgpO1xuICAgIH1cblxuICAgIG9wZW5CcmVhZGNydW1iKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgdGhpcy5yb290TWVudSgpID09PSB0aGlzKSB7XG4gICAgICAgICAgICBjb25zdCBwcmV2RXhwbG9yYWJsZSA9IHRoaXMub3BlbmVyLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MRGl2RWxlbWVudCkuY2xpY2soKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25BcnJvd1JpZ2h0KCkge1xuICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5jdXJyZW50RmlsZSgpO1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcbiAgICAgICAgICAgIGlmIChmaWxlICE9PSB0aGlzLnNlbGVjdGVkRmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja0ZpbGUoZmlsZSwgdGhpcy5jdXJyZW50SXRlbSgpLmRvbSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkJyZWFkY3J1bWIodGhpcy5vcGVuZXI/Lm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxvYWRGaWxlcyhmb2xkZXI6IFRGb2xkZXIsIHNlbGVjdGVkRmlsZT86IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgY29uc3QgZm9sZGVyTm90ZSA9IHRoaXMuZm9sZGVyTm90ZSh0aGlzLmZvbGRlcik7XG4gICAgICAgIHRoaXMuZG9tLmVtcHR5KCk7IHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgY29uc3QgYWxsRmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRDb25maWcoXCJzaG93VW5zdXBwb3J0ZWRGaWxlc1wiKTtcbiAgICAgICAgY29uc3Qge2NoaWxkcmVuLCBwYXJlbnR9ID0gZm9sZGVyO1xuICAgICAgICBjb25zdCBpdGVtcyA9IGNoaWxkcmVuLnNsaWNlKCkuc29ydCgoYTogVEFic3RyYWN0RmlsZSwgYjogVEFic3RyYWN0RmlsZSkgPT4gYWxwaGFTb3J0KGEubmFtZSwgYi5uYW1lKSlcbiAgICAgICAgY29uc3QgZm9sZGVycyA9IGl0ZW1zLmZpbHRlcihmID0+IGYgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW107XG4gICAgICAgIGNvbnN0IGZpbGVzICAgPSBpdGVtcy5maWx0ZXIoZiA9PiBmIGluc3RhbmNlb2YgVEZpbGUgJiYgZiAhPT0gZm9sZGVyTm90ZSAmJiAoYWxsRmlsZXMgfHwgdGhpcy5maWxlSWNvbihmKSkpIGFzIFRGaWxlW107XG4gICAgICAgIGZvbGRlcnMuc29ydCgoYSwgYikgPT4gYWxwaGFTb3J0KGEubmFtZSwgYi5uYW1lKSk7XG4gICAgICAgIGZpbGVzLnNvcnQoKGEsIGIpID0+IGFscGhhU29ydChhLmJhc2VuYW1lLCBiLmJhc2VuYW1lKSk7XG4gICAgICAgIGlmIChmb2xkZXJOb3RlKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEZpbGUoZm9sZGVyTm90ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvbGRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZm9sZGVyTm90ZSkgdGhpcy5hZGRTZXBhcmF0b3IoKTtcbiAgICAgICAgICAgIGZvbGRlcnMubWFwKHRoaXMuYWRkRmlsZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGZvbGRlcnMubGVuZ3RoIHx8IGZvbGRlck5vdGUpIHRoaXMuYWRkU2VwYXJhdG9yKCk7XG4gICAgICAgICAgICBmaWxlcy5tYXAodGhpcy5hZGRGaWxlLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdChzZWxlY3RlZEZpbGUgPyB0aGlzLml0ZW1Gb3JQYXRoKHNlbGVjdGVkRmlsZS5wYXRoKSA6IDApO1xuICAgIH1cblxuICAgIGZpbGVJY29uKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSByZXR1cm4gXCJmb2xkZXJcIjtcbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgY29uc3Qgdmlld1R5cGUgPSB0aGlzLmFwcC52aWV3UmVnaXN0cnkuZ2V0VHlwZUJ5RXh0ZW5zaW9uKGZpbGUuZXh0ZW5zaW9uKTtcbiAgICAgICAgICAgIGlmICh2aWV3VHlwZSkgcmV0dXJuIHZpZXd0eXBlSWNvbnNbdmlld1R5cGVdID8/IFwiZG9jdW1lbnRcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGVDb3VudDogKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IG51bWJlciA9IChmaWxlOiBUQWJzdHJhY3RGaWxlKSA9PiAoXG4gICAgICAgIGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyID8gZmlsZS5jaGlsZHJlbi5tYXAodGhpcy5maWxlQ291bnQpLnJlZHVjZSgoYSxiKSA9PiBhK2IsIDApIDogKHRoaXMuZmlsZUljb24oZmlsZSkgPyAxIDogMClcbiAgICApXG5cbiAgICBhZGRGaWxlKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgY29uc3QgaWNvbiA9IHRoaXMuZmlsZUljb24oZmlsZSk7XG4gICAgICAgIHRoaXMuYWRkSXRlbShpID0+IHtcbiAgICAgICAgICAgIGkuc2V0VGl0bGUoZmlsZS5uYW1lKTtcbiAgICAgICAgICAgIGkuZG9tLmRhdGFzZXQuZmlsZVBhdGggPSBmaWxlLnBhdGg7XG4gICAgICAgICAgICBpLmRvbS5zZXRBdHRyKFwiZHJhZ2dhYmxlXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgIGkuZG9tLmFkZENsYXNzIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlciA/IFwiaXMtcWUtZm9sZGVyXCIgOiBcImlzLXFlLWZpbGVcIik7XG4gICAgICAgICAgICBpZiAoaWNvbikgaS5zZXRJY29uKGljb24pO1xuICAgICAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgIGkuc2V0VGl0bGUoZmlsZS5iYXNlbmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGUuZXh0ZW5zaW9uICE9PSBcIm1kXCIpIGkuZG9tLmNyZWF0ZURpdih7dGV4dDogZmlsZS5leHRlbnNpb24sIGNsczogW1wibmF2LWZpbGUtdGFnXCIsXCJxZS1leHRlbnNpb25cIl19KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZSAhPT0gdGhpcy5mb2xkZXIucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSB0aGlzLmZpbGVDb3VudChmaWxlKTtcbiAgICAgICAgICAgICAgICBpZiAoY291bnQpIGkuZG9tLmNyZWF0ZURpdih7dGV4dDogXCJcIitjb3VudCwgY2xzOiBcIm5hdi1maWxlLXRhZyBxZS1maWxlLWNvdW50XCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkub25DbGljayhlID0+IHRoaXMub25DbGlja0ZpbGUoZmlsZSwgaS5kb20sIGUpKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0b2dnbGVQcmV2aWV3TW9kZSgpIHtcbiAgICAgICAgaWYgKGF1dG9QcmV2aWV3ID0gIWF1dG9QcmV2aWV3KSB0aGlzLnNob3dQb3BvdmVyKCk7IGVsc2UgdGhpcy5oaWRlUG9wb3ZlcigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVmcmVzaEZpbGVzID0gZGVib3VuY2UoKCkgPT4gdGhpcy5sb2FkRmlsZXModGhpcy5mb2xkZXIsIHRoaXMuY3VycmVudEZpbGUoKSksIDEwMCwgdHJ1ZSk7XG5cbiAgICBvbmxvYWQoKSB7XG4gICAgICAgIHN1cGVyLm9ubG9hZCgpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJjcmVhdGVcIiwgKGZpbGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbGRlciA9PT0gZmlsZS5wYXJlbnQpIHRoaXMucmVmcmVzaEZpbGVzKCk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwicmVuYW1lXCIsIChmaWxlLCBvbGRQYXRoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5mb2xkZXIgPT09IGZpbGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gRGVzdGluYXRpb24gd2FzIGhlcmU7IHJlZnJlc2ggdGhlIGxpc3RcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEZpbGUgPSB0aGlzLml0ZW1Gb3JQYXRoKG9sZFBhdGgpID49IDAgPyBmaWxlIDogdGhpcy5jdXJyZW50RmlsZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZEZpbGVzKHRoaXMuZm9sZGVyLCBzZWxlY3RlZEZpbGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgaXQgaWYgaXQgd2FzIG1vdmVkIG91dCBvZiBoZXJlXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtRm9yUGF0aChvbGRQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJkZWxldGVcIiwgZmlsZSA9PiB0aGlzLnJlbW92ZUl0ZW1Gb3JQYXRoKGZpbGUucGF0aCkpKTtcblxuICAgICAgICAvLyBBY3RpdmF0ZSBwcmV2aWV3IGltbWVkaWF0ZWx5IGlmIGFwcGxpY2FibGVcbiAgICAgICAgaWYgKGF1dG9QcmV2aWV3ICYmIHRoaXMuc2VsZWN0ZWQgIT0gLTEpIHRoaXMuc2hvd1BvcG92ZXIoKTtcbiAgICB9XG5cbiAgICByZW1vdmVJdGVtRm9yUGF0aChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcG9zbiA9IHRoaXMuaXRlbUZvclBhdGgocGF0aCk7XG4gICAgICAgIGlmIChwb3NuIDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1twb3NuXTtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQgPiBwb3NuKSB0aGlzLnNlbGVjdGVkIC09IDE7XG4gICAgICAgIGl0ZW0uZG9tLmRldGFjaCgpXG4gICAgICAgIHRoaXMuaXRlbXMucmVtb3ZlKGl0ZW0pO1xuICAgIH1cblxuICAgIG9uRXNjYXBlKCkge1xuICAgICAgICBzdXBlci5vbkVzY2FwZSgpO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBQb3B1cE1lbnUpIHRoaXMucGFyZW50Lm9uRXNjYXBlKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XG4gICAgICAgIHJldHVybiBzdXBlci5oaWRlKCk7XG4gICAgfVxuXG4gICAgc2V0Q2hpbGRNZW51KG1lbnU6IFBvcHVwTWVudSkge1xuICAgICAgICBzdXBlci5zZXRDaGlsZE1lbnUobWVudSk7XG4gICAgICAgIGlmIChhdXRvUHJldmlldyAmJiB0aGlzLmNhblNob3dQb3BvdmVyKCkpIHRoaXMuc2hvd1BvcG92ZXIoKTtcbiAgICB9XG5cbiAgICBzZWxlY3QoaWR4OiBudW1iZXIsIHNjcm9sbCA9IHRydWUpIHtcbiAgICAgICAgY29uc3Qgb2xkID0gdGhpcy5zZWxlY3RlZDtcbiAgICAgICAgc3VwZXIuc2VsZWN0KGlkeCwgc2Nyb2xsKTtcbiAgICAgICAgaWYgKG9sZCAhPT0gdGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgLy8gc2VsZWN0ZWQgaXRlbSBjaGFuZ2VkOyB0cmlnZ2VyIG5ldyBwb3BvdmVyIG9yIGhpZGUgdGhlIG9sZCBvbmVcbiAgICAgICAgICAgIGlmIChhdXRvUHJldmlldykgdGhpcy5zaG93UG9wb3ZlcigpOyBlbHNlIHRoaXMuaGlkZVBvcG92ZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhpZGVQb3BvdmVyKCkge1xuICAgICAgICB0aGlzLmhvdmVyUG9wb3Zlcj8uaGlkZSgpO1xuICAgIH1cblxuICAgIGNhblNob3dQb3BvdmVyKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY2hpbGQgJiYgdGhpcy52aXNpYmxlO1xuICAgIH1cblxuICAgIHNob3dQb3BvdmVyID0gZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XG4gICAgICAgIGlmICghYXV0b1ByZXZpZXcpIHJldHVybjtcbiAgICAgICAgdGhpcy5tYXliZUhvdmVyKHRoaXMuY3VycmVudEl0ZW0oKT8uZG9tLCBmaWxlID0+IHRoaXMuYXBwLndvcmtzcGFjZS50cmlnZ2VyKCdsaW5rLWhvdmVyJywgdGhpcywgbnVsbCwgZmlsZS5wYXRoLCBcIlwiKSk7XG4gICAgfSwgNTAsIHRydWUpXG5cbiAgICBvbkl0ZW1Ib3ZlciA9IChldmVudDogTW91c2VFdmVudCwgdGFyZ2V0RWw6IEhUTUxEaXZFbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICghYXV0b1ByZXZpZXcpIHRoaXMubWF5YmVIb3Zlcih0YXJnZXRFbCwgZmlsZSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UudHJpZ2dlcignaG92ZXItbGluaycsIHtcbiAgICAgICAgICAgIGV2ZW50LCBzb3VyY2U6IGhvdmVyU291cmNlLCBob3ZlclBhcmVudDogdGhpcywgdGFyZ2V0RWwsIGxpbmt0ZXh0OiBmaWxlLnBhdGhcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG1heWJlSG92ZXIodGFyZ2V0RWw6IEhUTUxEaXZFbGVtZW50LCBjYjogKGZpbGU6IFRGaWxlKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmICghdGhpcy5jYW5TaG93UG9wb3ZlcigpKSByZXR1cm47XG4gICAgICAgIGxldCBmaWxlID0gdGhpcy5maWxlRm9yRG9tKHRhcmdldEVsKVxuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIGZpbGUgPSB0aGlzLmZvbGRlck5vdGUoZmlsZSk7XG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUgJiYgcHJldmlld0ljb25zW3RoaXMuYXBwLnZpZXdSZWdpc3RyeS5nZXRUeXBlQnlFeHRlbnNpb24oZmlsZS5leHRlbnNpb24pXSkge1xuICAgICAgICAgICAgY2IoZmlsZSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmb2xkZXJOb3RlKGZvbGRlcjogVEZvbGRlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHRoaXMuZm9sZGVyTm90ZVBhdGgoZm9sZGVyKSk7XG4gICAgfVxuXG4gICAgZm9sZGVyTm90ZVBhdGgoZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgICAgIHJldHVybiBgJHtmb2xkZXIucGF0aH0vJHtmb2xkZXIubmFtZX0ubWRgO1xuICAgIH1cblxuXG4gICAgX3BvcG92ZXI6IEhvdmVyUGFyZW50W1wiaG92ZXJQb3BvdmVyXCJdO1xuXG4gICAgZ2V0IGhvdmVyUG9wb3ZlcigpIHsgcmV0dXJuIHRoaXMuX3BvcG92ZXI7IH1cblxuICAgIHNldCBob3ZlclBvcG92ZXIocG9wb3Zlcikge1xuICAgICAgICBpZiAocG9wb3ZlciAmJiAhdGhpcy5jYW5TaG93UG9wb3ZlcigpKSB7IHBvcG92ZXIuaGlkZSgpOyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5fcG9wb3ZlciA9IHBvcG92ZXI7XG4gICAgICAgIGlmIChhdXRvUHJldmlldyAmJiBwb3BvdmVyICYmIHRoaXMuY3VycmVudEl0ZW0oKSkge1xuICAgICAgICAgICAgLy8gUG9zaXRpb24gdGhlIHBvcG92ZXIgc28gaXQgZG9lc24ndCBvdmVybGFwIHRoZSBtZW51IGhvcml6b250YWxseSAoYXMgbG9uZyBhcyBpdCBmaXRzKVxuICAgICAgICAgICAgLy8gYW5kIHNvIHRoYXQgaXRzIHZlcnRpY2FsIHBvc2l0aW9uIG92ZXJsYXBzIHRoZSBzZWxlY3RlZCBtZW51IGl0ZW0gKHBsYWNpbmcgdGhlIHRvcCBhXG4gICAgICAgICAgICAvLyBiaXQgYWJvdmUgdGhlIGN1cnJlbnQgaXRlbSwgdW5sZXNzIGl0IHdvdWxkIGdvIG9mZiB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4pXG4gICAgICAgICAgICBjb25zdCBob3ZlckVsID0gcG9wb3Zlci5ob3ZlckVsO1xuICAgICAgICAgICAgaG92ZXJFbC5zaG93KCk7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG1lbnUgPSB0aGlzLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMuY3VycmVudEl0ZW0oKS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgY29udGFpbmVyID0gaG92ZXJFbC5vZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICAgICAgICAgIHBvcHVwSGVpZ2h0ID0gaG92ZXJFbC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICAgICAgbGVmdCA9IE1hdGgubWluKG1lbnUucmlnaHQgKyAyLCBjb250YWluZXIuY2xpZW50V2lkdGggLSBob3ZlckVsLm9mZnNldFdpZHRoKSxcbiAgICAgICAgICAgICAgICB0b3AgPSBNYXRoLm1pbihNYXRoLm1heCgwLCBzZWxlY3RlZC50b3AgLSBwb3B1cEhlaWdodC84KSwgY29udGFpbmVyLmNsaWVudEhlaWdodCAtIHBvcHVwSGVpZ2h0KVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgaG92ZXJFbC5zdHlsZS50b3AgPSB0b3AgKyBcInB4XCI7XG4gICAgICAgICAgICBob3ZlckVsLnN0eWxlLmxlZnQgPSBsZWZ0ICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25JdGVtQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQsIHRhcmdldDogSFRNTERpdkVsZW1lbnQpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZUZvckRvbSh0YXJnZXQpO1xuICAgICAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICAgICAgaWYgKCF0aGlzLm9uQ2xpY2tGaWxlKGZpbGUsIHRhcmdldCwgZXZlbnQpKSB7XG4gICAgICAgICAgICAvLyBLZWVwIGN1cnJlbnQgbWVudSB0cmVlIG9wZW5cbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xpY2tGaWxlKGZpbGU6IFRBYnN0cmFjdEZpbGUsIHRhcmdldDogSFRNTERpdkVsZW1lbnQsIGV2ZW50PzogTW91c2VFdmVudHxLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGlkZVBvcG92ZXIoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5pdGVtRm9yUGF0aChmaWxlLnBhdGgpO1xuICAgICAgICBpZiAoaWR4ID49IDAgJiYgdGhpcy5zZWxlY3RlZCAhPSBpZHgpIHRoaXMuc2VsZWN0KGlkeCk7XG5cbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLnZpZXdSZWdpc3RyeS5pc0V4dGVuc2lvblJlZ2lzdGVyZWQoZmlsZS5leHRlbnNpb24pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dChmaWxlLnBhdGgsIFwiXCIsIGV2ZW50ICYmIEtleW1hcC5pc01vZGlmaWVyKGV2ZW50LCBcIk1vZFwiKSk7XG4gICAgICAgICAgICAgICAgLy8gQ2xvc2UgdGhlIGVudGlyZSBtZW51IHRyZWVcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3RNZW51KCkuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGV2ZW50Py5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3IE5vdGljZShgLiR7ZmlsZS5leHRlbnNpb259IGZpbGVzIGNhbm5vdCBiZSBvcGVuZWQgaW4gT2JzaWRpYW47IFVzZSBcIk9wZW4gaW4gRGVmYXVsdCBBcHBcIiB0byBvcGVuIHRoZW0gZXh0ZXJuYWxseWApO1xuICAgICAgICAgICAgICAgIC8vIGZhbGwgdGhyb3VnaFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZpbGUgPT09IHRoaXMuc2VsZWN0ZWRGaWxlKSB7XG4gICAgICAgICAgICAvLyBUYXJnZXRpbmcgdGhlIGluaXRpYWxseS1zZWxlY3RlZCBzdWJmb2xkZXI6IGdvIHRvIG5leHQgYnJlYWRjcnVtYlxuICAgICAgICAgICAgdGhpcy5vcGVuQnJlYWRjcnVtYih0aGlzLm9wZW5lcj8ubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgcG9wIGEgbmV3IG1lbnUgZm9yIHRoZSBzdWJmb2xkZXJcbiAgICAgICAgICAgIGNvbnN0IGZvbGRlck1lbnUgPSBuZXcgRm9sZGVyTWVudSh0aGlzLCBmaWxlIGFzIFRGb2xkZXIsIHRoaXMuZm9sZGVyTm90ZShmaWxlIGFzIFRGb2xkZXIpKTtcbiAgICAgICAgICAgIGZvbGRlck1lbnUuY2FzY2FkZSh0YXJnZXQsIGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCA/IGV2ZW50IDogdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSXRlbU1lbnUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQsIHRhcmdldDogSFRNTERpdkVsZW1lbnQpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZUZvckRvbSh0YXJnZXQpO1xuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5pdGVtRm9yUGF0aChmaWxlLnBhdGgpO1xuICAgICAgICAgICAgaWYgKGlkeCA+PSAwICYmIHRoaXMuc2VsZWN0ZWQgIT0gaWR4KSB0aGlzLnNlbGVjdChpZHgpO1xuICAgICAgICAgICAgbmV3IENvbnRleHRNZW51KHRoaXMsIGZpbGUpLmNhc2NhZGUodGFyZ2V0LCBldmVudCk7XG4gICAgICAgICAgICAvLyBLZWVwIGN1cnJlbnQgbWVudSB0cmVlIG9wZW5cbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIFRBYnN0cmFjdEZpbGUsIFRGaWxlLCBURm9sZGVyIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBsaXN0LCBlbCB9IGZyb20gXCJyZWRvbVwiO1xuaW1wb3J0IHsgQ29udGV4dE1lbnUgfSBmcm9tIFwiLi9Db250ZXh0TWVudVwiO1xuaW1wb3J0IHsgRm9sZGVyTWVudSB9IGZyb20gXCIuL0ZvbGRlck1lbnVcIjtcblxuZXhwb3J0IGNvbnN0IGhvdmVyU291cmNlID0gXCJxdWljay1leHBsb3Jlcjpmb2xkZXItbWVudVwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xuICAgIGludGVyZmFjZSBBcHAge1xuICAgICAgICBkcmFnTWFuYWdlcjogYW55XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnREcmFnKGFwcDogQXBwLCBwYXRoOiBzdHJpbmcsIGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBpZiAoIXBhdGggfHwgcGF0aCA9PT0gXCIvXCIpIHJldHVybjtcbiAgICBjb25zdCBmaWxlID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBjb25zdCB7IGRyYWdNYW5hZ2VyIH0gPSBhcHA7XG4gICAgY29uc3QgZHJhZ0RhdGEgPSBmaWxlIGluc3RhbmNlb2YgVEZpbGUgPyBkcmFnTWFuYWdlci5kcmFnRmlsZShldmVudCwgZmlsZSkgOiBkcmFnTWFuYWdlci5kcmFnRm9sZGVyKGV2ZW50LCBmaWxlKTtcbiAgICBkcmFnTWFuYWdlci5vbkRyYWdTdGFydChldmVudCwgZHJhZ0RhdGEpO1xufVxuXG5jbGFzcyBFeHBsb3JhYmxlIHtcbiAgICBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cImV4cGxvcmFibGUtbmFtZVwiLz47XG4gICAgc2VwRWwgPSA8c3BhbiBjbGFzcz1cImV4cGxvcmFibGUtc2VwYXJhdG9yXCIvPjtcbiAgICBlbCA9IDxzcGFuIGRyYWdnYWJsZSBjbGFzcz1cImV4cGxvcmFibGUgdGl0bGViYXItYnV0dG9uXCI+e3RoaXMubmFtZUVsfXt0aGlzLnNlcEVsfTwvc3Bhbj47XG4gICAgdXBkYXRlKGRhdGE6IHtmaWxlOiBUQWJzdHJhY3RGaWxlLCBwYXRoOiBzdHJpbmd9LCBpbmRleDogbnVtYmVyLCBpdGVtczogYW55W10pIHtcbiAgICAgICAgY29uc3Qge2ZpbGUsIHBhdGh9ID0gZGF0YTtcbiAgICAgICAgbGV0IG5hbWUgPSBmaWxlLm5hbWUgfHwgcGF0aDtcbiAgICAgICAgdGhpcy5zZXBFbC50b2dnbGUoaW5kZXggPCBpdGVtcy5sZW5ndGgtMSk7XG4gICAgICAgIHRoaXMubmFtZUVsLnRleHRDb250ZW50ID0gbmFtZTtcbiAgICAgICAgdGhpcy5lbC5kYXRhc2V0LnBhcmVudFBhdGggPSBmaWxlLnBhcmVudD8ucGF0aCA/PyBcIi9cIjtcbiAgICAgICAgdGhpcy5lbC5kYXRhc2V0LmZpbGVQYXRoID0gcGF0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHBsb3JlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgbGFzdEZpbGU6IFRBYnN0cmFjdEZpbGUgPSBudWxsO1xuICAgIGxhc3RQYXRoOiBzdHJpbmcgPSBudWxsO1xuICAgIGVsOiBIVE1MRWxlbWVudCA9IDxkaXYgaWQ9XCJxdWljay1leHBsb3JlclwiIC8+O1xuICAgIGxpc3QgPSBsaXN0KHRoaXMuZWwsIEV4cGxvcmFibGUpO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGFwcDogQXBwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICB9XG5cbiAgICBvbmxvYWQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsIHRoaXMudXBkYXRlLCB0aGlzKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgKCkgPT4gdGhpcy51cGRhdGUodGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwicmVuYW1lXCIsIHRoaXMub25GaWxlQ2hhbmdlLCB0aGlzKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImRlbGV0ZVwiLCB0aGlzLm9uRmlsZURlbGV0ZSwgdGhpcykpO1xuXG4gICAgICAgIHRoaXMuZWwub24oXCJjb250ZXh0bWVudVwiLCBcIi5leHBsb3JhYmxlXCIsIChldmVudCwgdGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGZpbGVQYXRoIH0gPSB0YXJnZXQuZGF0YXNldDtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZVBhdGgpO1xuICAgICAgICAgICAgbmV3IENvbnRleHRNZW51KHRoaXMuYXBwLCBmaWxlKS5jYXNjYWRlKHRhcmdldCwgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5lbC5vbihcImNsaWNrXCIsIFwiLmV4cGxvcmFibGVcIiwgKGV2ZW50LCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9sZGVyTWVudSh0YXJnZXQsIGV2ZW50LmlzVHJ1c3RlZCAmJiBldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmVsLm9uKCdkcmFnc3RhcnQnLCBcIi5leHBsb3JhYmxlXCIsIChldmVudCwgdGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICBzdGFydERyYWcodGhpcy5hcHAsIHRhcmdldC5kYXRhc2V0LmZpbGVQYXRoLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRmlsZUNoYW5nZShmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmxhc3RGaWxlKSB0aGlzLnVwZGF0ZShmaWxlKTtcbiAgICB9XG5cbiAgICBvbkZpbGVEZWxldGUoZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBpZiAoZmlsZSA9PT0gdGhpcy5sYXN0RmlsZSkgdGhpcy51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBmb2xkZXJNZW51KG9wZW5lcjogSFRNTEVsZW1lbnQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50LCBldmVudD86IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgeyBmaWxlUGF0aCwgcGFyZW50UGF0aCB9ID0gb3BlbmVyLmRhdGFzZXRcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGFyZW50UGF0aCkgYXMgVEZvbGRlcjtcbiAgICAgICAgcmV0dXJuIG5ldyBGb2xkZXJNZW51KHRoaXMuYXBwLCBmb2xkZXIsIHNlbGVjdGVkLCBvcGVuZXIpLmNhc2NhZGUob3BlbmVyLCBldmVudCk7XG4gICAgfVxuXG4gICAgYnJvd3NlVmF1bHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvbGRlck1lbnUoKTtcbiAgICB9XG5cbiAgICBicm93c2VDdXJyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb2xkZXJNZW51KHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRGl2RWxlbWVudCk7XG4gICAgfVxuXG4gICAgYnJvd3NlRmlsZShmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSByZXR1cm4gdGhpcy5icm93c2VDdXJyZW50KCk7XG4gICAgICAgIGxldCBtZW51OiBGb2xkZXJNZW51O1xuICAgICAgICBsZXQgb3BlbmVyOiBIVE1MRWxlbWVudCA9IHRoaXMuZWwuZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHBhdGggPSBbXSwgcGFydHMgPSBmaWxlLnBhdGguc3BsaXQoXCIvXCIpLmZpbHRlcihwPT5wKTtcbiAgICAgICAgd2hpbGUgKG9wZW5lciAmJiBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChwYXJ0c1swXSk7XG4gICAgICAgICAgICBpZiAob3BlbmVyLmRhdGFzZXQuZmlsZVBhdGggIT09IHBhdGguam9pbihcIi9cIikpIHtcbiAgICAgICAgICAgICAgICBtZW51ID0gdGhpcy5mb2xkZXJNZW51KG9wZW5lcik7XG4gICAgICAgICAgICAgICAgcGF0aC5wb3AoKTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgICAgIG9wZW5lciA9IG9wZW5lci5uZXh0RWxlbWVudFNpYmxpbmcgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKG1lbnUgJiYgcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gocGFydHMuc2hpZnQoKSk7XG4gICAgICAgICAgICBjb25zdCBpZHggPSBtZW51Lml0ZW1Gb3JQYXRoKHBhdGguam9pbihcIi9cIikpO1xuICAgICAgICAgICAgaWYgKGlkeCA9PSAtMSkgYnJlYWtcbiAgICAgICAgICAgIG1lbnUuc2VsZWN0KGlkeCk7XG4gICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoIHx8IGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgbWVudS5vbkFycm93UmlnaHQoKTtcbiAgICAgICAgICAgICAgICBtZW51ID0gbWVudS5jaGlsZCBhcyBGb2xkZXJNZW51O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZW51O1xuICAgIH1cblxuICAgIHVwZGF0ZShmaWxlPzogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBmaWxlID8/PSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCIvXCIpO1xuICAgICAgICBpZiAoZmlsZSA9PSB0aGlzLmxhc3RGaWxlICYmIGZpbGUucGF0aCA9PSB0aGlzLmxhc3RQYXRoKSByZXR1cm47XG4gICAgICAgIHRoaXMubGFzdEZpbGUgPSBmaWxlO1xuICAgICAgICB0aGlzLmxhc3RQYXRoID0gZmlsZS5wYXRoO1xuICAgICAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoZmlsZSkge1xuICAgICAgICAgICAgcGFydHMudW5zaGlmdCh7IGZpbGUsIHBhdGg6IGZpbGUucGF0aCB9KTtcbiAgICAgICAgICAgIGZpbGUgPSBmaWxlLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgdGhpcy5saXN0LnVwZGF0ZShwYXJ0cyk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQge01lbnVJdGVtLCBQbHVnaW4sIFRBYnN0cmFjdEZpbGUsIFRGb2xkZXJ9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHttb3VudCwgdW5tb3VudH0gZnJvbSBcInJlZG9tXCI7XG5pbXBvcnQge0V4cGxvcmVyLCBob3ZlclNvdXJjZX0gZnJvbSBcIi4vRXhwbG9yZXJcIjtcblxuaW1wb3J0IFwiLi9yZWRvbS1qc3hcIjtcbmltcG9ydCBcIi4vc3R5bGVzLnNjc3NcIlxuXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xuICAgIGludGVyZmFjZSBXb3Jrc3BhY2Uge1xuICAgICAgICByZWdpc3RlckhvdmVyTGlua1NvdXJjZShzb3VyY2U6IHN0cmluZywgaW5mbzoge2Rpc3BsYXk6IHN0cmluZywgZGVmYXVsdE1vZD86IGJvb2xlYW59KTogdm9pZFxuICAgICAgICB1bnJlZ2lzdGVySG92ZXJMaW5rU291cmNlKHNvdXJjZTogc3RyaW5nKTogdm9pZFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBQbHVnaW4ge1xuICAgIHN0YXR1c2Jhckl0ZW06IEhUTUxFbGVtZW50XG4gICAgZXhwbG9yZXI6IEV4cGxvcmVyXG5cbiAgICBvbmxvYWQoKSB7XG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5ib2R5LmZpbmQoXCIudGl0bGViYXIgLnRpdGxlYmFyLWJ1dHRvbi1jb250YWluZXIubW9kLWxlZnRcIik7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyKCgpID0+IHVubW91bnQoYnV0dG9uQ29udGFpbmVyLCB0aGlzLmV4cGxvcmVyKSk7XG4gICAgICAgICAgICBtb3VudChidXR0b25Db250YWluZXIsIHRoaXMuZXhwbG9yZXIgPSBuZXcgRXhwbG9yZXIodGhpcy5hcHApKTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5leHBsb3Jlcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5yZWdpc3RlckhvdmVyTGlua1NvdXJjZShob3ZlclNvdXJjZSwge1xuICAgICAgICAgICAgZGlzcGxheTogJ1F1aWNrIEV4cGxvcmVyJywgZGVmYXVsdE1vZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJicm93c2UtdmF1bHRcIiwgICBuYW1lOiBcIkJyb3dzZSB2YXVsdFwiLCAgICAgICAgICBjYWxsYmFjazogKCkgPT4geyB0aGlzLmV4cGxvcmVyPy5icm93c2VWYXVsdCgpOyB9LCB9KTtcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwiYnJvd3NlLWN1cnJlbnRcIiwgbmFtZTogXCJCcm93c2UgY3VycmVudCBmb2xkZXJcIiwgY2FsbGJhY2s6ICgpID0+IHsgdGhpcy5leHBsb3Jlcj8uYnJvd3NlQ3VycmVudCgpOyB9LCB9KTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1tZW51XCIsIChtZW51LCBmaWxlLCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtOiBNZW51SXRlbVxuICAgICAgICAgICAgaWYgKHNvdXJjZSAhPT0gXCJxdWljay1leHBsb3JlclwiKSBtZW51LmFkZEl0ZW0oaSA9PiB7XG4gICAgICAgICAgICAgICAgaS5zZXRJY29uKFwiZm9sZGVyXCIpLnNldFRpdGxlKFwiU2hvdyBpbiBRdWljayBFeHBsb3JlclwiKS5vbkNsaWNrKGUgPT4geyB0aGlzLmV4cGxvcmVyPy5icm93c2VGaWxlKGZpbGUpOyB9KTtcbiAgICAgICAgICAgICAgICBpdGVtID0gaTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldmVhbEZpbGUgPSBpMThuZXh0LnQoYHBsdWdpbnMuZmlsZS1leHBsb3Jlci5hY3Rpb24tcmV2ZWFsLWZpbGVgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBtZW51Lml0ZW1zLmZpbmRJbmRleChpID0+IGkudGl0bGVFbC50ZXh0Q29udGVudCA9PT0gcmV2ZWFsRmlsZSk7XG4gICAgICAgICAgICAgICAgKG1lbnUuZG9tIGFzIEhUTUxFbGVtZW50KS5pbnNlcnRCZWZvcmUoaXRlbS5kb20sIG1lbnUuaXRlbXNbaWR4KzFdLmRvbSk7XG4gICAgICAgICAgICAgICAgbWVudS5pdGVtcy5yZW1vdmUoaXRlbSk7XG4gICAgICAgICAgICAgICAgbWVudS5pdGVtcy5zcGxpY2UoaWR4KzEsIDAsIGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRGb2xkZXIucHJvdG90eXBlLCBcImJhc2VuYW1lXCIsIHtnZXQoKXsgcmV0dXJuIHRoaXMubmFtZTsgfSwgY29uZmlndXJhYmxlOiB0cnVlfSlcbiAgICB9XG5cbiAgICBvbnVubG9hZCgpIHtcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnVucmVnaXN0ZXJIb3ZlckxpbmtTb3VyY2UoaG92ZXJTb3VyY2UpO1xuICAgIH1cblxufVxuIl0sIm5hbWVzIjpbIk1lbnUiLCJBcHAiLCJkZWJvdW5jZSIsIlNjb3BlIiwiTWVudUl0ZW0iLCJLZXltYXAiLCJURm9sZGVyIiwiTm90aWNlIiwiVEZpbGUiLCJDb21wb25lbnQiLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxTQUFTLFVBQVUsRUFBRSxLQUFLLEVBQUU7QUFDNUIsRUFBRSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLEVBQUUsSUFBSSxPQUFPLEdBQUcsRUFB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QUFDLE1BQW1CLEVBQUUsS0FBa0IsRUFBRSxPQUFtQixFQUFFLFFBQVEsR0FBRyxFQUFFLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBQTtBQUM3RixRQUFBLE1BQU0sRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDbkUsTUFBQSxPQUFPLEdBQUcsSUFBSSxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBMkI7QUFDdEUsUUFBQSxNQUFNLEVBQUMsV0FBVyxFQUFFLFVBQVUsRUFBQyxHQUFHLE1BQU0sQ0FBQzs7O1FBSXpDLE1BQU0sS0FBSyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFJLFFBQVEsR0FBRyxPQUFPLEVBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxRQUFRLEVBQUMsQ0FBQzs7UUFHdEYsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sRUFBQyxXQUFXLEVBQUUsWUFBWSxFQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUM3QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDdkQsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxXQUFXLElBQUksVUFBVSxDQUFDOzs7O1FBS3RELElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDWixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLFdBQVcsSUFBSSxNQUFNLEdBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLFFBQVEsR0FBRSxXQUFXLENBQUM7QUFDakYsU0FBQTs7OztRQUtELElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDWixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxJ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Q0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7UUFHaEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFRLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQU0sVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFLLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBTSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTVFLFFBQUEsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNyQixNQUFNLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQztBQUM5QyxRQUFBLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFRLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELEdBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFFLENBQUM7UUFDbEQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUksUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsRCxHQUFHLENBQUMsRUFBRSxDQUFDLFdB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

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
    constructor(parent, app = parent instanceof obsidian.App ? parent : parent.app) {
        super(app);
        this.parent = parent;
        this.app = app;
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
        else if (file instanceof obsidian.TFile) {
            const pop = this.hoverPopover;
            if (pop && pop.rootSplit) {
                this.app.workspace.iterateLeaves(leaf => {
                    if (leaf.view instanceof obsidian.FileView && leaf.view.file === file) {
                        pop.togglePin(true); // Ensure the popup won't close
                        this.onEscape(); // when we close
                        if (leaf.view instanceof obsidian.MarkdownView) {
                            // Switch to edit mode -- keyboard's not much good without it!
                            leaf.setViewState({
                                type: leaf.view.getViewType(),
                                state: { file: file.path, mode: "source" }
                            }).then(() => this.app.workspace.setActiveLeaf(leaf, false, true));
                        }
                        else {
                            // Something like Kanban or Excalidraw, might not support focus flag,
                            // so make sure the current pane doesn't hang onto it
                            document.activeElement?.blur();
                            this.app.workspace.setActiveLeaf(leaf, false, true);
                        }
                    }
                    return true; // only target the first leaf, whether it matches or not
                }, pop.rootSplit);
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
        this.hoverPopover = null;
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
        const old = this._popover;
        if (old && popover !== old) {
            this._popover = null;
            old.onHover = false; // Force unpinned Hover Editors to close
            old.hide();
        }
        if (popover && !this.canShowPopover()) {
            popover.onHover = false; // Force unpinned Hover Editors to close
            popover.hide();
            popover = null;
        }
        this._popover = popover;
        if (autoPreview && popover && this.currentItem()) {
            // Override auto-pinning if we are generating auto-previews, to avoid
            // generating huge numbers of popovers
            popover.togglePin?.(false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzLy5wbnBtL3JlZG9tQDMuMjcuMS9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9tb25rZXktYXJvdW5kQDIuMy4wL25vZGVfbW9kdWxlcy9tb25rZXktYXJvdW5kL21qcy9pbmRleC5qcyIsInNyYy9tZW51cy50cyIsInNyYy9Db250ZXh0TWVudS50cyIsInNyYy9Gb2xkZXJNZW51LnRzIiwic3JjL0V4cGxvcmVyLnRzeCIsInNyYy9xdWljay1leHBsb3Jlci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gcGFyc2VRdWVyeSAocXVlcnkpIHtcbiAgdmFyIGNodW5rcyA9IHF1ZXJ5LnNwbGl0KC8oWyMuXSkvKTtcbiAgdmFyIHRhZ05hbWUgPSAnJztcbiAgdmFyIGlkID0gJyc7XG4gIHZhciBjbGFzc05hbWVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY2h1bmsgPSBjaHVua3NbaV07XG4gICAgaWYgKGNodW5rID09PSAnIycpIHtcbiAgICAgIGlkID0gY2h1bmtzWysraV07XG4gICAgfSBlbHNlIGlmIChjaHVuayA9PT0gJy4nKSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2goY2h1bmtzWysraV0pO1xuICAgIH0gZWxzZSBpZiAoY2h1bmsubGVuZ3RoKSB7XG4gICAgICB0YWdOYW1lID0gY2h1bms7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWc6IHRhZ05hbWUgfHwgJ2RpdicsXG4gICAgaWQ6IGlkLFxuICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lcy5qb2luKCcgJylcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCAocXVlcnksIG5zKSB7XG4gIHZhciByZWYgPSBwYXJzZVF1ZXJ5KHF1ZXJ5KTtcbiAgdmFyIHRhZyA9IHJlZi50YWc7XG4gIHZhciBpZCA9IHJlZi5pZDtcbiAgdmFyIGNsYXNzTmFtZSA9IHJlZi5jbGFzc05hbWU7XG4gIHZhciBlbGVtZW50ID0gbnMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZykgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cbiAgaWYgKGlkKSB7XG4gICAgZWxlbWVudC5pZCA9IGlkO1xuICB9XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGlmIChucykge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHVubW91bnQgKHBhcmVudCwgY2hpbGQpIHtcbiAgdmFyIHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgdmFyIGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZEVsLnBhcmVudE5vZGUpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKTtcblxuICAgIHBhcmVudEVsLnJlbW92ZUNoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiBkb1VubW91bnQgKGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCkge1xuICB2YXIgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsICdvbnVubW91bnQnKTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIHZhciBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlIHx8IHt9O1xuXG4gICAgZm9yICh2YXIgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5IChob29rcykge1xuICBpZiAoaG9va3MgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBob29rcykge1xuICAgIGlmIChob29rc1trZXldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiBnbG9iYWwgTm9kZSwgU2hhZG93Um9vdCAqL1xuXG52YXIgaG9va05hbWVzID0gWydvbm1vdW50JywgJ29ucmVtb3VudCcsICdvbnVubW91bnQnXTtcbnZhciBzaGFkb3dSb290QXZhaWxhYmxlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ1NoYWRvd1Jvb3QnIGluIHdpbmRvdztcblxuZnVuY3Rpb24gbW91bnQgKHBhcmVudCwgY2hpbGQsIGJlZm9yZSwgcmVwbGFjZSkge1xuICB2YXIgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICB2YXIgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkICE9PSBjaGlsZEVsKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX3ZpZXcgPSBjaGlsZDtcbiAgfVxuXG4gIHZhciB3YXNNb3VudGVkID0gY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQ7XG4gIHZhciBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgKG9sZFBhcmVudCAhPT0gcGFyZW50RWwpKSB7XG4gICAgZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBvbGRQYXJlbnQpO1xuICB9XG5cbiAgaWYgKGJlZm9yZSAhPSBudWxsKSB7XG4gICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50RWwuaW5zZXJ0QmVmb3JlKGNoaWxkRWwsIGdldEVsKGJlZm9yZSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChjaGlsZEVsKTtcbiAgfVxuXG4gIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpO1xuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlciAoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSAnb25tb3VudCcgfHwgZXZlbnROYW1lID09PSAnb25yZW1vdW50Jykge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAnb251bm1vdW50Jykge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGhvb2tzID0gZWwuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgaWYgKCFob29rcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB2aWV3ID0gZWwuX19yZWRvbV92aWV3O1xuICB2YXIgaG9va0NvdW50ID0gMDtcblxuICB2aWV3ICYmIHZpZXdbZXZlbnROYW1lXSAmJiB2aWV3W2V2ZW50TmFtZV0oKTtcblxuICBmb3IgKHZhciBob29rIGluIGhvb2tzKSB7XG4gICAgaWYgKGhvb2spIHtcbiAgICAgIGhvb2tDb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChob29rQ291bnQpIHtcbiAgICB2YXIgdHJhdmVyc2UgPSBlbC5maXJzdENoaWxkO1xuXG4gICAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgICB2YXIgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQgKGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KSB7XG4gIHZhciBob29rcyA9IGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgfHwgKGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fSk7XG4gIHZhciByZW1vdW50ID0gKHBhcmVudEVsID09PSBvbGRQYXJlbnQpO1xuICB2YXIgaG9va3NGb3VuZCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsaXN0ID0gaG9va05hbWVzOyBpIDwgbGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHZhciBob29rTmFtZSA9IGxpc3RbaV07XG5cbiAgICBpZiAoIXJlbW91bnQpIHsgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkgeyAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICB2YXIgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgKHRyYXZlcnNlICYmIHRyYXZlcnNlLl9fcmVkb21fbW91bnRlZCkpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIHJlbW91bnQgPyAnb25yZW1vdW50JyA6ICdvbm1vdW50Jyk7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIHZhciBwYXJlbnQgPSB0cmF2ZXJzZS5wYXJlbnROb2RlO1xuICAgIHZhciBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlIHx8ICh0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9KTtcblxuICAgIGZvciAodmFyIGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0cmF2ZXJzZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8XG4gICAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmICh0cmF2ZXJzZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpKSB8fFxuICAgICAgICAocGFyZW50ICYmIHBhcmVudC5fX3JlZG9tX21vdW50ZWQpXG4gICAgICApIHtcbiAgICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgcmVtb3VudCA/ICdvbnJlbW91bnQnIDogJ29ubW91bnQnKTtcbiAgICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZSAodmlldywgYXJnMSwgYXJnMikge1xuICB2YXIgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2V0U3R5bGVWYWx1ZShlbCwgYXJnMSwgYXJnMik7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0U3R5bGVWYWx1ZSAoZWwsIGtleSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICBlbC5zdHlsZVtrZXldID0gJyc7XG4gIH0gZWxzZSB7XG4gICAgZWwuc3R5bGVba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cbnZhciB4bGlua25zID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xuXG5mdW5jdGlvbiBzZXRBdHRyICh2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIHNldEF0dHJJbnRlcm5hbCh2aWV3LCBhcmcxLCBhcmcyKTtcbn1cblxuZnVuY3Rpb24gc2V0QXR0ckludGVybmFsICh2aWV3LCBhcmcxLCBhcmcyLCBpbml0aWFsKSB7XG4gIHZhciBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIHZhciBpc09iaiA9IHR5cGVvZiBhcmcxID09PSAnb2JqZWN0JztcblxuICBpZiAoaXNPYmopIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpc1NWRyA9IGVsIGluc3RhbmNlb2YgU1ZHRWxlbWVudDtcbiAgICB2YXIgaXNGdW5jID0gdHlwZW9mIGFyZzIgPT09ICdmdW5jdGlvbic7XG5cbiAgICBpZiAoYXJnMSA9PT0gJ3N0eWxlJyAmJiB0eXBlb2YgYXJnMiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNldFN0eWxlKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKGlzU1ZHICYmIGlzRnVuYykge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSBpZiAoYXJnMSA9PT0gJ2RhdGFzZXQnKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIChhcmcxICE9PSAnbGlzdCcpKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiAoYXJnMSA9PT0gJ3hsaW5rJykpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSAnY2xhc3MnKSB7XG4gICAgICAgIGFyZzIgPSBlbC5jbGFzc05hbWUgKyAnICcgKyBhcmcyO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFhsaW5rIChlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFhsaW5rKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rbnMsIGFyZzEsIGFyZzIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0RGF0YSAoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXREYXRhKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLmRhdGFzZXRbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZWwuZGF0YXNldFthcmcxXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdGV4dCAoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgoc3RyICE9IG51bGwpID8gc3RyIDogJycpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsIChlbGVtZW50LCBhcmdzLCBpbml0aWFsKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsaXN0ID0gYXJnczsgaSA8IGxpc3QubGVuZ3RoOyBpICs9IDEpIHtcbiAgICB2YXIgYXJnID0gbGlzdFtpXTtcblxuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgYXJnO1xuXG4gICAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFyZyhlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRleHQoYXJnKSk7XG4gICAgfSBlbHNlIGlmIChpc05vZGUoZ2V0RWwoYXJnKSkpIHtcbiAgICAgIG1vdW50KGVsZW1lbnQsIGFyZyk7XG4gICAgfSBlbHNlIGlmIChhcmcubGVuZ3RoKSB7XG4gICAgICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZywgaW5pdGlhbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsZW1lbnQsIGFyZywgbnVsbCwgaW5pdGlhbCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVuc3VyZUVsIChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09ICdzdHJpbmcnID8gaHRtbChwYXJlbnQpIDogZ2V0RWwocGFyZW50KTtcbn1cblxuZnVuY3Rpb24gZ2V0RWwgKHBhcmVudCkge1xuICByZXR1cm4gKHBhcmVudC5ub2RlVHlwZSAmJiBwYXJlbnQpIHx8ICghcGFyZW50LmVsICYmIHBhcmVudCkgfHwgZ2V0RWwocGFyZW50LmVsKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlIChhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiBhcmcubm9kZVR5cGU7XG59XG5cbnZhciBodG1sQ2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gaHRtbCAocXVlcnkpIHtcbiAgdmFyIGFyZ3MgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgYXJnc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICB2YXIgZWxlbWVudDtcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBlbGVtZW50ID0gbWVtb2l6ZUhUTUwocXVlcnkpLmNsb25lTm9kZShmYWxzZSk7XG4gIH0gZWxzZSBpZiAoaXNOb2RlKHF1ZXJ5KSkge1xuICAgIGVsZW1lbnQgPSBxdWVyeS5jbG9uZU5vZGUoZmFsc2UpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IChGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseSggUXVlcnksIFsgbnVsbCBdLmNvbmNhdCggYXJncykgKSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgYXJndW1lbnQgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG52YXIgZWwgPSBodG1sO1xudmFyIGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwgKHF1ZXJ5KSB7XG4gIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGFyZ3NbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgdmFyIGNsb25lID0gbWVtb2l6ZUhUTUwocXVlcnkpO1xuXG4gIHJldHVybiBodG1sLmJpbmQuYXBwbHkoaHRtbCwgWyB0aGlzLCBjbG9uZSBdLmNvbmNhdCggYXJncyApKTtcbn07XG5cbmZ1bmN0aW9uIG1lbW9pemVIVE1MIChxdWVyeSkge1xuICByZXR1cm4gaHRtbENhY2hlW3F1ZXJ5XSB8fCAoaHRtbENhY2hlW3F1ZXJ5XSA9IGNyZWF0ZUVsZW1lbnQocXVlcnkpKTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4gKHBhcmVudCkge1xuICB2YXIgY2hpbGRyZW4gPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgY2hpbGRyZW5bIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgdmFyIHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgdmFyIGN1cnJlbnQgPSB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkcmVuLCBwYXJlbnRFbC5maXJzdENoaWxkKTtcblxuICB3aGlsZSAoY3VycmVudCkge1xuICAgIHZhciBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlIChwYXJlbnQsIGNoaWxkcmVuLCBfY3VycmVudCkge1xuICB2YXIgY3VycmVudCA9IF9jdXJyZW50O1xuXG4gIHZhciBjaGlsZEVscyA9IG5ldyBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAodmFyIGkkMSA9IDA7IGkkMSA8IGNoaWxkcmVuLmxlbmd0aDsgaSQxKyspIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpJDFdO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkRWwgPSBjaGlsZEVsc1tpJDFdO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgdmFyIG5leHQgPSBjdXJyZW50ICYmIGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICB2YXIgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgdmFyIHJlcGxhY2UgPSBleGlzdHMgJiYgbmV4dCA9PT0gY2hpbGRFbHNbaSQxICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sIChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbnZhciBMaXN0UG9vbCA9IGZ1bmN0aW9uIExpc3RQb29sIChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHRoaXMuVmlldyA9IFZpZXc7XG4gIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgdGhpcy5sb29rdXAgPSB7fTtcbiAgdGhpcy5vbGRWaWV3cyA9IFtdO1xuICB0aGlzLnZpZXdzID0gW107XG5cbiAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgdGhpcy5rZXkgPSB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nID8ga2V5IDogcHJvcEtleShrZXkpO1xuICB9XG59O1xuXG5MaXN0UG9vbC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChkYXRhLCBjb250ZXh0KSB7XG4gIHZhciByZWYgPSB0aGlzO1xuICAgIHZhciBWaWV3ID0gcmVmLlZpZXc7XG4gICAgdmFyIGtleSA9IHJlZi5rZXk7XG4gICAgdmFyIGluaXREYXRhID0gcmVmLmluaXREYXRhO1xuICB2YXIga2V5U2V0ID0ga2V5ICE9IG51bGw7XG5cbiAgdmFyIG9sZExvb2t1cCA9IHRoaXMubG9va3VwO1xuICB2YXIgbmV3TG9va3VwID0ge307XG5cbiAgdmFyIG5ld1ZpZXdzID0gbmV3IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgdmFyIG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGRhdGFbaV07XG4gICAgdmFyIHZpZXcgPSAodm9pZCAwKTtcblxuICAgIGlmIChrZXlTZXQpIHtcbiAgICAgIHZhciBpZCA9IGtleShpdGVtKTtcblxuICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgbmV3TG9va3VwW2lkXSA9IHZpZXc7XG4gICAgICB2aWV3Ll9fcmVkb21faWQgPSBpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlldyA9IG9sZFZpZXdzW2ldIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICB9XG4gICAgdmlldy51cGRhdGUgJiYgdmlldy51cGRhdGUoaXRlbSwgaSwgZGF0YSwgY29udGV4dCk7XG5cbiAgICB2YXIgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgIGVsLl9fcmVkb21fdmlldyA9IHZpZXc7XG4gICAgbmV3Vmlld3NbaV0gPSB2aWV3O1xuICB9XG5cbiAgdGhpcy5vbGRWaWV3cyA9IG9sZFZpZXdzO1xuICB0aGlzLnZpZXdzID0gbmV3Vmlld3M7XG5cbiAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gIHRoaXMubG9va3VwID0gbmV3TG9va3VwO1xufTtcblxuZnVuY3Rpb24gcHJvcEtleSAoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QgKHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxudmFyIExpc3QgPSBmdW5jdGlvbiBMaXN0IChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgdGhpcy5WaWV3ID0gVmlldztcbiAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB0aGlzLnZpZXdzID0gW107XG4gIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgdGhpcy5lbCA9IGVuc3VyZUVsKHBhcmVudCk7XG4gIHRoaXMua2V5U2V0ID0ga2V5ICE9IG51bGw7XG59O1xuXG5MaXN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKGRhdGEsIGNvbnRleHQpIHtcbiAgICBpZiAoIGRhdGEgPT09IHZvaWQgMCApIGRhdGEgPSBbXTtcblxuICB2YXIgcmVmID0gdGhpcztcbiAgICB2YXIga2V5U2V0ID0gcmVmLmtleVNldDtcbiAgdmFyIG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICB0aGlzLnBvb2wudXBkYXRlKGRhdGEsIGNvbnRleHQpO1xuXG4gIHZhciByZWYkMSA9IHRoaXMucG9vbDtcbiAgICB2YXIgdmlld3MgPSByZWYkMS52aWV3cztcbiAgICB2YXIgbG9va3VwID0gcmVmJDEubG9va3VwO1xuXG4gIGlmIChrZXlTZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2xkVmlldyA9IG9sZFZpZXdzW2ldO1xuICAgICAgdmFyIGlkID0gb2xkVmlldy5fX3JlZG9tX2lkO1xuXG4gICAgICBpZiAobG9va3VwW2lkXSA9PSBudWxsKSB7XG4gICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgIHVubW91bnQodGhpcywgb2xkVmlldyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgdmlld3MubGVuZ3RoOyBpJDErKykge1xuICAgIHZhciB2aWV3ID0gdmlld3NbaSQxXTtcblxuICAgIHZpZXcuX19yZWRvbV9pbmRleCA9IGkkMTtcbiAgfVxuXG4gIHNldENoaWxkcmVuKHRoaXMsIHZpZXdzKTtcblxuICBpZiAoa2V5U2V0KSB7XG4gICAgdGhpcy5sb29rdXAgPSBsb29rdXA7XG4gIH1cbiAgdGhpcy52aWV3cyA9IHZpZXdzO1xufTtcblxuTGlzdC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRMaXN0IChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuZnVuY3Rpb24gcGxhY2UgKFZpZXcsIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgUGxhY2UoVmlldywgaW5pdERhdGEpO1xufVxuXG52YXIgUGxhY2UgPSBmdW5jdGlvbiBQbGFjZSAoVmlldywgaW5pdERhdGEpIHtcbiAgdGhpcy5lbCA9IHRleHQoJycpO1xuICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgdGhpcy52aWV3ID0gbnVsbDtcbiAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gIGlmIChWaWV3IGluc3RhbmNlb2YgTm9kZSkge1xuICAgIHRoaXMuX2VsID0gVmlldztcbiAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgIHRoaXMuX2VsID0gVmlldztcbiAgICB0aGlzLnZpZXcgPSBWaWV3O1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX1ZpZXcgPSBWaWV3O1xuICB9XG5cbiAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbn07XG5cblBsYWNlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKHZpc2libGUsIGRhdGEpIHtcbiAgdmFyIHBsYWNlaG9sZGVyID0gdGhpcy5fcGxhY2Vob2xkZXI7XG4gIHZhciBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gIGlmICh2aXNpYmxlKSB7XG4gICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICBtb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcblxuICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIFZpZXcgPSB0aGlzLl9WaWV3O1xuICAgICAgICB2YXIgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICB0aGlzLmVsID0gZ2V0RWwodmlldyk7XG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG5cbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aWV3ICYmIHRoaXMudmlldy51cGRhdGUgJiYgdGhpcy52aWV3LnVwZGF0ZShkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIsIHRoaXMuX2VsKTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLnZpZXcpO1xuICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIH1cbiAgfVxuICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xufTtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuZnVuY3Rpb24gcm91dGVyIChwYXJlbnQsIFZpZXdzLCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFJvdXRlcihwYXJlbnQsIFZpZXdzLCBpbml0RGF0YSk7XG59XG5cbnZhciBSb3V0ZXIgPSBmdW5jdGlvbiBSb3V0ZXIgKHBhcmVudCwgVmlld3MsIGluaXREYXRhKSB7XG4gIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICB0aGlzLlZpZXdzID0gVmlld3M7XG4gIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbn07XG5cblJvdXRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChyb3V0ZSwgZGF0YSkge1xuICBpZiAocm91dGUgIT09IHRoaXMucm91dGUpIHtcbiAgICB2YXIgVmlld3MgPSB0aGlzLlZpZXdzO1xuICAgIHZhciBWaWV3ID0gVmlld3Nbcm91dGVdO1xuXG4gICAgdGhpcy5yb3V0ZSA9IHJvdXRlO1xuXG4gICAgaWYgKFZpZXcgJiYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlIHx8IFZpZXcuZWwgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3ID0gVmlldyAmJiBuZXcgVmlldyh0aGlzLmluaXREYXRhLCBkYXRhKTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLmVsLCBbdGhpcy52aWV3XSk7XG4gIH1cbiAgdGhpcy52aWV3ICYmIHRoaXMudmlldy51cGRhdGUgJiYgdGhpcy52aWV3LnVwZGF0ZShkYXRhLCByb3V0ZSk7XG59O1xuXG52YXIgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG52YXIgc3ZnQ2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gc3ZnIChxdWVyeSkge1xuICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHZhciBlbGVtZW50O1xuXG4gIHZhciB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGVsZW1lbnQgPSBtZW1vaXplU1ZHKHF1ZXJ5KS5jbG9uZU5vZGUoZmFsc2UpO1xuICB9IGVsc2UgaWYgKGlzTm9kZShxdWVyeSkpIHtcbiAgICBlbGVtZW50ID0gcXVlcnkuY2xvbmVOb2RlKGZhbHNlKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIFF1ZXJ5ID0gcXVlcnk7XG4gICAgZWxlbWVudCA9IG5ldyAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoIFF1ZXJ5LCBbIG51bGwgXS5jb25jYXQoIGFyZ3MpICkpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkJyk7XG4gIH1cblxuICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGdldEVsKGVsZW1lbnQpLCBhcmdzLCB0cnVlKTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxudmFyIHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcgKHF1ZXJ5KSB7XG4gIHZhciBjbG9uZSA9IG1lbW9pemVTVkcocXVlcnkpO1xuXG4gIHJldHVybiBzdmcuYmluZCh0aGlzLCBjbG9uZSk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gbWVtb2l6ZVNWRyAocXVlcnkpIHtcbiAgcmV0dXJuIHN2Z0NhY2hlW3F1ZXJ5XSB8fCAoc3ZnQ2FjaGVbcXVlcnldID0gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpKTtcbn1cblxuZXhwb3J0IHsgTGlzdCwgTGlzdFBvb2wsIFBsYWNlLCBSb3V0ZXIsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByb3V0ZXIsIHMsIHNldEF0dHIsIHNldENoaWxkcmVuLCBzZXREYXRhLCBzZXRTdHlsZSwgc2V0WGxpbmssIHN2ZywgdGV4dCwgdW5tb3VudCB9O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZChvYmosIGZhY3Rvcmllcykge1xuICAgIGNvbnN0IHJlbW92ZXJzID0gT2JqZWN0LmtleXMoZmFjdG9yaWVzKS5tYXAoa2V5ID0+IGFyb3VuZDEob2JqLCBrZXksIGZhY3Rvcmllc1trZXldKSk7XG4gICAgcmV0dXJuIHJlbW92ZXJzLmxlbmd0aCA9PT0gMSA/IHJlbW92ZXJzWzBdIDogZnVuY3Rpb24gKCkgeyByZW1vdmVycy5mb3JFYWNoKHIgPT4gcigpKTsgfTtcbn1cbmZ1bmN0aW9uIGFyb3VuZDEob2JqLCBtZXRob2QsIGNyZWF0ZVdyYXBwZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IG9ialttZXRob2RdLCBoYWRPd24gPSBvYmouaGFzT3duUHJvcGVydHkobWV0aG9kKTtcbiAgICBsZXQgY3VycmVudCA9IGNyZWF0ZVdyYXBwZXIob3JpZ2luYWwpO1xuICAgIC8vIExldCBvdXIgd3JhcHBlciBpbmhlcml0IHN0YXRpYyBwcm9wcyBmcm9tIHRoZSB3cmFwcGluZyBtZXRob2QsXG4gICAgLy8gYW5kIHRoZSB3cmFwcGluZyBtZXRob2QsIHByb3BzIGZyb20gdGhlIG9yaWdpbmFsIG1ldGhvZFxuICAgIGlmIChvcmlnaW5hbClcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGN1cnJlbnQsIG9yaWdpbmFsKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yod3JhcHBlciwgY3VycmVudCk7XG4gICAgb2JqW21ldGhvZF0gPSB3cmFwcGVyO1xuICAgIC8vIFJldHVybiBhIGNhbGxiYWNrIHRvIGFsbG93IHNhZmUgcmVtb3ZhbFxuICAgIHJldHVybiByZW1vdmU7XG4gICAgZnVuY3Rpb24gd3JhcHBlciguLi5hcmdzKSB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYmVlbiBkZWFjdGl2YXRlZCBhbmQgYXJlIG5vIGxvbmdlciB3cmFwcGVkLCByZW1vdmUgb3Vyc2VsdmVzXG4gICAgICAgIGlmIChjdXJyZW50ID09PSBvcmlnaW5hbCAmJiBvYmpbbWV0aG9kXSA9PT0gd3JhcHBlcilcbiAgICAgICAgICAgIHJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gY3VycmVudC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICAvLyBJZiBubyBvdGhlciBwYXRjaGVzLCBqdXN0IGRvIGEgZGlyZWN0IHJlbW92YWxcbiAgICAgICAgaWYgKG9ialttZXRob2RdID09PSB3cmFwcGVyKSB7XG4gICAgICAgICAgICBpZiAoaGFkT3duKVxuICAgICAgICAgICAgICAgIG9ialttZXRob2RdID0gb3JpZ2luYWw7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ialttZXRob2RdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50ID09PSBvcmlnaW5hbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gRWxzZSBwYXNzIGZ1dHVyZSBjYWxscyB0aHJvdWdoLCBhbmQgcmVtb3ZlIHdyYXBwZXIgZnJvbSB0aGUgcHJvdG90eXBlIGNoYWluXG4gICAgICAgIGN1cnJlbnQgPSBvcmlnaW5hbDtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHdyYXBwZXIsIG9yaWdpbmFsIHx8IEZ1bmN0aW9uKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZGVkdXBlKGtleSwgb2xkRm4sIG5ld0ZuKSB7XG4gICAgY2hlY2tba2V5XSA9IGtleTtcbiAgICByZXR1cm4gY2hlY2s7XG4gICAgZnVuY3Rpb24gY2hlY2soLi4uYXJncykge1xuICAgICAgICByZXR1cm4gKG9sZEZuW2tleV0gPT09IGtleSA/IG9sZEZuIDogbmV3Rm4pLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBhZnRlcihwcm9taXNlLCBjYikge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW4oY2IsIGNiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemUoYXN5bmNGdW5jdGlvbikge1xuICAgIGxldCBsYXN0UnVuID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgZnVuY3Rpb24gd3JhcHBlciguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBsYXN0UnVuID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICBhZnRlcihsYXN0UnVuLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXN5bmNGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKS50aGVuKHJlcywgcmVqKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgd3JhcHBlci5hZnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGxhc3RSdW4gPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHsgYWZ0ZXIobGFzdFJ1biwgcmVzKTsgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gd3JhcHBlcjtcbn1cbiIsImltcG9ydCB7TWVudSwgQXBwLCBNZW51SXRlbSwgZGVib3VuY2UsIEtleW1hcCwgU2NvcGV9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHthcm91bmR9IGZyb20gXCJtb25rZXktYXJvdW5kXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwib2JzaWRpYW5cIiB7XG4gICAgaW50ZXJmYWNlIE1lbnUge1xuICAgICAgICBhcHA6IEFwcFxuICAgICAgICBkb206IEhUTUxEaXZFbGVtZW50XG4gICAgICAgIHNjb3BlOiBTY29wZVxuICAgICAgICBpdGVtczogTWVudUl0ZW1bXVxuXG4gICAgICAgIHNlbGVjdChuOiBudW1iZXIpOiB2b2lkXG4gICAgICAgIHNlbGVjdGVkOiBudW1iZXJcbiAgICAgICAgb25BcnJvd0Rvd24oZTogS2V5Ym9hcmRFdmVudCk6IGZhbHNlXG4gICAgICAgIG9uQXJyb3dVcChlOiBLZXlib2FyZEV2ZW50KTogZmFsc2VcbiAgICB9XG5cbiAgICBleHBvcnQgbmFtZXNwYWNlIEtleW1hcCB7XG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNb2RpZmllcnMoZXZlbnQ6IEV2ZW50KTogc3RyaW5nXG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIE1lbnVJdGVtIHtcbiAgICAgICAgZG9tOiBIVE1MRGl2RWxlbWVudFxuICAgICAgICB0aXRsZUVsOiBIVE1MRGl2RWxlbWVudFxuICAgICAgICBoYW5kbGVFdmVudChldmVudDogRXZlbnQpOiB2b2lkXG4gICAgICAgIGRpc2FibGVkOiBib29sZWFuXG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBNZW51UGFyZW50ID0gQXBwIHwgUG9wdXBNZW51O1xuXG5leHBvcnQgY2xhc3MgUG9wdXBNZW51IGV4dGVuZHMgTWVudSB7XG4gICAgLyoqIFRoZSBjaGlsZCBtZW51IHBvcHBlZCB1cCBvdmVyIHRoaXMgb25lICovXG4gICAgY2hpbGQ6IE1lbnVcblxuICAgIG1hdGNoOiBzdHJpbmcgPSBcIlwiXG4gICAgcmVzZXRTZWFyY2hPblRpbWVvdXQgPSBkZWJvdW5jZSgoKSA9PiB7dGhpcy5tYXRjaCA9IFwiXCI7fSwgMTUwMCwgdHJ1ZSlcbiAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2VcbiAgICBmaXJzdE1vdmU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIHBhcmVudDogTWVudVBhcmVudCwgcHVibGljIGFwcDogQXBwID0gcGFyZW50IGluc3RhbmNlb2YgQXBwID8gcGFyZW50IDogcGFyZW50LmFwcCkge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgICAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgUG9wdXBNZW51KSBwYXJlbnQuc2V0Q2hpbGRNZW51KHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc2NvcGUgPSBuZXcgU2NvcGU7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiQXJyb3dVcFwiLCAgIHRoaXMub25BcnJvd1VwLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93RG93blwiLCB0aGlzLm9uQXJyb3dEb3duLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkVudGVyXCIsICAgICB0aGlzLm9uRW50ZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiRXNjYXBlXCIsICAgIHRoaXMub25Fc2NhcGUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiQXJyb3dMZWZ0XCIsIHRoaXMub25BcnJvd0xlZnQuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJIb21lXCIsIHRoaXMub25Ib21lLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkVuZFwiLCAgdGhpcy5vbkVuZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJBcnJvd1JpZ2h0XCIsIHRoaXMub25BcnJvd1JpZ2h0LmJpbmQodGhpcykpO1xuXG4gICAgICAgIC8vIE1ha2Ugb2JzaWRpYW4uTWVudSB0aGluayBtb3VzZWRvd25zIG9uIG91ciBjaGlsZCBtZW51KHMpIGFyZSBoYXBwZW5pbmdcbiAgICAgICAgLy8gb24gdXMsIHNvIHdlIHdvbid0IGNsb3NlIGJlZm9yZSBhbiBhY3R1YWwgY2xpY2sgb2NjdXJzXG4gICAgICAgIGNvbnN0IG1lbnUgPSB0aGlzO1xuICAgICAgICBhcm91bmQodGhpcy5kb20sIHtjb250YWlucyhwcmV2KXsgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogTm9kZSkge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gcHJldi5jYWxsKHRoaXMsIHRhcmdldCkgfHwgbWVudS5jaGlsZD8uZG9tLmNvbnRhaW5zKHRhcmdldCk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9fX0pO1xuICAgICAgICB0aGlzLmRvbS5hZGRDbGFzcyhcInFlLXBvcHVwLW1lbnVcIik7XG4gICAgfVxuXG4gICAgb25Fc2NhcGUoKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25sb2FkKCkge1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKG51bGwsIG51bGwsIHRoaXMub25LZXlEb3duLmJpbmQodGhpcykpO1xuICAgICAgICBzdXBlci5vbmxvYWQoKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaG93U2VsZWN0ZWQoKTtcbiAgICAgICAgdGhpcy5maXJzdE1vdmUgPSB0cnVlO1xuICAgICAgICAvLyBXZSB3YWl0IHVudGlsIG5vdyB0byByZWdpc3RlciBzbyB0aGF0IGFueSBpbml0aWFsIG1vdXNlb3ZlciBvZiB0aGUgb2xkIG1vdXNlIHBvc2l0aW9uIHdpbGwgYmUgc2tpcHBlZFxuICAgICAgICB0aGlzLnJlZ2lzdGVyKG9uRWxlbWVudCh0aGlzLmRvbSwgXCJtb3VzZW92ZXJcIiwgXCIubWVudS1pdGVtXCIsIChldmVudDogTW91c2VFdmVudCwgdGFyZ2V0OiBIVE1MRGl2RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmZpcnN0TW92ZSAmJiAhdGFyZ2V0Lmhhc0NsYXNzKFwiaXMtZGlzYWJsZWRcIikgJiYgIXRoaXMuY2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdCh0aGlzLml0ZW1zLmZpbmRJbmRleChpID0+IGkuZG9tID09PSB0YXJnZXQpLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZpcnN0TW92ZSA9IGZhbHNlO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgb251bmxvYWQoKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBzdXBlci5vbnVubG9hZCgpO1xuICAgIH1cblxuICAgIC8vIE92ZXJyaWRlIHRvIGF2b2lkIGhhdmluZyBhIG1vdXNlb3ZlciBldmVudCBoYW5kbGVyXG4gICAgYWRkSXRlbShjYjogKGk6IE1lbnVJdGVtKSA9PiBhbnkpIHtcbiAgICAgICAgY29uc3QgaSA9IG5ldyBNZW51SXRlbSh0aGlzKTtcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGkpO1xuICAgICAgICBjYihpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IG1vZCA9IEtleW1hcC5nZXRNb2RpZmllcnMoZXZlbnQpO1xuICAgICAgICBpZiAoZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSAmJiAhZXZlbnQuaXNDb21wb3NpbmcgJiYgKCFtb2QgfHwgbW9kID09PSBcIlNoaWZ0XCIpICkge1xuICAgICAgICAgICAgbGV0IG1hdGNoID0gdGhpcy5tYXRjaCArIGV2ZW50LmtleTtcbiAgICAgICAgICAgIC8vIFRocm93IGF3YXkgcGllY2VzIG9mIHRoZSBtYXRjaCB1bnRpbCBzb21ldGhpbmcgbWF0Y2hlcyBvciBub3RoaW5nJ3MgbGVmdFxuICAgICAgICAgICAgd2hpbGUgKG1hdGNoICYmICF0aGlzLnNlYXJjaEZvcihtYXRjaCkpIG1hdGNoID0gbWF0Y2guc3Vic3RyKDEpO1xuICAgICAgICAgICAgdGhpcy5tYXRjaCA9IG1hdGNoO1xuICAgICAgICAgICAgdGhpcy5yZXNldFNlYXJjaE9uVGltZW91dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTsgICAvLyBibG9jayBhbGwga2V5cyBvdGhlciB0aGFuIG91cnNcbiAgICB9XG5cbiAgICBzZWFyY2hGb3IobWF0Y2g6IHN0cmluZykge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IG1hdGNoLnNwbGl0KFwiXCIpLm1hcChlc2NhcGVSZWdleCk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmZpbmQobmV3IFJlZ0V4cChcIl5cIisgcGFydHMuam9pbihcIlwiKSwgXCJ1aVwiKSkgfHxcbiAgICAgICAgICAgIHRoaXMuZmluZChuZXcgUmVnRXhwKFwiXlwiKyBwYXJ0cy5qb2luKFwiLipcIiksIFwidWlcIikpIHx8XG4gICAgICAgICAgICB0aGlzLmZpbmQobmV3IFJlZ0V4cChwYXJ0cy5qb2luKFwiLipcIiksIFwidWlcIikpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZmluZChwYXR0ZXJuOiBSZWdFeHApIHtcbiAgICAgICAgbGV0IHBvcyA9IE1hdGgubWluKDAsIHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgICBmb3IgKGxldCBpPXRoaXMuaXRlbXMubGVuZ3RoOyBpOyArK3BvcywgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pdGVtc1twb3NdPy5kaXNhYmxlZCkgY29udGludWU7XG4gICAgICAgICAgICBpZiAodGhpcy5pdGVtc1twb3NdPy5kb20udGV4dENvbnRlbnQubWF0Y2gocGF0dGVybikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdChwb3MpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIG9uRW50ZXIoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5zZWxlY3RlZF07XG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBpdGVtLmhhbmRsZUV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIC8vIE9ubHkgaGlkZSBpZiB3ZSBkb24ndCBoYXZlIGEgc3VibWVudVxuICAgICAgICAgICAgaWYgKCF0aGlzLmNoaWxkKSB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc2VsZWN0KG46IG51bWJlciwgc2Nyb2xsID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLm1hdGNoID0gXCJcIiAvLyByZXNldCBzZWFyY2ggb24gbW92ZVxuICAgICAgICBzdXBlci5zZWxlY3Qobik7XG4gICAgICAgIGlmIChzY3JvbGwpIHRoaXMuc2hvd1NlbGVjdGVkKCk7XG4gICAgfVxuXG4gICAgc2hvd1NlbGVjdGVkKCkge1xuICAgICAgICBjb25zdCBlbCA9IHRoaXMuaXRlbXNbdGhpcy5zZWxlY3RlZF0/LmRvbTtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICBjb25zdCBtZSA9IHRoaXMuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBteSA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgaWYgKG15LnRvcCA8IG1lLnRvcCB8fCBteS5ib3R0b20gPiBtZS5ib3R0b20pIGVsLnNjcm9sbEludG9WaWV3KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bnNlbGVjdCgpIHtcbiAgICAgICAgdGhpcy5pdGVtc1t0aGlzLnNlbGVjdGVkXT8uZG9tLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRcIik7XG4gICAgfVxuXG4gICAgb25FbmQoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICB0aGlzLnVuc2VsZWN0KCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgdGhpcy5vbkFycm93VXAoZSk7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkID09PSB0aGlzLml0ZW1zLmxlbmd0aCkgdGhpcy5zZWxlY3RlZCA9IC0xO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25Ib21lKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgdGhpcy51bnNlbGVjdCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gLTE7XG4gICAgICAgIHRoaXMub25BcnJvd0Rvd24oZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkFycm93TGVmdCgpIHtcbiAgICAgICAgaWYgKHRoaXMucm9vdE1lbnUoKSAhPT0gdGhpcykge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uQXJyb3dSaWdodCgpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gbm8tb3AgaW4gYmFzZSBjbGFzc1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5zZXRDaGlsZE1lbnUoKTsgIC8vIGhpZGUgY2hpbGQgbWVudShzKSBmaXJzdFxuICAgICAgICByZXR1cm4gc3VwZXIuaGlkZSgpO1xuICAgIH1cblxuICAgIHNldENoaWxkTWVudShtZW51PzogTWVudSkge1xuICAgICAgICB0aGlzLmNoaWxkPy5oaWRlKCk7XG4gICAgICAgIHRoaXMuY2hpbGQgPSBtZW51O1xuICAgIH1cblxuICAgIHJvb3RNZW51KCk6IFBvcHVwTWVudSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudCBpbnN0YW5jZW9mIEFwcCA/IHRoaXMgOiB0aGlzLnBhcmVudC5yb290TWVudSgpO1xuICAgIH1cblxuICAgIGNhc2NhZGUodGFyZ2V0OiBIVE1MRWxlbWVudCwgZXZlbnQ/OiBNb3VzZUV2ZW50LCBvbkNsb3NlPzogKCkgPT4gYW55LCBoT3ZlcmxhcCA9IDE1LCB2T3ZlcmxhcCA9IDUpIHtcbiAgICAgICAgY29uc3Qge2xlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgd2lkdGh9ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBjZW50ZXJYID0gbGVmdCtNYXRoLm1pbigxNTAsIHdpZHRoLzMpLCBjZW50ZXJZID0gKHRvcCtib3R0b20pLzI7XG4gICAgICAgIGNvbnN0IHtpbm5lckhlaWdodCwgaW5uZXJXaWR0aH0gPSB3aW5kb3c7XG5cbiAgICAgICAgLy8gVHJ5IHRvIGNhc2NhZGUgZG93biBhbmQgdG8gdGhlIHJpZ2h0IGZyb20gdGhlIG1vdXNlIG9yIGhvcml6b250YWwgY2VudGVyXG4gICAgICAgIC8vIG9mIHRoZSBjbGlja2VkIGl0ZW1cbiAgICAgICAgY29uc3QgcG9pbnQgPSB7eDogZXZlbnQgPyBldmVudC5jbGllbnRYICAtIGhPdmVybGFwIDogY2VudGVyWCAsIHk6IGJvdHRvbSAtIHZPdmVybGFwfTtcblxuICAgICAgICAvLyBNZWFzdXJlIHRoZSBtZW51IGFuZCBzZWUgaWYgaXQgZml0c1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcbiAgICAgICAgY29uc3Qge29mZnNldFdpZHRoLCBvZmZzZXRIZWlnaHR9ID0gdGhpcy5kb207XG4gICAgICAgIGNvbnN0IGZpdHNCZWxvdyA9IHBvaW50LnkgKyBvZmZzZXRIZWlnaHQgPCBpbm5lckhlaWdodDtcbiAgICAgICAgY29uc3QgZml0c1JpZ2h0ID0gcG9pbnQueCArIG9mZnNldFdpZHRoIDw9IGlubmVyV2lkdGg7XG5cbiAgICAgICAgLy8gSWYgaXQgZG9lc24ndCBmaXQgdW5kZXJuZWF0aCB1cywgcG9zaXRpb24gaXQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuLCB1bmxlc3NcbiAgICAgICAgLy8gdGhlIGNsaWNrZWQgaXRlbSBpcyBjbG9zZSB0byB0aGUgYm90dG9tIChpbiB3aGljaCBjYXNlLCBwb3NpdGlvbiBpdCBhYm92ZSBzb1xuICAgICAgICAvLyB0aGUgaXRlbSB3aWxsIHN0aWxsIGJlIHZpc2libGUuKVxuICAgICAgICBpZiAoIWZpdHNCZWxvdykge1xuICAgICAgICAgICAgcG9pbnQueSA9IChib3R0b20gPiBpbm5lckhlaWdodCAtIChib3R0b20tdG9wKSkgPyB0b3AgKyB2T3ZlcmxhcDogaW5uZXJIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBpdCBkb2Vzbid0IGZpdCB0byB0aGUgcmlnaHQsIHRoZW4gcG9zaXRpb24gaXQgYXQgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIHNjcmVlbixcbiAgICAgICAgLy8gc28gbG9uZyBhcyBpdCBmaXRzIGVudGlyZWx5IGFib3ZlIG9yIGJlbG93IHVzLiAgT3RoZXJ3aXNlLCBwb3NpdGlvbiBpdCB1c2luZyB0aGVcbiAgICAgICAgLy8gaXRlbSBjZW50ZXIsIHNvIGF0IGxlYXN0IG9uZSBzaWRlIG9mIHRoZSBwcmV2aW91cyBtZW51L2l0ZW0gd2lsbCBzdGlsbCBiZSBzZWVuLlxuICAgICAgICBpZiAoIWZpdHNSaWdodCkge1xuICAgICAgICAgICAgcG9pbnQueCA9IChvZmZzZXRIZWlnaHQgPCAoYm90dG9tIC0gdk92ZXJsYXApIHx8IGZpdHNCZWxvdykgPyBpbm5lcldpZHRoIDogY2VudGVyWDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvbmUhICBTaG93IG91ciB3b3JrLlxuICAgICAgICB0aGlzLnNob3dBdFBvc2l0aW9uKHBvaW50KTtcblxuICAgICAgICAvLyBGbGFnIHRoZSBjbGlja2VkIGl0ZW0gYXMgYWN0aXZlLCB1bnRpbCB3ZSBjbG9zZVxuICAgICAgICB0YXJnZXQudG9nZ2xlQ2xhc3MoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5vbkhpZGUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgQXBwKSB0YXJnZXQudG9nZ2xlQ2xhc3MoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIFBvcHVwTWVudSkgdGhpcy5wYXJlbnQuc2V0Q2hpbGRNZW51KCk7XG4gICAgICAgICAgICBpZiAob25DbG9zZSkgb25DbG9zZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBlc2NhcGVSZWdleChzOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xufVxuXG5mdW5jdGlvbiBvbkVsZW1lbnQ8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50RXZlbnRNYXA+KFxuICAgIGVsOiBIVE1MRWxlbWVudCwgdHlwZTogSywgc2VsZWN0b3I6c3RyaW5nLFxuICAgIGxpc3RlbmVyOiAodGhpczogSFRNTEVsZW1lbnQsIGV2OiBIVE1MRWxlbWVudEV2ZW50TWFwW0tdLCBkZWxlZ2F0ZVRhcmdldDogSFRNTEVsZW1lbnQpID0+IGFueSxcbiAgICBvcHRpb25zOiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgPSBmYWxzZVxuKSB7XG4gICAgZWwub24odHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCBvcHRpb25zKVxuICAgIHJldHVybiAoKSA9PiBlbC5vZmYodHlwZSwgc2VsZWN0b3IsIGxpc3RlbmVyLCBvcHRpb25zKTtcbn0iLCJpbXBvcnQgeyBLZXltYXAsIE1vZGFsLCBOb3RpY2UsIFRBYnN0cmFjdEZpbGUsIFRGaWxlLCBURm9sZGVyLCBWaWV3IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBQb3B1cE1lbnUsIE1lbnVQYXJlbnQgfSBmcm9tIFwiLi9tZW51c1wiO1xuaW1wb3J0IHtpMThufSBmcm9tIFwiaTE4bmV4dFwiO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgY29uc3QgaTE4bmV4dDogaTE4blxufVxuXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xuICAgIGludGVyZmFjZSBBcHAge1xuICAgICAgICBzZXRBdHRhY2htZW50Rm9sZGVyKGZvbGRlcjogVEZvbGRlcik6IHZvaWRcbiAgICAgICAgaW50ZXJuYWxQbHVnaW5zOiB7XG4gICAgICAgICAgICBwbHVnaW5zOiB7XG4gICAgICAgICAgICAgICAgXCJmaWxlLWV4cGxvcmVyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhblxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZWFsSW5Gb2xkZXIoZmlsZTogVEFic3RyYWN0RmlsZSk6IHZvaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVGaWxlTW9kYWw6IE1vZGFsICYge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEN1cnJlbnRGaWxlKGZpbGU6IFRBYnN0cmFjdEZpbGUpOiB2b2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW50ZXJmYWNlIEZpbGVNYW5hZ2VyIHtcbiAgICAgICAgcHJvbXB0Rm9yRm9sZGVyRGVsZXRpb24oZm9sZGVyOiBURm9sZGVyKTogdm9pZFxuICAgICAgICBwcm9tcHRGb3JGaWxlRGVsZXRpb24oZmlsZTogVEZpbGUpOiB2b2lkXG4gICAgICAgIHByb21wdEZvckZpbGVSZW5hbWUoZmlsZTogVEFic3RyYWN0RmlsZSk6IHZvaWRcbiAgICAgICAgY3JlYXRlTmV3TWFya2Rvd25GaWxlKHBhcmVudEZvbGRlcj86IFRGb2xkZXIsIHBhdHRlcm4/OiBzdHJpbmcpOiBQcm9taXNlPFRGaWxlPlxuICAgIH1cbn1cblxuaW50ZXJmYWNlIEZpbGVFeHBsb3JlclZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgICBjcmVhdGVBYnN0cmFjdEZpbGUoa2luZDogXCJmaWxlXCIgfCBcImZvbGRlclwiLCBwYXJlbnQ6IFRGb2xkZXIsIG5ld0xlYWY/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPlxuICAgIHN0YXJ0UmVuYW1lRmlsZShmaWxlOiBUQWJzdHJhY3RGaWxlKTogUHJvbWlzZTx2b2lkPlxufVxuXG5mdW5jdGlvbiBvcHROYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBpMThuZXh0LnQoYHBsdWdpbnMuZmlsZS1leHBsb3Jlci5tZW51LW9wdC0ke25hbWV9YCk7XG59XG5cbmV4cG9ydCBjbGFzcyBDb250ZXh0TWVudSBleHRlbmRzIFBvcHVwTWVudSB7XG4gICAgY29uc3RydWN0b3IocGFyZW50OiBNZW51UGFyZW50LCBmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIHN1cGVyKHBhcmVudCk7XG4gICAgICAgIGNvbnN0IHsgd29ya3NwYWNlIH0gPSB0aGlzLmFwcDtcbiAgICAgICAgY29uc3QgaGF2ZUZpbGVFeHBsb3JlciA9IHRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5wbHVnaW5zW1wiZmlsZS1leHBsb3JlclwiXS5lbmFibGVkO1xuXG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRUaXRsZShvcHROYW1lKFwibmV3LW5vdGVcIikpLnNldEljb24oXCJjcmVhdGUtbmV3XCIpLm9uQ2xpY2soYXN5bmMgZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3RmlsZSA9IGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmNyZWF0ZU5ld01hcmtkb3duRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICBpZiAobmV3RmlsZSkgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoS2V5bWFwLmlzTW9kaWZpZXIoZSwgXCJNb2RcIikpLm9wZW5GaWxlKG5ld0ZpbGUsIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiAhMCwgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9LCBlU3RhdGU6IHsgcmVuYW1lOiBcImFsbFwiIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRUaXRsZShvcHROYW1lKFwibmV3LWZvbGRlclwiKSkuc2V0SWNvbihcImZvbGRlclwiKS5zZXREaXNhYmxlZCghaGF2ZUZpbGVFeHBsb3Jlcikub25DbGljayhldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGhhdmVGaWxlRXhwbG9yZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aXRoRXhwbG9yZXIoZmlsZSk/LmNyZWF0ZUFic3RyYWN0RmlsZShcImZvbGRlclwiLCBmaWxlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiVGhlIEZpbGUgRXhwbG9yZXIgY29yZSBwbHVnaW4gbXVzdCBiZSBlbmFibGVkIHRvIGNyZWF0ZSBuZXcgZm9sZGVyc1wiKVxuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLmFkZEl0ZW0oaSA9PiBpLnNldFRpdGxlKG9wdE5hbWUoXCJzZXQtYXR0YWNobWVudC1mb2xkZXJcIikpLnNldEljb24oXCJpbWFnZS1maWxlXCIpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLnNldEF0dGFjaG1lbnRGb2xkZXIoZmlsZSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLmFkZFNlcGFyYXRvcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkSXRlbShpID0+IHtcbiAgICAgICAgICAgIGkuc2V0VGl0bGUob3B0TmFtZShcInJlbmFtZVwiKSkuc2V0SWNvbihcInBlbmNpbFwiKS5vbkNsaWNrKGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9tcHRGb3JGaWxlUmVuYW1lKGZpbGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFkZEl0ZW0oaSA9PiBpLnNldFRpdGxlKG9wdE5hbWUoXCJkZWxldGVcIikpLnNldEljb24oXCJ0cmFzaFwiKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb21wdEZvckZvbGRlckRlbGV0aW9uKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvbXB0Rm9yRmlsZURlbGV0aW9uKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlciAmJiBoYXZlRmlsZUV4cGxvcmVyKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEl0ZW0oaSA9PiBpLnNldEljb24oXCJmb2xkZXJcIikuc2V0VGl0bGUoaTE4bmV4dC50KCdwbHVnaW5zLmZpbGUtZXhwbG9yZXIuYWN0aW9uLXJldmVhbC1maWxlJykpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMud2l0aEV4cGxvcmVyKGZpbGUpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWxlID09PSB3b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSB7XG4gICAgICAgICAgICB3b3Jrc3BhY2UudHJpZ2dlcihcImZpbGUtbWVudVwiLCB0aGlzLCBmaWxlLCBcInF1aWNrLWV4cGxvcmVyXCIsIHdvcmtzcGFjZS5hY3RpdmVMZWFmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdvcmtzcGFjZS50cmlnZ2VyKFwiZmlsZS1tZW51XCIsIHRoaXMsIGZpbGUsIFwicXVpY2stZXhwbG9yZXJcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aXRoRXhwbG9yZXIoZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBjb25zdCBleHBsb3JlciA9IHRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5wbHVnaW5zW1wiZmlsZS1leHBsb3JlclwiXTtcbiAgICAgICAgaWYgKGV4cGxvcmVyLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGV4cGxvcmVyLmluc3RhbmNlLnJldmVhbEluRm9sZGVyKGZpbGUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoXCJmaWxlLWV4cGxvcmVyXCIpWzBdLnZpZXcgYXMgRmlsZUV4cGxvcmVyVmlld1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVEFic3RyYWN0RmlsZSwgVEZpbGUsIFRGb2xkZXIsIEtleW1hcCwgTm90aWNlLCBIb3ZlclBhcmVudCwgZGVib3VuY2UsIFdvcmtzcGFjZVNwbGl0LCBIb3ZlclBvcG92ZXIsIEZpbGVWaWV3LCBNYXJrZG93blZpZXcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGhvdmVyU291cmNlLCBzdGFydERyYWcgfSBmcm9tIFwiLi9FeHBsb3JlclwiO1xuaW1wb3J0IHsgUG9wdXBNZW51LCBNZW51UGFyZW50IH0gZnJvbSBcIi4vbWVudXNcIjtcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSBcIi4vQ29udGV4dE1lbnVcIjtcbmltcG9ydCB7IGFyb3VuZCB9IGZyb20gXCJtb25rZXktYXJvdW5kXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwib2JzaWRpYW5cIiB7XG4gICAgaW50ZXJmYWNlIEhvdmVyUG9wb3ZlciB7XG4gICAgICAgIGhpZGUoKTogdm9pZFxuICAgICAgICBob3ZlckVsOiBIVE1MRGl2RWxlbWVudFxuICAgICAgICBvbkhvdmVyOiBib29sZWFuXG4gICAgfVxuICAgIGludGVyZmFjZSBBcHAge1xuICAgICAgICB2aWV3UmVnaXN0cnk6IHtcbiAgICAgICAgICAgIGlzRXh0ZW5zaW9uUmVnaXN0ZXJlZChleHQ6IHN0cmluZyk6IGJvb2xlYW5cbiAgICAgICAgICAgIGdldFR5cGVCeUV4dGVuc2lvbihleHQ6IHN0cmluZyk6IHN0cmluZ1xuICAgICAgICB9XG4gICAgfVxuICAgIGludGVyZmFjZSBWYXVsdCB7XG4gICAgICAgIGdldENvbmZpZyhvcHRpb246IHN0cmluZyk6IGFueVxuICAgICAgICBnZXRDb25maWcob3B0aW9uOlwic2hvd1Vuc3VwcG9ydGVkRmlsZXNcIik6IGJvb2xlYW5cbiAgICB9XG4gICAgaW50ZXJmYWNlIFdvcmtzcGFjZSB7XG4gICAgICAgIGl0ZXJhdGVMZWF2ZXMoY2FsbGJhY2s6IChpdGVtOiBXb3Jrc3BhY2VMZWFmKSA9PiBhbnksIGl0ZW06IFdvcmtzcGFjZVBhcmVudCk6IGJvb2xlYW47XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgSG92ZXJFZGl0b3IgZXh0ZW5kcyBIb3ZlclBvcG92ZXIge1xuICAgIHJvb3RTcGxpdDogV29ya3NwYWNlU3BsaXQ7XG4gICAgdG9nZ2xlUGluKHBpbm5lZD86IGJvb2xlYW4pOiB2b2lkO1xufVxuXG5jb25zdCBhbHBoYVNvcnQgPSBuZXcgSW50bC5Db2xsYXRvcih1bmRlZmluZWQsIHt1c2FnZTogXCJzb3J0XCIsIHNlbnNpdGl2aXR5OiBcImJhc2VcIiwgbnVtZXJpYzogdHJ1ZX0pLmNvbXBhcmU7XG5cbmNvbnN0IHByZXZpZXdJY29uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBtYXJrZG93bjogXCJkb2N1bWVudFwiLFxuICAgIGltYWdlOiBcImltYWdlLWZpbGVcIixcbiAgICBhdWRpbzogXCJhdWRpby1maWxlXCIsXG4gICAgcGRmOiBcInBkZi1maWxlXCIsXG59XG5cbmNvbnN0IHZpZXd0eXBlSWNvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgLi4ucHJldmlld0ljb25zLFxuICAgIC8vIGFkZCB0aGlyZC1wYXJ0eSBwbHVnaW5zXG4gICAgZXhjYWxpZHJhdzogXCJleGNhbGlkcmF3LWljb25cIixcbn07XG5cblxuLy8gR2xvYmFsIGF1dG8gcHJldmlldyBtb2RlXG5sZXQgYXV0b1ByZXZpZXcgPSB0cnVlXG5cbmV4cG9ydCBjbGFzcyBGb2xkZXJNZW51IGV4dGVuZHMgUG9wdXBNZW51IGltcGxlbWVudHMgSG92ZXJQYXJlbnQge1xuXG4gICAgcGFyZW50Rm9sZGVyOiBURm9sZGVyID0gdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBGb2xkZXJNZW51ID8gdGhpcy5wYXJlbnQuZm9sZGVyIDogbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXJlbnQ6IE1lbnVQYXJlbnQsIHB1YmxpYyBmb2xkZXI6IFRGb2xkZXIsIHB1YmxpYyBzZWxlY3RlZEZpbGU/OiBUQWJzdHJhY3RGaWxlLCBwdWJsaWMgb3BlbmVyPzogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIocGFyZW50KTtcbiAgICAgICAgdGhpcy5sb2FkRmlsZXMoZm9sZGVyLCBzZWxlY3RlZEZpbGUpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCAgICAgICAgXCJUYWJcIiwgICB0aGlzLnRvZ2dsZVByZXZpZXdNb2RlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtcIk1vZFwiXSwgICBcIkVudGVyXCIsIHRoaXMub25FbnRlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXCJBbHRcIl0sICAgXCJFbnRlclwiLCB0aGlzLm9uS2V5Ym9hcmRDb250ZXh0TWVudS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgICAgICAgIFwiXFxcXFwiLCAgICB0aGlzLm9uS2V5Ym9hcmRDb250ZXh0TWVudS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgICAgICAgIFwiRjJcIiwgICAgdGhpcy5kb1JlbmFtZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXCJTaGlmdFwiXSwgXCJGMlwiLCAgICB0aGlzLmRvTW92ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAvLyBTY3JvbGwgcHJldmlldyB3aW5kb3cgdXAgYW5kIGRvd25cbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgICAgICAgXCJQYWdlVXBcIiwgdGhpcy5kb1Njcm9sbC5iaW5kKHRoaXMsIC0xLCBmYWxzZSkpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCAgICAgXCJQYWdlRG93blwiLCB0aGlzLmRvU2Nyb2xsLmJpbmQodGhpcywgIDEsIGZhbHNlKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW1wiTW9kXCJdLCAgICBcIkhvbWVcIiwgdGhpcy5kb1Njcm9sbC5iaW5kKHRoaXMsICAwLCB0cnVlKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW1wiTW9kXCJdLCAgICAgXCJFbmRcIiwgdGhpcy5kb1Njcm9sbC5iaW5kKHRoaXMsICAxLCB0cnVlKSk7XG5cbiAgICAgICAgY29uc3QgeyBkb20gfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IG1lbnVJdGVtID0gXCIubWVudS1pdGVtW2RhdGEtZmlsZS1wYXRoXVwiO1xuICAgICAgICBkb20ub24oXCJjbGlja1wiLCAgICAgICBtZW51SXRlbSwgdGhpcy5vbkl0ZW1DbGljaywgdHJ1ZSk7XG4gICAgICAgIGRvbS5vbihcImNvbnRleHRtZW51XCIsIG1lbnVJdGVtLCB0aGlzLm9uSXRlbU1lbnUgKTtcbiAgICAgICAgZG9tLm9uKCdtb3VzZW92ZXInICAsIG1lbnVJdGVtLCB0aGlzLm9uSXRlbUhvdmVyKTtcbiAgICAgICAgZG9tLm9uKFwibW91c2Vkb3duXCIsICAgbWVudUl0ZW0sIGUgPT4ge2Uuc3RvcFByb3BhZ2F0aW9uKCl9LCB0cnVlKTsgIC8vIEZpeCBkcmFnIGNhbmNlbGxpbmdcbiAgICAgICAgZG9tLm9uKCdkcmFnc3RhcnQnLCAgIG1lbnVJdGVtLCAoZXZlbnQsIHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgc3RhcnREcmFnKHRoaXMuYXBwLCB0YXJnZXQuZGF0YXNldC5maWxlUGF0aCwgZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXaGVuIHdlIHVubG9hZCwgcmVhY3RpdmF0ZSBwYXJlbnQgbWVudSdzIGhvdmVyLCBpZiBuZWVkZWRcbiAgICAgICAgdGhpcy5yZWdpc3RlcigoKSA9PiB7IGF1dG9QcmV2aWV3ICYmIHRoaXMucGFyZW50IGluc3RhbmNlb2YgRm9sZGVyTWVudSAmJiB0aGlzLnBhcmVudC5zaG93UG9wb3ZlcigpOyB9KVxuXG4gICAgICAgIC8vIE1ha2Ugb2JzaWRpYW4uTWVudSB0aGluayBtb3VzZWRvd25zIG9uIG91ciBwb3B1cHMgYXJlIGhhcHBlbmluZ1xuICAgICAgICAvLyBvbiB1cywgc28gd2Ugd29uJ3QgY2xvc2UgYmVmb3JlIGFuIGFjdHVhbCBjbGljayBvY2N1cnNcbiAgICAgICAgY29uc3QgbWVudSA9IHRoaXM7XG4gICAgICAgIGFyb3VuZCh0aGlzLmRvbSwge2NvbnRhaW5zKHByZXYpeyByZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBOb2RlKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBwcmV2LmNhbGwodGhpcywgdGFyZ2V0KSB8fCBtZW51Ll9wb3BvdmVyPy5ob3ZlckVsLmNvbnRhaW5zKHRhcmdldCk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9fX0pO1xuICAgIH1cblxuICAgIG9uQXJyb3dMZWZ0KCkge1xuICAgICAgICBzdXBlci5vbkFycm93TGVmdCgpO1xuICAgICAgICBpZiAodGhpcy5yb290TWVudSgpID09PSB0aGlzKSB0aGlzLm9wZW5CcmVhZGNydW1iKHRoaXMub3BlbmVyPy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uS2V5Ym9hcmRDb250ZXh0TWVudSgpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pdGVtc1t0aGlzLnNlbGVjdGVkXT8uZG9tLCBmaWxlID0gdGFyZ2V0ICYmIHRoaXMuZmlsZUZvckRvbSh0YXJnZXQpO1xuICAgICAgICBpZiAoZmlsZSkgbmV3IENvbnRleHRNZW51KHRoaXMsIGZpbGUpLmNhc2NhZGUodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRvU2Nyb2xsKGRpcmVjdGlvbjogbnVtYmVyLCB0b0VuZDogYm9vbGVhbiwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgY29uc3QgcHJldmlldyA9IHRoaXMuaG92ZXJQb3BvdmVyPy5ob3ZlckVsLmZpbmQoXCIubWFya2Rvd24tcHJldmlldy12aWV3XCIpO1xuICAgICAgICBpZiAocHJldmlldykge1xuICAgICAgICAgICAgcHJldmlldy5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IHRvRW5kID8gXCJhdXRvXCI6IFwic21vb3RoXCI7XG4gICAgICAgICAgICBjb25zdCBvbGRUb3AgPSBwcmV2aWV3LnNjcm9sbFRvcDtcbiAgICAgICAgICAgIGNvbnN0IG5ld1RvcCA9ICh0b0VuZCA/IDAgOiBwcmV2aWV3LnNjcm9sbFRvcCkgKyBkaXJlY3Rpb24gKiAodG9FbmQgPyBwcmV2aWV3LnNjcm9sbEhlaWdodCA6IHByZXZpZXcuY2xpZW50SGVpZ2h0KTtcbiAgICAgICAgICAgIHByZXZpZXcuc2Nyb2xsVG9wID0gbmV3VG9wO1xuICAgICAgICAgICAgaWYgKCF0b0VuZCkge1xuICAgICAgICAgICAgICAgIC8vIFBhZ2luZyBwYXN0IHRoZSBiZWdpbm5pbmcgb3IgZW5kXG4gICAgICAgICAgICAgICAgaWYgKG5ld1RvcCA+PSBwcmV2aWV3LnNjcm9sbEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQXJyb3dEb3duKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1RvcCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZFRvcCA+IDApIHByZXZpZXcuc2Nyb2xsVG9wID0gMDsgZWxzZSB0aGlzLm9uQXJyb3dVcChldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFhdXRvUHJldmlldykgeyBhdXRvUHJldmlldyA9IHRydWU7IHRoaXMuc2hvd1BvcG92ZXIoKTsgfVxuICAgICAgICAgICAgLy8gTm8gcHJldmlldywganVzdCBnbyB0byBuZXh0IG9yIHByZXZpb3VzIGl0ZW1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbiA+IDApIHRoaXMub25BcnJvd0Rvd24oZXZlbnQpOyBlbHNlIHRoaXMub25BcnJvd1VwKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZG9SZW5hbWUoKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmN1cnJlbnRGaWxlKClcbiAgICAgICAgaWYgKGZpbGUpIHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb21wdEZvckZpbGVSZW5hbWUoZmlsZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkb01vdmUoKSB7XG4gICAgICAgIGNvbnN0IGV4cGxvcmVyUGx1Z2luID0gdGhpcy5hcHAuaW50ZXJuYWxQbHVnaW5zLnBsdWdpbnNbXCJmaWxlLWV4cGxvcmVyXCJdO1xuICAgICAgICBpZiAoIWV4cGxvcmVyUGx1Z2luLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJGaWxlIGV4cGxvcmVyIGNvcmUgcGx1Z2luIG11c3QgYmUgZW5hYmxlZCB0byBtb3ZlIGZpbGVzIG9yIGZvbGRlcnNcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbW9kYWwgPSBleHBsb3JlclBsdWdpbi5pbnN0YW5jZS5tb3ZlRmlsZU1vZGFsO1xuICAgICAgICBtb2RhbC5zZXRDdXJyZW50RmlsZSh0aGlzLmN1cnJlbnRGaWxlKCkpO1xuICAgICAgICBtb2RhbC5vcGVuKClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGN1cnJlbnRJdGVtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtc1t0aGlzLnNlbGVjdGVkXTtcbiAgICB9XG5cbiAgICBjdXJyZW50RmlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsZUZvckRvbSh0aGlzLmN1cnJlbnRJdGVtKCk/LmRvbSlcbiAgICB9XG5cbiAgICBmaWxlRm9yRG9tKHRhcmdldEVsOiBIVE1MRGl2RWxlbWVudCkge1xuICAgICAgICBjb25zdCB7IGZpbGVQYXRoIH0gPSB0YXJnZXRFbD8uZGF0YXNldDtcbiAgICAgICAgaWYgKGZpbGVQYXRoKSByZXR1cm4gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBpdGVtRm9yUGF0aChmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbmRJbmRleChpID0+IGkuZG9tLmRhdGFzZXQuZmlsZVBhdGggPT09IGZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBvcGVuQnJlYWRjcnVtYihlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIHRoaXMucm9vdE1lbnUoKSA9PT0gdGhpcykge1xuICAgICAgICAgICAgY29uc3QgcHJldkV4cGxvcmFibGUgPSB0aGlzLm9wZW5lci5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTERpdkVsZW1lbnQpLmNsaWNrKClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQXJyb3dSaWdodCgpIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuY3VycmVudEZpbGUoKTtcbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSB7XG4gICAgICAgICAgICBpZiAoZmlsZSAhPT0gdGhpcy5zZWxlY3RlZEZpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tGaWxlKGZpbGUsIHRoaXMuY3VycmVudEl0ZW0oKS5kb20pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5CcmVhZGNydW1iKHRoaXMub3BlbmVyPy5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgY29uc3QgcG9wID0gdGhpcy5ob3ZlclBvcG92ZXI7XG4gICAgICAgICAgICBpZiAocG9wICYmIHBvcC5yb290U3BsaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUxlYXZlcyhsZWFmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlYWYudmlldyBpbnN0YW5jZW9mIEZpbGVWaWV3ICYmIGxlYWYudmlldy5maWxlID09PSBmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3AudG9nZ2xlUGluKHRydWUpOyAgLy8gRW5zdXJlIHRoZSBwb3B1cCB3b24ndCBjbG9zZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVzY2FwZSgpOyAgICAgIC8vIHdoZW4gd2UgY2xvc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZWFmLnZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggdG8gZWRpdCBtb2RlIC0tIGtleWJvYXJkJ3Mgbm90IG11Y2ggZ29vZCB3aXRob3V0IGl0IVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogbGVhZi52aWV3LmdldFZpZXdUeXBlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiB7IGZpbGU6IGZpbGUucGF0aCwgbW9kZTogXCJzb3VyY2VcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIGZhbHNlLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbWV0aGluZyBsaWtlIEthbmJhbiBvciBFeGNhbGlkcmF3LCBtaWdodCBub3Qgc3VwcG9ydCBmb2N1cyBmbGFnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIG1ha2Ugc3VyZSB0aGUgY3VycmVudCBwYW5lIGRvZXNuJ3QgaGFuZyBvbnRvIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpPy5ibHVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnNldEFjdGl2ZUxlYWYobGVhZiwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOyAgLy8gb25seSB0YXJnZXQgdGhlIGZpcnN0IGxlYWYsIHdoZXRoZXIgaXQgbWF0Y2hlcyBvciBub3RcbiAgICAgICAgICAgICAgICB9LCBwb3Aucm9vdFNwbGl0KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsb2FkRmlsZXMoZm9sZGVyOiBURm9sZGVyLCBzZWxlY3RlZEZpbGU/OiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGNvbnN0IGZvbGRlck5vdGUgPSB0aGlzLmZvbGRlck5vdGUodGhpcy5mb2xkZXIpO1xuICAgICAgICB0aGlzLmRvbS5lbXB0eSgpOyB0aGlzLml0ZW1zID0gW107XG4gICAgICAgIGNvbnN0IGFsbEZpbGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0Q29uZmlnKFwic2hvd1Vuc3VwcG9ydGVkRmlsZXNcIik7XG4gICAgICAgIGNvbnN0IHtjaGlsZHJlbiwgcGFyZW50fSA9IGZvbGRlcjtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBjaGlsZHJlbi5zbGljZSgpLnNvcnQoKGE6IFRBYnN0cmFjdEZpbGUsIGI6IFRBYnN0cmFjdEZpbGUpID0+IGFscGhhU29ydChhLm5hbWUsIGIubmFtZSkpXG4gICAgICAgIGNvbnN0IGZvbGRlcnMgPSBpdGVtcy5maWx0ZXIoZiA9PiBmIGluc3RhbmNlb2YgVEZvbGRlcikgYXMgVEZvbGRlcltdO1xuICAgICAgICBjb25zdCBmaWxlcyAgID0gaXRlbXMuZmlsdGVyKGYgPT4gZiBpbnN0YW5jZW9mIFRGaWxlICYmIGYgIT09IGZvbGRlck5vdGUgJiYgKGFsbEZpbGVzIHx8IHRoaXMuZmlsZUljb24oZikpKSBhcyBURmlsZVtdO1xuICAgICAgICBmb2xkZXJzLnNvcnQoKGEsIGIpID0+IGFscGhhU29ydChhLm5hbWUsIGIubmFtZSkpO1xuICAgICAgICBmaWxlcy5zb3J0KChhLCBiKSA9PiBhbHBoYVNvcnQoYS5iYXNlbmFtZSwgYi5iYXNlbmFtZSkpO1xuICAgICAgICBpZiAoZm9sZGVyTm90ZSkge1xuICAgICAgICAgICAgdGhpcy5hZGRGaWxlKGZvbGRlck5vdGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb2xkZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGZvbGRlck5vdGUpIHRoaXMuYWRkU2VwYXJhdG9yKCk7XG4gICAgICAgICAgICBmb2xkZXJzLm1hcCh0aGlzLmFkZEZpbGUsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChmb2xkZXJzLmxlbmd0aCB8fCBmb2xkZXJOb3RlKSB0aGlzLmFkZFNlcGFyYXRvcigpO1xuICAgICAgICAgICAgZmlsZXMubWFwKHRoaXMuYWRkRmlsZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3Qoc2VsZWN0ZWRGaWxlID8gdGhpcy5pdGVtRm9yUGF0aChzZWxlY3RlZEZpbGUucGF0aCkgOiAwKTtcbiAgICB9XG5cbiAgICBmaWxlSWNvbihmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlcikgcmV0dXJuIFwiZm9sZGVyXCI7XG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHZpZXdUeXBlID0gdGhpcy5hcHAudmlld1JlZ2lzdHJ5LmdldFR5cGVCeUV4dGVuc2lvbihmaWxlLmV4dGVuc2lvbik7XG4gICAgICAgICAgICBpZiAodmlld1R5cGUpIHJldHVybiB2aWV3dHlwZUljb25zW3ZpZXdUeXBlXSA/PyBcImRvY3VtZW50XCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxlQ291bnQ6IChmaWxlOiBUQWJzdHJhY3RGaWxlKSA9PiBudW1iZXIgPSAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT4gKFxuICAgICAgICBmaWxlIGluc3RhbmNlb2YgVEZvbGRlciA/IGZpbGUuY2hpbGRyZW4ubWFwKHRoaXMuZmlsZUNvdW50KS5yZWR1Y2UoKGEsYikgPT4gYStiLCAwKSA6ICh0aGlzLmZpbGVJY29uKGZpbGUpID8gMSA6IDApXG4gICAgKVxuXG4gICAgYWRkRmlsZShmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGNvbnN0IGljb24gPSB0aGlzLmZpbGVJY29uKGZpbGUpO1xuICAgICAgICB0aGlzLmFkZEl0ZW0oaSA9PiB7XG4gICAgICAgICAgICBpLnNldFRpdGxlKGZpbGUubmFtZSk7XG4gICAgICAgICAgICBpLmRvbS5kYXRhc2V0LmZpbGVQYXRoID0gZmlsZS5wYXRoO1xuICAgICAgICAgICAgaS5kb20uc2V0QXR0cihcImRyYWdnYWJsZVwiLCBcInRydWVcIik7XG4gICAgICAgICAgICBpLmRvbS5hZGRDbGFzcyAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIgPyBcImlzLXFlLWZvbGRlclwiIDogXCJpcy1xZS1maWxlXCIpO1xuICAgICAgICAgICAgaWYgKGljb24pIGkuc2V0SWNvbihpY29uKTtcbiAgICAgICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgICAgICBpLnNldFRpdGxlKGZpbGUuYmFzZW5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlLmV4dGVuc2lvbiAhPT0gXCJtZFwiKSBpLmRvbS5jcmVhdGVEaXYoe3RleHQ6IGZpbGUuZXh0ZW5zaW9uLCBjbHM6IFtcIm5hdi1maWxlLXRhZ1wiLFwicWUtZXh0ZW5zaW9uXCJdfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpbGUgIT09IHRoaXMuZm9sZGVyLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gdGhpcy5maWxlQ291bnQoZmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50KSBpLmRvbS5jcmVhdGVEaXYoe3RleHQ6IFwiXCIrY291bnQsIGNsczogXCJuYXYtZmlsZS10YWcgcWUtZmlsZS1jb3VudFwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpLm9uQ2xpY2soZSA9PiB0aGlzLm9uQ2xpY2tGaWxlKGZpbGUsIGkuZG9tLCBlKSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlUHJldmlld01vZGUoKSB7XG4gICAgICAgIGlmIChhdXRvUHJldmlldyA9ICFhdXRvUHJldmlldykgdGhpcy5zaG93UG9wb3ZlcigpOyBlbHNlIHRoaXMuaGlkZVBvcG92ZXIoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJlZnJlc2hGaWxlcyA9IGRlYm91bmNlKCgpID0+IHRoaXMubG9hZEZpbGVzKHRoaXMuZm9sZGVyLCB0aGlzLmN1cnJlbnRGaWxlKCkpLCAxMDAsIHRydWUpO1xuXG4gICAgb25sb2FkKCkge1xuICAgICAgICBzdXBlci5vbmxvYWQoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwiY3JlYXRlXCIsIChmaWxlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5mb2xkZXIgPT09IGZpbGUucGFyZW50KSB0aGlzLnJlZnJlc2hGaWxlcygpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcInJlbmFtZVwiLCAoZmlsZSwgb2xkUGF0aCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZm9sZGVyID09PSBmaWxlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIC8vIERlc3RpbmF0aW9uIHdhcyBoZXJlOyByZWZyZXNoIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRGaWxlID0gdGhpcy5pdGVtRm9yUGF0aChvbGRQYXRoKSA+PSAwID8gZmlsZSA6IHRoaXMuY3VycmVudEZpbGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRGaWxlcyh0aGlzLmZvbGRlciwgc2VsZWN0ZWRGaWxlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGl0IGlmIGl0IHdhcyBtb3ZlZCBvdXQgb2YgaGVyZVxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlSXRlbUZvclBhdGgob2xkUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwiZGVsZXRlXCIsIGZpbGUgPT4gdGhpcy5yZW1vdmVJdGVtRm9yUGF0aChmaWxlLnBhdGgpKSk7XG5cbiAgICAgICAgLy8gQWN0aXZhdGUgcHJldmlldyBpbW1lZGlhdGVseSBpZiBhcHBsaWNhYmxlXG4gICAgICAgIGlmIChhdXRvUHJldmlldyAmJiB0aGlzLnNlbGVjdGVkICE9IC0xKSB0aGlzLnNob3dQb3BvdmVyKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlSXRlbUZvclBhdGgocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBvc24gPSB0aGlzLml0ZW1Gb3JQYXRoKHBhdGgpO1xuICAgICAgICBpZiAocG9zbiA8IDApIHJldHVybjtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbcG9zbl07XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkID4gcG9zbikgdGhpcy5zZWxlY3RlZCAtPSAxO1xuICAgICAgICBpdGVtLmRvbS5kZXRhY2goKVxuICAgICAgICB0aGlzLml0ZW1zLnJlbW92ZShpdGVtKTtcbiAgICB9XG5cbiAgICBvbkVzY2FwZSgpIHtcbiAgICAgICAgc3VwZXIub25Fc2NhcGUoKTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgUG9wdXBNZW51KSB0aGlzLnBhcmVudC5vbkVzY2FwZSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xuICAgICAgICByZXR1cm4gc3VwZXIuaGlkZSgpO1xuICAgIH1cblxuICAgIHNldENoaWxkTWVudShtZW51OiBQb3B1cE1lbnUpIHtcbiAgICAgICAgc3VwZXIuc2V0Q2hpbGRNZW51KG1lbnUpO1xuICAgICAgICBpZiAoYXV0b1ByZXZpZXcgJiYgdGhpcy5jYW5TaG93UG9wb3ZlcigpKSB0aGlzLnNob3dQb3BvdmVyKCk7XG4gICAgfVxuXG4gICAgc2VsZWN0KGlkeDogbnVtYmVyLCBzY3JvbGwgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IG9sZCA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgICAgIHN1cGVyLnNlbGVjdChpZHgsIHNjcm9sbCk7XG4gICAgICAgIGlmIChvbGQgIT09IHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIC8vIHNlbGVjdGVkIGl0ZW0gY2hhbmdlZDsgdHJpZ2dlciBuZXcgcG9wb3ZlciBvciBoaWRlIHRoZSBvbGQgb25lXG4gICAgICAgICAgICBpZiAoYXV0b1ByZXZpZXcpIHRoaXMuc2hvd1BvcG92ZXIoKTsgZWxzZSB0aGlzLmhpZGVQb3BvdmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlUG9wb3ZlcigpIHtcbiAgICAgICAgdGhpcy5ob3ZlclBvcG92ZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGNhblNob3dQb3BvdmVyKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY2hpbGQgJiYgdGhpcy52aXNpYmxlO1xuICAgIH1cblxuICAgIHNob3dQb3BvdmVyID0gZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XG4gICAgICAgIGlmICghYXV0b1ByZXZpZXcpIHJldHVybjtcbiAgICAgICAgdGhpcy5tYXliZUhvdmVyKHRoaXMuY3VycmVudEl0ZW0oKT8uZG9tLCBmaWxlID0+IHRoaXMuYXBwLndvcmtzcGFjZS50cmlnZ2VyKCdsaW5rLWhvdmVyJywgdGhpcywgbnVsbCwgZmlsZS5wYXRoLCBcIlwiKSk7XG4gICAgfSwgNTAsIHRydWUpXG5cbiAgICBvbkl0ZW1Ib3ZlciA9IChldmVudDogTW91c2VFdmVudCwgdGFyZ2V0RWw6IEhUTUxEaXZFbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICghYXV0b1ByZXZpZXcpIHRoaXMubWF5YmVIb3Zlcih0YXJnZXRFbCwgZmlsZSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UudHJpZ2dlcignaG92ZXItbGluaycsIHtcbiAgICAgICAgICAgIGV2ZW50LCBzb3VyY2U6IGhvdmVyU291cmNlLCBob3ZlclBhcmVudDogdGhpcywgdGFyZ2V0RWwsIGxpbmt0ZXh0OiBmaWxlLnBhdGhcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG1heWJlSG92ZXIodGFyZ2V0RWw6IEhUTUxEaXZFbGVtZW50LCBjYjogKGZpbGU6IFRGaWxlKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmICghdGhpcy5jYW5TaG93UG9wb3ZlcigpKSByZXR1cm47XG4gICAgICAgIGxldCBmaWxlID0gdGhpcy5maWxlRm9yRG9tKHRhcmdldEVsKVxuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIGZpbGUgPSB0aGlzLmZvbGRlck5vdGUoZmlsZSk7XG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUgJiYgcHJldmlld0ljb25zW3RoaXMuYXBwLnZpZXdSZWdpc3RyeS5nZXRUeXBlQnlFeHRlbnNpb24oZmlsZS5leHRlbnNpb24pXSkge1xuICAgICAgICAgICAgY2IoZmlsZSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmb2xkZXJOb3RlKGZvbGRlcjogVEZvbGRlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHRoaXMuZm9sZGVyTm90ZVBhdGgoZm9sZGVyKSk7XG4gICAgfVxuXG4gICAgZm9sZGVyTm90ZVBhdGgoZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgICAgIHJldHVybiBgJHtmb2xkZXIucGF0aH0vJHtmb2xkZXIubmFtZX0ubWRgO1xuICAgIH1cblxuXG4gICAgX3BvcG92ZXI6IEhvdmVyRWRpdG9yO1xuXG4gICAgZ2V0IGhvdmVyUG9wb3ZlcigpIHsgcmV0dXJuIHRoaXMuX3BvcG92ZXI7IH1cblxuICAgIHNldCBob3ZlclBvcG92ZXIocG9wb3Zlcikge1xuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLl9wb3BvdmVyO1xuICAgICAgICBpZiAob2xkICYmIHBvcG92ZXIgIT09IG9sZCkge1xuICAgICAgICAgICAgdGhpcy5fcG9wb3ZlciA9IG51bGw7XG4gICAgICAgICAgICBvbGQub25Ib3ZlciA9IGZhbHNlOyAgIC8vIEZvcmNlIHVucGlubmVkIEhvdmVyIEVkaXRvcnMgdG8gY2xvc2VcbiAgICAgICAgICAgIG9sZC5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvcG92ZXIgJiYgIXRoaXMuY2FuU2hvd1BvcG92ZXIoKSkge1xuICAgICAgICAgICAgcG9wb3Zlci5vbkhvdmVyID0gZmFsc2U7ICAgLy8gRm9yY2UgdW5waW5uZWQgSG92ZXIgRWRpdG9ycyB0byBjbG9zZVxuICAgICAgICAgICAgcG9wb3Zlci5oaWRlKCk7XG4gICAgICAgICAgICBwb3BvdmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wb3BvdmVyID0gcG9wb3ZlcjtcbiAgICAgICAgaWYgKGF1dG9QcmV2aWV3ICYmIHBvcG92ZXIgJiYgdGhpcy5jdXJyZW50SXRlbSgpKSB7XG4gICAgICAgICAgICAvLyBPdmVycmlkZSBhdXRvLXBpbm5pbmcgaWYgd2UgYXJlIGdlbmVyYXRpbmcgYXV0by1wcmV2aWV3cywgdG8gYXZvaWRcbiAgICAgICAgICAgIC8vIGdlbmVyYXRpbmcgaHVnZSBudW1iZXJzIG9mIHBvcG92ZXJzXG4gICAgICAgICAgICBwb3BvdmVyLnRvZ2dsZVBpbj8uKGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gUG9zaXRpb24gdGhlIHBvcG92ZXIgc28gaXQgZG9lc24ndCBvdmVybGFwIHRoZSBtZW51IGhvcml6b250YWxseSAoYXMgbG9uZyBhcyBpdCBmaXRzKVxuICAgICAgICAgICAgLy8gYW5kIHNvIHRoYXQgaXRzIHZlcnRpY2FsIHBvc2l0aW9uIG92ZXJsYXBzIHRoZSBzZWxlY3RlZCBtZW51IGl0ZW0gKHBsYWNpbmcgdGhlIHRvcCBhXG4gICAgICAgICAgICAvLyBiaXQgYWJvdmUgdGhlIGN1cnJlbnQgaXRlbSwgdW5sZXNzIGl0IHdvdWxkIGdvIG9mZiB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4pXG4gICAgICAgICAgICBjb25zdCBob3ZlckVsID0gcG9wb3Zlci5ob3ZlckVsO1xuICAgICAgICAgICAgaG92ZXJFbC5zaG93KCk7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG1lbnUgPSB0aGlzLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMuY3VycmVudEl0ZW0oKS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgY29udGFpbmVyID0gaG92ZXJFbC5vZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICAgICAgICAgIHBvcHVwSGVpZ2h0ID0gaG92ZXJFbC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICAgICAgbGVmdCA9IE1hdGgubWluKG1lbnUucmlnaHQgKyAyLCBjb250YWluZXIuY2xpZW50V2lkdGggLSBob3ZlckVsLm9mZnNldFdpZHRoKSxcbiAgICAgICAgICAgICAgICB0b3AgPSBNYXRoLm1pbihNYXRoLm1heCgwLCBzZWxlY3RlZC50b3AgLSBwb3B1cEhlaWdodC84KSwgY29udGFpbmVyLmNsaWVudEhlaWdodCAtIHBvcHVwSGVpZ2h0KVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgaG92ZXJFbC5zdHlsZS50b3AgPSB0b3AgKyBcInB4XCI7XG4gICAgICAgICAgICBob3ZlckVsLnN0eWxlLmxlZnQgPSBsZWZ0ICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25JdGVtQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQsIHRhcmdldDogSFRNTERpdkVsZW1lbnQpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZUZvckRvbSh0YXJnZXQpO1xuICAgICAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICAgICAgaWYgKCF0aGlzLm9uQ2xpY2tGaWxlKGZpbGUsIHRhcmdldCwgZXZlbnQpKSB7XG4gICAgICAgICAgICAvLyBLZWVwIGN1cnJlbnQgbWVudSB0cmVlIG9wZW5cbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xpY2tGaWxlKGZpbGU6IFRBYnN0cmFjdEZpbGUsIHRhcmdldDogSFRNTERpdkVsZW1lbnQsIGV2ZW50PzogTW91c2VFdmVudHxLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGlkZVBvcG92ZXIoKTtcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5pdGVtRm9yUGF0aChmaWxlLnBhdGgpO1xuICAgICAgICBpZiAoaWR4ID49IDAgJiYgdGhpcy5zZWxlY3RlZCAhPSBpZHgpIHRoaXMuc2VsZWN0KGlkeCk7XG5cbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLnZpZXdSZWdpc3RyeS5pc0V4dGVuc2lvblJlZ2lzdGVyZWQoZmlsZS5leHRlbnNpb24pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dChmaWxlLnBhdGgsIFwiXCIsIGV2ZW50ICYmIEtleW1hcC5pc01vZGlmaWVyKGV2ZW50LCBcIk1vZFwiKSk7XG4gICAgICAgICAgICAgICAgLy8gQ2xvc2UgdGhlIGVudGlyZSBtZW51IHRyZWVcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3RNZW51KCkuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGV2ZW50Py5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3IE5vdGljZShgLiR7ZmlsZS5leHRlbnNpb259IGZpbGVzIGNhbm5vdCBiZSBvcGVuZWQgaW4gT2JzaWRpYW47IFVzZSBcIk9wZW4gaW4gRGVmYXVsdCBBcHBcIiB0byBvcGVuIHRoZW0gZXh0ZXJuYWxseWApO1xuICAgICAgICAgICAgICAgIC8vIGZhbGwgdGhyb3VnaFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZpbGUgPT09IHRoaXMuc2VsZWN0ZWRGaWxlKSB7XG4gICAgICAgICAgICAvLyBUYXJnZXRpbmcgdGhlIGluaXRpYWxseS1zZWxlY3RlZCBzdWJmb2xkZXI6IGdvIHRvIG5leHQgYnJlYWRjcnVtYlxuICAgICAgICAgICAgdGhpcy5vcGVuQnJlYWRjcnVtYih0aGlzLm9wZW5lcj8ubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgcG9wIGEgbmV3IG1lbnUgZm9yIHRoZSBzdWJmb2xkZXJcbiAgICAgICAgICAgIGNvbnN0IGZvbGRlck1lbnUgPSBuZXcgRm9sZGVyTWVudSh0aGlzLCBmaWxlIGFzIFRGb2xkZXIsIHRoaXMuZm9sZGVyTm90ZShmaWxlIGFzIFRGb2xkZXIpKTtcbiAgICAgICAgICAgIGZvbGRlck1lbnUuY2FzY2FkZSh0YXJnZXQsIGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCA/IGV2ZW50IDogdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSXRlbU1lbnUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQsIHRhcmdldDogSFRNTERpdkVsZW1lbnQpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZUZvckRvbSh0YXJnZXQpO1xuICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5pdGVtRm9yUGF0aChmaWxlLnBhdGgpO1xuICAgICAgICAgICAgaWYgKGlkeCA+PSAwICYmIHRoaXMuc2VsZWN0ZWQgIT0gaWR4KSB0aGlzLnNlbGVjdChpZHgpO1xuICAgICAgICAgICAgbmV3IENvbnRleHRNZW51KHRoaXMsIGZpbGUpLmNhc2NhZGUodGFyZ2V0LCBldmVudCk7XG4gICAgICAgICAgICAvLyBLZWVwIGN1cnJlbnQgbWVudSB0cmVlIG9wZW5cbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBDb21wb25lbnQsIFRBYnN0cmFjdEZpbGUsIFRGaWxlLCBURm9sZGVyIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBsaXN0LCBlbCB9IGZyb20gXCJyZWRvbVwiO1xuaW1wb3J0IHsgQ29udGV4dE1lbnUgfSBmcm9tIFwiLi9Db250ZXh0TWVudVwiO1xuaW1wb3J0IHsgRm9sZGVyTWVudSB9IGZyb20gXCIuL0ZvbGRlck1lbnVcIjtcblxuZXhwb3J0IGNvbnN0IGhvdmVyU291cmNlID0gXCJxdWljay1leHBsb3Jlcjpmb2xkZXItbWVudVwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xuICAgIGludGVyZmFjZSBBcHAge1xuICAgICAgICBkcmFnTWFuYWdlcjogYW55XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnREcmFnKGFwcDogQXBwLCBwYXRoOiBzdHJpbmcsIGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBpZiAoIXBhdGggfHwgcGF0aCA9PT0gXCIvXCIpIHJldHVybjtcbiAgICBjb25zdCBmaWxlID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBjb25zdCB7IGRyYWdNYW5hZ2VyIH0gPSBhcHA7XG4gICAgY29uc3QgZHJhZ0RhdGEgPSBmaWxlIGluc3RhbmNlb2YgVEZpbGUgPyBkcmFnTWFuYWdlci5kcmFnRmlsZShldmVudCwgZmlsZSkgOiBkcmFnTWFuYWdlci5kcmFnRm9sZGVyKGV2ZW50LCBmaWxlKTtcbiAgICBkcmFnTWFuYWdlci5vbkRyYWdTdGFydChldmVudCwgZHJhZ0RhdGEpO1xufVxuXG5jbGFzcyBFeHBsb3JhYmxlIHtcbiAgICBuYW1lRWwgPSA8c3BhbiBjbGFzcz1cImV4cGxvcmFibGUtbmFtZVwiLz47XG4gICAgc2VwRWwgPSA8c3BhbiBjbGFzcz1cImV4cGxvcmFibGUtc2VwYXJhdG9yXCIvPjtcbiAgICBlbCA9IDxzcGFuIGRyYWdnYWJsZSBjbGFzcz1cImV4cGxvcmFibGUgdGl0bGViYXItYnV0dG9uXCI+e3RoaXMubmFtZUVsfXt0aGlzLnNlcEVsfTwvc3Bhbj47XG4gICAgdXBkYXRlKGRhdGE6IHtmaWxlOiBUQWJzdHJhY3RGaWxlLCBwYXRoOiBzdHJpbmd9LCBpbmRleDogbnVtYmVyLCBpdGVtczogYW55W10pIHtcbiAgICAgICAgY29uc3Qge2ZpbGUsIHBhdGh9ID0gZGF0YTtcbiAgICAgICAgbGV0IG5hbWUgPSBmaWxlLm5hbWUgfHwgcGF0aDtcbiAgICAgICAgdGhpcy5zZXBFbC50b2dnbGUoaW5kZXggPCBpdGVtcy5sZW5ndGgtMSk7XG4gICAgICAgIHRoaXMubmFtZUVsLnRleHRDb250ZW50ID0gbmFtZTtcbiAgICAgICAgdGhpcy5lbC5kYXRhc2V0LnBhcmVudFBhdGggPSBmaWxlLnBhcmVudD8ucGF0aCA/PyBcIi9cIjtcbiAgICAgICAgdGhpcy5lbC5kYXRhc2V0LmZpbGVQYXRoID0gcGF0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHBsb3JlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgbGFzdEZpbGU6IFRBYnN0cmFjdEZpbGUgPSBudWxsO1xuICAgIGxhc3RQYXRoOiBzdHJpbmcgPSBudWxsO1xuICAgIGVsOiBIVE1MRWxlbWVudCA9IDxkaXYgaWQ9XCJxdWljay1leHBsb3JlclwiIC8+O1xuICAgIGxpc3QgPSBsaXN0KHRoaXMuZWwsIEV4cGxvcmFibGUpO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGFwcDogQXBwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICB9XG5cbiAgICBvbmxvYWQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsIHRoaXMudXBkYXRlLCB0aGlzKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgKCkgPT4gdGhpcy51cGRhdGUodGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwicmVuYW1lXCIsIHRoaXMub25GaWxlQ2hhbmdlLCB0aGlzKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImRlbGV0ZVwiLCB0aGlzLm9uRmlsZURlbGV0ZSwgdGhpcykpO1xuXG4gICAgICAgIHRoaXMuZWwub24oXCJjb250ZXh0bWVudVwiLCBcIi5leHBsb3JhYmxlXCIsIChldmVudCwgdGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGZpbGVQYXRoIH0gPSB0YXJnZXQuZGF0YXNldDtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZVBhdGgpO1xuICAgICAgICAgICAgbmV3IENvbnRleHRNZW51KHRoaXMuYXBwLCBmaWxlKS5jYXNjYWRlKHRhcmdldCwgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5lbC5vbihcImNsaWNrXCIsIFwiLmV4cGxvcmFibGVcIiwgKGV2ZW50LCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9sZGVyTWVudSh0YXJnZXQsIGV2ZW50LmlzVHJ1c3RlZCAmJiBldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmVsLm9uKCdkcmFnc3RhcnQnLCBcIi5leHBsb3JhYmxlXCIsIChldmVudCwgdGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICBzdGFydERyYWcodGhpcy5hcHAsIHRhcmdldC5kYXRhc2V0LmZpbGVQYXRoLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRmlsZUNoYW5nZShmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmxhc3RGaWxlKSB0aGlzLnVwZGF0ZShmaWxlKTtcbiAgICB9XG5cbiAgICBvbkZpbGVEZWxldGUoZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBpZiAoZmlsZSA9PT0gdGhpcy5sYXN0RmlsZSkgdGhpcy51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBmb2xkZXJNZW51KG9wZW5lcjogSFRNTEVsZW1lbnQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50LCBldmVudD86IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgY29uc3QgeyBmaWxlUGF0aCwgcGFyZW50UGF0aCB9ID0gb3BlbmVyLmRhdGFzZXRcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGFyZW50UGF0aCkgYXMgVEZvbGRlcjtcbiAgICAgICAgcmV0dXJuIG5ldyBGb2xkZXJNZW51KHRoaXMuYXBwLCBmb2xkZXIsIHNlbGVjdGVkLCBvcGVuZXIpLmNhc2NhZGUob3BlbmVyLCBldmVudCk7XG4gICAgfVxuXG4gICAgYnJvd3NlVmF1bHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvbGRlck1lbnUoKTtcbiAgICB9XG5cbiAgICBicm93c2VDdXJyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb2xkZXJNZW51KHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRGl2RWxlbWVudCk7XG4gICAgfVxuXG4gICAgYnJvd3NlRmlsZShmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSByZXR1cm4gdGhpcy5icm93c2VDdXJyZW50KCk7XG4gICAgICAgIGxldCBtZW51OiBGb2xkZXJNZW51O1xuICAgICAgICBsZXQgb3BlbmVyOiBIVE1MRWxlbWVudCA9IHRoaXMuZWwuZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHBhdGggPSBbXSwgcGFydHMgPSBmaWxlLnBhdGguc3BsaXQoXCIvXCIpLmZpbHRlcihwPT5wKTtcbiAgICAgICAgd2hpbGUgKG9wZW5lciAmJiBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChwYXJ0c1swXSk7XG4gICAgICAgICAgICBpZiAob3BlbmVyLmRhdGFzZXQuZmlsZVBhdGggIT09IHBhdGguam9pbihcIi9cIikpIHtcbiAgICAgICAgICAgICAgICBtZW51ID0gdGhpcy5mb2xkZXJNZW51KG9wZW5lcik7XG4gICAgICAgICAgICAgICAgcGF0aC5wb3AoKTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgICAgIG9wZW5lciA9IG9wZW5lci5uZXh0RWxlbWVudFNpYmxpbmcgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKG1lbnUgJiYgcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gocGFydHMuc2hpZnQoKSk7XG4gICAgICAgICAgICBjb25zdCBpZHggPSBtZW51Lml0ZW1Gb3JQYXRoKHBhdGguam9pbihcIi9cIikpO1xuICAgICAgICAgICAgaWYgKGlkeCA9PSAtMSkgYnJlYWtcbiAgICAgICAgICAgIG1lbnUuc2VsZWN0KGlkeCk7XG4gICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoIHx8IGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgbWVudS5vbkFycm93UmlnaHQoKTtcbiAgICAgICAgICAgICAgICBtZW51ID0gbWVudS5jaGlsZCBhcyBGb2xkZXJNZW51O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZW51O1xuICAgIH1cblxuICAgIHVwZGF0ZShmaWxlPzogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBmaWxlID8/PSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCIvXCIpO1xuICAgICAgICBpZiAoZmlsZSA9PSB0aGlzLmxhc3RGaWxlICYmIGZpbGUucGF0aCA9PSB0aGlzLmxhc3RQYXRoKSByZXR1cm47XG4gICAgICAgIHRoaXMubGFzdEZpbGUgPSBmaWxlO1xuICAgICAgICB0aGlzLmxhc3RQYXRoID0gZmlsZS5wYXRoO1xuICAgICAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoZmlsZSkge1xuICAgICAgICAgICAgcGFydHMudW5zaGlmdCh7IGZpbGUsIHBhdGg6IGZpbGUucGF0aCB9KTtcbiAgICAgICAgICAgIGZpbGUgPSBmaWxlLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgdGhpcy5saXN0LnVwZGF0ZShwYXJ0cyk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQge01lbnVJdGVtLCBQbHVnaW4sIFRBYnN0cmFjdEZpbGUsIFRGb2xkZXJ9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHttb3VudCwgdW5tb3VudH0gZnJvbSBcInJlZG9tXCI7XG5pbXBvcnQge0V4cGxvcmVyLCBob3ZlclNvdXJjZX0gZnJvbSBcIi4vRXhwbG9yZXJcIjtcblxuaW1wb3J0IFwiLi9yZWRvbS1qc3hcIjtcbmltcG9ydCBcIi4vc3R5bGVzLnNjc3NcIlxuXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xuICAgIGludGVyZmFjZSBXb3Jrc3BhY2Uge1xuICAgICAgICByZWdpc3RlckhvdmVyTGlua1NvdXJjZShzb3VyY2U6IHN0cmluZywgaW5mbzoge2Rpc3BsYXk6IHN0cmluZywgZGVmYXVsdE1vZD86IGJvb2xlYW59KTogdm9pZFxuICAgICAgICB1bnJlZ2lzdGVySG92ZXJMaW5rU291cmNlKHNvdXJjZTogc3RyaW5nKTogdm9pZFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBQbHVnaW4ge1xuICAgIHN0YXR1c2Jhckl0ZW06IEhUTUxFbGVtZW50XG4gICAgZXhwbG9yZXI6IEV4cGxvcmVyXG5cbiAgICBvbmxvYWQoKSB7XG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5ib2R5LmZpbmQoXCIudGl0bGViYXIgLnRpdGxlYmFyLWJ1dHRvbi1jb250YWluZXIubW9kLWxlZnRcIik7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyKCgpID0+IHVubW91bnQoYnV0dG9uQ29udGFpbmVyLCB0aGlzLmV4cGxvcmVyKSk7XG4gICAgICAgICAgICBtb3VudChidXR0b25Db250YWluZXIsIHRoaXMuZXhwbG9yZXIgPSBuZXcgRXhwbG9yZXIodGhpcy5hcHApKTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5leHBsb3Jlcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5yZWdpc3RlckhvdmVyTGlua1NvdXJjZShob3ZlclNvdXJjZSwge1xuICAgICAgICAgICAgZGlzcGxheTogJ1F1aWNrIEV4cGxvcmVyJywgZGVmYXVsdE1vZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJicm93c2UtdmF1bHRcIiwgICBuYW1lOiBcIkJyb3dzZSB2YXVsdFwiLCAgICAgICAgICBjYWxsYmFjazogKCkgPT4geyB0aGlzLmV4cGxvcmVyPy5icm93c2VWYXVsdCgpOyB9LCB9KTtcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwiYnJvd3NlLWN1cnJlbnRcIiwgbmFtZTogXCJCcm93c2UgY3VycmVudCBmb2xkZXJcIiwgY2FsbGJhY2s6ICgpID0+IHsgdGhpcy5leHBsb3Jlcj8uYnJvd3NlQ3VycmVudCgpOyB9LCB9KTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1tZW51XCIsIChtZW51LCBmaWxlLCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtOiBNZW51SXRlbVxuICAgICAgICAgICAgaWYgKHNvdXJjZSAhPT0gXCJxdWljay1leHBsb3JlclwiKSBtZW51LmFkZEl0ZW0oaSA9PiB7XG4gICAgICAgICAgICAgICAgaS5zZXRJY29uKFwiZm9sZGVyXCIpLnNldFRpdGxlKFwiU2hvdyBpbiBRdWljayBFeHBsb3JlclwiKS5vbkNsaWNrKGUgPT4geyB0aGlzLmV4cGxvcmVyPy5icm93c2VGaWxlKGZpbGUpOyB9KTtcbiAgICAgICAgICAgICAgICBpdGVtID0gaTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldmVhbEZpbGUgPSBpMThuZXh0LnQoYHBsdWdpbnMuZmlsZS1leHBsb3Jlci5hY3Rpb24tcmV2ZWFsLWZpbGVgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBtZW51Lml0ZW1zLmZpbmRJbmRleChpID0+IGkudGl0bGVFbC50ZXh0Q29udGVudCA9PT0gcmV2ZWFsRmlsZSk7XG4gICAgICAgICAgICAgICAgKG1lbnUuZG9tIGFzIEhUTUxFbGVtZW50KS5pbnNlcnRCZWZvcmUoaXRlbS5kb20sIG1lbnUuaXRlbXNbaWR4KzFdLmRvbSk7XG4gICAgICAgICAgICAgICAgbWVudS5pdGVtcy5yZW1vdmUoaXRlbSk7XG4gICAgICAgICAgICAgICAgbWVudS5pdGVtcy5zcGxpY2UoaWR4KzEsIDAsIGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRGb2xkZXIucHJvdG90eXBlLCBcImJhc2VuYW1lXCIsIHtnZXQoKXsgcmV0dXJuIHRoaXMubmFtZTsgfSwgY29uZmlndXJhYmxlOiB0cnVlfSlcbiAgICB9XG5cbiAgICBvbnVubG9hZCgpIHtcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnVucmVnaXN0ZXJIb3ZlckxpbmtTb3VyY2UoaG92ZXJTb3VyY2UpO1xuICAgIH1cblxufVxuIl0sIm5hbWVzIjpbIk1lbnUiLCJBcHAiLCJkZWJvdW5jZSIsIlNjb3BlIiwiTWVudUl0ZW0iLCJLZXltYXAiLCJURm9sZGVyIiwiTm90aWNlIiwiVEZpbGUiLCJGaWxlVmlldyIsIk1hcmtkb3duVmlldyIsIkNvbXBvbmVudCIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFNBQVMsVUFBVSxFQUFFLEtBQUssRUFBRTtBQUM1QixFQUFFLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckMsRUFBRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbkIsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDZCxFQUFFLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUN0QjtBQUNBLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUMsSUFBSSxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFHLEVBQUU7QUFDdkIsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkIsS0FBSyxNQUFNLElBQUksS0FBSyxLQUFLLEdBQUcsRUFBRTtBQUM5QixNQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUMs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R0FBR0MsaUJBQVEsQ0FBQyxNQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNyRSxJQUFPLENBQUEsT0FBQSxHQUFZLEtBQUssQ0FBQTtRQUN4QixJQUFTLENBQUEsU0FBQSxHQUFZLEtBQUssQ0FBQTtRQUl0QixJQUFJLE1BQU0sWUFBWSxTQUFTO0FBQUUsWUFBQSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTNELFFBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJQyxjQUFLLENBQUM7QUFDdkIsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDaEUsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEUsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUQsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDL0QsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFbEUsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDeEQsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDdkQsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztRQUlwRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLENBQUMsSUFBSSxFQUFBO0FBQUcsZ0JBQUEsT0FBTyxVQUFTLE1BQVksRUFBQTtvQkFDMUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hFLG9CQUFBLE9BQU8sR0FBRyxDQUFDO0FBQ2YsaUJBQUMsQ0FBQTthQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ0wsUUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUN0QztJQUVELFFBQVEsR0FBQTtRQUNKLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFFBQUEsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCxNQUFNLEdBQUE7QUFDRixRQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMzRCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZixRQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNwQixRQUFBLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOztBQUV0QixRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxDQUFDLEtBQWlCLEVBQUUsTUFBc0IsS0FBSTtBQUN2RyxZQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbkUsYUFBQTtBQUNELFlBQUEsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDMUIsQ0FBQyxDQUFDLENBQUM7S0FDUDtJQUVELFFBQVEsR0FBQTtBQUNKLFFBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3BCOztBQUdELElBQUEsT0FBTyxDQUFDLEVBQXdCLEVBQUE7QUFDNUIsUUFBQSxNQUFNLENBQUMsR0FBRyxJQUFJQyxpQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLFFBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ04sUUFBQSxPQUFPLElBQUksQ0FBQztLQUNmO0FBRUQsSUFBQSxTQUFTLENBQUMsS0FBb0IsRUFBQTtRQUMxQixNQUFNLEdBQUcsR0FBR0MsZUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLE9BQU8sQ0FBQyxFQUFHO1lBQzVFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQzs7WUFFbkMsT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztBQUFFLGdCQUFBLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLFlBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7QUFDL0IsU0FBQTtRQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0FBRUQsSUFBQSxTQUFTLENBQUMsS0FBYSxFQUFBO0FBQ25CLFFBQUEsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDL0MsUUFBQSxRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxHQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEQsWUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xELFlBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQy9DO0tBQ0w7QUFFRCxJQUFBLElBQUksQ0FBQyxPQUFlLEVBQUE7QUFDaEIsUUFBQSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckMsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxZQUFBLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRO2dCQUFFLFNBQVM7QUFDeEMsWUFBQSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDakQsZ0JBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQixnQkFBQSxPQUFPLElBQUksQ0FBQztBQUNmLGFBQUE7QUFDSixTQUFBO0FBQ0QsUUFBQSxPQUFPLEtBQUssQ0FBQTtLQUNmO0FBRUQsSUFBQSxPQUFPLENBQUMsS0FBb0IsRUFBQTtRQUN4QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QyxRQUFBLElBQUksSUFBSSxFQUFFO0FBQ04sWUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUV4QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hDLFNBQUE7QUFDRCxRQUFBLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0FBRUQsSUFBQSxNQUFNLENBQUMsQ0FBUyxFQUFFLE1BQU0sR0FBRyxJQUFJLEVBQUE7QUFDM0IsUUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtBQUNmLFFBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQixRQUFBLElBQUksTUFBTTtZQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUNuQztJQUVELFlBQVksR0FBQTtBQUNSLFFBQUEsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQzFDLFFBQUEsSUFBSSxFQUFFLEVBQUU7QUFDSixZQUFBLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0UsWUFBQSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNyRSxTQUFBO0tBQ0o7SUFFRCxRQUFRLEdBQUE7QUFDSixRQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDMUQ7QUFFRCxJQUFBLEtBQUssQ0FBQyxDQUFnQixFQUFBO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ2xDLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO0FBQUUsWUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzVELFFBQUEsT0FBTyxLQUFLLENBQUM7S0FDaEI7QUFFRCxJQUFBLE1BQU0sQ0FBQyxDQUFnQixFQUFBO1FBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixRQUFBLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkIsUUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLFFBQUEsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCxXQUFXLEdBQUE7QUFDUCxRQUFBLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMxQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDZixTQUFBO0FBQ0QsUUFBQSxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUVELFlBQVksR0FBQTs7QUFFUixRQUFBLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBRUQsSUFBSSxHQUFBO0FBQ0EsUUFBQSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDcEIsUUFBQSxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN2QjtBQUVELElBQUEsWUFBWSxDQUFDLElBQVcsRUFBQTtBQUNwQixRQUFBLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDbkIsUUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztLQUNyQjtJQUVELFFBQVEsR0FBQTtBQUNKLFFBQUEsT0FBTyxJQUFJLENBQUMsTUFBTSxZQUFZSixZQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDckU7QUFFRCxJQUFBLE9BQU8sQ0FBQyxNQUFtQixFQUFFLEtBQWtCLEVBQUUsT0FBbUIsRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUE7QUFDN0YsUUFBQSxNQUFNLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ25FLE1BQUEsT0FBTyxHQUFHLElBQUksR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQTJCO0FBQ3RFLFFBQUEsTUFBTSxFQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUMsR0FBRyxNQUFNLENBQUM7OztRQUl6QyxNQUFNLEtBQUssR0FBRyxFQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBSSxRQUFRLEdBQUcsT0FBTyxFQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsUUFBUSxFQUFDLENBQUM7O1FBR3RGLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxNQUFNLEVBQUMsV0FBVyxFQUFFLFlBQVksRUFBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDN0MsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ3ZELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsV0FBVyxJQUFJLFVBQVUsQ0FBQzs7OztRQUt0RCxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ1osS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxXQUFXLElBQUksTUFBTSxHQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxRQUFRLEdBQUUsV0FBVyxDQUFDO0FBQ2pGLFNBQUE7Ozs7UUFLRCxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ1osS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksU0FBUyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFDdEYsU0FBQTs7QUFHRCxRQUFBLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRzNCLFFBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckMsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQUs7QUFDYixZQUFBLElBQUksSUFBSSxDQUFDLE1BQU0sWUFBWUEsWUFBRztBQUFFLGdCQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pFLGlCQUFBLElBQUksSUFBSSxDQUFDLE1BQU0sWUFBWSxTQUFTO0FBQUUsZ0JBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUN0RSxZQUFBLElBQUksT0FBTztBQUFFLGdCQUFBLE9BQU8sRUFBRSxDQUFDO0FBQzNCLFNBQUMsQ0FBQyxDQUFDO0FBQ0gsUUFBQSxPQUFPLElBQUksQ0FBQztLQUNmO0FBQ0osQ0FBQTtBQUVELFNBQVMsV0FBVyxDQUFDLENBQVMsRUFBQTtJQUMxQixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUNkLEVBQWUsRUFBRSxJQUFPLEVBQUUsUUFBZSxFQUN6QyxRQUE2RixFQUM3RixPQUFBLEdBQTZDLEtBQUssRUFBQTtJQUVsRCxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3hDLElBQUEsT0FBTyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0Q7O0FDdk5BLFNBQVMsT0FBTyxDQUFDLElBQVksRUFBQTtJQUN6QixPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsa0NBQWtDLElBQUksQ0FBQSxDQUFFLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUssTUFBTyxXQUFZLFNBQVEsU0FBUyxDQUFBO0lBQ3RDLFdBQVksQ0FBQSxNQUFrQixFQUFFLElBQW1CLEVBQUE7UUFDL0MsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2QsUUFBQSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUMvQixRQUFBLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUVuRixJQUFJLElBQUksWUFBWUssZ0JBQU8sRUFBRTtBQUN6QixZQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFNLENBQUMsS0FBRztBQUN0RixnQkFBQSxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZFLGdCQUFBLElBQUksT0FBTztvQkFBRSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQ0QsZUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQ3pGLHdCQUFBLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUNuRSxxQkFBQSxDQUFDLENBQUE7YUFDTCxDQUFDLENBQUMsQ0FBQztBQUNKLFlBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFHO0FBQ2pILGdCQUFBLElBQUksZ0JBQWdCLEVBQUU7QUFDbEIsb0JBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0QsaUJBQUE7QUFBTSxxQkFBQTtBQUNILG9CQUFBLElBQUlFLGVBQU0sQ0FBQyxxRUFBcUUsQ0FBQyxDQUFBO29CQUNqRixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDM0IsaUJBQUE7YUFDSixDQUFDLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQUs7QUFDOUYsZ0JBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN0QyxDQUFDLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUN2QixTQUFBO0FBQ0QsUUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBRztBQUNiLFlBQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBRztnQkFDNUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkQsYUFBQyxDQUFDLENBQUM7QUFDUCxTQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFLO1lBQzFFLElBQUksSUFBSSxZQUFZRCxnQkFBTyxFQUFFO2dCQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0RCxhQUFBO2lCQUNJLElBQUksSUFBSSxZQUFZRSxjQUFLLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BELGFBQUE7U0FDSixDQUFDLENBQUMsQ0FBQztBQUNKLFFBQUEsSUFBSSxJQUFJLFlBQVlGLGdCQUFPLElBQUksZ0JBQWdCLEVBQUU7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQUs7QUFDL0csZ0JBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMzQixDQUFDLENBQUMsQ0FBQztBQUNQLFNBQUE7QUFDRCxRQUFBLElBQUksSUFBSSxLQUFLLFNBQVMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtBQUNwQyxZQUFBLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3RGLFNBQUE7QUFBTSxhQUFBO1lBQ0gsU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hFLFNBQUE7S0FDSjtBQUVELElBQUEsWUFBWSxDQUFDLElBQW1CLEVBQUE7QUFDNUIsUUFBQSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbkUsSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO0FBQ2xCLFlBQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsWUFBQSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUF3QixDQUFBO0FBQ3pGLFNBQUE7S0FDSjtBQUNKOztBQ3BFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUU1RyxNQUFNLFlBQVksR0FBMkI7QUFDekMsSUFBQSxRQUFRLEVBQUUsVUFBVTtBQUNwQixJQUFBLEtBQUssRUFBRSxZQUFZO0FBQ25CLElBQUEsS0FBSyxFQUFFLFlBQVk7QUFDbkIsSUFBQSxHQUFHLEVBQUUsVUFBVTtDQUNsQixDQUFBO0FBRUQsTUFBTSxhQUFhLEdBQTJCO0FBQzFDLElBQUEsR0FBRyxZQUFZOztBQUVmLElBQUEsVUFBVSxFQUFFLGlCQUFpQjtDQUNoQyxDQUFDO0FBR0Y7QUFDQSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUE7QUFFaEIsTUFBTyxVQUFXLFNBQVEsU0FBUyxDQUFBO0FBSXJDLElBQUEsV0FBQSxDQUFtQixNQUFrQixFQUFTLE1BQWUsRUFBUyxZQUE0QixFQUFTLE1BQW9CLEVBQUE7UUFDM0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBREMsSUFBTSxDQUFBLE1BQUEsR0FBTixNQUFNLENBQVk7UUFBUyxJQUFNLENBQUEsTUFBQSxHQUFOLE1BQU0sQ0FBUztRQUFTLElBQVksQ0FBQSxZQUFBLEdBQVosWUFBWSxDQUFnQjtRQUFTLElBQU0sQ0FBQSxNQUFBLEdBQU4sTUFBTSxDQUFjO0FBRi9ILFFBQUEsSUFBQSxDQUFBLFlBQVksR0FBWSxJQUFJLENBQUMsTUFBTSxZQUFZLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUF5THRGLElBQVMsQ0FBQSxTQUFBLEdBQW9DLENBQUMsSUFBbUIsTUFDN0QsSUFBSSxZQUFZQSxnQkFBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ3RILENBQUE7UUEwQkQsSUFBWSxDQUFBLFlBQUEsR0FBR0osaUJBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFpRTFGLFFBQUEsSUFBQSxDQUFBLFdBQVcsR0FBR0EsaUJBQVEsQ0FBQyxNQUFLO1lBQ3hCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixZQUFBLElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU87QUFDekIsWUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUgsU0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUVaLFFBQUEsSUFBQSxDQUFBLFdBQVcsR0FBRyxDQUFDLEtBQWlCLEVBQUUsUUFBd0IsS0FBSTtBQUMxRCxZQUFBLElBQUksQ0FBQyxXQUFXO0FBQUUsZ0JBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7QUFDekYsb0JBQUEsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQy9FLGlCQUFBLENBQUMsQ0FBQyxDQUFDO0FBQ1IsU0FBQyxDQUFBO0FBNERELFFBQUEsSUFBQSxDQUFBLFdBQVcsR0FBRyxDQUFDLEtBQWlCLEVBQUUsTUFBc0IsS0FBSTtZQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLFlBQUEsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTztZQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFOztnQkFFeEMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsZ0JBQUEsT0FBTyxLQUFLLENBQUM7QUFDaEIsYUFBQTtBQUNMLFNBQUMsQ0FBQTtBQTRCRCxRQUFBLElBQUEsQ0FBQSxVQUFVLEdBQUcsQ0FBQyxLQUFpQixFQUFFLE1BQXNCLEtBQUk7WUFDdkQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQyxZQUFBLElBQUksSUFBSSxFQUFFO2dCQUNOLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxHQUFHO0FBQUUsb0JBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2RCxnQkFBQSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzs7Z0JBRW5ELEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUMzQixhQUFBO0FBQ0wsU0FBQyxDQUFBO0FBdFlHLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDckMsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQVMsS0FBSyxFQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFJLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUksT0FBTyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMvRSxRQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBUyxJQUFJLEVBQUssSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQy9FLFFBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFTLElBQUksRUFBSyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O1FBR2hFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBUSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFNLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDN0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMs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

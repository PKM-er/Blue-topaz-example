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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzLy5wbnBtL3JlZG9tQDMuMjcuMS9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9tb25rZXktYXJvdW5kQDIuMy4wL25vZGVfbW9kdWxlcy9tb25rZXktYXJvdW5kL21qcy9pbmRleC5qcyIsInNyYy9tZW51cy50cyIsInNyYy9Db250ZXh0TWVudS50cyIsInNyYy9Gb2xkZXJNZW51LnRzIiwic3JjL0V4cGxvcmVyLnRzeCIsInNyYy9xdWljay1leHBsb3Jlci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gcGFyc2VRdWVyeSAocXVlcnkpIHtcbiAgdmFyIGNodW5rcyA9IHF1ZXJ5LnNwbGl0KC8oWyMuXSkvKTtcbiAgdmFyIHRhZ05hbWUgPSAnJztcbiAgdmFyIGlkID0gJyc7XG4gIHZhciBjbGFzc05hbWVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY2h1bmsgPSBjaHVua3NbaV07XG4gICAgaWYgKGNodW5rID09PSAnIycpIHtcbiAgICAgIGlkID0gY2h1bmtzWysraV07XG4gICAgfSBlbHNlIGlmIChjaHVuayA9PT0gJy4nKSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2goY2h1bmtzWysraV0pO1xuICAgIH0gZWxzZSBpZiAoY2h1bmsubGVuZ3RoKSB7XG4gICAgICB0YWdOYW1lID0gY2h1bms7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0YWc6IHRhZ05hbWUgfHwgJ2RpdicsXG4gICAgaWQ6IGlkLFxuICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lcy5qb2luKCcgJylcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCAocXVlcnksIG5zKSB7XG4gIHZhciByZWYgPSBwYXJzZVF1ZXJ5KHF1ZXJ5KTtcbiAgdmFyIHRhZyA9IHJlZi50YWc7XG4gIHZhciBpZCA9IHJlZi5pZDtcbiAgdmFyIGNsYXNzTmFtZSA9IHJlZi5jbGFzc05hbWU7XG4gIHZhciBlbGVtZW50ID0gbnMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZykgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cbiAgaWYgKGlkKSB7XG4gICAgZWxlbWVudC5pZCA9IGlkO1xuICB9XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGlmIChucykge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHVubW91bnQgKHBhcmVudCwgY2hpbGQpIHtcbiAgdmFyIHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgdmFyIGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZEVsLnBhcmVudE5vZGUpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKTtcblxuICAgIHBhcmVudEVsLnJlbW92ZUNoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiBkb1VubW91bnQgKGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCkge1xuICB2YXIgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsICdvbnVubW91bnQnKTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIHZhciBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlIHx8IHt9O1xuXG4gICAgZm9yICh2YXIgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5IChob29rcykge1xuICBpZiAoaG9va3MgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBob29rcykge1xuICAgIGlmIChob29rc1trZXldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiBnbG9iYWwgTm9kZSwgU2hhZG93Um9vdCAqL1xuXG52YXIgaG9va05hbWVzID0gWydvbm1vdW50JywgJ29ucmVtb3VudCcsICdvbnVubW91bnQnXTtcbnZhciBzaGFkb3dSb290QXZhaWxhYmxlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ1NoYWRvd1Jvb3QnIGluIHdpbmRvdztcblxuZnVuY3Rpb24gbW91bnQgKHBhcmVudCwgY2hpbGQsIGJlZm9yZSwgcmVwbGFjZSkge1xuICB2YXIgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICB2YXIgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkICE9PSBjaGlsZEVsKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX3ZpZXcgPSBjaGlsZDtcbiAgfVxuXG4gIHZhciB3YXNNb3VudGVkID0gY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQ7XG4gIHZhciBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgKG9sZFBhcmVudCAhPT0gcGFyZW50RWwpKSB7XG4gICAgZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBvbGRQYXJlbnQpO1xuICB9XG5cbiAgaWYgKGJlZm9yZSAhPSBudWxsKSB7XG4gICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50RWwuaW5zZXJ0QmVmb3JlKGNoaWxkRWwsIGdldEVsKGJlZm9yZSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChjaGlsZEVsKTtcbiAgfVxuXG4gIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpO1xuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlciAoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSAnb25tb3VudCcgfHwgZXZlbnROYW1lID09PSAnb25yZW1vdW50Jykge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAnb251bm1vdW50Jykge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGhvb2tzID0gZWwuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgaWYgKCFob29rcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB2aWV3ID0gZWwuX19yZWRvbV92aWV3O1xuICB2YXIgaG9va0NvdW50ID0gMDtcblxuICB2aWV3ICYmIHZpZXdbZXZlbnROYW1lXSAmJiB2aWV3W2V2ZW50TmFtZV0oKTtcblxuICBmb3IgKHZhciBob29rIGluIGhvb2tzKSB7XG4gICAgaWYgKGhvb2spIHtcbiAgICAgIGhvb2tDb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChob29rQ291bnQpIHtcbiAgICB2YXIgdHJhdmVyc2UgPSBlbC5maXJzdENoaWxkO1xuXG4gICAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgICB2YXIgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQgKGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KSB7XG4gIHZhciBob29rcyA9IGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgfHwgKGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fSk7XG4gIHZhciByZW1vdW50ID0gKHBhcmVudEVsID09PSBvbGRQYXJlbnQpO1xuICB2YXIgaG9va3NGb3VuZCA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsaXN0ID0gaG9va05hbWVzOyBpIDwgbGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHZhciBob29rTmFtZSA9IGxpc3RbaV07XG5cbiAgICBpZiAoIXJlbW91bnQpIHsgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkgeyAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICB2YXIgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgKHRyYXZlcnNlICYmIHRyYXZlcnNlLl9fcmVkb21fbW91bnRlZCkpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIHJlbW91bnQgPyAnb25yZW1vdW50JyA6ICdvbm1vdW50Jyk7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIHZhciBwYXJlbnQgPSB0cmF2ZXJzZS5wYXJlbnROb2RlO1xuICAgIHZhciBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlIHx8ICh0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9KTtcblxuICAgIGZvciAodmFyIGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0cmF2ZXJzZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8XG4gICAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmICh0cmF2ZXJzZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpKSB8fFxuICAgICAgICAocGFyZW50ICYmIHBhcmVudC5fX3JlZG9tX21vdW50ZWQpXG4gICAgICApIHtcbiAgICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgcmVtb3VudCA/ICdvbnJlbW91bnQnIDogJ29ubW91bnQnKTtcbiAgICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZSAodmlldywgYXJnMSwgYXJnMikge1xuICB2YXIgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2V0U3R5bGVWYWx1ZShlbCwgYXJnMSwgYXJnMik7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0U3R5bGVWYWx1ZSAoZWwsIGtleSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICBlbC5zdHlsZVtrZXldID0gJyc7XG4gIH0gZWxzZSB7XG4gICAgZWwuc3R5bGVba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cbnZhciB4bGlua25zID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xuXG5mdW5jdGlvbiBzZXRBdHRyICh2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIHNldEF0dHJJbnRlcm5hbCh2aWV3LCBhcmcxLCBhcmcyKTtcbn1cblxuZnVuY3Rpb24gc2V0QXR0ckludGVybmFsICh2aWV3LCBhcmcxLCBhcmcyLCBpbml0aWFsKSB7XG4gIHZhciBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIHZhciBpc09iaiA9IHR5cGVvZiBhcmcxID09PSAnb2JqZWN0JztcblxuICBpZiAoaXNPYmopIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpc1NWRyA9IGVsIGluc3RhbmNlb2YgU1ZHRWxlbWVudDtcbiAgICB2YXIgaXNGdW5jID0gdHlwZW9mIGFyZzIgPT09ICdmdW5jdGlvbic7XG5cbiAgICBpZiAoYXJnMSA9PT0gJ3N0eWxlJyAmJiB0eXBlb2YgYXJnMiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNldFN0eWxlKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKGlzU1ZHICYmIGlzRnVuYykge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSBpZiAoYXJnMSA9PT0gJ2RhdGFzZXQnKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIChhcmcxICE9PSAnbGlzdCcpKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiAoYXJnMSA9PT0gJ3hsaW5rJykpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSAnY2xhc3MnKSB7XG4gICAgICAgIGFyZzIgPSBlbC5jbGFzc05hbWUgKyAnICcgKyBhcmcyO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldFhsaW5rIChlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFhsaW5rKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rbnMsIGFyZzEsIGFyZzIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0RGF0YSAoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXREYXRhKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLmRhdGFzZXRbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZWwuZGF0YXNldFthcmcxXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdGV4dCAoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgoc3RyICE9IG51bGwpID8gc3RyIDogJycpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsIChlbGVtZW50LCBhcmdzLCBpbml0aWFsKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsaXN0ID0gYXJnczsgaSA8IGxpc3QubGVuZ3RoOyBpICs9IDEpIHtcbiAgICB2YXIgYXJnID0gbGlzdFtpXTtcblxuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgYXJnO1xuXG4gICAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFyZyhlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRleHQoYXJnKSk7XG4gICAgfSBlbHNlIGlmIChpc05vZGUoZ2V0RWwoYXJnKSkpIHtcbiAgICAgIG1vdW50KGVsZW1lbnQsIGFyZyk7XG4gICAgfSBlbHNlIGlmIChhcmcubGVuZ3RoKSB7XG4gICAgICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZywgaW5pdGlhbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsZW1lbnQsIGFyZywgbnVsbCwgaW5pdGlhbCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVuc3VyZUVsIChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09ICdzdHJpbmcnID8gaHRtbChwYXJlbnQpIDogZ2V0RWwocGFyZW50KTtcbn1cblxuZnVuY3Rpb24gZ2V0RWwgKHBhcmVudCkge1xuICByZXR1cm4gKHBhcmVudC5ub2RlVHlwZSAmJiBwYXJlbnQpIHx8ICghcGFyZW50LmVsICYmIHBhcmVudCkgfHwgZ2V0RWwocGFyZW50LmVsKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlIChhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiBhcmcubm9kZVR5cGU7XG59XG5cbnZhciBodG1sQ2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gaHRtbCAocXVlcnkpIHtcbiAgdmFyIGFyZ3MgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgYXJnc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICB2YXIgZWxlbWVudDtcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBlbGVtZW50ID0gbWVtb2l6ZUhUTUwocXVlcnkpLmNsb25lTm9kZShmYWxzZSk7XG4gIH0gZWxzZSBpZiAoaXNOb2RlKHF1ZXJ5KSkge1xuICAgIGVsZW1lbnQgPSBxdWVyeS5jbG9uZU5vZGUoZmFsc2UpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IChGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseSggUXVlcnksIFsgbnVsbCBdLmNvbmNhdCggYXJncykgKSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgYXJndW1lbnQgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG52YXIgZWwgPSBodG1sO1xudmFyIGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwgKHF1ZXJ5KSB7XG4gIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGFyZ3NbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgdmFyIGNsb25lID0gbWVtb2l6ZUhUTUwocXVlcnkpO1xuXG4gIHJldHVybiBodG1sLmJpbmQuYXBwbHkoaHRtbCwgWyB0aGlzLCBjbG9uZSBdLmNvbmNhdCggYXJncyApKTtcbn07XG5cbmZ1bmN0aW9uIG1lbW9pemVIVE1MIChxdWVyeSkge1xuICByZXR1cm4gaHRtbENhY2hlW3F1ZXJ5XSB8fCAoaHRtbENhY2hlW3F1ZXJ5XSA9IGNyZWF0ZUVsZW1lbnQocXVlcnkpKTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4gKHBhcmVudCkge1xuICB2YXIgY2hpbGRyZW4gPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgY2hpbGRyZW5bIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgdmFyIHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgdmFyIGN1cnJlbnQgPSB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkcmVuLCBwYXJlbnRFbC5maXJzdENoaWxkKTtcblxuICB3aGlsZSAoY3VycmVudCkge1xuICAgIHZhciBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlIChwYXJlbnQsIGNoaWxkcmVuLCBfY3VycmVudCkge1xuICB2YXIgY3VycmVudCA9IF9jdXJyZW50O1xuXG4gIHZhciBjaGlsZEVscyA9IG5ldyBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAodmFyIGkkMSA9IDA7IGkkMSA8IGNoaWxkcmVuLmxlbmd0aDsgaSQxKyspIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpJDFdO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkRWwgPSBjaGlsZEVsc1tpJDFdO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgdmFyIG5leHQgPSBjdXJyZW50ICYmIGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICB2YXIgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgdmFyIHJlcGxhY2UgPSBleGlzdHMgJiYgbmV4dCA9PT0gY2hpbGRFbHNbaSQxICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sIChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbnZhciBMaXN0UG9vbCA9IGZ1bmN0aW9uIExpc3RQb29sIChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHRoaXMuVmlldyA9IFZpZXc7XG4gIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgdGhpcy5sb29rdXAgPSB7fTtcbiAgdGhpcy5vbGRWaWV3cyA9IFtdO1xuICB0aGlzLnZpZXdzID0gW107XG5cbiAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgdGhpcy5rZXkgPSB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nID8ga2V5IDogcHJvcEtleShrZXkpO1xuICB9XG59O1xuXG5MaXN0UG9vbC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChkYXRhLCBjb250ZXh0KSB7XG4gIHZhciByZWYgPSB0aGlzO1xuICAgIHZhciBWaWV3ID0gcmVmLlZpZXc7XG4gICAgdmFyIGtleSA9IHJlZi5rZXk7XG4gICAgdmFyIGluaXREYXRhID0gcmVmLmluaXREYXRhO1xuICB2YXIga2V5U2V0ID0ga2V5ICE9IG51bGw7XG5cbiAgdmFyIG9sZExvb2t1cCA9IHRoaXMubG9va3VwO1xuICB2YXIgbmV3TG9va3VwID0ge307XG5cbiAgdmFyIG5ld1ZpZXdzID0gbmV3IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgdmFyIG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGRhdGFbaV07XG4gICAgdmFyIHZpZXcgPSAodm9pZCAwKTtcblxuICAgIGlmIChrZXlTZXQpIHtcbiAgICAgIHZhciBpZCA9IGtleShpdGVtKTtcblxuICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgbmV3TG9va3VwW2lkXSA9IHZpZXc7XG4gICAgICB2aWV3Ll9fcmVkb21faWQgPSBpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlldyA9IG9sZFZpZXdzW2ldIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICB9XG4gICAgdmlldy51cGRhdGUgJiYgdmlldy51cGRhdGUoaXRlbSwgaSwgZGF0YSwgY29udGV4dCk7XG5cbiAgICB2YXIgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgIGVsLl9fcmVkb21fdmlldyA9IHZpZXc7XG4gICAgbmV3Vmlld3NbaV0gPSB2aWV3O1xuICB9XG5cbiAgdGhpcy5vbGRWaWV3cyA9IG9sZFZpZXdzO1xuICB0aGlzLnZpZXdzID0gbmV3Vmlld3M7XG5cbiAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gIHRoaXMubG9va3VwID0gbmV3TG9va3VwO1xufTtcblxuZnVuY3Rpb24gcHJvcEtleSAoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QgKHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxudmFyIExpc3QgPSBmdW5jdGlvbiBMaXN0IChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgdGhpcy5WaWV3ID0gVmlldztcbiAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB0aGlzLnZpZXdzID0gW107XG4gIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgdGhpcy5lbCA9IGVuc3VyZUVsKHBhcmVudCk7XG4gIHRoaXMua2V5U2V0ID0ga2V5ICE9IG51bGw7XG59O1xuXG5MaXN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKGRhdGEsIGNvbnRleHQpIHtcbiAgICBpZiAoIGRhdGEgPT09IHZvaWQgMCApIGRhdGEgPSBbXTtcblxuICB2YXIgcmVmID0gdGhpcztcbiAgICB2YXIga2V5U2V0ID0gcmVmLmtleVNldDtcbiAgdmFyIG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICB0aGlzLnBvb2wudXBkYXRlKGRhdGEsIGNvbnRleHQpO1xuXG4gIHZhciByZWYkMSA9IHRoaXMucG9vbDtcbiAgICB2YXIgdmlld3MgPSByZWYkMS52aWV3cztcbiAgICB2YXIgbG9va3VwID0gcmVmJDEubG9va3VwO1xuXG4gIGlmIChrZXlTZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2xkVmlldyA9IG9sZFZpZXdzW2ldO1xuICAgICAgdmFyIGlkID0gb2xkVmlldy5fX3JlZG9tX2lkO1xuXG4gICAgICBpZiAobG9va3VwW2lkXSA9PSBudWxsKSB7XG4gICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgIHVubW91bnQodGhpcywgb2xkVmlldyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSQxID0gMDsgaSQxIDwgdmlld3MubGVuZ3RoOyBpJDErKykge1xuICAgIHZhciB2aWV3ID0gdmlld3NbaSQxXTtcblxuICAgIHZpZXcuX19yZWRvbV9pbmRleCA9IGkkMTtcbiAgfVxuXG4gIHNldENoaWxkcmVuKHRoaXMsIHZpZXdzKTtcblxuICBpZiAoa2V5U2V0KSB7XG4gICAgdGhpcy5sb29rdXAgPSBsb29rdXA7XG4gIH1cbiAgdGhpcy52aWV3cyA9IHZpZXdzO1xufTtcblxuTGlzdC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRMaXN0IChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuZnVuY3Rpb24gcGxhY2UgKFZpZXcsIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgUGxhY2UoVmlldywgaW5pdERhdGEpO1xufVxuXG52YXIgUGxhY2UgPSBmdW5jdGlvbiBQbGFjZSAoVmlldywgaW5pdERhdGEpIHtcbiAgdGhpcy5lbCA9IHRleHQoJycpO1xuICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgdGhpcy52aWV3ID0gbnVsbDtcbiAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gIGlmIChWaWV3IGluc3RhbmNlb2YgTm9kZSkge1xuICAgIHRoaXMuX2VsID0gVmlldztcbiAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgIHRoaXMuX2VsID0gVmlldztcbiAgICB0aGlzLnZpZXcgPSBWaWV3O1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX1ZpZXcgPSBWaWV3O1xuICB9XG5cbiAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbn07XG5cblBsYWNlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKHZpc2libGUsIGRhdGEpIHtcbiAgdmFyIHBsYWNlaG9sZGVyID0gdGhpcy5fcGxhY2Vob2xkZXI7XG4gIHZhciBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gIGlmICh2aXNpYmxlKSB7XG4gICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICBtb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcblxuICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIFZpZXcgPSB0aGlzLl9WaWV3O1xuICAgICAgICB2YXIgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICB0aGlzLmVsID0gZ2V0RWwodmlldyk7XG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG5cbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aWV3ICYmIHRoaXMudmlldy51cGRhdGUgJiYgdGhpcy52aWV3LnVwZGF0ZShkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIsIHRoaXMuX2VsKTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLnZpZXcpO1xuICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIH1cbiAgfVxuICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xufTtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuZnVuY3Rpb24gcm91dGVyIChwYXJlbnQsIFZpZXdzLCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFJvdXRlcihwYXJlbnQsIFZpZXdzLCBpbml0RGF0YSk7XG59XG5cbnZhciBSb3V0ZXIgPSBmdW5jdGlvbiBSb3V0ZXIgKHBhcmVudCwgVmlld3MsIGluaXREYXRhKSB7XG4gIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICB0aGlzLlZpZXdzID0gVmlld3M7XG4gIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbn07XG5cblJvdXRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChyb3V0ZSwgZGF0YSkge1xuICBpZiAocm91dGUgIT09IHRoaXMucm91dGUpIHtcbiAgICB2YXIgVmlld3MgPSB0aGlzLlZpZXdzO1xuICAgIHZhciBWaWV3ID0gVmlld3Nbcm91dGVdO1xuXG4gICAgdGhpcy5yb3V0ZSA9IHJvdXRlO1xuXG4gICAgaWYgKFZpZXcgJiYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlIHx8IFZpZXcuZWwgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3ID0gVmlldyAmJiBuZXcgVmlldyh0aGlzLmluaXREYXRhLCBkYXRhKTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLmVsLCBbdGhpcy52aWV3XSk7XG4gIH1cbiAgdGhpcy52aWV3ICYmIHRoaXMudmlldy51cGRhdGUgJiYgdGhpcy52aWV3LnVwZGF0ZShkYXRhLCByb3V0ZSk7XG59O1xuXG52YXIgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG52YXIgc3ZnQ2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gc3ZnIChxdWVyeSkge1xuICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHZhciBlbGVtZW50O1xuXG4gIHZhciB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGVsZW1lbnQgPSBtZW1vaXplU1ZHKHF1ZXJ5KS5jbG9uZU5vZGUoZmFsc2UpO1xuICB9IGVsc2UgaWYgKGlzTm9kZShxdWVyeSkpIHtcbiAgICBlbGVtZW50ID0gcXVlcnkuY2xvbmVOb2RlKGZhbHNlKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIFF1ZXJ5ID0gcXVlcnk7XG4gICAgZWxlbWVudCA9IG5ldyAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoIFF1ZXJ5LCBbIG51bGwgXS5jb25jYXQoIGFyZ3MpICkpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkJyk7XG4gIH1cblxuICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGdldEVsKGVsZW1lbnQpLCBhcmdzLCB0cnVlKTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxudmFyIHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcgKHF1ZXJ5KSB7XG4gIHZhciBjbG9uZSA9IG1lbW9pemVTVkcocXVlcnkpO1xuXG4gIHJldHVybiBzdmcuYmluZCh0aGlzLCBjbG9uZSk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gbWVtb2l6ZVNWRyAocXVlcnkpIHtcbiAgcmV0dXJuIHN2Z0NhY2hlW3F1ZXJ5XSB8fCAoc3ZnQ2FjaGVbcXVlcnldID0gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpKTtcbn1cblxuZXhwb3J0IHsgTGlzdCwgTGlzdFBvb2wsIFBsYWNlLCBSb3V0ZXIsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByb3V0ZXIsIHMsIHNldEF0dHIsIHNldENoaWxkcmVuLCBzZXREYXRhLCBzZXRTdHlsZSwgc2V0WGxpbmssIHN2ZywgdGV4dCwgdW5tb3VudCB9O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZChvYmosIGZhY3Rvcmllcykge1xuICAgIGNvbnN0IHJlbW92ZXJzID0gT2JqZWN0LmtleXMoZmFjdG9yaWVzKS5tYXAoa2V5ID0+IGFyb3VuZDEob2JqLCBrZXksIGZhY3Rvcmllc1trZXldKSk7XG4gICAgcmV0dXJuIHJlbW92ZXJzLmxlbmd0aCA9PT0gMSA/IHJlbW92ZXJzWzBdIDogZnVuY3Rpb24gKCkgeyByZW1vdmVycy5mb3JFYWNoKHIgPT4gcigpKTsgfTtcbn1cbmZ1bmN0aW9uIGFyb3VuZDEob2JqLCBtZXRob2QsIGNyZWF0ZVdyYXBwZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IG9ialttZXRob2RdLCBoYWRPd24gPSBvYmouaGFzT3duUHJvcGVydHkobWV0aG9kKTtcbiAgICBsZXQgY3VycmVudCA9IGNyZWF0ZVdyYXBwZXIob3JpZ2luYWwpO1xuICAgIC8vIExldCBvdXIgd3JhcHBlciBpbmhlcml0IHN0YXRpYyBwcm9wcyBmcm9tIHRoZSB3cmFwcGluZyBtZXRob2QsXG4gICAgLy8gYW5kIHRoZSB3cmFwcGluZyBtZXRob2QsIHByb3BzIGZyb20gdGhlIG9yaWdpbmFsIG1ldGhvZFxuICAgIGlmIChvcmlnaW5hbClcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGN1cnJlbnQsIG9yaWdpbmFsKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yod3JhcHBlciwgY3VycmVudCk7XG4gICAgb2JqW21ldGhvZF0gPSB3cmFwcGVyO1xuICAgIC8vIFJldHVybiBhIGNhbGxiYWNrIHRvIGFsbG93IHNhZmUgcmVtb3ZhbFxuICAgIHJldHVybiByZW1vdmU7XG4gICAgZnVuY3Rpb24gd3JhcHBlciguLi5hcmdzKSB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYmVlbiBkZWFjdGl2YXRlZCBhbmQgYXJlIG5vIGxvbmdlciB3cmFwcGVkLCByZW1vdmUgb3Vyc2VsdmVzXG4gICAgICAgIGlmIChjdXJyZW50ID09PSBvcmlnaW5hbCAmJiBvYmpbbWV0aG9kXSA9PT0gd3JhcHBlcilcbiAgICAgICAgICAgIHJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gY3VycmVudC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICAvLyBJZiBubyBvdGhlciBwYXRjaGVzLCBqdXN0IGRvIGEgZGlyZWN0IHJlbW92YWxcbiAgICAgICAgaWYgKG9ialttZXRob2RdID09PSB3cmFwcGVyKSB7XG4gICAgICAgICAgICBpZiAoaGFkT3duKVxuICAgICAgICAgICAgICAgIG9ialttZXRob2RdID0gb3JpZ2luYWw7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ialttZXRob2RdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50ID09PSBvcmlnaW5hbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gRWxzZSBwYXNzIGZ1dHVyZSBjYWxscyB0aHJvdWdoLCBhbmQgcmVtb3ZlIHdyYXBwZXIgZnJvbSB0aGUgcHJvdG90eXBlIGNoYWluXG4gICAgICAgIGN1cnJlbnQgPSBvcmlnaW5hbDtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHdyYXBwZXIsIG9yaWdpbmFsIHx8IEZ1bmN0aW9uKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZGVkdXBlKGtleSwgb2xkRm4sIG5ld0ZuKSB7XG4gICAgY2hlY2tba2V5XSA9IGtleTtcbiAgICByZXR1cm4gY2hlY2s7XG4gICAgZnVuY3Rpb24gY2hlY2soLi4uYXJncykge1xuICAgICAgICByZXR1cm4gKG9sZEZuW2tleV0gPT09IGtleSA/IG9sZEZuIDogbmV3Rm4pLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBhZnRlcihwcm9taXNlLCBjYikge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW4oY2IsIGNiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemUoYXN5bmNGdW5jdGlvbikge1xuICAgIGxldCBsYXN0UnVuID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgZnVuY3Rpb24gd3JhcHBlciguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBsYXN0UnVuID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICBhZnRlcihsYXN0UnVuLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXN5bmNGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmdzKS50aGVuKHJlcywgcmVqKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgd3JhcHBlci5hZnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGxhc3RSdW4gPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHsgYWZ0ZXIobGFzdFJ1biwgcmVzKTsgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gd3JhcHBlcjtcbn1cbiIsImltcG9ydCB7TWVudSwgQXBwLCBNZW51SXRlbSwgZGVib3VuY2UsIEtleW1hcCwgU2NvcGV9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHthcm91bmR9IGZyb20gXCJtb25rZXktYXJvdW5kXCI7XG5cbmRlY2xhcmUgbW9kdWxlIFwib2JzaWRpYW5cIiB7XG4gICAgaW50ZXJmYWNlIE1lbnUge1xuICAgICAgICBhcHA6IEFwcFxuICAgICAgICBkb206IEhUTUxEaXZFbGVtZW50XG4gICAgICAgIHNjb3BlOiBTY29wZVxuICAgICAgICBpdGVtczogTWVudUl0ZW1bXVxuXG4gICAgICAgIHNlbGVjdChuOiBudW1iZXIpOiB2b2lkXG4gICAgICAgIHNlbGVjdGVkOiBudW1iZXJcbiAgICAgICAgb25BcnJvd0Rvd24oZTogS2V5Ym9hcmRFdmVudCk6IGZhbHNlXG4gICAgICAgIG9uQXJyb3dVcChlOiBLZXlib2FyZEV2ZW50KTogZmFsc2VcbiAgICB9XG5cbiAgICBleHBvcnQgbmFtZXNwYWNlIEtleW1hcCB7XG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRNb2RpZmllcnMoZXZlbnQ6IEV2ZW50KTogc3RyaW5nXG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIE1lbnVJdGVtIHtcbiAgICAgICAgZG9tOiBIVE1MRGl2RWxlbWVudFxuICAgICAgICB0aXRsZUVsOiBIVE1MRGl2RWxlbWVudFxuICAgICAgICBoYW5kbGVFdmVudChldmVudDogRXZlbnQpOiB2b2lkXG4gICAgICAgIGRpc2FibGVkOiBib29sZWFuXG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBNZW51UGFyZW50ID0gQXBwIHwgUG9wdXBNZW51O1xuXG5leHBvcnQgY2xhc3MgUG9wdXBNZW51IGV4dGVuZHMgTWVudSB7XG4gICAgLyoqIFRoZSBjaGlsZCBtZW51IHBvcHBlZCB1cCBvdmVyIHRoaXMgb25lICovXG4gICAgY2hpbGQ6IE1lbnVcblxuICAgIG1hdGNoOiBzdHJpbmcgPSBcIlwiXG4gICAgcmVzZXRTZWFyY2hPblRpbWVvdXQgPSBkZWJvdW5jZSgoKSA9PiB7dGhpcy5tYXRjaCA9IFwiXCI7fSwgMTUwMCwgdHJ1ZSlcbiAgICB2aXNpYmxlOiBib29sZWFuID0gZmFsc2VcbiAgICBmaXJzdE1vdmU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIHBhcmVudDogTWVudVBhcmVudCkge1xuICAgICAgICBzdXBlcihwYXJlbnQgaW5zdGFuY2VvZiBBcHAgPyBwYXJlbnQgOiBwYXJlbnQuYXBwKTtcbiAgICAgICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIFBvcHVwTWVudSkgcGFyZW50LnNldENoaWxkTWVudSh0aGlzKTtcblxuICAgICAgICB0aGlzLnNjb3BlID0gbmV3IFNjb3BlO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93VXBcIiwgICB0aGlzLm9uQXJyb3dVcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJBcnJvd0Rvd25cIiwgdGhpcy5vbkFycm93RG93bi5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJFbnRlclwiLCAgICAgdGhpcy5vbkVudGVyLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkVzY2FwZVwiLCAgICB0aGlzLm9uRXNjYXBlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93TGVmdFwiLCB0aGlzLm9uQXJyb3dMZWZ0LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiSG9tZVwiLCB0aGlzLm9uSG9tZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJFbmRcIiwgIHRoaXMub25FbmQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiQXJyb3dSaWdodFwiLCB0aGlzLm9uQXJyb3dSaWdodC5iaW5kKHRoaXMpKTtcblxuICAgICAgICAvLyBNYWtlIG9ic2lkaWFuLk1lbnUgdGhpbmsgbW91c2Vkb3ducyBvbiBvdXIgY2hpbGQgbWVudShzKSBhcmUgaGFwcGVuaW5nXG4gICAgICAgIC8vIG9uIHVzLCBzbyB3ZSB3b24ndCBjbG9zZSBiZWZvcmUgYW4gYWN0dWFsIGNsaWNrIG9jY3Vyc1xuICAgICAgICBjb25zdCBtZW51ID0gdGhpcztcbiAgICAgICAgYXJvdW5kKHRoaXMuZG9tLCB7Y29udGFpbnMocHJldil7IHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IHByZXYuY2FsbCh0aGlzLCB0YXJnZXQpIHx8IG1lbnUuY2hpbGQ/LmRvbS5jb250YWlucyh0YXJnZXQpO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfX19KTtcbiAgICAgICAgdGhpcy5kb20uYWRkQ2xhc3MoXCJxZS1wb3B1cC1tZW51XCIpO1xuICAgIH1cblxuICAgIG9uRXNjYXBlKCkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9ubG9hZCgpIHtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihudWxsLCBudWxsLCB0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpKTtcbiAgICAgICAgc3VwZXIub25sb2FkKCk7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2hvd1NlbGVjdGVkKCk7XG4gICAgICAgIHRoaXMuZmlyc3RNb3ZlID0gdHJ1ZTtcbiAgICAgICAgLy8gV2Ugd2FpdCB1bnRpbCBub3cgdG8gcmVnaXN0ZXIgc28gdGhhdCBhbnkgaW5pdGlhbCBtb3VzZW92ZXIgb2YgdGhlIG9sZCBtb3VzZSBwb3NpdGlvbiB3aWxsIGJlIHNraXBwZWRcbiAgICAgICAgdGhpcy5yZWdpc3RlcihvbkVsZW1lbnQodGhpcy5kb20sIFwibW91c2VvdmVyXCIsIFwiLm1lbnUtaXRlbVwiLCAoZXZlbnQ6IE1vdXNlRXZlbnQsIHRhcmdldDogSFRNTERpdkVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5maXJzdE1vdmUgJiYgIXRhcmdldC5oYXNDbGFzcyhcImlzLWRpc2FibGVkXCIpICYmICF0aGlzLmNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5pdGVtcy5maW5kSW5kZXgoaSA9PiBpLmRvbSA9PT0gdGFyZ2V0KSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5maXJzdE1vdmUgPSBmYWxzZTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG9udW5sb2FkKCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgc3VwZXIub251bmxvYWQoKTtcbiAgICB9XG5cbiAgICAvLyBPdmVycmlkZSB0byBhdm9pZCBoYXZpbmcgYSBtb3VzZW92ZXIgZXZlbnQgaGFuZGxlclxuICAgIGFkZEl0ZW0oY2I6IChpOiBNZW51SXRlbSkgPT4gYW55KSB7XG4gICAgICAgIGNvbnN0IGkgPSBuZXcgTWVudUl0ZW0odGhpcyk7XG4gICAgICAgIHRoaXMuaXRlbXMucHVzaChpKTtcbiAgICAgICAgY2IoaSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBjb25zdCBtb2QgPSBLZXltYXAuZ2V0TW9kaWZpZXJzKGV2ZW50KTtcbiAgICAgICAgaWYgKGV2ZW50LmtleS5sZW5ndGggPT09IDEgJiYgIWV2ZW50LmlzQ29tcG9zaW5nICYmICghbW9kIHx8IG1vZCA9PT0gXCJTaGlmdFwiKSApIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHRoaXMubWF0Y2ggKyBldmVudC5rZXk7XG4gICAgICAgICAgICAvLyBUaHJvdyBhd2F5IHBpZWNlcyBvZiB0aGUgbWF0Y2ggdW50aWwgc29tZXRoaW5nIG1hdGNoZXMgb3Igbm90aGluZydzIGxlZnRcbiAgICAgICAgICAgIHdoaWxlIChtYXRjaCAmJiAhdGhpcy5zZWFyY2hGb3IobWF0Y2gpKSBtYXRjaCA9IG1hdGNoLnN1YnN0cigxKTtcbiAgICAgICAgICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTZWFyY2hPblRpbWVvdXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7ICAgLy8gYmxvY2sgYWxsIGtleXMgb3RoZXIgdGhhbiBvdXJzXG4gICAgfVxuXG4gICAgc2VhcmNoRm9yKG1hdGNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBtYXRjaC5zcGxpdChcIlwiKS5tYXAoZXNjYXBlUmVnZXgpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5maW5kKG5ldyBSZWdFeHAoXCJeXCIrIHBhcnRzLmpvaW4oXCJcIiksIFwidWlcIikpIHx8XG4gICAgICAgICAgICB0aGlzLmZpbmQobmV3IFJlZ0V4cChcIl5cIisgcGFydHMuam9pbihcIi4qXCIpLCBcInVpXCIpKSB8fFxuICAgICAgICAgICAgdGhpcy5maW5kKG5ldyBSZWdFeHAocGFydHMuam9pbihcIi4qXCIpLCBcInVpXCIpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZpbmQocGF0dGVybjogUmVnRXhwKSB7XG4gICAgICAgIGxldCBwb3MgPSBNYXRoLm1pbigwLCB0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgZm9yIChsZXQgaT10aGlzLml0ZW1zLmxlbmd0aDsgaTsgKytwb3MsIGktLSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbXNbcG9zXT8uZGlzYWJsZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbXNbcG9zXT8uZG9tLnRleHRDb250ZW50Lm1hdGNoKHBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QocG9zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBvbkVudGVyKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW3RoaXMuc2VsZWN0ZWRdO1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgaXRlbS5oYW5kbGVFdmVudChldmVudCk7XG4gICAgICAgICAgICAvLyBPbmx5IGhpZGUgaWYgd2UgZG9uJ3QgaGF2ZSBhIHN1Ym1lbnVcbiAgICAgICAgICAgIGlmICghdGhpcy5jaGlsZCkgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHNlbGVjdChuOiBudW1iZXIsIHNjcm9sbCA9IHRydWUpIHtcbiAgICAgICAgdGhpcy5tYXRjaCA9IFwiXCIgLy8gcmVzZXQgc2VhcmNoIG9uIG1vdmVcbiAgICAgICAgc3VwZXIuc2VsZWN0KG4pO1xuICAgICAgICBpZiAoc2Nyb2xsKSB0aGlzLnNob3dTZWxlY3RlZCgpO1xuICAgIH1cblxuICAgIHNob3dTZWxlY3RlZCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzLml0ZW1zW3RoaXMuc2VsZWN0ZWRdPy5kb207XG4gICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgY29uc3QgbWUgPSB0aGlzLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbXkgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmIChteS50b3AgPCBtZS50b3AgfHwgbXkuYm90dG9tID4gbWUuYm90dG9tKSBlbC5zY3JvbGxJbnRvVmlldygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5zZWxlY3QoKSB7XG4gICAgICAgIHRoaXMuaXRlbXNbdGhpcy5zZWxlY3RlZF0/LmRvbS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgIH1cblxuICAgIG9uRW5kKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgdGhpcy51bnNlbGVjdCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgICAgIHRoaXMub25BcnJvd1VwKGUpO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCA9PT0gdGhpcy5pdGVtcy5sZW5ndGgpIHRoaXMuc2VsZWN0ZWQgPSAtMTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uSG9tZShlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMudW5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IC0xO1xuICAgICAgICB0aGlzLm9uQXJyb3dEb3duKGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25BcnJvd0xlZnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnJvb3RNZW51KCkgIT09IHRoaXMpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkFycm93UmlnaHQoKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIG5vLW9wIGluIGJhc2UgY2xhc3NcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuc2V0Q2hpbGRNZW51KCk7ICAvLyBoaWRlIGNoaWxkIG1lbnUocykgZmlyc3RcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZE1lbnUobWVudT86IE1lbnUpIHtcbiAgICAgICAgdGhpcy5jaGlsZD8uaGlkZSgpO1xuICAgICAgICB0aGlzLmNoaWxkID0gbWVudTtcbiAgICB9XG5cbiAgICByb290TWVudSgpOiBQb3B1cE1lbnUge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBBcHAgPyB0aGlzIDogdGhpcy5wYXJlbnQucm9vdE1lbnUoKTtcbiAgICB9XG5cbiAgICBjYXNjYWRlKHRhcmdldDogSFRNTEVsZW1lbnQsIGV2ZW50PzogTW91c2VFdmVudCwgb25DbG9zZT86ICgpID0+IGFueSwgaE92ZXJsYXAgPSAxNSwgdk92ZXJsYXAgPSA1KSB7XG4gICAgICAgIGNvbnN0IHtsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIHdpZHRofSA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IGxlZnQrTWF0aC5taW4oMTUwLCB3aWR0aC8zKSwgY2VudGVyWSA9ICh0b3ArYm90dG9tKS8yO1xuICAgICAgICBjb25zdCB7aW5uZXJIZWlnaHQsIGlubmVyV2lkdGh9ID0gd2luZG93O1xuXG4gICAgICAgIC8vIFRyeSB0byBjYXNjYWRlIGRvd24gYW5kIHRvIHRoZSByaWdodCBmcm9tIHRoZSBtb3VzZSBvciBob3Jpem9udGFsIGNlbnRlclxuICAgICAgICAvLyBvZiB0aGUgY2xpY2tlZCBpdGVtXG4gICAgICAgIGNvbnN0IHBvaW50ID0ge3g6IGV2ZW50ID8gZXZlbnQuY2xpZW50WCAgLSBoT3ZlcmxhcCA6IGNlbnRlclggLCB5OiBib3R0b20gLSB2T3ZlcmxhcH07XG5cbiAgICAgICAgLy8gTWVhc3VyZSB0aGUgbWVudSBhbmQgc2VlIGlmIGl0IGZpdHNcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XG4gICAgICAgIGNvbnN0IHtvZmZzZXRXaWR0aCwgb2Zmc2V0SGVpZ2h0fSA9IHRoaXMuZG9tO1xuICAgICAgICBjb25zdCBmaXRzQmVsb3cgPSBwb2ludC55ICsgb2Zmc2V0SGVpZ2h0IDwgaW5uZXJIZWlnaHQ7XG4gICAgICAgIGNvbnN0IGZpdHNSaWdodCA9IHBvaW50LnggKyBvZmZzZXRXaWR0aCA8PSBpbm5lcldpZHRoO1xuXG4gICAgICAgIC8vIElmIGl0IGRvZXNuJ3QgZml0IHVuZGVybmVhdGggdXMsIHBvc2l0aW9uIGl0IGF0IHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbiwgdW5sZXNzXG4gICAgICAgIC8vIHRoZSBjbGlja2VkIGl0ZW0gaXMgY2xvc2UgdG8gdGhlIGJvdHRvbSAoaW4gd2hpY2ggY2FzZSwgcG9zaXRpb24gaXQgYWJvdmUgc29cbiAgICAgICAgLy8gdGhlIGl0ZW0gd2lsbCBzdGlsbCBiZSB2aXNpYmxlLilcbiAgICAgICAgaWYgKCFmaXRzQmVsb3cpIHtcbiAgICAgICAgICAgIHBvaW50LnkgPSAoYm90dG9tID4gaW5uZXJIZWlnaHQgLSAoYm90dG9tLXRvcCkpID8gdG9wICsgdk92ZXJsYXA6IGlubmVySGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgaXQgZG9lc24ndCBmaXQgdG8gdGhlIHJpZ2h0LCB0aGVuIHBvc2l0aW9uIGl0IGF0IHRoZSByaWdodCBlZGdlIG9mIHRoZSBzY3JlZW4sXG4gICAgICAgIC8vIHNvIGxvbmcgYXMgaXQgZml0cyBlbnRpcmVseSBhYm92ZSBvciBiZWxvdyB1cy4gIE90aGVyd2lzZSwgcG9zaXRpb24gaXQgdXNpbmcgdGhlXG4gICAgICAgIC8vIGl0ZW0gY2VudGVyLCBzbyBhdCBsZWFzdCBvbmUgc2lkZSBvZiB0aGUgcHJldmlvdXMgbWVudS9pdGVtIHdpbGwgc3RpbGwgYmUgc2Vlbi5cbiAgICAgICAgaWYgKCFmaXRzUmlnaHQpIHtcbiAgICAgICAgICAgIHBvaW50LnggPSAob2Zmc2V0SGVpZ2h0IDwgKGJvdHRvbSAtIHZPdmVybGFwKSB8fCBmaXRzQmVsb3cpID8gaW5uZXJXaWR0aCA6IGNlbnRlclg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEb25lISAgU2hvdyBvdXIgd29yay5cbiAgICAgICAgdGhpcy5zaG93QXRQb3NpdGlvbihwb2ludCk7XG5cbiAgICAgICAgLy8gRmxhZyB0aGUgY2xpY2tlZCBpdGVtIGFzIGFjdGl2ZSwgdW50aWwgd2UgY2xvc2VcbiAgICAgICAgdGFyZ2V0LnRvZ2dsZUNsYXNzKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMub25IaWRlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIEFwcCkgdGFyZ2V0LnRvZ2dsZUNsYXNzKFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBQb3B1cE1lbnUpIHRoaXMucGFyZW50LnNldENoaWxkTWVudSgpO1xuICAgICAgICAgICAgaWYgKG9uQ2xvc2UpIG9uQ2xvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXgoczogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHMucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKTtcbn1cblxuZnVuY3Rpb24gb25FbGVtZW50PEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudEV2ZW50TWFwPihcbiAgICBlbDogSFRNTEVsZW1lbnQsIHR5cGU6IEssIHNlbGVjdG9yOnN0cmluZyxcbiAgICBsaXN0ZW5lcjogKHRoaXM6IEhUTUxFbGVtZW50LCBldjogSFRNTEVsZW1lbnRFdmVudE1hcFtLXSwgZGVsZWdhdGVUYXJnZXQ6IEhUTUxFbGVtZW50KSA9PiBhbnksXG4gICAgb3B0aW9uczogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zID0gZmFsc2Vcbikge1xuICAgIGVsLm9uKHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgb3B0aW9ucylcbiAgICByZXR1cm4gKCkgPT4gZWwub2ZmKHR5cGUsIHNlbGVjdG9yLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG59IiwiaW1wb3J0IHsgS2V5bWFwLCBNb2RhbCwgTm90aWNlLCBUQWJzdHJhY3RGaWxlLCBURmlsZSwgVEZvbGRlciwgVmlldyB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgUG9wdXBNZW51LCBNZW51UGFyZW50IH0gZnJvbSBcIi4vbWVudXNcIjtcbmltcG9ydCB7aTE4bn0gZnJvbSBcImkxOG5leHRcIjtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGNvbnN0IGkxOG5leHQ6IGkxOG5cbn1cblxuZGVjbGFyZSBtb2R1bGUgXCJvYnNpZGlhblwiIHtcbiAgICBpbnRlcmZhY2UgQXBwIHtcbiAgICAgICAgc2V0QXR0YWNobWVudEZvbGRlcihmb2xkZXI6IFRGb2xkZXIpOiB2b2lkXG4gICAgICAgIGludGVybmFsUGx1Z2luczoge1xuICAgICAgICAgICAgcGx1Z2luczoge1xuICAgICAgICAgICAgICAgIFwiZmlsZS1leHBsb3JlclwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGJvb2xlYW5cbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldmVhbEluRm9sZGVyKGZpbGU6IFRBYnN0cmFjdEZpbGUpOiB2b2lkXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlRmlsZU1vZGFsOiBNb2RhbCAmIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50RmlsZShmaWxlOiBUQWJzdHJhY3RGaWxlKTogdm9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGludGVyZmFjZSBGaWxlTWFuYWdlciB7XG4gICAgICAgIHByb21wdEZvckZvbGRlckRlbGV0aW9uKGZvbGRlcjogVEZvbGRlcik6IHZvaWRcbiAgICAgICAgcHJvbXB0Rm9yRmlsZURlbGV0aW9uKGZpbGU6IFRGaWxlKTogdm9pZFxuICAgICAgICBwcm9tcHRGb3JGaWxlUmVuYW1lKGZpbGU6IFRBYnN0cmFjdEZpbGUpOiB2b2lkXG4gICAgICAgIGNyZWF0ZU5ld01hcmtkb3duRmlsZShwYXJlbnRGb2xkZXI/OiBURm9sZGVyLCBwYXR0ZXJuPzogc3RyaW5nKTogUHJvbWlzZTxURmlsZT5cbiAgICB9XG59XG5cbmludGVyZmFjZSBGaWxlRXhwbG9yZXJWaWV3IGV4dGVuZHMgVmlldyB7XG4gICAgY3JlYXRlQWJzdHJhY3RGaWxlKGtpbmQ6IFwiZmlsZVwiIHwgXCJmb2xkZXJcIiwgcGFyZW50OiBURm9sZGVyLCBuZXdMZWFmPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD5cbiAgICBzdGFydFJlbmFtZUZpbGUoZmlsZTogVEFic3RyYWN0RmlsZSk6IFByb21pc2U8dm9pZD5cbn1cblxuZnVuY3Rpb24gb3B0TmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gaTE4bmV4dC50KGBwbHVnaW5zLmZpbGUtZXhwbG9yZXIubWVudS1vcHQtJHtuYW1lfWApO1xufVxuXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnUgZXh0ZW5kcyBQb3B1cE1lbnUge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogTWVudVBhcmVudCwgZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBzdXBlcihwYXJlbnQpO1xuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZSB9ID0gdGhpcy5hcHA7XG4gICAgICAgIGNvbnN0IGhhdmVGaWxlRXhwbG9yZXIgPSB0aGlzLmFwcC5pbnRlcm5hbFBsdWdpbnMucGx1Z2luc1tcImZpbGUtZXhwbG9yZXJcIl0uZW5hYmxlZDtcblxuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpID0+IGkuc2V0VGl0bGUob3B0TmFtZShcIm5ldy1ub3RlXCIpKS5zZXRJY29uKFwiY3JlYXRlLW5ld1wiKS5vbkNsaWNrKGFzeW5jIGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0ZpbGUgPSBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5jcmVhdGVOZXdNYXJrZG93bkZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0ZpbGUpIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKEtleW1hcC5pc01vZGlmaWVyKGUsIFwiTW9kXCIpKS5vcGVuRmlsZShuZXdGaWxlLCB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogITAsIHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSwgZVN0YXRlOiB7IHJlbmFtZTogXCJhbGxcIiB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpID0+IGkuc2V0VGl0bGUob3B0TmFtZShcIm5ldy1mb2xkZXJcIikpLnNldEljb24oXCJmb2xkZXJcIikuc2V0RGlzYWJsZWQoIWhhdmVGaWxlRXhwbG9yZXIpLm9uQ2xpY2soZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChoYXZlRmlsZUV4cGxvcmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2l0aEV4cGxvcmVyKGZpbGUpPy5jcmVhdGVBYnN0cmFjdEZpbGUoXCJmb2xkZXJcIiwgZmlsZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlRoZSBGaWxlIEV4cGxvcmVyIGNvcmUgcGx1Z2luIG11c3QgYmUgZW5hYmxlZCB0byBjcmVhdGUgbmV3IGZvbGRlcnNcIilcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRUaXRsZShvcHROYW1lKFwic2V0LWF0dGFjaG1lbnQtZm9sZGVyXCIpKS5zZXRJY29uKFwiaW1hZ2UtZmlsZVwiKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5zZXRBdHRhY2htZW50Rm9sZGVyKGZpbGUpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5hZGRTZXBhcmF0b3IoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZEl0ZW0oaSA9PiB7XG4gICAgICAgICAgICBpLnNldFRpdGxlKG9wdE5hbWUoXCJyZW5hbWVcIikpLnNldEljb24oXCJwZW5jaWxcIikub25DbGljayhldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvbXB0Rm9yRmlsZVJlbmFtZShmaWxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRUaXRsZShvcHROYW1lKFwiZGVsZXRlXCIpKS5zZXRJY29uKFwidHJhc2hcIikub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9tcHRGb3JGb2xkZXJEZWxldGlvbihmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb21wdEZvckZpbGVEZWxldGlvbihmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIgJiYgaGF2ZUZpbGVFeHBsb3Jlcikge1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRJY29uKFwiZm9sZGVyXCIpLnNldFRpdGxlKGkxOG5leHQudCgncGx1Z2lucy5maWxlLWV4cGxvcmVyLmFjdGlvbi1yZXZlYWwtZmlsZScpKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndpdGhFeHBsb3JlcihmaWxlKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsZSA9PT0gd29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkge1xuICAgICAgICAgICAgd29ya3NwYWNlLnRyaWdnZXIoXCJmaWxlLW1lbnVcIiwgdGhpcywgZmlsZSwgXCJxdWljay1leHBsb3JlclwiLCB3b3Jrc3BhY2UuYWN0aXZlTGVhZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3b3Jrc3BhY2UudHJpZ2dlcihcImZpbGUtbWVudVwiLCB0aGlzLCBmaWxlLCBcInF1aWNrLWV4cGxvcmVyXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2l0aEV4cGxvcmVyKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgY29uc3QgZXhwbG9yZXIgPSB0aGlzLmFwcC5pbnRlcm5hbFBsdWdpbnMucGx1Z2luc1tcImZpbGUtZXhwbG9yZXJcIl07XG4gICAgICAgIGlmIChleHBsb3Jlci5lbmFibGVkKSB7XG4gICAgICAgICAgICBleHBsb3Jlci5pbnN0YW5jZS5yZXZlYWxJbkZvbGRlcihmaWxlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFwiZmlsZS1leHBsb3JlclwiKVswXS52aWV3IGFzIEZpbGVFeHBsb3JlclZpZXdcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFRBYnN0cmFjdEZpbGUsIFRGaWxlLCBURm9sZGVyLCBLZXltYXAsIE5vdGljZSwgSG92ZXJQYXJlbnQsIGRlYm91bmNlLCBXb3Jrc3BhY2VTcGxpdCwgSG92ZXJQb3BvdmVyLCBGaWxlVmlldywgTWFya2Rvd25WaWV3IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBob3ZlclNvdXJjZSwgc3RhcnREcmFnIH0gZnJvbSBcIi4vRXhwbG9yZXJcIjtcbmltcG9ydCB7IFBvcHVwTWVudSwgTWVudVBhcmVudCB9IGZyb20gXCIuL21lbnVzXCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gXCIuL0NvbnRleHRNZW51XCI7XG5pbXBvcnQgeyBhcm91bmQgfSBmcm9tIFwibW9ua2V5LWFyb3VuZFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xuICAgIGludGVyZmFjZSBIb3ZlclBvcG92ZXIge1xuICAgICAgICBoaWRlKCk6IHZvaWRcbiAgICAgICAgaG92ZXJFbDogSFRNTERpdkVsZW1lbnRcbiAgICAgICAgb25Ib3ZlcjogYm9vbGVhblxuICAgIH1cbiAgICBpbnRlcmZhY2UgQXBwIHtcbiAgICAgICAgdmlld1JlZ2lzdHJ5OiB7XG4gICAgICAgICAgICBpc0V4dGVuc2lvblJlZ2lzdGVyZWQoZXh0OiBzdHJpbmcpOiBib29sZWFuXG4gICAgICAgICAgICBnZXRUeXBlQnlFeHRlbnNpb24oZXh0OiBzdHJpbmcpOiBzdHJpbmdcbiAgICAgICAgfVxuICAgIH1cbiAgICBpbnRlcmZhY2UgVmF1bHQge1xuICAgICAgICBnZXRDb25maWcob3B0aW9uOiBzdHJpbmcpOiBhbnlcbiAgICAgICAgZ2V0Q29uZmlnKG9wdGlvbjpcInNob3dVbnN1cHBvcnRlZEZpbGVzXCIpOiBib29sZWFuXG4gICAgfVxuICAgIGludGVyZmFjZSBXb3Jrc3BhY2Uge1xuICAgICAgICBpdGVyYXRlTGVhdmVzKGNhbGxiYWNrOiAoaXRlbTogV29ya3NwYWNlTGVhZikgPT4gYW55LCBpdGVtOiBXb3Jrc3BhY2VQYXJlbnQpOiBib29sZWFuO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIEhvdmVyRWRpdG9yIGV4dGVuZHMgSG92ZXJQb3BvdmVyIHtcbiAgICByb290U3BsaXQ6IFdvcmtzcGFjZVNwbGl0O1xuICAgIHRvZ2dsZVBpbihwaW5uZWQ/OiBib29sZWFuKTogdm9pZDtcbn1cblxuY29uc3QgYWxwaGFTb3J0ID0gbmV3IEludGwuQ29sbGF0b3IodW5kZWZpbmVkLCB7dXNhZ2U6IFwic29ydFwiLCBzZW5zaXRpdml0eTogXCJiYXNlXCIsIG51bWVyaWM6IHRydWV9KS5jb21wYXJlO1xuXG5jb25zdCBwcmV2aWV3SWNvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgbWFya2Rvd246IFwiZG9jdW1lbnRcIixcbiAgICBpbWFnZTogXCJpbWFnZS1maWxlXCIsXG4gICAgYXVkaW86IFwiYXVkaW8tZmlsZVwiLFxuICAgIHBkZjogXCJwZGYtZmlsZVwiLFxufVxuXG5jb25zdCB2aWV3dHlwZUljb25zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIC4uLnByZXZpZXdJY29ucyxcbiAgICAvLyBhZGQgdGhpcmQtcGFydHkgcGx1Z2luc1xuICAgIGV4Y2FsaWRyYXc6IFwiZXhjYWxpZHJhdy1pY29uXCIsXG59O1xuXG5cbi8vIEdsb2JhbCBhdXRvIHByZXZpZXcgbW9kZVxubGV0IGF1dG9QcmV2aWV3ID0gdHJ1ZVxuXG5leHBvcnQgY2xhc3MgRm9sZGVyTWVudSBleHRlbmRzIFBvcHVwTWVudSBpbXBsZW1lbnRzIEhvdmVyUGFyZW50IHtcblxuICAgIHBhcmVudEZvbGRlcjogVEZvbGRlciA9IHRoaXMucGFyZW50IGluc3RhbmNlb2YgRm9sZGVyTWVudSA/IHRoaXMucGFyZW50LmZvbGRlciA6IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFyZW50OiBNZW51UGFyZW50LCBwdWJsaWMgZm9sZGVyOiBURm9sZGVyLCBwdWJsaWMgc2VsZWN0ZWRGaWxlPzogVEFic3RyYWN0RmlsZSwgcHVibGljIG9wZW5lcj86IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHN1cGVyKHBhcmVudCk7XG4gICAgICAgIHRoaXMubG9hZEZpbGVzKGZvbGRlciwgc2VsZWN0ZWRGaWxlKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgICAgICAgIFwiVGFiXCIsICAgdGhpcy50b2dnbGVQcmV2aWV3TW9kZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXCJNb2RcIl0sICAgXCJFbnRlclwiLCB0aGlzLm9uRW50ZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW1wiQWx0XCJdLCAgIFwiRW50ZXJcIiwgdGhpcy5vbktleWJvYXJkQ29udGV4dE1lbnUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sICAgICAgICBcIlxcXFxcIiwgICAgdGhpcy5vbktleWJvYXJkQ29udGV4dE1lbnUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sICAgICAgICBcIkYyXCIsICAgIHRoaXMuZG9SZW5hbWUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW1wiU2hpZnRcIl0sIFwiRjJcIiwgICAgdGhpcy5kb01vdmUuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgLy8gU2Nyb2xsIHByZXZpZXcgd2luZG93IHVwIGFuZCBkb3duXG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sICAgICAgIFwiUGFnZVVwXCIsIHRoaXMuZG9TY3JvbGwuYmluZCh0aGlzLCAtMSwgZmFsc2UpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgICAgIFwiUGFnZURvd25cIiwgdGhpcy5kb1Njcm9sbC5iaW5kKHRoaXMsICAxLCBmYWxzZSkpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtcIk1vZFwiXSwgICAgXCJIb21lXCIsIHRoaXMuZG9TY3JvbGwuYmluZCh0aGlzLCAgMCwgdHJ1ZSkpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtcIk1vZFwiXSwgICAgIFwiRW5kXCIsIHRoaXMuZG9TY3JvbGwuYmluZCh0aGlzLCAgMSwgdHJ1ZSkpO1xuXG4gICAgICAgIGNvbnN0IHsgZG9tIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBtZW51SXRlbSA9IFwiLm1lbnUtaXRlbVtkYXRhLWZpbGUtcGF0aF1cIjtcbiAgICAgICAgZG9tLm9uKFwiY2xpY2tcIiwgICAgICAgbWVudUl0ZW0sIHRoaXMub25JdGVtQ2xpY2ssIHRydWUpO1xuICAgICAgICBkb20ub24oXCJjb250ZXh0bWVudVwiLCBtZW51SXRlbSwgdGhpcy5vbkl0ZW1NZW51ICk7XG4gICAgICAgIGRvbS5vbignbW91c2VvdmVyJyAgLCBtZW51SXRlbSwgdGhpcy5vbkl0ZW1Ib3Zlcik7XG4gICAgICAgIGRvbS5vbihcIm1vdXNlZG93blwiLCAgIG1lbnVJdGVtLCBlID0+IHtlLnN0b3BQcm9wYWdhdGlvbigpfSwgdHJ1ZSk7ICAvLyBGaXggZHJhZyBjYW5jZWxsaW5nXG4gICAgICAgIGRvbS5vbignZHJhZ3N0YXJ0JywgICBtZW51SXRlbSwgKGV2ZW50LCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIHN0YXJ0RHJhZyh0aGlzLmFwcCwgdGFyZ2V0LmRhdGFzZXQuZmlsZVBhdGgsIGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2hlbiB3ZSB1bmxvYWQsIHJlYWN0aXZhdGUgcGFyZW50IG1lbnUncyBob3ZlciwgaWYgbmVlZGVkXG4gICAgICAgIHRoaXMucmVnaXN0ZXIoKCkgPT4geyBhdXRvUHJldmlldyAmJiB0aGlzLnBhcmVudCBpbnN0YW5jZW9mIEZvbGRlck1lbnUgJiYgdGhpcy5wYXJlbnQuc2hvd1BvcG92ZXIoKTsgfSlcblxuICAgICAgICAvLyBNYWtlIG9ic2lkaWFuLk1lbnUgdGhpbmsgbW91c2Vkb3ducyBvbiBvdXIgcG9wdXBzIGFyZSBoYXBwZW5pbmdcbiAgICAgICAgLy8gb24gdXMsIHNvIHdlIHdvbid0IGNsb3NlIGJlZm9yZSBhbiBhY3R1YWwgY2xpY2sgb2NjdXJzXG4gICAgICAgIGNvbnN0IG1lbnUgPSB0aGlzO1xuICAgICAgICBhcm91bmQodGhpcy5kb20sIHtjb250YWlucyhwcmV2KXsgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogTm9kZSkge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gcHJldi5jYWxsKHRoaXMsIHRhcmdldCkgfHwgbWVudS5fcG9wb3Zlcj8uaG92ZXJFbC5jb250YWlucyh0YXJnZXQpO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfX19KTtcbiAgICB9XG5cbiAgICBvbkFycm93TGVmdCgpIHtcbiAgICAgICAgc3VwZXIub25BcnJvd0xlZnQoKTtcbiAgICAgICAgaWYgKHRoaXMucm9vdE1lbnUoKSA9PT0gdGhpcykgdGhpcy5vcGVuQnJlYWRjcnVtYih0aGlzLm9wZW5lcj8ucHJldmlvdXNFbGVtZW50U2libGluZyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbktleWJvYXJkQ29udGV4dE1lbnUoKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuaXRlbXNbdGhpcy5zZWxlY3RlZF0/LmRvbSwgZmlsZSA9IHRhcmdldCAmJiB0aGlzLmZpbGVGb3JEb20odGFyZ2V0KTtcbiAgICAgICAgaWYgKGZpbGUpIG5ldyBDb250ZXh0TWVudSh0aGlzLCBmaWxlKS5jYXNjYWRlKHRhcmdldCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkb1Njcm9sbChkaXJlY3Rpb246IG51bWJlciwgdG9FbmQ6IGJvb2xlYW4sIGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHByZXZpZXcgPSB0aGlzLmhvdmVyUG9wb3Zlcj8uaG92ZXJFbC5maW5kKFwiLm1hcmtkb3duLXByZXZpZXctdmlld1wiKTtcbiAgICAgICAgaWYgKHByZXZpZXcpIHtcbiAgICAgICAgICAgIHByZXZpZXcuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSB0b0VuZCA/IFwiYXV0b1wiOiBcInNtb290aFwiO1xuICAgICAgICAgICAgY29uc3Qgb2xkVG9wID0gcHJldmlldy5zY3JvbGxUb3A7XG4gICAgICAgICAgICBjb25zdCBuZXdUb3AgPSAodG9FbmQgPyAwIDogcHJldmlldy5zY3JvbGxUb3ApICsgZGlyZWN0aW9uICogKHRvRW5kID8gcHJldmlldy5zY3JvbGxIZWlnaHQgOiBwcmV2aWV3LmNsaWVudEhlaWdodCk7XG4gICAgICAgICAgICBwcmV2aWV3LnNjcm9sbFRvcCA9IG5ld1RvcDtcbiAgICAgICAgICAgIGlmICghdG9FbmQpIHtcbiAgICAgICAgICAgICAgICAvLyBQYWdpbmcgcGFzdCB0aGUgYmVnaW5uaW5nIG9yIGVuZFxuICAgICAgICAgICAgICAgIGlmIChuZXdUb3AgPj0gcHJldmlldy5zY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkFycm93RG93bihldmVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdUb3AgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRUb3AgPiAwKSBwcmV2aWV3LnNjcm9sbFRvcCA9IDA7IGVsc2UgdGhpcy5vbkFycm93VXAoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghYXV0b1ByZXZpZXcpIHsgYXV0b1ByZXZpZXcgPSB0cnVlOyB0aGlzLnNob3dQb3BvdmVyKCk7IH1cbiAgICAgICAgICAgIC8vIE5vIHByZXZpZXcsIGp1c3QgZ28gdG8gbmV4dCBvciBwcmV2aW91cyBpdGVtXG4gICAgICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPiAwKSB0aGlzLm9uQXJyb3dEb3duKGV2ZW50KTsgZWxzZSB0aGlzLm9uQXJyb3dVcChldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRvUmVuYW1lKCkge1xuICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5jdXJyZW50RmlsZSgpXG4gICAgICAgIGlmIChmaWxlKSB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9tcHRGb3JGaWxlUmVuYW1lKGZpbGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZG9Nb3ZlKCkge1xuICAgICAgICBjb25zdCBleHBsb3JlclBsdWdpbiA9IHRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5wbHVnaW5zW1wiZmlsZS1leHBsb3JlclwiXTtcbiAgICAgICAgaWYgKCFleHBsb3JlclBsdWdpbi5lbmFibGVkKSB7XG4gICAgICAgICAgICBuZXcgTm90aWNlKFwiRmlsZSBleHBsb3JlciBjb3JlIHBsdWdpbiBtdXN0IGJlIGVuYWJsZWQgdG8gbW92ZSBmaWxlcyBvciBmb2xkZXJzXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1vZGFsID0gZXhwbG9yZXJQbHVnaW4uaW5zdGFuY2UubW92ZUZpbGVNb2RhbDtcbiAgICAgICAgbW9kYWwuc2V0Q3VycmVudEZpbGUodGhpcy5jdXJyZW50RmlsZSgpKTtcbiAgICAgICAgbW9kYWwub3BlbigpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjdXJyZW50SXRlbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXNbdGhpcy5zZWxlY3RlZF07XG4gICAgfVxuXG4gICAgY3VycmVudEZpbGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbGVGb3JEb20odGhpcy5jdXJyZW50SXRlbSgpPy5kb20pXG4gICAgfVxuXG4gICAgZmlsZUZvckRvbSh0YXJnZXRFbDogSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgeyBmaWxlUGF0aCB9ID0gdGFyZ2V0RWw/LmRhdGFzZXQ7XG4gICAgICAgIGlmIChmaWxlUGF0aCkgcmV0dXJuIHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmaWxlUGF0aCk7XG4gICAgfVxuXG4gICAgaXRlbUZvclBhdGgoZmlsZVBhdGg6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5maW5kSW5kZXgoaSA9PiBpLmRvbS5kYXRhc2V0LmZpbGVQYXRoID09PSBmaWxlUGF0aCk7XG4gICAgfVxuXG4gICAgb3BlbkJyZWFkY3J1bWIoZWxlbWVudDogRWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudCAmJiB0aGlzLnJvb3RNZW51KCkgPT09IHRoaXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZFeHBsb3JhYmxlID0gdGhpcy5vcGVuZXIucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxEaXZFbGVtZW50KS5jbGljaygpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFycm93UmlnaHQoKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmN1cnJlbnRGaWxlKCk7XG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICAgICAgaWYgKGZpbGUgIT09IHRoaXMuc2VsZWN0ZWRGaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsaWNrRmlsZShmaWxlLCB0aGlzLmN1cnJlbnRJdGVtKCkuZG9tKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuQnJlYWRjcnVtYih0aGlzLm9wZW5lcj8ubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcCA9IHRoaXMuaG92ZXJQb3BvdmVyO1xuICAgICAgICAgICAgaWYgKHBvcCAmJiBwb3Aucm9vdFNwbGl0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVMZWF2ZXMobGVhZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWFmLnZpZXcgaW5zdGFuY2VvZiBGaWxlVmlldyAmJiBsZWFmLnZpZXcuZmlsZSA9PT0gZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9wLnRvZ2dsZVBpbih0cnVlKTsgIC8vIEVuc3VyZSB0aGUgcG9wdXAgd29uJ3QgY2xvc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Fc2NhcGUoKTsgICAgICAvLyB3aGVuIHdlIGNsb3NlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGVhZi52aWV3IGluc3RhbmNlb2YgTWFya2Rvd25WaWV3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3dpdGNoIHRvIGVkaXQgbW9kZSAtLSBrZXlib2FyZCdzIG5vdCBtdWNoIGdvb2Qgd2l0aG91dCBpdCFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWFmLnNldFZpZXdTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGxlYWYudmlldy5nZXRWaWV3VHlwZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogeyBmaWxlOiBmaWxlLnBhdGgsIG1vZGU6IFwic291cmNlXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB0aGlzLmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmLCBmYWxzZSwgdHJ1ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTb21ldGhpbmcgbGlrZSBLYW5iYW4gb3IgRXhjYWxpZHJhdywgbWlnaHQgbm90IHN1cHBvcnQgZm9jdXMgZmxhZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyBtYWtlIHN1cmUgdGhlIGN1cnJlbnQgcGFuZSBkb2Vzbid0IGhhbmcgb250byBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KT8uYmx1cigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgIC8vIG9ubHkgdGFyZ2V0IHRoZSBmaXJzdCBsZWFmLCB3aGV0aGVyIGl0IG1hdGNoZXMgb3Igbm90XG4gICAgICAgICAgICAgICAgfSwgcG9wLnJvb3RTcGxpdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbG9hZEZpbGVzKGZvbGRlcjogVEZvbGRlciwgc2VsZWN0ZWRGaWxlPzogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBjb25zdCBmb2xkZXJOb3RlID0gdGhpcy5mb2xkZXJOb3RlKHRoaXMuZm9sZGVyKTtcbiAgICAgICAgdGhpcy5kb20uZW1wdHkoKTsgdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgICBjb25zdCBhbGxGaWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldENvbmZpZyhcInNob3dVbnN1cHBvcnRlZEZpbGVzXCIpO1xuICAgICAgICBjb25zdCB7Y2hpbGRyZW4sIHBhcmVudH0gPSBmb2xkZXI7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gY2hpbGRyZW4uc2xpY2UoKS5zb3J0KChhOiBUQWJzdHJhY3RGaWxlLCBiOiBUQWJzdHJhY3RGaWxlKSA9PiBhbHBoYVNvcnQoYS5uYW1lLCBiLm5hbWUpKVxuICAgICAgICBjb25zdCBmb2xkZXJzID0gaXRlbXMuZmlsdGVyKGYgPT4gZiBpbnN0YW5jZW9mIFRGb2xkZXIpIGFzIFRGb2xkZXJbXTtcbiAgICAgICAgY29uc3QgZmlsZXMgICA9IGl0ZW1zLmZpbHRlcihmID0+IGYgaW5zdGFuY2VvZiBURmlsZSAmJiBmICE9PSBmb2xkZXJOb3RlICYmIChhbGxGaWxlcyB8fCB0aGlzLmZpbGVJY29uKGYpKSkgYXMgVEZpbGVbXTtcbiAgICAgICAgZm9sZGVycy5zb3J0KChhLCBiKSA9PiBhbHBoYVNvcnQoYS5uYW1lLCBiLm5hbWUpKTtcbiAgICAgICAgZmlsZXMuc29ydCgoYSwgYikgPT4gYWxwaGFTb3J0KGEuYmFzZW5hbWUsIGIuYmFzZW5hbWUpKTtcbiAgICAgICAgaWYgKGZvbGRlck5vdGUpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRmlsZShmb2xkZXJOb3RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9sZGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChmb2xkZXJOb3RlKSB0aGlzLmFkZFNlcGFyYXRvcigpO1xuICAgICAgICAgICAgZm9sZGVycy5tYXAodGhpcy5hZGRGaWxlLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZm9sZGVycy5sZW5ndGggfHwgZm9sZGVyTm90ZSkgdGhpcy5hZGRTZXBhcmF0b3IoKTtcbiAgICAgICAgICAgIGZpbGVzLm1hcCh0aGlzLmFkZEZpbGUsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0KHNlbGVjdGVkRmlsZSA/IHRoaXMuaXRlbUZvclBhdGgoc2VsZWN0ZWRGaWxlLnBhdGgpIDogMCk7XG4gICAgfVxuXG4gICAgZmlsZUljb24oZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHJldHVybiBcImZvbGRlclwiO1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICBjb25zdCB2aWV3VHlwZSA9IHRoaXMuYXBwLnZpZXdSZWdpc3RyeS5nZXRUeXBlQnlFeHRlbnNpb24oZmlsZS5leHRlbnNpb24pO1xuICAgICAgICAgICAgaWYgKHZpZXdUeXBlKSByZXR1cm4gdmlld3R5cGVJY29uc1t2aWV3VHlwZV0gPz8gXCJkb2N1bWVudFwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsZUNvdW50OiAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT4gbnVtYmVyID0gKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IChcbiAgICAgICAgZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIgPyBmaWxlLmNoaWxkcmVuLm1hcCh0aGlzLmZpbGVDb3VudCkucmVkdWNlKChhLGIpID0+IGErYiwgMCkgOiAodGhpcy5maWxlSWNvbihmaWxlKSA/IDEgOiAwKVxuICAgIClcblxuICAgIGFkZEZpbGUoZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBjb25zdCBpY29uID0gdGhpcy5maWxlSWNvbihmaWxlKTtcbiAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4ge1xuICAgICAgICAgICAgaS5zZXRUaXRsZShmaWxlLm5hbWUpO1xuICAgICAgICAgICAgaS5kb20uZGF0YXNldC5maWxlUGF0aCA9IGZpbGUucGF0aDtcbiAgICAgICAgICAgIGkuZG9tLnNldEF0dHIoXCJkcmFnZ2FibGVcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgaS5kb20uYWRkQ2xhc3MgKGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyID8gXCJpcy1xZS1mb2xkZXJcIiA6IFwiaXMtcWUtZmlsZVwiKTtcbiAgICAgICAgICAgIGlmIChpY29uKSBpLnNldEljb24oaWNvbik7XG4gICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgaS5zZXRUaXRsZShmaWxlLmJhc2VuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZS5leHRlbnNpb24gIT09IFwibWRcIikgaS5kb20uY3JlYXRlRGl2KHt0ZXh0OiBmaWxlLmV4dGVuc2lvbiwgY2xzOiBbXCJuYXYtZmlsZS10YWdcIixcInFlLWV4dGVuc2lvblwiXX0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxlICE9PSB0aGlzLmZvbGRlci5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb3VudCA9IHRoaXMuZmlsZUNvdW50KGZpbGUpO1xuICAgICAgICAgICAgICAgIGlmIChjb3VudCkgaS5kb20uY3JlYXRlRGl2KHt0ZXh0OiBcIlwiK2NvdW50LCBjbHM6IFwibmF2LWZpbGUtdGFnIHFlLWZpbGUtY291bnRcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaS5vbkNsaWNrKGUgPT4gdGhpcy5vbkNsaWNrRmlsZShmaWxlLCBpLmRvbSwgZSkpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRvZ2dsZVByZXZpZXdNb2RlKCkge1xuICAgICAgICBpZiAoYXV0b1ByZXZpZXcgPSAhYXV0b1ByZXZpZXcpIHRoaXMuc2hvd1BvcG92ZXIoKTsgZWxzZSB0aGlzLmhpZGVQb3BvdmVyKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZWZyZXNoRmlsZXMgPSBkZWJvdW5jZSgoKSA9PiB0aGlzLmxvYWRGaWxlcyh0aGlzLmZvbGRlciwgdGhpcy5jdXJyZW50RmlsZSgpKSwgMTAwLCB0cnVlKTtcblxuICAgIG9ubG9hZCgpIHtcbiAgICAgICAgc3VwZXIub25sb2FkKCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImNyZWF0ZVwiLCAoZmlsZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZm9sZGVyID09PSBmaWxlLnBhcmVudCkgdGhpcy5yZWZyZXNoRmlsZXMoKTtcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJyZW5hbWVcIiwgKGZpbGUsIG9sZFBhdGgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbGRlciA9PT0gZmlsZS5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBEZXN0aW5hdGlvbiB3YXMgaGVyZTsgcmVmcmVzaCB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkRmlsZSA9IHRoaXMuaXRlbUZvclBhdGgob2xkUGF0aCkgPj0gMCA/IGZpbGUgOiB0aGlzLmN1cnJlbnRGaWxlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkRmlsZXModGhpcy5mb2xkZXIsIHNlbGVjdGVkRmlsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBpdCBpZiBpdCB3YXMgbW92ZWQgb3V0IG9mIGhlcmVcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUl0ZW1Gb3JQYXRoKG9sZFBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImRlbGV0ZVwiLCBmaWxlID0+IHRoaXMucmVtb3ZlSXRlbUZvclBhdGgoZmlsZS5wYXRoKSkpO1xuXG4gICAgICAgIC8vIEFjdGl2YXRlIHByZXZpZXcgaW1tZWRpYXRlbHkgaWYgYXBwbGljYWJsZVxuICAgICAgICBpZiAoYXV0b1ByZXZpZXcgJiYgdGhpcy5zZWxlY3RlZCAhPSAtMSkgdGhpcy5zaG93UG9wb3ZlcigpO1xuICAgIH1cblxuICAgIHJlbW92ZUl0ZW1Gb3JQYXRoKHBhdGg6IHN0cmluZykge1xuICAgICAgICBjb25zdCBwb3NuID0gdGhpcy5pdGVtRm9yUGF0aChwYXRoKTtcbiAgICAgICAgaWYgKHBvc24gPCAwKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW3Bvc25dO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCA+IHBvc24pIHRoaXMuc2VsZWN0ZWQgLT0gMTtcbiAgICAgICAgaXRlbS5kb20uZGV0YWNoKClcbiAgICAgICAgdGhpcy5pdGVtcy5yZW1vdmUoaXRlbSk7XG4gICAgfVxuXG4gICAgb25Fc2NhcGUoKSB7XG4gICAgICAgIHN1cGVyLm9uRXNjYXBlKCk7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIFBvcHVwTWVudSkgdGhpcy5wYXJlbnQub25Fc2NhcGUoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuaGlkZVBvcG92ZXIoKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZE1lbnUobWVudTogUG9wdXBNZW51KSB7XG4gICAgICAgIHN1cGVyLnNldENoaWxkTWVudShtZW51KTtcbiAgICAgICAgaWYgKGF1dG9QcmV2aWV3ICYmIHRoaXMuY2FuU2hvd1BvcG92ZXIoKSkgdGhpcy5zaG93UG9wb3ZlcigpO1xuICAgIH1cblxuICAgIHNlbGVjdChpZHg6IG51bWJlciwgc2Nyb2xsID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLnNlbGVjdGVkO1xuICAgICAgICBzdXBlci5zZWxlY3QoaWR4LCBzY3JvbGwpO1xuICAgICAgICBpZiAob2xkICE9PSB0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAvLyBzZWxlY3RlZCBpdGVtIGNoYW5nZWQ7IHRyaWdnZXIgbmV3IHBvcG92ZXIgb3IgaGlkZSB0aGUgb2xkIG9uZVxuICAgICAgICAgICAgaWYgKGF1dG9QcmV2aWV3KSB0aGlzLnNob3dQb3BvdmVyKCk7IGVsc2UgdGhpcy5oaWRlUG9wb3ZlcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGlkZVBvcG92ZXIoKSB7XG4gICAgICAgIHRoaXMuaG92ZXJQb3BvdmVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBjYW5TaG93UG9wb3ZlcigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNoaWxkICYmIHRoaXMudmlzaWJsZTtcbiAgICB9XG5cbiAgICBzaG93UG9wb3ZlciA9IGRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xuICAgICAgICBpZiAoIWF1dG9QcmV2aWV3KSByZXR1cm47XG4gICAgICAgIHRoaXMubWF5YmVIb3Zlcih0aGlzLmN1cnJlbnRJdGVtKCk/LmRvbSwgZmlsZSA9PiB0aGlzLmFwcC53b3Jrc3BhY2UudHJpZ2dlcignbGluay1ob3ZlcicsIHRoaXMsIG51bGwsIGZpbGUucGF0aCwgXCJcIikpO1xuICAgIH0sIDUwLCB0cnVlKVxuXG4gICAgb25JdGVtSG92ZXIgPSAoZXZlbnQ6IE1vdXNlRXZlbnQsIHRhcmdldEVsOiBIVE1MRGl2RWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoIWF1dG9QcmV2aWV3KSB0aGlzLm1heWJlSG92ZXIodGFyZ2V0RWwsIGZpbGUgPT4gdGhpcy5hcHAud29ya3NwYWNlLnRyaWdnZXIoJ2hvdmVyLWxpbmsnLCB7XG4gICAgICAgICAgICBldmVudCwgc291cmNlOiBob3ZlclNvdXJjZSwgaG92ZXJQYXJlbnQ6IHRoaXMsIHRhcmdldEVsLCBsaW5rdGV4dDogZmlsZS5wYXRoXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBtYXliZUhvdmVyKHRhcmdldEVsOiBIVE1MRGl2RWxlbWVudCwgY2I6IChmaWxlOiBURmlsZSkgPT4gdm9pZCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FuU2hvd1BvcG92ZXIoKSkgcmV0dXJuO1xuICAgICAgICBsZXQgZmlsZSA9IHRoaXMuZmlsZUZvckRvbSh0YXJnZXRFbClcbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSBmaWxlID0gdGhpcy5mb2xkZXJOb3RlKGZpbGUpO1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlICYmIHByZXZpZXdJY29uc1t0aGlzLmFwcC52aWV3UmVnaXN0cnkuZ2V0VHlwZUJ5RXh0ZW5zaW9uKGZpbGUuZXh0ZW5zaW9uKV0pIHtcbiAgICAgICAgICAgIGNiKGZpbGUpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZm9sZGVyTm90ZShmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aCh0aGlzLmZvbGRlck5vdGVQYXRoKGZvbGRlcikpO1xuICAgIH1cblxuICAgIGZvbGRlck5vdGVQYXRoKGZvbGRlcjogVEZvbGRlcikge1xuICAgICAgICByZXR1cm4gYCR7Zm9sZGVyLnBhdGh9LyR7Zm9sZGVyLm5hbWV9Lm1kYDtcbiAgICB9XG5cblxuICAgIF9wb3BvdmVyOiBIb3ZlckVkaXRvcjtcblxuICAgIGdldCBob3ZlclBvcG92ZXIoKSB7IHJldHVybiB0aGlzLl9wb3BvdmVyOyB9XG5cbiAgICBzZXQgaG92ZXJQb3BvdmVyKHBvcG92ZXIpIHtcbiAgICAgICAgY29uc3Qgb2xkID0gdGhpcy5fcG9wb3ZlcjtcbiAgICAgICAgaWYgKG9sZCAmJiBwb3BvdmVyICE9PSBvbGQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BvcG92ZXIgPSBudWxsO1xuICAgICAgICAgICAgb2xkLm9uSG92ZXIgPSBmYWxzZTsgICAvLyBGb3JjZSB1bnBpbm5lZCBIb3ZlciBFZGl0b3JzIHRvIGNsb3NlXG4gICAgICAgICAgICBvbGQuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3BvdmVyICYmICF0aGlzLmNhblNob3dQb3BvdmVyKCkpIHtcbiAgICAgICAgICAgIHBvcG92ZXIub25Ib3ZlciA9IGZhbHNlOyAgIC8vIEZvcmNlIHVucGlubmVkIEhvdmVyIEVkaXRvcnMgdG8gY2xvc2VcbiAgICAgICAgICAgIHBvcG92ZXIuaGlkZSgpO1xuICAgICAgICAgICAgcG9wb3ZlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcG9wb3ZlciA9IHBvcG92ZXI7XG4gICAgICAgIGlmIChhdXRvUHJldmlldyAmJiBwb3BvdmVyICYmIHRoaXMuY3VycmVudEl0ZW0oKSkge1xuICAgICAgICAgICAgLy8gT3ZlcnJpZGUgYXV0by1waW5uaW5nIGlmIHdlIGFyZSBnZW5lcmF0aW5nIGF1dG8tcHJldmlld3MsIHRvIGF2b2lkXG4gICAgICAgICAgICAvLyBnZW5lcmF0aW5nIGh1Z2UgbnVtYmVycyBvZiBwb3BvdmVyc1xuICAgICAgICAgICAgcG9wb3Zlci50b2dnbGVQaW4/LihmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIFBvc2l0aW9uIHRoZSBwb3BvdmVyIHNvIGl0IGRvZXNuJ3Qgb3ZlcmxhcCB0aGUgbWVudSBob3Jpem9udGFsbHkgKGFzIGxvbmcgYXMgaXQgZml0cylcbiAgICAgICAgICAgIC8vIGFuZCBzbyB0aGF0IGl0cyB2ZXJ0aWNhbCBwb3NpdGlvbiBvdmVybGFwcyB0aGUgc2VsZWN0ZWQgbWVudSBpdGVtIChwbGFjaW5nIHRoZSB0b3AgYVxuICAgICAgICAgICAgLy8gYml0IGFib3ZlIHRoZSBjdXJyZW50IGl0ZW0sIHVubGVzcyBpdCB3b3VsZCBnbyBvZmYgdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuKVxuICAgICAgICAgICAgY29uc3QgaG92ZXJFbCA9IHBvcG92ZXIuaG92ZXJFbDtcbiAgICAgICAgICAgIGhvdmVyRWwuc2hvdygpO1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBtZW51ID0gdGhpcy5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLmN1cnJlbnRJdGVtKCkuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IGhvdmVyRWwub2Zmc2V0UGFyZW50IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICAgICAgICBwb3B1cEhlaWdodCA9IGhvdmVyRWwub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgICAgIGxlZnQgPSBNYXRoLm1pbihtZW51LnJpZ2h0ICsgMiwgY29udGFpbmVyLmNsaWVudFdpZHRoIC0gaG92ZXJFbC5vZmZzZXRXaWR0aCksXG4gICAgICAgICAgICAgICAgdG9wID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgc2VsZWN0ZWQudG9wIC0gcG9wdXBIZWlnaHQvOCksIGNvbnRhaW5lci5jbGllbnRIZWlnaHQgLSBwb3B1cEhlaWdodClcbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIGhvdmVyRWwuc3R5bGUudG9wID0gdG9wICsgXCJweFwiO1xuICAgICAgICAgICAgaG92ZXJFbC5zdHlsZS5sZWZ0ID0gbGVmdCArIFwicHhcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSXRlbUNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50LCB0YXJnZXQ6IEhUTUxEaXZFbGVtZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmZpbGVGb3JEb20odGFyZ2V0KTtcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICAgIGlmICghdGhpcy5vbkNsaWNrRmlsZShmaWxlLCB0YXJnZXQsIGV2ZW50KSkge1xuICAgICAgICAgICAgLy8gS2VlcCBjdXJyZW50IG1lbnUgdHJlZSBvcGVuXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNsaWNrRmlsZShmaWxlOiBUQWJzdHJhY3RGaWxlLCB0YXJnZXQ6IEhUTUxEaXZFbGVtZW50LCBldmVudD86IE1vdXNlRXZlbnR8S2V5Ym9hcmRFdmVudCkge1xuICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XG4gICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuaXRlbUZvclBhdGgoZmlsZS5wYXRoKTtcbiAgICAgICAgaWYgKGlkeCA+PSAwICYmIHRoaXMuc2VsZWN0ZWQgIT0gaWR4KSB0aGlzLnNlbGVjdChpZHgpO1xuXG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC52aWV3UmVnaXN0cnkuaXNFeHRlbnNpb25SZWdpc3RlcmVkKGZpbGUuZXh0ZW5zaW9uKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vcGVuTGlua1RleHQoZmlsZS5wYXRoLCBcIlwiLCBldmVudCAmJiBLZXltYXAuaXNNb2RpZmllcihldmVudCwgXCJNb2RcIikpO1xuICAgICAgICAgICAgICAgIC8vIENsb3NlIHRoZSBlbnRpcmUgbWVudSB0cmVlXG4gICAgICAgICAgICAgICAgdGhpcy5yb290TWVudSgpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBldmVudD8uc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoYC4ke2ZpbGUuZXh0ZW5zaW9ufSBmaWxlcyBjYW5ub3QgYmUgb3BlbmVkIGluIE9ic2lkaWFuOyBVc2UgXCJPcGVuIGluIERlZmF1bHQgQXBwXCIgdG8gb3BlbiB0aGVtIGV4dGVybmFsbHlgKTtcbiAgICAgICAgICAgICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmaWxlID09PSB0aGlzLnNlbGVjdGVkRmlsZSkge1xuICAgICAgICAgICAgLy8gVGFyZ2V0aW5nIHRoZSBpbml0aWFsbHktc2VsZWN0ZWQgc3ViZm9sZGVyOiBnbyB0byBuZXh0IGJyZWFkY3J1bWJcbiAgICAgICAgICAgIHRoaXMub3BlbkJyZWFkY3J1bWIodGhpcy5vcGVuZXI/Lm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHBvcCBhIG5ldyBtZW51IGZvciB0aGUgc3ViZm9sZGVyXG4gICAgICAgICAgICBjb25zdCBmb2xkZXJNZW51ID0gbmV3IEZvbGRlck1lbnUodGhpcywgZmlsZSBhcyBURm9sZGVyLCB0aGlzLmZvbGRlck5vdGUoZmlsZSBhcyBURm9sZGVyKSk7XG4gICAgICAgICAgICBmb2xkZXJNZW51LmNhc2NhZGUodGFyZ2V0LCBldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgPyBldmVudCA6IHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkl0ZW1NZW51ID0gKGV2ZW50OiBNb3VzZUV2ZW50LCB0YXJnZXQ6IEhUTUxEaXZFbGVtZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmZpbGVGb3JEb20odGFyZ2V0KTtcbiAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuaXRlbUZvclBhdGgoZmlsZS5wYXRoKTtcbiAgICAgICAgICAgIGlmIChpZHggPj0gMCAmJiB0aGlzLnNlbGVjdGVkICE9IGlkeCkgdGhpcy5zZWxlY3QoaWR4KTtcbiAgICAgICAgICAgIG5ldyBDb250ZXh0TWVudSh0aGlzLCBmaWxlKS5jYXNjYWRlKHRhcmdldCwgZXZlbnQpO1xuICAgICAgICAgICAgLy8gS2VlcCBjdXJyZW50IG1lbnUgdHJlZSBvcGVuXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgQ29tcG9uZW50LCBUQWJzdHJhY3RGaWxlLCBURmlsZSwgVEZvbGRlciB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgbGlzdCwgZWwgfSBmcm9tIFwicmVkb21cIjtcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSBcIi4vQ29udGV4dE1lbnVcIjtcbmltcG9ydCB7IEZvbGRlck1lbnUgfSBmcm9tIFwiLi9Gb2xkZXJNZW51XCI7XG5cbmV4cG9ydCBjb25zdCBob3ZlclNvdXJjZSA9IFwicXVpY2stZXhwbG9yZXI6Zm9sZGVyLW1lbnVcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCJvYnNpZGlhblwiIHtcbiAgICBpbnRlcmZhY2UgQXBwIHtcbiAgICAgICAgZHJhZ01hbmFnZXI6IGFueVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0RHJhZyhhcHA6IEFwcCwgcGF0aDogc3RyaW5nLCBldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgaWYgKCFwYXRoIHx8IHBhdGggPT09IFwiL1wiKSByZXR1cm47XG4gICAgY29uc3QgZmlsZSA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgeyBkcmFnTWFuYWdlciB9ID0gYXBwO1xuICAgIGNvbnN0IGRyYWdEYXRhID0gZmlsZSBpbnN0YW5jZW9mIFRGaWxlID8gZHJhZ01hbmFnZXIuZHJhZ0ZpbGUoZXZlbnQsIGZpbGUpIDogZHJhZ01hbmFnZXIuZHJhZ0ZvbGRlcihldmVudCwgZmlsZSk7XG4gICAgZHJhZ01hbmFnZXIub25EcmFnU3RhcnQoZXZlbnQsIGRyYWdEYXRhKTtcbn1cblxuY2xhc3MgRXhwbG9yYWJsZSB7XG4gICAgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJleHBsb3JhYmxlLW5hbWVcIi8+O1xuICAgIHNlcEVsID0gPHNwYW4gY2xhc3M9XCJleHBsb3JhYmxlLXNlcGFyYXRvclwiLz47XG4gICAgZWwgPSA8c3BhbiBkcmFnZ2FibGUgY2xhc3M9XCJleHBsb3JhYmxlIHRpdGxlYmFyLWJ1dHRvblwiPnt0aGlzLm5hbWVFbH17dGhpcy5zZXBFbH08L3NwYW4+O1xuICAgIHVwZGF0ZShkYXRhOiB7ZmlsZTogVEFic3RyYWN0RmlsZSwgcGF0aDogc3RyaW5nfSwgaW5kZXg6IG51bWJlciwgaXRlbXM6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IHtmaWxlLCBwYXRofSA9IGRhdGE7XG4gICAgICAgIGxldCBuYW1lID0gZmlsZS5uYW1lIHx8IHBhdGg7XG4gICAgICAgIHRoaXMuc2VwRWwudG9nZ2xlKGluZGV4IDwgaXRlbXMubGVuZ3RoLTEpO1xuICAgICAgICB0aGlzLm5hbWVFbC50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgICAgIHRoaXMuZWwuZGF0YXNldC5wYXJlbnRQYXRoID0gZmlsZS5wYXJlbnQ/LnBhdGggPz8gXCIvXCI7XG4gICAgICAgIHRoaXMuZWwuZGF0YXNldC5maWxlUGF0aCA9IHBhdGg7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwbG9yZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGxhc3RGaWxlOiBUQWJzdHJhY3RGaWxlID0gbnVsbDtcbiAgICBsYXN0UGF0aDogc3RyaW5nID0gbnVsbDtcbiAgICBlbDogSFRNTEVsZW1lbnQgPSA8ZGl2IGlkPVwicXVpY2stZXhwbG9yZXJcIiAvPjtcbiAgICBsaXN0ID0gbGlzdCh0aGlzLmVsLCBFeHBsb3JhYmxlKTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBhcHA6IEFwcCkge1xuICAgICAgICBzdXBlcigpXG4gICAgfVxuXG4gICAgb25sb2FkKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCB0aGlzLnVwZGF0ZSwgdGhpcykpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsICgpID0+IHRoaXMudXBkYXRlKHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCkpKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcInJlbmFtZVwiLCB0aGlzLm9uRmlsZUNoYW5nZSwgdGhpcykpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJkZWxldGVcIiwgdGhpcy5vbkZpbGVEZWxldGUsIHRoaXMpKTtcblxuICAgICAgICB0aGlzLmVsLm9uKFwiY29udGV4dG1lbnVcIiwgXCIuZXhwbG9yYWJsZVwiLCAoZXZlbnQsIHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBmaWxlUGF0aCB9ID0gdGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGZpbGVQYXRoKTtcbiAgICAgICAgICAgIG5ldyBDb250ZXh0TWVudSh0aGlzLmFwcCwgZmlsZSkuY2FzY2FkZSh0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZWwub24oXCJjbGlja1wiLCBcIi5leHBsb3JhYmxlXCIsIChldmVudCwgdGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvbGRlck1lbnUodGFyZ2V0LCBldmVudC5pc1RydXN0ZWQgJiYgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5lbC5vbignZHJhZ3N0YXJ0JywgXCIuZXhwbG9yYWJsZVwiLCAoZXZlbnQsIHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgc3RhcnREcmFnKHRoaXMuYXBwLCB0YXJnZXQuZGF0YXNldC5maWxlUGF0aCwgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkZpbGVDaGFuZ2UoZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBpZiAoZmlsZSA9PT0gdGhpcy5sYXN0RmlsZSkgdGhpcy51cGRhdGUoZmlsZSk7XG4gICAgfVxuXG4gICAgb25GaWxlRGVsZXRlKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGUgPT09IHRoaXMubGFzdEZpbGUpIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgZm9sZGVyTWVudShvcGVuZXI6IEhUTUxFbGVtZW50ID0gdGhpcy5lbC5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudCwgZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHsgZmlsZVBhdGgsIHBhcmVudFBhdGggfSA9IG9wZW5lci5kYXRhc2V0XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGZpbGVQYXRoKTtcbiAgICAgICAgY29uc3QgZm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhcmVudFBhdGgpIGFzIFRGb2xkZXI7XG4gICAgICAgIHJldHVybiBuZXcgRm9sZGVyTWVudSh0aGlzLmFwcCwgZm9sZGVyLCBzZWxlY3RlZCwgb3BlbmVyKS5jYXNjYWRlKG9wZW5lciwgZXZlbnQpO1xuICAgIH1cblxuICAgIGJyb3dzZVZhdWx0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb2xkZXJNZW51KCk7XG4gICAgfVxuXG4gICAgYnJvd3NlQ3VycmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9sZGVyTWVudSh0aGlzLmVsLmxhc3RFbGVtZW50Q2hpbGQgYXMgSFRNTERpdkVsZW1lbnQpO1xuICAgIH1cblxuICAgIGJyb3dzZUZpbGUoZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBpZiAoZmlsZSA9PT0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkgcmV0dXJuIHRoaXMuYnJvd3NlQ3VycmVudCgpO1xuICAgICAgICBsZXQgbWVudTogRm9sZGVyTWVudTtcbiAgICAgICAgbGV0IG9wZW5lcjogSFRNTEVsZW1lbnQgPSB0aGlzLmVsLmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBjb25zdCBwYXRoID0gW10sIHBhcnRzID0gZmlsZS5wYXRoLnNwbGl0KFwiL1wiKS5maWx0ZXIocD0+cCk7XG4gICAgICAgIHdoaWxlIChvcGVuZXIgJiYgcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gocGFydHNbMF0pO1xuICAgICAgICAgICAgaWYgKG9wZW5lci5kYXRhc2V0LmZpbGVQYXRoICE9PSBwYXRoLmpvaW4oXCIvXCIpKSB7XG4gICAgICAgICAgICAgICAgbWVudSA9IHRoaXMuZm9sZGVyTWVudShvcGVuZXIpO1xuICAgICAgICAgICAgICAgIHBhdGgucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcnRzLnNoaWZ0KCk7XG4gICAgICAgICAgICBvcGVuZXIgPSBvcGVuZXIubmV4dEVsZW1lbnRTaWJsaW5nIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChtZW51ICYmIHBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcGF0aC5wdXNoKHBhcnRzLnNoaWZ0KCkpO1xuICAgICAgICAgICAgY29uc3QgaWR4ID0gbWVudS5pdGVtRm9yUGF0aChwYXRoLmpvaW4oXCIvXCIpKTtcbiAgICAgICAgICAgIGlmIChpZHggPT0gLTEpIGJyZWFrXG4gICAgICAgICAgICBtZW51LnNlbGVjdChpZHgpO1xuICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCB8fCBmaWxlIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICAgICAgICAgIG1lbnUub25BcnJvd1JpZ2h0KCk7XG4gICAgICAgICAgICAgICAgbWVudSA9IG1lbnUuY2hpbGQgYXMgRm9sZGVyTWVudTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVudTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZmlsZT86IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgZmlsZSA/Pz0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKFwiL1wiKTtcbiAgICAgICAgaWYgKGZpbGUgPT0gdGhpcy5sYXN0RmlsZSAmJiBmaWxlLnBhdGggPT0gdGhpcy5sYXN0UGF0aCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmxhc3RGaWxlID0gZmlsZTtcbiAgICAgICAgdGhpcy5sYXN0UGF0aCA9IGZpbGUucGF0aDtcbiAgICAgICAgY29uc3QgcGFydHMgPSBbXTtcbiAgICAgICAgd2hpbGUgKGZpbGUpIHtcbiAgICAgICAgICAgIHBhcnRzLnVuc2hpZnQoeyBmaWxlLCBwYXRoOiBmaWxlLnBhdGggfSk7XG4gICAgICAgICAgICBmaWxlID0gZmlsZS5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHBhcnRzLnNoaWZ0KCk7XG4gICAgICAgIHRoaXMubGlzdC51cGRhdGUocGFydHMpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHtNZW51SXRlbSwgUGx1Z2luLCBUQWJzdHJhY3RGaWxlLCBURm9sZGVyfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7bW91bnQsIHVubW91bnR9IGZyb20gXCJyZWRvbVwiO1xuaW1wb3J0IHtFeHBsb3JlciwgaG92ZXJTb3VyY2V9IGZyb20gXCIuL0V4cGxvcmVyXCI7XG5cbmltcG9ydCBcIi4vcmVkb20tanN4XCI7XG5pbXBvcnQgXCIuL3N0eWxlcy5zY3NzXCJcblxuZGVjbGFyZSBtb2R1bGUgXCJvYnNpZGlhblwiIHtcbiAgICBpbnRlcmZhY2UgV29ya3NwYWNlIHtcbiAgICAgICAgcmVnaXN0ZXJIb3ZlckxpbmtTb3VyY2Uoc291cmNlOiBzdHJpbmcsIGluZm86IHtkaXNwbGF5OiBzdHJpbmcsIGRlZmF1bHRNb2Q/OiBib29sZWFufSk6IHZvaWRcbiAgICAgICAgdW5yZWdpc3RlckhvdmVyTGlua1NvdXJjZShzb3VyY2U6IHN0cmluZyk6IHZvaWRcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgUGx1Z2luIHtcbiAgICBzdGF0dXNiYXJJdGVtOiBIVE1MRWxlbWVudFxuICAgIGV4cGxvcmVyOiBFeHBsb3JlclxuXG4gICAgb25sb2FkKCkge1xuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSggKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuYm9keS5maW5kKFwiLnRpdGxlYmFyIC50aXRsZWJhci1idXR0b24tY29udGFpbmVyLm1vZC1sZWZ0XCIpO1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlcigoKSA9PiB1bm1vdW50KGJ1dHRvbkNvbnRhaW5lciwgdGhpcy5leHBsb3JlcikpO1xuICAgICAgICAgICAgbW91bnQoYnV0dG9uQ29udGFpbmVyLCB0aGlzLmV4cGxvcmVyID0gbmV3IEV4cGxvcmVyKHRoaXMuYXBwKSk7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuZXhwbG9yZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UucmVnaXN0ZXJIb3ZlckxpbmtTb3VyY2UoaG92ZXJTb3VyY2UsIHtcbiAgICAgICAgICAgIGRpc3BsYXk6ICdRdWljayBFeHBsb3JlcicsIGRlZmF1bHRNb2Q6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwiYnJvd3NlLXZhdWx0XCIsICAgbmFtZTogXCJCcm93c2UgdmF1bHRcIiwgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHsgdGhpcy5leHBsb3Jlcj8uYnJvd3NlVmF1bHQoKTsgfSwgfSk7XG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7IGlkOiBcImJyb3dzZS1jdXJyZW50XCIsIG5hbWU6IFwiQnJvd3NlIGN1cnJlbnQgZm9sZGVyXCIsIGNhbGxiYWNrOiAoKSA9PiB7IHRoaXMuZXhwbG9yZXI/LmJyb3dzZUN1cnJlbnQoKTsgfSwgfSk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtbWVudVwiLCAobWVudSwgZmlsZSwgc291cmNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgaXRlbTogTWVudUl0ZW1cbiAgICAgICAgICAgIGlmIChzb3VyY2UgIT09IFwicXVpY2stZXhwbG9yZXJcIikgbWVudS5hZGRJdGVtKGkgPT4ge1xuICAgICAgICAgICAgICAgIGkuc2V0SWNvbihcImZvbGRlclwiKS5zZXRUaXRsZShcIlNob3cgaW4gUXVpY2sgRXhwbG9yZXJcIikub25DbGljayhlID0+IHsgdGhpcy5leHBsb3Jlcj8uYnJvd3NlRmlsZShmaWxlKTsgfSk7XG4gICAgICAgICAgICAgICAgaXRlbSA9IGk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXZlYWxGaWxlID0gaTE4bmV4dC50KGBwbHVnaW5zLmZpbGUtZXhwbG9yZXIuYWN0aW9uLXJldmVhbC1maWxlYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gbWVudS5pdGVtcy5maW5kSW5kZXgoaSA9PiBpLnRpdGxlRWwudGV4dENvbnRlbnQgPT09IHJldmVhbEZpbGUpO1xuICAgICAgICAgICAgICAgIChtZW51LmRvbSBhcyBIVE1MRWxlbWVudCkuaW5zZXJ0QmVmb3JlKGl0ZW0uZG9tLCBtZW51Lml0ZW1zW2lkeCsxXS5kb20pO1xuICAgICAgICAgICAgICAgIG1lbnUuaXRlbXMucmVtb3ZlKGl0ZW0pO1xuICAgICAgICAgICAgICAgIG1lbnUuaXRlbXMuc3BsaWNlKGlkeCsxLCAwLCBpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShURm9sZGVyLnByb3RvdHlwZSwgXCJiYXNlbmFtZVwiLCB7Z2V0KCl7IHJldHVybiB0aGlzLm5hbWU7IH0sIGNvbmZpZ3VyYWJsZTogdHJ1ZX0pXG4gICAgfVxuXG4gICAgb251bmxvYWQoKSB7XG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS51bnJlZ2lzdGVySG92ZXJMaW5rU291cmNlKGhvdmVyU291cmNlKTtcbiAgICB9XG5cbn1cbiJdLCJuYW1lcyI6WyJNZW51IiwiQXBwIiwiZGVib3VuY2UiLCJTY29wZSIsIk1lbnVJdGVtIiwiS2V5bWFwIiwiVEZvbGRlciIsIk5vdGljZSIsIlRGaWxlIiwiRmlsZVZpZXciLCJNYXJrZG93blZpZXciLCJDb21wb25lbnQiLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxTQUFTLFVBQVUsRUFBRSxLQUFLLEVBQUU7QUFDNUIsRUFBRSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLEVBQUUsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ25CLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2QsRUFBRSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDdEI7QUFDQSxFQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFDLElBQUksSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUksSUFBSSxLQUFLLEtBQUssR0FBRyxFQUFFO0FBQ3ZCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLEtBQUssTUFBTSxJQUFJLEtBQUssS0FBSyxHQUFHLEVBQUU7QUFDOUIsTUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FB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S0FBSyxDQUFDLEVBQUksT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBSSxPQUFPLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQy9FLFFBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFTLElBQUksRUFBSyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDL0UsUUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQVMsSUFBSSxFQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7UUFHaEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFRLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQU0sVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFLLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FB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TSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZILElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUV6RSxRQUFBLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxLQUFJO0FBQ3ZELFlBQUEsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDcEMsWUFBQSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1RCxZQUFBLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMzRCxTQUFDLENBQUMsQ0FBQztBQUNILFFBQUEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEtBQUk7WUFDakQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsQ0FBQztBQUN0RCxTQUFDLENBQUMsQ0FBQztBQUNILFFBQUEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEtBQUk7QUFDckQsWUFBQSxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4RCxTQUFDLENBQUMsQ0FBQztLQUNOO0FBRUQsSUFBQSxZQUFZLENBQUMsSUFBbUIsRUFBQTtBQUM1QixRQUFBLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxRQUFRO0FBQUUsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2pEO0FBRUQsSUFBQSxZQUFZLENBQUMsSUFBbUIsRUFBQTtBQUM1QixRQUFBLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxRQUFRO1lBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzdDO0lBRUQsVUFBVSxDQUFDLFNBQXNCLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWdDLEVBQUUsS0FBa0IsRUFBQTtRQUN6RixNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUE7QUFDL0MsUUFBQSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoRSxRQUFBLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBWSxDQUFDO1FBQzNFLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDcEY7SUFFRCxXQUFXLEdBQUE7QUFDUCxRQUFBLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQzVCO0lBRUQsYUFBYSxHQUFBO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWtDLENBQUMsQ0FBQztLQUN0RTtBQUVELElBQUEsVUFBVSxDQUFDLElBQW1CLEVBQUE7UUFDMUIsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFO0FBQUUsWUFBQSxPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUM3RSxRQUFBLElBQUksSUFBZ0IsQ0FBQztBQUNyQixRQUFBLElBQUksTUFBTSxHQUFnQixJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFnQyxDQUFDO1FBQ25FLE1BQU0sSUFBSSxHQUFHLEVBQUUsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzRCxRQUFBLE9BQU8sTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixZQUFBLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUM1QyxnQkFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNYLE1BQUs7QUFDUixhQUFBO1lBQ0QsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2QsWUFBQSxNQUFNLEdBQUcsTUFBTSxDQUFDLGtCQUFpQyxDQUFDO0FBQ3JELFNBQUE7QUFDRCxRQUFBLE9BQU8sSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN6QixZQUFBLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFBRSxNQUFLO0FBQ3BCLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQixZQUFBLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLFlBQVlMLGdCQUFPLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNwQixnQkFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQW1CLENBQUM7QUFDbkMsYUFBQTtBQUNKLFNBQUE7QUFDRCxRQUFBLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7QUFFRCxJQUFBLE1BQU0sQ0FBQyxJQUFvQixFQUFBO0FBQ3ZCLFFBQUEsSUFBSSxLQUFKLElBQUksR0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ25ELFFBQUEsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTztBQUNoRSxRQUFBLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFBLE9BQU8sSUFBSSxFQUFFO0FBQ1QsWUFBQSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN6QyxZQUFBLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3RCLFNBQUE7QUFDRCxRQUFBLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3BDLFFBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0I7QUFFSjs7QUNySG9CLG1CQUFBLFNBQVFNLGVBQU0sQ0FBQTtJQUkvQixNQUFNLEdBQUE7UUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUUsTUFBSztZQUNuQyxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0FBQzVGLFlBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDN0QsWUFBQSxLQUFLLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxTQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLFdBQVcsRUFBRTtBQUNwRCxZQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsSUFBSTtBQUM5QyxTQUFBLENBQUMsQ0FBQztBQUVILFFBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUksSUFBSSxFQUFFLGNBQWMsRUFBVyxRQUFRLEVBQUUsTUFBUSxFQUFBLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3SCxRQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSxNQUFRLEVBQUEsSUFBSSxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRS9ILElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxLQUFJO0FBQ3pFLFlBQUEsSUFBSSxJQUFjLENBQUE7WUFDbEIsSUFBSSxNQUFNLEtBQUssZ0JBQWdCO0FBQUUsZ0JBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUc7QUFDOUMsb0JBQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFNLEVBQUEsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzFHLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixpQkFBQyxDQUFDLENBQUE7QUFDRixZQUFBLElBQUksSUFBSSxFQUFFO2dCQUNOLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQSx3Q0FBQSxDQUEwQyxDQUFDLENBQUM7Z0JBQ3pFLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsS0FBSyxVQUFVLENBQUMsQ0FBQztnQkFDM0UsSUFBSSxDQUFDLEdBQW1CLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEUsZ0JBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsZ0JBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckMsYUFBQTtTQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUosTUFBTSxDQUFDLGNBQWMsQ0FBQ04sZ0JBQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEVBQUMsR0FBRyxHQUFBLEVBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtLQUN6RztJQUVELFFBQVEsR0FBQTtRQUNKLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQzdEO0FBRUo7Ozs7In0=

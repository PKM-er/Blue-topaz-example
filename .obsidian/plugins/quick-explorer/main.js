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
        if (this._loaded && this.sort)
            this.sort();
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
        const win = window.activeWindow ?? window, { innerHeight, innerWidth } = win;
        // Try to cascade down and to the right from the mouse or horizontal center
        // of the clicked item
        const point = { x: event ? event.clientX - hOverlap : centerX, y: bottom - vOverlap };
        // Measure the menu and see if it fits
        win.document.body.appendChild(this.dom);
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
        this.register(() => {
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
                this.rootMenu().hide();
                const newFile = await this.app.fileManager.createNewMarkdownFile(file);
                if (newFile)
                    await this.app.workspace.getLeaf(obsidian.Keymap.isModifier(e, "Mod")).openFile(newFile, {
                        active: !0, state: { mode: "source" }, eState: { rename: "all" }
                    });
            }));
            this.addItem(i => i.setTitle(optName("new-folder")).setIcon("folder").setDisabled(!haveFileExplorer).onClick(event => {
                if (haveFileExplorer) {
                    this.rootMenu().hide();
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
                this.rootMenu().hide();
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
    onEnter(event) {
        this.rootMenu().hide();
        return super.onEnter(event);
    }
    withExplorer(file) {
        const explorer = this.app.internalPlugins.plugins["file-explorer"];
        if (explorer.enabled) {
            explorer.instance.revealInFolder(file);
            return this.app.workspace.getLeavesOfType("file-explorer")[0].view;
        }
    }
}

/**
 * Component that belongs to a plugin + window. e.g.:
 *
 *     class TitleWidget extends PerWindowComponent<MyPlugin> {
 *         onload() {
 *             // do stuff with this.plugin and this.win ...
 *         }
 *     }
 *
 *     class MyPlugin extends Plugin {
 *         titleWidgets = TitleWidget.perWindow(this);
 *         ...
 *     }
 *
 * This will automatically create a title widget for each window as it's opened, and
 * on plugin load.  The plugin's `.titleWidgets` will also be a WindowManager that can
 * look up the title widget for a given window, leaf, or view, or return a list of
 * all of them.  See WindowManager for the full API.
 *
 * If you want your components to be created on demand instead of automatically when
 * window(s) are opened, you can pass `false` as the second argument to `perWindow()`.
 */
class PerWindowComponent extends obsidian.Component {
    constructor(plugin, win) {
        super();
        this.plugin = plugin;
        this.win = win;
    }
    static perWindow(plugin, autocreate = true) {
        return new WindowManager(plugin, this, autocreate);
    }
}
/**
 * Manage per-window components
 */
class WindowManager extends obsidian.Component {
    constructor(plugin, factory, // The class of thing to manage
    autocreate = true // create all items at start and monitor new window creation
    ) {
        super();
        this.plugin = plugin;
        this.factory = factory;
        this.autocreate = autocreate;
        this.instances = new WeakMap();
        plugin.addChild(this);
    }
    onload() {
        const { workspace } = this.plugin.app;
        if (this.autocreate)
            workspace.onLayoutReady(() => {
                const self = this;
                // Monitor new window creation
                if (workspace.openPopout)
                    this.register(around(workspace, {
                        openPopout(old) {
                            return function () {
                                const result = old.call(this);
                                // Handle both sync and async versions of openPopout; sync version needs a
                                // microtask delay in any case
                                Promise.resolve(result).then((popoutSplit) => self.forWindow(popoutSplit.win));
                                return result;
                            };
                        }
                    }));
                this.forAll(); // Autocreate all instances
            });
    }
    forWindow(win = window.activeWindow ?? window, create = true) {
        let inst = this.instances.get(win);
        if (!inst && create) {
            inst = new this.factory(this.plugin, win);
            if (inst) {
                this.instances.set(win, inst);
                inst.registerDomEvent(win, "beforeunload", () => {
                    this.removeChild(inst);
                    this.instances.delete(win);
                });
                this.addChild(inst);
            }
        }
        return inst || undefined;
    }
    forDom(el, create = true) {
        return this.forWindow(windowForDom(el), create);
    }
    forLeaf(leaf, create = true) {
        return this.forDom(leaf.containerEl, create);
    }
    forView(view, create = true) {
        return this.forDom(view.containerEl, create);
    }
    windows() {
        const windows = [window], { floatingSplit } = this.plugin.app.workspace;
        if (floatingSplit) {
            for (const split of floatingSplit.children)
                if (split.win)
                    windows.push(split.win);
        }
        return windows;
    }
    forAll(create = true) {
        return this.windows().map(win => this.forWindow(win, create)).filter(t => t);
    }
}
function windowForDom(el) {
    return (el.ownerDocument || el).defaultView;
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
            this.maybeHover(this.currentItem()?.dom, file => this.app.workspace.trigger(
            // Use document.body as targetEl so 0.15.x won't crash on preview
            'link-hover', this, windowForDom(this.dom).document.body, file.path, ""));
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
        const hoverEl = this.hoverPopover?.hoverEl;
        const preview = hoverEl?.find(this.hoverPopover?.rootSplit ?
            '[data-mode="preview"] .markdown-preview-view, [data-mode="source"] .cm-scroller' :
            '.markdown-preview-view');
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
        this.rootMenu().hide();
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
        this.rootMenu().hide();
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
                            this.dom.ownerDocument.activeElement?.blur();
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
            if (!old.isPinned)
                old.hide();
        }
        if (popover && !this.canShowPopover()) {
            popover.onHover = false; // Force unpinned Hover Editors to close
            popover.hide();
            popover = null;
        }
        this._popover = popover;
        /* Work around 0.15.x null targetEl bug using document.body */
        const targetEl = popover?.targetEl;
        if (targetEl && targetEl === targetEl.ownerDocument.body) {
            targetEl.removeEventListener("mouseover", popover.onMouseIn);
            targetEl.removeEventListener("mouseout", popover.onMouseOut);
        }
        if (autoPreview && popover && this.currentItem()) {
            // Override auto-pinning if we are generating auto-previews, to avoid
            // generating huge numbers of popovers
            popover.togglePin?.(false);
            // Ditch event handlers (Workaround for https://github.com/nothingislost/obsidian-hover-editor/issues/125)
            Promise.resolve().then(() => popover.abortController?.unload?.());
            // Position the popover so it doesn't overlap the menu horizontally (as long as it fits)
            // and so that its vertical position overlaps the selected menu item (placing the top a
            // bit above the current item, unless it would go off the bottom of the screen)
            const hoverEl = popover.hoverEl;
            hoverEl.show();
            const menu = this.dom.getBoundingClientRect(), selected = this.currentItem().dom.getBoundingClientRect(), container = hoverEl.offsetParent || this.dom.ownerDocument.documentElement, popupHeight = hoverEl.offsetHeight, left = Math.min(menu.right + 2, container.clientWidth - hoverEl.offsetWidth), top = Math.min(Math.max(0, selected.top - popupHeight / 8), container.clientHeight - popupHeight);
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
class Explorer extends PerWindowComponent {
    constructor() {
        super(...arguments);
        this.lastFile = null;
        this.lastPath = null;
        this.el = el("div", { id: "quick-explorer" });
        this.list = list(this.el, Explorable);
        this.isOpen = 0;
        this.app = this.plugin.app;
    }
    onload() {
        const buttonContainer = this.win.document.body.find(".titlebar .titlebar-button-container.mod-left");
        this.register(() => unmount(buttonContainer, this));
        mount(buttonContainer, this);
        if (this.isCurrent())
            this.update(this.app.workspace.getActiveFile());
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
        this.isOpen++;
        return new FolderMenu(this.app, folder, selected, opener).cascade(opener, event, () => {
            this.isOpen--;
            if (!this.isOpen && this.isCurrent())
                this.update(this.app.workspace.getActiveFile());
        });
    }
    browseVault() {
        return this.folderMenu();
    }
    browseCurrent() {
        return this.folderMenu(this.el.lastElementChild);
    }
    browseFile(file) {
        if (file === this.lastFile)
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
    isCurrent() {
        return this === this.plugin.explorers.forLeaf(this.plugin.app.workspace.activeLeaf);
    }
    update(file) {
        if (this.isOpen)
            return;
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

class QE extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.explorers = Explorer.perWindow(this, false);
    }
    updateCurrent(leaf = this.app.workspace.activeLeaf, file = this.app.workspace.getActiveFile()) {
        this.explorers.forLeaf(leaf).update(file);
    }
    onload() {
        this.app.workspace.registerHoverLinkSource(hoverSource, {
            display: 'Quick Explorer', defaultMod: true
        });
        this.registerEvent(this.app.workspace.on("file-open", () => this.updateCurrent()));
        this.registerEvent(this.app.workspace.on("active-leaf-change", leaf => this.updateCurrent(leaf)));
        this.app.workspace.onLayoutReady(() => this.updateCurrent());
        this.addCommand({ id: "browse-vault", name: "Browse vault", callback: () => { this.explorers.forWindow()?.browseVault(); }, });
        this.addCommand({ id: "browse-current", name: "Browse current folder", callback: () => { this.explorers.forWindow()?.browseCurrent(); }, });
        this.registerEvent(this.app.workspace.on("file-menu", (menu, file, source) => {
            let item;
            if (source !== "quick-explorer")
                menu.addItem(i => {
                    i.setIcon("folder").setTitle("Show in Quick Explorer").onClick(e => { this.explorers.forDom(item.dom)?.browseFile(file); });
                    item = i;
                    item.setSection?.("view");
                });
            if (item) {
                const revealFile = i18next.t(`plugins.file-explorer.action-reveal-file`);
                const idx = menu.items.findIndex(i => i.titleEl?.textContent === revealFile);
                if (idx > -1) {
                    // Remove this once 0.15.3+ is required
                    if (!menu.sections)
                        menu.dom.insertBefore(item.dom, menu.items[idx].dom);
                    menu.items.remove(item);
                    menu.items.splice(idx, 0, item);
                }
            }
        }));
        Object.defineProperty(obsidian.TFolder.prototype, "basename", { get() { return this.name; }, configurable: true });
    }
    onunload() {
        this.app.workspace.unregisterHoverLinkSource(hoverSource);
    }
}

module.exports = QE;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzLy5wbnBtL3JlZG9tQDMuMjcuMS9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIm5vZGVfbW9kdWxlcy8ucG5wbS9tb25rZXktYXJvdW5kQDIuMy4wL25vZGVfbW9kdWxlcy9tb25rZXktYXJvdW5kL21qcy9pbmRleC5qcyIsInNyYy9tZW51cy50cyIsInNyYy9Db250ZXh0TWVudS50cyIsInNyYy9QZXJXaW5kb3dDb21wb25lbnQudHMiLCJzcmMvRm9sZGVyTWVudS50cyIsInNyYy9FeHBsb3Jlci50c3giLCJzcmMvcXVpY2stZXhwbG9yZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHBhcnNlUXVlcnkgKHF1ZXJ5KSB7XG4gIHZhciBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsjLl0pLyk7XG4gIHZhciB0YWdOYW1lID0gJyc7XG4gIHZhciBpZCA9ICcnO1xuICB2YXIgY2xhc3NOYW1lcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNodW5rID0gY2h1bmtzW2ldO1xuICAgIGlmIChjaHVuayA9PT0gJyMnKSB7XG4gICAgICBpZCA9IGNodW5rc1srK2ldO1xuICAgIH0gZWxzZSBpZiAoY2h1bmsgPT09ICcuJykge1xuICAgICAgY2xhc3NOYW1lcy5wdXNoKGNodW5rc1srK2ldKTtcbiAgICB9IGVsc2UgaWYgKGNodW5rLmxlbmd0aCkge1xuICAgICAgdGFnTmFtZSA9IGNodW5rO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGFnOiB0YWdOYW1lIHx8ICdkaXYnLFxuICAgIGlkOiBpZCxcbiAgICBjbGFzc05hbWU6IGNsYXNzTmFtZXMuam9pbignICcpXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQgKHF1ZXJ5LCBucykge1xuICB2YXIgcmVmID0gcGFyc2VRdWVyeShxdWVyeSk7XG4gIHZhciB0YWcgPSByZWYudGFnO1xuICB2YXIgaWQgPSByZWYuaWQ7XG4gIHZhciBjbGFzc05hbWUgPSByZWYuY2xhc3NOYW1lO1xuICB2YXIgZWxlbWVudCA9IG5zID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcpIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuXG4gIGlmIChpZCkge1xuICAgIGVsZW1lbnQuaWQgPSBpZDtcbiAgfVxuXG4gIGlmIChjbGFzc05hbWUpIHtcbiAgICBpZiAobnMpIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiB1bm1vdW50IChwYXJlbnQsIGNoaWxkKSB7XG4gIHZhciBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIHZhciBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGRFbC5wYXJlbnROb2RlKSB7XG4gICAgZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCk7XG5cbiAgICBwYXJlbnRFbC5yZW1vdmVDaGlsZChjaGlsZEVsKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuZnVuY3Rpb24gZG9Vbm1vdW50IChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgdmFyIGhvb2tzID0gY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoaG9va3NBcmVFbXB0eShob29rcykpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRyYXZlcnNlID0gcGFyZW50RWw7XG5cbiAgaWYgKGNoaWxkRWwuX19yZWRvbV9tb3VudGVkKSB7XG4gICAgdHJpZ2dlcihjaGlsZEVsLCAnb251bm1vdW50Jyk7XG4gIH1cblxuICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICB2YXIgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAodmFyIGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIGlmIChwYXJlbnRIb29rc1tob29rXSkge1xuICAgICAgICBwYXJlbnRIb29rc1tob29rXSAtPSBob29rc1tob29rXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaG9va3NBcmVFbXB0eShwYXJlbnRIb29rcykpIHtcbiAgICAgIHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0cmF2ZXJzZSA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaG9va3NBcmVFbXB0eSAoaG9va3MpIHtcbiAgaWYgKGhvb2tzID09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxudmFyIGhvb2tOYW1lcyA9IFsnb25tb3VudCcsICdvbnJlbW91bnQnLCAnb251bm1vdW50J107XG52YXIgc2hhZG93Um9vdEF2YWlsYWJsZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICdTaGFkb3dSb290JyBpbiB3aW5kb3c7XG5cbmZ1bmN0aW9uIG1vdW50IChwYXJlbnQsIGNoaWxkLCBiZWZvcmUsIHJlcGxhY2UpIHtcbiAgdmFyIHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgdmFyIGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgIGNoaWxkRWwuX19yZWRvbV92aWV3ID0gY2hpbGQ7XG4gIH1cblxuICB2YXIgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICB2YXIgb2xkUGFyZW50ID0gY2hpbGRFbC5wYXJlbnROb2RlO1xuXG4gIGlmICh3YXNNb3VudGVkICYmIChvbGRQYXJlbnQgIT09IHBhcmVudEVsKSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBwYXJlbnRFbC5yZXBsYWNlQ2hpbGQoY2hpbGRFbCwgZ2V0RWwoYmVmb3JlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIgKGVsLCBldmVudE5hbWUpIHtcbiAgaWYgKGV2ZW50TmFtZSA9PT0gJ29ubW91bnQnIHx8IGV2ZW50TmFtZSA9PT0gJ29ucmVtb3VudCcpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gJ29udW5tb3VudCcpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBob29rcyA9IGVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmICghaG9va3MpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgdmFyIGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldyAmJiB2aWV3W2V2ZW50TmFtZV0gJiYgdmlld1tldmVudE5hbWVdKCk7XG5cbiAgZm9yICh2YXIgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgdmFyIHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgdmFyIG5leHQgPSB0cmF2ZXJzZS5uZXh0U2libGluZztcblxuICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgZXZlbnROYW1lKTtcblxuICAgICAgdHJhdmVyc2UgPSBuZXh0O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkb01vdW50IChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwsIG9sZFBhcmVudCkge1xuICB2YXIgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlIHx8IChjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge30pO1xuICB2YXIgcmVtb3VudCA9IChwYXJlbnRFbCA9PT0gb2xkUGFyZW50KTtcbiAgdmFyIGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gMCwgbGlzdCA9IGhvb2tOYW1lczsgaSA8IGxpc3QubGVuZ3RoOyBpICs9IDEpIHtcbiAgICB2YXIgaG9va05hbWUgPSBsaXN0W2ldO1xuXG4gICAgaWYgKCFyZW1vdW50KSB7IC8vIGlmIGFscmVhZHkgbW91bnRlZCwgc2tpcCB0aGlzIHBoYXNlXG4gICAgICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHsgLy8gb25seSBWaWV3cyBjYW4gaGF2ZSBsaWZlY3ljbGUgZXZlbnRzXG4gICAgICAgIGlmIChob29rTmFtZSBpbiBjaGlsZCkge1xuICAgICAgICAgIGhvb2tzW2hvb2tOYW1lXSA9IChob29rc1tob29rTmFtZV0gfHwgMCkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChob29rc1tob29rTmFtZV0pIHtcbiAgICAgIGhvb2tzRm91bmQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaG9va3NGb3VuZCkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdHJhdmVyc2UgPSBwYXJlbnRFbDtcbiAgdmFyIHRyaWdnZXJlZCA9IGZhbHNlO1xuXG4gIGlmIChyZW1vdW50IHx8ICh0cmF2ZXJzZSAmJiB0cmF2ZXJzZS5fX3JlZG9tX21vdW50ZWQpKSB7XG4gICAgdHJpZ2dlcihjaGlsZEVsLCByZW1vdW50ID8gJ29ucmVtb3VudCcgOiAnb25tb3VudCcpO1xuICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gIH1cblxuICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICB2YXIgcGFyZW50ID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgICB2YXIgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCAodHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSB7fSk7XG5cbiAgICBmb3IgKHZhciBob29rIGluIGhvb2tzKSB7XG4gICAgICBwYXJlbnRIb29rc1tob29rXSA9IChwYXJlbnRIb29rc1tob29rXSB8fCAwKSArIGhvb2tzW2hvb2tdO1xuICAgIH1cblxuICAgIGlmICh0cmlnZ2VyZWQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHJhdmVyc2Uubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSB8fFxuICAgICAgICAoc2hhZG93Um9vdEF2YWlsYWJsZSAmJiAodHJhdmVyc2UgaW5zdGFuY2VvZiBTaGFkb3dSb290KSkgfHxcbiAgICAgICAgKHBhcmVudCAmJiBwYXJlbnQuX19yZWRvbV9tb3VudGVkKVxuICAgICAgKSB7XG4gICAgICAgIHRyaWdnZXIodHJhdmVyc2UsIHJlbW91bnQgPyAnb25yZW1vdW50JyA6ICdvbm1vdW50Jyk7XG4gICAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICB0cmF2ZXJzZSA9IHBhcmVudDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0U3R5bGUgKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgdmFyIGVsID0gZ2V0RWwodmlldyk7XG5cbiAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUgKGVsLCBrZXksIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgZWwuc3R5bGVba2V5XSA9ICcnO1xuICB9IGVsc2Uge1xuICAgIGVsLnN0eWxlW2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG4vKiBnbG9iYWwgU1ZHRWxlbWVudCAqL1xuXG52YXIgeGxpbmtucyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJztcblxuZnVuY3Rpb24gc2V0QXR0ciAodmlldywgYXJnMSwgYXJnMikge1xuICBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMik7XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJJbnRlcm5hbCAodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICB2YXIgZWwgPSBnZXRFbCh2aWV3KTtcblxuICB2YXIgaXNPYmogPSB0eXBlb2YgYXJnMSA9PT0gJ29iamVjdCc7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbCwga2V5LCBhcmcxW2tleV0sIGluaXRpYWwpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgaXNTVkcgPSBlbCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQ7XG4gICAgdmFyIGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSAnZnVuY3Rpb24nO1xuXG4gICAgaWYgKGFyZzEgPT09ICdzdHlsZScgJiYgdHlwZW9mIGFyZzIgPT09ICdvYmplY3QnKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09ICdkYXRhc2V0Jykge1xuICAgICAgc2V0RGF0YShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmICghaXNTVkcgJiYgKGFyZzEgaW4gZWwgfHwgaXNGdW5jKSAmJiAoYXJnMSAhPT0gJ2xpc3QnKSkge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTVkcgJiYgKGFyZzEgPT09ICd4bGluaycpKSB7XG4gICAgICAgIHNldFhsaW5rKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGluaXRpYWwgJiYgYXJnMSA9PT0gJ2NsYXNzJykge1xuICAgICAgICBhcmcyID0gZWwuY2xhc3NOYW1lICsgJyAnICsgYXJnMjtcbiAgICAgIH1cbiAgICAgIGlmIChhcmcyID09IG51bGwpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGFyZzEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGFyZzEsIGFyZzIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayAoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEgKGVsLCBhcmcxLCBhcmcyKSB7XG4gIGlmICh0eXBlb2YgYXJnMSA9PT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQgKHN0cikge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoKHN0ciAhPSBudWxsKSA/IHN0ciA6ICcnKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VBcmd1bWVudHNJbnRlcm5hbCAoZWxlbWVudCwgYXJncywgaW5pdGlhbCkge1xuICBmb3IgKHZhciBpID0gMCwgbGlzdCA9IGFyZ3M7IGkgPCBsaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgdmFyIGFyZyA9IGxpc3RbaV07XG5cbiAgICBpZiAoYXJnICE9PSAwICYmICFhcmcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciB0eXBlID0gdHlwZW9mIGFyZztcblxuICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0KGFyZykpO1xuICAgIH0gZWxzZSBpZiAoaXNOb2RlKGdldEVsKGFyZykpKSB7XG4gICAgICBtb3VudChlbGVtZW50LCBhcmcpO1xuICAgIH0gZWxzZSBpZiAoYXJnLmxlbmd0aCkge1xuICAgICAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChlbGVtZW50LCBhcmcsIGluaXRpYWwpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbCAocGFyZW50KSB7XG4gIHJldHVybiB0eXBlb2YgcGFyZW50ID09PSAnc3RyaW5nJyA/IGh0bWwocGFyZW50KSA6IGdldEVsKHBhcmVudCk7XG59XG5cbmZ1bmN0aW9uIGdldEVsIChwYXJlbnQpIHtcbiAgcmV0dXJuIChwYXJlbnQubm9kZVR5cGUgJiYgcGFyZW50KSB8fCAoIXBhcmVudC5lbCAmJiBwYXJlbnQpIHx8IGdldEVsKHBhcmVudC5lbCk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZSAoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgYXJnLm5vZGVUeXBlO1xufVxuXG52YXIgaHRtbENhY2hlID0ge307XG5cbmZ1bmN0aW9uIGh0bWwgKHF1ZXJ5KSB7XG4gIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGFyZ3NbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgdmFyIGVsZW1lbnQ7XG5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgcXVlcnk7XG5cbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgZWxlbWVudCA9IG1lbW9pemVIVE1MKHF1ZXJ5KS5jbG9uZU5vZGUoZmFsc2UpO1xuICB9IGVsc2UgaWYgKGlzTm9kZShxdWVyeSkpIHtcbiAgICBlbGVtZW50ID0gcXVlcnkuY2xvbmVOb2RlKGZhbHNlKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIFF1ZXJ5ID0gcXVlcnk7XG4gICAgZWxlbWVudCA9IG5ldyAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoIFF1ZXJ5LCBbIG51bGwgXS5jb25jYXQoIGFyZ3MpICkpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkJyk7XG4gIH1cblxuICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGdldEVsKGVsZW1lbnQpLCBhcmdzLCB0cnVlKTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxudmFyIGVsID0gaHRtbDtcbnZhciBoID0gaHRtbDtcblxuaHRtbC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRIdG1sIChxdWVyeSkge1xuICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHZhciBjbG9uZSA9IG1lbW9pemVIVE1MKHF1ZXJ5KTtcblxuICByZXR1cm4gaHRtbC5iaW5kLmFwcGx5KGh0bWwsIFsgdGhpcywgY2xvbmUgXS5jb25jYXQoIGFyZ3MgKSk7XG59O1xuXG5mdW5jdGlvbiBtZW1vaXplSFRNTCAocXVlcnkpIHtcbiAgcmV0dXJuIGh0bWxDYWNoZVtxdWVyeV0gfHwgKGh0bWxDYWNoZVtxdWVyeV0gPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KSk7XG59XG5cbmZ1bmN0aW9uIHNldENoaWxkcmVuIChwYXJlbnQpIHtcbiAgdmFyIGNoaWxkcmVuID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGNoaWxkcmVuWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHZhciBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIHZhciBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICB2YXIgbmV4dCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG5cbiAgICB1bm1vdW50KHBhcmVudCwgY3VycmVudCk7XG5cbiAgICBjdXJyZW50ID0gbmV4dDtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmF2ZXJzZSAocGFyZW50LCBjaGlsZHJlbiwgX2N1cnJlbnQpIHtcbiAgdmFyIGN1cnJlbnQgPSBfY3VycmVudDtcblxuICB2YXIgY2hpbGRFbHMgPSBuZXcgQXJyYXkoY2hpbGRyZW4ubGVuZ3RoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY2hpbGRFbHNbaV0gPSBjaGlsZHJlbltpXSAmJiBnZXRFbChjaGlsZHJlbltpXSk7XG4gIH1cblxuICBmb3IgKHZhciBpJDEgPSAwOyBpJDEgPCBjaGlsZHJlbi5sZW5ndGg7IGkkMSsrKSB7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baSQxXTtcblxuICAgIGlmICghY2hpbGQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBjaGlsZEVsID0gY2hpbGRFbHNbaSQxXTtcblxuICAgIGlmIChjaGlsZEVsID09PSBjdXJyZW50KSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChpc05vZGUoY2hpbGRFbCkpIHtcbiAgICAgIHZhciBuZXh0ID0gY3VycmVudCAmJiBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgdmFyIGV4aXN0cyA9IGNoaWxkLl9fcmVkb21faW5kZXggIT0gbnVsbDtcbiAgICAgIHZhciByZXBsYWNlID0gZXhpc3RzICYmIG5leHQgPT09IGNoaWxkRWxzW2kkMSArIDFdO1xuXG4gICAgICBtb3VudChwYXJlbnQsIGNoaWxkLCBjdXJyZW50LCByZXBsYWNlKTtcblxuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5sZW5ndGggIT0gbnVsbCkge1xuICAgICAgY3VycmVudCA9IHRyYXZlcnNlKHBhcmVudCwgY2hpbGQsIGN1cnJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiBsaXN0UG9vbCAoVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG52YXIgTGlzdFBvb2wgPSBmdW5jdGlvbiBMaXN0UG9vbCAoVmlldywga2V5LCBpbml0RGF0YSkge1xuICB0aGlzLlZpZXcgPSBWaWV3O1xuICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gIHRoaXMub2xkTG9va3VwID0ge307XG4gIHRoaXMubG9va3VwID0ge307XG4gIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgdGhpcy52aWV3cyA9IFtdO1xuXG4gIGlmIChrZXkgIT0gbnVsbCkge1xuICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gJ2Z1bmN0aW9uJyA/IGtleSA6IHByb3BLZXkoa2V5KTtcbiAgfVxufTtcblxuTGlzdFBvb2wucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAoZGF0YSwgY29udGV4dCkge1xuICB2YXIgcmVmID0gdGhpcztcbiAgICB2YXIgVmlldyA9IHJlZi5WaWV3O1xuICAgIHZhciBrZXkgPSByZWYua2V5O1xuICAgIHZhciBpbml0RGF0YSA9IHJlZi5pbml0RGF0YTtcbiAgdmFyIGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gIHZhciBvbGRMb29rdXAgPSB0aGlzLmxvb2t1cDtcbiAgdmFyIG5ld0xvb2t1cCA9IHt9O1xuXG4gIHZhciBuZXdWaWV3cyA9IG5ldyBBcnJheShkYXRhLmxlbmd0aCk7XG4gIHZhciBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBkYXRhW2ldO1xuICAgIHZhciB2aWV3ID0gKHZvaWQgMCk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB2YXIgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgIHZpZXcgPSBvbGRMb29rdXBbaWRdIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICAgIG5ld0xvb2t1cFtpZF0gPSB2aWV3O1xuICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcgPSBvbGRWaWV3c1tpXSB8fCBuZXcgVmlldyhpbml0RGF0YSwgaXRlbSwgaSwgZGF0YSk7XG4gICAgfVxuICAgIHZpZXcudXBkYXRlICYmIHZpZXcudXBkYXRlKGl0ZW0sIGksIGRhdGEsIGNvbnRleHQpO1xuXG4gICAgdmFyIGVsID0gZ2V0RWwodmlldy5lbCk7XG5cbiAgICBlbC5fX3JlZG9tX3ZpZXcgPSB2aWV3O1xuICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgfVxuXG4gIHRoaXMub2xkVmlld3MgPSBvbGRWaWV3cztcbiAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gIHRoaXMub2xkTG9va3VwID0gb2xkTG9va3VwO1xuICB0aGlzLmxvb2t1cCA9IG5ld0xvb2t1cDtcbn07XG5cbmZ1bmN0aW9uIHByb3BLZXkgKGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbVtrZXldO1xuICB9O1xufVxuXG5mdW5jdGlvbiBsaXN0IChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0KHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbnZhciBMaXN0ID0gZnVuY3Rpb24gTGlzdCAocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHRoaXMuVmlldyA9IFZpZXc7XG4gIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgdGhpcy52aWV3cyA9IFtdO1xuICB0aGlzLnBvb2wgPSBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG4gIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xufTtcblxuTGlzdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChkYXRhLCBjb250ZXh0KSB7XG4gICAgaWYgKCBkYXRhID09PSB2b2lkIDAgKSBkYXRhID0gW107XG5cbiAgdmFyIHJlZiA9IHRoaXM7XG4gICAgdmFyIGtleVNldCA9IHJlZi5rZXlTZXQ7XG4gIHZhciBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgdGhpcy5wb29sLnVwZGF0ZShkYXRhLCBjb250ZXh0KTtcblxuICB2YXIgcmVmJDEgPSB0aGlzLnBvb2w7XG4gICAgdmFyIHZpZXdzID0gcmVmJDEudmlld3M7XG4gICAgdmFyIGxvb2t1cCA9IHJlZiQxLmxvb2t1cDtcblxuICBpZiAoa2V5U2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGRWaWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgIHZhciBpZCA9IG9sZFZpZXcuX19yZWRvbV9pZDtcblxuICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICBvbGRWaWV3Ll9fcmVkb21faW5kZXggPSBudWxsO1xuICAgICAgICB1bm1vdW50KHRoaXMsIG9sZFZpZXcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkkMSA9IDA7IGkkMSA8IHZpZXdzLmxlbmd0aDsgaSQxKyspIHtcbiAgICB2YXIgdmlldyA9IHZpZXdzW2kkMV07XG5cbiAgICB2aWV3Ll9fcmVkb21faW5kZXggPSBpJDE7XG4gIH1cblxuICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgaWYgKGtleVNldCkge1xuICAgIHRoaXMubG9va3VwID0gbG9va3VwO1xuICB9XG4gIHRoaXMudmlld3MgPSB2aWV3cztcbn07XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdCAocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBMaXN0LmJpbmQoTGlzdCwgcGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn07XG5cbmxpc3QuZXh0ZW5kID0gTGlzdC5leHRlbmQ7XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cbmZ1bmN0aW9uIHBsYWNlIChWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxudmFyIFBsYWNlID0gZnVuY3Rpb24gUGxhY2UgKFZpZXcsIGluaXREYXRhKSB7XG4gIHRoaXMuZWwgPSB0ZXh0KCcnKTtcbiAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gIHRoaXMudmlldyA9IG51bGw7XG4gIHRoaXMuX3BsYWNlaG9sZGVyID0gdGhpcy5lbDtcblxuICBpZiAoVmlldyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICB0aGlzLl9lbCA9IFZpZXc7XG4gIH0gZWxzZSBpZiAoVmlldy5lbCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgdGhpcy52aWV3ID0gVmlldztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9WaWV3ID0gVmlldztcbiAgfVxuXG4gIHRoaXMuX2luaXREYXRhID0gaW5pdERhdGE7XG59O1xuXG5QbGFjZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlICh2aXNpYmxlLCBkYXRhKSB7XG4gIHZhciBwbGFjZWhvbGRlciA9IHRoaXMuX3BsYWNlaG9sZGVyO1xuICB2YXIgcGFyZW50Tm9kZSA9IHRoaXMuZWwucGFyZW50Tm9kZTtcblxuICBpZiAodmlzaWJsZSkge1xuICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdGhpcy5fZWwsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgdGhpcy5lbCA9IGdldEVsKHRoaXMuX2VsKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBWaWV3ID0gdGhpcy5fVmlldztcbiAgICAgICAgdmFyIHZpZXcgPSBuZXcgVmlldyh0aGlzLl9pbml0RGF0YSk7XG5cbiAgICAgICAgdGhpcy5lbCA9IGdldEVsKHZpZXcpO1xuICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHZpZXcsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudmlldyAmJiB0aGlzLnZpZXcudXBkYXRlICYmIHRoaXMudmlldy51cGRhdGUoZGF0YSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgaWYgKHRoaXMuX2VsKSB7XG4gICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy5fZWwpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy52aWV3KTtcblxuICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbn07XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cbmZ1bmN0aW9uIHJvdXRlciAocGFyZW50LCBWaWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCBWaWV3cywgaW5pdERhdGEpO1xufVxuXG52YXIgUm91dGVyID0gZnVuY3Rpb24gUm91dGVyIChwYXJlbnQsIFZpZXdzLCBpbml0RGF0YSkge1xuICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgdGhpcy5WaWV3cyA9IFZpZXdzO1xuICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG59O1xuXG5Sb3V0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAocm91dGUsIGRhdGEpIHtcbiAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgdmFyIFZpZXdzID0gdGhpcy5WaWV3cztcbiAgICB2YXIgVmlldyA9IFZpZXdzW3JvdXRlXTtcblxuICAgIHRoaXMucm91dGUgPSByb3V0ZTtcblxuICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgIHRoaXMudmlldyA9IFZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgfVxuXG4gICAgc2V0Q2hpbGRyZW4odGhpcy5lbCwgW3RoaXMudmlld10pO1xuICB9XG4gIHRoaXMudmlldyAmJiB0aGlzLnZpZXcudXBkYXRlICYmIHRoaXMudmlldy51cGRhdGUoZGF0YSwgcm91dGUpO1xufTtcblxudmFyIG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxudmFyIHN2Z0NhY2hlID0ge307XG5cbmZ1bmN0aW9uIHN2ZyAocXVlcnkpIHtcbiAgdmFyIGFyZ3MgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgYXJnc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICB2YXIgZWxlbWVudDtcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBlbGVtZW50ID0gbWVtb2l6ZVNWRyhxdWVyeSkuY2xvbmVOb2RlKGZhbHNlKTtcbiAgfSBlbHNlIGlmIChpc05vZGUocXVlcnkpKSB7XG4gICAgZWxlbWVudCA9IHF1ZXJ5LmNsb25lTm9kZShmYWxzZSk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmFwcGx5KCBRdWVyeSwgWyBudWxsIF0uY29uY2F0KCBhcmdzKSApKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSBhcmd1bWVudCByZXF1aXJlZCcpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbnZhciBzID0gc3ZnO1xuXG5zdmcuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kU3ZnIChxdWVyeSkge1xuICB2YXIgY2xvbmUgPSBtZW1vaXplU1ZHKHF1ZXJ5KTtcblxuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgY2xvbmUpO1xufTtcblxuc3ZnLm5zID0gbnM7XG5cbmZ1bmN0aW9uIG1lbW9pemVTVkcgKHF1ZXJ5KSB7XG4gIHJldHVybiBzdmdDYWNoZVtxdWVyeV0gfHwgKHN2Z0NhY2hlW3F1ZXJ5XSA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKSk7XG59XG5cbmV4cG9ydCB7IExpc3QsIExpc3RQb29sLCBQbGFjZSwgUm91dGVyLCBlbCwgaCwgaHRtbCwgbGlzdCwgbGlzdFBvb2wsIG1vdW50LCBwbGFjZSwgcm91dGVyLCBzLCBzZXRBdHRyLCBzZXRDaGlsZHJlbiwgc2V0RGF0YSwgc2V0U3R5bGUsIHNldFhsaW5rLCBzdmcsIHRleHQsIHVubW91bnQgfTtcbiIsImV4cG9ydCBmdW5jdGlvbiBhcm91bmQob2JqLCBmYWN0b3JpZXMpIHtcbiAgICBjb25zdCByZW1vdmVycyA9IE9iamVjdC5rZXlzKGZhY3RvcmllcykubWFwKGtleSA9PiBhcm91bmQxKG9iaiwga2V5LCBmYWN0b3JpZXNba2V5XSkpO1xuICAgIHJldHVybiByZW1vdmVycy5sZW5ndGggPT09IDEgPyByZW1vdmVyc1swXSA6IGZ1bmN0aW9uICgpIHsgcmVtb3ZlcnMuZm9yRWFjaChyID0+IHIoKSk7IH07XG59XG5mdW5jdGlvbiBhcm91bmQxKG9iaiwgbWV0aG9kLCBjcmVhdGVXcmFwcGVyKSB7XG4gICAgY29uc3Qgb3JpZ2luYWwgPSBvYmpbbWV0aG9kXSwgaGFkT3duID0gb2JqLmhhc093blByb3BlcnR5KG1ldGhvZCk7XG4gICAgbGV0IGN1cnJlbnQgPSBjcmVhdGVXcmFwcGVyKG9yaWdpbmFsKTtcbiAgICAvLyBMZXQgb3VyIHdyYXBwZXIgaW5oZXJpdCBzdGF0aWMgcHJvcHMgZnJvbSB0aGUgd3JhcHBpbmcgbWV0aG9kLFxuICAgIC8vIGFuZCB0aGUgd3JhcHBpbmcgbWV0aG9kLCBwcm9wcyBmcm9tIHRoZSBvcmlnaW5hbCBtZXRob2RcbiAgICBpZiAob3JpZ2luYWwpXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihjdXJyZW50LCBvcmlnaW5hbCk7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHdyYXBwZXIsIGN1cnJlbnQpO1xuICAgIG9ialttZXRob2RdID0gd3JhcHBlcjtcbiAgICAvLyBSZXR1cm4gYSBjYWxsYmFjayB0byBhbGxvdyBzYWZlIHJlbW92YWxcbiAgICByZXR1cm4gcmVtb3ZlO1xuICAgIGZ1bmN0aW9uIHdyYXBwZXIoLi4uYXJncykge1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIGJlZW4gZGVhY3RpdmF0ZWQgYW5kIGFyZSBubyBsb25nZXIgd3JhcHBlZCwgcmVtb3ZlIG91cnNlbHZlc1xuICAgICAgICBpZiAoY3VycmVudCA9PT0gb3JpZ2luYWwgJiYgb2JqW21ldGhvZF0gPT09IHdyYXBwZXIpXG4gICAgICAgICAgICByZW1vdmUoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgLy8gSWYgbm8gb3RoZXIgcGF0Y2hlcywganVzdCBkbyBhIGRpcmVjdCByZW1vdmFsXG4gICAgICAgIGlmIChvYmpbbWV0aG9kXSA9PT0gd3JhcHBlcikge1xuICAgICAgICAgICAgaWYgKGhhZE93bilcbiAgICAgICAgICAgICAgICBvYmpbbWV0aG9kXSA9IG9yaWdpbmFsO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmpbbWV0aG9kXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudCA9PT0gb3JpZ2luYWwpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vIEVsc2UgcGFzcyBmdXR1cmUgY2FsbHMgdGhyb3VnaCwgYW5kIHJlbW92ZSB3cmFwcGVyIGZyb20gdGhlIHByb3RvdHlwZSBjaGFpblxuICAgICAgICBjdXJyZW50ID0gb3JpZ2luYWw7XG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih3cmFwcGVyLCBvcmlnaW5hbCB8fCBGdW5jdGlvbik7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwZShrZXksIG9sZEZuLCBuZXdGbikge1xuICAgIGNoZWNrW2tleV0gPSBrZXk7XG4gICAgcmV0dXJuIGNoZWNrO1xuICAgIGZ1bmN0aW9uIGNoZWNrKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIChvbGRGbltrZXldID09PSBrZXkgPyBvbGRGbiA6IG5ld0ZuKS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXIocHJvbWlzZSwgY2IpIHtcbiAgICByZXR1cm4gcHJvbWlzZS50aGVuKGNiLCBjYik7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplKGFzeW5jRnVuY3Rpb24pIHtcbiAgICBsZXQgbGFzdFJ1biA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGZ1bmN0aW9uIHdyYXBwZXIoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbGFzdFJ1biA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgICAgICAgYWZ0ZXIobGFzdFJ1biwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFzeW5jRnVuY3Rpb24uYXBwbHkodGhpcywgYXJncykudGhlbihyZXMsIHJlaik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHdyYXBwZXIuYWZ0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBsYXN0UnVuID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7IGFmdGVyKGxhc3RSdW4sIHJlcyk7IH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHdyYXBwZXI7XG59XG4iLCJpbXBvcnQge01lbnUsIEFwcCwgTWVudUl0ZW0sIGRlYm91bmNlLCBLZXltYXAsIFNjb3BlfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7YXJvdW5kfSBmcm9tIFwibW9ua2V5LWFyb3VuZFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xuICAgIGludGVyZmFjZSBDb21wb25lbnQge1xuICAgICAgICBfbG9hZGVkOiBib29sZWFuXG4gICAgfVxuICAgIGludGVyZmFjZSBNZW51IHtcbiAgICAgICAgYXBwOiBBcHBcbiAgICAgICAgZG9tOiBIVE1MRGl2RWxlbWVudFxuICAgICAgICBzY29wZTogU2NvcGVcbiAgICAgICAgaXRlbXM6IE1lbnVJdGVtW11cblxuICAgICAgICBzZWxlY3QobjogbnVtYmVyKTogdm9pZFxuICAgICAgICBzZWxlY3RlZDogbnVtYmVyXG4gICAgICAgIG9uQXJyb3dEb3duKGU6IEtleWJvYXJkRXZlbnQpOiBmYWxzZVxuICAgICAgICBvbkFycm93VXAoZTogS2V5Ym9hcmRFdmVudCk6IGZhbHNlXG5cbiAgICAgICAgc29ydD8oKTogdm9pZFxuICAgIH1cblxuICAgIGV4cG9ydCBuYW1lc3BhY2UgS2V5bWFwIHtcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGdldE1vZGlmaWVycyhldmVudDogRXZlbnQpOiBzdHJpbmdcbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgTWVudUl0ZW0ge1xuICAgICAgICBkb206IEhUTUxEaXZFbGVtZW50XG4gICAgICAgIHRpdGxlRWw6IEhUTUxEaXZFbGVtZW50XG4gICAgICAgIGhhbmRsZUV2ZW50KGV2ZW50OiBFdmVudCk6IHZvaWRcbiAgICAgICAgZGlzYWJsZWQ6IGJvb2xlYW5cbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIE1lbnVQYXJlbnQgPSBBcHAgfCBQb3B1cE1lbnU7XG5cbmV4cG9ydCBjbGFzcyBQb3B1cE1lbnUgZXh0ZW5kcyBNZW51IHtcbiAgICAvKiogVGhlIGNoaWxkIG1lbnUgcG9wcGVkIHVwIG92ZXIgdGhpcyBvbmUgKi9cbiAgICBjaGlsZDogTWVudVxuXG4gICAgbWF0Y2g6IHN0cmluZyA9IFwiXCJcbiAgICByZXNldFNlYXJjaE9uVGltZW91dCA9IGRlYm91bmNlKCgpID0+IHt0aGlzLm1hdGNoID0gXCJcIjt9LCAxNTAwLCB0cnVlKVxuICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZVxuICAgIGZpcnN0TW92ZTogYm9vbGVhbiA9IGZhbHNlXG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFyZW50OiBNZW51UGFyZW50LCBwdWJsaWMgYXBwOiBBcHAgPSBwYXJlbnQgaW5zdGFuY2VvZiBBcHAgPyBwYXJlbnQgOiBwYXJlbnQuYXBwKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIGlmIChwYXJlbnQgaW5zdGFuY2VvZiBQb3B1cE1lbnUpIHBhcmVudC5zZXRDaGlsZE1lbnUodGhpcyk7XG5cbiAgICAgICAgdGhpcy5zY29wZSA9IG5ldyBTY29wZTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJBcnJvd1VwXCIsICAgdGhpcy5vbkFycm93VXAuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiQXJyb3dEb3duXCIsIHRoaXMub25BcnJvd0Rvd24uYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiRW50ZXJcIiwgICAgIHRoaXMub25FbnRlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJFc2NhcGVcIiwgICAgdGhpcy5vbkVzY2FwZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJBcnJvd0xlZnRcIiwgdGhpcy5vbkFycm93TGVmdC5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkhvbWVcIiwgdGhpcy5vbkhvbWUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW10sIFwiRW5kXCIsICB0aGlzLm9uRW5kLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93UmlnaHRcIiwgdGhpcy5vbkFycm93UmlnaHQuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgLy8gTWFrZSBvYnNpZGlhbi5NZW51IHRoaW5rIG1vdXNlZG93bnMgb24gb3VyIGNoaWxkIG1lbnUocykgYXJlIGhhcHBlbmluZ1xuICAgICAgICAvLyBvbiB1cywgc28gd2Ugd29uJ3QgY2xvc2UgYmVmb3JlIGFuIGFjdHVhbCBjbGljayBvY2N1cnNcbiAgICAgICAgY29uc3QgbWVudSA9IHRoaXM7XG4gICAgICAgIGFyb3VuZCh0aGlzLmRvbSwge2NvbnRhaW5zKHByZXYpeyByZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBOb2RlKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBwcmV2LmNhbGwodGhpcywgdGFyZ2V0KSB8fCBtZW51LmNoaWxkPy5kb20uY29udGFpbnModGFyZ2V0KTtcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH19fSk7XG4gICAgICAgIHRoaXMuZG9tLmFkZENsYXNzKFwicWUtcG9wdXAtbWVudVwiKTtcbiAgICB9XG5cbiAgICBvbkVzY2FwZSgpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbmxvYWQoKSB7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIobnVsbCwgbnVsbCwgdGhpcy5vbktleURvd24uYmluZCh0aGlzKSk7XG4gICAgICAgIHN1cGVyLm9ubG9hZCgpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnNob3dTZWxlY3RlZCgpO1xuICAgICAgICB0aGlzLmZpcnN0TW92ZSA9IHRydWU7XG4gICAgICAgIC8vIFdlIHdhaXQgdW50aWwgbm93IHRvIHJlZ2lzdGVyIHNvIHRoYXQgYW55IGluaXRpYWwgbW91c2VvdmVyIG9mIHRoZSBvbGQgbW91c2UgcG9zaXRpb24gd2lsbCBiZSBza2lwcGVkXG4gICAgICAgIHRoaXMucmVnaXN0ZXIob25FbGVtZW50KHRoaXMuZG9tLCBcIm1vdXNlb3ZlclwiLCBcIi5tZW51LWl0ZW1cIiwgKGV2ZW50OiBNb3VzZUV2ZW50LCB0YXJnZXQ6IEhUTUxEaXZFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZmlyc3RNb3ZlICYmICF0YXJnZXQuaGFzQ2xhc3MoXCJpcy1kaXNhYmxlZFwiKSAmJiAhdGhpcy5jaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0KHRoaXMuaXRlbXMuZmluZEluZGV4KGkgPT4gaS5kb20gPT09IHRhcmdldCksIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmlyc3RNb3ZlID0gZmFsc2U7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBvbnVubG9hZCgpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHN1cGVyLm9udW5sb2FkKCk7XG4gICAgfVxuXG4gICAgLy8gT3ZlcnJpZGUgdG8gYXZvaWQgaGF2aW5nIGEgbW91c2VvdmVyIGV2ZW50IGhhbmRsZXJcbiAgICBhZGRJdGVtKGNiOiAoaTogTWVudUl0ZW0pID0+IGFueSkge1xuICAgICAgICBjb25zdCBpID0gbmV3IE1lbnVJdGVtKHRoaXMpO1xuICAgICAgICB0aGlzLml0ZW1zLnB1c2goaSk7XG4gICAgICAgIGNiKGkpO1xuICAgICAgICBpZiAodGhpcy5fbG9hZGVkICYmIHRoaXMuc29ydCkgdGhpcy5zb3J0KCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBjb25zdCBtb2QgPSBLZXltYXAuZ2V0TW9kaWZpZXJzKGV2ZW50KTtcbiAgICAgICAgaWYgKGV2ZW50LmtleS5sZW5ndGggPT09IDEgJiYgIWV2ZW50LmlzQ29tcG9zaW5nICYmICghbW9kIHx8IG1vZCA9PT0gXCJTaGlmdFwiKSApIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHRoaXMubWF0Y2ggKyBldmVudC5rZXk7XG4gICAgICAgICAgICAvLyBUaHJvdyBhd2F5IHBpZWNlcyBvZiB0aGUgbWF0Y2ggdW50aWwgc29tZXRoaW5nIG1hdGNoZXMgb3Igbm90aGluZydzIGxlZnRcbiAgICAgICAgICAgIHdoaWxlIChtYXRjaCAmJiAhdGhpcy5zZWFyY2hGb3IobWF0Y2gpKSBtYXRjaCA9IG1hdGNoLnN1YnN0cigxKTtcbiAgICAgICAgICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTZWFyY2hPblRpbWVvdXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7ICAgLy8gYmxvY2sgYWxsIGtleXMgb3RoZXIgdGhhbiBvdXJzXG4gICAgfVxuXG4gICAgc2VhcmNoRm9yKG1hdGNoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBtYXRjaC5zcGxpdChcIlwiKS5tYXAoZXNjYXBlUmVnZXgpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5maW5kKG5ldyBSZWdFeHAoXCJeXCIrIHBhcnRzLmpvaW4oXCJcIiksIFwidWlcIikpIHx8XG4gICAgICAgICAgICB0aGlzLmZpbmQobmV3IFJlZ0V4cChcIl5cIisgcGFydHMuam9pbihcIi4qXCIpLCBcInVpXCIpKSB8fFxuICAgICAgICAgICAgdGhpcy5maW5kKG5ldyBSZWdFeHAocGFydHMuam9pbihcIi4qXCIpLCBcInVpXCIpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZpbmQocGF0dGVybjogUmVnRXhwKSB7XG4gICAgICAgIGxldCBwb3MgPSBNYXRoLm1pbigwLCB0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgZm9yIChsZXQgaT10aGlzLml0ZW1zLmxlbmd0aDsgaTsgKytwb3MsIGktLSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbXNbcG9zXT8uZGlzYWJsZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbXNbcG9zXT8uZG9tLnRleHRDb250ZW50Lm1hdGNoKHBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QocG9zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBvbkVudGVyKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW3RoaXMuc2VsZWN0ZWRdO1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgaXRlbS5oYW5kbGVFdmVudChldmVudCk7XG4gICAgICAgICAgICAvLyBPbmx5IGhpZGUgaWYgd2UgZG9uJ3QgaGF2ZSBhIHN1Ym1lbnVcbiAgICAgICAgICAgIGlmICghdGhpcy5jaGlsZCkgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHNlbGVjdChuOiBudW1iZXIsIHNjcm9sbCA9IHRydWUpIHtcbiAgICAgICAgdGhpcy5tYXRjaCA9IFwiXCIgLy8gcmVzZXQgc2VhcmNoIG9uIG1vdmVcbiAgICAgICAgc3VwZXIuc2VsZWN0KG4pO1xuICAgICAgICBpZiAoc2Nyb2xsKSB0aGlzLnNob3dTZWxlY3RlZCgpO1xuICAgIH1cblxuICAgIHNob3dTZWxlY3RlZCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzLml0ZW1zW3RoaXMuc2VsZWN0ZWRdPy5kb207XG4gICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgY29uc3QgbWUgPSB0aGlzLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbXkgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmIChteS50b3AgPCBtZS50b3AgfHwgbXkuYm90dG9tID4gbWUuYm90dG9tKSBlbC5zY3JvbGxJbnRvVmlldygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5zZWxlY3QoKSB7XG4gICAgICAgIHRoaXMuaXRlbXNbdGhpcy5zZWxlY3RlZF0/LmRvbS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgIH1cblxuICAgIG9uRW5kKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgdGhpcy51bnNlbGVjdCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgICAgIHRoaXMub25BcnJvd1VwKGUpO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCA9PT0gdGhpcy5pdGVtcy5sZW5ndGgpIHRoaXMuc2VsZWN0ZWQgPSAtMTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uSG9tZShlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMudW5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IC0xO1xuICAgICAgICB0aGlzLm9uQXJyb3dEb3duKGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgb25BcnJvd0xlZnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnJvb3RNZW51KCkgIT09IHRoaXMpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkFycm93UmlnaHQoKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIG5vLW9wIGluIGJhc2UgY2xhc3NcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuc2V0Q2hpbGRNZW51KCk7ICAvLyBoaWRlIGNoaWxkIG1lbnUocykgZmlyc3RcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZE1lbnUobWVudT86IE1lbnUpIHtcbiAgICAgICAgdGhpcy5jaGlsZD8uaGlkZSgpO1xuICAgICAgICB0aGlzLmNoaWxkID0gbWVudTtcbiAgICB9XG5cbiAgICByb290TWVudSgpOiBQb3B1cE1lbnUge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBBcHAgPyB0aGlzIDogdGhpcy5wYXJlbnQucm9vdE1lbnUoKTtcbiAgICB9XG5cbiAgICBjYXNjYWRlKHRhcmdldDogSFRNTEVsZW1lbnQsIGV2ZW50PzogTW91c2VFdmVudCwgb25DbG9zZT86ICgpID0+IGFueSwgaE92ZXJsYXAgPSAxNSwgdk92ZXJsYXAgPSA1KSB7XG4gICAgICAgIGNvbnN0IHtsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIHdpZHRofSA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IGxlZnQrTWF0aC5taW4oMTUwLCB3aWR0aC8zKSwgY2VudGVyWSA9ICh0b3ArYm90dG9tKS8yO1xuICAgICAgICBjb25zdCB3aW4gPSB3aW5kb3cuYWN0aXZlV2luZG93ID8/IHdpbmRvdywge2lubmVySGVpZ2h0LCBpbm5lcldpZHRofSA9IHdpbjtcblxuICAgICAgICAvLyBUcnkgdG8gY2FzY2FkZSBkb3duIGFuZCB0byB0aGUgcmlnaHQgZnJvbSB0aGUgbW91c2Ugb3IgaG9yaXpvbnRhbCBjZW50ZXJcbiAgICAgICAgLy8gb2YgdGhlIGNsaWNrZWQgaXRlbVxuICAgICAgICBjb25zdCBwb2ludCA9IHt4OiBldmVudCA/IGV2ZW50LmNsaWVudFggIC0gaE92ZXJsYXAgOiBjZW50ZXJYICwgeTogYm90dG9tIC0gdk92ZXJsYXB9O1xuXG4gICAgICAgIC8vIE1lYXN1cmUgdGhlIG1lbnUgYW5kIHNlZSBpZiBpdCBmaXRzXG4gICAgICAgIHdpbi5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcbiAgICAgICAgY29uc3Qge29mZnNldFdpZHRoLCBvZmZzZXRIZWlnaHR9ID0gdGhpcy5kb207XG4gICAgICAgIGNvbnN0IGZpdHNCZWxvdyA9IHBvaW50LnkgKyBvZmZzZXRIZWlnaHQgPCBpbm5lckhlaWdodDtcbiAgICAgICAgY29uc3QgZml0c1JpZ2h0ID0gcG9pbnQueCArIG9mZnNldFdpZHRoIDw9IGlubmVyV2lkdGg7XG5cbiAgICAgICAgLy8gSWYgaXQgZG9lc24ndCBmaXQgdW5kZXJuZWF0aCB1cywgcG9zaXRpb24gaXQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuLCB1bmxlc3NcbiAgICAgICAgLy8gdGhlIGNsaWNrZWQgaXRlbSBpcyBjbG9zZSB0byB0aGUgYm90dG9tIChpbiB3aGljaCBjYXNlLCBwb3NpdGlvbiBpdCBhYm92ZSBzb1xuICAgICAgICAvLyB0aGUgaXRlbSB3aWxsIHN0aWxsIGJlIHZpc2libGUuKVxuICAgICAgICBpZiAoIWZpdHNCZWxvdykge1xuICAgICAgICAgICAgcG9pbnQueSA9IChib3R0b20gPiBpbm5lckhlaWdodCAtIChib3R0b20tdG9wKSkgPyB0b3AgKyB2T3ZlcmxhcDogaW5uZXJIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBpdCBkb2Vzbid0IGZpdCB0byB0aGUgcmlnaHQsIHRoZW4gcG9zaXRpb24gaXQgYXQgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIHNjcmVlbixcbiAgICAgICAgLy8gc28gbG9uZyBhcyBpdCBmaXRzIGVudGlyZWx5IGFib3ZlIG9yIGJlbG93IHVzLiAgT3RoZXJ3aXNlLCBwb3NpdGlvbiBpdCB1c2luZyB0aGVcbiAgICAgICAgLy8gaXRlbSBjZW50ZXIsIHNvIGF0IGxlYXN0IG9uZSBzaWRlIG9mIHRoZSBwcmV2aW91cyBtZW51L2l0ZW0gd2lsbCBzdGlsbCBiZSBzZWVuLlxuICAgICAgICBpZiAoIWZpdHNSaWdodCkge1xuICAgICAgICAgICAgcG9pbnQueCA9IChvZmZzZXRIZWlnaHQgPCAoYm90dG9tIC0gdk92ZXJsYXApIHx8IGZpdHNCZWxvdykgPyBpbm5lcldpZHRoIDogY2VudGVyWDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvbmUhICBTaG93IG91ciB3b3JrLlxuICAgICAgICB0aGlzLnNob3dBdFBvc2l0aW9uKHBvaW50KTtcblxuICAgICAgICAvLyBGbGFnIHRoZSBjbGlja2VkIGl0ZW0gYXMgYWN0aXZlLCB1bnRpbCB3ZSBjbG9zZVxuICAgICAgICB0YXJnZXQudG9nZ2xlQ2xhc3MoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBBcHApIHRhcmdldC50b2dnbGVDbGFzcyhcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgUG9wdXBNZW51KSB0aGlzLnBhcmVudC5zZXRDaGlsZE1lbnUoKTtcbiAgICAgICAgICAgIGlmIChvbkNsb3NlKSBvbkNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZykge1xuICAgIHJldHVybiBzLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7XG59XG5cbmZ1bmN0aW9uIG9uRWxlbWVudDxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRFdmVudE1hcD4oXG4gICAgZWw6IEhUTUxFbGVtZW50LCB0eXBlOiBLLCBzZWxlY3RvcjpzdHJpbmcsXG4gICAgbGlzdGVuZXI6ICh0aGlzOiBIVE1MRWxlbWVudCwgZXY6IEhUTUxFbGVtZW50RXZlbnRNYXBbS10sIGRlbGVnYXRlVGFyZ2V0OiBIVE1MRWxlbWVudCkgPT4gYW55LFxuICAgIG9wdGlvbnM6IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyA9IGZhbHNlXG4pIHtcbiAgICBlbC5vbih0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIG9wdGlvbnMpXG4gICAgcmV0dXJuICgpID0+IGVsLm9mZih0eXBlLCBzZWxlY3RvciwgbGlzdGVuZXIsIG9wdGlvbnMpO1xufSIsImltcG9ydCB7IEtleW1hcCwgTW9kYWwsIE5vdGljZSwgVEFic3RyYWN0RmlsZSwgVEZpbGUsIFRGb2xkZXIsIFZpZXcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFBvcHVwTWVudSwgTWVudVBhcmVudCB9IGZyb20gXCIuL21lbnVzXCI7XG5pbXBvcnQge2kxOG59IGZyb20gXCJpMThuZXh0XCI7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBjb25zdCBpMThuZXh0OiBpMThuXG59XG5cbmRlY2xhcmUgbW9kdWxlIFwib2JzaWRpYW5cIiB7XG4gICAgaW50ZXJmYWNlIEFwcCB7XG4gICAgICAgIHNldEF0dGFjaG1lbnRGb2xkZXIoZm9sZGVyOiBURm9sZGVyKTogdm9pZFxuICAgICAgICBpbnRlcm5hbFBsdWdpbnM6IHtcbiAgICAgICAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgICAgICAgICBcImZpbGUtZXhwbG9yZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBib29sZWFuXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXZlYWxJbkZvbGRlcihmaWxlOiBUQWJzdHJhY3RGaWxlKTogdm9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUZpbGVNb2RhbDogTW9kYWwgJiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q3VycmVudEZpbGUoZmlsZTogVEFic3RyYWN0RmlsZSk6IHZvaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpbnRlcmZhY2UgRmlsZU1hbmFnZXIge1xuICAgICAgICBwcm9tcHRGb3JGb2xkZXJEZWxldGlvbihmb2xkZXI6IFRGb2xkZXIpOiB2b2lkXG4gICAgICAgIHByb21wdEZvckZpbGVEZWxldGlvbihmaWxlOiBURmlsZSk6IHZvaWRcbiAgICAgICAgcHJvbXB0Rm9yRmlsZVJlbmFtZShmaWxlOiBUQWJzdHJhY3RGaWxlKTogdm9pZFxuICAgICAgICBjcmVhdGVOZXdNYXJrZG93bkZpbGUocGFyZW50Rm9sZGVyPzogVEZvbGRlciwgcGF0dGVybj86IHN0cmluZyk6IFByb21pc2U8VEZpbGU+XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgRmlsZUV4cGxvcmVyVmlldyBleHRlbmRzIFZpZXcge1xuICAgIGNyZWF0ZUFic3RyYWN0RmlsZShraW5kOiBcImZpbGVcIiB8IFwiZm9sZGVyXCIsIHBhcmVudDogVEZvbGRlciwgbmV3TGVhZj86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+XG4gICAgc3RhcnRSZW5hbWVGaWxlKGZpbGU6IFRBYnN0cmFjdEZpbGUpOiBQcm9taXNlPHZvaWQ+XG59XG5cbmZ1bmN0aW9uIG9wdE5hbWUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGkxOG5leHQudChgcGx1Z2lucy5maWxlLWV4cGxvcmVyLm1lbnUtb3B0LSR7bmFtZX1gKTtcbn1cblxuZXhwb3J0IGNsYXNzIENvbnRleHRNZW51IGV4dGVuZHMgUG9wdXBNZW51IHtcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IE1lbnVQYXJlbnQsIGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgc3VwZXIocGFyZW50KTtcbiAgICAgICAgY29uc3QgeyB3b3Jrc3BhY2UgfSA9IHRoaXMuYXBwO1xuICAgICAgICBjb25zdCBoYXZlRmlsZUV4cGxvcmVyID0gdGhpcy5hcHAuaW50ZXJuYWxQbHVnaW5zLnBsdWdpbnNbXCJmaWxlLWV4cGxvcmVyXCJdLmVuYWJsZWQ7XG5cbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEl0ZW0oaSA9PiBpLnNldFRpdGxlKG9wdE5hbWUoXCJuZXctbm90ZVwiKSkuc2V0SWNvbihcImNyZWF0ZS1uZXdcIikub25DbGljayhhc3luYyBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3RNZW51KCkuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0ZpbGUgPSBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5jcmVhdGVOZXdNYXJrZG93bkZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0ZpbGUpIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKEtleW1hcC5pc01vZGlmaWVyKGUsIFwiTW9kXCIpKS5vcGVuRmlsZShuZXdGaWxlLCB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogITAsIHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSwgZVN0YXRlOiB7IHJlbmFtZTogXCJhbGxcIiB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpID0+IGkuc2V0VGl0bGUob3B0TmFtZShcIm5ldy1mb2xkZXJcIikpLnNldEljb24oXCJmb2xkZXJcIikuc2V0RGlzYWJsZWQoIWhhdmVGaWxlRXhwbG9yZXIpLm9uQ2xpY2soZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChoYXZlRmlsZUV4cGxvcmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdE1lbnUoKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2l0aEV4cGxvcmVyKGZpbGUpPy5jcmVhdGVBYnN0cmFjdEZpbGUoXCJmb2xkZXJcIiwgZmlsZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlRoZSBGaWxlIEV4cGxvcmVyIGNvcmUgcGx1Z2luIG11c3QgYmUgZW5hYmxlZCB0byBjcmVhdGUgbmV3IGZvbGRlcnNcIilcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRUaXRsZShvcHROYW1lKFwic2V0LWF0dGFjaG1lbnQtZm9sZGVyXCIpKS5zZXRJY29uKFwiaW1hZ2UtZmlsZVwiKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5zZXRBdHRhY2htZW50Rm9sZGVyKGZpbGUpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5hZGRTZXBhcmF0b3IoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZEl0ZW0oaSA9PiB7XG4gICAgICAgICAgICBpLnNldFRpdGxlKG9wdE5hbWUoXCJyZW5hbWVcIikpLnNldEljb24oXCJwZW5jaWxcIikub25DbGljayhldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvbXB0Rm9yRmlsZVJlbmFtZShmaWxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRUaXRsZShvcHROYW1lKFwiZGVsZXRlXCIpKS5zZXRJY29uKFwidHJhc2hcIikub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9tcHRGb3JGb2xkZXJEZWxldGlvbihmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb21wdEZvckZpbGVEZWxldGlvbihmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIgJiYgaGF2ZUZpbGVFeHBsb3Jlcikge1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGkgPT4gaS5zZXRJY29uKFwiZm9sZGVyXCIpLnNldFRpdGxlKGkxOG5leHQudCgncGx1Z2lucy5maWxlLWV4cGxvcmVyLmFjdGlvbi1yZXZlYWwtZmlsZScpKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3RNZW51KCkuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMud2l0aEV4cGxvcmVyKGZpbGUpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWxlID09PSB3b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSB7XG4gICAgICAgICAgICB3b3Jrc3BhY2UudHJpZ2dlcihcImZpbGUtbWVudVwiLCB0aGlzLCBmaWxlLCBcInF1aWNrLWV4cGxvcmVyXCIsIHdvcmtzcGFjZS5hY3RpdmVMZWFmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdvcmtzcGFjZS50cmlnZ2VyKFwiZmlsZS1tZW51XCIsIHRoaXMsIGZpbGUsIFwicXVpY2stZXhwbG9yZXJcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkVudGVyKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMucm9vdE1lbnUoKS5oaWRlKCk7XG4gICAgICAgIHJldHVybiBzdXBlci5vbkVudGVyKGV2ZW50KTtcbiAgICB9XG5cbiAgICB3aXRoRXhwbG9yZXIoZmlsZTogVEFic3RyYWN0RmlsZSkge1xuICAgICAgICBjb25zdCBleHBsb3JlciA9IHRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5wbHVnaW5zW1wiZmlsZS1leHBsb3JlclwiXTtcbiAgICAgICAgaWYgKGV4cGxvcmVyLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGV4cGxvcmVyLmluc3RhbmNlLnJldmVhbEluRm9sZGVyKGZpbGUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoXCJmaWxlLWV4cGxvcmVyXCIpWzBdLnZpZXcgYXMgRmlsZUV4cGxvcmVyVmlld1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgYXJvdW5kIH0gZnJvbSBcIm1vbmtleS1hcm91bmRcIjtcbmltcG9ydCB7IENvbXBvbmVudCwgUGx1Z2luLCBWaWV3LCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKlxuICogQ29tcG9uZW50IHRoYXQgYmVsb25ncyB0byBhIHBsdWdpbiArIHdpbmRvdy4gZS5nLjpcbiAqXG4gKiAgICAgY2xhc3MgVGl0bGVXaWRnZXQgZXh0ZW5kcyBQZXJXaW5kb3dDb21wb25lbnQ8TXlQbHVnaW4+IHtcbiAqICAgICAgICAgb25sb2FkKCkge1xuICogICAgICAgICAgICAgLy8gZG8gc3R1ZmYgd2l0aCB0aGlzLnBsdWdpbiBhbmQgdGhpcy53aW4gLi4uXG4gKiAgICAgICAgIH1cbiAqICAgICB9XG4gKlxuICogICAgIGNsYXNzIE15UGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAqICAgICAgICAgdGl0bGVXaWRnZXRzID0gVGl0bGVXaWRnZXQucGVyV2luZG93KHRoaXMpO1xuICogICAgICAgICAuLi5cbiAqICAgICB9XG4gKlxuICogVGhpcyB3aWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlIGEgdGl0bGUgd2lkZ2V0IGZvciBlYWNoIHdpbmRvdyBhcyBpdCdzIG9wZW5lZCwgYW5kXG4gKiBvbiBwbHVnaW4gbG9hZC4gIFRoZSBwbHVnaW4ncyBgLnRpdGxlV2lkZ2V0c2Agd2lsbCBhbHNvIGJlIGEgV2luZG93TWFuYWdlciB0aGF0IGNhblxuICogbG9vayB1cCB0aGUgdGl0bGUgd2lkZ2V0IGZvciBhIGdpdmVuIHdpbmRvdywgbGVhZiwgb3Igdmlldywgb3IgcmV0dXJuIGEgbGlzdCBvZlxuICogYWxsIG9mIHRoZW0uICBTZWUgV2luZG93TWFuYWdlciBmb3IgdGhlIGZ1bGwgQVBJLlxuICpcbiAqIElmIHlvdSB3YW50IHlvdXIgY29tcG9uZW50cyB0byBiZSBjcmVhdGVkIG9uIGRlbWFuZCBpbnN0ZWFkIG9mIGF1dG9tYXRpY2FsbHkgd2hlblxuICogd2luZG93KHMpIGFyZSBvcGVuZWQsIHlvdSBjYW4gcGFzcyBgZmFsc2VgIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gYHBlcldpbmRvdygpYC5cbiAqL1xuZXhwb3J0IGNsYXNzIFBlcldpbmRvd0NvbXBvbmVudDxQIGV4dGVuZHMgUGx1Z2luPiBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcGx1Z2luOiBQLCBwdWJsaWMgd2luOiBXaW5kb3cpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcGVyV2luZG93PFQgZXh0ZW5kcyBQZXJXaW5kb3dDb21wb25lbnQ8UD4sIFAgZXh0ZW5kcyBQbHVnaW4+KFxuICAgICAgICB0aGlzOiBuZXcgKHBsdWdpbjogUCwgd2luOiBXaW5kb3cpID0+IFQsXG4gICAgICAgIHBsdWdpbjogUCxcbiAgICAgICAgYXV0b2NyZWF0ZSA9IHRydWVcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXaW5kb3dNYW5hZ2VyKHBsdWdpbiwgdGhpcywgYXV0b2NyZWF0ZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIE1hbmFnZSBwZXItd2luZG93IGNvbXBvbmVudHNcbiAqL1xuZXhwb3J0IGNsYXNzIFdpbmRvd01hbmFnZXI8VCBleHRlbmRzIFBlcldpbmRvd0NvbXBvbmVudDxQPiwgUCBleHRlbmRzIFBsdWdpbj4gZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGluc3RhbmNlcyA9IG5ldyBXZWFrTWFwPFdpbmRvdywgVD4oKTtcblxuICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgcHVibGljIHBsdWdpbjogUCxcbiAgICAgICAgcHVibGljIGZhY3Rvcnk6IG5ldyAocGx1Z2luOiBQLCB3aW46IFdpbmRvdykgPT4gVCwgIC8vIFRoZSBjbGFzcyBvZiB0aGluZyB0byBtYW5hZ2VcbiAgICAgICAgcHVibGljIGF1dG9jcmVhdGUgPSB0cnVlICAvLyBjcmVhdGUgYWxsIGl0ZW1zIGF0IHN0YXJ0IGFuZCBtb25pdG9yIG5ldyB3aW5kb3cgY3JlYXRpb25cbiAgICApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgcGx1Z2luLmFkZENoaWxkKHRoaXMpO1xuICAgIH1cblxuICAgIG9ubG9hZCgpIHtcbiAgICAgICAgY29uc3Qge3dvcmtzcGFjZX0gPSB0aGlzLnBsdWdpbi5hcHA7XG4gICAgICAgIGlmICh0aGlzLmF1dG9jcmVhdGUpIHdvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgLy8gTW9uaXRvciBuZXcgd2luZG93IGNyZWF0aW9uXG4gICAgICAgICAgICBpZiAod29ya3NwYWNlLm9wZW5Qb3BvdXQpIHRoaXMucmVnaXN0ZXIoYXJvdW5kKHdvcmtzcGFjZSwge1xuICAgICAgICAgICAgICAgIG9wZW5Qb3BvdXQob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG9sZCEuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBib3RoIHN5bmMgYW5kIGFzeW5jIHZlcnNpb25zIG9mIG9wZW5Qb3BvdXQ7IHN5bmMgdmVyc2lvbiBuZWVkcyBhXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtaWNyb3Rhc2sgZGVsYXkgaW4gYW55IGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZShyZXN1bHQpLnRoZW4oKHBvcG91dFNwbGl0KSA9PiBzZWxmLmZvcldpbmRvdyhwb3BvdXRTcGxpdC53aW4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLmZvckFsbCgpOyAgLy8gQXV0b2NyZWF0ZSBhbGwgaW5zdGFuY2VzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvcldpbmRvdygpOiBUO1xuICAgIGZvcldpbmRvdyh3aW46IFdpbmRvdyk6IFQ7XG4gICAgZm9yV2luZG93KHdpbjogV2luZG93LCBjcmVhdGU6IHRydWUpOiBUO1xuICAgIGZvcldpbmRvdyh3aW46IFdpbmRvdywgY3JlYXRlOiBib29sZWFuKTogVCB8IHVuZGVmaW5lZDtcblxuICAgIGZvcldpbmRvdyh3aW46IFdpbmRvdyA9IHdpbmRvdy5hY3RpdmVXaW5kb3cgPz8gd2luZG93LCBjcmVhdGUgPSB0cnVlKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBpbnN0ID0gdGhpcy5pbnN0YW5jZXMuZ2V0KHdpbik7XG4gICAgICAgIGlmICghaW5zdCAmJiBjcmVhdGUpIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgdGhpcy5mYWN0b3J5KHRoaXMucGx1Z2luLCB3aW4pO1xuICAgICAgICAgICAgaWYgKGluc3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc3RhbmNlcy5zZXQod2luLCBpbnN0ISk7XG4gICAgICAgICAgICAgICAgaW5zdC5yZWdpc3RlckRvbUV2ZW50KHdpbiwgXCJiZWZvcmV1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKGluc3QhKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXMuZGVsZXRlKHdpbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChpbnN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdCB8fCB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZm9yRG9tKGVsOiBOb2RlKTogVDtcbiAgICBmb3JEb20oZWw6IE5vZGUsIGNyZWF0ZTogdHJ1ZSk6IFQ7XG4gICAgZm9yRG9tKGVsOiBOb2RlLCBjcmVhdGU6IGJvb2xlYW4pOiBUIHwgdW5kZWZpbmVkO1xuXG4gICAgZm9yRG9tKGVsOiBOb2RlLCBjcmVhdGUgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcldpbmRvdyh3aW5kb3dGb3JEb20oZWwpLCBjcmVhdGUpO1xuICAgIH1cblxuICAgIGZvckxlYWYobGVhZjogV29ya3NwYWNlTGVhZik6IFQ7XG4gICAgZm9yTGVhZihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBjcmVhdGU6IHRydWUpOiBUO1xuICAgIGZvckxlYWYobGVhZjogV29ya3NwYWNlTGVhZiwgY3JlYXRlOiBib29sZWFuKTogVCB8IHVuZGVmaW5lZDtcblxuICAgIGZvckxlYWYobGVhZjogV29ya3NwYWNlTGVhZiwgY3JlYXRlID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JEb20obGVhZi5jb250YWluZXJFbCwgY3JlYXRlKTtcbiAgICB9XG5cbiAgICBmb3JWaWV3KHZpZXc6IFZpZXcpOiBUO1xuICAgIGZvclZpZXcodmlldzogVmlldywgY3JlYXRlOiB0cnVlKTogVDtcbiAgICBmb3JWaWV3KHZpZXc6IFZpZXcsIGNyZWF0ZTogYm9vbGVhbik6IFQgfCB1bmRlZmluZWQ7XG5cbiAgICBmb3JWaWV3KHZpZXc6IFZpZXcsIGNyZWF0ZSA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9yRG9tKHZpZXcuY29udGFpbmVyRWwsIGNyZWF0ZSk7XG4gICAgfVxuXG4gICAgd2luZG93cygpIHtcbiAgICAgICAgY29uc3Qgd2luZG93czogV2luZG93W10gPSBbd2luZG93XSwge2Zsb2F0aW5nU3BsaXR9ID0gdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZTtcbiAgICAgICAgaWYgKGZsb2F0aW5nU3BsaXQpIHtcbiAgICAgICAgICAgIGZvcihjb25zdCBzcGxpdCBvZiBmbG9hdGluZ1NwbGl0LmNoaWxkcmVuKSBpZiAoc3BsaXQud2luKSB3aW5kb3dzLnB1c2goc3BsaXQud2luKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd2luZG93cztcbiAgICB9XG5cbiAgICBmb3JBbGwoY3JlYXRlID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy53aW5kb3dzKCkubWFwKHdpbiA9PiB0aGlzLmZvcldpbmRvdyh3aW4sIGNyZWF0ZSkpLmZpbHRlcih0ID0+IHQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvd0ZvckRvbShlbDogTm9kZSkge1xuICAgIHJldHVybiAoZWwub3duZXJEb2N1bWVudCB8fCA8RG9jdW1lbnQ+ZWwpLmRlZmF1bHRWaWV3ITtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIC8vIEJhY2t3YXJkIGNvbXBhdGliaWxpdHkgZm9yIHNpbmdsZS13aW5kb3cgT2JzaWRpYW4gKDwwLjE1KVxuICAgIGludGVyZmFjZSBXaW5kb3cge1xuICAgICAgICBhY3RpdmVXaW5kb3c/OiBXaW5kb3dcbiAgICB9XG59XG5cbmRlY2xhcmUgbW9kdWxlIFwib2JzaWRpYW5cIiB7XG4gICAgaW50ZXJmYWNlIFdvcmtzcGFjZSB7XG4gICAgICAgIGZsb2F0aW5nU3BsaXQ/OiB7IGNoaWxkcmVuOiB7d2luPzogV2luZG93fVtdIH07XG4gICAgICAgIG9wZW5Qb3BvdXQ/KCk6IFdvcmtzcGFjZVNwbGl0O1xuICAgICAgICBvcGVuUG9wb3V0TGVhZj8oKTogV29ya3NwYWNlTGVhZjtcbiAgICB9XG4gICAgaW50ZXJmYWNlIFdvcmtzcGFjZUxlYWYge1xuICAgICAgICBjb250YWluZXJFbDogSFRNTEVsZW1lbnQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVEFic3RyYWN0RmlsZSwgVEZpbGUsIFRGb2xkZXIsIEtleW1hcCwgTm90aWNlLCBIb3ZlclBhcmVudCwgZGVib3VuY2UsIFdvcmtzcGFjZVNwbGl0LCBIb3ZlclBvcG92ZXIsIEZpbGVWaWV3LCBNYXJrZG93blZpZXcsIENvbXBvbmVudCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgaG92ZXJTb3VyY2UsIHN0YXJ0RHJhZyB9IGZyb20gXCIuL0V4cGxvcmVyXCI7XG5pbXBvcnQgeyBQb3B1cE1lbnUsIE1lbnVQYXJlbnQgfSBmcm9tIFwiLi9tZW51c1wiO1xuaW1wb3J0IHsgQ29udGV4dE1lbnUgfSBmcm9tIFwiLi9Db250ZXh0TWVudVwiO1xuaW1wb3J0IHsgYXJvdW5kIH0gZnJvbSBcIm1vbmtleS1hcm91bmRcIjtcbmltcG9ydCB7IHdpbmRvd0ZvckRvbSB9IGZyb20gXCIuL1BlcldpbmRvd0NvbXBvbmVudFwiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xuICAgIGludGVyZmFjZSBIb3ZlclBvcG92ZXIge1xuICAgICAgICBoaWRlKCk6IHZvaWRcbiAgICAgICAgaG92ZXJFbDogSFRNTERpdkVsZW1lbnRcbiAgICAgICAgb25Ib3ZlcjogYm9vbGVhblxuICAgICAgICBpc1Bpbm5lZD86IGJvb2xlYW5cbiAgICAgICAgYWJvcnRDb250cm9sbGVyPzogQ29tcG9uZW50XG4gICAgICAgIHRhcmdldEVsPzogSFRNTEVsZW1lbnRcbiAgICAgICAgb25Nb3VzZUluKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZDtcbiAgICAgICAgb25Nb3VzZU91dChldmVudDogTW91c2VFdmVudCk6IHZvaWQ7XG4gICAgfVxuICAgIGludGVyZmFjZSBBcHAge1xuICAgICAgICB2aWV3UmVnaXN0cnk6IHtcbiAgICAgICAgICAgIGlzRXh0ZW5zaW9uUmVnaXN0ZXJlZChleHQ6IHN0cmluZyk6IGJvb2xlYW5cbiAgICAgICAgICAgIGdldFR5cGVCeUV4dGVuc2lvbihleHQ6IHN0cmluZyk6IHN0cmluZ1xuICAgICAgICB9XG4gICAgfVxuICAgIGludGVyZmFjZSBWYXVsdCB7XG4gICAgICAgIGdldENvbmZpZyhvcHRpb246IHN0cmluZyk6IGFueVxuICAgICAgICBnZXRDb25maWcob3B0aW9uOlwic2hvd1Vuc3VwcG9ydGVkRmlsZXNcIik6IGJvb2xlYW5cbiAgICB9XG4gICAgaW50ZXJmYWNlIFdvcmtzcGFjZSB7XG4gICAgICAgIGl0ZXJhdGVMZWF2ZXMoY2FsbGJhY2s6IChpdGVtOiBXb3Jrc3BhY2VMZWFmKSA9PiBhbnksIGl0ZW06IFdvcmtzcGFjZVBhcmVudCk6IGJvb2xlYW47XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgSG92ZXJFZGl0b3IgZXh0ZW5kcyBIb3ZlclBvcG92ZXIge1xuICAgIHJvb3RTcGxpdDogV29ya3NwYWNlU3BsaXQ7XG4gICAgdG9nZ2xlUGluKHBpbm5lZD86IGJvb2xlYW4pOiB2b2lkO1xufVxuXG5jb25zdCBhbHBoYVNvcnQgPSBuZXcgSW50bC5Db2xsYXRvcih1bmRlZmluZWQsIHt1c2FnZTogXCJzb3J0XCIsIHNlbnNpdGl2aXR5OiBcImJhc2VcIiwgbnVtZXJpYzogdHJ1ZX0pLmNvbXBhcmU7XG5cbmNvbnN0IHByZXZpZXdJY29uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBtYXJrZG93bjogXCJkb2N1bWVudFwiLFxuICAgIGltYWdlOiBcImltYWdlLWZpbGVcIixcbiAgICBhdWRpbzogXCJhdWRpby1maWxlXCIsXG4gICAgcGRmOiBcInBkZi1maWxlXCIsXG59XG5cbmNvbnN0IHZpZXd0eXBlSWNvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgLi4ucHJldmlld0ljb25zLFxuICAgIC8vIGFkZCB0aGlyZC1wYXJ0eSBwbHVnaW5zXG4gICAgZXhjYWxpZHJhdzogXCJleGNhbGlkcmF3LWljb25cIixcbn07XG5cblxuLy8gR2xvYmFsIGF1dG8gcHJldmlldyBtb2RlXG5sZXQgYXV0b1ByZXZpZXcgPSB0cnVlXG5cbmV4cG9ydCBjbGFzcyBGb2xkZXJNZW51IGV4dGVuZHMgUG9wdXBNZW51IGltcGxlbWVudHMgSG92ZXJQYXJlbnQge1xuXG4gICAgcGFyZW50Rm9sZGVyOiBURm9sZGVyID0gdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBGb2xkZXJNZW51ID8gdGhpcy5wYXJlbnQuZm9sZGVyIDogbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXJlbnQ6IE1lbnVQYXJlbnQsIHB1YmxpYyBmb2xkZXI6IFRGb2xkZXIsIHB1YmxpYyBzZWxlY3RlZEZpbGU/OiBUQWJzdHJhY3RGaWxlLCBwdWJsaWMgb3BlbmVyPzogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgc3VwZXIocGFyZW50KTtcbiAgICAgICAgdGhpcy5sb2FkRmlsZXMoZm9sZGVyLCBzZWxlY3RlZEZpbGUpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCAgICAgICAgXCJUYWJcIiwgICB0aGlzLnRvZ2dsZVByZXZpZXdNb2RlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtcIk1vZFwiXSwgICBcIkVudGVyXCIsIHRoaXMub25FbnRlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXCJBbHRcIl0sICAgXCJFbnRlclwiLCB0aGlzLm9uS2V5Ym9hcmRDb250ZXh0TWVudS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgICAgICAgIFwiXFxcXFwiLCAgICB0aGlzLm9uS2V5Ym9hcmRDb250ZXh0TWVudS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgICAgICAgIFwiRjJcIiwgICAgdGhpcy5kb1JlbmFtZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXCJTaGlmdFwiXSwgXCJGMlwiLCAgICB0aGlzLmRvTW92ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAvLyBTY3JvbGwgcHJldmlldyB3aW5kb3cgdXAgYW5kIGRvd25cbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgICAgICAgXCJQYWdlVXBcIiwgdGhpcy5kb1Njcm9sbC5iaW5kKHRoaXMsIC0xLCBmYWxzZSkpO1xuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCAgICAgXCJQYWdlRG93blwiLCB0aGlzLmRvU2Nyb2xsLmJpbmQodGhpcywgIDEsIGZhbHNlKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW1wiTW9kXCJdLCAgICBcIkhvbWVcIiwgdGhpcy5kb1Njcm9sbC5iaW5kKHRoaXMsICAwLCB0cnVlKSk7XG4gICAgICAgIHRoaXMuc2NvcGUucmVnaXN0ZXIoW1wiTW9kXCJdLCAgICAgXCJFbmRcIiwgdGhpcy5kb1Njcm9sbC5iaW5kKHRoaXMsICAxLCB0cnVlKSk7XG5cbiAgICAgICAgY29uc3QgeyBkb20gfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IG1lbnVJdGVtID0gXCIubWVudS1pdGVtW2RhdGEtZmlsZS1wYXRoXVwiO1xuICAgICAgICBkb20ub24oXCJjbGlja1wiLCAgICAgICBtZW51SXRlbSwgdGhpcy5vbkl0ZW1DbGljaywgdHJ1ZSk7XG4gICAgICAgIGRvbS5vbihcImNvbnRleHRtZW51XCIsIG1lbnVJdGVtLCB0aGlzLm9uSXRlbU1lbnUgKTtcbiAgICAgICAgZG9tLm9uKCdtb3VzZW92ZXInICAsIG1lbnVJdGVtLCB0aGlzLm9uSXRlbUhvdmVyKTtcbiAgICAgICAgZG9tLm9uKFwibW91c2Vkb3duXCIsICAgbWVudUl0ZW0sIGUgPT4ge2Uuc3RvcFByb3BhZ2F0aW9uKCl9LCB0cnVlKTsgIC8vIEZpeCBkcmFnIGNhbmNlbGxpbmdcbiAgICAgICAgZG9tLm9uKCdkcmFnc3RhcnQnLCAgIG1lbnVJdGVtLCAoZXZlbnQsIHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgc3RhcnREcmFnKHRoaXMuYXBwLCB0YXJnZXQuZGF0YXNldC5maWxlUGF0aCwgZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXaGVuIHdlIHVubG9hZCwgcmVhY3RpdmF0ZSBwYXJlbnQgbWVudSdzIGhvdmVyLCBpZiBuZWVkZWRcbiAgICAgICAgdGhpcy5yZWdpc3RlcigoKSA9PiB7IGF1dG9QcmV2aWV3ICYmIHRoaXMucGFyZW50IGluc3RhbmNlb2YgRm9sZGVyTWVudSAmJiB0aGlzLnBhcmVudC5zaG93UG9wb3ZlcigpOyB9KVxuXG4gICAgICAgIC8vIE1ha2Ugb2JzaWRpYW4uTWVudSB0aGluayBtb3VzZWRvd25zIG9uIG91ciBwb3B1cHMgYXJlIGhhcHBlbmluZ1xuICAgICAgICAvLyBvbiB1cywgc28gd2Ugd29uJ3QgY2xvc2UgYmVmb3JlIGFuIGFjdHVhbCBjbGljayBvY2N1cnNcbiAgICAgICAgY29uc3QgbWVudSA9IHRoaXM7XG4gICAgICAgIGFyb3VuZCh0aGlzLmRvbSwge2NvbnRhaW5zKHByZXYpeyByZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBOb2RlKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBwcmV2LmNhbGwodGhpcywgdGFyZ2V0KSB8fCBtZW51Ll9wb3BvdmVyPy5ob3ZlckVsLmNvbnRhaW5zKHRhcmdldCk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9fX0pO1xuICAgIH1cblxuICAgIG9uQXJyb3dMZWZ0KCkge1xuICAgICAgICBzdXBlci5vbkFycm93TGVmdCgpO1xuICAgICAgICBpZiAodGhpcy5yb290TWVudSgpID09PSB0aGlzKSB0aGlzLm9wZW5CcmVhZGNydW1iKHRoaXMub3BlbmVyPy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uS2V5Ym9hcmRDb250ZXh0TWVudSgpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5pdGVtc1t0aGlzLnNlbGVjdGVkXT8uZG9tLCBmaWxlID0gdGFyZ2V0ICYmIHRoaXMuZmlsZUZvckRvbSh0YXJnZXQpO1xuICAgICAgICBpZiAoZmlsZSkgbmV3IENvbnRleHRNZW51KHRoaXMsIGZpbGUpLmNhc2NhZGUodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGRvU2Nyb2xsKGRpcmVjdGlvbjogbnVtYmVyLCB0b0VuZDogYm9vbGVhbiwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgY29uc3QgaG92ZXJFbCA9IHRoaXMuaG92ZXJQb3BvdmVyPy5ob3ZlckVsO1xuICAgICAgICBjb25zdCBwcmV2aWV3ID0gaG92ZXJFbD8uZmluZChcbiAgICAgICAgICAgIHRoaXMuaG92ZXJQb3BvdmVyPy5yb290U3BsaXQgP1xuICAgICAgICAgICAgICAgICdbZGF0YS1tb2RlPVwicHJldmlld1wiXSAubWFya2Rvd24tcHJldmlldy12aWV3LCBbZGF0YS1tb2RlPVwic291cmNlXCJdIC5jbS1zY3JvbGxlcicgOlxuICAgICAgICAgICAgICAgICcubWFya2Rvd24tcHJldmlldy12aWV3J1xuICAgICAgICApO1xuICAgICAgICBpZiAocHJldmlldykge1xuICAgICAgICAgICAgcHJldmlldy5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IHRvRW5kID8gXCJhdXRvXCI6IFwic21vb3RoXCI7XG4gICAgICAgICAgICBjb25zdCBvbGRUb3AgPSBwcmV2aWV3LnNjcm9sbFRvcDtcbiAgICAgICAgICAgIGNvbnN0IG5ld1RvcCA9ICh0b0VuZCA/IDAgOiBwcmV2aWV3LnNjcm9sbFRvcCkgKyBkaXJlY3Rpb24gKiAodG9FbmQgPyBwcmV2aWV3LnNjcm9sbEhlaWdodCA6IHByZXZpZXcuY2xpZW50SGVpZ2h0KTtcbiAgICAgICAgICAgIHByZXZpZXcuc2Nyb2xsVG9wID0gbmV3VG9wO1xuICAgICAgICAgICAgaWYgKCF0b0VuZCkge1xuICAgICAgICAgICAgICAgIC8vIFBhZ2luZyBwYXN0IHRoZSBiZWdpbm5pbmcgb3IgZW5kXG4gICAgICAgICAgICAgICAgaWYgKG5ld1RvcCA+PSBwcmV2aWV3LnNjcm9sbEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQXJyb3dEb3duKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1RvcCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZFRvcCA+IDApIHByZXZpZXcuc2Nyb2xsVG9wID0gMDsgZWxzZSB0aGlzLm9uQXJyb3dVcChldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFhdXRvUHJldmlldykgeyBhdXRvUHJldmlldyA9IHRydWU7IHRoaXMuc2hvd1BvcG92ZXIoKTsgfVxuICAgICAgICAgICAgLy8gTm8gcHJldmlldywganVzdCBnbyB0byBuZXh0IG9yIHByZXZpb3VzIGl0ZW1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbiA+IDApIHRoaXMub25BcnJvd0Rvd24oZXZlbnQpOyBlbHNlIHRoaXMub25BcnJvd1VwKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZG9SZW5hbWUoKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmN1cnJlbnRGaWxlKClcbiAgICAgICAgdGhpcy5yb290TWVudSgpLmhpZGUoKTtcbiAgICAgICAgaWYgKGZpbGUpIHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb21wdEZvckZpbGVSZW5hbWUoZmlsZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBkb01vdmUoKSB7XG4gICAgICAgIGNvbnN0IGV4cGxvcmVyUGx1Z2luID0gdGhpcy5hcHAuaW50ZXJuYWxQbHVnaW5zLnBsdWdpbnNbXCJmaWxlLWV4cGxvcmVyXCJdO1xuICAgICAgICBpZiAoIWV4cGxvcmVyUGx1Z2luLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJGaWxlIGV4cGxvcmVyIGNvcmUgcGx1Z2luIG11c3QgYmUgZW5hYmxlZCB0byBtb3ZlIGZpbGVzIG9yIGZvbGRlcnNcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290TWVudSgpLmhpZGUoKTtcbiAgICAgICAgY29uc3QgbW9kYWwgPSBleHBsb3JlclBsdWdpbi5pbnN0YW5jZS5tb3ZlRmlsZU1vZGFsO1xuICAgICAgICBtb2RhbC5zZXRDdXJyZW50RmlsZSh0aGlzLmN1cnJlbnRGaWxlKCkpO1xuICAgICAgICBtb2RhbC5vcGVuKClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGN1cnJlbnRJdGVtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtc1t0aGlzLnNlbGVjdGVkXTtcbiAgICB9XG5cbiAgICBjdXJyZW50RmlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsZUZvckRvbSh0aGlzLmN1cnJlbnRJdGVtKCk/LmRvbSlcbiAgICB9XG5cbiAgICBmaWxlRm9yRG9tKHRhcmdldEVsOiBIVE1MRGl2RWxlbWVudCkge1xuICAgICAgICBjb25zdCB7IGZpbGVQYXRoIH0gPSB0YXJnZXRFbD8uZGF0YXNldDtcbiAgICAgICAgaWYgKGZpbGVQYXRoKSByZXR1cm4gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBpdGVtRm9yUGF0aChmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbmRJbmRleChpID0+IGkuZG9tLmRhdGFzZXQuZmlsZVBhdGggPT09IGZpbGVQYXRoKTtcbiAgICB9XG5cbiAgICBvcGVuQnJlYWRjcnVtYihlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIHRoaXMucm9vdE1lbnUoKSA9PT0gdGhpcykge1xuICAgICAgICAgICAgY29uc3QgcHJldkV4cGxvcmFibGUgPSB0aGlzLm9wZW5lci5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgKGVsZW1lbnQgYXMgSFRNTERpdkVsZW1lbnQpLmNsaWNrKClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQXJyb3dSaWdodCgpIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuY3VycmVudEZpbGUoKTtcbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSB7XG4gICAgICAgICAgICBpZiAoZmlsZSAhPT0gdGhpcy5zZWxlY3RlZEZpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tGaWxlKGZpbGUsIHRoaXMuY3VycmVudEl0ZW0oKS5kb20pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5CcmVhZGNydW1iKHRoaXMub3BlbmVyPy5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgY29uc3QgcG9wID0gdGhpcy5ob3ZlclBvcG92ZXI7XG4gICAgICAgICAgICBpZiAocG9wICYmIHBvcC5yb290U3BsaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUxlYXZlcyhsZWFmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlYWYudmlldyBpbnN0YW5jZW9mIEZpbGVWaWV3ICYmIGxlYWYudmlldy5maWxlID09PSBmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3AudG9nZ2xlUGluKHRydWUpOyAgLy8gRW5zdXJlIHRoZSBwb3B1cCB3b24ndCBjbG9zZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVzY2FwZSgpOyAgICAgIC8vIHdoZW4gd2UgY2xvc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZWFmLnZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggdG8gZWRpdCBtb2RlIC0tIGtleWJvYXJkJ3Mgbm90IG11Y2ggZ29vZCB3aXRob3V0IGl0IVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogbGVhZi52aWV3LmdldFZpZXdUeXBlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiB7IGZpbGU6IGZpbGUucGF0aCwgbW9kZTogXCJzb3VyY2VcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIGZhbHNlLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbWV0aGluZyBsaWtlIEthbmJhbiBvciBFeGNhbGlkcmF3LCBtaWdodCBub3Qgc3VwcG9ydCBmb2N1cyBmbGFnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIG1ha2Ugc3VyZSB0aGUgY3VycmVudCBwYW5lIGRvZXNuJ3QgaGFuZyBvbnRvIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuZG9tLm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCk/LmJsdXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7ICAvLyBvbmx5IHRhcmdldCB0aGUgZmlyc3QgbGVhZiwgd2hldGhlciBpdCBtYXRjaGVzIG9yIG5vdFxuICAgICAgICAgICAgICAgIH0sIHBvcC5yb290U3BsaXQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxvYWRGaWxlcyhmb2xkZXI6IFRGb2xkZXIsIHNlbGVjdGVkRmlsZT86IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgY29uc3QgZm9sZGVyTm90ZSA9IHRoaXMuZm9sZGVyTm90ZSh0aGlzLmZvbGRlcik7XG4gICAgICAgIHRoaXMuZG9tLmVtcHR5KCk7IHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgY29uc3QgYWxsRmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRDb25maWcoXCJzaG93VW5zdXBwb3J0ZWRGaWxlc1wiKTtcbiAgICAgICAgY29uc3Qge2NoaWxkcmVuLCBwYXJlbnR9ID0gZm9sZGVyO1xuICAgICAgICBjb25zdCBpdGVtcyA9IGNoaWxkcmVuLnNsaWNlKCkuc29ydCgoYTogVEFic3RyYWN0RmlsZSwgYjogVEFic3RyYWN0RmlsZSkgPT4gYWxwaGFTb3J0KGEubmFtZSwgYi5uYW1lKSlcbiAgICAgICAgY29uc3QgZm9sZGVycyA9IGl0ZW1zLmZpbHRlcihmID0+IGYgaW5zdGFuY2VvZiBURm9sZGVyKSBhcyBURm9sZGVyW107XG4gICAgICAgIGNvbnN0IGZpbGVzICAgPSBpdGVtcy5maWx0ZXIoZiA9PiBmIGluc3RhbmNlb2YgVEZpbGUgJiYgZiAhPT0gZm9sZGVyTm90ZSAmJiAoYWxsRmlsZXMgfHwgdGhpcy5maWxlSWNvbihmKSkpIGFzIFRGaWxlW107XG4gICAgICAgIGZvbGRlcnMuc29ydCgoYSwgYikgPT4gYWxwaGFTb3J0KGEubmFtZSwgYi5uYW1lKSk7XG4gICAgICAgIGZpbGVzLnNvcnQoKGEsIGIpID0+IGFscGhhU29ydChhLmJhc2VuYW1lLCBiLmJhc2VuYW1lKSk7XG4gICAgICAgIGlmIChmb2xkZXJOb3RlKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEZpbGUoZm9sZGVyTm90ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvbGRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZm9sZGVyTm90ZSkgdGhpcy5hZGRTZXBhcmF0b3IoKTtcbiAgICAgICAgICAgIGZvbGRlcnMubWFwKHRoaXMuYWRkRmlsZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGZvbGRlcnMubGVuZ3RoIHx8IGZvbGRlck5vdGUpIHRoaXMuYWRkU2VwYXJhdG9yKCk7XG4gICAgICAgICAgICBmaWxlcy5tYXAodGhpcy5hZGRGaWxlLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdChzZWxlY3RlZEZpbGUgPyB0aGlzLml0ZW1Gb3JQYXRoKHNlbGVjdGVkRmlsZS5wYXRoKSA6IDApO1xuICAgIH1cblxuICAgIGZpbGVJY29uKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSByZXR1cm4gXCJmb2xkZXJcIjtcbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgY29uc3Qgdmlld1R5cGUgPSB0aGlzLmFwcC52aWV3UmVnaXN0cnkuZ2V0VHlwZUJ5RXh0ZW5zaW9uKGZpbGUuZXh0ZW5zaW9uKTtcbiAgICAgICAgICAgIGlmICh2aWV3VHlwZSkgcmV0dXJuIHZpZXd0eXBlSWNvbnNbdmlld1R5cGVdID8/IFwiZG9jdW1lbnRcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGVDb3VudDogKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IG51bWJlciA9IChmaWxlOiBUQWJzdHJhY3RGaWxlKSA9PiAoXG4gICAgICAgIGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyID8gZmlsZS5jaGlsZHJlbi5tYXAodGhpcy5maWxlQ291bnQpLnJlZHVjZSgoYSxiKSA9PiBhK2IsIDApIDogKHRoaXMuZmlsZUljb24oZmlsZSkgPyAxIDogMClcbiAgICApXG5cbiAgICBhZGRGaWxlKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgY29uc3QgaWNvbiA9IHRoaXMuZmlsZUljb24oZmlsZSk7XG4gICAgICAgIHRoaXMuYWRkSXRlbShpID0+IHtcbiAgICAgICAgICAgIGkuc2V0VGl0bGUoZmlsZS5uYW1lKTtcbiAgICAgICAgICAgIGkuZG9tLmRhdGFzZXQuZmlsZVBhdGggPSBmaWxlLnBhdGg7XG4gICAgICAgICAgICBpLmRvbS5zZXRBdHRyKFwiZHJhZ2dhYmxlXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgIGkuZG9tLmFkZENsYXNzIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlciA/IFwiaXMtcWUtZm9sZGVyXCIgOiBcImlzLXFlLWZpbGVcIik7XG4gICAgICAgICAgICBpZiAoaWNvbikgaS5zZXRJY29uKGljb24pO1xuICAgICAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgIGkuc2V0VGl0bGUoZmlsZS5iYXNlbmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGUuZXh0ZW5zaW9uICE9PSBcIm1kXCIpIGkuZG9tLmNyZWF0ZURpdih7dGV4dDogZmlsZS5leHRlbnNpb24sIGNsczogW1wibmF2LWZpbGUtdGFnXCIsXCJxZS1leHRlbnNpb25cIl19KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZSAhPT0gdGhpcy5mb2xkZXIucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSB0aGlzLmZpbGVDb3VudChmaWxlKTtcbiAgICAgICAgICAgICAgICBpZiAoY291bnQpIGkuZG9tLmNyZWF0ZURpdih7dGV4dDogXCJcIitjb3VudCwgY2xzOiBcIm5hdi1maWxlLXRhZyBxZS1maWxlLWNvdW50XCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkub25DbGljayhlID0+IHRoaXMub25DbGlja0ZpbGUoZmlsZSwgaS5kb20sIGUpKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0b2dnbGVQcmV2aWV3TW9kZSgpIHtcbiAgICAgICAgaWYgKGF1dG9QcmV2aWV3ID0gIWF1dG9QcmV2aWV3KSB0aGlzLnNob3dQb3BvdmVyKCk7IGVsc2UgdGhpcy5oaWRlUG9wb3ZlcigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVmcmVzaEZpbGVzID0gZGVib3VuY2UoKCkgPT4gdGhpcy5sb2FkRmlsZXModGhpcy5mb2xkZXIsIHRoaXMuY3VycmVudEZpbGUoKSksIDEwMCwgdHJ1ZSk7XG5cbiAgICBvbmxvYWQoKSB7XG4gICAgICAgIHN1cGVyLm9ubG9hZCgpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJjcmVhdGVcIiwgKGZpbGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbGRlciA9PT0gZmlsZS5wYXJlbnQpIHRoaXMucmVmcmVzaEZpbGVzKCk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwicmVuYW1lXCIsIChmaWxlLCBvbGRQYXRoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5mb2xkZXIgPT09IGZpbGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gRGVzdGluYXRpb24gd2FzIGhlcmU7IHJlZnJlc2ggdGhlIGxpc3RcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEZpbGUgPSB0aGlzLml0ZW1Gb3JQYXRoKG9sZFBhdGgpID49IDAgPyBmaWxlIDogdGhpcy5jdXJyZW50RmlsZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZEZpbGVzKHRoaXMuZm9sZGVyLCBzZWxlY3RlZEZpbGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgaXQgaWYgaXQgd2FzIG1vdmVkIG91dCBvZiBoZXJlXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtRm9yUGF0aChvbGRQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJkZWxldGVcIiwgZmlsZSA9PiB0aGlzLnJlbW92ZUl0ZW1Gb3JQYXRoKGZpbGUucGF0aCkpKTtcblxuICAgICAgICAvLyBBY3RpdmF0ZSBwcmV2aWV3IGltbWVkaWF0ZWx5IGlmIGFwcGxpY2FibGVcbiAgICAgICAgaWYgKGF1dG9QcmV2aWV3ICYmIHRoaXMuc2VsZWN0ZWQgIT0gLTEpIHRoaXMuc2hvd1BvcG92ZXIoKTtcbiAgICB9XG5cbiAgICByZW1vdmVJdGVtRm9yUGF0aChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcG9zbiA9IHRoaXMuaXRlbUZvclBhdGgocGF0aCk7XG4gICAgICAgIGlmIChwb3NuIDwgMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1twb3NuXTtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQgPiBwb3NuKSB0aGlzLnNlbGVjdGVkIC09IDE7XG4gICAgICAgIGl0ZW0uZG9tLmRldGFjaCgpXG4gICAgICAgIHRoaXMuaXRlbXMucmVtb3ZlKGl0ZW0pO1xuICAgIH1cblxuICAgIG9uRXNjYXBlKCkge1xuICAgICAgICBzdXBlci5vbkVzY2FwZSgpO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBQb3B1cE1lbnUpIHRoaXMucGFyZW50Lm9uRXNjYXBlKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLmhpZGVQb3BvdmVyKCk7XG4gICAgICAgIHJldHVybiBzdXBlci5oaWRlKCk7XG4gICAgfVxuXG4gICAgc2V0Q2hpbGRNZW51KG1lbnU6IFBvcHVwTWVudSkge1xuICAgICAgICBzdXBlci5zZXRDaGlsZE1lbnUobWVudSk7XG4gICAgICAgIGlmIChhdXRvUHJldmlldyAmJiB0aGlzLmNhblNob3dQb3BvdmVyKCkpIHRoaXMuc2hvd1BvcG92ZXIoKTtcbiAgICB9XG5cbiAgICBzZWxlY3QoaWR4OiBudW1iZXIsIHNjcm9sbCA9IHRydWUpIHtcbiAgICAgICAgY29uc3Qgb2xkID0gdGhpcy5zZWxlY3RlZDtcbiAgICAgICAgc3VwZXIuc2VsZWN0KGlkeCwgc2Nyb2xsKTtcbiAgICAgICAgaWYgKG9sZCAhPT0gdGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgLy8gc2VsZWN0ZWQgaXRlbSBjaGFuZ2VkOyB0cmlnZ2VyIG5ldyBwb3BvdmVyIG9yIGhpZGUgdGhlIG9sZCBvbmVcbiAgICAgICAgICAgIGlmIChhdXRvUHJldmlldykgdGhpcy5zaG93UG9wb3ZlcigpOyBlbHNlIHRoaXMuaGlkZVBvcG92ZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhpZGVQb3BvdmVyKCkge1xuICAgICAgICB0aGlzLmhvdmVyUG9wb3ZlciA9IG51bGw7XG4gICAgfVxuXG4gICAgY2FuU2hvd1BvcG92ZXIoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jaGlsZCAmJiB0aGlzLnZpc2libGU7XG4gICAgfVxuXG4gICAgc2hvd1BvcG92ZXIgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuaGlkZVBvcG92ZXIoKTtcbiAgICAgICAgaWYgKCFhdXRvUHJldmlldykgcmV0dXJuO1xuICAgICAgICB0aGlzLm1heWJlSG92ZXIodGhpcy5jdXJyZW50SXRlbSgpPy5kb20sIGZpbGUgPT4gdGhpcy5hcHAud29ya3NwYWNlLnRyaWdnZXIoXG4gICAgICAgICAgICAvLyBVc2UgZG9jdW1lbnQuYm9keSBhcyB0YXJnZXRFbCBzbyAwLjE1Lnggd29uJ3QgY3Jhc2ggb24gcHJldmlld1xuICAgICAgICAgICAgJ2xpbmstaG92ZXInLCB0aGlzLCB3aW5kb3dGb3JEb20odGhpcy5kb20pLmRvY3VtZW50LmJvZHksIGZpbGUucGF0aCwgXCJcIlxuICAgICAgICApKTtcbiAgICB9LCA1MCwgdHJ1ZSlcblxuICAgIG9uSXRlbUhvdmVyID0gKGV2ZW50OiBNb3VzZUV2ZW50LCB0YXJnZXRFbDogSFRNTERpdkVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKCFhdXRvUHJldmlldykgdGhpcy5tYXliZUhvdmVyKHRhcmdldEVsLCBmaWxlID0+IHRoaXMuYXBwLndvcmtzcGFjZS50cmlnZ2VyKCdob3Zlci1saW5rJywge1xuICAgICAgICAgICAgZXZlbnQsIHNvdXJjZTogaG92ZXJTb3VyY2UsIGhvdmVyUGFyZW50OiB0aGlzLCB0YXJnZXRFbCwgbGlua3RleHQ6IGZpbGUucGF0aFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgbWF5YmVIb3Zlcih0YXJnZXRFbDogSFRNTERpdkVsZW1lbnQsIGNiOiAoZmlsZTogVEZpbGUpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhblNob3dQb3BvdmVyKCkpIHJldHVybjtcbiAgICAgICAgbGV0IGZpbGUgPSB0aGlzLmZpbGVGb3JEb20odGFyZ2V0RWwpXG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZvbGRlcikgZmlsZSA9IHRoaXMuZm9sZGVyTm90ZShmaWxlKTtcbiAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSAmJiBwcmV2aWV3SWNvbnNbdGhpcy5hcHAudmlld1JlZ2lzdHJ5LmdldFR5cGVCeUV4dGVuc2lvbihmaWxlLmV4dGVuc2lvbildKSB7XG4gICAgICAgICAgICBjYihmaWxlKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZvbGRlck5vdGUoZm9sZGVyOiBURm9sZGVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5mb2xkZXJOb3RlUGF0aChmb2xkZXIpKTtcbiAgICB9XG5cbiAgICBmb2xkZXJOb3RlUGF0aChmb2xkZXI6IFRGb2xkZXIpIHtcbiAgICAgICAgcmV0dXJuIGAke2ZvbGRlci5wYXRofS8ke2ZvbGRlci5uYW1lfS5tZGA7XG4gICAgfVxuXG5cbiAgICBfcG9wb3ZlcjogSG92ZXJFZGl0b3I7XG5cbiAgICBnZXQgaG92ZXJQb3BvdmVyKCkgeyByZXR1cm4gdGhpcy5fcG9wb3ZlcjsgfVxuXG4gICAgc2V0IGhvdmVyUG9wb3Zlcihwb3BvdmVyKSB7XG4gICAgICAgIGNvbnN0IG9sZCA9IHRoaXMuX3BvcG92ZXI7XG4gICAgICAgIGlmIChvbGQgJiYgcG9wb3ZlciAhPT0gb2xkKSB7XG4gICAgICAgICAgICB0aGlzLl9wb3BvdmVyID0gbnVsbDtcbiAgICAgICAgICAgIG9sZC5vbkhvdmVyID0gZmFsc2U7ICAgLy8gRm9yY2UgdW5waW5uZWQgSG92ZXIgRWRpdG9ycyB0byBjbG9zZVxuICAgICAgICAgICAgaWYgKCFvbGQuaXNQaW5uZWQpIG9sZC5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvcG92ZXIgJiYgIXRoaXMuY2FuU2hvd1BvcG92ZXIoKSkge1xuICAgICAgICAgICAgcG9wb3Zlci5vbkhvdmVyID0gZmFsc2U7ICAgLy8gRm9yY2UgdW5waW5uZWQgSG92ZXIgRWRpdG9ycyB0byBjbG9zZVxuICAgICAgICAgICAgcG9wb3Zlci5oaWRlKCk7XG4gICAgICAgICAgICBwb3BvdmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wb3BvdmVyID0gcG9wb3ZlcjtcblxuICAgICAgICAvKiBXb3JrIGFyb3VuZCAwLjE1LnggbnVsbCB0YXJnZXRFbCBidWcgdXNpbmcgZG9jdW1lbnQuYm9keSAqL1xuICAgICAgICBjb25zdCB0YXJnZXRFbDogSFRNTEVsZW1lbnQgPSAocG9wb3ZlciBhcyBhbnkpPy50YXJnZXRFbDtcbiAgICAgICAgaWYgKHRhcmdldEVsICYmIHRhcmdldEVsID09PSB0YXJnZXRFbC5vd25lckRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIHRhcmdldEVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgcG9wb3Zlci5vbk1vdXNlSW4pO1xuICAgICAgICAgICAgdGFyZ2V0RWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHBvcG92ZXIub25Nb3VzZU91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXV0b1ByZXZpZXcgJiYgcG9wb3ZlciAmJiB0aGlzLmN1cnJlbnRJdGVtKCkpIHtcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlIGF1dG8tcGlubmluZyBpZiB3ZSBhcmUgZ2VuZXJhdGluZyBhdXRvLXByZXZpZXdzLCB0byBhdm9pZFxuICAgICAgICAgICAgLy8gZ2VuZXJhdGluZyBodWdlIG51bWJlcnMgb2YgcG9wb3ZlcnNcbiAgICAgICAgICAgIHBvcG92ZXIudG9nZ2xlUGluPy4oZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBEaXRjaCBldmVudCBoYW5kbGVycyAoV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL25vdGhpbmdpc2xvc3Qvb2JzaWRpYW4taG92ZXItZWRpdG9yL2lzc3Vlcy8xMjUpXG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHBvcG92ZXIuYWJvcnRDb250cm9sbGVyPy51bmxvYWQ/LigpKTtcblxuICAgICAgICAgICAgLy8gUG9zaXRpb24gdGhlIHBvcG92ZXIgc28gaXQgZG9lc24ndCBvdmVybGFwIHRoZSBtZW51IGhvcml6b250YWxseSAoYXMgbG9uZyBhcyBpdCBmaXRzKVxuICAgICAgICAgICAgLy8gYW5kIHNvIHRoYXQgaXRzIHZlcnRpY2FsIHBvc2l0aW9uIG92ZXJsYXBzIHRoZSBzZWxlY3RlZCBtZW51IGl0ZW0gKHBsYWNpbmcgdGhlIHRvcCBhXG4gICAgICAgICAgICAvLyBiaXQgYWJvdmUgdGhlIGN1cnJlbnQgaXRlbSwgdW5sZXNzIGl0IHdvdWxkIGdvIG9mZiB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4pXG4gICAgICAgICAgICBjb25zdCBob3ZlckVsID0gcG9wb3Zlci5ob3ZlckVsO1xuICAgICAgICAgICAgaG92ZXJFbC5zaG93KCk7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG1lbnUgPSB0aGlzLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMuY3VycmVudEl0ZW0oKS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICAgICAgY29udGFpbmVyID0gaG92ZXJFbC5vZmZzZXRQYXJlbnQgfHwgdGhpcy5kb20ub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgcG9wdXBIZWlnaHQgPSBob3ZlckVsLm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgICAgICBsZWZ0ID0gTWF0aC5taW4obWVudS5yaWdodCArIDIsIGNvbnRhaW5lci5jbGllbnRXaWR0aCAtIGhvdmVyRWwub2Zmc2V0V2lkdGgpLFxuICAgICAgICAgICAgICAgIHRvcCA9IE1hdGgubWluKE1hdGgubWF4KDAsIHNlbGVjdGVkLnRvcCAtIHBvcHVwSGVpZ2h0LzgpLCBjb250YWluZXIuY2xpZW50SGVpZ2h0IC0gcG9wdXBIZWlnaHQpXG4gICAgICAgICAgICA7XG4gICAgICAgICAgICBob3ZlckVsLnN0eWxlLnRvcCA9IHRvcCArIFwicHhcIjtcbiAgICAgICAgICAgIGhvdmVyRWwuc3R5bGUubGVmdCA9IGxlZnQgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkl0ZW1DbGljayA9IChldmVudDogTW91c2VFdmVudCwgdGFyZ2V0OiBIVE1MRGl2RWxlbWVudCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5maWxlRm9yRG9tKHRhcmdldCk7XG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgICAgICBpZiAoIXRoaXMub25DbGlja0ZpbGUoZmlsZSwgdGFyZ2V0LCBldmVudCkpIHtcbiAgICAgICAgICAgIC8vIEtlZXAgY3VycmVudCBtZW51IHRyZWUgb3BlblxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DbGlja0ZpbGUoZmlsZTogVEFic3RyYWN0RmlsZSwgdGFyZ2V0OiBIVE1MRGl2RWxlbWVudCwgZXZlbnQ/OiBNb3VzZUV2ZW50fEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgdGhpcy5oaWRlUG9wb3ZlcigpO1xuICAgICAgICBjb25zdCBpZHggPSB0aGlzLml0ZW1Gb3JQYXRoKGZpbGUucGF0aCk7XG4gICAgICAgIGlmIChpZHggPj0gMCAmJiB0aGlzLnNlbGVjdGVkICE9IGlkeCkgdGhpcy5zZWxlY3QoaWR4KTtcblxuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcHAudmlld1JlZ2lzdHJ5LmlzRXh0ZW5zaW9uUmVnaXN0ZXJlZChmaWxlLmV4dGVuc2lvbikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KGZpbGUucGF0aCwgXCJcIiwgZXZlbnQgJiYgS2V5bWFwLmlzTW9kaWZpZXIoZXZlbnQsIFwiTW9kXCIpKTtcbiAgICAgICAgICAgICAgICAvLyBDbG9zZSB0aGUgZW50aXJlIG1lbnUgdHJlZVxuICAgICAgICAgICAgICAgIHRoaXMucm9vdE1lbnUoKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQ/LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKGAuJHtmaWxlLmV4dGVuc2lvbn0gZmlsZXMgY2Fubm90IGJlIG9wZW5lZCBpbiBPYnNpZGlhbjsgVXNlIFwiT3BlbiBpbiBEZWZhdWx0IEFwcFwiIHRvIG9wZW4gdGhlbSBleHRlcm5hbGx5YCk7XG4gICAgICAgICAgICAgICAgLy8gZmFsbCB0aHJvdWdoXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZmlsZSA9PT0gdGhpcy5zZWxlY3RlZEZpbGUpIHtcbiAgICAgICAgICAgIC8vIFRhcmdldGluZyB0aGUgaW5pdGlhbGx5LXNlbGVjdGVkIHN1YmZvbGRlcjogZ28gdG8gbmV4dCBicmVhZGNydW1iXG4gICAgICAgICAgICB0aGlzLm9wZW5CcmVhZGNydW1iKHRoaXMub3BlbmVyPy5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBwb3AgYSBuZXcgbWVudSBmb3IgdGhlIHN1YmZvbGRlclxuICAgICAgICAgICAgY29uc3QgZm9sZGVyTWVudSA9IG5ldyBGb2xkZXJNZW51KHRoaXMsIGZpbGUgYXMgVEZvbGRlciwgdGhpcy5mb2xkZXJOb3RlKGZpbGUgYXMgVEZvbGRlcikpO1xuICAgICAgICAgICAgZm9sZGVyTWVudS5jYXNjYWRlKHRhcmdldCwgZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ID8gZXZlbnQgOiB1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25JdGVtTWVudSA9IChldmVudDogTW91c2VFdmVudCwgdGFyZ2V0OiBIVE1MRGl2RWxlbWVudCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5maWxlRm9yRG9tKHRhcmdldCk7XG4gICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICBjb25zdCBpZHggPSB0aGlzLml0ZW1Gb3JQYXRoKGZpbGUucGF0aCk7XG4gICAgICAgICAgICBpZiAoaWR4ID49IDAgJiYgdGhpcy5zZWxlY3RlZCAhPSBpZHgpIHRoaXMuc2VsZWN0KGlkeCk7XG4gICAgICAgICAgICBuZXcgQ29udGV4dE1lbnUodGhpcywgZmlsZSkuY2FzY2FkZSh0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgICAgIC8vIEtlZXAgY3VycmVudCBtZW51IHRyZWUgb3BlblxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIFBsdWdpbiwgVEFic3RyYWN0RmlsZSwgVEZpbGUsIFRGb2xkZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGxpc3QsIGVsLCBtb3VudCwgdW5tb3VudCB9IGZyb20gXCJyZWRvbVwiO1xuaW1wb3J0IHsgQ29udGV4dE1lbnUgfSBmcm9tIFwiLi9Db250ZXh0TWVudVwiO1xuaW1wb3J0IHsgRm9sZGVyTWVudSB9IGZyb20gXCIuL0ZvbGRlck1lbnVcIjtcbmltcG9ydCB7IFBlcldpbmRvd0NvbXBvbmVudCwgV2luZG93TWFuYWdlciB9IGZyb20gXCIuL1BlcldpbmRvd0NvbXBvbmVudFwiO1xuaW1wb3J0IFFFIGZyb20gXCIuL3F1aWNrLWV4cGxvcmVyXCI7XG5cbmV4cG9ydCBjb25zdCBob3ZlclNvdXJjZSA9IFwicXVpY2stZXhwbG9yZXI6Zm9sZGVyLW1lbnVcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCJvYnNpZGlhblwiIHtcbiAgICBpbnRlcmZhY2UgQXBwIHtcbiAgICAgICAgZHJhZ01hbmFnZXI6IGFueVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0RHJhZyhhcHA6IEFwcCwgcGF0aDogc3RyaW5nLCBldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgaWYgKCFwYXRoIHx8IHBhdGggPT09IFwiL1wiKSByZXR1cm47XG4gICAgY29uc3QgZmlsZSA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgeyBkcmFnTWFuYWdlciB9ID0gYXBwO1xuICAgIGNvbnN0IGRyYWdEYXRhID0gZmlsZSBpbnN0YW5jZW9mIFRGaWxlID8gZHJhZ01hbmFnZXIuZHJhZ0ZpbGUoZXZlbnQsIGZpbGUpIDogZHJhZ01hbmFnZXIuZHJhZ0ZvbGRlcihldmVudCwgZmlsZSk7XG4gICAgZHJhZ01hbmFnZXIub25EcmFnU3RhcnQoZXZlbnQsIGRyYWdEYXRhKTtcbn1cblxuY2xhc3MgRXhwbG9yYWJsZSB7XG4gICAgbmFtZUVsID0gPHNwYW4gY2xhc3M9XCJleHBsb3JhYmxlLW5hbWVcIi8+O1xuICAgIHNlcEVsID0gPHNwYW4gY2xhc3M9XCJleHBsb3JhYmxlLXNlcGFyYXRvclwiLz47XG4gICAgZWwgPSA8c3BhbiBkcmFnZ2FibGUgY2xhc3M9XCJleHBsb3JhYmxlIHRpdGxlYmFyLWJ1dHRvblwiPnt0aGlzLm5hbWVFbH17dGhpcy5zZXBFbH08L3NwYW4+O1xuICAgIHVwZGF0ZShkYXRhOiB7ZmlsZTogVEFic3RyYWN0RmlsZSwgcGF0aDogc3RyaW5nfSwgaW5kZXg6IG51bWJlciwgaXRlbXM6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IHtmaWxlLCBwYXRofSA9IGRhdGE7XG4gICAgICAgIGxldCBuYW1lID0gZmlsZS5uYW1lIHx8IHBhdGg7XG4gICAgICAgIHRoaXMuc2VwRWwudG9nZ2xlKGluZGV4IDwgaXRlbXMubGVuZ3RoLTEpO1xuICAgICAgICB0aGlzLm5hbWVFbC50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgICAgIHRoaXMuZWwuZGF0YXNldC5wYXJlbnRQYXRoID0gZmlsZS5wYXJlbnQ/LnBhdGggPz8gXCIvXCI7XG4gICAgICAgIHRoaXMuZWwuZGF0YXNldC5maWxlUGF0aCA9IHBhdGg7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwbG9yZXIgZXh0ZW5kcyBQZXJXaW5kb3dDb21wb25lbnQ8UUU+IHtcbiAgICBsYXN0RmlsZTogVEFic3RyYWN0RmlsZSA9IG51bGw7XG4gICAgbGFzdFBhdGg6IHN0cmluZyA9IG51bGw7XG4gICAgZWw6IEhUTUxFbGVtZW50ID0gPGRpdiBpZD1cInF1aWNrLWV4cGxvcmVyXCIgLz47XG4gICAgbGlzdCA9IGxpc3QodGhpcy5lbCwgRXhwbG9yYWJsZSk7XG4gICAgaXNPcGVuID0gMFxuICAgIGFwcCA9IHRoaXMucGx1Z2luLmFwcDtcblxuICAgIG9ubG9hZCgpIHtcbiAgICAgICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gdGhpcy53aW4uZG9jdW1lbnQuYm9keS5maW5kKFwiLnRpdGxlYmFyIC50aXRsZWJhci1idXR0b24tY29udGFpbmVyLm1vZC1sZWZ0XCIpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyKCgpID0+IHVubW91bnQoYnV0dG9uQ29udGFpbmVyLCB0aGlzKSk7XG4gICAgICAgIG1vdW50KGJ1dHRvbkNvbnRhaW5lciwgdGhpcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50KCkpIHRoaXMudXBkYXRlKHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJyZW5hbWVcIiwgdGhpcy5vbkZpbGVDaGFuZ2UsIHRoaXMpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwiZGVsZXRlXCIsIHRoaXMub25GaWxlRGVsZXRlLCB0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5lbC5vbihcImNvbnRleHRtZW51XCIsIFwiLmV4cGxvcmFibGVcIiwgKGV2ZW50LCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZmlsZVBhdGggfSA9IHRhcmdldC5kYXRhc2V0O1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmaWxlUGF0aCk7XG4gICAgICAgICAgICBuZXcgQ29udGV4dE1lbnUodGhpcy5hcHAsIGZpbGUpLmNhc2NhZGUodGFyZ2V0LCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmVsLm9uKFwiY2xpY2tcIiwgXCIuZXhwbG9yYWJsZVwiLCAoZXZlbnQsIHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb2xkZXJNZW51KHRhcmdldCwgZXZlbnQuaXNUcnVzdGVkICYmIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZWwub24oJ2RyYWdzdGFydCcsIFwiLmV4cGxvcmFibGVcIiwgKGV2ZW50LCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIHN0YXJ0RHJhZyh0aGlzLmFwcCwgdGFyZ2V0LmRhdGFzZXQuZmlsZVBhdGgsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25GaWxlQ2hhbmdlKGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgaWYgKGZpbGUgPT09IHRoaXMubGFzdEZpbGUpIHRoaXMudXBkYXRlKGZpbGUpO1xuICAgIH1cblxuICAgIG9uRmlsZURlbGV0ZShmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmxhc3RGaWxlKSB0aGlzLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIGZvbGRlck1lbnUob3BlbmVyOiBIVE1MRWxlbWVudCA9IHRoaXMuZWwuZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnQsIGV2ZW50PzogTW91c2VFdmVudCkge1xuICAgICAgICBjb25zdCB7IGZpbGVQYXRoLCBwYXJlbnRQYXRoIH0gPSBvcGVuZXIuZGF0YXNldFxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGZvbGRlciA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXJlbnRQYXRoKSBhcyBURm9sZGVyO1xuICAgICAgICB0aGlzLmlzT3BlbisrO1xuICAgICAgICByZXR1cm4gbmV3IEZvbGRlck1lbnUodGhpcy5hcHAsIGZvbGRlciwgc2VsZWN0ZWQsIG9wZW5lcikuY2FzY2FkZShvcGVuZXIsIGV2ZW50LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzT3Blbi0tO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzT3BlbiAmJiB0aGlzLmlzQ3VycmVudCgpKSB0aGlzLnVwZGF0ZSh0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYnJvd3NlVmF1bHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvbGRlck1lbnUoKTtcbiAgICB9XG5cbiAgICBicm93c2VDdXJyZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb2xkZXJNZW51KHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRGl2RWxlbWVudCk7XG4gICAgfVxuXG4gICAgYnJvd3NlRmlsZShmaWxlOiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmxhc3RGaWxlKSByZXR1cm4gdGhpcy5icm93c2VDdXJyZW50KCk7XG4gICAgICAgIGxldCBtZW51OiBGb2xkZXJNZW51O1xuICAgICAgICBsZXQgb3BlbmVyOiBIVE1MRWxlbWVudCA9IHRoaXMuZWwuZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHBhdGggPSBbXSwgcGFydHMgPSBmaWxlLnBhdGguc3BsaXQoXCIvXCIpLmZpbHRlcihwPT5wKTtcbiAgICAgICAgd2hpbGUgKG9wZW5lciAmJiBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChwYXJ0c1swXSk7XG4gICAgICAgICAgICBpZiAob3BlbmVyLmRhdGFzZXQuZmlsZVBhdGggIT09IHBhdGguam9pbihcIi9cIikpIHtcbiAgICAgICAgICAgICAgICBtZW51ID0gdGhpcy5mb2xkZXJNZW51KG9wZW5lcik7XG4gICAgICAgICAgICAgICAgcGF0aC5wb3AoKTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgICAgIG9wZW5lciA9IG9wZW5lci5uZXh0RWxlbWVudFNpYmxpbmcgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKG1lbnUgJiYgcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2gocGFydHMuc2hpZnQoKSk7XG4gICAgICAgICAgICBjb25zdCBpZHggPSBtZW51Lml0ZW1Gb3JQYXRoKHBhdGguam9pbihcIi9cIikpO1xuICAgICAgICAgICAgaWYgKGlkeCA9PSAtMSkgYnJlYWtcbiAgICAgICAgICAgIG1lbnUuc2VsZWN0KGlkeCk7XG4gICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoIHx8IGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgbWVudS5vbkFycm93UmlnaHQoKTtcbiAgICAgICAgICAgICAgICBtZW51ID0gbWVudS5jaGlsZCBhcyBGb2xkZXJNZW51O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZW51O1xuICAgIH1cblxuICAgIGlzQ3VycmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMgPT09IHRoaXMucGx1Z2luLmV4cGxvcmVycy5mb3JMZWFmKHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZik7XG4gICAgfVxuXG4gICAgdXBkYXRlKGZpbGU/OiBUQWJzdHJhY3RGaWxlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzT3BlbikgcmV0dXJuO1xuICAgICAgICBmaWxlID8/PSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCIvXCIpO1xuICAgICAgICBpZiAoZmlsZSA9PSB0aGlzLmxhc3RGaWxlICYmIGZpbGUucGF0aCA9PSB0aGlzLmxhc3RQYXRoKSByZXR1cm47XG4gICAgICAgIHRoaXMubGFzdEZpbGUgPSBmaWxlO1xuICAgICAgICB0aGlzLmxhc3RQYXRoID0gZmlsZS5wYXRoO1xuICAgICAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoZmlsZSkge1xuICAgICAgICAgICAgcGFydHMudW5zaGlmdCh7IGZpbGUsIHBhdGg6IGZpbGUucGF0aCB9KTtcbiAgICAgICAgICAgIGZpbGUgPSBmaWxlLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgdGhpcy5saXN0LnVwZGF0ZShwYXJ0cyk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQge01lbnVJdGVtLCBQbHVnaW4sIFRBYnN0cmFjdEZpbGUsIFRGb2xkZXJ9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHtFeHBsb3JlciwgaG92ZXJTb3VyY2V9IGZyb20gXCIuL0V4cGxvcmVyXCI7XG5cbmltcG9ydCBcIi4vcmVkb20tanN4XCI7XG5pbXBvcnQgXCIuL3N0eWxlcy5zY3NzXCJcblxuZGVjbGFyZSBtb2R1bGUgXCJvYnNpZGlhblwiIHtcbiAgICBpbnRlcmZhY2UgV29ya3NwYWNlIHtcbiAgICAgICAgcmVnaXN0ZXJIb3ZlckxpbmtTb3VyY2Uoc291cmNlOiBzdHJpbmcsIGluZm86IHtkaXNwbGF5OiBzdHJpbmcsIGRlZmF1bHRNb2Q/OiBib29sZWFufSk6IHZvaWRcbiAgICAgICAgdW5yZWdpc3RlckhvdmVyTGlua1NvdXJjZShzb3VyY2U6IHN0cmluZyk6IHZvaWRcbiAgICB9XG4gICAgaW50ZXJmYWNlIE1lbnUge1xuICAgICAgICBzZWN0aW9uczogc3RyaW5nW11cbiAgICB9XG4gICAgaW50ZXJmYWNlIE1lbnVJdGVtIHtcbiAgICAgICAgc2V0U2VjdGlvbj8oc2VjdGlvbjogc3RyaW5nKTogdGhpc1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUUUgZXh0ZW5kcyBQbHVnaW4ge1xuICAgIHN0YXR1c2Jhckl0ZW06IEhUTUxFbGVtZW50XG4gICAgZXhwbG9yZXJzID0gRXhwbG9yZXIucGVyV2luZG93KHRoaXMsIGZhbHNlKTtcblxuICAgIHVwZGF0ZUN1cnJlbnQobGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkge1xuICAgICAgICB0aGlzLmV4cGxvcmVycy5mb3JMZWFmKGxlYWYpLnVwZGF0ZShmaWxlKTtcbiAgICB9XG5cbiAgICBvbmxvYWQoKSB7XG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5yZWdpc3RlckhvdmVyTGlua1NvdXJjZShob3ZlclNvdXJjZSwge1xuICAgICAgICAgICAgZGlzcGxheTogJ1F1aWNrIEV4cGxvcmVyJywgZGVmYXVsdE1vZDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHRoaXMudXBkYXRlQ3VycmVudCgpKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgbGVhZiA9PiB0aGlzLnVwZGF0ZUN1cnJlbnQobGVhZikpKTtcblxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB0aGlzLnVwZGF0ZUN1cnJlbnQoKSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHsgaWQ6IFwiYnJvd3NlLXZhdWx0XCIsICAgbmFtZTogXCJCcm93c2UgdmF1bHRcIiwgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHsgdGhpcy5leHBsb3JlcnMuZm9yV2luZG93KCk/LmJyb3dzZVZhdWx0KCk7IH0sIH0pO1xuICAgICAgICB0aGlzLmFkZENvbW1hbmQoeyBpZDogXCJicm93c2UtY3VycmVudFwiLCBuYW1lOiBcIkJyb3dzZSBjdXJyZW50IGZvbGRlclwiLCBjYWxsYmFjazogKCkgPT4geyB0aGlzLmV4cGxvcmVycy5mb3JXaW5kb3coKT8uYnJvd3NlQ3VycmVudCgpOyB9LCB9KTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1tZW51XCIsIChtZW51LCBmaWxlLCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtOiBNZW51SXRlbVxuICAgICAgICAgICAgaWYgKHNvdXJjZSAhPT0gXCJxdWljay1leHBsb3JlclwiKSBtZW51LmFkZEl0ZW0oaSA9PiB7XG4gICAgICAgICAgICAgICAgaS5zZXRJY29uKFwiZm9sZGVyXCIpLnNldFRpdGxlKFwiU2hvdyBpbiBRdWljayBFeHBsb3JlclwiKS5vbkNsaWNrKGUgPT4geyB0aGlzLmV4cGxvcmVycy5mb3JEb20oaXRlbS5kb20pPy5icm93c2VGaWxlKGZpbGUpOyB9KTtcbiAgICAgICAgICAgICAgICBpdGVtID0gaTtcbiAgICAgICAgICAgICAgICBpdGVtLnNldFNlY3Rpb24/LihcInZpZXdcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXZlYWxGaWxlID0gaTE4bmV4dC50KGBwbHVnaW5zLmZpbGUtZXhwbG9yZXIuYWN0aW9uLXJldmVhbC1maWxlYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gbWVudS5pdGVtcy5maW5kSW5kZXgoaSA9PiBpLnRpdGxlRWw/LnRleHRDb250ZW50ID09PSByZXZlYWxGaWxlKTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoaXMgb25jZSAwLjE1LjMrIGlzIHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgICAgIGlmICghbWVudS5zZWN0aW9ucykgKG1lbnUuZG9tIGFzIEhUTUxFbGVtZW50KS5pbnNlcnRCZWZvcmUoaXRlbS5kb20sIG1lbnUuaXRlbXNbaWR4XS5kb20pO1xuICAgICAgICAgICAgICAgICAgICBtZW51Lml0ZW1zLnJlbW92ZShpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgbWVudS5pdGVtcy5zcGxpY2UoaWR4LCAwLCBpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVEZvbGRlci5wcm90b3R5cGUsIFwiYmFzZW5hbWVcIiwge2dldCgpeyByZXR1cm4gdGhpcy5uYW1lOyB9LCBjb25maWd1cmFibGU6IHRydWV9KVxuICAgIH1cblxuICAgIG9udW5sb2FkKCkge1xuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UudW5yZWdpc3RlckhvdmVyTGlua1NvdXJjZShob3ZlclNvdXJjZSk7XG4gICAgfVxuXG59XG4iXSwibmFtZXMiOlsiTWVudSIsIkFwcCIsImRlYm91bmNlIiwiU2NvcGUiLCJNZW51SXRlbSIsIktleW1hcCIsIlRGb2xkZXIiLCJOb3RpY2UiLCJURmlsZSIsIkNvbXBvbmVudCIsIkZpbGVWaWV3IiwiTWFya2Rvd25WaWV3IiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsU0FBUyxVQUFVLEVBQUUsS0FBSyxFQUFFO0FBQzVCLEVBQUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxFQUFFLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNuQixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNkLEVBQUUsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCO0FBQ0EsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQyxJQUFJLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixJQUFJLElBQUksS0FBSyxLQUFLLEdBQUcsRUFBRTtBQUN2QixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QixLQUFLLE1BQU0sSUFBSSxLQUFLLEtBQUssR0FBRyxFQUFFO0FBQzlCLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDN0IsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU87QUFDVCxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksS0FBSztBQUN6QixJQUFJLEVBQUUsRUFBRSxFQUFFO0FBQ1YsSUFBSSxTQUFTLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDbkMsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0EsU0FBUyxhQUFhLEVBQUUs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QUksRUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztRQUdoRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQVEsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBTSxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUssTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFNLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFNUUsUUFBQSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE1BQU0sUUFBUSxHQUFHLDRCQUE0QixDQUFDO0FBQzlDLFFBQUEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQVEsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FBQztRQUNsRCxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBSSxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xE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

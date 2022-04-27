'use strict';

var obsidian = require('obsidian');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var obsidian__namespace = /*#__PURE__*/_interopNamespace(obsidian);

function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target, node) {
    target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
        const style = element('style');
        style.id = style_sheet_id;
        style.textContent = styles;
        append_stylesheet(append_styles_to, style);
    }
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_svg_attributes(node, attributes) {
    for (const key in attributes) {
        attr(node, key, attributes[key]);
    }
}
function to_number(value) {
    return value === '' ? null : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
    select.selectedIndex = -1; // no option should be selected
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, bubbles = false) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        while (flushidx < dirty_components.length) {
            const component = dirty_components[flushidx];
            flushidx++;
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(child_ctx, dirty);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

var ChoiceType;
(function (ChoiceType) {
    ChoiceType["Capture"] = "Capture";
    ChoiceType["Macro"] = "Macro";
    ChoiceType["Multi"] = "Multi";
    ChoiceType["Template"] = "Template";
})(ChoiceType || (ChoiceType = {}));

/*!
 * Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
var faBars = {
  prefix: 'fas',
  iconName: 'bars',
  icon: [448, 512, [], "f0c9", "M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"]
};
var faBolt = {
  prefix: 'fas',
  iconName: 'bolt',
  icon: [320, 512, [], "f0e7", "M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z"]
};
var faChevronDown = {
  prefix: 'fas',
  iconName: 'chevron-down',
  icon: [448, 512, [], "f078", "M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"]
};
var faCog = {
  prefix: 'fas',
  iconName: 'cog',
  icon: [512, 512, [], "f013", "M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"]
};
var faTrash = {
  prefix: 'fas',
  iconName: 'trash',
  icon: [448, 512, [], "f1f8", "M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"]
};

/* node_modules/svelte-awesome/components/svg/Path.svelte generated by Svelte v3.47.0 */

function create_fragment$g(ctx) {
	let path;
	let path_key_value;

	let path_levels = [
		{
			key: path_key_value = "path-" + /*id*/ ctx[0]
		},
		/*data*/ ctx[1]
	];

	let path_data = {};

	for (let i = 0; i < path_levels.length; i += 1) {
		path_data = assign(path_data, path_levels[i]);
	}

	return {
		c() {
			path = svg_element("path");
			set_svg_attributes(path, path_data);
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, [dirty]) {
			set_svg_attributes(path, path_data = get_spread_update(path_levels, [
				dirty & /*id*/ 1 && path_key_value !== (path_key_value = "path-" + /*id*/ ctx[0]) && { key: path_key_value },
				dirty & /*data*/ 2 && /*data*/ ctx[1]
			]));
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

function instance$g($$self, $$props, $$invalidate) {
	let { id = '' } = $$props;
	let { data = {} } = $$props;

	$$self.$$set = $$props => {
		if ('id' in $$props) $$invalidate(0, id = $$props.id);
		if ('data' in $$props) $$invalidate(1, data = $$props.data);
	};

	return [id, data];
}

class Path extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$g, create_fragment$g, safe_not_equal, { id: 0, data: 1 });
	}
}

/* node_modules/svelte-awesome/components/svg/Polygon.svelte generated by Svelte v3.47.0 */

function create_fragment$f(ctx) {
	let polygon;
	let polygon_key_value;

	let polygon_levels = [
		{
			key: polygon_key_value = "polygon-" + /*id*/ ctx[0]
		},
		/*data*/ ctx[1]
	];

	let polygon_data = {};

	for (let i = 0; i < polygon_levels.length; i += 1) {
		polygon_data = assign(polygon_data, polygon_levels[i]);
	}

	return {
		c() {
			polygon = svg_element("polygon");
			set_svg_attributes(polygon, polygon_data);
		},
		m(target, anchor) {
			insert(target, polygon, anchor);
		},
		p(ctx, [dirty]) {
			set_svg_attributes(polygon, polygon_data = get_spread_update(polygon_levels, [
				dirty & /*id*/ 1 && polygon_key_value !== (polygon_key_value = "polygon-" + /*id*/ ctx[0]) && { key: polygon_key_value },
				dirty & /*data*/ 2 && /*data*/ ctx[1]
			]));
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(polygon);
		}
	};
}

function instance$f($$self, $$props, $$invalidate) {
	let { id = '' } = $$props;
	let { data = {} } = $$props;

	$$self.$$set = $$props => {
		if ('id' in $$props) $$invalidate(0, id = $$props.id);
		if ('data' in $$props) $$invalidate(1, data = $$props.data);
	};

	return [id, data];
}

class Polygon extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$f, create_fragment$f, safe_not_equal, { id: 0, data: 1 });
	}
}

/* node_modules/svelte-awesome/components/svg/Raw.svelte generated by Svelte v3.47.0 */

function create_fragment$e(ctx) {
	let g;

	return {
		c() {
			g = svg_element("g");
		},
		m(target, anchor) {
			insert(target, g, anchor);
			g.innerHTML = /*raw*/ ctx[0];
		},
		p(ctx, [dirty]) {
			if (dirty & /*raw*/ 1) g.innerHTML = /*raw*/ ctx[0];		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(g);
		}
	};
}

function instance$e($$self, $$props, $$invalidate) {
	let cursor = 0xd4937;

	function getId() {
		cursor += 1;
		return `fa-${cursor.toString(16)}`;
	}

	let raw;
	let { data } = $$props;

	function getRaw(data) {
		if (!data || !data.raw) {
			return null;
		}

		let rawData = data.raw;
		const ids = {};

		rawData = rawData.replace(/\s(?:xml:)?id=["']?([^"')\s]+)/g, (match, id) => {
			const uniqueId = getId();
			ids[id] = uniqueId;
			return ` id="${uniqueId}"`;
		});

		rawData = rawData.replace(/#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g, (match, rawId, _, pointerId) => {
			const id = rawId || pointerId;

			if (!id || !ids[id]) {
				return match;
			}

			return `#${ids[id]}`;
		});

		return rawData;
	}

	$$self.$$set = $$props => {
		if ('data' in $$props) $$invalidate(1, data = $$props.data);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*data*/ 2) {
			$$invalidate(0, raw = getRaw(data));
		}
	};

	return [raw, data];
}

class Raw extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$e, create_fragment$e, safe_not_equal, { data: 1 });
	}
}

/* node_modules/svelte-awesome/components/svg/Svg.svelte generated by Svelte v3.47.0 */

function add_css$9(target) {
	append_styles(target, "svelte-1dof0an", ".fa-icon.svelte-1dof0an{display:inline-block;fill:currentColor}.fa-flip-horizontal.svelte-1dof0an{transform:scale(-1, 1)}.fa-flip-vertical.svelte-1dof0an{transform:scale(1, -1)}.fa-spin.svelte-1dof0an{animation:svelte-1dof0an-fa-spin 1s 0s infinite linear}.fa-inverse.svelte-1dof0an{color:#fff}.fa-pulse.svelte-1dof0an{animation:svelte-1dof0an-fa-spin 1s infinite steps(8)}@keyframes svelte-1dof0an-fa-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}");
}

function create_fragment$d(ctx) {
	let svg;
	let svg_class_value;
	let svg_role_value;
	let current;
	const default_slot_template = /*#slots*/ ctx[13].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

	return {
		c() {
			svg = svg_element("svg");
			if (default_slot) default_slot.c();
			attr(svg, "version", "1.1");
			attr(svg, "class", svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-1dof0an");
			attr(svg, "x", /*x*/ ctx[8]);
			attr(svg, "y", /*y*/ ctx[9]);
			attr(svg, "width", /*width*/ ctx[1]);
			attr(svg, "height", /*height*/ ctx[2]);
			attr(svg, "aria-label", /*label*/ ctx[11]);
			attr(svg, "role", svg_role_value = /*label*/ ctx[11] ? 'img' : 'presentation');
			attr(svg, "viewBox", /*box*/ ctx[3]);
			attr(svg, "style", /*style*/ ctx[10]);
			toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
			toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
			toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
			toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === 'horizontal');
			toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === 'vertical');
		},
		m(target, anchor) {
			insert(target, svg, anchor);

			if (default_slot) {
				default_slot.m(svg, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[12],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*className*/ 1 && svg_class_value !== (svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-1dof0an")) {
				attr(svg, "class", svg_class_value);
			}

			if (!current || dirty & /*x*/ 256) {
				attr(svg, "x", /*x*/ ctx[8]);
			}

			if (!current || dirty & /*y*/ 512) {
				attr(svg, "y", /*y*/ ctx[9]);
			}

			if (!current || dirty & /*width*/ 2) {
				attr(svg, "width", /*width*/ ctx[1]);
			}

			if (!current || dirty & /*height*/ 4) {
				attr(svg, "height", /*height*/ ctx[2]);
			}

			if (!current || dirty & /*label*/ 2048) {
				attr(svg, "aria-label", /*label*/ ctx[11]);
			}

			if (!current || dirty & /*label*/ 2048 && svg_role_value !== (svg_role_value = /*label*/ ctx[11] ? 'img' : 'presentation')) {
				attr(svg, "role", svg_role_value);
			}

			if (!current || dirty & /*box*/ 8) {
				attr(svg, "viewBox", /*box*/ ctx[3]);
			}

			if (!current || dirty & /*style*/ 1024) {
				attr(svg, "style", /*style*/ ctx[10]);
			}

			if (dirty & /*className, spin*/ 17) {
				toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
			}

			if (dirty & /*className, pulse*/ 65) {
				toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
			}

			if (dirty & /*className, inverse*/ 33) {
				toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
			}

			if (dirty & /*className, flip*/ 129) {
				toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === 'horizontal');
			}

			if (dirty & /*className, flip*/ 129) {
				toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === 'vertical');
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(svg);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance$d($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { class: className } = $$props;
	let { width } = $$props;
	let { height } = $$props;
	let { box } = $$props;
	let { spin = false } = $$props;
	let { inverse = false } = $$props;
	let { pulse = false } = $$props;
	let { flip = null } = $$props;
	let { x = undefined } = $$props;
	let { y = undefined } = $$props;
	let { style = undefined } = $$props;
	let { label = undefined } = $$props;

	$$self.$$set = $$props => {
		if ('class' in $$props) $$invalidate(0, className = $$props.class);
		if ('width' in $$props) $$invalidate(1, width = $$props.width);
		if ('height' in $$props) $$invalidate(2, height = $$props.height);
		if ('box' in $$props) $$invalidate(3, box = $$props.box);
		if ('spin' in $$props) $$invalidate(4, spin = $$props.spin);
		if ('inverse' in $$props) $$invalidate(5, inverse = $$props.inverse);
		if ('pulse' in $$props) $$invalidate(6, pulse = $$props.pulse);
		if ('flip' in $$props) $$invalidate(7, flip = $$props.flip);
		if ('x' in $$props) $$invalidate(8, x = $$props.x);
		if ('y' in $$props) $$invalidate(9, y = $$props.y);
		if ('style' in $$props) $$invalidate(10, style = $$props.style);
		if ('label' in $$props) $$invalidate(11, label = $$props.label);
		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
	};

	return [
		className,
		width,
		height,
		box,
		spin,
		inverse,
		pulse,
		flip,
		x,
		y,
		style,
		label,
		$$scope,
		slots
	];
}

class Svg extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$d,
			create_fragment$d,
			safe_not_equal,
			{
				class: 0,
				width: 1,
				height: 2,
				box: 3,
				spin: 4,
				inverse: 5,
				pulse: 6,
				flip: 7,
				x: 8,
				y: 9,
				style: 10,
				label: 11
			},
			add_css$9
		);
	}
}

/* node_modules/svelte-awesome/components/Icon.svelte generated by Svelte v3.47.0 */

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[24] = list[i];
	child_ctx[26] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[27] = list[i];
	child_ctx[26] = i;
	return child_ctx;
}

// (4:4) {#if self}
function create_if_block$4(ctx) {
	let t0;
	let t1;
	let if_block2_anchor;
	let current;
	let if_block0 = /*self*/ ctx[0].paths && create_if_block_3(ctx);
	let if_block1 = /*self*/ ctx[0].polygons && create_if_block_2$1(ctx);
	let if_block2 = /*self*/ ctx[0].raw && create_if_block_1$2(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			if_block2_anchor = empty();
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t1, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert(target, if_block2_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (/*self*/ ctx[0].paths) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*self*/ 1) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*self*/ ctx[0].polygons) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*self*/ 1) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_2$1(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(t1.parentNode, t1);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (/*self*/ ctx[0].raw) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*self*/ 1) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block_1$2(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(if_block2);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(if_block2);
			current = false;
		},
		d(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t0);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(t1);
			if (if_block2) if_block2.d(detaching);
			if (detaching) detach(if_block2_anchor);
		}
	};
}

// (5:6) {#if self.paths}
function create_if_block_3(ctx) {
	let each_1_anchor;
	let current;
	let each_value_1 = /*self*/ ctx[0].paths;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*self*/ 1) {
				each_value_1 = /*self*/ ctx[0].paths;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

// (6:8) {#each self.paths as path, i}
function create_each_block_1(ctx) {
	let path;
	let current;

	path = new Path({
			props: {
				id: /*i*/ ctx[26],
				data: /*path*/ ctx[27]
			}
		});

	return {
		c() {
			create_component(path.$$.fragment);
		},
		m(target, anchor) {
			mount_component(path, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const path_changes = {};
			if (dirty & /*self*/ 1) path_changes.data = /*path*/ ctx[27];
			path.$set(path_changes);
		},
		i(local) {
			if (current) return;
			transition_in(path.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(path.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(path, detaching);
		}
	};
}

// (10:6) {#if self.polygons}
function create_if_block_2$1(ctx) {
	let each_1_anchor;
	let current;
	let each_value = /*self*/ ctx[0].polygons;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*self*/ 1) {
				each_value = /*self*/ ctx[0].polygons;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

// (11:8) {#each self.polygons as polygon, i}
function create_each_block$3(ctx) {
	let polygon;
	let current;

	polygon = new Polygon({
			props: {
				id: /*i*/ ctx[26],
				data: /*polygon*/ ctx[24]
			}
		});

	return {
		c() {
			create_component(polygon.$$.fragment);
		},
		m(target, anchor) {
			mount_component(polygon, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const polygon_changes = {};
			if (dirty & /*self*/ 1) polygon_changes.data = /*polygon*/ ctx[24];
			polygon.$set(polygon_changes);
		},
		i(local) {
			if (current) return;
			transition_in(polygon.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(polygon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(polygon, detaching);
		}
	};
}

// (15:6) {#if self.raw}
function create_if_block_1$2(ctx) {
	let raw;
	let updating_data;
	let current;

	function raw_data_binding(value) {
		/*raw_data_binding*/ ctx[15](value);
	}

	let raw_props = {};

	if (/*self*/ ctx[0] !== void 0) {
		raw_props.data = /*self*/ ctx[0];
	}

	raw = new Raw({ props: raw_props });
	binding_callbacks.push(() => bind(raw, 'data', raw_data_binding));

	return {
		c() {
			create_component(raw.$$.fragment);
		},
		m(target, anchor) {
			mount_component(raw, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const raw_changes = {};

			if (!updating_data && dirty & /*self*/ 1) {
				updating_data = true;
				raw_changes.data = /*self*/ ctx[0];
				add_flush_callback(() => updating_data = false);
			}

			raw.$set(raw_changes);
		},
		i(local) {
			if (current) return;
			transition_in(raw.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(raw.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(raw, detaching);
		}
	};
}

// (3:8)      
function fallback_block(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*self*/ ctx[0] && create_if_block$4(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (/*self*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*self*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (1:0) <Svg label={label} width={width} height={height} box={box} style={combinedStyle}   spin={spin} flip={flip} inverse={inverse} pulse={pulse} class={className}>
function create_default_slot(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[14].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
	const default_slot_or_fallback = default_slot || fallback_block(ctx);

	return {
		c() {
			if (default_slot_or_fallback) default_slot_or_fallback.c();
		},
		m(target, anchor) {
			if (default_slot_or_fallback) {
				default_slot_or_fallback.m(target, anchor);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[16],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
						null
					);
				}
			} else {
				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*self*/ 1)) {
					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot_or_fallback, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot_or_fallback, local);
			current = false;
		},
		d(detaching) {
			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
		}
	};
}

function create_fragment$c(ctx) {
	let svg;
	let current;

	svg = new Svg({
			props: {
				label: /*label*/ ctx[6],
				width: /*width*/ ctx[7],
				height: /*height*/ ctx[8],
				box: /*box*/ ctx[10],
				style: /*combinedStyle*/ ctx[9],
				spin: /*spin*/ ctx[2],
				flip: /*flip*/ ctx[5],
				inverse: /*inverse*/ ctx[3],
				pulse: /*pulse*/ ctx[4],
				class: /*className*/ ctx[1],
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			create_component(svg.$$.fragment);
		},
		m(target, anchor) {
			mount_component(svg, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const svg_changes = {};
			if (dirty & /*label*/ 64) svg_changes.label = /*label*/ ctx[6];
			if (dirty & /*width*/ 128) svg_changes.width = /*width*/ ctx[7];
			if (dirty & /*height*/ 256) svg_changes.height = /*height*/ ctx[8];
			if (dirty & /*box*/ 1024) svg_changes.box = /*box*/ ctx[10];
			if (dirty & /*combinedStyle*/ 512) svg_changes.style = /*combinedStyle*/ ctx[9];
			if (dirty & /*spin*/ 4) svg_changes.spin = /*spin*/ ctx[2];
			if (dirty & /*flip*/ 32) svg_changes.flip = /*flip*/ ctx[5];
			if (dirty & /*inverse*/ 8) svg_changes.inverse = /*inverse*/ ctx[3];
			if (dirty & /*pulse*/ 16) svg_changes.pulse = /*pulse*/ ctx[4];
			if (dirty & /*className*/ 2) svg_changes.class = /*className*/ ctx[1];

			if (dirty & /*$$scope, self*/ 65537) {
				svg_changes.$$scope = { dirty, ctx };
			}

			svg.$set(svg_changes);
		},
		i(local) {
			if (current) return;
			transition_in(svg.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(svg.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(svg, detaching);
		}
	};
}
let outerScale = 1;

function normaliseData(data) {
	if ('iconName' in data && 'icon' in data) {
		let normalisedData = {};
		let faIcon = data.icon;
		let name = data.iconName;
		let width = faIcon[0];
		let height = faIcon[1];
		let paths = faIcon[4];
		let iconData = { width, height, paths: [{ d: paths }] };
		normalisedData[name] = iconData;
		return normalisedData;
	}

	return data;
}

function instance$c($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { class: className = "" } = $$props;
	let { data } = $$props;
	let { scale = 1 } = $$props;
	let { spin = false } = $$props;
	let { inverse = false } = $$props;
	let { pulse = false } = $$props;
	let { flip = null } = $$props;
	let { label = null } = $$props;
	let { self = null } = $$props;
	let { style = null } = $$props;
	let width;
	let height;
	let combinedStyle;
	let box;

	function init() {
		if (typeof data === 'undefined') {
			return;
		}

		const normalisedData = normaliseData(data);
		const [name] = Object.keys(normalisedData);
		const icon = normalisedData[name];

		if (!icon.paths) {
			icon.paths = [];
		}

		if (icon.d) {
			icon.paths.push({ d: icon.d });
		}

		if (!icon.polygons) {
			icon.polygons = [];
		}

		if (icon.points) {
			icon.polygons.push({ points: icon.points });
		}

		$$invalidate(0, self = icon);
	}

	function normalisedScale() {
		let numScale = 1;

		if (typeof scale !== 'undefined') {
			numScale = Number(scale);
		}

		if (isNaN(numScale) || numScale <= 0) {
			// eslint-disable-line no-restricted-globals
			console.warn('Invalid prop: prop "scale" should be a number over 0.'); // eslint-disable-line no-console

			return outerScale;
		}

		return numScale * outerScale;
	}

	function calculateBox() {
		if (self) {
			return `0 0 ${self.width} ${self.height}`;
		}

		return `0 0 ${width} ${height}`;
	}

	function calculateRatio() {
		if (!self) {
			return 1;
		}

		return Math.max(self.width, self.height) / 16;
	}

	function calculateWidth() {

		if (self) {
			return self.width / calculateRatio() * normalisedScale();
		}

		return 0;
	}

	function calculateHeight() {

		if (self) {
			return self.height / calculateRatio() * normalisedScale();
		}

		return 0;
	}

	function calculateStyle() {
		let combined = "";

		if (style !== null) {
			combined += style;
		}

		let size = normalisedScale();

		if (size === 1) {
			if (combined.length === 0) {
				return undefined;
			}

			return combined;
		}

		if (combined !== "" && !combined.endsWith(';')) {
			combined += '; ';
		}

		return `${combined}font-size: ${size}em`;
	}

	function raw_data_binding(value) {
		self = value;
		$$invalidate(0, self);
	}

	$$self.$$set = $$props => {
		if ('class' in $$props) $$invalidate(1, className = $$props.class);
		if ('data' in $$props) $$invalidate(11, data = $$props.data);
		if ('scale' in $$props) $$invalidate(12, scale = $$props.scale);
		if ('spin' in $$props) $$invalidate(2, spin = $$props.spin);
		if ('inverse' in $$props) $$invalidate(3, inverse = $$props.inverse);
		if ('pulse' in $$props) $$invalidate(4, pulse = $$props.pulse);
		if ('flip' in $$props) $$invalidate(5, flip = $$props.flip);
		if ('label' in $$props) $$invalidate(6, label = $$props.label);
		if ('self' in $$props) $$invalidate(0, self = $$props.self);
		if ('style' in $$props) $$invalidate(13, style = $$props.style);
		if ('$$scope' in $$props) $$invalidate(16, $$scope = $$props.$$scope);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*data, style, scale*/ 14336) {
			{
				init();
				$$invalidate(7, width = calculateWidth());
				$$invalidate(8, height = calculateHeight());
				$$invalidate(9, combinedStyle = calculateStyle());
				$$invalidate(10, box = calculateBox());
			}
		}
	};

	return [
		self,
		className,
		spin,
		inverse,
		pulse,
		flip,
		label,
		width,
		height,
		combinedStyle,
		box,
		data,
		scale,
		style,
		slots,
		raw_data_binding,
		$$scope
	];
}

class Icon extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
			class: 1,
			data: 11,
			scale: 12,
			spin: 2,
			inverse: 3,
			pulse: 4,
			flip: 5,
			label: 6,
			self: 0,
			style: 13
		});
	}
}

/* src/gui/choiceList/ChoiceItemRightButtons.svelte generated by Svelte v3.47.0 */

function add_css$8(target) {
	append_styles(target, "svelte-a47k80", ".rightButtonsContainer.svelte-a47k80{display:flex;align-items:center;gap:8px}.clickable.svelte-a47k80:hover{cursor:pointer}.alignIconInDivInMiddle.svelte-a47k80{display:flex;align-items:center}");
}

// (24:4) {#if showConfigureButton}
function create_if_block$3(ctx) {
	let div;
	let icon;
	let div_aria_label_value;
	let current;
	let mounted;
	let dispose;
	icon = new Icon({ props: { data: faCog } });

	return {
		c() {
			div = element("div");
			create_component(icon.$$.fragment);
			attr(div, "class", "alignIconInDivInMiddle clickable svelte-a47k80");
			attr(div, "aria-label", div_aria_label_value = `Configure${/*choiceName*/ ctx[3] ? " " + /*choiceName*/ ctx[3] : ""}`);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(icon, div, null);
			current = true;

			if (!mounted) {
				dispose = listen(div, "click", /*emitConfigureChoice*/ ctx[5]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (!current || dirty & /*choiceName*/ 8 && div_aria_label_value !== (div_aria_label_value = `Configure${/*choiceName*/ ctx[3] ? " " + /*choiceName*/ ctx[3] : ""}`)) {
				attr(div, "aria-label", div_aria_label_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(icon.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(icon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(icon);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$b(ctx) {
	let div3;
	let div0;
	let icon0;
	let div0_aria_label_value;
	let div0_style_value;
	let t0;
	let t1;
	let div1;
	let icon1;
	let div1_aria_label_value;
	let t2;
	let div2;
	let icon2;
	let div2_tabindex_value;
	let div2_style_value;
	let current;
	let mounted;
	let dispose;
	icon0 = new Icon({ props: { data: faBolt } });
	let if_block = /*showConfigureButton*/ ctx[1] && create_if_block$3(ctx);
	icon1 = new Icon({ props: { data: faTrash } });
	icon2 = new Icon({ props: { data: faBars } });

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			create_component(icon0.$$.fragment);
			t0 = space();
			if (if_block) if_block.c();
			t1 = space();
			div1 = element("div");
			create_component(icon1.$$.fragment);
			t2 = space();
			div2 = element("div");
			create_component(icon2.$$.fragment);
			attr(div0, "class", "alignIconInDivInMiddle clickable svelte-a47k80");

			attr(div0, "aria-label", div0_aria_label_value = `${/*commandEnabled*/ ctx[2] ? "Remove" : "Add"} command${/*choiceName*/ ctx[3]
			? " for " + /*choiceName*/ ctx[3]
			: ""}`);

			attr(div0, "style", div0_style_value = /*commandEnabled*/ ctx[2] ? "color: #FDD023;" : "");
			attr(div1, "aria-label", div1_aria_label_value = `Delete${/*choiceName*/ ctx[3] ? " " + /*choiceName*/ ctx[3] : ""}`);
			attr(div1, "class", "alignIconInDivInMiddle clickable svelte-a47k80");
			attr(div2, "tabindex", div2_tabindex_value = /*dragDisabled*/ ctx[0] ? 0 : -1);
			attr(div2, "aria-label", "Drag-handle");

			attr(div2, "style", div2_style_value = "" + ((/*dragDisabled*/ ctx[0]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"));

			attr(div2, "class", "alignIconInDivInMiddle svelte-a47k80");
			attr(div3, "class", "rightButtonsContainer svelte-a47k80");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			mount_component(icon0, div0, null);
			append(div3, t0);
			if (if_block) if_block.m(div3, null);
			append(div3, t1);
			append(div3, div1);
			mount_component(icon1, div1, null);
			append(div3, t2);
			append(div3, div2);
			mount_component(icon2, div2, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen(div0, "click", /*emitToggleCommand*/ ctx[6]),
					listen(div1, "click", /*emitDeleteChoice*/ ctx[4]),
					listen(div2, "mousedown", /*mousedown_handler*/ ctx[7]),
					listen(div2, "touchstart", /*touchstart_handler*/ ctx[8])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (!current || dirty & /*commandEnabled, choiceName*/ 12 && div0_aria_label_value !== (div0_aria_label_value = `${/*commandEnabled*/ ctx[2] ? "Remove" : "Add"} command${/*choiceName*/ ctx[3]
			? " for " + /*choiceName*/ ctx[3]
			: ""}`)) {
				attr(div0, "aria-label", div0_aria_label_value);
			}

			if (!current || dirty & /*commandEnabled*/ 4 && div0_style_value !== (div0_style_value = /*commandEnabled*/ ctx[2] ? "color: #FDD023;" : "")) {
				attr(div0, "style", div0_style_value);
			}

			if (/*showConfigureButton*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*showConfigureButton*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div3, t1);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (!current || dirty & /*choiceName*/ 8 && div1_aria_label_value !== (div1_aria_label_value = `Delete${/*choiceName*/ ctx[3] ? " " + /*choiceName*/ ctx[3] : ""}`)) {
				attr(div1, "aria-label", div1_aria_label_value);
			}

			if (!current || dirty & /*dragDisabled*/ 1 && div2_tabindex_value !== (div2_tabindex_value = /*dragDisabled*/ ctx[0] ? 0 : -1)) {
				attr(div2, "tabindex", div2_tabindex_value);
			}

			if (!current || dirty & /*dragDisabled*/ 1 && div2_style_value !== (div2_style_value = "" + ((/*dragDisabled*/ ctx[0]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"))) {
				attr(div2, "style", div2_style_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(icon0.$$.fragment, local);
			transition_in(if_block);
			transition_in(icon1.$$.fragment, local);
			transition_in(icon2.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(icon0.$$.fragment, local);
			transition_out(if_block);
			transition_out(icon1.$$.fragment, local);
			transition_out(icon2.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div3);
			destroy_component(icon0);
			if (if_block) if_block.d();
			destroy_component(icon1);
			destroy_component(icon2);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$b($$self, $$props, $$invalidate) {
	let { dragDisabled } = $$props;
	let { showConfigureButton = true } = $$props;
	let { commandEnabled = false } = $$props;
	let { choiceName = "" } = $$props;
	const dispatcher = createEventDispatcher();

	function emitDeleteChoice() {
		dispatcher('deleteChoice');
	}

	function emitConfigureChoice() {
		dispatcher('configureChoice');
	}

	function emitToggleCommand() {
		dispatcher('toggleCommand');
	}

	function mousedown_handler(event) {
		bubble.call(this, $$self, event);
	}

	function touchstart_handler(event) {
		bubble.call(this, $$self, event);
	}

	$$self.$$set = $$props => {
		if ('dragDisabled' in $$props) $$invalidate(0, dragDisabled = $$props.dragDisabled);
		if ('showConfigureButton' in $$props) $$invalidate(1, showConfigureButton = $$props.showConfigureButton);
		if ('commandEnabled' in $$props) $$invalidate(2, commandEnabled = $$props.commandEnabled);
		if ('choiceName' in $$props) $$invalidate(3, choiceName = $$props.choiceName);
	};

	return [
		dragDisabled,
		showConfigureButton,
		commandEnabled,
		choiceName,
		emitDeleteChoice,
		emitConfigureChoice,
		emitToggleCommand,
		mousedown_handler,
		touchstart_handler
	];
}

class ChoiceItemRightButtons extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$b,
			create_fragment$b,
			safe_not_equal,
			{
				dragDisabled: 0,
				showConfigureButton: 1,
				commandEnabled: 2,
				choiceName: 3
			},
			add_css$8
		);
	}
}

/* src/gui/choiceList/ChoiceListItem.svelte generated by Svelte v3.47.0 */

function add_css$7(target) {
	append_styles(target, "svelte-1vcfikc", ".choiceListItem.svelte-1vcfikc{display:flex;font-size:16px;align-items:center;margin:12px 0 0 0;transition:1000ms ease-in-out}.choiceListItemName.svelte-1vcfikc{flex:1 0 0}");
}

function create_fragment$a(ctx) {
	let div;
	let span;
	let t0_value = /*choice*/ ctx[0].name + "";
	let t0;
	let t1;
	let rightbuttons;
	let updating_choiceName;
	let updating_commandEnabled;
	let updating_showConfigureButton;
	let updating_dragDisabled;
	let current;

	function rightbuttons_choiceName_binding(value) {
		/*rightbuttons_choiceName_binding*/ ctx[6](value);
	}

	function rightbuttons_commandEnabled_binding(value) {
		/*rightbuttons_commandEnabled_binding*/ ctx[7](value);
	}

	function rightbuttons_showConfigureButton_binding(value) {
		/*rightbuttons_showConfigureButton_binding*/ ctx[8](value);
	}

	function rightbuttons_dragDisabled_binding(value) {
		/*rightbuttons_dragDisabled_binding*/ ctx[9](value);
	}

	let rightbuttons_props = {};

	if (/*choice*/ ctx[0].name !== void 0) {
		rightbuttons_props.choiceName = /*choice*/ ctx[0].name;
	}

	if (/*choice*/ ctx[0].command !== void 0) {
		rightbuttons_props.commandEnabled = /*choice*/ ctx[0].command;
	}

	if (/*showConfigureButton*/ ctx[2] !== void 0) {
		rightbuttons_props.showConfigureButton = /*showConfigureButton*/ ctx[2];
	}

	if (/*dragDisabled*/ ctx[1] !== void 0) {
		rightbuttons_props.dragDisabled = /*dragDisabled*/ ctx[1];
	}

	rightbuttons = new ChoiceItemRightButtons({ props: rightbuttons_props });
	binding_callbacks.push(() => bind(rightbuttons, 'choiceName', rightbuttons_choiceName_binding));
	binding_callbacks.push(() => bind(rightbuttons, 'commandEnabled', rightbuttons_commandEnabled_binding));
	binding_callbacks.push(() => bind(rightbuttons, 'showConfigureButton', rightbuttons_showConfigureButton_binding));
	binding_callbacks.push(() => bind(rightbuttons, 'dragDisabled', rightbuttons_dragDisabled_binding));
	rightbuttons.$on("mousedown", /*mousedown_handler*/ ctx[10]);
	rightbuttons.$on("touchstart", /*touchstart_handler*/ ctx[11]);
	rightbuttons.$on("deleteChoice", /*deleteChoice*/ ctx[3]);
	rightbuttons.$on("configureChoice", /*configureChoice*/ ctx[4]);
	rightbuttons.$on("toggleCommand", /*toggleCommandForChoice*/ ctx[5]);

	return {
		c() {
			div = element("div");
			span = element("span");
			t0 = text(t0_value);
			t1 = space();
			create_component(rightbuttons.$$.fragment);
			attr(span, "class", "choiceListItemName svelte-1vcfikc");
			attr(div, "class", "choiceListItem svelte-1vcfikc");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span);
			append(span, t0);
			append(div, t1);
			mount_component(rightbuttons, div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			if ((!current || dirty & /*choice*/ 1) && t0_value !== (t0_value = /*choice*/ ctx[0].name + "")) set_data(t0, t0_value);
			const rightbuttons_changes = {};

			if (!updating_choiceName && dirty & /*choice*/ 1) {
				updating_choiceName = true;
				rightbuttons_changes.choiceName = /*choice*/ ctx[0].name;
				add_flush_callback(() => updating_choiceName = false);
			}

			if (!updating_commandEnabled && dirty & /*choice*/ 1) {
				updating_commandEnabled = true;
				rightbuttons_changes.commandEnabled = /*choice*/ ctx[0].command;
				add_flush_callback(() => updating_commandEnabled = false);
			}

			if (!updating_showConfigureButton && dirty & /*showConfigureButton*/ 4) {
				updating_showConfigureButton = true;
				rightbuttons_changes.showConfigureButton = /*showConfigureButton*/ ctx[2];
				add_flush_callback(() => updating_showConfigureButton = false);
			}

			if (!updating_dragDisabled && dirty & /*dragDisabled*/ 2) {
				updating_dragDisabled = true;
				rightbuttons_changes.dragDisabled = /*dragDisabled*/ ctx[1];
				add_flush_callback(() => updating_dragDisabled = false);
			}

			rightbuttons.$set(rightbuttons_changes);
		},
		i(local) {
			if (current) return;
			transition_in(rightbuttons.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(rightbuttons.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(rightbuttons);
		}
	};
}

function instance$a($$self, $$props, $$invalidate) {
	let { choice } = $$props;
	let { dragDisabled } = $$props;
	let showConfigureButton = true;
	const dispatcher = createEventDispatcher();

	function deleteChoice() {
		dispatcher('deleteChoice', { choice });
	}

	function configureChoice() {
		dispatcher('configureChoice', { choice });
	}

	function toggleCommandForChoice() {
		dispatcher('toggleCommand', { choice });
	}

	function rightbuttons_choiceName_binding(value) {
		if ($$self.$$.not_equal(choice.name, value)) {
			choice.name = value;
			$$invalidate(0, choice);
		}
	}

	function rightbuttons_commandEnabled_binding(value) {
		if ($$self.$$.not_equal(choice.command, value)) {
			choice.command = value;
			$$invalidate(0, choice);
		}
	}

	function rightbuttons_showConfigureButton_binding(value) {
		showConfigureButton = value;
		$$invalidate(2, showConfigureButton);
	}

	function rightbuttons_dragDisabled_binding(value) {
		dragDisabled = value;
		$$invalidate(1, dragDisabled);
	}

	function mousedown_handler(event) {
		bubble.call(this, $$self, event);
	}

	function touchstart_handler(event) {
		bubble.call(this, $$self, event);
	}

	$$self.$$set = $$props => {
		if ('choice' in $$props) $$invalidate(0, choice = $$props.choice);
		if ('dragDisabled' in $$props) $$invalidate(1, dragDisabled = $$props.dragDisabled);
	};

	return [
		choice,
		dragDisabled,
		showConfigureButton,
		deleteChoice,
		configureChoice,
		toggleCommandForChoice,
		rightbuttons_choiceName_binding,
		rightbuttons_commandEnabled_binding,
		rightbuttons_showConfigureButton_binding,
		rightbuttons_dragDisabled_binding,
		mousedown_handler,
		touchstart_handler
	];
}

class ChoiceListItem extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$a, create_fragment$a, safe_not_equal, { choice: 0, dragDisabled: 1 }, add_css$7);
	}
}

/* src/gui/choiceList/MultiChoiceListItem.svelte generated by Svelte v3.47.0 */

function add_css$6(target) {
	append_styles(target, "svelte-na99np", ".multiChoiceListItem.svelte-na99np{display:flex;font-size:16px;align-items:center;margin:12px 0 0 0}.clickable.svelte-na99np:hover{cursor:pointer}.multiChoiceListItemName.svelte-na99np{flex:1 0 0;margin-left:5px}.nestedChoiceList.svelte-na99np{padding-left:25px}");
}

// (43:4) {#if !collapseId || (collapseId && choice.id !== collapseId)}
function create_if_block$2(ctx) {
	let if_block_anchor;
	let current;
	let if_block = !/*choice*/ ctx[0].collapsed && create_if_block_1$1(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (!/*choice*/ ctx[0].collapsed) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*choice*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (44:8) {#if !choice.collapsed}
function create_if_block_1$1(ctx) {
	let div;
	let choicelist;
	let updating_multiChoice;
	let updating_choices;
	let current;

	function choicelist_multiChoice_binding(value) {
		/*choicelist_multiChoice_binding*/ ctx[14](value);
	}

	function choicelist_choices_binding(value) {
		/*choicelist_choices_binding*/ ctx[15](value);
	}

	let choicelist_props = {};

	if (/*choice*/ ctx[0] !== void 0) {
		choicelist_props.multiChoice = /*choice*/ ctx[0];
	}

	if (/*choice*/ ctx[0].choices !== void 0) {
		choicelist_props.choices = /*choice*/ ctx[0].choices;
	}

	choicelist = new ChoiceList({ props: choicelist_props });
	binding_callbacks.push(() => bind(choicelist, 'multiChoice', choicelist_multiChoice_binding));
	binding_callbacks.push(() => bind(choicelist, 'choices', choicelist_choices_binding));
	choicelist.$on("deleteChoice", /*deleteChoice_handler*/ ctx[16]);
	choicelist.$on("configureChoice", /*configureChoice_handler*/ ctx[17]);
	choicelist.$on("toggleCommand", /*toggleCommand_handler*/ ctx[18]);

	return {
		c() {
			div = element("div");
			create_component(choicelist.$$.fragment);
			attr(div, "class", "nestedChoiceList svelte-na99np");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(choicelist, div, null);
			current = true;
		},
		p(ctx, dirty) {
			const choicelist_changes = {};

			if (!updating_multiChoice && dirty & /*choice*/ 1) {
				updating_multiChoice = true;
				choicelist_changes.multiChoice = /*choice*/ ctx[0];
				add_flush_callback(() => updating_multiChoice = false);
			}

			if (!updating_choices && dirty & /*choice*/ 1) {
				updating_choices = true;
				choicelist_changes.choices = /*choice*/ ctx[0].choices;
				add_flush_callback(() => updating_choices = false);
			}

			choicelist.$set(choicelist_changes);
		},
		i(local) {
			if (current) return;
			transition_in(choicelist.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(choicelist.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(choicelist);
		}
	};
}

function create_fragment$9(ctx) {
	let div2;
	let div1;
	let div0;
	let icon;
	let t0;
	let span;
	let t1_value = /*choice*/ ctx[0].name + "";
	let t1;
	let t2;
	let rightbuttons;
	let updating_showConfigureButton;
	let updating_dragDisabled;
	let updating_choiceName;
	let updating_commandEnabled;
	let t3;
	let current;
	let mounted;
	let dispose;

	icon = new Icon({
			props: {
				data: faChevronDown,
				style: `transform:rotate(${/*choice*/ ctx[0].collapsed ? -180 : 0}deg)`
			}
		});

	function rightbuttons_showConfigureButton_binding(value) {
		/*rightbuttons_showConfigureButton_binding*/ ctx[8](value);
	}

	function rightbuttons_dragDisabled_binding(value) {
		/*rightbuttons_dragDisabled_binding*/ ctx[9](value);
	}

	function rightbuttons_choiceName_binding(value) {
		/*rightbuttons_choiceName_binding*/ ctx[10](value);
	}

	function rightbuttons_commandEnabled_binding(value) {
		/*rightbuttons_commandEnabled_binding*/ ctx[11](value);
	}

	let rightbuttons_props = {};

	if (/*showConfigureButton*/ ctx[3] !== void 0) {
		rightbuttons_props.showConfigureButton = /*showConfigureButton*/ ctx[3];
	}

	if (/*dragDisabled*/ ctx[1] !== void 0) {
		rightbuttons_props.dragDisabled = /*dragDisabled*/ ctx[1];
	}

	if (/*choice*/ ctx[0].name !== void 0) {
		rightbuttons_props.choiceName = /*choice*/ ctx[0].name;
	}

	if (/*choice*/ ctx[0].command !== void 0) {
		rightbuttons_props.commandEnabled = /*choice*/ ctx[0].command;
	}

	rightbuttons = new ChoiceItemRightButtons({ props: rightbuttons_props });
	binding_callbacks.push(() => bind(rightbuttons, 'showConfigureButton', rightbuttons_showConfigureButton_binding));
	binding_callbacks.push(() => bind(rightbuttons, 'dragDisabled', rightbuttons_dragDisabled_binding));
	binding_callbacks.push(() => bind(rightbuttons, 'choiceName', rightbuttons_choiceName_binding));
	binding_callbacks.push(() => bind(rightbuttons, 'commandEnabled', rightbuttons_commandEnabled_binding));
	rightbuttons.$on("mousedown", /*mousedown_handler*/ ctx[12]);
	rightbuttons.$on("touchstart", /*touchstart_handler*/ ctx[13]);
	rightbuttons.$on("deleteChoice", /*deleteChoice*/ ctx[4]);
	rightbuttons.$on("configureChoice", /*configureChoice*/ ctx[5]);
	rightbuttons.$on("toggleCommand", /*toggleCommandForChoice*/ ctx[6]);
	let if_block = (!/*collapseId*/ ctx[2] || /*collapseId*/ ctx[2] && /*choice*/ ctx[0].id !== /*collapseId*/ ctx[2]) && create_if_block$2(ctx);

	return {
		c() {
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			create_component(icon.$$.fragment);
			t0 = space();
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			create_component(rightbuttons.$$.fragment);
			t3 = space();
			if (if_block) if_block.c();
			attr(div0, "class", "multiChoiceListItemName clickable svelte-na99np");
			attr(div1, "class", "multiChoiceListItem svelte-na99np");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div1);
			append(div1, div0);
			mount_component(icon, div0, null);
			append(div0, t0);
			append(div0, span);
			append(span, t1);
			append(div1, t2);
			mount_component(rightbuttons, div1, null);
			append(div2, t3);
			if (if_block) if_block.m(div2, null);
			current = true;

			if (!mounted) {
				dispose = listen(div0, "click", /*click_handler*/ ctx[7]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			const icon_changes = {};
			if (dirty & /*choice*/ 1) icon_changes.style = `transform:rotate(${/*choice*/ ctx[0].collapsed ? -180 : 0}deg)`;
			icon.$set(icon_changes);
			if ((!current || dirty & /*choice*/ 1) && t1_value !== (t1_value = /*choice*/ ctx[0].name + "")) set_data(t1, t1_value);
			const rightbuttons_changes = {};

			if (!updating_showConfigureButton && dirty & /*showConfigureButton*/ 8) {
				updating_showConfigureButton = true;
				rightbuttons_changes.showConfigureButton = /*showConfigureButton*/ ctx[3];
				add_flush_callback(() => updating_showConfigureButton = false);
			}

			if (!updating_dragDisabled && dirty & /*dragDisabled*/ 2) {
				updating_dragDisabled = true;
				rightbuttons_changes.dragDisabled = /*dragDisabled*/ ctx[1];
				add_flush_callback(() => updating_dragDisabled = false);
			}

			if (!updating_choiceName && dirty & /*choice*/ 1) {
				updating_choiceName = true;
				rightbuttons_changes.choiceName = /*choice*/ ctx[0].name;
				add_flush_callback(() => updating_choiceName = false);
			}

			if (!updating_commandEnabled && dirty & /*choice*/ 1) {
				updating_commandEnabled = true;
				rightbuttons_changes.commandEnabled = /*choice*/ ctx[0].command;
				add_flush_callback(() => updating_commandEnabled = false);
			}

			rightbuttons.$set(rightbuttons_changes);

			if (!/*collapseId*/ ctx[2] || /*collapseId*/ ctx[2] && /*choice*/ ctx[0].id !== /*collapseId*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*collapseId, choice*/ 5) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div2, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(icon.$$.fragment, local);
			transition_in(rightbuttons.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(icon.$$.fragment, local);
			transition_out(rightbuttons.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			destroy_component(icon);
			destroy_component(rightbuttons);
			if (if_block) if_block.d();
			mounted = false;
			dispose();
		}
	};
}

function instance$9($$self, $$props, $$invalidate) {
	let { choice } = $$props;
	let { collapseId } = $$props;
	let { dragDisabled } = $$props;
	let showConfigureButton = true;
	const dispatcher = createEventDispatcher();

	function deleteChoice(e) {
		dispatcher('deleteChoice', { choice });
	}

	function configureChoice() {
		dispatcher('configureChoice', { choice });
	}

	function toggleCommandForChoice() {
		dispatcher('toggleCommand', { choice });
	}

	const click_handler = () => $$invalidate(0, choice.collapsed = !choice.collapsed, choice);

	function rightbuttons_showConfigureButton_binding(value) {
		showConfigureButton = value;
		$$invalidate(3, showConfigureButton);
	}

	function rightbuttons_dragDisabled_binding(value) {
		dragDisabled = value;
		$$invalidate(1, dragDisabled);
	}

	function rightbuttons_choiceName_binding(value) {
		if ($$self.$$.not_equal(choice.name, value)) {
			choice.name = value;
			$$invalidate(0, choice);
		}
	}

	function rightbuttons_commandEnabled_binding(value) {
		if ($$self.$$.not_equal(choice.command, value)) {
			choice.command = value;
			$$invalidate(0, choice);
		}
	}

	function mousedown_handler(event) {
		bubble.call(this, $$self, event);
	}

	function touchstart_handler(event) {
		bubble.call(this, $$self, event);
	}

	function choicelist_multiChoice_binding(value) {
		choice = value;
		$$invalidate(0, choice);
	}

	function choicelist_choices_binding(value) {
		if ($$self.$$.not_equal(choice.choices, value)) {
			choice.choices = value;
			$$invalidate(0, choice);
		}
	}

	function deleteChoice_handler(event) {
		bubble.call(this, $$self, event);
	}

	function configureChoice_handler(event) {
		bubble.call(this, $$self, event);
	}

	function toggleCommand_handler(event) {
		bubble.call(this, $$self, event);
	}

	$$self.$$set = $$props => {
		if ('choice' in $$props) $$invalidate(0, choice = $$props.choice);
		if ('collapseId' in $$props) $$invalidate(2, collapseId = $$props.collapseId);
		if ('dragDisabled' in $$props) $$invalidate(1, dragDisabled = $$props.dragDisabled);
	};

	return [
		choice,
		dragDisabled,
		collapseId,
		showConfigureButton,
		deleteChoice,
		configureChoice,
		toggleCommandForChoice,
		click_handler,
		rightbuttons_showConfigureButton_binding,
		rightbuttons_dragDisabled_binding,
		rightbuttons_choiceName_binding,
		rightbuttons_commandEnabled_binding,
		mousedown_handler,
		touchstart_handler,
		choicelist_multiChoice_binding,
		choicelist_choices_binding,
		deleteChoice_handler,
		configureChoice_handler,
		toggleCommand_handler
	];
}

class MultiChoiceListItem extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$9,
			create_fragment$9,
			safe_not_equal,
			{
				choice: 0,
				collapseId: 2,
				dragDisabled: 1
			},
			add_css$6
		);
	}
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

// external events
var FINALIZE_EVENT_NAME = "finalize";
var CONSIDER_EVENT_NAME = "consider";
/**
 * @typedef {Object} Info
 * @property {string} trigger
 * @property {string} id
 * @property {string} source
 * @param {Node} el
 * @param {Array} items
 * @param {Info} info
 */

function dispatchFinalizeEvent(el, items, info) {
  el.dispatchEvent(new CustomEvent(FINALIZE_EVENT_NAME, {
    detail: {
      items: items,
      info: info
    }
  }));
}
/**
 * Dispatches a consider event
 * @param {Node} el
 * @param {Array} items
 * @param {Info} info
 */

function dispatchConsiderEvent(el, items, info) {
  el.dispatchEvent(new CustomEvent(CONSIDER_EVENT_NAME, {
    detail: {
      items: items,
      info: info
    }
  }));
} // internal events

var DRAGGED_ENTERED_EVENT_NAME = "draggedEntered";
var DRAGGED_LEFT_EVENT_NAME = "draggedLeft";
var DRAGGED_OVER_INDEX_EVENT_NAME = "draggedOverIndex";
var DRAGGED_LEFT_DOCUMENT_EVENT_NAME = "draggedLeftDocument";
var DRAGGED_LEFT_TYPES = {
  LEFT_FOR_ANOTHER: "leftForAnother",
  OUTSIDE_OF_ANY: "outsideOfAny"
};
function dispatchDraggedElementEnteredContainer(containerEl, indexObj, draggedEl) {
  containerEl.dispatchEvent(new CustomEvent(DRAGGED_ENTERED_EVENT_NAME, {
    detail: {
      indexObj: indexObj,
      draggedEl: draggedEl
    }
  }));
}
/**
 * @param containerEl - the dropzone the element left
 * @param draggedEl - the dragged element
 * @param theOtherDz - the new dropzone the element entered
 */

function dispatchDraggedElementLeftContainerForAnother(containerEl, draggedEl, theOtherDz) {
  containerEl.dispatchEvent(new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
    detail: {
      draggedEl: draggedEl,
      type: DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER,
      theOtherDz: theOtherDz
    }
  }));
}
function dispatchDraggedElementLeftContainerForNone(containerEl, draggedEl) {
  containerEl.dispatchEvent(new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
    detail: {
      draggedEl: draggedEl,
      type: DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY
    }
  }));
}
function dispatchDraggedElementIsOverIndex(containerEl, indexObj, draggedEl) {
  containerEl.dispatchEvent(new CustomEvent(DRAGGED_OVER_INDEX_EVENT_NAME, {
    detail: {
      indexObj: indexObj,
      draggedEl: draggedEl
    }
  }));
}
function dispatchDraggedLeftDocument(draggedEl) {
  window.dispatchEvent(new CustomEvent(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, {
    detail: {
      draggedEl: draggedEl
    }
  }));
}

var TRIGGERS = {
  DRAG_STARTED: "dragStarted",
  DRAGGED_ENTERED: DRAGGED_ENTERED_EVENT_NAME,
  DRAGGED_ENTERED_ANOTHER: "dragEnteredAnother",
  DRAGGED_OVER_INDEX: DRAGGED_OVER_INDEX_EVENT_NAME,
  DRAGGED_LEFT: DRAGGED_LEFT_EVENT_NAME,
  DRAGGED_LEFT_ALL: "draggedLeftAll",
  DROPPED_INTO_ZONE: "droppedIntoZone",
  DROPPED_INTO_ANOTHER: "droppedIntoAnother",
  DROPPED_OUTSIDE_OF_ANY: "droppedOutsideOfAny",
  DRAG_STOPPED: "dragStopped"
};
var SOURCES = {
  POINTER: "pointer",
  KEYBOARD: "keyboard"
};
var SHADOW_ITEM_MARKER_PROPERTY_NAME = "isDndShadowItem";
var SHADOW_ELEMENT_ATTRIBUTE_NAME = "data-is-dnd-shadow-item";
var SHADOW_PLACEHOLDER_ITEM_ID = "id:dnd-shadow-placeholder-0000";
var DRAGGED_ELEMENT_ID = "dnd-action-dragged-el";
var ITEM_ID_KEY = "id";
var activeDndZoneCount = 0;
function incrementActiveDropZoneCount() {
  activeDndZoneCount++;
}
function decrementActiveDropZoneCount() {
  if (activeDndZoneCount === 0) {
    throw new Error("Bug! trying to decrement when there are no dropzones");
  }

  activeDndZoneCount--;
}
var isOnServer = typeof window === "undefined";

// This is based off https://stackoverflow.com/questions/27745438/how-to-compute-getboundingclientrect-without-considering-transforms/57876601#57876601
// It removes the transforms that are potentially applied by the flip animations

/**
 * Gets the bounding rect but removes transforms (ex: flip animation)
 * @param {HTMLElement} el
 * @return {{top: number, left: number, bottom: number, right: number}}
 */
function getBoundingRectNoTransforms(el) {
  var ta;
  var rect = el.getBoundingClientRect();
  var style = getComputedStyle(el);
  var tx = style.transform;

  if (tx) {
    var sx, sy, dx, dy;

    if (tx.startsWith("matrix3d(")) {
      ta = tx.slice(9, -1).split(/, /);
      sx = +ta[0];
      sy = +ta[5];
      dx = +ta[12];
      dy = +ta[13];
    } else if (tx.startsWith("matrix(")) {
      ta = tx.slice(7, -1).split(/, /);
      sx = +ta[0];
      sy = +ta[3];
      dx = +ta[4];
      dy = +ta[5];
    } else {
      return rect;
    }

    var to = style.transformOrigin;
    var x = rect.x - dx - (1 - sx) * parseFloat(to);
    var y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1));
    var w = sx ? rect.width / sx : el.offsetWidth;
    var h = sy ? rect.height / sy : el.offsetHeight;
    return {
      x: x,
      y: y,
      width: w,
      height: h,
      top: y,
      right: x + w,
      bottom: y + h,
      left: x
    };
  } else {
    return rect;
  }
}
/**
 * Gets the absolute bounding rect (accounts for the window's scroll position and removes transforms)
 * @param {HTMLElement} el
 * @return {{top: number, left: number, bottom: number, right: number}}
 */

function getAbsoluteRectNoTransforms(el) {
  var rect = getBoundingRectNoTransforms(el);
  return {
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX
  };
}
/**
 * Gets the absolute bounding rect (accounts for the window's scroll position)
 * @param {HTMLElement} el
 * @return {{top: number, left: number, bottom: number, right: number}}
 */

function getAbsoluteRect(el) {
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX
  };
}
/**
 * finds the center :)
 * @typedef {Object} Rect
 * @property {number} top
 * @property {number} bottom
 * @property {number} left
 * @property {number} right
 * @param {Rect} rect
 * @return {{x: number, y: number}}
 */

function findCenter(rect) {
  return {
    x: (rect.left + rect.right) / 2,
    y: (rect.top + rect.bottom) / 2
  };
}
/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 * @param {Point} pointA
 * @param {Point} pointB
 * @return {number}
 */

function calcDistance(pointA, pointB) {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}
/**
 * @param {Point} point
 * @param {Rect} rect
 * @return {boolean|boolean}
 */


function isPointInsideRect(point, rect) {
  return point.y <= rect.bottom && point.y >= rect.top && point.x >= rect.left && point.x <= rect.right;
}
/**
 * find the absolute coordinates of the center of a dom element
 * @param el {HTMLElement}
 * @returns {{x: number, y: number}}
 */

function findCenterOfElement(el) {
  return findCenter(getAbsoluteRect(el));
}
/**
 * @param {HTMLElement} elA
 * @param {HTMLElement} elB
 * @return {boolean}
 */

function isCenterOfAInsideB(elA, elB) {
  var centerOfA = findCenterOfElement(elA);
  var rectOfB = getAbsoluteRectNoTransforms(elB);
  return isPointInsideRect(centerOfA, rectOfB);
}
/**
 * @param {HTMLElement|ChildNode} elA
 * @param {HTMLElement|ChildNode} elB
 * @return {number}
 */

function calcDistanceBetweenCenters(elA, elB) {
  var centerOfA = findCenterOfElement(elA);
  var centerOfB = findCenterOfElement(elB);
  return calcDistance(centerOfA, centerOfB);
}
/**
 * @param {HTMLElement} el - the element to check
 * @returns {boolean} - true if the element in its entirety is off screen including the scrollable area (the normal dom events look at the mouse rather than the element)
 */

function isElementOffDocument(el) {
  var rect = getAbsoluteRect(el);
  return rect.right < 0 || rect.left > document.documentElement.scrollWidth || rect.bottom < 0 || rect.top > document.documentElement.scrollHeight;
}
/**
 * If the point is inside the element returns its distances from the sides, otherwise returns null
 * @param {Point} point
 * @param {HTMLElement} el
 * @return {null|{top: number, left: number, bottom: number, right: number}}
 */

function calcInnerDistancesBetweenPointAndSidesOfElement(point, el) {
  var rect = getAbsoluteRect(el);

  if (!isPointInsideRect(point, rect)) {
    return null;
  }

  return {
    top: point.y - rect.top,
    bottom: rect.bottom - point.y,
    left: point.x - rect.left,
    // TODO - figure out what is so special about right (why the rect is too big)
    right: Math.min(rect.right, document.documentElement.clientWidth) - point.x
  };
}

var dzToShadowIndexToRect;
/**
 * Resets the cache that allows for smarter "would be index" resolution. Should be called after every drag operation
 */

function resetIndexesCache() {
  dzToShadowIndexToRect = new Map();
}
resetIndexesCache();
/**
 * Caches the coordinates of the shadow element when it's in a certain index in a certain dropzone.
 * Helpful in order to determine "would be index" more effectively
 * @param {HTMLElement} dz
 * @return {number} - the shadow element index
 */

function cacheShadowRect(dz) {
  var shadowElIndex = Array.from(dz.children).findIndex(function (child) {
    return child.getAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
  });

  if (shadowElIndex >= 0) {
    if (!dzToShadowIndexToRect.has(dz)) {
      dzToShadowIndexToRect.set(dz, new Map());
    }

    dzToShadowIndexToRect.get(dz).set(shadowElIndex, getAbsoluteRectNoTransforms(dz.children[shadowElIndex]));
    return shadowElIndex;
  }

  return undefined;
}
/**
 * @typedef {Object} Index
 * @property {number} index - the would be index
 * @property {boolean} isProximityBased - false if the element is actually over the index, true if it is not over it but this index is the closest
 */

/**
 * Find the index for the dragged element in the list it is dragged over
 * @param {HTMLElement} floatingAboveEl
 * @param {HTMLElement} collectionBelowEl
 * @returns {Index|null} -  if the element is over the container the Index object otherwise null
 */


function findWouldBeIndex(floatingAboveEl, collectionBelowEl) {
  if (!isCenterOfAInsideB(floatingAboveEl, collectionBelowEl)) {
    return null;
  }

  var children = collectionBelowEl.children; // the container is empty, floating element should be the first

  if (children.length === 0) {
    return {
      index: 0,
      isProximityBased: true
    };
  }

  var shadowElIndex = cacheShadowRect(collectionBelowEl); // the search could be more efficient but keeping it simple for now
  // a possible improvement: pass in the lastIndex it was found in and check there first, then expand from there

  for (var i = 0; i < children.length; i++) {
    if (isCenterOfAInsideB(floatingAboveEl, children[i])) {
      var cachedShadowRect = dzToShadowIndexToRect.has(collectionBelowEl) && dzToShadowIndexToRect.get(collectionBelowEl).get(i);

      if (cachedShadowRect) {
        if (!isPointInsideRect(findCenterOfElement(floatingAboveEl), cachedShadowRect)) {
          return {
            index: shadowElIndex,
            isProximityBased: false
          };
        }
      }

      return {
        index: i,
        isProximityBased: false
      };
    }
  } // this can happen if there is space around the children so the floating element has
  //entered the container but not any of the children, in this case we will find the nearest child


  var minDistanceSoFar = Number.MAX_VALUE;
  var indexOfMin = undefined; // we are checking all of them because we don't know whether we are dealing with a horizontal or vertical container and where the floating element entered from

  for (var _i = 0; _i < children.length; _i++) {
    var distance = calcDistanceBetweenCenters(floatingAboveEl, children[_i]);

    if (distance < minDistanceSoFar) {
      minDistanceSoFar = distance;
      indexOfMin = _i;
    }
  }

  return {
    index: indexOfMin,
    isProximityBased: true
  };
}

var SCROLL_ZONE_PX = 25;
function makeScroller() {
  var scrollingInfo;

  function resetScrolling() {
    scrollingInfo = {
      directionObj: undefined,
      stepPx: 0
    };
  }

  resetScrolling(); // directionObj {x: 0|1|-1, y:0|1|-1} - 1 means down in y and right in x

  function scrollContainer(containerEl) {
    var _scrollingInfo = scrollingInfo,
        directionObj = _scrollingInfo.directionObj,
        stepPx = _scrollingInfo.stepPx;

    if (directionObj) {
      containerEl.scrollBy(directionObj.x * stepPx, directionObj.y * stepPx);
      window.requestAnimationFrame(function () {
        return scrollContainer(containerEl);
      });
    }
  }

  function calcScrollStepPx(distancePx) {
    return SCROLL_ZONE_PX - distancePx;
  }
  /**
   * If the pointer is next to the sides of the element to scroll, will trigger scrolling
   * Can be called repeatedly with updated pointer and elementToScroll values without issues
   * @return {boolean} - true if scrolling was needed
   */


  function scrollIfNeeded(pointer, elementToScroll) {
    if (!elementToScroll) {
      return false;
    }

    var distances = calcInnerDistancesBetweenPointAndSidesOfElement(pointer, elementToScroll);

    if (distances === null) {
      resetScrolling();
      return false;
    }

    var isAlreadyScrolling = !!scrollingInfo.directionObj;
    var scrollingVertically = false,
        scrollingHorizontally = false; // vertical

    if (elementToScroll.scrollHeight > elementToScroll.clientHeight) {
      if (distances.bottom < SCROLL_ZONE_PX) {
        scrollingVertically = true;
        scrollingInfo.directionObj = {
          x: 0,
          y: 1
        };
        scrollingInfo.stepPx = calcScrollStepPx(distances.bottom);
      } else if (distances.top < SCROLL_ZONE_PX) {
        scrollingVertically = true;
        scrollingInfo.directionObj = {
          x: 0,
          y: -1
        };
        scrollingInfo.stepPx = calcScrollStepPx(distances.top);
      }

      if (!isAlreadyScrolling && scrollingVertically) {
        scrollContainer(elementToScroll);
        return true;
      }
    } // horizontal


    if (elementToScroll.scrollWidth > elementToScroll.clientWidth) {
      if (distances.right < SCROLL_ZONE_PX) {
        scrollingHorizontally = true;
        scrollingInfo.directionObj = {
          x: 1,
          y: 0
        };
        scrollingInfo.stepPx = calcScrollStepPx(distances.right);
      } else if (distances.left < SCROLL_ZONE_PX) {
        scrollingHorizontally = true;
        scrollingInfo.directionObj = {
          x: -1,
          y: 0
        };
        scrollingInfo.stepPx = calcScrollStepPx(distances.left);
      }

      if (!isAlreadyScrolling && scrollingHorizontally) {
        scrollContainer(elementToScroll);
        return true;
      }
    }

    resetScrolling();
    return false;
  }

  return {
    scrollIfNeeded: scrollIfNeeded,
    resetScrolling: resetScrolling
  };
}

/**
 * @param {Object} object
 * @return {string}
 */
function toString$1(object) {
  return JSON.stringify(object, null, 2);
}
/**
 * Finds the depth of the given node in the DOM tree
 * @param {HTMLElement} node
 * @return {number} - the depth of the node
 */

function getDepth(node) {
  if (!node) {
    throw new Error("cannot get depth of a falsy node");
  }

  return _getDepth(node, 0);
}

function _getDepth(node) {
  var countSoFar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!node.parentElement) {
    return countSoFar - 1;
  }

  return _getDepth(node.parentElement, countSoFar + 1);
}
/**
 * A simple util to shallow compare objects quickly, it doesn't validate the arguments so pass objects in
 * @param {Object} objA
 * @param {Object} objB
 * @return {boolean} - true if objA and objB are shallow equal
 */


function areObjectsShallowEqual(objA, objB) {
  if (Object.keys(objA).length !== Object.keys(objB).length) {
    return false;
  }

  for (var keyA in objA) {
    if (!{}.hasOwnProperty.call(objB, keyA) || objB[keyA] !== objA[keyA]) {
      return false;
    }
  }

  return true;
}
/**
 * Shallow compares two arrays
 * @param arrA
 * @param arrB
 * @return {boolean} - whether the arrays are shallow equal
 */

function areArraysShallowEqualSameOrder(arrA, arrB) {
  if (arrA.length !== arrB.length) {
    return false;
  }

  for (var i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}

var INTERVAL_MS = 200;
var TOLERANCE_PX = 10;

var _makeScroller = makeScroller(),
    scrollIfNeeded = _makeScroller.scrollIfNeeded,
    resetScrolling = _makeScroller.resetScrolling;

var next;
/**
 * Tracks the dragged elements and performs the side effects when it is dragged over a drop zone (basically dispatching custom-events scrolling)
 * @param {Set<HTMLElement>} dropZones
 * @param {HTMLElement} draggedEl
 * @param {number} [intervalMs = INTERVAL_MS]
 */

function observe(draggedEl, dropZones) {
  var intervalMs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : INTERVAL_MS;
  // initialization
  var lastDropZoneFound;
  var lastIndexFound;
  var lastIsDraggedInADropZone = false;
  var lastCentrePositionOfDragged; // We are sorting to make sure that in case of nested zones of the same type the one "on top" is considered first

  var dropZonesFromDeepToShallow = Array.from(dropZones).sort(function (dz1, dz2) {
    return getDepth(dz2) - getDepth(dz1);
  });
  /**
   * The main function in this module. Tracks where everything is/ should be a take the actions
   */

  function andNow() {
    var currentCenterOfDragged = findCenterOfElement(draggedEl);
    var scrolled = scrollIfNeeded(currentCenterOfDragged, lastDropZoneFound); // we only want to make a new decision after the element was moved a bit to prevent flickering

    if (!scrolled && lastCentrePositionOfDragged && Math.abs(lastCentrePositionOfDragged.x - currentCenterOfDragged.x) < TOLERANCE_PX && Math.abs(lastCentrePositionOfDragged.y - currentCenterOfDragged.y) < TOLERANCE_PX) {
      next = window.setTimeout(andNow, intervalMs);
      return;
    }

    if (isElementOffDocument(draggedEl)) {
      dispatchDraggedLeftDocument(draggedEl);
      return;
    }

    lastCentrePositionOfDragged = currentCenterOfDragged; // this is a simple algorithm, potential improvement: first look at lastDropZoneFound

    var isDraggedInADropZone = false;

    var _iterator = _createForOfIteratorHelper(dropZonesFromDeepToShallow),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var dz = _step.value;
        var indexObj = findWouldBeIndex(draggedEl, dz);

        if (indexObj === null) {
          // it is not inside
          continue;
        }

        var index = indexObj.index;
        isDraggedInADropZone = true; // the element is over a container

        if (dz !== lastDropZoneFound) {
          lastDropZoneFound && dispatchDraggedElementLeftContainerForAnother(lastDropZoneFound, draggedEl, dz);
          dispatchDraggedElementEnteredContainer(dz, indexObj, draggedEl);
          lastDropZoneFound = dz;
        } else if (index !== lastIndexFound) {
          dispatchDraggedElementIsOverIndex(dz, indexObj, draggedEl);
          lastIndexFound = index;
        } // we handle looping with the 'continue' statement above


        break;
      } // the first time the dragged element is not in any dropzone we need to notify the last dropzone it was in

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (!isDraggedInADropZone && lastIsDraggedInADropZone && lastDropZoneFound) {
      dispatchDraggedElementLeftContainerForNone(lastDropZoneFound, draggedEl);
      lastDropZoneFound = undefined;
      lastIndexFound = undefined;
      lastIsDraggedInADropZone = false;
    } else {
      lastIsDraggedInADropZone = true;
    }

    next = window.setTimeout(andNow, intervalMs);
  }

  andNow();
} // assumption - we can only observe one dragged element at a time, this could be changed in the future

function unobserve() {
  clearTimeout(next);
  resetScrolling();
  resetIndexesCache();
}

var INTERVAL_MS$1 = 300;
var mousePosition;
/**
 * Do not use this! it is visible for testing only until we get over the issue Cypress not triggering the mousemove listeners
 * // TODO - make private (remove export)
 * @param {{clientX: number, clientY: number}} e
 */

function updateMousePosition(e) {
  var c = e.touches ? e.touches[0] : e;
  mousePosition = {
    x: c.clientX,
    y: c.clientY
  };
}

var _makeScroller$1 = makeScroller(),
    scrollIfNeeded$1 = _makeScroller$1.scrollIfNeeded,
    resetScrolling$1 = _makeScroller$1.resetScrolling;

var next$1;

function loop() {
  if (mousePosition) {
    scrollIfNeeded$1(mousePosition, document.documentElement);
  }

  next$1 = window.setTimeout(loop, INTERVAL_MS$1);
}
/**
 * will start watching the mouse pointer and scroll the window if it goes next to the edges
 */


function armWindowScroller() {
  window.addEventListener("mousemove", updateMousePosition);
  window.addEventListener("touchmove", updateMousePosition);
  loop();
}
/**
 * will stop watching the mouse pointer and won't scroll the window anymore
 */

function disarmWindowScroller() {
  window.removeEventListener("mousemove", updateMousePosition);
  window.removeEventListener("touchmove", updateMousePosition);
  mousePosition = undefined;
  window.clearTimeout(next$1);
  resetScrolling$1();
}

var TRANSITION_DURATION_SECONDS = 0.2;
/**
 * private helper function - creates a transition string for a property
 * @param {string} property
 * @return {string} - the transition string
 */

function trs(property) {
  return "".concat(property, " ").concat(TRANSITION_DURATION_SECONDS, "s ease");
}
/**
 * clones the given element and applies proper styles and transitions to the dragged element
 * @param {HTMLElement} originalElement
 * @param {Point} [positionCenterOnXY]
 * @return {Node} - the cloned, styled element
 */


function createDraggedElementFrom(originalElement, positionCenterOnXY) {
  var rect = originalElement.getBoundingClientRect();
  var draggedEl = originalElement.cloneNode(true);
  copyStylesFromTo(originalElement, draggedEl);
  draggedEl.id = DRAGGED_ELEMENT_ID;
  draggedEl.style.position = "fixed";
  var elTopPx = rect.top;
  var elLeftPx = rect.left;
  draggedEl.style.top = "".concat(elTopPx, "px");
  draggedEl.style.left = "".concat(elLeftPx, "px");

  if (positionCenterOnXY) {
    var center = findCenter(rect);
    elTopPx -= center.y - positionCenterOnXY.y;
    elLeftPx -= center.x - positionCenterOnXY.x;
    window.setTimeout(function () {
      draggedEl.style.top = "".concat(elTopPx, "px");
      draggedEl.style.left = "".concat(elLeftPx, "px");
    }, 0);
  }

  draggedEl.style.margin = "0"; // we can't have relative or automatic height and width or it will break the illusion

  draggedEl.style.boxSizing = "border-box";
  draggedEl.style.height = "".concat(rect.height, "px");
  draggedEl.style.width = "".concat(rect.width, "px");
  draggedEl.style.transition = "".concat(trs("top"), ", ").concat(trs("left"), ", ").concat(trs("background-color"), ", ").concat(trs("opacity"), ", ").concat(trs("color"), " "); // this is a workaround for a strange browser bug that causes the right border to disappear when all the transitions are added at the same time

  window.setTimeout(function () {
    return draggedEl.style.transition += ", ".concat(trs("width"), ", ").concat(trs("height"));
  }, 0);
  draggedEl.style.zIndex = "9999";
  draggedEl.style.cursor = "grabbing";
  return draggedEl;
}
/**
 * styles the dragged element to a 'dropped' state
 * @param {HTMLElement} draggedEl
 */

function moveDraggedElementToWasDroppedState(draggedEl) {
  draggedEl.style.cursor = "grab";
}
/**
 * Morphs the dragged element style, maintains the mouse pointer within the element
 * @param {HTMLElement} draggedEl
 * @param {HTMLElement} copyFromEl - the element the dragged element should look like, typically the shadow element
 * @param {number} currentMouseX
 * @param {number} currentMouseY
 * @param {function} transformDraggedElement - function to transform the dragged element, does nothing by default.
 */

function morphDraggedElementToBeLike(draggedEl, copyFromEl, currentMouseX, currentMouseY, transformDraggedElement) {
  var newRect = copyFromEl.getBoundingClientRect();
  var draggedElRect = draggedEl.getBoundingClientRect();
  var widthChange = newRect.width - draggedElRect.width;
  var heightChange = newRect.height - draggedElRect.height;

  if (widthChange || heightChange) {
    var relativeDistanceOfMousePointerFromDraggedSides = {
      left: (currentMouseX - draggedElRect.left) / draggedElRect.width,
      top: (currentMouseY - draggedElRect.top) / draggedElRect.height
    };
    draggedEl.style.height = "".concat(newRect.height, "px");
    draggedEl.style.width = "".concat(newRect.width, "px");
    draggedEl.style.left = "".concat(parseFloat(draggedEl.style.left) - relativeDistanceOfMousePointerFromDraggedSides.left * widthChange, "px");
    draggedEl.style.top = "".concat(parseFloat(draggedEl.style.top) - relativeDistanceOfMousePointerFromDraggedSides.top * heightChange, "px");
  } /// other properties


  copyStylesFromTo(copyFromEl, draggedEl);
  transformDraggedElement();
}
/**
 * @param {HTMLElement} copyFromEl
 * @param {HTMLElement} copyToEl
 */

function copyStylesFromTo(copyFromEl, copyToEl) {
  var computedStyle = window.getComputedStyle(copyFromEl);
  Array.from(computedStyle).filter(function (s) {
    return s.startsWith("background") || s.startsWith("padding") || s.startsWith("font") || s.startsWith("text") || s.startsWith("align") || s.startsWith("justify") || s.startsWith("display") || s.startsWith("flex") || s.startsWith("border") || s === "opacity" || s === "color" || s === "list-style-type";
  }).forEach(function (s) {
    return copyToEl.style.setProperty(s, computedStyle.getPropertyValue(s), computedStyle.getPropertyPriority(s));
  });
}
/**
 * makes the element compatible with being draggable
 * @param {HTMLElement} draggableEl
 * @param {boolean} dragDisabled
 */


function styleDraggable(draggableEl, dragDisabled) {
  draggableEl.draggable = false;

  draggableEl.ondragstart = function () {
    return false;
  };

  if (!dragDisabled) {
    draggableEl.style.userSelect = "none";
    draggableEl.style.WebkitUserSelect = "none";
    draggableEl.style.cursor = "grab";
  } else {
    draggableEl.style.userSelect = "";
    draggableEl.style.WebkitUserSelect = "";
    draggableEl.style.cursor = "";
  }
}
/**
 * Hides the provided element so that it can stay in the dom without interrupting
 * @param {HTMLElement} dragTarget
 */

function hideOriginalDragTarget(dragTarget) {
  dragTarget.style.display = "none";
  dragTarget.style.position = "fixed";
  dragTarget.style.zIndex = "-5";
}
/**
 * styles the shadow element
 * @param {HTMLElement} shadowEl
 */

function decorateShadowEl(shadowEl) {
  shadowEl.style.visibility = "hidden";
  shadowEl.setAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME, "true");
}
/**
 * undo the styles the shadow element
 * @param {HTMLElement} shadowEl
 */

function unDecorateShadowElement(shadowEl) {
  shadowEl.style.visibility = "";
  shadowEl.removeAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
}
/**
 * will mark the given dropzones as visually active
 * @param {Array<HTMLElement>} dropZones
 * @param {Function} getStyles - maps a dropzone to a styles object (so the styles can be removed)
 * @param {Function} getClasses - maps a dropzone to a classList
 */

function styleActiveDropZones(dropZones) {
  var getStyles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var getClasses = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return [];
  };
  dropZones.forEach(function (dz) {
    var styles = getStyles(dz);
    Object.keys(styles).forEach(function (style) {
      dz.style[style] = styles[style];
    });
    getClasses(dz).forEach(function (c) {
      return dz.classList.add(c);
    });
  });
}
/**
 * will remove the 'active' styling from given dropzones
 * @param {Array<HTMLElement>} dropZones
 * @param {Function} getStyles - maps a dropzone to a styles object
 * @param {Function} getClasses - maps a dropzone to a classList
 */

function styleInactiveDropZones(dropZones) {
  var getStyles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var getClasses = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return [];
  };
  dropZones.forEach(function (dz) {
    var styles = getStyles(dz);
    Object.keys(styles).forEach(function (style) {
      dz.style[style] = "";
    });
    getClasses(dz).forEach(function (c) {
      return dz.classList.contains(c) && dz.classList.remove(c);
    });
  });
}
/**
 * will prevent the provided element from shrinking by setting its minWidth and minHeight to the current width and height values
 * @param {HTMLElement} el
 * @return {function(): void} - run this function to undo the operation and restore the original values
 */

function preventShrinking(el) {
  var originalMinHeight = el.style.minHeight;
  el.style.minHeight = window.getComputedStyle(el).getPropertyValue("height");
  var originalMinWidth = el.style.minWidth;
  el.style.minWidth = window.getComputedStyle(el).getPropertyValue("width");
  return function undo() {
    el.style.minHeight = originalMinHeight;
    el.style.minWidth = originalMinWidth;
  };
}

var DEFAULT_DROP_ZONE_TYPE = "--any--";
var MIN_OBSERVATION_INTERVAL_MS = 100;
var MIN_MOVEMENT_BEFORE_DRAG_START_PX = 3;
var DEFAULT_DROP_TARGET_STYLE = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
};
var originalDragTarget;
var draggedEl;
var draggedElData;
var draggedElType;
var originDropZone;
var originIndex;
var shadowElData;
var shadowElDropZone;
var dragStartMousePosition;
var currentMousePosition;
var isWorkingOnPreviousDrag = false;
var finalizingPreviousDrag = false;
var unlockOriginDzMinDimensions;
var isDraggedOutsideOfAnyDz = false; // a map from type to a set of drop-zones

var typeToDropZones = new Map(); // important - this is needed because otherwise the config that would be used for everyone is the config of the element that created the event listeners

var dzToConfig = new Map(); // this is needed in order to be able to cleanup old listeners and avoid stale closures issues (as the listener is defined within each zone)

var elToMouseDownListener = new WeakMap();
/* drop-zones registration management */

function registerDropZone(dropZoneEl, type) {

  if (!typeToDropZones.has(type)) {
    typeToDropZones.set(type, new Set());
  }

  if (!typeToDropZones.get(type).has(dropZoneEl)) {
    typeToDropZones.get(type).add(dropZoneEl);
    incrementActiveDropZoneCount();
  }
}

function unregisterDropZone(dropZoneEl, type) {
  typeToDropZones.get(type)["delete"](dropZoneEl);
  decrementActiveDropZoneCount();

  if (typeToDropZones.get(type).size === 0) {
    typeToDropZones["delete"](type);
  }
}
/* functions to manage observing the dragged element and trigger custom drag-events */


function watchDraggedElement() {
  armWindowScroller();
  var dropZones = typeToDropZones.get(draggedElType);

  var _iterator = _createForOfIteratorHelper(dropZones),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var dz = _step.value;
      dz.addEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
      dz.addEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
      dz.addEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  window.addEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop); // it is important that we don't have an interval that is faster than the flip duration because it can cause elements to jump bach and forth

  var observationIntervalMs = Math.max.apply(Math, [MIN_OBSERVATION_INTERVAL_MS].concat(_toConsumableArray(Array.from(dropZones.keys()).map(function (dz) {
    return dzToConfig.get(dz).dropAnimationDurationMs;
  }))));
  observe(draggedEl, dropZones, observationIntervalMs * 1.07);
}

function unWatchDraggedElement() {
  disarmWindowScroller();
  var dropZones = typeToDropZones.get(draggedElType);

  var _iterator2 = _createForOfIteratorHelper(dropZones),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var dz = _step2.value;
      dz.removeEventListener(DRAGGED_ENTERED_EVENT_NAME, handleDraggedEntered);
      dz.removeEventListener(DRAGGED_LEFT_EVENT_NAME, handleDraggedLeft);
      dz.removeEventListener(DRAGGED_OVER_INDEX_EVENT_NAME, handleDraggedIsOverIndex);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  window.removeEventListener(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, handleDrop);
  unobserve();
} // finds the initial placeholder that is placed there on drag start


function findShadowPlaceHolderIdx(items) {
  return items.findIndex(function (item) {
    return item[ITEM_ID_KEY] === SHADOW_PLACEHOLDER_ITEM_ID;
  });
}

function findShadowElementIdx(items) {
  // checking that the id is not the placeholder's for Dragula like usecases
  return items.findIndex(function (item) {
    return !!item[SHADOW_ITEM_MARKER_PROPERTY_NAME] && item[ITEM_ID_KEY] !== SHADOW_PLACEHOLDER_ITEM_ID;
  });
}
/* custom drag-events handlers */


function handleDraggedEntered(e) {

  var _dzToConfig$get = dzToConfig.get(e.currentTarget),
      items = _dzToConfig$get.items,
      dropFromOthersDisabled = _dzToConfig$get.dropFromOthersDisabled;

  if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
    return;
  }

  isDraggedOutsideOfAnyDz = false; // this deals with another race condition. in rare occasions (super rapid operations) the list hasn't updated yet

  items = items.filter(function (item) {
    return item[ITEM_ID_KEY] !== shadowElData[ITEM_ID_KEY];
  });

  if (originDropZone !== e.currentTarget) {
    var originZoneItems = dzToConfig.get(originDropZone).items;
    var newOriginZoneItems = originZoneItems.filter(function (item) {
      return !item[SHADOW_ITEM_MARKER_PROPERTY_NAME];
    });
    dispatchConsiderEvent(originDropZone, newOriginZoneItems, {
      trigger: TRIGGERS.DRAGGED_ENTERED_ANOTHER,
      id: draggedElData[ITEM_ID_KEY],
      source: SOURCES.POINTER
    });
  } else {
    var shadowPlaceHolderIdx = findShadowPlaceHolderIdx(items);

    if (shadowPlaceHolderIdx !== -1) {
      items.splice(shadowPlaceHolderIdx, 1);
    }
  }

  var _e$detail$indexObj = e.detail.indexObj,
      index = _e$detail$indexObj.index,
      isProximityBased = _e$detail$indexObj.isProximityBased;
  var shadowElIdx = isProximityBased && index === e.currentTarget.children.length - 1 ? index + 1 : index;
  shadowElDropZone = e.currentTarget;
  items.splice(shadowElIdx, 0, shadowElData);
  dispatchConsiderEvent(e.currentTarget, items, {
    trigger: TRIGGERS.DRAGGED_ENTERED,
    id: draggedElData[ITEM_ID_KEY],
    source: SOURCES.POINTER
  });
}

function handleDraggedLeft(e) {
  // dealing with a rare race condition on extremely rapid clicking and dropping
  if (!isWorkingOnPreviousDrag) return;

  var _dzToConfig$get2 = dzToConfig.get(e.currentTarget),
      items = _dzToConfig$get2.items,
      dropFromOthersDisabled = _dzToConfig$get2.dropFromOthersDisabled;

  if (dropFromOthersDisabled && e.currentTarget !== originDropZone && e.currentTarget !== shadowElDropZone) {
    return;
  }

  var shadowElIdx = findShadowElementIdx(items);
  var shadowItem = items.splice(shadowElIdx, 1)[0];
  shadowElDropZone = undefined;
  var _e$detail = e.detail,
      type = _e$detail.type,
      theOtherDz = _e$detail.theOtherDz;

  if (type === DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY || type === DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER && theOtherDz !== originDropZone && dzToConfig.get(theOtherDz).dropFromOthersDisabled) {
    isDraggedOutsideOfAnyDz = true;
    shadowElDropZone = originDropZone;
    var originZoneItems = dzToConfig.get(originDropZone).items;
    originZoneItems.splice(originIndex, 0, shadowItem);
    dispatchConsiderEvent(originDropZone, originZoneItems, {
      trigger: TRIGGERS.DRAGGED_LEFT_ALL,
      id: draggedElData[ITEM_ID_KEY],
      source: SOURCES.POINTER
    });
  } // for the origin dz, when the dragged is outside of any, this will be fired in addition to the previous. this is for simplicity


  dispatchConsiderEvent(e.currentTarget, items, {
    trigger: TRIGGERS.DRAGGED_LEFT,
    id: draggedElData[ITEM_ID_KEY],
    source: SOURCES.POINTER
  });
}

function handleDraggedIsOverIndex(e) {

  var _dzToConfig$get3 = dzToConfig.get(e.currentTarget),
      items = _dzToConfig$get3.items,
      dropFromOthersDisabled = _dzToConfig$get3.dropFromOthersDisabled;

  if (dropFromOthersDisabled && e.currentTarget !== originDropZone) {
    return;
  }

  isDraggedOutsideOfAnyDz = false;
  var index = e.detail.indexObj.index;
  var shadowElIdx = findShadowElementIdx(items);
  items.splice(shadowElIdx, 1);
  items.splice(index, 0, shadowElData);
  dispatchConsiderEvent(e.currentTarget, items, {
    trigger: TRIGGERS.DRAGGED_OVER_INDEX,
    id: draggedElData[ITEM_ID_KEY],
    source: SOURCES.POINTER
  });
} // Global mouse/touch-events handlers


function handleMouseMove(e) {
  e.preventDefault();
  var c = e.touches ? e.touches[0] : e;
  currentMousePosition = {
    x: c.clientX,
    y: c.clientY
  };
  draggedEl.style.transform = "translate3d(".concat(currentMousePosition.x - dragStartMousePosition.x, "px, ").concat(currentMousePosition.y - dragStartMousePosition.y, "px, 0)");
}

function handleDrop() {
  finalizingPreviousDrag = true; // cleanup

  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("touchmove", handleMouseMove);
  window.removeEventListener("mouseup", handleDrop);
  window.removeEventListener("touchend", handleDrop);
  unWatchDraggedElement();
  moveDraggedElementToWasDroppedState(draggedEl);

  if (!shadowElDropZone) {
    shadowElDropZone = originDropZone;
  }

  var _dzToConfig$get4 = dzToConfig.get(shadowElDropZone),
      items = _dzToConfig$get4.items,
      type = _dzToConfig$get4.type;

  styleInactiveDropZones(typeToDropZones.get(type), function (dz) {
    return dzToConfig.get(dz).dropTargetStyle;
  }, function (dz) {
    return dzToConfig.get(dz).dropTargetClasses;
  });
  var shadowElIdx = findShadowElementIdx(items); // the handler might remove the shadow element, ex: dragula like copy on drag

  if (shadowElIdx === -1) shadowElIdx = originIndex;
  items = items.map(function (item) {
    return item[SHADOW_ITEM_MARKER_PROPERTY_NAME] ? draggedElData : item;
  });

  function finalizeWithinZone() {
    unlockOriginDzMinDimensions();
    dispatchFinalizeEvent(shadowElDropZone, items, {
      trigger: isDraggedOutsideOfAnyDz ? TRIGGERS.DROPPED_OUTSIDE_OF_ANY : TRIGGERS.DROPPED_INTO_ZONE,
      id: draggedElData[ITEM_ID_KEY],
      source: SOURCES.POINTER
    });

    if (shadowElDropZone !== originDropZone) {
      // letting the origin drop zone know the element was permanently taken away
      dispatchFinalizeEvent(originDropZone, dzToConfig.get(originDropZone).items, {
        trigger: TRIGGERS.DROPPED_INTO_ANOTHER,
        id: draggedElData[ITEM_ID_KEY],
        source: SOURCES.POINTER
      });
    }

    unDecorateShadowElement(shadowElDropZone.children[shadowElIdx]);
    cleanupPostDrop();
  }

  animateDraggedToFinalPosition(shadowElIdx, finalizeWithinZone);
} // helper function for handleDrop


function animateDraggedToFinalPosition(shadowElIdx, callback) {
  var shadowElRect = getBoundingRectNoTransforms(shadowElDropZone.children[shadowElIdx]);
  var newTransform = {
    x: shadowElRect.left - parseFloat(draggedEl.style.left),
    y: shadowElRect.top - parseFloat(draggedEl.style.top)
  };

  var _dzToConfig$get5 = dzToConfig.get(shadowElDropZone),
      dropAnimationDurationMs = _dzToConfig$get5.dropAnimationDurationMs;

  var transition = "transform ".concat(dropAnimationDurationMs, "ms ease");
  draggedEl.style.transition = draggedEl.style.transition ? draggedEl.style.transition + "," + transition : transition;
  draggedEl.style.transform = "translate3d(".concat(newTransform.x, "px, ").concat(newTransform.y, "px, 0)");
  window.setTimeout(callback, dropAnimationDurationMs);
}
/* cleanup */


function cleanupPostDrop() {
  draggedEl.remove();
  originalDragTarget.remove();
  draggedEl = undefined;
  originalDragTarget = undefined;
  draggedElData = undefined;
  draggedElType = undefined;
  originDropZone = undefined;
  originIndex = undefined;
  shadowElData = undefined;
  shadowElDropZone = undefined;
  dragStartMousePosition = undefined;
  currentMousePosition = undefined;
  isWorkingOnPreviousDrag = false;
  finalizingPreviousDrag = false;
  unlockOriginDzMinDimensions = undefined;
  isDraggedOutsideOfAnyDz = false;
}

function dndzone(node, options) {
  var config = {
    items: undefined,
    type: undefined,
    flipDurationMs: 0,
    dragDisabled: false,
    morphDisabled: false,
    dropFromOthersDisabled: false,
    dropTargetStyle: DEFAULT_DROP_TARGET_STYLE,
    dropTargetClasses: [],
    transformDraggedElement: function transformDraggedElement() {},
    centreDraggedOnCursor: false
  };
  var elToIdx = new Map();

  function addMaybeListeners() {
    window.addEventListener("mousemove", handleMouseMoveMaybeDragStart, {
      passive: false
    });
    window.addEventListener("touchmove", handleMouseMoveMaybeDragStart, {
      passive: false,
      capture: false
    });
    window.addEventListener("mouseup", handleFalseAlarm, {
      passive: false
    });
    window.addEventListener("touchend", handleFalseAlarm, {
      passive: false
    });
  }

  function removeMaybeListeners() {
    window.removeEventListener("mousemove", handleMouseMoveMaybeDragStart);
    window.removeEventListener("touchmove", handleMouseMoveMaybeDragStart);
    window.removeEventListener("mouseup", handleFalseAlarm);
    window.removeEventListener("touchend", handleFalseAlarm);
  }

  function handleFalseAlarm() {
    removeMaybeListeners();
    originalDragTarget = undefined;
    dragStartMousePosition = undefined;
    currentMousePosition = undefined;
  }

  function handleMouseMoveMaybeDragStart(e) {
    e.preventDefault();
    var c = e.touches ? e.touches[0] : e;
    currentMousePosition = {
      x: c.clientX,
      y: c.clientY
    };

    if (Math.abs(currentMousePosition.x - dragStartMousePosition.x) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX || Math.abs(currentMousePosition.y - dragStartMousePosition.y) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX) {
      removeMaybeListeners();
      handleDragStart();
    }
  }

  function handleMouseDown(e) {
    // on safari clicking on a select element doesn't fire mouseup at the end of the click and in general this makes more sense
    if (e.target !== e.currentTarget && (e.target.value !== undefined || e.target.isContentEditable)) {
      return;
    } // prevents responding to any button but left click which equals 0 (which is falsy)


    if (e.button) {
      return;
    }

    if (isWorkingOnPreviousDrag) {
      return;
    }

    e.stopPropagation();
    var c = e.touches ? e.touches[0] : e;
    dragStartMousePosition = {
      x: c.clientX,
      y: c.clientY
    };
    currentMousePosition = _objectSpread2({}, dragStartMousePosition);
    originalDragTarget = e.currentTarget;
    addMaybeListeners();
  }

  function handleDragStart() {
    isWorkingOnPreviousDrag = true; // initialising globals

    var currentIdx = elToIdx.get(originalDragTarget);
    originIndex = currentIdx;
    originDropZone = originalDragTarget.parentElement;
    var items = config.items,
        type = config.type,
        centreDraggedOnCursor = config.centreDraggedOnCursor;
    draggedElData = _objectSpread2({}, items[currentIdx]);
    draggedElType = type;
    shadowElData = _objectSpread2(_objectSpread2({}, draggedElData), {}, _defineProperty({}, SHADOW_ITEM_MARKER_PROPERTY_NAME, true)); // The initial shadow element. We need a different id at first in order to avoid conflicts and timing issues

    var placeHolderElData = _objectSpread2(_objectSpread2({}, shadowElData), {}, _defineProperty({}, ITEM_ID_KEY, SHADOW_PLACEHOLDER_ITEM_ID)); // creating the draggable element


    draggedEl = createDraggedElementFrom(originalDragTarget, centreDraggedOnCursor && currentMousePosition); // We will keep the original dom node in the dom because touch events keep firing on it, we want to re-add it after the framework removes it

    function keepOriginalElementInDom() {
      if (!draggedEl.parentElement) {
        document.body.appendChild(draggedEl); // to prevent the outline from disappearing

        draggedEl.focus();
        watchDraggedElement();
        hideOriginalDragTarget(originalDragTarget);
        document.body.appendChild(originalDragTarget);
      } else {
        window.requestAnimationFrame(keepOriginalElementInDom);
      }
    }

    window.requestAnimationFrame(keepOriginalElementInDom);
    styleActiveDropZones(Array.from(typeToDropZones.get(config.type)).filter(function (dz) {
      return dz === originDropZone || !dzToConfig.get(dz).dropFromOthersDisabled;
    }), function (dz) {
      return dzToConfig.get(dz).dropTargetStyle;
    }, function (dz) {
      return dzToConfig.get(dz).dropTargetClasses;
    }); // removing the original element by removing its data entry

    items.splice(currentIdx, 1, placeHolderElData);
    unlockOriginDzMinDimensions = preventShrinking(originDropZone);
    dispatchConsiderEvent(originDropZone, items, {
      trigger: TRIGGERS.DRAG_STARTED,
      id: draggedElData[ITEM_ID_KEY],
      source: SOURCES.POINTER
    }); // handing over to global handlers - starting to watch the element

    window.addEventListener("mousemove", handleMouseMove, {
      passive: false
    });
    window.addEventListener("touchmove", handleMouseMove, {
      passive: false,
      capture: false
    });
    window.addEventListener("mouseup", handleDrop, {
      passive: false
    });
    window.addEventListener("touchend", handleDrop, {
      passive: false
    });
  }

  function configure(_ref) {
    var _ref$items = _ref.items,
        items = _ref$items === void 0 ? undefined : _ref$items,
        _ref$flipDurationMs = _ref.flipDurationMs,
        dropAnimationDurationMs = _ref$flipDurationMs === void 0 ? 0 : _ref$flipDurationMs,
        _ref$type = _ref.type,
        newType = _ref$type === void 0 ? DEFAULT_DROP_ZONE_TYPE : _ref$type,
        _ref$dragDisabled = _ref.dragDisabled,
        dragDisabled = _ref$dragDisabled === void 0 ? false : _ref$dragDisabled,
        _ref$morphDisabled = _ref.morphDisabled,
        morphDisabled = _ref$morphDisabled === void 0 ? false : _ref$morphDisabled,
        _ref$dropFromOthersDi = _ref.dropFromOthersDisabled,
        dropFromOthersDisabled = _ref$dropFromOthersDi === void 0 ? false : _ref$dropFromOthersDi,
        _ref$dropTargetStyle = _ref.dropTargetStyle,
        dropTargetStyle = _ref$dropTargetStyle === void 0 ? DEFAULT_DROP_TARGET_STYLE : _ref$dropTargetStyle,
        _ref$dropTargetClasse = _ref.dropTargetClasses,
        dropTargetClasses = _ref$dropTargetClasse === void 0 ? [] : _ref$dropTargetClasse,
        _ref$transformDragged = _ref.transformDraggedElement,
        transformDraggedElement = _ref$transformDragged === void 0 ? function () {} : _ref$transformDragged,
        _ref$centreDraggedOnC = _ref.centreDraggedOnCursor,
        centreDraggedOnCursor = _ref$centreDraggedOnC === void 0 ? false : _ref$centreDraggedOnC;
    config.dropAnimationDurationMs = dropAnimationDurationMs;

    if (config.type && newType !== config.type) {
      unregisterDropZone(node, config.type);
    }

    config.type = newType;
    registerDropZone(node, newType);
    config.items = _toConsumableArray(items);
    config.dragDisabled = dragDisabled;
    config.morphDisabled = morphDisabled;
    config.transformDraggedElement = transformDraggedElement;
    config.centreDraggedOnCursor = centreDraggedOnCursor; // realtime update for dropTargetStyle

    if (isWorkingOnPreviousDrag && !finalizingPreviousDrag && (!areObjectsShallowEqual(dropTargetStyle, config.dropTargetStyle) || !areArraysShallowEqualSameOrder(dropTargetClasses, config.dropTargetClasses))) {
      styleInactiveDropZones([node], function () {
        return config.dropTargetStyle;
      }, function () {
        return dropTargetClasses;
      });
      styleActiveDropZones([node], function () {
        return dropTargetStyle;
      }, function () {
        return dropTargetClasses;
      });
    }

    config.dropTargetStyle = dropTargetStyle;
    config.dropTargetClasses = _toConsumableArray(dropTargetClasses); // realtime update for dropFromOthersDisabled

    function getConfigProp(dz, propName) {
      return dzToConfig.get(dz) ? dzToConfig.get(dz)[propName] : config[propName];
    }

    if (isWorkingOnPreviousDrag && config.dropFromOthersDisabled !== dropFromOthersDisabled) {
      if (dropFromOthersDisabled) {
        styleInactiveDropZones([node], function (dz) {
          return getConfigProp(dz, "dropTargetStyle");
        }, function (dz) {
          return getConfigProp(dz, "dropTargetClasses");
        });
      } else {
        styleActiveDropZones([node], function (dz) {
          return getConfigProp(dz, "dropTargetStyle");
        }, function (dz) {
          return getConfigProp(dz, "dropTargetClasses");
        });
      }
    }

    config.dropFromOthersDisabled = dropFromOthersDisabled;
    dzToConfig.set(node, config);
    var shadowElIdx = findShadowElementIdx(config.items);

    var _loop = function _loop(idx) {
      var draggableEl = node.children[idx];
      styleDraggable(draggableEl, dragDisabled);

      if (idx === shadowElIdx) {
        if (!morphDisabled) {
          morphDraggedElementToBeLike(draggedEl, draggableEl, currentMousePosition.x, currentMousePosition.y, function () {
            return config.transformDraggedElement(draggedEl, draggedElData, idx);
          });
        }

        decorateShadowEl(draggableEl);
        return "continue";
      }

      draggableEl.removeEventListener("mousedown", elToMouseDownListener.get(draggableEl));
      draggableEl.removeEventListener("touchstart", elToMouseDownListener.get(draggableEl));

      if (!dragDisabled) {
        draggableEl.addEventListener("mousedown", handleMouseDown);
        draggableEl.addEventListener("touchstart", handleMouseDown);
        elToMouseDownListener.set(draggableEl, handleMouseDown);
      } // updating the idx


      elToIdx.set(draggableEl, idx);
    };

    for (var idx = 0; idx < node.children.length; idx++) {
      var _ret = _loop(idx);

      if (_ret === "continue") continue;
    }
  }

  configure(options);
  return {
    update: function update(newOptions) {
      configure(newOptions);
    },
    destroy: function destroy() {
      unregisterDropZone(node, config.type);
      dzToConfig["delete"](node);
    }
  };
}

var _ID_TO_INSTRUCTION;
var INSTRUCTION_IDs = {
  DND_ZONE_ACTIVE: "dnd-zone-active",
  DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
var ID_TO_INSTRUCTION = (_ID_TO_INSTRUCTION = {}, _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs.DND_ZONE_ACTIVE, "Tab to one the items and press space-bar or enter to start dragging it"), _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED, "This is a disabled drag and drop list"), _ID_TO_INSTRUCTION);
var ALERT_DIV_ID = "dnd-action-aria-alert";
var alertsDiv;

function initAriaOnBrowser() {
  // setting the dynamic alerts
  alertsDiv = document.createElement("div");

  (function initAlertsDiv() {
    alertsDiv.id = ALERT_DIV_ID; // tab index -1 makes the alert be read twice on chrome for some reason
    //alertsDiv.tabIndex = -1;

    alertsDiv.style.position = "fixed";
    alertsDiv.style.bottom = "0";
    alertsDiv.style.left = "0";
    alertsDiv.style.zIndex = "-5";
    alertsDiv.style.opacity = "0";
    alertsDiv.style.height = "0";
    alertsDiv.style.width = "0";
    alertsDiv.setAttribute("role", "alert");
  })();

  document.body.prepend(alertsDiv); // setting the instructions

  Object.entries(ID_TO_INSTRUCTION).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        id = _ref2[0],
        txt = _ref2[1];

    return document.body.prepend(instructionToHiddenDiv(id, txt));
  });
}
/**
 * Initializes the static aria instructions so they can be attached to zones
 * @return {{DND_ZONE_ACTIVE: string, DND_ZONE_DRAG_DISABLED: string} | null} - the IDs for static aria instruction (to be used via aria-describedby) or null on the server
 */


function initAria() {
  if (isOnServer) return null;

  if (document.readyState === "complete") {
    initAriaOnBrowser();
  } else {
    window.addEventListener("DOMContentLoaded", initAriaOnBrowser);
  }

  return _objectSpread2({}, INSTRUCTION_IDs);
}

function instructionToHiddenDiv(id, txt) {
  var div = document.createElement("div");
  div.id = id;
  div.innerHTML = "<p>".concat(txt, "</p>");
  div.style.display = "none";
  div.style.position = "fixed";
  div.style.zIndex = "-5";
  return div;
}
/**
 * Will make the screen reader alert the provided text to the user
 * @param {string} txt
 */


function alertToScreenReader(txt) {
  alertsDiv.innerHTML = "";
  var alertText = document.createTextNode(txt);
  alertsDiv.appendChild(alertText); // this is needed for Safari

  alertsDiv.style.display = "none";
  alertsDiv.style.display = "inline";
}

var DEFAULT_DROP_ZONE_TYPE$1 = "--any--";
var DEFAULT_DROP_TARGET_STYLE$1 = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
};
var isDragging = false;
var draggedItemType;
var focusedDz;
var focusedDzLabel = "";
var focusedItem;
var focusedItemId;
var focusedItemLabel = "";
var allDragTargets = new WeakSet();
var elToKeyDownListeners = new WeakMap();
var elToFocusListeners = new WeakMap();
var dzToHandles = new Map();
var dzToConfig$1 = new Map();
var typeToDropZones$1 = new Map();
/* TODO (potentially)
 * what's the deal with the black border of voice-reader not following focus?
 * maybe keep focus on the last dragged item upon drop?
 */

var INSTRUCTION_IDs$1 = initAria();
/* drop-zones registration management */

function registerDropZone$1(dropZoneEl, type) {

  if (typeToDropZones$1.size === 0) {
    window.addEventListener("keydown", globalKeyDownHandler);
    window.addEventListener("click", globalClickHandler);
  }

  if (!typeToDropZones$1.has(type)) {
    typeToDropZones$1.set(type, new Set());
  }

  if (!typeToDropZones$1.get(type).has(dropZoneEl)) {
    typeToDropZones$1.get(type).add(dropZoneEl);
    incrementActiveDropZoneCount();
  }
}

function unregisterDropZone$1(dropZoneEl, type) {

  if (focusedDz === dropZoneEl) {
    handleDrop$1();
  }

  typeToDropZones$1.get(type)["delete"](dropZoneEl);
  decrementActiveDropZoneCount();

  if (typeToDropZones$1.get(type).size === 0) {
    typeToDropZones$1["delete"](type);
  }

  if (typeToDropZones$1.size === 0) {
    window.removeEventListener("keydown", globalKeyDownHandler);
    window.removeEventListener("click", globalClickHandler);
  }
}

function globalKeyDownHandler(e) {
  if (!isDragging) return;

  switch (e.key) {
    case "Escape":
      {
        handleDrop$1();
        break;
      }
  }
}

function globalClickHandler() {
  if (!isDragging) return;

  if (!allDragTargets.has(document.activeElement)) {
    handleDrop$1();
  }
}

function handleZoneFocus(e) {
  if (!isDragging) return;
  var newlyFocusedDz = e.currentTarget;
  if (newlyFocusedDz === focusedDz) return;
  focusedDzLabel = newlyFocusedDz.getAttribute("aria-label") || "";

  var _dzToConfig$get = dzToConfig$1.get(focusedDz),
      originItems = _dzToConfig$get.items;

  var originItem = originItems.find(function (item) {
    return item[ITEM_ID_KEY] === focusedItemId;
  });
  var originIdx = originItems.indexOf(originItem);
  var itemToMove = originItems.splice(originIdx, 1)[0];

  var _dzToConfig$get2 = dzToConfig$1.get(newlyFocusedDz),
      targetItems = _dzToConfig$get2.items,
      autoAriaDisabled = _dzToConfig$get2.autoAriaDisabled;

  if (newlyFocusedDz.getBoundingClientRect().top < focusedDz.getBoundingClientRect().top || newlyFocusedDz.getBoundingClientRect().left < focusedDz.getBoundingClientRect().left) {
    targetItems.push(itemToMove);

    if (!autoAriaDisabled) {
      alertToScreenReader("Moved item ".concat(focusedItemLabel, " to the end of the list ").concat(focusedDzLabel));
    }
  } else {
    targetItems.unshift(itemToMove);

    if (!autoAriaDisabled) {
      alertToScreenReader("Moved item ".concat(focusedItemLabel, " to the beginning of the list ").concat(focusedDzLabel));
    }
  }

  var dzFrom = focusedDz;
  dispatchFinalizeEvent(dzFrom, originItems, {
    trigger: TRIGGERS.DROPPED_INTO_ANOTHER,
    id: focusedItemId,
    source: SOURCES.KEYBOARD
  });
  dispatchFinalizeEvent(newlyFocusedDz, targetItems, {
    trigger: TRIGGERS.DROPPED_INTO_ZONE,
    id: focusedItemId,
    source: SOURCES.KEYBOARD
  });
  focusedDz = newlyFocusedDz;
}

function triggerAllDzsUpdate() {
  dzToHandles.forEach(function (_ref, dz) {
    var update = _ref.update;
    return update(dzToConfig$1.get(dz));
  });
}

function handleDrop$1() {
  var dispatchConsider = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  if (!dzToConfig$1.get(focusedDz).autoAriaDisabled) {
    alertToScreenReader("Stopped dragging item ".concat(focusedItemLabel));
  }

  if (allDragTargets.has(document.activeElement)) {
    document.activeElement.blur();
  }

  if (dispatchConsider) {
    dispatchConsiderEvent(focusedDz, dzToConfig$1.get(focusedDz).items, {
      trigger: TRIGGERS.DRAG_STOPPED,
      id: focusedItemId,
      source: SOURCES.KEYBOARD
    });
  }

  styleInactiveDropZones(typeToDropZones$1.get(draggedItemType), function (dz) {
    return dzToConfig$1.get(dz).dropTargetStyle;
  }, function (dz) {
    return dzToConfig$1.get(dz).dropTargetClasses;
  });
  focusedItem = null;
  focusedItemId = null;
  focusedItemLabel = "";
  draggedItemType = null;
  focusedDz = null;
  focusedDzLabel = "";
  isDragging = false;
  triggerAllDzsUpdate();
} //////


function dndzone$1(node, options) {
  var config = {
    items: undefined,
    type: undefined,
    dragDisabled: false,
    dropFromOthersDisabled: false,
    dropTargetStyle: DEFAULT_DROP_TARGET_STYLE$1,
    dropTargetClasses: [],
    autoAriaDisabled: false
  };

  function swap(arr, i, j) {
    if (arr.length <= 1) return;
    arr.splice(j, 1, arr.splice(i, 1, arr[j])[0]);
  }

  function handleKeyDown(e) {

    switch (e.key) {
      case "Enter":
      case " ":
        {
          // we don't want to affect nested input elements or clickable elements
          if ((e.target.disabled !== undefined || e.target.href || e.target.isContentEditable) && !allDragTargets.has(e.target)) {
            return;
          }

          e.preventDefault(); // preventing scrolling on spacebar

          e.stopPropagation();

          if (isDragging) {
            // TODO - should this trigger a drop? only here or in general (as in when hitting space or enter outside of any zone)?
            handleDrop$1();
          } else {
            // drag start
            handleDragStart(e);
          }

          break;
        }

      case "ArrowDown":
      case "ArrowRight":
        {
          if (!isDragging) return;
          e.preventDefault(); // prevent scrolling

          e.stopPropagation();

          var _dzToConfig$get3 = dzToConfig$1.get(node),
              items = _dzToConfig$get3.items;

          var children = Array.from(node.children);
          var idx = children.indexOf(e.currentTarget);

          if (idx < children.length - 1) {
            if (!config.autoAriaDisabled) {
              alertToScreenReader("Moved item ".concat(focusedItemLabel, " to position ").concat(idx + 2, " in the list ").concat(focusedDzLabel));
            }

            swap(items, idx, idx + 1);
            dispatchFinalizeEvent(node, items, {
              trigger: TRIGGERS.DROPPED_INTO_ZONE,
              id: focusedItemId,
              source: SOURCES.KEYBOARD
            });
          }

          break;
        }

      case "ArrowUp":
      case "ArrowLeft":
        {
          if (!isDragging) return;
          e.preventDefault(); // prevent scrolling

          e.stopPropagation();

          var _dzToConfig$get4 = dzToConfig$1.get(node),
              _items = _dzToConfig$get4.items;

          var _children = Array.from(node.children);

          var _idx = _children.indexOf(e.currentTarget);

          if (_idx > 0) {
            if (!config.autoAriaDisabled) {
              alertToScreenReader("Moved item ".concat(focusedItemLabel, " to position ").concat(_idx, " in the list ").concat(focusedDzLabel));
            }

            swap(_items, _idx, _idx - 1);
            dispatchFinalizeEvent(node, _items, {
              trigger: TRIGGERS.DROPPED_INTO_ZONE,
              id: focusedItemId,
              source: SOURCES.KEYBOARD
            });
          }

          break;
        }
    }
  }

  function handleDragStart(e) {
    setCurrentFocusedItem(e.currentTarget);
    focusedDz = node;
    draggedItemType = config.type;
    isDragging = true;
    var dropTargets = Array.from(typeToDropZones$1.get(config.type)).filter(function (dz) {
      return dz === focusedDz || !dzToConfig$1.get(dz).dropFromOthersDisabled;
    });
    styleActiveDropZones(dropTargets, function (dz) {
      return dzToConfig$1.get(dz).dropTargetStyle;
    }, function (dz) {
      return dzToConfig$1.get(dz).dropTargetClasses;
    });

    if (!config.autoAriaDisabled) {
      var msg = "Started dragging item ".concat(focusedItemLabel, ". Use the arrow keys to move it within its list ").concat(focusedDzLabel);

      if (dropTargets.length > 1) {
        msg += ", or tab to another list in order to move the item into it";
      }

      alertToScreenReader(msg);
    }

    dispatchConsiderEvent(node, dzToConfig$1.get(node).items, {
      trigger: TRIGGERS.DRAG_STARTED,
      id: focusedItemId,
      source: SOURCES.KEYBOARD
    });
    triggerAllDzsUpdate();
  }

  function handleClick(e) {
    if (!isDragging) return;
    if (e.currentTarget === focusedItem) return;
    e.stopPropagation();
    handleDrop$1(false);
    handleDragStart(e);
  }

  function setCurrentFocusedItem(draggableEl) {
    var _dzToConfig$get5 = dzToConfig$1.get(node),
        items = _dzToConfig$get5.items;

    var children = Array.from(node.children);
    var focusedItemIdx = children.indexOf(draggableEl);
    focusedItem = draggableEl;
    focusedItem.tabIndex = 0;
    focusedItemId = items[focusedItemIdx][ITEM_ID_KEY];
    focusedItemLabel = children[focusedItemIdx].getAttribute("aria-label") || "";
  }

  function configure(_ref2) {
    var _ref2$items = _ref2.items,
        items = _ref2$items === void 0 ? [] : _ref2$items,
        _ref2$type = _ref2.type,
        newType = _ref2$type === void 0 ? DEFAULT_DROP_ZONE_TYPE$1 : _ref2$type,
        _ref2$dragDisabled = _ref2.dragDisabled,
        dragDisabled = _ref2$dragDisabled === void 0 ? false : _ref2$dragDisabled,
        _ref2$dropFromOthersD = _ref2.dropFromOthersDisabled,
        dropFromOthersDisabled = _ref2$dropFromOthersD === void 0 ? false : _ref2$dropFromOthersD,
        _ref2$dropTargetStyle = _ref2.dropTargetStyle,
        dropTargetStyle = _ref2$dropTargetStyle === void 0 ? DEFAULT_DROP_TARGET_STYLE$1 : _ref2$dropTargetStyle,
        _ref2$dropTargetClass = _ref2.dropTargetClasses,
        dropTargetClasses = _ref2$dropTargetClass === void 0 ? [] : _ref2$dropTargetClass,
        _ref2$autoAriaDisable = _ref2.autoAriaDisabled,
        autoAriaDisabled = _ref2$autoAriaDisable === void 0 ? false : _ref2$autoAriaDisable;
    config.items = _toConsumableArray(items);
    config.dragDisabled = dragDisabled;
    config.dropFromOthersDisabled = dropFromOthersDisabled;
    config.dropTargetStyle = dropTargetStyle;
    config.dropTargetClasses = dropTargetClasses;
    config.autoAriaDisabled = autoAriaDisabled;

    if (!autoAriaDisabled) {
      node.setAttribute("aria-disabled", dragDisabled);
      node.setAttribute("role", "list");
      node.setAttribute("aria-describedby", dragDisabled ? INSTRUCTION_IDs$1.DND_ZONE_DRAG_DISABLED : INSTRUCTION_IDs$1.DND_ZONE_ACTIVE);
    }

    if (config.type && newType !== config.type) {
      unregisterDropZone$1(node, config.type);
    }

    config.type = newType;
    registerDropZone$1(node, newType);
    dzToConfig$1.set(node, config);
    node.tabIndex = isDragging && (node === focusedDz || focusedItem.contains(node) || config.dropFromOthersDisabled || focusedDz && config.type !== dzToConfig$1.get(focusedDz).type) ? -1 : 0;
    node.addEventListener("focus", handleZoneFocus);

    var _loop = function _loop(i) {
      var draggableEl = node.children[i];
      allDragTargets.add(draggableEl);
      draggableEl.tabIndex = isDragging ? -1 : 0;

      if (!autoAriaDisabled) {
        draggableEl.setAttribute("role", "listitem");
      }

      draggableEl.removeEventListener("keydown", elToKeyDownListeners.get(draggableEl));
      draggableEl.removeEventListener("click", elToFocusListeners.get(draggableEl));

      if (!dragDisabled) {
        draggableEl.addEventListener("keydown", handleKeyDown);
        elToKeyDownListeners.set(draggableEl, handleKeyDown);
        draggableEl.addEventListener("click", handleClick);
        elToFocusListeners.set(draggableEl, handleClick);
      }

      if (isDragging && config.items[i][ITEM_ID_KEY] === focusedItemId) {

        focusedItem = draggableEl;
        focusedItem.tabIndex = 0; // without this the element loses focus if it moves backwards in the list

        draggableEl.focus();
      }
    };

    for (var i = 0; i < node.children.length; i++) {
      _loop(i);
    }
  }

  configure(options);
  var handles = {
    update: function update(newOptions) {
      configure(newOptions);
    },
    destroy: function destroy() {
      unregisterDropZone$1(node, config.type);
      dzToConfig$1["delete"](node);
      dzToHandles["delete"](node);
    }
  };
  dzToHandles.set(node, handles);
  return handles;
}

/**
 * A custom action to turn any container to a dnd zone and all of its direct children to draggables
 * Supports mouse, touch and keyboard interactions.
 * Dispatches two events that the container is expected to react to by modifying its list of items,
 * which will then feed back in to this action via the update function
 *
 * @typedef {object} Options
 * @property {array} items - the list of items that was used to generate the children of the given node (the list used in the #each block
 * @property {string} [type] - the type of the dnd zone. children dragged from here can only be dropped in other zones of the same type, default to a base type
 * @property {number} [flipDurationMs] - if the list animated using flip (recommended), specifies the flip duration such that everything syncs with it without conflict, defaults to zero
 * @property {boolean} [dragDisabled]
 * @property {boolean} [morphDisabled] - whether dragged element should morph to zone dimensions
 * @property {boolean} [dropFromOthersDisabled]
 * @property {object} [dropTargetStyle]
 * @property {string[]} [dropTargetClasses]
 * @property {function} [transformDraggedElement]
 * @param {HTMLElement} node - the element to enhance
 * @param {Options} options
 * @return {{update: function, destroy: function}}
 */

function dndzone$2(node, options) {
  validateOptions(options);
  var pointerZone = dndzone(node, options);
  var keyboardZone = dndzone$1(node, options);
  return {
    update: function update(newOptions) {
      validateOptions(newOptions);
      pointerZone.update(newOptions);
      keyboardZone.update(newOptions);
    },
    destroy: function destroy() {
      pointerZone.destroy();
      keyboardZone.destroy();
    }
  };
}

function validateOptions(options) {
  /*eslint-disable*/
  var items = options.items;
      options.flipDurationMs;
      options.type;
      options.dragDisabled;
      options.morphDisabled;
      options.dropFromOthersDisabled;
      options.dropTargetStyle;
      var dropTargetClasses = options.dropTargetClasses;
      options.transformDraggedElement;
      options.autoAriaDisabled;
      options.centreDraggedOnCursor;
      var rest = _objectWithoutProperties(options, ["items", "flipDurationMs", "type", "dragDisabled", "morphDisabled", "dropFromOthersDisabled", "dropTargetStyle", "dropTargetClasses", "transformDraggedElement", "autoAriaDisabled", "centreDraggedOnCursor"]);
  /*eslint-enable*/


  if (Object.keys(rest).length > 0) {
    console.warn("dndzone will ignore unknown options", rest);
  }

  if (!items) {
    throw new Error("no 'items' key provided to dndzone");
  }

  var itemWithMissingId = items.find(function (item) {
    return !{}.hasOwnProperty.call(item, ITEM_ID_KEY);
  });

  if (itemWithMissingId) {
    throw new Error("missing '".concat(ITEM_ID_KEY, "' property for item ").concat(toString$1(itemWithMissingId)));
  }

  if (dropTargetClasses && !Array.isArray(dropTargetClasses)) {
    throw new Error("dropTargetClasses should be an array but instead it is a ".concat(_typeof(dropTargetClasses), ", ").concat(toString$1(dropTargetClasses)));
  }
}

/* src/gui/choiceList/ChoiceList.svelte generated by Svelte v3.47.0 */

function add_css$5(target) {
	append_styles(target, "svelte-jb273g", ".choiceList.svelte-jb273g{width:auto;border:0 solid black;overflow-y:auto;height:auto}");
}

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[21] = list[i];
	child_ctx[22] = list;
	child_ctx[23] = i;
	return child_ctx;
}

// (51:8) {:else}
function create_else_block$1(ctx) {
	let multichoicelistitem;
	let updating_dragDisabled;
	let updating_collapseId;
	let updating_choice;
	let current;

	function multichoicelistitem_dragDisabled_binding(value) {
		/*multichoicelistitem_dragDisabled_binding*/ ctx[13](value);
	}

	function multichoicelistitem_collapseId_binding(value) {
		/*multichoicelistitem_collapseId_binding*/ ctx[14](value);
	}

	function multichoicelistitem_choice_binding(value) {
		/*multichoicelistitem_choice_binding*/ ctx[15](value, /*choice*/ ctx[21], /*each_value*/ ctx[22], /*choice_index*/ ctx[23]);
	}

	let multichoicelistitem_props = {};

	if (/*dragDisabled*/ ctx[3] !== void 0) {
		multichoicelistitem_props.dragDisabled = /*dragDisabled*/ ctx[3];
	}

	if (/*collapseId*/ ctx[2] !== void 0) {
		multichoicelistitem_props.collapseId = /*collapseId*/ ctx[2];
	}

	if (/*choice*/ ctx[21] !== void 0) {
		multichoicelistitem_props.choice = /*choice*/ ctx[21];
	}

	multichoicelistitem = new MultiChoiceListItem({ props: multichoicelistitem_props });
	binding_callbacks.push(() => bind(multichoicelistitem, 'dragDisabled', multichoicelistitem_dragDisabled_binding));
	binding_callbacks.push(() => bind(multichoicelistitem, 'collapseId', multichoicelistitem_collapseId_binding));
	binding_callbacks.push(() => bind(multichoicelistitem, 'choice', multichoicelistitem_choice_binding));
	multichoicelistitem.$on("mousedown", /*startDrag*/ ctx[6]);
	multichoicelistitem.$on("touchstart", /*startDrag*/ ctx[6]);
	multichoicelistitem.$on("deleteChoice", /*deleteChoice_handler_1*/ ctx[16]);
	multichoicelistitem.$on("configureChoice", /*configureChoice_handler_1*/ ctx[17]);
	multichoicelistitem.$on("toggleCommand", /*toggleCommand_handler_1*/ ctx[18]);

	return {
		c() {
			create_component(multichoicelistitem.$$.fragment);
		},
		m(target, anchor) {
			mount_component(multichoicelistitem, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const multichoicelistitem_changes = {};

			if (!updating_dragDisabled && dirty & /*dragDisabled*/ 8) {
				updating_dragDisabled = true;
				multichoicelistitem_changes.dragDisabled = /*dragDisabled*/ ctx[3];
				add_flush_callback(() => updating_dragDisabled = false);
			}

			if (!updating_collapseId && dirty & /*collapseId*/ 4) {
				updating_collapseId = true;
				multichoicelistitem_changes.collapseId = /*collapseId*/ ctx[2];
				add_flush_callback(() => updating_collapseId = false);
			}

			if (!updating_choice && dirty & /*choices, SHADOW_PLACEHOLDER_ITEM_ID*/ 3) {
				updating_choice = true;
				multichoicelistitem_changes.choice = /*choice*/ ctx[21];
				add_flush_callback(() => updating_choice = false);
			}

			multichoicelistitem.$set(multichoicelistitem_changes);
		},
		i(local) {
			if (current) return;
			transition_in(multichoicelistitem.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(multichoicelistitem.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(multichoicelistitem, detaching);
		}
	};
}

// (41:8) {#if choice.type !== ChoiceType.Multi}
function create_if_block$1(ctx) {
	let choicelistitem;
	let updating_dragDisabled;
	let updating_choice;
	let current;

	function choicelistitem_dragDisabled_binding(value) {
		/*choicelistitem_dragDisabled_binding*/ ctx[8](value);
	}

	function choicelistitem_choice_binding(value) {
		/*choicelistitem_choice_binding*/ ctx[9](value, /*choice*/ ctx[21], /*each_value*/ ctx[22], /*choice_index*/ ctx[23]);
	}

	let choicelistitem_props = {};

	if (/*dragDisabled*/ ctx[3] !== void 0) {
		choicelistitem_props.dragDisabled = /*dragDisabled*/ ctx[3];
	}

	if (/*choice*/ ctx[21] !== void 0) {
		choicelistitem_props.choice = /*choice*/ ctx[21];
	}

	choicelistitem = new ChoiceListItem({ props: choicelistitem_props });
	binding_callbacks.push(() => bind(choicelistitem, 'dragDisabled', choicelistitem_dragDisabled_binding));
	binding_callbacks.push(() => bind(choicelistitem, 'choice', choicelistitem_choice_binding));
	choicelistitem.$on("mousedown", /*startDrag*/ ctx[6]);
	choicelistitem.$on("touchstart", /*startDrag*/ ctx[6]);
	choicelistitem.$on("deleteChoice", /*deleteChoice_handler*/ ctx[10]);
	choicelistitem.$on("configureChoice", /*configureChoice_handler*/ ctx[11]);
	choicelistitem.$on("toggleCommand", /*toggleCommand_handler*/ ctx[12]);

	return {
		c() {
			create_component(choicelistitem.$$.fragment);
		},
		m(target, anchor) {
			mount_component(choicelistitem, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const choicelistitem_changes = {};

			if (!updating_dragDisabled && dirty & /*dragDisabled*/ 8) {
				updating_dragDisabled = true;
				choicelistitem_changes.dragDisabled = /*dragDisabled*/ ctx[3];
				add_flush_callback(() => updating_dragDisabled = false);
			}

			if (!updating_choice && dirty & /*choices, SHADOW_PLACEHOLDER_ITEM_ID*/ 3) {
				updating_choice = true;
				choicelistitem_changes.choice = /*choice*/ ctx[21];
				add_flush_callback(() => updating_choice = false);
			}

			choicelistitem.$set(choicelistitem_changes);
		},
		i(local) {
			if (current) return;
			transition_in(choicelistitem.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(choicelistitem.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(choicelistitem, detaching);
		}
	};
}

// (40:4) {#each choices.filter(c => c.id !== SHADOW_PLACEHOLDER_ITEM_ID) as choice(choice.id)}
function create_each_block$2(key_1, ctx) {
	let first;
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$1, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*choice*/ ctx[21].type !== ChoiceType.Multi) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			if_block.c();
			if_block_anchor = empty();
			this.first = first;
		},
		m(target, anchor) {
			insert(target, first, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(first);
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function create_fragment$8(ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let div_style_value;
	let dndzone_action;
	let current;
	let mounted;
	let dispose;
	let each_value = /*choices*/ ctx[0].filter(/*func*/ ctx[7]);
	const get_key = ctx => /*choice*/ ctx[21].id;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$2(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "choiceList svelte-jb273g");

			attr(div, "style", div_style_value = /*choices*/ ctx[0].length === 0
			? 'padding-bottom: 0.5rem'
			: '');
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(dndzone_action = dndzone$2.call(null, div, {
						items: /*choices*/ ctx[0],
						dragDisabled: /*dragDisabled*/ ctx[3],
						dropTargetStyle: {}
					})),
					listen(div, "consider", /*handleConsider*/ ctx[4]),
					listen(div, "finalize", /*handleSort*/ ctx[5])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*dragDisabled, choices, SHADOW_PLACEHOLDER_ITEM_ID, startDrag, ChoiceType, collapseId*/ 79) {
				each_value = /*choices*/ ctx[0].filter(/*func*/ ctx[7]);
				group_outros();
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
				check_outros();
			}

			if (!current || dirty & /*choices*/ 1 && div_style_value !== (div_style_value = /*choices*/ ctx[0].length === 0
			? 'padding-bottom: 0.5rem'
			: '')) {
				attr(div, "style", div_style_value);
			}

			if (dndzone_action && is_function(dndzone_action.update) && dirty & /*choices, dragDisabled*/ 9) dndzone_action.update.call(null, {
				items: /*choices*/ ctx[0],
				dragDisabled: /*dragDisabled*/ ctx[3],
				dropTargetStyle: {}
			});
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$8($$self, $$props, $$invalidate) {
	let { choices = [] } = $$props;
	let collapseId;
	let dragDisabled = true;
	const dispatcher = createEventDispatcher();

	function emitChoicesReordered() {
		dispatcher('reorderChoices', { choices });
	}

	function handleConsider(e) {
		let { items: newItems, info: { id } } = e.detail;
		$$invalidate(2, collapseId = id);
		$$invalidate(0, choices = newItems);
	}

	function handleSort(e) {
		let { items: newItems, info: { source } } = e.detail;
		$$invalidate(2, collapseId = "");
		$$invalidate(0, choices = newItems);

		if (source === SOURCES.POINTER) {
			$$invalidate(3, dragDisabled = true);
		}

		emitChoicesReordered();
	}

	function startDrag(e) {
		e.preventDefault();
		$$invalidate(3, dragDisabled = false);
	}

	const func = c => c.id !== SHADOW_PLACEHOLDER_ITEM_ID;

	function choicelistitem_dragDisabled_binding(value) {
		dragDisabled = value;
		$$invalidate(3, dragDisabled);
	}

	function choicelistitem_choice_binding(value, choice, each_value, choice_index) {
		each_value[choice_index] = value;
		$$invalidate(0, choices);
	}

	function deleteChoice_handler(event) {
		bubble.call(this, $$self, event);
	}

	function configureChoice_handler(event) {
		bubble.call(this, $$self, event);
	}

	function toggleCommand_handler(event) {
		bubble.call(this, $$self, event);
	}

	function multichoicelistitem_dragDisabled_binding(value) {
		dragDisabled = value;
		$$invalidate(3, dragDisabled);
	}

	function multichoicelistitem_collapseId_binding(value) {
		collapseId = value;
		$$invalidate(2, collapseId);
	}

	function multichoicelistitem_choice_binding(value, choice, each_value, choice_index) {
		each_value[choice_index] = value;
		$$invalidate(0, choices);
	}

	function deleteChoice_handler_1(event) {
		bubble.call(this, $$self, event);
	}

	function configureChoice_handler_1(event) {
		bubble.call(this, $$self, event);
	}

	function toggleCommand_handler_1(event) {
		bubble.call(this, $$self, event);
	}

	$$self.$$set = $$props => {
		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
	};

	return [
		choices,
		SHADOW_PLACEHOLDER_ITEM_ID,
		collapseId,
		dragDisabled,
		handleConsider,
		handleSort,
		startDrag,
		func,
		choicelistitem_dragDisabled_binding,
		choicelistitem_choice_binding,
		deleteChoice_handler,
		configureChoice_handler,
		toggleCommand_handler,
		multichoicelistitem_dragDisabled_binding,
		multichoicelistitem_collapseId_binding,
		multichoicelistitem_choice_binding,
		deleteChoice_handler_1,
		configureChoice_handler_1,
		toggleCommand_handler_1
	];
}

class ChoiceList extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$8, create_fragment$8, safe_not_equal, { choices: 0 }, add_css$5);
	}
}

/* src/gui/choiceList/AddChoiceBox.svelte generated by Svelte v3.47.0 */

function add_css$4(target) {
	append_styles(target, "svelte-1newuee", ".addChoiceBox.svelte-1newuee{margin-top:1em;display:flex;flex-direction:row;align-items:center;gap:10px;justify-content:center}@media(max-width: 800px){.addChoiceBox.svelte-1newuee{flex-direction:column}}#addChoiceTypeSelector.svelte-1newuee{font-size:16px;padding:3px;border-radius:3px}");
}

function create_fragment$7(ctx) {
	let div;
	let input;
	let t0;
	let select;
	let option0;
	let t1_value = ChoiceType.Template + "";
	let t1;
	let option1;
	let t2_value = ChoiceType.Capture + "";
	let t2;
	let option2;
	let t3_value = ChoiceType.Macro + "";
	let t3;
	let option3;
	let t4_value = ChoiceType.Multi + "";
	let t4;
	let t5;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			input = element("input");
			t0 = space();
			select = element("select");
			option0 = element("option");
			t1 = text(t1_value);
			option1 = element("option");
			t2 = text(t2_value);
			option2 = element("option");
			t3 = text(t3_value);
			option3 = element("option");
			t4 = text(t4_value);
			t5 = space();
			button = element("button");
			button.textContent = "Add Choice";
			attr(input, "type", "text");
			attr(input, "placeholder", "Name");
			option0.__value = ChoiceType.Template;
			option0.value = option0.__value;
			option1.__value = ChoiceType.Capture;
			option1.value = option1.__value;
			option2.__value = ChoiceType.Macro;
			option2.value = option2.__value;
			option3.__value = ChoiceType.Multi;
			option3.value = option3.__value;
			attr(select, "id", "addChoiceTypeSelector");
			attr(select, "class", "svelte-1newuee");
			if (/*type*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
			attr(button, "class", "mod-cta");
			attr(div, "class", "addChoiceBox svelte-1newuee");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, input);
			set_input_value(input, /*name*/ ctx[0]);
			append(div, t0);
			append(div, select);
			append(select, option0);
			append(option0, t1);
			append(select, option1);
			append(option1, t2);
			append(select, option2);
			append(option2, t3);
			append(select, option3);
			append(option3, t4);
			select_option(select, /*type*/ ctx[1]);
			append(div, t5);
			append(div, button);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[3]),
					listen(select, "change", /*select_change_handler*/ ctx[4]),
					listen(button, "click", /*addChoice*/ ctx[2])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
				set_input_value(input, /*name*/ ctx[0]);
			}

			if (dirty & /*type, ChoiceType*/ 2) {
				select_option(select, /*type*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$7($$self, $$props, $$invalidate) {
	let name;
	let type;
	const dispatch = createEventDispatcher();

	function addChoice() {
		if (!name) {
			new obsidian.Notice("Choice name is invalid.");
			return;
		}

		dispatch('addChoice', { name, type });
		$$invalidate(0, name = "");
	}

	function input_input_handler() {
		name = this.value;
		$$invalidate(0, name);
	}

	function select_change_handler() {
		type = select_value(this);
		$$invalidate(1, type);
	}

	return [name, type, addChoice, input_input_handler, select_change_handler];
}

class AddChoiceBox extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, add_css$4);
	}
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

class Choice {
    constructor(name, type) {
        this.id = v4();
        this.name = name;
        this.type = type;
        this.command = false;
    }
}

var NewTabDirection;
(function (NewTabDirection) {
    NewTabDirection["vertical"] = "vertical";
    NewTabDirection["horizontal"] = "horizontal";
})(NewTabDirection || (NewTabDirection = {}));

class TemplateChoice extends Choice {
    constructor(name) {
        super(name, ChoiceType.Template);
        this.templatePath = "";
        this.fileNameFormat = { enabled: false, format: "" };
        this.folder = { enabled: false, folders: [], chooseWhenCreatingNote: false, createInSameFolderAsActiveFile: false };
        this.appendLink = false;
        this.incrementFileName = false;
        this.openFileInNewTab = { enabled: false, direction: NewTabDirection.vertical, focus: true };
        this.openFile = false;
        this.openFileInMode = 'default';
    }
    static Load(choice) {
        return choice;
    }
}

class MacroChoice extends Choice {
    constructor(name) {
        super(name, ChoiceType.Macro);
        this.macroId = null;
    }
}

class CaptureChoice extends Choice {
    constructor(name) {
        super(name, ChoiceType.Capture);
        this.appendLink = false;
        this.captureTo = "";
        this.captureToActiveFile = false;
        this.createFileIfItDoesntExist = { enabled: false, createWithTemplate: false, template: "" };
        this.format = { enabled: false, format: "" };
        this.insertAfter = { enabled: false, after: "", insertAtEnd: false, createIfNotFound: false, createIfNotFoundLocation: "top" };
        this.prepend = false;
        this.task = false;
        this.openFileInNewTab = { enabled: false, direction: NewTabDirection.vertical, focus: true };
        this.openFile = false;
        this.openFileInMode = 'default';
    }
    static Load(choice) {
        return choice;
    }
}

class MultiChoice extends Choice {
    constructor(name) {
        super(name, ChoiceType.Multi);
        this.choices = [];
    }
    addChoice(choice) {
        this.choices.push(choice);
        return this;
    }
    addChoices(choices) {
        this.choices.push(...choices);
        return this;
    }
}

class GenericYesNoPrompt extends obsidian.Modal {
    constructor(app, header, text) {
        super(app);
        this.header = header;
        this.text = text;
        this.didSubmit = false;
        this.waitForClose = new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
        this.open();
        this.display();
    }
    static Prompt(app, header, text) {
        const newPromptModal = new GenericYesNoPrompt(app, header, text);
        return newPromptModal.waitForClose;
    }
    display() {
        this.containerEl.addClass('quickAddModal', 'qaYesNoPrompt');
        this.contentEl.empty();
        this.titleEl.textContent = this.header;
        this.contentEl.createEl('p', { text: this.text });
        const buttonsDiv = this.contentEl.createDiv({ cls: 'yesNoPromptButtonContainer' });
        new obsidian.ButtonComponent(buttonsDiv)
            .setButtonText('No')
            .onClick(() => this.submit(false));
        const yesButton = new obsidian.ButtonComponent(buttonsDiv)
            .setButtonText('Yes')
            .onClick(() => this.submit(true))
            .setWarning();
        yesButton.buttonEl.focus();
    }
    submit(input) {
        this.input = input;
        this.didSubmit = true;
        this.close();
    }
    onClose() {
        super.onClose();
        if (!this.didSubmit)
            this.rejectPromise("No answer given.");
        else
            this.resolvePromise(this.input);
    }
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`

    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }

    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }

  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle$1(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle$1(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    if (!isHTMLElement(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (process.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle$1(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle$1(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle$1(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;

    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function format$1(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(format$1(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format$1(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

          break;

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format$1(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format$1(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error(format$1(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error(format$1(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format$1(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format$1(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (process.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = getComputedStyle$1(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (process.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
const wrapAround = (value, size) => {
    return ((value % size) + size) % size;
};
class Suggest {
    constructor(owner, containerEl, scope) {
        this.owner = owner;
        this.containerEl = containerEl;
        containerEl.on("click", ".suggestion-item", this.onSuggestionClick.bind(this));
        containerEl.on("mousemove", ".suggestion-item", this.onSuggestionMouseover.bind(this));
        scope.register([], "ArrowUp", (event) => {
            if (!event.isComposing) {
                this.setSelectedItem(this.selectedItem - 1, true);
                return false;
            }
        });
        scope.register([], "ArrowDown", (event) => {
            if (!event.isComposing) {
                this.setSelectedItem(this.selectedItem + 1, true);
                return false;
            }
        });
        scope.register([], "Enter", (event) => {
            if (!event.isComposing) {
                this.useSelectedItem(event);
                return false;
            }
        });
    }
    onSuggestionClick(event, el) {
        event.preventDefault();
        const item = this.suggestions.indexOf(el);
        this.setSelectedItem(item, false);
        this.useSelectedItem(event);
    }
    onSuggestionMouseover(_event, el) {
        const item = this.suggestions.indexOf(el);
        this.setSelectedItem(item, false);
    }
    setSuggestions(values) {
        this.containerEl.empty();
        const suggestionEls = [];
        values.forEach((value) => {
            const suggestionEl = this.containerEl.createDiv("suggestion-item");
            this.owner.renderSuggestion(value, suggestionEl);
            suggestionEls.push(suggestionEl);
        });
        this.values = values;
        this.suggestions = suggestionEls;
        this.setSelectedItem(0, false);
    }
    useSelectedItem(event) {
        const currentValue = this.values[this.selectedItem];
        if (currentValue) {
            this.owner.selectSuggestion(currentValue, event);
        }
    }
    setSelectedItem(selectedIndex, scrollIntoView) {
        const normalizedIndex = wrapAround(selectedIndex, this.suggestions.length);
        const prevSelectedSuggestion = this.suggestions[this.selectedItem];
        const selectedSuggestion = this.suggestions[normalizedIndex];
        prevSelectedSuggestion === null || prevSelectedSuggestion === void 0 ? void 0 : prevSelectedSuggestion.removeClass("is-selected");
        selectedSuggestion === null || selectedSuggestion === void 0 ? void 0 : selectedSuggestion.addClass("is-selected");
        this.selectedItem = normalizedIndex;
        if (scrollIntoView) {
            selectedSuggestion.scrollIntoView(false);
        }
    }
}
class TextInputSuggest {
    constructor(app, inputEl) {
        this.app = app;
        this.inputEl = inputEl;
        this.scope = new obsidian.Scope();
        this.suggestEl = createDiv("suggestion-container");
        const suggestion = this.suggestEl.createDiv("suggestion");
        this.suggest = new Suggest(this, suggestion, this.scope);
        this.scope.register([], "Escape", this.close.bind(this));
        this.inputEl.addEventListener("input", this.onInputChanged.bind(this));
        this.inputEl.addEventListener("focus", this.onInputChanged.bind(this));
        this.inputEl.addEventListener("blur", this.close.bind(this));
        this.suggestEl.on("mousedown", ".suggestion-container", (event) => {
            event.preventDefault();
        });
    }
    onInputChanged() {
        const inputStr = this.inputEl.value;
        const suggestions = this.getSuggestions(inputStr);
        if (!suggestions) {
            this.close();
            return;
        }
        if (suggestions.length > 0) {
            this.suggest.setSuggestions(suggestions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.open(this.app.dom.appContainerEl, this.inputEl);
        }
        else {
            this.close();
        }
    }
    open(container, inputEl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.app.keymap.pushScope(this.scope);
        container.appendChild(this.suggestEl);
        this.popper = createPopper(inputEl, this.suggestEl, {
            placement: "bottom-start",
            modifiers: [
                {
                    name: "sameWidth",
                    enabled: true,
                    fn: ({ state, instance }) => {
                        // Note: positioning needs to be calculated twice -
                        // first pass - positioning it according to the width of the popper
                        // second pass - position it with the width bound to the reference element
                        // we need to early exit to avoid an infinite loop
                        const targetWidth = `${state.rects.reference.width}px`;
                        if (state.styles.popper.width === targetWidth) {
                            return;
                        }
                        state.styles.popper.width = targetWidth;
                        instance.update();
                    },
                    phase: "beforeWrite",
                    requires: ["computeStyles"],
                },
            ],
        });
    }
    close() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.app.keymap.popScope(this.scope);
        this.suggest.setSuggestions([]);
        if (this.popper)
            this.popper.destroy();
        this.suggestEl.detach();
    }
}

const VALUE_SYNTAX = "{{VALUE}}";
const DATE_SYNTAX = "{{DATE}}";
const NAME_SYNTAX = "{{NAME}}";
const VARIABLE_SYNTAX = "{{VALUE:<VARIABLE NAME>}}";
const MATH_VALUE_SYNTAX = "{{MVALUE}}";
const LINKCURRENT_SYNTAX = "{{LINKCURRENT}}";
const FILE_NAME_FORMAT_SYNTAX = [
    DATE_SYNTAX, "{{DATE:<DATEFORMAT>}}", "{{VDATE:<VARIABLE NAME>, <DATE FORMAT>}}",
    VALUE_SYNTAX, NAME_SYNTAX, VARIABLE_SYNTAX,
];
const FILE_NUMBER_REGEX = new RegExp(/([0-9]*)\.md$/);
const NUMBER_REGEX = new RegExp(/^-?[0-9]*$/);
const CREATE_IF_NOT_FOUND_TOP = "top";
const CREATE_IF_NOT_FOUND_BOTTOM = "bottom";
// == Format Syntax == //
const DATE_REGEX = new RegExp(/{{DATE(\+-?[0-9]+)?}}/);
const DATE_REGEX_FORMATTED = new RegExp(/{{DATE:([^}\n\r+]*)(\+-?[0-9]+)?}}/);
const NAME_VALUE_REGEX = new RegExp(/{{NAME}}|{{VALUE}}/);
const VARIABLE_REGEX = new RegExp(/{{VALUE:([^\n\r}]*)}}/);
const DATE_VARIABLE_REGEX = new RegExp(/{{VDATE:([^\n\r},]*),\s*([^\n\r},]*)}}/);
const LINK_TO_CURRENT_FILE_REGEX = new RegExp(/{{LINKCURRENT}}/);
const MARKDOWN_FILE_EXTENSION_REGEX = new RegExp(/\.md$/);
const JAVASCRIPT_FILE_EXTENSION_REGEX = new RegExp(/\.js$/);
const MACRO_REGEX = new RegExp(/{{MACRO:([^\n\r}]*)}}/);
const TEMPLATE_REGEX = new RegExp(/{{TEMPLATE:([^\n\r}]*.md)}}/);
const LINEBREAK_REGEX = new RegExp(/\\n/);
const INLINE_JAVASCRIPT_REGEX = new RegExp(/`{3,}js quickadd([\s\S]*?)`{3,}/);
const MATH_VALUE_REGEX = new RegExp(/{{MVALUE}}/);
// This is not an accurate wikilink regex - but works for its intended purpose.
const FILE_LINK_REGEX = new RegExp(/\[\[([^\]]*)$/);
const TAG_REGEX = new RegExp(/#([^ ]*)$/);
// == Format Syntax Suggestion == //
const DATE_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[D]?[A]?[T]?[E]?[}]?[}]?$/i);
const DATE_FORMAT_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[D]?[A]?[T]?[E]?[:]?$|{{DATE:[^\n\r}]*}}$/i);
const NAME_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[N]?[A]?[M]?[E]?[}]?[}]?$/i);
const VALUE_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[V]?[A]?[L]?[U]?[E]?[}]?[}]?$/i);
const VARIABLE_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[V]?[A]?[L]?[U]?[E]?[:]?$|{{VALUE:[^\n\r}]*}}$/i);
const VARIABLE_DATE_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[V]?[D]?[A]?[T]?[E]?[:]?$|{{VDATE:[^\n\r}]*}}$/i);
const LINKCURRENT_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[L]?[I]?[N]?[K]?[C]?[U]?[R]?[R]?[E]?[N]?[T]?[}]?[}]?$/i);
const TEMPLATE_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[T]?[E]?[M]?[P]?[L]?[A]?[T]?[E]?[:]?$|{{TEMPLATE:[^\n\r}]*[}]?[}]?$/i);
const MACRO_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[M]?[A]?[C]?[R]?[O]?[:]?$|{{MACRO:[^\n\r}]*}}$/i);
const MATH_VALUE_SYNTAX_SUGGEST_REGEX = new RegExp(/{{[M]?[V]?[A]?[L]?[U]?[E]?[}]?[}]?/i);
// == File Exists (Template Choice) == //
const fileExistsAppendToBottom = "Append to the bottom of the file";
const fileExistsAppendToTop = "Append to the top of the file";
const fileExistsOverwriteFile = "Overwrite the file";
const fileExistsDoNothing = "Nothing";
const fileExistsChoices = [fileExistsAppendToBottom, fileExistsAppendToTop, fileExistsOverwriteFile, fileExistsDoNothing];
// == MISC == //
const WIKI_LINK_REGEX = new RegExp(/\[\[([^\]]*)\]\]/);

/**
 * Fuse.js v6.4.6 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2021 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

function isArray(value) {
  return !Array.isArray
    ? getTag(value) === '[object Array]'
    : Array.isArray(value)
}

// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js
const INFINITY = 1 / 0;
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value
  }
  let result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result
}

function toString(value) {
  return value == null ? '' : baseToString(value)
}

function isString(value) {
  return typeof value === 'string'
}

function isNumber(value) {
  return typeof value === 'number'
}

// Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js
function isBoolean(value) {
  return (
    value === true ||
    value === false ||
    (isObjectLike(value) && getTag(value) == '[object Boolean]')
  )
}

function isObject(value) {
  return typeof value === 'object'
}

// Checks if `value` is object-like.
function isObjectLike(value) {
  return isObject(value) && value !== null
}

function isDefined(value) {
  return value !== undefined && value !== null
}

function isBlank(value) {
  return !value.trim().length
}

// Gets the `toStringTag` of `value`.
// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js
function getTag(value) {
  return value == null
    ? value === undefined
      ? '[object Undefined]'
      : '[object Null]'
    : Object.prototype.toString.call(value)
}

const EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available';

const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";

const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) =>
  `Invalid value for key ${key}`;

const PATTERN_LENGTH_TOO_LARGE = (max) =>
  `Pattern length exceeds max of ${max}.`;

const MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;

const INVALID_KEY_WEIGHT_VALUE = (key) =>
  `Property 'weight' in key '${key}' must be a positive integer`;

const hasOwn = Object.prototype.hasOwnProperty;

class KeyStore {
  constructor(keys) {
    this._keys = [];
    this._keyMap = {};

    let totalWeight = 0;

    keys.forEach((key) => {
      let obj = createKey(key);

      totalWeight += obj.weight;

      this._keys.push(obj);
      this._keyMap[obj.id] = obj;

      totalWeight += obj.weight;
    });

    // Normalize weights so that their sum is equal to 1
    this._keys.forEach((key) => {
      key.weight /= totalWeight;
    });
  }
  get(keyId) {
    return this._keyMap[keyId]
  }
  keys() {
    return this._keys
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}

function createKey(key) {
  let path = null;
  let id = null;
  let src = null;
  let weight = 1;

  if (isString(key) || isArray(key)) {
    src = key;
    path = createKeyPath(key);
    id = createKeyId(key);
  } else {
    if (!hasOwn.call(key, 'name')) {
      throw new Error(MISSING_KEY_PROPERTY('name'))
    }

    const name = key.name;
    src = name;

    if (hasOwn.call(key, 'weight')) {
      weight = key.weight;

      if (weight <= 0) {
        throw new Error(INVALID_KEY_WEIGHT_VALUE(name))
      }
    }

    path = createKeyPath(name);
    id = createKeyId(name);
  }

  return { path, id, weight, src }
}

function createKeyPath(key) {
  return isArray(key) ? key : key.split('.')
}

function createKeyId(key) {
  return isArray(key) ? key.join('.') : key
}

function get(obj, path) {
  let list = [];
  let arr = false;

  const deepGet = (obj, path, index) => {
    if (!isDefined(obj)) {
      return
    }
    if (!path[index]) {
      // If there's no path left, we've arrived at the object we care about.
      list.push(obj);
    } else {
      let key = path[index];

      const value = obj[key];

      if (!isDefined(value)) {
        return
      }

      // If we're at the last value in the path, and if it's a string/number/bool,
      // add it to the list
      if (
        index === path.length - 1 &&
        (isString(value) || isNumber(value) || isBoolean(value))
      ) {
        list.push(toString(value));
      } else if (isArray(value)) {
        arr = true;
        // Search each item in the array.
        for (let i = 0, len = value.length; i < len; i += 1) {
          deepGet(value[i], path, index + 1);
        }
      } else if (path.length) {
        // An object. Recurse further.
        deepGet(value, path, index + 1);
      }
    }
  };

  // Backwards compatibility (since path used to be a string)
  deepGet(obj, isString(path) ? path.split('.') : path, 0);

  return arr ? list : list[0]
}

const MatchOptions = {
  // Whether the matches should be included in the result set. When `true`, each record in the result
  // set will include the indices of the matched characters.
  // These can consequently be used for highlighting purposes.
  includeMatches: false,
  // When `true`, the matching function will continue to the end of a search pattern even if
  // a perfect match has already been located in the string.
  findAllMatches: false,
  // Minimum number of characters that must be matched before a result is considered a match
  minMatchCharLength: 1
};

const BasicOptions = {
  // When `true`, the algorithm continues searching to the end of the input even if a perfect
  // match is found before the end of the same input.
  isCaseSensitive: false,
  // When true, the matching function will continue to the end of a search pattern even if
  includeScore: false,
  // List of properties that will be searched. This also supports nested properties.
  keys: [],
  // Whether to sort the result list, by score
  shouldSort: true,
  // Default sort function: sort by ascending score, ascending index
  sortFn: (a, b) =>
    a.score === b.score ? (a.idx < b.idx ? -1 : 1) : a.score < b.score ? -1 : 1
};

const FuzzyOptions = {
  // Approximately where in the text is the pattern expected to be found?
  location: 0,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Determines how close the match must be to the fuzzy location (specified above).
  // An exact letter match which is 'distance' characters away from the fuzzy location
  // would score as a complete mismatch. A distance of '0' requires the match be at
  // the exact location specified, a threshold of '1000' would require a perfect match
  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  distance: 100
};

const AdvancedOptions = {
  // When `true`, it enables the use of unix-like search commands
  useExtendedSearch: false,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: get,
  // When `true`, search will ignore `location` and `distance`, so it won't matter
  // where in the string the pattern appears.
  // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
  ignoreLocation: false,
  // When `true`, the calculation for the relevance score (used for sorting) will
  // ignore the field-length norm.
  // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
  ignoreFieldNorm: false
};

var Config = {
  ...BasicOptions,
  ...MatchOptions,
  ...FuzzyOptions,
  ...AdvancedOptions
};

const SPACE = /[^ ]+/g;

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
function norm(mantissa = 3) {
  const cache = new Map();
  const m = Math.pow(10, mantissa);

  return {
    get(value) {
      const numTokens = value.match(SPACE).length;

      if (cache.has(numTokens)) {
        return cache.get(numTokens)
      }

      const norm = 1 / Math.sqrt(numTokens);

      // In place of `toFixed(mantissa)`, for faster computation
      const n = parseFloat(Math.round(norm * m) / m);

      cache.set(numTokens, n);

      return n
    },
    clear() {
      cache.clear();
    }
  }
}

class FuseIndex {
  constructor({ getFn = Config.getFn } = {}) {
    this.norm = norm(3);
    this.getFn = getFn;
    this.isCreated = false;

    this.setIndexRecords();
  }
  setSources(docs = []) {
    this.docs = docs;
  }
  setIndexRecords(records = []) {
    this.records = records;
  }
  setKeys(keys = []) {
    this.keys = keys;
    this._keysMap = {};
    keys.forEach((key, idx) => {
      this._keysMap[key.id] = idx;
    });
  }
  create() {
    if (this.isCreated || !this.docs.length) {
      return
    }

    this.isCreated = true;

    // List is Array<String>
    if (isString(this.docs[0])) {
      this.docs.forEach((doc, docIndex) => {
        this._addString(doc, docIndex);
      });
    } else {
      // List is Array<Object>
      this.docs.forEach((doc, docIndex) => {
        this._addObject(doc, docIndex);
      });
    }

    this.norm.clear();
  }
  // Adds a doc to the end of the index
  add(doc) {
    const idx = this.size();

    if (isString(doc)) {
      this._addString(doc, idx);
    } else {
      this._addObject(doc, idx);
    }
  }
  // Removes the doc at the specified index of the index
  removeAt(idx) {
    this.records.splice(idx, 1);

    // Change ref index of every subsquent doc
    for (let i = idx, len = this.size(); i < len; i += 1) {
      this.records[i].i -= 1;
    }
  }
  getValueForItemAtKeyId(item, keyId) {
    return item[this._keysMap[keyId]]
  }
  size() {
    return this.records.length
  }
  _addString(doc, docIndex) {
    if (!isDefined(doc) || isBlank(doc)) {
      return
    }

    let record = {
      v: doc,
      i: docIndex,
      n: this.norm.get(doc)
    };

    this.records.push(record);
  }
  _addObject(doc, docIndex) {
    let record = { i: docIndex, $: {} };

    // Iterate over every key (i.e, path), and fetch the value at that key
    this.keys.forEach((key, keyIndex) => {
      // console.log(key)
      let value = this.getFn(doc, key.path);

      if (!isDefined(value)) {
        return
      }

      if (isArray(value)) {
        let subRecords = [];
        const stack = [{ nestedArrIndex: -1, value }];

        while (stack.length) {
          const { nestedArrIndex, value } = stack.pop();

          if (!isDefined(value)) {
            continue
          }

          if (isString(value) && !isBlank(value)) {
            let subRecord = {
              v: value,
              i: nestedArrIndex,
              n: this.norm.get(value)
            };

            subRecords.push(subRecord);
          } else if (isArray(value)) {
            value.forEach((item, k) => {
              stack.push({
                nestedArrIndex: k,
                value: item
              });
            });
          }
        }
        record.$[keyIndex] = subRecords;
      } else if (!isBlank(value)) {
        let subRecord = {
          v: value,
          n: this.norm.get(value)
        };

        record.$[keyIndex] = subRecord;
      }
    });

    this.records.push(record);
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    }
  }
}

function createIndex(keys, docs, { getFn = Config.getFn } = {}) {
  const myIndex = new FuseIndex({ getFn });
  myIndex.setKeys(keys.map(createKey));
  myIndex.setSources(docs);
  myIndex.create();
  return myIndex
}

function parseIndex(data, { getFn = Config.getFn } = {}) {
  const { keys, records } = data;
  const myIndex = new FuseIndex({ getFn });
  myIndex.setKeys(keys);
  myIndex.setIndexRecords(records);
  return myIndex
}

function computeScore(
  pattern,
  {
    errors = 0,
    currentLocation = 0,
    expectedLocation = 0,
    distance = Config.distance,
    ignoreLocation = Config.ignoreLocation
  } = {}
) {
  const accuracy = errors / pattern.length;

  if (ignoreLocation) {
    return accuracy
  }

  const proximity = Math.abs(expectedLocation - currentLocation);

  if (!distance) {
    // Dodge divide by zero error.
    return proximity ? 1.0 : accuracy
  }

  return accuracy + proximity / distance
}

function convertMaskToIndices(
  matchmask = [],
  minMatchCharLength = Config.minMatchCharLength
) {
  let indices = [];
  let start = -1;
  let end = -1;
  let i = 0;

  for (let len = matchmask.length; i < len; i += 1) {
    let match = matchmask[i];
    if (match && start === -1) {
      start = i;
    } else if (!match && start !== -1) {
      end = i - 1;
      if (end - start + 1 >= minMatchCharLength) {
        indices.push([start, end]);
      }
      start = -1;
    }
  }

  // (i-1 - start) + 1 => i - start
  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
    indices.push([start, i - 1]);
  }

  return indices
}

// Machine word size
const MAX_BITS = 32;

function search(
  text,
  pattern,
  patternAlphabet,
  {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {}
) {
  if (pattern.length > MAX_BITS) {
    throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS))
  }

  const patternLen = pattern.length;
  // Set starting location at beginning text and initialize the alphabet.
  const textLen = text.length;
  // Handle the case when location > text.length
  const expectedLocation = Math.max(0, Math.min(location, textLen));
  // Highest score beyond which we give up.
  let currentThreshold = threshold;
  // Is there a nearby exact match? (speedup)
  let bestLocation = expectedLocation;

  // Performance: only computer matches when the minMatchCharLength > 1
  // OR if `includeMatches` is true.
  const computeMatches = minMatchCharLength > 1 || includeMatches;
  // A mask of the matches, used for building the indices
  const matchMask = computeMatches ? Array(textLen) : [];

  let index;

  // Get all exact matches, here for speed up
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    let score = computeScore(pattern, {
      currentLocation: index,
      expectedLocation,
      distance,
      ignoreLocation
    });

    currentThreshold = Math.min(score, currentThreshold);
    bestLocation = index + patternLen;

    if (computeMatches) {
      let i = 0;
      while (i < patternLen) {
        matchMask[index + i] = 1;
        i += 1;
      }
    }
  }

  // Reset the best location
  bestLocation = -1;

  let lastBitArr = [];
  let finalScore = 1;
  let binMax = patternLen + textLen;

  const mask = 1 << (patternLen - 1);

  for (let i = 0; i < patternLen; i += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    let binMin = 0;
    let binMid = binMax;

    while (binMin < binMid) {
      const score = computeScore(pattern, {
        errors: i,
        currentLocation: expectedLocation + binMid,
        expectedLocation,
        distance,
        ignoreLocation
      });

      if (score <= currentThreshold) {
        binMin = binMid;
      } else {
        binMax = binMid;
      }

      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }

    // Use the result from this iteration as the maximum for the next.
    binMax = binMid;

    let start = Math.max(1, expectedLocation - binMid + 1);
    let finish = findAllMatches
      ? textLen
      : Math.min(expectedLocation + binMid, textLen) + patternLen;

    // Initialize the bit array
    let bitArr = Array(finish + 2);

    bitArr[finish + 1] = (1 << i) - 1;

    for (let j = finish; j >= start; j -= 1) {
      let currentLocation = j - 1;
      let charMatch = patternAlphabet[text.charAt(currentLocation)];

      if (computeMatches) {
        // Speed up: quick bool to int conversion (i.e, `charMatch ? 1 : 0`)
        matchMask[currentLocation] = +!!charMatch;
      }

      // First pass: exact match
      bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;

      // Subsequent passes: fuzzy match
      if (i) {
        bitArr[j] |=
          ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];
      }

      if (bitArr[j] & mask) {
        finalScore = computeScore(pattern, {
          errors: i,
          currentLocation,
          expectedLocation,
          distance,
          ignoreLocation
        });

        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (finalScore <= currentThreshold) {
          // Indeed it is
          currentThreshold = finalScore;
          bestLocation = currentLocation;

          // Already passed `loc`, downhill from here on in.
          if (bestLocation <= expectedLocation) {
            break
          }

          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
          start = Math.max(1, 2 * expectedLocation - bestLocation);
        }
      }
    }

    // No hope for a (better) match at greater error levels.
    const score = computeScore(pattern, {
      errors: i + 1,
      currentLocation: expectedLocation,
      expectedLocation,
      distance,
      ignoreLocation
    });

    if (score > currentThreshold) {
      break
    }

    lastBitArr = bitArr;
  }

  const result = {
    isMatch: bestLocation >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: Math.max(0.001, finalScore)
  };

  if (computeMatches) {
    const indices = convertMaskToIndices(matchMask, minMatchCharLength);
    if (!indices.length) {
      result.isMatch = false;
    } else if (includeMatches) {
      result.indices = indices;
    }
  }

  return result
}

function createPatternAlphabet(pattern) {
  let mask = {};

  for (let i = 0, len = pattern.length; i < len; i += 1) {
    const char = pattern.charAt(i);
    mask[char] = (mask[char] || 0) | (1 << (len - i - 1));
  }

  return mask
}

class BitapSearch {
  constructor(
    pattern,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}
  ) {
    this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreLocation
    };

    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();

    this.chunks = [];

    if (!this.pattern.length) {
      return
    }

    const addChunk = (pattern, startIndex) => {
      this.chunks.push({
        pattern,
        alphabet: createPatternAlphabet(pattern),
        startIndex
      });
    };

    const len = this.pattern.length;

    if (len > MAX_BITS) {
      let i = 0;
      const remainder = len % MAX_BITS;
      const end = len - remainder;

      while (i < end) {
        addChunk(this.pattern.substr(i, MAX_BITS), i);
        i += MAX_BITS;
      }

      if (remainder) {
        const startIndex = len - MAX_BITS;
        addChunk(this.pattern.substr(startIndex), startIndex);
      }
    } else {
      addChunk(this.pattern, 0);
    }
  }

  searchIn(text) {
    const { isCaseSensitive, includeMatches } = this.options;

    if (!isCaseSensitive) {
      text = text.toLowerCase();
    }

    // Exact match
    if (this.pattern === text) {
      let result = {
        isMatch: true,
        score: 0
      };

      if (includeMatches) {
        result.indices = [[0, text.length - 1]];
      }

      return result
    }

    // Otherwise, use Bitap algorithm
    const {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      ignoreLocation
    } = this.options;

    let allIndices = [];
    let totalScore = 0;
    let hasMatches = false;

    this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
      const { isMatch, score, indices } = search(text, pattern, alphabet, {
        location: location + startIndex,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches,
        ignoreLocation
      });

      if (isMatch) {
        hasMatches = true;
      }

      totalScore += score;

      if (isMatch && indices) {
        allIndices = [...allIndices, ...indices];
      }
    });

    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    };

    if (hasMatches && includeMatches) {
      result.indices = allIndices;
    }

    return result
  }
}

class BaseMatch {
  constructor(pattern) {
    this.pattern = pattern;
  }
  static isMultiMatch(pattern) {
    return getMatch(pattern, this.multiRegex)
  }
  static isSingleMatch(pattern) {
    return getMatch(pattern, this.singleRegex)
  }
  search(/*text*/) {}
}

function getMatch(pattern, exp) {
  const matches = pattern.match(exp);
  return matches ? matches[1] : null
}

// Token: 'file

class ExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'exact'
  }
  static get multiRegex() {
    return /^="(.*)"$/
  }
  static get singleRegex() {
    return /^=(.*)$/
  }
  search(text) {
    const isMatch = text === this.pattern;

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    }
  }
}

// Token: !fire

class InverseExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'inverse-exact'
  }
  static get multiRegex() {
    return /^!"(.*)"$/
  }
  static get singleRegex() {
    return /^!(.*)$/
  }
  search(text) {
    const index = text.indexOf(this.pattern);
    const isMatch = index === -1;

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    }
  }
}

// Token: ^file

class PrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'prefix-exact'
  }
  static get multiRegex() {
    return /^\^"(.*)"$/
  }
  static get singleRegex() {
    return /^\^(.*)$/
  }
  search(text) {
    const isMatch = text.startsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    }
  }
}

// Token: !^fire

class InversePrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'inverse-prefix-exact'
  }
  static get multiRegex() {
    return /^!\^"(.*)"$/
  }
  static get singleRegex() {
    return /^!\^(.*)$/
  }
  search(text) {
    const isMatch = !text.startsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    }
  }
}

// Token: .file$

class SuffixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'suffix-exact'
  }
  static get multiRegex() {
    return /^"(.*)"\$$/
  }
  static get singleRegex() {
    return /^(.*)\$$/
  }
  search(text) {
    const isMatch = text.endsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [text.length - this.pattern.length, text.length - 1]
    }
  }
}

// Token: !.file$

class InverseSuffixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'inverse-suffix-exact'
  }
  static get multiRegex() {
    return /^!"(.*)"\$$/
  }
  static get singleRegex() {
    return /^!(.*)\$$/
  }
  search(text) {
    const isMatch = !text.endsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    }
  }
}

class FuzzyMatch extends BaseMatch {
  constructor(
    pattern,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}
  ) {
    super(pattern);
    this._bitapSearch = new BitapSearch(pattern, {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreLocation
    });
  }
  static get type() {
    return 'fuzzy'
  }
  static get multiRegex() {
    return /^"(.*)"$/
  }
  static get singleRegex() {
    return /^(.*)$/
  }
  search(text) {
    return this._bitapSearch.searchIn(text)
  }
}

// Token: 'file

class IncludeMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'include'
  }
  static get multiRegex() {
    return /^'"(.*)"$/
  }
  static get singleRegex() {
    return /^'(.*)$/
  }
  search(text) {
    let location = 0;
    let index;

    const indices = [];
    const patternLen = this.pattern.length;

    // Get all exact matches
    while ((index = text.indexOf(this.pattern, location)) > -1) {
      location = index + patternLen;
      indices.push([index, location - 1]);
    }

    const isMatch = !!indices.length;

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices
    }
  }
}

// ❗Order is important. DO NOT CHANGE.
const searchers = [
  ExactMatch,
  IncludeMatch,
  PrefixExactMatch,
  InversePrefixExactMatch,
  InverseSuffixExactMatch,
  SuffixExactMatch,
  InverseExactMatch,
  FuzzyMatch
];

const searchersLen = searchers.length;

// Regex to split by spaces, but keep anything in quotes together
const SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
const OR_TOKEN = '|';

// Return a 2D array representation of the query, for simpler parsing.
// Example:
// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
function parseQuery(pattern, options = {}) {
  return pattern.split(OR_TOKEN).map((item) => {
    let query = item
      .trim()
      .split(SPACE_RE)
      .filter((item) => item && !!item.trim());

    let results = [];
    for (let i = 0, len = query.length; i < len; i += 1) {
      const queryItem = query[i];

      // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)
      let found = false;
      let idx = -1;
      while (!found && ++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isMultiMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          found = true;
        }
      }

      if (found) {
        continue
      }

      // 2. Handle single query matches (i.e, once that are *not* quoted)
      idx = -1;
      while (++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isSingleMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          break
        }
      }
    }

    return results
  })
}

// These extended matchers can return an array of matches, as opposed
// to a singl match
const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);

/**
 * Command-like searching
 * ======================
 *
 * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
 * search in a given text.
 *
 * Search syntax:
 *
 * | Token       | Match type                 | Description                            |
 * | ----------- | -------------------------- | -------------------------------------- |
 * | `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
 * | `=scheme`   | exact-match                | Items that are `scheme`                |
 * | `'python`   | include-match              | Items that include `python`            |
 * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
 * | `^java`     | prefix-exact-match         | Items that start with `java`           |
 * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
 * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
 * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
 *
 * A single pipe character acts as an OR operator. For example, the following
 * query matches entries that start with `core` and end with either`go`, `rb`,
 * or`py`.
 *
 * ```
 * ^core go$ | rb$ | py$
 * ```
 */
class ExtendedSearch {
  constructor(
    pattern,
    {
      isCaseSensitive = Config.isCaseSensitive,
      includeMatches = Config.includeMatches,
      minMatchCharLength = Config.minMatchCharLength,
      ignoreLocation = Config.ignoreLocation,
      findAllMatches = Config.findAllMatches,
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance
    } = {}
  ) {
    this.query = null;
    this.options = {
      isCaseSensitive,
      includeMatches,
      minMatchCharLength,
      findAllMatches,
      ignoreLocation,
      location,
      threshold,
      distance
    };

    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.query = parseQuery(this.pattern, this.options);
  }

  static condition(_, options) {
    return options.useExtendedSearch
  }

  searchIn(text) {
    const query = this.query;

    if (!query) {
      return {
        isMatch: false,
        score: 1
      }
    }

    const { includeMatches, isCaseSensitive } = this.options;

    text = isCaseSensitive ? text : text.toLowerCase();

    let numMatches = 0;
    let allIndices = [];
    let totalScore = 0;

    // ORs
    for (let i = 0, qLen = query.length; i < qLen; i += 1) {
      const searchers = query[i];

      // Reset indices
      allIndices.length = 0;
      numMatches = 0;

      // ANDs
      for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
        const searcher = searchers[j];
        const { isMatch, indices, score } = searcher.search(text);

        if (isMatch) {
          numMatches += 1;
          totalScore += score;
          if (includeMatches) {
            const type = searcher.constructor.type;
            if (MultiMatchSet.has(type)) {
              allIndices = [...allIndices, ...indices];
            } else {
              allIndices.push(indices);
            }
          }
        } else {
          totalScore = 0;
          numMatches = 0;
          allIndices.length = 0;
          break
        }
      }

      // OR condition, so if TRUE, return
      if (numMatches) {
        let result = {
          isMatch: true,
          score: totalScore / numMatches
        };

        if (includeMatches) {
          result.indices = allIndices;
        }

        return result
      }
    }

    // Nothing was matched
    return {
      isMatch: false,
      score: 1
    }
  }
}

const registeredSearchers = [];

function register(...args) {
  registeredSearchers.push(...args);
}

function createSearcher(pattern, options) {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i];
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options)
    }
  }

  return new BitapSearch(pattern, options)
}

const LogicalOperator = {
  AND: '$and',
  OR: '$or'
};

const KeyType = {
  PATH: '$path',
  PATTERN: '$val'
};

const isExpression = (query) =>
  !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);

const isPath = (query) => !!query[KeyType.PATH];

const isLeaf = (query) =>
  !isArray(query) && isObject(query) && !isExpression(query);

const convertToExplicit = (query) => ({
  [LogicalOperator.AND]: Object.keys(query).map((key) => ({
    [key]: query[key]
  }))
});

// When `auto` is `true`, the parse function will infer and initialize and add
// the appropriate `Searcher` instance
function parse(query, options, { auto = true } = {}) {
  const next = (query) => {
    let keys = Object.keys(query);

    const isQueryPath = isPath(query);

    if (!isQueryPath && keys.length > 1 && !isExpression(query)) {
      return next(convertToExplicit(query))
    }

    if (isLeaf(query)) {
      const key = isQueryPath ? query[KeyType.PATH] : keys[0];

      const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];

      if (!isString(pattern)) {
        throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key))
      }

      const obj = {
        keyId: createKeyId(key),
        pattern
      };

      if (auto) {
        obj.searcher = createSearcher(pattern, options);
      }

      return obj
    }

    let node = {
      children: [],
      operator: keys[0]
    };

    keys.forEach((key) => {
      const value = query[key];

      if (isArray(value)) {
        value.forEach((item) => {
          node.children.push(next(item));
        });
      }
    });

    return node
  };

  if (!isExpression(query)) {
    query = convertToExplicit(query);
  }

  return next(query)
}

// Practical scoring function
function computeScore$1(
  results,
  { ignoreFieldNorm = Config.ignoreFieldNorm }
) {
  results.forEach((result) => {
    let totalScore = 1;

    result.matches.forEach(({ key, norm, score }) => {
      const weight = key ? key.weight : null;

      totalScore *= Math.pow(
        score === 0 && weight ? Number.EPSILON : score,
        (weight || 1) * (ignoreFieldNorm ? 1 : norm)
      );
    });

    result.score = totalScore;
  });
}

function transformMatches(result, data) {
  const matches = result.matches;
  data.matches = [];

  if (!isDefined(matches)) {
    return
  }

  matches.forEach((match) => {
    if (!isDefined(match.indices) || !match.indices.length) {
      return
    }

    const { indices, value } = match;

    let obj = {
      indices,
      value
    };

    if (match.key) {
      obj.key = match.key.src;
    }

    if (match.idx > -1) {
      obj.refIndex = match.idx;
    }

    data.matches.push(obj);
  });
}

function transformScore(result, data) {
  data.score = result.score;
}

function format(
  results,
  docs,
  {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}
) {
  const transformers = [];

  if (includeMatches) transformers.push(transformMatches);
  if (includeScore) transformers.push(transformScore);

  return results.map((result) => {
    const { idx } = result;

    const data = {
      item: docs[idx],
      refIndex: idx
    };

    if (transformers.length) {
      transformers.forEach((transformer) => {
        transformer(result, data);
      });
    }

    return data
  })
}

class Fuse {
  constructor(docs, options = {}, index) {
    this.options = { ...Config, ...options };

    if (
      this.options.useExtendedSearch &&
      !true
    ) {
      throw new Error(EXTENDED_SEARCH_UNAVAILABLE)
    }

    this._keyStore = new KeyStore(this.options.keys);

    this.setCollection(docs, index);
  }

  setCollection(docs, index) {
    this._docs = docs;

    if (index && !(index instanceof FuseIndex)) {
      throw new Error(INCORRECT_INDEX_TYPE)
    }

    this._myIndex =
      index ||
      createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn
      });
  }

  add(doc) {
    if (!isDefined(doc)) {
      return
    }

    this._docs.push(doc);
    this._myIndex.add(doc);
  }

  remove(predicate = (/* doc, idx */) => false) {
    const results = [];

    for (let i = 0, len = this._docs.length; i < len; i += 1) {
      const doc = this._docs[i];
      if (predicate(doc, i)) {
        this.removeAt(i);
        i -= 1;
        len -= 1;

        results.push(doc);
      }
    }

    return results
  }

  removeAt(idx) {
    this._docs.splice(idx, 1);
    this._myIndex.removeAt(idx);
  }

  getIndex() {
    return this._myIndex
  }

  search(query, { limit = -1 } = {}) {
    const {
      includeMatches,
      includeScore,
      shouldSort,
      sortFn,
      ignoreFieldNorm
    } = this.options;

    let results = isString(query)
      ? isString(this._docs[0])
        ? this._searchStringList(query)
        : this._searchObjectList(query)
      : this._searchLogical(query);

    computeScore$1(results, { ignoreFieldNorm });

    if (shouldSort) {
      results.sort(sortFn);
    }

    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit);
    }

    return format(results, this._docs, {
      includeMatches,
      includeScore
    })
  }

  _searchStringList(query) {
    const searcher = createSearcher(query, this.options);
    const { records } = this._myIndex;
    const results = [];

    // Iterate over every string in the index
    records.forEach(({ v: text, i: idx, n: norm }) => {
      if (!isDefined(text)) {
        return
      }

      const { isMatch, score, indices } = searcher.searchIn(text);

      if (isMatch) {
        results.push({
          item: text,
          idx,
          matches: [{ score, value: text, norm, indices }]
        });
      }
    });

    return results
  }

  _searchLogical(query) {

    const expression = parse(query, this.options);

    const evaluate = (node, item, idx) => {
      if (!node.children) {
        const { keyId, searcher } = node;

        const matches = this._findMatches({
          key: this._keyStore.get(keyId),
          value: this._myIndex.getValueForItemAtKeyId(item, keyId),
          searcher
        });

        if (matches && matches.length) {
          return [
            {
              idx,
              item,
              matches
            }
          ]
        }

        return []
      }

      /*eslint indent: [2, 2, {"SwitchCase": 1}]*/
      switch (node.operator) {
        case LogicalOperator.AND: {
          const res = [];
          for (let i = 0, len = node.children.length; i < len; i += 1) {
            const child = node.children[i];
            const result = evaluate(child, item, idx);
            if (result.length) {
              res.push(...result);
            } else {
              return []
            }
          }
          return res
        }
        case LogicalOperator.OR: {
          const res = [];
          for (let i = 0, len = node.children.length; i < len; i += 1) {
            const child = node.children[i];
            const result = evaluate(child, item, idx);
            if (result.length) {
              res.push(...result);
              break
            }
          }
          return res
        }
      }
    };

    const records = this._myIndex.records;
    const resultMap = {};
    const results = [];

    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        let expResults = evaluate(expression, item, idx);

        if (expResults.length) {
          // Dedupe when adding
          if (!resultMap[idx]) {
            resultMap[idx] = { idx, item, matches: [] };
            results.push(resultMap[idx]);
          }
          expResults.forEach(({ matches }) => {
            resultMap[idx].matches.push(...matches);
          });
        }
      }
    });

    return results
  }

  _searchObjectList(query) {
    const searcher = createSearcher(query, this.options);
    const { keys, records } = this._myIndex;
    const results = [];

    // List is Array<Object>
    records.forEach(({ $: item, i: idx }) => {
      if (!isDefined(item)) {
        return
      }

      let matches = [];

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, keyIndex) => {
        matches.push(
          ...this._findMatches({
            key,
            value: item[keyIndex],
            searcher
          })
        );
      });

      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        });
      }
    });

    return results
  }
  _findMatches({ key, value, searcher }) {
    if (!isDefined(value)) {
      return []
    }

    let matches = [];

    if (isArray(value)) {
      value.forEach(({ v: text, i: idx, n: norm }) => {
        if (!isDefined(text)) {
          return
        }

        const { isMatch, score, indices } = searcher.searchIn(text);

        if (isMatch) {
          matches.push({
            score,
            key,
            value: text,
            idx,
            norm,
            indices
          });
        }
      });
    } else {
      const { v: text, n: norm } = value;

      const { isMatch, score, indices } = searcher.searchIn(text);

      if (isMatch) {
        matches.push({ score, key, value: text, norm, indices });
      }
    }

    return matches
  }
}

Fuse.version = '6.4.6';
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;

{
  Fuse.parseQuery = parse;
}

{
  register(ExtendedSearch);
}

var FileSuggestionType;
(function (FileSuggestionType) {
    FileSuggestionType[FileSuggestionType["File"] = 0] = "File";
    FileSuggestionType[FileSuggestionType["Alias"] = 1] = "Alias";
    FileSuggestionType[FileSuggestionType["Unresolved"] = 2] = "Unresolved";
})(FileSuggestionType || (FileSuggestionType = {}));
class SuggestionMap extends Map {
}
function buildFileMap(files, unresolvedLinkNames) {
    const fileMap = new SuggestionMap();
    for (const file of files) {
        fileMap.set(file.path, {
            file,
            type: FileSuggestionType.File
        });
        for (const alias of file.alias) {
            fileMap.set(alias, {
                file,
                type: FileSuggestionType.Alias,
            });
        }
    }
    for (const unresolvedLinkName of unresolvedLinkNames) {
        fileMap.set(unresolvedLinkName, {
            type: FileSuggestionType.Unresolved
        });
    }
    return fileMap;
}
function getAliasesForFile(file, app) {
    var _a, _b, _c, _d;
    const fileMetadata = app.metadataCache.getFileCache(file);
    const fileMetaAlias = (_d = (_b = (_a = fileMetadata === null || fileMetadata === void 0 ? void 0 : fileMetadata.frontmatter) === null || _a === void 0 ? void 0 : _a.alias) !== null && _b !== void 0 ? _b : (_c = fileMetadata === null || fileMetadata === void 0 ? void 0 : fileMetadata.frontmatter) === null || _c === void 0 ? void 0 : _c.aliases) !== null && _d !== void 0 ? _d : "";
    let aliases = [];
    if (typeof fileMetaAlias === "string" && fileMetaAlias) {
        aliases.push(fileMetaAlias);
    }
    else if (Array.isArray(fileMetaAlias)) {
        const filteredAliases = fileMetaAlias.filter(v => v && typeof v === "string");
        if (filteredAliases.length) {
            aliases.push(...filteredAliases); // remove null values
        }
    }
    return Object.assign(Object.assign({}, file), { alias: aliases });
}
class SilentFileSuggester extends TextInputSuggest {
    constructor(app, inputEl) {
        super(app, inputEl);
        this.app = app;
        this.inputEl = inputEl;
        this.lastInput = "";
        const filesAndAliases = app.vault.getMarkdownFiles().map(file => getAliasesForFile(file, app));
        const unresolvedLinkNames = this.getUnresolvedLinkNames(app);
        const fileAndAliasMap = buildFileMap(filesAndAliases, unresolvedLinkNames);
        this.fileNames = [...fileAndAliasMap.keys()];
        this.fileMap = fileAndAliasMap;
    }
    getSuggestions(inputStr) {
        const cursorPosition = this.inputEl.selectionStart;
        const inputBeforeCursor = inputStr.substr(0, cursorPosition);
        const fileLinkMatch = FILE_LINK_REGEX.exec(inputBeforeCursor);
        if (!fileLinkMatch) {
            return [];
        }
        const fileNameInput = fileLinkMatch[1];
        this.lastInput = fileNameInput;
        const fuse = new Fuse(this.fileNames, {
            findAllMatches: true,
            shouldSort: true,
            isCaseSensitive: false,
            minMatchCharLength: 1,
            threshold: 0.3,
        });
        const MAX_ITEMS = 50;
        const search = fuse.search(this.lastInput)
            .slice(0, MAX_ITEMS)
            .map(value => value.item);
        return search;
    }
    renderSuggestion(item, el) {
        const suggestionItem = this.fileMap.get(item);
        switch (suggestionItem.type) {
            case FileSuggestionType.File:
                el.innerHTML = `
                    <span class="suggestion-main-text">${suggestionItem.file.basename}</span>
                    <span class="suggestion-sub-text">${suggestionItem.file.path}</span>
                `;
                break;
            case FileSuggestionType.Alias:
                el.innerHTML = `
                    <span class="suggestion-main-text">${item}</span>
                    <span class="suggestion-sub-text">${suggestionItem.file.path}</span>
                `;
                break;
            case FileSuggestionType.Unresolved:
                el.innerHTML = `
                    <span class="suggestion-main-text">${item}</span>
                    <span class="suggestion-sub-text">Unresolved link</span>
                `;
                break;
            default:
                el.innerHTML = `
                    <span class="suggestion-main-text">${item}</span>
                    <span class="suggestion-sub-text">Unknown</span>
                `;
                break;
        }
        el.classList.add("qaFileSuggestionItem");
    }
    selectSuggestion(item) {
        const cursorPosition = this.inputEl.selectionStart;
        const lastInputLength = this.lastInput.length;
        const currentInputValue = this.inputEl.value;
        let insertedEndPosition = 0;
        const suggestionItem = this.fileMap.get(item);
        if (suggestionItem.type === FileSuggestionType.File) {
            insertedEndPosition = this.makeLinkObsidianMethod(suggestionItem.file, currentInputValue, cursorPosition, lastInputLength);
        }
        else if (suggestionItem.type === FileSuggestionType.Alias) {
            insertedEndPosition = this.makeLinkObsidianMethod(suggestionItem.file, currentInputValue, cursorPosition, lastInputLength, item);
        }
        else {
            insertedEndPosition = this.makeLinkManually(currentInputValue, item.replace(/.md$/, ''), cursorPosition, lastInputLength);
        }
        this.inputEl.trigger("input");
        this.close();
        this.inputEl.setSelectionRange(insertedEndPosition, insertedEndPosition);
    }
    makeLinkObsidianMethod(linkFile, currentInputValue, cursorPosition, lastInputLength, alias) {
        // Need to get file again, otherwise it won't be recognized by the link generator. (hotfix, but not a good solution)
        const file = this.app.vault.getAbstractFileByPath(linkFile.path);
        const link = this.app.fileManager.generateMarkdownLink(file, '', '', alias !== null && alias !== void 0 ? alias : '');
        this.inputEl.value = this.getNewInputValueForFileLink(currentInputValue, link, cursorPosition, lastInputLength);
        return cursorPosition - lastInputLength + link.length + 2;
    }
    makeLinkManually(currentInputValue, item, cursorPosition, lastInputLength) {
        this.inputEl.value = this.getNewInputValueForFileName(currentInputValue, item, cursorPosition, lastInputLength);
        return cursorPosition - lastInputLength + item.length + 2;
    }
    getNewInputValueForFileLink(currentInputElValue, selectedItem, cursorPosition, lastInputLength) {
        return `${currentInputElValue.substr(0, cursorPosition - lastInputLength - 2)}${selectedItem}${currentInputElValue.substr(cursorPosition)}`;
    }
    getNewInputValueForFileName(currentInputElValue, selectedItem, cursorPosition, lastInputLength) {
        return `${currentInputElValue.substr(0, cursorPosition - lastInputLength)}${selectedItem}]]${currentInputElValue.substr(cursorPosition)}`;
    }
    getUnresolvedLinkNames(app) {
        const unresolvedLinks = app.metadataCache.unresolvedLinks;
        const unresolvedLinkNames = new Set();
        for (const sourceFileName in unresolvedLinks) {
            for (const unresolvedLink in unresolvedLinks[sourceFileName]) {
                unresolvedLinkNames.add(unresolvedLink);
            }
        }
        return Array.from(unresolvedLinkNames);
    }
}

class SilentTagSuggester extends TextInputSuggest {
    constructor(app, inputEl) {
        super(app, inputEl);
        this.app = app;
        this.inputEl = inputEl;
        this.lastInput = "";
        // @ts-ignore
        this.tags = Object.keys(app.metadataCache.getTags());
    }
    getSuggestions(inputStr) {
        const cursorPosition = this.inputEl.selectionStart;
        const inputBeforeCursor = inputStr.substr(0, cursorPosition);
        const tagMatch = TAG_REGEX.exec(inputBeforeCursor);
        if (!tagMatch) {
            return [];
        }
        const tagInput = tagMatch[1];
        this.lastInput = tagInput;
        const suggestions = this.tags.filter(tag => tag.toLowerCase().contains(tagInput.toLowerCase()));
        const fuse = new Fuse(suggestions, { findAllMatches: true, threshold: 0.8 });
        const search = fuse.search(this.lastInput).map(value => value.item);
        return search;
    }
    renderSuggestion(item, el) {
        el.setText(item);
    }
    selectSuggestion(item) {
        const cursorPosition = this.inputEl.selectionStart;
        const lastInputLength = this.lastInput.length;
        const currentInputValue = this.inputEl.value;
        let insertedEndPosition = 0;
        this.inputEl.value = this.getNewInputValueForTag(currentInputValue, item, cursorPosition, lastInputLength);
        insertedEndPosition = cursorPosition - lastInputLength + item.length - 1;
        this.inputEl.trigger("input");
        this.close();
        this.inputEl.setSelectionRange(insertedEndPosition, insertedEndPosition);
    }
    getNewInputValueForTag(currentInputElValue, selectedItem, cursorPosition, lastInputLength) {
        return `${currentInputElValue.substr(0, cursorPosition - lastInputLength - 1)}${selectedItem}${currentInputElValue.substr(cursorPosition)}`;
    }
}

class GenericInputPrompt extends obsidian.Modal {
    constructor(app, header, placeholder, value) {
        super(app);
        this.header = header;
        this.didSubmit = false;
        this.submitClickCallback = (evt) => this.submit();
        this.cancelClickCallback = (evt) => this.cancel();
        this.submitEnterCallback = (evt) => {
            if (evt.key === "Enter") {
                evt.preventDefault();
                this.submit();
            }
        };
        this.placeholder = placeholder;
        this.input = value;
        this.waitForClose = new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
        this.display();
        this.open();
        this.fileSuggester = new SilentFileSuggester(app, this.inputComponent.inputEl);
        this.tagSuggester = new SilentTagSuggester(app, this.inputComponent.inputEl);
    }
    static Prompt(app, header, placeholder, value) {
        const newPromptModal = new GenericInputPrompt(app, header, placeholder, value);
        return newPromptModal.waitForClose;
    }
    display() {
        this.containerEl.addClass('quickAddModal', 'qaInputPrompt');
        this.contentEl.empty();
        this.titleEl.textContent = this.header;
        const mainContentContainer = this.contentEl.createDiv();
        this.inputComponent = this.createInputField(mainContentContainer, this.placeholder, this.input);
        this.createButtonBar(mainContentContainer);
    }
    createInputField(container, placeholder, value) {
        const textComponent = new obsidian.TextComponent(container);
        textComponent.inputEl.style.width = "100%";
        textComponent.setPlaceholder(placeholder !== null && placeholder !== void 0 ? placeholder : "")
            .setValue(value !== null && value !== void 0 ? value : "")
            .onChange(value => this.input = value)
            .inputEl.addEventListener('keydown', this.submitEnterCallback);
        return textComponent;
    }
    createButton(container, text, callback) {
        const btn = new obsidian.ButtonComponent(container);
        btn.setButtonText(text)
            .onClick(callback);
        return btn;
    }
    createButtonBar(mainContentContainer) {
        const buttonBarContainer = mainContentContainer.createDiv();
        this.createButton(buttonBarContainer, "Ok", this.submitClickCallback)
            .setCta().buttonEl.style.marginRight = '0';
        this.createButton(buttonBarContainer, "Cancel", this.cancelClickCallback);
        buttonBarContainer.style.display = 'flex';
        buttonBarContainer.style.flexDirection = 'row-reverse';
        buttonBarContainer.style.justifyContent = 'flex-start';
        buttonBarContainer.style.marginTop = '1rem';
    }
    submit() {
        this.didSubmit = true;
        this.close();
    }
    cancel() {
        this.close();
    }
    resolveInput() {
        if (!this.didSubmit)
            this.rejectPromise("No input given.");
        else
            this.resolvePromise(this.input);
    }
    removeInputListener() {
        this.inputComponent.inputEl.removeEventListener('keydown', this.submitEnterCallback);
    }
    onOpen() {
        super.onOpen();
        this.inputComponent.inputEl.focus();
        this.inputComponent.inputEl.select();
    }
    onClose() {
        super.onClose();
        this.resolveInput();
        this.removeInputListener();
    }
}

class LogManager {
    register(logger) {
        LogManager.loggers.push(logger);
        return this;
    }
    logError(message) {
        LogManager.loggers.forEach(logger => logger.logError(message));
        throw new Error();
    }
    logWarning(message) {
        LogManager.loggers.forEach(logger => logger.logError(message));
    }
    logMessage(message) {
        LogManager.loggers.forEach(logger => logger.logMessage(message));
    }
}
LogManager.loggers = [];
const log = new LogManager();

class GenericTextSuggester extends TextInputSuggest {
    constructor(app, inputEl, items) {
        super(app, inputEl);
        this.app = app;
        this.inputEl = inputEl;
        this.items = items;
    }
    getSuggestions(inputStr) {
        const inputLowerCase = inputStr.toLowerCase();
        const filtered = this.items.filter(item => {
            if (item.toLowerCase().contains(inputLowerCase))
                return item;
        });
        if (!filtered)
            this.close();
        if ((filtered === null || filtered === void 0 ? void 0 : filtered.length) > 0)
            return filtered;
    }
    selectSuggestion(item) {
        this.inputEl.value = item;
        this.inputEl.trigger("input");
        this.close();
    }
    renderSuggestion(value, el) {
        if (value)
            el.setText(value);
    }
}

class ChoiceBuilder extends obsidian.Modal {
    constructor(app) {
        super(app);
        this.didSubmit = false;
        this.svelteElements = [];
        this.waitForClose = new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
        this.containerEl.addClass('quickAddModal');
        this.open();
    }
    reload() {
        this.contentEl.empty();
        this.display();
    }
    addFileSearchInputToSetting(setting, value, onChangeCallback) {
        let component;
        setting.addSearch(searchComponent => {
            component = searchComponent;
            searchComponent.setValue(value);
            searchComponent.setPlaceholder("File path");
            const markdownFiles = this.app.vault.getMarkdownFiles().map(f => f.path);
            new GenericTextSuggester(this.app, searchComponent.inputEl, markdownFiles);
            searchComponent.onChange(onChangeCallback);
        });
        return component;
    }
    addCenteredChoiceNameHeader(choice) {
        const headerEl = this.contentEl.createEl('h2', { cls: "choiceNameHeader" });
        headerEl.setText(choice.name);
        headerEl.addEventListener('click', async (ev) => {
            try {
                const newName = await GenericInputPrompt.Prompt(this.app, choice.name, "Choice name", choice.name);
                if (newName !== choice.name) {
                    choice.name = newName;
                    headerEl.setText(newName);
                }
            }
            catch (e) {
                log.logMessage(`No new name given for ${choice.name}`);
            }
        });
    }
    onClose() {
        super.onClose();
        this.resolvePromise(this.choice);
        this.svelteElements.forEach(el => {
            if (el && el.$destroy)
                el.$destroy();
        });
        if (!this.didSubmit)
            this.rejectPromise("No answer given.");
        else
            this.resolvePromise(this.input);
    }
}

/* src/gui/ChoiceBuilder/FolderList.svelte generated by Svelte v3.47.0 */

function add_css$3(target) {
	append_styles(target, "svelte-tuapcq", ".quickAddCommandListItem.svelte-tuapcq{display:flex;align-items:center;justify-content:space-between}@media(min-width: 768px){.quickAddFolderListGrid.svelte-tuapcq{display:grid;grid-template-columns:repeat(2, 1fr);column-gap:20px}}.quickAddCommandList.svelte-tuapcq{max-width:50%;margin:12px auto}.clickable.svelte-tuapcq{cursor:pointer}");
}

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	child_ctx[6] = i;
	return child_ctx;
}

// (11:4) {#each folders as folder, i}
function create_each_block$1(ctx) {
	let div;
	let span0;
	let t0_value = /*folder*/ ctx[4] + "";
	let t0;
	let t1;
	let span1;
	let icon;
	let t2;
	let current;
	let mounted;
	let dispose;
	icon = new Icon({ props: { data: faTrash } });

	function click_handler() {
		return /*click_handler*/ ctx[3](/*folder*/ ctx[4]);
	}

	return {
		c() {
			div = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			span1 = element("span");
			create_component(icon.$$.fragment);
			t2 = space();
			attr(span1, "class", "clickable svelte-tuapcq");
			attr(div, "class", "quickAddCommandListItem svelte-tuapcq");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span0);
			append(span0, t0);
			append(div, t1);
			append(div, span1);
			mount_component(icon, span1, null);
			append(div, t2);
			current = true;

			if (!mounted) {
				dispose = listen(span1, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if ((!current || dirty & /*folders*/ 1) && t0_value !== (t0_value = /*folder*/ ctx[4] + "")) set_data(t0, t0_value);
		},
		i(local) {
			if (current) return;
			transition_in(icon.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(icon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(icon);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$6(ctx) {
	let div;
	let current;
	let each_value = /*folders*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "quickAddFolderListGrid quickAddCommandList svelte-tuapcq");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*deleteFolder, folders, faTrash*/ 3) {
				each_value = /*folders*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$6($$self, $$props, $$invalidate) {
	let { folders } = $$props;
	let { deleteFolder } = $$props;

	const updateFolders = newFolders => {
		$$invalidate(0, folders = newFolders);
	};

	const click_handler = folder => deleteFolder(folder);

	$$self.$$set = $$props => {
		if ('folders' in $$props) $$invalidate(0, folders = $$props.folders);
		if ('deleteFolder' in $$props) $$invalidate(1, deleteFolder = $$props.deleteFolder);
	};

	return [folders, deleteFolder, updateFolders, click_handler];
}

class FolderList extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$6,
			create_fragment$6,
			safe_not_equal,
			{
				folders: 0,
				deleteFolder: 1,
				updateFolders: 2
			},
			add_css$3
		);
	}

	get updateFolders() {
		return this.$$.ctx[2];
	}
}

function getTemplater(app) {
    // @ts-ignore
    return app.plugins.plugins["templater-obsidian"];
}
async function replaceTemplaterTemplatesInCreatedFile(app, file, force = false) {
    const templater = getTemplater(app);
    if (templater && (force || !(templater === null || templater === void 0 ? void 0 : templater.settings["trigger_on_file_creation"]))) {
        app.workspace.getActiveFile();
        await templater.templater.overwrite_file_commands(file);
    }
}
async function templaterParseTemplate(app, templateContent, targetFile) {
    const templater = getTemplater(app);
    if (!templater)
        return templateContent;
    return await templater.templater.parse_template({ target_file: targetFile, run_mode: 4 }, templateContent);
}
function getCoreTemplatesPath(app) {
    // @ts-ignore
    const internalTemplatePlugin = app.internalPlugins.plugins.templates;
    if (internalTemplatePlugin) {
        const templateFolderPath = internalTemplatePlugin.instance.options.folder;
        if (templateFolderPath)
            return templateFolderPath;
    }
}
function getTemplaterTemplatesPath(app) {
    const templater = getTemplater(app);
    if (templater) {
        const templateFolderPath = templater.settings["template_folder"];
        if (templateFolderPath)
            return templateFolderPath;
    }
}
function getTemplateFiles(app) {
    let templateFiles = new Set();
    const markdownFiles = app.vault.getMarkdownFiles();
    const coreTemplatesPath = getCoreTemplatesPath(app);
    const templaterTemplatesPath = getTemplaterTemplatesPath(app);
    markdownFiles.forEach(file => {
        if (file.path.contains(coreTemplatesPath) || file.path.contains(templaterTemplatesPath))
            templateFiles.add(file);
    });
    return [...templateFiles];
}
function getTemplatePaths(app) {
    return getTemplateFiles(app).map(file => file.path);
}
function getNaturalLanguageDates(app) {
    // @ts-ignore
    return app.plugins.plugins["nldates-obsidian"];
}
function getDate(input) {
    let duration;
    if (input.offset !== null && input.offset !== undefined && typeof input.offset === "number") {
        duration = window.moment.duration(input.offset, "days");
    }
    return input.format ? window.moment().add(duration).format(input.format)
        : window.moment().add(duration).format("YYYY-MM-DD");
}
function appendToCurrentLine(toAppend, app) {
    try {
        const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!activeView) {
            log.logError(`unable to append '${toAppend}' to current line.`);
            return;
        }
        activeView.editor.replaceSelection(toAppend);
    }
    catch (_a) {
        log.logError(`unable to append '${toAppend}' to current line.`);
    }
}
function findObsidianCommand(app, commandId) {
    // @ts-ignore
    return app.commands.findCommand(commandId);
}
function deleteObsidianCommand(app, commandId) {
    if (findObsidianCommand(app, commandId)) {
        // @ts-ignore
        delete app.commands.commands[commandId];
        // @ts-ignore
        delete app.commands.editorCommands[commandId];
    }
}
function getAllFolderPathsInVault(app) {
    return app.vault.getAllLoadedFiles()
        .filter(f => f instanceof obsidian.TFolder)
        .map(folder => folder.path);
}
function getUserScriptMemberAccess(fullMemberPath) {
    const fullMemberArray = fullMemberPath.split("::");
    return {
        basename: fullMemberArray[0],
        memberAccess: fullMemberArray.slice(1)
    };
}
function waitFor(ms) {
    return new Promise(res => setTimeout(res, ms));
}
function getLinesInString(input) {
    let lines = [];
    let tempString = input;
    while (tempString.contains("\n")) {
        const lineEndIndex = tempString.indexOf("\n");
        lines.push(tempString.slice(0, lineEndIndex));
        tempString = tempString.slice(lineEndIndex + 1);
    }
    lines.push(tempString);
    return lines;
}
// https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
async function openFile(app, file, optional) {
    let leaf;
    if ((optional === null || optional === void 0 ? void 0 : optional.openInNewTab) && (optional === null || optional === void 0 ? void 0 : optional.direction)) {
        leaf = app.workspace.splitActiveLeaf(optional.direction);
    }
    else {
        leaf = app.workspace.getUnpinnedLeaf();
    }
    await leaf.openFile(file);
    if ((optional === null || optional === void 0 ? void 0 : optional.mode) || (optional === null || optional === void 0 ? void 0 : optional.focus)) {
        await leaf.setViewState(Object.assign(Object.assign({}, leaf.getViewState()), { state: optional.mode && optional.mode !== 'default' ? Object.assign(Object.assign({}, leaf.view.getState()), { mode: optional.mode }) : leaf.view.getState(), popstate: true }), { focus: optional === null || optional === void 0 ? void 0 : optional.focus });
    }
}
// Slightly modified version of Templater's user script import implementation
// Source: https://github.com/SilentVoid13/Templater
async function getUserScript(command, app) {
    // @ts-ignore
    const file = app.vault.getAbstractFileByPath(command.path);
    if (!file) {
        log.logError(`failed to load file ${command.path}.`);
        return;
    }
    if (file instanceof obsidian.TFile) {
        let req = (s) => window.require && window.require(s);
        let exp = {};
        let mod = { exports: exp };
        const fileContent = await app.vault.read(file);
        const fn = window.eval(`(function(require, module, exports) { ${fileContent} \n})`);
        fn(req, mod, exp);
        // @ts-ignore
        const userScript = exp['default'] || mod.exports;
        if (!userScript)
            return;
        let script = userScript;
        const { memberAccess } = getUserScriptMemberAccess(command.name);
        if (memberAccess && memberAccess.length > 0) {
            let member;
            while (member = memberAccess.shift()) {
                script = script[member];
            }
        }
        return script;
    }
}

class Formatter {
    constructor() {
        this.variables = new Map();
    }
    replacer(str, reg, replaceValue) {
        return str.replace(reg, function () { return replaceValue; });
    }
    replaceDateInString(input) {
        let output = input;
        while (DATE_REGEX.test(output)) {
            const dateMatch = DATE_REGEX.exec(output);
            let offset;
            if (dateMatch[1]) {
                const offsetString = dateMatch[1].replace('+', '').trim();
                const offsetIsInt = NUMBER_REGEX.test(offsetString);
                if (offsetIsInt)
                    offset = parseInt(offsetString);
            }
            output = this.replacer(output, DATE_REGEX, getDate({ offset: offset }));
        }
        while (DATE_REGEX_FORMATTED.test(output)) {
            const dateMatch = DATE_REGEX_FORMATTED.exec(output);
            const format = dateMatch[1];
            let offset;
            if (dateMatch[2]) {
                const offsetString = dateMatch[2].replace('+', '').trim();
                const offsetIsInt = NUMBER_REGEX.test(offsetString);
                if (offsetIsInt)
                    offset = parseInt(offsetString);
            }
            output = this.replacer(output, DATE_REGEX_FORMATTED, getDate({ format, offset }));
        }
        return output;
    }
    async replaceValueInString(input) {
        let output = input;
        while (NAME_VALUE_REGEX.test(output)) {
            if (!this.value)
                this.value = await this.promptForValue();
            output = this.replacer(output, NAME_VALUE_REGEX, this.value);
        }
        return output;
    }
    async replaceLinkToCurrentFileInString(input) {
        const currentFilePathLink = this.getCurrentFileLink();
        let output = input;
        while (LINK_TO_CURRENT_FILE_REGEX.test(output))
            output = this.replacer(output, LINK_TO_CURRENT_FILE_REGEX, currentFilePathLink);
        return output;
    }
    async replaceVariableInString(input) {
        let output = input;
        while (VARIABLE_REGEX.test(output)) {
            const match = VARIABLE_REGEX.exec(output);
            const variableName = match[1];
            if (variableName) {
                if (!this.getVariableValue(variableName)) {
                    const suggestedValues = variableName.split(",");
                    if (suggestedValues.length === 1)
                        this.variables.set(variableName, await this.promptForVariable(variableName));
                    else
                        this.variables.set(variableName, await this.suggestForValue(suggestedValues));
                }
                output = this.replacer(output, VARIABLE_REGEX, this.getVariableValue(variableName));
            }
            else {
                break;
            }
        }
        return output;
    }
    async replaceMathValueInString(input) {
        let output = input;
        while (MATH_VALUE_REGEX.test(output)) {
            const mathstr = await this.promptForMathValue();
            output = this.replacer(output, MATH_VALUE_REGEX, mathstr);
        }
        return output;
    }
    async replaceMacrosInString(input) {
        let output = input;
        while (MACRO_REGEX.test(output)) {
            const macroName = MACRO_REGEX.exec(output)[1];
            const macroOutput = await this.getMacroValue(macroName);
            output = this.replacer(output, MACRO_REGEX, macroOutput ? macroOutput.toString() : "");
        }
        return output;
    }
    async replaceDateVariableInString(input) {
        let output = input;
        while (DATE_VARIABLE_REGEX.test(output)) {
            const match = DATE_VARIABLE_REGEX.exec(output);
            const variableName = match[1];
            const dateFormat = match[2];
            if (variableName && dateFormat) {
                if (!this.variables[variableName]) {
                    this.variables[variableName] = await this.promptForVariable(variableName);
                    const parseAttempt = this.getNaturalLanguageDates().parseDate(this.variables[variableName]);
                    if (parseAttempt)
                        this.variables[variableName] = parseAttempt.moment.format(dateFormat);
                    else
                        throw new Error(`unable to parse date variable ${this.variables[variableName]}`);
                }
                output = this.replacer(output, DATE_VARIABLE_REGEX, this.variables[variableName]);
            }
            else {
                break;
            }
        }
        return output;
    }
    async replaceTemplateInString(input) {
        let output = input;
        while (TEMPLATE_REGEX.test(output)) {
            const templatePath = TEMPLATE_REGEX.exec(output)[1];
            const templateContent = await this.getTemplateContent(templatePath);
            output = this.replacer(output, TEMPLATE_REGEX, templateContent);
        }
        return output;
    }
    replaceLinebreakInString(input) {
        let output = input;
        let match = LINEBREAK_REGEX.exec(output);
        while (match && input[match.index - 1] !== "\\") {
            output = this.replacer(output, LINEBREAK_REGEX, `\n`);
            match = LINEBREAK_REGEX.exec(output);
        }
        const EscapedLinebreakRegex = /\\\\n/;
        while (EscapedLinebreakRegex.test(output)) {
            output = this.replacer(output, EscapedLinebreakRegex, `\\n`);
        }
        return output;
    }
}

class FileNameDisplayFormatter extends Formatter {
    constructor(app) {
        super();
        this.app = app;
    }
    async format(input) {
        let output = input;
        output = await this.replaceMacrosInString(output);
        output = this.replaceDateInString(output);
        output = await this.replaceValueInString(output);
        output = await this.replaceDateVariableInString(output);
        output = await this.replaceVariableInString(output);
        return `File Name: ${output}`;
    }
    promptForValue(header) {
        return `FileName`;
    }
    getVariableValue(variableName) {
        return variableName;
    }
    getCurrentFileLink() {
        var _a;
        return (_a = this.app.workspace.getActiveFile().path) !== null && _a !== void 0 ? _a : "";
    }
    getNaturalLanguageDates() {
        return getNaturalLanguageDates(this.app);
    }
    suggestForValue(suggestedValues) {
        return "_suggest_";
    }
    promptForMathValue() {
        return Promise.resolve("_math_");
    }
    getMacroValue(macroName) {
        return `_macro: ${macroName}`;
    }
    async promptForVariable(variableName) {
        return `_${variableName}_`;
    }
    async getTemplateContent(templatePath) {
        return `/${templatePath}/`;
    }
    async getSelectedText() {
        return "_selected_";
    }
}

var FormatSyntaxToken;
(function (FormatSyntaxToken) {
    FormatSyntaxToken[FormatSyntaxToken["Date"] = 0] = "Date";
    FormatSyntaxToken[FormatSyntaxToken["DateFormat"] = 1] = "DateFormat";
    FormatSyntaxToken[FormatSyntaxToken["VariableDate"] = 2] = "VariableDate";
    FormatSyntaxToken[FormatSyntaxToken["Value"] = 3] = "Value";
    FormatSyntaxToken[FormatSyntaxToken["Name"] = 4] = "Name";
    FormatSyntaxToken[FormatSyntaxToken["Variable"] = 5] = "Variable";
    FormatSyntaxToken[FormatSyntaxToken["LinkCurrent"] = 6] = "LinkCurrent";
    FormatSyntaxToken[FormatSyntaxToken["Macro"] = 7] = "Macro";
    FormatSyntaxToken[FormatSyntaxToken["Template"] = 8] = "Template";
    FormatSyntaxToken[FormatSyntaxToken["MathValue"] = 9] = "MathValue";
})(FormatSyntaxToken || (FormatSyntaxToken = {}));
class FormatSyntaxSuggester extends TextInputSuggest {
    constructor(app, inputEl, plugin, suggestForFileNames = false) {
        super(app, inputEl);
        this.app = app;
        this.inputEl = inputEl;
        this.plugin = plugin;
        this.suggestForFileNames = suggestForFileNames;
        this.lastInput = "";
        this.macroNames = this.plugin.settings.macros.map(macro => macro.name);
        this.templatePaths = getTemplatePaths(this.app);
    }
    getSuggestions(inputStr) {
        const cursorPosition = this.inputEl.selectionStart;
        const lookbehind = 15;
        const inputBeforeCursor = inputStr.substr(cursorPosition - lookbehind, lookbehind);
        let suggestions = [];
        this.processToken(inputBeforeCursor, (match, type, suggestion) => {
            this.lastInput = match[0];
            this.lastInputType = type;
            suggestions.push(suggestion);
            if (this.lastInputType === FormatSyntaxToken.Template) {
                suggestions.push(...this.templatePaths.map(templatePath => `{{TEMPLATE:${templatePath}}}`));
            }
            if (this.lastInputType === FormatSyntaxToken.Macro) {
                suggestions.push(...this.macroNames.map(macroName => `{{MACRO:${macroName}}}`));
            }
        });
        return suggestions;
    }
    selectSuggestion(item) {
        const cursorPosition = this.inputEl.selectionStart;
        const lastInputLength = this.lastInput.length;
        const currentInputValue = this.inputEl.value;
        let insertedEndPosition = 0;
        const insert = (text, offset = 0) => {
            return `${currentInputValue.substr(0, cursorPosition - lastInputLength + offset)}${text}${currentInputValue.substr(cursorPosition)}`;
        };
        this.processToken(item, ((match, type, suggestion) => {
            if (item.contains(suggestion)) {
                this.inputEl.value = insert(item);
                this.lastInputType = type;
                insertedEndPosition = cursorPosition - lastInputLength + item.length;
                if (this.lastInputType === FormatSyntaxToken.VariableDate ||
                    this.lastInputType === FormatSyntaxToken.Variable ||
                    this.lastInputType === FormatSyntaxToken.DateFormat) {
                    insertedEndPosition -= 2;
                }
            }
        }));
        this.inputEl.trigger("input");
        this.close();
        this.inputEl.setSelectionRange(insertedEndPosition, insertedEndPosition);
    }
    renderSuggestion(value, el) {
        if (value)
            el.setText(value);
    }
    processToken(input, callback) {
        const dateFormatMatch = DATE_FORMAT_SYNTAX_SUGGEST_REGEX.exec(input);
        if (dateFormatMatch)
            callback(dateFormatMatch, FormatSyntaxToken.DateFormat, "{{DATE:}}");
        const dateMatch = DATE_SYNTAX_SUGGEST_REGEX.exec(input);
        if (dateMatch)
            callback(dateMatch, FormatSyntaxToken.Date, DATE_SYNTAX);
        const nameMatch = NAME_SYNTAX_SUGGEST_REGEX.exec(input);
        if (nameMatch)
            callback(nameMatch, FormatSyntaxToken.Name, NAME_SYNTAX);
        const valueMatch = VALUE_SYNTAX_SUGGEST_REGEX.exec(input);
        if (valueMatch)
            callback(valueMatch, FormatSyntaxToken.Value, VALUE_SYNTAX);
        const mathValueMatch = MATH_VALUE_SYNTAX_SUGGEST_REGEX.exec(input);
        if (mathValueMatch)
            callback(mathValueMatch, FormatSyntaxToken.MathValue, MATH_VALUE_SYNTAX);
        const variableMatch = VARIABLE_SYNTAX_SUGGEST_REGEX.exec(input);
        if (variableMatch)
            callback(variableMatch, FormatSyntaxToken.Variable, "{{VALUE:}}");
        const variableDateMatch = VARIABLE_DATE_SYNTAX_SUGGEST_REGEX.exec(input);
        if (variableDateMatch)
            callback(variableDateMatch, FormatSyntaxToken.VariableDate, "{{VDATE:}}");
        if (!this.suggestForFileNames) {
            const linkCurrentMatch = LINKCURRENT_SYNTAX_SUGGEST_REGEX.exec(input);
            if (linkCurrentMatch)
                callback(linkCurrentMatch, FormatSyntaxToken.LinkCurrent, LINKCURRENT_SYNTAX);
            const templateMatch = TEMPLATE_SYNTAX_SUGGEST_REGEX.exec(input);
            if (templateMatch)
                callback(templateMatch, FormatSyntaxToken.Template, "{{TEMPLATE:");
            const macroMatch = MACRO_SYNTAX_SUGGEST_REGEX.exec(input);
            if (macroMatch)
                callback(macroMatch, FormatSyntaxToken.Macro, "{{MACRO:");
        }
    }
}

class ExclusiveSuggester extends TextInputSuggest {
    constructor(app, inputEl, suggestItems, currentItems) {
        super(app, inputEl);
        this.app = app;
        this.inputEl = inputEl;
        this.suggestItems = suggestItems;
        this.currentItems = currentItems;
    }
    updateCurrentItems(currentItems) {
        this.currentItems = currentItems;
    }
    getSuggestions(inputStr) {
        return this.suggestItems.filter(item => item.contains(inputStr));
    }
    selectSuggestion(item) {
        this.inputEl.value = item;
        this.inputEl.trigger("input");
        this.close();
    }
    renderSuggestion(value, el) {
        if (value)
            el.setText(value);
    }
}

class TemplateChoiceBuilder extends ChoiceBuilder {
    constructor(app, choice, plugin) {
        super(app);
        this.plugin = plugin;
        this.choice = choice;
        this.display();
    }
    display() {
        this.containerEl.addClass("templateChoiceBuilder");
        this.addCenteredChoiceNameHeader(this.choice);
        this.addTemplatePathSetting();
        this.addFileNameFormatSetting();
        this.addFolderSetting();
        this.addAppendLinkSetting();
        this.addIncrementFileNameSetting();
        this.addOpenFileSetting();
        if (this.choice.openFile)
            this.addOpenFileInNewTabSetting();
    }
    addTemplatePathSetting() {
        new obsidian.Setting(this.contentEl)
            .setName('Template Path')
            .setDesc('Path to the Template.')
            .addSearch(search => {
            const templates = getTemplatePaths(this.app);
            search.setValue(this.choice.templatePath);
            search.setPlaceholder("Template path");
            new GenericTextSuggester(this.app, search.inputEl, templates);
            search.onChange(value => {
                this.choice.templatePath = value;
            });
        });
    }
    addFileNameFormatSetting() {
        let textField;
        const enableSetting = new obsidian.Setting(this.contentEl);
        enableSetting.setName("File Name Format")
            .setDesc("Set the file name format.")
            .addToggle(toggleComponent => {
            toggleComponent.setValue(this.choice.fileNameFormat.enabled)
                .onChange(value => {
                this.choice.fileNameFormat.enabled = value;
                textField.setDisabled(!value);
            });
        });
        const formatDisplay = this.contentEl.createEl('span');
        const displayFormatter = new FileNameDisplayFormatter(this.app);
        (async () => formatDisplay.textContent = await displayFormatter.format(this.choice.fileNameFormat.format))();
        const formatInput = new obsidian.TextComponent(this.contentEl);
        formatInput.setPlaceholder("File name format");
        textField = formatInput;
        formatInput.inputEl.style.width = "100%";
        formatInput.inputEl.style.marginBottom = "8px";
        formatInput.setValue(this.choice.fileNameFormat.format)
            .setDisabled(!this.choice.fileNameFormat.enabled)
            .onChange(async (value) => {
            this.choice.fileNameFormat.format = value;
            formatDisplay.textContent = await displayFormatter.format(value);
        });
        new FormatSyntaxSuggester(this.app, textField.inputEl, this.plugin, true);
    }
    addFolderSetting() {
        var _a, _b, _c, _d;
        const folderSetting = new obsidian.Setting(this.contentEl);
        folderSetting.setName("Create in folder")
            .setDesc("Create the file in the specified folder. If multiple folders are specified, you will be prompted for which folder to create the file in.")
            .addToggle(toggle => {
            toggle.setValue(this.choice.folder.enabled);
            toggle.onChange(value => {
                this.choice.folder.enabled = value;
                this.reload();
            });
        });
        if (this.choice.folder.enabled) {
            if (!((_a = this.choice.folder) === null || _a === void 0 ? void 0 : _a.createInSameFolderAsActiveFile)) {
                const chooseFolderWhenCreatingNoteContainer = this.contentEl.createDiv('chooseFolderWhenCreatingNoteContainer');
                chooseFolderWhenCreatingNoteContainer.createEl('span', { text: "Choose folder when creating a new note" });
                const chooseFolderWhenCreatingNote = new obsidian.ToggleComponent(chooseFolderWhenCreatingNoteContainer);
                chooseFolderWhenCreatingNote.setValue((_b = this.choice.folder) === null || _b === void 0 ? void 0 : _b.chooseWhenCreatingNote)
                    .onChange(value => {
                    this.choice.folder.chooseWhenCreatingNote = value;
                    this.reload();
                });
                if (!((_c = this.choice.folder) === null || _c === void 0 ? void 0 : _c.chooseWhenCreatingNote)) {
                    this.addFolderSelector();
                }
            }
            if (!((_d = this.choice.folder) === null || _d === void 0 ? void 0 : _d.chooseWhenCreatingNote)) {
                const createInSameFolderAsActiveFileSetting = new obsidian.Setting(this.contentEl);
                createInSameFolderAsActiveFileSetting.setName("Create in same folder as active file")
                    .setDesc("Creates the file in the same folder as the currently active file. Will not create the file if there is no active file.")
                    .addToggle(toggle => {
                    var _a;
                    return toggle
                        .setValue((_a = this.choice.folder) === null || _a === void 0 ? void 0 : _a.createInSameFolderAsActiveFile)
                        .onChange(value => {
                        this.choice.folder.createInSameFolderAsActiveFile = value;
                        this.reload();
                    });
                });
            }
        }
    }
    addFolderSelector() {
        const folderSelectionContainer = this.contentEl.createDiv('folderSelectionContainer');
        const folderList = folderSelectionContainer.createDiv('folderList');
        const folderListEl = new FolderList({
            target: folderList,
            props: {
                folders: this.choice.folder.folders,
                deleteFolder: (folder) => {
                    this.choice.folder.folders = this.choice.folder.folders.filter(f => f !== folder);
                    folderListEl.updateFolders(this.choice.folder.folders);
                    suggester.updateCurrentItems(this.choice.folder.folders);
                }
            }
        });
        this.svelteElements.push(folderListEl);
        const inputContainer = folderSelectionContainer.createDiv('folderInputContainer');
        const folderInput = new obsidian.TextComponent(inputContainer);
        folderInput.inputEl.style.width = "100%";
        folderInput.setPlaceholder("Folder path");
        const allFolders = getAllFolderPathsInVault(this.app);
        const suggester = new ExclusiveSuggester(this.app, folderInput.inputEl, allFolders, this.choice.folder.folders);
        const addFolder = () => {
            const input = folderInput.inputEl.value.trim();
            if (this.choice.folder.folders.some(folder => folder === input)) {
                log.logWarning("cannot add same folder twice.");
                return;
            }
            this.choice.folder.folders.push(input);
            folderListEl.updateFolders(this.choice.folder.folders);
            folderInput.inputEl.value = "";
            suggester.updateCurrentItems(this.choice.folder.folders);
        };
        folderInput.inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addFolder();
            }
        });
        const addButton = new obsidian.ButtonComponent(inputContainer);
        addButton.setCta().setButtonText("Add").onClick(evt => {
            addFolder();
        });
    }
    addAppendLinkSetting() {
        const appendLinkSetting = new obsidian.Setting(this.contentEl);
        appendLinkSetting.setName("Append link")
            .setDesc("Append link to created file to current file.")
            .addToggle(toggle => {
            toggle.setValue(this.choice.appendLink);
            toggle.onChange(value => this.choice.appendLink = value);
        });
    }
    addIncrementFileNameSetting() {
        const incrementFileNameSetting = new obsidian.Setting(this.contentEl);
        incrementFileNameSetting.setName("Increment file name")
            .setDesc("If the file already exists, increment the file name.")
            .addToggle(toggle => {
            toggle.setValue(this.choice.incrementFileName);
            toggle.onChange(value => this.choice.incrementFileName = value);
        });
    }
    addOpenFileSetting() {
        const noOpenSetting = new obsidian.Setting(this.contentEl);
        noOpenSetting.setName("Open")
            .setDesc("Open the created file.")
            .addToggle(toggle => {
            toggle.setValue(this.choice.openFile);
            toggle.onChange(value => {
                this.choice.openFile = value;
                this.reload();
            });
        })
            .addDropdown(dropdown => {
            dropdown.selectEl.style.marginLeft = "10px";
            if (!this.choice.openFileInMode)
                this.choice.openFileInMode = 'default';
            dropdown
                .addOption('source', 'Source')
                .addOption('preview', 'Preview')
                .addOption('default', 'Default')
                .setValue(this.choice.openFileInMode)
                .onChange(value => this.choice.openFileInMode = value);
        });
    }
    addOpenFileInNewTabSetting() {
        const newTabSetting = new obsidian.Setting(this.contentEl);
        newTabSetting.setName("New Tab")
            .setDesc("Open created file in a new tab.")
            .addToggle(toggle => {
            toggle.setValue(this.choice.openFileInNewTab.enabled);
            toggle.onChange(value => this.choice.openFileInNewTab.enabled = value);
        })
            .addDropdown(dropdown => {
            dropdown.selectEl.style.marginLeft = "10px";
            dropdown.addOption(NewTabDirection.vertical, "Vertical");
            dropdown.addOption(NewTabDirection.horizontal, "Horizontal");
            dropdown.setValue(this.choice.openFileInNewTab.direction);
            dropdown.onChange(value => this.choice.openFileInNewTab.direction = value);
        });
        new obsidian.Setting(this.contentEl)
            .setName("Focus new pane")
            .setDesc("Focus the opened tab immediately")
            .addToggle(toggle => toggle
            .setValue(this.choice.openFileInNewTab.focus)
            .onChange(value => this.choice.openFileInNewTab.focus = value));
    }
}

class QuickAddEngine {
    constructor(app) {
        this.app = app;
    }
    async createFolder(folder) {
        const folderExists = await this.app.vault.adapter.exists(folder);
        if (!folderExists) {
            await this.app.vault.createFolder(folder);
        }
    }
    formatFilePath(folderPath, fileName) {
        const actualFolderPath = folderPath ? `${folderPath}/` : "";
        const formattedFileName = fileName.replace(MARKDOWN_FILE_EXTENSION_REGEX, '');
        return `${actualFolderPath}${formattedFileName}.md`;
    }
    async fileExists(filePath) {
        return await this.app.vault.adapter.exists(filePath);
    }
    async getFileByPath(filePath) {
        const file = await this.app.vault.getAbstractFileByPath(filePath);
        if (!file) {
            log.logError(`${filePath} not found`);
            return null;
        }
        if (file instanceof obsidian.TFolder) {
            log.logError(`${filePath} found but it's a folder`);
            return null;
        }
        if (file instanceof obsidian.TFile)
            return file;
    }
    async createFileWithInput(filePath, fileContent) {
        const dirMatch = filePath.match(/(.*)[\/\\]/);
        let dirName = "";
        if (dirMatch)
            dirName = dirMatch[1];
        if (await this.app.vault.adapter.exists(dirName)) {
            return await this.app.vault.create(filePath, fileContent);
        }
        else {
            await this.createFolder(dirName);
            return await this.app.vault.create(filePath, fileContent);
        }
    }
}

class GenericSuggester extends obsidian.FuzzySuggestModal {
    constructor(app, displayItems, items) {
        super(app);
        this.displayItems = displayItems;
        this.items = items;
        this.promise = new Promise((resolve, reject) => { (this.resolvePromise = resolve); (this.rejectPromise = reject); });
        this.open();
    }
    static Suggest(app, displayItems, items) {
        const newSuggester = new GenericSuggester(app, displayItems, items);
        return newSuggester.promise;
    }
    getItemText(item) {
        return this.displayItems[this.items.indexOf(item)];
    }
    getItems() {
        return this.items;
    }
    selectSuggestion(value, evt) {
        this.resolved = true;
        super.selectSuggestion(value, evt);
    }
    onChooseItem(item, evt) {
        this.resolved = true;
        this.resolvePromise(item);
    }
    onClose() {
        super.onClose();
        if (!this.resolved)
            this.rejectPromise("no input given.");
    }
}

var CommandType;
(function (CommandType) {
    CommandType["Obsidian"] = "Obsidian";
    CommandType["UserScript"] = "UserScript";
    CommandType["Choice"] = "Choice";
    CommandType["Wait"] = "Wait";
    CommandType["NestedChoice"] = "NestedChoice";
    CommandType["EditorCommand"] = "EditorCommand";
})(CommandType || (CommandType = {}));

class GenericCheckboxPrompt extends obsidian.Modal {
    constructor(app, items, selectedItems = []) {
        super(app);
        this.items = items;
        this.selectedItems = selectedItems;
        // This clones the item so that we don't get any unexpected modifications of the
        // arguments
        this._selectedItems = [...selectedItems];
        this.promise = new Promise((resolve, reject) => { (this.resolvePromise = resolve); (this.rejectPromise = reject); });
        this.display();
        this.open();
    }
    static Open(app, items, selectedItems) {
        const newSuggester = new GenericCheckboxPrompt(app, items, selectedItems);
        return newSuggester.promise;
    }
    display() {
        this.contentEl.empty();
        this.containerEl.addClass('quickAddModal', 'checkboxPrompt');
        this.addCheckboxRows();
        this.addSubmitButton();
    }
    onClose() {
        super.onClose();
        if (!this.resolved)
            this.rejectPromise("no input given.");
    }
    addCheckboxRows() {
        const rowContainer = this.contentEl.createDiv('checkboxRowContainer');
        this.items.forEach(item => this.addCheckboxRow(item, rowContainer));
    }
    addCheckboxRow(item, container) {
        const checkboxRow = container.createDiv('checkboxRow');
        checkboxRow.createEl('span', { text: item });
        const checkbox = new obsidian.ToggleComponent(checkboxRow);
        checkbox
            .setTooltip(`Toggle ${item}`)
            .setValue(this._selectedItems.contains(item))
            .onChange(value => {
            if (value)
                this._selectedItems.push(item);
            else {
                const index = this._selectedItems.findIndex(value => item === value);
                this._selectedItems.splice(index, 1);
            }
        });
    }
    addSubmitButton() {
        const submitButtonContainer = this.contentEl.createDiv('submitButtonContainer');
        const submitButton = new obsidian.ButtonComponent(submitButtonContainer);
        submitButton.setButtonText("Submit").setCta().onClick(evt => {
            this.resolved = true;
            this.resolvePromise(this._selectedItems);
            this.close();
        });
    }
}

class GenericWideInputPrompt extends obsidian.Modal {
    constructor(app, header, placeholder, value) {
        super(app);
        this.header = header;
        this.didSubmit = false;
        this.submitClickCallback = (evt) => this.submit();
        this.cancelClickCallback = (evt) => this.cancel();
        this.submitEnterCallback = (evt) => {
            if ((evt.ctrlKey || evt.metaKey) && evt.key === "Enter") {
                evt.preventDefault();
                this.submit();
            }
        };
        this.placeholder = placeholder;
        this.input = value;
        this.waitForClose = new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
        this.display();
        this.open();
        this.fileSuggester = new SilentFileSuggester(app, this.inputComponent.inputEl);
        this.tagSuggester = new SilentTagSuggester(app, this.inputComponent.inputEl);
    }
    static Prompt(app, header, placeholder, value) {
        const newPromptModal = new GenericWideInputPrompt(app, header, placeholder, value);
        return newPromptModal.waitForClose;
    }
    display() {
        this.containerEl.addClass('quickAddModal', 'qaWideInputPrompt');
        this.contentEl.empty();
        this.titleEl.textContent = this.header;
        const mainContentContainer = this.contentEl.createDiv();
        this.inputComponent = this.createInputField(mainContentContainer, this.placeholder, this.input);
        this.createButtonBar(mainContentContainer);
    }
    createInputField(container, placeholder, value) {
        const textComponent = new obsidian.TextAreaComponent(container);
        textComponent.inputEl.classList.add('wideInputPromptInputEl');
        textComponent.setPlaceholder(placeholder !== null && placeholder !== void 0 ? placeholder : "")
            .setValue(value !== null && value !== void 0 ? value : "")
            .onChange(value => this.input = value)
            .inputEl.addEventListener('keydown', this.submitEnterCallback);
        return textComponent;
    }
    createButton(container, text, callback) {
        const btn = new obsidian.ButtonComponent(container);
        btn.setButtonText(text)
            .onClick(callback);
        return btn;
    }
    createButtonBar(mainContentContainer) {
        const buttonBarContainer = mainContentContainer.createDiv();
        this.createButton(buttonBarContainer, "Ok", this.submitClickCallback)
            .setCta().buttonEl.style.marginRight = '0';
        this.createButton(buttonBarContainer, "Cancel", this.cancelClickCallback);
        buttonBarContainer.style.display = 'flex';
        buttonBarContainer.style.flexDirection = 'row-reverse';
        buttonBarContainer.style.justifyContent = 'flex-start';
        buttonBarContainer.style.marginTop = '1rem';
    }
    submit() {
        this.didSubmit = true;
        this.close();
    }
    cancel() {
        this.close();
    }
    resolveInput() {
        if (!this.didSubmit)
            this.rejectPromise("No input given.");
        else
            this.resolvePromise(this.input);
    }
    removeInputListener() {
        this.inputComponent.inputEl.removeEventListener('keydown', this.submitEnterCallback);
    }
    onOpen() {
        super.onOpen();
        this.inputComponent.inputEl.focus();
        this.inputComponent.inputEl.select();
    }
    onClose() {
        super.onClose();
        this.resolveInput();
        this.removeInputListener();
    }
}

class QuickAddApi {
    static GetApi(app, plugin, choiceExecutor) {
        return {
            inputPrompt: (header, placeholder, value) => { return this.inputPrompt(app, header, placeholder, value); },
            wideInputPrompt: (header, placeholder, value) => { return this.wideInputPrompt(app, header, placeholder, value); },
            yesNoPrompt: (header, text) => { return this.yesNoPrompt(app, header, text); },
            suggester: (displayItems, actualItems) => { return this.suggester(app, displayItems, actualItems); },
            checkboxPrompt: (items, selectedItems) => { return this.checkboxPrompt(app, items, selectedItems); },
            executeChoice: async (choiceName, variables) => {
                const choice = plugin.getChoiceByName(choiceName);
                if (!choice)
                    log.logError(`choice named '${choiceName}' not found`);
                if (variables) {
                    Object.keys(variables).forEach(key => {
                        choiceExecutor.variables.set(key, variables[key]);
                    });
                }
                await choiceExecutor.execute(choice);
                choiceExecutor.variables.clear();
            },
            format: async (input) => {
                return new CompleteFormatter(app, plugin, choiceExecutor).formatFileContent(input);
            },
            utility: {
                getClipboard: async () => { return await navigator.clipboard.readText(); },
                setClipboard: async (text) => { return await navigator.clipboard.writeText(text); },
                getSelectedText: () => {
                    const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (!activeView) {
                        log.logError("no active view - could not get selected text.");
                        return;
                    }
                    if (!activeView.editor.somethingSelected()) {
                        log.logError("no text selected.");
                        return;
                    }
                    return activeView.editor.getSelection();
                }
            },
            date: {
                now: (format, offset) => {
                    return getDate({ format, offset });
                },
                tomorrow: (format) => {
                    return getDate({ format, offset: 1 });
                },
                yesterday: (format) => {
                    return getDate({ format, offset: -1 });
                }
            }
        };
    }
    static async inputPrompt(app, header, placeholder, value) {
        try {
            return await GenericInputPrompt.Prompt(app, header, placeholder, value);
        }
        catch (_a) {
            return undefined;
        }
    }
    static async wideInputPrompt(app, header, placeholder, value) {
        try {
            return await GenericWideInputPrompt.Prompt(app, header, placeholder, value);
        }
        catch (_a) {
            return undefined;
        }
    }
    static async yesNoPrompt(app, header, text) {
        try {
            return await GenericYesNoPrompt.Prompt(app, header, text);
        }
        catch (_a) {
            return undefined;
        }
    }
    static async suggester(app, displayItems, actualItems) {
        try {
            let displayedItems;
            if (typeof displayItems === "function") {
                displayedItems = actualItems.map(displayItems);
            }
            else {
                displayedItems = displayItems;
            }
            return await GenericSuggester.Suggest(app, displayedItems, actualItems);
        }
        catch (_a) {
            return undefined;
        }
    }
    static async checkboxPrompt(app, items, selectedItems) {
        try {
            return await GenericCheckboxPrompt.Open(app, items, selectedItems);
        }
        catch (_a) {
            return undefined;
        }
    }
}

class QuickAddChoiceEngine extends QuickAddEngine {
}

var EditorCommandType;
(function (EditorCommandType) {
    EditorCommandType["Cut"] = "Cut";
    EditorCommandType["Copy"] = "Copy";
    EditorCommandType["Paste"] = "Paste";
    EditorCommandType["SelectActiveLine"] = "Select active line";
    EditorCommandType["SelectLinkOnActiveLine"] = "Select link on active line";
})(EditorCommandType || (EditorCommandType = {}));

class Command {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.id = v4();
    }
}

class EditorCommand extends Command {
    constructor(type) {
        super(type, CommandType.EditorCommand);
        this.editorCommandType = type;
    }
    static getSelectedText(app) {
        return this.getActiveMarkdownView(app).editor.getSelection();
    }
    static getActiveMarkdownView(app) {
        const activeView = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!activeView) {
            log.logError("no active markdown view.");
            return;
        }
        return activeView;
    }
}

class CutCommand extends EditorCommand {
    constructor() {
        super(EditorCommandType.Cut);
    }
    static async run(app) {
        const selectedText = EditorCommand.getSelectedText(app);
        const activeView = EditorCommand.getActiveMarkdownView(app);
        if (!selectedText) {
            log.logError("nothing selected.");
            return;
        }
        await navigator.clipboard.writeText(selectedText);
        activeView.editor.replaceSelection("");
    }
}

class CopyCommand extends EditorCommand {
    constructor() {
        super(EditorCommandType.Copy);
    }
    static async run(app) {
        const selectedText = EditorCommand.getSelectedText(app);
        await navigator.clipboard.writeText(selectedText);
    }
}

class PasteCommand extends EditorCommand {
    constructor() {
        super(EditorCommandType.Paste);
    }
    static async run(app) {
        const clipboard = await navigator.clipboard.readText();
        const activeView = EditorCommand.getActiveMarkdownView(app);
        if (!activeView) {
            log.logError("no active markdown view.");
            return;
        }
        activeView.editor.replaceSelection(clipboard);
    }
}

class SelectActiveLineCommand extends EditorCommand {
    constructor() {
        super(EditorCommandType.SelectActiveLine);
    }
    static run(app) {
        const activeView = EditorCommand.getActiveMarkdownView(app);
        const { line: lineNumber } = activeView.editor.getCursor();
        const line = activeView.editor.getLine(lineNumber);
        const lineLength = line.length;
        activeView.editor.setSelection({ line: lineNumber, ch: 0 }, { line: lineNumber, ch: lineLength });
    }
}

class SelectLinkOnActiveLineCommand extends EditorCommand {
    constructor() {
        super(EditorCommandType.SelectLinkOnActiveLine);
    }
    static async run(app) {
        const activeView = EditorCommand.getActiveMarkdownView(app);
        const { line: lineNumber } = activeView.editor.getCursor();
        const line = activeView.editor.getLine(lineNumber);
        const match = WIKI_LINK_REGEX.exec(line);
        if (!match) {
            log.logError(`no internal link found on line ${lineNumber}.`);
            return;
        }
        const matchStart = match.index;
        const matchEnd = match[0].length + matchStart;
        activeView.editor.setSelection({ line: lineNumber, ch: matchStart }, { line: lineNumber, ch: matchEnd });
    }
}

class MacroChoiceEngine extends QuickAddChoiceEngine {
    constructor(app, plugin, choice, macros, choiceExecutor, variables) {
        super(app);
        this.choice = choice;
        this.plugin = plugin;
        this.macros = macros;
        this.choiceExecutor = choiceExecutor;
        this.params = { app: this.app, quickAddApi: QuickAddApi.GetApi(app, plugin, choiceExecutor), variables: {}, obsidian: obsidian__namespace };
        variables === null || variables === void 0 ? void 0 : variables.forEach(((value, key) => {
            this.params.variables[key] = value;
        }));
    }
    async run() {
        var _a, _b, _c;
        const macroId = (_a = this.choice.macroId) !== null && _a !== void 0 ? _a : (_c = (_b = this.choice) === null || _b === void 0 ? void 0 : _b.macro) === null || _c === void 0 ? void 0 : _c.id;
        const macro = this.macros.find(m => m.id === macroId);
        if (!macro || !(macro === null || macro === void 0 ? void 0 : macro.commands)) {
            log.logError(`No commands in the selected macro. Did you select a macro for '${this.choice.name}'?`);
        }
        await this.executeCommands(macro.commands);
    }
    async executeCommands(commands) {
        for (const command of commands) {
            if ((command === null || command === void 0 ? void 0 : command.type) === CommandType.Obsidian)
                await this.executeObsidianCommand(command);
            if ((command === null || command === void 0 ? void 0 : command.type) === CommandType.UserScript)
                await this.executeUserScript(command);
            if ((command === null || command === void 0 ? void 0 : command.type) === CommandType.Choice)
                await this.executeChoice(command);
            if ((command === null || command === void 0 ? void 0 : command.type) === CommandType.Wait) {
                const waitCommand = command;
                await waitFor(waitCommand.time);
            }
            if ((command === null || command === void 0 ? void 0 : command.type) === CommandType.NestedChoice) {
                await this.executeNestedChoice(command);
            }
            if ((command === null || command === void 0 ? void 0 : command.type) === CommandType.EditorCommand) {
                await this.executeEditorCommand(command);
            }
            Object.keys(this.params.variables).forEach(key => {
                this.choiceExecutor.variables.set(key, this.params.variables[key]);
            });
        }
    }
    // Slightly modified from Templater's user script engine:
    // https://github.com/SilentVoid13/Templater/blob/master/src/UserTemplates/UserTemplateParser.ts
    async executeUserScript(command) {
        const userScript = await getUserScript(command, this.app);
        if (!userScript) {
            log.logError(`failed to load user script ${command.path}.`);
            return;
        }
        // @ts-ignore
        if (userScript.settings) {
            this.userScriptCommand = command;
        }
        await this.userScriptDelegator(userScript);
        if (this.userScriptCommand)
            this.userScriptCommand = null;
    }
    async runScriptWithSettings(userScript, command) {
        if (userScript.entry) {
            await this.onExportIsFunction(userScript.entry, command.settings);
        }
        else {
            await this.onExportIsFunction(userScript, command.settings);
        }
    }
    async userScriptDelegator(userScript) {
        switch (typeof userScript) {
            case "function":
                if (this.userScriptCommand) {
                    await this.runScriptWithSettings(userScript, this.userScriptCommand);
                }
                else {
                    await this.onExportIsFunction(userScript);
                }
                break;
            case "object":
                await this.onExportIsObject(userScript);
                break;
            case "bigint":
            case "boolean":
            case "number":
            case "string":
                this.output = userScript.toString();
                break;
            default:
                log.logError(`user script in macro for '${this.choice.name}' is invalid`);
        }
    }
    async onExportIsFunction(userScript, settings) {
        this.output = await userScript(this.params, settings);
    }
    async onExportIsObject(obj) {
        if (this.userScriptCommand && obj.entry !== null) {
            await this.runScriptWithSettings(obj, this.userScriptCommand);
            return;
        }
        try {
            const keys = Object.keys(obj);
            const selected = await GenericSuggester.Suggest(this.app, keys, keys);
            await this.userScriptDelegator(obj[selected]);
        }
        catch (e) {
            log.logMessage(e);
        }
    }
    executeObsidianCommand(command) {
        // @ts-ignore
        this.app.commands.executeCommandById(command.commandId);
    }
    async executeChoice(command) {
        const targetChoice = this.plugin.getChoiceById(command.choiceId);
        if (!targetChoice) {
            log.logError("choice could not be found.");
            return;
        }
        await this.choiceExecutor.execute(targetChoice);
    }
    async executeNestedChoice(command) {
        const choice = command.choice;
        if (!choice) {
            log.logError(`choice in ${command.name} is invalid`);
            return;
        }
        await this.choiceExecutor.execute(choice);
    }
    async executeEditorCommand(command) {
        switch (command.editorCommandType) {
            case EditorCommandType.Cut:
                await CutCommand.run(this.app);
                break;
            case EditorCommandType.Copy:
                await CopyCommand.run(this.app);
                break;
            case EditorCommandType.Paste:
                await PasteCommand.run(this.app);
                break;
            case EditorCommandType.SelectActiveLine:
                await SelectActiveLineCommand.run(this.app);
                break;
            case EditorCommandType.SelectLinkOnActiveLine:
                await SelectLinkOnActiveLineCommand.run(this.app);
                break;
        }
    }
}

class SingleMacroEngine extends MacroChoiceEngine {
    constructor(app, plugin, macros, choiceExecutor, variables) {
        super(app, plugin, null, macros, choiceExecutor, variables);
    }
    async runAndGetOutput(macroName) {
        const { basename, memberAccess } = getUserScriptMemberAccess(macroName);
        const macro = this.macros.find(macro => macro.name === basename);
        if (!macro) {
            log.logError(`macro '${macroName}' does not exist.`);
            return;
        }
        if (memberAccess && memberAccess.length > 0) {
            this.memberAccess = memberAccess;
        }
        await this.executeCommands(macro.commands);
        return this.output;
    }
    async onExportIsObject(obj) {
        if (!this.memberAccess)
            return await super.onExportIsObject(obj);
        let newObj = obj;
        this.memberAccess.forEach(key => {
            newObj = newObj[key];
        });
        await this.userScriptDelegator(newObj);
    }
}

class SingleInlineScriptEngine extends MacroChoiceEngine {
    constructor(app, plugin, choiceExecutor, variables) {
        super(app, plugin, null, null, choiceExecutor, variables);
    }
    async runAndGetOutput(code) {
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
        const userCode = new AsyncFunction(code);
        return await userCode.bind(this.params, this).call();
    }
}

const LATEX_CURSOR_MOVE_HERE = "\u261A";
// Modified from https://github.com/echaos/BetterLatexForObsidian (MIT License).
const commands = [
    "\\!",
    "\\,",
    "\\:",
    "\\>",
    "\\;",
    "\\#",
    "\\$",
    "\\%",
    "\\&",
    "\\",
    "\_",
    "\{ \}",
    "\|",
    `\^{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    `\[${LATEX_CURSOR_MOVE_HERE}]${LATEX_CURSOR_MOVE_HERE}`,
    "\\above",
    "\\abovewithdelims",
    "\\acute",
    "\\aleph",
    "\\alpha",
    "\\amalg",
    "\\And",
    "\\angle",
    "\\approx",
    "\\approxeq",
    "\\arccos",
    "\\arcsin",
    "\\arctan",
    "\\arg",
    "\\array",
    "\\arrowvert",
    "\\Arrowvert",
    "\\ast",
    "\\asymp",
    "\\atop",
    "\\atopwithdelims",
    "\\backepsilon",
    "\\backprime",
    "\\backsim",
    "\\backsimeq",
    "\\backslash",
    "\\bar",
    "\\barwedge",
    "\\Bbb",
    "\\Bbbk",
    "\\because",
    "\\begin",
    "\\beta",
    "\\beth",
    "\\between",
    "\\bf",
    "\\Bigg",
    "\\bigg",
    "\\Big",
    "\\big",
    "\\Biggl", "\\Biggm", "\\Biggr",
    "\\biggl", "\\biggm", "\\biggr",
    "\\Bigl", "\\Bigm", "\\Bigl",
    "\\bigl", "\\bigm", "\\bigr",
    "\\bigcap",
    "\\bigcirc",
    "\\bigcup",
    "\\bigodot",
    "\\bigoplus",
    "\\bigotimes",
    "\\bigsqcup",
    "\\bigstar",
    "\\bigtriangledown",
    "\\bigtriangleup",
    "\\biguplus",
    "\\bigvee",
    "\\bigwedge",
    "\\binom",
    "\\blacklozenge",
    "\\blacksquare",
    "\\blacktriangle",
    "\\blacktriangledown",
    "\\blacktriangleleft",
    "\\blacktriangleright",
    "\\bmod",
    "\\boldsymbol",
    "\\bot",
    "\\bowtie",
    "\\Box",
    "\\boxdot",
    "\\boxed",
    "\\boxminus",
    "\\boxplus",
    "\\boxtimes",
    "\\brace",
    "\\bracevert",
    "\\brack",
    "\\breve",
    "\\bullet",
    "\\Bumpeq",
    "\\bumpeq",
    "\\cal",
    "\\cancel",
    "\\Cap",
    "\\cap",
    "\\cases",
    "\\cdot",
    "\\cdotp",
    "\\cdots",
    "\\centerdot",
    `\\cfrac{${LATEX_CURSOR_MOVE_HERE}}{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    "\\check",
    "\\checkmark",
    "\\chi",
    "\\choose",
    "\\circ",
    "\\circeq",
    "\\circlearrowleft",
    "\\circlearrowright",
    "\\circledast",
    "\\circledcirc",
    "\\circleddash",
    "\\circledR",
    "\\circledS",
    "\\class",
    "\\clubsuit",
    "\\colon",
    "\\color",
    "\\complement",
    "\\cong",
    "\\coprod",
    "\\cos",
    "\\cosh",
    "\\cot",
    "\\coth",
    "\\cr",
    "\\csc",
    "\\cssId",
    "\\Cup",
    "\\cup",
    "\\curlyeqprec",
    "\\curlyeqsucc",
    "\\curlyvee",
    "\\curlywedge",
    "\\curvearrowleft",
    "\\curvearrowright",
    "\\dagger",
    "\\ddagger",
    "\\daleth",
    "\\dashleftarrow",
    "\\dashrightarrow",
    "\\dashv",
    "\\dbinom",
    "\\dot",
    "\\ddot",
    "\\dddot",
    "\\ddddot",
    "\\ddots",
    "\\DeclareMathOperator",
    "\\def",
    "\\deg",
    "\\Delta",
    "\\delta",
    "\\det",
    `\\dfrac{${LATEX_CURSOR_MOVE_HERE}}{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    "\\diagdown",
    "\\diagup",
    "\\Diamond",
    "\\diamond",
    "\\diamondsuit",
    "\\digamma",
    "\\dim",
    "\\displaylines",
    "\\displaystyle",
    "\\div",
    "\\divideontimes",
    "\\Doteq",
    "\\doteq",
    "\\dotplus",
    "\\dots",
    "\\dotsb",
    "\\dotsc",
    "\\dotsi",
    "\\dotsm",
    "\\dotso",
    "\\doublebarwedge",
    "\\doublecap",
    "\\doublecup",
    "\\downarrow",
    "\\Downarrow",
    "\\downdownarrows",
    "\\downharpoonleft",
    "\\downharpoonright",
    "\\ell",
    "\\emptyset",
    "\\end",
    "\\enspace",
    "\\epsilon",
    "\\eqalign",
    "\\eqalignno",
    "\\eqcirc",
    "\\eqsim",
    "\\eqslantgtr",
    "\\eqslantless",
    "\\equiv",
    "\\eta",
    "\\eth",
    "\\exists",
    "\\exp",
    "\\fallingdotseq",
    "\\fbox",
    "\\Finv",
    "\\flat",
    "\\forall",
    `\\frac{${LATEX_CURSOR_MOVE_HERE}}{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    "\\frak",
    "\\frown",
    "\\Game",
    "\\Gamma",
    "\\gamma",
    "\\gcd",
    "\\ge",
    "\\geq",
    "\\geqq",
    "\\geqslant",
    "\\genfrac",
    "\\gets",
    "\\gg",
    "\\ggg",
    "\\gggtr",
    "\\gimel",
    "\\gtrapprox",
    "\\gnapprox",
    "\\gneq",
    "\\gneqq",
    "\\gvertneqq",
    "\\gtrsim",
    "\\gnsim",
    "\\grave",
    "\\gt",
    "\\gtrdot",
    "\\gtreqless",
    "\\gtreqqless",
    "\\gtrless",
    "\\hat",
    "\\hbar",
    "\\hbox",
    "\\hdashline",
    "\\hline",
    "\\heartsuit",
    "\\hfil",
    "\\hfill",
    "\\hom",
    "\\hookleftarrow",
    "\\hookrightarrow",
    "\\hphantom",
    "\\href",
    "\\hskip",
    "\\hslash",
    "\\hspace",
    "\\Huge",
    "\\huge",
    "\\iddots",
    "\\idotsint",
    "\\iff",
    "\\iiiint",
    "\\iiint",
    "\\iint",
    "\\int",
    "\\intop",
    "\\Im",
    "\\imath",
    "\\impliedby",
    "\\implies",
    "\\in",
    "\\inf",
    "\\infty",
    "\\injlim",
    "\\intercal",
    "\\iota",
    "\\it",
    "\\jmath",
    "\\Join",
    "\\kappa",
    "\\ker",
    "\\kern",
    "\\Lambda",
    "\\lambda",
    "\\land",
    "\\langle",
    "\\LARGE",
    "\\Large",
    "\\large",
    "\\LaTeX",
    "\\lbrace",
    "\\lbrack",
    "\\lceil",
    "\\ldotp",
    "\\ldots",
    "\\le",
    "\\leq",
    "\\leqq",
    "\\leqslant",
    "\\leadsto",
    "\\left",
    "\\leftarrow",
    "\\Leftarrow",
    "\\leftarrowtail",
    "\\leftharpoondown",
    "\\leftharpoonup",
    "\\leftleftarrows",
    "\\leftrightarrow",
    "\\Leftrightarrow",
    "\\leftrightarrows",
    "\\leftrightharpoons",
    "\\leftrightsquigarrow",
    "\\leftroot",
    "\\leftthreetimes",
    "\\leqalignno",
    "\\lessapprox",
    "\\lessdot",
    "\\lesseqgtr",
    "\\lesseqqgtr",
    "\\lessgtr",
    "\\lesssim",
    "\\lfloor",
    "\\lg",
    "\\lgroup",
    "\\lhd",
    "\\lim",
    "\\liminf",
    "\\limits",
    "\\limsup",
    "\\ll",
    "\\llap",
    "\\llcorner",
    "\\lrcorner",
    "\\Lleftarrow",
    "\\lll",
    "\\llless",
    "\\lmoustache",
    "\\ln",
    "\\lnapprox",
    "\\lneq",
    "\\lneqq",
    "\\lnot",
    "\\lnsim",
    "\\log",
    "\\longleftarrow",
    "\\Longleftarrow",
    "\\longrightarrow",
    "\\Longrightarrow",
    "\\longleftrightarrow",
    "\\Longleftrightarrow",
    "\\longmapsto",
    "\\looparrowleft",
    "\\looparrowright",
    "\\lor",
    "\\lower",
    "\\lozenge",
    "\\Lsh",
    "\\lt",
    "\\ltimes",
    "\\lvert",
    "\\lVert",
    "\\lvertneqq",
    "\\maltese",
    "\\mapsto",
    "\\mathbb",
    "\\mathbf",
    "\\mathbin",
    "\\mathcal",
    "\\mathchoice",
    "\\mathclose",
    "\\mathfrak",
    "\\mathinner",
    "\\mathit",
    "\\mathop",
    "\\mathopen",
    "\\mathord",
    "\\mathpunct",
    "\\mathrel",
    "\\mathring",
    "\\mathrm",
    "\\mathscr",
    "\\mathsf",
    "\\mathstrut",
    "\\mathtt",
    "\\matrix",
    "\\max",
    "\\mbox",
    "\\measuredangle",
    "\\mho",
    "\\mid",
    "\\min",
    "\\mit",
    "\\mod",
    "\\models",
    "\\moveleft",
    "\\moveright",
    "\\mp",
    "\\mskip",
    "\\mspace",
    "\\mu",
    "\\multimap",
    "\\nabla",
    "\\natural",
    "\\ncong",
    "\\ne",
    "\\nearrow",
    "\\neg",
    "\\negthinspace",
    "\\negmedspace",
    "\\negthickspace",
    "\\neq",
    "\\newcommand",
    "\\newenvironment",
    "\\newline",
    "\\nexists",
    "\\ngeq",
    "\\ngeqq",
    "\\ngeqslant",
    "\\ngtr",
    "\\ni",
    "\\nleftarrow",
    "\\nLeftarrow",
    "\\nleftrightarrow",
    "\\nLeftrightarrow",
    "\\nleq",
    "\\nleqq",
    "\\nleqslant",
    "\\nless",
    "\\nmid",
    "\\nobreakspace",
    "\\nolimits",
    "\\normalsize",
    "\\not",
    "\\notag",
    "\\notin",
    "\\nparallel",
    "\\nprec",
    "\\npreceq",
    "\\nrightarrow",
    "\\nRightarrow",
    "\\nshortmid",
    "\\nshortparallel",
    "\\nsim",
    "\\nsubseteq",
    "\\nsubseteqq",
    "\\nsucc",
    "\\nsucceq",
    "\\nsupseteq",
    "\\nsupseteqq",
    "\\ntriangleleft",
    "\\ntrianglelefteq",
    "\\ntriangleright",
    "\\ntrianglerighteq",
    "\\nu",
    "\\nVDash",
    "\\nVdash",
    "\\nvDash",
    "\\nvdash",
    "\\nwarrow",
    "\\odot",
    "\\ominus",
    "\\oplus",
    "\\oslash",
    "\\otimes",
    "\\oint",
    "\\oldstyle",
    "\\omega",
    "\\Omega",
    "\\omicron",
    "\\operatorname",
    "\\over",
    "\\overbrace",
    "\\overleftarrow",
    "\\overrightarrow",
    "\\overleftrightarrow",
    "\\overline",
    "\\overparen",
    "\\overset",
    "\\overwithdelims",
    "\\owns",
    "\\parallel",
    "\\partial",
    "\\perp",
    "\\phantom",
    "\\phi",
    "\\Phi",
    "\\pi",
    "\\Pi",
    "\\pitchfork",
    "\\pm",
    "\\pmatrix",
    "\\pmb",
    "\\pmod",
    "\\pod",
    "\\Pr",
    "\\prec",
    "\\precapprox",
    "\\precnapprox",
    "\\preccurlyeq",
    "\\preceq",
    "\\precneqq",
    "\\precsim",
    "\\precnsim",
    "\\prime",
    "\\prod",
    "\\projlim",
    "\\propto",
    "\\psi",
    "\\Psi",
    "\\quad",
    "\\qquad",
    "\\raise",
    "\\rangle",
    "\\rbrace",
    "\\rbrack",
    "\\rceil",
    "\\Re",
    "\\renewcommand",
    "\\require (non-standard)",
    "\\restriction",
    "\\rfloor",
    "\\rgroup",
    "\\rhd",
    "\\rho",
    "\\right",
    "\\rightarrow",
    "\\Rightarrow",
    "\\rightarrowtail",
    "\\rightharpoondown",
    "\\rightharpoonup",
    "\\rightleftarrows",
    "\\rightleftharpoons",
    "\\rightrightarrows",
    "\\rightsquigarrow",
    "\\rightthreetimes",
    "\\risingdotseq",
    "\\rlap",
    "\\rm",
    "\\rmoustache",
    "\\Rrightarrow",
    "\\Rsh",
    "\\rtimes",
    "\\Rule (non-standard)",
    "\\rvert",
    "\\rVert",
    "\\S",
    "\\scr",
    "\\scriptscriptstyle",
    "\\scriptsize",
    "\\scriptstyle",
    "\\searrow",
    "\\sec",
    "\\setminus",
    "\\sf",
    "\\sharp",
    "\\shortmid",
    "\\shortparallel",
    "\\shoveleft",
    "\\shoveright",
    "\\sideset",
    "\\sigma",
    "\\Sigma",
    "\\sim",
    "\\simeq",
    "\\sin",
    "\\sinh",
    "\\skew",
    "\\small",
    "\\smallfrown",
    "\\smallint",
    "\\smallsetminus",
    "\\smallsmile",
    "\\smash",
    "\\smile",
    "\\space",
    "\\Space (non-standard)",
    "\\spadesuit",
    "\\sphericalangle",
    "\\sqcap",
    "\\sqcup",
    "\\sqrt",
    "\\sqsubset",
    "\\sqsupset",
    "\\sqsubseteq",
    "\\sqsupseteq",
    "\\square",
    "\\stackrel",
    "\\star",
    "\\strut",
    "\\style",
    "\\subset",
    "\\Subset",
    "\\subseteq",
    "\\subsetneq",
    "\\subseteqq",
    "\\subsetneqq",
    "\\substack",
    "\\succ",
    "\\succapprox",
    "\\succnapprox",
    "\\succcurlyeq",
    "\\succeq",
    "\\succneqq",
    "\\succsim",
    "\\succnsim",
    "\\sum",
    "\\sup",
    "\\supset",
    "\\Supset",
    "\\supseteq",
    "\\supsetneq",
    "\\supseteqq",
    "\\supsetneqq",
    "\\surd",
    "\\swarrow",
    "\\tag",
    "\\tan",
    "\\tanh",
    "\\tau",
    "\\tbinom",
    "\\TeX",
    `\\text{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    `\\textbf{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    `\\textit{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    `\\textrm{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    `\\textsf{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    `\\texttt{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    "\\textstyle",
    `\\tfrac{${LATEX_CURSOR_MOVE_HERE}}{${LATEX_CURSOR_MOVE_HERE}}${LATEX_CURSOR_MOVE_HERE}`,
    "\\therefore",
    "\\theta",
    "\\Theta",
    "\\thickapprox",
    "\\thicksim",
    "\\thinspace",
    "\\tilde",
    "\\times",
    "\\tiny",
    "\\Tiny",
    "\\to",
    "\\top",
    "\\triangle",
    "\\triangledown",
    "\\triangleleft",
    "\\triangleright",
    "\\trianglelefteq",
    "\\trianglerighteq",
    "\\triangleq",
    "\\tt",
    "\\twoheadleftarrow",
    "\\twoheadrightarrow",
    "\\ulcorner",
    "\\urcorner",
    "\\underbrace",
    "\\underleftarrow",
    "\\underrightarrow",
    "\\underleftrightarrow",
    "\\underline",
    "\\underparen",
    "\\underset",
    "\\unicode",
    "\\unlhd",
    "\\unrhd",
    "\\uparrow",
    "\\Uparrow",
    "\\updownarrow",
    "\\Updownarrow",
    "\\upharpoonleft",
    "\\upharpoonright",
    "\\uplus",
    "\\uproot",
    "\\upsilon",
    "\\Upsilon",
    "\\upuparrows",
    "\\varDelta",
    "\\varepsilon",
    "\\varGamma",
    "\\varinjlim",
    "\\varkappa",
    "\\varLambda",
    "\\varlimsup",
    "\\varliminf",
    "\\varnothing",
    "\\varOmega",
    "\\varphi",
    "\\varPhi",
    "\\varpi",
    "\\varPi",
    "\\varprojlim",
    "\\varpropto",
    "\\varPsi",
    "\\varrho",
    "\\varsigma",
    "\\varSigma",
    "\\varsubsetneq",
    "\\varsubsetneqq",
    "\\varsupsetneq",
    "\\varsupsetneqq",
    "\\vartheta",
    "\\varTheta",
    "\\vartriangle",
    "\\vartriangleleft",
    "\\vartriangleright",
    "\\varUpsilon",
    "\\varXi",
    "\\vcenter",
    "\\vdash",
    "\\Vdash",
    "\\vDash",
    "\\vdots",
    "\\vec",
    "\\vee",
    "\\veebar",
    "\\verb",
    "\\vert",
    "\\Vert",
    "\\vphantom",
    "\\Vvdash",
    "\\wedge",
    "\\widehat",
    "\\widetilde",
    "\\wp",
    "\\wr",
    "\\Xi",
    "\\xi",
    "\\xleftarrow",
    "\\xrightarrow",
    "\\yen",
    "\\zeta",
    "\\{%C\\}%C",
    "\\langle %C \\rangle%C"
];
const environments = [
    "align",
    "align*",
    "alignat",
    "alignat*",
    "array",
    "Bmatrix",
    "bmatrix",
    "cases",
    "eqnarray",
    "eqnarray*",
    "equation",
    "equation*",
    "gather",
    "gather*",
    "matrix",
    "pmatrix",
    "smallmatrix",
    "subarray",
    "Vmatrix",
    "vmatrix",
];
function beginEndGen(symbol) {
    return `\\begin{${symbol}}\n${LATEX_CURSOR_MOVE_HERE}\n\\end{${symbol}}${LATEX_CURSOR_MOVE_HERE}`;
}
const LaTeXSymbols = [...commands, ...environments.map(beginEndGen)];

const LATEX_REGEX = new RegExp(/\\([a-z{}A-Z0-9]*)$/);
class LaTeXSuggester extends TextInputSuggest {
    constructor(inputEl) {
        super(QuickAdd.instance.app, inputEl);
        this.inputEl = inputEl;
        this.lastInput = "";
        this.symbols = Object.assign([], LaTeXSymbols);
        this.elementsRendered = this.symbols.reduce((elements, symbol) => {
            try {
                elements[symbol.toString()] = obsidian.renderMath(symbol, true);
            }
            catch (_a) { } // Ignoring symbols that we can't use
            return elements;
        }, {});
    }
    getSuggestions(inputStr) {
        const cursorPosition = this.inputEl.selectionStart;
        const inputBeforeCursor = inputStr.substr(0, cursorPosition);
        const lastBackslashPos = inputBeforeCursor.lastIndexOf("\\");
        const commandText = inputBeforeCursor.substr(lastBackslashPos);
        const match = LATEX_REGEX.exec(commandText);
        let suggestions = [];
        if (match) {
            this.lastInput = match[1];
            suggestions = this.symbols.filter(val => val.toLowerCase().contains(this.lastInput));
        }
        const fuse = new Fuse(suggestions, { findAllMatches: true, threshold: 0.8 });
        const searchResults = fuse.search(this.lastInput);
        return searchResults.map(value => value.item);
    }
    renderSuggestion(item, el) {
        if (item) {
            el.setText(item);
            el.append(this.elementsRendered[item]);
        }
    }
    selectSuggestion(item) {
        const cursorPosition = this.inputEl.selectionStart;
        const lastInputLength = this.lastInput.length;
        const currentInputValue = this.inputEl.value;
        let insertedEndPosition = 0;
        const textToInsert = item.replace(/\\\\/g, "\\");
        this.inputEl.value = `${currentInputValue.substr(0, cursorPosition - lastInputLength - 1)}${textToInsert}${currentInputValue.substr(cursorPosition)}`;
        insertedEndPosition = cursorPosition - lastInputLength + item.length - 1;
        this.inputEl.trigger("input");
        this.close();
        if (item.contains(LATEX_CURSOR_MOVE_HERE)) {
            const cursorPos = this.inputEl.value.indexOf(LATEX_CURSOR_MOVE_HERE);
            this.inputEl.value = this.inputEl.value.replace(LATEX_CURSOR_MOVE_HERE, "");
            this.inputEl.setSelectionRange(cursorPos, cursorPos);
        }
        else {
            this.inputEl.setSelectionRange(insertedEndPosition, insertedEndPosition);
        }
    }
}

class MathModal extends obsidian.Modal {
    constructor() {
        super(QuickAdd.instance.app);
        this.didSubmit = false;
        this.keybindListener = (evt) => {
            if (evt.ctrlKey && evt.key === "Enter") {
                this.submit();
            }
            if (evt.key === "Tab") {
                evt.preventDefault();
                this.cursorToGoTo();
            }
        };
        this.submitClickCallback = (evt) => this.submit();
        this.cancelClickCallback = (evt) => this.cancel();
        this.open();
        this.display();
        this.waitForClose = new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
        new LaTeXSuggester(this.inputEl);
        this.inputEl.focus();
        this.inputEl.select();
    }
    static Prompt() {
        return new MathModal().waitForClose;
    }
    display() {
        this.containerEl.addClass('quickAddModal', 'qaMathModal');
        this.contentEl.empty();
        const mathDiv = this.contentEl.createDiv();
        mathDiv.className = "math math-block is-loaded";
        const tc = new obsidian.TextAreaComponent(this.contentEl);
        tc.inputEl.style.width = "100%";
        tc.inputEl.style.height = "10rem";
        this.inputEl = tc.inputEl;
        tc.onChange(obsidian.debounce(async (value) => await this.mathjaxLoop(mathDiv, value), 50));
        tc.inputEl.addEventListener('keydown', this.keybindListener);
        this.createButtonBar(this.contentEl.createDiv());
    }
    async onOpen() {
        super.onOpen();
        await obsidian.loadMathJax();
    }
    async mathjaxLoop(container, value) {
        const html = obsidian.renderMath(value, true);
        await obsidian.finishRenderMath();
        container.empty();
        container.append(html);
    }
    cursorToGoTo() {
        if (this.inputEl.value.contains(LATEX_CURSOR_MOVE_HERE)) {
            const cursorPos = this.inputEl.value.indexOf(LATEX_CURSOR_MOVE_HERE);
            this.inputEl.value = this.inputEl.value.replace(LATEX_CURSOR_MOVE_HERE, "");
            this.inputEl.setSelectionRange(cursorPos, cursorPos);
        }
    }
    createButton(container, text, callback) {
        const btn = new obsidian.ButtonComponent(container);
        btn.setButtonText(text)
            .onClick(callback);
        return btn;
    }
    createButtonBar(mainContentContainer) {
        const buttonBarContainer = mainContentContainer.createDiv();
        this.createButton(buttonBarContainer, "Ok", this.submitClickCallback)
            .setCta().buttonEl.style.marginRight = '0';
        this.createButton(buttonBarContainer, "Cancel", this.cancelClickCallback);
        buttonBarContainer.style.display = 'flex';
        buttonBarContainer.style.flexDirection = 'row-reverse';
        buttonBarContainer.style.justifyContent = 'flex-start';
        buttonBarContainer.style.marginTop = '1rem';
    }
    removeInputListeners() {
        this.inputEl.removeEventListener('keydown', this.keybindListener);
    }
    resolveInput() {
        const output = this.inputEl.value.replace("\\n", `\\\\n`).replace(new RegExp(LATEX_CURSOR_MOVE_HERE, "g"), '');
        if (!this.didSubmit)
            this.rejectPromise("No input given.");
        else
            this.resolvePromise(output);
    }
    submit() {
        this.didSubmit = true;
        this.close();
    }
    cancel() {
        this.close();
    }
    onClose() {
        super.onClose();
        this.resolveInput();
        this.removeInputListeners();
    }
}

class InputPrompt {
    factory() {
        if (QuickAdd.instance.settings.inputPrompt === "multi-line") {
            return GenericWideInputPrompt;
        }
        else {
            return GenericInputPrompt;
        }
    }
}

class CompleteFormatter extends Formatter {
    constructor(app, plugin, choiceExecutor) {
        super();
        this.app = app;
        this.plugin = plugin;
        this.choiceExecutor = choiceExecutor;
        this.variables = choiceExecutor === null || choiceExecutor === void 0 ? void 0 : choiceExecutor.variables;
    }
    async format(input) {
        let output = input;
        output = await this.replaceInlineJavascriptInString(output);
        output = await this.replaceMacrosInString(output);
        output = await this.replaceTemplateInString(output);
        output = this.replaceDateInString(output);
        output = await this.replaceValueInString(output);
        output = await this.replaceDateVariableInString(output);
        output = await this.replaceVariableInString(output);
        output = await this.replaceMathValueInString(output);
        return output;
    }
    async formatFileName(input, valueHeader) {
        this.valueHeader = valueHeader;
        return await this.format(input);
    }
    async formatFileContent(input) {
        let output = input;
        output = await this.format(output);
        output = await this.replaceLinkToCurrentFileInString(output);
        return output;
    }
    async formatFolderPath(folderName) {
        return await this.format(folderName);
    }
    getCurrentFileLink() {
        const currentFile = this.app.workspace.getActiveFile();
        if (!currentFile)
            return null;
        return this.app.fileManager.generateMarkdownLink(currentFile, '');
    }
    getNaturalLanguageDates() {
        return getNaturalLanguageDates(this.app);
    }
    getVariableValue(variableName) {
        return this.variables.get(variableName);
    }
    async promptForValue(header) {
        var _a;
        if (!this.value) {
            const selectedText = await this.getSelectedText();
            this.value = selectedText ? selectedText :
                await new InputPrompt().factory().Prompt(this.app, (_a = this.valueHeader) !== null && _a !== void 0 ? _a : `Enter value`);
        }
        return this.value;
    }
    async promptForVariable(header) {
        return await new InputPrompt().factory().Prompt(this.app, header);
    }
    async promptForMathValue() {
        return await MathModal.Prompt();
    }
    async suggestForValue(suggestedValues) {
        return await GenericSuggester.Suggest(this.app, suggestedValues, suggestedValues);
    }
    async getMacroValue(macroName) {
        var _a;
        const macroEngine = new SingleMacroEngine(this.app, this.plugin, this.plugin.settings.macros, this.choiceExecutor, this.variables);
        const macroOutput = (_a = await macroEngine.runAndGetOutput(macroName)) !== null && _a !== void 0 ? _a : "";
        Object.keys(macroEngine.params.variables).forEach(key => {
            this.variables.set(key, macroEngine.params.variables[key]);
        });
        return macroOutput;
    }
    async getTemplateContent(templatePath) {
        return await new SingleTemplateEngine(this.app, this.plugin, templatePath, this.choiceExecutor).run();
    }
    async getSelectedText() {
        const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!activeView)
            return;
        return activeView.editor.getSelection();
    }
    async replaceInlineJavascriptInString(input) {
        var _a;
        let output = input;
        while (INLINE_JAVASCRIPT_REGEX.test(output)) {
            const match = INLINE_JAVASCRIPT_REGEX.exec(output);
            const code = (_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim();
            if (code) {
                const executor = new SingleInlineScriptEngine(this.app, this.plugin, this.choiceExecutor, this.variables);
                const outVal = await executor.runAndGetOutput(code);
                for (let key in executor.params.variables) {
                    this.variables.set(key, executor.params.variables[key]);
                }
                output = typeof outVal === "string" ?
                    this.replacer(output, INLINE_JAVASCRIPT_REGEX, outVal) :
                    this.replacer(output, INLINE_JAVASCRIPT_REGEX, "");
            }
        }
        return output;
    }
}

class TemplateEngine extends QuickAddEngine {
    constructor(app, plugin, choiceFormatter) {
        super(app);
        this.plugin = plugin;
        this.templater = getTemplater(app);
        this.formatter = new CompleteFormatter(app, plugin, choiceFormatter);
    }
    async getOrCreateFolder(folders) {
        let folderPath;
        if (folders.length > 1) {
            folderPath = await GenericSuggester.Suggest(this.app, folders, folders);
            if (!folderPath)
                return null;
        }
        else {
            folderPath = folders[0];
        }
        if (folderPath)
            await this.createFolder(folderPath);
        else
            folderPath = "";
        return folderPath;
    }
    async getFormattedFilePath(folderPath, format, promptHeader) {
        const formattedName = await this.formatter.formatFileName(format, promptHeader);
        return this.formatFilePath(folderPath, formattedName);
    }
    async incrementFileName(fileName) {
        const numStr = FILE_NUMBER_REGEX.exec(fileName)[1];
        const fileExists = await this.app.vault.adapter.exists(fileName);
        let newFileName = fileName;
        if (fileExists && numStr) {
            const number = parseInt(numStr);
            if (!number)
                throw new Error("detected numbers but couldn't get them.");
            newFileName = newFileName.replace(FILE_NUMBER_REGEX, `${number + 1}.md`);
        }
        else if (fileExists) {
            newFileName = newFileName.replace(FILE_NUMBER_REGEX, `${1}.md`);
        }
        const newFileExists = await this.app.vault.adapter.exists(newFileName);
        if (newFileExists)
            newFileName = await this.incrementFileName(newFileName);
        return newFileName;
    }
    async createFileWithTemplate(filePath, templatePath) {
        try {
            const templateContent = await this.getTemplateContent(templatePath);
            const formattedTemplateContent = await this.formatter.formatFileContent(templateContent);
            const createdFile = await this.createFileWithInput(filePath, formattedTemplateContent);
            await replaceTemplaterTemplatesInCreatedFile(this.app, createdFile);
            return createdFile;
        }
        catch (e) {
            log.logError(`Could not create file with template. Maybe '${templatePath}' is an invalid template path?`);
            return null;
        }
    }
    async overwriteFileWithTemplate(file, templatePath) {
        try {
            const templateContent = await this.getTemplateContent(templatePath);
            const formattedTemplateContent = await this.formatter.formatFileContent(templateContent);
            await this.app.vault.modify(file, formattedTemplateContent);
            await replaceTemplaterTemplatesInCreatedFile(this.app, file, true);
            return file;
        }
        catch (e) {
            log.logError(e);
            return null;
        }
    }
    async appendToFileWithTemplate(file, templatePath, section) {
        try {
            const templateContent = await this.getTemplateContent(templatePath);
            const formattedTemplateContent = await this.formatter.formatFileContent(templateContent);
            const fileContent = await this.app.vault.cachedRead(file);
            const newFileContent = section === "top" ?
                `${formattedTemplateContent}\n${fileContent}` :
                `${fileContent}\n${formattedTemplateContent}`;
            await this.app.vault.modify(file, newFileContent);
            await replaceTemplaterTemplatesInCreatedFile(this.app, file, true);
            return file;
        }
        catch (e) {
            log.logError(e);
            return null;
        }
    }
    async getTemplateContent(templatePath) {
        let correctTemplatePath = templatePath;
        if (!MARKDOWN_FILE_EXTENSION_REGEX.test(templatePath))
            correctTemplatePath += ".md";
        const templateFile = this.app.vault.getAbstractFileByPath(correctTemplatePath);
        if (!(templateFile instanceof obsidian.TFile))
            return;
        return await this.app.vault.cachedRead(templateFile);
    }
}

class SingleTemplateEngine extends TemplateEngine {
    constructor(app, plugin, templatePath, choiceExecutor) {
        super(app, plugin, choiceExecutor);
        this.templatePath = templatePath;
    }
    async run() {
        let templateContent = await this.getTemplateContent(this.templatePath);
        if (!templateContent) {
            log.logError(`Template ${this.templatePath} not found.`);
        }
        templateContent = await this.formatter.formatFileContent(templateContent);
        return templateContent;
    }
}

class FormatDisplayFormatter extends Formatter {
    constructor(app, plugin) {
        super();
        this.app = app;
        this.plugin = plugin;
    }
    async format(input) {
        let output = input;
        output = this.replaceDateInString(output);
        output = await this.replaceValueInString(output);
        output = await this.replaceDateVariableInString(output);
        output = await this.replaceVariableInString(output);
        output = await this.replaceLinkToCurrentFileInString(output);
        output = await this.replaceMacrosInString(output);
        output = await this.replaceTemplateInString(output);
        output = this.replaceLinebreakInString(output);
        return output;
    }
    promptForValue(header) {
        return "_value_";
    }
    getVariableValue(variableName) {
        return variableName;
    }
    getCurrentFileLink() {
        var _a, _b;
        return (_b = (_a = this.app.workspace.getActiveFile()) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : "_noPageOpen_";
    }
    getNaturalLanguageDates() {
        return getNaturalLanguageDates(this.app);
    }
    suggestForValue(suggestedValues) {
        return "_suggest_";
    }
    getMacroValue(macroName) {
        return `_macro: ${macroName}_`;
    }
    promptForMathValue() {
        return Promise.resolve("_math_");
    }
    promptForVariable(variableName) {
        return Promise.resolve(`${variableName}_`);
    }
    async getTemplateContent(templatePath) {
        try {
            return await new SingleTemplateEngine(this.app, this.plugin, templatePath, null).run();
        }
        catch (e) {
            return `Template (not found): ${templatePath}`;
        }
    }
    async getSelectedText() {
        return "_selected_";
    }
}

class CaptureChoiceBuilder extends ChoiceBuilder {
    constructor(app, choice, plugin) {
        super(app);
        this.plugin = plugin;
        this.choice = choice;
        this.display();
    }
    display() {
        var _a, _b, _c;
        this.containerEl.addClass("captureChoiceBuilder");
        this.contentEl.empty();
        this.addCenteredChoiceNameHeader(this.choice);
        this.addCapturedToSetting();
        if (!((_a = this.choice) === null || _a === void 0 ? void 0 : _a.captureToActiveFile)) {
            this.addCreateIfNotExistsSetting();
            if ((_c = (_b = this.choice) === null || _b === void 0 ? void 0 : _b.createFileIfItDoesntExist) === null || _c === void 0 ? void 0 : _c.enabled)
                this.addCreateWithTemplateSetting();
        }
        this.addTaskSetting();
        this.addPrependSetting();
        if (!this.choice.captureToActiveFile) {
            this.addAppendLinkSetting();
            this.addInsertAfterSetting();
            this.addOpenFileSetting();
            if (this.choice.openFile)
                this.addOpenFileInNewTabSetting();
        }
        this.addFormatSetting();
    }
    addCapturedToSetting() {
        var _a, _b, _c;
        let textField;
        new obsidian.Setting(this.contentEl)
            .setName('Capture To')
            .setDesc('File to capture to. Supports some format syntax.');
        const captureToContainer = this.contentEl.createDiv('captureToContainer');
        const captureToActiveFileContainer = captureToContainer.createDiv('captureToActiveFileContainer');
        const captureToActiveFileText = captureToActiveFileContainer.createEl('span');
        captureToActiveFileText.textContent = "Capture to active file";
        const captureToActiveFileToggle = new obsidian.ToggleComponent(captureToActiveFileContainer);
        captureToActiveFileToggle.setValue((_a = this.choice) === null || _a === void 0 ? void 0 : _a.captureToActiveFile);
        captureToActiveFileToggle.onChange(value => {
            this.choice.captureToActiveFile = value;
            this.reload();
        });
        if (!((_b = this.choice) === null || _b === void 0 ? void 0 : _b.captureToActiveFile)) {
            const captureToFileContainer = captureToContainer.createDiv('captureToFileContainer');
            const formatDisplay = captureToFileContainer.createEl('span');
            const displayFormatter = new FileNameDisplayFormatter(this.app);
            (async () => formatDisplay.textContent = await displayFormatter.format(this.choice.captureTo))();
            const formatInput = new obsidian.TextComponent(captureToFileContainer);
            formatInput.setPlaceholder("File name format");
            textField = formatInput;
            formatInput.inputEl.style.width = "100%";
            formatInput.inputEl.style.marginBottom = "8px";
            formatInput.setValue(this.choice.captureTo)
                .setDisabled((_c = this.choice) === null || _c === void 0 ? void 0 : _c.captureToActiveFile)
                .onChange(async (value) => {
                this.choice.captureTo = value;
                formatDisplay.textContent = await displayFormatter.format(value);
            });
            const markdownFilesAndFormatSyntax = [...this.app.vault.getMarkdownFiles().map(f => f.path), ...FILE_NAME_FORMAT_SYNTAX];
            new GenericTextSuggester(this.app, textField.inputEl, markdownFilesAndFormatSyntax);
        }
    }
    addPrependSetting() {
        var _a;
        const prependSetting = new obsidian.Setting(this.contentEl);
        prependSetting.setName("Write to bottom of file")
            .setDesc(`Put value at the bottom of the file - otherwise at the ${((_a = this.choice) === null || _a === void 0 ? void 0 : _a.captureToActiveFile) ? "active cursor location" : "top"}.`)
            .addToggle(toggle => {
            toggle.setValue(this.choice.prepend);
            toggle.onChange(value => this.choice.prepend = value);
        });
    }
    addTaskSetting() {
        const taskSetting = new obsidian.Setting(this.contentEl);
        taskSetting.setName("Task")
            .setDesc("Formats the value as a task.")
            .addToggle(toggle => {
            toggle.setValue(this.choice.task);
            toggle.onChange(value => this.choice.task = value);
        });
    }
    addAppendLinkSetting() {
        const appendLinkSetting = new obsidian.Setting(this.contentEl);
        appendLinkSetting.setName("Append link")
            .setDesc("Add a link on your current cursor position, linking to the file you're capturing to.")
            .addToggle(toggle => {
            toggle.setValue(this.choice.appendLink);
            toggle.onChange(value => this.choice.appendLink = value);
        });
    }
    addInsertAfterSetting() {
        let insertAfterInput;
        const insertAfterSetting = new obsidian.Setting(this.contentEl);
        insertAfterSetting.setName("Insert after")
            .setDesc("Insert capture after specified line. Accepts format syntax.")
            .addToggle(toggle => {
            toggle.setValue(this.choice.insertAfter.enabled);
            toggle.onChange(value => {
                this.choice.insertAfter.enabled = value;
                insertAfterInput.setDisabled(!value);
                this.reload();
            });
        });
        const insertAfterFormatDisplay = this.contentEl.createEl('span');
        const displayFormatter = new FormatDisplayFormatter(this.app, this.plugin);
        (async () => insertAfterFormatDisplay.innerText = await displayFormatter.format(this.choice.insertAfter.after))();
        insertAfterInput = new obsidian.TextComponent(this.contentEl);
        insertAfterInput.setPlaceholder("Insert after");
        insertAfterInput.inputEl.style.width = "100%";
        insertAfterInput.inputEl.style.marginBottom = "8px";
        insertAfterInput.setValue(this.choice.insertAfter.after)
            .setDisabled(!this.choice.insertAfter.enabled)
            .onChange(async (value) => {
            this.choice.insertAfter.after = value;
            insertAfterFormatDisplay.innerText = await displayFormatter.format(value);
        });
        new FormatSyntaxSuggester(this.app, insertAfterInput.inputEl, this.plugin);
        if (this.choice.insertAfter.enabled) {
            const insertAtEndSetting = new obsidian.Setting(this.contentEl);
            insertAtEndSetting.setName("Insert at end of section")
                .setDesc("Insert the text at the end of the section, rather than at the top.")
                .addToggle(toggle => {
                var _a;
                return toggle
                    .setValue((_a = this.choice.insertAfter) === null || _a === void 0 ? void 0 : _a.insertAtEnd)
                    .onChange(value => this.choice.insertAfter.insertAtEnd = value);
            });
            const createLineIfNotFound = new obsidian.Setting(this.contentEl);
            createLineIfNotFound.setName("Create line if not found")
                .setDesc("Creates the 'insert after' line if it is not found.")
                .addToggle(toggle => {
                var _a, _b;
                if (!((_a = this.choice.insertAfter) === null || _a === void 0 ? void 0 : _a.createIfNotFound))
                    this.choice.insertAfter.createIfNotFound = false; // Set to default
                toggle
                    .setValue((_b = this.choice.insertAfter) === null || _b === void 0 ? void 0 : _b.createIfNotFound)
                    .onChange(value => this.choice.insertAfter.createIfNotFound = value)
                    .toggleEl.style.marginRight = "1em";
            })
                .addDropdown(dropdown => {
                var _a, _b;
                if (!((_a = this.choice.insertAfter) === null || _a === void 0 ? void 0 : _a.createIfNotFoundLocation))
                    this.choice.insertAfter.createIfNotFoundLocation = CREATE_IF_NOT_FOUND_TOP; // Set to default
                dropdown
                    .addOption(CREATE_IF_NOT_FOUND_TOP, "Top")
                    .addOption(CREATE_IF_NOT_FOUND_BOTTOM, "Bottom")
                    .setValue((_b = this.choice.insertAfter) === null || _b === void 0 ? void 0 : _b.createIfNotFoundLocation)
                    .onChange(value => this.choice.insertAfter.createIfNotFoundLocation = value);
            });
        }
    }
    addFormatSetting() {
        let textField;
        const enableSetting = new obsidian.Setting(this.contentEl);
        enableSetting.setName("Capture format")
            .setDesc("Set the format of the capture.")
            .addToggle(toggleComponent => {
            toggleComponent.setValue(this.choice.format.enabled)
                .onChange(value => {
                this.choice.format.enabled = value;
                textField.setDisabled(!value);
            });
        });
        const formatInput = new obsidian.TextAreaComponent(this.contentEl);
        formatInput.setPlaceholder("Format");
        textField = formatInput;
        formatInput.inputEl.style.width = "100%";
        formatInput.inputEl.style.marginBottom = "8px";
        formatInput.inputEl.style.height = "10rem";
        formatInput.setValue(this.choice.format.format)
            .setDisabled(!this.choice.format.enabled)
            .onChange(async (value) => {
            this.choice.format.format = value;
            formatDisplay.innerText = await displayFormatter.format(value);
        });
        new FormatSyntaxSuggester(this.app, textField.inputEl, this.plugin);
        const formatDisplay = this.contentEl.createEl('span');
        const displayFormatter = new FormatDisplayFormatter(this.app, this.plugin);
        (async () => formatDisplay.innerText = await displayFormatter.format(this.choice.format.format))();
    }
    addCreateIfNotExistsSetting() {
        if (!this.choice.createFileIfItDoesntExist)
            this.choice.createFileIfItDoesntExist = { enabled: false, createWithTemplate: false, template: "" };
        const createFileIfItDoesntExist = new obsidian.Setting(this.contentEl);
        createFileIfItDoesntExist
            .setName("Create file if it doesn't exist")
            .addToggle(toggle => {
            var _a, _b;
            return toggle
                .setValue((_b = (_a = this.choice) === null || _a === void 0 ? void 0 : _a.createFileIfItDoesntExist) === null || _b === void 0 ? void 0 : _b.enabled)
                .setTooltip("Create file if it doesn't exist")
                .onChange(value => {
                this.choice.createFileIfItDoesntExist.enabled = value;
                this.reload();
            });
        });
    }
    addCreateWithTemplateSetting() {
        var _a, _b, _c, _d, _e;
        let templateSelector;
        const createWithTemplateSetting = new obsidian.Setting(this.contentEl);
        createWithTemplateSetting.setName("Create file with given template.")
            .addToggle(toggle => {
            var _a;
            return toggle.setValue((_a = this.choice.createFileIfItDoesntExist) === null || _a === void 0 ? void 0 : _a.createWithTemplate)
                .onChange(value => {
                this.choice.createFileIfItDoesntExist.createWithTemplate = value;
                templateSelector.setDisabled(!value);
            });
        });
        templateSelector = new obsidian.TextComponent(this.contentEl);
        templateSelector.setValue((_c = (_b = (_a = this.choice) === null || _a === void 0 ? void 0 : _a.createFileIfItDoesntExist) === null || _b === void 0 ? void 0 : _b.template) !== null && _c !== void 0 ? _c : "")
            .setPlaceholder("Template path")
            .setDisabled(!((_e = (_d = this.choice) === null || _d === void 0 ? void 0 : _d.createFileIfItDoesntExist) === null || _e === void 0 ? void 0 : _e.createWithTemplate));
        templateSelector.inputEl.style.width = "100%";
        templateSelector.inputEl.style.marginBottom = "8px";
        const markdownFiles = getTemplatePaths(this.app);
        new GenericTextSuggester(this.app, templateSelector.inputEl, markdownFiles);
        templateSelector.onChange(value => {
            this.choice.createFileIfItDoesntExist.template = value;
        });
    }
    addOpenFileSetting() {
        const noOpenSetting = new obsidian.Setting(this.contentEl);
        noOpenSetting.setName("Open")
            .setDesc("Open the file that is captured to.")
            .addToggle(toggle => {
            toggle.setValue(this.choice.openFile);
            toggle.onChange(value => {
                this.choice.openFile = value;
                this.reload();
            });
        })
            .addDropdown(dropdown => {
            dropdown.selectEl.style.marginLeft = "10px";
            if (!this.choice.openFileInMode)
                this.choice.openFileInMode = 'default';
            dropdown
                .addOption('source', 'Source')
                .addOption('preview', 'Preview')
                .addOption('default', 'Default')
                .setValue(this.choice.openFileInMode)
                .onChange(value => this.choice.openFileInMode = value);
        });
    }
    addOpenFileInNewTabSetting() {
        const newTabSetting = new obsidian.Setting(this.contentEl);
        newTabSetting.setName("New Tab")
            .setDesc("Open the file that is captured to in a new tab.")
            .addToggle(toggle => {
            var _a, _b;
            toggle.setValue((_b = (_a = this.choice) === null || _a === void 0 ? void 0 : _a.openFileInNewTab) === null || _b === void 0 ? void 0 : _b.enabled);
            toggle.onChange(value => this.choice.openFileInNewTab.enabled = value);
        })
            .addDropdown(dropdown => {
            var _a, _b, _c;
            if (!((_a = this.choice) === null || _a === void 0 ? void 0 : _a.openFileInNewTab)) {
                this.choice.openFileInNewTab = { enabled: false, direction: NewTabDirection.vertical, focus: true };
            }
            dropdown.selectEl.style.marginLeft = "10px";
            dropdown.addOption(NewTabDirection.vertical, "Vertical");
            dropdown.addOption(NewTabDirection.horizontal, "Horizontal");
            dropdown.setValue((_c = (_b = this.choice) === null || _b === void 0 ? void 0 : _b.openFileInNewTab) === null || _c === void 0 ? void 0 : _c.direction);
            dropdown.onChange(value => this.choice.openFileInNewTab.direction = value);
        });
        new obsidian.Setting(this.contentEl)
            .setName("Focus new pane")
            .setDesc("Focus the opened tab immediately")
            .addToggle(toggle => toggle
            .setValue(this.choice.openFileInNewTab.focus)
            .onChange(value => this.choice.openFileInNewTab.focus = value));
    }
}

class MacroChoiceBuilder extends ChoiceBuilder {
    constructor(app, choice, macros) {
        super(app);
        this.macros = macros;
        this.choice = choice;
        this.display();
    }
    display() {
        this.containerEl.addClass("macroChoiceBuilder");
        this.addCenteredChoiceNameHeader(this.choice);
        this.addSelectMacroSearch();
    }
    addSelectMacroSearch() {
        const selectMacroDropdownContainer = this.contentEl.createDiv('selectMacroDropdownContainer');
        const dropdown = new obsidian.DropdownComponent(selectMacroDropdownContainer);
        let macroOptions = {};
        this.macros.forEach(macro => {
            macroOptions[macro.name] = macro.name;
        });
        dropdown.addOptions(macroOptions);
        dropdown.onChange(value => {
            this.selectMacro(value);
        });
        const selectedMacro = this.macros.find(m => m.id === this.choice.macroId);
        if (selectedMacro) {
            dropdown.setValue(selectedMacro.name);
        }
        else {
            const value = dropdown.getValue();
            if (value) {
                this.selectMacro(value);
            }
        }
    }
    selectMacro(value) {
        const targetMacro = this.macros.find(m => m.name === value);
        if (!targetMacro)
            return;
        this.choice.macroId = targetMacro.id;
    }
}

class UserScript extends Command {
    constructor(name, path) {
        super(name, CommandType.UserScript);
        this.path = path;
        this.settings = {};
    }
}

class ObsidianCommand extends Command {
    constructor(name, commandId) {
        super(name, CommandType.Obsidian);
        this.generateId = () => this.id = v4();
        this.commandId = commandId;
    }
}

/* src/gui/MacroGUIs/Components/StandardCommand.svelte generated by Svelte v3.47.0 */

function create_fragment$5(ctx) {
	let div1;
	let li;
	let t0_value = /*command*/ ctx[0].name + "";
	let t0;
	let t1;
	let div0;
	let span0;
	let icon0;
	let t2;
	let span1;
	let icon1;
	let span1_style_value;
	let span1_tabindex_value;
	let current;
	let mounted;
	let dispose;
	icon0 = new Icon({ props: { data: faTrash } });
	icon1 = new Icon({ props: { data: faBars } });

	return {
		c() {
			div1 = element("div");
			li = element("li");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			span0 = element("span");
			create_component(icon0.$$.fragment);
			t2 = space();
			span1 = element("span");
			create_component(icon1.$$.fragment);
			attr(span0, "class", "clickable");
			attr(span1, "aria-label", "Drag-handle");

			attr(span1, "style", span1_style_value = "" + ((/*dragDisabled*/ ctx[2]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"));

			attr(span1, "tabindex", span1_tabindex_value = /*dragDisabled*/ ctx[2] ? 0 : -1);
			attr(div1, "class", "quickAddCommandListItem");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, li);
			append(li, t0);
			append(div1, t1);
			append(div1, div0);
			append(div0, span0);
			mount_component(icon0, span0, null);
			append(div0, t2);
			append(div0, span1);
			mount_component(icon1, span1, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen(span0, "click", /*click_handler*/ ctx[4]),
					listen(span1, "mousedown", function () {
						if (is_function(/*startDrag*/ ctx[1])) /*startDrag*/ ctx[1].apply(this, arguments);
					}),
					listen(span1, "touchstart", function () {
						if (is_function(/*startDrag*/ ctx[1])) /*startDrag*/ ctx[1].apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;
			if ((!current || dirty & /*command*/ 1) && t0_value !== (t0_value = /*command*/ ctx[0].name + "")) set_data(t0, t0_value);

			if (!current || dirty & /*dragDisabled*/ 4 && span1_style_value !== (span1_style_value = "" + ((/*dragDisabled*/ ctx[2]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"))) {
				attr(span1, "style", span1_style_value);
			}

			if (!current || dirty & /*dragDisabled*/ 4 && span1_tabindex_value !== (span1_tabindex_value = /*dragDisabled*/ ctx[2] ? 0 : -1)) {
				attr(span1, "tabindex", span1_tabindex_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(icon0.$$.fragment, local);
			transition_in(icon1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(icon0.$$.fragment, local);
			transition_out(icon1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_component(icon0);
			destroy_component(icon1);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let { command } = $$props;
	let { startDrag } = $$props;
	let { dragDisabled } = $$props;
	const dispatch = createEventDispatcher();

	function deleteCommand(commandId) {
		dispatch('deleteCommand', commandId);
	}

	const click_handler = () => deleteCommand(command.id);

	$$self.$$set = $$props => {
		if ('command' in $$props) $$invalidate(0, command = $$props.command);
		if ('startDrag' in $$props) $$invalidate(1, startDrag = $$props.startDrag);
		if ('dragDisabled' in $$props) $$invalidate(2, dragDisabled = $$props.dragDisabled);
	};

	return [command, startDrag, dragDisabled, deleteCommand, click_handler];
}

class StandardCommand extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			command: 0,
			startDrag: 1,
			dragDisabled: 2
		});
	}
}

/* src/gui/MacroGUIs/Components/WaitCommand.svelte generated by Svelte v3.47.0 */

function add_css$2(target) {
	append_styles(target, "svelte-1196d9p", ".dotInput.svelte-1196d9p{border:none;display:inline;font-family:inherit;font-size:inherit;padding:0;width:0;text-decoration:underline dotted;background-color:transparent}.dotInput.svelte-1196d9p:hover{background-color:transparent}");
}

function create_fragment$4(ctx) {
	let div1;
	let li;
	let t0_value = /*command*/ ctx[0].name + "";
	let t0;
	let t1;
	let input;
	let t2;
	let t3;
	let div0;
	let span0;
	let icon0;
	let t4;
	let span1;
	let icon1;
	let span1_style_value;
	let span1_tabindex_value;
	let current;
	let mounted;
	let dispose;
	icon0 = new Icon({ props: { data: faTrash } });
	icon1 = new Icon({ props: { data: faBars } });

	return {
		c() {
			div1 = element("div");
			li = element("li");
			t0 = text(t0_value);
			t1 = text(" for ");
			input = element("input");
			t2 = text("ms");
			t3 = space();
			div0 = element("div");
			span0 = element("span");
			create_component(icon0.$$.fragment);
			t4 = space();
			span1 = element("span");
			create_component(icon1.$$.fragment);
			attr(input, "type", "number");
			attr(input, "placeholder", "   ");
			attr(input, "class", "dotInput svelte-1196d9p");
			attr(span0, "class", "clickable");
			attr(span1, "aria-label", "Drag-handle");

			attr(span1, "style", span1_style_value = "" + ((/*dragDisabled*/ ctx[2]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"));

			attr(span1, "tabindex", span1_tabindex_value = /*dragDisabled*/ ctx[2] ? 0 : -1);
			attr(div1, "class", "quickAddCommandListItem");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, li);
			append(li, t0);
			append(li, t1);
			append(li, input);
			/*input_binding*/ ctx[6](input);
			set_input_value(input, /*command*/ ctx[0].time);
			append(li, t2);
			append(div1, t3);
			append(div1, div0);
			append(div0, span0);
			mount_component(icon0, span0, null);
			append(div0, t4);
			append(div0, span1);
			mount_component(icon1, span1, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen(input, "keyup", /*resizeInput*/ ctx[5]),
					listen(input, "input", /*input_input_handler*/ ctx[7]),
					listen(span0, "click", /*click_handler*/ ctx[8]),
					listen(span1, "mousedown", function () {
						if (is_function(/*startDrag*/ ctx[1])) /*startDrag*/ ctx[1].apply(this, arguments);
					}),
					listen(span1, "touchstart", function () {
						if (is_function(/*startDrag*/ ctx[1])) /*startDrag*/ ctx[1].apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;
			if ((!current || dirty & /*command*/ 1) && t0_value !== (t0_value = /*command*/ ctx[0].name + "")) set_data(t0, t0_value);

			if (dirty & /*command*/ 1 && to_number(input.value) !== /*command*/ ctx[0].time) {
				set_input_value(input, /*command*/ ctx[0].time);
			}

			if (!current || dirty & /*dragDisabled*/ 4 && span1_style_value !== (span1_style_value = "" + ((/*dragDisabled*/ ctx[2]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"))) {
				attr(span1, "style", span1_style_value);
			}

			if (!current || dirty & /*dragDisabled*/ 4 && span1_tabindex_value !== (span1_tabindex_value = /*dragDisabled*/ ctx[2] ? 0 : -1)) {
				attr(span1, "tabindex", span1_tabindex_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(icon0.$$.fragment, local);
			transition_in(icon1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(icon0.$$.fragment, local);
			transition_out(icon1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			/*input_binding*/ ctx[6](null);
			destroy_component(icon0);
			destroy_component(icon1);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let { command } = $$props;
	let { startDrag } = $$props;
	let { dragDisabled } = $$props;
	const dispatch = createEventDispatcher();
	let inputEl;

	function deleteCommand(commandId) {
		dispatch('deleteCommand', commandId);
	}

	function resizeInput() {
		const length = inputEl.value.length;
		$$invalidate(3, inputEl.style.width = (length === 0 ? 2 : length) + 'ch', inputEl);
	}

	onMount(resizeInput);

	function input_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			inputEl = $$value;
			$$invalidate(3, inputEl);
		});
	}

	function input_input_handler() {
		command.time = to_number(this.value);
		$$invalidate(0, command);
	}

	const click_handler = () => deleteCommand(command.id);

	$$self.$$set = $$props => {
		if ('command' in $$props) $$invalidate(0, command = $$props.command);
		if ('startDrag' in $$props) $$invalidate(1, startDrag = $$props.startDrag);
		if ('dragDisabled' in $$props) $$invalidate(2, dragDisabled = $$props.dragDisabled);
	};

	return [
		command,
		startDrag,
		dragDisabled,
		inputEl,
		deleteCommand,
		resizeInput,
		input_binding,
		input_input_handler,
		click_handler
	];
}

class WaitCommand$1 extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$4,
			create_fragment$4,
			safe_not_equal,
			{
				command: 0,
				startDrag: 1,
				dragDisabled: 2
			},
			add_css$2
		);
	}
}

/* src/gui/MacroGUIs/Components/NestedChoiceCommand.svelte generated by Svelte v3.47.0 */

function create_fragment$3(ctx) {
	let div1;
	let li;
	let t0_value = /*command*/ ctx[0].name + "";
	let t0;
	let t1;
	let div0;
	let span0;
	let icon0;
	let t2;
	let span1;
	let icon1;
	let t3;
	let span2;
	let icon2;
	let span2_style_value;
	let span2_tabindex_value;
	let current;
	let mounted;
	let dispose;
	icon0 = new Icon({ props: { data: faCog } });
	icon1 = new Icon({ props: { data: faTrash } });
	icon2 = new Icon({ props: { data: faBars } });

	return {
		c() {
			div1 = element("div");
			li = element("li");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			span0 = element("span");
			create_component(icon0.$$.fragment);
			t2 = space();
			span1 = element("span");
			create_component(icon1.$$.fragment);
			t3 = space();
			span2 = element("span");
			create_component(icon2.$$.fragment);
			attr(span0, "class", "clickable");
			attr(span1, "class", "clickable");
			attr(span2, "aria-label", "Drag-handle");

			attr(span2, "style", span2_style_value = "" + ((/*dragDisabled*/ ctx[2]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"));

			attr(span2, "tabindex", span2_tabindex_value = /*dragDisabled*/ ctx[2] ? 0 : -1);
			attr(div1, "class", "quickAddCommandListItem");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, li);
			append(li, t0);
			append(div1, t1);
			append(div1, div0);
			append(div0, span0);
			mount_component(icon0, span0, null);
			append(div0, t2);
			append(div0, span1);
			mount_component(icon1, span1, null);
			append(div0, t3);
			append(div0, span2);
			mount_component(icon2, span2, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen(span0, "click", /*click_handler*/ ctx[5]),
					listen(span1, "click", /*click_handler_1*/ ctx[6]),
					listen(span2, "mousedown", function () {
						if (is_function(/*startDrag*/ ctx[1])) /*startDrag*/ ctx[1].apply(this, arguments);
					}),
					listen(span2, "touchstart", function () {
						if (is_function(/*startDrag*/ ctx[1])) /*startDrag*/ ctx[1].apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;
			if ((!current || dirty & /*command*/ 1) && t0_value !== (t0_value = /*command*/ ctx[0].name + "")) set_data(t0, t0_value);

			if (!current || dirty & /*dragDisabled*/ 4 && span2_style_value !== (span2_style_value = "" + ((/*dragDisabled*/ ctx[2]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"))) {
				attr(span2, "style", span2_style_value);
			}

			if (!current || dirty & /*dragDisabled*/ 4 && span2_tabindex_value !== (span2_tabindex_value = /*dragDisabled*/ ctx[2] ? 0 : -1)) {
				attr(span2, "tabindex", span2_tabindex_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(icon0.$$.fragment, local);
			transition_in(icon1.$$.fragment, local);
			transition_in(icon2.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(icon0.$$.fragment, local);
			transition_out(icon1.$$.fragment, local);
			transition_out(icon2.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_component(icon0);
			destroy_component(icon1);
			destroy_component(icon2);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { command } = $$props;
	let { startDrag } = $$props;
	let { dragDisabled } = $$props;
	const dispatch = createEventDispatcher();

	function deleteCommand() {
		dispatch('deleteCommand', command.id);
	}

	function configureChoice() {
		dispatch('configureChoice', command);
	}

	const click_handler = () => configureChoice();
	const click_handler_1 = () => deleteCommand();

	$$self.$$set = $$props => {
		if ('command' in $$props) $$invalidate(0, command = $$props.command);
		if ('startDrag' in $$props) $$invalidate(1, startDrag = $$props.startDrag);
		if ('dragDisabled' in $$props) $$invalidate(2, dragDisabled = $$props.dragDisabled);
	};

	return [
		command,
		startDrag,
		dragDisabled,
		deleteCommand,
		configureChoice,
		click_handler,
		click_handler_1
	];
}

class NestedChoiceCommand$1 extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			command: 0,
			startDrag: 1,
			dragDisabled: 2
		});
	}
}

/* src/gui/MacroGUIs/Components/UserScriptCommand.svelte generated by Svelte v3.47.0 */

function create_fragment$2(ctx) {
	let div1;
	let li;
	let t0_value = /*command*/ ctx[0].name + "";
	let t0;
	let t1;
	let div0;
	let span0;
	let icon0;
	let t2;
	let span1;
	let icon1;
	let t3;
	let span2;
	let icon2;
	let span2_style_value;
	let span2_tabindex_value;
	let current;
	let mounted;
	let dispose;
	icon0 = new Icon({ props: { data: faCog } });
	icon1 = new Icon({ props: { data: faTrash } });
	icon2 = new Icon({ props: { data: faBars } });

	return {
		c() {
			div1 = element("div");
			li = element("li");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			span0 = element("span");
			create_component(icon0.$$.fragment);
			t2 = space();
			span1 = element("span");
			create_component(icon1.$$.fragment);
			t3 = space();
			span2 = element("span");
			create_component(icon2.$$.fragment);
			attr(span0, "class", "clickable");
			attr(span1, "class", "clickable");
			attr(span2, "aria-label", "Drag-handle");

			attr(span2, "style", span2_style_value = "" + ((/*dragDisabled*/ ctx[2]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"));

			attr(span2, "tabindex", span2_tabindex_value = /*dragDisabled*/ ctx[2] ? 0 : -1);
			attr(div1, "class", "quickAddCommandListItem");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, li);
			append(li, t0);
			append(div1, t1);
			append(div1, div0);
			append(div0, span0);
			mount_component(icon0, span0, null);
			append(div0, t2);
			append(div0, span1);
			mount_component(icon1, span1, null);
			append(div0, t3);
			append(div0, span2);
			mount_component(icon2, span2, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen(span0, "click", /*click_handler*/ ctx[5]),
					listen(span1, "click", /*click_handler_1*/ ctx[6]),
					listen(span2, "mousedown", function () {
						if (is_function(/*startDrag*/ ctx[1])) /*startDrag*/ ctx[1].apply(this, arguments);
					}),
					listen(span2, "touchstart", function () {
						if (is_function(/*startDrag*/ ctx[1])) /*startDrag*/ ctx[1].apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;
			if ((!current || dirty & /*command*/ 1) && t0_value !== (t0_value = /*command*/ ctx[0].name + "")) set_data(t0, t0_value);

			if (!current || dirty & /*dragDisabled*/ 4 && span2_style_value !== (span2_style_value = "" + ((/*dragDisabled*/ ctx[2]
			? 'cursor: grab'
			: 'cursor: grabbing') + ";"))) {
				attr(span2, "style", span2_style_value);
			}

			if (!current || dirty & /*dragDisabled*/ 4 && span2_tabindex_value !== (span2_tabindex_value = /*dragDisabled*/ ctx[2] ? 0 : -1)) {
				attr(span2, "tabindex", span2_tabindex_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(icon0.$$.fragment, local);
			transition_in(icon1.$$.fragment, local);
			transition_in(icon2.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(icon0.$$.fragment, local);
			transition_out(icon1.$$.fragment, local);
			transition_out(icon2.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_component(icon0);
			destroy_component(icon1);
			destroy_component(icon2);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { command } = $$props;
	let { startDrag } = $$props;
	let { dragDisabled } = $$props;
	const dispatch = createEventDispatcher();

	function deleteCommand() {
		dispatch('deleteCommand', command.id);
	}

	function configureChoice() {
		dispatch('configureScript', command);
	}

	const click_handler = () => configureChoice();
	const click_handler_1 = () => deleteCommand();

	$$self.$$set = $$props => {
		if ('command' in $$props) $$invalidate(0, command = $$props.command);
		if ('startDrag' in $$props) $$invalidate(1, startDrag = $$props.startDrag);
		if ('dragDisabled' in $$props) $$invalidate(2, dragDisabled = $$props.dragDisabled);
	};

	return [
		command,
		startDrag,
		dragDisabled,
		deleteCommand,
		configureChoice,
		click_handler,
		click_handler_1
	];
}

class UserScriptCommand extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			command: 0,
			startDrag: 1,
			dragDisabled: 2
		});
	}
}

class UserScriptSettingsModal extends obsidian.Modal {
    constructor(app, command, settings) {
        super(app);
        this.command = command;
        this.settings = settings;
        this.display();
        if (!this.command.settings)
            this.command.settings = {};
        Object.keys(this.settings.options).forEach(setting => {
            var _a;
            if (this.command.settings[setting] === undefined) {
                this.command.settings[setting] = (_a = this.settings.options[setting]) === null || _a === void 0 ? void 0 : _a.defaultValue;
            }
        });
    }
    display() {
        var _a, _b, _c;
        this.containerEl.addClass('quickAddModal', 'userScriptSettingsModal');
        this.contentEl.empty();
        this.titleEl.innerText = `${(_a = this.settings) === null || _a === void 0 ? void 0 : _a.name}${((_b = this.settings) === null || _b === void 0 ? void 0 : _b.author) ? " by " + ((_c = this.settings) === null || _c === void 0 ? void 0 : _c.author) : ""}`;
        const options = this.settings.options;
        Object.keys(options).forEach(option => {
            var _a, _b;
            const entry = options[option];
            let value = entry.defaultValue;
            if (this.command.settings[option] !== undefined) {
                value = this.command.settings[option];
            }
            switch ((_b = (_a = options[option]) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.toLowerCase()) {
                case "text":
                case "input":
                    this.addInputBox(option, value, entry === null || entry === void 0 ? void 0 : entry.placeholder, entry === null || entry === void 0 ? void 0 : entry.secret);
                    break;
                case "checkbox":
                case "toggle":
                    this.addToggle(option, value);
                    break;
                case "dropdown":
                case "select":
                    this.addDropdown(option, entry.options, value);
                    break;
                case "format":
                    this.addFormatInput(option, value, entry === null || entry === void 0 ? void 0 : entry.placeholder);
                    break;
            }
        });
    }
    setPasswordOnBlur(el) {
        el.addEventListener('focus', () => {
            el.type = "text";
        });
        el.addEventListener('blur', () => {
            el.type = "password";
        });
        el.type = "password";
    }
    addInputBox(name, value, placeholder, passwordOnBlur) {
        new obsidian.Setting(this.contentEl)
            .setName(name)
            .addText(input => {
            input.setValue(value)
                .onChange(value => this.command.settings[name] = value)
                .setPlaceholder(placeholder !== null && placeholder !== void 0 ? placeholder : "");
            if (passwordOnBlur) {
                this.setPasswordOnBlur(input.inputEl);
            }
        });
    }
    addToggle(name, value) {
        new obsidian.Setting(this.contentEl)
            .setName(name)
            .addToggle(toggle => toggle.setValue(value)
            .onChange(value => this.command.settings[name] = value));
    }
    addDropdown(name, options, value) {
        new obsidian.Setting(this.contentEl)
            .setName(name)
            .addDropdown(dropdown => {
            options.forEach(item => dropdown.addOption(item, item));
            dropdown.setValue(value);
            dropdown.onChange(value => this.command.settings[name] = value);
        });
    }
    addFormatInput(name, value, placeholder) {
        new obsidian.Setting(this.contentEl).setName(name);
        const formatDisplay = this.contentEl.createEl("span");
        const input = new obsidian.TextComponent(this.contentEl);
        new FormatSyntaxSuggester(this.app, input.inputEl, QuickAdd.instance);
        const displayFormatter = new FormatDisplayFormatter(this.app, QuickAdd.instance);
        input.setValue(value)
            .onChange(async (value) => {
            this.command.settings[name] = value;
            formatDisplay.innerText = await displayFormatter.format(value);
        })
            .setPlaceholder(placeholder !== null && placeholder !== void 0 ? placeholder : "");
        input.inputEl.style.width = "100%";
        input.inputEl.style.marginBottom = "1em";
        (async () => formatDisplay.innerText = await displayFormatter.format(value))();
    }
}

/* src/gui/MacroGUIs/CommandList.svelte generated by Svelte v3.47.0 */

function add_css$1(target) {
	append_styles(target, "svelte-1ukgrgp", ".quickAddCommandList.svelte-1ukgrgp{display:grid;grid-template-columns:auto;width:auto;border:0 solid black;overflow-y:auto;height:auto;margin-bottom:8px;padding:20px}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[33] = list[i];
	child_ctx[34] = list;
	child_ctx[35] = i;
	return child_ctx;
}

// (93:8) {:else}
function create_else_block(ctx) {
	let standardcommand;
	let updating_command;
	let updating_dragDisabled;
	let updating_startDrag;
	let current;

	function standardcommand_command_binding(value) {
		/*standardcommand_command_binding*/ ctx[27](value, /*command*/ ctx[33], /*each_value*/ ctx[34], /*command_index*/ ctx[35]);
	}

	function standardcommand_dragDisabled_binding(value) {
		/*standardcommand_dragDisabled_binding*/ ctx[28](value);
	}

	function standardcommand_startDrag_binding(value) {
		/*standardcommand_startDrag_binding*/ ctx[29](value);
	}

	let standardcommand_props = {};

	if (/*command*/ ctx[33] !== void 0) {
		standardcommand_props.command = /*command*/ ctx[33];
	}

	if (/*dragDisabled*/ ctx[3] !== void 0) {
		standardcommand_props.dragDisabled = /*dragDisabled*/ ctx[3];
	}

	if (/*startDrag*/ ctx[4] !== void 0) {
		standardcommand_props.startDrag = /*startDrag*/ ctx[4];
	}

	standardcommand = new StandardCommand({ props: standardcommand_props });
	binding_callbacks.push(() => bind(standardcommand, 'command', standardcommand_command_binding));
	binding_callbacks.push(() => bind(standardcommand, 'dragDisabled', standardcommand_dragDisabled_binding));
	binding_callbacks.push(() => bind(standardcommand, 'startDrag', standardcommand_startDrag_binding));
	standardcommand.$on("deleteCommand", /*deleteCommand_handler_3*/ ctx[30]);
	standardcommand.$on("updateCommand", /*updateCommandFromEvent*/ ctx[7]);

	return {
		c() {
			create_component(standardcommand.$$.fragment);
		},
		m(target, anchor) {
			mount_component(standardcommand, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const standardcommand_changes = {};

			if (!updating_command && dirty[0] & /*commands, SHADOW_PLACEHOLDER_ITEM_ID*/ 5) {
				updating_command = true;
				standardcommand_changes.command = /*command*/ ctx[33];
				add_flush_callback(() => updating_command = false);
			}

			if (!updating_dragDisabled && dirty[0] & /*dragDisabled*/ 8) {
				updating_dragDisabled = true;
				standardcommand_changes.dragDisabled = /*dragDisabled*/ ctx[3];
				add_flush_callback(() => updating_dragDisabled = false);
			}

			if (!updating_startDrag && dirty[0] & /*startDrag*/ 16) {
				updating_startDrag = true;
				standardcommand_changes.startDrag = /*startDrag*/ ctx[4];
				add_flush_callback(() => updating_startDrag = false);
			}

			standardcommand.$set(standardcommand_changes);
		},
		i(local) {
			if (current) return;
			transition_in(standardcommand.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(standardcommand.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(standardcommand, detaching);
		}
	};
}

// (91:58) 
function create_if_block_2(ctx) {
	let userscriptcommand;
	let updating_command;
	let updating_dragDisabled;
	let updating_startDrag;
	let current;

	function userscriptcommand_command_binding(value) {
		/*userscriptcommand_command_binding*/ ctx[23](value, /*command*/ ctx[33], /*each_value*/ ctx[34], /*command_index*/ ctx[35]);
	}

	function userscriptcommand_dragDisabled_binding(value) {
		/*userscriptcommand_dragDisabled_binding*/ ctx[24](value);
	}

	function userscriptcommand_startDrag_binding(value) {
		/*userscriptcommand_startDrag_binding*/ ctx[25](value);
	}

	let userscriptcommand_props = {};

	if (/*command*/ ctx[33] !== void 0) {
		userscriptcommand_props.command = /*command*/ ctx[33];
	}

	if (/*dragDisabled*/ ctx[3] !== void 0) {
		userscriptcommand_props.dragDisabled = /*dragDisabled*/ ctx[3];
	}

	if (/*startDrag*/ ctx[4] !== void 0) {
		userscriptcommand_props.startDrag = /*startDrag*/ ctx[4];
	}

	userscriptcommand = new UserScriptCommand({ props: userscriptcommand_props });
	binding_callbacks.push(() => bind(userscriptcommand, 'command', userscriptcommand_command_binding));
	binding_callbacks.push(() => bind(userscriptcommand, 'dragDisabled', userscriptcommand_dragDisabled_binding));
	binding_callbacks.push(() => bind(userscriptcommand, 'startDrag', userscriptcommand_startDrag_binding));
	userscriptcommand.$on("deleteCommand", /*deleteCommand_handler_2*/ ctx[26]);
	userscriptcommand.$on("updateCommand", /*updateCommandFromEvent*/ ctx[7]);
	userscriptcommand.$on("configureScript", /*configureScript*/ ctx[9]);

	return {
		c() {
			create_component(userscriptcommand.$$.fragment);
		},
		m(target, anchor) {
			mount_component(userscriptcommand, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const userscriptcommand_changes = {};

			if (!updating_command && dirty[0] & /*commands, SHADOW_PLACEHOLDER_ITEM_ID*/ 5) {
				updating_command = true;
				userscriptcommand_changes.command = /*command*/ ctx[33];
				add_flush_callback(() => updating_command = false);
			}

			if (!updating_dragDisabled && dirty[0] & /*dragDisabled*/ 8) {
				updating_dragDisabled = true;
				userscriptcommand_changes.dragDisabled = /*dragDisabled*/ ctx[3];
				add_flush_callback(() => updating_dragDisabled = false);
			}

			if (!updating_startDrag && dirty[0] & /*startDrag*/ 16) {
				updating_startDrag = true;
				userscriptcommand_changes.startDrag = /*startDrag*/ ctx[4];
				add_flush_callback(() => updating_startDrag = false);
			}

			userscriptcommand.$set(userscriptcommand_changes);
		},
		i(local) {
			if (current) return;
			transition_in(userscriptcommand.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(userscriptcommand.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(userscriptcommand, detaching);
		}
	};
}

// (89:60) 
function create_if_block_1(ctx) {
	let nestedchoicecommand;
	let updating_command;
	let updating_dragDisabled;
	let updating_startDrag;
	let current;

	function nestedchoicecommand_command_binding(value) {
		/*nestedchoicecommand_command_binding*/ ctx[19](value, /*command*/ ctx[33], /*each_value*/ ctx[34], /*command_index*/ ctx[35]);
	}

	function nestedchoicecommand_dragDisabled_binding(value) {
		/*nestedchoicecommand_dragDisabled_binding*/ ctx[20](value);
	}

	function nestedchoicecommand_startDrag_binding(value) {
		/*nestedchoicecommand_startDrag_binding*/ ctx[21](value);
	}

	let nestedchoicecommand_props = {};

	if (/*command*/ ctx[33] !== void 0) {
		nestedchoicecommand_props.command = /*command*/ ctx[33];
	}

	if (/*dragDisabled*/ ctx[3] !== void 0) {
		nestedchoicecommand_props.dragDisabled = /*dragDisabled*/ ctx[3];
	}

	if (/*startDrag*/ ctx[4] !== void 0) {
		nestedchoicecommand_props.startDrag = /*startDrag*/ ctx[4];
	}

	nestedchoicecommand = new NestedChoiceCommand$1({ props: nestedchoicecommand_props });
	binding_callbacks.push(() => bind(nestedchoicecommand, 'command', nestedchoicecommand_command_binding));
	binding_callbacks.push(() => bind(nestedchoicecommand, 'dragDisabled', nestedchoicecommand_dragDisabled_binding));
	binding_callbacks.push(() => bind(nestedchoicecommand, 'startDrag', nestedchoicecommand_startDrag_binding));
	nestedchoicecommand.$on("deleteCommand", /*deleteCommand_handler_1*/ ctx[22]);
	nestedchoicecommand.$on("updateCommand", /*updateCommandFromEvent*/ ctx[7]);
	nestedchoicecommand.$on("configureChoice", /*configureChoice*/ ctx[8]);

	return {
		c() {
			create_component(nestedchoicecommand.$$.fragment);
		},
		m(target, anchor) {
			mount_component(nestedchoicecommand, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const nestedchoicecommand_changes = {};

			if (!updating_command && dirty[0] & /*commands, SHADOW_PLACEHOLDER_ITEM_ID*/ 5) {
				updating_command = true;
				nestedchoicecommand_changes.command = /*command*/ ctx[33];
				add_flush_callback(() => updating_command = false);
			}

			if (!updating_dragDisabled && dirty[0] & /*dragDisabled*/ 8) {
				updating_dragDisabled = true;
				nestedchoicecommand_changes.dragDisabled = /*dragDisabled*/ ctx[3];
				add_flush_callback(() => updating_dragDisabled = false);
			}

			if (!updating_startDrag && dirty[0] & /*startDrag*/ 16) {
				updating_startDrag = true;
				nestedchoicecommand_changes.startDrag = /*startDrag*/ ctx[4];
				add_flush_callback(() => updating_startDrag = false);
			}

			nestedchoicecommand.$set(nestedchoicecommand_changes);
		},
		i(local) {
			if (current) return;
			transition_in(nestedchoicecommand.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(nestedchoicecommand.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(nestedchoicecommand, detaching);
		}
	};
}

// (87:8) {#if command.type === CommandType.Wait}
function create_if_block(ctx) {
	let waitcommand;
	let updating_command;
	let updating_dragDisabled;
	let updating_startDrag;
	let current;

	function waitcommand_command_binding(value) {
		/*waitcommand_command_binding*/ ctx[15](value, /*command*/ ctx[33], /*each_value*/ ctx[34], /*command_index*/ ctx[35]);
	}

	function waitcommand_dragDisabled_binding(value) {
		/*waitcommand_dragDisabled_binding*/ ctx[16](value);
	}

	function waitcommand_startDrag_binding(value) {
		/*waitcommand_startDrag_binding*/ ctx[17](value);
	}

	let waitcommand_props = {};

	if (/*command*/ ctx[33] !== void 0) {
		waitcommand_props.command = /*command*/ ctx[33];
	}

	if (/*dragDisabled*/ ctx[3] !== void 0) {
		waitcommand_props.dragDisabled = /*dragDisabled*/ ctx[3];
	}

	if (/*startDrag*/ ctx[4] !== void 0) {
		waitcommand_props.startDrag = /*startDrag*/ ctx[4];
	}

	waitcommand = new WaitCommand$1({ props: waitcommand_props });
	binding_callbacks.push(() => bind(waitcommand, 'command', waitcommand_command_binding));
	binding_callbacks.push(() => bind(waitcommand, 'dragDisabled', waitcommand_dragDisabled_binding));
	binding_callbacks.push(() => bind(waitcommand, 'startDrag', waitcommand_startDrag_binding));
	waitcommand.$on("deleteCommand", /*deleteCommand_handler*/ ctx[18]);
	waitcommand.$on("updateCommand", /*updateCommandFromEvent*/ ctx[7]);

	return {
		c() {
			create_component(waitcommand.$$.fragment);
		},
		m(target, anchor) {
			mount_component(waitcommand, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const waitcommand_changes = {};

			if (!updating_command && dirty[0] & /*commands, SHADOW_PLACEHOLDER_ITEM_ID*/ 5) {
				updating_command = true;
				waitcommand_changes.command = /*command*/ ctx[33];
				add_flush_callback(() => updating_command = false);
			}

			if (!updating_dragDisabled && dirty[0] & /*dragDisabled*/ 8) {
				updating_dragDisabled = true;
				waitcommand_changes.dragDisabled = /*dragDisabled*/ ctx[3];
				add_flush_callback(() => updating_dragDisabled = false);
			}

			if (!updating_startDrag && dirty[0] & /*startDrag*/ 16) {
				updating_startDrag = true;
				waitcommand_changes.startDrag = /*startDrag*/ ctx[4];
				add_flush_callback(() => updating_startDrag = false);
			}

			waitcommand.$set(waitcommand_changes);
		},
		i(local) {
			if (current) return;
			transition_in(waitcommand.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(waitcommand.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(waitcommand, detaching);
		}
	};
}

// (86:4) {#each commands.filter(c => c.id !== SHADOW_PLACEHOLDER_ITEM_ID) as command(command.id)}
function create_each_block(key_1, ctx) {
	let first;
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*command*/ ctx[33].type === CommandType.Wait) return 0;
		if (/*command*/ ctx[33].type === CommandType.NestedChoice) return 1;
		if (/*command*/ ctx[33].type === CommandType.UserScript) return 2;
		return 3;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			if_block.c();
			if_block_anchor = empty();
			this.first = first;
		},
		m(target, anchor) {
			insert(target, first, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(first);
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function create_fragment$1(ctx) {
	let ol;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let dndzone_action;
	let current;
	let mounted;
	let dispose;
	let each_value = /*commands*/ ctx[0].filter(/*func*/ ctx[14]);
	const get_key = ctx => /*command*/ ctx[33].id;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			ol = element("ol");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(ol, "class", "quickAddCommandList svelte-1ukgrgp");
		},
		m(target, anchor) {
			insert(target, ol, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ol, null);
			}

			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(dndzone_action = dndzone$2.call(null, ol, {
						items: /*commands*/ ctx[0],
						dragDisabled: /*dragDisabled*/ ctx[3],
						dropTargetStyle: {},
						type: "command"
					})),
					listen(ol, "consider", /*handleConsider*/ ctx[5]),
					listen(ol, "finalize", /*handleSort*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*commands, SHADOW_PLACEHOLDER_ITEM_ID, dragDisabled, startDrag, deleteCommand, updateCommandFromEvent, configureChoice, configureScript*/ 927) {
				each_value = /*commands*/ ctx[0].filter(/*func*/ ctx[14]);
				group_outros();
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ol, outro_and_destroy_block, create_each_block, null, get_each_context);
				check_outros();
			}

			if (dndzone_action && is_function(dndzone_action.update) && dirty[0] & /*commands, dragDisabled*/ 9) dndzone_action.update.call(null, {
				items: /*commands*/ ctx[0],
				dragDisabled: /*dragDisabled*/ ctx[3],
				dropTargetStyle: {},
				type: "command"
			});
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(ol);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { commands } = $$props;
	let { deleteCommand } = $$props;
	let { saveCommands } = $$props;
	let { app } = $$props;
	let { plugin } = $$props;
	let dragDisabled = true;

	const updateCommandList = newCommands => {
		$$invalidate(0, commands = newCommands);
	};

	function handleConsider(e) {
		let { items: newItems } = e.detail;
		$$invalidate(0, commands = newItems);
	}

	function handleSort(e) {
		let { items: newItems, info: { source } } = e.detail;
		$$invalidate(0, commands = newItems);

		if (source === SOURCES.POINTER) {
			$$invalidate(3, dragDisabled = true);
		}

		saveCommands(commands);
	}

	let startDrag = e => {
		e.preventDefault();
		$$invalidate(3, dragDisabled = false);
	};

	function updateCommandFromEvent(e) {
		const command = e.detail;
		updateCommand(command);
	}

	function updateCommand(command) {
		const index = commands.findIndex(c => c.id === command.id);
		$$invalidate(0, commands[index] = command, commands);
		saveCommands(commands);
	}

	async function configureChoice(e) {
		const command = e.detail;
		const newChoice = await getChoiceBuilder(command.choice).waitForClose;
		if (!newChoice) return;
		command.choice = newChoice;
		command.name = newChoice.name;
		updateCommand(command);
	}

	function getChoiceBuilder(choice) {
		switch (choice.type) {
			case ChoiceType.Template:
				return new TemplateChoiceBuilder(app, choice, plugin);
			case ChoiceType.Capture:
				return new CaptureChoiceBuilder(app, choice, plugin);
			case ChoiceType.Macro:
			case ChoiceType.Multi:
		}
	}

	async function configureScript(e) {
		const command = e.detail;
		const userScript = await getUserScript(command, app);

		if (!userScript.settings) {
			log.logWarning(`${command.name} has no settings.`);
			return;
		}

		new UserScriptSettingsModal(app, command, userScript.settings).open();
	}

	const func = c => c.id !== SHADOW_PLACEHOLDER_ITEM_ID;

	function waitcommand_command_binding(value, command, each_value, command_index) {
		each_value[command_index] = value;
		$$invalidate(0, commands);
	}

	function waitcommand_dragDisabled_binding(value) {
		dragDisabled = value;
		$$invalidate(3, dragDisabled);
	}

	function waitcommand_startDrag_binding(value) {
		startDrag = value;
		$$invalidate(4, startDrag);
	}

	const deleteCommand_handler = async e => await deleteCommand(e.detail);

	function nestedchoicecommand_command_binding(value, command, each_value, command_index) {
		each_value[command_index] = value;
		$$invalidate(0, commands);
	}

	function nestedchoicecommand_dragDisabled_binding(value) {
		dragDisabled = value;
		$$invalidate(3, dragDisabled);
	}

	function nestedchoicecommand_startDrag_binding(value) {
		startDrag = value;
		$$invalidate(4, startDrag);
	}

	const deleteCommand_handler_1 = async e => await deleteCommand(e.detail);

	function userscriptcommand_command_binding(value, command, each_value, command_index) {
		each_value[command_index] = value;
		$$invalidate(0, commands);
	}

	function userscriptcommand_dragDisabled_binding(value) {
		dragDisabled = value;
		$$invalidate(3, dragDisabled);
	}

	function userscriptcommand_startDrag_binding(value) {
		startDrag = value;
		$$invalidate(4, startDrag);
	}

	const deleteCommand_handler_2 = async e => await deleteCommand(e.detail);

	function standardcommand_command_binding(value, command, each_value, command_index) {
		each_value[command_index] = value;
		$$invalidate(0, commands);
	}

	function standardcommand_dragDisabled_binding(value) {
		dragDisabled = value;
		$$invalidate(3, dragDisabled);
	}

	function standardcommand_startDrag_binding(value) {
		startDrag = value;
		$$invalidate(4, startDrag);
	}

	const deleteCommand_handler_3 = async e => await deleteCommand(e.detail);

	$$self.$$set = $$props => {
		if ('commands' in $$props) $$invalidate(0, commands = $$props.commands);
		if ('deleteCommand' in $$props) $$invalidate(1, deleteCommand = $$props.deleteCommand);
		if ('saveCommands' in $$props) $$invalidate(10, saveCommands = $$props.saveCommands);
		if ('app' in $$props) $$invalidate(11, app = $$props.app);
		if ('plugin' in $$props) $$invalidate(12, plugin = $$props.plugin);
	};

	return [
		commands,
		deleteCommand,
		SHADOW_PLACEHOLDER_ITEM_ID,
		dragDisabled,
		startDrag,
		handleConsider,
		handleSort,
		updateCommandFromEvent,
		configureChoice,
		configureScript,
		saveCommands,
		app,
		plugin,
		updateCommandList,
		func,
		waitcommand_command_binding,
		waitcommand_dragDisabled_binding,
		waitcommand_startDrag_binding,
		deleteCommand_handler,
		nestedchoicecommand_command_binding,
		nestedchoicecommand_dragDisabled_binding,
		nestedchoicecommand_startDrag_binding,
		deleteCommand_handler_1,
		userscriptcommand_command_binding,
		userscriptcommand_dragDisabled_binding,
		userscriptcommand_startDrag_binding,
		deleteCommand_handler_2,
		standardcommand_command_binding,
		standardcommand_dragDisabled_binding,
		standardcommand_startDrag_binding,
		deleteCommand_handler_3
	];
}

class CommandList extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{
				commands: 0,
				deleteCommand: 1,
				saveCommands: 10,
				app: 11,
				plugin: 12,
				updateCommandList: 13
			},
			add_css$1,
			[-1, -1]
		);
	}

	get updateCommandList() {
		return this.$$.ctx[13];
	}
}

class ChoiceCommand extends Command {
    constructor(name, choiceId) {
        super(name, CommandType.Choice);
        this.choiceId = choiceId;
    }
}

class WaitCommand extends Command {
    constructor(time) {
        super("Wait", CommandType.Wait);
        this.time = time;
    }
}

class NestedChoiceCommand extends Command {
    constructor(choice) {
        super(choice.name, CommandType.NestedChoice);
        this.choice = choice;
    }
}

class MacroBuilder extends obsidian.Modal {
    constructor(app, plugin, macro, choices) {
        super(app);
        this.commands = [];
        this.javascriptFiles = [];
        this.choices = [];
        this.macro = macro;
        this.svelteElements = [];
        this.choices = choices;
        this.plugin = plugin;
        this.waitForClose = new Promise(resolve => (this.resolvePromise = resolve));
        this.getObsidianCommands();
        this.getJavascriptFiles();
        this.display();
        this.open();
    }
    onClose() {
        super.onClose();
        this.resolvePromise(this.macro);
        this.svelteElements.forEach(el => {
            if (el && el.$destroy)
                el.$destroy();
        });
    }
    display() {
        this.containerEl.addClass('quickAddModal', 'macroBuilder');
        this.contentEl.empty();
        this.addCenteredHeader(this.macro.name);
        this.addCommandList();
        this.addCommandBar();
        this.addAddObsidianCommandSetting();
        this.addAddEditorCommandsSetting();
        this.addAddUserScriptSetting();
        this.addAddChoiceSetting();
    }
    addCenteredHeader(header) {
        const headerEl = this.contentEl.createEl('h2');
        headerEl.style.textAlign = "center";
        headerEl.setText(header);
        headerEl.addClass('clickable');
        headerEl.addEventListener('click', async () => {
            const newMacroName = await GenericInputPrompt.Prompt(this.app, `Update name for ${this.macro.name}`, this.macro.name);
            if (!newMacroName)
                return;
            this.macro.name = newMacroName;
            this.reload();
        });
    }
    reload() {
        this.display();
    }
    addAddObsidianCommandSetting() {
        let input;
        const addObsidianCommandFromInput = () => {
            const value = input.getValue();
            const obsidianCommand = this.commands.find(v => v.name === value);
            const command = new ObsidianCommand(obsidianCommand.name, obsidianCommand.commandId);
            command.generateId();
            this.addCommandToMacro(command);
            input.setValue("");
        };
        new obsidian.Setting(this.contentEl)
            .setName("Obsidian command")
            .setDesc("Add an Obsidian command")
            .addText(textComponent => {
            input = textComponent;
            textComponent.inputEl.style.marginRight = "1em";
            textComponent.setPlaceholder("Obsidian command");
            new GenericTextSuggester(this.app, textComponent.inputEl, this.commands.map(c => c.name));
            textComponent.inputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addObsidianCommandFromInput();
                }
            });
        })
            .addButton(button => button.setCta().setButtonText("Add").onClick(addObsidianCommandFromInput));
    }
    addAddEditorCommandsSetting() {
        let dropdownComponent;
        const addEditorCommandFromDropdown = () => {
            const type = dropdownComponent.getValue();
            let command;
            switch (type) {
                case EditorCommandType.Copy:
                    command = new CopyCommand();
                    break;
                case EditorCommandType.Cut:
                    command = new CutCommand();
                    break;
                case EditorCommandType.Paste:
                    command = new PasteCommand();
                    break;
                case EditorCommandType.SelectActiveLine:
                    command = new SelectActiveLineCommand();
                    break;
                case EditorCommandType.SelectLinkOnActiveLine:
                    command = new SelectLinkOnActiveLineCommand();
                    break;
                default:
                    log.logError("invalid editor command type");
            }
            this.addCommandToMacro(command);
        };
        new obsidian.Setting(this.contentEl)
            .setName("Editor commands")
            .setDesc("Add editor command")
            .addDropdown(dropdown => {
            dropdownComponent = dropdown;
            dropdown.selectEl.style.marginRight = "1em";
            dropdown.addOption(EditorCommandType.Copy, EditorCommandType.Copy)
                .addOption(EditorCommandType.Cut, EditorCommandType.Cut)
                .addOption(EditorCommandType.Paste, EditorCommandType.Paste)
                .addOption(EditorCommandType.SelectActiveLine, EditorCommandType.SelectActiveLine)
                .addOption(EditorCommandType.SelectLinkOnActiveLine, EditorCommandType.SelectLinkOnActiveLine);
        })
            .addButton(button => button.setCta().setButtonText("Add").onClick(addEditorCommandFromDropdown));
    }
    addAddUserScriptSetting() {
        let input;
        const addUserScriptFromInput = () => {
            const value = input.getValue();
            const scriptBasename = getUserScriptMemberAccess(value).basename;
            const file = this.javascriptFiles.find(f => f.basename === scriptBasename);
            if (!file)
                return;
            this.addCommandToMacro(new UserScript(value, file.path));
            input.setValue("");
        };
        new obsidian.Setting(this.contentEl)
            .setName("User Scripts")
            .setDesc("Add user script")
            .addText(textComponent => {
            input = textComponent;
            textComponent.inputEl.style.marginRight = "1em";
            textComponent.setPlaceholder("User script");
            new GenericTextSuggester(this.app, textComponent.inputEl, this.javascriptFiles.map(f => f.basename));
            textComponent.inputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addUserScriptFromInput();
                }
            });
        })
            .addButton(button => button
            .setButtonText("Add")
            .setCta()
            .onClick(addUserScriptFromInput));
    }
    addAddChoiceSetting() {
        let input;
        const addChoiceFromInput = () => {
            const value = input.getValue();
            const choice = this.choices.find(c => c.name === value);
            if (!choice)
                return;
            this.addCommandToMacro(new ChoiceCommand(choice.name, choice.id));
            input.setValue("");
        };
        new obsidian.Setting(this.contentEl)
            .setName("Choices")
            .setDesc("Add existing choice")
            .addText(textComponent => {
            input = textComponent;
            textComponent.inputEl.style.marginRight = "1em";
            textComponent.setPlaceholder("Choice");
            new GenericTextSuggester(this.app, textComponent.inputEl, this.choices.map(c => c.name));
            textComponent.inputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addChoiceFromInput();
                }
            });
        })
            .addButton(button => button.setCta()
            .setButtonText("Add")
            .onClick(addChoiceFromInput));
    }
    getObsidianCommands() {
        // @ts-ignore
        Object.keys(this.app.commands.commands).forEach(key => {
            // @ts-ignore
            const command = this.app.commands.commands[key];
            this.commands.push(new ObsidianCommand(command.name, command.id));
        });
    }
    getJavascriptFiles() {
        this.javascriptFiles = this.app.vault.getFiles()
            .filter(file => JAVASCRIPT_FILE_EXTENSION_REGEX.test(file.path));
    }
    addCommandList() {
        const commandList = this.contentEl.createDiv('commandList');
        console.log(this.macro.commands);
        this.commandListEl = new CommandList({
            target: commandList,
            props: {
                app: this.app,
                plugin: this.plugin,
                commands: this.macro.commands,
                deleteCommand: async (commandId) => {
                    const command = this.macro.commands.find(c => c.id === commandId);
                    const promptAnswer = await GenericYesNoPrompt.Prompt(this.app, "Are you sure you wish to delete this command?", `If you click yes, you will delete '${command.name}'.`);
                    if (!promptAnswer)
                        return;
                    this.macro.commands = this.macro.commands.filter(c => c.id !== commandId);
                    this.commandListEl.updateCommandList(this.macro.commands);
                },
                saveCommands: (commands) => {
                    this.macro.commands = commands;
                },
            }
        });
        this.svelteElements.push(this.commandListEl);
    }
    addCommandBar() {
        const quickCommandContainer = this.contentEl.createDiv('quickCommandContainer');
        this.newChoiceButton(quickCommandContainer, "Capture", CaptureChoice);
        this.newChoiceButton(quickCommandContainer, "Template", TemplateChoice);
        this.addAddWaitCommandButton(quickCommandContainer);
    }
    addAddWaitCommandButton(quickCommandContainer) {
        const button = new obsidian.ButtonComponent(quickCommandContainer);
        button.setIcon('clock').setTooltip("Add wait command").onClick(() => {
            this.addCommandToMacro(new WaitCommand(100));
        });
    }
    newChoiceButton(container, typeName, type) {
        const button = new obsidian.ButtonComponent(container);
        button.setButtonText(typeName).setTooltip(`Add ${typeName} Choice`).onClick(() => {
            const captureChoice = new type(`Untitled ${typeName} Choice`);
            this.addCommandToMacro(new NestedChoiceCommand(captureChoice));
        });
    }
    addCommandToMacro(command) {
        this.macro.commands.push(command);
        this.commandListEl.updateCommandList(this.macro.commands);
    }
}

class QuickAddMacro {
    constructor(name) {
        this.name = name;
        this.id = v4();
        this.commands = [];
        this.runOnStartup = false;
    }
}

class MacrosManager extends obsidian.Modal {
    constructor(app, plugin, macros, choices) {
        super(app);
        this.app = app;
        this.macros = macros;
        this.choices = choices;
        this.plugin = plugin;
        this.waitForClose = new Promise(((resolve, reject) => {
            this.rejectPromise = reject;
            this.resolvePromise = resolve;
        }));
        this.open();
        this.display();
    }
    display() {
        this.contentEl.createEl('h2', { text: 'Macro Manager' }).style.textAlign = "center";
        this.addMacroSettings();
        this.addAddMacroBar();
    }
    addMacroSettings() {
        this.macroContainer = this.contentEl.createDiv();
        this.updateMacroContainer = () => {
            if (this.macros.length <= 1)
                this.macroContainer.className = "macroContainer macroContainer1";
            if (this.macros.length === 2)
                this.macroContainer.className = "macroContainer macroContainer2";
            if (this.macros.length > 2)
                this.macroContainer.className = "macroContainer macroContainer3";
        };
        this.macros.forEach(macro => this.addMacroSetting(macro, this.macroContainer));
        this.updateMacroContainer();
    }
    addMacroSetting(macro, container) {
        const configureMacroContainer = container.createDiv();
        const macroSetting = new obsidian.Setting(configureMacroContainer);
        macroSetting.setName(macro.name);
        macroSetting.infoEl.style.fontWeight = "bold";
        this.addMacroConfigurationItem(configureMacroContainer, itemContainerEl => {
            this.addSpanWithText(itemContainerEl, "Run on plugin load");
            const toggle = new obsidian.ToggleComponent(itemContainerEl);
            toggle.setValue(macro.runOnStartup);
            toggle.onChange(value => {
                macro.runOnStartup = value;
                this.updateMacro(macro);
            });
        });
        configureMacroContainer.addClass("configureMacroDiv");
        this.addMacroConfigurationItem(configureMacroContainer, itemContainerEl => {
            const deleteButton = new obsidian.ButtonComponent(itemContainerEl);
            deleteButton.setClass('mod-warning');
            deleteButton.buttonEl.style.marginRight = "0";
            deleteButton.setButtonText("Delete").onClick(evt => {
                this.macros = this.macros.filter(m => m.id !== macro.id);
                const scroll = this.macroContainer.scrollTop;
                this.reload();
                this.macroContainer.scrollTop = scroll;
            });
            const configureButton = new obsidian.ButtonComponent(itemContainerEl);
            configureButton.setClass('mod-cta');
            configureButton.buttonEl.style.marginRight = "0";
            configureButton.setButtonText("Configure").onClick(async (evt) => {
                const getReachableChoices = (choices) => {
                    let reachableChoices = [];
                    choices.forEach(choice => {
                        if (choice.type === ChoiceType.Multi)
                            reachableChoices.push(...getReachableChoices(choice.choices));
                        if (choice.type !== ChoiceType.Multi)
                            reachableChoices.push(choice);
                    });
                    return reachableChoices;
                };
                const reachableChoices = getReachableChoices(this.choices);
                const newMacro = await new MacroBuilder(this.app, this.plugin, macro, reachableChoices).waitForClose;
                if (newMacro) {
                    this.updateMacro(newMacro);
                    this.reload();
                }
            });
        });
    }
    addMacroConfigurationItem(container, callback, classString = "configureMacroDivItem") {
        const item = container.createDiv();
        item.addClass(classString);
        callback(item);
    }
    addSpanWithText(container, text) {
        const configureText = container.createEl('span');
        configureText.setText(text);
    }
    updateMacro(macro) {
        const index = this.macros.findIndex(v => v.id === macro.id);
        this.macros[index] = macro;
        if (this.updateMacroContainer)
            this.updateMacroContainer();
        this.reload();
    }
    reload() {
        this.contentEl.empty();
        this.display();
    }
    addAddMacroBar() {
        const addMacroBarContainer = this.contentEl.createDiv();
        addMacroBarContainer.addClass("addMacroBarContainer");
        const nameInput = new obsidian.TextComponent(addMacroBarContainer);
        nameInput.setPlaceholder("Macro name");
        const addMacroButton = new obsidian.ButtonComponent(addMacroBarContainer);
        addMacroButton.setButtonText("Add macro")
            .setClass("mod-cta")
            .onClick(() => {
            const inputValue = nameInput.getValue();
            if (inputValue !== "" && !this.macros.find(m => m.name === inputValue)) {
                const macro = new QuickAddMacro(inputValue);
                if (!macro) {
                    log.logError("macro invalid - will not be added");
                    return;
                }
                this.macros.push(macro);
                this.reload();
                this.macroContainer.scrollTo(0, this.macroContainer.scrollHeight);
            }
        });
    }
    onClose() {
        super.onClose();
        this.resolvePromise(this.macros);
    }
}

/* src/gui/choiceList/ChoiceView.svelte generated by Svelte v3.47.0 */

function add_css(target) {
	append_styles(target, "svelte-wcmtyt", ".choiceViewBottomBar.svelte-wcmtyt{display:flex;flex-direction:row;align-items:center;justify-content:space-between;margin-top:1rem}@media(max-width: 800px){.choiceViewBottomBar.svelte-wcmtyt{flex-direction:column}}");
}

function create_fragment(ctx) {
	let div1;
	let choicelist;
	let updating_choices;
	let t0;
	let div0;
	let button;
	let t2;
	let addchoicebox;
	let current;
	let mounted;
	let dispose;

	function choicelist_choices_binding(value) {
		/*choicelist_choices_binding*/ ctx[11](value);
	}

	let choicelist_props = { type: "main" };

	if (/*choices*/ ctx[0] !== void 0) {
		choicelist_props.choices = /*choices*/ ctx[0];
	}

	choicelist = new ChoiceList({ props: choicelist_props });
	binding_callbacks.push(() => bind(choicelist, 'choices', choicelist_choices_binding));
	choicelist.$on("deleteChoice", /*deleteChoice*/ ctx[3]);
	choicelist.$on("configureChoice", /*configureChoice*/ ctx[4]);
	choicelist.$on("toggleCommand", /*toggleCommandForChoice*/ ctx[5]);
	choicelist.$on("reorderChoices", /*reorderChoices_handler*/ ctx[12]);
	addchoicebox = new AddChoiceBox({});
	addchoicebox.$on("addChoice", /*addChoiceToList*/ ctx[2]);

	return {
		c() {
			div1 = element("div");
			create_component(choicelist.$$.fragment);
			t0 = space();
			div0 = element("div");
			button = element("button");
			button.textContent = "Manage Macros";
			t2 = space();
			create_component(addchoicebox.$$.fragment);
			attr(button, "class", "mod-cta");
			attr(div0, "class", "choiceViewBottomBar svelte-wcmtyt");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			mount_component(choicelist, div1, null);
			append(div1, t0);
			append(div1, div0);
			append(div0, button);
			append(div0, t2);
			mount_component(addchoicebox, div0, null);
			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*openMacroManager*/ ctx[6]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			const choicelist_changes = {};

			if (!updating_choices && dirty & /*choices*/ 1) {
				updating_choices = true;
				choicelist_changes.choices = /*choices*/ ctx[0];
				add_flush_callback(() => updating_choices = false);
			}

			choicelist.$set(choicelist_changes);
		},
		i(local) {
			if (current) return;
			transition_in(choicelist.$$.fragment, local);
			transition_in(addchoicebox.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(choicelist.$$.fragment, local);
			transition_out(addchoicebox.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_component(choicelist);
			destroy_component(addchoicebox);
			mounted = false;
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { choices = [] } = $$props;
	let { macros = [] } = $$props;
	let { saveChoices } = $$props;
	let { saveMacros } = $$props;
	let { app } = $$props;
	let { plugin } = $$props;

	function addChoiceToList(event) {
		const { name, type } = event.detail;

		switch (type) {
			case ChoiceType.Template:
				const templateChoice = new TemplateChoice(name);
				$$invalidate(0, choices = [...choices, templateChoice]);
				break;
			case ChoiceType.Capture:
				const captureChoice = new CaptureChoice(name);
				$$invalidate(0, choices = [...choices, captureChoice]);
				break;
			case ChoiceType.Macro:
				const macroChoice = new MacroChoice(name);
				$$invalidate(0, choices = [...choices, macroChoice]);
				break;
			case ChoiceType.Multi:
				const multiChoice = new MultiChoice(name);
				$$invalidate(0, choices = [...choices, multiChoice]);
				break;
		}

		saveChoices(choices);
	}

	async function deleteChoice(e) {
		const choice = e.detail.choice;

		const userConfirmed = await GenericYesNoPrompt.Prompt(app, `Confirm deletion of choice`, `Please confirm that you wish to delete '${choice.name}'.
            ${choice.type === ChoiceType.Multi
		? "Deleting this choice will delete all (" + choice.choices.length + ") choices inside it!"
		: ""}
            `);

		if (userConfirmed) {
			$$invalidate(0, choices = choices.filter(value => deleteChoiceHelper(choice.id, value)));
			plugin.removeCommandForChoice(choice);
			saveChoices(choices);
		}
	}

	function deleteChoiceHelper(id, value) {
		if (value.type === ChoiceType.Multi) {
			value.choices = value.choices.filter(v => deleteChoiceHelper(id, v));
		}

		return value.id !== id;
	}

	async function configureChoice(e) {
		const { choice: oldChoice } = e.detail;
		let updatedChoice;

		if (oldChoice.type === ChoiceType.Multi) {
			updatedChoice = oldChoice;
			const name = await GenericInputPrompt.Prompt(app, `Rename ${oldChoice.name}`, '', oldChoice.name);
			if (!name) return;
			updatedChoice.name = name;
		} else {
			updatedChoice = await getChoiceBuilder(oldChoice).waitForClose;
		}

		if (!updatedChoice) return;
		$$invalidate(0, choices = choices.map(choice => updateChoiceHelper(choice, updatedChoice)));
		saveChoices(choices);
	}

	async function toggleCommandForChoice(e) {
		const { choice: oldChoice } = e.detail;
		const updatedChoice = Object.assign(Object.assign({}, oldChoice), { command: !oldChoice.command });

		updatedChoice.command
		? plugin.addCommandForChoice(updatedChoice)
		: plugin.removeCommandForChoice(updatedChoice);

		$$invalidate(0, choices = choices.map(choice => updateChoiceHelper(choice, updatedChoice)));
		saveChoices(choices);
	}

	function updateChoiceHelper(oldChoice, newChoice) {
		if (oldChoice.id === newChoice.id) {
			oldChoice = Object.assign(Object.assign({}, oldChoice), newChoice);
			return oldChoice;
		}

		if (oldChoice.type === ChoiceType.Multi) {
			const multiChoice = oldChoice;
			const multiChoiceChoices = multiChoice.choices.map(c => updateChoiceHelper(c, newChoice));
			return Object.assign(Object.assign({}, multiChoice), { choices: multiChoiceChoices });
		}

		return oldChoice;
	}

	function getChoiceBuilder(choice) {
		switch (choice.type) {
			case ChoiceType.Template:
				return new TemplateChoiceBuilder(app, choice, plugin);
			case ChoiceType.Capture:
				return new CaptureChoiceBuilder(app, choice, plugin);
			case ChoiceType.Macro:
				return new MacroChoiceBuilder(app, choice, macros);
			case ChoiceType.Multi:
		}
	}

	async function openMacroManager() {
		const newMacros = await new MacrosManager(app, plugin, macros, choices).waitForClose;

		if (newMacros) {
			saveMacros(newMacros);
			$$invalidate(7, macros = newMacros);
		}
	}

	function choicelist_choices_binding(value) {
		choices = value;
		$$invalidate(0, choices);
	}

	const reorderChoices_handler = e => saveChoices(e.detail.choices);

	$$self.$$set = $$props => {
		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
		if ('macros' in $$props) $$invalidate(7, macros = $$props.macros);
		if ('saveChoices' in $$props) $$invalidate(1, saveChoices = $$props.saveChoices);
		if ('saveMacros' in $$props) $$invalidate(8, saveMacros = $$props.saveMacros);
		if ('app' in $$props) $$invalidate(9, app = $$props.app);
		if ('plugin' in $$props) $$invalidate(10, plugin = $$props.plugin);
	};

	return [
		choices,
		saveChoices,
		addChoiceToList,
		deleteChoice,
		configureChoice,
		toggleCommandForChoice,
		openMacroManager,
		macros,
		saveMacros,
		app,
		plugin,
		choicelist_choices_binding,
		reorderChoices_handler
	];
}

class ChoiceView extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				choices: 0,
				macros: 7,
				saveChoices: 1,
				saveMacros: 8,
				app: 9,
				plugin: 10
			},
			add_css
		);
	}
}

const DEFAULT_SETTINGS = {
    choices: [],
    macros: [],
    inputPrompt: "single-line"
};
class QuickAddSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'QuickAdd Settings' });
        this.addChoicesSetting();
        new obsidian.Setting(this.containerEl)
            .setName('Use Multi-line Input Prompt')
            .setDesc('Use multi-line input prompt instead of single-line input prompt')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.inputPrompt === "multi-line")
            .setTooltip("Use multi-line input prompt")
            .onChange(value => {
            if (value) {
                this.plugin.settings.inputPrompt = "multi-line";
            }
            else {
                this.plugin.settings.inputPrompt = "single-line";
            }
            this.plugin.saveSettings();
        }));
    }
    hide() {
        if (this.choiceView)
            this.choiceView.$destroy();
    }
    addChoicesSetting() {
        const setting = new obsidian.Setting(this.containerEl);
        setting.infoEl.remove();
        setting.settingEl.style.display = "block";
        this.choiceView = new ChoiceView({
            target: setting.settingEl,
            props: {
                app: this.app,
                plugin: this.plugin,
                choices: this.plugin.settings.choices,
                saveChoices: async (choices) => {
                    this.plugin.settings.choices = choices;
                    await this.plugin.saveSettings();
                },
                macros: this.plugin.settings.macros,
                saveMacros: async (macros) => {
                    this.plugin.settings.macros = macros;
                    await this.plugin.saveSettings();
                }
            }
        });
    }
}

var ErrorLevel;
(function (ErrorLevel) {
    ErrorLevel["Error"] = "ERROR";
    ErrorLevel["Warning"] = "WARNING";
    ErrorLevel["Log"] = "LOG";
})(ErrorLevel || (ErrorLevel = {}));

class QuickAddLogger {
    formatOutputString(error) {
        return `QuickAdd: (${error.level}) ${error.message}`;
    }
    getQuickAddError(message, level) {
        return { message, level, time: Date.now() };
    }
}

class ConsoleErrorLogger extends QuickAddLogger {
    constructor() {
        super(...arguments);
        this.ErrorLog = [];
    }
    logError(errorMsg) {
        const error = this.getQuickAddError(errorMsg, ErrorLevel.Error);
        this.addMessageToErrorLog(error);
        console.error(this.formatOutputString(error));
    }
    logWarning(warningMsg) {
        const warning = this.getQuickAddError(warningMsg, ErrorLevel.Warning);
        this.addMessageToErrorLog(warning);
        console.warn(this.formatOutputString(warning));
    }
    logMessage(logMsg) {
        const log = this.getQuickAddError(logMsg, ErrorLevel.Log);
        this.addMessageToErrorLog(log);
        console.log(this.formatOutputString(log));
    }
    addMessageToErrorLog(error) {
        this.ErrorLog.push(error);
    }
}

class GuiLogger extends QuickAddLogger {
    constructor(plugin) {
        super();
        this.plugin = plugin;
    }
    logError(msg) {
        const error = this.getQuickAddError(msg, ErrorLevel.Error);
        new obsidian.Notice(this.formatOutputString(error));
    }
    logWarning(msg) {
        const warning = this.getQuickAddError(msg, ErrorLevel.Warning);
        new obsidian.Notice(this.formatOutputString(warning));
    }
    logMessage(msg) { }
}

class StartupMacroEngine extends MacroChoiceEngine {
    constructor(app, plugin, macros, choiceExecutor) {
        super(app, plugin, null, macros, choiceExecutor, null);
    }
    async run() {
        this.macros.forEach(macro => {
            if (macro.runOnStartup) {
                this.executeCommands(macro.commands);
            }
        });
    }
}

class TemplateChoiceEngine extends TemplateEngine {
    constructor(app, plugin, choice, choiceExecutor) {
        super(app, plugin, choiceExecutor);
        this.choice = choice;
    }
    async run() {
        let folderPath = "";
        if (this.choice.folder.enabled) {
            folderPath = await this.getFolderPath();
        }
        let filePath;
        if (this.choice.fileNameFormat.enabled) {
            filePath = await this.getFormattedFilePath(folderPath, this.choice.fileNameFormat.format, this.choice.name);
        }
        else {
            filePath = await this.getFormattedFilePath(folderPath, VALUE_SYNTAX, this.choice.name);
        }
        if (this.choice.incrementFileName)
            filePath = await this.incrementFileName(filePath);
        let createdFile;
        if (await this.app.vault.adapter.exists(filePath)) {
            const file = this.app.vault.getAbstractFileByPath(filePath);
            if (!(file instanceof obsidian.TFile) || file.extension !== 'md') {
                log.logError(`'${filePath}' already exists and is not a valid markdown file.`);
                return;
            }
            await this.app.workspace.splitActiveLeaf('vertical').openFile(file);
            const userChoice = await GenericSuggester.Suggest(this.app, fileExistsChoices, fileExistsChoices);
            switch (userChoice) {
                case fileExistsAppendToTop:
                    createdFile = await this.appendToFileWithTemplate(file, this.choice.templatePath, 'top');
                    break;
                case fileExistsAppendToBottom:
                    createdFile = await this.appendToFileWithTemplate(file, this.choice.templatePath, 'bottom');
                    break;
                case fileExistsOverwriteFile:
                    createdFile = await this.overwriteFileWithTemplate(file, this.choice.templatePath);
                    break;
                case fileExistsDoNothing:
                default:
                    log.logWarning("File not written to.");
                    return;
            }
        }
        else {
            createdFile = await this.createFileWithTemplate(filePath, this.choice.templatePath);
            if (!createdFile) {
                log.logWarning(`Could not create file '${filePath}'.`);
                return;
            }
        }
        if (this.choice.appendLink) {
            appendToCurrentLine(this.app.fileManager.generateMarkdownLink(createdFile, ''), this.app);
        }
        if (this.choice.openFile) {
            await openFile(this.app, createdFile, {
                openInNewTab: this.choice.openFileInNewTab.enabled,
                direction: this.choice.openFileInNewTab.direction,
                focus: this.choice.openFileInNewTab.focus,
                mode: this.choice.openFileInMode
            });
        }
    }
    async formatFolderPaths(folders) {
        const folderPaths = await Promise.all(folders.map(async (folder) => {
            return await this.formatter.formatFolderPath(folder);
        }));
        return folderPaths;
    }
    async getFolderPath() {
        var _a, _b;
        let folders = await this.formatFolderPaths([...this.choice.folder.folders]);
        if ((_a = this.choice.folder) === null || _a === void 0 ? void 0 : _a.chooseWhenCreatingNote) {
            const allFoldersInVault = getAllFolderPathsInVault(this.app);
            return await this.getOrCreateFolder(allFoldersInVault);
        }
        if ((_b = this.choice.folder) === null || _b === void 0 ? void 0 : _b.createInSameFolderAsActiveFile) {
            const activeFile = this.app.workspace.getActiveFile();
            if (!activeFile)
                log.logError("No active file. Cannot create new file.");
            return this.getOrCreateFolder([activeFile.parent.path]);
        }
        return await this.getOrCreateFolder(folders);
    }
}

class CaptureChoiceFormatter extends CompleteFormatter {
    constructor(app, plugin, choiceExecutor) {
        super(app, plugin, choiceExecutor);
        this.file = null;
        this.fileContent = "";
    }
    async formatContentWithFile(input, choice, fileContent, file) {
        this.choice = choice;
        this.file = file;
        this.fileContent = fileContent;
        if (!choice || !file || fileContent === null)
            return input;
        const formatted = await this.formatFileContent(input);
        const templaterFormatted = templaterParseTemplate(this.app, formatted, this.file);
        if (!templaterFormatted)
            return formatted;
        return templaterFormatted;
    }
    async formatContent(input, choice) {
        this.choice = choice;
        if (!choice)
            return input;
        return await this.formatFileContent(input);
    }
    async formatFileContent(input) {
        let formatted = await super.formatFileContent(input);
        formatted = this.replaceLinebreakInString(formatted);
        const formattedContentIsEmpty = formatted.trim() === "";
        if (formattedContentIsEmpty)
            return this.fileContent;
        if (this.choice.prepend) {
            const shouldInsertLinebreak = !this.choice.task;
            return `${this.fileContent}${shouldInsertLinebreak ? "\n" : ""}${formatted}`;
        }
        if (this.choice.insertAfter.enabled) {
            return await this.insertAfterHandler(formatted);
        }
        const frontmatterEndPosition = this.file ? await this.getFrontmatterEndPosition(this.file) : null;
        if (!frontmatterEndPosition)
            return `${formatted}${this.fileContent}`;
        return this.insertTextAfterPositionInBody(formatted, this.fileContent, frontmatterEndPosition);
    }
    async insertAfterHandler(formatted) {
        var _a, _b;
        const targetString = await this.format(this.choice.insertAfter.after);
        const targetRegex = new RegExp(`\s*${escapeRegExp(targetString.replace('\\n', ''))}\s*`);
        let fileContentLines = getLinesInString(this.fileContent);
        const targetPosition = fileContentLines.findIndex(line => targetRegex.test(line));
        const targetNotFound = targetPosition === -1;
        if (targetNotFound) {
            if ((_a = this.choice.insertAfter) === null || _a === void 0 ? void 0 : _a.createIfNotFound) {
                return await this.createInsertAfterIfNotFound(formatted);
            }
            log.logError("unable to find insert after line in file.");
        }
        if ((_b = this.choice.insertAfter) === null || _b === void 0 ? void 0 : _b.insertAtEnd) {
            const nextHeaderPositionAfterTargetPosition = fileContentLines
                .slice(targetPosition + 1)
                .findIndex(line => (/^#+ |---/).test(line));
            const foundNextHeader = nextHeaderPositionAfterTargetPosition !== -1;
            if (foundNextHeader) {
                let endOfSectionIndex;
                for (let i = nextHeaderPositionAfterTargetPosition + targetPosition; i > targetPosition; i--) {
                    const lineIsNewline = (/^[\s\n ]*$/).test(fileContentLines[i]);
                    if (!lineIsNewline) {
                        endOfSectionIndex = i;
                        break;
                    }
                }
                if (!endOfSectionIndex)
                    endOfSectionIndex = targetPosition;
                return this.insertTextAfterPositionInBody(formatted, this.fileContent, endOfSectionIndex);
            }
            else {
                return this.insertTextAfterPositionInBody(formatted, this.fileContent, fileContentLines.length - 1);
            }
        }
        return this.insertTextAfterPositionInBody(formatted, this.fileContent, targetPosition);
    }
    async createInsertAfterIfNotFound(formatted) {
        var _a, _b;
        const insertAfterLine = this.replaceLinebreakInString(await this.format(this.choice.insertAfter.after));
        const insertAfterLineAndFormatted = `${insertAfterLine}\n${formatted}`;
        if (((_a = this.choice.insertAfter) === null || _a === void 0 ? void 0 : _a.createIfNotFoundLocation) === CREATE_IF_NOT_FOUND_TOP) {
            const frontmatterEndPosition = this.file ? await this.getFrontmatterEndPosition(this.file) : -1;
            return this.insertTextAfterPositionInBody(insertAfterLineAndFormatted, this.fileContent, frontmatterEndPosition);
        }
        if (((_b = this.choice.insertAfter) === null || _b === void 0 ? void 0 : _b.createIfNotFoundLocation) === CREATE_IF_NOT_FOUND_BOTTOM) {
            return `${this.fileContent}\n${insertAfterLineAndFormatted}`;
        }
    }
    async getFrontmatterEndPosition(file) {
        const fileCache = await this.app.metadataCache.getFileCache(file);
        if (!fileCache || !fileCache.frontmatter) {
            log.logMessage("could not get frontmatter. Maybe there isn't any.");
            return -1;
        }
        if (fileCache.frontmatter.position)
            return fileCache.frontmatter.position.end.line;
        return -1;
    }
    insertTextAfterPositionInBody(text, body, pos) {
        if (pos === -1) {
            // For the case that there is no frontmatter and we're adding to the top of the file.
            // We already add a linebreak for the task in CaptureChoiceEngine.tsx in getCapturedContent.
            const shouldAddLinebreak = !this.choice.task;
            return `${text}${shouldAddLinebreak ? "\n" : ""}${body}`;
        }
        const splitContent = body.split("\n");
        const pre = splitContent.slice(0, pos + 1).join("\n");
        const post = splitContent.slice(pos + 1).join("\n");
        return `${pre}\n${text}${post}`;
    }
}

class CaptureChoiceEngine extends QuickAddChoiceEngine {
    constructor(app, plugin, choice, choiceExecutor) {
        super(app);
        this.choiceExecutor = choiceExecutor;
        this.choice = choice;
        this.plugin = plugin;
        this.formatter = new CaptureChoiceFormatter(app, plugin, choiceExecutor);
    }
    async run() {
        var _a, _b, _c, _d;
        try {
            if ((_a = this.choice) === null || _a === void 0 ? void 0 : _a.captureToActiveFile) {
                await this.captureToActiveFile();
                return;
            }
            const captureTo = this.choice.captureTo;
            if (!captureTo) {
                log.logError(`Invalid capture to for ${this.choice.name}`);
                return;
            }
            const filePath = await this.getFilePath(captureTo);
            const content = await this.getCaptureContent();
            let getFileAndAddContentFn;
            if (await this.fileExists(filePath)) {
                getFileAndAddContentFn = this.onFileExists;
            }
            else if ((_c = (_b = this.choice) === null || _b === void 0 ? void 0 : _b.createFileIfItDoesntExist) === null || _c === void 0 ? void 0 : _c.enabled) {
                getFileAndAddContentFn = this.onCreateFileIfItDoesntExist;
            }
            else {
                log.logWarning(`The file ${filePath} does not exist and "Create file if it doesn't exist" is disabled.`);
                return;
            }
            const { file, content: newFileContent } = await getFileAndAddContentFn.bind(this)(filePath, content);
            if (this.choice.appendLink) {
                const markdownLink = this.app.fileManager.generateMarkdownLink(file, '');
                appendToCurrentLine(markdownLink, this.app);
            }
            if ((_d = this.choice) === null || _d === void 0 ? void 0 : _d.openFile) {
                await openFile(this.app, file, {
                    openInNewTab: this.choice.openFileInNewTab.enabled,
                    direction: this.choice.openFileInNewTab.direction,
                    focus: this.choice.openFileInNewTab.focus,
                    mode: this.choice.openFileInMode
                });
            }
            await this.app.vault.modify(file, newFileContent);
        }
        catch (e) {
            log.logMessage(e);
        }
    }
    async getCaptureContent() {
        let content;
        if (!this.choice.format.enabled)
            content = VALUE_SYNTAX;
        else
            content = this.choice.format.format;
        if (this.choice.task)
            content = `- [ ] ${content}\n`;
        return content;
    }
    async onFileExists(filePath, content) {
        const file = await this.getFileByPath(filePath);
        if (!file)
            return;
        const fileContent = await this.app.vault.read(file);
        const newFileContent = await this.formatter.formatContentWithFile(content, this.choice, fileContent, file);
        return { file, content: newFileContent };
    }
    async onCreateFileIfItDoesntExist(filePath, content) {
        let fileContent = "";
        if (this.choice.createFileIfItDoesntExist.createWithTemplate) {
            const singleTemplateEngine = new SingleTemplateEngine(this.app, this.plugin, this.choice.createFileIfItDoesntExist.template, this.choiceExecutor);
            fileContent = await singleTemplateEngine.run();
        }
        const file = await this.createFileWithInput(filePath, fileContent);
        await replaceTemplaterTemplatesInCreatedFile(this.app, file);
        const updatedFileContent = await this.app.vault.cachedRead(file);
        const newFileContent = await this.formatter.formatContentWithFile(content, this.choice, updatedFileContent, file);
        return { file, content: newFileContent };
    }
    async getFilePath(captureTo) {
        const formattedCaptureTo = await this.formatter.formatFileName(captureTo, this.choice.name);
        return this.formatFilePath("", formattedCaptureTo);
    }
    async captureToActiveFile() {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            log.logError("Cannot capture to active file - no active file.");
        }
        let content = await this.getCaptureContent();
        content = await this.formatter.formatContent(content, this.choice);
        if (this.choice.format.enabled) {
            content = await templaterParseTemplate(this.app, content, activeFile);
        }
        if (!content)
            return;
        if (this.choice.prepend) {
            const fileContent = await this.app.vault.cachedRead(activeFile);
            const newFileContent = `${fileContent}${content}`;
            await this.app.vault.modify(activeFile, newFileContent);
        }
        else {
            appendToCurrentLine(content, this.app);
        }
    }
}

class ChoiceSuggester extends obsidian.FuzzySuggestModal {
    constructor(plugin, choices, choiceExecutor) {
        super(plugin.app);
        this.plugin = plugin;
        this.choices = choices;
        this.choiceExecutor = new ChoiceExecutor(this.app, this.plugin);
        if (choiceExecutor)
            this.choiceExecutor = choiceExecutor;
    }
    static Open(plugin, choices, choiceExecutor) {
        new ChoiceSuggester(plugin, choices, choiceExecutor).open();
    }
    getItemText(item) {
        return item.name;
    }
    getItems() {
        return this.choices;
    }
    async onChooseItem(item, evt) {
        if (item.type === ChoiceType.Multi)
            this.onChooseMultiType(item);
        else
            await this.choiceExecutor.execute(item);
    }
    onChooseMultiType(multi) {
        const choices = [...multi.choices];
        if (multi.name != "← Back")
            choices.push(new MultiChoice("← Back").addChoices(this.choices));
        ChoiceSuggester.Open(this.plugin, choices);
    }
}

class ChoiceExecutor {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.variables = new Map();
    }
    async execute(choice) {
        switch (choice.type) {
            case ChoiceType.Template:
                const templateChoice = choice;
                await this.onChooseTemplateType(templateChoice);
                break;
            case ChoiceType.Capture:
                const captureChoice = choice;
                await this.onChooseCaptureType(captureChoice);
                break;
            case ChoiceType.Macro:
                const macroChoice = choice;
                await this.onChooseMacroType(macroChoice);
                break;
            case ChoiceType.Multi:
                const multiChoice = choice;
                await this.onChooseMultiType(multiChoice);
                break;
        }
    }
    async onChooseTemplateType(templateChoice) {
        if (!templateChoice.templatePath) {
            log.logError(`please provide a template path for ${templateChoice.name}`);
            return;
        }
        await new TemplateChoiceEngine(this.app, this.plugin, templateChoice, this).run();
    }
    async onChooseCaptureType(captureChoice) {
        if (!captureChoice.captureTo && !(captureChoice === null || captureChoice === void 0 ? void 0 : captureChoice.captureToActiveFile)) {
            log.logError(`please provide a capture path for ${captureChoice.name}`);
            return;
        }
        await new CaptureChoiceEngine(this.app, this.plugin, captureChoice, this).run();
    }
    async onChooseMacroType(macroChoice) {
        const macroEngine = await new MacroChoiceEngine(this.app, this.plugin, macroChoice, this.plugin.settings.macros, this, this.variables);
        await macroEngine.run();
        Object.keys(macroEngine.params.variables).forEach(key => {
            this.variables.set(key, macroEngine.params.variables[key]);
        });
    }
    async onChooseMultiType(multiChoice) {
        ChoiceSuggester.Open(this.plugin, multiChoice.choices, this);
    }
}

class QuickAdd extends obsidian.Plugin {
    async onload() {
        console.log('Loading QuickAdd');
        QuickAdd.instance = this;
        await this.loadSettings();
        this.addCommand({
            id: 'runQuickAdd',
            name: 'Run QuickAdd',
            callback: () => {
                ChoiceSuggester.Open(this, this.settings.choices);
            }
        });
        log.register(new ConsoleErrorLogger())
            .register(new GuiLogger(this));
        this.addSettingTab(new QuickAddSettingsTab(this.app, this));
        this.app.workspace.onLayoutReady(() => new StartupMacroEngine(this.app, this, this.settings.macros, new ChoiceExecutor(this.app, this)).run());
        this.addCommandsForChoices(this.settings.choices);
        await this.convertMacroChoicesMacroToId();
    }
    onunload() {
        console.log('Unloading QuickAdd');
    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
    addCommandsForChoices(choices) {
        choices.forEach(choice => this.addCommandForChoice(choice));
    }
    addCommandForChoice(choice) {
        if (choice.type === ChoiceType.Multi) {
            this.addCommandsForChoices(choice.choices);
        }
        if (choice.command) {
            this.addCommand({
                id: `choice:${choice.id}`,
                name: choice.name,
                callback: async () => {
                    await new ChoiceExecutor(this.app, this).execute(choice);
                }
            });
        }
    }
    getChoiceById(choiceId) {
        return this.getChoice("id", choiceId);
    }
    getChoiceByName(choiceName) {
        return this.getChoice("name", choiceName);
    }
    getChoice(by, targetPropertyValue) {
        let tempChoice;
        const findChoice = (choice) => {
            if (choice[by] === targetPropertyValue) {
                tempChoice = choice;
                return tempChoice;
            }
            if (choice.type === ChoiceType.Multi)
                choice.choices.forEach(findChoice);
        };
        this.settings.choices.forEach(findChoice);
        return tempChoice;
    }
    removeCommandForChoice(choice) {
        deleteObsidianCommand(this.app, `quickadd:choice:${choice.id}`);
    }
    // Did not make sense to have copies of macros in the choices when they are maintained for themselves.
    // Instead we reference by id now. Have to port this over for all users.
    async convertMacroChoicesMacroToId() {
        function convertMacroChoiceMacroToIdHelper(choice) {
            if (choice.type === ChoiceType.Multi) {
                let multiChoice = choice;
                const multiChoices = multiChoice.choices.map(convertMacroChoiceMacroToIdHelper);
                multiChoice = Object.assign(Object.assign({}, multiChoice), { choices: multiChoices });
                return multiChoice;
            }
            if (choice.type !== ChoiceType.Macro)
                return choice;
            const macroChoice = choice;
            if (macroChoice.macro) {
                macroChoice.macroId = macroChoice.macro.id;
                delete macroChoice.macro;
            }
            return macroChoice;
        }
        this.settings.choices = this.settings.choices.map(convertMacroChoiceMacroToIdHelper);
        await this.saveSettings();
    }
}

module.exports = QuickAdd;

'use strict';

var obsidian = require('obsidian');
var fs_1 = require('fs');
var path_1 = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs_1__default = /*#__PURE__*/_interopDefaultLegacy(fs_1);
var path_1__default = /*#__PURE__*/_interopDefaultLegacy(path_1);

var EditMode;
(function (EditMode) {
    EditMode["AllSingle"] = "All Single";
    EditMode["AllMulti"] = "All Multi";
    EditMode["SomeMulti"] = "Some Multi";
})(EditMode || (EditMode = {}));

function noop() { }
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
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
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
function set_style(node, key, value, important) {
    if (value === null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
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
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
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

var ProgressPropertyOptions;
(function (ProgressPropertyOptions) {
    ProgressPropertyOptions["TaskTotal"] = "Total Tasks";
    ProgressPropertyOptions["TaskComplete"] = "Completed Tasks";
    ProgressPropertyOptions["TaskIncomplete"] = "Incomplete Tasks";
})(ProgressPropertyOptions || (ProgressPropertyOptions = {}));

/* src/Modals/ProgressPropertiesSettingModal/ProgressPropertiesModalContent.svelte generated by Svelte v3.46.4 */

function add_css$3(target) {
	append_styles(target, "svelte-kqcr7b", ".buttonContainer.svelte-kqcr7b{display:flex;justify-content:center;margin-top:1rem}select.svelte-kqcr7b{border-radius:4px;width:100%;height:30px;border:1px solid #dbdbdc;color:#383a42;background-color:#fff;padding:3px}button.svelte-kqcr7b{margin-left:5px;margin-right:5px;font-size:15px}");
}

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	child_ctx[11] = list;
	child_ctx[12] = i;
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	return child_ctx;
}

// (32:24) {#each options as text}
function create_each_block_1$1(ctx) {
	let option;

	return {
		c() {
			option = element("option");
			option.__value = /*text*/ ctx[13];
			option.value = option.__value;
			attr(option, "label", /*text*/ ctx[13]);
		},
		m(target, anchor) {
			insert(target, option, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (25:8) {#each properties as property}
function create_each_block$3(ctx) {
	let tr;
	let td0;
	let input0;
	let t0;
	let td1;
	let select;
	let t1;
	let td2;
	let input1;
	let t2;
	let mounted;
	let dispose;

	function input0_input_handler() {
		/*input0_input_handler*/ ctx[5].call(input0, /*each_value*/ ctx[11], /*property_index*/ ctx[12]);
	}

	let each_value_1 = /*options*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
	}

	function select_change_handler() {
		/*select_change_handler*/ ctx[7].call(select, /*each_value*/ ctx[11], /*property_index*/ ctx[12]);
	}

	function click_handler() {
		return /*click_handler*/ ctx[9](/*property*/ ctx[10]);
	}

	return {
		c() {
			tr = element("tr");
			td0 = element("td");
			input0 = element("input");
			t0 = space();
			td1 = element("td");
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			td2 = element("td");
			input1 = element("input");
			t2 = space();
			attr(input0, "type", "text");
			attr(input0, "placeholder", "Property name");
			attr(select, "class", "svelte-kqcr7b");
			if (/*property*/ ctx[10].type === void 0) add_render_callback(select_change_handler);
			attr(input1, "type", "button");
			attr(input1, "class", "not-a-button");
			input1.value = "❌";
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, input0);
			set_input_value(input0, /*property*/ ctx[10].name);
			append(tr, t0);
			append(tr, td1);
			append(td1, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*property*/ ctx[10].type);
			append(tr, t1);
			append(tr, td2);
			append(td2, input1);
			append(tr, t2);

			if (!mounted) {
				dispose = [
					listen(input0, "input", input0_input_handler),
					listen(input0, "change", /*change_handler*/ ctx[6]),
					listen(select, "change", select_change_handler),
					listen(select, "change", /*change_handler_1*/ ctx[8]),
					listen(input1, "click", click_handler)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*properties, options*/ 5 && input0.value !== /*property*/ ctx[10].name) {
				set_input_value(input0, /*property*/ ctx[10].name);
			}

			if (dirty & /*options*/ 4) {
				each_value_1 = /*options*/ ctx[2];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}

			if (dirty & /*properties, options*/ 5) {
				select_option(select, /*property*/ ctx[10].type);
			}
		},
		d(detaching) {
			if (detaching) detach(tr);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$4(ctx) {
	let div1;
	let table;
	let thead;
	let t3;
	let t4;
	let div0;
	let button;
	let mounted;
	let dispose;
	let each_value = /*properties*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	return {
		c() {
			div1 = element("div");
			table = element("table");
			thead = element("thead");

			thead.innerHTML = `<tr><th>Name</th> 
                <th>Type</th></tr>`;

			t3 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t4 = space();
			div0 = element("div");
			button = element("button");
			button.textContent = "Add";
			set_style(table, "width", "100%");
			attr(button, "class", "mod-cta svelte-kqcr7b");
			attr(div0, "class", "buttonContainer svelte-kqcr7b");
			attr(div1, "class", "centerSettingContent");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, table);
			append(table, thead);
			append(table, t3);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}

			append(div1, t4);
			append(div1, div0);
			append(div0, button);

			if (!mounted) {
				dispose = listen(button, "click", /*addNewProperty*/ ctx[3]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*removeProperty, properties, save, options*/ 23) {
				each_value = /*properties*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(table, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div1);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	const options = Object.keys(ProgressPropertyOptions).map(k => ProgressPropertyOptions[k]);
	let { save } = $$props;
	let { properties } = $$props;

	function addNewProperty() {
		let newProp = {
			name: "",
			type: ProgressPropertyOptions.TaskTotal
		};

		$$invalidate(0, properties = [...properties, newProp]);
		save(properties);
	}

	function removeProperty(property) {
		$$invalidate(0, properties = properties.filter(prop => prop !== property));
		save(properties);
	}

	function input0_input_handler(each_value, property_index) {
		each_value[property_index].name = this.value;
		$$invalidate(0, properties);
		$$invalidate(2, options);
	}

	const change_handler = () => save(properties);

	function select_change_handler(each_value, property_index) {
		each_value[property_index].type = select_value(this);
		$$invalidate(0, properties);
		$$invalidate(2, options);
	}

	const change_handler_1 = () => save(properties);
	const click_handler = property => removeProperty(property);

	$$self.$$set = $$props => {
		if ('save' in $$props) $$invalidate(1, save = $$props.save);
		if ('properties' in $$props) $$invalidate(0, properties = $$props.properties);
	};

	return [
		properties,
		save,
		options,
		addNewProperty,
		removeProperty,
		input0_input_handler,
		change_handler,
		select_change_handler,
		change_handler_1,
		click_handler
	];
}

class ProgressPropertiesModalContent extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { save: 1, properties: 0 }, add_css$3);
	}
}

/* src/Modals/AutoPropertiesSettingModal/AutoPropertiesModalContent.svelte generated by Svelte v3.46.4 */

function add_css$2(target) {
	append_styles(target, "svelte-kqcr7b", ".buttonContainer.svelte-kqcr7b{display:flex;justify-content:center;margin-top:1rem}button.svelte-kqcr7b{margin-left:5px;margin-right:5px;font-size:15px}");
}

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	child_ctx[14] = list;
	child_ctx[15] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i];
	child_ctx[17] = list;
	child_ctx[18] = i;
	return child_ctx;
}

// (49:20) {#each property.choices as choice, i}
function create_each_block_1(ctx) {
	let div;
	let input0;
	let t0;
	let input1;
	let t1;
	let mounted;
	let dispose;

	function input0_input_handler() {
		/*input0_input_handler*/ ctx[10].call(input0, /*each_value_1*/ ctx[17], /*i*/ ctx[18]);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[11](/*property*/ ctx[13], /*i*/ ctx[18]);
	}

	return {
		c() {
			div = element("div");
			input0 = element("input");
			t0 = space();
			input1 = element("input");
			t1 = space();
			attr(input0, "type", "text");
			attr(input1, "class", "not-a-button");
			attr(input1, "type", "button");
			input1.value = "❌";
			set_style(div, "display", "block");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, input0);
			set_input_value(input0, /*choice*/ ctx[16]);
			append(div, t0);
			append(div, input1);
			append(div, t1);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*change_handler_1*/ ctx[9]),
					listen(input0, "input", input0_input_handler),
					listen(input1, "click", click_handler_1)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*autoProperties*/ 1 && input0.value !== /*choice*/ ctx[16]) {
				set_input_value(input0, /*choice*/ ctx[16]);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (40:8) {#each autoProperties as property}
function create_each_block$2(ctx) {
	let tr;
	let td0;
	let input0;
	let t0;
	let td1;
	let input1;
	let t1;
	let td2;
	let t2;
	let td3;
	let div;
	let input2;
	let t3;
	let br;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[6](/*property*/ ctx[13]);
	}

	function input1_input_handler() {
		/*input1_input_handler*/ ctx[8].call(input1, /*each_value*/ ctx[14], /*property_index*/ ctx[15]);
	}

	let each_value_1 = /*property*/ ctx[13].choices;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	function click_handler_2() {
		return /*click_handler_2*/ ctx[12](/*property*/ ctx[13]);
	}

	return {
		c() {
			tr = element("tr");
			td0 = element("td");
			input0 = element("input");
			t0 = space();
			td1 = element("td");
			input1 = element("input");
			t1 = space();
			td2 = element("td");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			td3 = element("td");
			div = element("div");
			input2 = element("input");
			t3 = space();
			br = element("br");
			attr(input0, "type", "button");
			input0.value = "❌";
			attr(input0, "class", "not-a-button");
			attr(input1, "type", "text");
			attr(input1, "placeholder", "Property name");
			attr(input2, "class", "not-a-button");
			attr(input2, "type", "button");
			input2.value = "➕";
			set_style(div, "width", "50%");
			set_style(div, "text-align", "center");
			set_style(div, "margin", "5px auto auto");
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, input0);
			append(tr, t0);
			append(tr, td1);
			append(td1, input1);
			set_input_value(input1, /*property*/ ctx[13].name);
			append(tr, t1);
			append(tr, td2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(td2, null);
			}

			append(tr, t2);
			append(tr, td3);
			append(td3, div);
			append(div, input2);
			insert(target, t3, anchor);
			insert(target, br, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "click", click_handler),
					listen(input1, "change", /*change_handler*/ ctx[7]),
					listen(input1, "input", input1_input_handler),
					listen(input2, "click", click_handler_2)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*autoProperties*/ 1 && input1.value !== /*property*/ ctx[13].name) {
				set_input_value(input1, /*property*/ ctx[13].name);
			}

			if (dirty & /*removeChoice, autoProperties, save*/ 19) {
				each_value_1 = /*property*/ ctx[13].choices;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(td2, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			if (detaching) detach(tr);
			destroy_each(each_blocks, detaching);
			if (detaching) detach(t3);
			if (detaching) detach(br);
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$3(ctx) {
	let div1;
	let table;
	let thead;
	let t4;
	let t5;
	let div0;
	let button;
	let mounted;
	let dispose;
	let each_value = /*autoProperties*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	return {
		c() {
			div1 = element("div");
			table = element("table");
			thead = element("thead");

			thead.innerHTML = `<tr><th></th> 
            <th>Name</th> 
            <th>Values</th></tr>`;

			t4 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div0 = element("div");
			button = element("button");
			button.textContent = "Add";
			attr(button, "class", "mod-cta svelte-kqcr7b");
			attr(div0, "class", "buttonContainer svelte-kqcr7b");
			attr(div1, "class", "centerSettingContent");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, table);
			append(table, thead);
			append(table, t4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}

			append(div1, t5);
			append(div1, div0);
			append(div0, button);

			if (!mounted) {
				dispose = listen(button, "click", /*addNewProperty*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*addChoice, autoProperties, removeChoice, save, removeProperty*/ 59) {
				each_value = /*autoProperties*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(table, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div1);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { save } = $$props;
	let { autoProperties = [] } = $$props;

	function addNewProperty() {
		let newProp = { name: "", choices: [""] };
		if (typeof autoProperties[Symbol.iterator] !== 'function') $$invalidate(0, autoProperties = [newProp]); else $$invalidate(0, autoProperties = [...autoProperties, newProp]);
		save(autoProperties);
	}

	function removeProperty(property) {
		$$invalidate(0, autoProperties = autoProperties.filter(ac => ac !== property));
		save(autoProperties);
	}

	function removeChoice(property, i) {
		property.choices.splice(i, 1);
		$$invalidate(0, autoProperties); // Svelte
		save(autoProperties);
	}

	function addChoice(property) {
		$$invalidate(0, autoProperties = autoProperties.map(prop => {
			if (prop === property) {
				prop.choices.push("");
			}

			return prop;
		}));

		save(autoProperties);
	}

	const click_handler = property => removeProperty(property);
	const change_handler = () => save(autoProperties);

	function input1_input_handler(each_value, property_index) {
		each_value[property_index].name = this.value;
		$$invalidate(0, autoProperties);
	}

	const change_handler_1 = () => save(autoProperties);

	function input0_input_handler(each_value_1, i) {
		each_value_1[i] = this.value;
		$$invalidate(0, autoProperties);
	}

	const click_handler_1 = (property, i) => removeChoice(property, i);
	const click_handler_2 = property => addChoice(property);

	$$self.$$set = $$props => {
		if ('save' in $$props) $$invalidate(1, save = $$props.save);
		if ('autoProperties' in $$props) $$invalidate(0, autoProperties = $$props.autoProperties);
	};

	return [
		autoProperties,
		save,
		addNewProperty,
		removeProperty,
		removeChoice,
		addChoice,
		click_handler,
		change_handler,
		input1_input_handler,
		change_handler_1,
		input0_input_handler,
		click_handler_1,
		click_handler_2
	];
}

class AutoPropertiesModalContent extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { save: 1, autoProperties: 0 }, add_css$2);
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

function getComputedStyle(element) {
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
  getComputedStyle(element).position === 'fixed') {
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
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
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

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
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

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
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
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || '';

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

  if (getComputedStyle(body || html).direction === 'rtl') {
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
  var _getComputedStyle = getComputedStyle(element),
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
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
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

function format(str) {
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
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

          break;

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
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
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
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

          var _getComputedStyle = getComputedStyle(popper),
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

// Sam stole all this from Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
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
        this.popper.destroy();
        this.suggestEl.detach();
    }
}

class KanbanHelperSettingSuggester extends TextInputSuggest {
    constructor(app, inputEl, boards) {
        super(app, inputEl);
        this.app = app;
        this.inputEl = inputEl;
        this.boards = boards;
    }
    getSuggestions(inputStr) {
        const inputLowerCase = inputStr.toLowerCase();
        return this.boards.map(board => {
            if (board.basename.toLowerCase().contains(inputLowerCase))
                return board;
        });
    }
    selectSuggestion(item) {
        this.inputEl.value = item.basename;
        this.inputEl.trigger("input");
        this.close();
    }
    renderSuggestion(value, el) {
        if (value)
            el.setText(value.basename);
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

/* src/Modals/KanbanHelperSetting/KanbanHelperSettingContent.svelte generated by Svelte v3.46.4 */

function add_css$1(target) {
	append_styles(target, "svelte-kqcr7b", ".buttonContainer.svelte-kqcr7b{display:flex;justify-content:center;margin-top:1rem}button.svelte-kqcr7b{margin-left:5px;margin-right:5px;font-size:15px}");
}

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	child_ctx[16] = list;
	child_ctx[17] = i;
	return child_ctx;
}

// (55:8) {#each kanbanProperties as kanbanProperty, i}
function create_each_block$1(ctx) {
	let tr;
	let td0;
	let input0;
	let t0;
	let td1;
	let t1_value = /*kanbanProperty*/ ctx[15].boardName + "";
	let t1;
	let t2;
	let td2;
	let input1;
	let t3;
	let td3;
	let t4_value = /*getHeadingsInBoard*/ ctx[6](/*kanbanProperty*/ ctx[15].boardName) + "";
	let t4;
	let t5;
	let br;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[9](/*i*/ ctx[17]);
	}

	function input1_input_handler() {
		/*input1_input_handler*/ ctx[11].call(input1, /*each_value*/ ctx[16], /*i*/ ctx[17]);
	}

	return {
		c() {
			tr = element("tr");
			td0 = element("td");
			input0 = element("input");
			t0 = space();
			td1 = element("td");
			t1 = text(t1_value);
			t2 = space();
			td2 = element("td");
			input1 = element("input");
			t3 = space();
			td3 = element("td");
			t4 = text(t4_value);
			t5 = space();
			br = element("br");
			attr(input0, "type", "button");
			input0.value = "❌";
			attr(input0, "class", "not-a-button");
			attr(input1, "type", "text");
			attr(input1, "placeholder", "Property name");
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, input0);
			append(tr, t0);
			append(tr, td1);
			append(td1, t1);
			append(tr, t2);
			append(tr, td2);
			append(td2, input1);
			set_input_value(input1, /*kanbanProperty*/ ctx[15].property);
			append(tr, t3);
			append(tr, td3);
			append(td3, t4);
			insert(target, t5, anchor);
			insert(target, br, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "click", click_handler),
					listen(input1, "change", /*change_handler*/ ctx[10]),
					listen(input1, "input", input1_input_handler)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*kanbanProperties*/ 1 && t1_value !== (t1_value = /*kanbanProperty*/ ctx[15].boardName + "")) set_data(t1, t1_value);

			if (dirty & /*kanbanProperties*/ 1 && input1.value !== /*kanbanProperty*/ ctx[15].property) {
				set_input_value(input1, /*kanbanProperty*/ ctx[15].property);
			}

			if (dirty & /*kanbanProperties*/ 1 && t4_value !== (t4_value = /*getHeadingsInBoard*/ ctx[6](/*kanbanProperty*/ ctx[15].boardName) + "")) set_data(t4, t4_value);
		},
		d(detaching) {
			if (detaching) detach(tr);
			if (detaching) detach(t5);
			if (detaching) detach(br);
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$2(ctx) {
	let div1;
	let table;
	let thead;
	let t6;
	let t7;
	let input;
	let t8;
	let div0;
	let button;
	let mounted;
	let dispose;
	let each_value = /*kanbanProperties*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			div1 = element("div");
			table = element("table");
			thead = element("thead");

			thead.innerHTML = `<tr><th></th> 
            <th>Board</th> 
            <th>Property in link</th> 
            <th>Possible values</th></tr>`;

			t6 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t7 = space();
			input = element("input");
			t8 = space();
			div0 = element("div");
			button = element("button");
			button.textContent = "Add";
			set_style(table, "width", "100%");
			attr(input, "type", "text");
			attr(button, "class", "mod-cta svelte-kqcr7b");
			attr(div0, "class", "buttonContainer svelte-kqcr7b");
			attr(div1, "class", "centerSettingContent");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, table);
			append(table, thead);
			append(table, t6);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}

			append(div1, t7);
			append(div1, input);
			/*input_binding*/ ctx[12](input);
			set_input_value(input, /*inputValue*/ ctx[3]);
			append(div1, t8);
			append(div1, div0);
			append(div0, button);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[13]),
					listen(button, "click", /*addNewProperty*/ ctx[4])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*getHeadingsInBoard, kanbanProperties, save, removeProperty*/ 99) {
				each_value = /*kanbanProperties*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(table, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*inputValue*/ 8 && input.value !== /*inputValue*/ ctx[3]) {
				set_input_value(input, /*inputValue*/ ctx[3]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div1);
			destroy_each(each_blocks, detaching);
			/*input_binding*/ ctx[12](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { save } = $$props;
	let { kanbanProperties = [] } = $$props;
	let { boards } = $$props;
	let { app } = $$props;
	let suggestEl;
	let inputValue;

	onMount(() => {
		new KanbanHelperSettingSuggester(app, suggestEl, boards);
	});

	function addNewProperty() {
		const board = boards.find(board => board.basename === inputValue);
		const exists = !!kanbanProperties.find(kp => kp.boardName === board.basename);
		if (!board || exists) return;
		kanbanProperties.push({ property: "", boardName: board.basename });
		$$invalidate(0, kanbanProperties); // Svelte
		save(kanbanProperties);
	}

	function removeProperty(i) {
		kanbanProperties.splice(i, 1);
		$$invalidate(0, kanbanProperties); // Svelte
		save(kanbanProperties);
	}

	function getHeadingsInBoard(boardName) {
		const file = boards.find(board => board.basename === boardName);

		if (!file) {
			log.logWarning(`file ${boardName} not found.`);
			return "FILE NOT FOUND";
		}

		const headings = app.metadataCache.getFileCache(file).headings;
		if (!headings) return "";
		return headings.map(heading => heading.heading).join(", ");
	}

	const click_handler = i => removeProperty(i);
	const change_handler = () => save(kanbanProperties);

	function input1_input_handler(each_value, i) {
		each_value[i].property = this.value;
		$$invalidate(0, kanbanProperties);
	}

	function input_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			suggestEl = $$value;
			$$invalidate(2, suggestEl);
		});
	}

	function input_input_handler() {
		inputValue = this.value;
		$$invalidate(3, inputValue);
	}

	$$self.$$set = $$props => {
		if ('save' in $$props) $$invalidate(1, save = $$props.save);
		if ('kanbanProperties' in $$props) $$invalidate(0, kanbanProperties = $$props.kanbanProperties);
		if ('boards' in $$props) $$invalidate(7, boards = $$props.boards);
		if ('app' in $$props) $$invalidate(8, app = $$props.app);
	};

	return [
		kanbanProperties,
		save,
		suggestEl,
		inputValue,
		addNewProperty,
		removeProperty,
		getHeadingsInBoard,
		boards,
		app,
		click_handler,
		change_handler,
		input1_input_handler,
		input_binding,
		input_input_handler
	];
}

class KanbanHelperSettingContent extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$2,
			create_fragment$2,
			safe_not_equal,
			{
				save: 1,
				kanbanProperties: 0,
				boards: 7,
				app: 8
			},
			add_css$1
		);
	}
}

/* src/Modals/shared/SingleValueTableEditorContent.svelte generated by Svelte v3.46.4 */

function add_css(target) {
	append_styles(target, "svelte-kqcr7b", ".buttonContainer.svelte-kqcr7b{display:flex;justify-content:center;margin-top:1rem}button.svelte-kqcr7b{margin-left:5px;margin-right:5px;font-size:15px}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	child_ctx[8] = list;
	child_ctx[9] = i;
	return child_ctx;
}

// (23:8) {#each properties as property, i}
function create_each_block(ctx) {
	let tr;
	let td0;
	let input0;
	let t0;
	let td1;
	let input1;
	let t1;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[4](/*i*/ ctx[9]);
	}

	function input1_input_handler() {
		/*input1_input_handler*/ ctx[6].call(input1, /*each_value*/ ctx[8], /*i*/ ctx[9]);
	}

	return {
		c() {
			tr = element("tr");
			td0 = element("td");
			input0 = element("input");
			t0 = space();
			td1 = element("td");
			input1 = element("input");
			t1 = space();
			attr(input0, "type", "button");
			input0.value = "❌";
			attr(input0, "class", "not-a-button");
			set_style(input1, "width", "100%");
			attr(input1, "type", "text");
			attr(input1, "placeholder", "Property name");
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, input0);
			append(tr, t0);
			append(tr, td1);
			append(td1, input1);
			set_input_value(input1, /*property*/ ctx[7]);
			append(tr, t1);

			if (!mounted) {
				dispose = [
					listen(input0, "click", click_handler),
					listen(input1, "change", /*change_handler*/ ctx[5]),
					listen(input1, "input", input1_input_handler)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*properties*/ 1 && input1.value !== /*property*/ ctx[7]) {
				set_input_value(input1, /*property*/ ctx[7]);
			}
		},
		d(detaching) {
			if (detaching) detach(tr);
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$1(ctx) {
	let div1;
	let table;
	let thead;
	let t2;
	let t3;
	let div0;
	let button;
	let mounted;
	let dispose;
	let each_value = /*properties*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div1 = element("div");
			table = element("table");
			thead = element("thead");

			thead.innerHTML = `<tr><th></th> 
            <th>Property</th></tr>`;

			t2 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t3 = space();
			div0 = element("div");
			button = element("button");
			button.textContent = "Add";
			set_style(table, "width", "100%");
			attr(button, "class", "mod-cta svelte-kqcr7b");
			attr(div0, "class", "buttonContainer svelte-kqcr7b");
			attr(div1, "class", "centerSettingContent");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, table);
			append(table, thead);
			append(table, t2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}

			append(div1, t3);
			append(div1, div0);
			append(div0, button);

			if (!mounted) {
				dispose = listen(button, "click", /*addNewProperty*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*properties, save, removeProperty*/ 11) {
				each_value = /*properties*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(table, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div1);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { save } = $$props;
	let { properties = [] } = $$props;

	function addNewProperty() {
		properties.push("");
		$$invalidate(0, properties); // Svelte
		save(properties);
	}

	function removeProperty(i) {
		properties.splice(i, 1);
		$$invalidate(0, properties); // Svelte
		save(properties);
	}

	const click_handler = i => removeProperty(i);
	const change_handler = async () => save(properties);

	function input1_input_handler(each_value, i) {
		each_value[i] = this.value;
		$$invalidate(0, properties);
	}

	$$self.$$set = $$props => {
		if ('save' in $$props) $$invalidate(1, save = $$props.save);
		if ('properties' in $$props) $$invalidate(0, properties = $$props.properties);
	};

	return [
		properties,
		save,
		addNewProperty,
		removeProperty,
		click_handler,
		change_handler,
		input1_input_handler
	];
}

class SingleValueTableEditorContent extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { save: 1, properties: 0 }, add_css);
	}
}

function toggleHiddenEl(el, bShow) {
    if (el && !bShow) {
        el.style.display = "none";
        return true;
    }
    else if (el && bShow) {
        el.style.display = "block";
        return false;
    }
    return bShow;
}
class MetaEditSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.svelteElements = [];
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'MetaEdit Settings' });
        this.addProgressPropertiesSetting(containerEl);
        this.addAutoPropertiesSetting(containerEl);
        this.addIgnorePropertiesSetting(containerEl);
        this.addEditModeSetting(containerEl);
        this.addKanbanHelperSetting(containerEl);
        this.addUIElementsSetting(containerEl);
    }
    addProgressPropertiesSetting(containerEl) {
        let modal, div, hidden = true;
        const setting = new obsidian.Setting(containerEl)
            .setName("Progress Properties")
            .setDesc("Update properties automatically.")
            .addToggle(toggle => {
            toggle
                .setTooltip("Toggle Progress Properties")
                .setValue(this.plugin.settings.ProgressProperties.enabled)
                .onChange(async (value) => {
                if (value === this.plugin.settings.ProgressProperties.enabled)
                    return;
                this.plugin.settings.ProgressProperties.enabled = value;
                this.plugin.toggleAutomators();
                await this.plugin.saveSettings();
            });
        })
            .addExtraButton(button => button.onClick(() => hidden = toggleHiddenEl(div, hidden)));
        div = setting.settingEl.createDiv();
        setting.settingEl.style.display = "block";
        div.style.display = "none";
        modal = new ProgressPropertiesModalContent({
            target: div,
            props: {
                properties: this.plugin.settings.ProgressProperties.properties,
                save: async (progressProperties) => {
                    this.plugin.settings.ProgressProperties.properties = progressProperties;
                    await this.plugin.saveSettings();
                }
            },
        });
        this.svelteElements.push(modal);
    }
    addAutoPropertiesSetting(containerEl) {
        let modal, div, hidden = true;
        const setting = new obsidian.Setting(containerEl)
            .setName("Auto Properties")
            .setDesc("Quick switch for values you know the value of.")
            .addToggle(toggle => {
            toggle
                .setTooltip("Toggle Auto Properties")
                .setValue(this.plugin.settings.AutoProperties.enabled)
                .onChange(async (value) => {
                if (value === this.plugin.settings.AutoProperties.enabled)
                    return;
                this.plugin.settings.AutoProperties.enabled = value;
                await this.plugin.saveSettings();
            });
        })
            .addExtraButton(b => b.onClick(() => hidden = toggleHiddenEl(div, hidden)));
        div = setting.settingEl.createDiv();
        setting.settingEl.style.display = "block";
        div.style.display = "none";
        modal = new AutoPropertiesModalContent({
            target: div,
            props: {
                autoProperties: this.plugin.settings.AutoProperties.properties,
                save: async (autoProperties) => {
                    this.plugin.settings.AutoProperties.properties = autoProperties;
                    await this.plugin.saveSettings();
                }
            },
        });
        this.svelteElements.push(modal);
    }
    addIgnorePropertiesSetting(containerEl) {
        let modal, div, hidden = true;
        const setting = new obsidian.Setting(containerEl)
            .setName("Ignore Properties")
            .setDesc("Hide these properties from the menu.")
            .addToggle(toggle => {
            toggle
                .setTooltip("Toggle Ignored Properties")
                .setValue(this.plugin.settings.IgnoredProperties.enabled)
                .onChange(async (value) => {
                if (value === this.plugin.settings.IgnoredProperties.enabled)
                    return;
                this.plugin.settings.IgnoredProperties.enabled = value;
                await this.plugin.saveSettings();
                this.display();
            });
        }).addExtraButton(b => b.onClick(() => hidden = toggleHiddenEl(div, hidden)));
        if (this.plugin.settings.IgnoredProperties.enabled) {
            div = setting.settingEl.createDiv();
            setting.settingEl.style.display = "block";
            div.style.display = "none";
            modal = new SingleValueTableEditorContent({
                target: div,
                props: {
                    properties: this.plugin.settings.IgnoredProperties.properties,
                    save: async (ignoredProperties) => {
                        this.plugin.settings.IgnoredProperties.properties = ignoredProperties;
                        await this.plugin.saveSettings();
                    }
                },
            });
            this.svelteElements.push(modal);
        }
    }
    addEditModeSetting(containerEl) {
        let modal, div, bDivToggle = true, extraButtonEl;
        // For linebreaks
        const df = new DocumentFragment();
        df.createEl('p', { text: "Single: property values are just one value. " });
        df.createEl('p', { text: "Multi: properties are arrays. " });
        df.createEl('p', { text: "Some Multi: all options are single, except those specified in the settings (click button)." });
        const setting = new obsidian.Setting(containerEl)
            .setName("Edit Mode")
            .setDesc(df)
            .addDropdown(dropdown => {
            dropdown
                .addOption(EditMode.AllSingle, EditMode.AllSingle)
                .addOption(EditMode.AllMulti, EditMode.AllMulti)
                .addOption(EditMode.SomeMulti, EditMode.SomeMulti)
                .setValue(this.plugin.settings.EditMode.mode)
                .onChange(async (value) => {
                switch (value) {
                    case EditMode.AllMulti:
                        this.plugin.settings.EditMode.mode = EditMode.AllMulti;
                        toggleHiddenEl(extraButtonEl, false);
                        bDivToggle = toggleHiddenEl(div, false);
                        break;
                    case EditMode.AllSingle:
                        this.plugin.settings.EditMode.mode = EditMode.AllSingle;
                        toggleHiddenEl(extraButtonEl, false);
                        bDivToggle = toggleHiddenEl(div, false);
                        break;
                    case EditMode.SomeMulti:
                        this.plugin.settings.EditMode.mode = EditMode.SomeMulti;
                        toggleHiddenEl(extraButtonEl, true);
                        break;
                }
                await this.plugin.saveSettings();
            });
        })
            .addExtraButton(b => {
            extraButtonEl = b.extraSettingsEl;
            b.setTooltip("Configure which properties are Multi.");
            return b.onClick(() => bDivToggle = toggleHiddenEl(div, bDivToggle));
        });
        if (this.plugin.settings.EditMode.mode != EditMode.SomeMulti) {
            toggleHiddenEl(extraButtonEl, false);
        }
        div = setting.settingEl.createDiv();
        setting.settingEl.style.display = "block";
        div.style.display = "none";
        modal = new SingleValueTableEditorContent({
            target: div,
            props: {
                properties: this.plugin.settings.EditMode.properties,
                save: async (properties) => {
                    this.plugin.settings.EditMode.properties = properties;
                    await this.plugin.saveSettings();
                }
            },
        });
        this.svelteElements.push(modal);
    }
    hide() {
        this.svelteElements.forEach(el => el.$destroy());
        return super.hide();
    }
    addKanbanHelperSetting(containerEl) {
        let modal, div, hidden = true;
        const setting = new obsidian.Setting(containerEl)
            .setName("Kanban Board Helper")
            .setDesc("Update properties in links in kanban boards automatically when a card is moved to a new lane.")
            .addToggle(toggle => {
            toggle
                .setTooltip("Toggle Kanban Helper")
                .setValue(this.plugin.settings.KanbanHelper.enabled)
                .onChange(async (value) => {
                if (value === this.plugin.settings.KanbanHelper.enabled)
                    return;
                this.plugin.settings.KanbanHelper.enabled = value;
                this.plugin.toggleAutomators();
                await this.plugin.saveSettings();
            });
        })
            .addExtraButton(button => button.onClick(() => hidden = toggleHiddenEl(div, hidden)));
        div = setting.settingEl.createDiv();
        setting.settingEl.style.display = "block";
        div.style.display = "none";
        modal = new KanbanHelperSettingContent({
            target: div,
            props: {
                kanbanProperties: this.plugin.settings.KanbanHelper.boards,
                boards: this.plugin.getFilesWithProperty("kanban-plugin"),
                app: this.app,
                save: async (kanbanProperties) => {
                    this.plugin.settings.KanbanHelper.boards = kanbanProperties;
                    await this.plugin.saveSettings();
                }
            },
        });
        this.svelteElements.push(modal);
    }
    addUIElementsSetting(containerEl) {
        new obsidian.Setting(containerEl)
            .setName("UI Elements")
            .setDesc("Toggle UI elements: the 'Edit Meta' right-click menu option.")
            .addToggle(toggle => {
            toggle
                .setTooltip("Toggle UI elements")
                .setValue(this.plugin.settings.UIElements.enabled)
                .onChange(async (value) => {
                if (value === this.plugin.settings.UIElements.enabled)
                    return;
                this.plugin.settings.UIElements.enabled = value;
                value ? this.plugin.linkMenu.registerEvent() : this.plugin.linkMenu.unregisterEvent();
                await this.plugin.saveSettings();
            });
        });
    }
}

var MetaType;
(function (MetaType) {
    MetaType[MetaType["YAML"] = 0] = "YAML";
    MetaType[MetaType["Dataview"] = 1] = "Dataview";
    MetaType[MetaType["Tag"] = 2] = "Tag";
    MetaType[MetaType["Option"] = 3] = "Option";
})(MetaType || (MetaType = {}));

const ADD_FIRST_ELEMENT = "cmd:addfirst";
const ADD_TO_BEGINNING = "cmd:beg";
const ADD_TO_END = "cmd:end";
const newDataView = "New Dataview field";
const newYaml = "New YAML property";
const MAIN_SUGGESTER_OPTIONS = [
    { key: newYaml, content: newYaml, type: MetaType.Option },
    { key: newDataView, content: newDataView, type: MetaType.Option }
];

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

function commonjsRequire (path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var utils = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JAVASCRIPT_RESERVED_KEYWORD_SET = exports.setProp = exports.findUp = exports.isValidLocalPath = exports.hasDepInstalled = exports.getIncludePaths = exports.concat = exports.importAny = void 0;


async function importAny(...modules) {
    try {
        const mod = await modules.reduce((acc, moduleName) => acc.catch(() => Promise.resolve().then(() => __importStar(commonjsRequire(moduleName)))), Promise.reject());
        return mod;
    }
    catch (e) {
        throw new Error(`Cannot find any of modules: ${modules}\n\n${e}`);
    }
}
exports.importAny = importAny;
function concat(...arrs) {
    return arrs.reduce((acc, a) => {
        if (a) {
            return acc.concat(a);
        }
        return acc;
    }, []);
}
exports.concat = concat;
/** Paths used by preprocessors to resolve @imports */
function getIncludePaths(fromFilename, base = []) {
    if (fromFilename == null)
        return [];
    return [
        ...new Set([...base, 'node_modules', process.cwd(), (0, path_1__default["default"].dirname)(fromFilename)]),
    ];
}
exports.getIncludePaths = getIncludePaths;
const depCheckCache = {};
/**
 * Checks if a package is installed.
 *
 * @export
 * @param {string} dep
 * @returns boolean
 */
async function hasDepInstalled(dep) {
    if (depCheckCache[dep] != null) {
        return depCheckCache[dep];
    }
    let result = false;
    try {
        await Promise.resolve().then(() => __importStar(commonjsRequire(dep)));
        result = true;
    }
    catch (e) {
        result = false;
    }
    return (depCheckCache[dep] = result);
}
exports.hasDepInstalled = hasDepInstalled;
const REMOTE_SRC_PATTERN = /^(https?:)?\/\//;
function isValidLocalPath(path) {
    return (path.match(REMOTE_SRC_PATTERN) == null &&
        // only literal strings allowed
        !path.startsWith('{') &&
        !path.endsWith('}'));
}
exports.isValidLocalPath = isValidLocalPath;
// finds a existing path up the tree
function findUp({ what, from }) {
    const { root, dir } = (0, path_1__default["default"].parse)(from);
    let cur = dir;
    try {
        while (cur !== root) {
            const possiblePath = (0, path_1__default["default"].join)(cur, what);
            if ((0, fs_1__default["default"].existsSync)(possiblePath)) {
                return possiblePath;
            }
            cur = (0, path_1__default["default"].dirname)(cur);
        }
    }
    catch (e) {
        console.error(e);
    }
    return null;
}
exports.findUp = findUp;
// set deep property in object
function setProp(obj, keyList, value) {
    let i = 0;
    for (; i < keyList.length - 1; i++) {
        const key = keyList[i];
        if (typeof obj[key] !== 'object') {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keyList[i]] = value;
}
exports.setProp = setProp;
exports.JAVASCRIPT_RESERVED_KEYWORD_SET = new Set([
    'arguments',
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'eval',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'interface',
    'let',
    'new',
    'null',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'static',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
]);
});

class MetaEditSuggester extends obsidian.FuzzySuggestModal {
    constructor(app, plugin, data, file, controller) {
        super(app);
        this.file = file;
        this.app = app;
        this.plugin = plugin;
        this.data = this.removeIgnored(data);
        this.controller = controller;
        this.options = MAIN_SUGGESTER_OPTIONS;
        this.setSuggestValues();
        this.setInstructions([
            { command: "❌", purpose: "Delete property" },
            { command: "🔃", purpose: "Transform to YAML/Dataview" }
        ]);
    }
    renderSuggestion(item, el) {
        super.renderSuggestion(item, el);
        if (Object.values(this.options).find(v => v === item.item)) {
            el.style.fontWeight = "bold";
        }
        else {
            this.createButton(el, "❌", this.deleteItem(item));
            this.createButton(el, "🔃", this.transformProperty(item));
        }
    }
    getItemText(item) {
        return item.key;
    }
    getItems() {
        return utils.concat(this.options, this.data);
    }
    async onChooseItem(item, evt) {
        if (item.content === newYaml) {
            const newProperty = await this.controller.createNewProperty(this.suggestValues);
            if (!newProperty)
                return null;
            const { propName, propValue } = newProperty;
            await this.controller.addYamlProp(propName, propValue, this.file);
            return;
        }
        if (item.content === newDataView) {
            const newProperty = await this.controller.createNewProperty(this.suggestValues);
            if (!newProperty)
                return null;
            const { propName, propValue } = newProperty;
            await this.controller.addDataviewField(propName, propValue, this.file);
            return;
        }
        await this.controller.editMetaElement(item, this.data, this.file);
    }
    deleteItem(item) {
        return async (evt) => {
            evt.stopPropagation();
            await this.controller.deleteProperty(item.item, this.file);
            this.close();
        };
    }
    transformProperty(item) {
        return async (evt) => {
            evt.stopPropagation();
            const { item: property } = item;
            if (property.type === MetaType.YAML) {
                await this.toDataview(property);
            }
            else {
                await this.toYaml(property);
            }
            this.close();
        };
    }
    async toYaml(property) {
        await this.controller.deleteProperty(property, this.file);
        await this.controller.addYamlProp(property.key, property.content, this.file);
    }
    async toDataview(property) {
        await this.controller.deleteProperty(property, this.file);
        await this.controller.addDataviewField(property.key, property.content, this.file);
    }
    createButton(el, content, callback) {
        const itemButton = el.createEl("button");
        itemButton.textContent = content;
        itemButton.classList.add("not-a-button");
        itemButton.style.float = "right";
        itemButton.style.marginRight = "4px";
        itemButton.addEventListener("click", callback);
    }
    removeIgnored(data) {
        const ignored = this.plugin.settings.IgnoredProperties.properties;
        let purged = [];
        for (let item in data) {
            if (!ignored.contains(data[item].key))
                purged.push(data[item]);
        }
        return purged;
    }
    setSuggestValues() {
        const autoProps = this.plugin.settings.AutoProperties.properties;
        this.suggestValues = autoProps.reduce((arr, val) => {
            if (!this.data.find(prop => val.name === prop.key || val.name.startsWith('#'))) {
                arr.push(val.name);
            }
            return arr;
        }, []);
    }
}

class MetaEditParser {
    constructor(app) {
        this.app = app;
    }
    async getTagsForFile(file) {
        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache)
            return [];
        const tags = cache.tags;
        if (!tags)
            return [];
        let mTags = [];
        tags.forEach(tag => mTags.push({ key: tag.tag, content: tag.tag, type: MetaType.Tag }));
        return mTags;
    }
    async parseFrontmatter(file) {
        var _a;
        const frontmatter = (_a = this.app.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter;
        if (!frontmatter)
            return [];
        const { position: { start, end } } = frontmatter;
        const filecontent = await this.app.vault.cachedRead(file);
        const yamlContent = filecontent.split("\n").slice(start.line, end.line).join("\n");
        const parsedYaml = obsidian.parseYaml(yamlContent);
        let metaYaml = [];
        for (const key in parsedYaml) {
            metaYaml.push({ key, content: parsedYaml[key], type: MetaType.YAML });
        }
        return metaYaml;
    }
    async parseInlineFields(file) {
        const content = await this.app.vault.cachedRead(file);
        return content.split("\n").reduce((obj, str) => {
            let parts = str.split("::");
            if (parts[0] && parts[1]) {
                obj.push({ key: parts[0], content: parts[1].trim(), type: MetaType.Dataview });
            }
            else if (str.includes("::")) {
                const key = str.replace("::", '');
                obj.push({ key, content: "", type: MetaType.Dataview });
            }
            return obj;
        }, []);
    }
}

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
        if ((filtered === null || filtered === void 0 ? void 0 : filtered.length) === 1)
            return [...filtered, inputStr];
        if ((filtered === null || filtered === void 0 ? void 0 : filtered.length) > 1)
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

/* src/Modals/GenericPrompt/GenericPromptContent.svelte generated by Svelte v3.46.4 */

function create_fragment(ctx) {
	let div;
	let h1;
	let t0;
	let t1;
	let input;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			h1 = element("h1");
			t0 = text(/*header*/ ctx[1]);
			t1 = space();
			input = element("input");
			set_style(h1, "text-align", "center");
			attr(input, "class", "metaEditPromptInput");
			attr(input, "placeholder", /*placeholder*/ ctx[2]);
			set_style(input, "width", "100%");
			attr(input, "type", "text");
			attr(div, "class", "metaEditPrompt");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, h1);
			append(h1, t0);
			append(div, t1);
			append(div, input);
			/*input_binding*/ ctx[8](input);
			set_input_value(input, /*value*/ ctx[0]);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[9]),
					listen(input, "keydown", /*submit*/ ctx[4])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*header*/ 2) set_data(t0, /*header*/ ctx[1]);

			if (dirty & /*placeholder*/ 4) {
				attr(input, "placeholder", /*placeholder*/ ctx[2]);
			}

			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
				set_input_value(input, /*value*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			/*input_binding*/ ctx[8](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { app } = $$props;
	let { header = "" } = $$props;
	let { placeholder = "" } = $$props;
	let { value = "" } = $$props;
	let { onSubmit } = $$props;
	let { suggestValues } = $$props;
	let inputEl;

	onMount(() => {
		if (suggestValues && suggestValues.length > 0) new GenericTextSuggester(app, inputEl, suggestValues);
		inputEl.select();
		inputEl.focus();
	});

	function submit(evt) {
		if (evt.key === "Enter") {
			evt.preventDefault();
			onSubmit(value);
		}
	}

	function input_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			inputEl = $$value;
			$$invalidate(3, inputEl);
		});
	}

	function input_input_handler() {
		value = this.value;
		$$invalidate(0, value);
	}

	$$self.$$set = $$props => {
		if ('app' in $$props) $$invalidate(5, app = $$props.app);
		if ('header' in $$props) $$invalidate(1, header = $$props.header);
		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
		if ('value' in $$props) $$invalidate(0, value = $$props.value);
		if ('onSubmit' in $$props) $$invalidate(6, onSubmit = $$props.onSubmit);
		if ('suggestValues' in $$props) $$invalidate(7, suggestValues = $$props.suggestValues);
	};

	return [
		value,
		header,
		placeholder,
		inputEl,
		submit,
		app,
		onSubmit,
		suggestValues,
		input_binding,
		input_input_handler
	];
}

class GenericPromptContent extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, {
			app: 5,
			header: 1,
			placeholder: 2,
			value: 0,
			onSubmit: 6,
			suggestValues: 7
		});
	}
}

class GenericPrompt extends obsidian.Modal {
    constructor(app, header, placeholder, value, suggestValues) {
        super(app);
        this.didSubmit = false;
        this.modalContent = new GenericPromptContent({
            target: this.contentEl,
            props: {
                app,
                header,
                placeholder,
                value,
                suggestValues,
                onSubmit: (input) => {
                    this.input = input;
                    this.didSubmit = true;
                    this.close();
                }
            }
        });
        this.waitForClose = new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
        this.open();
    }
    static Prompt(app, header, placeholder, value, suggestValues) {
        const newPromptModal = new GenericPrompt(app, header, placeholder, value, suggestValues);
        return newPromptModal.waitForClose;
    }
    onOpen() {
        super.onOpen();
        const modalPrompt = document.querySelector('.metaEditPrompt');
        const modalInput = modalPrompt.querySelector('.metaEditPromptInput');
        modalInput.focus();
        modalInput.select();
    }
    onClose() {
        super.onClose();
        this.modalContent.$destroy();
        if (!this.didSubmit)
            this.rejectPromise("No input given.");
        else
            this.resolvePromise(this.input);
    }
}

class GenericSuggester extends obsidian.FuzzySuggestModal {
    constructor(app, displayItems, items) {
        super(app);
        this.displayItems = displayItems;
        this.items = items;
        this.promise = new Promise((resolve) => (this.resolvePromise = resolve));
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
    onChooseItem(item, evt) {
        this.resolvePromise(item);
    }
}

class MetaController {
    constructor(app, plugin) {
        this.hasTrackerPlugin = false;
        this.useTrackerPlugin = false;
        this.app = app;
        this.parser = new MetaEditParser(app);
        this.plugin = plugin;
        // @ts-ignore
        this.hasTrackerPlugin = !!this.app.plugins.plugins["obsidian-tracker"];
    }
    async getPropertiesInFile(file) {
        const yaml = await this.parser.parseFrontmatter(file);
        const inlineFields = await this.parser.parseInlineFields(file);
        const tags = await this.parser.getTagsForFile(file);
        return [...tags, ...yaml, ...inlineFields];
    }
    async addYamlProp(propName, propValue, file) {
        const fileContent = await this.app.vault.read(file);
        const frontmatter = await this.parser.parseFrontmatter(file);
        const isYamlEmpty = ((!frontmatter || frontmatter.length === 0) && !fileContent.match(/^-{3}\s*\n*\r*-{3}/));
        if (frontmatter.some(value => value.key === propName)) {
            new obsidian.Notice(`Frontmatter in file '${file.name}' already has property '${propName}. Will not add.'`);
            return;
        }
        const settings = this.plugin.settings;
        if (settings.EditMode.mode === EditMode.AllMulti ||
            (settings.EditMode.mode === EditMode.SomeMulti && settings.EditMode.properties.contains(propName))) {
            propValue = `[${propValue}]`;
        }
        let splitContent = fileContent.split("\n");
        if (isYamlEmpty) {
            splitContent.unshift("---");
            splitContent.unshift(`${propName}: ${propValue}`);
            splitContent.unshift("---");
        }
        else {
            splitContent.splice(1, 0, `${propName}: ${propValue}`);
        }
        const newFileContent = splitContent.join("\n");
        await this.app.vault.modify(file, newFileContent);
    }
    async addDataviewField(propName, propValue, file) {
        const fileContent = await this.app.vault.read(file);
        let lines = fileContent.split("\n").reduce((obj, line, idx) => {
            obj[idx] = !!line ? line : "";
            return obj;
        }, {});
        let appendAfter = await GenericSuggester.Suggest(this.app, Object.values(lines), Object.keys(lines));
        if (!appendAfter)
            return;
        let splitContent = fileContent.split("\n");
        if (typeof appendAfter === "number" || parseInt(appendAfter)) {
            splitContent.splice(parseInt(appendAfter), 0, `${propName}:: ${propValue}`);
        }
        const newFileContent = splitContent.join("\n");
        await this.app.vault.modify(file, newFileContent);
    }
    async editMetaElement(property, meta, file) {
        const mode = this.plugin.settings.EditMode.mode;
        if (property.type === MetaType.Tag)
            await this.editTag(property, file);
        else if (mode === EditMode.AllMulti || mode === EditMode.SomeMulti)
            await this.multiValueMode(property, file);
        else
            await this.standardMode(property, file);
    }
    async editTag(property, file) {
        const splitTag = property.key.split("/");
        const allButLast = splitTag.slice(0, splitTag.length - 1).join("/");
        const trackerPluginMethod = "Use Tracker", metaEditMethod = "Use MetaEdit", choices = [trackerPluginMethod, metaEditMethod];
        let newValue;
        let method = metaEditMethod;
        if (this.hasTrackerPlugin)
            method = await GenericSuggester.Suggest(this.app, choices, choices);
        if (!method)
            return;
        if (method === trackerPluginMethod) {
            newValue = await GenericPrompt.Prompt(this.app, `Enter a new value for ${property.key}`);
            this.useTrackerPlugin = true;
        }
        else if (method === metaEditMethod) {
            const autoProp = await this.handleAutoProperties(allButLast);
            if (autoProp)
                newValue = autoProp;
            else
                newValue = await GenericPrompt.Prompt(this.app, `Enter a new value for ${property.key}`);
        }
        if (newValue) {
            await this.updatePropertyInFile(property, newValue, file);
        }
    }
    async handleProgressProps(meta, file) {
        var _a, _b;
        try {
            const { enabled, properties } = this.plugin.settings.ProgressProperties;
            if (!enabled)
                return;
            const tasks = (_b = (_a = this.app.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.listItems) === null || _b === void 0 ? void 0 : _b.filter(li => li.task);
            if (!tasks)
                return;
            let total = 0, complete = 0, incomplete = 0;
            total = tasks.length;
            complete = tasks.filter(i => i.task != " ").length;
            incomplete = total - complete;
            const props = await this.progressPropHelper(properties, meta, { total, complete, incomplete });
            await this.updateMultipleInFile(props, file);
        }
        catch (e) {
            log.logError(e);
        }
    }
    async createNewProperty(suggestValues) {
        let propName = await GenericPrompt.Prompt(this.app, "Enter a property name", "Property", "", suggestValues);
        if (!propName)
            return null;
        let propValue;
        const autoProp = await this.handleAutoProperties(propName);
        if (autoProp) {
            propValue = autoProp;
        }
        else {
            propValue = await GenericPrompt.Prompt(this.app, "Enter a property value", "Value")
                .catch(() => null);
        }
        if (propValue === null)
            return null;
        return { propName, propValue: propValue.trim() };
    }
    async deleteProperty(property, file) {
        const fileContent = await this.app.vault.read(file);
        const splitContent = fileContent.split("\n");
        const regexp = new RegExp(`^\s*${property.key}:`);
        const idx = splitContent.findIndex(s => s.match(regexp));
        const newFileContent = splitContent.filter((v, i) => {
            if (i != idx)
                return true;
        }).join("\n");
        await this.app.vault.modify(file, newFileContent);
    }
    async progressPropHelper(progressProps, meta, counts) {
        return progressProps.reduce((obj, el) => {
            const property = meta.find(prop => prop.key === el.name);
            if (property) {
                switch (el.type) {
                    case ProgressPropertyOptions.TaskComplete:
                        obj.push(Object.assign(Object.assign({}, property), { content: counts.complete.toString() }));
                        break;
                    case ProgressPropertyOptions.TaskIncomplete:
                        obj.push(Object.assign(Object.assign({}, property), { content: counts.incomplete.toString() }));
                        break;
                    case ProgressPropertyOptions.TaskTotal:
                        obj.push(Object.assign(Object.assign({}, property), { content: counts.total.toString() }));
                        break;
                }
            }
            return obj;
        }, []);
    }
    async standardMode(property, file) {
        const autoProp = await this.handleAutoProperties(property.key);
        let newValue;
        if (autoProp)
            newValue = autoProp;
        else
            newValue = await GenericPrompt.Prompt(this.app, `Enter a new value for ${property.key}`, property.content, property.content);
        if (newValue) {
            await this.updatePropertyInFile(property, newValue, file);
        }
    }
    async multiValueMode(property, file) {
        const settings = this.plugin.settings;
        let newValue;
        if (settings.EditMode.mode == EditMode.SomeMulti && !settings.EditMode.properties.includes(property.key)) {
            await this.standardMode(property, file);
            return false;
        }
        let selectedOption, tempValue, splitValues;
        let currentPropValue = property.content;
        if (currentPropValue !== null)
            currentPropValue = currentPropValue.toString();
        else
            currentPropValue = "";
        if (property.type === MetaType.YAML) {
            splitValues = currentPropValue.split('').filter(c => !c.includes("[]")).join('').split(",");
        }
        else {
            splitValues = currentPropValue.split(",").map(prop => prop.trim());
        }
        if (splitValues.length == 0 || (splitValues.length == 1 && splitValues[0] == "")) {
            const options = ["Add new value"];
            selectedOption = await GenericSuggester.Suggest(this.app, options, [ADD_FIRST_ELEMENT]);
        }
        else if (splitValues.length == 1) {
            const options = [splitValues[0], "Add to end", "Add to beginning"];
            selectedOption = await GenericSuggester.Suggest(this.app, options, [splitValues[0], ADD_TO_END, ADD_TO_BEGINNING]);
        }
        else {
            const options = ["Add to end", ...splitValues, "Add to beginning"];
            selectedOption = await GenericSuggester.Suggest(this.app, options, [ADD_TO_END, ...splitValues, ADD_TO_BEGINNING]);
        }
        if (!selectedOption)
            return;
        let selectedIndex;
        const autoProp = await this.handleAutoProperties(property.key);
        if (autoProp) {
            tempValue = autoProp;
        }
        else if (selectedOption.includes("cmd")) {
            tempValue = await GenericPrompt.Prompt(this.app, "Enter a new value");
        }
        else {
            selectedIndex = splitValues.findIndex(el => el == selectedOption);
            tempValue = await GenericPrompt.Prompt(this.app, `Change ${selectedOption} to`, selectedOption);
        }
        if (!tempValue)
            return;
        switch (selectedOption) {
            case ADD_FIRST_ELEMENT:
                newValue = `${tempValue}`;
                break;
            case ADD_TO_BEGINNING:
                newValue = `${[tempValue, ...splitValues].join(", ")}`;
                break;
            case ADD_TO_END:
                newValue = `${[...splitValues, tempValue].join(", ")}`;
                break;
            default:
                if (selectedIndex)
                    splitValues[selectedIndex] = tempValue;
                else
                    splitValues = [tempValue];
                newValue = `${splitValues.join(", ")}`;
                break;
        }
        if (property.type === MetaType.YAML)
            newValue = `[${newValue}]`;
        if (newValue) {
            await this.updatePropertyInFile(property, newValue, file);
            return true;
        }
        return false;
    }
    async handleAutoProperties(propertyName) {
        const autoProp = this.plugin.settings.AutoProperties.properties.find(a => a.name === propertyName);
        if (this.plugin.settings.AutoProperties.enabled && autoProp) {
            const options = autoProp.choices;
            return await GenericPrompt.Prompt(this.app, `Enter a new value for ${propertyName}`, '', '', options);
        }
        return null;
    }
    async updatePropertyInFile(property, newValue, file) {
        const fileContent = await this.app.vault.read(file);
        const newFileContent = fileContent.split("\n").map(line => {
            if (this.lineMatch(property, line)) {
                return this.updatePropertyLine(property, newValue);
            }
            return line;
        }).join("\n");
        await this.app.vault.modify(file, newFileContent);
    }
    lineMatch(property, line) {
        const propertyRegex = new RegExp(`^\s*${property.key}\:{1,2}`);
        const tagRegex = new RegExp(`^\s*${property.key}`);
        if (property.key.contains('#')) {
            return tagRegex.test(line);
        }
        return propertyRegex.test(line);
    }
    updatePropertyLine(property, newValue) {
        let newLine;
        switch (property.type) {
            case MetaType.Dataview:
                newLine = `${property.key}:: ${newValue}`;
                break;
            case MetaType.YAML:
                newLine = `${property.key}: ${newValue}`;
                break;
            case MetaType.Tag:
                if (this.useTrackerPlugin) {
                    newLine = `${property.key}:${newValue}`;
                }
                else {
                    const splitTag = property.key.split("/");
                    if (splitTag.length === 1)
                        newLine = `${splitTag[0]}/${newValue}`;
                    else if (splitTag.length > 1) {
                        const allButLast = splitTag.slice(0, splitTag.length - 1).join("/");
                        newLine = `${allButLast}/${newValue}`;
                    }
                    else
                        newLine = property.key;
                }
                break;
            default:
                newLine = property.key;
                break;
        }
        return newLine;
    }
    async updateMultipleInFile(properties, file) {
        let fileContent = (await this.app.vault.read(file)).split("\n");
        for (const prop of properties) {
            fileContent = fileContent.map(line => {
                if (this.lineMatch(prop, line)) {
                    return this.updatePropertyLine(prop, prop.content);
                }
                return line;
            });
        }
        const newFileContent = fileContent.join("\n");
        await this.app.vault.modify(file, newFileContent);
    }
}

const DEFAULT_SETTINGS = Object.freeze({
    ProgressProperties: {
        enabled: false,
        properties: []
    },
    IgnoredProperties: {
        enabled: false,
        properties: []
    },
    AutoProperties: {
        enabled: false,
        properties: []
    },
    EditMode: {
        mode: EditMode.AllSingle,
        properties: [],
    },
    KanbanHelper: {
        enabled: false,
        boards: []
    },
    UIElements: {
        enabled: true
    }
});

class LinkMenu {
    constructor(plugin) {
        this.plugin = plugin;
    }
    registerEvent() {
        this.eventRef = this.plugin.app.workspace.on('file-menu', (menu, file, source) => this.onMenuOpenCallback(menu, file, source));
        this.plugin.registerEvent(this.eventRef);
    }
    unregisterEvent() {
        if (this.eventRef) {
            this.plugin.app.workspace.offref(this.eventRef);
        }
    }
    onMenuOpenCallback(menu, file, source) {
        const bCorrectSource = (source === "link-context-menu" ||
            source === "calendar-context-menu" ||
            source == "file-explorer-context-menu");
        if (bCorrectSource) {
            if (file instanceof obsidian.TFile && file.extension === "md") {
                this.targetFile = file;
                this.addFileOptions(menu);
            }
            if (file instanceof obsidian.TFolder && file.children && file.children.some(f => f instanceof obsidian.TFile && f.extension === "md")) {
                this.targetFolder = file;
                this.addFolderOptions(menu);
            }
        }
    }
    addFileOptions(menu) {
        menu.addItem(item => {
            item.setIcon('pencil');
            item.setTitle("Edit Meta");
            item.onClick(async (evt) => {
                await this.plugin.runMetaEditForFile(this.targetFile);
            });
        });
    }
    addFolderOptions(menu) {
        menu.addItem(item => {
            item.setIcon('pencil');
            item.setTitle("Add YAML property to all files in this folder (and subfolders)");
            item.onClick(async (evt) => {
                await this.plugin.runMetaEditForFolder(this.targetFolder);
            });
        });
    }
}

class MetaEditApi {
    constructor(plugin) {
        this.plugin = plugin;
    }
    make() {
        return {
            autoprop: this.getAutopropFunction(),
            update: this.getUpdateFunction(),
            getPropertyValue: this.getGetPropertyValueFunction(),
            getFilesWithProperty: this.getGetFilesWithPropertyFunction(),
            createYamlProperty: this.getCreateYamlPropertyFunction(),
            getPropertiesInFile: this.getGetPropertiesInFile(),
        };
    }
    getAutopropFunction() {
        return (propertyName) => new MetaController(this.plugin.app, this.plugin).handleAutoProperties(propertyName);
    }
    getUpdateFunction() {
        return async (propertyName, propertyValue, file) => {
            const targetFile = this.getFileFromTFileOrPath(file);
            if (!targetFile)
                return;
            const controller = new MetaController(this.plugin.app, this.plugin);
            const propsInFile = await controller.getPropertiesInFile(targetFile);
            const targetProperty = propsInFile.find(prop => prop.key === propertyName);
            if (!targetProperty)
                return;
            return controller.updatePropertyInFile(targetProperty, propertyValue, targetFile);
        };
    }
    getFileFromTFileOrPath(file) {
        let targetFile;
        if (file instanceof obsidian.TFile)
            targetFile = file;
        if (typeof file === "string") {
            const abstractFile = this.plugin.app.vault.getAbstractFileByPath(file);
            if (abstractFile instanceof obsidian.TFile) {
                targetFile = abstractFile;
            }
        }
        return targetFile;
    }
    getGetPropertyValueFunction() {
        return async (propertyName, file) => {
            const targetFile = this.getFileFromTFileOrPath(file);
            if (!targetFile)
                return;
            const controller = new MetaController(this.plugin.app, this.plugin);
            const propsInFile = await controller.getPropertiesInFile(targetFile);
            const targetProperty = propsInFile.find(prop => prop.key === propertyName);
            if (!targetProperty)
                return;
            return targetProperty.content;
        };
    }
    getGetFilesWithPropertyFunction() {
        return (propertyName) => {
            return this.plugin.getFilesWithProperty(propertyName);
        };
    }
    getCreateYamlPropertyFunction() {
        return async (propertyName, propertyValue, file) => {
            const targetFile = this.getFileFromTFileOrPath(file);
            if (!targetFile)
                return;
            const controller = new MetaController(this.plugin.app, this.plugin);
            await controller.addYamlProp(propertyName, propertyValue, targetFile);
        };
    }
    getGetPropertiesInFile() {
        return async (file) => {
            const targetFile = this.getFileFromTFileOrPath(file);
            if (!targetFile)
                return;
            const controller = new MetaController(this.plugin.app, this.plugin);
            return await controller.getPropertiesInFile(targetFile);
        };
    }
}

function getActiveMarkdownFile(app) {
    const activeFile = app.workspace.getActiveFile();
    const activeMarkdownFile = abstractFileToMarkdownTFile(activeFile);
    if (!activeMarkdownFile) {
        this.logError("could not get current file.");
        return null;
    }
    return activeMarkdownFile;
}
function abstractFileToMarkdownTFile(file) {
    if (file instanceof obsidian.TFile && file.extension === "md")
        return file;
    return null;
}

var ErrorLevel;
(function (ErrorLevel) {
    ErrorLevel["Error"] = "ERROR";
    ErrorLevel["Warning"] = "WARNING";
    ErrorLevel["Log"] = "LOG";
})(ErrorLevel || (ErrorLevel = {}));

class MetaEditLogger {
    formatOutputString(error) {
        return `MetaEdit: (${error.level}) ${error.message}`;
    }
    getMetaEditError(message, level) {
        return { message, level, time: Date.now() };
    }
}

class ConsoleErrorLogger extends MetaEditLogger {
    constructor() {
        super(...arguments);
        this.ErrorLog = [];
    }
    logError(errorMsg) {
        const error = this.getMetaEditError(errorMsg, ErrorLevel.Error);
        this.addMessageToErrorLog(error);
        console.error(this.formatOutputString(error));
    }
    logWarning(warningMsg) {
        const warning = this.getMetaEditError(warningMsg, ErrorLevel.Warning);
        this.addMessageToErrorLog(warning);
        console.warn(this.formatOutputString(warning));
    }
    logMessage(logMsg) {
        const log = this.getMetaEditError(logMsg, ErrorLevel.Log);
        this.addMessageToErrorLog(log);
        console.log(this.formatOutputString(log));
    }
    addMessageToErrorLog(error) {
        this.ErrorLog.push(error);
    }
}

class GuiLogger extends MetaEditLogger {
    constructor(plugin) {
        super();
        this.plugin = plugin;
    }
    logError(msg) {
        const error = this.getMetaEditError(msg, ErrorLevel.Error);
        new obsidian.Notice(this.formatOutputString(error));
    }
    logWarning(msg) {
        const warning = this.getMetaEditError(msg, ErrorLevel.Warning);
        new obsidian.Notice(this.formatOutputString(warning));
    }
    logMessage(msg) { }
}

class UniqueQueue {
    constructor() {
        this.elements = [];
    }
    enqueue(item) {
        if (this.elements.find(i => i === item)) {
            return false;
        }
        this.elements.push(item);
        return true;
    }
    dequeue() {
        return this.elements.shift();
    }
    peek() {
        return this.elements[0];
    }
    isEmpty() {
        return this.elements.length === 0;
    }
    length() {
        return this.elements.length;
    }
}

class UpdatedFileCache {
    constructor() {
        this.map = new Map();
    }
    get(key) {
        return this.map.get(key);
    }
    set(key, content) {
        if (this.map.has(key) && this.map.get(key).content === content)
            return false;
        this.map.set(key, { content, updateTime: Date.now() });
        this.clean();
        return true;
    }
    delete(key) {
        this.map.delete(key);
    }
    clean() {
        const five_minutes = 300000;
        this.map.forEach((item, key) => {
            if (item.updateTime < Date.now() - five_minutes) {
                this.delete(key);
            }
        });
    }
}

class OnFileModifyAutomatorManager {
    constructor(plugin) {
        this.updateFileQueue = new UniqueQueue();
        this.updatedFileCache = new UpdatedFileCache();
        this.automators = [];
        this.notifyDelay = 5000;
        this.notifyAutomators = obsidian.debounce(async () => {
            while (!this.updateFileQueue.isEmpty()) {
                const file = this.updateFileQueue.dequeue();
                for (const automator of this.automators) {
                    await automator.onFileModify(file);
                }
            }
        }, this.notifyDelay, true);
        this.plugin = plugin;
        this.app = plugin.app;
    }
    startAutomators() {
        this.plugin.registerEvent(this.plugin.app.vault.on("modify", (file) => this.onFileModify(file)));
        return this;
    }
    attach(automator) {
        const isExist = this.automators.some(tAuto => tAuto.type === automator.type);
        if (isExist) {
            log.logWarning(`a ${automator.type} automator is already attached.`);
            return this;
        }
        this.automators.push(automator);
        return this;
    }
    detach(automatorType) {
        const automatorIndex = this.automators.findIndex(automator => automator.type === automatorType);
        if (automatorIndex === -1) {
            log.logMessage(`automator of type '${automatorType}' does not exist.`);
            return this;
        }
        this.automators.splice(automatorIndex, 1);
        return this;
    }
    async onFileModify(file) {
        const outfile = abstractFileToMarkdownTFile(file);
        if (!outfile)
            return;
        // Return on Excalidraw files to prevent conflict with its auto-save feature.
        const metadata = await this.app.metadataCache.getFileCache(outfile);
        const keys = Object.keys(metadata === null || metadata === void 0 ? void 0 : metadata.frontmatter);
        if (keys && keys.some(key => key.toLowerCase().contains("excalidraw"))) {
            return;
        }
        const fileContent = await this.app.vault.cachedRead(outfile);
        if (!this.updatedFileCache.set(outfile.path, fileContent))
            return;
        if (this.updateFileQueue.enqueue(outfile)) {
            this.notifyAutomators();
        }
    }
}

class OnFileModifyAutomator {
    constructor(plugin, type) {
        this.plugin = plugin;
        this.app = plugin.app;
        this.type = type;
    }
}

var OnModifyAutomatorType;
(function (OnModifyAutomatorType) {
    OnModifyAutomatorType["KanbanHelper"] = "KanbanHelper";
    OnModifyAutomatorType["ProgressProperties"] = "ProgressProperties";
})(OnModifyAutomatorType || (OnModifyAutomatorType = {}));

class KanbanHelper extends OnFileModifyAutomator {
    get boards() { return this.plugin.settings.KanbanHelper.boards; }
    constructor(plugin) {
        super(plugin, OnModifyAutomatorType.KanbanHelper);
    }
    async onFileModify(file) {
        const kanbanBoardFileContent = await this.app.vault.cachedRead(file);
        const kanbanBoardFileCache = this.app.metadataCache.getFileCache(file);
        const targetBoard = this.findBoardByName(file.basename);
        if (!targetBoard || !kanbanBoardFileCache)
            return;
        const { links } = kanbanBoardFileCache;
        if (!links)
            return;
        await this.updateFilesInBoard(links, targetBoard, kanbanBoardFileContent);
    }
    findBoardByName(boardName) {
        return this.boards.find(board => board.boardName === boardName);
    }
    getLinkFile(link) {
        const markdownFiles = this.app.vault.getMarkdownFiles();
        return markdownFiles.find(f => f.path.includes(`${link.link}.md`));
    }
    async updateFilesInBoard(links, board, kanbanBoardFileContent) {
        for (const link of links) {
            const linkFile = this.getLinkFile(link);
            const linkIsMarkdownFile = !!abstractFileToMarkdownTFile(linkFile);
            if (!linkFile || !linkIsMarkdownFile) {
                log.logMessage(`${link.link} is not updatable for the KanbanHelper.`);
                return;
            }
            await this.updateFileInBoard(link, linkFile, board, kanbanBoardFileContent);
        }
    }
    async updateFileInBoard(link, linkFile, board, kanbanBoardFileContent) {
        const heading = this.getTaskHeading(link.original, kanbanBoardFileContent);
        if (!heading) {
            log.logWarning("found linked file but could not get heading for task.");
            return;
        }
        const fileProperties = await this.plugin.controller.getPropertiesInFile(linkFile);
        if (!fileProperties) {
            log.logWarning(`No properties found in '${board.boardName}', cannot update '${board.property}'.`);
            return;
        }
        const targetProperty = fileProperties.find(prop => prop.key === board.property);
        if (!targetProperty) {
            log.logWarning(`'${board.property} not found in ${board.boardName} for file "${linkFile.name}".'`);
            new obsidian.Notice(`'${board.property} not found in ${board.boardName} for file "${linkFile.name}".'`); // This notice will help users debug "Property not found in board" errors.
            return;
        }
        const propertyHasChanged = (targetProperty.content != heading); // Kanban Helper will check if the file's property is different from its current heading in the kanban and will only make changes to the file if there's a difference
        if (propertyHasChanged) {
            console.debug("Updating " + targetProperty.key + " of file " + linkFile.name + " to " + heading);
            await this.plugin.controller.updatePropertyInFile(targetProperty, heading, linkFile);
        }
    }
    getTaskHeading(targetTaskContent, fileContent) {
        const MARKDOWN_HEADING = new RegExp(/#+\s+(.+)/);
        const TASK_REGEX = new RegExp(/(\s*)-\s*\[([ Xx\.]?)\]\s*(.+)/, "i");
        let lastHeading = "";
        const contentLines = fileContent.split("\n");
        for (const line of contentLines) {
            const headingMatch = MARKDOWN_HEADING.exec(line);
            if (headingMatch) {
                const headingText = headingMatch[1];
                lastHeading = headingText;
            }
            const taskMatch = TASK_REGEX.exec(line);
            if (taskMatch) {
                const taskContent = taskMatch[3];
                if (taskContent.includes(targetTaskContent)) {
                    return lastHeading;
                }
            }
        }
        return null;
    }
}

class ProgressPropertyHelper extends OnFileModifyAutomator {
    constructor(plugin) {
        super(plugin, OnModifyAutomatorType.ProgressProperties);
    }
    async onFileModify(file) {
        const data = await this.plugin.controller.getPropertiesInFile(file);
        if (!data)
            return;
        await this.plugin.controller.handleProgressProps(data, file);
    }
}

class MetaEdit extends obsidian.Plugin {
    async onload() {
        console.log('Loading MetaEdit');
        this.controller = new MetaController(this.app, this);
        await this.loadSettings();
        this.addCommand({
            id: 'metaEditRun',
            name: 'Run MetaEdit',
            callback: async () => {
                const file = getActiveMarkdownFile(this.app);
                if (!file)
                    return;
                await this.runMetaEditForFile(file);
            }
        });
        this.addSettingTab(new MetaEditSettingsTab(this.app, this));
        this.linkMenu = new LinkMenu(this);
        if (this.settings.UIElements.enabled) {
            this.linkMenu.registerEvent();
        }
        this.api = new MetaEditApi(this).make();
        log.register(new ConsoleErrorLogger())
            .register(new GuiLogger(this));
        this.automatorManager = new OnFileModifyAutomatorManager(this).startAutomators();
        this.toggleAutomators();
    }
    toggleAutomators() {
        if (this.settings.KanbanHelper.enabled)
            this.automatorManager.attach(new KanbanHelper(this));
        else
            this.automatorManager.detach(OnModifyAutomatorType.KanbanHelper);
        if (this.settings.ProgressProperties.enabled)
            this.automatorManager.attach(new ProgressPropertyHelper(this));
        else
            this.automatorManager.detach(OnModifyAutomatorType.ProgressProperties);
    }
    async runMetaEditForFile(file) {
        const data = await this.controller.getPropertiesInFile(file);
        if (!data)
            return;
        const suggester = new MetaEditSuggester(this.app, this, data, file, this.controller);
        suggester.open();
    }
    onunload() {
        console.log('Unloading MetaEdit');
        this.linkMenu.unregisterEvent();
    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
    getFilesWithProperty(property) {
        const markdownFiles = this.app.vault.getMarkdownFiles();
        let files = [];
        markdownFiles.forEach(file => {
            const fileCache = this.app.metadataCache.getFileCache(file);
            if (fileCache) {
                const fileFrontmatter = fileCache.frontmatter;
                if (fileFrontmatter && fileFrontmatter[property]) {
                    files.push(file);
                }
            }
        });
        return files;
    }
    async runMetaEditForFolder(targetFolder) {
        const pName = await GenericPrompt.Prompt(this.app, `Add a new property to all files in ${targetFolder.name} (and subfolders)`);
        if (!pName)
            return;
        const pVal = await GenericPrompt.Prompt(this.app, "Enter a value");
        if (!pVal)
            return;
        const updateFilesInFolder = async (targetFolder, propertyName, propertyValue) => {
            for (const child of targetFolder.children) {
                if (child instanceof obsidian.TFile && child.extension == "md")
                    await this.controller.addYamlProp(pName, pVal, child);
                if (child instanceof obsidian.TFolder)
                    await updateFilesInFolder(child);
            }
        };
        await updateFilesInFolder(targetFolder);
    }
}

module.exports = MetaEdit;

"use strict";
var S = require("obsidian");
const pe = (t, e, n, i, o, r) => {
    var l, s, f;
    const a = i.getCursor("from");
    let c;
    if (i.cursorCoords) c = i.cursorCoords(!0, "window");
    else if (i.coordsAtPos) {
        const h = i.posToOffset(a);
        c = (f = (s = (l = i.cm).coordsAtPos) == null ? void 0 : s.call(l, h)) != null ? f : i.coordsAtPos(h)
    } else return;
    r.style.left = `${c.left}px`, r.style.top = `${c.top+15}px`, r.style.display = "unset"
};

function F() {}

function ye(t, e) {
    for (const n in e) t[n] = e[n];
    return t
}

function ue(t) {
    return t()
}

function ee() {
    return Object.create(null)
}

function M(t) {
    t.forEach(ue)
}

function ve(t) {
    return typeof t == "function"
}

function ce(t, e) {
    return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function"
}

function Ee(t) {
    return Object.keys(t).length === 0
}

function T(t, e) {
    t.appendChild(e)
}

function R(t, e, n) {
    t.insertBefore(e, n || null)
}

function P(t) {
    t.parentNode.removeChild(t)
}

function D(t) {
    return document.createElement(t)
}

function W(t) {
    return document.createTextNode(t)
}

function V() {
    return W(" ")
}

function te() {
    return W("")
}

function L(t, e, n, i) {
    return t.addEventListener(e, n, i), () => t.removeEventListener(e, n, i)
}

function A(t, e, n) {
    n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n)
}

function we(t) {
    return Array.from(t.childNodes)
}

function j(t, e) {
    t.value = e == null ? "" : e
}

function B(t, e, n, i) {
    n === null ? t.style.removeProperty(e) : t.style.setProperty(e, n, i ? "important" : "")
}

function ne(t, e, n) {
    t.classList[n ? "add" : "remove"](e)
}
let Z;

function O(t) {
    Z = t
}
const I = [],
    z = [],
    H = [],
    K = [],
    Te = Promise.resolve();
let Q = !1;

function ke() {
    Q || (Q = !0, Te.then(fe))
}

function X(t) {
    H.push(t)
}

function ie(t) {
    K.push(t)
}
const J = new Set;
let x = 0;

function fe() {
    const t = Z;
    do {
        for (; x < I.length;) {
            const e = I[x];
            x++, O(e), Ce(e.$$)
        }
        for (O(null), I.length = 0, x = 0; z.length;) z.pop()();
        for (let e = 0; e < H.length; e += 1) {
            const n = H[e];
            J.has(n) || (J.add(n), n())
        }
        H.length = 0
    } while (I.length);
    for (; K.length;) K.pop()();
    Q = !1, J.clear(), O(t)
}

function Ce(t) {
    if (t.fragment !== null) {
        t.update(), M(t.before_update);
        const e = t.dirty;
        t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(X)
    }
}
const U = new Set;
let Ne;

function $(t, e) {
    t && t.i && (U.delete(t), t.i(e))
}

function Se(t, e, n, i) {
    if (t && t.o) {
        if (U.has(t)) return;
        U.add(t), Ne.c.push(() => {
            U.delete(t), i && (n && t.d(1), i())
        }), t.o(e)
    } else i && i()
}

function de(t, e) {
    t.d(1), e.delete(t.key)
}

function he(t, e, n, i, o, r, a, c, l, s, f, h) {
    let b = t.length,
        _ = r.length,
        p = b;
    const v = {};
    for (; p--;) v[t[p].key] = p;
    const C = [],
        w = new Map,
        k = new Map;
    for (p = _; p--;) {
        const u = h(o, r, p),
            g = n(u);
        let y = a.get(g);
        y ? i && y.p(u, e) : (y = s(g, u), y.c()), w.set(g, C[p] = y), g in v && k.set(g, Math.abs(p - v[g]))
    }
    const m = new Set,
        N = new Set;

    function E(u) {
        $(u, 1), u.m(c, f), a.set(u.key, u), f = u.first, _--
    }
    for (; b && _;) {
        const u = C[_ - 1],
            g = t[b - 1],
            y = u.key,
            d = g.key;
        u === g ? (f = u.first, b--, _--) : w.has(d) ? !a.has(y) || m.has(y) ? E(u) : N.has(d) ? b-- : k.get(y) > k.get(d) ? (N.add(y), E(u)) : (m.add(d), b--) : (l(g, a), b--)
    }
    for (; b--;) {
        const u = t[b];
        w.has(u.key) || l(u, a)
    }
    for (; _;) E(C[_ - 1]);
    return C
}

function De(t, e) {
    const n = {},
        i = {},
        o = {
            $$scope: 1
        };
    let r = t.length;
    for (; r--;) {
        const a = t[r],
            c = e[r];
        if (c) {
            for (const l in a) l in c || (i[l] = 1);
            for (const l in c) o[l] || (n[l] = c[l], o[l] = 1);
            t[r] = c
        } else
            for (const l in a) o[l] = 1
    }
    for (const a in i) a in n || (n[a] = void 0);
    return n
}

function Ge(t) {
    return typeof t == "object" && t !== null ? t : {}
}

function le(t, e, n) {
    const i = t.$$.props[e];
    i !== void 0 && (t.$$.bound[i] = n, n(t.$$.ctx[i]))
}

function Ae(t) {
    t && t.c()
}

function ge(t, e, n, i) {
    const {
        fragment: o,
        on_mount: r,
        on_destroy: a,
        after_update: c
    } = t.$$;
    o && o.m(e, n), i || X(() => {
        const l = r.map(ue).filter(ve);
        a ? a.push(...l) : M(l), t.$$.on_mount = []
    }), c.forEach(X)
}

function me(t, e) {
    const n = t.$$;
    n.fragment !== null && (M(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = [])
}

function Le(t, e) {
    t.$$.dirty[0] === -1 && (I.push(t), ke(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31
}

function be(t, e, n, i, o, r, a, c = [-1]) {
    const l = Z;
    O(t);
    const s = t.$$ = {
        fragment: null,
        ctx: null,
        props: r,
        update: F,
        not_equal: o,
        bound: ee(),
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(e.context || (l ? l.$$.context : [])),
        callbacks: ee(),
        dirty: c,
        skip_bound: !1,
        root: e.target || l.$$.root
    };
    a && a(s.root);
    let f = !1;
    if (s.ctx = n ? n(t, e.props || {}, (h, b, ..._) => {
            const p = _.length ? _[0] : b;
            return s.ctx && o(s.ctx[h], s.ctx[h] = p) && (!s.skip_bound && s.bound[h] && s.bound[h](p), f && Le(t, h)), b
        }) : [], s.update(), f = !0, M(s.before_update), s.fragment = i ? i(s.ctx) : !1, e.target) {
        if (e.hydrate) {
            const h = we(e.target);
            s.fragment && s.fragment.l(h), h.forEach(P)
        } else s.fragment && s.fragment.c();
        e.intro && $(t.$$.fragment), ge(t, e.target, e.anchor, e.customElement), fe()
    }
    O(l)
}
class _e {
    $destroy() {
        me(this, 1), this.$destroy = F
    }
    $on(e, n) {
        const i = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
        return i.push(n), () => {
            const o = i.indexOf(n);
            o !== -1 && i.splice(o, 1)
        }
    }
    $set(e) {
        this.$$set && !Ee(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1)
    }
}
const q = t => {

    S.requireApiVersion("0.15.0") && !t ? 
    activeDocument.body.contains(activeDocument.getElementsByClassName("table-generator-view")[0]) && activeDocument.body.removeChild(activeDocument.getElementsByClassName("table-generator-view")[0]) 
    : document.body.contains(document.getElementsByClassName("table-generator-view")[0]) && document.body.removeChild(document.getElementsByClassName("table-generator-view")[0])
};

function oe(t, e, n) {
    const i = t.slice();
    return i[19] = e[n], i[21] = n, i
}

function se(t, e, n) {
    const i = t.slice();
    return i[19] = e[n], i[23] = n, i
}

function re(t, e) {
    let n, i, o;

    function r() {
        return e[11](e[21], e[23])
    }

    function a() {
        return e[12](e[21], e[23])
    }
    return {
        key: t,
        first: null,
        c() {
            n = D("div"), A(n, "class", "table-generator-cell svelte-1beedzn"), ne(n, "active", e[0][e[21]][e[23]]), this.first = n
        },
        m(c, l) {
            R(c, n, l), i || (o = [L(n, "mouseenter", r), L(n, "click", a)], i = !0)
        },
        p(c, l) {
            e = c, l & 9 && ne(n, "active", e[0][e[21]][e[23]])
        },
        d(c) {
            c && P(n), i = !1, M(o)
        }
    }
}

function ae(t, e) {
    let n, i = [],
        o = new Map,
        r, a = {
            length: e[3][1]
        };
    const c = l => l[23];
    for (let l = 0; l < a.length; l += 1) {
        let s = se(e, a, l),
            f = c(s);
        o.set(f, i[l] = re(f, s))
    }
    return {
        key: t,
        first: null,
        c() {
            n = te();
            for (let l = 0; l < i.length; l += 1) i[l].c();
            r = te(), this.first = n
        },
        m(l, s) {
            R(l, n, s);
            for (let f = 0; f < i.length; f += 1) i[f].m(l, s);
            R(l, r, s)
        },
        p(l, s) {
            e = l, s & 89 && (a = {
                length: e[3][1]
            }, i = he(i, s, c, 1, e, a, o, r.parentNode, de, re, r, se))
        },
        d(l) {
            l && P(n);
            for (let s = 0; s < i.length; s += 1) i[s].d(l);
            l && P(r)
        }
    }
}

function Me(t) {
    let e, n = [],
        i = new Map,
        o, r, a = {
            length: t[3][0]
        };
    const c = l => l[21];
    for (let l = 0; l < a.length; l += 1) {
        let s = oe(t, a, l),
            f = c(s);
        i.set(f, n[l] = ae(f, s))
    }
    return {
        c() {
            e = D("div");
            for (let l = 0; l < n.length; l += 1) n[l].c();
            A(e, "class", "container svelte-1beedzn"), B(e, "grid-template-rows", t[1]), B(e, "grid-template-columns", t[2])
        },
        m(l, s) {
            R(l, e, s);
            for (let f = 0; f < n.length; f += 1) n[f].m(e, null);
            o || (r = [L(e, "mouseleave", t[13]), L(e, "blur", t[14])], o = !0)
        },
        p(l, [s]) {
            s & 89 && (a = {
                length: l[3][0]
            }, n = he(n, s, c, 1, l, a, i, e, de, ae, null, oe)), s & 2 && B(e, "grid-template-rows", l[1]), s & 4 && B(e, "grid-template-columns", l[2])
        },
        i: F,
        o: F,
        d(l) {
            l && P(e);
            for (let s = 0; s < n.length; s += 1) n[s].d();
            o = !1, M(r)
        }
    }
}

function qe(t, e, n) {
    let i, o, r, {
            rowNum: a = 8
        } = e,
        {
            colNum: c = 8
        } = e,
        {
            selectedTableEnd: l
        } = e,
        {
            hoverTableEnd: s
        } = e,
        f = [a, c],
        h = [],
        b = [];

    function _(u, g) {
        h = [0, 0], b = [u, g], n(8, s = [u + 1, g + 1]), w(b)
    }

    function p() {
        h = b = [-1, -1], setTimeout(() => {
            n(8, s = [0, 0]), w(b)
        }, 1e3)
    }

    function v(u, g) {
        g !== 0 && (n(7, l = [u + 1, g + 1]), q())
    }

    function C([u, g], [y, d]) {
        return (u - h[0]) * (u - y) <= 0 && (g - h[1]) * (g - d) <= 0
    }

    function w(u) {
        n(0, r = r.map((g, y) => g.map((d, G) => C([y, G], u))))
    }
    const k = (u, g) => _(u, g),
        m = (u, g) => v(u, g),
        N = () => p(),
        E = () => p();
    return t.$$set = u => {
        "rowNum" in u && n(9, a = u.rowNum), "colNum" in u && n(10, c = u.colNum), "selectedTableEnd" in u && n(7, l = u.selectedTableEnd), "hoverTableEnd" in u && n(8, s = u.hoverTableEnd)
    }, n(2, i = `repeat(${f[1]}, 1fr)`), n(1, o = `repeat(${f[0]}, 1fr)`), n(0, r = Array(f[0]).fill(0).map(u => Array(f[1]).fill(!1))), [r, o, i, f, _, p, v, l, s, a, c, k, m, N, E]
}
class Pe extends _e {
    constructor(e) {
        super(), be(this, e, qe, Me, ce, {
            rowNum: 9,
            colNum: 10,
            selectedTableEnd: 7,
            hoverTableEnd: 8
        })
    }
}
const Ie = t => {
    let e = "",
        n = "",
        i = "";
    if (console.log(t), t.length === 0) return e;
    for (let o = 0; o < Number(t[1]); o++) n += "|:-----";
    for (let o = 0; o < Number(t[1]); o++) i += "|      ";
    if (!t[0]) return e = i + `|
` + n + `|
`, e;
    for (let o = 0; o < Number(t[0]) + 1; o++) o || (e = e + i + `|
`), o === 1 && (e = e + n + `|
`), o > 1 && (e = e + i + `|
`);
    return e
};

function Oe(t) {
    let e, n, i, o, r, a, c, l, s, f, h, b, _, p, v, C, w, k, m, N;
    const E = [t[4]];

    function u(d) {
        t[8](d)
    }

    function g(d) {
        t[9](d)
    }
    let y = {};
    for (let d = 0; d < E.length; d += 1) y = ye(y, E[d]);
    return t[0] !== void 0 && (y.selectedTableEnd = t[0]), t[1] !== void 0 && (y.hoverTableEnd = t[1]), o = new Pe({
        props: y
    }), z.push(() => le(o, "selectedTableEnd", u)), z.push(() => le(o, "hoverTableEnd", g)), {
        c() {
            e = D("div"), n = D("div"), n.textContent = "Table Generator", i = V(), Ae(o.$$.fragment), c = V(), l = D("div"), s = D("div"), f = W(`ROW:
            `), h = D("input"), b = V(), _ = D("div"), p = W(`COL:
            `), v = D("input"), C = V(), w = D("button"), w.textContent = "Insert", A(n, "class", "H1 svelte-16qs8ar"), A(h, "class", "svelte-16qs8ar"), A(v, "class", "svelte-16qs8ar"), A(l, "class", "input-table-generator svelte-16qs8ar"), A(w, "class", "svelte-16qs8ar"), A(e, "class", "table-generator svelte-16qs8ar")
        },
        m(d, G) {
            R(d, e, G), T(e, n), T(e, i), ge(o, e, null), T(e, c), T(e, l), T(l, s), T(s, f), T(s, h), j(h, t[2]), T(l, b), T(l, _), T(_, p), T(_, v), j(v, t[3]), T(e, C), T(e, w), k = !0, m || (N = [L(h, "input", t[10]), L(v, "input", t[11]), L(w, "click", t[12])], m = !0)
        },
        p(d, [G]) {
            const Y = G & 16 ? De(E, [Ge(d[4])]) : {};
            !r && G & 1 && (r = !0, Y.selectedTableEnd = d[0], ie(() => r = !1)), !a && G & 2 && (a = !0, Y.hoverTableEnd = d[1], ie(() => a = !1)), o.$set(Y), G & 4 && h.value !== d[2] && j(h, d[2]), G & 8 && v.value !== d[3] && j(v, d[3])
        },
        i(d) {
            k || ($(o.$$.fragment, d), k = !0)
        },
        o(d) {
            Se(o.$$.fragment, d), k = !1
        },
        d(d) {
            d && P(e), me(o), m = !1, M(N)
        }
    }
}

function Re(t, e, n) {
    var i, o;
    let {
        editor: r
    } = e, {
        plugin: a
    } = e, c = [], l, s, f, h = {
        rowNum: (i = a == null ? void 0 : a.settings.rowCount) !== null && i !== void 0 ? i : 8,
        colNum: (o = a == null ? void 0 : a.settings.columnCount) !== null && o !== void 0 ? o : 8
    };

    function b(m) {
        if (m.length === 0) {
            n(2, s = 0), n(3, f = 0);
            return
        }
        l[0] === 0 && l[1] === 0 || (n(2, s = l[0]), n(3, f = l[1]))
    }

    function _(m) {
        if (m.length === 0 || m[1] < 2) return;
        const N = Ie(m),
            E = r.getCursor("from");
        r.getLine(E.line).length > 0 ? r.replaceRange(N, {
            line: E.line + 1,
            ch: 0
        }, {
            line: E.line + 1,
            ch: N.length
        }) : r.replaceRange(N, {
            line: E.line,
            ch: 0
        }, {
            line: E.line,
            ch: 0
        })
    }

    function p(m) {
        c = m, n(0, c)
    }

    function v(m) {
        l = m, n(1, l)
    }

    function C() {
        s = this.value, n(2, s)
    }

    function w() {
        f = this.value, n(3, f)
    }
    const k = () => {
        /^\d+$/.test(s.toString()) && /^\d+$/.test(f.toString()) ? (console.log(s, f), _([s, f]), q()) : new S.Notice("Please enter a valid number")
    };
    return t.$$set = m => {
        "editor" in m && n(6, r = m.editor), "plugin" in m && n(7, a = m.plugin)
    }, t.$$.update = () => {
        t.$$.dirty & 1 && c && _(c), t.$$.dirty & 2 && l && b(l)
    }, [c, l, s, f, h, _, r, a, p, v, C, w, k]
}
class Ve extends _e {
    constructor(e) {
        super(), be(this, e, Re, Oe, ce, {
            editor: 6,
            plugin: 7
        })
    }
}
const je = {
    rowCount: 8,
    columnCount: 8
};
class Be extends S.Plugin {
    async onload() {
      
        await this.loadSettings(), this.registerEvent(this.app.workspace.on("editor-menu", (e, n, i) => this.handleTableGeneratorMenu(e, n, i))), this.addSettingTab(new xe(this.app, this)), this.registerDomEvent(document, "click", e => {
            var n, i;
       
            if (!(e.target.tagName=="BUTTON"||e.target.classList.contains("table-generator-menu") || ((n = e.target.parentElement) == null ? void 0 : n.classList.contains("table-generator-menu"))) && !((i = this.tableGeneratorEl) != null && i.contains(e.target))) {
                if (!document.body.contains(this.tableGeneratorEl)) return;
                q()
            }
        }), S.requireApiVersion("0.15.0") && (this.registerDomEvent(window, "click", e => {
       
            var n, i, o, r;
       
            ((n = e.targetNode) == null ? void 0 : n.classList.contains("table-generator-menu"))||n.tagName=="BUTTON" || ((o = (i = e.targetNode) == null ? void 0 : i.parentElement) == null ? void 0 : o.classList.contains("table-generator-menu")) || (e.targetNode === null && q(!0), (r = this.tableGeneratorEl) != null && r.contains(e.targetNode) || q())
        }), this.app.workspace.on("window-open", e => {
            this.registerDomEvent(e.doc, "click", n => {
                var i, o;
                if (!(n.target.classList.contains("table-generator-menu")|| ((i = n.target.parentElement) == null ? void 0 : i.classList.contains("table-generator-menu"))) && !((o = this.tableGeneratorEl) != null && o.contains(n.target))) {
                    if (!activeDocument.body.contains(this.tableGeneratorEl)) return;
                    q()
                }
            })
        }))
        this.addCommand({
            id: 'create-table-genertator',
            name: 'createTableGenerator',
            callback: () =>   {     
              if(activeDocument.body.querySelector(".table-generator-view")) return;
                const activeLeaf = app.workspace.getActiveViewOfType(S.MarkdownView);
                if (activeLeaf) {
                    const view = activeLeaf;
                    const editor = view.editor;
                    this.createTableGeneratorMenu(editor, this);
                    pe(app, this,' ', editor, '', this.tableGeneratorEl)
                }
            }
                         
        });
      
    }
    createTableGeneratorMenu(e, n) {

        S.requireApiVersion("0.15.0") ? this.tableGeneratorEl = activeDocument.createElement("div") : this.tableGeneratorEl = document.createElement("div"), this.tableGeneratorEl.className = "table-generator-view", this.tableGeneratorEl.style.position = "absolute", this.tableGeneratorEl.style.border = "1px solid black", this.tableGeneratorEl.style.display = "none", S.requireApiVersion("0.15.0") ? activeDocument.body.appendChild(this.tableGeneratorEl) : document.body.appendChild(this.tableGeneratorEl), new Ve({
            target: this.tableGeneratorEl,
            props: {
                editor: e,
                plugin: n
            }
        })
    }
    handleTableGeneratorMenu(e, n, i) {
        e.addItem(o => {
            o.dom.addClass("table-generator-menu"), o.setTitle("Table Generator").setIcon("table").onClick(async () => {
                this.createTableGeneratorMenu(n, this), pe(app, this, e, n, i, this.tableGeneratorEl)
            })
        })
    }
    onunload() {
        if (this.tableGeneratorEl !== void 0 && this.tableGeneratorEl instanceof HTMLElement)
            if (S.requireApiVersion("0.15.0")) {
                if (!activeDocument.body.contains(this.tableGeneratorEl)) return;
                activeDocument.body.removeChild(this.tableGeneratorEl)
            } else {
                if (!document.body.contains(this.tableGeneratorEl)) return;
                document.body.removeChild(this.tableGeneratorEl)
            }
    }
    async loadSettings() {
        this.settings = Object.assign({}, je, await this.loadData())
    }
    async saveSettings() {
        await this.saveData(this.settings)
    }
}
class xe extends S.PluginSettingTab {
    constructor(e, n) {
        super(e, n), this.applyDebounceTimer = 0, this.plugin = n
    }
    applySettingsUpdate() {
        clearTimeout(this.applyDebounceTimer);
        const e = this.plugin;
        this.applyDebounceTimer = window.setTimeout(() => {
            e.saveSettings()
        }, 100)
    }
    display() {
        const {
            containerEl: e
        } = this;
        e.empty(), e.createEl("h2", {
            text: "Table Generator"
        });
        let n;
        new S.Setting(e).setName("Row Count").setDesc("The number of rows in the table").addSlider(o => o.setLimits(2, 12, 1).setValue(this.plugin.settings.rowCount).onChange(async r => {
            n.innerText = ` ${r.toString()}`, this.plugin.settings.rowCount = r, this.applySettingsUpdate()
        })).settingEl.createDiv("", o => {
            n = o, o.style.minWidth = "2.3em", o.style.textAlign = "right", o.innerText = ` ${this.plugin.settings.rowCount.toString()}`
        });
        let i;
        new S.Setting(e).setName("Columns Count").setDesc("The number of columns in the table").addSlider(o => o.setLimits(2, 12, 1).setValue(this.plugin.settings.columnCount).onChange(async r => {
            i.innerText = ` ${r.toString()}`, this.plugin.settings.columnCount = r, this.applySettingsUpdate()
        })).settingEl.createDiv("", o => {
            i = o, o.style.minWidth = "2.3em", o.style.textAlign = "right", o.innerText = ` ${this.plugin.settings.columnCount.toString()}`
        }), this.containerEl.createEl("h2", {
            text: "Say Thank You"
        }), new S.Setting(e).setName("Donate").setDesc("If you like this plugin, consider donating to support continued development:").addButton(o => {
            o.buttonEl.outerHTML = '<a href="https://www.buymeacoffee.com/boninall"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=boninall&button_colour=6495ED&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00"></a>'
        })
    }
}
module.exports = Be;
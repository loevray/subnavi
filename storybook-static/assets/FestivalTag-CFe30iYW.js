import { j as Q } from './jsx-runtime-BuEtZrLz.js';
import { r as k } from './iframe-Dwj53M-V.js';
function ze(e) {
  var t,
    r,
    o = '';
  if (typeof e == 'string' || typeof e == 'number') o += e;
  else if (typeof e == 'object')
    if (Array.isArray(e)) {
      var n = e.length;
      for (t = 0; t < n; t++)
        e[t] && (r = ze(e[t])) && (o && (o += ' '), (o += r));
    } else for (r in e) e[r] && (o && (o += ' '), (o += r));
  return o;
}
function Ce() {
  for (var e, t, r = 0, o = '', n = arguments.length; r < n; r++)
    (e = arguments[r]) && (t = ze(e)) && (o && (o += ' '), (o += t));
  return o;
}
const ie = '-',
  Oe = (e) => {
    const t = Le(e),
      { conflictingClassGroups: r, conflictingClassGroupModifiers: o } = e;
    return {
      getClassGroupId: (l) => {
        const p = l.split(ie);
        return p[0] === '' && p.length !== 1 && p.shift(), Se(p, t) || _e(l);
      },
      getConflictingClassGroupIds: (l, p) => {
        const d = r[l] || [];
        return p && o[l] ? [...d, ...o[l]] : d;
      },
    };
  },
  Se = (e, t) => {
    var l;
    if (e.length === 0) return t.classGroupId;
    const r = e[0],
      o = t.nextPart.get(r),
      n = o ? Se(e.slice(1), o) : void 0;
    if (n) return n;
    if (t.validators.length === 0) return;
    const i = e.join(ie);
    return (l = t.validators.find(({ validator: p }) => p(i))) == null
      ? void 0
      : l.classGroupId;
  },
  be = /^\[(.+)\]$/,
  _e = (e) => {
    if (be.test(e)) {
      const t = be.exec(e)[1],
        r = t == null ? void 0 : t.substring(0, t.indexOf(':'));
      if (r) return 'arbitrary..' + r;
    }
  },
  Le = (e) => {
    const { theme: t, classGroups: r } = e,
      o = { nextPart: new Map(), validators: [] };
    for (const n in r) ne(r[n], o, n, t);
    return o;
  },
  ne = (e, t, r, o) => {
    e.forEach((n) => {
      if (typeof n == 'string') {
        const i = n === '' ? t : he(t, n);
        i.classGroupId = r;
        return;
      }
      if (typeof n == 'function') {
        if (Fe(n)) {
          ne(n(o), t, r, o);
          return;
        }
        t.validators.push({ validator: n, classGroupId: r });
        return;
      }
      Object.entries(n).forEach(([i, l]) => {
        ne(l, he(t, i), r, o);
      });
    });
  },
  he = (e, t) => {
    let r = e;
    return (
      t.split(ie).forEach((o) => {
        r.nextPart.has(o) ||
          r.nextPart.set(o, { nextPart: new Map(), validators: [] }),
          (r = r.nextPart.get(o));
      }),
      r
    );
  },
  Fe = (e) => e.isThemeGetter,
  We = (e) => {
    if (e < 1) return { get: () => {}, set: () => {} };
    let t = 0,
      r = new Map(),
      o = new Map();
    const n = (i, l) => {
      r.set(i, l), t++, t > e && ((t = 0), (o = r), (r = new Map()));
    };
    return {
      get(i) {
        let l = r.get(i);
        if (l !== void 0) return l;
        if ((l = o.get(i)) !== void 0) return n(i, l), l;
      },
      set(i, l) {
        r.has(i) ? r.set(i, l) : n(i, l);
      },
    };
  },
  se = '!',
  ae = ':',
  Be = ae.length,
  $e = (e) => {
    const { prefix: t, experimentalParseClassName: r } = e;
    let o = (n) => {
      const i = [];
      let l = 0,
        p = 0,
        d = 0,
        f;
      for (let v = 0; v < n.length; v++) {
        let w = n[v];
        if (l === 0 && p === 0) {
          if (w === ae) {
            i.push(n.slice(d, v)), (d = v + Be);
            continue;
          }
          if (w === '/') {
            f = v;
            continue;
          }
        }
        w === '[' ? l++ : w === ']' ? l-- : w === '(' ? p++ : w === ')' && p--;
      }
      const g = i.length === 0 ? n : n.substring(d),
        y = Ue(g),
        C = y !== g,
        P = f && f > d ? f - d : void 0;
      return {
        modifiers: i,
        hasImportantModifier: C,
        baseClassName: y,
        maybePostfixModifierPosition: P,
      };
    };
    if (t) {
      const n = t + ae,
        i = o;
      o = (l) =>
        l.startsWith(n)
          ? i(l.substring(n.length))
          : {
              isExternal: !0,
              modifiers: [],
              hasImportantModifier: !1,
              baseClassName: l,
              maybePostfixModifierPosition: void 0,
            };
    }
    if (r) {
      const n = o;
      o = (i) => r({ className: i, parseClassName: n });
    }
    return o;
  },
  Ue = (e) =>
    e.endsWith(se)
      ? e.substring(0, e.length - 1)
      : e.startsWith(se)
      ? e.substring(1)
      : e,
  qe = (e) => {
    const t = Object.fromEntries(e.orderSensitiveModifiers.map((o) => [o, !0]));
    return (o) => {
      if (o.length <= 1) return o;
      const n = [];
      let i = [];
      return (
        o.forEach((l) => {
          l[0] === '[' || t[l] ? (n.push(...i.sort(), l), (i = [])) : i.push(l);
        }),
        n.push(...i.sort()),
        n
      );
    };
  },
  De = (e) => ({
    cache: We(e.cacheSize),
    parseClassName: $e(e),
    sortModifiers: qe(e),
    ...Oe(e),
  }),
  He = /\s+/,
  Je = (e, t) => {
    const {
        parseClassName: r,
        getClassGroupId: o,
        getConflictingClassGroupIds: n,
        sortModifiers: i,
      } = t,
      l = [],
      p = e.trim().split(He);
    let d = '';
    for (let f = p.length - 1; f >= 0; f -= 1) {
      const g = p[f],
        {
          isExternal: y,
          modifiers: C,
          hasImportantModifier: P,
          baseClassName: v,
          maybePostfixModifierPosition: w,
        } = r(g);
      if (y) {
        d = g + (d.length > 0 ? ' ' + d : d);
        continue;
      }
      let S = !!w,
        E = o(S ? v.substring(0, w) : v);
      if (!E) {
        if (!S) {
          d = g + (d.length > 0 ? ' ' + d : d);
          continue;
        }
        if (((E = o(v)), !E)) {
          d = g + (d.length > 0 ? ' ' + d : d);
          continue;
        }
        S = !1;
      }
      const U = i(C).join(':'),
        W = P ? U + se : U,
        T = W + E;
      if (l.includes(T)) continue;
      l.push(T);
      const j = n(E, S);
      for (let V = 0; V < j.length; ++V) {
        const B = j[V];
        l.push(W + B);
      }
      d = g + (d.length > 0 ? ' ' + d : d);
    }
    return d;
  };
function Ke() {
  let e = 0,
    t,
    r,
    o = '';
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = Ae(t)) && (o && (o += ' '), (o += r));
  return o;
}
const Ae = (e) => {
  if (typeof e == 'string') return e;
  let t,
    r = '';
  for (let o = 0; o < e.length; o++)
    e[o] && (t = Ae(e[o])) && (r && (r += ' '), (r += t));
  return r;
};
function Xe(e, ...t) {
  let r,
    o,
    n,
    i = l;
  function l(d) {
    const f = t.reduce((g, y) => y(g), e());
    return (r = De(f)), (o = r.cache.get), (n = r.cache.set), (i = p), p(d);
  }
  function p(d) {
    const f = o(d);
    if (f) return f;
    const g = Je(d, r);
    return n(d, g), g;
  }
  return function () {
    return i(Ke.apply(null, arguments));
  };
}
const b = (e) => {
    const t = (r) => r[e] || [];
    return (t.isThemeGetter = !0), t;
  },
  Me = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  Re = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  Ze = /^\d+\/\d+$/,
  Qe = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  Ye =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  er = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,
  rr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  or =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  _ = (e) => Ze.test(e),
  u = (e) => !!e && !Number.isNaN(Number(e)),
  I = (e) => !!e && Number.isInteger(Number(e)),
  oe = (e) => e.endsWith('%') && u(e.slice(0, -1)),
  R = (e) => Qe.test(e),
  tr = () => !0,
  nr = (e) => Ye.test(e) && !er.test(e),
  Ie = () => !1,
  sr = (e) => rr.test(e),
  ar = (e) => or.test(e),
  ir = (e) => !s(e) && !a(e),
  lr = (e) => L(e, Ve, Ie),
  s = (e) => Me.test(e),
  N = (e) => L(e, Ge, nr),
  te = (e) => L(e, pr, u),
  ye = (e) => L(e, Pe, Ie),
  cr = (e) => L(e, Ee, ar),
  X = (e) => L(e, Ne, sr),
  a = (e) => Re.test(e),
  $ = (e) => F(e, Ge),
  dr = (e) => F(e, fr),
  xe = (e) => F(e, Pe),
  mr = (e) => F(e, Ve),
  ur = (e) => F(e, Ee),
  Z = (e) => F(e, Ne, !0),
  L = (e, t, r) => {
    const o = Me.exec(e);
    return o ? (o[1] ? t(o[1]) : r(o[2])) : !1;
  },
  F = (e, t, r = !1) => {
    const o = Re.exec(e);
    return o ? (o[1] ? t(o[1]) : r) : !1;
  },
  Pe = (e) => e === 'position' || e === 'percentage',
  Ee = (e) => e === 'image' || e === 'url',
  Ve = (e) => e === 'length' || e === 'size' || e === 'bg-size',
  Ge = (e) => e === 'length',
  pr = (e) => e === 'number',
  fr = (e) => e === 'family-name',
  Ne = (e) => e === 'shadow',
  gr = () => {
    const e = b('color'),
      t = b('font'),
      r = b('text'),
      o = b('font-weight'),
      n = b('tracking'),
      i = b('leading'),
      l = b('breakpoint'),
      p = b('container'),
      d = b('spacing'),
      f = b('radius'),
      g = b('shadow'),
      y = b('inset-shadow'),
      C = b('text-shadow'),
      P = b('drop-shadow'),
      v = b('blur'),
      w = b('perspective'),
      S = b('aspect'),
      E = b('ease'),
      U = b('animate'),
      W = () => [
        'auto',
        'avoid',
        'all',
        'avoid-page',
        'page',
        'left',
        'right',
        'column',
      ],
      T = () => [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'left-top',
        'top-right',
        'right-top',
        'bottom-right',
        'right-bottom',
        'bottom-left',
        'left-bottom',
      ],
      j = () => [...T(), a, s],
      V = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
      B = () => ['auto', 'contain', 'none'],
      m = () => [a, s, d],
      A = () => [_, 'full', 'auto', ...m()],
      le = () => [I, 'none', 'subgrid', a, s],
      ce = () => ['auto', { span: ['full', I, a, s] }, I, a, s],
      q = () => [I, 'auto', a, s],
      de = () => ['auto', 'min', 'max', 'fr', a, s],
      Y = () => [
        'start',
        'end',
        'center',
        'between',
        'around',
        'evenly',
        'stretch',
        'baseline',
        'center-safe',
        'end-safe',
      ],
      O = () => [
        'start',
        'end',
        'center',
        'stretch',
        'center-safe',
        'end-safe',
      ],
      M = () => ['auto', ...m()],
      G = () => [
        _,
        'auto',
        'full',
        'dvw',
        'dvh',
        'lvw',
        'lvh',
        'svw',
        'svh',
        'min',
        'max',
        'fit',
        ...m(),
      ],
      c = () => [e, a, s],
      me = () => [...T(), xe, ye, { position: [a, s] }],
      ue = () => ['no-repeat', { repeat: ['', 'x', 'y', 'space', 'round'] }],
      pe = () => ['auto', 'cover', 'contain', mr, lr, { size: [a, s] }],
      ee = () => [oe, $, N],
      x = () => ['', 'none', 'full', f, a, s],
      z = () => ['', u, $, N],
      D = () => ['solid', 'dashed', 'dotted', 'double'],
      fe = () => [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ],
      h = () => [u, oe, xe, ye],
      ge = () => ['', 'none', v, a, s],
      H = () => ['none', u, a, s],
      J = () => ['none', u, a, s],
      re = () => [u, a, s],
      K = () => [_, 'full', ...m()];
    return {
      cacheSize: 500,
      theme: {
        animate: ['spin', 'ping', 'pulse', 'bounce'],
        aspect: ['video'],
        blur: [R],
        breakpoint: [R],
        color: [tr],
        container: [R],
        'drop-shadow': [R],
        ease: ['in', 'out', 'in-out'],
        font: [ir],
        'font-weight': [
          'thin',
          'extralight',
          'light',
          'normal',
          'medium',
          'semibold',
          'bold',
          'extrabold',
          'black',
        ],
        'inset-shadow': [R],
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
        perspective: [
          'dramatic',
          'near',
          'normal',
          'midrange',
          'distant',
          'none',
        ],
        radius: [R],
        shadow: [R],
        spacing: ['px', u],
        text: [R],
        'text-shadow': [R],
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
      },
      classGroups: {
        aspect: [{ aspect: ['auto', 'square', _, s, a, S] }],
        container: ['container'],
        columns: [{ columns: [u, s, a, p] }],
        'break-after': [{ 'break-after': W() }],
        'break-before': [{ 'break-before': W() }],
        'break-inside': [
          { 'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'] },
        ],
        'box-decoration': [{ 'box-decoration': ['slice', 'clone'] }],
        box: [{ box: ['border', 'content'] }],
        display: [
          'block',
          'inline-block',
          'inline',
          'flex',
          'inline-flex',
          'table',
          'inline-table',
          'table-caption',
          'table-cell',
          'table-column',
          'table-column-group',
          'table-footer-group',
          'table-header-group',
          'table-row-group',
          'table-row',
          'flow-root',
          'grid',
          'inline-grid',
          'contents',
          'list-item',
          'hidden',
        ],
        sr: ['sr-only', 'not-sr-only'],
        float: [{ float: ['right', 'left', 'none', 'start', 'end'] }],
        clear: [{ clear: ['left', 'right', 'both', 'none', 'start', 'end'] }],
        isolation: ['isolate', 'isolation-auto'],
        'object-fit': [
          { object: ['contain', 'cover', 'fill', 'none', 'scale-down'] },
        ],
        'object-position': [{ object: j() }],
        overflow: [{ overflow: V() }],
        'overflow-x': [{ 'overflow-x': V() }],
        'overflow-y': [{ 'overflow-y': V() }],
        overscroll: [{ overscroll: B() }],
        'overscroll-x': [{ 'overscroll-x': B() }],
        'overscroll-y': [{ 'overscroll-y': B() }],
        position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
        inset: [{ inset: A() }],
        'inset-x': [{ 'inset-x': A() }],
        'inset-y': [{ 'inset-y': A() }],
        start: [{ start: A() }],
        end: [{ end: A() }],
        top: [{ top: A() }],
        right: [{ right: A() }],
        bottom: [{ bottom: A() }],
        left: [{ left: A() }],
        visibility: ['visible', 'invisible', 'collapse'],
        z: [{ z: [I, 'auto', a, s] }],
        basis: [{ basis: [_, 'full', 'auto', p, ...m()] }],
        'flex-direction': [
          { flex: ['row', 'row-reverse', 'col', 'col-reverse'] },
        ],
        'flex-wrap': [{ flex: ['nowrap', 'wrap', 'wrap-reverse'] }],
        flex: [{ flex: [u, _, 'auto', 'initial', 'none', s] }],
        grow: [{ grow: ['', u, a, s] }],
        shrink: [{ shrink: ['', u, a, s] }],
        order: [{ order: [I, 'first', 'last', 'none', a, s] }],
        'grid-cols': [{ 'grid-cols': le() }],
        'col-start-end': [{ col: ce() }],
        'col-start': [{ 'col-start': q() }],
        'col-end': [{ 'col-end': q() }],
        'grid-rows': [{ 'grid-rows': le() }],
        'row-start-end': [{ row: ce() }],
        'row-start': [{ 'row-start': q() }],
        'row-end': [{ 'row-end': q() }],
        'grid-flow': [
          { 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] },
        ],
        'auto-cols': [{ 'auto-cols': de() }],
        'auto-rows': [{ 'auto-rows': de() }],
        gap: [{ gap: m() }],
        'gap-x': [{ 'gap-x': m() }],
        'gap-y': [{ 'gap-y': m() }],
        'justify-content': [{ justify: [...Y(), 'normal'] }],
        'justify-items': [{ 'justify-items': [...O(), 'normal'] }],
        'justify-self': [{ 'justify-self': ['auto', ...O()] }],
        'align-content': [{ content: ['normal', ...Y()] }],
        'align-items': [{ items: [...O(), { baseline: ['', 'last'] }] }],
        'align-self': [{ self: ['auto', ...O(), { baseline: ['', 'last'] }] }],
        'place-content': [{ 'place-content': Y() }],
        'place-items': [{ 'place-items': [...O(), 'baseline'] }],
        'place-self': [{ 'place-self': ['auto', ...O()] }],
        p: [{ p: m() }],
        px: [{ px: m() }],
        py: [{ py: m() }],
        ps: [{ ps: m() }],
        pe: [{ pe: m() }],
        pt: [{ pt: m() }],
        pr: [{ pr: m() }],
        pb: [{ pb: m() }],
        pl: [{ pl: m() }],
        m: [{ m: M() }],
        mx: [{ mx: M() }],
        my: [{ my: M() }],
        ms: [{ ms: M() }],
        me: [{ me: M() }],
        mt: [{ mt: M() }],
        mr: [{ mr: M() }],
        mb: [{ mb: M() }],
        ml: [{ ml: M() }],
        'space-x': [{ 'space-x': m() }],
        'space-x-reverse': ['space-x-reverse'],
        'space-y': [{ 'space-y': m() }],
        'space-y-reverse': ['space-y-reverse'],
        size: [{ size: G() }],
        w: [{ w: [p, 'screen', ...G()] }],
        'min-w': [{ 'min-w': [p, 'screen', 'none', ...G()] }],
        'max-w': [
          { 'max-w': [p, 'screen', 'none', 'prose', { screen: [l] }, ...G()] },
        ],
        h: [{ h: ['screen', 'lh', ...G()] }],
        'min-h': [{ 'min-h': ['screen', 'lh', 'none', ...G()] }],
        'max-h': [{ 'max-h': ['screen', 'lh', ...G()] }],
        'font-size': [{ text: ['base', r, $, N] }],
        'font-smoothing': ['antialiased', 'subpixel-antialiased'],
        'font-style': ['italic', 'not-italic'],
        'font-weight': [{ font: [o, a, te] }],
        'font-stretch': [
          {
            'font-stretch': [
              'ultra-condensed',
              'extra-condensed',
              'condensed',
              'semi-condensed',
              'normal',
              'semi-expanded',
              'expanded',
              'extra-expanded',
              'ultra-expanded',
              oe,
              s,
            ],
          },
        ],
        'font-family': [{ font: [dr, s, t] }],
        'fvn-normal': ['normal-nums'],
        'fvn-ordinal': ['ordinal'],
        'fvn-slashed-zero': ['slashed-zero'],
        'fvn-figure': ['lining-nums', 'oldstyle-nums'],
        'fvn-spacing': ['proportional-nums', 'tabular-nums'],
        'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
        tracking: [{ tracking: [n, a, s] }],
        'line-clamp': [{ 'line-clamp': [u, 'none', a, te] }],
        leading: [{ leading: [i, ...m()] }],
        'list-image': [{ 'list-image': ['none', a, s] }],
        'list-style-position': [{ list: ['inside', 'outside'] }],
        'list-style-type': [{ list: ['disc', 'decimal', 'none', a, s] }],
        'text-alignment': [
          { text: ['left', 'center', 'right', 'justify', 'start', 'end'] },
        ],
        'placeholder-color': [{ placeholder: c() }],
        'text-color': [{ text: c() }],
        'text-decoration': [
          'underline',
          'overline',
          'line-through',
          'no-underline',
        ],
        'text-decoration-style': [{ decoration: [...D(), 'wavy'] }],
        'text-decoration-thickness': [
          { decoration: [u, 'from-font', 'auto', a, N] },
        ],
        'text-decoration-color': [{ decoration: c() }],
        'underline-offset': [{ 'underline-offset': [u, 'auto', a, s] }],
        'text-transform': [
          'uppercase',
          'lowercase',
          'capitalize',
          'normal-case',
        ],
        'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
        'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
        indent: [{ indent: m() }],
        'vertical-align': [
          {
            align: [
              'baseline',
              'top',
              'middle',
              'bottom',
              'text-top',
              'text-bottom',
              'sub',
              'super',
              a,
              s,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              'normal',
              'nowrap',
              'pre',
              'pre-line',
              'pre-wrap',
              'break-spaces',
            ],
          },
        ],
        break: [{ break: ['normal', 'words', 'all', 'keep'] }],
        wrap: [{ wrap: ['break-word', 'anywhere', 'normal'] }],
        hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
        content: [{ content: ['none', a, s] }],
        'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
        'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
        'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
        'bg-position': [{ bg: me() }],
        'bg-repeat': [{ bg: ue() }],
        'bg-size': [{ bg: pe() }],
        'bg-image': [
          {
            bg: [
              'none',
              {
                linear: [
                  { to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] },
                  I,
                  a,
                  s,
                ],
                radial: ['', a, s],
                conic: [I, a, s],
              },
              ur,
              cr,
            ],
          },
        ],
        'bg-color': [{ bg: c() }],
        'gradient-from-pos': [{ from: ee() }],
        'gradient-via-pos': [{ via: ee() }],
        'gradient-to-pos': [{ to: ee() }],
        'gradient-from': [{ from: c() }],
        'gradient-via': [{ via: c() }],
        'gradient-to': [{ to: c() }],
        rounded: [{ rounded: x() }],
        'rounded-s': [{ 'rounded-s': x() }],
        'rounded-e': [{ 'rounded-e': x() }],
        'rounded-t': [{ 'rounded-t': x() }],
        'rounded-r': [{ 'rounded-r': x() }],
        'rounded-b': [{ 'rounded-b': x() }],
        'rounded-l': [{ 'rounded-l': x() }],
        'rounded-ss': [{ 'rounded-ss': x() }],
        'rounded-se': [{ 'rounded-se': x() }],
        'rounded-ee': [{ 'rounded-ee': x() }],
        'rounded-es': [{ 'rounded-es': x() }],
        'rounded-tl': [{ 'rounded-tl': x() }],
        'rounded-tr': [{ 'rounded-tr': x() }],
        'rounded-br': [{ 'rounded-br': x() }],
        'rounded-bl': [{ 'rounded-bl': x() }],
        'border-w': [{ border: z() }],
        'border-w-x': [{ 'border-x': z() }],
        'border-w-y': [{ 'border-y': z() }],
        'border-w-s': [{ 'border-s': z() }],
        'border-w-e': [{ 'border-e': z() }],
        'border-w-t': [{ 'border-t': z() }],
        'border-w-r': [{ 'border-r': z() }],
        'border-w-b': [{ 'border-b': z() }],
        'border-w-l': [{ 'border-l': z() }],
        'divide-x': [{ 'divide-x': z() }],
        'divide-x-reverse': ['divide-x-reverse'],
        'divide-y': [{ 'divide-y': z() }],
        'divide-y-reverse': ['divide-y-reverse'],
        'border-style': [{ border: [...D(), 'hidden', 'none'] }],
        'divide-style': [{ divide: [...D(), 'hidden', 'none'] }],
        'border-color': [{ border: c() }],
        'border-color-x': [{ 'border-x': c() }],
        'border-color-y': [{ 'border-y': c() }],
        'border-color-s': [{ 'border-s': c() }],
        'border-color-e': [{ 'border-e': c() }],
        'border-color-t': [{ 'border-t': c() }],
        'border-color-r': [{ 'border-r': c() }],
        'border-color-b': [{ 'border-b': c() }],
        'border-color-l': [{ 'border-l': c() }],
        'divide-color': [{ divide: c() }],
        'outline-style': [{ outline: [...D(), 'none', 'hidden'] }],
        'outline-offset': [{ 'outline-offset': [u, a, s] }],
        'outline-w': [{ outline: ['', u, $, N] }],
        'outline-color': [{ outline: c() }],
        shadow: [{ shadow: ['', 'none', g, Z, X] }],
        'shadow-color': [{ shadow: c() }],
        'inset-shadow': [{ 'inset-shadow': ['none', y, Z, X] }],
        'inset-shadow-color': [{ 'inset-shadow': c() }],
        'ring-w': [{ ring: z() }],
        'ring-w-inset': ['ring-inset'],
        'ring-color': [{ ring: c() }],
        'ring-offset-w': [{ 'ring-offset': [u, N] }],
        'ring-offset-color': [{ 'ring-offset': c() }],
        'inset-ring-w': [{ 'inset-ring': z() }],
        'inset-ring-color': [{ 'inset-ring': c() }],
        'text-shadow': [{ 'text-shadow': ['none', C, Z, X] }],
        'text-shadow-color': [{ 'text-shadow': c() }],
        opacity: [{ opacity: [u, a, s] }],
        'mix-blend': [
          { 'mix-blend': [...fe(), 'plus-darker', 'plus-lighter'] },
        ],
        'bg-blend': [{ 'bg-blend': fe() }],
        'mask-clip': [
          {
            'mask-clip': [
              'border',
              'padding',
              'content',
              'fill',
              'stroke',
              'view',
            ],
          },
          'mask-no-clip',
        ],
        'mask-composite': [
          { mask: ['add', 'subtract', 'intersect', 'exclude'] },
        ],
        'mask-image-linear-pos': [{ 'mask-linear': [u] }],
        'mask-image-linear-from-pos': [{ 'mask-linear-from': h() }],
        'mask-image-linear-to-pos': [{ 'mask-linear-to': h() }],
        'mask-image-linear-from-color': [{ 'mask-linear-from': c() }],
        'mask-image-linear-to-color': [{ 'mask-linear-to': c() }],
        'mask-image-t-from-pos': [{ 'mask-t-from': h() }],
        'mask-image-t-to-pos': [{ 'mask-t-to': h() }],
        'mask-image-t-from-color': [{ 'mask-t-from': c() }],
        'mask-image-t-to-color': [{ 'mask-t-to': c() }],
        'mask-image-r-from-pos': [{ 'mask-r-from': h() }],
        'mask-image-r-to-pos': [{ 'mask-r-to': h() }],
        'mask-image-r-from-color': [{ 'mask-r-from': c() }],
        'mask-image-r-to-color': [{ 'mask-r-to': c() }],
        'mask-image-b-from-pos': [{ 'mask-b-from': h() }],
        'mask-image-b-to-pos': [{ 'mask-b-to': h() }],
        'mask-image-b-from-color': [{ 'mask-b-from': c() }],
        'mask-image-b-to-color': [{ 'mask-b-to': c() }],
        'mask-image-l-from-pos': [{ 'mask-l-from': h() }],
        'mask-image-l-to-pos': [{ 'mask-l-to': h() }],
        'mask-image-l-from-color': [{ 'mask-l-from': c() }],
        'mask-image-l-to-color': [{ 'mask-l-to': c() }],
        'mask-image-x-from-pos': [{ 'mask-x-from': h() }],
        'mask-image-x-to-pos': [{ 'mask-x-to': h() }],
        'mask-image-x-from-color': [{ 'mask-x-from': c() }],
        'mask-image-x-to-color': [{ 'mask-x-to': c() }],
        'mask-image-y-from-pos': [{ 'mask-y-from': h() }],
        'mask-image-y-to-pos': [{ 'mask-y-to': h() }],
        'mask-image-y-from-color': [{ 'mask-y-from': c() }],
        'mask-image-y-to-color': [{ 'mask-y-to': c() }],
        'mask-image-radial': [{ 'mask-radial': [a, s] }],
        'mask-image-radial-from-pos': [{ 'mask-radial-from': h() }],
        'mask-image-radial-to-pos': [{ 'mask-radial-to': h() }],
        'mask-image-radial-from-color': [{ 'mask-radial-from': c() }],
        'mask-image-radial-to-color': [{ 'mask-radial-to': c() }],
        'mask-image-radial-shape': [{ 'mask-radial': ['circle', 'ellipse'] }],
        'mask-image-radial-size': [
          {
            'mask-radial': [
              { closest: ['side', 'corner'], farthest: ['side', 'corner'] },
            ],
          },
        ],
        'mask-image-radial-pos': [{ 'mask-radial-at': T() }],
        'mask-image-conic-pos': [{ 'mask-conic': [u] }],
        'mask-image-conic-from-pos': [{ 'mask-conic-from': h() }],
        'mask-image-conic-to-pos': [{ 'mask-conic-to': h() }],
        'mask-image-conic-from-color': [{ 'mask-conic-from': c() }],
        'mask-image-conic-to-color': [{ 'mask-conic-to': c() }],
        'mask-mode': [{ mask: ['alpha', 'luminance', 'match'] }],
        'mask-origin': [
          {
            'mask-origin': [
              'border',
              'padding',
              'content',
              'fill',
              'stroke',
              'view',
            ],
          },
        ],
        'mask-position': [{ mask: me() }],
        'mask-repeat': [{ mask: ue() }],
        'mask-size': [{ mask: pe() }],
        'mask-type': [{ 'mask-type': ['alpha', 'luminance'] }],
        'mask-image': [{ mask: ['none', a, s] }],
        filter: [{ filter: ['', 'none', a, s] }],
        blur: [{ blur: ge() }],
        brightness: [{ brightness: [u, a, s] }],
        contrast: [{ contrast: [u, a, s] }],
        'drop-shadow': [{ 'drop-shadow': ['', 'none', P, Z, X] }],
        'drop-shadow-color': [{ 'drop-shadow': c() }],
        grayscale: [{ grayscale: ['', u, a, s] }],
        'hue-rotate': [{ 'hue-rotate': [u, a, s] }],
        invert: [{ invert: ['', u, a, s] }],
        saturate: [{ saturate: [u, a, s] }],
        sepia: [{ sepia: ['', u, a, s] }],
        'backdrop-filter': [{ 'backdrop-filter': ['', 'none', a, s] }],
        'backdrop-blur': [{ 'backdrop-blur': ge() }],
        'backdrop-brightness': [{ 'backdrop-brightness': [u, a, s] }],
        'backdrop-contrast': [{ 'backdrop-contrast': [u, a, s] }],
        'backdrop-grayscale': [{ 'backdrop-grayscale': ['', u, a, s] }],
        'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [u, a, s] }],
        'backdrop-invert': [{ 'backdrop-invert': ['', u, a, s] }],
        'backdrop-opacity': [{ 'backdrop-opacity': [u, a, s] }],
        'backdrop-saturate': [{ 'backdrop-saturate': [u, a, s] }],
        'backdrop-sepia': [{ 'backdrop-sepia': ['', u, a, s] }],
        'border-collapse': [{ border: ['collapse', 'separate'] }],
        'border-spacing': [{ 'border-spacing': m() }],
        'border-spacing-x': [{ 'border-spacing-x': m() }],
        'border-spacing-y': [{ 'border-spacing-y': m() }],
        'table-layout': [{ table: ['auto', 'fixed'] }],
        caption: [{ caption: ['top', 'bottom'] }],
        transition: [
          {
            transition: [
              '',
              'all',
              'colors',
              'opacity',
              'shadow',
              'transform',
              'none',
              a,
              s,
            ],
          },
        ],
        'transition-behavior': [{ transition: ['normal', 'discrete'] }],
        duration: [{ duration: [u, 'initial', a, s] }],
        ease: [{ ease: ['linear', 'initial', E, a, s] }],
        delay: [{ delay: [u, a, s] }],
        animate: [{ animate: ['none', U, a, s] }],
        backface: [{ backface: ['hidden', 'visible'] }],
        perspective: [{ perspective: [w, a, s] }],
        'perspective-origin': [{ 'perspective-origin': j() }],
        rotate: [{ rotate: H() }],
        'rotate-x': [{ 'rotate-x': H() }],
        'rotate-y': [{ 'rotate-y': H() }],
        'rotate-z': [{ 'rotate-z': H() }],
        scale: [{ scale: J() }],
        'scale-x': [{ 'scale-x': J() }],
        'scale-y': [{ 'scale-y': J() }],
        'scale-z': [{ 'scale-z': J() }],
        'scale-3d': ['scale-3d'],
        skew: [{ skew: re() }],
        'skew-x': [{ 'skew-x': re() }],
        'skew-y': [{ 'skew-y': re() }],
        transform: [{ transform: [a, s, '', 'none', 'gpu', 'cpu'] }],
        'transform-origin': [{ origin: j() }],
        'transform-style': [{ transform: ['3d', 'flat'] }],
        translate: [{ translate: K() }],
        'translate-x': [{ 'translate-x': K() }],
        'translate-y': [{ 'translate-y': K() }],
        'translate-z': [{ 'translate-z': K() }],
        'translate-none': ['translate-none'],
        accent: [{ accent: c() }],
        appearance: [{ appearance: ['none', 'auto'] }],
        'caret-color': [{ caret: c() }],
        'color-scheme': [
          {
            scheme: [
              'normal',
              'dark',
              'light',
              'light-dark',
              'only-dark',
              'only-light',
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              'auto',
              'default',
              'pointer',
              'wait',
              'text',
              'move',
              'help',
              'not-allowed',
              'none',
              'context-menu',
              'progress',
              'cell',
              'crosshair',
              'vertical-text',
              'alias',
              'copy',
              'no-drop',
              'grab',
              'grabbing',
              'all-scroll',
              'col-resize',
              'row-resize',
              'n-resize',
              'e-resize',
              's-resize',
              'w-resize',
              'ne-resize',
              'nw-resize',
              'se-resize',
              'sw-resize',
              'ew-resize',
              'ns-resize',
              'nesw-resize',
              'nwse-resize',
              'zoom-in',
              'zoom-out',
              a,
              s,
            ],
          },
        ],
        'field-sizing': [{ 'field-sizing': ['fixed', 'content'] }],
        'pointer-events': [{ 'pointer-events': ['auto', 'none'] }],
        resize: [{ resize: ['none', '', 'y', 'x'] }],
        'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
        'scroll-m': [{ 'scroll-m': m() }],
        'scroll-mx': [{ 'scroll-mx': m() }],
        'scroll-my': [{ 'scroll-my': m() }],
        'scroll-ms': [{ 'scroll-ms': m() }],
        'scroll-me': [{ 'scroll-me': m() }],
        'scroll-mt': [{ 'scroll-mt': m() }],
        'scroll-mr': [{ 'scroll-mr': m() }],
        'scroll-mb': [{ 'scroll-mb': m() }],
        'scroll-ml': [{ 'scroll-ml': m() }],
        'scroll-p': [{ 'scroll-p': m() }],
        'scroll-px': [{ 'scroll-px': m() }],
        'scroll-py': [{ 'scroll-py': m() }],
        'scroll-ps': [{ 'scroll-ps': m() }],
        'scroll-pe': [{ 'scroll-pe': m() }],
        'scroll-pt': [{ 'scroll-pt': m() }],
        'scroll-pr': [{ 'scroll-pr': m() }],
        'scroll-pb': [{ 'scroll-pb': m() }],
        'scroll-pl': [{ 'scroll-pl': m() }],
        'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
        'snap-stop': [{ snap: ['normal', 'always'] }],
        'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
        'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
        touch: [{ touch: ['auto', 'none', 'manipulation'] }],
        'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
        'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
        'touch-pz': ['touch-pinch-zoom'],
        select: [{ select: ['none', 'text', 'all', 'auto'] }],
        'will-change': [
          { 'will-change': ['auto', 'scroll', 'contents', 'transform', a, s] },
        ],
        fill: [{ fill: ['none', ...c()] }],
        'stroke-w': [{ stroke: [u, $, N, te] }],
        stroke: [{ stroke: ['none', ...c()] }],
        'forced-color-adjust': [{ 'forced-color-adjust': ['auto', 'none'] }],
      },
      conflictingClassGroups: {
        overflow: ['overflow-x', 'overflow-y'],
        overscroll: ['overscroll-x', 'overscroll-y'],
        inset: [
          'inset-x',
          'inset-y',
          'start',
          'end',
          'top',
          'right',
          'bottom',
          'left',
        ],
        'inset-x': ['right', 'left'],
        'inset-y': ['top', 'bottom'],
        flex: ['basis', 'grow', 'shrink'],
        gap: ['gap-x', 'gap-y'],
        p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
        px: ['pr', 'pl'],
        py: ['pt', 'pb'],
        m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
        mx: ['mr', 'ml'],
        my: ['mt', 'mb'],
        size: ['w', 'h'],
        'font-size': ['leading'],
        'fvn-normal': [
          'fvn-ordinal',
          'fvn-slashed-zero',
          'fvn-figure',
          'fvn-spacing',
          'fvn-fraction',
        ],
        'fvn-ordinal': ['fvn-normal'],
        'fvn-slashed-zero': ['fvn-normal'],
        'fvn-figure': ['fvn-normal'],
        'fvn-spacing': ['fvn-normal'],
        'fvn-fraction': ['fvn-normal'],
        'line-clamp': ['display', 'overflow'],
        rounded: [
          'rounded-s',
          'rounded-e',
          'rounded-t',
          'rounded-r',
          'rounded-b',
          'rounded-l',
          'rounded-ss',
          'rounded-se',
          'rounded-ee',
          'rounded-es',
          'rounded-tl',
          'rounded-tr',
          'rounded-br',
          'rounded-bl',
        ],
        'rounded-s': ['rounded-ss', 'rounded-es'],
        'rounded-e': ['rounded-se', 'rounded-ee'],
        'rounded-t': ['rounded-tl', 'rounded-tr'],
        'rounded-r': ['rounded-tr', 'rounded-br'],
        'rounded-b': ['rounded-br', 'rounded-bl'],
        'rounded-l': ['rounded-tl', 'rounded-bl'],
        'border-spacing': ['border-spacing-x', 'border-spacing-y'],
        'border-w': [
          'border-w-x',
          'border-w-y',
          'border-w-s',
          'border-w-e',
          'border-w-t',
          'border-w-r',
          'border-w-b',
          'border-w-l',
        ],
        'border-w-x': ['border-w-r', 'border-w-l'],
        'border-w-y': ['border-w-t', 'border-w-b'],
        'border-color': [
          'border-color-x',
          'border-color-y',
          'border-color-s',
          'border-color-e',
          'border-color-t',
          'border-color-r',
          'border-color-b',
          'border-color-l',
        ],
        'border-color-x': ['border-color-r', 'border-color-l'],
        'border-color-y': ['border-color-t', 'border-color-b'],
        translate: ['translate-x', 'translate-y', 'translate-none'],
        'translate-none': [
          'translate',
          'translate-x',
          'translate-y',
          'translate-z',
        ],
        'scroll-m': [
          'scroll-mx',
          'scroll-my',
          'scroll-ms',
          'scroll-me',
          'scroll-mt',
          'scroll-mr',
          'scroll-mb',
          'scroll-ml',
        ],
        'scroll-mx': ['scroll-mr', 'scroll-ml'],
        'scroll-my': ['scroll-mt', 'scroll-mb'],
        'scroll-p': [
          'scroll-px',
          'scroll-py',
          'scroll-ps',
          'scroll-pe',
          'scroll-pt',
          'scroll-pr',
          'scroll-pb',
          'scroll-pl',
        ],
        'scroll-px': ['scroll-pr', 'scroll-pl'],
        'scroll-py': ['scroll-pt', 'scroll-pb'],
        touch: ['touch-x', 'touch-y', 'touch-pz'],
        'touch-x': ['touch'],
        'touch-y': ['touch'],
        'touch-pz': ['touch'],
      },
      conflictingClassGroupModifiers: { 'font-size': ['leading'] },
      orderSensitiveModifiers: [
        '*',
        '**',
        'after',
        'backdrop',
        'before',
        'details-content',
        'file',
        'first-letter',
        'first-line',
        'marker',
        'placeholder',
        'selection',
      ],
    };
  },
  br = Xe(gr);
function Te(...e) {
  return br(Ce(e));
}
function ve(e, t) {
  if (typeof e == 'function') return e(t);
  e != null && (e.current = t);
}
function hr(...e) {
  return (t) => {
    let r = !1;
    const o = e.map((n) => {
      const i = ve(n, t);
      return !r && typeof i == 'function' && (r = !0), i;
    });
    if (r)
      return () => {
        for (let n = 0; n < o.length; n++) {
          const i = o[n];
          typeof i == 'function' ? i() : ve(e[n], null);
        }
      };
  };
}
function yr(e) {
  const t = vr(e),
    r = k.forwardRef((o, n) => {
      const { children: i, ...l } = o,
        p = k.Children.toArray(i),
        d = p.find(kr);
      if (d) {
        const f = d.props.children,
          g = p.map((y) =>
            y === d
              ? k.Children.count(f) > 1
                ? k.Children.only(null)
                : k.isValidElement(f)
                ? f.props.children
                : null
              : y
          );
        return Q.jsx(t, {
          ...l,
          ref: n,
          children: k.isValidElement(f) ? k.cloneElement(f, void 0, g) : null,
        });
      }
      return Q.jsx(t, { ...l, ref: n, children: i });
    });
  return (r.displayName = `${e}.Slot`), r;
}
var xr = yr('Slot');
function vr(e) {
  const t = k.forwardRef((r, o) => {
    const { children: n, ...i } = r;
    if (k.isValidElement(n)) {
      const l = Cr(n),
        p = zr(i, n.props);
      return (
        n.type !== k.Fragment && (p.ref = o ? hr(o, l) : l),
        k.cloneElement(n, p)
      );
    }
    return k.Children.count(n) > 1 ? k.Children.only(null) : null;
  });
  return (t.displayName = `${e}.SlotClone`), t;
}
var wr = Symbol('radix.slottable');
function kr(e) {
  return (
    k.isValidElement(e) &&
    typeof e.type == 'function' &&
    '__radixId' in e.type &&
    e.type.__radixId === wr
  );
}
function zr(e, t) {
  const r = { ...t };
  for (const o in t) {
    const n = e[o],
      i = t[o];
    /^on[A-Z]/.test(o)
      ? n && i
        ? (r[o] = (...p) => {
            const d = i(...p);
            return n(...p), d;
          })
        : n && (r[o] = n)
      : o === 'style'
      ? (r[o] = { ...n, ...i })
      : o === 'className' && (r[o] = [n, i].filter(Boolean).join(' '));
  }
  return { ...e, ...r };
}
function Cr(e) {
  var o, n;
  let t =
      (o = Object.getOwnPropertyDescriptor(e.props, 'ref')) == null
        ? void 0
        : o.get,
    r = t && 'isReactWarning' in t && t.isReactWarning;
  return r
    ? e.ref
    : ((t =
        (n = Object.getOwnPropertyDescriptor(e, 'ref')) == null
          ? void 0
          : n.get),
      (r = t && 'isReactWarning' in t && t.isReactWarning),
      r ? e.props.ref : e.props.ref || e.ref);
}
const we = (e) => (typeof e == 'boolean' ? `${e}` : e === 0 ? '0' : e),
  ke = Ce,
  Sr = (e, t) => (r) => {
    var o;
    if ((t == null ? void 0 : t.variants) == null)
      return ke(
        e,
        r == null ? void 0 : r.class,
        r == null ? void 0 : r.className
      );
    const { variants: n, defaultVariants: i } = t,
      l = Object.keys(n).map((f) => {
        const g = r == null ? void 0 : r[f],
          y = i == null ? void 0 : i[f];
        if (g === null) return null;
        const C = we(g) || we(y);
        return n[f][C];
      }),
      p =
        r &&
        Object.entries(r).reduce((f, g) => {
          let [y, C] = g;
          return C === void 0 || (f[y] = C), f;
        }, {}),
      d =
        t == null || (o = t.compoundVariants) === null || o === void 0
          ? void 0
          : o.reduce((f, g) => {
              let { class: y, className: C, ...P } = g;
              return Object.entries(P).every((v) => {
                let [w, S] = v;
                return Array.isArray(S)
                  ? S.includes({ ...i, ...p }[w])
                  : { ...i, ...p }[w] === S;
              })
                ? [...f, y, C]
                : f;
            }, []);
    return ke(
      e,
      l,
      d,
      r == null ? void 0 : r.class,
      r == null ? void 0 : r.className
    );
  },
  Ar = Sr(
    'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
    {
      variants: {
        variant: {
          default:
            'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
          secondary:
            'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
          destructive:
            'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
          outline:
            'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        },
      },
      defaultVariants: { variant: 'default' },
    }
  );
function je({ className: e, variant: t, asChild: r = !1, ...o }) {
  const n = r ? xr : 'span';
  return Q.jsx(n, {
    'data-slot': 'badge',
    className: Te(Ar({ variant: t }), e),
    ...o,
  });
}
je.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'Badge',
  props: {
    asChild: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'false', computed: !1 },
    },
  },
};
function Mr({ label: e, color: t, ...r }) {
  return Q.jsx(je, {
    className: Te(`px-2 hover:brightness-90 cursor-pointer ${t}`),
    ...r,
    children: e,
  });
}
Mr.__docgenInfo = { description: '', methods: [], displayName: 'EventTag' };
export { Mr as F, Te as c };

import { j as e } from './jsx-runtime-BuEtZrLz.js';
import { c as n, F as w } from './EventTag-CFe30iYW.js';
import './iframe-Dwj53M-V.js';
function g({ className: t, ...r }) {
  return e.jsx('div', {
    'data-slot': 'card',
    className: n(
      'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
      t
    ),
    ...r,
  });
}
function x({ className: t, ...r }) {
  return e.jsx('div', {
    'data-slot': 'card-header',
    className: n(
      '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
      t
    ),
    ...r,
  });
}
function h({ className: t, ...r }) {
  return e.jsx('div', {
    'data-slot': 'card-content',
    className: n('px-6', t),
    ...r,
  });
}
g.__docgenInfo = { description: '', methods: [], displayName: 'Card' };
x.__docgenInfo = { description: '', methods: [], displayName: 'CardHeader' };
h.__docgenInfo = { description: '', methods: [], displayName: 'CardContent' };
const f = [
  { key: 'comic', label: '만화', color: 'bg-red-500' },
  { key: 'all', label: '장르무관', color: 'bg-cyan-500' },
];
function y({
  title: t,
  thumbnailSrc: r,
  dateRange: i,
  address: d,
  tagData: b,
}) {
  return e.jsxs(g, {
    className:
      'w-full max-w-sm py-0 overflow-hidden gap-0 hover:brightness-95 cursor-pointer',
    children: [
      e.jsx(x, {
        className: 'px-0',
        children: e.jsx('img', {
          className: 'w-full aspect-video object-cover',
          src: r,
          alt: 'event thumbnail',
        }),
      }),
      e.jsxs(h, {
        className: 'flex flex-col gap-0.5 pt-2 pb-4',
        children: [
          e.jsx('h1', {
            title: t,
            className: 'font-bold truncate',
            children: t,
          }),
          e.jsx('span', {
            className: 'text-xs truncate',
            children: `${i.start} ~ ${i.end}`,
          }),
          e.jsxs('section', {
            className: 'flex items-end justify-between gap-2',
            children: [
              e.jsx('address', {
                title: d,
                className: 'text-xs truncate flex-1',
                children: d,
              }),
              b.map(({ key: v, label: _, color: j }) =>
                e.jsx(w, { label: _, color: j }, v)
              ),
            ],
          }),
        ],
      }),
    ],
  });
}
y.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'EventCard',
  props: {
    title: { required: !0, tsType: { name: 'string' }, description: '' },
    thumbnailSrc: { required: !0, tsType: { name: 'string' }, description: '' },
    dateRange: {
      required: !0,
      tsType: {
        name: 'signature',
        type: 'object',
        raw: `{\r
  start: string;\r
  end: string;\r
}`,
        signature: {
          properties: [
            { key: 'start', value: { name: 'string', required: !0 } },
            { key: 'end', value: { name: 'string', required: !0 } },
          ],
        },
      },
      description: '',
    },
    address: { required: !0, tsType: { name: 'string' }, description: '' },
    tagData: {
      required: !0,
      tsType: {
        name: 'Array',
        elements: [
          {
            name: 'signature',
            type: 'object',
            raw: `{\r
  key: string;\r
  label: string;\r
  color: string;\r
}`,
            signature: {
              properties: [
                { key: 'key', value: { name: 'string', required: !0 } },
                { key: 'label', value: { name: 'string', required: !0 } },
                { key: 'color', value: { name: 'string', required: !0 } },
              ],
            },
          },
        ],
        raw: 'EventTagType[]',
      },
      description: '',
    },
  },
};
const D = {
    title: 'Event/EventCard',
    component: y,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    decorators: [
      (t) =>
        e.jsx('div', { style: { width: '1000px' }, children: e.jsx(t, {}) }),
    ],
    argTypes: {
      title: { control: 'text', description: 'event title' },
      thumbnailSrc: {
        control: 'text',
        description: 'event thumbnail image URL',
      },
      dateRange: {
        description: 'event start date, end date',
        control: 'object',
      },
      address: { control: 'text', description: 'event address' },
    },
  },
  a = {
    args: {
      title: '코믹월드 SUMMER 2025',
      dateRange: { start: '2025.07.19', end: '2025.07.20' },
      address: '일산 킨텍스 제1전시장',
      thumbnailSrc:
        'https://comicw.co.kr/data/item/1748337413/11_7J6E7Iuc7Ys7Iqk7YSw_6riw67O4.png',
      tagData: f,
    },
  },
  s = {
    args: {
      title: '가나다라마바사아자차카타파하 가나다라마바사아자차카타파하',
      dateRange: { start: '2025.07.19', end: '2025.07.20' },
      address: '여기서 저기로 가면 저기서 여기로 가고 여기서 저기로',
      thumbnailSrc: 'https://picsum.photos/600/400',
      tagData: f,
    },
  };
var o, c, l;
a.parameters = {
  ...a.parameters,
  docs: {
    ...((o = a.parameters) == null ? void 0 : o.docs),
    source: {
      originalSource: `{
  args: {
    title: '코믹월드 SUMMER 2025',
    dateRange: {
      start: '2025.07.19',
      end: '2025.07.20'
    },
    address: '일산 킨텍스 제1전시장',
    thumbnailSrc: 'https://comicw.co.kr/data/item/1748337413/11_7J6E7Iuc7Ys7Iqk7YSw_6riw67O4.png',
    tagData: DUMMY_TAG_DATA
  }
}`,
      ...((l = (c = a.parameters) == null ? void 0 : c.docs) == null
        ? void 0
        : l.source),
    },
  },
};
var p, u, m;
s.parameters = {
  ...s.parameters,
  docs: {
    ...((p = s.parameters) == null ? void 0 : p.docs),
    source: {
      originalSource: `{
  args: {
    title: '가나다라마바사아자차카타파하 가나다라마바사아자차카타파하',
    dateRange: {
      start: '2025.07.19',
      end: '2025.07.20'
    },
    address: '여기서 저기로 가면 저기서 여기로 가고 여기서 저기로',
    thumbnailSrc: 'https://picsum.photos/600/400',
    tagData: DUMMY_TAG_DATA
  }
}`,
      ...((m = (u = s.parameters) == null ? void 0 : u.docs) == null
        ? void 0
        : m.source),
    },
  },
};
const q = ['Default', 'Truncated'];
export { a as Default, s as Truncated, q as __namedExportsOrder, D as default };

import { vi } from 'vitest';

const createFontLoader = () => ({
  className: 'font-mock',
  variable: '--font-mock',
  style: {
    fontFamily: 'font-mock',
  },
});

vi.mock('next/font/google', () => ({
  Geist: createFontLoader,
  Geist_Mono: createFontLoader,
  Bebas_Neue: createFontLoader,
  Noto_Sans_KR: createFontLoader,
  Share_Tech_Mono: createFontLoader,
}));

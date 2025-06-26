import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import useIsMobile from './useIsMobile';

// Happy DOM이나 JSDOM 환경 설정 확인
/**
 * @vitest-environment jsdom
 */

describe('useIsMobile', () => {
  // 원본 객체들을 저장
  const originalWindow = global.window;
  const originalNavigator = global.navigator;

  // 각 테스트 전에 모든 모킹을 초기화
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // 원본 객체들을 복원
    global.window = originalWindow;
    global.navigator = originalNavigator;
    vi.restoreAllMocks();
  });

  it('navigator가 undefined일 때 false를 반환해야 한다', () => {
    Object.defineProperty(global, 'navigator', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  describe('모바일 디바이스 감지', () => {
    const mobileUserAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
      'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+',
      'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)',
      'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.348; U; en) Presto/2.5.25 Version/10.54',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/91.0.4472.80 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36',
    ];

    mobileUserAgents.forEach((userAgent) => {
      it(`모바일 User Agent를 감지해야 한다: ${userAgent.slice(
        0,
        50
      )}...`, () => {
        Object.defineProperty(global, 'navigator', {
          value: {
            userAgent,
            vendor: '',
          },
          writable: true,
          configurable: true,
        });

        Object.defineProperty(global, 'window', {
          value: {},
          writable: true,
          configurable: true,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(true);
      });
    });
  });

  describe('데스크탑 디바이스 감지', () => {
    const desktopUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    ];

    desktopUserAgents.forEach((userAgent) => {
      it(`데스크탑 User Agent를 감지해야 한다: ${userAgent.slice(
        0,
        50
      )}...`, () => {
        Object.defineProperty(global, 'navigator', {
          value: {
            userAgent,
            vendor: '',
          },
          writable: true,
          configurable: true,
        });

        Object.defineProperty(global, 'window', {
          value: {},
          writable: true,
          configurable: true,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);
      });
    });
  });

  describe('fallback 시나리오', () => {
    it('userAgent가 없을 때 vendor를 사용해야 한다', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: '',
          vendor: 'Apple Computer, Inc.',
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);
    });

    it('userAgent와 vendor가 모두 없을 때 window.opera를 사용해야 한다', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: '',
          vendor: '',
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(global, 'window', {
        value: {
          opera: 'Opera Mini',
        },
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
    });

    it('모든 값이 없을 때 빈 문자열을 사용해야 한다', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: '',
          vendor: '',
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('대소문자를 구분하지 않고 감지해야 한다', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'mozilla/5.0 (iphone; cpu iphone os 14_7_1 like mac os x)',
          vendor: '',
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
    });

    it('여러 모바일 키워드가 포함된 경우 감지해야 한다', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
          vendor: '',
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
    });
  });
});

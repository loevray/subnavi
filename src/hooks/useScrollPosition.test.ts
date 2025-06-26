import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useScrollPosition from './useScrollPosition';

// 윈도우 속성들 모킹
const mockWindowProperties = (props: {
  scrollY?: number;
  innerHeight?: number;
  scrollHeight?: number;
}) => {
  Object.defineProperty(window, 'scrollY', {
    value: props.scrollY ?? 0,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(window, 'innerHeight', {
    value: props.innerHeight ?? 800,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: props.scrollHeight ?? 2000,
    writable: true,
    configurable: true,
  });
};

// 스크롤 이벤트 트리거
const triggerScroll = (scrollY: number) => {
  Object.defineProperty(window, 'scrollY', {
    value: scrollY,
    writable: true,
    configurable: true,
  });
  window.dispatchEvent(new Event('scroll'));
};

// 리사이즈 이벤트 트리거
const triggerResize = (innerHeight: number, scrollHeight?: number) => {
  Object.defineProperty(window, 'innerHeight', {
    value: innerHeight,
    writable: true,
    configurable: true,
  });

  if (scrollHeight) {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: scrollHeight,
      writable: true,
      configurable: true,
    });
  }

  window.dispatchEvent(new Event('resize'));
};

describe('useScrollPosition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockWindowProperties({});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('기본 초기값을 반환해야 한다', () => {
    mockWindowProperties({ scrollY: 0, innerHeight: 800, scrollHeight: 2000 });
    const { result } = renderHook(() => useScrollPosition());

    expect(result.current).toEqual({
      scrollY: 0,
      prevScrollY: 0,
      deltaY: 0,
      absDeltaY: 0,
      isAtTop: true,
      isAtBottom: false,
      documentHeight: 2000,
      viewportHeight: 800,
      scrollableHeight: 1200,
      scrollProgress: 0,
    });
  });

  it('초기 스크롤 위치를 올바르게 설정해야 한다', () => {
    mockWindowProperties({
      scrollY: 100,
      innerHeight: 800,
      scrollHeight: 2000,
    });
    const { result } = renderHook(() => useScrollPosition());

    expect(result.current.scrollY).toBe(100);
    expect(result.current.isAtTop).toBe(false);
    expect(result.current.scrollProgress).toBe(100 / 1200);
  });

  it('스크롤 시 상태를 올바르게 업데이트해야 한다', () => {
    mockWindowProperties({ scrollY: 0, innerHeight: 800, scrollHeight: 2000 });
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      triggerScroll(100);
    });

    expect(result.current.scrollY).toBe(100);
    expect(result.current.prevScrollY).toBe(0);
    expect(result.current.deltaY).toBe(100);
    expect(result.current.absDeltaY).toBe(100);
    expect(result.current.isAtTop).toBe(false);
    expect(result.current.scrollProgress).toBe(100 / 1200);
  });

  it('연속 스크롤 시 이전 값을 올바르게 추적해야 한다', () => {
    mockWindowProperties({ scrollY: 0, innerHeight: 800, scrollHeight: 2000 });
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      triggerScroll(50);
    });

    act(() => {
      triggerScroll(150);
    });

    expect(result.current.scrollY).toBe(150);
    expect(result.current.prevScrollY).toBe(50);
    expect(result.current.deltaY).toBe(100);
    expect(result.current.absDeltaY).toBe(100);
  });

  it('위로 스크롤할 때 음수 deltaY를 반환해야 한다', () => {
    mockWindowProperties({
      scrollY: 100,
      innerHeight: 800,
      scrollHeight: 2000,
    });
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      triggerScroll(50);
    });

    expect(result.current.deltaY).toBe(-50);
    expect(result.current.absDeltaY).toBe(50);
  });

  it('페이지 최상단에서 isAtTop이 true여야 한다', () => {
    mockWindowProperties({ scrollY: 0, innerHeight: 800, scrollHeight: 2000 });
    const { result } = renderHook(() => useScrollPosition());

    expect(result.current.isAtTop).toBe(true);

    act(() => {
      triggerScroll(10);
    });

    expect(result.current.isAtTop).toBe(false);
  });

  it('페이지 최하단에서 isAtBottom이 true여야 한다', () => {
    mockWindowProperties({ scrollY: 0, innerHeight: 800, scrollHeight: 2000 });
    const { result } = renderHook(() => useScrollPosition());

    // 최하단으로 스크롤 (scrollableHeight = 2000 - 800 = 1200)
    act(() => {
      triggerScroll(1200);
    });

    expect(result.current.isAtBottom).toBe(true);
  });

  it('threshold 옵션이 올바르게 동작해야 한다', () => {
    mockWindowProperties({ scrollY: 0, innerHeight: 800, scrollHeight: 2000 });
    const { result } = renderHook(() => useScrollPosition({ threshold: 10 }));

    // threshold보다 작은 변화는 무시
    act(() => {
      triggerScroll(5);
    });

    expect(result.current.scrollY).toBe(0); // 변화 없음

    // threshold 이상의 변화는 반영
    act(() => {
      triggerScroll(15);
    });

    expect(result.current.scrollY).toBe(15);
  });

  it('threshold 옵션이 isAtTop/isAtBottom에도 적용되어야 한다', () => {
    mockWindowProperties({ scrollY: 5, innerHeight: 800, scrollHeight: 2000 });
    const { result } = renderHook(() => useScrollPosition({ threshold: 10 }));

    expect(result.current.isAtTop).toBe(true); // threshold 내에서는 최상단으로 간주

    mockWindowProperties({
      scrollY: 1195,
      innerHeight: 800,
      scrollHeight: 2000,
    });
    const { result: result2 } = renderHook(() =>
      useScrollPosition({ threshold: 10 })
    );

    expect(result2.current.isAtBottom).toBe(true); // threshold 내에서는 최하단으로 간주
  });

  it('스크롤 진행률을 올바르게 계산해야 한다', () => {
    mockWindowProperties({ scrollY: 0, innerHeight: 800, scrollHeight: 2000 });
    const { result } = renderHook(() => useScrollPosition());

    // 50% 지점
    act(() => {
      triggerScroll(600); // 1200의 50%
    });

    expect(result.current.scrollProgress).toBe(0.5);

    // 100% 지점
    act(() => {
      triggerScroll(1200);
    });

    expect(result.current.scrollProgress).toBe(1);
  });

  it('디바운스가 올바르게 동작해야 한다', () => {
    mockWindowProperties({ scrollY: 0, innerHeight: 800, scrollHeight: 2000 });
    const { result } = renderHook(() => useScrollPosition({ debounceMs: 100 }));

    act(() => {
      triggerScroll(100);
    });

    // 디바운스로 인해 즉시 업데이트되지 않음
    expect(result.current.scrollY).toBe(0);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 디바운스 시간 후 업데이트
    expect(result.current.scrollY).toBe(100);
  });

  it('리사이즈 이벤트 시 상태를 업데이트해야 한다', () => {
    mockWindowProperties({
      scrollY: 100,
      innerHeight: 800,
      scrollHeight: 2000,
    });
    const { result } = renderHook(() => useScrollPosition());

    expect(result.current.viewportHeight).toBe(800);
    expect(result.current.scrollableHeight).toBe(1200);

    act(() => {
      triggerResize(600, 1800);
    });

    expect(result.current.viewportHeight).toBe(600);
    expect(result.current.documentHeight).toBe(1800);
    expect(result.current.scrollableHeight).toBe(1200);
  });

  it('스크롤할 수 없는 짧은 페이지에서 올바르게 동작해야 한다', () => {
    mockWindowProperties({ scrollY: 0, innerHeight: 800, scrollHeight: 600 });
    const { result } = renderHook(() => useScrollPosition());

    expect(result.current.scrollableHeight).toBe(-200);
    expect(result.current.scrollProgress).toBe(0);
    expect(result.current.isAtTop).toBe(true);
    expect(result.current.isAtBottom).toBe(true);
  });
});

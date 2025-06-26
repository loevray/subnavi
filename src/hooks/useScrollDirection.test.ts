import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useScrollDirection from './useScrollDirection';

// useDebounceCallback 모킹
vi.mock('./useDebounceCallback', () => ({
  useDebounceCallback: vi.fn((callback) => callback),
}));

// window.scrollY 모킹
const mockScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', {
    value,
    writable: true,
    configurable: true,
  });
};

// 스크롤 이벤트 트리거
const triggerScroll = (scrollY: number) => {
  mockScrollY(scrollY);
  window.dispatchEvent(new Event('scroll'));
};

describe('useScrollDirection', () => {
  beforeEach(() => {
    mockScrollY(0);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('기본 초기값을 반환해야 한다', () => {
    const { result } = renderHook(() => useScrollDirection());

    expect(result.current).toEqual({
      direction: null,
      scrollY: 0,
      delta: 0,
    });
  });

  it('아래로 스크롤할 때 direction이 "down"이어야 한다', () => {
    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      triggerScroll(50);
    });

    expect(result.current.direction).toBe('down');
    expect(result.current.scrollY).toBe(50);
    expect(result.current.delta).toBe(50);
  });

  it('위로 스크롤할 때 direction이 "up"이어야 한다', () => {
    mockScrollY(100);
    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      triggerScroll(50);
    });

    expect(result.current.direction).toBe('up');
    expect(result.current.scrollY).toBe(50);
    expect(result.current.delta).toBe(-50);
  });

  it('minDelta보다 작은 스크롤은 무시해야 한다', () => {
    const { result } = renderHook(() => useScrollDirection({ minDelta: 10 }));

    act(() => {
      triggerScroll(5);
    });

    expect(result.current.direction).toBe(null);
    expect(result.current.scrollY).toBe(5);
    expect(result.current.delta).toBe(5);
  });

  it('연속 스크롤 시 상태를 올바르게 업데이트해야 한다', () => {
    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      triggerScroll(50);
    });
    expect(result.current.direction).toBe('down');
    expect(result.current.delta).toBe(50);

    act(() => {
      triggerScroll(100);
    });
    expect(result.current.direction).toBe('down');
    expect(result.current.delta).toBe(50);
  });

  it('스크롤 방향이 바뀔 때 올바르게 감지해야 한다', () => {
    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      triggerScroll(100);
    });
    expect(result.current.direction).toBe('down');

    act(() => {
      triggerScroll(50);
    });
    expect(result.current.direction).toBe('up');
    expect(result.current.delta).toBe(-50);
  });

  it('같은 위치로 스크롤할 때 direction이 null이어야 한다', () => {
    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      triggerScroll(50);
    });

    act(() => {
      triggerScroll(50);
    });

    expect(result.current.direction).toBe(null);
    expect(result.current.delta).toBe(0);
  });

  it('초기 direction 설정이 동작해야 한다', () => {
    const { result } = renderHook(() =>
      useScrollDirection({ initialDirection: 'down' })
    );

    expect(result.current.direction).toBe('down');
  });
});

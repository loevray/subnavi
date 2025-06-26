import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useDebounce from './useDebounce';

// 타이머 모킹
vi.useFakeTimers();

describe('useDebounce', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  it('초기값을 즉시 반환해야 한다', () => {
    const { result } = renderHook(() =>
      useDebounce({ value: 'initial', delay: 300 })
    );

    expect(result.current).toBe('initial');
  });

  it('지연 시간이 지나기 전에는 이전 값을 유지해야 한다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    expect(result.current).toBe('initial');

    // 값 변경
    rerender({ value: 'updated', delay: 300 });
    expect(result.current).toBe('initial'); // 아직 이전 값

    // 지연 시간의 절반만 진행
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('initial'); // 여전히 이전 값
  });

  it('지연 시간이 지난 후에는 새로운 값을 반환해야 한다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    // 값 변경
    rerender({ value: 'updated', delay: 300 });

    // 지연 시간 완전히 진행
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
  });

  it('값이 빠르게 여러 번 변경될 때 마지막 값만 반영되어야 한다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    // 빠른 연속 변경
    rerender({ value: 'first', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'second', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'third', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 아직 디바운스 시간이 지나지 않음
    expect(result.current).toBe('initial');

    // 마지막 변경으로부터 300ms 후
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('third'); // 마지막 값만 반영
  });

  it('delay가 변경되어도 정상적으로 동작해야 한다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    // 값과 지연시간 동시 변경
    rerender({ value: 'updated', delay: 500 });

    // 이전 지연시간(300ms) 후에도 아직 변경되지 않음
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // 새로운 지연시간(500ms) 후에 변경됨
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('updated');
  });

  it('숫자 타입도 정상적으로 디바운스되어야 한다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      {
        initialProps: { value: 0, delay: 300 },
      }
    );

    expect(result.current).toBe(0);

    rerender({ value: 42, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it('객체 타입도 정상적으로 디바운스되어야 한다', () => {
    const initialObj = { name: 'John', age: 25 };
    const updatedObj = { name: 'Jane', age: 30 };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      {
        initialProps: { value: initialObj, delay: 300 },
      }
    );

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(updatedObj);
  });

  it('delay가 0일 때는 즉시 값이 변경되어야 한다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      {
        initialProps: { value: 'initial', delay: 0 },
      }
    );

    rerender({ value: 'updated', delay: 0 });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('updated');
  });

  it('컴포넌트 언마운트 시 타이머가 정리되어야 한다', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce({ value, delay }),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    rerender({ value: 'updated', delay: 300 });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});

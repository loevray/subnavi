import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounceCallback } from './useDebounceCallback';

describe('useDebounceCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('기본 디바운스 기능이 정상적으로 동작해야 한다', () => {
    const callback = vi.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounceCallback(callback, delay));

    // 디바운스된 함수 호출
    act(() => {
      result.current('test1');
      result.current('test2');
      result.current('test3');
    });

    // 아직 콜백이 호출되지 않아야 함
    expect(callback).not.toHaveBeenCalled();

    // 시간을 진행
    act(() => {
      vi.advanceTimersByTime(delay);
    });

    // 마지막 호출만 실행되어야 함
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test3');
  });

  it('연속된 호출에서 이전 타이머를 취소해야 한다', () => {
    const callback = vi.fn();
    const delay = 1000;

    const { result } = renderHook(() => useDebounceCallback(callback, delay));

    // 첫 번째 호출
    act(() => {
      result.current('first');
    });

    // 500ms 후 두 번째 호출
    act(() => {
      vi.advanceTimersByTime(500);
      result.current('second');
    });

    // 첫 번째 타이머가 완료되는 시점 (1000ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 아직 콜백이 호출되지 않아야 함 (두 번째 호출로 인해 타이머가 재설정됨)
    expect(callback).not.toHaveBeenCalled();

    // 두 번째 타이머 완료 (추가로 500ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 두 번째 호출만 실행되어야 함
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });

  it('다양한 타입의 매개변수를 올바르게 처리해야 한다', () => {
    const callback = vi.fn();
    const delay = 300;

    const { result } = renderHook(() => useDebounceCallback(callback, delay));

    act(() => {
      result.current(1, 'string', { key: 'value' }, [1, 2, 3]);
    });

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledWith(
      1,
      'string',
      { key: 'value' },
      [1, 2, 3]
    );
  });

  it('콜백이 변경되면 최신 콜백을 사용해야 한다', () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();
    const delay = 500;

    const { result, rerender } = renderHook(
      ({ callback }) => useDebounceCallback(callback, delay),
      { initialProps: { callback: firstCallback } }
    );

    // 첫 번째 콜백으로 호출
    act(() => {
      result.current('test');
    });

    // 콜백 변경
    rerender({ callback: secondCallback });

    // 타이머 완료
    act(() => {
      vi.advanceTimersByTime(delay);
    });

    // 새로운 콜백이 호출되어야 함
    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledWith('test');
  });

  it('delay가 0일 때 즉시 실행되어야 한다', () => {
    const callback = vi.fn();
    const delay = 0;

    const { result } = renderHook(() => useDebounceCallback(callback, delay));

    act(() => {
      result.current('immediate');
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(callback).toHaveBeenCalledWith('immediate');
  });

  it('음수 delay에 대해 에러를 던져야 한다', () => {
    const callback = vi.fn();
    const negativeDelay = -100;

    expect(() => {
      renderHook(() => useDebounceCallback(callback, negativeDelay));
    }).toThrow('useDebounceCallback: delay must be a non-negative number');
  });

  it('컴포넌트 언마운트 시 타이머를 정리해야 한다', () => {
    const callback = vi.fn();
    const delay = 1000;

    const { result, unmount } = renderHook(() =>
      useDebounceCallback(callback, delay)
    );

    // 디바운스 함수 호출
    act(() => {
      result.current('test');
    });

    // 컴포넌트 언마운트
    unmount();

    // 타이머 완료 시간까지 진행
    act(() => {
      vi.advanceTimersByTime(delay);
    });

    // 콜백이 호출되지 않아야 함
    expect(callback).not.toHaveBeenCalled();
  });

  it('delay가 변경되면 새로운 delay로 동작해야 한다', () => {
    const callback = vi.fn();
    let delay = 500;

    const { result, rerender } = renderHook(
      ({ delay }) => useDebounceCallback(callback, delay),
      { initialProps: { delay } }
    );

    // 첫 번째 호출
    act(() => {
      result.current('test1');
    });

    // delay 변경
    delay = 1000;
    rerender({ delay });

    // 새로운 호출
    act(() => {
      result.current('test2');
    });

    // 기존 delay 시간 경과
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 아직 호출되지 않아야 함
    expect(callback).not.toHaveBeenCalled();

    // 새로운 delay 시간까지 경과
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 마지막 호출이 실행되어야 함
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test2');
  });

  it('빈 매개변수로 호출할 수 있어야 한다', () => {
    const callback = vi.fn();
    const delay = 300;

    const { result } = renderHook(() => useDebounceCallback(callback, delay));

    act(() => {
      result.current();
    });

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledWith();
  });

  it('복잡한 시나리오: 여러 번의 호출과 부분 대기', () => {
    const callback = vi.fn();
    const delay = 1000;

    const { result } = renderHook(() => useDebounceCallback(callback, delay));

    // 첫 번째 호출 (t=0)
    act(() => {
      result.current('call1');
    });

    // 300ms 후 두 번째 호출 (t=300)
    act(() => {
      vi.advanceTimersByTime(300);
      result.current('call2');
    });

    // 200ms 후 세 번째 호출 (t=500)
    act(() => {
      vi.advanceTimersByTime(200);
      result.current('call3');
    });

    // 500ms 후까지 진행 (t=1000, 마지막 호출 후 500ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 아직 delay가 완료되지 않음 (마지막 호출 후 1000ms가 필요)
    expect(callback).not.toHaveBeenCalled();

    // 나머지 500ms 진행하여 delay 완료 (t=1500, 마지막 호출 후 1000ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 마지막 호출만 실행되어야 함
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('call3');
  });

  it('타입 안전성: 올바른 함수 시그니처를 유지해야 한다', () => {
    // 이 테스트는 타입스크립트 컴파일 시점에서 타입 체크를 확인

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stringCallback = vi.fn((str: string, num: number): void => {
      // 실제 구현
    });

    const { result } = renderHook(() =>
      useDebounceCallback(stringCallback, 500)
    );

    // 타입스크립트에서 이는 컴파일 에러가 발생하지 않아야 함
    act(() => {
      result.current('valid string', 42);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(stringCallback).toHaveBeenCalledWith('valid string', 42);
  });

  it('디버깅: 단계별 타이머 검증', () => {
    const callback = vi.fn();
    const delay = 1000;

    const { result } = renderHook(() => useDebounceCallback(callback, delay));

    // 첫 번째 호출
    act(() => {
      result.current('step1');
    });

    // 500ms 후 - 아직 실행되지 않아야 함
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();

    // 두 번째 호출 - 타이머 리셋
    act(() => {
      result.current('step2');
    });

    // 다시 500ms 후 - 아직 실행되지 않아야 함
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(callback).not.toHaveBeenCalled();

    // 나머지 500ms - 이제 실행되어야 함
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('step2');
  });
});

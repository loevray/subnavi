import { useCallback, useEffect, useRef } from 'react';

/**
 * useDebounceCallback 훅 - 개선된 타입 안전성
 * @param callback - 디바운스할 콜백 함수
 * @param delay - 지연 시간 (밀리초, 양수여야 함)
 * @returns 디바운스된 콜백 함수
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounceCallback<TFunc extends (...args: any[]) => any>(
  callback: TFunc,
  delay: number
): (...args: Parameters<TFunc>) => void {
  // delay 유효성 검사
  if (delay < 0) {
    throw new Error('useDebounceCallback: delay must be a non-negative number');
  }

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef<TFunc>(callback);

  // 최신 콜백을 유지
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return (): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<TFunc>): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  return debouncedCallback;
}

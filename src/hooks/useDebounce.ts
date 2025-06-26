import { useEffect, useState } from 'react';

interface I_UseDebounce<T> {
  value: T;
  delay: number;
}

/**
 * useDebounce 훅
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운스된 값
 */

export default function useDebounce<T>({ value, delay }: I_UseDebounce<T>) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

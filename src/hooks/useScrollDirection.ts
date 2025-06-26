'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounceCallback } from './useDebounceCallback';

type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  /** 스크롤 이벤트 디바운스 지연시간 (ms) */
  debounceMs?: number;
  /** 반응할 최소 스크롤 거리 */
  minDelta?: number;
  /** 초기 스크롤 방향 */
  initialDirection?: ScrollDirection;
}

interface ScrollDirectionState {
  direction: ScrollDirection;
  scrollY: number;
  delta: number;
}

/**
 * 스크롤 방향을 감지하는 훅
 * NextJS 15 SSR/SSG 환경에서 안전하게 동작
 * @param options 옵션 설정
 * @returns 스크롤 방향 상태
 */
export default function useScrollDirection(
  options: UseScrollDirectionOptions = {}
): ScrollDirectionState {
  const config = {
    debounceMs: 0,
    minDelta: 1,
    initialDirection: null,
    ...options,
  };

  const [state, setState] = useState<ScrollDirectionState>({
    direction: config.initialDirection,
    scrollY: 0,
    delta: 0,
  });

  const lastScrollYRef = useRef(0);

  /**
   * 스크롤 방향 계산
   */
  const getScrollDirection = useCallback(
    (currentY: number, lastY: number): ScrollDirection => {
      const delta = currentY - lastY;
      if (Math.abs(delta) < config.minDelta) return null;
      return delta > 0 ? 'down' : 'up';
    },
    [config.minDelta]
  );

  /**
   * 스크롤 처리 함수
   */
  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const currentY = window.scrollY;
    const delta = currentY - lastScrollYRef.current;
    const direction = getScrollDirection(currentY, lastScrollYRef.current);

    setState({
      direction,
      scrollY: currentY,
      delta,
    });

    lastScrollYRef.current = currentY;
  }, [getScrollDirection]);

  /**
   * 디바운스된 스크롤 핸들러
   */
  const debouncedHandleScroll = useDebounceCallback(
    handleScroll,
    config.debounceMs
  );

  /**
   * 스크롤 이벤트 리스너 등록/해제
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 초기 스크롤 위치 설정
    const initialScrollY = window.scrollY;
    lastScrollYRef.current = initialScrollY;
    setState((prev) => ({
      ...prev,
      scrollY: initialScrollY,
    }));

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', debouncedHandleScroll);
      }
    };
  }, [debouncedHandleScroll]);

  return state;
}

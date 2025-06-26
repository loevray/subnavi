'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseScrollPositionOptions {
  /** 스크롤 이벤트 디바운스 지연시간 (ms) */
  debounceMs?: number;
  /** 스크롤 위치 변화 감지를 위한 최소 임계값 */
  threshold?: number;
}

interface ScrollPosition {
  /** 현재 스크롤 Y 위치 */
  scrollY: number;
  /** 이전 스크롤 Y 위치 */
  prevScrollY: number;
  /** 스크롤 변화량 (양수: 아래로, 음수: 위로) */
  deltaY: number;
  /** 절대 스크롤 변화량 */
  absDeltaY: number;
  /** 페이지 최상단에 있는지 여부 */
  isAtTop: boolean;
  /** 페이지 최하단에 있는지 여부 */
  isAtBottom: boolean;
  /** 전체 페이지 높이 */
  documentHeight: number;
  /** 뷰포트 높이 */
  viewportHeight: number;
  /** 스크롤 가능한 전체 높이 */
  scrollableHeight: number;
  /** 스크롤 진행률 (0~1) */
  scrollProgress: number;
}

export default function useScrollPosition(
  options: UseScrollPositionOptions = {}
): ScrollPosition {
  const config = {
    debounceMs: 0,
    threshold: 0,
    ...options,
  };

  const [scrollData, setScrollData] = useState<ScrollPosition>(() => {
    // SSR 환경에서 안전한 초기값
    if (typeof window === 'undefined') {
      return {
        scrollY: 0,
        prevScrollY: 0,
        deltaY: 0,
        absDeltaY: 0,
        isAtTop: true,
        isAtBottom: false,
        documentHeight: 0,
        viewportHeight: 0,
        scrollableHeight: 0,
        scrollProgress: 0,
      };
    }

    const currentScrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollableHeight = documentHeight - viewportHeight;

    return {
      scrollY: currentScrollY,
      prevScrollY: currentScrollY,
      deltaY: 0,
      absDeltaY: 0,
      isAtTop: currentScrollY <= config.threshold,
      isAtBottom: currentScrollY >= scrollableHeight - config.threshold,
      documentHeight,
      viewportHeight,
      scrollableHeight,
      scrollProgress:
        scrollableHeight > 0 ? currentScrollY / scrollableHeight : 0,
    };
  });

  const updateScrollData = useCallback(() => {
    const currentScrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollableHeight = documentHeight - viewportHeight;

    setScrollData((prev) => {
      const deltaY = currentScrollY - prev.scrollY;
      const absDeltaY = Math.abs(deltaY);

      // threshold보다 작은 변화는 무시
      if (absDeltaY < config.threshold) {
        return prev;
      }

      return {
        scrollY: currentScrollY,
        prevScrollY: prev.scrollY,
        deltaY,
        absDeltaY,
        isAtTop: currentScrollY <= config.threshold,
        isAtBottom: currentScrollY >= scrollableHeight - config.threshold,
        documentHeight,
        viewportHeight,
        scrollableHeight,
        scrollProgress:
          scrollableHeight > 0 ? currentScrollY / scrollableHeight : 0,
      };
    });
  }, [config.threshold]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (config.debounceMs > 0) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateScrollData, config.debounceMs);
      } else {
        updateScrollData();
      }
    };

    const handleResize = () => {
      // 리사이즈 시 즉시 업데이트
      updateScrollData();
    };

    // 초기 실행
    updateScrollData();

    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [config.debounceMs, updateScrollData]);

  return scrollData;
}

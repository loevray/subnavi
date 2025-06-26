'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useIsMobile from './useIsMobile';
import useScrollPosition from './useScrollPosition';

type ScrollDirection = 'up' | 'down' | null;

interface UseYoutubeHeaderOptions {
  /** 위로 스크롤 시 헤더 표시를 위한 최소 누적 스크롤 거리 */
  upThreshold?: number;
  /** 아래로 스크롤 시 헤더 숨김을 위한 최소 누적 스크롤 거리 */
  downThreshold?: number;
  /** 스크롤 이벤트 디바운스 지연시간 (ms) */
  debounceMs?: number;
  /** 페이지 상단에서 항상 헤더를 보여줄 범위 */
  topOffset?: number;
  /** 스크롤 즉시 반응 모드 (threshold 무시) */
  immediate?: boolean;
  /** immediate 모드에서 반응할 최소 스크롤 거리 */
  minDelta?: number;
  /** 모바일에서만 동작 여부 (기본값: true) */
  mobileOnly?: boolean;
}

interface ScrollState {
  isVisible: boolean;
  scrollY: number;
  scrollDirection: ScrollDirection;
  scrollProgress: number;
  isAtTop: boolean;
  isAtBottom: boolean;
}

export default function useYoutubeHeader(
  options: UseYoutubeHeaderOptions = {}
): ScrollState {
  // 기본값 설정
  const config = {
    upThreshold: 50,
    downThreshold: 50,
    debounceMs: 0,
    topOffset: 10,
    immediate: false,
    minDelta: 5,
    mobileOnly: true,
    ...options,
  };

  // 분리된 훅들 사용
  const isMobile = useIsMobile();
  const scrollPosition = useScrollPosition({
    debounceMs: config.debounceMs,
    threshold: config.immediate ? config.minDelta : 1,
  });

  // ScrollDirection 계산
  const scrollDirection: ScrollDirection =
    scrollPosition.deltaY > 0
      ? 'down'
      : scrollPosition.deltaY < 0
      ? 'up'
      : null;

  // 내부 상태 관리
  const [isVisible, setIsVisible] = useState(true);
  const accumulatedScrollRef = useRef(0);
  const lastDirectionRef = useRef<ScrollDirection>(null);

  /**
   * 페이지 최상단 근처에 있는지 확인
   */
  const isNearTop = useCallback(
    (scrollY: number): boolean => {
      return scrollY <= config.topOffset;
    },
    [config.topOffset]
  );

  /**
   * 상태 초기화 (최상단 도달 시)
   */
  const resetScrollState = useCallback(() => {
    setIsVisible(true);
    accumulatedScrollRef.current = 0;
    lastDirectionRef.current = null;
  }, []);

  /**
   * 즉시 반응 모드 처리
   */
  const handleImmediateMode = useCallback((direction: ScrollDirection) => {
    if (!direction) return;

    setIsVisible((prev) => {
      const shouldHide = direction === 'down' && prev;
      const shouldShow = direction === 'up' && !prev;

      if (shouldHide || shouldShow) {
        accumulatedScrollRef.current = 0;
        return direction === 'up';
      }

      return prev;
    });
  }, []);

  /**
   * 누적 스크롤 모드 처리
   */
  const handleThresholdMode = useCallback(
    (direction: ScrollDirection) => {
      if (!direction) return;

      // 방향이 바뀌면 누적값 초기화
      if (direction !== lastDirectionRef.current) {
        accumulatedScrollRef.current = 0;
      }

      // 누적 스크롤 거리 업데이트
      accumulatedScrollRef.current += scrollPosition.absDeltaY;

      const accumulatedScroll = accumulatedScrollRef.current;

      setIsVisible((prev) => {
        const shouldHide =
          direction === 'down' &&
          accumulatedScroll >= config.downThreshold &&
          prev;

        const shouldShow =
          direction === 'up' &&
          accumulatedScroll >= config.upThreshold &&
          !prev;

        // 매우 작은 threshold 처리
        const shouldShowSmallThreshold =
          direction === 'up' && config.upThreshold < 1 && !prev;

        const shouldHideSmallThreshold =
          direction === 'down' && config.downThreshold < 1 && prev;

        if (
          shouldHide ||
          shouldShow ||
          shouldShowSmallThreshold ||
          shouldHideSmallThreshold
        ) {
          accumulatedScrollRef.current = 0;
          return direction === 'up';
        }

        return prev;
      });

      lastDirectionRef.current = direction;
    },
    [config.upThreshold, config.downThreshold, scrollPosition.absDeltaY]
  );

  /**
   * 메인 로직 처리
   */
  useEffect(() => {
    // 모바일에서만 동작하도록 제한
    if (config.mobileOnly && !isMobile) {
      return;
    }

    // 최상단 근처에서는 항상 헤더 표시
    if (isNearTop(scrollPosition.scrollY)) {
      resetScrollState();
      return;
    }

    // 모드에 따른 처리
    if (config.immediate) {
      handleImmediateMode(scrollDirection);
    } else {
      handleThresholdMode(scrollDirection);
    }
  }, [
    config.mobileOnly,
    config.immediate,
    isMobile,
    scrollPosition.scrollY,
    scrollDirection,
    isNearTop,
    resetScrollState,
    handleImmediateMode,
    handleThresholdMode,
  ]);

  return {
    isVisible,
    scrollY: scrollPosition.scrollY,
    scrollDirection,
    scrollProgress: scrollPosition.scrollProgress,
    isAtTop: scrollPosition.isAtTop,
    isAtBottom: scrollPosition.isAtBottom,
  };
}

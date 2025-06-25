'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

  // 모바일 감지 (User Agent 기반)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent =
        navigator.userAgent ||
        navigator.vendor ||
        ((window as Window & { opera?: string }).opera ?? '');
      const mobileRegex =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
      setIsMobile(mobileRegex.test(userAgent));
    };

    checkMobile();
  }, []);

  // 상태 관리
  const [state, setState] = useState<ScrollState>({
    isVisible: true,
    scrollY: 0,
    scrollDirection: null,
  });

  // 내부 상태 참조
  const refs = useRef({
    lastScrollY: 0,
    accumulatedScroll: 0,
    debounceTimer: undefined as NodeJS.Timeout | undefined,
  });

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
   * 스크롤 방향 계산
   */
  const getScrollDirection = useCallback(
    (currentY: number, lastY: number): ScrollDirection => {
      const delta = currentY - lastY;
      if (delta > 0) return 'down';
      if (delta < 0) return 'up';
      return null;
    },
    []
  );

  /**
   * 상태 초기화 (최상단 도달 시)
   */
  const resetScrollState = useCallback((currentY: number) => {
    setState((prev) => ({
      ...prev,
      isVisible: true,
      scrollY: currentY,
      scrollDirection: null,
    }));
    refs.current.lastScrollY = currentY;
    refs.current.accumulatedScroll = 0;
  }, []);

  /**
   * 즉시 반응 모드 처리
   */
  const handleImmediateMode = useCallback(
    (direction: ScrollDirection, delta: number, currentY: number) => {
      if (Math.abs(delta) < config.minDelta) return;

      setState((prev) => {
        const shouldHide = direction === 'down' && prev.isVisible;
        const shouldShow = direction === 'up' && !prev.isVisible;

        if (shouldHide || shouldShow) {
          return {
            ...prev,
            isVisible: direction === 'up',
            scrollY: currentY,
            scrollDirection: direction,
          };
        }

        return {
          ...prev,
          scrollY: currentY,
          scrollDirection: direction,
        };
      });

      refs.current.accumulatedScroll = 0;
    },
    [config.minDelta]
  );

  /**
   * 누적 스크롤 모드 처리
   */
  const handleThresholdMode = useCallback(
    (direction: ScrollDirection, currentY: number) => {
      const { accumulatedScroll } = refs.current;

      setState((prev) => {
        const shouldHide =
          direction === 'down' &&
          accumulatedScroll >= config.downThreshold &&
          prev.isVisible;

        const shouldShow =
          direction === 'up' &&
          accumulatedScroll >= config.upThreshold &&
          !prev.isVisible;

        // 매우 작은 threshold 처리
        const shouldShowSmallThreshold =
          direction === 'up' && config.upThreshold < 1 && !prev.isVisible;

        const shouldHideSmallThreshold =
          direction === 'down' && config.downThreshold < 1 && prev.isVisible;

        if (
          shouldHide ||
          shouldShow ||
          shouldShowSmallThreshold ||
          shouldHideSmallThreshold
        ) {
          refs.current.accumulatedScroll = 0;
          return {
            ...prev,
            isVisible: direction === 'up',
            scrollY: currentY,
            scrollDirection: direction,
          };
        }

        return {
          ...prev,
          scrollY: currentY,
          scrollDirection: direction,
        };
      });
    },
    [config.upThreshold, config.downThreshold]
  );

  /**
   * 메인 스크롤 처리 함수
   */
  const handleScroll = useCallback(() => {
    // 모바일에서만 동작하도록 제한
    if (config.mobileOnly && !isMobile) {
      return;
    }

    const currentY = window.scrollY;

    // 최상단 근처에서는 항상 헤더 표시
    if (isNearTop(currentY)) {
      resetScrollState(currentY);
      return;
    }

    const direction = getScrollDirection(currentY, refs.current.lastScrollY);

    // 스크롤이 없으면 종료
    if (!direction) return;

    const delta = currentY - refs.current.lastScrollY;

    // 방향이 바뀌면 누적값 초기화
    if (direction !== state.scrollDirection) {
      refs.current.accumulatedScroll = 0;
    }

    // 누적 스크롤 거리 업데이트
    refs.current.accumulatedScroll += Math.abs(delta);

    // 모드에 따른 처리
    if (config.immediate) {
      handleImmediateMode(direction, delta, currentY);
    } else {
      handleThresholdMode(direction, currentY);
    }

    refs.current.lastScrollY = currentY;
  }, [
    isNearTop,
    resetScrollState,
    getScrollDirection,
    handleImmediateMode,
    handleThresholdMode,
    config.immediate,
    config.mobileOnly,
    isMobile,
    state.scrollDirection,
  ]);

  /**
   * 디바운스된 스크롤 핸들러
   */
  const debouncedHandleScroll = useCallback(() => {
    if (refs.current.debounceTimer) {
      clearTimeout(refs.current.debounceTimer);
    }

    if (config.debounceMs > 0) {
      refs.current.debounceTimer = setTimeout(handleScroll, config.debounceMs);
    } else {
      handleScroll();
    }
  }, [handleScroll, config.debounceMs]);

  /**
   * 스크롤 이벤트 리스너 등록/해제
   */
  useEffect(() => {
    // 초기 스크롤 위치 설정
    const initialScrollY = window.scrollY;
    refs.current.lastScrollY = initialScrollY;

    setState((prev) => ({
      ...prev,
      scrollY: initialScrollY,
    }));

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });

    // 클린업
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      if (refs.current.debounceTimer) {
        clearTimeout(refs.current.debounceTimer);
      }
    };
  }, [debouncedHandleScroll]);

  return state;
}

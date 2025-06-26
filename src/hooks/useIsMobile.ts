'use client';

import { useEffect, useState } from 'react';

/**
 * User Agent를 기반으로 모바일 디바이스인지 감지하는 훅
 * NextJS 15 SSR/SSG 환경에서 안전하게 동작
 * @returns {boolean} 모바일 디바이스 여부
 */
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return;
      }

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

  return isMobile;
}

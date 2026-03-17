'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import scrollToEventList from '@/utils/scrollToEventList';

export function useUrlPagination() {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page') || '1');

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(page));
      window.history.pushState(null, '', `?${params.toString()}`);
      scrollToEventList();
    },
    [searchParams]
  );

  return { currentPage, setPage };
}

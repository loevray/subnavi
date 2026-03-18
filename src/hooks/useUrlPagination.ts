'use client';

import { useCallback } from 'react';
import scrollToEventList from '@/utils/scrollToEventList';
import { useEventListUrlNavigation } from './useEventListUrlNavigation';

export function useUrlPagination() {
  const { searchParams, navigateWithParams } = useEventListUrlNavigation();

  const currentPage = Number(searchParams.get('page') || '1');

  const setPage = useCallback(
    (page: number) => {
      navigateWithParams((params) => {
        params.set('page', String(page));
      });
      scrollToEventList();
    },
    [navigateWithParams]
  );

  return { currentPage, setPage };
}

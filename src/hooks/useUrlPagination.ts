'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useUrlPagination() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page') || '1');

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(page));
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  return { currentPage, setPage };
}

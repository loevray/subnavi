'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SearchParamsUpdater = (params: URLSearchParams) => void;

export function useEventListUrlNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateWithParams = useCallback(
    (updateParams: SearchParamsUpdater) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      updateParams(nextParams);

      const nextQuery = nextParams.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

      router.push(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return {
    searchParams,
    navigateWithParams,
  };
}

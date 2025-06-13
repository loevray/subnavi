// utils/pagination.ts
export type PageItem = number | 'ellipsis';

export interface PaginationConfig {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  maxVisiblePages?: number;
}

export interface PaginationResult {
  totalPages: number;
  currentPage: number;
  pageNumbers: PageItem[];
  hasPrevious: boolean;
  hasNext: boolean;
}

export function calculatePagination({
  totalItems,
  itemsPerPage,
  currentPage,
  maxVisiblePages = 5,
}: PaginationConfig): PaginationResult {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const normalizedCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const getPageNumbers = (): PageItem[] => {
    const pages: PageItem[] = [];
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(normalizedCurrentPage - half, 1);
    const end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('ellipsis');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  return {
    totalPages,
    currentPage: normalizedCurrentPage,
    pageNumbers: getPageNumbers(),
    hasPrevious: normalizedCurrentPage > 1,
    hasNext: normalizedCurrentPage < totalPages,
  };
}

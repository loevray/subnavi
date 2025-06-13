'use client';

import { useUrlPagination } from '@/hooks/useUrlPagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { calculatePagination } from '@/utils/pagination';

type EventPaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  maxVisiblePages?: number;
};

export default function EventPagination({
  totalItems,
  itemsPerPage,
  maxVisiblePages = 5,
}: EventPaginationProps) {
  const { currentPage, setPage } = useUrlPagination();

  const pagination = calculatePagination({
    totalItems,
    itemsPerPage,
    currentPage,
    maxVisiblePages,
  });

  const { pageNumbers, hasPrevious, hasNext } = pagination;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => hasPrevious && setPage(currentPage - 1)}
            className={!hasPrevious ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pageNumbers.map((page, idx) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => setPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => hasNext && setPage(currentPage + 1)}
            className={!hasNext ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

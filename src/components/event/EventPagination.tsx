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

const paginationBase =
  'h-10 min-w-10 rounded-xl border border-primary/20 bg-card/70 text-muted-foreground hover:border-primary/45 hover:bg-accent/50 hover:text-foreground';

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
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => hasPrevious && setPage(currentPage - 1)}
            className={`${paginationBase} ${!hasPrevious ? 'pointer-events-none opacity-45' : ''}`}
          />
        </PaginationItem>

        {pageNumbers.map((page, idx) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis className="text-muted-foreground" />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                className={`${paginationBase} ${
                  currentPage === page
                    ? 'border-primary/70 bg-gradient-to-r from-[#f06b93] to-[#b8a8d8] text-white shadow-[0_0_16px_rgba(240,107,147,0.35)]'
                    : ''
                }`}
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
            className={`${paginationBase} ${!hasNext ? 'pointer-events-none opacity-45' : ''}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

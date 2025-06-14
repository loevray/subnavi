// utils/pagination.test.ts
import { describe, it, expect } from 'vitest';
import { calculatePagination, type PaginationConfig } from './pagination';

describe('calculatePagination', () => {
  // 기본 케이스들
  describe('기본 동작', () => {
    it('총 페이지 수를 올바르게 계산한다', () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 1,
      });

      expect(result.totalPages).toBe(10);
    });

    it('소수점이 있는 경우 올림 처리한다', () => {
      const result = calculatePagination({
        totalItems: 101,
        itemsPerPage: 10,
        currentPage: 1,
      });

      expect(result.totalPages).toBe(11);
    });

    it('이전/다음 페이지 존재 여부를 올바르게 판단한다', () => {
      const firstPage = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 1,
      });
      expect(firstPage.hasPrevious).toBe(false);
      expect(firstPage.hasNext).toBe(true);

      const middlePage = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 5,
      });
      expect(middlePage.hasPrevious).toBe(true);
      expect(middlePage.hasNext).toBe(true);

      const lastPage = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 10,
      });
      expect(lastPage.hasPrevious).toBe(true);
      expect(lastPage.hasNext).toBe(false);
    });
  });

  // 페이지 번호 생성 로직
  describe('페이지 번호 생성', () => {
    it('총 페이지가 maxVisiblePages보다 적으면 모든 페이지를 표시한다', () => {
      const result = calculatePagination({
        totalItems: 30,
        itemsPerPage: 10,
        currentPage: 2,
        maxVisiblePages: 5,
      });

      expect(result.pageNumbers).toEqual([1, 2, 3]);
    });

    it('첫 번째 페이지에서 올바른 페이지 번호를 생성한다', () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 1,
        maxVisiblePages: 5,
      });

      expect(result.pageNumbers).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
    });

    it('중간 페이지에서 올바른 페이지 번호를 생성한다', () => {
      const result = calculatePagination({
        totalItems: 200,
        itemsPerPage: 10,
        currentPage: 10,
        maxVisiblePages: 5,
      });

      expect(result.pageNumbers).toEqual([
        1,
        'ellipsis',
        8,
        9,
        10,
        11,
        12,
        'ellipsis',
        20,
      ]);
    });

    it('마지막 페이지에서 올바른 페이지 번호를 생성한다', () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 10,
        maxVisiblePages: 5,
      });

      expect(result.pageNumbers).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10]);
    });

    it('ellipsis가 필요 없는 경우 표시하지 않는다', () => {
      const result = calculatePagination({
        totalItems: 70,
        itemsPerPage: 10,
        currentPage: 4,
        maxVisiblePages: 5,
      });

      expect(result.pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  // 엣지 케이스들
  describe('엣지 케이스', () => {
    it('currentPage가 1보다 작으면 1로 정규화한다', () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: -5,
      });

      expect(result.currentPage).toBe(1);
      expect(result.hasPrevious).toBe(false);
    });

    it('currentPage가 totalPages보다 크면 마지막 페이지로 정규화한다', () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 99,
      });

      expect(result.currentPage).toBe(10);
      expect(result.hasNext).toBe(false);
    });

    it('totalItems이 0일 때 올바르게 처리한다', () => {
      const result = calculatePagination({
        totalItems: 0,
        itemsPerPage: 10,
        currentPage: 1,
      });

      expect(result.totalPages).toBe(0);
      expect(result.currentPage).toBe(1);
      expect(result.pageNumbers).toEqual([]);
      expect(result.hasPrevious).toBe(false);
      expect(result.hasNext).toBe(false);
    });

    it('totalItems이 itemsPerPage보다 작을 때', () => {
      const result = calculatePagination({
        totalItems: 5,
        itemsPerPage: 10,
        currentPage: 1,
      });

      expect(result.totalPages).toBe(1);
      expect(result.pageNumbers).toEqual([1]);
      expect(result.hasPrevious).toBe(false);
      expect(result.hasNext).toBe(false);
    });
  });

  // maxVisiblePages 다양한 값 테스트
  describe('maxVisiblePages 설정', () => {
    const baseConfig: PaginationConfig = {
      totalItems: 200,
      itemsPerPage: 10,
      currentPage: 10,
    };

    it('maxVisiblePages가 1일 때', () => {
      const result = calculatePagination({
        ...baseConfig,
        maxVisiblePages: 1,
      });

      expect(result.pageNumbers).toEqual([1, 'ellipsis', 10, 'ellipsis', 20]);
    });

    it('maxVisiblePages가 3일 때', () => {
      const result = calculatePagination({
        ...baseConfig,
        maxVisiblePages: 3,
      });

      expect(result.pageNumbers).toEqual([
        1,
        'ellipsis',
        9,
        10,
        11,
        'ellipsis',
        20,
      ]);
    });

    it('maxVisiblePages가 홀수가 아닐 때도 올바르게 동작한다', () => {
      const result = calculatePagination({
        ...baseConfig,
        maxVisiblePages: 4,
      });

      expect(result.pageNumbers).toEqual([
        1,
        'ellipsis',
        8,
        9,
        10,
        11,
        'ellipsis',
        20,
      ]);
    });
  });

  // 특수한 페이지 배치 시나리오
  describe('특수 시나리오', () => {
    it('첫 페이지와 현재 페이지가 인접한 경우 ellipsis를 표시하지 않는다', () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 3,
        maxVisiblePages: 5,
      });

      expect(result.pageNumbers).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
    });

    it('마지막 페이지와 현재 페이지가 인접한 경우 ellipsis를 표시하지 않는다', () => {
      const result = calculatePagination({
        totalItems: 100,
        itemsPerPage: 10,
        currentPage: 8,
        maxVisiblePages: 5,
      });

      expect(result.pageNumbers).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10]);
    });

    it('총 페이지가 maxVisiblePages + 2와 같을 때', () => {
      const result = calculatePagination({
        totalItems: 70, // 7페이지
        itemsPerPage: 10,
        currentPage: 4,
        maxVisiblePages: 5,
      });

      expect(result.pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  // 성능 관련
  describe('성능 및 안정성', () => {
    it('큰 숫자에서도 올바르게 동작한다', () => {
      const result = calculatePagination({
        totalItems: 1000000,
        itemsPerPage: 100,
        currentPage: 5000,
      });

      expect(result.totalPages).toBe(10000);
      expect(result.currentPage).toBe(5000);
      expect(result.pageNumbers).toContain(1);
      expect(result.pageNumbers).toContain(10000);
      expect(result.pageNumbers).toContain(5000);
    });

    it('부동소수점 오류가 발생하지 않는다', () => {
      const result = calculatePagination({
        totalItems: 999999,
        itemsPerPage: 777,
        currentPage: 500,
      });

      expect(result.totalPages).toBeTypeOf('number');
      expect(Number.isInteger(result.totalPages)).toBe(true);
    });
  });
});

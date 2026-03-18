import { describe, expect, it } from 'vitest';

import {
  getFirstSearchParamValue,
  normalizeEventListQueryState,
  normalizeEventListCategory,
  normalizeEventListDate,
  normalizeEventListKeyword,
  normalizeEventListRegion,
  normalizePositiveIntegerSearchParam,
} from './eventListSearchParams';

describe('eventListSearchParams', () => {
  it('배열 파라미터는 첫 번째 값만 사용한다', () => {
    expect(getFirstSearchParamValue(['anime', 'festival'])).toBe('anime');
  });

  it('page 같은 숫자 파라미터는 양수만 허용하고 아니면 fallback으로 복구한다', () => {
    expect(normalizePositiveIntegerSearchParam('3', 1)).toBe(3);
    expect(normalizePositiveIntegerSearchParam('-2', 1)).toBe(1);
    expect(normalizePositiveIntegerSearchParam('0', 1)).toBe(1);
    expect(normalizePositiveIntegerSearchParam(undefined, 1)).toBe(1);
  });

  it('keyword는 공백만 있으면 제거하고 의미 있는 문자열만 남긴다', () => {
    expect(normalizeEventListKeyword('  comic world  ')).toBe('comic world');
    expect(normalizeEventListKeyword('   ')).toBeUndefined();
  });

  it('category, region, date는 유효한 값만 남기고 나머지는 복구 차원에서 제거한다', () => {
    expect(normalizeEventListCategory('만화')).toBe('만화');
    expect(normalizeEventListCategory('invalid-category')).toBeUndefined();

    expect(normalizeEventListRegion('서울')).toBe('서울');
    expect(normalizeEventListRegion('invalid-region')).toBeUndefined();

    expect(normalizeEventListDate('today')).toBe('today');
    expect(normalizeEventListDate('2026-03-18')).toBe('2026-03-18');
    expect(normalizeEventListDate('2026-13-99')).toBeUndefined();
  });

  it('검색 파라미터 전체는 복구 규칙에 맞게 정규화한다', () => {
    const searchParams = new URLSearchParams({
      page: '-3',
      keyword: '   ',
      category: 'invalid-category',
      region: 'invalid-region',
      date: '2026-13-99',
    });

    expect(normalizeEventListQueryState(searchParams)).toEqual({
      page: 1,
      keyword: undefined,
      category: undefined,
      region: undefined,
      date: undefined,
    });
  });
});

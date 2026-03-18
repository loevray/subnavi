import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { EventListResponse } from '@/dto/event/event-list.dto';
import Page from './page';

const { getEventsMock } = vi.hoisted(() => ({
  getEventsMock: vi.fn(),
}));

vi.mock('@/services/Event', () => ({
  eventService: {
    getEvents: getEventsMock,
  },
}));

vi.mock('@/components/event/home/HomeFeedSection', () => ({
  default: ({ featuredEvent }: { featuredEvent?: { title?: string } }) => (
    <div data-testid="home-feed">featured:{featuredEvent?.title ?? 'none'}</div>
  ),
}));

vi.mock('@/components/event/eventList/EventListSection', () => ({
  default: ({
    initialData,
    initialErrorMessage,
    initialSearchKey,
    latestPageSize,
  }: {
    initialData?: { events?: unknown[]; pagination?: { page?: number } } | null;
    initialErrorMessage?: string | null;
    initialSearchKey: string;
    latestPageSize: number;
  }) => (
    <div data-testid="event-list-section">
      {JSON.stringify({
        hasInitialData: Boolean(initialData),
        initialErrorMessage,
        initialSearchKey,
        latestPageSize,
        eventCount: initialData?.events?.length ?? 0,
        page: initialData?.pagination?.page ?? null,
      })}
    </div>
  ),
}));

const latestFeedData = {
  events: [
    {
      id: 'f64f1607-8112-4e6d-9fd1-7102fc2123ef',
      title: '대표 행사',
    },
    {
      id: '19adb13c-b50a-4ee6-b375-f54b980be78d',
      title: '두 번째 행사',
    },
  ],
  pagination: {
    page: 1,
    pageSize: 8,
    hasMore: false,
    total: 2,
    totalPages: 1,
  },
} as unknown as EventListResponse;

describe('app/(main)/page.tsx', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    getEventsMock.mockReset();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('기본 홈 피드는 latest feed 데이터를 재사용해 렌더링한다', async () => {
    getEventsMock.mockResolvedValueOnce({
      success: true,
      data: latestFeedData,
    });

    render(await Page({ searchParams: Promise.resolve({}) }));

    expect(getEventsMock).toHaveBeenCalledTimes(1);
    expect(getEventsMock).toHaveBeenCalledWith({ page: 1, pageSize: 8 });
    expect(screen.getByTestId('home-feed').textContent).toBe('featured:대표 행사');

    const renderedSection = JSON.parse(screen.getByTestId('event-list-section').textContent ?? '{}');
    expect(renderedSection).toMatchObject({
      hasInitialData: true,
      initialErrorMessage: null,
      latestPageSize: 8,
      eventCount: 2,
      page: 1,
    });
  });

  it('음수 page 쿼리는 1로 정규화해 latest feed를 재사용한다', async () => {
    getEventsMock.mockResolvedValueOnce({
      success: true,
      data: latestFeedData,
    });

    render(await Page({ searchParams: Promise.resolve({ page: '-3' }) }));

    expect(getEventsMock).toHaveBeenCalledTimes(1);

    const renderedSection = JSON.parse(screen.getByTestId('event-list-section').textContent ?? '{}');
    expect(JSON.parse(renderedSection.initialSearchKey)).toMatchObject({
      page: 1,
      pageSize: 8,
    });
  });

  it('잘못된 필터 값은 에러로 올리지 않고 복구 차원에서 제거한다', async () => {
    getEventsMock.mockResolvedValueOnce({
      success: true,
      data: latestFeedData,
    });

    render(
      await Page({
        searchParams: Promise.resolve({
          category: 'invalid-category',
          region: 'invalid-region',
          date: '2026-13-99',
          keyword: '   ',
        }),
      })
    );

    expect(getEventsMock).toHaveBeenCalledTimes(1);

    const renderedSection = JSON.parse(screen.getByTestId('event-list-section').textContent ?? '{}');
    expect(JSON.parse(renderedSection.initialSearchKey)).toEqual({
      page: 1,
      pageSize: 8,
    });
  });

  it('사용자 필터 기반 목록의 expected failure는 초기 에러 메시지로 전달한다', async () => {
    getEventsMock
      .mockResolvedValueOnce({
        success: true,
        data: latestFeedData,
      })
      .mockResolvedValueOnce({
        success: false,
        error: {
          code: 'VALIDATION',
          message: '검색 조건이 올바르지 않습니다.',
          statusCode: 400,
        },
      });

    render(await Page({ searchParams: Promise.resolve({ page: '2', keyword: 'anime' }) }));

    expect(getEventsMock).toHaveBeenNthCalledWith(2, {
      page: 2,
      pageSize: 5,
      category: undefined,
      region: undefined,
      date: undefined,
      keyword: 'anime',
    });

    const renderedSection = JSON.parse(screen.getByTestId('event-list-section').textContent ?? '{}');
    expect(renderedSection).toMatchObject({
      hasInitialData: false,
      initialErrorMessage: '검색 조건이 올바르지 않습니다.',
      latestPageSize: 8,
    });
    expect(screen.getByTestId('home-feed').textContent).toBe('featured:대표 행사');
  });

  it('latest feed의 불가능한 실패는 로그와 함께 일반 에러로 전환한다', async () => {
    const latestFeedFailure = {
      code: 'VALIDATION',
      message: 'unexpected latest feed failure',
      statusCode: 400,
    } as const;

    getEventsMock.mockResolvedValueOnce({
      success: false,
      error: latestFeedFailure,
    });

    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrow(
      '홈 화면 행사 피드를 준비하는 중 예상하지 못한 문제가 발생했습니다.'
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected latest feed failure in (main)/page:', {
      params: {
        page: 1,
        pageSize: 8,
      },
      error: latestFeedFailure,
    });
  });
});

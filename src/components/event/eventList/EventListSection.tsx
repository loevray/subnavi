'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import type { EventListResponse } from '@/dto/event/event-list.dto';
import type { EventDateFilter, EventCategory, RegionName } from '@/dto/event/shared-event.dto';
import ExploreFeedSection, { ExploreSectionBadge, ExploreSectionCopy } from '@/components/event/explore/ExploreFeedSection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ApiError, EventsApi } from '@/lib/api-client';
import { AlertCircle } from 'lucide-react';
import { formatEventDateFilterLabel } from '@/utils/eventDateFilter';
import EventList from './EventList';
import EventPagination from '../EventPagination';
import EventListSectionFallback from './EventListSectionFallback';

const DEFAULT_EVENT_PAGE_SIZE = 5;

type EventListSectionProps = {
  initialData?: EventListResponse | null;
  initialErrorMessage?: string | null;
  initialSearchKey: string;
  latestPageSize: number;
  latestGridClassName?: string;
};

type EventListQueryState = {
  page: number;
  keyword?: string;
  category?: EventCategory['name'];
  region?: RegionName;
  date?: EventDateFilter;
};

function getQueryState(searchParams: URLSearchParams | ReadonlyURLSearchParamsLike): EventListQueryState {
  const rawPage = Number(searchParams.get('page') || '1');

  return {
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
    keyword: searchParams.get('keyword') ?? undefined,
    category: (searchParams.get('category') as EventCategory['name'] | null) ?? undefined,
    region: (searchParams.get('region') as RegionName | null) ?? undefined,
    date: (searchParams.get('date') as EventDateFilter | null) ?? undefined,
  };
}

function isLatestEventFeed(params: EventListQueryState) {
  return !params.category && !params.region && !params.date && !params.keyword;
}

function getSearchKey(params: EventListQueryState, pageSize: number) {
  return JSON.stringify({
    ...params,
    pageSize,
  });
}

function getExploreSectionCopy(params: EventListQueryState): ExploreSectionCopy {
  if (isLatestEventFeed(params)) {
    return {
      eyebrow: 'Latest Events',
      title: '이벤트 일정',
      description: '최근 등록된 이벤트를 기준으로 관심 있는 일정을 빠르게 둘러보세요.',
    };
  }

  return {
    eyebrow: 'Filtered Events',
    title: '이벤트 일정',
    description: '입력한 검색어와 선택한 조건에 맞는 이벤트만 모아 보여드리고 있어요.',
  };
}

function getExploreSectionBadges(params: EventListQueryState): ExploreSectionBadge[] {
  const badges: ExploreSectionBadge[] = [];

  if (params.keyword) {
    badges.push({ label: `키워드: ${params.keyword}` });
  }

  if (params.category) {
    badges.push({ label: `카테고리: ${params.category}`, tone: 'accent' });
  }

  if (params.region) {
    badges.push({ label: `지역: ${params.region}` });
  }

  if (params.date) {
    badges.push({ label: `날짜: ${formatEventDateFilterLabel(params.date)}` });
  }

  return badges;
}

export default function EventListSection({
  initialData,
  initialErrorMessage,
  initialSearchKey,
  latestPageSize,
  latestGridClassName,
}: EventListSectionProps) {
  const searchParams = useSearchParams();
  const queryState = useMemo(() => getQueryState(searchParams), [searchParams]);
  const isLatestFeed = isLatestEventFeed(queryState);
  const pageSize = isLatestFeed ? latestPageSize : DEFAULT_EVENT_PAGE_SIZE;
  const currentSearchKey = useMemo(() => getSearchKey(queryState, pageSize), [queryState, pageSize]);

  const [data, setData] = useState<EventListResponse | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(currentSearchKey !== initialSearchKey && !initialData);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage ?? null);

  useEffect(() => {
    if (currentSearchKey === initialSearchKey) {
      setData(initialData ?? null);
      setErrorMessage(initialErrorMessage ?? null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchEvents() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const nextData = await EventsApi.getAll({
          page: queryState.page,
          pageSize,
          keyword: queryState.keyword,
          category: queryState.category,
          region: queryState.region,
          date: queryState.date,
        });

        if (controller.signal.aborted) {
          return;
        }

        setData(nextData);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message);
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : '이벤트 목록을 불러오지 못했습니다.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchEvents();

    return () => controller.abort();
  }, [currentSearchKey, initialData, initialErrorMessage, initialSearchKey, pageSize, queryState]);

  const sectionCopy = getExploreSectionCopy(queryState);
  const sectionBadges = getExploreSectionBadges(queryState);

  return (
    <ExploreFeedSection copy={sectionCopy} badges={sectionBadges}>
      {isLoading ? (
        <EventListSectionFallback />
      ) : (
        <EventListSectionContent
          data={data}
          errorMessage={errorMessage}
          gridClassName={isLatestFeed ? latestGridClassName : undefined}
          queryState={queryState}
        />
      )}
    </ExploreFeedSection>
  );
}

function EventListSectionContent({
  data,
  errorMessage,
  gridClassName,
  queryState,
}: {
  data: EventListResponse | null;
  errorMessage: string | null;
  gridClassName?: string;
  queryState: EventListQueryState;
}) {
  if (errorMessage) {
    return (
      <Alert variant="destructive" className="rounded-[28px] border border-red-200 bg-white/90 p-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>이벤트 목록을 불러오지 못했습니다.</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <div>이벤트 목록을 불러오지 못했습니다.</div>;
  }

  const { events, pagination } = data;
  const isEmptyEvents = events.length <= 0;
  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

  return (
    <>
      {isEmptyEvents ? (
        <div className="flex h-80 items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/80 px-6 text-center">
          <div>
            <p className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-3xl">
              조건에 맞는 이벤트를 아직 찾지 못했어요.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              {queryState.category ?? '전체'} 범위에서 {queryState.keyword ? `'${queryState.keyword}'` : '입력한 조건'} 기준으로
              검색했지만 결과가 없었습니다. 다른 키워드나 카테고리로 다시 확인해보세요.
            </p>
          </div>
        </div>
      ) : (
        <EventList events={events} gridClassName={gridClassName} />
      )}

      <footer className="mt-12">
        <div className="mb-6 text-center">
          <div className="text-sm text-slate-600">
            총 <span className="font-semibold text-indigo-600">{pagination.total}</span>개 이벤트 중{' '}
            <span className="font-semibold text-indigo-600">
              {startItem}-{endItem}
            </span>
            개를 보고 있어요.
          </div>
        </div>
        <EventPagination totalItems={pagination.total} itemsPerPage={pagination.pageSize} maxVisiblePages={1} />
      </footer>
    </>
  );
}

type ReadonlyURLSearchParamsLike = {
  get(name: string): string | null;
};

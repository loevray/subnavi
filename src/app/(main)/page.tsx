import { Suspense } from 'react';

import EventListSection from '@/components/event/eventList/EventListSection';
import HomeFeedSection from '@/components/event/home/HomeFeedSection';
import { EventListResponse } from '@/dto/event/event-list.dto';
import { ServiceResult } from '@/services/type';
import { eventService } from '@/services/Event';
import {
  normalizeEventListCategory,
  normalizeEventListDate,
  normalizeEventListKeyword,
  normalizeEventListRegion,
  normalizePositiveIntegerSearchParam,
  RawSearchParamValue,
} from '@/utils/eventListSearchParams';

const HOME_LATEST_EVENT_PAGE_SIZE = 8;
const HOME_LATEST_EVENT_GRID_STYLES =
  'grid gap-4 place-items-center md:place-items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4';
const HOME_FEED_UNEXPECTED_ERROR_MESSAGE = '홈 화면 행사 피드를 준비하는 중 예상하지 못한 문제가 발생했습니다.';

export type MainSerachParamsType = {
  page?: RawSearchParamValue;
  category?: RawSearchParamValue;
  region?: RawSearchParamValue;
  date?: RawSearchParamValue;
  keyword?: RawSearchParamValue;
};

type NormalizedMainSearchParams = {
  category?: ReturnType<typeof normalizeEventListCategory>;
  region?: ReturnType<typeof normalizeEventListRegion>;
  date?: ReturnType<typeof normalizeEventListDate>;
  keyword?: ReturnType<typeof normalizeEventListKeyword>;
};

function normalizeMainSearchParams(searchParams: MainSerachParamsType): NormalizedMainSearchParams {
  return {
    category: normalizeEventListCategory(searchParams.category),
    region: normalizeEventListRegion(searchParams.region),
    date: normalizeEventListDate(searchParams.date),
    keyword: normalizeEventListKeyword(searchParams.keyword),
  };
}

function isLatestEventFeed(searchParams: NormalizedMainSearchParams) {
  return !searchParams.category && !searchParams.region && !searchParams.date && !searchParams.keyword;
}

function resolvePageNumber(rawPage: RawSearchParamValue) {
  return normalizePositiveIntegerSearchParam(rawPage, 1);
}

function getLatestFeedDataOrThrow(response: ServiceResult<EventListResponse>) {
  if (response.success) {
    return response.data;
  }

  console.error('Unexpected latest feed failure in (main)/page:', {
    params: {
      page: 1,
      pageSize: HOME_LATEST_EVENT_PAGE_SIZE,
    },
    error: response.error,
  });

  throw new Error(HOME_FEED_UNEXPECTED_ERROR_MESSAGE);
}

export default async function Page({ searchParams }: { searchParams: Promise<MainSerachParamsType> }) {
  const resolvedSearchParams = await searchParams;
  const normalizedSearchParams = normalizeMainSearchParams(resolvedSearchParams);
  const isLatestFeed = isLatestEventFeed(normalizedSearchParams);
  const resolvedPage = resolvePageNumber(resolvedSearchParams.page);
  const latestFeedResponse = await eventService.getEvents({ page: 1, pageSize: HOME_LATEST_EVENT_PAGE_SIZE });
  const latestFeedData = getLatestFeedDataOrThrow(latestFeedResponse);
  const featuredEvent = latestFeedData.events[0];
  const initialPageSize = isLatestFeed ? HOME_LATEST_EVENT_PAGE_SIZE : 5;
  const shouldReuseLatestInitialData = isLatestFeed && resolvedPage === 1;
  const initialSectionResponse = shouldReuseLatestInitialData
    ? { success: true as const, data: latestFeedData }
    : await eventService.getEvents({
        page: resolvedPage,
        pageSize: initialPageSize,
        category: normalizedSearchParams.category,
        region: normalizedSearchParams.region,
        date: normalizedSearchParams.date,
        keyword: normalizedSearchParams.keyword,
      });
  const initialSectionData = initialSectionResponse.success ? initialSectionResponse.data : null;
  const initialSectionErrorMessage = initialSectionResponse.success ? null : initialSectionResponse.error.message;
  const initialSearchKey = JSON.stringify({
    page: resolvedPage,
    category: normalizedSearchParams.category,
    region: normalizedSearchParams.region,
    date: normalizedSearchParams.date,
    keyword: normalizedSearchParams.keyword,
    pageSize: initialPageSize,
  });

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_18%,#f8fbff_100%)]">
      <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-10">
          <HomeFeedSection featuredEvent={featuredEvent} />

          <Suspense fallback={null}>
            <EventListSection
              initialData={initialSectionData}
              initialErrorMessage={initialSectionErrorMessage}
              initialSearchKey={initialSearchKey}
              latestPageSize={HOME_LATEST_EVENT_PAGE_SIZE}
              latestGridClassName={HOME_LATEST_EVENT_GRID_STYLES}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

import { Suspense } from 'react';

import EventListSection from '@/components/event/eventList/EventListSection';
import HomeFeedSection from '@/components/event/home/HomeFeedSection';
import { EventCategory, EventDateFilter, RegionName } from '@/dto/event/shared-event.dto';
import { eventService } from '@/services/Event';

const HOME_LATEST_EVENT_PAGE_SIZE = 8;
const HOME_LATEST_EVENT_GRID_STYLES =
  'grid gap-4 place-items-center md:place-items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4';

export type MainSerachParamsType = {
  page?: string;
  category?: EventCategory['name'];
  region?: RegionName;
  date?: EventDateFilter;
  keyword?: string;
};

function isLatestEventFeed(searchParams: MainSerachParamsType) {
  return !searchParams.category && !searchParams.region && !searchParams.date && !searchParams.keyword;
}

export default async function Page({ searchParams }: { searchParams: Promise<MainSerachParamsType> }) {
  const resolvedSearchParams = await searchParams;
  const isLatestFeed = isLatestEventFeed(resolvedSearchParams);
  const latestFeedResponse = await eventService.getEvents({ page: 1, pageSize: HOME_LATEST_EVENT_PAGE_SIZE });
  const latestFeedData = latestFeedResponse.success ? latestFeedResponse.data : null;
  const featuredEvent = latestFeedData?.events[0];
  const resolvedPage = Number.parseInt(resolvedSearchParams.page ?? '1', 10) || 1;
  const initialPageSize = isLatestFeed ? HOME_LATEST_EVENT_PAGE_SIZE : 5;
  const shouldReuseLatestInitialData = isLatestFeed && resolvedPage === 1;
  const initialSectionResponse = shouldReuseLatestInitialData
    ? latestFeedResponse
    : await eventService.getEvents({
        page: resolvedPage,
        pageSize: initialPageSize,
        category: resolvedSearchParams.category,
        region: resolvedSearchParams.region,
        date: resolvedSearchParams.date,
        keyword: resolvedSearchParams.keyword,
      });
  const initialSectionData = initialSectionResponse.success ? initialSectionResponse.data : null;
  const initialSearchKey = JSON.stringify({
    page: resolvedPage,
    category: resolvedSearchParams.category,
    region: resolvedSearchParams.region,
    date: resolvedSearchParams.date,
    keyword: resolvedSearchParams.keyword,
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

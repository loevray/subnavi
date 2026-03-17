import { Suspense } from 'react';
import Link from 'next/link';

import ExploreFeedSection, { ExploreSectionBadge, ExploreSectionCopy } from '@/components/event/explore/ExploreFeedSection';
import EventListSection from '@/components/event/eventList/EventListSection';
import EventListSectionFallback from '@/components/event/eventList/EventListSectionFallback';
import HomeFeedSection from '@/components/event/home/HomeFeedSection';
import { EventCategory } from '@/dto/event/shared-event.dto';
import { eventService } from '@/services/Event';

const HOME_LATEST_EVENT_PAGE_SIZE = 8;
const HOME_LATEST_EVENT_GRID_STYLES =
  'grid gap-4 place-items-center md:place-items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4';

export type MainSerachParamsType = {
  page?: string;
  category?: EventCategory['name'];
  keyword?: string;
  view?: 'all';
};

function shouldShowFeaturedEvent(searchParams: MainSerachParamsType) {
  return (
    !searchParams.category &&
    !searchParams.keyword &&
    searchParams.view !== 'all' &&
    (!searchParams.page || searchParams.page === '1')
  );
}

function getExploreSectionCopy(searchParams: MainSerachParamsType): ExploreSectionCopy {
  const isDefaultFeed = shouldShowFeaturedEvent(searchParams);

  if (isDefaultFeed) {
    return {
      eyebrow: 'Latest Events',
      title: '최신 등록 일정',
      description: '최근 등록된 행사 8개를 먼저 살펴보고, 더 넓게 보고 싶다면 전체 일정으로 넘어가 보세요.',
    };
  }

  if (searchParams.view === 'all') {
    return {
      eyebrow: 'All Events',
      title: '전체 일정',
      description: '등록된 행사 전체를 페이지 단위로 탐색하면서 원하는 일정을 더 자세히 찾아보세요.',
    };
  }

  if (searchParams.keyword) {
    return {
      eyebrow: 'Search Result',
      title: `'${searchParams.keyword}' 검색 결과`,
      description: '키워드와 필터를 기준으로 관련 있는 행사만 모아서 보여드리고 있어요.',
    };
  }

  return {
    eyebrow: 'Filtered Events',
    title: `${searchParams.category ?? '전체'} 행사 모아보기`,
    description: '관심 있는 범위만 남겨서 빠르게 비교할 수 있도록 목록을 좁혔어요.',
  };
}

function getExploreSectionBadges(searchParams: MainSerachParamsType): ExploreSectionBadge[] {
  const badges: ExploreSectionBadge[] = [];

  if (searchParams.keyword) {
    badges.push({ label: `키워드: ${searchParams.keyword}` });
  }

  if (searchParams.category) {
    badges.push({ label: `카테고리: ${searchParams.category}`, tone: 'accent' });
  }

  return badges;
}

export default async function Page({ searchParams }: { searchParams: Promise<MainSerachParamsType> }) {
  const resolvedSearchParams = await searchParams;
  const isDefaultFeed = shouldShowFeaturedEvent(resolvedSearchParams);
  const sectionCopy = getExploreSectionCopy(resolvedSearchParams);
  const sectionBadges = getExploreSectionBadges(resolvedSearchParams);
  const defaultFeedResponse = isDefaultFeed
    ? await eventService.getEvents({ page: 1, pageSize: HOME_LATEST_EVENT_PAGE_SIZE })
    : null;
  const defaultFeedData = defaultFeedResponse?.success ? defaultFeedResponse.data : null;
  const featuredEvent = defaultFeedData?.events[0];

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_18%,#f8fbff_100%)]">
      <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-10">
          <HomeFeedSection featuredEvent={isDefaultFeed ? featuredEvent : undefined} />

          <ExploreFeedSection
            copy={sectionCopy}
            badges={sectionBadges}
            isHomeFeed={isDefaultFeed}
            footer={
              isDefaultFeed ? (
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/?view=all#event-list"
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    전체 일정 보기
                  </Link>
                </div>
              ) : undefined
            }
          >
            <Suspense fallback={<EventListSectionFallback />}>
              <EventListSection
                {...resolvedSearchParams}
                initialData={defaultFeedData ?? undefined}
                gridClassName={isDefaultFeed ? HOME_LATEST_EVENT_GRID_STYLES : undefined}
                showPagination={!isDefaultFeed}
              />
            </Suspense>
          </ExploreFeedSection>
        </div>
      </main>
    </div>
  );
}

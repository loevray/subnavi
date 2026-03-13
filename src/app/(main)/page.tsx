import { EventCategory } from '@/dto/event/shared-event.dto';

import EventListSection from '@/components/event/eventList/EventListSection';
import { Suspense } from 'react';
import EventListSectionFallback from '@/components/event/eventList/EventListSectionFallback';

export type MainSerachParamsType = {
  page?: string;
  category?: EventCategory['name'];
  keyword?: string;
};

export default async function Page({ searchParams }: { searchParams: Promise<MainSerachParamsType> }) {
  return (
    <div className="w-full min-h-screen">
      <main className="py-6 px-4 sm:px-6 lg:px-8 ">
        <div className="w-full">
          <div className="flex items-center justify-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">🎉 지금 인기 있는 이벤트</h2>
              <p className="text-muted-foreground">놓치면 후회할 핫한 이벤트들을 확인해보세요</p>
            </div>
            {/* <EventListLayoutToggleButtons />  테스트중인 기능*/}
          </div>
          <div>{/*인기있는 이벤트 리스트 보여줄 자리(4~5개정도)*/}</div>
          <Suspense fallback={<EventListSectionFallback />}>
            <EventListSection {...await searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

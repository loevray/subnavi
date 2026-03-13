import { EventCategory } from '@/dto/event/shared-event.dto';

import EventListSection from '@/components/event/eventList/EventListSection';
import { Suspense } from 'react';
import EventListSectionFallback from '@/components/event/eventList/EventListSectionFallback';

export type MainSerachParamsType = {
  page?: string;
  category?: EventCategory['name'];
  keyword?: string;
};

const paletteDots = ['#b8a8d8', '#cc3333', '#f0a898', '#c8963c', '#d0e4f8', '#f0eef8'];

export default async function Page({ searchParams }: { searchParams: Promise<MainSerachParamsType> }) {
  return (
    <div className="w-full min-h-screen">
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
              <span>COLOR FROM</span>
              <div className="flex items-center gap-2.5">
                {paletteDots.map((color) => (
                  <span key={color} className="size-5 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>

            <h2 className="mb-2 text-4xl font-black tracking-tight text-[#f6f0ff]">🎉 지금 인기 있는 이벤트</h2>
            <p className="text-muted-foreground">놓치면 후회할 핫한 이벤트들을 확인해보세요</p>
          </div>

          <Suspense fallback={<EventListSectionFallback />}>
            <EventListSection {...await searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

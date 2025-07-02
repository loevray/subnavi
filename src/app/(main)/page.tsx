import { EventCategory } from '@/dto/event/shared-event.dto';
import Link from 'next/link';
import EventSearchForm from '@/components/event/EventSearchForm';
import ScrollHeader from './ScrollHeader';
import EventListSection from '@/components/event/eventList/EventListSection';
import EventListSectionError from '@/components/event/eventList/EventListSectionError';
import EventFilterContainer from '@/components/event/eventFilter/EventFilterContainer';
import EventFilterContainerError from '@/components/event/eventFilter/EventFilterConatinerError';
import AsyncBoundary from '@/components/common/AsyncBoundary';
import EventFilterFallback from '@/components/event/eventFilter/EventFilterFallback';
import EventListSectionFallback from '@/components/event/eventList/EventListSectionFallback';

export type MainSerachParamsType = {
  page?: string;
  category?: EventCategory['name'];
  keyword?: string;
};

export default async function Page({ searchParams }: { searchParams: Promise<MainSerachParamsType> }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <ScrollHeader className="flex-col  bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center">
          <Link href="/">
            <img width={140} className="hidden md:block" src="/subnavi-logo.svg" alt="go to home logo" />
            <img width={60} className="block md:hidden" src="/subnavi-compass-logo.svg" alt="go to home logo" />
          </Link>
          <EventSearchForm />
        </div>
        <div className="w-full py-2 mb-2 overflow-x-auto">
          <AsyncBoundary errorComponent={EventFilterContainerError} fallback={<EventFilterFallback />}>
            <EventFilterContainer />
          </AsyncBoundary>
        </div>
      </ScrollHeader>

      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="flex items-center justify-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 지금 인기 있는 이벤트</h2>
              <p className="text-gray-600">놓치면 후회할 핫한 이벤트들을 확인해보세요</p>
            </div>
            {/* <EventListLayoutToggleButtons />  테스트중인 기능*/}
          </div>
          <div>{/*인기있는 이벤트 리스트 보여줄 자리(4~5개정도)*/}</div>
          <AsyncBoundary errorComponent={EventListSectionError} fallback={<EventListSectionFallback />}>
            <EventListSection {...await searchParams} />
          </AsyncBoundary>
        </div>
      </main>
    </div>
  );
}

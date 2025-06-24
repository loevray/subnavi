import EventPagination from '@/components/event/EventPagination';
import EventFilter from '@/components/event/EventFilter';
import EventList from '@/components/event/EventList';
import { EventCategory } from '@/dto/event/shared-event.dto';
import { eventService } from '@/services/Event';
import { categoryService } from '@/services/Category';
import Link from 'next/link';
import EventSearchForm from '@/components/event/EventSearchForm';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: EventCategory['name'];
    keyword?: string;
  }>;
}) {
  const { page, category, keyword } = await searchParams;

  const { events, pagination } = await eventService.getEvents({
    page: parseInt(page ?? '1'),
    pageSize: 5, //기본 페이지 사이즈
    category, //category는 전체일때 없음
    keyword,
  });
  const categories = await categoryService.getCateogires();

  const isEmptyEvents = events?.length <= 0;
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <header className="flex items-center bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
        <Link href={'/'}>
          <img
            width={160}
            className="hidden md:block"
            src="/subnavi-logo.svg"
            alt="go to home logo"
          />
          <img
            width={70}
            className="block md:hidden"
            src="/subnavi-compass-logo.svg"
            alt="go to home logo"
          />
        </Link>
        <EventSearchForm />
      </header>

      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="w-full pb-4 mb-2 overflow-x-auto">
            <EventFilter categories={categories} />
          </div>
          <div className="flex items-center justify-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 지금 인기 있는 이벤트
              </h2>
              <p className="text-gray-600">
                놓치면 후회할 핫한 이벤트들을 확인해보세요
              </p>
            </div>
            {/* <EventListLayoutToggleButtons />  테스트중인 기능*/}
          </div>
          <div>{/*인기있는 이벤트 리스트 보여줄 자리(4~5개정도)*/}</div>

          {isEmptyEvents ? (
            <div className="h-80 flex justify-center items-center text-3xl font-semibold">
              <p>
                {category ?? '전체'} 관련 {keyword ? `'${keyword}'` : ''}
                이벤트가 없습니다!😥
              </p>
            </div>
          ) : (
            <EventList events={events} />
          )}

          <footer className="mt-12">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600">
                총{' '}
                <span className="font-semibold text-indigo-600">1,247개</span>{' '}
                이벤트 중
                <span className="font-semibold text-indigo-600"> 1-10개</span>{' '}
                표시
              </div>
            </div>
            <EventPagination
              totalItems={pagination.total}
              itemsPerPage={pagination.pageSize}
              maxVisiblePages={1}
            />
          </footer>
        </div>
      </main>
    </div>
  );
}

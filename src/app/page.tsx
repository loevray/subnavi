import EventPagination from '@/components/event/EventPagination';
import { EventsApi } from '@/lib/api-client';
import EventFilter from '@/components/event/EventFilter';
import EventListLayoutToggleButtons from '@/components/event/EventListLayoutToggleButtons';
import EventList from '@/components/event/EventList';
import { EventCategory } from '@/dto/event/shared-event.dto';
import { Input } from '@/components/ui/input';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: EventCategory['name'];
  }>;
}) {
  const { page, category } = await searchParams;

  const { events, pagination } = await EventsApi.getAll({
    page: parseInt(page ?? '1'),
    pageSize: 5, //기본 페이지 사이즈
    category, //category는 전체일때 없음
  });
  const categories = await EventsApi.Categories.getAll();
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <header className="flex items-center bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={180} src="/subnavi-logo.svg" alt="SUBNAVI" />
        <Input className="max-w-3xl" /> {/* 검색용 인풋 자리 */}
      </header>

      <div className="py-6 px-4 sm:px-6 lg:px-8">
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
            <EventListLayoutToggleButtons />
          </div>
          <div>{/*인기있는 이벤트 리스트 보여줄 자리(4~5개정도)*/}</div>
          <EventList events={events} />

          <div className="mt-12">
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
          </div>
        </div>
      </div>
    </div>
  );
}

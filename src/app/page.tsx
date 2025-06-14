import EventPagination from '@/components/event/EventPagination';
import { EventsApi } from '@/lib/api-client';
import EventFilter from '@/components/event/EventFilter';
import EventListLayoutToggleButtons from '@/components/event/EventListLayoutToggleButtons';
import EventList from '@/components/event/EventList';

export default async function Page() {
  const { events } = await EventsApi.getAll();
  const categories = await EventsApi.Categories.getAll();
  return (
    <div className="overflow-x-hidden min-h-screen bg-gradient-to-br max-w-[112rem] from-slate-50 via-white to-indigo-50">
      <div className="py-8  bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
        <EventFilter categories={categories} />
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Section Header */}
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

          <EventList events={events} />

          <div className="mt-12">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600">
                총{' '}
                <span className="font-semibold text-indigo-600">1,247개</span>{' '}
                이벤트 중
                <span className="font-semibold text-indigo-600"> 1-24개</span>{' '}
                표시
              </div>
            </div>
            <EventPagination
              totalItems={63}
              itemsPerPage={10}
              maxVisiblePages={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

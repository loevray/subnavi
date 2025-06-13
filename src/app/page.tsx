import EventCard from '@/components/event/EventCard';
import EventPagination from '@/components/event/EventPagination';
import { EventsApi } from '@/lib/api-client';
import EventFilter from '@/components/event/EventFilter';
import EventListLayoutToggleButtons from '@/components/event/EventListLayoutToggleButtons';
import Link from 'next/link';

export default async function Page() {
  const { events } = await EventsApi.getAll();
  const categories = await EventsApi.Categories.getAll();
  return (
    <div className="overflow-x-hidden min-h-screen bg-gradient-to-br max-w-[112rem] from-slate-50 via-white to-indigo-50">
      <div className="py-8  bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
        <EventFilter categories={categories} />
      </div>
      {/* Events Section */}
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

          {/* Events Grid */}
          <div
            className="grid gap-4 place-items-center md:place-items-stretch 
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
          "
          >
            {events.map(
              ({
                id,
                title,
                poster_image_url,
                start_datetime,
                end_datetime,
                location,
                event_categories,
              }) => (
                <Link
                  key={id}
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${id}`}
                >
                  <EventCard
                    title={title}
                    thumbnailSrc={
                      poster_image_url ?? 'https://picsum.photos/600/400'
                    }
                    dateRange={{ start: start_datetime, end: end_datetime }}
                    address={location}
                    tagData={event_categories.map(({ id, name }) => ({
                      key: `${id}`,
                      label: name,
                      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
                    }))}
                  />
                </Link>
              )
            )}
          </div>

          {/* Improved Pagination */}
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

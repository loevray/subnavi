import { eventService } from '@/services/Event';
import EventList from './EventList';
import { MainSerachParamsType } from '@/app/(main)/page';
import EventPagination from '../EventPagination';

export default async function EventListSection(params: MainSerachParamsType) {
  const { page, category, keyword } = params;

  const response = await eventService.getEvents({
    page: parseInt(page ?? '1'),
    pageSize: 5, //기본 페이지 사이즈
    category, //category는 전체일때 없음
    keyword,
  });

  if (!response.success) return <div>이벤트 리스트 fetching 실패</div>;

  const { events, pagination } = response.data;

  const isEmptyEvents = events?.length <= 0;

  return (
    <>
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
            총 <span className="font-semibold text-indigo-600">{pagination.total}개</span> 이벤트 중
            <span className="font-semibold text-indigo-600">
              {' '}
              {(pagination.page - 1) * pagination.pageSize || 1}-{pagination.page * pagination.pageSize}
            </span>{' '}
            번째
          </div>
        </div>
        <EventPagination totalItems={pagination.total} itemsPerPage={pagination.pageSize} maxVisiblePages={1} />
      </footer>
    </>
  );
}

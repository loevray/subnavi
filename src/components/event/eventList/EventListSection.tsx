import { eventService } from '@/services/Event';
import EventList from './EventList';
import { MainSerachParamsType } from '@/app/(main)/page';
import EventPagination from '../EventPagination';
import { EventListResponse } from '@/dto/event/event-list.dto';

type EventListSectionProps = MainSerachParamsType & {
  initialData?: EventListResponse;
  gridClassName?: string;
  showPagination?: boolean;
};

export default async function EventListSection({
  initialData,
  gridClassName,
  showPagination = true,
  ...params
}: EventListSectionProps) {
  const { page, category, keyword } = params;
  let resolvedData = initialData;

  if (!resolvedData) {
    const response = await eventService.getEvents({
      page: parseInt(page ?? '1'),
      pageSize: 5, //기본 페이지 사이즈
      category, //category는 전체일때 없음
      keyword,
    });

    if (!response.success) {
      return <div>이벤트 리스트 fetching 실패</div>;
    }

    resolvedData = response.data;
  }

  const { events, pagination } = resolvedData;

  const isEmptyEvents = events?.length <= 0;
  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

  return (
    <>
      {isEmptyEvents ? (
        <div className="flex h-80 items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/80 px-6 text-center">
          <div>
            <p className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-3xl">
              조건에 맞는 행사를 아직 찾지 못했어요.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              {category ?? '전체'} 범위에서 {keyword ? `'${keyword}'` : '입력한 조건'} 기준으로 검색했지만 결과가
              없었습니다. 다른 키워드나 카테고리로 다시 좁혀보세요.
            </p>
          </div>
        </div>
      ) : (
        <EventList events={events} gridClassName={gridClassName} />
      )}

      {showPagination && (
        <footer className="mt-12">
          <div className="mb-6 text-center">
            <div className="text-sm text-slate-600">
              총 <span className="font-semibold text-indigo-600">{pagination.total}개</span> 행사 중{' '}
              <span className="font-semibold text-indigo-600">
                {startItem}-{endItem}
              </span>
              를 보고 있어요
            </div>
          </div>
          <EventPagination totalItems={pagination.total} itemsPerPage={pagination.pageSize} maxVisiblePages={1} />
        </footer>
      )}
    </>
  );
}

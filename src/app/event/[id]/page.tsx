import { notFound } from 'next/navigation';

import EventDetailView from './EventDetailView';
import { eventService } from '@/services/Event';

const UNEXPECTED_EVENT_DETAIL_ERROR_MESSAGE = '행사 상세 정보를 준비하는 중 예상하지 못한 문제가 발생했습니다.';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await eventService.getEventById({ id });

  if (!response.success) {
    if (response.error.code === 'NOT_FOUND' || response.error.code === 'VALIDATION') {
      notFound();
    }

    console.error('Unexpected service failure in event/[id]/page:', {
      id,
      error: response.error,
    });

    throw new Error(UNEXPECTED_EVENT_DETAIL_ERROR_MESSAGE);
  }

  return <EventDetailView event={response.data} />;
}

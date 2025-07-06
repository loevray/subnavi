import EventDetailView from './EventDetailView';
import { eventService } from '@/services/Event';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await eventService.getEventById({ id });
  if (!response.success) return <div>이벤트 상세페이지 fetching중 에러</div>;

  return <EventDetailView event={response.data} />;
}

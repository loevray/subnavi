import EventDetailView from './EventDetailView';
import { eventService } from '@/services/Event';

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await eventService.getEventById({ id });

  return <EventDetailView event={event} />;
}

import { EventsApi } from '@/lib/api-client';

import EventDetailView from './EventDetailView';

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await EventsApi.getById(id);

  return <EventDetailView event={event} />;
}

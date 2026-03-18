import { notFound } from 'next/navigation';

import EventDetailView from './EventDetailView';
import { eventService } from '@/services/Event';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await eventService.getEventById({ id });

  if (!response.success) {
    if (response.error.code === 'NOT_FOUND' || response.error.code === 'VALIDATION') {
      notFound();
    }

    throw new Error(response.error.message);
  }

  return <EventDetailView event={response.data} />;
}

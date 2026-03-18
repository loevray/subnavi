import { notFound } from 'next/navigation';

import EventDetailView from './EventDetailView';
import { eventService } from '@/services/Event';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await eventService.getEventById({ id });

  if (!response.success) {
    if (response.error.code === 'NOT_FOUND') {
      notFound();
    }

    return <div>?대깽???곸꽭 ?붾㈃???덈윭? 諛쒖깮?덉뒿?덈떎.</div>;
  }

  return <EventDetailView event={response.data} />;
}

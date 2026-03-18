import { notFound } from 'next/navigation';

import EventModal from '@/components/event/EventModal';
import { isDevelopmentEnvironment } from '@/utils/runtimeEnvironment';

export default function Page() {
  if (!isDevelopmentEnvironment()) {
    notFound();
  }

  return <EventModal />;
}

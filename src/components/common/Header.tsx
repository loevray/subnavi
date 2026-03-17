import ScrollHeader from '@/app/(main)/ScrollHeader';
import EventFilterContainer from '../event/eventFilter/EventFilterContainer';
import RenderChildrenByPath from './RenderChildrenByPath';
import { Suspense } from 'react';
import EventFilterFallback from '../event/eventFilter/EventFilterFallback';
import HeaderTopBar from './HeaderTopBar';

export default function Header() {
  return (
    <ScrollHeader className="flex-col  bg-white/50 backdrop-blur-sm border-b border-gray-100">
      <Suspense>
        <HeaderTopBar />
      </Suspense>
      <RenderChildrenByPath>
        <Suspense fallback={<EventFilterFallback />}>
          <EventFilterContainer />
        </Suspense>
      </RenderChildrenByPath>
    </ScrollHeader>
  );
}

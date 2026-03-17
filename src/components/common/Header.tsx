import ScrollHeader from '@/app/(main)/ScrollHeader';
import EventFilterContainer from '../event/eventFilter/EventFilterContainer';
import RenderChildrenByPath from './RenderChildrenByPath';
import { Suspense } from 'react';
import EventFilterFallback from '../event/eventFilter/EventFilterFallback';
import HeaderTopBar from './HeaderTopBar';

export default function Header() {
  return (
    <ScrollHeader className="flex-col items-center bg-white/50 backdrop-blur-sm border-b border-gray-100">
      <Suspense fallback={<div className="h-16 w-full" />}>
        <HeaderTopBar />
      </Suspense>
      <Suspense fallback={null}>
        <RenderChildrenByPath>
          <Suspense fallback={<EventFilterFallback />}>
            <EventFilterContainer />
          </Suspense>
        </RenderChildrenByPath>
      </Suspense>
    </ScrollHeader>
  );
}

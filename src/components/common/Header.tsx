import ScrollHeader from '@/app/(main)/ScrollHeader';
import EventSearchForm from '../event/EventSearchForm';
import Link from 'next/link';
import EventFilterContainer from '../event/eventFilter/EventFilterContainer';
import RenderChildrenByPath from './RenderChildrenByPath';
import { Suspense } from 'react';
import EventFilterFallback from '../event/eventFilter/EventFilterFallback';

export default async function Header() {
  return (
    <ScrollHeader className="flex-col border-b border-primary/20 bg-[#1b1632]/90 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img width={40} className="hidden md:block" src="/subnavi-compass-logo.svg" alt="go to home logo" />
          <img width={34} className="block md:hidden" src="/subnavi-compass-logo.svg" alt="go to home logo" />
          <div className="hidden md:block">
            <p className="text-xl leading-none font-black tracking-[0.05em]">SUBNAVI</p>
            <p className="text-[11px] text-muted-foreground mt-1">서브컬쳐 정보</p>
          </div>
        </Link>

        <Suspense>
          <EventSearchForm />
        </Suspense>
      </div>

      <RenderChildrenByPath>
        <div className="border-t border-primary/15">
          <Suspense fallback={<EventFilterFallback />}>
            <EventFilterContainer />
          </Suspense>
        </div>
      </RenderChildrenByPath>
    </ScrollHeader>
  );
}

'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import EventSearchForm from '../event/EventSearchForm';

function isEventDetailPath(pathname: string) {
  return /^\/event\/[^/]+$/.test(pathname);
}

export default function HeaderTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isEventDetail = isEventDetailPath(pathname);

  if (isEventDetail) {
    return (
      <div className="relative flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="
            absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200
            bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-white
            sm:left-6 lg:left-8
          "
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>

        <Link href="/" aria-label="Go to home">
          <img width={140} src="/subnavi-logo.svg" alt="subnavi logo" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-6 lg:px-8">
      <Link href="/" className="justify-self-start">
        <img width={140} className="hidden md:block" src="/subnavi-logo.svg" alt="go to home logo" />
        <img width={60} className="block md:hidden" src="/subnavi-compass-logo.svg" alt="go to home logo" />
      </Link>
      <div className="min-w-0 justify-self-center">
        <EventSearchForm />
      </div>
      <div className="hidden sm:block sm:w-[140px]" aria-hidden />
    </div>
  );
}

import ScrollHeader from '@/app/(main)/ScrollHeader';
import EventSearchForm from '../event/EventSearchForm';
import Link from 'next/link';
import EventFilterContainer from '../event/eventFilter/EventFilterContainer';

export default async function Header() {
  return (
    <ScrollHeader className="flex-col  bg-white/50 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center">
        <Link href="/">
          <img width={140} className="hidden md:block" src="/subnavi-logo.svg" alt="go to home logo" />
          <img width={60} className="block md:hidden" src="/subnavi-compass-logo.svg" alt="go to home logo" />
        </Link>
        <EventSearchForm />
      </div>
      <EventFilterContainer />
    </ScrollHeader>
  );
}

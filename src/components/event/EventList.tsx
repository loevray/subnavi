import { EventListItem, EventListResponse } from '@/dto/event/event-list.dto';
import EventCard from './EventCard';
import formatUtcToKst from '@/utils/formatUtcToKst';
import Link from 'next/link';

export const DEFAULT_TAG_BG = 'bg-gradient-to-r from-indigo-500 to-purple-500';

function formatEventData(event: EventListItem) {
  const { startDatetime, endDatetime, categories } = event;

  const startDate = formatUtcToKst(startDatetime);
  const endDate = formatUtcToKst(endDatetime);

  return {
    dateRange: {
      start: `${startDate.year}.${startDate.month}.${startDate.day}`,
      end: `${endDate.year}.${endDate.month}.${endDate.day}`,
    },
    tags: categories.map(({ id, name }) => ({
      key: `${id}`,
      label: name,
      color: DEFAULT_TAG_BG,
    })),
  };
}

export const GRID_STYLES =
  `grid gap-4 place-items-center md:place-items-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
    .replace(/\s+/g, ' ')
    .trim();

export const DEFAULT_THUMBNAIL = 'https://picsum.photos/600/400';

const createEventUrl = (id: string) =>
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/event/${id}`;

export default function EventList({
  events,
}: {
  events: EventListResponse['events'];
}) {
  return (
    <div className={GRID_STYLES}>
      {events.map((event) => {
        const { dateRange, tags } = formatEventData(event);
        const { title, id, posterImageUrl, location } = event;

        return (
          <Link className="contents" key={id} href={createEventUrl(id)}>
            <EventCard
              title={title}
              posterImageUrl={posterImageUrl ?? DEFAULT_THUMBNAIL}
              dateRange={dateRange}
              address={location}
              tagData={tags}
            />
          </Link>
        );
      })}
    </div>
  );
}

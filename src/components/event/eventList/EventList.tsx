import { EventListResponse } from '@/dto/event/event-list.dto';
import EventCard from '../eventCard/EventCard';
import Link from 'next/link';
import { DEFAULT_EVENT_TAG_BG, DEFAULT_EVENT_THUMBNAIL } from '@/constants/event';
import formatEventListItemPreview from '@/utils/formatEventListItemPreview';

export const GRID_STYLES =
  `grid gap-4 place-items-center md:place-items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
    .replace(/\s+/g, ' ')
    .trim();

const createEventUrl = (id: string) => `${process.env.NEXT_PUBLIC_BASE_URL}/event/${id}`;

export default function EventList({
  events,
  gridClassName = GRID_STYLES,
}: {
  events: EventListResponse['events'];
  gridClassName?: string;
}) {
  return (
    <div className={gridClassName}>
      {events.map((event) => {
        const { dateRange } = formatEventListItemPreview(event);
        const { title, id, posterImageUrl, location, categories } = event;
        const tags = categories.map(({ id: categoryId, name }) => ({
          key: `${categoryId}`,
          label: name,
          color: DEFAULT_EVENT_TAG_BG,
        }));

        return (
          <Link className="contents" key={id} href={createEventUrl(id)}>
            <EventCard
              title={title}
              posterImageUrl={posterImageUrl ?? DEFAULT_EVENT_THUMBNAIL}
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

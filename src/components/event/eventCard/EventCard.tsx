import { CalendarDays, MapPin } from 'lucide-react';
import EventTag, { EventTagType } from '../EventTag';

export interface I_EventCard {
  title: string;
  posterImageUrl: string;
  dateRange: {
    start: string;
    end: string;
  };
  address: string;
  tagData: EventTagType[];
}

export const DUMMY_TAG_DATA = [
  {
    key: 'electronic',
    label: 'Electronic',
    color: 'bg-violet-500/75',
  },
  {
    key: 'indoor',
    label: 'Indoor',
    color: 'bg-sky-500/75',
  },
];

export const DUMMY_EVENT_CARD_DATA: I_EventCard[] = [
  {
    title: 'Neon Pulse: Underground Sessions',
    dateRange: { start: '2025.07.19', end: '2025.07.20' },
    address: 'Berlin Industrial District 4',
    posterImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    tagData: DUMMY_TAG_DATA,
  },
  {
    title: 'Echo Chamber Sessions',
    dateRange: { start: '2025.10.25', end: '2025.10.26' },
    address: 'London - The Vault',
    posterImageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    tagData: DUMMY_TAG_DATA,
  },
];

function formatDateRange(dateRange: I_EventCard['dateRange']) {
  if (dateRange.start === dateRange.end) {
    return dateRange.start;
  }

  return `${dateRange.start} - ${dateRange.end}`;
}

export default function EventCard({ title, posterImageUrl, dateRange, address, tagData }: I_EventCard) {
  return (
    <article
      className="
        group relative w-full min-w-0 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white text-slate-900
        shadow-[0_16px_40px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1
        sm:overflow-visible sm:border-none sm:bg-transparent sm:shadow-none
      "
    >
      <div className="overflow-hidden rounded-t-[24px] bg-slate-100 sm:rounded-[24px]">
        <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={posterImageUrl}
            alt={`${title} poster`}
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-slate-950/8" />

          {tagData.length > 0 && (
            <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-24px)] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:max-w-[calc(100%-32px)]">
              {tagData.slice(0, 2).map(({ key, label, color }) => (
                <EventTag
                  key={key}
                  label={label}
                  color={color}
                  className="max-w-full rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-none backdrop-blur-sm"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="
          relative z-10 min-w-0 bg-white px-4 pb-4 pt-3
          sm:mx-0 sm:mt-0 sm:rounded-none sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-3 sm:shadow-none
        "
      >
        <h3
          title={title}
          className="line-clamp-2 text-[1rem] font-extrabold leading-tight tracking-[-0.02em] text-slate-900 sm:min-h-[3.25rem] sm:text-[1.45rem]"
        >
          {title}
        </h3>

        <div className="mt-3 flex min-w-0 flex-col gap-2 text-[13px] text-slate-500 sm:mt-3.5 sm:text-sm">
          <div className="flex min-w-0 items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <time className="min-w-0 line-clamp-1 font-medium text-slate-500">{formatDateRange(dateRange)}</time>
          </div>

          <div className="flex min-w-0 items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <address className="min-w-0 line-clamp-2 not-italic font-medium text-slate-500">{address}</address>
          </div>
        </div>
      </div>
    </article>
  );
}

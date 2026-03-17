import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPin, Sparkles } from 'lucide-react';

import EventTag from '@/components/event/EventTag';
import { DEFAULT_EVENT_TAG_BG, DEFAULT_EVENT_THUMBNAIL } from '@/constants/event';
import { EventListItem } from '@/dto/event/event-list.dto';
import formatEventListItemPreview from '@/utils/formatEventListItemPreview';

interface FeaturedEventHeroProps {
  event: EventListItem;
}

function createHeroDescription(event: EventListItem, categoryLabels: string[]) {
  const featuredCategories = categoryLabels.slice(0, 2).join(' · ');
  const categoryCopy = featuredCategories
    ? `${featuredCategories} 팬이라면 눈여겨볼 일정`
    : '지금 가장 먼저 확인해 둘 일정';

  return `${event.region}에서 열리는 대표 행사예요. ${categoryCopy}을 한눈에 살펴보고 상세 페이지에서 더 많은 정보를 확인해 보세요.`;
}

export default function FeaturedEventHero({ event }: FeaturedEventHeroProps) {
  const { dateLabel, categoryLabels } = formatEventListItemPreview(event);
  const description = createHeroDescription(event, categoryLabels);
  const posterImageUrl = event.posterImageUrl ?? DEFAULT_EVENT_THUMBNAIL;
  const ageRatingLabel = event.ageRating ?? '연령 정보 없음';

  return (
    <article className="relative isolate overflow-hidden rounded-[32px] border border-slate-200/70 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.26)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={posterImageUrl} alt={`${event.title} 포스터`} className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.25),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.32),transparent_28%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/82 to-slate-900/24" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/10" />

      <div className="relative z-10 flex min-h-[360px] flex-col justify-between gap-8 px-5 py-6 sm:px-7 sm:py-8 lg:min-h-[430px] lg:flex-row lg:items-end lg:px-10 lg:py-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Featured Event
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {event.categories.slice(0, 3).map(({ id, name }) => (
                <EventTag
                  key={id}
                  label={name}
                  color={DEFAULT_EVENT_TAG_BG}
                  className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-none backdrop-blur-sm"
                />
              ))}
            </div>

            <h1 className="max-w-[12ch] text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>

            <p className="max-w-xl text-sm leading-7 text-slate-200 sm:text-base">{description}</p>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-100 sm:max-w-xl sm:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-slate-200">
                <CalendarDays className="h-4 w-4" />
                일정
              </div>
              <p className="mt-2 font-semibold text-white">{dateLabel}</p>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="h-4 w-4" />
                장소
              </div>
              <p className="mt-2 line-clamp-2 font-semibold text-white">{event.location}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/event/${event.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
            >
              행사 자세히 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

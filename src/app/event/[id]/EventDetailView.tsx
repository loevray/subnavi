import EventTag from '@/components/event/EventTag';
import { Button } from '@/components/ui/button';
import { DEFAULT_EVENT_TAG_BG } from '@/constants/event';
import type { EventDetailResponse } from '@/dto/event/event-detail.dto';
import formatDateRange from '@/utils/formatDateRange';
import getEventStatusLabel from '@/utils/getEventStatusLabel';
import {
  Bookmark,
  CalendarDays,
  ExternalLink,
  Globe,
  Info,
  MapPin,
  Share2,
  ShieldCheck,
  Ticket,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

type MainInfoItem = {
  icon: React.ElementType;
  label: string;
  value: string;
  helper?: string;
};

export default function EventDetailView({ event }: { event: EventDetailResponse }) {
  const {
    title,
    categories,
    posterImageUrl,
    location,
    startDatetime,
    endDatetime,
    bookingLink,
    description,
    eventRules,
    officialWebsite,
    snsLinks,
    ageRating,
    status,
    organizerName,
    organizerContact,
    participationFee,
  } = event;

  const dateRange = formatDateRange(startDatetime, endDatetime);
  const eventSummary = description ?? 'Event details will be announced soon.';
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const mainInfoItems: MainInfoItem[] = [
    {
      icon: CalendarDays,
      label: '일정',
      value: `${dateRange.start} - ${dateRange.end}`,
      helper: getEventStatusLabel(status),
    },
    {
      icon: Wallet,
      label: '가격',
      value: participationFee ?? '무료',
    },
    {
      icon: ShieldCheck,
      label: '관람 등급',
      value: ageRating ?? '제한 없음',
    },
    {
      icon: MapPin,
      label: '주소',
      value: location,
      helper: '서울 시 어쩌구',
    },
  ];

  return (
    <main className="mx-auto max-w-[1280px] bg-[#f6f4fb] px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-8">
      <MobileDetailLayout
        title={title}
        categories={categories}
        posterImageUrl={posterImageUrl}
        eventSummary={eventSummary}
        officialWebsite={officialWebsite}
        mainInfoItems={mainInfoItems}
        organizerName={organizerName}
        organizerContact={organizerContact}
        directionsUrl={directionsUrl}
        bookingLink={bookingLink}
        location={location}
      />

      <DesktopDetailLayout
        title={title}
        categories={categories}
        posterImageUrl={posterImageUrl}
        eventSummary={eventSummary}
        eventRules={eventRules}
        location={location}
        mainInfoItems={mainInfoItems}
        bookingLink={bookingLink}
        officialWebsite={officialWebsite}
        organizerName={organizerName}
        organizerContact={organizerContact}
        snsLinks={snsLinks}
      />

      {bookingLink && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <Button
            asChild
            className="h-11 w-full rounded-full bg-violet-500 text-[15px] font-semibold text-white shadow-[0_16px_30px_rgba(124,58,237,0.24)] hover:bg-violet-600"
          >
            <Link href={bookingLink} target="_blank" rel="noopener noreferrer">
              <Ticket className="size-4.5" />
              예매하기
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}

function MobileDetailLayout({
  title,
  categories,
  posterImageUrl,
  eventSummary,
  officialWebsite,
  mainInfoItems,
  organizerName,
  organizerContact,
  directionsUrl,
  bookingLink,
  location,
}: {
  title: string;
  categories: EventDetailResponse['categories'];
  posterImageUrl: string | null | undefined;
  eventSummary: string;
  officialWebsite: string | null | undefined;
  mainInfoItems: MainInfoItem[];
  organizerName: string;
  organizerContact: string | null | undefined;
  directionsUrl: string;
  bookingLink: string | null | undefined;
  location: string;
}) {
  return (
    <div className="space-y-7 lg:hidden">
      <section className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={posterImageUrl ?? '/event-placeholder.png'} alt={title} className="h-[265px] w-full object-cover" />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map(({ id, name }) => (
            <EventTag
              key={`${id}-${name}`}
              label={name}
              color={DEFAULT_EVENT_TAG_BG}
              className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
            />
          ))}
        </div>

        <h1 className="text-[2.2rem] font-extrabold leading-[1.05] tracking-[-0.05em] text-slate-950">{title}</h1>

        {officialWebsite && (
          <Button
            asChild
            className="mt-5 h-12 w-full rounded-full bg-violet-500 text-base font-semibold text-white shadow-[0_16px_30px_rgba(124,58,237,0.24)] hover:bg-violet-600"
          >
            <Link href={officialWebsite} target="_blank" rel="noopener noreferrer">
              <Globe className="size-4.5" />
              공식 웹사이트
            </Link>
          </Button>
        )}
      </section>

      <MainInfoSectionMobile items={mainInfoItems} />

      <section>
        <p className="mb-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Organized by</p>
        <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-lg font-semibold text-violet-500">
              {organizerName.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-extrabold text-slate-950">{organizerName}</p>
              <p className="mt-1 text-sm text-slate-500">{organizerContact ?? 'Verified organizer'}</p>
            </div>
            <button
              type="button"
              className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-500 transition-colors hover:bg-violet-100"
            >
              Follow
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950">행사에 관하여</h2>
        <div className="mt-4 space-y-5 text-[1.04rem] leading-9 text-slate-700">
          <p>{eventSummary}</p>
          <p>
            {bookingLink
              ? 'Expect immersive visuals, a carefully curated program, and an atmosphere designed for the community to stay all night.'
              : 'Program details and additional updates will continue to be announced as the event date gets closer.'}
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Location</h2>
          <Link
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-violet-500"
          >
            Get Directions
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <iframe
            title="event-location-map-mobile"
            src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
            width="100%"
            height="260"
            className="h-[260px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="mt-4 text-[1rem] leading-8 text-slate-500">{location}</p>
      </section>
    </div>
  );
}

function DesktopDetailLayout({
  title,
  categories,
  posterImageUrl,
  eventSummary,
  eventRules,
  location,
  mainInfoItems,
  bookingLink,
  officialWebsite,
  organizerName,
  organizerContact,
  snsLinks,
}: {
  title: string;
  categories: EventDetailResponse['categories'];
  posterImageUrl: string | null | undefined;
  eventSummary: string;
  eventRules: string | null | undefined;
  location: string;
  mainInfoItems: MainInfoItem[];
  bookingLink: string | null | undefined;
  officialWebsite: string | null | undefined;
  organizerName: string;
  organizerContact: string | null | undefined;
  snsLinks: Record<string, string> | null | undefined;
}) {
  return (
    <div className="hidden space-y-6 lg:block">
      <section className="relative overflow-hidden rounded-[32px] bg-slate-900 shadow-[0_28px_60px_rgba(15,23,42,0.18)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterImageUrl ?? '/event-placeholder.png'}
          alt={title}
          className="h-[270px] w-full object-cover md:h-[340px] lg:h-[400px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-slate-950/20" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map(({ id, name }) => (
              <EventTag
                key={`${id}-${name}`}
                label={name}
                color={DEFAULT_EVENT_TAG_BG}
                className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm"
              />
            ))}
          </div>

          <h1 className="max-w-4xl text-3xl font-extrabold tracking-[-0.04em] text-white md:text-4xl lg:text-[3.4rem]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80 md:text-base">{eventSummary}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_320px] lg:items-stretch">
        <div className="space-y-6">
          <ContentCard title="행사에 관하여" icon={Info}>
            <div className="space-y-4 text-[15px] leading-8 text-slate-600">
              <p>{eventSummary}</p>
              {eventRules && <p>{eventRules}</p>}
              {!eventRules && (
                <p>
                  This event brings together atmosphere, community, and immersive programming in one place. Full event
                  guidelines will be announced soon.
                </p>
              )}
            </div>
          </ContentCard>

          <ContentCard title="위치 & 지도" icon={MapPin}>
            <p className="mb-5 text-[15px] text-slate-600">{location}</p>
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
              <iframe
                title="event-location-map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
                width="100%"
                height="320"
                className="h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ContentCard>
        </div>

        <aside className="flex h-full min-h-full flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_22px_50px_rgba(15,23,42,0.08)]">
          <div className="space-y-5">
            <MainInfoSectionDesktop items={mainInfoItems} />

            <div className="space-y-3 pt-2">
              {bookingLink && (
                <Button
                  asChild
                  className="h-12 w-full rounded-full bg-violet-500 text-base font-semibold text-white shadow-[0_18px_30px_rgba(124,58,237,0.24)] hover:bg-violet-600"
                >
                  <Link href={bookingLink} target="_blank" rel="noopener noreferrer">
                    <Ticket className="size-4.5" />
                    예매하기
                  </Link>
                </Button>
              )}

              {officialWebsite && (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full rounded-full border-slate-200 text-base font-semibold text-violet-500"
                >
                  <Link href={officialWebsite} target="_blank" rel="noopener noreferrer">
                    <Globe className="size-4.5" />
                    공식 웹사이트
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <div className="rounded-[24px] bg-slate-50 px-4 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Organized By</p>
              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-semibold text-violet-500 shadow-sm">
                  {organizerName.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900">{organizerName}</p>
                  <p className="mt-1 text-sm text-slate-500">{organizerContact ?? 'Contact details coming soon'}</p>
                  <p className="mt-3 text-sm font-semibold text-violet-500">Follow Organizer</p>
                </div>
              </div>
            </div>

            {snsLinks && (
              <div className="rounded-[24px] border border-slate-200 px-4 py-4 text-sm text-slate-600">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(snsLinks).map(([platform, url]) => (
                    <Link
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                    >
                      {platform}
                      <ExternalLink className="size-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <ActionButton icon={Share2} label="Share" />
              <ActionButton icon={Bookmark} label="Save" />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function MainInfoSectionMobile({ items }: { items: MainInfoItem[] }) {
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="space-y-4">
        {items.map(({ icon, label, value, helper }) => (
          <MobileInfoRow key={label} icon={icon} title={value} subtitle={`${label} · ${helper}`} />
        ))}
      </div>
    </section>
  );
}

function MainInfoSectionDesktop({ items }: { items: MainInfoItem[] }) {
  return (
    <section className="rounded-[24px] bg-slate-50 px-4 py-5">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Main Info</div>
      <div className="space-y-4">
        {items.map(({ icon, label, value, helper }) => (
          <DetailInfoBlock key={label} icon={icon} label={label} value={value} helper={helper} />
        ))}
      </div>
    </section>
  );
}

function ContentCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_22px_50px_rgba(15,23,42,0.06)] md:p-8 min-h-80">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-500">
          <Icon className="size-4.5" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function DetailInfoBlock({ icon: Icon, label, value, helper }: MainInfoItem) {
  return (
    <div className="flex gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-500">
        <Icon className="size-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
        <p className="mt-1 text-base font-extrabold tracking-[-0.02em] text-slate-900">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{helper}</p>
      </div>
    </div>
  );
}

function MobileInfoRow({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-500">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[1.05rem] font-extrabold tracking-[-0.03em] text-slate-950">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button
      type="button"
      className="
        flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white
        text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50
      "
    >
      <Icon className="size-4.5" />
      {label}
    </button>
  );
}

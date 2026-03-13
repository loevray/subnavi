import { DEFAULT_TAG_BG } from '@/components/event/eventList/EventList';
import EventTag from '@/components/event/EventTag';
import { EventDetailResponse } from '@/dto/event/event-detail.dto';
import {
  Calendar,
  MapPin,
  ShieldCheck,
  Wallet,
  Activity,
  Globe,
  Phone,
  ExternalLink,
  BadgeCheck,
  Building2,
} from 'lucide-react';
import formatDateRange from '@/utils/formatDateRange';
import { Button } from '@/components/ui/button';
import ShareButtons from '@/components/ui/shareButtons';
import Link from 'next/link';
import HoverOverlay from '@/components/common/HoverOverlay';
import getEventStatusLabel from '@/utils/getEventStatusLabel';

export default async function EventDetailView({ event }: { event: EventDetailResponse }) {
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

  return (
    <main className="mx-auto w-full max-w-[1320px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-2 text-sm text-muted-foreground">홈 {'>'} {categories[0]?.name ?? '행사'} {'>'} {title}</section>

      <section className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card/75 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          <div className="relative overflow-hidden rounded-2xl bg-[#302553]">
            <HoverOverlay src={posterImageUrl ?? ''}>
              <img src={posterImageUrl ?? '/placeholder.jpg'} alt="poster" className="h-full min-h-[320px] w-full object-cover" />
            </HoverOverlay>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[#201836]/65" />
          </div>
        </div>

        <aside className="space-y-5">
          <h1 className="text-4xl font-black tracking-tight text-[#f6f0ff]">{title}</h1>

          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, name }) => (
              <EventTag key={`${id}-${name}`} label={name} color={DEFAULT_TAG_BG} />
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card/65">
            <DetailRow icon={Calendar} label="기간" value={`${dateRange.start} ~ ${dateRange.end}`} />
            <DetailRow icon={MapPin} label="장소" value={location} />
            <DetailRow icon={ShieldCheck} label="관람 연령" value={ageRating ?? '연령제한 없음'} />
            <DetailRow icon={Activity} label="상태" value={getEventStatusLabel(status)} highlightDot />
            <DetailRow icon={Wallet} label="가격" value={participationFee ?? '무료'} emphasize />
          </div>

          <div className="flex items-center gap-2 pt-1">
            {bookingLink && (
              <Button asChild size="lg" className="h-12 flex-1 rounded-xl shadow-[0_0_18px_rgba(240,107,147,0.35)]">
                <Link href={bookingLink} target="_blank" rel="noopener noreferrer">
                  예매하기
                </Link>
              </Button>
            )}
            <ShareButtons url="" title={title} />
          </div>
        </aside>
      </section>

      {(description || eventRules) && (
        <section className="rounded-2xl border border-primary/20 bg-card/60 p-6">
          <SectionTitle icon={BadgeCheck} title="행사 소개" />
          <p className="mt-4 whitespace-pre-line leading-7 text-[#dad0f4]">{description ?? '설명 없음'}</p>
          {eventRules && (
            <div className="mt-6 rounded-xl border border-primary/15 bg-background/35 p-4 text-sm text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">유의사항</p>
              <p className="whitespace-pre-line">{eventRules}</p>
            </div>
          )}
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-primary/20 bg-card/60 p-6">
          <SectionTitle icon={MapPin} title="행사 위치" />
          <div className="mt-4 overflow-hidden rounded-xl border border-primary/15">
            <iframe
              title="event-location-map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
              width="100%"
              height="250"
              className="w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {(officialWebsite || snsLinks) && (
          <div className="rounded-2xl border border-primary/20 bg-card/60 p-6">
            <SectionTitle icon={ExternalLink} title="공식 채널" />
            <div className="mt-4 space-y-3">
              {officialWebsite && <LinkRow icon={Globe} label="공식 홈페이지" href={officialWebsite} />}
              {snsLinks &&
                Object.entries(snsLinks).map(([platform, url]) => (
                  <LinkRow key={platform} icon={ExternalLink} label={platform} href={url} />
                ))}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-primary/20 bg-card/60 p-6">
        <SectionTitle icon={Building2} title="주최자 정보" />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-primary/15 bg-background/35 p-4">
          <div className="space-y-2">
            <p className="text-xl font-bold text-[#f2ecff]">{organizerName}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4" />
              <span>{organizerContact ?? '연락처 없음'}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 text-xl font-bold text-[#f4edff]">
      <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f06b93]/70 to-[#b8a8d8]/70 text-white">
        <Icon className="size-4" />
      </span>
      {title}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  highlightDot = false,
  emphasize = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlightDot?: boolean;
  emphasize?: boolean;
}) {
  return (
    <div className="flex gap-3 border-b border-primary/15 p-4 last:border-b-0">
      <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/70 text-[#d6c8ff]">
        <Icon className="size-4.5" />
      </span>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-base leading-relaxed ${emphasize ? 'text-2xl font-black text-[#f0b490]' : 'text-foreground'}`}>
          {highlightDot && <span className="mr-2 inline-block size-2.5 rounded-full bg-[#f0a898] align-middle" />}
          {value}
        </p>
      </div>
    </div>
  );
}

function LinkRow({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl border border-primary/18 bg-background/35 px-4 py-3 transition-colors hover:border-primary/50 hover:bg-accent/35"
    >
      <span className="flex items-center gap-2 text-foreground">
        <Icon className="size-4 text-muted-foreground" />
        <span className="font-semibold">{label}</span>
      </span>
      <span className="text-sm text-muted-foreground">바로가기</span>
    </a>
  );
}

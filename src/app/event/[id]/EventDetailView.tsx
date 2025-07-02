import { DEFAULT_TAG_BG } from '@/components/event/eventList/EventList';
import EventTag from '@/components/event/EventTag';
import { EventDetailResponse } from '@/dto/event/event-detail.dto';
import { Calendar, MapPin, ShieldCheck, Wallet, Activity, Globe, Phone, ExternalLink } from 'lucide-react';
import formatDateRange from '@/utils/formatDateRange';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ShareButtons from '@/components/ui/shareButtons';
import Link from 'next/link';

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
    <main className="container  max-w-4xl p-6 space-y-6">
      {/* 헤더 */}
      <section className="flex flex-col md:flex-row gap-6">
        {/* 이미지 */}
        <div className="md:w-1/2 rounded-lg overflow-hidden">
          <img src={posterImageUrl ?? '/placeholder.jpg'} alt="poster" className="w-full h-full object-cover" />
        </div>

        {/* 텍스트 */}
        <div className="md:w-1/2 space-y-3">
          <h1 className="text-2xl font-bold">{title}</h1>

          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, name }) => (
              <EventTag key={`${id}-${name}`} label={name} color={DEFAULT_TAG_BG} />
            ))}
          </div>

          <div className="text-sm  space-y-1.5 pt-2">
            <InfoItem icon={Calendar} text={`${dateRange.start} ~ ${dateRange.end}`} />
            <InfoItem icon={MapPin} text={location} />
            <InfoItem icon={ShieldCheck} text={ageRating ?? '연령제한 없음'} />
            <InfoItem icon={Activity} text={status ?? '진행 상태 없음'} />
            <InfoItem icon={Wallet} text={participationFee ?? '무료'} />
          </div>

          <div className="flex gap-2 pt-3">
            {bookingLink && (
              <Button asChild>
                <Link href={bookingLink} target="_blank" rel="noopener noreferrer">
                  예매하기
                </Link>
              </Button>
            )}
            <ShareButtons url="" title={title} />
          </div>
        </div>
      </section>

      <Separator />

      {/* 설명 / 규칙 */}
      {(description || eventRules) && (
        <section>
          <h2 className="text-lg font-semibold">행사 내용</h2>
          <div className="prose prose-sm max-w-none">
            <p>{description ?? '설명 없음'}</p>
            {eventRules && (
              <>
                <h2 className="text-lg font-semibold mt-4">유의사항</h2>
                <p>{eventRules}</p>
              </>
            )}
          </div>
        </section>
      )}

      {/* 지도 */}
      <section>
        <h2 className="text-lg font-semibold mb-2">행사 위치</h2>
        <div className="rounded-lg overflow-hidden">
          <iframe
            title="event-location-map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
            width="100%"
            height="250"
            className="w-full border rounded-lg"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* 주최 & 채널 */}
      <section className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <h3 className="font-semibold">주최자 정보</h3>
          <InfoItem icon={Phone} text={organizerName} />
          <InfoItem icon={Phone} text={organizerContact ?? '연락처 없음'} />
        </div>

        {(officialWebsite || snsLinks) && (
          <div className="space-y-1">
            <h3 className="font-semibold">공식 채널</h3>
            {officialWebsite && <InfoItem icon={Globe} text="홈페이지" href={officialWebsite} />}
            {snsLinks &&
              Object.entries(snsLinks).map(([platform, url]) => (
                <InfoItem key={platform} icon={ExternalLink} text={platform} href={url} />
              ))}
          </div>
        )}
      </section>
    </main>
  );
}

function InfoItem({ icon: Icon, text, href }: { icon: React.ElementType; text: string; href?: string }) {
  const content = (
    <>
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </>
  );
  return (
    <div className="flex items-center gap-2">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

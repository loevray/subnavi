import {
  DEFAULT_TAG_BG,
  DEFAULT_THUMBNAIL,
} from '@/components/event/EventList';
import EventTag from '@/components/event/EventTag';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButtons from '@/components/ui/shareButtons';
import { EventsApi } from '@/lib/api-client';
import formatDateRange from '@/utils/formatDateRange';
import Link from 'next/link';

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const {
    title,
    categories,
    posterImageUrl,
    location,
    startDatetime,
    endDatetime,
    bookingLink,
    description,
  } = await EventsApi.getById(id);

  const dateRange = formatDateRange(startDatetime, endDatetime);

  return (
    <main className="container py-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold">{title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map(({ id, name }) => (
              <EventTag
                key={`${id}-${name}`}
                label={name}
                color={DEFAULT_TAG_BG}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterImageUrl ?? DEFAULT_THUMBNAIL}
              alt="event thumbnail"
              width={400}
              height={300}
              className="rounded-xl object-cover w-full h-auto"
            />
          </div>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {dateRange.start} ~ {dateRange.end}
            </div>
            <address className="not-italic text-base text-gray-800">
              {location}
            </address>
            <div className="flex gap-3">
              <Button asChild disabled={!bookingLink}>
                <Link
                  href={bookingLink ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  예매/예약
                </Link>
              </Button>
              <ShareButtons url="" title={title} />
            </div>
            <div>{description ?? '행사 설명 없음'}</div>
          </div>
          <section className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">행사 장소</h2>
            <div className="rounded-lg overflow-hidden">
              <iframe
                title="event-location-map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  location
                )}&output=embed`}
                width="100%"
                height="250"
                className="w-full border rounded-lg"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="mt-4 flex gap-4">
              <Button asChild variant="outline">
                <Link
                  href="https://map.naver.com/p/directions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  네이버 길찾기
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href="https://map.kakao.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  카카오 길찾기
                </Link>
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}

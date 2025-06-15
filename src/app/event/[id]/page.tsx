import {
  DUMMY_EVENT_CARD_DATA,
  I_EventCard,
} from '@/components/event/EventCard';
import EventTag from '@/components/event/EventTag';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButtons from '@/components/ui/shareButtons';
import Link from 'next/link';

export interface I_EventDetail extends I_EventCard {
  description: string;
  reservationLink: string;
}

const reservationLink = 'https://comicw.co.kr/';

export default async function EventDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // 실제 서비스에서는 id를 기반으로 데이터를 fetch 하셔야 합니다.
  const { title, dateRange, address, posterImageUrl, tagData } =
    DUMMY_EVENT_CARD_DATA[0];

  return (
    <main className="container py-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            id:{id}, {title}
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {tagData.map(({ key, label, color }) => (
              <EventTag key={key} label={label} color={color} />
            ))}
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden">
            <img
              src={posterImageUrl}
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
              {address}
            </address>
            <div className="flex gap-3">
              <Button asChild>
                <Link
                  href={reservationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  예매/예약
                </Link>
              </Button>
              <ShareButtons url="" title={title} />
            </div>
            <div>
              행사 내용:ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ
              ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ
              ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ
              ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ
            </div>
          </div>
          <section className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">행사 장소</h2>
            <div className="rounded-lg overflow-hidden">
              <iframe
                title="event-location-map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  address
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

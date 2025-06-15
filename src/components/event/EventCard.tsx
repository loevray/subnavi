import { Card, CardContent, CardHeader } from '../ui/card';
import EventTag, { EventTagType } from './EventTag';
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
    key: 'comic',
    label: '만화',
    color: 'bg-red-500',
  },
  { key: 'all', label: '장르무관', color: 'bg-cyan-500' },
];

export const DUMMY_EVENT_CARD_DATA: I_EventCard[] = [
  {
    title: '코믹월드 SUMMER 2025',
    dateRange: { start: '2025.07.19', end: '2025.07.20' },
    address: '일산 킨텍스 제1전시장',
    posterImageUrl:
      'https://comicw.co.kr/data/item/1748337413/11_7J6E7Iuc7Ys7Iqk7YSw_6riw67O4.png',
    tagData: DUMMY_TAG_DATA,
  },
  {
    title: '가나다라마바사아자차카타파하 가나다라마바사아자차카타파하',
    dateRange: { start: '2025.07.19', end: '2025.07.20' },
    address: '여기서 저기로 가면 저기서 여기로 가고 여기서 저기로',
    posterImageUrl: 'https://picsum.photos/600/400',
    tagData: DUMMY_TAG_DATA,
  },
];

export default function EventCard({
  title,
  posterImageUrl,
  dateRange,
  address,
  tagData,
}: I_EventCard) {
  return (
    <Card className="py-0 hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg w-full overflow-hidden cursor-pointer group gap-0">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={posterImageUrl}
            alt={`${title} 포스터`}
            loading="lazy"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5 p-3 sm:p-4">
        {/* 제목 - 반응형 텍스트 크기 */}
        <h1
          title={title}
          className="font-bold text-sm sm:text-base lg:text-lg leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]"
        >
          {title}
        </h1>

        {/* 날짜 */}
        <time className="text-xs sm:text-sm text-gray-600 font-medium">
          {`${dateRange.start} ~ ${dateRange.end}`}
        </time>

        {/* 주소와 태그 */}
        <section className="flex items-start justify-between gap-2 mt-1">
          <address
            title={address}
            className="text-xs sm:text-sm text-gray-500 leading-relaxed flex-1 not-italic line-clamp-2 min-h-[2rem]"
          >
            {address}
          </address>

          {/* 태그들 */}
          <div className="flex flex-col gap-1 shrink-0 items-end">
            {tagData.slice(0, 2).map(({ key, label, color }) => (
              <EventTag key={key} label={label} color={color} />
            ))}
            {tagData.length > 2 && (
              <span className="text-xs text-gray-400 mt-1">
                +{tagData.length - 2}
              </span>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

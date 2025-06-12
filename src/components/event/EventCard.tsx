import { Card, CardContent, CardHeader } from '../ui/card';
import EventTag, { EventTagType } from './EventTag';
export interface I_EventCard {
  title: string;
  thumbnailSrc: string;
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
    thumbnailSrc:
      'https://comicw.co.kr/data/item/1748337413/11_7J6E7Iuc7Ys7Iqk7YSw_6riw67O4.png',
    tagData: DUMMY_TAG_DATA,
  },
  {
    title: '가나다라마바사아자차카타파하 가나다라마바사아자차카타파하',
    dateRange: { start: '2025.07.19', end: '2025.07.20' },
    address: '여기서 저기로 가면 저기서 여기로 가고 여기서 저기로',
    thumbnailSrc: 'https://picsum.photos/600/400',
    tagData: DUMMY_TAG_DATA,
  },
];

export default function EventCard({
  title,
  thumbnailSrc,
  dateRange,
  address,
  tagData,
}: I_EventCard) {
  return (
    <Card className="w-full max-w-sm py-0 overflow-hidden gap-0 hover:brightness-95 cursor-pointer">
      <CardHeader className="px-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full aspect-video object-cover"
          src={thumbnailSrc}
          alt="event thumbnail"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5 pt-2 pb-4">
        <h1 title={title} className="font-bold truncate">
          {title}
        </h1>
        <span className="text-xs truncate">{`${dateRange.start} ~ ${dateRange.end}`}</span>
        <section className="flex items-end justify-between gap-2">
          <address title={address} className="text-xs truncate flex-1">
            {address}
          </address>
          {tagData.map(({ key, label, color }) => (
            <EventTag key={key} label={label} color={color} />
          ))}
        </section>
      </CardContent>
    </Card>
  );
}

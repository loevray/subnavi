import { Card, CardContent, CardHeader } from '../ui/card';
import FestivalTag, { FestivalTagType } from './FestivalTag';
interface I_FestivalCard {
  title: string;
  thumbnailSrc: string;
  dateRange: {
    start: string;
    end: string;
  };
  address: string;
  tagData: FestivalTagType[];
}

export const DUMMY_TAG_DATA = [
  {
    key: 'comic',
    label: '만화',
    color: 'bg-red-500',
  },
  { key: 'all', label: '장르무관', color: 'bg-cyan-500' },
];

export default function FestivalCard({
  title,
  thumbnailSrc,
  dateRange,
  address,
  tagData,
}: I_FestivalCard) {
  return (
    <Card className="w-full max-w-sm py-0 overflow-hidden gap-0 hover:brightness-95 cursor-pointer">
      <CardHeader className="px-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full aspect-video object-cover"
          src={thumbnailSrc}
          alt="festival thumbnail"
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
            <FestivalTag key={key} label={label} color={color} />
          ))}
        </section>
      </CardContent>
    </Card>
  );
}

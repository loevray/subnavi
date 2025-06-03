import { Card, CardContent, CardHeader } from '../ui/card';
import FestivalTag from './FestivalTag';
interface I_FestivalCard {
  title: string;
  thumbnailSrc: string;
  dateRange: {
    start: string;
    end: string;
  };
  address: string;
}

export default function FestivalCard({
  title,
  thumbnailSrc,
  dateRange,
  address,
}: I_FestivalCard) {
  return (
    <Card className="w-full max-w-sm py-0 overflow-hidden gap-0">
      <CardHeader className="px-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full aspect-video object-cover"
          src={thumbnailSrc}
          alt="festival thumbnail"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5 pt-2 pb-4">
        <h1 className="font-bold truncate">{title}</h1>
        <span className="text-xs truncate">{`${dateRange.start} ~ ${dateRange.end}`}</span>
        <section className="flex items-end justify-between gap-2">
          <address className="text-xs truncate flex-1">{address}</address>
          <FestivalTag label="만화" color="bg-red-500" />
          <FestivalTag label="장르 무관" color="bg-cyan-500" />
        </section>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader } from '../ui/card';
import FestivalTag from './FestivalTag';

export default function FestivalCard() {
  return (
    <Card className="w-full max-w-sm pt-0 overflow-hidden">
      <CardHeader className="px-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full aspect-video object-cover"
          src="https://comicw.co.kr/data/item/1748337413/11_7J6E7Iuc7Ys7Iqk7YSw_6riw67O4.png"
          alt="festival thumbnail"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <h1 className="font-bold">코믹월드 SUMMER 2025</h1>
        <span className="text-xs">2025.07.19 ~ 2025.07.20</span>
        <section className="flex justify-between">
          <span className="block text-xs">일산 킨텍스 제1전시장</span>
          <FestivalTag label="만화" color="bg-red-500" />
        </section>
      </CardContent>
    </Card>
  );
}

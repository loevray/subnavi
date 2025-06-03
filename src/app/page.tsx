import FestivalCard from '@/components/festival/FestivalCard';
import FestivalTag from '@/components/festival/FestivalTag';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
      <FestivalTag label="만화" color="bg-red-500" />

      <FestivalCard
        title="코믹월드 SUMMER 2025"
        dateRange={{ start: '2025.07.19', end: '2025.07.20' }}
        address="일산 킨텍스 제1전시장"
        thumbnailSrc="https://comicw.co.kr/data/item/1748337413/11_7J6E7Iuc7Ys7Iqk7YSw_6riw67O4.png"
      />
    </div>
  );
}

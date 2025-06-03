import FestivalTag from '@/components/festival/FestivalTag';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
      <FestivalTag label="만화" color="bg-red-500" />
    </div>
  );
}

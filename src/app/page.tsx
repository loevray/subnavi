import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
      <Badge className="bg-red-500">만화</Badge>
    </div>
  );
}

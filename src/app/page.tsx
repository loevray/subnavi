import Link from 'next/link';

export const DUMMY_TAG_DATA = [
  {
    key: 'comic',
    label: '만화',
    color: 'bg-red-500',
  },
  { key: 'all', label: '장르무관', color: 'bg-cyan-500' },
];

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  );
}

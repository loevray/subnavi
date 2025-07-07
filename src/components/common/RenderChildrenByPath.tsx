'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function RenderChildrenByPath({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/') return children;
  return null;
}

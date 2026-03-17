'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import useYouTubeHeader from '../../hooks/useYoutubeHeader';

interface HeaderProps {
  className?: string;
  children: React.ReactNode;
}

const ScrollHeader: React.FC<HeaderProps> = ({ className = '', children }) => {
  const searchParams = useSearchParams();
  const hasActiveSearchOrFilter =
    Boolean(searchParams.get('keyword')) ||
    Boolean(searchParams.get('category')) ||
    Boolean(searchParams.get('region')) ||
    Boolean(searchParams.get('date'));

  const { isVisible } = useYouTubeHeader({
    immediate: true,
    topOffset: 20,
    forceVisible: hasActiveSearchOrFilter,
  });

  return (
    <header
      className={`
        sticky top-0 left-0 right-0 z-40
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${className}
      `
        .trim()
        .replace(/\s+/g, ' ')}
    >
      {children}
    </header>
  );
};

export default ScrollHeader;

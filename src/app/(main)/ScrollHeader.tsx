'use client';

import React from 'react';
import useYouTubeHeader from '../../hooks/useYoutubeHeader';

interface HeaderProps {
  className?: string;
  children: React.ReactNode;
}

const ScrollHeader: React.FC<HeaderProps> = ({ className = '', children }) => {
  const { isVisible } = useYouTubeHeader({
    immediate: true,
    topOffset: 20, // 페이지 상단 20px까지는 항상 보이게
  });
  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-40
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

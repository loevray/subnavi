'use client';

import { Button } from '@/components/ui/button';
import { useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ExpandIcon } from 'lucide-react';

interface HoverOverlayProps {
  children: ReactNode;
  src: string;
}

export default function HoverOverlay({ children, src }: HoverOverlayProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    window.open(src, 'popup', 'width=400, heigth=600, resizable=yes');
  }, [src]);

  return (
    <div
      className="relative w-full h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-black/20 rounded-md transition-opacity h-full',
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <Button
          variant="outline"
          onClick={handleClick}
          className="bg-white text-black hover:bg-gray-100 absolute top-3 right-3 size-8"
        >
          <ExpandIcon />
        </Button>
      </div>
    </div>
  );
}

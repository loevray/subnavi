import { cva } from 'class-variance-authority';
import { Badge } from '../ui/badge';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* 
  태그마다 색의 종류가 달라야 함.
  어드민이 축제를 추가할 수 있는 페이지가 필요함.
  축제 추가할때 색상 선택해서 넣을 수 있게 해야함. => 나중에
*/

const FestivalTagVariants = cva('px-2', {
  variants: {
    festivalType: {
      comic: 'bg-red-500',
      game: 'bg-blue-500',
      all: 'bg-gray-500',
    },
  },
});

type FestivalType = 'all' | 'comic' | 'game';

export default function FestivalTag({
  festivalType = 'comic',
  children,
  ...props
}: {
  festivalType: FestivalType;
  children?: ReactNode;
}) {
  return (
    <Badge className={cn(FestivalTagVariants({ festivalType }))} {...props}>
      {children}
    </Badge>
  );
}

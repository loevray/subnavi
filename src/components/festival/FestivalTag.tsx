import { cva } from 'class-variance-authority';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

/* 
  태그마다 색의 종류가 달라야 함.
  어드민이 축제를 추가할 수 있는 페이지가 필요함.
  축제 추가할때 색상 선택해서 넣을 수 있게 해야함. => 나중에
  
  comic,game,all 태그는 어드민 페이지에서 직접 입력해서 추가하는 방식 x
  custom만 직접 추가
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

interface I_MappedFestivalType {
  all: '장르무관';
  comic: '만화';
  game: '게임';
  custom: '사용자 지정';
}

const MAPPED_FESTIVAL_TYPE: I_MappedFestivalType = {
  all: '장르무관',
  comic: '만화',
  game: '게임',
  custom: '사용자 지정',
};

export default function FestivalTag({
  festivalType = 'comic',
  ...props
}: {
  festivalType: FestivalType;
}) {
  return (
    <Badge className={cn(FestivalTagVariants({ festivalType }))} {...props}>
      {MAPPED_FESTIVAL_TYPE[festivalType] ?? '사용자 설정'}
    </Badge>
  );
}

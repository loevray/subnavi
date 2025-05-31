import { cva } from 'class-variance-authority';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

/* 
  태그마다 색의 종류가 달라야 함.
  태그 생성시 색상 선택해서 넣을 수 있게...
  
  장르무관, 게임, 만화 태그는 배경 색상 정해두기.
  custom만 직접 추가.
  
  db에서 뽑아와야할것 같다.
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
}

const MAPPED_FESTIVAL_TYPE: I_MappedFestivalType = {
  all: '장르무관',
  comic: '만화',
  game: '게임',
};

/*
  1. 태그를 db에서 받아온다.
  2. 태그 별 색상이 달라야한다. => 태그 마다 특정되는 배경색이 있어야 함.
    2-1 태그들이 정해져있어야하나? or 개발자가 어드민페이지에서 추가할 수 있어야 하나?
    2-2 만약 태그들이 정해져있지 않다면, 추가할 때 배경색상도 정해야함. => 배경색 정보도 db에 같이 저장해야할까?
    
    => 싹다 
*/

export default function FestivalTag({
  festivalType = 'comic',
  ...props
}: {
  festivalType: FestivalType;
}) {
  return (
    <Badge className={cn(FestivalTagVariants({ festivalType }))} {...props}>
      {MAPPED_FESTIVAL_TYPE[festivalType] ?? '-'}
    </Badge>
  );
}

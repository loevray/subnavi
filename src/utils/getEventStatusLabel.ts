import { EventStatus } from '@/dto/event/shared-event.dto';

export type EventStatusLabelValue = '진행 중' | '취소됨' | '종료됨' | '수집 중';

export const eventStatusLabel: Record<EventStatus, EventStatusLabelValue> = {
  active: '진행 중',
  cancelled: '종료됨',
  ended: '취소됨',
  draft: '수집 중',
} as const;

export default function getEventStatusLabel(status: EventStatus) {
  return eventStatusLabel[status];
}

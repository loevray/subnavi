import type { EventDateFilter, EventDatePreset } from '@/dto/event/shared-event.dto';

const EVENT_DATE_PRESET_LABELS: Record<EventDatePreset, string> = {
  today: '오늘',
  weekend: '이번 주말',
  month: '이번 달',
};

export function isEventDatePreset(value?: string | null): value is EventDatePreset {
  return value === 'today' || value === 'weekend' || value === 'month';
}

export function isEventDateString(value?: string | null): value is `${number}-${number}-${number}` {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export function formatEventDateFilterLabel(value: EventDateFilter) {
  if (isEventDatePreset(value)) {
    return EVENT_DATE_PRESET_LABELS[value];
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

export function parseEventDateFilterDate(value?: EventDateFilter) {
  if (!value || !isEventDateString(value)) {
    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toEventDateFilterValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

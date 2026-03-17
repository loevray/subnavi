import { EventListItem } from '@/dto/event/event-list.dto';
import formatUtcToKst from './formatUtcToKst';

function createDateString(datetime: string) {
  const date = formatUtcToKst(datetime);
  return `${date.year}.${date.month}.${date.day}`;
}

function createDateLabel(start: string, end: string) {
  if (start === end) {
    return start;
  }

  return `${start} - ${end}`;
}

export default function formatEventListItemPreview(event: EventListItem) {
  const start = createDateString(event.startDatetime);
  const end = createDateString(event.endDatetime);

  return {
    dateRange: {
      start,
      end,
    },
    dateLabel: createDateLabel(start, end),
    categoryLabels: event.categories.map(({ name }) => name),
  };
}

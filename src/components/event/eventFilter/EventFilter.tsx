'use client';

import { CalendarDays, MapPin, Shapes } from 'lucide-react';
import { EventCategory, RegionNameDto } from '@/dto/event/shared-event.dto';
import EventFilterDropdown, { EventFilterDropdownOption } from './EventFilterDropdown';

export type ExtendedCategoryName = EventCategory['name'] | '전체';

export type ExtendedEventCategoriesResponse = {
  id: number;
  name: ExtendedCategoryName;
}[];

export const eventFilterWrapperStyle = `
  flex w-full items-center gap-3 overflow-x-auto px-4 pb-2 pt-1
  sm:px-6 sm:pb-3 sm:pt-2 lg:px-8
`
  .replace(/\s+/g, ' ')
  .trim();

const DATE_OPTIONS: EventFilterDropdownOption[] = [
  { value: 'today', label: '오늘' },
  { value: 'weekend', label: '이번 주말' },
  { value: 'month', label: '이번 달' },
];

const LOCATION_OPTIONS: EventFilterDropdownOption[] = RegionNameDto.options.map((regionName) => ({
  value: regionName,
  label: regionName,
}));

function toGenreOptions(categories: ExtendedEventCategoriesResponse): EventFilterDropdownOption[] {
  return [{ value: 'all', label: '전체' }, ...categories.map(({ id, name }) => ({ value: `${id}`, label: name }))];
}

export default function EventFilter({ categories }: { categories: ExtendedEventCategoriesResponse }) {
  const genreOptions = toGenreOptions(categories);

  return (
    <div className={eventFilterWrapperStyle}>
      <EventFilterDropdown
        icon={<CalendarDays className="h-4 w-4" />}
        placeholder="날짜"
        options={DATE_OPTIONS}
      />

      <EventFilterDropdown
        icon={<MapPin className="h-4 w-4" />}
        placeholder="위치"
        options={LOCATION_OPTIONS}
      />

      <EventFilterDropdown
        icon={<Shapes className="h-4 w-4" />}
        placeholder="장르"
        options={genreOptions}
      />
    </div>
  );
}

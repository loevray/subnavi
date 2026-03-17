'use client';

import { CalendarDays, MapPin, Shapes } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { EventCategory, EventDateFilter, RegionNameDto } from '@/dto/event/shared-event.dto';
import EventFilterDropdown, { EventFilterDropdownOption } from './EventFilterDropdown';
import scrollToEventList from '@/utils/scrollToEventList';

export type ExtendedCategoryName = EventCategory['name'] | '전체';

export type ExtendedEventCategoriesResponse = {
  id: number;
  name: ExtendedCategoryName;
}[];

export const eventFilterWrapperStyle = `
  w-full overflow-x-auto px-4 pb-3 scroll-px-4
  sm:px-6 lg:px-8
`
  .replace(/\s+/g, ' ')
  .trim();

const DATE_OPTIONS: EventFilterDropdownOption[] = [
  { value: 'today', label: '오늘' },
  { value: 'weekend', label: '이번 주말' },
  { value: 'month', label: '이번 달' },
];

const LOCATION_OPTIONS: EventFilterDropdownOption[] = [
  { value: 'all', label: '전체 지역' },
  ...RegionNameDto.options.map((regionName) => ({
    value: regionName,
    label: regionName,
  })),
];

function toGenreOptions(categories: ExtendedEventCategoriesResponse): EventFilterDropdownOption[] {
  return [{ value: 'all', label: '전체' }, ...categories.map(({ id, name }) => ({ value: `${id}`, label: name }))];
}

export default function EventFilter({ categories }: { categories: ExtendedEventCategoriesResponse }) {
  const searchParams = useSearchParams();
  const genreOptions = toGenreOptions(categories);
  const currentDate = searchParams.get('date') ?? 'all';
  const currentRegion = searchParams.get('region') ?? 'all';
  const currentCategory =
    categories.find(({ name }) => name === searchParams.get('category'))?.id.toString() ?? 'all';

  const updateFilters = (next: { category?: string; region?: string; date?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    if (!next.category || next.category === 'all') {
      params.delete('category');
    } else {
      const selectedCategory = categories.find(({ id }) => `${id}` === next.category)?.name;

      if (!selectedCategory || selectedCategory === '전체') {
        params.delete('category');
      } else {
        params.set('category', selectedCategory);
      }
    }

    if (!next.region || next.region === 'all') {
      params.delete('region');
    } else {
      params.set('region', next.region);
    }

    if (!next.date || next.date === 'all') {
      params.delete('date');
    } else {
      params.set('date', next.date);
    }

    const nextUrl = params.toString() ? `/?${params.toString()}` : '/';
    window.history.pushState(null, '', nextUrl);
    scrollToEventList();
  };

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value, region: currentRegion, date: currentDate });
  };

  const handleRegionChange = (value: string) => {
    updateFilters({ category: currentCategory, region: value, date: currentDate });
  };

  const handleDateChange = (value: string) => {
    updateFilters({ category: currentCategory, region: currentRegion, date: value as EventDateFilter | 'all' });
  };

  return (
    <div className={eventFilterWrapperStyle}>
      <div className="flex min-w-max items-center gap-3 pr-2 sm:mx-auto sm:pr-0">
        <EventFilterDropdown
          icon={<CalendarDays />}
          placeholder="날짜"
          options={[{ value: 'all', label: '전체 날짜' }, ...DATE_OPTIONS]}
          value={currentDate}
          onValueChange={handleDateChange}
        />
        <EventFilterDropdown
          icon={<MapPin />}
          placeholder="위치"
          options={LOCATION_OPTIONS}
          value={currentRegion}
          onValueChange={handleRegionChange}
        />
        <EventFilterDropdown
          icon={<Shapes />}
          placeholder="장르"
          options={genreOptions}
          value={currentCategory}
          onValueChange={handleCategoryChange}
        />
      </div>
    </div>
  );
}

'use client';

import { MapPin, Shapes } from 'lucide-react';

import { EventCategory, EventDateFilter, RegionNameDto } from '@/dto/event/shared-event.dto';
import scrollToEventList from '@/utils/scrollToEventList';
import { normalizeEventListQueryState } from '@/utils/eventListSearchParams';
import { useEventListUrlNavigation } from '@/hooks/useEventListUrlNavigation';
import EventDateFilterControl from './EventDateFilter';
import EventFilterDropdown, { EventFilterDropdownOption } from './EventFilterDropdown';

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
  const { searchParams, navigateWithParams } = useEventListUrlNavigation();
  const queryState = normalizeEventListQueryState(searchParams);
  const genreOptions = toGenreOptions(categories);
  const currentDate = queryState.date ?? 'all';
  const currentRegion = queryState.region ?? 'all';
  const currentCategory = categories.find(({ name }) => name === queryState.category)?.id.toString() ?? 'all';

  const updateFilters = (next: { category?: string; region?: string; date?: string }) => {
    navigateWithParams((params) => {
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
    });

    scrollToEventList();
  };

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value, region: currentRegion, date: currentDate });
  };

  const handleRegionChange = (value: string) => {
    updateFilters({ category: currentCategory, region: value, date: currentDate });
  };

  const handleDateChange = (value: EventDateFilter | 'all') => {
    updateFilters({ category: currentCategory, region: currentRegion, date: value });
  };

  return (
    <div className={eventFilterWrapperStyle}>
      <div className="flex min-w-max items-center gap-3 pr-2 sm:mx-auto sm:pr-0">
        <EventDateFilterControl value={currentDate as EventDateFilter | 'all'} onValueChange={handleDateChange} />
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

'use client';

import { EventCategory } from '@/dto/event/shared-event.dto';
import { Button } from '../../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export type ExtendedCategoryName = EventCategory['name'] | '전체';

export type ExtendedEventCategoriesResponse = {
  id: number;
  name: ExtendedCategoryName;
}[];

export const eventFilterWrapperStyle = `py-4 overflow-x-auto flex gap-2.5 w-full justify-start lg:justify-center px-4 sm:px-6 lg:px-8`;

export default function EventFilter({ categories }: { categories: ExtendedEventCategoriesResponse }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category') ?? '전체';

  const handleCategoryClick = (category: ExtendedCategoryName) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (category === '전체') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    router.push(`?${params.toString()}`);
  };

  const extendedCategories: ExtendedEventCategoriesResponse = [{ id: 999, name: '전체' }, ...categories];

  return (
    <div className={eventFilterWrapperStyle}>
      {extendedCategories.map(({ id, name }) => {
        const isSelected = selectedCategory === name;

        return (
          <Button
            className={`h-10 rounded-full border px-5 text-sm font-semibold transition-all duration-300
                  ${
                    isSelected
                      ? 'border-primary/70 bg-gradient-to-r from-[#f06b93] to-[#b8a8d8] text-white shadow-[0_0_18px_rgba(240,107,147,0.35)]'
                      : 'border-primary/25 bg-transparent text-muted-foreground hover:border-primary/50 hover:bg-accent/40 hover:text-foreground'
                  }`}
            key={`${id}${name}`}
            size="sm"
            onClick={() => handleCategoryClick(name)}
          >
            {name}
          </Button>
        );
      })}
    </div>
  );
}

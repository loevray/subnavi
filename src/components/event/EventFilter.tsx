'use client';

import { EventCategory } from '@/dto/event/shared-event.dto';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export type ExtendedCategoryName = EventCategory['name'] | '전체';

export type ExtendedEventCategoriesResponse = {
  id: number;
  name: ExtendedCategoryName;
}[];

export default function EventFilter({
  categories,
}: {
  categories: ExtendedEventCategoriesResponse;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category') ?? '전체';

  const handleCategoryClick = (category: ExtendedCategoryName) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); //카테고리 변경시 1페이지로 초기화

    if (category === '전체') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    router.push(`?${params.toString()}`);
  };

  const extendedCategories: ExtendedEventCategoriesResponse = [
    { id: 999, name: '전체' },
    ...categories,
  ];

  return (
    <div className="flex  gap-3 w-full xl:justify-center px-4 sm:px-6 lg:px-8 ">
      {extendedCategories.map(({ id, name }) => {
        const isSelected = selectedCategory === name;
        return (
          <Button
            className={`
                  px-6 py-2  border border-gray-200 rounded-full font-medium transition-all duration-300
                  ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-white text-gray-70 hover:bg-gray-50'
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

'use client';

import { EventCategoriesResponse } from '@/schema/events';
import { Database } from '../../../database.types';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

const cateogriesWithEmojis: Partial<{
  [key in Database['public']['Enums']['category_name']]: string;
}> = {
  장르무관: '🔥',
  게임: '🎮',
  만화: '📚',
  코스프레: '🎭',
  VTuber: '✨',
  기타: '🎸',
};

export default function EventFilter({
  categories,
}: {
  categories: EventCategoriesResponse;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category');

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category); // 기존 'category' 쿼리를 덮어씀
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="py-8 bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(({ id, name }) => {
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
                size="lg"
                onClick={() => handleCategoryClick(name)}
              >
                {`${cateogriesWithEmojis[name] ?? '🎈'}  ${name}`}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

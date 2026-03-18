'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchKeyword, SearchKeywordDto } from '@/dto/event/shared-event.dto';
import scrollToEventList from '@/utils/scrollToEventList';
import { useEventListUrlNavigation } from '@/hooks/useEventListUrlNavigation';

// Zod 스키마 정의

export default function EventSearchForm() {
  const { searchParams, navigateWithParams } = useEventListUrlNavigation();
  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch,
    reset,
  } = useForm<SearchKeyword>({
    resolver: zodResolver(SearchKeywordDto),
    mode: 'onChange', // 실시간 검증
    defaultValues: {
      query: searchParams.get('keyword') ?? '',
    },
  });

  const watchedQuery = watch('query');
  const currentKeyword = searchParams.get('keyword') ?? '';

  useEffect(() => {
    reset({ query: currentKeyword });
  }, [currentKeyword, reset]);

  const onSubmit = (data: SearchKeyword) => {
    const keyword = preprocessSearch(data.query);
    navigateWithParams((params) => {
      params.delete('page');

      if (keyword) {
        params.set('keyword', keyword);
      } else {
        params.delete('keyword');
      }
    });
    scrollToEventList();
  };

  const preprocessSearch = (keyword: string) => keyword.trim().replace(/\s+/g, ' ').slice(0, 50); //최대길이 제한

  const handleClear = () => {
    reset({ query: '' });

    if (!currentKeyword) {
      return;
    }

    navigateWithParams((params) => {
      params.delete('page');
      params.delete('keyword');
    });
    scrollToEventList();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* 검색 폼 */}

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            {...register('query')}
            type="text"
            placeholder="검색"
            className={`pl-10 pr-20 h-10 sm:w-sm text-base `}
            onKeyDown={handleKeyDown}
          />

          {/* 클리어 버튼 */}
          {(watchedQuery || currentKeyword) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              aria-label="검색 키워드 초기화"
              className="absolute right-16 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* 검색 버튼 */}
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
          >
            <SearchIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

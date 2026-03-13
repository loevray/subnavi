'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchKeyword, SearchKeywordDto } from '@/dto/event/shared-event.dto';

export default function EventSearchForm() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    watch,
    reset,
  } = useForm<SearchKeyword>({
    resolver: zodResolver(SearchKeywordDto),
    mode: 'onChange',
  });

  const watchedQuery = watch('query');
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (data: SearchKeyword) => {
    const keyword = preprocessSearch(data.query);
    const params = new URLSearchParams(searchParams.toString());
    params.set('keyword', keyword);
    return router.push(`/?${params.toString()}`);
  };

  const preprocessSearch = (keyword: string) => keyword.trim().replace(/\s+/g, ' ').slice(0, 50);

  const handleClear = () => {
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="w-full max-w-xl px-2">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          {...register('query')}
          type="text"
          placeholder="행사명, 장소를 검색해보세요"
          className="h-12 rounded-xl border-primary/25 bg-card/55 pl-11 pr-24 text-base text-foreground placeholder:text-muted-foreground/90"
          onKeyDown={handleKeyDown}
        />

        {watchedQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-14 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          size="icon"
          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg"
        >
          <SearchIcon />
        </Button>
      </div>
    </div>
  );
}

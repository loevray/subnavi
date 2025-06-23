'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

// Zod 스키마 정의
const searchSchema = z.object({
  query: z
    .string()
    .min(1, '검색어를 입력해주세요')
    .min(2, '검색어는 최소 2글자 이상 입력해주세요')
    .max(100, '검색어는 100글자를 초과할 수 없습니다')
    .regex(/^[가-힣a-zA-Z0-9\s]+$/, '한글, 영문, 숫자만 입력 가능합니다'),
});

type SearchFormData = z.infer<typeof searchSchema>;

export default function EventSearchForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    mode: 'onChange', // 실시간 검증
  });

  const watchedQuery = watch('query');

  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (data: SearchFormData) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('keyword', data.query);
    router.push(`?${params.toString()}`);
  };

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
    <div className="max-w-2xl mx-auto p-6">
      {/* 검색 폼 */}
      <div className="mb-8">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              {...register('query')}
              type="text"
              placeholder="검색어를 입력하세요 (한글, 영문, 숫자)"
              className={`pl-10 pr-20 h-12 w-md text-base ${
                errors.query
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }`}
              onKeyDown={handleKeyDown}
            />

            {/* 클리어 버튼 */}
            {watchedQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
            >
              검색
            </Button>
          </div>

          {/* 에러 메시지 */}
          {errors.query && (
            <p className="mt-2 text-sm text-destructive flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.query.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

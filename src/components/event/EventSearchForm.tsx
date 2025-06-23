import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

// 가짜 검색 API 함수
const mockSearchAPI = async (query: string): Promise<string[]> => {
  // 실제로는 여기서 API 호출
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockResults = [
    `"${query}"에 대한 검색결과 1`,
    `"${query}"에 대한 검색결과 2`,
    `"${query}"에 대한 검색결과 3`,
    `"${query}" 관련 항목 4`,
    `"${query}" 추천 항목 5`,
  ];

  return mockResults;
};

export default function EventSearchForm() {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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

  const onSubmit = async (data: SearchFormData) => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const results = await mockSearchAPI(data.query);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    reset();
    setSearchResults([]);
    setHasSearched(false);
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
              disabled={!isValid || isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                '검색'
              )}
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

      {/* 검색 결과 */}
      {hasSearched && (
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">검색 결과</h2>

          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
              <span className="text-muted-foreground">검색 중...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <p>{result}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">검색 결과가 없습니다</p>
              <p className="text-sm text-muted-foreground/60">
                다른 검색어로 시도해보세요
              </p>
            </div>
          )}
        </div>
      )}

      {/* 폼 상태 디버깅 (개발용) */}
      <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
        <h3 className="font-semibold mb-2">폼 상태 (개발용)</h3>
        <div className="space-y-1 text-muted-foreground">
          <p>현재 입력값: &quot;{watchedQuery || ''}&quot;</p>
          <p>유효성 검사: {isValid ? '✅ 통과' : '❌ 실패'}</p>
          <p>검색 중: {isSearching ? '예' : '아니오'}</p>
          <p>검색 완료: {hasSearched ? '예' : '아니오'}</p>
        </div>
      </div>
    </div>
  );
}

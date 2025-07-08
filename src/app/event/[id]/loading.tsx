import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function EventDetailSkeleton() {
  return (
    <main className="container max-w-4xl p-6 space-y-6 mx-auto">
      {/* 헤더 */}
      <section className="flex flex-col md:flex-row gap-6">
        {/* 이미지 */}
        <div className="md:w-1/2 rounded-lg overflow-hidden">
          <Skeleton className="w-full h-64 md:h-80" />
        </div>

        {/* 텍스트 */}
        <div className="md:w-1/2 space-y-3">
          {/* 제목 */}
          <Skeleton className="h-8 w-3/4" />

          {/* 태그들 */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>

          {/* 정보 아이템들 */}
          <div className="text-sm space-y-1.5 pt-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-2 pt-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </section>

      <Separator />

      {/* 설명 / 규칙 */}
      <section>
        <Skeleton className="h-6 w-24 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-6 w-20 mt-4 mb-2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </section>

      {/* 지도 */}
      <section>
        <Skeleton className="h-6 w-20 mb-2" />
        <div className="rounded-lg overflow-hidden">
          <Skeleton className="w-full h-[250px] rounded-lg" />
        </div>
      </section>

      {/* 주최 & 채널 */}
      <section className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <Skeleton className="h-5 w-24 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        <div className="space-y-1">
          <Skeleton className="h-5 w-20 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-18" />
          </div>
        </div>
      </section>
    </main>
  );
}

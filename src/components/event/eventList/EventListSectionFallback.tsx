import { Skeleton } from '@/components/ui/skeleton';
import { GRID_STYLES } from './EventList';

export default function EventListSectionFallback() {
  return (
    <>
      <div className={GRID_STYLES}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full">
            {/* EventCard skeleton */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Poster image skeleton */}
              <Skeleton className="h-[200px] w-full" />

              {/* Card content skeleton */}
              <div className="p-4 space-y-3">
                {/* Title skeleton */}
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />

                {/* Date range skeleton */}
                <Skeleton className="h-4 w-32" />

                {/* Address skeleton */}
                <Skeleton className="h-4 w-24" />

                {/* Tags skeleton */}
                <div className="flex gap-2 flex-wrap">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <div className="text-center mb-6">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </>
  );
}

import { GRID_STYLES } from '@/components/event/EventList';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header Skeleton */}
      <header className="py-8 bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Logo skeleton */}
          <Skeleton className="h-8 w-[180px]" />
          {/* EventFilter skeleton */}
          <div className="flex justify-center mt-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-18" />
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Main header skeleton */}
          <div className="flex items-center justify-center md:justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-72 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
            {/* Layout toggle buttons skeleton */}
            <div className="hidden md:flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          {/* Event Grid Skeleton */}
          <div className={GRID_STYLES}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-full max-w-sm">
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

          {/* Pagination section skeleton */}
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
        </div>
      </div>
    </div>
  );
}

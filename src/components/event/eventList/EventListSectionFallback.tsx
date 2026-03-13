import { Skeleton } from '@/components/ui/skeleton';
import { GRID_STYLES } from './EventList';

export default function EventListSectionFallback() {
  return (
    <>
      <div className={GRID_STYLES}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full">
            <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card/70 shadow-lg shadow-black/10">
              <Skeleton className="h-[210px] w-full bg-muted/60" />

              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-full bg-muted/60" />
                <Skeleton className="h-5 w-4/5 bg-muted/60" />
                <Skeleton className="h-4 w-36 bg-muted/60" />
                <Skeleton className="h-4 w-28 bg-muted/60" />

                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16 rounded-full bg-muted/60" />
                  <Skeleton className="h-6 w-20 rounded-full bg-muted/60" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-6 text-center">
          <Skeleton className="mx-auto h-4 w-48 bg-muted/60" />
        </div>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-10 w-10 rounded-xl bg-muted/60" />
          <Skeleton className="h-10 w-10 rounded-xl bg-muted/60" />
          <Skeleton className="h-10 w-10 rounded-xl bg-muted/60" />
        </div>
      </div>
    </>
  );
}

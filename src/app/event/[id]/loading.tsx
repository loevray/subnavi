import { Skeleton } from '@/components/ui/skeleton';

export default function EventDetailSkeleton() {
  return (
    <main className="mx-auto max-w-[1280px] bg-[#f6f4fb] px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-8">
      <MobileDetailSkeleton />
      <DesktopDetailSkeleton />
    </main>
  );
}

function MobileDetailSkeleton() {
  return (
    <div className="space-y-7 lg:hidden">
      <Skeleton className="h-[265px] w-full rounded-[28px]" />

      <section>
        <div className="mb-4 flex flex-wrap gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-11 w-4/5" />
          <Skeleton className="h-11 w-3/5" />
        </div>
        <Skeleton className="mt-5 h-13 w-full rounded-full" />
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <MobileInfoRowSkeleton />
        <MobileInfoRowSkeleton />
      </section>

      <section>
        <Skeleton className="mb-4 h-10 w-44" />
        <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-20 rounded-full" />
          </div>
        </div>
      </section>

      <section>
        <Skeleton className="h-10 w-48" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-10/12" />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-[260px] w-full rounded-[24px]" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur">
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

function DesktopDetailSkeleton() {
  return (
    <div className="hidden space-y-6 lg:block">
      <Skeleton className="h-[400px] w-full rounded-[32px]" />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_320px]">
        <div className="space-y-6">
          <ContentCardSkeleton />
          <ContentCardSkeleton map />
        </div>

        <aside className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_22px_50px_rgba(15,23,42,0.08)]">
          <div className="space-y-4">
            <DesktopInfoBlockSkeleton />
            <DesktopInfoBlockSkeleton />
          </div>

          <div className="space-y-3 pt-2">
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>

          <div className="rounded-[24px] bg-slate-50 px-4 py-5">
            <Skeleton className="h-3 w-24" />
            <div className="mt-4 flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-14 rounded-2xl" />
            <Skeleton className="h-14 rounded-2xl" />
          </div>

          <div className="rounded-[24px] border border-slate-200 px-4 py-4">
            <Skeleton className="h-4 w-28" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function MobileInfoRowSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

function ContentCardSkeleton({ map = false }: { map?: boolean }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_22px_50px_rgba(15,23,42,0.06)] md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-8 w-48" />
      </div>

      {map ? (
        <>
          <Skeleton className="mb-5 h-5 w-2/5" />
          <Skeleton className="h-[320px] w-full rounded-[24px]" />
        </>
      ) : (
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-10/12" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      )}
    </section>
  );
}

function DesktopInfoBlockSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-11 w-11 rounded-2xl" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}

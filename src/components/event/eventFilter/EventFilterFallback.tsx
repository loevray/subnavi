import { Skeleton } from '../../ui/skeleton';
import { eventFilterWrapperStyle } from './EventFilter';

export default function EventFilterFallback() {
  return (
    <div className={eventFilterWrapperStyle}>
      <Skeleton className="h-7 w-20 rounded-3xl" />
      <Skeleton className="h-7 w-16 rounded-3xl" />
      <Skeleton className="h-7 w-24 rounded-3xl" />
      <Skeleton className="h-7 w-18 rounded-3xl" />
      <Skeleton className="h-7 w-20 rounded-3xl" />
      <Skeleton className="h-7 w-16 rounded-3xl" />
      <Skeleton className="h-7 w-24 rounded-3xl" />
      <Skeleton className="h-7 w-18 rounded-3xl" />
      <Skeleton className="h-7 w-18 rounded-3xl" />
    </div>
  );
}

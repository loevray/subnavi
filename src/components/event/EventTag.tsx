import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

export type EventTagType = {
  key: string;
  label: string;
  color: string;
};

export default function EventTag({
  label,
  color,
  ...props
}: Omit<EventTagType, 'key'> & React.ComponentProps<'span'>) {
  return (
    <Badge className={cn('rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-white', color)} {...props}>
      {label}
    </Badge>
  );
}

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
  className,
  ...props
}: Omit<EventTagType, 'key'> & React.ComponentProps<'span'>) {
  return (
    <Badge className={cn('cursor-pointer px-2 hover:brightness-90', color, className)} {...props}>
      {label}
    </Badge>
  );
}

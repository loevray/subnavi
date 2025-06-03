import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

export type FestivalTagType = {
  key: string;
  label: string;
  color: string;
};

export default function FestivalTag({
  label,
  color,
  ...props
}: Omit<FestivalTagType, 'key'> & React.ComponentProps<'span'>) {
  return (
    <Badge
      className={cn(`px-2 hover:brightness-90 cursor-pointer ${color}`)}
      {...props}
    >
      {label}
    </Badge>
  );
}

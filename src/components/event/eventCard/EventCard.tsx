import { Card, CardContent, CardHeader } from '../../ui/card';
import EventTag, { EventTagType } from '../EventTag';

export interface I_EventCard {
  title: string;
  posterImageUrl: string;
  dateRange: {
    start: string;
    end: string;
  };
  address: string;
  tagData: EventTagType[];
}

export default function EventCard({ title, posterImageUrl, dateRange, address, tagData }: I_EventCard) {
  return (
    <Card className="group relative w-full cursor-pointer gap-0 overflow-hidden rounded-2xl border-primary/20 bg-gradient-to-b from-[#2a2148] to-[#221a3b] py-0 shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_12px_40px_rgba(13,8,32,0.55)]">
      <CardHeader className="relative p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2e2550]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-full w-full object-cover opacity-82 transition-all duration-500 group-hover:scale-105 group-hover:opacity-95"
            src={posterImageUrl}
            alt={`${title} 포스터`}
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#211a36]/90" />
          <div className="absolute right-3 top-3 size-14 rounded-full bg-[#b8a8d8]/30 blur-[1px]" />
          <div className="absolute -left-3 -bottom-3 size-16 rounded-full bg-[#f06b93]/30 blur-[2px]" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 p-4">
        <h1 title={title} className="min-h-[3rem] line-clamp-2 text-base leading-snug font-black tracking-tight text-[#f5f0ff]">
          {title}
        </h1>

        <time className="text-xs font-medium tracking-wide text-[#d2c8eb]">{`${dateRange.start} ~ ${dateRange.end}`}</time>

        <address title={address} className="min-h-[2.3rem] not-italic line-clamp-2 text-sm leading-relaxed text-[#9f93c2]">
          {address}
        </address>

        <section className="mt-1 flex items-center gap-2">
          {tagData.slice(0, 2).map(({ key, label, color }) => (
            <EventTag key={key} label={label} color={color} />
          ))}
          {tagData.length > 2 && <span className="text-xs text-muted-foreground">+{tagData.length - 2}</span>}
        </section>
      </CardContent>
    </Card>
  );
}

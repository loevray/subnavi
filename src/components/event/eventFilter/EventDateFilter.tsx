'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { EventDateFilter as EventDateFilterValue } from '@/dto/event/shared-event.dto';
import { cn } from '@/lib/utils';
import {
  formatEventDateFilterLabel,
  parseEventDateFilterDate,
  toEventDateFilterValue,
} from '@/utils/eventDateFilter';

type EventDateFilterProps = {
  value?: EventDateFilterValue | 'all';
  onValueChange?: (value: EventDateFilterValue | 'all') => void;
  className?: string;
};

export default function EventDateFilter({ value = 'all', onValueChange, className }: EventDateFilterProps) {
  const [open, setOpen] = useState(false);
  const isSelected = Boolean(value && value !== 'all');
  const selectedDate = useMemo(
    () => parseEventDateFilterDate(value === 'all' ? undefined : value),
    [value]
  );
  const buttonLabel = isSelected ? formatEventDateFilterLabel(value) : '날짜';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            `
              h-8.5 min-w-[118px] justify-between rounded-full border border-slate-200 bg-white px-3
              text-[13px] font-semibold text-slate-700 shadow-none
              transition-colors hover:bg-slate-50
              focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-0
              sm:h-10 sm:min-w-[148px] sm:px-4 sm:text-[15px]
            `,
            isSelected &&
              `
                border-violet-500 bg-violet-500 text-white hover:bg-violet-500
                hover:text-white
              `,
            className
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="truncate">{buttonLabel}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-100" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto rounded-2xl border-slate-200 p-0 shadow-[0_14px_32px_rgba(15,23,42,0.12)]">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={selectedDate}
          defaultMonth={selectedDate ?? new Date()}
          onSelect={(date) => {
            if (!date) {
              return;
            }

            onValueChange?.(toEventDateFilterValue(date));
            setOpen(false);
          }}
        />

        <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2">
          <p className="text-xs font-medium text-slate-500">행사 날짜를 선택하세요.</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onValueChange?.('all');
              setOpen(false);
            }}
            disabled={!isSelected}
            className="text-slate-600"
          >
            초기화
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

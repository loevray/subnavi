'use client';

import { ReactElement, cloneElement } from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type EventFilterDropdownOption = {
  value: string;
  label: string;
};

type EventFilterDropdownProps = {
  icon: ReactElement<{ className?: string }>;
  placeholder: string;
  value?: string;
  options: EventFilterDropdownOption[];
  onValueChange?: (value: string) => void;
  className?: string;
};

export default function EventFilterDropdown({
  icon,
  placeholder,
  value,
  options,
  onValueChange,
  className,
}: EventFilterDropdownProps) {
  const isSelected = Boolean(value && value !== 'all');
  const renderedIcon = cloneElement(icon, {
    className: cn('h-4 w-4 text-current', icon.props.className),
  });

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          `
            h-8.5 min-w-[118px] rounded-full border border-slate-200 bg-white px-3
            text-[13px] font-semibold text-slate-700 shadow-none
            transition-colors hover:bg-slate-50
            focus:ring-2 focus:ring-violet-200 focus:ring-offset-0
            data-[placeholder]:text-slate-700
            sm:h-10 sm:min-w-[148px] sm:px-4 sm:text-[15px]
          `,
          isSelected &&
            `
              border-violet-500 bg-violet-500 text-white hover:bg-violet-500
              data-[placeholder]:text-white
              [&_svg]:text-white
              [&>svg]:text-white
              [&>svg]:opacity-100
            `,
          className
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <span className={cn('shrink-0 text-slate-500', isSelected && 'text-white')}>{renderedIcon}</span>
          <SelectValue placeholder={placeholder} />
        </span>
      </SelectTrigger>

      <SelectContent className="rounded-2xl border-slate-200 p-1 shadow-[0_14px_32px_rgba(15,23,42,0.12)]">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

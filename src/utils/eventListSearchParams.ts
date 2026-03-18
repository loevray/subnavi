import {
  CateogryNameDto,
  EventCategory,
  EventDateFilter,
  EventDateFilterDto,
  RegionName,
  RegionNameDto,
} from '@/dto/event/shared-event.dto';

export type RawSearchParamValue = string | string[] | null | undefined;
export type EventListSearchParamsLike = {
  get(name: string): string | null;
};
export type EventListQueryState = {
  page: number;
  keyword?: string;
  category?: EventCategory['name'];
  region?: RegionName;
  date?: EventDateFilter;
};

export function getFirstSearchParamValue(value: RawSearchParamValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value ?? undefined;
}

export function normalizePositiveIntegerSearchParam(value: RawSearchParamValue, fallback: number) {
  const rawValue = getFirstSearchParamValue(value);
  const parsedValue = Number.parseInt(rawValue ?? '', 10);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

export function normalizeEventListKeyword(value: RawSearchParamValue) {
  const rawValue = getFirstSearchParamValue(value)?.trim();

  return rawValue ? rawValue : undefined;
}

export function normalizeEventListCategory(value: RawSearchParamValue) {
  const parsedCategory = CateogryNameDto.safeParse(getFirstSearchParamValue(value));

  return parsedCategory.success ? parsedCategory.data : undefined;
}

export function normalizeEventListRegion(value: RawSearchParamValue) {
  const parsedRegion = RegionNameDto.safeParse(getFirstSearchParamValue(value));

  return parsedRegion.success ? parsedRegion.data : undefined;
}

export function normalizeEventListDate(value: RawSearchParamValue) {
  const parsedDate = EventDateFilterDto.safeParse(getFirstSearchParamValue(value));

  return parsedDate.success ? parsedDate.data : undefined;
}

export function normalizeEventListQueryState(searchParams: EventListSearchParamsLike): EventListQueryState {
  return {
    page: normalizePositiveIntegerSearchParam(searchParams.get('page'), 1),
    keyword: normalizeEventListKeyword(searchParams.get('keyword')),
    category: normalizeEventListCategory(searchParams.get('category')),
    region: normalizeEventListRegion(searchParams.get('region')),
    date: normalizeEventListDate(searchParams.get('date')),
  };
}

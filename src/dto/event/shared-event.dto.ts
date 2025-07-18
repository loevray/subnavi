import { z } from 'zod/v4';
import { Constants, Database } from '../../../database.types';

export const AgeRatingDto = z.enum(Constants.public.Enums.age_rating);
export const EventStatusDto = z.enum(Constants.public.Enums.event_status);
export type EventStatus = z.infer<typeof EventStatusDto>;
export const CateogryNameDto = z.enum(Constants.public.Enums.category_name);
export const RegionNameDto = z.enum(Constants.public.Enums.region_name);
export type RegionName = z.infer<typeof RegionNameDto>;

export const SnsLinkDto = z.record(z.string(), z.string());

export const EventCateogryDto = z.object({
  id: z.number().int(),
  name: CateogryNameDto,
});

export type EventCategory = z.infer<typeof EventCateogryDto>;

export type EventCategoryListResponse = EventCategory[];

export const RegionListResponseDto = z.array(
  z.object({
    name: RegionNameDto,
    id: z.number().int(),
  })
);

export type RegionListResponse = z.infer<typeof RegionListResponseDto>;

export const EventRelationsDto = z.object({
  categories: z.array(EventCateogryDto),
  region: RegionNameDto,
});

export const PaginationDto = z.object({
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
  hasMore: z.boolean(),
  totalPages: z.number().int(),
});

export type Pagination = z.infer<typeof PaginationDto>;

export const BaseEventDto = z.object({
  ageRating: AgeRatingDto.nullish(),
  bookingLink: z.string().nullish(),
  createdAt: z.string().nullish(),
  description: z.string().nullish(),
  endDatetime: z.string(),
  eventRules: z.string().nullish(),
  id: z.uuid(),
  location: z.string(),
  officialWebsite: z.string().nullish(),
  organizerContact: z.string().nullish(),
  organizerName: z.string(),
  participationFee: z.string().nullish(),
  posterImageUrl: z.string().nullish(),
  regionId: z.number(),
  snsLinks: SnsLinkDto.nullish(),
  startDatetime: z.string(),
  status: EventStatusDto,
  title: z.string(),
  updatedAt: z.string().nullish(),
});

export const SearchKeywordDto = z.object({
  query: z
    .string()
    .transform((val) => val.trim().replace(/\s+/g, ' '))
    .refine((val) => val.replace(/\s/g, '').length >= 2, {
      message: '공백 제외 최소 2글자 이상 입력해주세요',
    })
    .refine((val) => val.length <= 50, {
      message: '최대 50글자까지 입력 가능합니다',
    }),
});

export type SearchKeyword = z.infer<typeof SearchKeywordDto>;

export type BaseEvent = z.infer<typeof BaseEventDto>;

export type Event = Database['public']['Tables']['events']['Row'];

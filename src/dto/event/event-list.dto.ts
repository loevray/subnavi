import { z } from 'zod/v4';
import { BaseEventDto, CateogryNameDto, EventRelationsDto, PaginationDto } from './shared-event.dto';

export const EventListItemDto = BaseEventDto.pick({
  id: true,
  title: true,
  startDatetime: true,
  endDatetime: true,
  location: true,
  posterImageUrl: true,
  ageRating: true,
}).extend(EventRelationsDto.shape);

export type EventListItem = z.infer<typeof EventListItemDto>;

export const EventListResponseDto = z.object({
  events: z.array(EventListItemDto),
  pagination: PaginationDto,
});

export type EventListResponse = z.infer<typeof EventListResponseDto>;

export const EventListRequestDto = z.object({
  page: z.int().positive('need positive number').optional(),
  pageSize: z.int().positive('need positive number').max(10, 'less than 11').optional(),
  keyword: z.string().optional(),
  category: CateogryNameDto.optional(),
});

export type EventListRequest = z.infer<typeof EventListRequestDto>;

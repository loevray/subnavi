import { z } from 'zod/v4';
import {
  BaseEventDto,
  EventRelationsDto,
  PaginationDto,
} from './shared-event.dto';

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

export const EventListRequestDto = BaseEventDto.pick({ id: true });

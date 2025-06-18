import { z } from 'zod/v4';
import { BaseEventDto, EventCateogryDto } from './shared-event.dto';

export const CreateEventRequestDto = BaseEventDto.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({ categories: z.array(EventCateogryDto) });

export type CreateEventRequest = z.infer<typeof CreateEventRequestDto>;

export const CreateEventResponseDto = BaseEventDto.pick({
  id: true,
});

export type CreateEventResponse = z.infer<typeof CreateEventResponseDto>;

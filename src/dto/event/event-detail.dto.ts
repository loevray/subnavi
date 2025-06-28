import { z } from 'zod/v4';
import { BaseEventDto, EventRelationsDto } from './shared-event.dto';

export const EventDetailResponseDto = BaseEventDto.omit({
  createdAt: true,
  updatedAt: true,
}).extend(EventRelationsDto.shape);

export type EventDetailResponse = z.infer<typeof EventDetailResponseDto>;

export const EventDetailRequestDto = z.object({
  id: z.uuidv4().nonoptional(),
});

export type EventDetailRequest = z.infer<typeof EventDetailRequestDto>;

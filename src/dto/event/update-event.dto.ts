import { z } from 'zod/v4';
import { BaseEventDto, CateogryNameDto } from './shared-event.dto';

export const UpdateEventRequestDto = BaseEventDto.omit({
  createdAt: true,
  updatedAt: true,
})
  .extend({ categories: z.array(CateogryNameDto) })
  .partial()
  .nullish();

export type UpdateEventRequest = z.infer<typeof UpdateEventRequestDto>;

export const UpdateEventResponseDto = BaseEventDto.pick({
  id: true,
});

export type UpdateEventResponse = z.infer<typeof UpdateEventResponseDto>;

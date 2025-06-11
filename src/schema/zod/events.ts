import { z } from 'zod';
import { Constants } from '../../../database.types';

export const CreateEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  start_datetime: z.string().min(1), // ISO datetime string
  end_datetime: z.string().min(1),
  location: z.string().min(1),
  category_ids: z.array(
    z.number().int().min(1).max(Constants.public.Enums.category_name.length)
  ),
  region_id: z
    .number()
    .int()
    .min(1)
    .max(Constants.public.Enums.region_name.length),
  poster_image_url: z.string().url().optional().nullable(),
  thumbnail_image_url: z.string().url().optional().nullable(),
  organizer_name: z.string().min(1),
  organizer_contact: z.string().optional().nullable(),
  participation_fee: z.string().optional().nullable(),
  participant_limit: z.number().int().optional().nullable(),
  current_participants: z.number().int().optional().nullable(),
  age_rating: z.enum(Constants.public.Enums.age_rating).optional().nullable(),
  booking_link: z.string().url().optional().nullable(),
  official_website: z.string().url().optional().nullable(),
  sns_links: z.record(z.any()).optional().nullable(), // Json 타입
  event_rules: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(Constants.public.Enums.event_status).optional().nullable(),
});

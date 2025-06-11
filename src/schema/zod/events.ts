import { z } from 'zod';
import { Constants } from '../../../database.types';

export const EventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  start_datetime: z.string().min(1), // ISO datetime string
  end_datetime: z.string().min(1),
  location: z.string().min(1),
  region_id: z.number().optional().nullable(),
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
  view_count: z.number().int().optional().nullable(),
  is_approved: z.boolean().optional().nullable(),
  created_at: z.string().datetime().optional().nullable(),
  updated_at: z.string().datetime().optional().nullable(),
});

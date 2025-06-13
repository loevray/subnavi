import { z } from 'zod';
import { Constants } from '../../database.types';

export const SnsLinkSchema = z.object({
  platform: z.string().min(1, '플랫폼 이름은 필수입니다.'), // 예: "instagram", "twitter"
  url: z.string().url('유효한 SNS 링크 URL을 입력해주세요.'),
});

export const SnsLinksJsonSchema = z.array(SnsLinkSchema);

export const EventSchema = z.object({
  id: z.string().uuid('유효한 이벤트 ID (UUID)가 아닙니다.'),
  title: z
    .string()
    .min(2, '제목은 최소 2글자 이상이어야 합니다.')
    .max(100, '제목은 100글자를 초과할 수 없습니다.'),
  description: z
    .string()
    .min(10, '설명은 최소 10글자 이상이어야 합니다.')
    .optional()
    .nullable(),
  location: z
    .string()
    .min(2, '장소는 최소 2글자 이상이어야 합니다.')
    .max(200, '장소는 200글자를 초과할 수 없습니다.'),
  organizer_name: z
    .string()
    .min(2, '주최자 이름은 최소 2글자 이상이어야 합니다.')
    .max(100, '주최자 이름은 100글자를 초과할 수 없습니다.'),
  start_datetime: z.string(),
  end_datetime: z.string(),
  poster_image_url: z
    .string()
    .url('유효한 포스터 이미지 URL을 입력해주세요.')
    .optional()
    .nullable(),
  thumbnail_image_url: z
    .string()
    .url('유효한 썸네일 이미지 URL을 입력해주세요.')
    .optional()
    .nullable(),
  booking_link: z
    .string()
    .url('유효한 예약 링크 URL을 입력해주세요.')
    .optional()
    .nullable(),
  official_website: z
    .string()
    .url('유효한 공식 웹사이트 URL을 입력해주세요.')
    .optional()
    .nullable(),

  age_rating: z.enum(Constants.public.Enums.age_rating).optional().nullable(), // Enum 사용, nullable
  current_participants: z
    .number()
    .int()
    .min(0, '현재 참가자 수는 0보다 작을 수 없습니다.')
    .nullable(), // 정수, 0 이상, nullable
  event_rules: z.string().optional().nullable(), // 선택 사항
  is_approved: z.boolean().nullable(), // nullable
  notes: z.string().optional().nullable(), // 선택 사항
  organizer_contact: z
    .string()
    .email('유효한 이메일 주소 또는 연락처를 입력해주세요.')
    .optional(), // 이메일 형식 또는 다른 연락처
  participant_limit: z
    .number()
    .int()
    .min(1, '참가자 제한은 1 이상이어야 합니다.')
    .nullable()
    .optional(), // 정수, 1 이상, nullable
  participation_fee: z.string().optional(), // 문자열 형식으로 저장되나, 금액이라면 숫자 변환 필요 여부 고려
  region_id: z.number().int().nullable(),
  sns_links: SnsLinksJsonSchema.nullable().optional(),
  status: z.enum(Constants.public.Enums.event_status).nullable(),
  view_count: z
    .number()
    .int()
    .min(0, '조회수는 0보다 작을 수 없습니다.')
    .nullable(), // 정수, 0 이상, nullable

  created_at: z
    .string()
    .datetime('유효한 생성 날짜 및 시간을 입력해주세요.')
    .nullable(), // 자동 생성 필드, nullable
  updated_at: z
    .string()
    .datetime('유효한 업데이트 날짜 및 시간을 입력해주세요.')
    .nullable(), // 자동 생성 필드, nullable
});

export type Event = z.infer<typeof EventSchema>;

export const CreateEventRequestSchema = EventSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  is_approved: true, // 관리자 승인 여부는 생성 시점에 보내지 않음
  status: true, // 상태는 초기값 또는 관리자 설정
  current_participants: true, // 생성 시점에는 0 또는 null
  view_count: true, // 생성 시점에는 0
}).extend({
  category_ids: z.array(
    z.number().int().min(1).max(Constants.public.Enums.category_name.length)
  ),
});

export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>;

// 행사 업데이트 요청 스키마 (id, created_at 제외, 모든 필드 optional)
export const UpdateEventRequestSchema = EventSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial();
export type UpdateEventRequest = z.infer<typeof UpdateEventRequestSchema>;

export const CategoryNameSchema = z.enum(Constants.public.Enums.category_name);
export const RegionNameSchema = z.enum(Constants.public.Enums.region_name);

export const EventCategorySchema = z.object({
  id: z.number().int(),
  name: CategoryNameSchema,
});

export type EventCategoriesResponse = z.infer<typeof EventCategorySchema>[];

export const EventListItemSchema = EventSchema.pick({
  id: true,
  title: true,
  poster_image_url: true,
  start_datetime: true,
  end_datetime: true,
  location: true,
}).extend({
  event_categories: z.array(EventCategorySchema),
  region: RegionNameSchema,
});

export type EventListItem = z.infer<typeof EventListItemSchema>;

// 이벤트 목록 응답 스키마
export const EventsListResponseSchema = z.object({
  events: z.array(EventListItemSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
});
export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

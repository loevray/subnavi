import { z } from 'zod/v4';
import { AgeRatingDto, EventStatusDto } from './shared-event.dto';

export const EventFormSchema = z
  .object({
    title: z.string().min(2, { message: '행사명은 2자 이상 입력해주세요.' }),
    description: z.string().optional(),
    startDatetime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: '유효한 날짜를 입력해주세요.' }),
    endDatetime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: '유효한 날짜를 입력해주세요.' }),
    location: z.string().min(2, { message: '장소를 입력해주세요.' }),
    organizerName: z.string().min(2, { message: '주최자명을 입력해주세요.' }),
    organizerContact: z.string().optional(),
    regionId: z.string('지역을 선택해주세요.'),
    categoryIds: z.array(z.string()).min(1, '한 개 이상 선택해주세요.'),
    participationFee: z.string().optional(),
    ageRating: AgeRatingDto,
    officialWebsite: z.url({ message: '유효한 URL을 입력해주세요.' }).optional().or(z.literal('')),
    bookingLink: z.url({ message: '유효한 URL을 입력해주세요.' }).optional().or(z.literal('')),
    snsLinks: z.string().optional(),
    eventRules: z.string().optional(),
    posterImage: z
      .instanceof(File, { message: '이미지 파일을 선택해주세요.' })
      .optional()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, '파일 크기는 5MB를 초과할 수 없습니다.'),
    status: EventStatusDto,
  })
  .refine((data) => new Date(data.startDatetime) < new Date(data.endDatetime), {
    message: '종료 일시는 시작 일시보다 이후여야 합니다.',
    path: ['endDatetime'], // 에러 메시지를 표시할 필드
  });

// 스키마로부터 TypeScript 타입 추론
export type EventFormValues = z.infer<typeof EventFormSchema>;

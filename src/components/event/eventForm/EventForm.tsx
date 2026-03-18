import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreateEventRequest } from '@/dto/event/create-event.dto';
import { EventFormSchema, EventFormValues } from '@/dto/event/event-form.schema';
import { EventCategoryListResponse, RegionListResponse } from '@/dto/event/shared-event.dto';
import { ApiError, EventsApi } from '@/lib/api-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Calendar, Clock, FileText, ImageIcon, Loader2, MapPin, Phone, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';

const AGE_RATING_OPTIONS = ['전체관람가', '12세 이상', '15세 이상', '18세 이상'] as const;
const STATUS_OPTIONS = ['draft', 'active', 'cancelled', 'ended'] as const;

const eventFormDefaultValues: EventFormValues = {
  title: '',
  description: '',
  location: '',
  organizerName: '',
  organizerContact: '',
  participationFee: '무료',
  ageRating: '전체관람가',
  officialWebsite: '',
  startDatetime: '',
  endDatetime: '',
  regionId: '1',
  bookingLink: '',
  snsLinks: '',
  eventRules: '',
  status: 'draft',
  categoryIds: [],
};

function normalizeOptionalText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toSnsLinks(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed) ||
      Object.values(parsed).some((entry) => typeof entry !== 'string')
    ) {
      throw new Error('SNS 링크는 문자열 값을 가진 JSON 객체여야 합니다.');
    }

    return parsed as Record<string, string>;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'SNS 링크는 올바른 JSON 형식이어야 합니다.');
  }
}

function toCreateEventRequest(values: EventFormValues): CreateEventRequest {
  const regionId = Number(values.regionId);
  const categoryIds = values.categoryIds.map((value) => Number(value));

  if (!Number.isInteger(regionId) || categoryIds.some((value) => !Number.isInteger(value))) {
    throw new Error('지역과 카테고리 선택값을 다시 확인해주세요.');
  }

  return {
    title: values.title,
    description: normalizeOptionalText(values.description),
    startDatetime: new Date(values.startDatetime).toISOString(),
    endDatetime: new Date(values.endDatetime).toISOString(),
    location: values.location,
    organizerName: values.organizerName,
    organizerContact: normalizeOptionalText(values.organizerContact),
    regionId,
    categoryIds,
    participationFee: normalizeOptionalText(values.participationFee),
    ageRating: values.ageRating,
    officialWebsite: normalizeOptionalText(values.officialWebsite),
    bookingLink: normalizeOptionalText(values.bookingLink),
    snsLinks: toSnsLinks(values.snsLinks),
    eventRules: normalizeOptionalText(values.eventRules),
    posterImageUrl: undefined,
    status: values.status,
  };
}

export default function EventForm({
  setOpen,
  regions,
  categories,
  onEventFormSubmit,
}: {
  setOpen: (open: boolean) => void;
  regions: RegionListResponse;
  categories: EventCategoryListResponse;
  onEventFormSubmit: (eventId: string) => void;
}) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    mode: 'onSubmit',
    defaultValues: eventFormDefaultValues,
  });

  const {
    formState: { isSubmitting },
    watch,
  } = form;
  const posterImageFile = watch('posterImage');

  async function onSubmit(values: EventFormValues) {
    form.clearErrors('root');

    if (values.posterImage) {
      form.setError('root.serverError', {
        type: 'unsupported',
        message: '포스터 이미지 업로드는 아직 지원되지 않습니다.',
      });
      return;
    }

    let payload: CreateEventRequest;

    try {
      payload = toCreateEventRequest(values);
    } catch (error) {
      form.setError('root.serverError', {
        type: 'mapping',
        message: error instanceof Error ? error.message : '이벤트 요청 데이터를 준비하지 못했습니다.',
      });
      return;
    }

    try {
      const createdEvent = await EventsApi.create(payload);
      onEventFormSubmit(createdEvent.id);
      form.reset(eventFormDefaultValues);
      setOpen(false);
    } catch (error) {
      form.setError('root.serverError', {
        type: 'server',
        message:
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : '이벤트 생성에 실패했습니다.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">행사 추가</DialogTitle>
        </DialogHeader>

        {form.formState.errors.root?.serverError?.message ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>이벤트를 저장하지 못했습니다.</AlertTitle>
            <AlertDescription>{form.formState.errors.root.serverError.message}</AlertDescription>
          </Alert>
        ) : null}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>행사명</FormLabel>
              <FormControl>
                <Input placeholder="행사명을 입력해주세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                행사 설명
              </FormLabel>
              <FormControl>
                <Textarea placeholder="행사 소개나 운영 정보를 입력해주세요" rows={4} className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDatetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  시작 일시
                </FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDatetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  종료 일시
                </FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                장소
              </FormLabel>
              <FormControl>
                <Input placeholder="행사 장소를 입력해주세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="organizerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  주최자명
                </FormLabel>
                <FormControl>
                  <Input placeholder="주최자명을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizerContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  연락처
                </FormLabel>
                <FormControl>
                  <Input placeholder="이메일 또는 연락처를 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="regionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>지역</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="지역을 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map(({ id, name }) => (
                      <SelectItem key={id} value={id.toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <MultiSelect
                  placeholder="카테고리를 선택해주세요"
                  value={field.value}
                  options={categories.map(({ id, name }) => ({ value: id.toString(), label: name }))}
                  onValueChange={field.onChange}
                />
                <FormMessage className="min-h-5" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="participationFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>참가비</FormLabel>
                <FormControl>
                  <Input placeholder="예: 무료 / 10000원" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ageRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>관람 등급</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="관람 등급을 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AGE_RATING_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="officialWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>공식 홈페이지</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>예매 링크</FormLabel>
                <FormControl>
                  <Input placeholder="https://tickets.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상태</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="상태를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="snsLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SNS 링크 JSON</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder='예: {"x":"https://x.com/account","instagram":"https://instagram.com/account"}'
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="eventRules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>운영 규정</FormLabel>
              <FormControl>
                <Textarea placeholder="입장 규칙이나 안내사항이 있다면 적어주세요" rows={4} className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="posterImage"
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                포스터 이미지
              </FormLabel>
              <FormControl>
                <Card className="border-2 border-dashed transition-colors hover:border-primary/50">
                  <CardContent className="p-6 text-center">
                    <Label htmlFor="poster-upload" className="cursor-pointer">
                      <ImageIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">이미지를 드래그하거나 클릭해서 업로드할 수 있습니다.</p>
                      <p className="mt-1 text-xs text-muted-foreground">현재는 파일 선택만 가능하고 실제 업로드는 지원하지 않습니다.</p>
                      {posterImageFile ? <p className="mt-2 text-sm font-medium text-primary">{posterImageFile.name}</p> : null}
                    </Label>
                    <Input
                      id="poster-upload"
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif"
                      name={rest.name}
                      onBlur={rest.onBlur}
                      ref={rest.ref}
                      onChange={(event) => onChange(event.target.files ? event.target.files[0] : null)}
                    />
                  </CardContent>
                </Card>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="flex justify-end gap-3 border-t pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? '생성 중...' : '행사 생성'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

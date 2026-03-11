import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EventFormSchema, EventFormValues } from '@/dto/event/event-form.schema';
import { EventCategoryListResponse, RegionListResponse } from '@/dto/event/shared-event.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, FileText, ImageIcon, Loader2, MapPin, Phone, Users } from 'lucide-react';
import { use } from 'react';
import { useForm } from 'react-hook-form';

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
  regionId: '1', //seoul
  bookingLink: '',
  snsLinks: '',
  eventRules: '',
  status: 'draft',
  categoryIds: [],
};

//모달 open/close함수를 props로 전달하면 재사용성이 깨진다
export default function EventForm({
  setOpen,
  regionsPromise,
  categoriesPromise,
  onEventFormSubmit,
}: {
  setOpen: (open: boolean) => void;
  regionsPromise: Promise<RegionListResponse>;
  categoriesPromise: Promise<EventCategoryListResponse>;
  onEventFormSubmit: () => void;
}) {
  const regions = use(regionsPromise);
  const categories = use(categoriesPromise);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      ...eventFormDefaultValues,
    },
  });

  const {
    formState: { isSubmitting },
    watch,
  } = form;
  const posterImageFile = watch('posterImage');

  // 폼 제출 핸들러
  async function onSubmit(values: EventFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onEventFormSubmit();
    console.log('행사 제출 성공!', values);
    form.reset();
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">새 행사 추가</DialogTitle>
        </DialogHeader>

        {/* 행사명 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>행사명 *</FormLabel>
              <FormControl>
                <Input placeholder="행사명을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 행사 설명 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> 행사 설명
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="행사에 대한 자세한 설명을 입력하세요"
                  rows={4}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 날짜 및 시간 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDatetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> 시작 일시 *
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
                  <Clock className="w-4 h-4" /> 종료 일시 *
                </FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 장소 */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> 장소 *
              </FormLabel>
              <FormControl>
                <Input placeholder="행사 장소를 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 주최자 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="organizerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> 주최자명 *
                </FormLabel>
                <FormControl>
                  <Input placeholder="주최자명을 입력하세요" {...field} />
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
                  <Phone className="w-4 h-4" /> 주최자 연락처
                </FormLabel>
                <FormControl>
                  <Input placeholder="연락처를 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 지역 및 카테고리 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="regionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>지역 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="지역을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map(({ name, id }) => (
                      <SelectItem key={`${name}+${id}`} value={id.toString()}>
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
                <FormLabel>카테고리 *</FormLabel>
                <MultiSelect
                  placeholder="카테고리 선택"
                  value={field.value}
                  options={categories.map(({ id, name }) => ({ value: id.toString(), label: name }))}
                  onValueChange={field.onChange}
                />
                <FormMessage className="min-h-5" />
              </FormItem>
            )}
          />
        </div>

        {/* 이미지 업로드 */}
        <FormField
          control={form.control}
          name="posterImage"
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> 포스터 이미지
              </FormLabel>
              <FormControl>
                <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Label htmlFor="poster-upload" className="cursor-pointer">
                      <ImageIcon className="mx-auto w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">이미지를 드래그하거나 클릭하여 업로드하세요</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF (최대 5MB)</p>
                      {posterImageFile && (
                        <p className="text-sm font-medium mt-2 text-primary">{posterImageFile.name}</p>
                      )}
                    </Label>
                    <Input
                      id="poster-upload"
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                      // value prop intentionally omitted for file input
                      {...(() => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { value, ...restWithoutValue } = rest;
                        return restWithoutValue;
                      })()}
                    />
                  </CardContent>
                </Card>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? '생성 중...' : '행사 생성'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

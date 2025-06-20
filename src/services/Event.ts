// services/EventService.ts
import {
  DatabaseError,
  ValidationError,
} from '@/lib/errors/serviceErrors.server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { Database } from '../../database.types';
import {
  EventListResponse,
  EventListResponseDto,
} from '@/dto/event/event-list.dto';
import { EventCategory, RegionName } from '@/dto/event/shared-event.dto';
import camelcaseKeys from 'camelcase-keys';
import {
  EventDetailResponse,
  EventDetailResponseDto,
} from '@/dto/event/event-detail.dto';
import {
  CreateEventRequest,
  CreateEventRequestDto,
  CreateEventResponse,
} from '@/dto/event/create-event.dto';
import snakecaseKeys from 'snakecase-keys';

export type ServiceResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      details?: unknown;
    };

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: EventCategory['name'];
}

const calculatePaginationRange = (page: number, pageSize: number) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
};
type EventWithOptionalRelations = {
  event_categories: {
    categories: EventCategory;
  }[];
  regions: {
    name: RegionName;
  };
} & Record<string, unknown>;

class EventService {
  private static instance: EventService;
  private supabaseClient: SupabaseClient<Database> | null = null;

  // 상수들
  private readonly EVENTS_TABLE = 'events';

  private readonly EVENTS_LIST_QUERY = `
    id,
    title,
    poster_image_url,
    start_datetime,
    end_datetime,
    location
  `;

  private readonly EVENTS_DETAIL_QUERY = `*`; //select all

  private readonly EVENTS_REGION_QUERY = `regions(name)`; //join regions table
  private readonly EVENTS_CATEGORIES_LEFT_JOIN = `event_categories(categories(id, name))`;
  private readonly EVENT_CATEGORIES_INNER_JOIN = `event_categories!inner(categories!inner(id, name))`;

  // 싱글톤 패턴 (선택적)
  public static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  constructor(supabaseClient?: SupabaseClient<Database>) {
    if (supabaseClient) {
      this.supabaseClient = supabaseClient;
    }
  }

  // Supabase 클라이언트 초기화
  private async getSupabaseClient(): Promise<SupabaseClient<Database>> {
    if (!this.supabaseClient) {
      this.supabaseClient = await createClient();
    }
    return this.supabaseClient;
  }

  // 입력값 검증
  private validatePaginationParams(page: number, pageSize: number): void {
    if (page < 1) {
      throw new ValidationError('Page must be greater than 0');
    }
    if (pageSize < 1 || pageSize > 100) {
      throw new ValidationError('Page size must be between 1 and 100');
    }
  }

  // 이벤트 목록 조회
  public async getEvents(
    params: QueryParams = {}
  ): Promise<ServiceResult<EventListResponse>> {
    try {
      const { page = 1, pageSize = 5, category } = params;

      //dto.parse로 변경해야함
      this.validatePaginationParams(page, pageSize);

      const supabase = await this.getSupabaseClient();
      const { from, to } = calculatePaginationRange(page, pageSize);

      let query = supabase.from(this.EVENTS_TABLE).select(
        `${this.EVENTS_LIST_QUERY},
         ${
           category
             ? this.EVENT_CATEGORIES_INNER_JOIN
             : this.EVENTS_CATEGORIES_LEFT_JOIN
         },
         ${this.EVENTS_REGION_QUERY}`,
        { count: 'exact' }
      );

      // 필터링 적용
      // 전략패턴 or 매핑으로 바꿔두면 확장성 용이할듯
      if (category) {
        query = query.eq('event_categories.categories.name', category);
      }

      //pagination
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data: events, error, count } = await query;

      if (error) {
        throw new DatabaseError(
          `Failed to fetch events: ${error.message}`,
          error
        );
      }

      const transformedEvents =
        events.map((event) =>
          this.transformSingleEventData<typeof event>(event)
        ) || [];

      const response: EventListResponse = {
        events: camelcaseKeys(transformedEvents),
        pagination: {
          page,
          pageSize,
          hasMore: (count ?? 0) > page * pageSize,
          total: count ?? 0,
          totalPages: Math.ceil((count ?? 0) / pageSize),
        },
      };

      const parsed = EventListResponseDto.safeParse(response);

      if (!parsed.success) {
        throw new ValidationError('Response validation failed', parsed.error);
      }

      return {
        success: true,
        data: parsed.data,
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch events');
    }
  }

  private transformSingleEventData<T extends EventWithOptionalRelations>(
    event: T
  ) {
    const { event_categories, regions, ...rest } = event;
    return {
      ...rest,
      region: regions.name,
      categories: event_categories?.map((ec) => ec.categories) ?? [],
    };
  }

  // 단일 이벤트 조회
  public async getEventById(params: {
    id: string;
  }): Promise<ServiceResult<EventDetailResponse>> {
    try {
      const { id } = params;

      if (!id) {
        throw new ValidationError('Event ID is required');
      }

      const supabase = await this.getSupabaseClient();

      const { data: event, error } = await supabase
        .from(this.EVENTS_TABLE)
        .select(
          `
          ${this.EVENTS_DETAIL_QUERY},
          ${this.EVENTS_CATEGORIES_LEFT_JOIN},
          ${this.EVENTS_REGION_QUERY}
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          //에러인가에 대한 고민을 해보자
          throw new ValidationError('Event not found');
        }
        throw new DatabaseError(
          `Failed to fetch event: ${error.message}`,
          error
        );
      }

      const transformedEvent = this.transformSingleEventData(event);

      const parsed = EventDetailResponseDto.safeParse(
        camelcaseKeys(transformedEvent)
      );

      if (!parsed.success) {
        throw new ValidationError('Response validation failed', parsed.error);
      }

      return {
        success: true,
        data: parsed.data,
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch event');
    }
  }

  // 이벤트 생성
  public async createEvent(
    eventData: CreateEventRequest
  ): Promise<ServiceResult<CreateEventResponse>> {
    try {
      const supabase = await this.getSupabaseClient();
      const parsed = CreateEventRequestDto.safeParse(eventData);

      if (!parsed.success) {
        throw new ValidationError('Request validation failed', parsed.error);
      }

      const { region_id, categories, ...snakeCasedEventData } = snakecaseKeys(
        parsed.data
      );

      // 트랜잭션으로 이벤트와 카테고리 관계 생성
      const { data: event, error: eventError } = await supabase
        .from(this.EVENTS_TABLE)
        .insert([{ ...snakeCasedEventData, region_id }])
        .select()
        .single();

      if (eventError) {
        throw new DatabaseError(
          `Failed to create event: ${eventError.message}`,
          eventError
        );
      }

      // 카테고리 관계 생성
      const categoryRelations = categories.map(({ id: categoryId }) => ({
        event_id: event.id,
        category_id: categoryId,
      }));

      const { error: categoryError } = await supabase
        .from('event_categories')
        .insert(categoryRelations);

      if (categoryError) {
        throw new DatabaseError(
          `Failed to create event categories: ${categoryError.message}`,
          categoryError
        );
      }

      return {
        success: true,
        data: camelcaseKeys(event),
      };
    } catch (error) {
      return this.handleError(error, 'Failed to create event');
    }
  }

  /*   public async updateEvent(
    updateData: UpdateEventRequest,
    id: string
  ): Promise<ServiceResult<UpdateEventResponse>> {
    try {
      if (!id) {
        throw new ValidationError('Event ID is required');
      }

      if (!updateData) {
        throw new ValidationError('Has no data for Update Event');
      }

      const supabase = await this.getSupabaseClient();

      const snakeCasedUpdateData = snakecaseKeys(updateData);

      const parsed = UpdateEventRequestDto.safeParse(snakeCasedUpdateData);

      if (!parsed.success || !parsed.data) {
        //parsed.data가 !updateData로 nullish가드한 로직을 인식하지 못함.
        throw new ValidationError('Request validation failed', parsed.error);
      }

      const { data: event, error } = await supabase
        .from(this.EVENTS_TABLE)
        .update(parsed.data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new DatabaseError(
          `Failed to update event: ${error.message}`,
          error
        );
      }

      // 카테고리 업데이트 (필요한 경우)
      if (updateData.categories) {
        // 기존 카테고리 관계 삭제
        await supabase.from('event_categories').delete().eq('event_id', id);

        // 새 카테고리 관계 생성
        if (updateData.categoryIds.length > 0) {
          const categoryRelations = updateData.categoryIds.map(
            (categoryId) => ({
              event_id: id,
              category_id: categoryId,
            })
          );

          const { error: categoryError } = await supabase
            .from('event_categories')
            .insert(categoryRelations);

          if (categoryError) {
            throw new DatabaseError(
              `Failed to update event categories: ${categoryError.message}`,
              categoryError
            );
          }
        }
      }

      return {
        success: true,
        data: camelCaseKeys(event),
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update event');
    }
  }

  public async deleteEvent(id: string): Promise<ServiceResult<boolean>> {
    try {
      if (!id) {
        throw new ValidationError('Event ID is required');
      }

      const supabase = await this.getSupabaseClient();

      const { error } = await supabase
        .from(this.EVENTS_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        throw new DatabaseError(
          `Failed to delete event: ${error.message}`,
          error
        );
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return this.handleError(error, 'Failed to delete event');
    }
  } */

  // 에러 처리 헬퍼
  private handleError(
    error: unknown,
    defaultMessage: string
  ): ServiceResult<never> {
    console.error(defaultMessage, error);

    if (error instanceof ValidationError || error instanceof DatabaseError) {
      return {
        success: false,
        error: error.message,
        details: error.details,
      };
    }

    return {
      success: false,
      error: defaultMessage,
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 싱글톤 인스턴스 내보내기
export const eventService = EventService.getInstance();

// 클래스 자체도 내보내기 (테스트나 새 인스턴스 생성용)
export default EventService;

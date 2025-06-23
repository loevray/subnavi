// services/EventService.ts
import {
  DatabaseError,
  ValidationError,
  NotFoundError,
} from '@/lib/errors/serviceErrors.server';
import type { SupabaseClient } from '@supabase/supabase-js';
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
import { createClient } from '@/utils/supabase/server';

export interface QueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
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

export default class EventService {
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
  private readonly EVENTS_DETAIL_QUERY = `*`;
  private readonly EVENTS_REGION_QUERY = `regions(name)`;
  private readonly EVENTS_CATEGORIES_LEFT_JOIN = `event_categories(categories(id, name))`;
  private readonly EVENT_CATEGORIES_INNER_JOIN = `event_categories!inner(categories!inner(id, name))`;

  private validatePaginationParams(page: number, pageSize: number): void {
    if (page < 1) {
      throw new ValidationError('Page must be greater than 0');
    }
    if (pageSize < 1 || pageSize > 100) {
      throw new ValidationError('Page size must be between 1 and 100');
    }
  }

  // 이벤트 목록 조회 - 성공하면 데이터 반환, 실패하면 에러 throw
  public async getEvents(params: QueryParams = {}): Promise<EventListResponse> {
    const { page = 1, pageSize = 5, keyword, category } = params;

    this.validatePaginationParams(page, pageSize);

    const supabase = await createClient();
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

    if (category) {
      query = query.eq('event_categories.categories.name', category);
    }

    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%, description.ilike.%${keyword}%`
      );
    }

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

    return parsed.data;
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
  }): Promise<EventDetailResponse> {
    const { id } = params;

    if (!id) {
      throw new ValidationError('Event ID is required');
    }

    const supabase = await createClient();

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
        throw new NotFoundError('Event not found', error);
      }
      throw new DatabaseError(`Failed to fetch event: ${error.message}`, error);
    }

    const transformedEvent = this.transformSingleEventData(event);

    const parsed = EventDetailResponseDto.safeParse(
      camelcaseKeys(transformedEvent)
    );

    if (!parsed.success) {
      throw new ValidationError('Response validation failed', parsed.error);
    }

    return parsed.data;
  }

  // 이벤트 생성
  public async createEvent(
    eventData: CreateEventRequest
  ): Promise<CreateEventResponse> {
    const supabase = await createClient();
    const parsed = CreateEventRequestDto.safeParse(eventData);

    if (!parsed.success) {
      throw new ValidationError('Request validation failed', parsed.error);
    }

    const { region_id, category_ids, ...snakeCasedEventData } = snakecaseKeys(
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
    const categoryRelations = category_ids.map((categoryId) => ({
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

    return camelcaseKeys(event);
  }

  // 업데이트 메서드 (예시)
  public async updateEvent(
    id: string,
    updateData: Partial<CreateEventRequest>
  ): Promise<CreateEventResponse> {
    if (!id) {
      throw new ValidationError('Event ID is required');
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new ValidationError('Update data is required');
    }

    const supabase = await createClient();
    const snakeCasedUpdateData = snakecaseKeys(updateData);

    const { data: event, error } = await supabase
      .from(this.EVENTS_TABLE)
      .update(snakeCasedUpdateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Event not found');
      }
      throw new DatabaseError(
        `Failed to update event: ${error.message}`,
        error
      );
    }

    return camelcaseKeys(event);
  }

  // 삭제 메서드 (예시)
  public async deleteEvent(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError('Event ID is required');
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from(this.EVENTS_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Event not found');
      }
      throw new DatabaseError(
        `Failed to delete event: ${error.message}`,
        error
      );
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const eventService = new EventService();

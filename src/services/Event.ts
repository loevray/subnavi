import {
  DatabaseError,
  ValidationError,
  NotFoundError,
  isCustomError,
  InternalError,
} from '@/lib/errors/serviceErrors.server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import type { PostgrestError } from '@supabase/supabase-js';

import {
  EventListRequest,
  EventListRequestDto,
  EventListResponse,
  EventListResponseDto,
} from '@/dto/event/event-list.dto';
import {
  EventDetailRequest,
  EventDetailRequestDto,
  EventDetailResponse,
  EventDetailResponseDto,
} from '@/dto/event/event-detail.dto';
import { CreateEventRequest, CreateEventRequestDto, CreateEventResponse } from '@/dto/event/create-event.dto';
import { EventCategory, EventDateFilter, RegionName } from '@/dto/event/shared-event.dto';
import { UpdateEventRequest, UpdateEventRequestDto, UpdateEventResponse } from '@/dto/event/update-event.dto';
import { ServiceResult } from './type';
import { isEventDatePreset, isEventDateString } from '@/utils/eventDateFilter';

export interface QueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: EventCategory['name'];
  region?: RegionName;
  date?: EventDateFilter;
}

type EventWithOptionalRelations = {
  event_categories: {
    categories: EventCategory;
  }[];
  regions: {
    name: RegionName;
  };
} & Record<string, unknown>;

export default class EventService {
  private static readonly EVENTS_TABLE = 'events';
  private static readonly EVENTS_LIST_QUERY = `
    id,
    title,
    poster_image_url,
    start_datetime,
    end_datetime,
    location
  `;
  private static readonly EVENTS_DETAIL_QUERY = `*`;
  private static readonly EVENTS_REGION_QUERY = `regions(name)`;
  private static readonly EVENTS_CATEGORIES_LEFT_JOIN = `event_categories(categories(id, name))`;
  private static readonly EVENT_CATEGORIES_INNER_JOIN = `event_categories!inner(categories!inner(id, name))`;

  private async getSupabaseClient() {
    return await createClient();
  }

  private getAdminSupabaseClient() {
    return createAdminClient();
  }

  private static calculatePaginationRange(page: number, pageSize: number) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    return { from, to };
  }

  //handleCustomError와 중복되는 로직 혼재
  private handleServiceError(error: unknown) {
    if (isCustomError(error)) {
      return { success: false as const, ...error.toResponse() };
    }
    const internalError = new InternalError('unknown service error', error);
    return { success: false as const, ...internalError.toResponse() };
  }

  private handleDatabaseError(error: PostgrestError, operation: string): never {
    if (error.code === 'PGRST116') {
      //Postgres has now row error
      throw new NotFoundError('Event not found', error);
    }
    throw new DatabaseError(`Failed to ${operation}: ${error.message}`, error);
  }

  private transformSingleEventData<T extends EventWithOptionalRelations>(event: T) {
    const { event_categories, regions, ...rest } = event;
    return {
      ...rest,
      region: regions.name,
      categories: event_categories.map((ec) => ec.categories) ?? [],
    };
  }

  private async fetchEventsQuery(
    params: Pick<EventListRequest, 'category' | 'keyword' | 'region' | 'date'> & { from: number; to: number }
  ) {
    const supabase = await this.getSupabaseClient();
    const { from, to, keyword, category, region, date } = params;

    let query = supabase
      .from(EventService.EVENTS_TABLE)
      .select(this.buildEventsListQuery(category), { count: 'exact' });

    if (category) {
      query = query.eq('event_categories.categories.name', category);
    }

    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
    }

    if (region) {
      query = query.eq('regions.name', region);
    }

    if (date) {
      const { startIso, endIso } = EventService.getDateFilterRange(date);
      query = query.lte('start_datetime', endIso).gte('end_datetime', startIso);
    }

    return query.range(from, to).order('created_at', { ascending: false });
  }

  private async fetchEventByIdQuery(id: string) {
    const supabase = await this.getSupabaseClient();
    return supabase.from(EventService.EVENTS_TABLE).select(this.buildEventDetailQuery()).eq('id', id).single();
  }

  private buildEventsListQuery(category?: string) {
    return `${EventService.EVENTS_LIST_QUERY},
      ${category ? EventService.EVENT_CATEGORIES_INNER_JOIN : EventService.EVENTS_CATEGORIES_LEFT_JOIN},
      ${EventService.EVENTS_REGION_QUERY}` as const;
  }

  private buildEventDetailQuery() {
    return `${EventService.EVENTS_DETAIL_QUERY},
      ${EventService.EVENTS_CATEGORIES_LEFT_JOIN},
      ${EventService.EVENTS_REGION_QUERY}` as const;
  }

  private static readonly KST_OFFSET_HOURS = 9;

  private static getDateFilterRange(dateFilter: EventDateFilter) {
    if (isEventDateString(dateFilter)) {
      const [year, month, day] = dateFilter.split('-').map(Number);

      return {
        startIso: EventService.createUtcIsoFromKstDate(year, month - 1, day, 0, 0, 0, 0),
        endIso: EventService.createUtcIsoFromKstDate(year, month - 1, day, 23, 59, 59, 999),
      };
    }

    if (!isEventDatePreset(dateFilter)) {
      throw new ValidationError('Request Validation Failed', {
        message: 'Unsupported date filter',
      });
    }

    const now = new Date();
    const kstNow = new Date(now.getTime() + EventService.KST_OFFSET_HOURS * 60 * 60 * 1000);
    const year = kstNow.getUTCFullYear();
    const month = kstNow.getUTCMonth();
    const day = kstNow.getUTCDate();
    const dayOfWeek = kstNow.getUTCDay();

    if (dateFilter === 'today') {
      return {
        startIso: EventService.createUtcIsoFromKstDate(year, month, day, 0, 0, 0, 0),
        endIso: EventService.createUtcIsoFromKstDate(year, month, day, 23, 59, 59, 999),
      };
    }

    if (dateFilter === 'weekend') {
      const daysUntilSaturday = dayOfWeek === 0 ? 0 : Math.max(0, 6 - dayOfWeek);
      const saturday = new Date(Date.UTC(year, month, day + daysUntilSaturday));
      const sunday = new Date(Date.UTC(year, month, day + daysUntilSaturday + 1));

      return {
        startIso: EventService.createUtcIsoFromKstDate(
          saturday.getUTCFullYear(),
          saturday.getUTCMonth(),
          saturday.getUTCDate(),
          0,
          0,
          0,
          0
        ),
        endIso: EventService.createUtcIsoFromKstDate(
          sunday.getUTCFullYear(),
          sunday.getUTCMonth(),
          sunday.getUTCDate(),
          23,
          59,
          59,
          999
        ),
      };
    }

    const monthStart = new Date(Date.UTC(year, month, 1));
    const monthEnd = new Date(Date.UTC(year, month + 1, 0));

    return {
      startIso: EventService.createUtcIsoFromKstDate(
        monthStart.getUTCFullYear(),
        monthStart.getUTCMonth(),
        monthStart.getUTCDate(),
        0,
        0,
        0,
        0
      ),
      endIso: EventService.createUtcIsoFromKstDate(
        monthEnd.getUTCFullYear(),
        monthEnd.getUTCMonth(),
        monthEnd.getUTCDate(),
        23,
        59,
        59,
        999
      ),
    };
  }

  private static createUtcIsoFromKstDate(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number
  ) {
    return new Date(
      Date.UTC(year, month, day, hour - EventService.KST_OFFSET_HOURS, minute, second, millisecond)
    ).toISOString();
  }

  public async getEvents(params?: EventListRequest): Promise<ServiceResult<EventListResponse>> {
    try {
      const pasredParams = EventListRequestDto.safeParse(params);
      if (!pasredParams.success) {
        throw new ValidationError('Request Validation Failed', pasredParams.error);
      }

      const { page = 1, pageSize = 5, category, keyword, region, date } = pasredParams.data;

      const { from, to } = EventService.calculatePaginationRange(page, pageSize);

      const {
        data: events,
        error,
        count,
      } = await this.fetchEventsQuery({
        from,
        to,
        category,
        keyword,
        region,
        date,
      });

      if (error) this.handleDatabaseError(error, 'fetch events');

      const response: EventListResponse = {
        events: camelcaseKeys(events.map((e) => this.transformSingleEventData(e))),
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

      return { success: true, data: parsed.data };
    } catch (e) {
      return this.handleServiceError(e);
    }
  }

  public async getEventById({ id }: EventDetailRequest): Promise<ServiceResult<EventDetailResponse>> {
    try {
      const parsedRequest = EventDetailRequestDto.safeParse({ id });
      if (!parsedRequest.success) {
        throw new ValidationError('Reqeust validation failed', parsedRequest.error);
      }

      const eventId = parsedRequest.data.id;

      const { data: event, error } = await this.fetchEventByIdQuery(eventId);
      if (error) this.handleDatabaseError(error, 'fetch event');

      const transformed = this.transformSingleEventData(event);
      const parsed = EventDetailResponseDto.safeParse(camelcaseKeys(transformed));

      if (!parsed.success) {
        throw new ValidationError('Response validation failed', parsed.error);
      }

      return { success: true, data: parsed.data };
    } catch (e) {
      return this.handleServiceError(e);
    }
  }

  public async createEvent(eventData: CreateEventRequest): Promise<ServiceResult<CreateEventResponse>> {
    try {
      const parsed = CreateEventRequestDto.safeParse(eventData);
      if (!parsed.success) {
        throw new ValidationError('Request validation failed', parsed.error);
      }

      const supabase = this.getAdminSupabaseClient();
      const { region_id, category_ids, ...snakeCased } = snakecaseKeys(parsed.data);

      //event 추가와 관계 추가 작업은 하나의 트랜잭션으로 묶여야함
      const { data: event, error } = await supabase
        .from(EventService.EVENTS_TABLE)
        .insert([{ ...snakeCased, region_id }])
        .select()
        .single();

      if (error) this.handleDatabaseError(error, 'create event');

      const relations = category_ids.map((categoryId) => ({
        event_id: event.id,
        category_id: categoryId,
      }));

      const { error: relError } = await supabase.from('event_categories').insert(relations);
      if (relError) this.handleDatabaseError(relError, 'create event categories');

      return { success: true, data: { id: event.id } };
    } catch (e) {
      return this.handleServiceError(e);
    }
  }

  public async updateEvent(updateData: UpdateEventRequest): Promise<ServiceResult<UpdateEventResponse>> {
    try {
      const parsedUpdateData = UpdateEventRequestDto.safeParse(updateData);
      if (!parsedUpdateData.success) {
        throw new ValidationError('Request validation failed', parsedUpdateData.error);
      }
      const snakeCased = snakecaseKeys(parsedUpdateData.data);

      const supabase = this.getAdminSupabaseClient();
      const { data: event, error } = await supabase
        .from(EventService.EVENTS_TABLE)
        .update(snakeCased)
        .eq('id', snakeCased.id)
        .select()
        .single();

      if (error) this.handleDatabaseError(error, 'update event');

      return { success: true, data: { id: event.id } };
    } catch (e) {
      return this.handleServiceError(e);
    }
  }

  public async deleteEvent(id: string): Promise<void> {
    const supabase = this.getAdminSupabaseClient();
    const { error } = await supabase.from(EventService.EVENTS_TABLE).delete().eq('id', id);

    if (error) this.handleDatabaseError(error, 'delete event');
  }
}

export const eventService = new EventService();

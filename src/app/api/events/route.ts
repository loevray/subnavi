import {
  EventListResponse,
  EventListResponseDto,
} from '@/dto/event/event-list.dto';
import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';
import camelCaseKeys from 'camelcase-keys';
import { CreateEventRequestDto } from '@/dto/event/create-event.dto';
import snakeCaseKeys from 'snakecase-keys';
import { Database } from '../../../../database.types';

const EVENTS_TABLE = 'events';

const EVENTS_LIST_QUERY = `
id,
title,
poster_image_url,
start_datetime,
end_datetime,
location
`;

export const EVENTS_CATEGORIES_QUERY = `
event_categories(
categories(id,name)
)`;

export const EVENTS_REGION_QUERY = `
regions(name)
`;

const craeteEventsCategoriesQuery = (isFiltered: boolean) =>
  isFiltered
    ? `event_categories!inner(categories!inner(id, name))`
    : EVENTS_CATEGORIES_QUERY;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '5');
    const category = searchParams.get(
      'category'
    ) as Database['public']['Enums']['category_name'];
    const supabase = await createClient();

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from(EVENTS_TABLE).select(
      `${EVENTS_LIST_QUERY},
     ${craeteEventsCategoriesQuery(!!category)},
     ${EVENTS_REGION_QUERY}`,
      { count: 'exact' }
    );

    // 카테고리 필터링 적용
    if (category) {
      query = query.eq('event_categories.categories.name', category);
      // 방법 2: 또는 categories 테이블의 ID로 필터링하는 경우
      // const categoryId = parseInt(category);
      // if (!isNaN(categoryId)) {
      //   query = query.eq('event_categories.category_id', categoryId);
      // }

      // 방법 3: 또는 categories 테이블의 slug로 필터링하는 경우
      // query = query.eq('event_categories.categories.slug', category);
    }

    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: events, error, count } = await query;

    if (error) {
      console.error('Database query error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // 데이터 변환
    const transformedEvents =
      events?.map((event) => {
        const { regions, ...rest } = event;
        const flatCategories =
          event.event_categories?.map((ec) => ec.categories) || [];

        return {
          ...rest,
          categories: flatCategories,
          region: regions?.name || null,
        };
      }) || [];

    const response: EventListResponse = {
      events: camelCaseKeys(transformedEvents),
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
      console.error('Response validation error:', parsed.error);
      return Response.json(parsed.error.flatten(), { status: 400 });
    }

    return Response.json(parsed.data);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return Response.json(
      {
        error: 'Failed to fetch events',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CreateEventRequestDto.safeParse(body);

  if (!parsed.success) {
    return Response.json(parsed.error.flatten(), { status: 400 });
  }

  const { region_id, categories, ...eventData } = snakeCaseKeys(parsed.data);

  try {
    const supabase = await createClient();

    const { data: eventInsert, error: eventError } = await supabase
      .from('events')
      .insert([{ ...eventData, region_id }])
      .select()
      .single();

    if (eventError) {
      return Response.json({ error: eventError.message }, { status: 500 });
    }

    const eventCategoriesToInsert = categories.map(({ id }) => ({
      event_id: eventInsert.id,
      category_id: id,
    }));

    const { error: eventCategoryMappingError } = await supabase
      .from('event_categories')
      .insert(eventCategoriesToInsert);

    if (eventCategoryMappingError) {
      return Response.json(
        { error: 'Failed to created event connect to categories' },
        { status: 500 }
      );
    }

    return Response.json(eventInsert, { status: 201 });
  } catch {
    return Response.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

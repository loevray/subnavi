import {
  EventListResponse,
  EventListResponseDto,
} from '@/dto/event/event-list.dto';
import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';
import camelCaseKeys from 'camelcase-keys';
import { CreateEventRequestDto } from '@/dto/event/create-event.dto';
import snakeCaseKeys from 'snakecase-keys';

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '5');

    const supabase = await createClient();

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const query = supabase
      .from(EVENTS_TABLE)
      .select(
        `${EVENTS_LIST_QUERY},
        ${EVENTS_CATEGORIES_QUERY},
        ${EVENTS_REGION_QUERY}`,
        { count: 'exact' }
      )
      .range(from, to)
      .order('created_at', { ascending: false });

    const { data: events, error, count } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const transformedEvents = events.map((event) => {
      const { regions, ...rest } = event;
      const flatCategories = event.event_categories.map((ec) => ec.categories);

      return {
        ...rest,
        categories: flatCategories,
        region: regions.name,
      };
    });

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
      return Response.json(parsed.error.flatten(), { status: 400 });
    }

    return Response.json(parsed.data);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
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

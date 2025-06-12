import { CreateEventRequestSchema } from '@/schema/events';
import { createClient } from '@/utils/supabase/server';

const EVENTS_TABLE = 'events';

const EVENTS_LIST_QUERY = `
id,
title,
poster_image_url,
description,
start_datetime,
end_datetime,
location
`;

const EVENTS_CATEGORIES_QUERY = `
event_categories(
categories(id,name)
)`;

const EVENTS_REGION_QUERY = `
regions(name)
`;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: events, error } = await supabase
      .from(EVENTS_TABLE)
      .select(
        `${EVENTS_LIST_QUERY},
        ${EVENTS_CATEGORIES_QUERY},
        ${EVENTS_REGION_QUERY}
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const transformedEvents = events.map((event) => {
      const { regions, ...rest } = event;
      const flatCategories = event.event_categories.map((ec) => ec.categories);

      return {
        ...rest,
        event_categories: flatCategories,
        region: regions?.name,
      };
    });

    return Response.json(transformedEvents);
  } catch {
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CreateEventRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(parsed.error.flatten(), { status: 400 });
  }

  const { region_id, category_ids, ...eventData } = parsed.data;

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

    const eventCategoriesToInsert = category_ids.map((category_id) => ({
      event_id: eventInsert.id,
      category_id: category_id,
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

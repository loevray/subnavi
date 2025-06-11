import { createClient } from '@/utils/supabase/server';

const EVENTS_TABLE = 'events';

const EVENTS_LIST_QUERY = `
id,
title,
poster_image_url,
description,
start_datetime,
end_datetime,
location,
region_id
`;

const EVENTS_CATEGORIES_QUERY = `
event_categories(
categories(id,name)
)`;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: events, error } = await supabase
      .from(EVENTS_TABLE)
      .select(
        `${EVENTS_LIST_QUERY},
        ${EVENTS_CATEGORIES_QUERY}
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    //행사목록 하나도 없을때는 프론트엔드에서 처리

    //서비스로직?
    const eventsWithCategories = events.map((event) => ({
      ...event,
      event_categories: event.event_categories.map((ec) => ec.categories),
    }));

    return Response.json(eventsWithCategories);
  } catch {
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  //행사 추가
  return request;
}

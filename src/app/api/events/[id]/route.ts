import { createClient } from '@/utils/supabase/server';
import { EVENTS_CATEGORIES_QUERY, EVENTS_REGION_QUERY } from '../route';
import { EventDetailResponseDto } from '@/dto/event/event-detail.dto';
import camelcaseKeys from 'camelcase-keys';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  //특정 행사 정보

  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: event, error } = await supabase
      .from('events')
      .select(`*,${EVENTS_CATEGORIES_QUERY},${EVENTS_REGION_QUERY}`)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event by ID:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!event) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }
    const { event_categories, regions, ...rest } = event;

    const newEvent = camelcaseKeys({
      ...rest,
      region: regions.name,
      categories: event_categories.map((ec) => ec.categories),
    });

    const parsed = EventDetailResponseDto.safeParse(newEvent);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    return Response.json(parsed.data);
  } catch (err) {
    console.error('Failed to fetch event:', err);
    return Response.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  try {
    const supabase = await createClient();
    const { data: event, error } = await supabase
      .from('events')
      .update(body)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error update event by ID:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!event) {
      // 해당 ID의 이벤트가 없을 경우 404 Not Found 응답
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }

    return Response.json(event);
  } catch (err) {
    console.error('Failed to update event:', err);
    return Response.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  //특정 행사 삭제
  const { id } = await params;

  try {
    const supabase = await createClient();
    const response = await supabase.from('events').delete().eq('id', id);
    if (response.error) {
      return Response.json({ error: response.error }, { status: 400 });
    }
    return Response.json({ status: 204 });
  } catch (err) {
    console.error('Failed to delete event:', err);
    return Response.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

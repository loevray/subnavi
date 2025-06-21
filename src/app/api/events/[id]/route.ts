import { createClient } from '@/utils/supabase/server';
import { eventService } from '@/services/Event';
import { isCustomError } from '@/lib/errors/serviceErrors.server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const data = await eventService.getEventById({ id });
    return Response.json(data);
  } catch (error) {
    console.error('Error in GET /api/events/[id]:', error);

    if (isCustomError(error)) {
      return Response.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.statusCode }
      );
    }

    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
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

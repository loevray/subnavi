import { createClient } from '@/utils/supabase/server';

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
      .select(`*`)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event by ID:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!event) {
      // 해당 ID의 이벤트가 없을 경우 404 Not Found 응답
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }

    return Response.json(event);
  } catch (err) {
    console.error('Failed to fetch event:', err);
    return Response.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  //특정 행사 삭제
  return request;
}

import handleCustomError from '@/utils/handleCustomError';
import { eventService } from '@/services/Event';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const serviceResponse = await eventService.getEventById({ id });

    if (serviceResponse.success) {
      return Response.json(serviceResponse.data);
    }

    const { error } = serviceResponse;
    console.error('Error in GET /api/events/[id]:', error);
    return Response.json({ error }, { status: error.statusCode });
  } catch (error) {
    console.error('Unexpected error in GET /api/events/[id]:', error);
    return handleCustomError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const serviceResponse = await eventService.updateEvent({ ...body, id });

    if (serviceResponse.success) {
      return Response.json(serviceResponse.data);
    }

    const { error } = serviceResponse;
    console.error('Error in PATCH /api/events/[id]:', error);
    return Response.json({ error }, { status: error.statusCode });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/events/[id]:', error);
    return handleCustomError(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await eventService.deleteEvent(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/events/[id]:', error);
    return handleCustomError(error);
  }
}

import { eventService } from '@/services/Event';
import { Constants } from '../../../../database.types';
import { EventCategory, EventDateFilterDto, RegionName } from '@/dto/event/shared-event.dto';
import handleCustomError from '@/utils/handleCustomError';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawCategory = searchParams.get('category');
    const rawRegion = searchParams.get('region');
    const rawDate = searchParams.get('date');
    const category = Constants.public.Enums.category_name.includes(rawCategory as EventCategory['name'])
      ? (rawCategory as EventCategory['name'])
      : undefined;
    const region = Constants.public.Enums.region_name.includes(rawRegion as RegionName)
      ? (rawRegion as RegionName)
      : undefined;
    const parsedDate = EventDateFilterDto.safeParse(rawDate);
    const date = parsedDate.success ? parsedDate.data : undefined;

    const queryParams = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 5,
      category,
      region,
      date,
      keyword: searchParams.get('keyword') ?? undefined,
    };

    const serviceResponse = await eventService.getEvents(queryParams);
    if (serviceResponse.success) return Response.json(serviceResponse.data);
    const { error } = serviceResponse;
    console.error('Error in GET /api/events:', error);
    return Response.json({ error }, { status: error.statusCode });
  } catch (error) {
    console.error('Unexpected error in GET /api/events:', error);
    return handleCustomError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const serviceResponse = await eventService.createEvent(body);
    if (!serviceResponse.success) {
      const { error } = serviceResponse;
      console.error('Error in POST /api/events:', error);
      return Response.json({ error }, { status: error.statusCode });
    }

    return Response.json(serviceResponse.data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/events:', error);
    return handleCustomError(error);
  }
}

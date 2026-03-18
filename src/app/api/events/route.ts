import { eventService } from '@/services/Event';
import handleCustomError from '@/utils/handleCustomError';
import {
  normalizeEventListCategory,
  normalizeEventListDate,
  normalizeEventListKeyword,
  normalizeEventListRegion,
  normalizePositiveIntegerSearchParam,
} from '@/utils/eventListSearchParams';
import { createNotFoundApiResponse, isDevelopmentEnvironment } from '@/utils/runtimeEnvironment';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      page: normalizePositiveIntegerSearchParam(searchParams.get('page'), 1),
      pageSize: normalizePositiveIntegerSearchParam(searchParams.get('pageSize'), 5),
      category: normalizeEventListCategory(searchParams.get('category')),
      region: normalizeEventListRegion(searchParams.get('region')),
      date: normalizeEventListDate(searchParams.get('date')),
      keyword: normalizeEventListKeyword(searchParams.get('keyword')),
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
  if (!isDevelopmentEnvironment()) {
    return createNotFoundApiResponse();
  }

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

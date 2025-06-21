import { eventService } from '@/services/Event';
import { Constants } from '../../../../database.types';
import { EventCategory } from '@/dto/event/shared-event.dto';
import { isCustomError } from '@/lib/errors/serviceErrors.server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawCategory = searchParams.get('category');
    const category = Constants.public.Enums.category_name.includes(
      rawCategory as EventCategory['name']
    )
      ? (rawCategory as EventCategory['name'])
      : undefined;

    const queryParams = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 5,
      category,
    };

    // 에러가 발생하면 자동으로 throw됨
    const data = await eventService.getEvents(queryParams);

    return Response.json(data);
  } catch (error) {
    console.error('Error in GET /api/events:', error);

    // CustomError인 경우 적절한 상태 코드와 메시지 반환
    if (isCustomError(error)) {
      return Response.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.statusCode }
      );
    }

    // 예상치 못한 에러
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 성공하면 데이터 반환, 실패하면 에러 throw
    const data = await eventService.createEvent(body);

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/events:', error);

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

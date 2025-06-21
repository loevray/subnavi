import { isCustomError } from '@/lib/errors/serviceErrors.server';
import { categoryService } from '@/services/Category';

export async function GET() {
  try {
    const data = categoryService.getCateogires();
    return Response.json(data);
  } catch (error) {
    console.log('Failed to fetch categories', error);

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

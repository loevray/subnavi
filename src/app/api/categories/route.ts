import handleCustomError from '@/utils/handleCustomError';
import { categoryService } from '@/services/Category';

export async function GET() {
  try {
    const serviceResponse = await categoryService.getCateogires();
    if (serviceResponse.success) return Response.json(serviceResponse.data);
    const { error } = serviceResponse;

    console.error('Error in GET /api/categories:', error);
    return Response.json({ error }, { status: error.statusCode });
  } catch (error) {
    console.error('Unexpected error in GET /api/categories:', error);
    return handleCustomError(error);
  }
}

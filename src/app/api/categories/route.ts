import { categoryService } from '@/services/Category';

export async function GET() {
  const serviceResponse = await categoryService.getCateogires();
  if (serviceResponse.success) return Response.json(serviceResponse.data);
  const { error } = serviceResponse;

  console.error('Error in GET /api/categories:', error);
  return Response.json({ error }, { status: error.statusCode });
}

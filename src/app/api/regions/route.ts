import { regionService } from '@/services/Region';

export async function GET() {
  const serviceResponse = await regionService.getRegions();
  if (serviceResponse.success) return Response.json(serviceResponse.data);

  const { error } = serviceResponse;
  console.error('Error in GET /api/regions:', error);

  return Response.json({ error }, { status: error.statusCode });
}

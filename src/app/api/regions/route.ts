import handleCustomError from '@/utils/handleCustomError';
import { regionService } from '@/services/Region';

export async function GET() {
  try {
    const serviceResponse = await regionService.getRegions();
    if (serviceResponse.success) return Response.json(serviceResponse.data);

    const { error } = serviceResponse;
    console.error('Error in GET /api/regions:', error);

    return Response.json({ error }, { status: error.statusCode });
  } catch (error) {
    console.error('Unexpected error in GET /api/regions:', error);
    return handleCustomError(error);
  }
}

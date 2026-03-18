import 'server-only';

import { createClient } from '@/utils/supabase/server';
import { ServiceResult } from './type';
import { RegionListResponse } from '@/dto/event/shared-event.dto';
import { handleSingleRowPostgrestError, throwUnexpectedPostgrestError, validationFailure } from './serviceError';

export default class RegionService {
  public async getRegions(): Promise<ServiceResult<RegionListResponse>> {
    const supabase = await createClient();
    const { data: regions, error } = await supabase.from('regions').select('*');

    if (error) {
      throwUnexpectedPostgrestError(error, 'fetch regions');
    }

    return { success: true, data: regions };
  }

  public async getRegionById({
    regionId,
  }: {
    regionId: number;
  }): Promise<ServiceResult<RegionListResponse[number]['name']>> {
    if (!Number.isInteger(regionId) || regionId <= 0) {
      return validationFailure('Request validation failed', { regionId });
    }

    const supabase = await createClient();
    const { data: region, error } = await supabase.from('regions').select('name').eq('id', regionId).single();

    if (error) {
      return handleSingleRowPostgrestError(error, 'fetch region by id', 'Region not found');
    }

    return { success: true, data: region.name };
  }
}

export const regionService = new RegionService();

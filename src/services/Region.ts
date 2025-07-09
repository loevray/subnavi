import { createClient } from '@/utils/supabase/server';
import { DatabaseError, InternalError, isCustomError, NotFoundError } from '@/lib/errors/serviceErrors.server';
import { ServiceResult } from './type';
import { RegionListResponse } from '@/dto/event/shared-event.dto';
import { PostgrestError } from '@supabase/postgrest-js';

export default class RegionService {
  private handleDatabaseError(error: PostgrestError, operation: string): never {
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Region not found', error);
    }
    throw new DatabaseError(`Failed to ${operation}: ${error.message}`, error);
  }

  private handleServiceError(error: unknown) {
    if (isCustomError(error)) {
      return { success: false as const, ...error.toResponse() };
    }
    const internalError = new InternalError('unknown service error', error);
    return { success: false as const, ...internalError.toResponse() };
  }

  public async getRegions(): Promise<ServiceResult<RegionListResponse>> {
    try {
      const supabase = await createClient();
      const { data: regions, error } = await supabase.from('regions').select('*');

      if (error) this.handleDatabaseError(error, 'fetch regions');

      return { success: true, data: regions };
    } catch (e) {
      return this.handleServiceError(e);
    }
  }
  public async getRegionById({
    regionId,
  }: {
    regionId: number;
  }): Promise<ServiceResult<RegionListResponse[number]['name']>> {
    try {
      const supabase = await createClient();

      const { data: region, error } = await supabase.from('regions').select('name').eq('id', regionId).single();

      if (error) this.handleDatabaseError(error, 'fetch region by id');

      return { success: true, data: region.name };
    } catch (e) {
      return this.handleServiceError(e);
    }
  }
}

export const regionService = new RegionService();

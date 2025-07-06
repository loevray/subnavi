import { createClient } from '@/utils/supabase/server';
import { DatabaseError, InternalError, isCustomError, NotFoundError } from '@/lib/errors/serviceErrors.server';
import { ServiceResult } from './type';
import { EventCategoryListResponse } from '@/dto/event/shared-event.dto';
import { PostgrestError } from '@supabase/postgrest-js';

export default class CategoryService {
  private handleDatabaseError(error: PostgrestError, operation: string): never {
    if (error.code === 'PGRST116') {
      //Postgres has now row error
      throw new NotFoundError('Category not found', error);
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

  public async getCateogires(): Promise<ServiceResult<EventCategoryListResponse>> {
    try {
      const supabase = await createClient();

      const { data: categories, error } = await supabase.from('categories').select('*');

      if (error) this.handleDatabaseError(error, 'fetch cateogires');

      return { success: true, data: categories };
    } catch (e) {
      return this.handleServiceError(e);
    }
  }
  public async getCategoryById({
    categoryId,
  }: {
    categoryId: number;
  }): Promise<ServiceResult<EventCategoryListResponse[number]['name']>> {
    try {
      const supabase = await createClient();

      const { data: category, error } = await supabase.from('categories').select('name').eq('id', categoryId).single();

      if (error) this.handleDatabaseError(error, 'fetch category by id');

      return { success: true, data: category.name };
    } catch (e) {
      return this.handleServiceError(e);
    }
  }
}

export const categoryService = new CategoryService();

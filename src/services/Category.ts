import 'server-only';

import { createClient } from '@/utils/supabase/server';
import { ServiceResult } from './type';
import { EventCategoryListResponse } from '@/dto/event/shared-event.dto';
import { handleSingleRowPostgrestError, throwUnexpectedPostgrestError, validationFailure } from './serviceError';

export default class CategoryService {
  public async getCateogires(): Promise<ServiceResult<EventCategoryListResponse>> {
    const supabase = await createClient();
    const { data: categories, error } = await supabase.from('categories').select('*');

    if (error) {
      throwUnexpectedPostgrestError(error, 'fetch categories');
    }

    return { success: true, data: categories };
  }

  public async getCategoryById({
    categoryId,
  }: {
    categoryId: number;
  }): Promise<ServiceResult<EventCategoryListResponse[number]['name']>> {
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return validationFailure('Request validation failed', { categoryId });
    }

    const supabase = await createClient();
    const { data: category, error } = await supabase.from('categories').select('name').eq('id', categoryId).single();

    if (error) {
      return handleSingleRowPostgrestError(error, 'fetch category by id', 'Category not found');
    }

    return { success: true, data: category.name };
  }
}

export const categoryService = new CategoryService();

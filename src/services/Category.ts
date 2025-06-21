import { createClient } from '@/utils/supabase/server';
import { DatabaseError } from '@/lib/errors/serviceErrors.server';

export default class CategoryService {
  public async getCateogires() {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      throw new DatabaseError(
        `Faield to fetch categories: ${error.message}`,
        error
      );
    }

    return categories;
  }
  public async getCategoryById({ categoryId }: { categoryId: number }) {
    const supabase = await createClient();

    const { data: category, error } = await supabase
      .from('categories')
      .select('name')
      .eq('id', categoryId)
      .single();

    if (error) {
      throw new DatabaseError(
        `Faield to fetch categories: ${error.message}`,
        error
      );
    }

    return category;
  }
}

export const categoryService = new CategoryService();

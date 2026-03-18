import { createServerClient } from '@supabase/ssr';
import { Database } from '../../../database.types';
import { getSupabaseEnv } from './env';

export const createAdminClient = () => {
  const { url, serviceRoleKey } = getSupabaseEnv();

  return createServerClient<Database>(url, serviceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
};

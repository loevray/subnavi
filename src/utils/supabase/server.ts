import { createServerClient /* type CookieOptions */ } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '../../../database.types';

export const createClient = async (
  useServiceRole = process.env.NODE_ENV === 'development'
) => {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY!
    : process.env.SUPABASE_ANON_KEY!;

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component에서 호출된 경우 무시
        }
      },
    },
  });
};

const getRequiredEnv = (name: 'SUPABASE_URL' | 'SUPABASE_ANON_KEY' | 'SUPABASE_SERVICE_ROLE_KEY') => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required Supabase environment variable: ${name}`);
  }

  return value;
};

export const getSupabaseEnv = () => ({
  url: getRequiredEnv('SUPABASE_URL'),
  anonKey: getRequiredEnv('SUPABASE_ANON_KEY'),
  serviceRoleKey: getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
});

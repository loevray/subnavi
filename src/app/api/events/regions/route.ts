import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: regions, error } = await supabase.from('regions').select('*');

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(regions);
  } catch (err) {
    console.log('Failed to fetch categories', err);
    return Response.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

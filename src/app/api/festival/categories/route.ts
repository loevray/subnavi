import { createClient } from '@/utils/supabase/server';

export async function GET() {
  //행사 카테고리를 enum으로 두는것이 좋을것 같다.
  // 분류가 많아봐야 20~30개 내외. 타입안정성, 검증도 강화됨.
  try {
    const supabase = await createClient();
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(categories);
  } catch (err) {
    console.log('Failed to fetch categories', err);
    return Response.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

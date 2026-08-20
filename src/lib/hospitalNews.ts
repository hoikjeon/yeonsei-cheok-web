import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const getHospitalNewsItem = cache(async (id: string, typeFilter: string) => {
  let query = supabase.from('hospital_news').select('*').eq('id', id);

  if (typeFilter) {
    query = query.in('type', typeFilter.split(','));
  }

  const { data: item, error } = await query.single();

  return { item, error };
});

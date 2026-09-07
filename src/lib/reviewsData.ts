import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import type { HomeReview } from '@/lib/adminReviews';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export const REVIEWS_CACHE_TAG = 'treatment-reviews';

const getCachedLatestReviews = unstable_cache(
  async (limit: number): Promise<HomeReview[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('id,title,created_at')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to load latest reviews:', error.message);
      return [];
    }
    return (data || []) as HomeReview[];
  },
  ['latest-treatment-reviews'],
  { tags: [REVIEWS_CACHE_TAG], revalidate: 60 },
);

export function getLatestReviews(limit = 12) {
  return getCachedLatestReviews(Math.min(20, Math.max(1, limit)));
}

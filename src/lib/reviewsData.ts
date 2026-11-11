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
      .select('id,category,title,created_at,image_urls')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to load latest reviews:', error.message);
      return [];
    }
    // 카드에는 첫 장만 쓰므로 나머지 주소는 HTML 에 싣지 않습니다.
    return (data || []).map(({ image_urls, ...review }) => ({
      ...review,
      image_url: Array.isArray(image_urls) && typeof image_urls[0] === 'string' ? image_urls[0] : null,
    })) as HomeReview[];
  },
  ['latest-treatment-reviews-v2'],
  { tags: [REVIEWS_CACHE_TAG], revalidate: 60 },
);

export function getLatestReviews(limit = 12) {
  return getCachedLatestReviews(Math.min(20, Math.max(1, limit)));
}

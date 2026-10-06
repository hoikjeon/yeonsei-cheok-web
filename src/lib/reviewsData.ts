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
      .select('id,category,title,created_at')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit)
      .abortSignal(AbortSignal.timeout(10_000));

    if (error) {
      // 조회 실패를 빈 목록으로 캐시하면 기존 후기가 없는 것처럼 보입니다.
      throw new Error('Failed to load latest reviews', { cause: error });
    }
    return (data || []) as HomeReview[];
  },
  ['latest-treatment-reviews'],
  { tags: [REVIEWS_CACHE_TAG], revalidate: 60 },
);

export async function getLatestReviews(limit = 12): Promise<HomeReview[] | null> {
  try {
    return await getCachedLatestReviews(Math.min(20, Math.max(1, limit)));
  } catch {
    console.error('Failed to load latest reviews: review service unavailable');
    return null;
  }
}

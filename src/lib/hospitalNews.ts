import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const HOSPITAL_NEWS_CACHE_TAG = 'hospital-news';

const HOSPITAL_NEWS_CACHE_SECONDS = 60;

export type HospitalNewsType = 'academic' | 'media' | 'training' | 'youtube';

export interface HospitalNewsListItem {
  id: string;
  type: string;
  title: string;
  image_urls: string[] | null;
  source_name: string | null;
  video_url: string | null;
  created_at: string;
}

export interface HospitalNewsItem extends HospitalNewsListItem {
  content: string;
  source_url: string | null;
}

export const getHospitalNewsList = unstable_cache(
  async (type: HospitalNewsType, page: number, pageSize: number) => {
    const from = (page - 1) * pageSize;
    const { data, count, error } = await supabase
      .from('hospital_news')
      .select('id, type, title, image_urls, source_name, video_url, created_at', {
        count: 'exact',
      })
      .eq('type', type)
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error(`Error fetching ${type} news:`, error);
      return { news: [] as HospitalNewsListItem[], count: 0 };
    }

    return {
      news: (data ?? []) as HospitalNewsListItem[],
      count: count ?? 0,
    };
  },
  ['hospital-news-list'],
  {
    tags: [HOSPITAL_NEWS_CACHE_TAG],
    revalidate: HOSPITAL_NEWS_CACHE_SECONDS,
  },
);

const getCachedHospitalNewsItem = unstable_cache(
  async (id: string, typeFilter: string) => {
    let query = supabase.from('hospital_news').select('*').eq('id', id);

    if (typeFilter) {
      query = query.in('type', typeFilter.split(','));
    }

    const { data: item, error } = await query.single();

    return { item: item as HospitalNewsItem | null, error };
  },
  ['hospital-news-item'],
  {
    tags: [HOSPITAL_NEWS_CACHE_TAG],
    revalidate: HOSPITAL_NEWS_CACHE_SECONDS,
  },
);

// generateMetadata와 상세 페이지 본문이 같은 글을 요청할 때는 한 번만 조회합니다.
export const getHospitalNewsItem = cache(getCachedHospitalNewsItem);

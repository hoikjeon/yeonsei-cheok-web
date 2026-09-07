import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/adminAuth';
import type { ReviewCategory, ReviewRecord } from '@/lib/adminReviews';
import { newsInlineImages, newsPlainText } from '@/lib/newsContent';

export function reviewAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getAdminReview(id: string) {
  await requireAdmin();
  const { data, error } = await reviewAdminClient().from('reviews').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error('치료체험후기를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  return data as ReviewRecord | null;
}

export async function listAdminReviews({ category, keyword, page, oldest }: {
  category?: ReviewCategory; keyword: string; page: number; oldest: boolean;
}) {
  await requireAdmin();
  const client = reviewAdminClient();
  const makeQuery = () => {
    let query = client.from('reviews').select('*', { count: 'exact' });
    if (category) query = query.eq('category', category);
    return query.order('created_at', { ascending: oldest }).order('id', { ascending: oldest });
  };
  const pageSize = 20;
  if (!keyword) {
    let countQuery = client.from('reviews').select('id', { count: 'exact', head: true });
    if (category) countQuery = countQuery.eq('category', category);
    const { count, error } = await countQuery;
    if (error) throw new Error('치료체험후기 목록을 불러오지 못했습니다.');
    const total = count || 0;
    const currentPage = Math.min(page, Math.max(1, Math.ceil(total / pageSize)));
    const result = await makeQuery().range((currentPage - 1) * pageSize, currentPage * pageSize - 1);
    if (result.error) throw new Error('치료체험후기 목록을 불러오지 못했습니다.');
    return { items: (result.data || []) as ReviewRecord[], total, currentPage, pageSize };
  }

  const matched: ReviewRecord[] = [];
  const queryText = keyword.toLocaleLowerCase('ko-KR');
  for (let offset = 0; ; offset += 200) {
    const { data, error } = await makeQuery().range(offset, offset + 199);
    if (error) throw new Error('치료체험후기 검색에 실패했습니다.');
    const rows = (data || []) as ReviewRecord[];
    matched.push(...rows.filter((item) => `${item.category}\n${item.title}\n${newsPlainText(item.content)}`.toLocaleLowerCase('ko-KR').includes(queryText)));
    if (rows.length < 200) break;
  }
  const currentPage = Math.min(page, Math.max(1, Math.ceil(matched.length / pageSize)));
  return { items: matched.slice((currentPage - 1) * pageSize, currentPage * pageSize), total: matched.length, currentPage, pageSize };
}

export function managedReviewImagePath(url: string): string | null {
  try {
    const parsed = new URL(url);
    const base = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    const prefix = '/storage/v1/object/public/reviews/';
    if (parsed.origin !== base.origin || !parsed.pathname.startsWith(prefix) || parsed.search || parsed.hash) return null;
    const path = decodeURIComponent(parsed.pathname.slice(prefix.length));
    const uuid = '[0-9a-fA-F-]{36}';
    const allowed = new RegExp(`^(?:admin-reviews/${uuid}|reviews/${uuid})/[a-zA-Z0-9.-]+\\.(?:jpg|png|webp|gif)$`);
    return allowed.test(path) && !path.includes('..') ? path : null;
  } catch { return null; }
}

/** 후기에서 더 이상 참조하지 않는, 이 기능이 관리하는 이미지만 제거합니다. */
export async function removeUnusedReviewImages(urls: string[]): Promise<boolean> {
  const candidates = new Map(urls.map((url) => [url, managedReviewImagePath(url)]).filter((entry): entry is [string, string] => Boolean(entry[1])));
  if (!candidates.size) return true;
  const client = reviewAdminClient();
  for (let offset = 0; ; offset += 200) {
    const { data, error } = await client.from('reviews').select('content,image_urls').order('id').range(offset, offset + 199);
    if (error) { console.error('Review image reference check failed:', error.message); return false; }
    for (const row of data || []) {
      for (const url of [...(row.image_urls || []), ...newsInlineImages(row.content || '')]) candidates.delete(url);
    }
    if ((data || []).length < 200) break;
  }
  if (!candidates.size) return true;
  const { error } = await client.storage.from('reviews').remove([...new Set(candidates.values())]);
  if (error) console.error('Review image cleanup failed:', error.message);
  return !error;
}

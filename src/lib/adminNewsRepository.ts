import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/adminAuth';
import { storedNewsTypes, type AdminNewsRecord, type AdminNewsType } from '@/lib/adminNews';
import { newsInlineImages, newsPlainText } from '@/lib/newsContent';

export function newsAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getAdminNewsItem(id: string, type: AdminNewsType) {
  await requireAdmin();
  const { data, error } = await newsAdminClient().from('hospital_news').select('*').eq('id', id).in('type', storedNewsTypes(type)).maybeSingle();
  if (error) throw new Error('게시물을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  return data as AdminNewsRecord | null;
}

export async function listAdminNews({ type, keyword, page, oldest }: {
  type?: AdminNewsType; keyword: string; page: number; oldest: boolean;
}) {
  await requireAdmin();
  const client = newsAdminClient();
  const makeQuery = () => client.from('hospital_news').select('*', { count: 'exact' })
    .in('type', storedNewsTypes(type)).order('created_at', { ascending: oldest }).order('id', { ascending: oldest });
  const pageSize = 20;
  if (!keyword) {
    const { count, error } = await client.from('hospital_news').select('id', { count: 'exact', head: true }).in('type', storedNewsTypes(type));
    if (error) throw new Error('게시물 목록을 불러오지 못했습니다.');
    const total = count || 0;
    const currentPage = Math.min(page, Math.max(1, Math.ceil(total / pageSize)));
    const result = await makeQuery().range((currentPage - 1) * pageSize, currentPage * pageSize - 1);
    if (result.error) throw new Error('게시물 목록을 불러오지 못했습니다.');
    return { items: (result.data || []) as AdminNewsRecord[], total, currentPage, pageSize };
  }
  // Search rendered text, including words split across formatting marks, rather than JSON keys/styles.
  const matched: AdminNewsRecord[] = [];
  const query = keyword.toLocaleLowerCase('ko-KR');
  for (let offset = 0; ; offset += 200) {
    const { data, error } = await makeQuery().range(offset, offset + 199);
    if (error) throw new Error('게시물 검색에 실패했습니다.');
    const rows = (data || []) as AdminNewsRecord[];
    matched.push(...rows.filter((item) => `${item.title}\n${newsPlainText(item.content)}`.toLocaleLowerCase('ko-KR').includes(query)));
    if (rows.length < 200) break;
  }
  const currentPage = Math.min(page, Math.max(1, Math.ceil(matched.length / pageSize)));
  return { items: matched.slice((currentPage - 1) * pageSize, currentPage * pageSize), total: matched.length, currentPage, pageSize };
}

export function managedNewsImagePath(url: string): string | null {
  try {
    const parsed = new URL(url);
    const base = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    const prefix = '/storage/v1/object/public/reviews/';
    if (parsed.origin !== base.origin || !parsed.pathname.startsWith(prefix) || parsed.search || parsed.hash) return null;
    const path = decodeURIComponent(parsed.pathname.slice(prefix.length));
    return /^news\/(notice|media|training|academic|youtube)\/[a-zA-Z0-9/.-]+\.(jpg|png|webp|gif)$/.test(path) && !path.includes('..') ? path : null;
  } catch { return null; }
}

/** Only remove our news files, after checking every remaining post for shared references. */
export async function removeUnusedNewsImages(urls: string[]): Promise<boolean> {
  const candidates = new Map(urls.map((url) => [url, managedNewsImagePath(url)]).filter((entry): entry is [string, string] => Boolean(entry[1])));
  if (!candidates.size) return true;
  const client = newsAdminClient();
  for (let offset = 0; ; offset += 200) {
    const { data, error } = await client.from('hospital_news').select('id,content,image_urls').order('id').range(offset, offset + 199);
    if (error) { console.error('News image reference check failed:', error.message); return false; }
    for (const row of data || []) {
      for (const url of [...(row.image_urls || []), ...newsInlineImages(row.content || '')]) candidates.delete(url);
    }
    if ((data || []).length < 200) break;
  }
  if (!candidates.size) return true;
  const { error } = await client.storage.from('reviews').remove([...new Set(candidates.values())]);
  if (error) console.error('News image cleanup failed:', error.message);
  return !error;
}

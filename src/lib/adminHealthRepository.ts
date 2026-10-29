import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/adminAuth';
import { HEALTH_SLUG_PATTERN, rowToHealthArticle, type HealthArticleRow } from '@/lib/healthArticleRecord';

export function healthAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function listAdminHealthArticles() {
  await requireAdmin();
  const { data, error } = await healthAdminClient()
    .from('health_articles')
    .select('*')
    .order('published_at', { ascending: false })
    .order('slug');
  if (error) {
    console.error('Admin health articles failed:', error.message);
    throw new Error(error.code === '42P01' || error.code === 'PGRST205'
      ? '건강정보 테이블이 아직 없습니다. Supabase SQL Editor에서 setup_health_articles.sql을 먼저 실행해주세요.'
      : '건강정보 글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
  return (data as HealthArticleRow[]).map(rowToHealthArticle);
}

export async function getAdminHealthArticle(slug: string) {
  await requireAdmin();
  if (!HEALTH_SLUG_PATTERN.test(slug)) return null;
  const { data, error } = await healthAdminClient().from('health_articles').select('*').eq('slug', slug).maybeSingle();
  if (error) throw new Error('글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  return data ? rowToHealthArticle(data as HealthArticleRow) : null;
}

/** 관리자에서 올린 건강정보 썸네일만 골라 Storage 경로로 바꿉니다. 사이트 이미지(/...)는 null 입니다. */
export function managedHealthImagePath(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const base = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    const prefix = '/storage/v1/object/public/reviews/';
    if (parsed.origin !== base.origin || !parsed.pathname.startsWith(prefix) || parsed.search || parsed.hash) return null;
    const path = decodeURIComponent(parsed.pathname.slice(prefix.length));
    return /^health\/[a-f0-9-]+\.(jpg|png|webp|gif)$/.test(path) ? path : null;
  } catch {
    return null;
  }
}

/** 다른 글이 같은 이미지를 쓰고 있지 않은지 확인한 뒤 지웁니다. */
export async function removeUnusedHealthImages(urls: Array<string | undefined>): Promise<boolean> {
  const candidates = new Map(urls.map((url) => [url, managedHealthImagePath(url)] as const).filter((entry): entry is [string, string] => Boolean(entry[1])));
  if (!candidates.size) return true;
  const client = healthAdminClient();
  // 글 수가 많지 않아 본문(content) 전체에서 주소를 찾아봅니다.
  const { data, error } = await client.from('health_articles').select('content');
  if (error) {
    console.error('Health image reference check failed:', error.message);
    return false;
  }
  for (const row of data ?? []) {
    const text = JSON.stringify(row.content ?? {});
    for (const url of [...candidates.keys()]) if (text.includes(url)) candidates.delete(url);
  }
  if (!candidates.size) return true;
  const { error: removeError } = await client.storage.from('reviews').remove([...candidates.values()]);
  if (removeError) console.error('Health image cleanup failed:', removeError.message);
  return !removeError;
}

export type HealthTopic = {
  id: string;
  topic: string;
  category: 'spine' | 'joint' | null;
  note: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  article_slug: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
};

export async function listHealthTopics() {
  await requireAdmin();
  const { data, error } = await healthAdminClient().from('health_topics').select('*').order('created_at', { ascending: true }).limit(500);
  if (error) {
    console.error('Health topics failed:', error.message);
    throw new Error(error.code === '42P01' || error.code === 'PGRST205'
      ? '주제 대기열 테이블이 아직 없습니다. Supabase SQL Editor에서 update_health_articles_scheduling.sql을 먼저 실행해주세요.'
      : '주제 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
  return (data ?? []) as HealthTopic[];
}

/** 대기 중인 주제 수. 테이블이 아직 없으면 0 으로 봅니다. */
export async function countQueuedHealthTopics() {
  await requireAdmin();
  const { count, error } = await healthAdminClient().from('health_topics').select('id', { count: 'exact', head: true }).eq('status', 'queued');
  return error ? 0 : count ?? 0;
}

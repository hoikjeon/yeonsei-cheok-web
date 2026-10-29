'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { healthAdminClient, managedHealthImagePath, removeUnusedHealthImages } from '@/lib/adminHealthRepository';
import { healthArticlePath } from '@/lib/healthArticles';
import {
  HEALTH_SLUG_PATTERN,
  healthArticleImages,
  healthArticleToRow,
  parseHealthArticleInput,
  resolveHealthPublish,
  rowToHealthArticle,
  type HealthArticleRow,
} from '@/lib/healthArticleRecord';
import { HEALTH_ARTICLES_CACHE_TAG } from '@/lib/healthArticleStore';
import { ALLOWED_IMAGE_TYPES, MAX_NEWS_IMAGE_SIZE } from '@/lib/imageUploadRules';

export type AdminHealthResult = { success: true; slug: string; warning?: string } | { success: false; error: string };

const CONFLICT_MESSAGE = '다른 화면에서 글이 먼저 수정되었습니다. 작성 중인 내용을 따로 복사해 두고 새로고침해주세요.';
const CLEANUP_WARNING = '글은 저장되었습니다. 이전 이미지 파일 정리는 완료하지 못했습니다.';

function invalidateHealth(slug: string) {
  updateTag(HEALTH_ARTICLES_CACHE_TAG);
  revalidatePath('/admin/health', 'layout');
  revalidatePath('/health');
  revalidatePath(healthArticlePath(slug));
  revalidatePath('/sitemap.xml');
  revalidatePath('/llms.txt');
}

export async function saveAdminHealthArticle(payload: string, editingSlug: string | null, originalUpdatedAt: string | null): Promise<AdminHealthResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  try {
    if (payload.length > 300_000) throw new Error('글이 너무 깁니다. 내용을 나눠서 작성해주세요.');
    const input = JSON.parse(payload) as { article?: unknown; publishMode?: unknown; publishAt?: unknown };
    const article = parseHealthArticleInput(input.article);
    if (editingSlug !== null && editingSlug !== article.slug) throw new Error('글 주소는 처음 등록한 뒤에는 바꿀 수 없습니다.');

    const client = healthAdminClient();
    const { data: previousRow, error: lookupError } = await client.from('health_articles').select('*').eq('slug', article.slug).maybeSingle();
    if (lookupError) throw new Error('글 정보를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.');
    const previous = previousRow ? rowToHealthArticle(previousRow as HealthArticleRow) : null;
    if (editingSlug === null && previous) throw new Error('같은 주소의 글이 이미 있습니다. 주소를 다르게 입력해주세요.');
    if (editingSlug !== null && !previous) throw new Error('수정할 글이 없습니다. 목록에서 다시 확인해주세요.');
    if (previous && previous.updatedAt !== originalUpdatedAt) throw new Error(CONFLICT_MESSAGE);
    const publish = resolveHealthPublish(input.publishMode, input.publishAt, previous);

    // 이미지는 사이트 이미지(/...), 원래 글에 있던 이미지, 이 화면에서 올린 Storage 파일만 받습니다.
    const previousImages = new Set(previous ? healthArticleImages(previous) : []);
    for (const src of healthArticleImages(article)) {
      if (src.startsWith('/') || previousImages.has(src)) continue;
      const path = managedHealthImagePath(src);
      if (!path) throw new Error('이미지를 다시 올려주세요. 이 화면에서 올린 이미지만 쓸 수 있습니다.');
      const { data: info, error: infoError } = await client.storage.from('reviews').info(path);
      if (infoError || !info) throw new Error('이미지 업로드가 끝나지 않았습니다. 이미지를 다시 올려주세요.');
      if (!Object.hasOwn(ALLOWED_IMAGE_TYPES, info.contentType || '') || typeof info.size !== 'number' || info.size <= 0 || info.size > MAX_NEWS_IMAGE_SIZE) {
        throw new Error('이미지 형식 또는 크기를 확인해주세요.');
      }
    }

    if (article.relatedSlugs.length) {
      const { data: related, error: relatedError } = await client.from('health_articles').select('slug').in('slug', article.relatedSlugs);
      if (relatedError) throw new Error('함께 읽을 글을 확인하지 못했습니다. 잠시 후 다시 시도해주세요.');
      const existing = new Set((related ?? []).map((row) => row.slug as string));
      article.relatedSlugs = article.relatedSlugs.filter((slug) => existing.has(slug));
    }

    const row = healthArticleToRow(article, publish);
    const result = previous
      ? await client
          .from('health_articles')
          .update({ ...row, updated_at: new Date().toISOString() })
          .eq('slug', article.slug)
          .eq('updated_at', previous.updatedAt)
          .select('slug')
          .maybeSingle()
      : await client.from('health_articles').insert({ ...row, source: 'manual' }).select('slug').single();
    if (result.error || !result.data) {
      if (result.error?.code === '23505') throw new Error('같은 주소의 글이 이미 있습니다. 주소를 다르게 입력해주세요.');
      if (previous && !result.error) throw new Error(CONFLICT_MESSAGE);
      console.error('Health article save failed:', result.error?.message);
      throw new Error('글을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.');
    }

    invalidateHealth(article.slug);
    const nextImages = new Set(healthArticleImages(article));
    let clean = true;
    try { clean = await removeUnusedHealthImages([...previousImages].filter((src) => !nextImages.has(src))); } catch (err) { clean = false; console.error('Health image cleanup failed:', err); }
    return { success: true, slug: article.slug, ...(!clean ? { warning: CLEANUP_WARNING } : {}) };
  } catch (error) {
    return { success: false, error: error instanceof SyntaxError ? '보낸 내용을 읽지 못했습니다. 새로고침 후 다시 시도해주세요.' : error instanceof Error ? error.message : '글 저장 중 오류가 발생했습니다.' };
  }
}

/** 목록에서 바로 "지금 발행" 또는 "예약 취소(임시저장으로)"를 합니다. */
export async function changeAdminHealthPublish(slug: string, mode: 'now' | 'draft'): Promise<AdminHealthResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  if (!HEALTH_SLUG_PATTERN.test(slug) || !['now', 'draft'].includes(mode)) return { success: false, error: '글 정보가 올바르지 않습니다.' };
  try {
    const client = healthAdminClient();
    const { data, error } = await client.from('health_articles').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) throw new Error('글을 찾지 못했습니다. 목록을 새로고침해주세요.');
    const previous = rowToHealthArticle(data as HealthArticleRow);
    const publish = resolveHealthPublish(mode, null, previous);
    const { error: updateError } = await client
      .from('health_articles')
      .update({ is_published: publish.isPublished, publish_at: publish.publishAt, published_at: healthArticleToRow(previous, publish).published_at, updated_at: new Date().toISOString() })
      .eq('slug', slug);
    if (updateError) throw new Error('상태를 바꾸지 못했습니다. 다시 시도해주세요.');
    invalidateHealth(slug);
    return { success: true, slug };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : '상태 변경 중 오류가 발생했습니다.' };
  }
}

export async function deleteAdminHealthArticle(slug: string): Promise<AdminHealthResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  if (!HEALTH_SLUG_PATTERN.test(slug)) return { success: false, error: '글 정보가 올바르지 않습니다.' };
  try {
    const { data, error } = await healthAdminClient().from('health_articles').delete().eq('slug', slug).select('*').maybeSingle();
    if (error) throw new Error('글을 삭제하지 못했습니다. 다시 시도해주세요.');
    if (!data) throw new Error('이미 삭제되었거나 없는 글입니다. 목록을 새로고침해주세요.');
    invalidateHealth(slug);
    let clean = true;
    try { clean = await removeUnusedHealthImages(healthArticleImages(rowToHealthArticle(data as HealthArticleRow))); } catch (err) { clean = false; console.error('Deleted health image cleanup failed:', err); }
    return { success: true, slug, ...(!clean ? { warning: '글은 삭제되었습니다. 이미지 파일 정리는 완료하지 못했습니다.' } : {}) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : '글 삭제 중 오류가 발생했습니다.' };
  }
}

/** 저장하지 않고 바꾼 이미지 파일을 정리합니다. 저장된 글이 쓰는 파일은 남깁니다. */
export async function discardAdminHealthUpload(url: string) {
  if (!(await isAdminAuthenticated()) || typeof url !== 'string' || !managedHealthImagePath(url)) return { success: false };
  try { return { success: await removeUnusedHealthImages([url]) }; }
  catch { return { success: false }; }
}

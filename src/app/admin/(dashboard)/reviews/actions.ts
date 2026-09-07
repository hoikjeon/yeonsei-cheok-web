'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath, updateTag } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { isReviewCategory, validReviewId, type ReviewRecord } from '@/lib/adminReviews';
import { managedReviewImagePath, removeUnusedReviewImages, reviewAdminClient } from '@/lib/adminReviewsRepository';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_COUNT, MAX_IMAGE_SIZE } from '@/lib/imageUploadRules';
import { REVIEWS_CACHE_TAG } from '@/lib/reviewsData';
import { MAX_NEWS_DOCUMENT_LENGTH, NEWS_CONTENT_PREFIX, documentText, newsDocumentForEditor, newsInlineImages, normalizeNewsDocument, safeNewsImage, serializeNewsDocument } from '@/lib/newsContent';

export type AdminReviewResult = { success: true; id: string; warning?: string } | { success: false; error: string };

const getString = (data: FormData, key: string) => typeof data.get(key) === 'string' ? String(data.get(key)).trim() : '';

function imageArray(value: string): string[] {
  const data: unknown = JSON.parse(value || '[]');
  if (!Array.isArray(data) || data.length > 100 || data.some((entry) => typeof entry !== 'string' || !safeNewsImage(entry))) throw new Error('첨부 이미지 목록이 올바르지 않습니다.');
  return [...new Set(data as string[])];
}

function invalidateReviews(id?: string) {
  updateTag(REVIEWS_CACHE_TAG);
  revalidatePath('/admin/reviews', 'layout');
  revalidatePath('/board/reviews');
  if (id) revalidatePath(`/board/reviews/${id}`);
  revalidatePath('/');
}

async function saveReview(formData: FormData, editing: boolean): Promise<AdminReviewResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  const id = getString(formData, 'id');
  const category = getString(formData, 'category');
  if (!validReviewId(id) || !isReviewCategory(category)) return { success: false, error: '후기 정보가 올바르지 않습니다.' };

  try {
    const client = reviewAdminClient();
    const { data, error } = await client.from('reviews').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error('후기 정보를 확인하지 못했습니다.');
    const previous = data as ReviewRecord | null;
    if (editing && !previous) throw new Error('수정할 후기가 없거나 이미 삭제되었습니다.');
    if (!editing && previous) throw new Error('이미 등록된 후기입니다. 목록에서 확인해주세요.');
    if (editing && getString(formData, 'original') !== JSON.stringify(previous)) throw new Error('다른 화면에서 후기가 변경되었습니다. 작성 내용을 임시보관한 뒤 새로고침해주세요.');

    const title = getString(formData, 'title');
    if (title.length < 2 || title.length > 100) throw new Error('제목은 2자 이상 100자 이하로 입력해주세요.');
    const rawContent = getString(formData, 'content');
    if (rawContent.length > MAX_NEWS_DOCUMENT_LENGTH) throw new Error('본문 서식이 너무 큽니다. 서식을 정리해주세요.');
    const images = imageArray(getString(formData, 'image_urls'));
    const staged = imageArray(getString(formData, 'uploaded_urls')).filter((url) => managedReviewImagePath(url)?.startsWith(`admin-reviews/${id}/`));
    if (images.length > MAX_IMAGE_COUNT) throw new Error(`본문과 첨부 이미지는 합쳐서 최대 ${MAX_IMAGE_COUNT}개입니다.`);

    const existingImages = new Set([...(previous?.image_urls || []), ...newsInlineImages(previous?.content || '')]);
    for (const url of images) {
      if (existingImages.has(url)) continue;
      const path = managedReviewImagePath(url);
      if (!path?.startsWith(`admin-reviews/${id}/`)) throw new Error('이 후기에 업로드한 이미지만 사용할 수 있습니다. 이미지를 다시 첨부해주세요.');
      const { data: info, error: infoError } = await client.storage.from('reviews').info(path);
      if (infoError || !info) throw new Error('이미지 업로드가 완료되지 않았습니다. 다시 첨부해주세요.');
      if (!Object.hasOwn(ALLOWED_IMAGE_TYPES, info.contentType || '') || typeof info.size !== 'number' || info.size <= 0 || info.size > MAX_IMAGE_SIZE) throw new Error('이미지 형식 또는 크기를 확인해주세요. 파일당 최대 10MB입니다.');
    }

    const document = normalizeNewsDocument(rawContent.startsWith(NEWS_CONTENT_PREFIX)
      ? JSON.parse(rawContent.slice(NEWS_CONTENT_PREFIX.length)) : newsDocumentForEditor(rawContent), new Set(images));
    document.attrs = { ...document.attrs, saveId: randomUUID() };
    const text = documentText(document).trim();
    if (text.length < 10 || text.length > 5_000) throw new Error('내용은 10자 이상 5,000자 이하로 입력해주세요.');
    const content = serializeNewsDocument(document);
    const payload = { category, title, content, image_urls: images };
    const result = editing
      ? await client.from('reviews').update(payload).eq('id', id).eq('content', previous!.content).select('id').maybeSingle()
      : await client.from('reviews').insert({ id, ...payload }).select('id').single();
    if (result.error || !result.data) {
      if (editing && !result.error && !result.data) throw new Error('다른 화면에서 후기가 변경되었습니다. 작성 내용을 임시보관한 뒤 새로고침해주세요.');
      console.error('Review save failed:', result.error?.message);
      throw new Error('후기를 저장하지 못했습니다. 새로고침 후 다시 시도해주세요. 작성 내용은 임시보관됩니다.');
    }

    invalidateReviews(id);
    const unused = [...existingImages, ...staged].filter((url) => !images.includes(url));
    let clean = false;
    try { clean = await removeUnusedReviewImages(unused); } catch (cleanupError) { console.error('Review image cleanup failed:', cleanupError); }
    return { success: true, id, ...(!clean ? { warning: '후기는 저장되었습니다. 일부 이전 이미지 파일 정리는 완료하지 못했습니다.' } : {}) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : '후기 저장 중 오류가 발생했습니다.' };
  }
}

export async function createAdminReview(formData: FormData) { return saveReview(formData, false); }
export async function updateAdminReview(formData: FormData) { return saveReview(formData, true); }

export async function deleteAdminReview(id: string): Promise<AdminReviewResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  if (!validReviewId(id)) return { success: false, error: '후기 정보가 올바르지 않습니다.' };
  try {
    const { data, error } = await reviewAdminClient().from('reviews').delete().eq('id', id).select('id,content,image_urls').maybeSingle();
    if (error) throw new Error('후기를 삭제하지 못했습니다. 다시 시도해주세요.');
    if (!data) throw new Error('이미 삭제되었거나 존재하지 않는 후기입니다. 목록을 새로고침해주세요.');
    invalidateReviews(id);
    let clean = false;
    try { clean = await removeUnusedReviewImages([...(data.image_urls || []), ...newsInlineImages(data.content || '')]); }
    catch (cleanupError) { console.error('Review delete cleanup failed:', cleanupError); }
    return { success: true, id, ...(!clean ? { warning: '후기는 삭제되었지만 일부 이미지 파일 정리는 완료하지 못했습니다.' } : {}) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : '후기 삭제 중 오류가 발생했습니다.' };
  }
}

export async function discardAdminReviewUploads(id: string, urls: string[]): Promise<AdminReviewResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  if (!validReviewId(id) || !Array.isArray(urls) || urls.length > MAX_IMAGE_COUNT || urls.some((url) => !managedReviewImagePath(url)?.startsWith(`admin-reviews/${id}/`))) return { success: false, error: '정리할 이미지 정보가 올바르지 않습니다.' };
  try {
    const clean = await removeUnusedReviewImages(urls);
    return clean ? { success: true, id } : { success: false, error: '일부 이미지 파일을 정리하지 못했습니다.' };
  } catch {
    return { success: false, error: '이미지 파일을 정리하지 못했습니다.' };
  }
}

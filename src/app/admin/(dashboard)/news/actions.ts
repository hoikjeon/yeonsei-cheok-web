'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath, updateTag } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { isAdminNewsType, storedNewsTypes, validNewsId, type AdminNewsRecord, type AdminNewsType } from '@/lib/adminNews';
import { newsAdminClient, managedNewsImagePath, removeUnusedNewsImages } from '@/lib/adminNewsRepository';
import { HOSPITAL_NEWS_CACHE_TAG } from '@/lib/hospitalNews';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_COUNT, newsImageMaxSize } from '@/lib/imageUploadRules';
import { MAX_NEWS_DOCUMENT_LENGTH, MAX_NEWS_TEXT_LENGTH, NEWS_CONTENT_PREFIX, documentImages, documentText, normalizeNewsDocument, newsDocumentForEditor, newsInlineImages, safeNewsImage, serializeNewsDocument, youtubeVideoId } from '@/lib/newsContent';

export type AdminNewsResult = { success: true; id: string; warning?: string } | { success: false; error: string };
const getString = (data: FormData, key: string) => typeof data.get(key) === 'string' ? String(data.get(key)).trim() : '';

function urlValue(value: string, label: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error();
    return url.toString();
  } catch { throw new Error(`${label}는 http:// 또는 https://로 시작하는 주소를 입력해주세요.`); }
}

function imageArray(value: string): string[] {
  const data: unknown = JSON.parse(value || '[]');
  if (!Array.isArray(data) || data.length > 100 || data.some((v) => typeof v !== 'string' || !safeNewsImage(v))) throw new Error('첨부 이미지 목록이 올바르지 않습니다.');
  return [...new Set(data as string[])];
}

function invalidateNews(type: AdminNewsType, id: string) {
  updateTag(HOSPITAL_NEWS_CACHE_TAG);
  revalidatePath('/admin/news', 'layout');
  revalidatePath(`/news/${type}`);
  revalidatePath(`/news/${type}/${id}`);
  revalidatePath('/');
  revalidatePath('/sitemap.xml');
}

async function saveNews(formData: FormData, editing: boolean): Promise<AdminNewsResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  const type = getString(formData, 'type');
  const id = getString(formData, 'id');
  if (!isAdminNewsType(type) || !validNewsId(id)) return { success: false, error: '게시물 정보가 올바르지 않습니다.' };
  try {
    const client = newsAdminClient();
    const { data, error } = await client.from('hospital_news').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error('게시물 정보를 확인하지 못했습니다.');
    const previous = data as AdminNewsRecord | null;
    if (editing && (!previous || !storedNewsTypes(type).includes(previous.type))) throw new Error('수정할 게시물이 없거나 게시판이 다릅니다.');
    if (!editing && previous) throw new Error('이미 등록된 게시물입니다. 목록에서 확인해주세요.');
    if (editing && getString(formData, 'original') !== JSON.stringify(previous)) throw new Error('다른 화면에서 글이 변경되었습니다. 작성 내용을 임시보관한 뒤 새로고침해주세요.');
    const title = getString(formData, 'title');
    if (!title || title.length > 150) throw new Error('제목은 1자 이상 150자 이하로 입력해주세요.');
    const rawContent = getString(formData, 'content');
    if (rawContent.length > MAX_NEWS_DOCUMENT_LENGTH) throw new Error('본문 서식이 너무 큽니다. 서식을 정리해주세요.');
    const images = imageArray(getString(formData, 'image_urls'));
    const staged = imageArray(getString(formData, 'uploaded_urls')).filter((url) => managedNewsImagePath(url)?.startsWith(`news/${type}/${id}/`));
    const maxImageSize = newsImageMaxSize(type);
    const maxImageSizeMb = Math.round(maxImageSize / (1024 * 1024));
    if (images.length > MAX_IMAGE_COUNT) throw new Error(`본문과 첨부 이미지는 합쳐서 최대 ${MAX_IMAGE_COUNT}개입니다.`);
    const existingImages = new Set([...(previous?.image_urls || []), ...newsInlineImages(previous?.content || '')]);
    for (const url of images) {
      if (existingImages.has(url)) continue;
      const path = managedNewsImagePath(url);
      if (!path?.startsWith(`news/${type}/${id}/`)) throw new Error('이 글에 업로드한 이미지만 사용할 수 있습니다. 이미지를 다시 첨부해주세요.');
      const { data: info, error: infoError } = await client.storage.from('reviews').info(path);
      if (infoError || !info) throw new Error('이미지 업로드가 완료되지 않았습니다. 다시 첨부해주세요.');
      if (!Object.hasOwn(ALLOWED_IMAGE_TYPES, info.contentType || '') || typeof info.size !== 'number' || info.size <= 0 || info.size > maxImageSize) throw new Error(`이미지 형식 또는 크기를 확인해주세요. 파일당 최대 ${maxImageSizeMb}MB입니다.`);
    }
    const doc = normalizeNewsDocument(rawContent.startsWith(NEWS_CONTENT_PREFIX)
      ? JSON.parse(rawContent.slice(NEWS_CONTENT_PREFIX.length)) : newsDocumentForEditor(rawContent), new Set(images));
    // Every save changes the stored document, even for title/cover-only edits. The conditional
    // update below then atomically rejects competing saves without changing created_at.
    doc.attrs = { ...doc.attrs, saveId: randomUUID() };
    const content = serializeNewsDocument(doc);
    const text = documentText(doc);
    const inlineImages = documentImages(doc);
    if (text.length > MAX_NEWS_TEXT_LENGTH || (type !== 'youtube' && !text.trim() && !inlineImages.length)) throw new Error('본문을 입력해주세요. 내용은 20,000자 이하로 작성할 수 있습니다.');
    const videoUrl = type === 'youtube' ? urlValue(getString(formData, 'video_url'), '유튜브 링크') : null;
    if (type === 'youtube' && !youtubeVideoId(videoUrl)) throw new Error('올바른 유튜브 영상 링크를 입력해주세요.');
    const sourceName = type === 'media' ? getString(formData, 'source_name') : '';
    if (sourceName.length > 150) throw new Error('언론사명은 150자 이하로 입력해주세요.');
    const payload = {
      type: type === 'notice' && getString(formData, 'is_pinned') === 'true' ? 'notice_pinned' : type,
      title, content, image_urls: images, video_url: videoUrl,
      source_name: sourceName || null,
      source_url: type === 'media' ? urlValue(getString(formData, 'source_url'), '보도 원문 링크') : null,
    };
    const result = editing
      ? await client.from('hospital_news').update(payload).eq('id', id).in('type', storedNewsTypes(type)).eq('content', previous!.content).select('id').maybeSingle()
      : await client.from('hospital_news').insert({ id, ...payload }).select('id').single();
    if (result.error || !result.data) {
      if (editing && !result.error && !result.data) throw new Error('다른 화면에서 글이 변경되었습니다. 작성 내용을 임시보관한 뒤 새로고침해주세요.');
      console.error('News save failed:', result.error?.message);
      throw new Error('글을 저장하지 못했습니다. 새로고침 후 다시 시도해주세요. 작성 내용은 임시보관됩니다.');
    }
    invalidateNews(type, id);
    const unused = [...existingImages, ...staged].filter((url) => !images.includes(url));
    let clean = false;
    try { clean = await removeUnusedNewsImages(unused); } catch (err) { console.error('News image cleanup failed:', err); }
    return { success: true, id, ...(!clean ? { warning: '글은 저장되었습니다. 일부 이전 이미지 파일 정리는 완료하지 못했습니다.' } : {}) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : '게시물 저장 중 오류가 발생했습니다.' };
  }
}

export async function createAdminNews(formData: FormData) { return saveNews(formData, false); }
export async function updateAdminNews(formData: FormData) { return saveNews(formData, true); }

export async function deleteAdminNews(id: string, type: string): Promise<AdminNewsResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  if (!validNewsId(id) || !isAdminNewsType(type)) return { success: false, error: '게시물 정보가 올바르지 않습니다.' };
  try {
    const { data, error } = await newsAdminClient().from('hospital_news').delete().eq('id', id).in('type', storedNewsTypes(type)).select('id,content,image_urls').maybeSingle();
    if (error) throw new Error('게시물을 삭제하지 못했습니다. 다시 시도해주세요.');
    if (!data) throw new Error('이미 삭제되었거나 존재하지 않는 게시물입니다. 목록을 새로고침해주세요.');
    invalidateNews(type, id);
    let clean = false;
    try { clean = await removeUnusedNewsImages([...(data.image_urls || []), ...newsInlineImages(data.content)]); } catch (err) { console.error('Deleted news image cleanup failed:', err); }
    return { success: true, id, ...(!clean ? { warning: '글은 삭제되었습니다. 일부 첨부 파일 정리는 완료하지 못했습니다.' } : {}) };
  } catch (error) { return { success: false, error: error instanceof Error ? error.message : '게시물 삭제 중 오류가 발생했습니다.' }; }
}

export async function discardAdminNewsUploads(id: string, type: string, urls: string[]) {
  if (!(await isAdminAuthenticated()) || !validNewsId(id) || !isAdminNewsType(type)) return { success: false };
  if (!Array.isArray(urls) || urls.length > 100 || urls.some((url) => typeof url !== 'string')) return { success: false };
  const owned = urls.filter((url) => managedNewsImagePath(url)?.startsWith(`news/${type}/${id}/`));
  try { return { success: await removeUnusedNewsImages(owned) }; }
  catch { return { success: false }; }
}

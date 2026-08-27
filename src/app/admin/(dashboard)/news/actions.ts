'use server';

import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath, updateTag } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { isAdminNewsType } from '@/lib/adminNews';
import { HOSPITAL_NEWS_CACHE_TAG } from '@/lib/hospitalNews';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const MAX_FILE_COUNT = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export type CreateAdminNewsResult =
  | { success: true }
  | { success: false; error: string };

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeOptionalUrl(value: string, label: string) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error();
    return url.toString();
  } catch {
    throw new Error(`${label}는 http:// 또는 https://로 시작하는 주소를 입력해주세요.`);
  }
}

export async function createAdminNews(formData: FormData): Promise<CreateAdminNewsResult> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  }

  const requestedType = getString(formData, 'type');
  if (!isAdminNewsType(requestedType)) {
    return { success: false, error: '등록할 수 없는 병원소식 유형입니다.' };
  }

  const title = getString(formData, 'title');
  const content = getString(formData, 'content');
  const videoUrlValue = getString(formData, 'video_url');
  const sourceName = getString(formData, 'source_name');
  const sourceUrlValue = getString(formData, 'source_url');
  const isPinned = requestedType === 'notice' && formData.get('is_pinned') === 'true';
  const storedType = isPinned ? 'notice_pinned' : requestedType;

  if (!title || title.length > 150) {
    return { success: false, error: '제목은 1자 이상 150자 이하로 입력해주세요.' };
  }

  if (requestedType !== 'youtube' && (!content || content.length > 20_000)) {
    return { success: false, error: '내용은 1자 이상 20,000자 이하로 입력해주세요.' };
  }

  if (requestedType === 'youtube' && content.length > 20_000) {
    return { success: false, error: '영상 설명은 20,000자 이하로 입력해주세요.' };
  }

  try {
    const videoUrl = normalizeOptionalUrl(videoUrlValue, '유튜브 링크');
    const sourceUrl = normalizeOptionalUrl(sourceUrlValue, '보도 원문 링크');

    if (requestedType === 'youtube' && !videoUrl) {
      return { success: false, error: '유튜브 링크를 입력해주세요.' };
    }

    const files = formData
      .getAll('files')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length > MAX_FILE_COUNT) {
      return { success: false, error: `이미지는 최대 ${MAX_FILE_COUNT}개까지 첨부할 수 있습니다.` };
    }

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES[file.type]) {
        return { success: false, error: 'JPG, PNG, WEBP, GIF 이미지만 첨부할 수 있습니다.' };
      }
      if (file.size > MAX_FILE_SIZE) {
        return { success: false, error: '이미지 한 개의 크기는 10MB를 넘을 수 없습니다.' };
      }
    }

    const uploadedPaths: string[] = [];
    const imageUrls: string[] = [];

    try {
      for (const file of files) {
        const extension = ALLOWED_IMAGE_TYPES[file.type];
        const filePath = `news/${requestedType}/${Date.now()}-${randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('reviews').upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

        if (uploadError) throw new Error(`이미지 업로드 실패: ${uploadError.message}`);

        uploadedPaths.push(filePath);
        const { data } = supabase.storage.from('reviews').getPublicUrl(filePath);
        imageUrls.push(data.publicUrl);
      }

      const { error: insertError } = await supabase.from('hospital_news').insert({
        type: storedType,
        title,
        content,
        image_urls: imageUrls,
        video_url: videoUrl,
        source_name: sourceName || null,
        source_url: sourceUrl,
      });

      if (insertError) throw insertError;
    } catch (error) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from('reviews').remove(uploadedPaths);
      }
      throw error;
    }

    updateTag(HOSPITAL_NEWS_CACHE_TAG);
    revalidatePath(`/news/${requestedType}`);
    revalidatePath('/admin/news');
    revalidatePath('/');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error creating hospital news:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '병원소식 저장 중 오류가 발생했습니다.',
    };
  }
}

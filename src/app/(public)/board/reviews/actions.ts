'use server';

import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { createClient as createSessionClient } from '@/utils/supabase/server';
import {
  ALLOWED_IMAGE_TYPES,
  collectUploadFiles,
  validateUploadFiles,
} from '@/lib/imageUploadRules';

// Storage 업로드와 저장은 service role 로 수행합니다.
// 서버 액션은 공개 엔드포인트이므로, 이 클라이언트를 쓰기 전에 반드시 회원 여부를 확인합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CATEGORIES = ['목', '허리', '무릎', '어깨', '손발'];

export type CreateReviewResult =
  | { success: true }
  | { success: false; error: string };

/**
 * 치료체험후기 저장 서버 액션
 * 로그인한 회원만 작성할 수 있습니다.
 */
export async function createReview(formData: FormData): Promise<CreateReviewResult> {
  // 1. 회원 확인. 페이지는 미들웨어가 막지만 액션 자체도 스스로 막아야 합니다.
  const sessionClient = await createSessionClient();
  const {
    data: { user },
    error: authError,
  } = await sessionClient.auth.getUser();

  if (authError || !user) {
    return { success: false, error: '로그인 후 이용해 주세요.' };
  }

  // 2. 입력값 검증
  const title = (formData.get('title') as string | null)?.trim() || '';
  const content = (formData.get('content') as string | null)?.trim() || '';
  const category = (formData.get('category') as string | null)?.trim() || '';

  if (!CATEGORIES.includes(category)) {
    return { success: false, error: '진료 과목을 선택해 주세요.' };
  }
  if (title.length < 2 || title.length > 100) {
    return { success: false, error: '제목은 2자 이상 100자 이하로 입력해 주세요.' };
  }
  if (content.length < 10 || content.length > 5000) {
    return { success: false, error: '내용은 10자 이상 5,000자 이하로 입력해 주세요.' };
  }

  const files = collectUploadFiles(formData);
  const fileProblem = validateUploadFiles(files);
  if (fileProblem) {
    return { success: false, error: fileProblem };
  }

  // 3. 이미지 업로드 (Storage: reviews 버킷)
  const uploadedPaths: string[] = [];
  const imageUrls: string[] = [];

  try {
    for (const file of files) {
      const extension = ALLOWED_IMAGE_TYPES[file.type];
      const filePath = `reviews/${user.id}/${Date.now()}-${randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from('reviews').upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

      if (uploadError) throw new Error(`이미지 업로드에 실패했습니다: ${uploadError.message}`);

      uploadedPaths.push(filePath);
      const { data } = supabase.storage.from('reviews').getPublicUrl(filePath);
      imageUrls.push(data.publicUrl);
    }

    // 4. 데이터베이스 저장
    const { error: insertError } = await supabase.from('reviews').insert({
      title,
      content,
      category,
      image_urls: imageUrls,
    });

    if (insertError) throw insertError;
  } catch (error: unknown) {
    // 실패하면 이미 올라간 파일을 남기지 않습니다.
    if (uploadedPaths.length > 0) {
      await supabase.storage.from('reviews').remove(uploadedPaths);
    }
    console.error('Error creating review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '후기 저장 중 오류가 발생했습니다.',
    };
  }

  // 5. 목록 캐시 갱신 (기존에는 존재하지 않는 /news/reviews 를 갱신하고 있었습니다)
  revalidatePath('/board/reviews');

  return { success: true };
}

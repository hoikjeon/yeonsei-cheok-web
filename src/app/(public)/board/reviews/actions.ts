'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// 서버 환경에서 서비스 롤 키를 사용하여 Supabase 클라이언트 생성 (RLS 우회 및 스토리지 관리용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 치료체험후기 저장 서버 액션
 * @param formData 폼 데이터 (title, content, category, files)
 */
export async function createReview(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const files = formData.getAll('files') as File[];

    if (!title || !content || !category) {
      throw new Error('필수 정보가 누락되었습니다.');
    }

    const imageUrls: string[] = [];

    // 1. 이미지 업로드 (Storage: reviews 버킷)
    for (const file of files) {
      if (file.size === 0) continue;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${Date.now()}_${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('reviews')
        .upload(filePath, file);

      if (uploadError) {
         console.error('Image upload error:', uploadError);
         continue;
      }

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('reviews')
        .getPublicUrl(filePath);
      
      imageUrls.push(publicUrl);
    }

    // 2. 데이터베이스 인서트 (Table: reviews)
    const { data, error: insertError } = await supabase
      .from('reviews')
      .insert([
        {
          title,
          content,
          category,
          image_urls: imageUrls,
        }
      ])
      .select();

    if (insertError) {
      throw insertError;
    }

    // 3. 페이지 캐시 갱신 및 결과 반환
    revalidatePath('/news/reviews');
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating review:', error);
    return { success: false, error: error.message };
  }
}

'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// 서버 환경에서 서비스 롤 키 사용 (스토리지 및 DB 관리용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 병원 소식 저장 서버 액션
 * @param formData 폼 데이터 (type, title, content, files, video_url, source_name, source_url)
 */
export async function createNews(formData: FormData) {
  try {
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const video_url = formData.get('video_url') as string;
    const source_name = formData.get('source_name') as string;
    const source_url = formData.get('source_url') as string;
    const files = formData.getAll('files') as File[];

    if (!type || !title || !content) {
      throw new Error('필수 정보가 누락되었습니다.');
    }

    const imageUrls: string[] = [];

    // 1. 이미지 업로드 (Storage)
    for (const file of files) {
      if (file.size === 0) continue;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `news/${Date.now()}_${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('reviews') // 기존 reviews 버킷 활용 (편의상)
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

    // 2. 데이터베이스 인서트 (Table: hospital_news)
    const { data, error: insertError } = await supabase
      .from('hospital_news')
      .insert([
        {
          type,
          title,
          content,
          image_urls: imageUrls,
          video_url: video_url || null,
          source_name: source_name || null,
          source_url: source_url || null,
        }
      ])
      .select();

    if (insertError) {
      throw insertError;
    }

    // 3. 페이지 캐시 갱신 (notice_pinned도 공지사항 목록 경로로 갱신)
    revalidatePath(`/news/${type.startsWith('notice') ? 'notice' : type}`);
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating news:', error);
    return { success: false, error: error.message };
  }
}

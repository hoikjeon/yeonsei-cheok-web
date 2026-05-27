'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function togglePopupActive(id: string, currentStatus: boolean) {
  try {
    const { error } = await supabase
      .from('popups')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/popups');
    revalidatePath('/admin');
    revalidatePath('/'); // 메인 홈페이지 팝업도 갱신
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function uploadPopup(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const label = formData.get('label') as string;
    const file = formData.get('image') as File;
    const isActive = formData.get('is_active') === 'on';

    if (!title || !content) {
      return { error: '제목과 내용을 모두 입력해주세요.' };
    }

    let imageUrl = '/ube_training.jpg'; 

    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('popups')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
      }
      
      if (uploadData) {
        const { data } = supabase.storage.from('popups').getPublicUrl(uploadData.path);
        imageUrl = data.publicUrl;
      }
    }

    const { error } = await supabase
      .from('popups')
      .insert([
        { title, content, label, image_url: imageUrl, is_active: isActive }
      ]);

    if (error) throw error;
    revalidatePath('/admin/popups');
    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Upload Action Error:', error);
    return { error: error.message };
  }
}

export async function updatePopup(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const label = formData.get('label') as string;
    const file = formData.get('image') as File;
    const isActive = formData.get('is_active') === 'on';

    if (!title || !content) {
      return { error: '제목과 내용을 모두 입력해주세요.' };
    }

    let updateData: any = { title, content, label, is_active: isActive };

    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('popups')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Update Upload Error:', uploadError);
        throw new Error(`이미지 수정 업로드 실패: ${uploadError.message}`);
      }
      
      if (uploadData) {
        const { data } = supabase.storage.from('popups').getPublicUrl(uploadData.path);
        updateData.image_url = data.publicUrl;
      }
    }

    const { error } = await supabase
      .from('popups')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/popups');
    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Update Action Error:', error);
    return { error: error.message };
  }
}

export async function deletePopup(id: string) {
  try {
    const { error } = await supabase.from('popups').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/popups');
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// datetime-local 입력값("2026-07-20T09:00")을 한국 시간 기준 ISO 문자열로 변환
function parseKstDateTime(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  return `${value.trim()}:00+09:00`;
}

function parseDisplaySlot(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string') return null;
  const slot = parseInt(value, 10);
  return slot >= 1 && slot <= 3 ? slot : null;
}

// 같은 자리를 쓰던 다른 팝업의 슬롯을 해제 (한 자리 = 한 팝업)
async function releaseSlotConflict(slot: number | null, excludeId?: string) {
  if (slot === null) return;
  let query = supabase.from('popups').update({ display_slot: null }).eq('display_slot', slot);
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  await query;
}

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
    const displaySlot = parseDisplaySlot(formData.get('display_slot'));
    const startsAt = parseKstDateTime(formData.get('starts_at'));
    const endsAt = parseKstDateTime(formData.get('ends_at'));

    if (!title || !content) {
      return { error: '제목과 내용을 모두 입력해주세요.' };
    }
    if (startsAt && endsAt && startsAt >= endsAt) {
      return { error: '종료일시는 시작일시보다 이후여야 합니다.' };
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

    await releaseSlotConflict(displaySlot);

    const { error } = await supabase
      .from('popups')
      .insert([
        {
          title,
          content,
          label,
          image_url: imageUrl,
          is_active: isActive,
          display_slot: displaySlot,
          starts_at: startsAt,
          ends_at: endsAt,
        }
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
    const displaySlot = parseDisplaySlot(formData.get('display_slot'));
    const startsAt = parseKstDateTime(formData.get('starts_at'));
    const endsAt = parseKstDateTime(formData.get('ends_at'));

    if (!title || !content) {
      return { error: '제목과 내용을 모두 입력해주세요.' };
    }
    if (startsAt && endsAt && startsAt >= endsAt) {
      return { error: '종료일시는 시작일시보다 이후여야 합니다.' };
    }

    await releaseSlotConflict(displaySlot, id);

    let updateData: any = {
      title,
      content,
      label,
      is_active: isActive,
      display_slot: displaySlot,
      starts_at: startsAt,
      ends_at: endsAt,
    };

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

// 리스트에서 노출 자리(1~3 또는 해제)를 바로 변경
export async function assignPopupSlot(id: string, slot: number | null) {
  try {
    const safeSlot = slot !== null && slot >= 1 && slot <= 3 ? slot : null;
    await releaseSlotConflict(safeSlot, id);

    const { error } = await supabase
      .from('popups')
      .update({ display_slot: safeSlot })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/popups');
    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
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

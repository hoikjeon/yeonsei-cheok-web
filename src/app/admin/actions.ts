'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { createAdminSession, deleteAdminSession, requireAdmin } from '@/lib/adminAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 관리자 로그인
 */
export async function adminLogin(formData: FormData) {
  const id = formData.get('id');
  const password = formData.get('password');

  // 간단한 하드코딩 인증 (나중에 DB 연동 가능)
  if (id === 'admin' && password === 'ys1004!') {
    await createAdminSession();
    redirect('/admin');
  } else {
    return { error: '아이디 또는 비밀번호가 일치하지 않습니다.' };
  }
}

/**
 * 관리자 로그아웃
 */
export async function adminLogout() {
  await deleteAdminSession();
  // 예전 버전에서 심어둔 비서명 쿠키가 남아 있을 수 있으므로 함께 정리합니다.
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/admin/login');
}

/**
 * 예약 목록 조회
 * anon 키로는 예약 테이블을 읽을 수 없으므로(개인정보 보호) 관리자 화면은
 * 이 서버 액션을 통해 service role로만 조회합니다.
 */
export async function listReservations() {
  await requireAdmin();

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: data ?? [], error: error?.message };
}

/**
 * 예약 확인 상태 토글
 */
export async function toggleReservationChecked(id: string, currentStatus: boolean) {
  await requireAdmin();

  const { error } = await supabase
    .from('reservations')
    .update({ is_checked: !currentStatus })
    .eq('id', id);

  if (!error) {
    revalidatePath('/admin');
    revalidatePath('/admin/reservations');
  }
  return { error: error?.message };
}

/**
 * 상담 확인 상태 토글
 */
export async function toggleConsultationChecked(id: string, currentStatus: boolean) {
  await requireAdmin();

  const { error } = await supabase
    .from('consultations')
    .update({ is_checked: !currentStatus })
    .eq('id', id);

  if (!error) {
    revalidatePath('/admin');
    revalidatePath('/admin/consultations');
  }
  return { error: error?.message };
}

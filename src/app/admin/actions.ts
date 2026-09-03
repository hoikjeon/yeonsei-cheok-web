'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import {
  createAdminSession,
  deleteAdminSession,
  requireAdmin,
  verifyAdminCredentials,
} from '@/lib/adminAuth';
import {
  checkLoginThrottle,
  clearLoginFailures,
  getRequestIp,
  recordLoginAttempt,
} from '@/lib/adminLoginThrottle';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 관리자 로그인
 */
export async function adminLogin(formData: FormData) {
  const ip = await getRequestIp();

  const throttle = await checkLoginThrottle(ip);
  if (throttle.locked) {
    return {
      error: `로그인 시도가 너무 많습니다. ${throttle.retryAfterMinutes}분 후에 다시 시도해 주세요.`,
    };
  }

  const result = await verifyAdminCredentials(formData.get('id'), formData.get('password'));

  if (!result.ok) {
    await recordLoginAttempt(ip, false);

    if (result.reason === 'not-configured') {
      return {
        error: '관리자 비밀번호가 설정되지 않았습니다. ADMIN_PASSWORD_HASH 환경변수를 확인해 주세요.',
      };
    }

    // 시도 제한이 실제로 켜져 있을 때만 남은 횟수를 안내합니다.
    if (!throttle.active) {
      return { error: '아이디 또는 비밀번호가 일치하지 않습니다.' };
    }

    const remaining = Math.max(0, throttle.remainingAttempts - 1);
    return {
      error:
        remaining > 0
          ? `아이디 또는 비밀번호가 일치하지 않습니다. (남은 시도 ${remaining}회)`
          : '아이디 또는 비밀번호가 일치하지 않습니다. 잠시 후 다시 시도해 주세요.',
    };
  }

  // 세션을 먼저 만들고 기록은 그 뒤에 남깁니다.
  // 기록 쪽 문제로 로그인이 막히지 않게 하기 위한 순서입니다.
  await createAdminSession();
  await clearLoginFailures(ip);
  await recordLoginAttempt(ip, true);
  redirect('/admin');
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

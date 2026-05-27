'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Provider } from '@supabase/supabase-js';

// 오류 메시지 한국어 번역 헬퍼 함수
function translateError(error: any) {
  if (!error) return null;
  let errorMessage = error.message;
  if (errorMessage.includes('at least 6 characters')) {
    errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
  } else if (errorMessage.includes('Invalid login credentials')) {
    errorMessage = '이메일 또는 비밀번호가 일치하지 않습니다.';
  } else if (errorMessage.includes('User already registered')) {
    errorMessage = '이미 가입 완료된 이메일 주소입니다.';
  } else if (errorMessage.includes('Email not confirmed')) {
    errorMessage = '이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.';
  } else if (errorMessage.includes('rate limit exceeded')) {
    errorMessage = '요청이 너무 많습니다. 잠시 후(약 1분 뒤) 다시 시도해 주세요.';
  }
  return errorMessage;
}

// 이메일 기반 회원가입
export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const gender = formData.get('gender') as string;
  const birthDate = formData.get('birthDate') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const smsConsent = formData.get('smsConsent') === 'on';

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        gender,
        birth_date: birthDate,
        phone,
        address,
        sms_consent: smsConsent,
      },
    },
  });

  if (error) {
    return { error: translateError(error) };
  }

  return { success: true };
}

// 이메일 기반 로그인
export async function signInWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: translateError(error) };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

// 로그아웃
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
  }

  // 전체 레이아웃 리밸리데이션으로 모든 페이지의 로그인 상태 갱신
  revalidatePath('/', 'layout');
  redirect('/login');
}

// 소셜 로그인 (네이버 제거됨)
export async function signInWithSocial(provider: 'google' | 'kakao') {
  const supabase = await createClient();
  
  // 서버 사이드에서 리다이렉트 경로 설정 (실제 도메인 또는 환경 변수 활용 권장)
  const host = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectTo = `${host}/auth/callback?next=/`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo,
      scopes: provider === 'kakao' ? 'profile_nickname profile_image account_email' : undefined,
    },
  });

  if (error) {
    return { error: translateError(error) };
  }

  // 서버 사이드 리다이렉트 수행
  if (data.url) {
    redirect(data.url);
  }
}

// 비밀번호 재설정 요청 (메일 발송)
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();
  
  // 서버 사이드에서 리다이렉트 경로 설정 (재설정 페이지로 바로 연결)
  const host = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectTo = `${host}/auth/callback?next=/login/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { error: translateError(error) };
  }

  return { success: true };
}

// 새로운 비밀번호로 최종 변경
export async function updateNewPassword(formData: FormData) {
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: translateError(error) };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

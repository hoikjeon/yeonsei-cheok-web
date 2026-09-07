'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Provider } from '@supabase/supabase-js';
import { SITE_URL } from '@/lib/seo';

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

// 소셜 로그인·메일 링크가 돌아올 주소는 '지금 접속 중인 도메인'을 기준으로 만듭니다.
// 환경 변수(NEXT_PUBLIC_SITE_URL)에만 의존하면 배포 환경에서 값이 비었을 때
// localhost로 돌려보내 로그인이 끊기고, 프리뷰 배포에서도 도메인이 어긋납니다.
async function getRequestOrigin() {
  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') || headerList.get('host');
  if (!host) return SITE_URL;
  const proto =
    headerList.get('x-forwarded-proto') ||
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
  return `${proto}://${host}`;
}

function safeRedirectPath(value: FormDataEntryValue | string | null | undefined) {
  const path = typeof value === 'string' ? value.trim() : '';
  return path.startsWith('/') && !path.startsWith('//') ? path : '/';
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
  const nextPath = safeRedirectPath(formData.get('next'));
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: translateError(error) };
  }

  revalidatePath('/', 'layout');
  redirect(nextPath);
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
export async function signInWithSocial(provider: 'google' | 'kakao', nextPath = '/') {
  const supabase = await createClient();

  const origin = await getRequestOrigin();
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(safeRedirectPath(nextPath))}`;

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
  if (!data.url) {
    return { error: '소셜 로그인 주소를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.' };
  }

  redirect(data.url);
}

// 비밀번호 재설정 요청 (메일 발송)
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();

  const origin = await getRequestOrigin();
  const redirectTo = `${origin}/auth/callback?next=/login/reset-password`;

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

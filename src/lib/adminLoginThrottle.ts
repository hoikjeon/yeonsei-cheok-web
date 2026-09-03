import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// 같은 IP 에서 WINDOW_MINUTES 분 안에 MAX_FAILURES 번 실패하면 잠급니다.
const MAX_FAILURES = 5;
const WINDOW_MINUTES = 10;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function getRequestIp() {
  const headerList = await headers();

  // Vercel 은 x-forwarded-for 의 첫 번째 값이 실제 클라이언트 IP 입니다.
  const forwarded = headerList.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip')?.trim();

  return ip || 'unknown';
}

export type ThrottleState = {
  /** 기록 테이블을 실제로 읽을 수 있었는지. false 면 시도 제한이 동작하지 않습니다. */
  active: boolean;
  locked: boolean;
  remainingAttempts: number;
  retryAfterMinutes: number;
};

/**
 * 최근 실패 횟수를 확인합니다.
 * 기록 테이블이 아직 없거나 조회가 실패하면 로그인을 막지는 않습니다.
 * (잠금 기능 장애가 관리자 접속 자체를 봉쇄하지 않도록)
 */
export async function checkLoginThrottle(ip: string): Promise<ThrottleState> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('admin_login_attempts')
    .select('attempted_at')
    .eq('ip', ip)
    .eq('succeeded', false)
    .gte('attempted_at', since)
    .order('attempted_at', { ascending: true });

  if (error || !data) {
    // 테이블이 아직 없거나 조회 실패. 로그인 자체를 막지는 않습니다.
    console.warn('관리자 로그인 시도 제한이 동작하지 않습니다:', error?.message);
    return { active: false, locked: false, remainingAttempts: MAX_FAILURES, retryAfterMinutes: 0 };
  }

  if (data.length < MAX_FAILURES) {
    return {
      active: true,
      locked: false,
      remainingAttempts: MAX_FAILURES - data.length,
      retryAfterMinutes: 0,
    };
  }

  // 창 안의 가장 오래된 실패가 빠져나가야 다시 시도할 수 있습니다.
  const oldest = new Date(data[0].attempted_at).getTime();
  const unlockAt = oldest + WINDOW_MINUTES * 60 * 1000;
  const retryAfterMinutes = Math.max(1, Math.ceil((unlockAt - Date.now()) / 60000));

  return { active: true, locked: true, remainingAttempts: 0, retryAfterMinutes };
}

export async function recordLoginAttempt(ip: string, succeeded: boolean) {
  await supabase.from('admin_login_attempts').insert({ ip, succeeded });
}

/** 로그인에 성공하면 해당 IP 의 실패 기록을 지웁니다. */
export async function clearLoginFailures(ip: string) {
  await supabase.from('admin_login_attempts').delete().eq('ip', ip).eq('succeeded', false);
}

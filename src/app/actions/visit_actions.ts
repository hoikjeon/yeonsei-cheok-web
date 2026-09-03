'use server';

import { createHmac } from 'node:crypto';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MAX_PATH_LENGTH = 200;

/**
 * 방문자 식별값을 서버에서 만듭니다.
 *
 * 예전에는 브라우저가 만든 UUID 를 그대로 받아 저장했는데, 서버 액션은 공개
 * 엔드포인트라 임의의 값을 무한히 보내 통계를 부풀리거나 DB 비용을 늘릴 수
 * 있었습니다. 이제 IP·브라우저·날짜를 HMAC 으로 묶어 서버가 직접 계산하므로
 * 클라이언트가 값을 고를 수 없고, 같은 방문자는 하루 한 번만 기록됩니다.
 *
 * 원본 IP 는 저장하지 않고 되돌릴 수 없는 해시만 남깁니다.
 */
function buildVisitorId(ip: string, userAgent: string, dateKey: string) {
  const secret =
    process.env.VISITOR_ID_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'ys-visitor';

  return createHmac('sha256', secret)
    .update(`${ip}|${userAgent}|${dateKey}`)
    .digest('base64url')
    .slice(0, 32);
}

/** 한국 시간 기준 오늘 날짜(YYYY-MM-DD)와 그날의 시작 시각 */
function getKstDay() {
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const dateKey = kstNow.toISOString().slice(0, 10);
  const startOfDayUtc = new Date(`${dateKey}T00:00:00+09:00`);

  return { dateKey, startOfDayUtc };
}

/** 기록할 수 있는 경로인지 확인하고 정규화합니다. */
function normalizePath(rawPath: unknown) {
  if (typeof rawPath !== 'string') return null;

  const path = rawPath.split('?')[0].split('#')[0].trim();

  if (!path.startsWith('/') || path.startsWith('//')) return null;
  if (path.length > MAX_PATH_LENGTH) return null;
  if (path.startsWith('/admin')) return null;

  return path;
}

export async function recordVisit(rawPath: string) {
  try {
    const path = normalizePath(rawPath);
    if (!path) return { success: false };

    const headerList = await headers();
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip')?.trim() ||
      'unknown';
    const userAgent = headerList.get('user-agent')?.slice(0, 200) || 'unknown';

    const { dateKey, startOfDayUtc } = getKstDay();
    const visitorId = buildVisitorId(ip, userAgent, dateKey);

    // 같은 방문자가 오늘 이미 기록됐으면 넘어갑니다.
    const { data: existingVisits } = await supabase
      .from('site_visits')
      .select('id')
      .eq('visitor_id', visitorId)
      .gte('visited_at', startOfDayUtc.toISOString())
      .limit(1);

    if (existingVisits && existingVisits.length > 0) {
      return { success: true, message: 'Already counted today' };
    }

    const { error } = await supabase
      .from('site_visits')
      .insert([{ visitor_id: visitorId, path }]);

    if (error) {
      console.error('Failed to log visit:', error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Visit tracking error:', error);
    return { success: false };
  }
}

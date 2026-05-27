'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function recordVisit(visitorId: string, path: string) {
  try {
    // 오늘 날짜(UTC 기준도 무방, 한국 시간 기준 처리도 선택 가능) 방문 기록 확인
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 이중 체크: 만약 동일한 visitorId로 오늘 이미 방문한 기록이 있다면 스킵
    // (보통 클라이언트의 localStorage에서 1차로 막아주지만, 서버에서도 방어)
    const { data: existingVisits } = await supabase
      .from('site_visits')
      .select('id')
      .eq('visitor_id', visitorId)
      .gte('visited_at', todayStart.toISOString())
      .limit(1);

    if (existingVisits && existingVisits.length > 0) {
      return { success: true, message: 'Already counted today' };
    }

    // 새로운 방문 기록 저장
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

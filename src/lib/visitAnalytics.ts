import type { SupabaseClient } from '@supabase/supabase-js';

const DAY = 86_400_000;
const KST = 9 * 3_600_000;

export interface VisitAnalytics {
  todayTotal: number;
  yesterdayTotal: number;
  hourlyData: { time: string; visits: number }[];
  dailyData: { date: string; visits: number }[];
}

export async function getVisitAnalytics(db: SupabaseClient, now = new Date()): Promise<VisitAnalytics> {
  const todayKey = new Date(now.getTime() + KST).toISOString().slice(0, 10);
  const todayStart = new Date(`${todayKey}T00:00:00+09:00`).getTime();
  const cutoff = now.toISOString();
  const start = (offset: number) => new Date(todayStart + offset * DAY).toISOString();

  async function countVisits(from: string, to: string) {
    const { count, error } = await db.from('site_visits')
      .select('id', { count: 'exact', head: true })
      .gte('visited_at', from).lt('visited_at', to);
    if (error) throw new Error(`방문 통계 조회 실패: ${error.message}`);
    if (count === null) throw new Error('방문 통계 건수를 확인할 수 없습니다.');
    return count;
  }

  async function loadGraphs() {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({ time: `${hour}시`, visits: 0 }));
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(todayStart + (index - 6) * DAY + KST);
      return { key: date.toISOString().slice(0, 10), date: `${date.getUTCMonth() + 1}/${date.getUTCDate()}`, visits: 0 };
    });
    const byDay = new Map(days.map(day => [day.key, day]));
    let offset = 0;
    // 마지막 빈 페이지까지 조회하므로 API의 반환 건수 제한이 낮아져도 누락하지 않습니다.
    while (true) {
      const { data, error } = await db.from('site_visits').select('visited_at')
        .gte('visited_at', start(-6)).lt('visited_at', cutoff)
        .order('visited_at', { ascending: true }).order('id', { ascending: true })
        .range(offset, offset + 999);
      if (error) throw new Error(`방문 그래프 조회 실패: ${error.message}`);
      if (!data?.length) break;
      for (const visit of data) {
        const date = new Date(new Date(visit.visited_at).getTime() + KST);
        const key = date.toISOString().slice(0, 10);
        const day = byDay.get(key);
        if (day) day.visits += 1;
        if (key === todayKey) hourlyData[date.getUTCHours()].visits += 1;
      }
      offset += data.length;
    }
    return { hourlyData, dailyData: days.map(({ date, visits }) => ({ date, visits })) };
  }

  const [todayTotal, yesterdayTotal, graphs] = await Promise.all([
    countVisits(start(0), cutoff),
    countVisits(start(-1), start(0)),
    loadGraphs(),
  ]);
  return { todayTotal, yesterdayTotal, ...graphs };
}

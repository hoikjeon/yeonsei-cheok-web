import { notifySearchEngines } from '@/lib/indexNow';
import { isHealthCronAuthorized } from '@/lib/healthSearchCron';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!isHealthCronAuthorized(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  try {
    return Response.json(await notifySearchEngines());
  } catch (error) {
    console.error('Health search worker failed:', error);
    return Response.json({ error: '대기열 처리 실패. Vercel 로그를 확인해주세요.' }, { status: 500 });
  }
}

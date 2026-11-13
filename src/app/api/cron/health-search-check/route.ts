import { isHealthCronAuthorized } from '@/lib/healthSearchCron';
import { runHealthSearchCheck } from '@/lib/healthSearchMonitor';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!isHealthCronAuthorized(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const report = await runHealthSearchCheck();
    return Response.json(report, { status: report.issues.length ? 503 : 200 });
  } catch (error) {
    console.error('Health search check failed:', error);
    return Response.json({ error: '점검 결과를 저장하지 못했습니다. Vercel 로그를 확인해주세요.' }, { status: 500 });
  }
}

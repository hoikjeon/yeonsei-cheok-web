import { isAdminAuthenticated } from '@/lib/adminAuth';
import { runHealthSearchCheck } from '@/lib/healthSearchMonitor';

export const maxDuration = 300;
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || !(await isAdminAuthenticated())) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    await runHealthSearchCheck();
    return Response.redirect(new URL('/admin/health/search', request.url), 303);
  } catch (error) {
    console.error('Manual health search check failed:', error);
    return Response.redirect(new URL('/admin/health/search?error=check', request.url), 303);
  }
}

import { isAdminAuthenticated } from '@/lib/adminAuth';
import { healthSearchClient } from '@/lib/indexNow';

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || !(await isAdminAuthenticated())) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  const form = await request.formData();
  const id = form.get('id');
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id)) return Response.json({ error: 'invalid job' }, { status: 400 });
  const { error } = await healthSearchClient().from('health_search_jobs')
    .update({ status: 'pending', attempts: 0, available_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id).eq('status', 'failed');
  if (error) return Response.json({ error: '재시도 예약 실패' }, { status: 500 });
  return Response.redirect(new URL('/admin/health/search', request.url), 303);
}

'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';

function memberConsultationPath(params?: URLSearchParams) {
  const query = params?.toString();
  return query ? `/admin/consultations/member?${query}` : '/admin/consultations/member';
}

export async function answerConsultationPost(formData: FormData) {
  await requireAdmin();

  const postId = String(formData.get('postId') || '').trim();
  const answer = String(formData.get('answer') || '').trim();

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(postId)) {
    redirect(memberConsultationPath(new URLSearchParams({ error: '잘못된 상담 번호입니다.' })));
  }
  if (answer.length < 1 || answer.length > 5000) {
    redirect(memberConsultationPath(new URLSearchParams({ error: '답변은 1자 이상 5,000자 이하로 입력해 주세요.' })));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    redirect(memberConsultationPath(new URLSearchParams({ error: '관리자 데이터베이스 설정을 확인해 주세요.' })));
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('consultation_posts')
    .update({
      answer,
      status: 'answered',
      answered_at: now,
      updated_at: now,
    })
    .eq('id', postId);

  if (error) {
    console.error('Failed to answer consultation post:', error.message);
    redirect(memberConsultationPath(new URLSearchParams({ error: '답변을 저장하지 못했습니다.' })));
  }

  revalidatePath('/consultation');
  revalidatePath(`/consultation/${postId}`);
  revalidatePath('/admin/consultations');
  revalidatePath('/admin/consultations/member');
  redirect(memberConsultationPath(new URLSearchParams({ saved: postId })));
}

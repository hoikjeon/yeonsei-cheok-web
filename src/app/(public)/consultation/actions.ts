'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { CONSULTATION_TOPICS } from '@/lib/consultationForm';

export type ConsultationPostActionState = {
  error?: string;
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function isMissingTableError(message: string) {
  return /consultation_posts|schema cache|does not exist|could not find/i.test(message);
}

export async function createConsultationPost(
  _previousState: ConsultationPostActionState,
  formData: FormData,
): Promise<ConsultationPostActionState> {
  const consultationType = readText(formData, 'consultationType');
  const title = readText(formData, 'title');
  const content = readText(formData, 'content');
  const privacyAgreed = formData.get('privacyAgreed') === 'on';

  if (!CONSULTATION_TOPICS.includes(consultationType)) {
    return { error: '상담 분야를 선택해 주세요.' };
  }
  if (title.length < 2 || title.length > 100) {
    return { error: '제목은 2자 이상 100자 이하로 입력해 주세요.' };
  }
  if (content.length < 10 || content.length > 5000) {
    return { error: '상담 내용은 10자 이상 5,000자 이하로 입력해 주세요.' };
  }
  if (!privacyAgreed) {
    return { error: '개인정보 수집 및 이용에 동의해 주세요.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: '로그인 정보가 만료되었습니다. 다시 로그인한 후 작성해 주세요.' };
  }

  const authorName =
    typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : '회원';
  const phone =
    typeof user.user_metadata?.phone === 'string' ? user.user_metadata.phone.trim() : null;

  const { data, error } = await supabase
    .from('consultation_posts')
    .insert({
      user_id: user.id,
      author_name: authorName,
      phone: phone || null,
      consultation_type: consultationType,
      title,
      content,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Failed to create consultation post:', error?.message);
    return {
      error: isMissingTableError(error?.message || '')
        ? '상담 게시판 데이터베이스 설정이 아직 완료되지 않았습니다.'
        : '상담을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.',
    };
  }

  revalidatePath('/consultation');
  redirect(`/consultation/${data.id}`);
}

'use server';

import { revalidatePath } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { healthAdminClient } from '@/lib/adminHealthRepository';

export type HealthTopicResult = { success: true; added?: number } | { success: false; error: string };

const ID_PATTERN = /^[0-9a-f-]{36}$/;
const CATEGORY_NAMES: Record<string, 'spine' | 'joint'> = { 척추: 'spine', spine: 'spine', 관절: 'joint', joint: 'joint' };

/**
 * 한 줄에 주제 하나씩 받습니다. "주제 | 분류 | 메모" 형식이며 분류·메모는 생략할 수 있습니다.
 * 예) 척추관협착증 걷기 운동, 얼마나 걸어야 할까 | 척추 | 부산 사상구 지역 키워드
 */
export async function addHealthTopics(text: string): Promise<HealthTopicResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  if (typeof text !== 'string' || text.length > 50_000) return { success: false, error: '한 번에 너무 많은 내용을 넣었습니다. 나눠서 추가해주세요.' };
  const rows = text.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const [topic, category = '', note = ''] = line.split('|').map((part) => part.trim());
    return { topic, category: CATEGORY_NAMES[category] ?? null, note };
  });
  if (!rows.length) return { success: false, error: '주제를 한 줄 이상 입력해주세요.' };
  if (rows.length > 200) return { success: false, error: '주제는 한 번에 200개까지 추가할 수 있습니다.' };
  const tooLong = rows.find((row) => row.topic.length < 4 || row.topic.length > 200 || row.note.length > 500);
  if (tooLong) return { success: false, error: `주제는 4~200자, 메모는 500자 이하로 적어주세요: "${tooLong.topic.slice(0, 30)}"` };
  const { error } = await healthAdminClient().from('health_topics').insert(rows);
  if (error) {
    console.error('Health topic insert failed:', error.message);
    return { success: false, error: '주제를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.' };
  }
  revalidatePath('/admin/health', 'layout');
  return { success: true, added: rows.length };
}

export async function deleteHealthTopic(id: string): Promise<HealthTopicResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  if (!ID_PATTERN.test(id)) return { success: false, error: '주제 정보가 올바르지 않습니다.' };
  const { error } = await healthAdminClient().from('health_topics').delete().eq('id', id).neq('status', 'processing');
  if (error) return { success: false, error: '주제를 삭제하지 못했습니다.' };
  revalidatePath('/admin/health', 'layout');
  return { success: true };
}

/** 실패한 주제를 다시 대기열에 넣습니다. */
export async function retryHealthTopic(id: string): Promise<HealthTopicResult> {
  if (!(await isAdminAuthenticated())) return { success: false, error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  if (!ID_PATTERN.test(id)) return { success: false, error: '주제 정보가 올바르지 않습니다.' };
  const { error } = await healthAdminClient().from('health_topics').update({ status: 'queued', error: null, updated_at: new Date().toISOString() }).eq('id', id).eq('status', 'failed');
  if (error) return { success: false, error: '주제를 다시 넣지 못했습니다.' };
  revalidatePath('/admin/health', 'layout');
  return { success: true };
}

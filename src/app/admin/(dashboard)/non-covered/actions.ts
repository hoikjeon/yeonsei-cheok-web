'use server';

import { randomUUID } from 'node:crypto';
import { updateTag, revalidatePath } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { applyFeeCommand, type FeeCommand, type FeeSnapshot, type FeeHistory } from '@/lib/nonCovered';
import { feeClient, readFeeSnapshot, readFeeHistory, FEE_CACHE_TAG } from '@/lib/nonCoveredRepository';

export async function mutateFee(command: FeeCommand, expectedVersion: number): Promise<{
  error?: string; snapshot?: FeeSnapshot; history?: FeeHistory[]; success?: string;
}> {
  if (!(await isAdminAuthenticated())) return { error: '관리자 로그인이 만료되었습니다. 다시 로그인해주세요.' };
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 1) return { error: '페이지를 새로고침해주세요.' };
  try {
    const snapshot = await readFeeSnapshot();
    if (snapshot.version !== expectedVersion) return { error: '다른 변경이 먼저 저장되었습니다. 입력 내용을 복사한 뒤 새로고침하고 다시 확인해주세요.' };
    const change = applyFeeCommand(snapshot.content, command, randomUUID());
    const { error, data: version } = await feeClient().rpc('save_non_covered_catalog', {
      p_version: expectedVersion, p_content: change.content, p_action: change.action,
      p_label: change.label, p_before: change.before, p_after: change.after,
    });
    if (error) {
      if (error.message.includes('CATALOG_CONFLICT')) return { error: '다른 변경이 먼저 저장되었습니다. 입력 내용을 복사한 뒤 새로고침하고 다시 확인해주세요.' };
      console.error('Non-covered save failed:', error.code);
      return { error: '저장하지 못했습니다. 입력 내용은 유지되며 다시 시도할 수 있습니다.' };
    }
    updateTag(FEE_CACHE_TAG);
    revalidatePath('/non-covered');
    revalidatePath('/admin/non-covered');
    // History display failing must never turn a successful write into a retry prompt.
    let history: FeeHistory[] | undefined;
    try { history = await readFeeHistory(100, version); } catch { /* Refresh retrieves history later. */ }
    return { snapshot: { version, content: change.content }, history, success: '저장되어 홈페이지에 반영되었습니다.' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : '저장하지 못했습니다. 다시 시도해주세요.' };
  }
}

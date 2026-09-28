import Link from 'next/link';
import { requireAdmin } from '@/lib/adminAuth';
import { readFeeSnapshot, readFeeHistory } from '@/lib/nonCoveredRepository';
import AdminNonCovered from '@/components/admin/AdminNonCovered';
import type { FeeSnapshot, FeeHistory } from '@/lib/nonCovered';

export default async function AdminNonCoveredPage() {
  await requireAdmin();
  let snapshot: FeeSnapshot | undefined;
  let history: FeeHistory[] = [];
  try {
    snapshot = await readFeeSnapshot();
    history = await readFeeHistory(100, snapshot.version);
  } catch { snapshot = undefined; }
  if (!snapshot) {
    return <div className="p-8"><h1 className="text-2xl font-bold">비급여 관리</h1><p role="alert" className="my-6 rounded-lg bg-red-50 p-4 text-red-800">비급여 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p><Link href="/admin/non-covered" className="font-semibold text-blue-800">다시 불러오기</Link></div>;
  }
  return <AdminNonCovered initial={snapshot} initialHistory={history} />;
}

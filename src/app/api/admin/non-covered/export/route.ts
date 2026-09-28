import { isAdminAuthenticated } from '@/lib/adminAuth';
import { readFeeSnapshot, feeClient } from '@/lib/nonCoveredRepository';
import { buildFeeWorkbook } from '@/lib/nonCoveredExcel';
import { koreaDate, type FeeHistory } from '@/lib/nonCovered';

export const runtime = 'nodejs';
export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 401 });
  try {
    const snapshot = await readFeeSnapshot();
    const history: FeeHistory[] = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await feeClient().from('non_covered_history').select('*').lte('version', snapshot.version).order('version', { ascending: false }).range(offset, offset + 499);
      if (error) throw new Error('history export failed');
      history.push(...data as FeeHistory[]);
      if (data.length < 500) break;
    }
    const workbook = await buildFeeWorkbook(snapshot, history);
    const bytes = await workbook.xlsx.writeBuffer();
    const name = `연세척병원_비급여_${koreaDate()}.xlsx`;
    return new Response(new Uint8Array(bytes), { headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="non-covered.xlsx"; filename*=UTF-8''${encodeURIComponent(name)}`,
      'Cache-Control': 'private, no-store',
    } });
  } catch {
    return Response.json({ error: '엑셀을 만들지 못했습니다. 잠시 후 다시 시도해주세요.' }, { status: 503 });
  }
}

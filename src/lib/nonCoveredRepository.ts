import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import seed from './nonCoveredSeed.json';
import { type FeeCatalog, type FeeSnapshot, type FeeHistory, publicFeeSections } from './nonCovered';

export const FEE_CACHE_TAG = 'non-covered-catalog';
export function feeClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export async function readFeeSnapshot(): Promise<FeeSnapshot> {
  const { data, error } = await feeClient().from('non_covered_catalog').select('version,content').eq('id', 'main').maybeSingle();
  if (error || !data) {
    console.error('Non-covered read failed:', error?.code ?? 'missing catalogue');
    throw new Error('비급여 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
  return data as FeeSnapshot;
}
export async function readFeeHistory(limit = 100, version?: number): Promise<FeeHistory[]> {
  let query = feeClient().from('non_covered_history').select('*').order('version', { ascending: false });
  if (version !== undefined) query = query.lte('version', version);
  const { data, error } = await query.limit(limit);
  if (error) throw new Error('변경 이력을 불러오지 못했습니다.');
  return data as FeeHistory[];
}
export const getPublicFees = unstable_cache(async () => {
  const { data, error } = await feeClient().from('non_covered_catalog').select('content').eq('id', 'main').maybeSingle();
  // Only an unapplied migration can use the legacy catalogue. Transient failures must
  // not resurrect entries that an administrator has since deleted or changed.
  const missingTable = error?.code === 'PGRST205' || error?.code === '42P01';
  if (error && !missingTable) throw new Error('비급여 안내를 불러오지 못했습니다.');
  if (!data && !missingTable) throw new Error('비급여 데이터 초기화가 필요합니다.');
  const catalog = missingTable ? seed as FeeCatalog : data!.content as FeeCatalog;
  return { sections: publicFeeSections(catalog), publishedDate: catalog.publishedDate };
}, ['non-covered-catalog-v1'], { tags: [FEE_CACHE_TAG], revalidate: 60 });

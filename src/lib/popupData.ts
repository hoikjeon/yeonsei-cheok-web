import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const POPUP_CACHE_TAG = 'active-popups';

const POPUP_CACHE_SECONDS = 60;

/** 노출 자리는 1~3 뿐이므로 그 이상은 받아올 필요가 없습니다. */
const MAX_POPUP_COUNT = 3;

export type PopupItem = {
  id: string;
  title: string;
  image_url: string | null;
  display_slot: number | null;
  starts_at: string | null;
  ends_at: string | null;
};

/**
 * 켜져 있고 노출 자리가 지정된 팝업 목록. 노출 기간 판정은 하지 않습니다.
 *
 * 기간 판정을 캐시 안에서 하면 결과가 최대 60초까지 묵은 시각을 기준으로 남습니다.
 * 목록만 캐시하고 기간은 요청마다 확인하도록 분리했습니다.
 */
const getSlottedPopups = unstable_cache(
  async (): Promise<PopupItem[]> => {
    const { data, error } = await supabase
      .from('popups')
      // 팝업 화면에 쓰는 컬럼만 받습니다. content·label 은 노출하지 않습니다.
      .select('id,title,image_url,display_slot,starts_at,ends_at')
      .eq('is_active', true)
      .not('display_slot', 'is', null)
      .order('display_slot', { ascending: true })
      .limit(MAX_POPUP_COUNT);

    if (error) {
      console.error('Failed to load popups:', error.message);
      return [];
    }

    return (data ?? []) as PopupItem[];
  },
  ['active-popups'],
  {
    tags: [POPUP_CACHE_TAG],
    revalidate: POPUP_CACHE_SECONDS,
  },
);

const isWithinSchedule = (popup: PopupItem, now: number) => {
  if (popup.starts_at && now < new Date(popup.starts_at).getTime()) return false;
  if (popup.ends_at && now > new Date(popup.ends_at).getTime()) return false;
  return true;
};

/**
 * 지금 노출해야 할 팝업.
 *
 * 예전에는 MainPopup 이 브라우저에서 직접 조회했습니다. 그래서 하이드레이션이
 * 끝나기를 기다린 뒤 다시 Supabase 왕복(측정 200~570ms)을 기다려야 팝업이 떴고,
 * 이미지 요청은 그 다음에야 시작됐습니다. 서버에서 읽어 HTML 에 담으면 그 대기가
 * 사라지고, 첫 팝업 이미지도 Next 가 미리 불러오기 링크를 넣어줍니다.
 *
 * 관리자가 팝업을 저장하면 updateTag(POPUP_CACHE_TAG) 로 갱신됩니다.
 */
export async function getActivePopups(): Promise<PopupItem[]> {
  const popups = await getSlottedPopups();
  const now = Date.now();
  return popups.filter((popup) => isWithinSchedule(popup, now));
}

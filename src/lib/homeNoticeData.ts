import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import {
  DEFAULT_HOME_NOTICE_SETTINGS,
  HOME_NOTICE_SETTINGS_ID,
  normalizeHomeNoticeSettings,
  type HomeNoticeSettings,
} from './homeNoticeSettings';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const HOME_NOTICE_CACHE_TAG = 'home-notice-settings';

const HOME_NOTICE_CACHE_SECONDS = 60;

/**
 * 메인 공지바·푸터 공지를 서버에서 조회합니다.
 *
 * 예전에는 브라우저에서 받아왔기 때문에, 응답이 오기 전 약 1초 동안 코드에 박힌
 * 기본값이 먼저 보였다가 실제 값으로 바뀌었습니다. 서버에서 읽어 HTML 에 담으면
 * 그 깜빡임이 사라집니다.
 *
 * 관리자가 공지를 저장하면 updateTag(HOME_NOTICE_CACHE_TAG) 로 갱신됩니다.
 */
export const getHomeNoticeSettings = unstable_cache(
  async (): Promise<HomeNoticeSettings> => {
    const { data, error } = await supabase
      .from('home_notice_settings')
      .select('*')
      .eq('id', HOME_NOTICE_SETTINGS_ID)
      .maybeSingle();

    if (error) {
      console.error('Failed to load home notice settings:', error.message);
      return DEFAULT_HOME_NOTICE_SETTINGS;
    }

    // 행이 없을 때만 기본값을 씁니다.
    return normalizeHomeNoticeSettings(data);
  },
  ['home-notice-settings'],
  {
    tags: [HOME_NOTICE_CACHE_TAG],
    revalidate: HOME_NOTICE_CACHE_SECONDS,
  },
);

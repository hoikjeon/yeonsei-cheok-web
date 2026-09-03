'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { HOME_NOTICE_CACHE_TAG } from '@/lib/homeNoticeData';
import {
  HOME_NOTICE_SETTINGS_ID,
  normalizeHomeNoticeSettings,
  type HomeNoticeItem,
  type HomeNoticeSettings,
} from '@/lib/homeNoticeSettings';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const normalizeHref = (value: string) => {
  const href = value.trim();
  if (!href) return '/news/notice';
  if (
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith('tel:') ||
    href.startsWith('mailto:') ||
    href.startsWith('http://') ||
    href.startsWith('https://')
  ) {
    return href;
  }

  return `/${href}`;
};

// 관리자 설정을 읽어옵니다. anon 키에는 쓰기 권한이 없으므로
// 관리 화면은 이 서버 액션을 통해 service role로 조회·저장합니다.
export async function getHomeNoticeSettings(): Promise<{
  settings?: HomeNoticeSettings;
  error?: string;
}> {
  if (!(await isAdminAuthenticated())) {
    return { error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
  }

  const { data, error } = await supabase
    .from('home_notice_settings')
    .select('*')
    .eq('id', HOME_NOTICE_SETTINGS_ID)
    .maybeSingle();

  if (error) {
    return { error: '설정 테이블을 불러오지 못했습니다. setup_home_notice_bar.sql 적용 여부를 확인해주세요.' };
  }

  return { settings: normalizeHomeNoticeSettings(data) };
}

export async function updateHomeNoticeSettings(formData: FormData) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { error: '관리자 인증이 필요합니다. 다시 로그인해주세요.' };
    }

    const isActive = formData.get('is_active') === 'on';
    const closedMonth = (formData.get('closed_month') as string | null)?.trim() || '2026년 06월';
    const closedMessage = (formData.get('closed_message') as string | null)?.trim() || '휴진일이 없습니다.';
    const titles = formData.getAll('notice_title');
    const hrefs = formData.getAll('notice_href');

    const notices = titles
      .map((title, index): HomeNoticeItem | null => {
        if (typeof title !== 'string') return null;

        const normalizedTitle = title.trim();
        if (!normalizedTitle) return null;

        const href = hrefs[index];

        return {
          title: normalizedTitle,
          href: normalizeHref(typeof href === 'string' ? href : ''),
        };
      })
      .filter((notice): notice is HomeNoticeItem => notice !== null)
      .slice(0, 5);

    if (notices.length === 0) {
      return { error: '공지사항은 최소 1개 이상 입력해주세요.' };
    }

    const { error } = await supabase
      .from('home_notice_settings')
      .upsert(
        {
          id: HOME_NOTICE_SETTINGS_ID,
          is_active: isActive,
          notices,
          closed_month: closedMonth,
          closed_message: closedMessage,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) throw error;

    // 메인 공지바와 푸터가 서버에서 이 값을 읽으므로 캐시 태그를 갱신합니다.
    updateTag(HOME_NOTICE_CACHE_TAG);
    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/notice-bar');

    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' };
  }
}

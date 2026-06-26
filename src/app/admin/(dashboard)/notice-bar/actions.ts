'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { HOME_NOTICE_SETTINGS_ID, type HomeNoticeItem } from '@/lib/homeNoticeSettings';

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

const requireAdmin = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('admin_auth')?.value === 'true';
};

export async function updateHomeNoticeSettings(formData: FormData) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return { error: '관리자 인증이 필요합니다.' };

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

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/notice-bar');

    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' };
  }
}

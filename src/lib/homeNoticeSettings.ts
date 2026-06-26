export type HomeNoticeItem = {
  title: string;
  href: string;
};

export type HomeNoticeSettings = {
  id: string;
  is_active: boolean;
  notices: HomeNoticeItem[];
  closed_month: string;
  closed_message: string;
  updated_at?: string;
};

export const HOME_NOTICE_SETTINGS_ID = 'main';

export const DEFAULT_HOME_NOTICE_SETTINGS: HomeNoticeSettings = {
  id: HOME_NOTICE_SETTINGS_ID,
  is_active: true,
  notices: [
    {
      title: '[정상진료] 7.17(금) 제헌절 / 8.17(월) 대체공휴일',
      href: '/news/notice',
    },
  ],
  closed_month: '2026년 06월',
  closed_message: '휴진일이 없습니다.',
};

const normalizeHref = (value: unknown) => {
  if (typeof value !== 'string') return '/news/notice';

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

export const normalizeHomeNoticeItems = (items: unknown): HomeNoticeItem[] => {
  if (!Array.isArray(items)) return DEFAULT_HOME_NOTICE_SETTINGS.notices;

  const notices = items
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const source = item as Record<string, unknown>;
      const title = typeof source.title === 'string' ? source.title.trim() : '';
      if (!title) return null;

      return {
        title,
        href: normalizeHref(source.href),
      };
    })
    .filter((item): item is HomeNoticeItem => item !== null)
    .slice(0, 5);

  return notices.length > 0 ? notices : DEFAULT_HOME_NOTICE_SETTINGS.notices;
};

export const normalizeHomeNoticeSettings = (row: unknown): HomeNoticeSettings => {
  if (!row || typeof row !== 'object') return DEFAULT_HOME_NOTICE_SETTINGS;

  const source = row as Record<string, unknown>;

  return {
    id: typeof source.id === 'string' ? source.id : HOME_NOTICE_SETTINGS_ID,
    is_active: typeof source.is_active === 'boolean' ? source.is_active : true,
    notices: normalizeHomeNoticeItems(source.notices),
    closed_month:
      typeof source.closed_month === 'string' && source.closed_month.trim()
        ? source.closed_month.trim()
        : DEFAULT_HOME_NOTICE_SETTINGS.closed_month,
    closed_message:
      typeof source.closed_message === 'string' && source.closed_message.trim()
        ? source.closed_message.trim()
        : DEFAULT_HOME_NOTICE_SETTINGS.closed_message,
    updated_at: typeof source.updated_at === 'string' ? source.updated_at : undefined,
  };
};

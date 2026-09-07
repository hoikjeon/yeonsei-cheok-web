export const adminNewsTypes = ['notice', 'media', 'training', 'academic', 'youtube'] as const;

export type AdminNewsType = (typeof adminNewsTypes)[number];

export const adminNewsConfig: Record<
  AdminNewsType,
  {
    label: string;
    description: string;
    publicPath: string;
    titleLabel: string;
    contentLabel: string;
  }
> = {
  notice: {
    label: '공지사항',
    description: '병원 주요 안내와 휴진 소식을 등록합니다.',
    publicPath: '/news/notice',
    titleLabel: '공지 제목',
    contentLabel: '공지 내용',
  },
  media: {
    label: '언론·방송 보도',
    description: '방송 출연과 언론 보도 자료를 등록합니다.',
    publicPath: '/news/media',
    titleLabel: '보도 제목',
    contentLabel: '보도 내용',
  },
  training: {
    label: '트레이닝센터',
    description: '국내외 의료진 교육과 트레이닝 활동을 등록합니다.',
    publicPath: '/news/training',
    titleLabel: '소식 제목',
    contentLabel: '활동 내용',
  },
  academic: {
    label: '학술소식',
    description: '논문·학회·연구 활동 소식을 등록합니다.',
    publicPath: '/news/academic',
    titleLabel: '소식 제목',
    contentLabel: '연구 내용',
  },
  youtube: {
    label: '연세척TV',
    description: '유튜브 영상과 의학 정보를 등록합니다.',
    publicPath: '/news/youtube',
    titleLabel: '영상 제목',
    contentLabel: '영상 요약 및 설명',
  },
};

export function isAdminNewsType(value: string): value is AdminNewsType {
  return adminNewsTypes.includes(value as AdminNewsType);
}

export interface AdminNewsRecord {
  id: string;
  type: string;
  title: string;
  content: string;
  image_urls: string[] | null;
  video_url: string | null;
  source_name: string | null;
  source_url: string | null;
  created_at: string;
}

export function adminTypeForStoredType(type: string): AdminNewsType | null {
  return type === 'notice_pinned' ? 'notice' : isAdminNewsType(type) ? type : null;
}

export function storedNewsTypes(type?: AdminNewsType) {
  return type === 'notice' ? ['notice', 'notice_pinned'] : type ? [type] : [...adminNewsTypes, 'notice_pinned'];
}

export function safeNewsReturnTo(value: unknown, fallback = '/admin/news'): string {
  if (typeof value !== 'string' || !value.startsWith('/admin/news')) return fallback;
  try {
    const url = new URL(value, 'https://admin.local');
    if (url.origin !== 'https://admin.local' || url.pathname !== '/admin/news') return fallback;
    const params = new URLSearchParams();
    for (const key of ['type', 'q', 'sort', 'page']) {
      const entry = url.searchParams.get(key);
      if (entry) params.set(key, entry.slice(0, 200));
    }
    return '/admin/news' + (params.size ? `?${params}` : '');
  } catch { return fallback; }
}

export function validNewsId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

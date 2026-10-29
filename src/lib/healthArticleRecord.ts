// health_articles 테이블 행과 HealthArticle 사이의 변환, 관리자 입력 검증을 맡습니다.
// 서버 액션과 관리자 화면이 같은 규칙을 쓰도록 server-only 로 두지 않습니다.

import {
  HEALTH_CATEGORIES,
  HEALTH_REVIEWERS,
  HEALTH_TREATMENT_LINKS,
  toKstDate,
  type HealthArticle,
  type HealthCategoryId,
  type HealthImage,
  type HealthSection,
} from '@/lib/healthArticles';

/** 목록·검색·정렬에 쓰는 값은 칸으로, 나머지 본문은 content(jsonb) 한 칸에 둡니다. */
export type HealthArticleRow = {
  slug: string;
  category: string;
  title: string;
  is_published: boolean;
  /** 한국 날짜. publish_at 에서 따라 정해지며 정렬·표시에 씁니다. */
  published_at: string;
  /** 이 시각이 지나야 홈페이지에 보입니다(예약 발행). */
  publish_at: string;
  reviewed_at: string | null;
  source: 'manual' | 'auto';
  content: Partial<HealthArticle> | null;
  created_at: string;
  updated_at: string;
};

export type AdminHealthArticle = HealthArticle & {
  isPublished: boolean;
  /** ISO 시각 */
  publishAt: string;
  source: 'manual' | 'auto';
  updatedAt: string;
};

export type HealthArticleStatus = 'draft' | 'scheduled' | 'published';

export const HEALTH_STATUS_LABELS: Record<HealthArticleStatus, string> = {
  draft: '임시저장',
  scheduled: '예약',
  published: '공개',
};

export function healthArticleStatus(article: Pick<AdminHealthArticle, 'isPublished' | 'publishAt'>, now = Date.now()): HealthArticleStatus {
  if (!article.isPublished) return 'draft';
  return new Date(article.publishAt).getTime() > now ? 'scheduled' : 'published';
}

export const HEALTH_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const strings = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);

export function rowToHealthArticle(row: HealthArticleRow): AdminHealthArticle {
  const content = row.content ?? {};
  return {
    slug: row.slug,
    category: row.category === 'joint' ? 'joint' : 'spine',
    title: row.title,
    seoTitle: typeof content.seoTitle === 'string' && content.seoTitle ? content.seoTitle : undefined,
    description: typeof content.description === 'string' ? content.description : '',
    keywords: strings(content.keywords),
    summary: strings(content.summary),
    heroImage: content.heroImage?.src ? content.heroImage : undefined,
    sections: Array.isArray(content.sections) ? content.sections : [],
    warningSigns: strings(content.warningSigns),
    faq: Array.isArray(content.faq) ? content.faq : [],
    references: Array.isArray(content.references) ? content.references : [],
    relatedTreatments: Array.isArray(content.relatedTreatments) ? content.relatedTreatments : [],
    relatedSlugs: strings(content.relatedSlugs),
    thumbnail: typeof content.thumbnail === 'string' && content.thumbnail ? content.thumbnail : undefined,
    thumbnailPosition: content.thumbnailPosition === 'right' ? 'right' : undefined,
    reviewerId: typeof content.reviewerId === 'string' ? content.reviewerId : '',
    publishedAt: row.publish_at ? toKstDate(row.publish_at) : row.published_at,
    reviewedAt: row.reviewed_at ?? '',
    isPublished: row.is_published,
    publishAt: row.publish_at,
    source: row.source === 'auto' ? 'auto' : 'manual',
    updatedAt: row.updated_at,
  };
}

export function healthArticleToRow(article: HealthArticle, { isPublished, publishAt }: { isPublished: boolean; publishAt: string }) {
  const { slug, category, title, reviewedAt, ...rest } = article;
  // 게시일은 publish_at 칸에서 정해지므로 본문(content)에는 두지 않습니다.
  const content: Partial<HealthArticle> = { ...rest };
  delete content.publishedAt;
  return {
    slug,
    category,
    title,
    is_published: isPublished,
    publish_at: publishAt,
    published_at: toKstDate(publishAt),
    reviewed_at: reviewedAt || null,
    content,
  };
}

function text(value: unknown, label: string, { max, required = true }: { max: number; required?: boolean }) {
  const result = typeof value === 'string' ? value.trim() : '';
  if (required && !result) throw new Error(`${label}을(를) 입력해주세요.`);
  if (result.length > max) throw new Error(`${label}은(는) ${max.toLocaleString()}자 이하로 입력해주세요.`);
  return result;
}

function lines(value: unknown, label: string, { maxItems, maxLength }: { maxItems: number; maxLength: number }) {
  const result = strings(value).map((item) => item.trim()).filter(Boolean);
  if (result.length > maxItems) throw new Error(`${label}은(는) ${maxItems}개까지 입력할 수 있습니다.`);
  const tooLong = result.find((item) => item.length > maxLength);
  if (tooLong) throw new Error(`${label}의 한 줄은 ${maxLength}자 이하로 입력해주세요: "${tooLong.slice(0, 20)}…"`);
  return result;
}

function date(value: unknown, label: string) {
  const result = typeof value === 'string' ? value : '';
  if (!DATE_PATTERN.test(result) || Number.isNaN(new Date(`${result}T00:00:00Z`).getTime())) throw new Error(`${label}을(를) 올바르게 선택해주세요.`);
  return result;
}

function httpUrl(value: string, label: string) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error();
    return url.toString();
  } catch {
    throw new Error(`${label}는 http:// 또는 https://로 시작하는 주소를 입력해주세요.`);
  }
}

/** 사이트 이미지(/...) 또는 https 주소만 받습니다. 업로드 파일인지는 저장할 때 서버가 한 번 더 확인합니다. */
export function isAllowedHealthImageSrc(src: string) {
  return (src.startsWith('/') && !src.startsWith('//')) || src.startsWith('https://');
}

function image(value: unknown, label: string): HealthImage | undefined {
  const raw = (value ?? {}) as Record<string, unknown>;
  const src = typeof raw.src === 'string' ? raw.src.trim() : '';
  if (!src) return undefined;
  if (!isAllowedHealthImageSrc(src)) throw new Error(`${label}를 다시 선택해주세요.`);
  return {
    src,
    alt: text(raw.alt, `${label} 설명(alt)`, { max: 150 }),
    ...(raw.position === 'right' ? { position: 'right' as const } : {}),
  };
}

function section(value: unknown, index: number, usedIds: Set<string>): HealthSection {
  const raw = (value ?? {}) as Record<string, unknown>;
  const label = `본문 ${index + 1}번째 단락`;
  const heading = text(raw.heading, `${label} 소제목`, { max: 120 });
  const lead = text(raw.lead, `${label} 핵심 문장`, { max: 300, required: false });
  const paragraphs = lines(raw.paragraphs, `${label} 본문`, { maxItems: 30, maxLength: 3000 });
  const bullets = lines(raw.bullets, `${label} 목록`, { maxItems: 30, maxLength: 500 });

  let table: HealthSection['table'];
  const rawTable = raw.table as Record<string, unknown> | undefined;
  if (rawTable) {
    const columns = lines(rawTable.columns, `${label} 표 머리글`, { maxItems: 6, maxLength: 60 });
    const rows = Array.isArray(rawTable.rows) ? rawTable.rows.map((row) => strings(row).map((cell) => cell.trim())) : [];
    if (columns.length || rows.length) {
      if (columns.length < 2) throw new Error(`${label} 표는 머리글 칸이 2개 이상이어야 합니다.`);
      if (!rows.length || rows.length > 30) throw new Error(`${label} 표 내용은 1~30줄로 입력해주세요.`);
      const badRow = rows.findIndex((row) => row.length !== columns.length || row.some((cell) => !cell || cell.length > 300));
      if (badRow >= 0) throw new Error(`${label} 표 ${badRow + 1}번째 줄의 칸 수가 머리글(${columns.length}칸)과 다르거나 빈 칸이 있습니다.`);
      table = { caption: text(rawTable.caption, `${label} 표 제목`, { max: 120 }), columns, rows };
    }
  }
  if (!lead && !paragraphs.length && !bullets.length && !table) throw new Error(`${label}에 본문 내용을 입력해주세요.`);
  const sectionImage = image(raw.image, `${label} 이미지`);

  // 목차 주소(#id)는 한 번 정해지면 유지합니다. 새 단락은 비어 있는 번호를 씁니다.
  let id = typeof raw.id === 'string' && HEALTH_SLUG_PATTERN.test(raw.id) && raw.id.length <= 60 ? raw.id : '';
  if (!id || usedIds.has(id) || ['summary-heading', 'toc-heading', 'warning-signs', 'faq'].includes(id)) {
    let n = index + 1;
    while (usedIds.has(`section-${n}`)) n += 1;
    id = `section-${n}`;
  }
  usedIds.add(id);

  return {
    id,
    heading,
    ...(lead ? { lead } : {}),
    ...(paragraphs.length ? { paragraphs } : {}),
    ...(bullets.length ? { bullets } : {}),
    ...(table ? { table } : {}),
    ...(sectionImage ? { image: sectionImage } : {}),
  };
}

/** 관리자 화면에서 보낸 값을 검사해 저장할 글로 바꿉니다. 문제가 있으면 화면에 보여 줄 문장으로 throw 합니다. */
export function parseHealthArticleInput(input: unknown): HealthArticle {
  const raw = (input ?? {}) as Record<string, unknown>;

  const slug = typeof raw.slug === 'string' ? raw.slug.trim() : '';
  if (!HEALTH_SLUG_PATTERN.test(slug) || slug.length > 80) throw new Error('주소는 영문 소문자, 숫자, 하이픈(-)으로 80자 이하로 입력해주세요. 예: knee-arthritis-early-signs');
  if (!Object.hasOwn(HEALTH_CATEGORIES, raw.category as string)) throw new Error('분류를 선택해주세요.');
  // 검토 의료진은 실제로 검토를 마친 글에만 붙입니다. 비우면 검토 전 글로 저장됩니다.
  const reviewerId = typeof raw.reviewerId === 'string' ? raw.reviewerId : '';
  if (reviewerId && !Object.hasOwn(HEALTH_REVIEWERS, reviewerId)) throw new Error('검토 의료진을 다시 선택해주세요.');
  const reviewedAt = reviewerId ? date(raw.reviewedAt, '검토일') : '';
  const title = text(raw.title, '제목', { max: 120 });
  const seoTitle = text(raw.seoTitle, '검색 결과 제목', { max: 120, required: false });
  const description = text(raw.description, '목록 설명', { max: 300 });
  const summary = lines(raw.summary, '핵심 요약', { maxItems: 6, maxLength: 400 });
  if (!summary.length) throw new Error('핵심 요약을 입력해주세요.');
  const heroImage = image(raw.heroImage, '대표 이미지');


  const sectionsInput = Array.isArray(raw.sections) ? raw.sections : [];
  if (!sectionsInput.length) throw new Error('본문 단락을 1개 이상 작성해주세요.');
  if (sectionsInput.length > 20) throw new Error('본문 단락은 20개까지 만들 수 있습니다.');
  const usedIds = new Set<string>();
  const sections = sectionsInput.map((item, index) => section(item, index, usedIds));

  const faqInput = Array.isArray(raw.faq) ? raw.faq : [];
  if (faqInput.length > 20) throw new Error('자주 묻는 질문은 20개까지 입력할 수 있습니다.');
  const faq = faqInput
    .map((item) => item as Record<string, unknown>)
    .filter((item) => (typeof item.question === 'string' && item.question.trim()) || (typeof item.answer === 'string' && item.answer.trim()))
    .map((item, index) => ({
      question: text(item.question, `${index + 1}번째 질문`, { max: 200 }),
      answer: text(item.answer, `${index + 1}번째 질문의 답변`, { max: 2000 }),
    }));

  const referencesInput = Array.isArray(raw.references) ? raw.references : [];
  if (referencesInput.length > 20) throw new Error('참고문헌은 20개까지 입력할 수 있습니다.');
  const references = referencesInput
    .map((item) => item as Record<string, unknown>)
    .filter((item) => typeof item.label === 'string' && item.label.trim())
    .map((item, index) => {
      const url = typeof item.url === 'string' ? item.url.trim() : '';
      return {
        label: text(item.label, `${index + 1}번째 참고문헌`, { max: 400 }),
        ...(url ? { url: httpUrl(url, `${index + 1}번째 참고문헌 링크`) } : {}),
      };
    });

  // 고른 순서를 지키고, 이름은 정해 둔 진료 안내 목록의 것을 씁니다.
  const treatmentPaths = (Array.isArray(raw.relatedTreatments) ? raw.relatedTreatments : [])
    .map((item) => (typeof item === 'string' ? item : (item as { path?: unknown })?.path));
  const relatedTreatments = [...new Set(treatmentPaths)]
    .map((path) => HEALTH_TREATMENT_LINKS.find((link) => link.path === path))
    .filter((link) => link !== undefined);
  const relatedSlugs = [...new Set(strings(raw.relatedSlugs))].filter((item) => item !== slug && HEALTH_SLUG_PATTERN.test(item)).slice(0, 6);

  const thumbnail = typeof raw.thumbnail === 'string' ? raw.thumbnail.trim() : '';
  if (thumbnail && !(thumbnail.startsWith('/') && !thumbnail.startsWith('//')) && !thumbnail.startsWith('https://')) throw new Error('썸네일 이미지를 다시 선택해주세요.');

  return {
    slug,
    category: raw.category as HealthCategoryId,
    title,
    ...(seoTitle ? { seoTitle } : {}),
    description,
    keywords: lines(raw.keywords, '검색어', { maxItems: 20, maxLength: 40 }),
    summary,
    ...(heroImage ? { heroImage } : {}),
    sections,
    warningSigns: lines(raw.warningSigns, '바로 진료가 필요한 신호', { maxItems: 15, maxLength: 300 }),
    faq,
    references,
    relatedTreatments,
    relatedSlugs,
    ...(thumbnail ? { thumbnail, ...(raw.thumbnailPosition === 'right' ? { thumbnailPosition: 'right' as const } : {}) } : {}),
    reviewerId,
    // 게시일은 저장할 때 발행 시각(publish_at)의 한국 날짜로 다시 정해집니다.
    publishedAt: typeof raw.publishedAt === 'string' && DATE_PATTERN.test(raw.publishedAt) ? raw.publishedAt : '',
    reviewedAt,
  };
}

/** 글에 쓰인 모든 이미지 주소(썸네일·대표·단락 이미지) */
export function healthArticleImages(article: Pick<HealthArticle, 'thumbnail' | 'heroImage' | 'sections'>) {
  return [...new Set([article.thumbnail, article.heroImage?.src, ...article.sections.map((section) => section.image?.src)].filter((src): src is string => Boolean(src)))];
}

export type HealthPublishMode = 'draft' | 'now' | 'schedule';

/** 관리자가 고른 공개 방식을 저장할 값(is_published, publish_at)으로 바꿉니다. */
export function resolveHealthPublish(
  mode: unknown,
  at: unknown,
  previous: Pick<AdminHealthArticle, 'isPublished' | 'publishAt'> | null,
  now = new Date(),
): { isPublished: boolean; publishAt: string } {
  if (mode === 'schedule') {
    const time = typeof at === 'string' ? new Date(at) : new Date(NaN);
    if (Number.isNaN(time.getTime())) throw new Error('예약 발행 날짜와 시간을 선택해주세요.');
    return { isPublished: true, publishAt: time.toISOString() };
  }
  if (mode === 'now') {
    // 이미 공개된 글을 고칠 때는 처음 공개한 시각(게시일)을 그대로 둡니다.
    const keep = previous?.isPublished && new Date(previous.publishAt).getTime() <= now.getTime();
    return { isPublished: true, publishAt: keep ? previous.publishAt : now.toISOString() };
  }
  if (mode === 'draft') return { isPublished: false, publishAt: previous?.publishAt ?? now.toISOString() };
  throw new Error('공개 방식을 선택해주세요.');
}

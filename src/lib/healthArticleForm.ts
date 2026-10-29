// 관리자 건강정보 작성 화면의 입력 칸과 HealthArticle 사이를 바꿉니다.
// 줄바꿈으로 나눈 칸(요약·목록·표)을 배열로 풀고, 저장된 글을 다시 칸으로 되돌립니다.

import {
  DEFAULT_HEALTH_REVIEWER_ID,
  HEALTH_PUBLISH_SLOTS,
  HEALTH_TREATMENT_LINKS,
  kstToIso,
  toKstDate,
  toKstTime,
  type HealthArticle,
  type HealthCategoryId,
  type HealthImage,
  type HealthThumbnailPosition,
} from '@/lib/healthArticles';
import { healthArticleStatus, type AdminHealthArticle, type HealthPublishMode } from '@/lib/healthArticleRecord';

export type ImageForm = { src: string; alt: string; position: HealthThumbnailPosition };
export type SectionForm = {
  key: string; id: string; heading: string; lead: string; paragraphs: string; bullets: string; tableCaption: string; table: string; image: ImageForm;
};
export type FaqForm = { key: string; question: string; answer: string };
export type ReferenceForm = { key: string; label: string; url: string };
export type FormState = {
  slug: string; category: HealthCategoryId; title: string; seoTitle: string; description: string; keywords: string; summary: string;
  heroImage: ImageForm; sections: SectionForm[]; warningSigns: string; faq: FaqForm[]; references: ReferenceForm[];
  relatedTreatments: string[]; relatedSlugs: string[];
  /** 비우면 목록에서 대표 이미지를 씁니다. */
  thumbnail: string; thumbnailPosition: HealthThumbnailPosition;
  /** 의료진이 실제로 검토를 마쳤는지. 체크해야 글에 "검토" 표시가 붙습니다. */
  reviewed: boolean; reviewerId: string; reviewedAt: string;
  publishMode: HealthPublishMode; publishDate: string; publishTime: string;
  uploadedUrls: string[];
};

export const newKey = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Math.random()));
const today = () => toKstDate(new Date().toISOString());
const splitLines = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);
const emptyImage = (): ImageForm => ({ src: '', alt: '', position: 'center' });
const toImageForm = (image?: HealthImage): ImageForm => (image ? { src: image.src, alt: image.alt, position: image.position ?? 'center' } : emptyImage());
const fromImageForm = (image: ImageForm): HealthImage | undefined =>
  image.src ? { src: image.src, alt: image.alt.trim(), ...(image.position === 'right' ? { position: 'right' as const } : {}) } : undefined;
export const emptySection = (): SectionForm => ({ key: newKey(), id: '', heading: '', lead: '', paragraphs: '', bullets: '', tableCaption: '', table: '', image: emptyImage() });

export function toHealthForm(article?: AdminHealthArticle): FormState {
  if (!article) {
    return {
      slug: '', category: 'spine', title: '', seoTitle: '', description: '', keywords: '', summary: '',
      heroImage: emptyImage(), sections: [emptySection()], warningSigns: '', faq: [{ key: newKey(), question: '', answer: '' }], references: [{ key: newKey(), label: '', url: '' }],
      relatedTreatments: [], relatedSlugs: [], thumbnail: '', thumbnailPosition: 'center',
      reviewed: false, reviewerId: DEFAULT_HEALTH_REVIEWER_ID, reviewedAt: today(),
      publishMode: 'draft', publishDate: today(), publishTime: HEALTH_PUBLISH_SLOTS[0], uploadedUrls: [],
    };
  }
  const status = healthArticleStatus(article);
  return {
    slug: article.slug, category: article.category, title: article.title, seoTitle: article.seoTitle ?? '', description: article.description,
    keywords: article.keywords.join(', '), summary: article.summary.join('\n'), heroImage: toImageForm(article.heroImage),
    sections: article.sections.map((section) => ({
      key: newKey(), id: section.id, heading: section.heading, lead: section.lead ?? '',
      paragraphs: (section.paragraphs ?? []).join('\n\n'), bullets: (section.bullets ?? []).join('\n'),
      tableCaption: section.table?.caption ?? '',
      table: section.table ? [section.table.columns, ...section.table.rows].map((row) => row.join(' | ')).join('\n') : '',
      image: toImageForm(section.image),
    })),
    warningSigns: article.warningSigns.join('\n'),
    faq: article.faq.map((item) => ({ key: newKey(), ...item })),
    references: article.references.map((item) => ({ key: newKey(), label: item.label, url: item.url ?? '' })),
    relatedTreatments: article.relatedTreatments.map((item) => item.path), relatedSlugs: article.relatedSlugs,
    thumbnail: article.thumbnail ?? '', thumbnailPosition: article.thumbnailPosition ?? 'center',
    reviewed: Boolean(article.reviewedAt && article.reviewerId), reviewerId: article.reviewerId || DEFAULT_HEALTH_REVIEWER_ID, reviewedAt: article.reviewedAt || today(),
    publishMode: status === 'draft' ? 'draft' : status === 'scheduled' ? 'schedule' : 'now',
    publishDate: toKstDate(article.publishAt), publishTime: toKstTime(article.publishAt), uploadedUrls: [],
  };
}

/** 서버 검사와 같은 모양으로 바꿉니다. 빈 칸 검사는 서버가 맡고, 미리보기에서도 그대로 씁니다. */
export function healthFormToArticle(form: FormState): HealthArticle {
  return {
    slug: form.slug.trim(), category: form.category, title: form.title.trim(), seoTitle: form.seoTitle.trim() || undefined,
    description: form.description.trim(), keywords: form.keywords.split(/[,\n]/).map((item) => item.trim()).filter(Boolean),
    summary: splitLines(form.summary), heroImage: fromImageForm(form.heroImage),
    sections: form.sections.map((section) => {
      const tableLines = splitLines(section.table).map((line) => line.split('|').map((cell) => cell.trim()));
      return {
        id: section.id, heading: section.heading.trim(), lead: section.lead.trim() || undefined,
        paragraphs: section.paragraphs.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean),
        bullets: splitLines(section.bullets).length ? splitLines(section.bullets) : undefined,
        table: tableLines.length ? { caption: section.tableCaption.trim(), columns: tableLines[0], rows: tableLines.slice(1) } : undefined,
        image: fromImageForm(section.image),
      };
    }),
    warningSigns: splitLines(form.warningSigns),
    faq: form.faq.map(({ question, answer }) => ({ question: question.trim(), answer: answer.trim() })).filter((item) => item.question || item.answer),
    references: form.references.map(({ label, url }) => ({ label: label.trim(), url: url.trim() || undefined })).filter((item) => item.label),
    relatedTreatments: form.relatedTreatments
      .map((path) => HEALTH_TREATMENT_LINKS.find((link) => link.path === path))
      .filter((link) => link !== undefined),
    relatedSlugs: form.relatedSlugs,
    thumbnail: form.thumbnail || undefined, thumbnailPosition: form.thumbnail ? form.thumbnailPosition : undefined,
    reviewerId: form.reviewed ? form.reviewerId : '',
    reviewedAt: form.reviewed ? form.reviewedAt : '',
    // 미리보기용 게시일. 저장할 때는 서버가 발행 시각으로 다시 정합니다.
    publishedAt: form.publishDate,
  };
}

/** 저장할 때 함께 보내는 공개 방식 */
export function healthFormPublish(form: FormState) {
  return { publishMode: form.publishMode, publishAt: form.publishMode === 'schedule' ? kstToIso(form.publishDate, form.publishTime) : null };
}

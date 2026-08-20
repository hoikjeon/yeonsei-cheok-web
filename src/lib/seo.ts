import type { Metadata } from 'next';

export const SITE_NAME = '연세척병원';
export const DEFAULT_SITE_TITLE = '연세척병원 | 부산 척추·관절 진료';
export const DEFAULT_SITE_DESCRIPTION =
  '부산 부산진구 부암역 인근 연세척병원입니다. 신경외과·정형외과 전문의가 목·허리·무릎·어깨 질환을 진료하며 예약, 진료시간과 오시는 길을 안내합니다.';
export const DEFAULT_OG_IMAGE = '/generated/hero-hospital-exterior.png';

function normalizeSiteUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, '');
}

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  'http://localhost:3000';

export const SITE_URL = normalizeSiteUrl(configuredSiteUrl);

export function absoluteUrl(path = '/') {
  return new URL(path, `${SITE_URL}/`).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
};

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  type = 'website',
}: PageMetadataOptions): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      images: [
        {
          url: image,
          alt: `${title} 대표 이미지`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function summarizeForMetadata(value: string | null | undefined, fallback: string) {
  const normalized = value?.replace(/\s+/g, ' ').trim();
  if (!normalized) return fallback;
  return normalized.length > 160 ? `${normalized.slice(0, 157).trimEnd()}…` : normalized;
}

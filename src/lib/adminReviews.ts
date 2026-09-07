export const reviewCategories = ['목', '허리', '무릎', '어깨', '손발'] as const;

export type ReviewCategory = (typeof reviewCategories)[number];

export interface ReviewRecord {
  id: string;
  category: string;
  title: string;
  content: string;
  image_urls: string[] | null;
  created_at: string;
}

export type HomeReview = Pick<ReviewRecord, 'id' | 'category' | 'title' | 'created_at'>;

export function isReviewCategory(value: unknown): value is ReviewCategory {
  return typeof value === 'string' && reviewCategories.includes(value as ReviewCategory);
}

export function validReviewId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function safeReviewReturnTo(value: unknown, fallback = '/admin/reviews'): string {
  if (typeof value !== 'string' || !value.startsWith('/admin/reviews')) return fallback;
  try {
    const url = new URL(value, 'https://admin.local');
    if (url.origin !== 'https://admin.local' || url.pathname !== '/admin/reviews') return fallback;
    const params = new URLSearchParams();
    for (const key of ['category', 'q', 'sort', 'page']) {
      const entry = url.searchParams.get(key);
      if (entry) params.set(key, entry.slice(0, 200));
    }
    return '/admin/reviews' + (params.size ? `?${params}` : '');
  } catch { return fallback; }
}

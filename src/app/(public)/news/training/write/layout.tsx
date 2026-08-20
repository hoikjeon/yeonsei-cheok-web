import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '트레이닝센터 소식 작성',
  description: '연세척병원 트레이닝센터 소식 작성 페이지입니다.',
  path: '/news/training/write',
  noIndex: true,
});

export default function TrainingWriteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

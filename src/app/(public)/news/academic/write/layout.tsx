import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '학술소식 작성',
  description: '연세척병원 학술소식 작성 페이지입니다.',
  path: '/news/academic/write',
  noIndex: true,
});

export default function AcademicWriteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

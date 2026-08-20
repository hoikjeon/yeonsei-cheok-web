import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '치료체험후기 작성',
  description: '연세척병원 치료체험후기를 작성하는 회원 전용 페이지입니다.',
  path: '/board/reviews/write',
  noIndex: true,
});

export default function ReviewWriteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

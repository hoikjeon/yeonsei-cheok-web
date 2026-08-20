import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '공지사항 작성',
  description: '연세척병원 공지사항 작성 페이지입니다.',
  path: '/news/notice/write',
  noIndex: true,
});

export default function NoticeWriteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

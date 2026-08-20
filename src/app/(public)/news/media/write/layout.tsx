import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '방송·언론보도 작성',
  description: '연세척병원 방송·언론보도 작성 페이지입니다.',
  path: '/news/media/write',
  noIndex: true,
});

export default function MediaWriteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

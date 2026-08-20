import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '유튜브 의학소식 작성',
  description: '연세척병원 유튜브 의학소식 작성 페이지입니다.',
  path: '/news/youtube/write',
  noIndex: true,
});

export default function YoutubeWriteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

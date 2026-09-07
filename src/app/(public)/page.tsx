import HomePageContent from '@/components/HomePageContent';
import { getHomeNoticeSettings } from '@/lib/homeNoticeData';
import { getLatestReviews } from '@/lib/reviewsData';

// 서버 컴포넌트에서 공지 설정을 읽어 HTML 에 담습니다.
// 화면 구성은 상호작용이 많아 HomePageContent(클라이언트)가 맡습니다.
export default async function Home() {
  const [noticeSettings, latestReviews] = await Promise.all([
    getHomeNoticeSettings(),
    getLatestReviews(12),
  ]);

  return <HomePageContent noticeSettings={noticeSettings} latestReviews={latestReviews} />;
}

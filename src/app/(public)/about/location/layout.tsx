import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '오시는 길 | 부산 부암역 6번 출구',
  description:
    '연세척병원은 부산광역시 부산진구 가야대로 715, 부암역 6번 출구 앞에 있습니다. 지하철·버스·자가용 이용 방법과 주차 정보를 확인하세요.',
  path: '/about/location',
});

export default function LocationLayout({ children }: { children: React.ReactNode }) {
  return children;
}

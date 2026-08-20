import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '진료 예약',
  description:
    '부산 연세척병원 신경외과·정형외과 진료를 온라인으로 예약하세요. 진료과와 의료진, 희망 날짜와 시간을 선택할 수 있습니다.',
  path: '/reservation',
});

export default function ReservationLayout({ children }: { children: React.ReactNode }) {
  return children;
}

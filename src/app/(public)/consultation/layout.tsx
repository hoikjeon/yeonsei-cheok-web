import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '온라인 상담',
  description:
    '목·허리·무릎·어깨 통증과 치료에 관해 연세척병원 의료진에게 온라인 상담을 신청하세요. 상담 희망일과 문의 내용을 남겨주시면 안내해 드립니다.',
  path: '/consultation',
});

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return children;
}

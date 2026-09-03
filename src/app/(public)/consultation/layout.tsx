import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '온라인 상담',
  description:
    '목·허리·무릎·어깨 통증과 치료에 관해 연세척병원에 1:1 온라인 상담을 남길 수 있습니다.',
  path: '/consultation',
  noIndex: true,
});

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return children;
}

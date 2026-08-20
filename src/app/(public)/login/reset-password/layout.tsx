import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '비밀번호 재설정',
  description: '연세척병원 회원 계정의 비밀번호를 재설정하는 페이지입니다.',
  path: '/login/reset-password',
  noIndex: true,
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}

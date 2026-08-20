import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '로그인·회원가입',
  description: '연세척병원 회원 로그인 및 회원가입 페이지입니다.',
  path: '/login',
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

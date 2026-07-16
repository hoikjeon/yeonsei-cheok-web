'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
  DEFAULT_HOME_NOTICE_SETTINGS,
  HOME_NOTICE_SETTINGS_ID,
  type HomeNoticeItem,
  normalizeHomeNoticeSettings,
} from '@/lib/homeNoticeSettings';

const REPRESENTATIVE_PHONE = '051-935-1004';
const NAVER_RESERVATION_URL = 'https://m.booking.naver.com/booking/13/search?query=%EC%97%B0%EC%84%B8%EC%B2%99%EB%B3%91%EC%9B%90';
const KAKAO_CONSULT_URL = '#';

const FOOTER_FALLBACK_NOTICES: HomeNoticeItem[] = [
  ...DEFAULT_HOME_NOTICE_SETTINGS.notices,
  {
    title: '진료시간 안내: 평일 09:00-17:30 / 토요일 09:00-13:00',
    href: '/doctors#doctor-schedule',
  },
  {
    title: '온라인 예약 및 상담은 홈페이지에서 신청하실 수 있습니다.',
    href: '/reservation',
  },
];

// 하단 SNS 아이콘 위치·간격 미세 조정값: 상단 메뉴바와 동일한 구성입니다.
const FOOTER_SOCIAL_LAYOUT = {
  socialOffsetX: '0px',
  socialIconGap: '14px',
} as const;

const YouTubeMark = () => (
  <svg width="27" height="20" viewBox="0 0 27 20" fill="none" aria-hidden="true">
    <rect width="27" height="20" rx="5.5" fill="#FF0033" />
    <path d="M11 6.2L18 10L11 13.8V6.2Z" fill="#FFFFFF" />
  </svg>
);

const BlogMark = () => (
  <span
    aria-hidden="true"
    className="relative flex h-[18px] w-[25px] items-center justify-center rounded-[3px] bg-[#03C75A] font-montserrat text-[8px] font-bold leading-none tracking-[-0.03em] text-white after:absolute after:-bottom-[3px] after:left-[6px] after:h-[4px] after:w-[6px] after:bg-[#03C75A] after:[clip-path:polygon(0_0,100%_0,0_100%)]"
  >
    blog
  </span>
);

const InstagramMark = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="footer-instagram-gradient" x1="2" y1="18" x2="18" y2="2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB600" />
        <stop offset="0.35" stopColor="#FF3A63" />
        <stop offset="0.68" stopColor="#D629A2" />
        <stop offset="1" stopColor="#6A45E6" />
      </linearGradient>
    </defs>
    <rect x="1.7" y="1.7" width="16.6" height="16.6" rx="5.2" stroke="url(#footer-instagram-gradient)" strokeWidth="2.1" />
    <circle cx="10" cy="10" r="3.75" stroke="url(#footer-instagram-gradient)" strokeWidth="2.1" />
    <circle cx="15" cy="5" r="1.15" fill="url(#footer-instagram-gradient)" />
  </svg>
);

// 채널 주소가 확정되면 각 href만 교체하면 바로 링크로 동작합니다.
const SOCIAL_LINKS = [
  { name: '유튜브', href: '', icon: <YouTubeMark /> },
  { name: '네이버 블로그', href: '', icon: <BlogMark /> },
  { name: '인스타그램', href: '', icon: <InstagramMark /> },
];

const POLICY_LINKS = [
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '이용약관', href: '/terms' },
  { label: '환자의권리와장전', href: '/rights' },
  { label: '비급여안내', href: '/non-covered' },
  { label: '오시는 길', href: '/about/location' },
];

const isExternalHref = (href: string) =>
  href.startsWith('http://') || href.startsWith('https://') || href.startsWith('tel:') || href.startsWith('mailto:');

const getTopFooterNotices = (items: HomeNoticeItem[]) => {
  const seen = new Set<string>();

  return [...items, ...FOOTER_FALLBACK_NOTICES].filter((notice) => {
    const key = `${notice.title}-${notice.href}`;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  }).slice(0, 3);
};

function NoticeAnchor({ notice }: { notice: HomeNoticeItem }) {
  const className =
    'group flex min-h-[64px] items-center justify-between gap-3 border-b border-slate-200/80 py-4 text-ink transition-colors last:border-b-0 hover:text-primary md:min-h-[80px] md:gap-5 md:py-5';

  const content = (
    <>
      <span className="min-w-0 break-keep text-body-lg font-medium tracking-tight md:leading-snug">
        {notice.title}
      </span>
      <ArrowRight
        size={21}
        strokeWidth={1.9}
        className="hidden shrink-0 translate-x-[-8px] text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block"
        aria-hidden="true"
      />
    </>
  );

  if (isExternalHref(notice.href)) {
    return (
      <a href={notice.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={notice.href} className={className}>
      {content}
    </Link>
  );
}

const Footer = () => {
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const [notices, setNotices] = useState<HomeNoticeItem[]>(FOOTER_FALLBACK_NOTICES);

  useEffect(() => {
    let isMounted = true;

    const fetchFooterNotices = async () => {
      const { data } = await supabase
        .from('home_notice_settings')
        .select('*')
        .eq('id', HOME_NOTICE_SETTINGS_ID)
        .maybeSingle();

      if (!isMounted || !data) return;

      const normalized = normalizeHomeNoticeSettings(data);
      const visibleNotices = normalized.is_active ? normalized.notices : [];
      setNotices(getTopFooterNotices(visibleNotices));
    };

    fetchFooterNotices();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  if (pathname.startsWith('/admin')) return null;

  const footerNotices = getTopFooterNotices(notices);

  return (
    <footer className="border-t-2 border-primary bg-[#F5F6F8] py-12 text-ink md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
        <div className="grid grid-cols-1 gap-10 md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] lg:gap-16">
          <section aria-labelledby="footer-notice-title">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="footer-notice-title" className="text-h2 tracking-tight">
                  공지사항
                </h2>
                <p className="mt-3 break-keep text-body text-ink-sub md:mt-5 md:text-[17px] md:leading-relaxed">
                  중요한 소식 놓치지 않도록 안내드립니다.
                </p>
              </div>
              <Link
                href="/news/notice"
                className="inline-flex h-12 items-center justify-center gap-4 rounded-full border border-ink px-6 text-[14px] font-bold tracking-tight text-ink transition-all hover:border-primary hover:bg-primary hover:text-white md:h-14 md:gap-7 md:px-7 md:text-[15px]"
              >
                자세히보기
                <ArrowRight size={20} strokeWidth={1.8} />
              </Link>
            </div>

            <div className="mt-8 border-y-2 border-ink/85 md:mt-14">
              {footerNotices.map((notice) => (
                <NoticeAnchor key={`${notice.title}-${notice.href}`} notice={notice} />
              ))}
            </div>
          </section>

          <section aria-labelledby="footer-reservation-title">
            <h2 id="footer-reservation-title" className="text-h2 tracking-tight">
              예약 · 상담
            </h2>
            <p className="mt-3 break-keep text-body text-ink-sub md:mt-5 md:text-[17px] md:leading-relaxed">
              편하신 방법으로 예약/상담을 진행해보세요.
            </p>

            <Link
              href={`tel:${REPRESENTATIVE_PHONE.replace(/-/g, '')}`}
              className="mt-8 inline-flex max-w-full flex-wrap items-center gap-2.5 text-[28px] font-extrabold leading-none tracking-tight text-ink transition-colors hover:text-primary sm:text-[32px] md:mt-14 md:gap-4 md:text-[42px]"
            >
              <Phone size={28} fill="currentColor" strokeWidth={0} className="shrink-0 md:h-[33px] md:w-[33px]" aria-hidden="true" />
              {REPRESENTATIVE_PHONE}
            </Link>

            <div className="mt-10 grid grid-cols-2 gap-2.5 md:mt-16 md:gap-3">
              <a
                href={NAVER_RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative min-h-[96px] overflow-hidden rounded-lg bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.24),transparent_30%),linear-gradient(135deg,#04170E_0%,#047A46_52%,#18A66B_100%)] p-4 text-white shadow-[0_22px_54px_-38px_rgba(0,96,58,0.9)] transition-transform duration-300 hover:scale-[1.035] md:min-h-[116px] md:p-6"
              >
                <span className="relative z-10 flex items-center gap-1.5 break-keep text-[14px] font-bold leading-snug tracking-tight sm:gap-2 sm:text-[15px] md:gap-3 md:text-[17px]">
                  네이버 바로 예약
                  <ChevronRight size={19} strokeWidth={1.9} className="shrink-0 transition-transform group-hover:translate-x-1 md:h-[23px] md:w-[23px]" />
                </span>
                <span className="absolute bottom-4 right-4 font-montserrat text-[36px] font-bold leading-none text-white md:bottom-5 md:right-6 md:text-[46px]">
                  N
                </span>
              </a>

              <a
                href={KAKAO_CONSULT_URL}
                className="group relative min-h-[96px] overflow-hidden rounded-lg bg-[radial-gradient(circle_at_84%_70%,rgba(255,255,255,0.35),transparent_24%),linear-gradient(135deg,#FFC915_0%,#FFAE13_100%)] p-4 text-white shadow-[0_22px_54px_-38px_rgba(255,174,19,0.9)] transition-transform duration-300 hover:scale-[1.035] md:min-h-[116px] md:p-6"
              >
                <span className="relative z-10 flex items-center gap-1.5 break-keep text-[14px] font-bold leading-snug tracking-tight sm:gap-2 sm:text-[15px] md:gap-3 md:text-[17px]">
                  카카오톡 1:1 상담
                  <ChevronRight size={19} strokeWidth={1.9} className="shrink-0 transition-transform group-hover:translate-x-1 md:h-[23px] md:w-[23px]" />
                </span>
                <span className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white font-montserrat text-[10px] font-bold text-[#FFB800] md:bottom-5 md:right-5 md:h-9 md:w-9 md:text-[11px]">
                  TALK
                </span>
              </a>
            </div>
          </section>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-slate-300/80 pt-8 md:mt-20 md:gap-10 md:pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src="/ch-logo-color.png"
                alt="연세척병원"
                width={260}
                height={72}
                className="h-10 w-auto md:h-12"
              />
            </Link>

            <address className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 break-keep text-[13px] font-medium not-italic leading-[1.65] text-ink-sub md:mt-7 md:gap-x-6 md:gap-y-2 md:text-[15px] md:leading-relaxed">
              <span>연세척병원</span>
              <span>부산광역시 부산진구 가야대로 715 (당감동 974, 위너스빌딩 1,2,3,4층)</span>
              <span>
                <strong className="font-bold text-ink">대표전화</strong> {REPRESENTATIVE_PHONE}
              </span>
              <span>
                <strong className="font-bold text-ink">FAX</strong> 051-935-1008
              </span>
              <span>
                <strong className="font-bold text-ink">사업자등록번호</strong> 605-92-44375
              </span>
              <span>
                <strong className="font-bold text-ink">병원장</strong> 이남, 김동한
              </span>
            </address>
          </div>

          <div className="flex flex-col gap-6 md:gap-8 lg:items-end">
            <nav
              aria-label="소셜 미디어"
              style={{
                columnGap: FOOTER_SOCIAL_LAYOUT.socialIconGap,
                transform: `translateX(${FOOTER_SOCIAL_LAYOUT.socialOffsetX})`,
              }}
              className="flex h-9 items-center"
            >
              {SOCIAL_LINKS.map((social) => {
                const mark = (
                  <span className="flex h-8 w-8 items-center justify-center transition-transform duration-200 hover:scale-105">
                    {social.icon}
                  </span>
                );

                return social.href ? (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    {mark}
                  </a>
                ) : (
                  <span
                    key={social.name}
                    role="img"
                    aria-label={`${social.name} 링크 준비 중`}
                  >
                    {mark}
                  </span>
                );
              })}
            </nav>

            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-bold leading-relaxed text-ink md:gap-x-6 md:text-[14px]">
              {POLICY_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

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

const InstagramMark = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="6" y="6" width="20" height="20" rx="6" />
    <circle cx="16" cy="16" r="5" />
    <circle cx="22" cy="10" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    name: '인스타그램',
    href: '#',
    icon: <InstagramMark />,
  },
  {
    name: '블로그',
    href: '#',
    icon: (
      <span className="font-montserrat text-[32px] font-black leading-none tracking-[-0.08em]">
        bl
      </span>
    ),
  },
  {
    name: '카카오톡 채널',
    href: '#',
    icon: (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-current font-montserrat text-[13px] font-black leading-none text-white transition-colors group-hover:bg-slate-400">
        Ch
      </span>
    ),
  },
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
    'group flex min-h-[80px] items-center justify-between gap-5 border-b border-slate-200/80 py-5 text-ink transition-colors last:border-b-0 hover:text-primary';

  const content = (
    <>
      <span className="min-w-0 text-[17px] font-black leading-snug tracking-tight md:text-[18px]">
        {notice.title}
      </span>
      <ArrowRight
        size={21}
        strokeWidth={1.9}
        className="shrink-0 translate-x-[-8px] text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
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
    <footer className="border-t-2 border-primary bg-[#F5F6F8] py-16 text-ink md:py-20">
      <div className="mx-auto max-w-[1540px] px-7 xl:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] lg:gap-16">
          <section aria-labelledby="footer-notice-title">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="footer-notice-title" className="text-[34px] font-black leading-tight tracking-tight md:text-[40px]">
                  공지사항
                </h2>
                <p className="mt-5 text-[17px] font-medium leading-relaxed text-ink-sub">
                  중요한 소식 놓치지 않도록 안내드립니다.
                </p>
              </div>
              <Link
                href="/news/notice"
                className="inline-flex h-14 items-center justify-center gap-7 rounded-full border border-ink px-7 text-[15px] font-black tracking-tight text-ink transition-all hover:border-primary hover:bg-primary hover:text-white"
              >
                자세히보기
                <ArrowRight size={20} strokeWidth={1.8} />
              </Link>
            </div>

            <div className="mt-14 border-y-2 border-ink/85">
              {footerNotices.map((notice) => (
                <NoticeAnchor key={`${notice.title}-${notice.href}`} notice={notice} />
              ))}
            </div>
          </section>

          <section aria-labelledby="footer-reservation-title">
            <h2 id="footer-reservation-title" className="text-[34px] font-black leading-tight tracking-tight md:text-[40px]">
              예약 · 상담
            </h2>
            <p className="mt-5 text-[17px] font-medium leading-relaxed text-ink-sub">
              편하신 방법으로 예약/상담을 진행해보세요.
            </p>

            <Link
              href={`tel:${REPRESENTATIVE_PHONE.replace(/-/g, '')}`}
              className="mt-14 inline-flex items-center gap-4 text-[36px] font-black leading-none tracking-tight text-ink transition-colors hover:text-primary md:text-[45px]"
            >
              <Phone size={33} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              {REPRESENTATIVE_PHONE}
            </Link>

            <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={NAVER_RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative min-h-[116px] overflow-hidden rounded-lg bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.24),transparent_30%),linear-gradient(135deg,#04170E_0%,#047A46_52%,#18A66B_100%)] p-6 text-white shadow-[0_22px_54px_-38px_rgba(0,96,58,0.9)] transition-transform duration-300 hover:scale-[1.035]"
              >
                <span className="relative z-10 flex items-center gap-3 text-[17px] font-black tracking-tight">
                  네이버 바로 예약
                  <ChevronRight size={23} strokeWidth={1.9} className="transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute bottom-5 right-6 font-montserrat text-[46px] font-black leading-none text-white">
                  N
                </span>
              </a>

              <a
                href={KAKAO_CONSULT_URL}
                className="group relative min-h-[116px] overflow-hidden rounded-lg bg-[radial-gradient(circle_at_84%_70%,rgba(255,255,255,0.35),transparent_24%),linear-gradient(135deg,#FFC915_0%,#FFAE13_100%)] p-6 text-white shadow-[0_22px_54px_-38px_rgba(255,174,19,0.9)] transition-transform duration-300 hover:scale-[1.035]"
              >
                <span className="relative z-10 flex items-center gap-3 text-[17px] font-black tracking-tight">
                  카카오톡 1:1 상담
                  <ChevronRight size={23} strokeWidth={1.9} className="transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white font-montserrat text-[11px] font-black text-[#FFB800]">
                  TALK
                </span>
              </a>
            </div>
          </section>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 border-t border-slate-300/80 pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src="/ch-logo-color.png"
                alt="연세척병원"
                width={260}
                height={72}
                className="h-12 w-auto"
              />
            </Link>

            <address className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-medium not-italic leading-relaxed text-ink-sub md:text-[15px]">
              <span>연세척병원</span>
              <span>부산광역시 부산진구 가야대로 715 (당감동 974, 위너스빌딩 1,2,3,4층)</span>
              <span>
                <strong className="font-black text-ink">대표전화</strong> {REPRESENTATIVE_PHONE}
              </span>
              <span>
                <strong className="font-black text-ink">FAX</strong> 051-935-1008
              </span>
              <span>
                <strong className="font-black text-ink">사업자등록번호</strong> 605-92-44375
              </span>
              <span>
                <strong className="font-black text-ink">병원장</strong> 이남, 김동한
              </span>
            </address>
          </div>

          <div className="flex flex-col gap-8 lg:items-end">
            <div className="flex items-center gap-7">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="group flex h-10 min-w-10 items-center justify-center text-black transition-colors hover:text-slate-400"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-black text-ink">
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

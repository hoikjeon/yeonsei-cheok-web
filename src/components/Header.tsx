'use client';

import { useState, useRef, useEffect, type FocusEvent, type KeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  User, 
  Phone,
  CalendarCheck,
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { signOut } from '@/app/(public)/login/actions';

type MenuItem = {
  name: string;
  desc: string;
  href: string;
};

type MenuData = {
  id: string;
  name: string;
  href: string;
  subTitle: string;
  items: MenuItem[];
};

const MENU_DATA: MenuData[] = [
  {
    id: 'about',
    name: '병원소개',
    href: '/about',
    subTitle: '연세척병원의 진심을 전합니다',
    items: [
      { name: '연세척병원 소개', desc: '환자 중심의 정직한 진료 원칙', href: '/about' },
      { name: '의료진 소개', desc: '대학병원 교수 출신의 전문의', href: '/doctors' },
      { name: '첨단 의료 장비', desc: '대학병원급 MRI·디지털 X-ray 시스템', href: '/about/equipment' },
      { name: '오시는 길', desc: '더 가까운 연세척의 위치 안내', href: '/about/location' },
    ]
  },
  {
    id: 'ube',
    name: '양방향 척추내시경',
    href: '/treatments/spine/ube',
    subTitle: '절개를 최소화한 정밀 척추 치료',
    items: [
      { name: 'UBE 소개', desc: '두 개의 작은 통로로 접근하는 척추내시경 치료', href: '/treatments/spine/ube' },
      { name: '치료 장점', desc: '정상 조직 손상을 줄이는 최소침습 접근', href: '/treatments/spine/ube#benefits' },
      { name: '적용대상', desc: '경추·흉추·요추 적용대상 안내', href: '/treatments/spine/ube#decompression-candidates' },
      { name: '치료 과정', desc: '진단부터 회복까지 단계별 치료 흐름', href: '/treatments/spine/ube#process' },
      { name: '혁신적인 수술치료', desc: '최신 수술 기법을 활용한 혁신적인 치료', href: '/treatments/spine/ube/innovative' },
    ]
  },
  {
    id: 'spine',
    name: '척추센터',
    href: '/treatments/spine',
    subTitle: '통증의 근본을 찾는 정교한 치료',
    items: [
      { name: '목디스크', desc: '목·어깨 통증과 팔 저림의 원인을 정밀하게 확인합니다', href: '/treatments/spine/neck-disc' },
      { name: '허리디스크', desc: '허리 통증과 다리 저림·당김 증상을 맞춤 진단합니다', href: '/treatments/spine/disc' },
      { name: '수술 치료', desc: 'UBE 양방향 척추내시경 중심의 최소침습 치료입니다', href: '/treatments/spine/ube' },
      { name: '비수술치료', desc: '주사·시술·재활로 수술 부담을 낮추는 치료입니다', href: '/treatments/spine/non-surgical' },
      { name: '도수 재활 클리닉', desc: '도수·물리·자세교정으로 회복과 재발을 막습니다', href: '/treatments/spine/rehab' },
    ]
  },
  {
    id: 'joint',
    name: '관절센터',
    href: '/treatments/joint',
    subTitle: '자유로운 움직임을 위한 정교한 치료',
    items: [
      { name: '무릎 관절', desc: '퇴행성 관절염·연골 손상 등 무릎 통증 진단', href: '/treatments/joint/knee' },
      { name: '어깨 관절', desc: '오십견·회전근개 등 어깨 통증 맞춤 진료', href: '/treatments/joint/shoulder' },
      { name: '손목·발목 관절', desc: '손목·손가락과 발목·족저근막 통증 통합 진단', href: '/treatments/joint/wrist-ankle' },
      { name: '무릎관절내시경', desc: '작은 절개로 무릎 속을 직접 보는 주력 치료', href: '/treatments/joint/knee-arthroscopy' },
    ]
  },
  {
    id: 'news',
    name: '병원소식',
    href: '/news/notice',
    subTitle: '연세척병원의 쉼 없는 발자취',
    items: [
      { name: '공지사항', desc: '병원 운영 및 진료에 관한 주요 안내', href: '/news/notice' },
      { name: '언론/방송 보도', desc: '다양한 매체에서 주목하는 의료 기술', href: '/news/media' },
      { name: '연세척 학술의학', desc: '지속적인 연구와 논문 발표 실적', href: '/news/academic' },
      { name: '연세척tv', desc: '전문의가 직접 알려주는 알기 쉬운 의학 정보', href: '/news/youtube' },
      { name: '국제 트레이닝 센터', desc: '해외 의료진에게 전수하는 척추내시경 노하우', href: '/news/training' },
    ]
  },
  {
    id: 'community',
    name: '커뮤니티',
    href: '/board/reviews',
    subTitle: '소통과 공감으로 완성되는 치유',
    items: [
      { name: '치료체험후기', desc: '완치의 기쁨을 누리는 환자분들의 생생한 수기', href: '/board/reviews' },
      { name: '온라인 상담', desc: '증상에 대한 궁금증을 전문 상담사가 직접 상담해 드립니다', href: '/consultation' },
      { name: '온라인 예약', desc: '원하시는 스케줄에 맞춰 신속하고 간편한 진료 예약', href: '/reservation' },
      { name: '자주하는 질문', desc: '진료, 입원, 서류 발급 등 잦은 문의 안내', href: '/board/faq' },
    ]
  },
];

const REPRESENTATIVE_PHONE = '051-935-1004';
const NAVER_RESERVATION_URL = 'https://m.booking.naver.com/booking/13/search?query=%EC%97%B0%EC%84%B8%EC%B2%99%EB%B3%91%EC%9B%90';

const CLINIC_HOURS = [
  { label: '평일', time: '09:00 - 17:30', tone: 'text-primary' },
  { label: '점심시간', time: '12:30 - 13:00', tone: 'text-ink-muted' },
  { label: '토요일', time: '09:00 - 13:00', tone: 'text-ink-sub' },
];

// 헤더 위치 미세 조정값: 양수는 오른쪽, 음수는 왼쪽으로 이동합니다.
const HEADER_DESKTOP_LAYOUT = {
  navigationOffsetX: '0px',
  socialOffsetX: '0px',
  socialIconGap: '12px',
  socialToAccountGap: '18px',
} as const;

const YouTubeMark = ({ isLight }: { isLight: boolean }) => (
  <svg width="23" height="17" viewBox="0 0 27 20" fill="none" aria-hidden="true">
    <rect width="27" height="20" rx="5.5" fill={isLight ? '#FF0033' : '#FFFFFF'} />
    <path d="M11 6.2L18 10L11 13.8V6.2Z" fill={isLight ? '#FFFFFF' : '#071A3D'} />
  </svg>
);

const BlogMark = ({ isLight }: { isLight: boolean }) => (
  <span
    aria-hidden="true"
    className={`relative flex h-[18px] w-[25px] items-center justify-center rounded-[3px] font-montserrat text-[8px] font-bold leading-none tracking-[-0.03em] after:absolute after:-bottom-[3px] after:left-[6px] after:h-[4px] after:w-[6px] after:[clip-path:polygon(0_0,100%_0,0_100%)] ${
      isLight
        ? 'bg-[#03C75A] text-white after:bg-[#03C75A]'
        : 'bg-white text-navy-950 after:bg-white'
    }`}
  >
    blog
  </span>
);

const InstagramMark = ({ isLight }: { isLight: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="header-instagram-gradient" x1="2" y1="18" x2="18" y2="2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB600" />
        <stop offset="0.35" stopColor="#FF3A63" />
        <stop offset="0.68" stopColor="#D629A2" />
        <stop offset="1" stopColor="#6A45E6" />
      </linearGradient>
    </defs>
    <rect
      x="1.7"
      y="1.7"
      width="16.6"
      height="16.6"
      rx="5.2"
      stroke={isLight ? 'url(#header-instagram-gradient)' : '#FFFFFF'}
      strokeWidth="2.1"
    />
    <circle
      cx="10"
      cy="10"
      r="3.75"
      stroke={isLight ? 'url(#header-instagram-gradient)' : '#FFFFFF'}
      strokeWidth="2.1"
    />
    <circle cx="15" cy="5" r="1.15" fill={isLight ? 'url(#header-instagram-gradient)' : '#FFFFFF'} />
  </svg>
);

// 채널 주소가 확정되면 각 href만 교체하면 바로 링크로 동작합니다.
const HEADER_SOCIAL_LINKS = [
  { name: '유튜브', href: '', icon: YouTubeMark },
  { name: '네이버 블로그', href: '', icon: BlogMark },
  { name: '인스타그램', href: '', icon: InstagramMark },
];

const HeaderSocialLinks = ({ isLight }: { isLight: boolean }) => (
  <nav
    aria-label="소셜 미디어"
    style={{
      columnGap: HEADER_DESKTOP_LAYOUT.socialIconGap,
      transform: `translateX(${HEADER_DESKTOP_LAYOUT.socialOffsetX})`,
    }}
    className="hidden h-10 shrink-0 items-center px-3 lg:flex"
  >
    {HEADER_SOCIAL_LINKS.map((social) => {
      const SocialIcon = social.icon;
      const mark = (
        <span className="flex h-7 items-center justify-center transition-transform duration-200 hover:scale-105">
          <SocialIcon isLight={isLight} />
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
);

const Header = () => {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const isMenuOpen = activeMenu !== null;
  const activeMenuData = MENU_DATA.find((menu) => menu.id === activeMenu);
  const isHomePage = pathname === '/';
  const isLightHeader = !isHomePage || isHeaderHovered || isMenuOpen || isMobileMenuOpen;
  

  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const supabase = createClient();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuOpenTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearMenuTimers = () => {
    if (menuOpenTimeoutRef.current) {
      clearTimeout(menuOpenTimeoutRef.current);
      menuOpenTimeoutRef.current = null;
    }
    if (menuCloseTimeoutRef.current) {
      clearTimeout(menuCloseTimeoutRef.current);
      menuCloseTimeoutRef.current = null;
    }
  };

  const openMegaMenu = (menuId: string) => {
    if (menuCloseTimeoutRef.current) {
      clearTimeout(menuCloseTimeoutRef.current);
      menuCloseTimeoutRef.current = null;
    }
    if (menuOpenTimeoutRef.current) clearTimeout(menuOpenTimeoutRef.current);

    menuOpenTimeoutRef.current = setTimeout(() => {
      setActiveMenu(menuId);
      menuOpenTimeoutRef.current = null;
    }, activeMenu ? 80 : 180);
  };

  const openMegaMenuImmediately = (menuId: string) => {
    clearMenuTimers();
    setActiveMenu(menuId);
  };

  const closeMegaMenu = () => {
    if (menuOpenTimeoutRef.current) {
      clearTimeout(menuOpenTimeoutRef.current);
      menuOpenTimeoutRef.current = null;
    }
    if (menuCloseTimeoutRef.current) clearTimeout(menuCloseTimeoutRef.current);

    menuCloseTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      menuCloseTimeoutRef.current = null;
    }, 240);
  };

  const closeMegaMenuImmediately = () => {
    clearMenuTimers();
    setActiveMenu(null);
  };

  const keepMegaMenuOpen = () => {
    if (menuCloseTimeoutRef.current) {
      clearTimeout(menuCloseTimeoutRef.current);
      menuCloseTimeoutRef.current = null;
    }
  };

  const handleHeaderBlur = (event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && event.currentTarget.contains(nextTarget)) return;
    closeMegaMenuImmediately();
  };

  const handleHeaderKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      closeMegaMenuImmediately();
    }
  };

  const handleUserMenuEnter = () => {
    if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current);
    setIsUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 300); // 0.3초 지연 후 닫힘
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      if (userMenuTimeoutRef.current) clearTimeout(userMenuTimeoutRef.current);
      if (menuOpenTimeoutRef.current) clearTimeout(menuOpenTimeoutRef.current);
      if (menuCloseTimeoutRef.current) clearTimeout(menuCloseTimeoutRef.current);
    };
  }, [supabase]);

  // 스크롤 방향에 따라 헤더 숨김/표시 (아래로 내리면 숨김, 위로 올리면 표시)
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // 메뉴 상호작용 중이거나 상단 근처에서는 항상 표시
      if (isMenuOpen || isMobileMenuOpen || isHeaderHovered || currentY < 100) {
        setIsHeaderHidden(false);
        lastScrollY.current = currentY;
        return;
      }

      const delta = currentY - lastScrollY.current;
      if (Math.abs(delta) < 6) return; // 미세한 흔들림 무시

      setIsHeaderHidden(delta > 0);
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen, isMobileMenuOpen, isHeaderHovered]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  if (pathname.startsWith('/admin')) return null;

  const renderMegaMenuCard = (item: MenuItem, idx: number) => (
    <motion.div
      key={item.name}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03, duration: 0.18, ease: 'easeOut' }}
    >
      <Link 
        href={item.href}
        onClick={closeMegaMenuImmediately}
        className="group relative flex min-h-[96px] items-center justify-between gap-5 overflow-hidden rounded-lg border border-slate-100 bg-white px-7 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-primary/[0.025] hover:shadow-[0_22px_48px_-34px_rgba(40,74,165,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <div className="min-w-0 flex-1">
          <h4 className="text-[18px] font-bold text-ink tracking-tight transition-all duration-300 group-hover:-translate-y-1 group-hover:text-primary group-focus-visible:-translate-y-1 group-focus-visible:text-primary">
            {item.name}
          </h4>
          <p className="mt-1 text-[14px] font-semibold leading-snug text-ink-muted">
            {item.desc}
          </p>
        </div>
        <ChevronRight size={18} className="shrink-0 -translate-x-1 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" />
      </Link>
    </motion.div>
  );

  return (
    <>
    <header 
      ref={headerRef} 
      onMouseEnter={() => {
        setIsHeaderHovered(true);
        keepMegaMenuOpen();
      }}
      onMouseLeave={() => {
        setIsHeaderHovered(false);
        closeMegaMenu();
      }}
      onBlur={handleHeaderBlur}
      onKeyDown={handleHeaderKeyDown}
      className={`fixed top-0 w-full z-[100] backdrop-blur-xl transition-all duration-300 ${
        isHeaderHidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        isLightHeader
          ? 'border-b border-slate-100 bg-white/95 shadow-sm'
          : 'border-b border-white/10 bg-navy-950/75 shadow-none'
      } ${
        isMenuOpen ? 'shadow-[0_32px_70px_-32px_rgba(15,29,54,0.32)]' : ''
      }`}
    >
      {/* 🔝 Top GNB Bar */}
      <div className="relative z-10 mx-auto flex h-[72px] max-w-7xl items-center px-4 sm:px-7 xl:px-10">
        {/* Logo Section */}
        <Link href="/" className="flex items-center shrink-0 transition-transform hover:scale-[1.03] active:scale-95" onClick={() => setActiveMenu(null)}>
          <Image
            src={isLightHeader ? '/ch-logo-color.png' : '/ch-logo-white.png'}
            alt="연세척병원"
            width={517}
            height={144}
            priority
            className="h-9 w-auto sm:h-10 lg:h-11"
          />
        </Link>
        
        {/* Main Navigation - Visible from 1100px */}
        <nav
          style={{ marginLeft: HEADER_DESKTOP_LAYOUT.navigationOffsetX }}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:flex xl:gap-7 2xl:gap-10"
        >
          {MENU_DATA.map((menu) => (
            <Link
              key={menu.id}
              href={menu.href}
              onMouseEnter={() => openMegaMenu(menu.id)}
              onFocus={() => openMegaMenuImmediately(menu.id)}
              onClick={closeMegaMenuImmediately}
              aria-haspopup="true"
              aria-expanded={activeMenu === menu.id}
              aria-controls={activeMenu === menu.id ? 'site-mega-menu' : undefined}
              className="relative px-1 py-2 group"
            >
              {activeMenu === menu.id && (
                <motion.span
                  layoutId="nav-active-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  className="absolute inset-x-[-14px] inset-y-[-9px] rounded-full bg-primary/8"
                />
              )}
              <span
                  className={`relative z-10 text-[14px] xl:text-[15px] 2xl:text-[16px] font-bold tracking-tight transition-colors duration-200 block whitespace-nowrap ${
                  activeMenu === menu.id ? 'text-primary' : isLightHeader ? 'text-ink' : 'text-white/92'
                }`}
              >
                {menu.name}
              </span>
              {activeMenu === menu.id && (
                <motion.span
                  layoutId="nav-active-line"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  className="absolute -bottom-5 left-0 right-0 h-0.5 rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        <div
          className="ml-auto flex items-center"
          style={{ columnGap: HEADER_DESKTOP_LAYOUT.socialToAccountGap }}
        >
          <HeaderSocialLinks isLight={isLightHeader} />

          {/* User Icon Side */}
          <div className="flex items-center gap-1 sm:gap-4">
          {user ? (
            <div className="hidden items-center gap-2 lg:flex lg:gap-4">
              <div className="hidden md:flex flex-col items-end -space-y-1">
                <span className={`text-[13px] font-bold transition-colors ${
                  isLightHeader ? 'text-ink' : 'text-white'
                }`}>{user.user_metadata?.full_name || '사용자'}님</span>
                <span className="text-[10px] font-bold text-primary tracking-widest font-montserrat uppercase">Verified</span>
              </div>
              <div 
                className="relative"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button className={`h-9 w-9 overflow-hidden rounded-full border-2 shadow-sm transition-all sm:h-11 sm:w-11 ${isUserMenuOpen ? 'border-primary' : 'border-slate-100 hover:border-primary/50'}`}>
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center transition-colors ${
                      isLightHeader ? 'bg-slate-100 text-ink-muted' : 'bg-white/12 text-white'
                    }`}>
                      <User size={20} />
                    </div>
                  )}
                </button>
                
                {/* User Dropdown with AnimatePresence */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-full pt-3 w-48 z-[110]"
                    >
                      <div className="bg-white rounded-[20px] shadow-xl border border-slate-100 p-1.5 overflow-hidden">
                        <button 
                          onClick={async () => {
                            setIsUserMenuOpen(false);
                            setUser(null); // 즉각적인 UI 반영
                            await signOut();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-ink-muted hover:text-red-500 hover:bg-red-50/80 rounded-[14px] transition-all font-bold text-sm text-left group/btn"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover/btn:bg-red-100/50 flex items-center justify-center transition-colors">
                            <LogOut size={16} className="group-hover/btn:scale-110 transition-transform" />
                          </div>
                          로그아웃
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <Link 
              href="/login" 
              aria-label="로그인"
                className={`hidden h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95 lg:flex ${
                isLightHeader
                  ? 'text-ink hover:bg-primary-light hover:text-primary'
                  : 'text-white/92 hover:bg-white/12 hover:text-white'
              }`}
              onClick={closeMegaMenuImmediately}
            >
              <User size={22} strokeWidth={2.4} />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? '전체메뉴 닫기' : '전체메뉴 열기'}
            aria-expanded={isMobileMenuOpen}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors sm:h-11 sm:w-11 sm:rounded-xl lg:hidden ${
              isLightHeader ? 'bg-slate-50 text-ink hover:bg-slate-100' : 'bg-white/10 text-white hover:bg-white/18'
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          </div>
        </div>
      </div>

      {/* 🚀 First Premium Mega Menu Restoration */}
      <AnimatePresence>
        {isMenuOpen && activeMenuData && (
          <motion.div
            id="site-mega-menu"
            initial={{ opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, y: -6, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[72px] left-0 w-full overflow-hidden border-t border-slate-100 bg-white/95 shadow-[0_32px_80px_-34px_rgba(15,29,54,0.35)] backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-10 xl:px-12 py-5">
              <motion.div
                key={activeMenuData.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="grid grid-cols-12 gap-8 xl:gap-12"
              >
                {/* Left Info Panel */}
                <aside className="col-span-5 xl:col-span-4 pr-8 border-r border-slate-100">
                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                      <div className="text-h4 tracking-tight text-ink-muted">
                        진료시간
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {CLINIC_HOURS.map((hour) => (
                          <div key={hour.label} className="grid grid-cols-[108px_1fr] items-center gap-4">
                            <span className={`text-[16px] font-bold tracking-tight ${hour.tone}`}>
                              {hour.label}
                            </span>
                            <span className="justify-self-end whitespace-nowrap text-[17px] font-bold text-ink-sub tracking-tight tabular-nums">
                              {hour.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href={`tel:${REPRESENTATIVE_PHONE.replace(/-/g, '')}`}
                      className="group rounded-lg border border-slate-100 bg-white px-4 py-3.5 shadow-[0_18px_40px_-32px_rgba(15,29,54,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/[0.03]"
                    >
                      <div className="flex items-center gap-2 text-[14px] font-bold text-ink-muted">
                        <Phone size={15} className="text-primary" />
                        전화 문의
                      </div>
                      <p className="mt-2 whitespace-nowrap text-h4 leading-tight tracking-tight text-ink group-hover:text-primary">
                        {REPRESENTATIVE_PHONE}
                      </p>
                    </a>

                    <a
                      href={NAVER_RESERVATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-lg border border-[#03C75A]/15 bg-[#03C75A] px-4 py-3.5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#02b451] hover:shadow-[0_18px_38px_-22px_rgba(3,199,90,0.9)]"
                    >
                      <div className="flex items-center gap-2 text-[15px] font-bold text-white/85">
                        <CalendarCheck size={18} />
                        네이버 예약
                      </div>
                      <p className="mt-2 flex items-center gap-1 whitespace-nowrap text-h4 tracking-tight">
                        바로가기
                        <ChevronRight size={21} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </p>
                    </a>
                  </div>
                </aside>

                {/* Right Menu Grid */}
                <div className="relative col-span-7 xl:col-span-8 flex flex-col py-1">
                  {/* 로고 워터마크 — 카드 뒤 오른쪽 아래 */}
                  <Image
                    src="/ys-logo-bg.png"
                    alt=""
                    aria-hidden="true"
                    width={1551}
                    height={1545}
                    className="pointer-events-none absolute -bottom-40 -right-72 h-[400px] w-auto select-none object-contain opacity-[0.03] brightness-0"
                  />
                  <div className="mb-4 flex items-end justify-between">
                    <h3 className="text-h3 leading-none tracking-tight text-ink">
                      {activeMenuData.name}
                    </h3>
                    <span className="hidden h-px flex-1 bg-slate-100 sm:ml-6 sm:block" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 xl:gap-4">
                    {activeMenuData.items.map((item, idx) => renderMegaMenuCard(item, idx))}
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

    </header>
    
    {/* Screen Dim Overlay */}
    <AnimatePresence>
      {(isMenuOpen || isMobileMenuOpen) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            closeMegaMenuImmediately();
            setIsMobileMenuOpen(false);
          }}
          className={`fixed inset-0 bg-navy-950/[0.16] backdrop-blur-[2px] ${isMobileMenuOpen ? 'z-[2050]' : 'z-[40]'}`}
        />
      )}
    </AnimatePresence>

    {/* 📱 Mobile Menu Drawer */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 z-[2100] flex max-h-[100dvh] w-[88%] max-w-sm flex-col bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:p-8">
            <span className="text-h4 text-ink">전체메뉴</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="전체메뉴 닫기"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-ink-sub"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overscroll-contain overflow-y-auto p-4 sm:p-6">
            <div className="space-y-1 sm:space-y-2">
              {MENU_DATA.map((menu) => (
                <div key={menu.id} className="space-y-1">
                  <Link 
                    href={menu.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between rounded-xl p-3.5 transition-colors hover:bg-slate-50 sm:rounded-2xl sm:p-4"
                  >
                    <span className="text-[17px] font-bold text-ink group-hover:text-primary sm:text-lg">{menu.name}</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </Link>
                  <div className="grid grid-cols-1 gap-0.5 pl-3 sm:gap-1 sm:pl-4">
                    {(menu.id === 'spine' ? menu.items : menu.items.slice(0, 4)).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-2.5 text-[15px] font-medium leading-snug text-ink-sub transition-colors hover:text-primary sm:p-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="min-w-0">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/50 px-5 pb-[calc(1rem_+_env(safe-area-inset-bottom))] pt-4 sm:p-8 sm:pb-[calc(2rem_+_env(safe-area-inset-bottom))]">
            {user ? (
              <button
                type="button"
                onClick={async () => {
                  setIsMobileMenuOpen(false);
                  setUser(null);
                  await signOut();
                }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-200 py-4 font-bold text-ink transition-all active:scale-95"
              >
                <LogOut size={18} />
                로그아웃하기
              </button>
            ) : (
              <Link 
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 bg-navy-950 text-white rounded-2xl font-bold transition-all active:scale-95"
              >
                <User size={18} />
                로그인하기
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Header;

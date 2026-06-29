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

const MENU_DATA = [
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
      { name: '적용 질환', desc: '디스크, 협착증 등 환자별 적응증 안내', href: '/treatments/spine/ube#indications' },
      { name: '치료 과정', desc: '진단부터 회복까지 단계별 치료 흐름', href: '/treatments/spine/ube#process' },
    ]
  },
  {
    id: 'spine',
    name: '척추센터',
    href: '/treatments/spine',
    subTitle: '통증의 근본을 찾는 정교한 치료',
    items: [
      { name: '허리/목 디스크', desc: '정확한 진단과 맞춤형 비수술 치료', href: '/treatments/spine/disc' },
      { name: '척추관 협착증', desc: '신경 압박 해소를 위한 전문 솔루션', href: '/treatments/spine/stenosis' },
      { name: '비수술 치료', desc: '수술 없이 일상을 회복하는 방법', href: '/treatments/spine/non-surgical' },
      { name: '도수·재활 클리닉', desc: '체계적인 맞춤형 재활 시스템', href: '/treatments/spine/rehab' },
    ]
  },
  {
    id: 'joint',
    name: '관절센터',
    href: '/treatments/joint',
    subTitle: '자유로운 움직임을 위한 정교한 치료',
    items: [
      { name: '무릎/어깨 관절', desc: '내시경을 활용한 정밀 관절 치료', href: '/treatments/joint/knee-shoulder' },
      { name: '고관절/족부', desc: '균형 잡힌 보행을 위한 전문 센터', href: '/treatments/joint/hip-foot' },
      { name: '스포츠 재활', desc: '빠른 복귀를 돕는 선수 맞춤 재활', href: '/treatments/joint/sports' },
      { name: '줄기세포 치료', desc: '자기 관절을 살리는 재생 의료', href: '/treatments/joint/stem-cell' },
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
      { name: '온라인 상담', desc: '증상에 대한 궁금증을 전문의가 직접 상담해 드립니다', href: '/consultation' },
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

const Header = () => {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const isMenuOpen = activeMenu !== null;
  const activeMenuData = MENU_DATA.find((menu) => menu.id === activeMenu);
  const isHomePage = pathname === '/';
  const isLightHeader = !isHomePage || isHeaderHovered || isMenuOpen || isMobileMenuOpen;
  

  const headerRef = useRef<HTMLDivElement>(null);
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

  if (pathname.startsWith('/admin')) return null;

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
        isLightHeader
          ? 'border-b border-slate-100 bg-white/95 shadow-sm'
          : 'border-b border-white/10 bg-navy-950/75 shadow-none'
      } ${
        isMenuOpen ? 'shadow-[0_32px_70px_-32px_rgba(15,29,54,0.32)]' : ''
      }`}
    >
      {/* 🔝 Top GNB Bar */}
      <div className="max-w-[1540px] mx-auto px-7 xl:px-10 h-[72px] flex items-center justify-between relative z-10">
        {/* Logo Section */}
        <Link href="/" className="flex items-center shrink-0 transition-transform hover:scale-[1.03] active:scale-95" onClick={() => setActiveMenu(null)}>
          <Image
            src={isLightHeader ? '/ch-logo-color.png' : '/ch-logo-white.png'}
            alt="연세척병원"
            width={517}
            height={144}
            priority
            className="h-9 lg:h-11 w-auto"
          />
        </Link>
        
        {/* Main Navigation - Visible from 1100px */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-7 2xl:gap-10">
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

        {/* User Icon Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end -space-y-1">
                <span className={`text-[13px] font-black transition-colors ${
                  isLightHeader ? 'text-ink' : 'text-white'
                }`}>{user.user_metadata?.full_name || '사용자'}님</span>
                <span className="text-[10px] font-bold text-primary tracking-widest font-montserrat uppercase">Verified</span>
              </div>
              <div 
                className="relative"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all shadow-sm ${isUserMenuOpen ? 'border-primary' : 'border-slate-100 hover:border-primary/50'}`}>
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
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95 ${
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
            className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
              isLightHeader ? 'bg-slate-50 text-ink hover:bg-slate-100' : 'bg-white/10 text-white hover:bg-white/18'
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
            <div className="max-w-[1440px] mx-auto px-10 xl:px-12 py-5">
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
                      <div className="text-[19px] font-black tracking-tight text-ink-muted">
                        진료시간
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {CLINIC_HOURS.map((hour) => (
                          <div key={hour.label} className="grid grid-cols-[108px_1fr] items-center gap-4">
                            <span className={`text-[16px] font-black tracking-tight ${hour.tone}`}>
                              {hour.label}
                            </span>
                            <span className="justify-self-end whitespace-nowrap text-[17px] font-black text-ink-sub tracking-tight tabular-nums">
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
                      <div className="flex items-center gap-2 text-[14px] font-black text-ink-muted">
                        <Phone size={15} className="text-primary" />
                        전화 문의
                      </div>
                      <p className="mt-2 whitespace-nowrap text-[25px] font-black leading-tight tracking-tight text-ink group-hover:text-primary">
                        {REPRESENTATIVE_PHONE}
                      </p>
                    </a>

                    <a
                      href={NAVER_RESERVATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-lg border border-[#03C75A]/15 bg-[#03C75A] px-4 py-3.5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#02b451] hover:shadow-[0_18px_38px_-22px_rgba(3,199,90,0.9)]"
                    >
                      <div className="flex items-center gap-2 text-[15px] font-black text-white/85">
                        <CalendarCheck size={18} />
                        네이버 예약
                      </div>
                      <p className="mt-2 flex items-center gap-1 whitespace-nowrap text-[23px] font-black tracking-tight">
                        바로가기
                        <ChevronRight size={21} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </p>
                    </a>
                  </div>
                </aside>

                {/* Right Menu Grid */}
                <div className="col-span-7 xl:col-span-8 flex flex-col py-1">
                  <div className="mb-4 flex items-end justify-between">
                    <h3 className="text-[30px] font-black leading-none tracking-tight text-ink">
                      {activeMenuData.name}
                    </h3>
                    <span className="hidden h-px flex-1 bg-slate-100 sm:ml-6 sm:block" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 xl:gap-4">
                    {activeMenuData.items.map((item, idx) => (
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
                          <span className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[18px] font-black text-ink tracking-tight transition-colors duration-200 group-hover:text-primary">
                              {item.name}
                            </h4>
                            <p className="mt-1 text-[14px] font-semibold leading-snug text-ink-muted">
                              {item.desc}
                            </p>
                          </div>
                          <ChevronRight size={18} className="shrink-0 -translate-x-1 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" />
                        </Link>
                      </motion.div>
                    ))}
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
          className="fixed inset-0 bg-navy-950/[0.16] backdrop-blur-[2px] z-[40]"
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
          className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[150] shadow-2xl flex flex-col"
        >
          <div className="p-8 flex items-center justify-between border-b border-slate-50">
            <span className="text-xl font-black text-ink">전체메뉴</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-ink-muted"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {MENU_DATA.map((menu) => (
                <div key={menu.id} className="space-y-1">
                  <Link 
                    href={menu.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-lg font-bold text-ink group-hover:text-primary">{menu.name}</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </Link>
                  <div className="grid grid-cols-1 gap-1 pl-4">
                    {menu.items.slice(0, 4).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-3 text-[15px] font-medium text-ink-muted hover:text-primary transition-colors flex items-center gap-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-100">
            {!user && (
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

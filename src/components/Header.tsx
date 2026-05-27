'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Stethoscope, 
  Activity, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Microscope,
  UserCheck,
  CalendarDays,
  FileText,
  ChevronRight,
  MonitorPlay,
  Star,
  GraduationCap,
  Video,
  Globe2,
  LogOut,
  Bell,
  HelpCircle,
  MessageCircle,
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
      { name: '연세척 철학', desc: '환자 중심의 정직한 진료 원칙', icon: <ShieldCheck size={26} />, href: '/about/philosophy' },
      { name: '의료진 소개', desc: '세브란스 교수 출신의 전문의', icon: <UserCheck size={26} />, href: '/doctors' },
      { name: '첨단 의료 장비', desc: '대학병원급 MRI, CT 시스템', icon: <Microscope size={26} />, href: '/about/equipment' },
      { name: '오시는 길', desc: '더 가까운 연세척의 위치 안내', icon: <MapPin size={26} />, href: '/about/location' },
    ]
  },
  {
    id: 'spine',
    name: '척추센터',
    href: '/treatments/spine',
    subTitle: '통증의 근본을 찾는 정교한 치료',
    items: [
      { name: '허리/목 디스크', desc: '정확한 진단과 맞춤형 비수술 치료', icon: <Activity size={26} />, href: '/treatments/spine/disc' },
      { name: '척추관 협착증', desc: '신경 압박 해소를 위한 전문 솔루션', icon: <Activity size={26} />, href: '/treatments/spine/stenosis' },
      { name: '비수술 치료', desc: '수술 없이 일상을 회복하는 방법', icon: <Activity size={26} />, href: '/treatments/spine/non-surgical' },
      { name: '도수·재활 클리닉', desc: '체계적인 맞춤형 재활 시스템', icon: <Activity size={26} />, href: '/treatments/spine/rehab' },
    ]
  },
  {
    id: 'joint',
    name: '관절센터',
    href: '/treatments/joint',
    subTitle: '자유로운 움직임을 위한 정교한 치료',
    items: [
      { name: '무릎/어깨 관절', desc: '내시경을 활용한 정밀 관절 치료', icon: <Stethoscope size={26} />, href: '/treatments/joint/knee-shoulder' },
      { name: '고관절/족부', desc: '균형 잡힌 보행을 위한 전문 센터', icon: <Stethoscope size={26} />, href: '/treatments/joint/hip-foot' },
      { name: '스포츠 재활', desc: '빠른 복귀를 돕는 선수 맞춤 재활', icon: <Stethoscope size={26} />, href: '/treatments/joint/sports' },
      { name: '줄기세포 치료', desc: '자기 관절을 살리는 재생 의료', icon: <Stethoscope size={26} />, href: '/treatments/joint/stem-cell' },
    ]
  },
  {
    id: 'news',
    name: '병원소식',
    href: '/news/notice',
    subTitle: '연세척병원의 쉼 없는 발자취',
    items: [
      { name: '공지사항', desc: '병원 운영 및 진료에 관한 주요 안내', icon: <Bell size={26} />, href: '/news/notice' },
      { name: '언론/방송 보도', desc: '다양한 매체에서 주목하는 의료 기술', icon: <MonitorPlay size={26} />, href: '/news/media' },
      { name: '연세척 학술의학', desc: '지속적인 연구와 논문 발표 실적', icon: <GraduationCap size={26} />, href: '/news/academic' },
      { name: '척척 유튜브', desc: '전문의가 직접 알려주는 알기 쉬운 의학 정보', icon: <Video size={26} />, href: '/news/youtube' },
      { name: '국제 트레이닝 센터', desc: '해외 의료진에게 전수하는 척추내시경 노하우', icon: <Globe2 size={26} />, href: '/news/training' },
    ]
  },
  {
    id: 'community',
    name: '커뮤니티',
    href: '/board/reviews',
    subTitle: '소통과 공감으로 완성되는 치유',
    items: [
      { name: '치료체험후기', desc: '완치의 기쁨을 누리는 환자분들의 생생한 수기', icon: <Star size={26} />, href: '/board/reviews' },
      { name: '온라인 상담', desc: '증상에 대한 궁금증을 전문의가 직접 상담해 드립니다', icon: <MessageCircle size={26} />, href: '/consultation' },
      { name: '온라인 예약', desc: '원하시는 스케줄에 맞춰 신속하고 간편한 진료 예약', icon: <CalendarDays size={26} />, href: '/reservation' },
      { name: '자주하는 질문', desc: '진료, 입원, 서류 발급 등 잦은 문의 안내', icon: <HelpCircle size={26} />, href: '/board/faq' },
    ]
  },
];

const Header = () => {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMenuOpen = activeMenu !== null;
  

  const headerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    };
  }, [supabase]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
    <header 
      ref={headerRef} 
      onMouseLeave={() => setActiveMenu(null)}
      className={`fixed top-0 w-full z-[100] !bg-white transition-all duration-500 ${
        isMenuOpen ? 'shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]' : 'border-b border-slate-100 shadow-sm'
      }`}
    >
      {/* 🔝 Top GNB Bar */}
      <div className="max-w-[1440px] mx-auto px-10 h-24 flex items-center justify-between !bg-white relative z-10">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 lg:gap-4 shrink-0" onClick={() => setActiveMenu(null)}>
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-xl lg:rounded-2xl flex items-center justify-center font-black text-white text-xl lg:text-2xl shadow-blue-glow transition-transform hover:scale-105 active:scale-95">Y</div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl lg:text-2xl font-black tracking-tighter text-navy-950">연세척병원</span>
            <span className="text-[8px] lg:text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Severance Expertise Center</span>
          </div>
        </Link>
        
        {/* Main Navigation - Visible from 1100px */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-16">
          {MENU_DATA.map((menu) => (
            <Link
              key={menu.id}
              href={menu.href}
              onMouseEnter={() => setActiveMenu(menu.id)}
              className="relative py-2 group"
            >
              <motion.span
                animate={{ 
                  letterSpacing: isMenuOpen ? "0.05em" : "0em",
                  color: activeMenu === menu.id ? "#0066FF" : (isMenuOpen ? "#0F1D36" : "#475569") 
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-[17px] xl:text-[20px] font-bold tracking-tight transition-colors group-hover:text-primary block whitespace-nowrap"
              >
                {menu.name}
              </motion.span>
              <motion.span 
                animate={{ width: activeMenu === menu.id ? "100%" : "0%" }}
                className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 pointer-events-none" 
              />
            </Link>
          ))}
        </nav>

        {/* User Icon Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end -space-y-1">
                <span className="text-[13px] font-black text-navy-950">{user.user_metadata?.full_name || '사용자'}님</span>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Verified</span>
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
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
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
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-red-500 hover:bg-red-50/80 rounded-[14px] transition-all font-bold text-sm text-left group/btn"
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
              className="group flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2.5 lg:py-3 bg-navy-950 text-white rounded-xl hover:bg-primary transition-all shadow-sm hover:shadow-blue-glow active:scale-95"
              onClick={() => setActiveMenu(null)}
            >
              <User size={18} strokeWidth={2.5} />
              <span className="text-sm font-black tracking-tight whitespace-nowrap">로그인</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-11 h-11 flex items-center justify-center bg-slate-50 text-navy-950 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 🚀 First Premium Mega Menu Restoration */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-24 left-0 w-full bg-white border-t border-slate-50 overflow-hidden shadow-2xl"
          >
            <div className="max-w-[1440px] mx-auto px-12 py-10">
              {MENU_DATA.filter(m => m.id === activeMenu).map(active => (
                <div key={active.id} className="grid grid-cols-12 gap-20">
                  {/* Left Info Panel (Editorial Feel) */}
                  <div className="col-span-4 space-y-6 animate-fade-in">
                    <div className="space-y-4">
                      <p className="text-primary font-bold text-[15px] tracking-[0.2em] uppercase border-l-4 border-primary pl-4">{active.name}</p>
                      <motion.h3 
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="text-5xl font-extrabold text-[#222222] tracking-tight leading-[1.3] whitespace-pre-line"
                      >
                        {active.subTitle}
                      </motion.h3>
                    </div>
                  </div>

                  {/* Right Menu Icons Grid (The Core Content) */}
                  <div className="col-span-8 grid grid-cols-2 gap-x-16 gap-y-12">
                    {active.items.map((item, idx) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link 
                          href={item.href}
                          onClick={() => setActiveMenu(null)}
                          className="group flex gap-8 p-8 -m-8 rounded-[2rem] hover:bg-slate-50/80 transition-all border border-transparent hover:border-slate-100/50"
                        >
                          <div className="w-18 h-18 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-blue-glow transition-all duration-500 shrink-0">
                            {item.icon}
                          </div>
                          <div className="space-y-2 flex flex-col justify-center">
                            <h4 className="text-[20px] font-bold text-[#222222] group-hover:text-primary transition-colors tracking-tight">
                              {item.name}
                            </h4>
                            <p className="text-[15px] text-slate-400 font-medium leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Bottom Decorative Element */}
            <div className="h-1.5 bg-gradient-to-r from-primary/5 via-primary to-primary/5 opacity-20" />
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
            setActiveMenu(null);
            setIsMobileMenuOpen(false);
          }}
          className="fixed inset-0 bg-navy-950/20 backdrop-blur-[2px] z-[40]"
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
            <span className="text-xl font-black text-navy-950">전체메뉴</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400"
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
                    <span className="text-lg font-bold text-navy-950 group-hover:text-primary">{menu.name}</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </Link>
                  <div className="grid grid-cols-1 gap-1 pl-4">
                    {menu.items.slice(0, 4).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-3 text-[15px] font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-3"
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

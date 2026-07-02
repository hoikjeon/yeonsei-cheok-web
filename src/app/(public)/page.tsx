'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  ChevronRight,
  Activity,
  Award,
  CheckCircle,
  Shield,
  ArrowUpRight,
  CalendarDays,
  FileText,
  HeartHandshake,
  MapPin,
  MessageCircle,
  UserCheck,
} from 'lucide-react';
import HomeNoticeBar from '@/components/HomeNoticeBar';

const heroSlides = [
  {
    id: 'university-trained',
    titleLines: ['대학병원 출신의', '정밀한 진료'],
    desc: '대학병원 진료 경험을 갖춘 의료진이 정확한 진단과 환자 중심 치료로 회복의 기준을 높입니다.',
    image: '/generated/hero-university-doctors.png',
    imageAlt: '대학병원 출신 의료진의 척추 상담 장면',
  },
  {
    id: 'total-care',
    titleLines: ['척추·관절 치료', '처음부터 끝까지'],
    desc: '검사, 진단, 비수술 치료, 수술 후 재활까지 한 곳에서 이어지는 체계적인 치료 여정을 제공합니다.',
    image: '/generated/hero-hospital-exterior.png',
    imageAlt: '프리미엄 척추 관절 병원 외관',
  },
  {
    id: 'spine-endoscopy',
    titleLines: ['양방향 척추내시경', '특화 센터'],
    desc: '작은 통로로 병변을 정밀하게 확인하고 치료해 절개 부담을 낮추는 최소침습 척추 치료를 지향합니다.',
    image: '/generated/hero-spine-endoscopy.png',
    imageAlt: '양방향 척추내시경 교육실',
  },
  {
    id: 'global-education',
    titleLines: ['해외 의료진을 가르치는', '수술 노하우'],
    desc: '임상 경험과 술기를 바탕으로 국내외 의료진 교육과 학술 활동을 이어가며 치료의 완성도를 높입니다.',
    image: '/generated/hero-medical-conference.png',
    imageAlt: '척추 관절 의료진 학술 강연 장면',
  },
  {
    id: 'one-day-knee',
    titleLines: ['원데이 무릎 관절', '내시경 진단'],
    desc: '입원 부담을 줄이고 당일 검사와 관절 상태 확인이 가능하도록 빠르고 정확한 진료 시스템을 운영합니다.',
    image: '/generated/hero-knee-oneday.png',
    imageAlt: '원데이 무릎 관절 진단 클리닉',
  },
  {
    id: 'research-network',
    titleLines: ['국내 대학병원과 함께하는', '연구 네트워크'],
    desc: '대학병원급 협진 관점과 연구 기반 데이터를 바탕으로 더 안전하고 효율적인 치료 방향을 고민합니다.',
    image: '/generated/hero-research-network.png',
    imageAlt: '척추 관절 연구 네트워크 회의 장면',
  },
];

const specializedPrograms = [
  {
    title: '양방향 척추내시경',
    desc: '두 개의 작은 통로로 병변을 정밀하게 확인하고 치료하는 척추 특화 비수술·최소침습 솔루션입니다.',
    image: '/generated/specialty-spine-endoscopy.png',
  },
  {
    title: '무릎관절 내시경',
    desc: '관절 내부를 직접 확인하며 손상 부위를 섬세하게 치료해 회복 부담을 낮추는 관절 특화 치료입니다.',
    image: '/generated/specialty-knee-arthroscopy.png',
  },
];

const dailyCareSlides = [
  {
    point: 'POINT 1',
    title: '세분화된 전문 클리닉',
    desc: '통증의 원인부터 기능 회복까지, 분야별 정밀 클리닉을 운영하고 있습니다. 질환별로 특화된 진료 시스템을 통해 근본적인 문제를 정확히 진단하고 효과적인 회복을 이끕니다.',
    tags: ['척추통증', '관절통증', '도수재활'],
    image: '/generated/ys-daily-care-consultation.png',
    imageAlt: '연세척병원 전문의가 환자와 상담하는 장면',
  },
  {
    point: 'POINT 2',
    title: '검사부터 진단까지 정확하게',
    desc: '대학병원급 영상 장비와 숙련된 의료진의 판독을 바탕으로 통증의 원인을 세밀하게 확인합니다. 필요한 치료만 제안하는 정직한 진료를 지향합니다.',
    tags: ['정밀검사', 'MRI 판독', '맞춤진단'],
    image: '/generated/ys-daily-care-diagnosis.png',
    imageAlt: '의료진이 척추 MRI 영상을 확인하는 장면',
  },
  {
    point: 'POINT 3',
    title: '비수술 치료와 재활의 연결',
    desc: '주사치료, 도수치료, 재활운동을 환자 상태에 맞게 연결해 일상 복귀의 부담을 낮춥니다. 치료 후 회복 과정까지 꼼꼼하게 살핍니다.',
    tags: ['비수술치료', '재활운동', '통증관리'],
    image: '/generated/ys-daily-care-rehab.png',
    imageAlt: '재활 치료사가 환자의 어깨 운동을 돕는 장면',
  },
  {
    point: 'POINT 4',
    title: '일상으로 돌아가는 따뜻한 동행',
    desc: '진료실을 나선 뒤에도 환자분의 내일이 흔들리지 않도록 회복 여정을 함께합니다. 작은 변화까지 살피는 마음으로 건강한 일상을 응원합니다.',
    tags: ['회복관리', '생활복귀', '안심동행'],
    image: '/generated/ys-daily-care-recovery.png',
    imageAlt: '의료진이 환자와 함께 병원 복도를 걷는 장면',
  },
];

const careTextContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const careTextItem: Variants = {
  hidden: { opacity: 0, x: 64 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -48,
    transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
  },
};

const quickAccessItems = [
  {
    title: '진료일정',
    href: '/doctors#doctor-schedule',
    icon: <CalendarDays size={58} strokeWidth={1.65} />,
  },
  {
    title: '의료진 소개',
    href: '/doctors',
    icon: <UserCheck size={58} strokeWidth={1.65} />,
  },
  {
    title: '치료체험후기',
    href: '/board/reviews',
    icon: <HeartHandshake size={58} strokeWidth={1.65} />,
  },
  {
    title: '증명서 발급',
    href: '/consultation',
    icon: <FileText size={58} strokeWidth={1.65} />,
  },
  {
    title: '온라인 상담',
    href: '/consultation',
    icon: <MessageCircle size={58} strokeWidth={1.65} />,
  },
  {
    title: '오시는길',
    href: '/about/location',
    icon: <MapPin size={58} strokeWidth={1.65} />,
  },
];

export default function Home() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeCareIndex, setActiveCareIndex] = useState(1);
  const activeSlide = heroSlides[activeSlideIndex];
  const activeCareSlide = dailyCareSlides[activeCareIndex];

  const showPreviousSlide = () => {
    setActiveSlideIndex((current) => (current === 0 ? heroSlides.length - 1 : current - 1));
  };

  const showNextSlide = () => {
    setActiveSlideIndex((current) => (current + 1) % heroSlides.length);
  };

  const showPreviousCareSlide = () => {
    setActiveCareIndex((current) => (current === 0 ? dailyCareSlides.length - 1 : current - 1));
  };

  const showNextCareSlide = () => {
    setActiveCareIndex((current) => (current + 1) % dailyCareSlides.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  // Daily Care 자동 넘김 — activeCareIndex가 바뀔 때마다(자동/클릭) 타이머 리셋
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveCareIndex((current) => (current + 1) % dailyCareSlides.length);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeCareIndex]);

  return (
    <div className="flex flex-col space-y-0">
      {/* Hero Section */}
      <section className="relative -mt-[72px] flex h-[calc(100svh-132px)] min-h-[620px] max-h-[820px] items-center overflow-hidden bg-navy-950 pt-[72px]">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="sync">
            <motion.img
              key={activeSlide.id}
              src={activeSlide.image}
              alt={activeSlide.imageAlt}
              initial={{ opacity: 0, scale: 1.045 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 1.02, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(10,20,40,0.96)_0%,rgba(10,20,40,0.84)_32%,rgba(10,20,40,0.44)_66%,rgba(10,20,40,0.36)_100%)]" />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-navy-950/50 via-transparent to-navy-950" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
        </div>
        
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pt-8 md:pt-12">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[880px] space-y-7"
          >
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-[1.14] tracking-normal text-white sm:text-5xl lg:text-6xl">
                {activeSlide.titleLines.map((line, index) => (
                  <span
                    key={line}
                    className={index === activeSlide.titleLines.length - 1 ? 'block text-white/[0.78]' : 'block'}
                  >
                    {line}
                  </span>
                ))}
              </h1>
              <p className="max-w-xl text-base font-normal leading-relaxed text-slate-200/90 md:text-lg">
                {activeSlide.desc}
              </p>
            </div>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={showPreviousSlide}
          className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.12] bg-navy-950/[0.35] text-white/[0.78] backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/10 hover:text-white md:left-8 md:h-14 md:w-14"
          aria-label="이전 배너 보기"
        >
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={showNextSlide}
          className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.12] bg-navy-950/[0.35] text-white/[0.78] backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/10 hover:text-white md:right-8 md:h-14 md:w-14"
          aria-label="다음 배너 보기"
        >
          <ChevronRight size={24} />
        </button>
      </section>

      <HomeNoticeBar />

      {/* Quick Access Section */}
      <section className="relative overflow-hidden bg-white px-6 py-16 md:py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f4f9ff] to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <h2 className="sr-only">연세척병원 빠른 메뉴</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {quickAccessItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ delay: index * 0.045, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={item.href}
                  prefetch
                  className="group relative flex min-h-[142px] flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-7 text-center shadow-[0_20px_58px_-48px_rgba(15,29,54,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary hover:shadow-blue-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:min-h-[172px] md:gap-5"
                  aria-label={`${item.title} 바로가기`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-70"
                  />
                  <span className="flex h-[68px] w-[68px] items-center justify-center text-primary transition-all duration-300 group-hover:scale-105 group-hover:text-white md:h-20 md:w-20">
                    {item.icon}
                  </span>
                  <span className="text-[19px] font-black tracking-tight text-ink transition-colors duration-300 group-hover:text-white md:text-[24px]">
                    {item.title}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="absolute right-5 top-5 text-primary/0 transition-all duration-300 group-hover:text-white/70"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Care Promise Section */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-extrabold leading-[1.14] tracking-tight text-[#123f86] md:text-5xl">
              모두의 일상이 흔들림 없이 바로 설 수 있도록
              <br />
              깊이 있는 진료로 함께합니다.
            </h2>
            <p className="mt-10 max-w-3xl text-[16px] font-bold leading-[1.85] text-[#1f2937] md:text-[18px]">
              환자 한 분 한 분의 건강한 내일을 위해 세심하고 정확한 진료를 약속합니다.
              <br className="hidden md:block" />
              연세척병원만의 차별화된 전문성과 따뜻한 마음을 만나보세요.
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-24 max-w-7xl px-6 md:mt-28">
          <div className="relative min-h-[500px] lg:min-h-[500px]">
            <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,600px)_minmax(0,430px)] lg:items-center lg:gap-[72px] xl:grid-cols-[minmax(0,620px)_minmax(0,450px)] xl:gap-[88px]">
              <div className="relative aspect-[1.34/1] min-h-[320px] md:min-h-[420px] lg:h-[462px]">
                <AnimatePresence>
                  <motion.div
                    key={activeCareIndex}
                    initial={{ opacity: 0.35, x: 96, scale: 0.94, borderRadius: 240 }}
                    animate={{ opacity: 1, x: 0, scale: 1, borderRadius: 36 }}
                    exit={{ opacity: 0, x: -80, scale: 0.97, borderRadius: 140 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 overflow-hidden bg-slate-100 shadow-[0_44px_120px_-86px_rgba(15,29,54,0.65)]"
                  >
                    <Image
                      src={activeCareSlide.image}
                      alt={activeCareSlide.imageAlt}
                      fill
                      sizes="(min-width: 1280px) 620px, (min-width: 1024px) 48vw, 92vw"
                      className="object-cover"
                      priority={activeCareIndex === 0}
                    />
                    <div className="absolute inset-0 bg-white/20" />
                  </motion.div>
                </AnimatePresence>
              </div>

              <article className="space-y-12 lg:-translate-y-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={showPreviousCareSlide}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/0 text-ink"
                    aria-label="이전 진료 약속 보기"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <div className="flex items-center gap-4 font-montserrat text-[16px] font-black tracking-widest">
                    <span className="text-ink">{String(activeCareIndex + 1).padStart(2, '0')}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-400/50" />
                    <span className="text-slate-400">{String(dailyCareSlides.length).padStart(2, '0')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={showNextCareSlide}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/0 text-ink"
                    aria-label="다음 진료 약속 보기"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="relative min-h-[240px] md:min-h-[276px]">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeCareIndex}
                      variants={careTextContainer}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="space-y-7"
                    >
                      <motion.div variants={careTextItem} className="flex flex-wrap items-center gap-5">
                        <span className="rounded-full bg-[#102f66] px-5 py-2 text-[14px] font-black tracking-tight text-white">
                          {activeCareSlide.point}
                        </span>
                        <h3 className="text-[25px] font-black leading-tight tracking-tight text-ink md:text-[32px]">
                          {activeCareSlide.title}
                        </h3>
                      </motion.div>

                      <motion.p
                        variants={careTextItem}
                        className="max-w-md text-[15px] font-semibold leading-[1.85] text-ink-sub md:text-[16px]"
                      >
                        {activeCareSlide.desc}
                      </motion.p>

                      <motion.div variants={careTextItem} className="flex flex-wrap gap-3">
                        {activeCareSlide.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-ink-sub shadow-[0_10px_28px_-24px_rgba(15,29,54,0.35)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* 🧬 Specialty System Section */}
      <section className="relative overflow-hidden bg-[#f4f9ff] py-28 text-ink">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_48%,#ffffff_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 54 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="space-y-3">
              <h2 className="text-4xl font-extrabold leading-[1.14] tracking-tight md:text-5xl">
                척추/관절 특화 병원
                <span className="mt-2 block text-primary">연세척병원</span>
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-5">
            {specializedPrograms.map((program, index) => (
              <motion.article
                key={program.title}
                initial={{ opacity: 0, y: 72 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ delay: index * 0.12, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                className="group grid min-h-[218px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_28px_80px_-56px_rgba(15,29,54,0.5)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:bg-primary"
              >
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(280px,1.05fr)]">
                  <div className="flex min-h-[230px] flex-col justify-center p-8 md:p-9">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-extrabold tracking-tight text-ink transition-colors duration-500 group-hover:text-white md:text-4xl">
                        {program.title}
                      </h3>
                      <p className="max-w-md text-[15px] font-medium leading-relaxed text-ink-muted transition-colors duration-500 group-hover:text-white/[0.82]">
                        {program.desc}
                      </p>
                    </div>
                  </div>

                  <div className="relative min-h-[230px] overflow-hidden bg-[#e8f3ff] md:min-h-full">
                    <motion.img
                      src={program.image}
                      alt={program.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-primary/10 opacity-80 transition-opacity duration-500 group-hover:opacity-30" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 🧭 Medical Expertise Section: Editorial Grid */}
      <section id="expertise" className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
            <div className="lg:col-span-5 space-y-6">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-block text-primary font-black tracking-[0.3em] font-montserrat uppercase text-xs"
              >
                Specialized Care
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-black text-ink tracking-tight leading-[1.1]"
              >
                정확한 원칙 <br />
                정교한 치료
              </motion.h2>
            </div>
            <div className="lg:col-span-7 pt-4">
              <p className="text-xl text-ink-muted leading-relaxed font-medium">
                불필요한 과잉 진료는 지양하며, 대학병원급 첨단 MRI 등 정밀 영상 장비를 통해
                가장 정직하고 효과적인 치료 솔루션을 제시합니다.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: '척추 클리닉', 
                desc: '허리디스크, 척추관 협착증 등 만성 통증부터 고난도 척추 수술까지 대학병원급 진료 경험으로 치료합니다.', 
                icon: <Activity className="w-8 h-8" />,
                tags: ['디스크', '신경성형술', '내시경치료']
              },
              { 
                title: '관절 클리닉', 
                desc: '무릎, 어깨, 고관절 질환에 대해 정밀한 관절 내시경 및 맞춤형 강화 치료를 제공합니다.', 
                icon: <Award className="w-8 h-8" />,
                tags: ['줄기세포', '오십견', '인공관절']
              },
              { 
                title: '재활·통증 클리닉', 
                desc: '도수치료 전문가의 일대일 맞춤 치료와 체외충격파 등 비수술적 통증 완화 솔루션을 운영합니다.', 
                icon: <CheckCircle className="w-8 h-8" />,
                tags: ['도수치료', '충격파', '체형교정']
              },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="group relative p-12 bg-slate-50/50 rounded-[3rem] border border-transparent hover:border-primary/10 hover:bg-white transition-all hover:shadow-premium"
              >
                <div className="space-y-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-ink tracking-tight">{item.title}</h3>
                    <p className="text-ink-muted leading-relaxed font-medium text-[15px]">{item.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white text-ink-muted text-[11px] font-bold rounded-lg border border-slate-100 font-montserrat uppercase tracking-tighter">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/treatments`} className="pt-6 flex items-center gap-2 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                    자세히 보기 <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛡️ Trust & Performance Section */}
      <section className="py-40 bg-navy-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-12 mb-32">
            <div className="flex items-center gap-3 px-4 py-1 bg-white/5 rounded-full border border-white/5">
              <Shield className="text-primary w-4 h-4" />
              <span className="text-white/60 text-[10px] font-bold font-montserrat uppercase tracking-[0.2em]">Our Commitment to Excellence</span>
            </div>
            <h2 className="max-w-4xl text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
              최상의 결과를 위한 <br />
              <span className="text-gradient">연세척의 3대 원칙</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                label: 'Precision Diagnosis', 
                title: '오진 없는 정교함', 
                desc: '대학병원 출신 의료진이 모든 케이스를 직접 검토하여 오진의 가능성을 낮춥니다.' 
              },
              { 
                label: 'Advanced Technology', 
                title: '대학병원급 첨단 장비', 
                desc: '최고 사양의 대학병원급 MRI와 디지털 영상 장비로 보이지 않는 통증의 원인까지 찾아냅니다.'
              },
              { 
                label: 'Safety First', 
                title: '수술실 안심 모니터링', 
                desc: '모든 수술 과정을 투명하게 관리하며 철저한 감염 예방 시스템을 운영합니다.' 
              },
            ].map((principle, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-6 text-center md:text-left"
              >
                <div className="text-[10px] font-black text-primary tracking-[0.3em] font-montserrat uppercase">{principle.label}</div>
                <h3 className="text-3xl font-bold text-white tracking-tight">{principle.title}</h3>
                <p className="text-ink-muted leading-relaxed font-medium text-[15px]">{principle.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Background Element */}
        <div className="absolute left-[-20%] bottom-[-10%] w-[600px] h-[600px] border border-primary/10 rounded-full animate-[spin_60s_linear_infinite]" />
      </section>

      {/* 🚀 Final CTA Section */}
      <section id="reservation-cta" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-20 bg-primary rounded-[4rem] text-center space-y-10 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-6">
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                통증 없는 내일, <br />
                함께 시작하세요.
              </h2>
              <p className="text-white/80 text-xl font-medium">
                더 늦기 전에 연세척병원 전문가와 상담하세요. 정확한 진단이 회복의 시작입니다.
              </p>
              <div className="pt-6">
                <Link 
                  href="/reservation" 
                  className="inline-flex items-center gap-3 px-12 py-6 bg-white text-primary font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl"
                >
                  지금 바로 예약하기 <ChevronRight size={20} />
                </Link>
              </div>
            </div>
            {/* Background Texture Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)]" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

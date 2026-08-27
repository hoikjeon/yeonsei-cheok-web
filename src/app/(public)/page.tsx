'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image, { getImageProps } from 'next/image';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  ChevronRight,
  ArrowUpRight,
  CalendarDays,
  FileText,
  HeartHandshake,
  MapPin,
  MessageCircle,
  UserCheck,
} from 'lucide-react';
import HomeDoctorsRevealSection from '@/components/HomeDoctorsRevealSection';
import HomeNoticeBar from '@/components/HomeNoticeBar';
import ReviewsShowcaseSection from '@/components/ReviewsShowcaseSection';
import TrainingCenterSection from '@/components/TrainingCenterSection';
import YoutubeSection from '@/components/YoutubeSection';

const heroSlides = [
  {
    id: 'f',
    desktopImage: '/banner/f1d.jpg',
    tabletImage: '/banner/f1t.jpg',
    mobileImage: '/banner/f1m.jpg',
    imageAlt: '김동한·이남 병원장이 이끄는 연세척병원, 척추·관절치료 처음부터 끝까지 함께하겠습니다',
  },
  {
    id: 'a',
    desktopImage: '/banner/a1d.jpg',
    tabletImage: '/banner/a1t.jpg',
    mobileImage: '/banner/a1m.jpg',
    imageAlt: '세계적 수준의 의료진이 집도하는 연세척병원 양방향 척추내시경 센터',
  },
  {
    id: 'b',
    desktopImage: '/banner/b1d.jpg',
    tabletImage: '/banner/b1t.jpg',
    mobileImage: '/banner/b1m.jpg',
    imageAlt: '해외 의료진을 가르치는 양방향 척추내시경 수술 권위자 김동한 병원장',
  },
  {
    id: 'c',
    desktopImage: '/banner/c1d.jpg',
    tabletImage: '/banner/c1t.jpg',
    mobileImage: '/banner/c1m.jpg',
    imageAlt: '해외 의사를 가르치고 양방향 척추내시경을 리드하는 연세척병원',
  },
  {
    id: 'd',
    desktopImage: '/banner/d1d.jpg',
    tabletImage: '/banner/d1t.jpg',
    mobileImage: '/banner/d1m.jpg',
    imageAlt: '비수술 치료부터 수술·재활까지 환자에게 꼭 필요한 치료에 집중하는 연세척병원',
  },
  {
    id: 'e',
    desktopImage: '/banner/e1d.jpg',
    tabletImage: '/banner/e1t.jpg',
    mobileImage: '/banner/e1m.jpg',
    imageAlt: '세계 최초 경추 라이브 서저리를 시행한 양방향 척추내시경 권위자 이남 병원장',
  },
  {
    id: 'g',
    desktopImage: '/banner/g1d.jpg',
    tabletImage: '/banner/g1t.jpg',
    mobileImage: '/banner/g1m.jpg',
    imageAlt: '입원 없이 당일 검사가 가능한 연세척병원 원데이 무릎 관절 내시경 진단',
  },
  {
    id: 'h',
    desktopImage: '/banner/h1d.jpg',
    tabletImage: '/banner/h1t.jpg',
    mobileImage: '/banner/h1m.jpg',
    imageAlt: '세계 최초 양방향 척추내시경 유합술 전향적 연구에 참여하는 연세척병원',
  },
];

type HeroSlide = (typeof heroSlides)[number];

function ResponsiveHeroImage({ slide, isFirstSlide }: { slide: HeroSlide; isFirstSlide: boolean }) {
  const common = {
    alt: slide.imageAlt,
    sizes: '100vw',
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: slide.desktopImage,
    width: 2880,
    height: 1230,
    quality: 90,
  });
  const {
    props: { srcSet: tabletSrcSet },
  } = getImageProps({
    ...common,
    src: slide.tabletImage,
    width: 2048,
    height: 2048,
    quality: 90,
  });
  const { props: mobileImageProps } = getImageProps({
    ...common,
    src: slide.mobileImage,
    width: 1200,
    height: 1920,
    quality: 90,
  });

  return (
    <picture className="block h-full w-full">
      <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes="100vw" />
      <source media="(min-width: 768px)" srcSet={tabletSrcSet} sizes="100vw" />
      <img
        {...mobileImageProps}
        alt={slide.imageAlt}
        fetchPriority={isFirstSlide ? 'high' : 'auto'}
        className="h-full w-full object-contain"
      />
    </picture>
  );
}

const specializedPrograms = [
  {
    title: '양방향 척추내시경',
    desc: '두 개의 작은 통로로 병변을 정밀하게 확인하고 치료하는 척추 특화 비수술·최소침습 솔루션입니다.',
    image: '/generated/specialty-spine-endoscopy.png',
    mobileImagePosition: 'object-[68%_center]',
    href: '/treatments/spine/ube',
  },
  {
    title: '무릎관절 내시경',
    desc: '관절 내부를 직접 확인하며 손상 부위를 섬세하게 치료해 회복 부담을 낮추는 관절 특화 치료입니다.',
    image: '/generated/specialty-knee-arthroscopy.png',
    mobileImagePosition: 'object-[70%_center]',
    href: '/treatments/joint/knee-arthroscopy',
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
    href: '/board/certificates',
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
      <section
        className="home-hero relative -mt-[72px] overflow-hidden bg-navy-950 lg:mt-0"
        role="region"
        aria-label="연세척병원 주요 안내"
        aria-roledescription="carousel"
      >
        <h1 className="sr-only">부산 척추·관절 진료 연세척병원</h1>
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full"
            >
              <ResponsiveHeroImage slide={activeSlide} isFirstSlide={activeSlideIndex === 0} />
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={showPreviousSlide}
          className="absolute left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-navy-950/45 text-white/85 shadow-lg backdrop-blur-md transition-all hover:border-white/45 hover:bg-navy-950/65 hover:text-white md:flex xl:left-8 xl:h-14 xl:w-14"
          aria-label="이전 배너 보기"
        >
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={showNextSlide}
          className="absolute right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-navy-950/45 text-white/85 shadow-lg backdrop-blur-md transition-all hover:border-white/45 hover:bg-navy-950/65 hover:text-white md:flex xl:right-8 xl:h-14 xl:w-14"
          aria-label="다음 배너 보기"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 right-4 z-20 flex items-center overflow-hidden rounded-full border border-white/20 bg-navy-950/55 text-white shadow-lg backdrop-blur-md md:hidden">
          <button
            type="button"
            onClick={showPreviousSlide}
            className="flex h-11 w-11 items-center justify-center text-white/80 active:bg-white/10"
            aria-label="이전 배너 보기"
          >
            <ChevronRight size={19} className="rotate-180" />
          </button>
          <span className="min-w-10 text-center font-montserrat text-[12px] font-bold tabular-nums text-white/75">
            {activeSlideIndex + 1}/{heroSlides.length}
          </span>
          <button
            type="button"
            onClick={showNextSlide}
            className="flex h-11 w-11 items-center justify-center text-white/80 active:bg-white/10"
            aria-label="다음 배너 보기"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </section>

      <HomeNoticeBar />

      {/* Quick Access Section */}
      <section className="relative overflow-hidden bg-white pb-0 pt-9 md:pt-20 md:pb-0 lg:pt-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f4f9ff] to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
          <h2 className="sr-only">연세척병원 빠른 메뉴</h2>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-6">
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
                  className="group relative flex min-h-[104px] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-3 text-center shadow-[0_20px_58px_-48px_rgba(15,29,54,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary hover:shadow-blue-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:min-h-[172px] md:gap-5 md:px-4 md:py-7"
                  aria-label={`${item.title} 바로가기`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-70"
                  />
                  <span className="flex h-11 w-11 items-center justify-center text-primary transition-all duration-300 group-hover:scale-105 group-hover:text-white [&>svg]:h-9 [&>svg]:w-9 md:h-20 md:w-20 md:[&>svg]:h-[58px] md:[&>svg]:w-[58px]">
                    {item.icon}
                  </span>
                  <span className="break-keep text-[16px] font-extrabold leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-white md:text-h4">
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

      <HomeDoctorsRevealSection />

      {/* Daily Care Promise Section */}
      <section className="relative overflow-hidden bg-white py-16 md:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="break-keep text-h2 tracking-tight text-[#123f86]">
              모두의 일상이 흔들림 없이 바로 설 수 있도록
              <br className="hidden md:block" />{' '}
              깊이 있는 진료로 함께합니다.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl break-keep text-body-lg text-ink-sub md:mt-10">
              환자 한 분 한 분의 건강한 내일을 위해 세심하고 정확한 진료를 약속합니다.
              <br className="hidden md:block" />
              연세척병원만의 차별화된 전문성과 따뜻한 마음을 만나보세요.
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-14 max-w-7xl px-5 sm:px-7 md:mt-28 xl:px-10">
          <div className="relative min-h-0 lg:min-h-[500px]">
            <div className="relative z-10 grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)] lg:items-center lg:gap-[72px] xl:gap-[96px]">
              <div className="relative aspect-[4/3] min-h-0 overflow-hidden rounded-[12px] md:aspect-[1.34/1] md:min-h-[420px] md:rounded-none lg:h-[462px]">
                <AnimatePresence>
                  <motion.div
                    key={activeCareIndex}
                    initial={{ opacity: 0.35, x: 96, scale: 0.94, borderRadius: 240 }}
                    animate={{ opacity: 1, x: 0, scale: 1, borderRadius: 12 }}
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

              <article className="space-y-7 md:space-y-12 lg:-translate-y-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={showPreviousCareSlide}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/0 text-ink"
                    aria-label="이전 진료 약속 보기"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <div className="flex items-center gap-4 font-montserrat text-[16px] font-bold tracking-widest">
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

                <div className="relative min-h-0 md:min-h-[276px]">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeCareIndex}
                      variants={careTextContainer}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="space-y-5 md:space-y-7"
                    >
                      <motion.div variants={careTextItem} className="flex flex-wrap items-center gap-3 md:gap-5">
                        <span className="rounded-full bg-[#102f66] px-4 py-2 text-caption font-bold tracking-tight text-white md:px-5">
                          {activeCareSlide.point}
                        </span>
                        <h3 className="break-keep text-h3 tracking-tight text-ink">
                          {activeCareSlide.title}
                        </h3>
                      </motion.div>

                      <motion.p
                        variants={careTextItem}
                        className="max-w-xl break-keep text-body text-ink-sub"
                      >
                        {activeCareSlide.desc}
                      </motion.p>

                      <motion.div variants={careTextItem} className="flex flex-wrap gap-3">
                        {activeCareSlide.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-caption font-semibold text-ink-sub shadow-[0_10px_28px_-24px_rgba(15,29,54,0.35)]"
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

      {/* 🌏 국제 척추내시경 트레이닝 센터 Section */}
      <TrainingCenterSection />

      {/* 🧬 Specialty System Section */}
      <section className="relative overflow-hidden bg-[#f4f9ff] py-10 text-ink md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_48%,#ffffff_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 sm:px-7 md:gap-12 xl:px-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="space-y-5">
            <div className="space-y-3">
              <h2 className="break-keep text-[clamp(1.5rem,6vw,1.625rem)] font-extrabold leading-tight tracking-tight md:text-h2">
                척추/관절 특화 병원
                <span className="mt-2 block text-primary">연세척병원</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:gap-5">
            {specializedPrograms.map((program) => (
              <Link
                key={program.title}
                href={program.href}
                className="group grid min-h-[168px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_28px_80px_-56px_rgba(15,29,54,0.5)] transition-all duration-500 hover:-translate-y-1 hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:min-h-[218px]"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_clamp(132px,36vw,144px)] md:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
                  <div className="flex min-h-0 flex-col justify-center p-4 md:min-h-[230px] md:p-9">
                    <div className="space-y-2 md:space-y-4">
                      <h3 className="break-keep text-[20px] font-extrabold leading-[1.3] tracking-tight text-ink transition-colors duration-500 group-hover:text-white md:text-h3">
                        {program.title}
                      </h3>
                      <p className="max-w-md break-keep text-[14px] leading-[1.55] text-ink-sub transition-colors duration-500 group-hover:text-white/[0.82] md:text-body">
                        {program.desc}
                      </p>
                    </div>
                  </div>

                  <div className="relative min-h-[168px] overflow-hidden bg-[#e8f3ff] md:min-h-full">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      sizes="(min-width: 1024px) 26vw, (min-width: 768px) 40vw, 36vw"
                      className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 md:object-center ${program.mobileImagePosition}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-primary/10 opacity-80 transition-opacity duration-500 group-hover:opacity-30" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ▶️ 척추관절 연세척TV Section */}
      <YoutubeSection />

      {/* 💬 치료체험 후기 Section */}
      <ReviewsShowcaseSection />
    </div>
  );
}

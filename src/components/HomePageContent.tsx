'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image, { getImageProps } from 'next/image';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ChevronRight,
  CalendarDays,
  FileText,
  HeartHandshake,
  MapPin,
  MessageCircle,
  UserCheck,
} from 'lucide-react';
import HomeNoticeBar from '@/components/HomeNoticeBar';
import styles from './HomeQuickAccess.module.css';
import type { HomeNoticeSettings } from '@/lib/homeNoticeSettings';
import type { HomeReview } from '@/lib/adminReviews';
import ReviewsShowcaseSection from '@/components/ReviewsShowcaseSection';
import TrainingCenterSection from '@/components/TrainingCenterSection';
import UbeTextbookFeatureSection from '@/components/UbeTextbookFeatureSection';
import YoutubeSection from '@/components/YoutubeSection';
import { heroSlides, type HeroSlide } from '@/lib/heroSlides';

function ResponsiveHeroImage({
  slide,
  isFirstSlide,
  onLoad,
}: {
  slide: HeroSlide;
  isFirstSlide: boolean;
  onLoad?: () => void;
}) {
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
        onLoad={onLoad}
        className="h-full w-full object-contain"
      />
    </picture>
  );
}

const specializedPrograms = [
  {
    title: '척추센터',
    titleLines: ['척추센터'],
    image: '/images/home-specialty/spine-center-v3.webp',
    overlay: 'linear-gradient(180deg, rgba(36, 68, 114, 0.08) 0%, rgba(36, 68, 114, 0.12) 32%, rgba(28, 61, 109, 0.72) 70%, rgba(24, 51, 93, 0.9) 100%)',
    href: '/treatments/spine/disc',
  },
  {
    title: '관절센터',
    titleLines: ['관절센터'],
    image: '/images/home-specialty/joint-center-v2.webp',
    overlay: 'linear-gradient(180deg, rgba(48, 78, 119, 0.08) 0%, rgba(48, 78, 119, 0.12) 32%, rgba(38, 72, 118, 0.72) 70%, rgba(30, 61, 104, 0.9) 100%)',
    href: '/treatments/joint/knee',
  },
  {
    title: '양방향 척추내시경',
    titleLines: ['양방향', '척추내시경'],
    image: '/images/home-specialty/spine-endoscopy-v3.webp',
    overlay: 'linear-gradient(180deg, rgba(38, 59, 94, 0.08) 0%, rgba(38, 59, 94, 0.12) 32%, rgba(29, 51, 88, 0.72) 70%, rgba(23, 43, 77, 0.9) 100%)',
    href: '/treatments/spine/ube',
  },
  {
    title: '무릎관절내시경',
    titleLines: ['무릎관절', '내시경'],
    image: '/images/home-specialty/knee-arthroscopy-v4.webp',
    overlay: 'linear-gradient(180deg, rgba(35, 66, 94, 0.08) 0%, rgba(35, 66, 94, 0.12) 32%, rgba(26, 56, 85, 0.72) 70%, rgba(22, 47, 73, 0.9) 100%)',
    href: '/treatments/joint/knee-arthroscopy',
  },
];

const dailyCareSlides = [
  {
    title: '분야가 다른 전문의가 함께 봅니다',
    desc: '신경외과·정형외과·마취통증의학과·영상의학과 전문의가 같은 환자의 검사 결과와 치료 방향을 함께 논의합니다. 한 분야의 시야로 놓칠 수 있는 원인까지 함께 확인합니다.',
    tags: ['다학제 협진', '분야별 전문의', '치료 방향 논의'],
    image: '/images/daily-care/ys-daily-care-collaboration.jpg',
    // 원본이 가로로 길어(1.93:1) 그대로 넣으면 양 끝 의료진이 잘립니다.
    // 박스 비율(1.34:1) 캔버스에 위·아래를 흰색으로 페이드해 얹은 이미지를 씁니다.
    imageAlt: '수술실에서 세 명의 의료진이 함께 척추내시경 수술을 진행하는 모습',
  },
  {
    title: '검사부터 진단까지 정확하게',
    desc: '대학병원급 영상 장비와 숙련된 의료진의 판독을 바탕으로 통증의 원인을 세밀하게 확인합니다. 필요한 치료만 제안하는 정직한 진료를 지향합니다.',
    tags: ['정밀검사', 'MRI 판독', '맞춤진단'],
    image: '/images/daily-care/ys-daily-care-diagnosis.jpg',
    imageAlt: '영상 검사실에서 의료진이 척추 MRI 영상을 확인하는 장면',
  },
  {
    title: '비수술 치료와 재활의 연결',
    desc: '주사치료, 도수치료, 재활운동을 환자 상태에 맞게 연결해 일상 복귀의 부담을 낮춥니다. 치료 후 회복 과정까지 꼼꼼하게 살핍니다.',
    tags: ['비수술치료', '재활운동', '통증관리'],
    image: '/images/daily-care/ys-daily-care-rehab.jpg',
    imageAlt: '재활 치료실에서 의료진이 환자의 상지 재활 운동 치료를 돕는 장면',
  },
  {
    title: '일상으로 돌아가는 따뜻한 동행',
    desc: '진료실을 나선 뒤에도 환자분의 내일이 흔들리지 않도록 회복 여정을 함께합니다. 작은 변화까지 살피는 마음으로 건강한 일상을 응원합니다.',
    tags: ['회복관리', '생활복귀', '안심동행'],
    image: '/images/daily-care/ys-daily-care-recovery.jpg',
    imageAlt: '휠체어 환자와 다정하게 눈을 맞추며 회복을 돕는 의료진',
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

type DailyCareSlide = (typeof dailyCareSlides)[number];

// 데스크탑(lg 이상)에서는 글자를 1.3배로 키웁니다. 줄 간격은 토큰의 배수라 함께 커집니다.
function DailyCareSlideText({ slide, animated = false }: { slide: DailyCareSlide; animated?: boolean }) {
  const item = animated ? careTextItem : undefined;
  const Title = animated ? 'h3' : 'p';
  return (
    <>
      <motion.div variants={item}>
        <Title className="break-keep text-h3 tracking-tight text-ink lg:text-[length:calc(var(--text-h3)*1.3)]">
          {slide.title}
        </Title>
      </motion.div>

      <motion.p variants={item} className="max-w-xl break-keep text-body text-ink-sub lg:max-w-none lg:text-[length:calc(var(--text-body)*1.3)]">
        {slide.desc}
      </motion.p>

      <motion.div variants={item} className="flex flex-wrap gap-3">
        {slide.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-caption font-semibold text-ink-sub shadow-[0_10px_28px_-24px_rgba(15,29,54,0.35)] lg:px-5 lg:py-2.5 lg:text-[length:calc(var(--text-caption)*1.3)]"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </>
  );
}

const quickAccessItems = [
  {
    title: '진료일정',
    description: '의료진별 진료일정을 확인하고\n내원 계획을 세워보세요.',
    href: '/doctors#doctor-schedule',
    icon: <CalendarDays size={58} strokeWidth={1.65} />,
  },
  {
    title: '의료진 소개',
    description: '환자의 건강한 일상을 위해\n함께하는 의료진을 소개합니다.',
    href: '/doctors',
    icon: <UserCheck size={58} strokeWidth={1.65} />,
  },
  {
    title: '치료체험후기',
    description: '치료와 회복의 여정을 담은\n환자분들의 이야기를 만나보세요.',
    href: '/board/reviews',
    icon: <HeartHandshake size={58} strokeWidth={1.65} />,
  },
  {
    title: '증명서 발급',
    description: '필요한 증명서와 발급 절차를\n미리 확인하세요.',
    href: '/board/certificates',
    icon: <FileText size={58} strokeWidth={1.65} />,
  },
  {
    title: '온라인 상담',
    description: '진료 전 궁금한 점을\n편안하게 남겨주세요.',
    href: '/consultation',
    icon: <MessageCircle size={58} strokeWidth={1.65} />,
  },
  {
    title: '오시는 길',
    description: '연세척병원으로 오시는 길과\n주차 안내를 확인하세요.',
    href: '/about/location',
    icon: <MapPin size={58} strokeWidth={1.65} />,
  },
];

export default function HomePageContent({
  noticeSettings,
  latestReviews,
  initialSlideIndex,
}: {
  noticeSettings: HomeNoticeSettings;
  latestReviews: HomeReview[] | null;
  initialSlideIndex: number;
}) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(initialSlideIndex);
  const [incomingSlideIndex, setIncomingSlideIndex] = useState<number | null>(null);
  const [isIncomingSlideReady, setIsIncomingSlideReady] = useState(false);
  const [activeCareIndex, setActiveCareIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const selectedSlideIndex = incomingSlideIndex ?? activeSlideIndex;
  const activeCareSlide = dailyCareSlides[activeCareIndex];

  const showSlide = (index: number) => {
    if (index === incomingSlideIndex) return;

    if (index === activeSlideIndex) {
      setIncomingSlideIndex(null);
      setIsIncomingSlideReady(false);
      return;
    }

    setIsIncomingSlideReady(false);
    setIncomingSlideIndex(index);
  };

  const showPreviousSlide = () => {
    showSlide(selectedSlideIndex === 0 ? heroSlides.length - 1 : selectedSlideIndex - 1);
  };

  const showNextSlide = () => {
    showSlide((selectedSlideIndex + 1) % heroSlides.length);
  };

  const showPreviousCareSlide = () => {
    setActiveCareIndex((current) => (current === 0 ? dailyCareSlides.length - 1 : current - 1));
  };

  const showNextCareSlide = () => {
    setActiveCareIndex((current) => (current + 1) % dailyCareSlides.length);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const currentSlideIndex = incomingSlideIndex ?? activeSlideIndex;
      const nextSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
      setIsIncomingSlideReady(false);
      setIncomingSlideIndex(nextSlideIndex);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [activeSlideIndex, incomingSlideIndex]);

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
          <div className="absolute inset-0 h-full w-full">
            <ResponsiveHeroImage
              slide={heroSlides[activeSlideIndex]}
              isFirstSlide={activeSlideIndex === initialSlideIndex}
            />
          </div>

          {incomingSlideIndex !== null && (
            <motion.div
              key={heroSlides[incomingSlideIndex].id}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: isIncomingSlideReady ? 1 : 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 1.05,
                ease: [0.4, 0, 0.2, 1],
              }}
              onAnimationComplete={() => {
                if (!isIncomingSlideReady || incomingSlideIndex === null) return;

                setActiveSlideIndex(incomingSlideIndex);
                setIncomingSlideIndex(null);
                setIsIncomingSlideReady(false);
              }}
              className="absolute inset-0 h-full w-full will-change-[opacity]"
            >
              <ResponsiveHeroImage
                slide={heroSlides[incomingSlideIndex]}
                isFirstSlide={false}
                onLoad={() => setIsIncomingSlideReady(true)}
              />
            </motion.div>
          )}
        </div>

        <nav
          aria-label="메인 배너 이동"
          className="absolute bottom-4 right-4 z-20 flex items-center gap-2 sm:bottom-5 sm:right-5 lg:right-8"
        >
          <button
            type="button"
            onClick={showPreviousSlide}
            aria-label="이전 배너 보기"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-colors hover:border-white hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-10 sm:w-10"
          >
            <ChevronRight aria-hidden="true" size={20} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={showNextSlide}
            aria-label="다음 배너 보기"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-colors hover:border-white hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-10 sm:w-10"
          >
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </nav>
      </section>

      <HomeNoticeBar settings={noticeSettings} />

      {/* Quick Access Section */}
      <section aria-labelledby="quick-access-heading" className="bg-white pt-9 md:pt-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
          <h2 id="quick-access-heading" className="sr-only">연세척병원 빠른 메뉴</h2>
          <div className={styles.grid}>
            {quickAccessItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                prefetch
                className={styles.card}
                aria-label={`${item.title} 바로가기`}
              >
                <div className={styles.copy}>
                  <span className={styles.title}>{item.title}</span>
                  <p className={styles.description}>{item.description}</p>
                </div>
                <span className={styles.icon} aria-hidden="true">{item.icon}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 의료진 리빌 영역은 임시 비노출: 컴포넌트는 보관하고 마운트·이미지 로딩·스크롤 효과를 중단합니다. */}
      {/* 🧬 Specialty System Section */}
      <section aria-labelledby="specialty-heading" className="bg-white py-12 text-ink md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
          <h2 id="specialty-heading" className="mb-7 break-keep text-[clamp(1.5rem,6vw,1.625rem)] font-extrabold leading-tight tracking-tight md:mb-10 md:text-h2">
            척추/관절 특화 병원
            <span className="mt-2 block text-primary">연세척병원</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {specializedPrograms.map((program) => (
              <Link
                key={program.title}
                href={program.href}
                aria-label={program.title}
                className="group relative isolate flex aspect-square min-w-0 flex-col justify-end overflow-hidden rounded-lg bg-primary text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:-translate-y-1 lg:aspect-[3/4]"
              >
                <Image
                  src={program.image}
                  alt=""
                  fill
                  sizes="(min-width: 1400px) 315px, (min-width: 1024px) calc((100vw - 116px) / 4), (min-width: 640px) calc((100vw - 76px) / 2), calc((100vw - 52px) / 2)"
                  className="object-cover object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0" style={{ background: program.overlay }} />
                <div className="relative flex flex-col p-4 sm:p-7 lg:p-6 xl:p-8">
                  <h3 className="break-keep text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-[1.25] tracking-tight lg:text-[clamp(1.625rem,2.3vw,2rem)]">
                    {program.titleLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </h3>
                  <svg aria-hidden="true" viewBox="0 0 64 24" fill="none" className="mt-3 h-5 w-12 self-end sm:mt-6 sm:h-6 sm:w-16 lg:mt-8 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1">
                    <path d="M1 21H60L41 2" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <UbeTextbookFeatureSection />

      {/* 🌏 국제 척추내시경 트레이닝 센터 Section */}
      <TrainingCenterSection />

      {/* ▶️ 척추관절 연세척TV Section */}
      <YoutubeSection />

      {/* 💬 치료체험 후기 Section */}
      <ReviewsShowcaseSection reviews={latestReviews} />

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
              {/* 모바일에서는 br 이 사라지므로 공백을 명시해야 두 문장이 붙지 않습니다. */}
              <br className="hidden md:block" />{' '}
              연세척병원만의 차별화된 전문성과 따뜻한 마음을 만나보세요.
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-14 max-w-7xl px-5 sm:px-7 md:mt-28 xl:px-10">
          <div className="relative min-h-0 lg:min-h-[500px]">
            <div className="relative z-10 grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:gap-20">
              {/* 사진은 칸 너비를 채우고 높이는 1.34:1 비율로 따라갑니다. 높이를 고정하면 넓은 화면에서는 칸보다 좁아지고 1024px에서는 글 칸을 침범했습니다. */}
              <div className="relative aspect-[4/3] min-h-0 overflow-hidden rounded-[12px] md:aspect-[1.34/1] md:min-h-[420px] md:rounded-none lg:min-h-0">
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
                      sizes="(min-width: 1400px) 664px, (min-width: 1024px) 47vw, 92vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-white/20" />
                  </motion.div>
                </AnimatePresence>
              </div>

              <article className="space-y-7 md:space-y-12 lg:space-y-10">
                {/* 화살표 버튼의 안쪽 여백만큼 당겨, 왼쪽 화살표가 아래 글의 시작선과 맞게 합니다. */}
                <div className="-ml-2 flex items-center gap-4 lg:-ml-2.5">
                  <button
                    type="button"
                    onClick={showPreviousCareSlide}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/0 text-ink lg:h-11 lg:w-11"
                    aria-label="이전 진료 약속 보기"
                  >
                    <ChevronRight size={20} className="rotate-180 lg:h-6 lg:w-6" />
                  </button>
                  <div className="flex items-center gap-4 font-montserrat text-[16px] font-bold tracking-widest lg:text-[21px]">
                    <span className="text-ink">{String(activeCareIndex + 1).padStart(2, '0')}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-400/50" />
                    <span className="text-slate-400">{String(dailyCareSlides.length).padStart(2, '0')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={showNextCareSlide}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/0 text-ink lg:h-11 lg:w-11"
                    aria-label="다음 진료 약속 보기"
                  >
                    <ChevronRight size={20} className="lg:h-6 lg:w-6" />
                  </button>
                </div>

                {/* 네 슬라이드를 보이지 않게 겹쳐 두어 가장 긴 슬라이드 높이로 자리를 잡습니다.
                    슬라이드가 바뀌어도 글 위치가 흔들리지 않고, 사진 세로 가운데에 맞춰집니다. */}
                <div className="relative grid">
                  {dailyCareSlides.map((slide) => (
                    <div key={slide.title} aria-hidden="true" className="invisible space-y-5 [grid-area:1/1] md:space-y-7">
                      <DailyCareSlideText slide={slide} />
                    </div>
                  ))}
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeCareIndex}
                      variants={careTextContainer}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="space-y-5 [grid-area:1/1] md:space-y-7"
                    >
                      <DailyCareSlideText slide={activeCareSlide} animated />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

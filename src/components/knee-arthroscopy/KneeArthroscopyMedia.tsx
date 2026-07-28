'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

const ASSET_ROOT = '/images/treatments/joint/knee-arthroscopy';
const STILL_CHANGE_INTERVAL = 4600;

const stills = [
  {
    src: `${ASSET_ROOT}/scope-view-01.png`,
    alt: '관절내시경으로 본 매끄러운 무릎 관절면',
    title: '관절면 관찰',
    description: '관절 표면과 관절 간격을 여러 각도에서 살펴봅니다.',
  },
  {
    src: `${ASSET_ROOT}/scope-view-02.png`,
    alt: '관절내시경으로 본 국소적인 관절면 변화',
    title: '손상 범위 확인',
    description: '관절면의 변화를 직접 확인하고 주변 조직과 함께 평가합니다.',
  },
  {
    src: `${ASSET_ROOT}/scope-view-03.png`,
    alt: '관절내시경 화면에서 미세 기구로 조직 상태를 확인하는 장면',
    title: '미세 기구 접근',
    description: '관절경 시야를 유지하며 미세 기구로 조직의 안정성을 살펴봅니다.',
  },
  {
    src: `${ASSET_ROOT}/scope-view-04.png`,
    alt: '관절내시경 화면에서 기구가 관절면 가까이 접근한 장면',
    title: '세부 상태 점검',
    description: '치료 기구의 위치와 주변 관절면을 화면으로 확인합니다.',
  },
  {
    src: `${ASSET_ROOT}/scope-view-05.png`,
    alt: '관절내시경으로 본 골수 자극술의 작은 천공 부위',
    title: '연골 치료 화면',
    description: '선별된 국소 연골 손상에서 시행할 수 있는 골수 자극술 화면입니다.',
  },
];

const viewingPoints = [
  {
    number: '01',
    title: '관절 안을 크게 봅니다',
    description: '연골, 반월상연골, 활막 등 관절 내부 구조를 확대해 살펴봅니다.',
  },
  {
    number: '02',
    title: '여러 정보를 함께 판단합니다',
    description: '증상과 진찰, 영상검사 결과에 관절경 소견을 더해 종합적으로 평가합니다.',
  },
  {
    number: '03',
    title: '계획한 범위를 치료합니다',
    description: '화면으로 위치를 확인하며 계획한 범위에 미세 수술 기구로 접근합니다.',
  },
];

export default function KneeArthroscopyMedia() {
  const [activeStill, setActiveStill] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isGalleryInView = useInView(galleryRef, { amount: 0.35 });
  const shouldReduceMotion = useReducedMotion();
  const currentStill = stills[activeStill];

  useEffect(() => {
    if (!isAutoPlaying || !isGalleryInView || shouldReduceMotion) return;

    const timer = window.setTimeout(() => {
      setActiveStill((current) => (current + 1) % stills.length);
    }, STILL_CHANGE_INTERVAL);

    return () => window.clearTimeout(timer);
  }, [activeStill, isAutoPlaying, isGalleryInView, shouldReduceMotion]);

  const showPreviousStill = () => {
    setActiveStill((current) => (current - 1 + stills.length) % stills.length);
  };

  const showNextStill = () => {
    setActiveStill((current) => (current + 1) % stills.length);
  };

  return (
    <section
      id="arthroscopy-media"
      aria-labelledby="knee-arthroscopy-media-title"
      className="relative isolate overflow-hidden bg-[#071A3D] px-5 py-16 text-white sm:px-6 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-52 h-[34rem] w-[34rem] rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-64 -left-52 h-[36rem] w-[36rem] rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2
            id="knee-arthroscopy-media-title"
            className="break-keep text-h2 tracking-tight text-white"
          >
            관절 안을 직접 보며,
            <br /> 필요한 치료로 이어갑니다
          </h2>
          <p className="mx-auto mt-5 max-w-2xl break-keep text-body-lg text-white/72">
            수술실 모니터에 확대된 관절 내부를 보면서 병변의 형태와 주변 조직을
            확인하고, 계획한 범위의 치료를 진행합니다.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid items-stretch gap-5 sm:mt-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.72fr)] lg:gap-7">
          <ScrollReveal variant="image" className="min-w-0">
            <figure className="h-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:p-3">
              <div className="relative overflow-hidden rounded-xl bg-black">
                <video
                  aria-label="실제 무릎 관절내시경 수술 영상"
                  aria-describedby="knee-arthroscopy-video-caption"
                  autoPlay
                  controls
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster={`${ASSET_ROOT}/arthroscopy-video-poster.png`}
                  width={1920}
                  height={1080}
                  className="aspect-video w-full bg-black object-cover"
                >
                  <source src={`${ASSET_ROOT}/arthroscopy-procedure.mp4`} type="video/mp4" />
                  이 브라우저에서는 동영상을 재생할 수 없습니다.
                </video>
              </div>
              <figcaption
                id="knee-arthroscopy-video-caption"
                className="flex flex-col gap-1 px-3 pb-2 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-4 sm:pb-3 sm:pt-5"
              >
                <p className="shrink-0 text-sm font-bold text-white sm:text-base">
                  실제 무릎 관절내시경 화면
                </p>
                <p className="break-keep text-[13px] font-medium leading-relaxed text-white/58 sm:text-right sm:text-sm">
                  관절경 카메라로 관절 내부를 살펴보며 수술을 진행하는 모습입니다.
                </p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-7 lg:p-8">
              <div>
                <p className="text-[12px] font-bold tracking-[0.12em] text-cyan-300">
                  ARTHROSCOPY PROCESS
                </p>
                <h3 className="mt-2 break-keep text-h3 tracking-tight text-white">
                  화면으로 확인하는
                  <br className="hidden sm:block" /> 치료의 흐름
                </h3>
              </div>

              <ol className="mt-6 flex-1 space-y-3">
                {viewingPoints.map((point) => (
                  <li
                    key={point.title}
                    className="grid grid-cols-[42px_minmax(0,1fr)] gap-3 rounded-xl border border-white/10 bg-[#071A3D]/35 p-3.5 sm:grid-cols-[46px_minmax(0,1fr)] sm:p-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/12 font-montserrat text-[12px] font-bold text-cyan-300 sm:h-10 sm:w-10">
                      {point.number}
                    </span>
                    <div>
                      <p className="break-keep text-sm font-bold text-white sm:text-[15px]">
                        {point.title}
                      </p>
                      <p className="mt-1 break-keep text-[12px] font-medium leading-[1.65] text-white/58 sm:text-[13px]">
                        {point.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-16 border-t border-white/15 pt-12 md:mt-24 md:pt-16">
          <ScrollReveal>
            <h3 className="break-keep text-h3 tracking-tight text-white">
              관절경으로 보는 주요 장면
            </h3>
          </ScrollReveal>

          <ScrollReveal variant="image" className="mt-7">
            <div
              ref={galleryRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="관절경 주요 장면"
              className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_28px_90px_rgba(0,0,0,0.24)]"
            >
              <div className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.68fr)]">
                <div className="relative aspect-video min-w-0 overflow-hidden bg-black">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentStill.src}
                      initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.025 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.55,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentStill.src}
                        alt={currentStill.alt}
                        fill
                        sizes="(min-width: 1024px) 980px, 100vw"
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex min-h-[250px] flex-col justify-between border-t border-white/10 bg-[#0B2148] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
                  <div aria-live="polite">
                    <p className="font-montserrat text-[12px] font-bold tracking-[0.14em] text-cyan-300">
                      {String(activeStill + 1).padStart(2, '0')}
                      <span className="ml-2 text-white/35">
                        / {String(stills.length).padStart(2, '0')}
                      </span>
                    </p>
                    <h4 className="mt-4 break-keep text-h3 tracking-tight text-white">
                      {currentStill.title}
                    </h4>
                    <p className="mt-3 break-keep text-sm font-medium leading-[1.8] text-white/62 sm:text-base">
                      {currentStill.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    <div aria-hidden className="grid grid-cols-5 gap-1.5">
                      {stills.map((still, index) => (
                        <span
                          key={still.src}
                          className="relative h-1 overflow-hidden rounded-full bg-white/12"
                        >
                          {index < activeStill && (
                            <span className="absolute inset-0 bg-cyan-300" />
                          )}
                          {index === activeStill && (
                            <motion.span
                              key={`${activeStill}-${isAutoPlaying}-${isGalleryInView}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{
                                duration:
                                  isAutoPlaying && isGalleryInView && !shouldReduceMotion
                                    ? STILL_CHANGE_INTERVAL / 1000
                                    : 0,
                                ease: 'linear',
                              }}
                              className="absolute inset-0 origin-left bg-cyan-300"
                            />
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={showPreviousStill}
                        aria-label="이전 관절경 장면"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      >
                        <ChevronLeft aria-hidden size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAutoPlaying((current) => !current)}
                        aria-label={isAutoPlaying ? '장면 자동 전환 일시정지' : '장면 자동 전환 재생'}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/10 text-cyan-300 transition-colors hover:bg-cyan-300/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      >
                        {isAutoPlaying ? (
                          <Pause aria-hidden size={18} fill="currentColor" />
                        ) : (
                          <Play aria-hidden size={18} fill="currentColor" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={showNextStill}
                        aria-label="다음 관절경 장면"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      >
                        <ChevronRight aria-hidden size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <ol className="grid grid-cols-5 gap-2 border-t border-white/10 bg-[#071A3D]/45 p-3 sm:gap-3 sm:p-4">
                {stills.map((still, index) => {
                  const isActive = index === activeStill;

                  return (
                    <li key={still.src} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => setActiveStill(index)}
                        aria-pressed={isActive}
                        aria-label={`${index + 1}단계 ${still.title} 화면 보기`}
                        className={`group w-full overflow-hidden rounded-lg border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                          isActive
                            ? 'border-cyan-300/80 bg-cyan-300/10 shadow-[0_12px_30px_rgba(0,0,0,0.2)]'
                            : 'border-white/10 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]'
                        }`}
                      >
                        <span className="relative block aspect-square w-full overflow-hidden bg-black sm:aspect-video">
                          <Image
                            src={still.src}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 250px, 20vw"
                            className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                          />
                        </span>
                        <span
                          className={`flex min-h-9 items-center justify-center gap-1 px-1 py-2 text-center font-montserrat text-[10px] font-bold sm:min-h-12 sm:justify-start sm:gap-2 sm:px-3 sm:text-left sm:text-[11px] ${
                            isActive ? 'text-cyan-300' : 'text-white'
                          }`}
                        >
                          <span className="opacity-60">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="hidden break-keep font-sans sm:inline sm:text-[13px]">
                            {still.title}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

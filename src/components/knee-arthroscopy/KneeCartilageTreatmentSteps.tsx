'use client';

import Image from 'next/image';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

const ASSET_ROOT = '/images/treatments/joint/knee-arthroscopy';

interface TreatmentStep {
  title: string;
  description: string;
  points: string[];
  images: Array<{
    src: string;
    alt: string;
  }>;
}

const treatmentSteps: TreatmentStep[] = [
  {
    title: '관절 내부 확인',
    description:
      '관절경 카메라를 통해 관절연골과 반월상연골, 활막 등 무릎 내부 구조를 차례로 살펴봅니다.',
    points: ['연골 손상 위치 확인', '관절 전체의 동반 병변 점검'],
    images: [
      {
        src: `${ASSET_ROOT}/cartilage-step-01-a.jpg`,
        alt: '관절경으로 무릎 관절 내부를 확인하는 화면',
      },
    ],
  },
  {
    title: '손상 부위 평가',
    description:
      '연골 결손 부위의 크기와 깊이, 주변 조직의 안정성을 직접 관찰해 계획한 치료 범위를 구체화합니다.',
    points: ['손상 범위와 깊이 평가', '주변 연골의 안정성 확인'],
    images: [
      {
        src: `${ASSET_ROOT}/cartilage-step-02-a.jpg`,
        alt: '관절경으로 연골 손상 부위를 평가하는 화면',
      },
    ],
  },
  {
    title: '불안정 조직 정리',
    description:
      '필요한 경우 들뜨거나 불안정한 연골 조각과 염증 조직을 정리해 치료할 부위를 준비합니다.',
    points: ['불안정한 조직 범위 확인', '주변 정상 조직을 고려한 선택적 정리'],
    images: [
      {
        src: `${ASSET_ROOT}/cartilage-step-03-a.jpg`,
        alt: '관절경 기구로 불안정한 연골 부위를 확인하는 화면',
      },
      {
        src: `${ASSET_ROOT}/cartilage-step-03-b.jpg`,
        alt: '관절경으로 연골 치료 부위를 정리하는 화면',
      },
    ],
  },
  {
    title: '골수 자극술',
    description:
      '선별된 국소 연골 결손에서는 연골 아래 뼈에 작은 통로를 만들어 골수 성분을 통한 회복 반응을 유도할 수 있습니다.',
    points: ['병변의 크기와 위치에 맞춘 접근', '회복 반응이 형성될 공간 준비'],
    images: [
      {
        src: `${ASSET_ROOT}/cartilage-step-04-a.jpg`,
        alt: '관절경으로 골수 자극술을 준비하는 화면',
      },
      {
        src: `${ASSET_ROOT}/cartilage-step-04-b.jpg`,
        alt: '관절경으로 연골 아래 뼈에 작은 통로를 만든 화면',
      },
    ],
  },
  {
    title: '치료 부위 마무리 확인',
    description:
      '치료 부위와 주변 관절면을 다시 살펴 안정성을 확인하고, 관절 내부를 정돈한 뒤 수술을 마무리합니다.',
    points: ['치료 부위의 최종 상태 확인', '주변 관절면과 관절 내부 점검'],
    images: [
      {
        src: `${ASSET_ROOT}/cartilage-step-05-a.jpg`,
        alt: '관절경으로 연골 치료 부위를 마무리 점검하는 화면',
      },
      {
        src: `${ASSET_ROOT}/cartilage-step-05-b.jpg`,
        alt: '관절경으로 치료 후 관절면을 확인하는 화면',
      },
    ],
  },
];

function StepGallery({
  step,
  stepIndex,
  activeImage,
  onSelectImage,
}: {
  step: TreatmentStep;
  stepIndex: number;
  activeImage: number;
  onSelectImage: (index: number) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const hasMultipleImages = step.images.length > 1;
  const active = step.images[activeImage];

  const showPrevious = () => {
    onSelectImage((activeImage - 1 + step.images.length) % step.images.length);
  };

  const showNext = () => {
    onSelectImage((activeImage + 1) % step.images.length);
  };

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-200">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.src}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label={`${step.title} 이전 관절경 화면 보기`}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#071A3D]/72 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-[#071A3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <ChevronLeft aria-hidden size={23} />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label={`${step.title} 다음 관절경 화면 보기`}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#071A3D]/72 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-[#071A3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <ChevronRight aria-hidden size={23} />
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {step.images.map((image, imageIndex) => {
            const isActive = imageIndex === activeImage;

            return (
              <button
                key={image.src}
                type="button"
                onClick={() => onSelectImage(imageIndex)}
                aria-label={`${stepIndex + 1}단계 관절경 화면 ${imageIndex + 1} 보기`}
                aria-pressed={isActive}
                className={`relative aspect-[16/7] overflow-hidden rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive
                    ? 'border-primary shadow-[0_10px_25px_rgba(40,74,165,0.2)]'
                    : 'border-transparent opacity-55 hover:opacity-90'
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 280px, 46vw"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function KneeCartilageTreatmentSteps() {
  const [openStep, setOpenStep] = useState(0);
  const [activeImages, setActiveImages] = useState(() => treatmentSteps.map(() => 0));
  const accordionId = useId();
  const shouldReduceMotion = useReducedMotion();

  const selectImage = (stepIndex: number, imageIndex: number) => {
    setActiveImages((current) =>
      current.map((value, index) => (index === stepIndex ? imageIndex : value)),
    );
  };

  return (
    <section
      aria-labelledby="knee-cartilage-steps-title"
      className="bg-[#F5F7FA] px-5 py-16 sm:px-6 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <h2
            id="knee-cartilage-steps-title"
            className="break-keep text-h2 tracking-tight text-ink"
          >
            관절내시경으로 직접 확인하며
            <br className="hidden sm:block" /> 진행하는 연골 치료 과정
          </h2>
          <p className="mx-auto mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
            관절 내부를 살펴 손상 범위를 확인하고, 계획된 치료를 단계적으로 진행합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mx-auto mt-10 max-w-6xl sm:mt-14">
          <div className="space-y-3 sm:space-y-4">
            {treatmentSteps.map((step, index) => {
              const isOpen = openStep === index;
              const triggerId = `${accordionId}-trigger-${index}`;
              const panelId = `${accordionId}-panel-${index}`;

              return (
                <article
                  key={step.title}
                  className={`overflow-hidden rounded-lg border bg-white transition-all duration-500 ${
                    isOpen
                      ? 'border-primary/30 shadow-[0_20px_55px_rgba(15,29,54,0.09)]'
                      : 'border-slate-200 hover:border-primary/25'
                  }`}
                >
                  <h3>
                    <button
                      id={triggerId}
                      type="button"
                      onClick={() => setOpenStep(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:gap-5 sm:px-6 sm:py-5 md:px-8 md:py-6"
                    >
                      <span
                        className={`min-w-[3.25rem] rounded-full px-3 py-1.5 text-center font-montserrat text-xs font-bold transition-colors sm:min-w-[3.75rem] sm:text-sm ${
                          isOpen
                            ? 'bg-primary text-white'
                            : 'bg-primary-light text-primary group-hover:bg-primary group-hover:text-white'
                        }`}
                      >
                        {index + 1}단계
                      </span>
                      <span
                        className={`break-keep text-[17px] font-bold leading-snug transition-colors sm:text-xl ${
                          isOpen ? 'text-primary' : 'text-ink'
                        }`}
                      >
                        {step.title}
                      </span>
                      <ChevronDown
                        aria-hidden
                        className={`text-primary transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        size={24}
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.46,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 border-t border-slate-200 p-4 sm:gap-8 sm:p-6 md:p-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)] lg:items-center lg:gap-12">
                          <StepGallery
                            step={step}
                            stepIndex={index}
                            activeImage={activeImages[index]}
                            onSelectImage={(imageIndex) => selectImage(index, imageIndex)}
                          />

                          <div className="pb-1 lg:pr-4">
                            <p className="break-keep text-base font-semibold leading-[1.8] text-ink-sub md:text-lg">
                              {step.description}
                            </p>
                            <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
                              {step.points.map((point) => (
                                <li
                                  key={point}
                                  className="flex items-center gap-3 py-3.5 break-keep text-[15px] font-bold leading-relaxed text-ink sm:text-base"
                                >
                                  <span
                                    aria-hidden
                                    className="h-2 w-2 shrink-0 rounded-full bg-primary"
                                  />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

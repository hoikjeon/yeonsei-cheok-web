'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

const TREATMENT_STEPS = [
  {
    stage: 'STEP 01',
    title: '보존적 치료',
    detail: ['약물 · 도수 · 운동치료'],
    height: 22,
    color: '#25AFC7',
  },
  {
    stage: 'STEP 02',
    title: '주사 치료',
    detail: ['신경주사 · 프롤로 주사'],
    height: 38,
    color: '#2B92B5',
  },
  {
    stage: 'STEP 03',
    title: '시술',
    detail: ['고주파수핵감압술', '풍선확장술 · 신경성형술'],
    height: 54,
    color: '#16528E',
    labelGap: 6,
  },
  {
    stage: 'STEP 04',
    title: '내시경 치료',
    detail: ['신경근성형술', '양방향 척추내시경'],
    height: 70,
    color: '#1A356A',
    labelGap: 6,
  },
  {
    stage: 'STEP 05',
    title: '고난이도 수술',
    detail: ['척추 유합술 · 나사못 고정술'],
    height: 86,
    color: '#0A1428',
  },
];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BAR_REVEAL_DELAY = 0.14;
const BAR_STAGGER = 0.13;
const BAR_DRAW_DURATION = 0.86;
const ARROW_REVEAL_DELAY = BAR_REVEAL_DELAY + 0.04;
const ARROW_DRAW_DURATION = BAR_DRAW_DURATION + BAR_STAGGER * (TREATMENT_STEPS.length - 1);
const ARROW_HEAD_START_OFFSET = { x: -688, y: 208 };

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.76,
      ease: EASE_OUT,
    },
  },
};

const barVariants: Variants = {
  hidden: { opacity: 0.72, scaleY: 0 },
  visible: (index = 0) => ({
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: BAR_DRAW_DURATION,
      delay: BAR_REVEAL_DELAY + index * BAR_STAGGER,
      ease: EASE_OUT,
    },
  }),
};

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      delay: BAR_REVEAL_DELAY + index * BAR_STAGGER + 0.16,
      ease: EASE_OUT,
    },
  }),
};

const captionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      delay: ARROW_REVEAL_DELAY + ARROW_DRAW_DURATION - 0.22,
      ease: EASE_OUT,
    },
  },
};

const arrowLineVariants: Variants = {
  hidden: { opacity: 0, pathLength: 0 },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: { duration: ARROW_DRAW_DURATION, delay: ARROW_REVEAL_DELAY, ease: EASE_OUT },
  },
};

const arrowHeadVariants: Variants = {
  hidden: { opacity: 0, x: ARROW_HEAD_START_OFFSET.x, y: ARROW_HEAD_START_OFFSET.y },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      x: { duration: ARROW_DRAW_DURATION, delay: ARROW_REVEAL_DELAY, ease: EASE_OUT },
      y: { duration: ARROW_DRAW_DURATION, delay: ARROW_REVEAL_DELAY, ease: EASE_OUT },
      opacity: { duration: 0.18, delay: ARROW_REVEAL_DELAY, ease: EASE_OUT },
    },
  },
};

const TreatmentStepGraph = () => {
  const shouldReduceMotion = useReducedMotion();
  const initialState = shouldReduceMotion ? 'visible' : 'hidden';

  return (
    <motion.div
      className="relative"
      initial={initialState}
      whileInView="visible"
      viewport={{ once: true, amount: 0.26 }}
      variants={cardVariants}
    >
      <div className="mt-12 md:mt-14">
        <div className="relative hidden h-[640px] overflow-hidden bg-[#F4F7FA] md:block">
          <div className="absolute inset-x-[8%] bottom-[124px] top-[176px] z-10 grid grid-cols-5 items-end">
            {TREATMENT_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="relative flex h-full items-end border-r border-slate-300/70 first:border-l"
              >
                <motion.div
                  className="absolute left-0 right-0 z-20 px-3 text-center"
                  style={{ bottom: `calc(${step.height}% + ${step.labelGap ?? 16}px)` }}
                  custom={index}
                  variants={labelVariants}
                >
                  <p className="font-montserrat text-[10px] font-extrabold tracking-[0.22em] text-primary/70">
                    {step.stage}
                  </p>
                  <h4 className="mt-1 text-h4 leading-tight tracking-tight text-ink">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-[12px] font-bold leading-[1.45] text-ink-sub lg:text-[14px]">
                    {step.detail.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </motion.div>

                <motion.div
                  className="relative w-full origin-bottom"
                  style={{ height: `${step.height}%`, backgroundColor: step.color }}
                  custom={index}
                  variants={barVariants}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-white/45" />
                </motion.div>
              </div>
            ))}
          </div>

          <div className="absolute left-[8%] top-[62px] z-20 select-none text-[54px] font-bold leading-none tracking-tight text-ink lg:text-[72px]">
            연세<span className="text-primary">척</span>이니까!
          </div>

          <motion.svg
            className="absolute inset-x-[8%] bottom-[124px] top-[176px] z-30 overflow-visible"
            viewBox="0 0 1000 380"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M 230 320 L 918 112"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(15, 23, 42, 0.18))' }}
              variants={arrowLineVariants}
            />
            <motion.path
              d="M 940 105 L 903 100 L 918 112 L 914 130 Z"
              fill="#FFFFFF"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(15, 23, 42, 0.18))' }}
              variants={arrowHeadVariants}
            />
          </motion.svg>

          <motion.p
            className="absolute inset-x-[8%] bottom-[42px] z-40 text-center text-[18px] font-bold tracking-tight text-primary lg:text-[22px]"
            variants={captionVariants}
          >
            단계적 척추치료, 처음부터 끝까지 함께합니다.
          </motion.p>
        </div>

        <ol className="space-y-3 md:hidden">
          {TREATMENT_STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 rounded-lg border border-slate-100 bg-slate-50/70 p-5"
              custom={index}
              variants={labelVariants}
            >
              <div className="relative flex justify-center">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg font-montserrat text-xs font-extrabold text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {index + 1}
                </span>
                {index < TREATMENT_STEPS.length - 1 ? (
                  <span className="absolute top-12 h-[calc(100%+12px)] w-px bg-slate-200" />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="font-montserrat text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary/70">
                  {step.stage}
                </p>
                <h4 className="mt-1 text-h4 leading-tight tracking-tight text-ink">
                  {step.title}
                </h4>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-sub">
                  {step.detail.join(' · ')}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
};

export default TreatmentStepGraph;

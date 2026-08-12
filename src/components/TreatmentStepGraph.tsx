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
// 모바일 SVG는 viewBox가 컨테이너 크기(358x400)라 이동 거리도 그 좌표계 기준입니다.
const MOBILE_ARROW_HEAD_START_OFFSET = { x: -256, y: 154 };

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

// 화살표 머리는 선을 따라 달려오는 연출이라, 이동 거리를 각 SVG의 좌표계에 맞춰야 합니다.
const createArrowHeadVariants = (offset: { x: number; y: number }): Variants => ({
  hidden: { opacity: 0, x: offset.x, y: offset.y },
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
});

const arrowHeadVariants = createArrowHeadVariants(ARROW_HEAD_START_OFFSET);
const mobileArrowHeadVariants = createArrowHeadVariants(MOBILE_ARROW_HEAD_START_OFFSET);

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
        {/* 모바일에서도 데스크탑과 같은 계단형 그래프를 씁니다.
            좁은 화면에서는 STEP 번호와 상세 설명을 감추고 제목만 남깁니다. */}
        <div className="relative h-[400px] overflow-hidden bg-[#F4F7FA] md:h-[640px]">
          <div className="absolute inset-x-[5%] bottom-[52px] top-[100px] z-10 grid grid-cols-5 items-end md:inset-x-[8%] md:bottom-[124px] md:top-[176px]">
            {TREATMENT_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="relative flex h-full items-end"
              >
                <motion.div
                  className="absolute left-0 right-0 z-20 px-1 text-center md:px-3 bottom-[calc(var(--bar-height)+6px)] md:bottom-[calc(var(--bar-height)+var(--label-gap))]"
                  style={{
                    '--bar-height': `${step.height}%`,
                    '--label-gap': `${step.labelGap ?? 16}px`,
                  } as React.CSSProperties}
                  custom={index}
                  variants={labelVariants}
                >
                  <p className="hidden font-montserrat text-[10px] font-extrabold tracking-[0.22em] text-primary/70 md:block">
                    {step.stage}
                  </p>
                  <h4 className="break-keep text-[11px] font-extrabold leading-tight tracking-tight text-ink md:mt-1 md:text-h4">
                    {step.title}
                  </h4>
                  <p className="mt-2 hidden text-[12px] font-bold leading-[1.45] text-ink-sub md:block lg:text-[14px]">
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

          <div className="absolute left-[5%] top-[34px] z-20 select-none text-[26px] font-bold leading-none tracking-tight text-ink md:left-[8%] md:top-[62px] md:text-[54px] lg:text-[72px]">
            연세<span className="text-primary">척</span>이니까!
          </div>

          {/* 모바일 전용 화살표.
              막대가 낮아 데스크탑 경로를 그대로 쓰면 라벨 글자를 관통하므로,
              라벨 아랫변을 따라 지나가도록 좌표를 따로 잡았습니다. */}
          <motion.svg
            /* h-full w-full이 없으면 SVG가 viewBox 비율대로 줄어들어 좁은 화면에서 좌표가 어긋납니다. */
            className="absolute inset-0 z-30 h-full w-full overflow-visible md:hidden"
            viewBox="0 0 358 400"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M 62 317 L 306 170"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(15, 23, 42, 0.18))' }}
              variants={arrowLineVariants}
            />
            <motion.path
              d="M 318 163 L 309 175 L 303 165 Z"
              fill="#FFFFFF"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(15, 23, 42, 0.18))' }}
              variants={mobileArrowHeadVariants}
            />
          </motion.svg>

          <motion.svg
            /* 가로·세로를 모두 명시해야 합니다. 하나라도 비우면 SVG가 viewBox
               비율(1000:380)대로 크기를 되돌려 막대 밖으로 삐져나옵니다.
               높이 = 컨테이너 640 - 위 176 - 아래 124 = 340px, 폭 = 좌우 8%씩 제외한 84%. */
            className="absolute left-[8%] top-[176px] z-30 hidden h-[340px] w-[84%] overflow-visible md:block"
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
            className="absolute inset-x-[5%] bottom-[18px] z-40 text-center text-[13px] font-bold tracking-tight text-primary md:inset-x-[8%] md:bottom-[42px] md:text-[18px] lg:text-[22px]"
            variants={captionVariants}
          >
            단계적 척추치료, 처음부터 끝까지 함께합니다.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default TreatmentStepGraph;

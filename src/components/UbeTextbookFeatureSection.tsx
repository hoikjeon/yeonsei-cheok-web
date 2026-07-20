'use client';

import Image from 'next/image';
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

const GOLD_GRADIENT =
  'bg-[linear-gradient(180deg,#d9bd7a_0%,#c39442_48%,#a66d24_100%)] bg-clip-text text-transparent';

const TextbookVolume = ({
  src,
  alt,
  className,
  progress,
  revealAt,
  entryX,
  finalRotate,
  reduceMotion,
}: {
  src: string;
  alt: string;
  className: string;
  progress: MotionValue<number>;
  revealAt: number;
  entryX: number;
  finalRotate: number;
  reduceMotion: boolean;
}) => {
  const revealEnd = revealAt + 0.14;
  const opacity = useTransform(progress, [revealAt, revealEnd], [0, 1]);
  const x = useTransform(progress, [revealAt, revealEnd], [entryX, 0]);
  const y = useTransform(progress, [revealAt, revealEnd], [52, 0]);
  const scale = useTransform(progress, [revealAt, revealEnd], [0.9, 1]);
  const rotate = useTransform(
    progress,
    [revealAt, revealEnd],
    [finalRotate + entryX * 0.08, finalRotate],
  );

  return (
    <motion.div
      className={`absolute bottom-0 h-full w-1/2 ${className}`}
      style={{
        opacity: reduceMotion ? 1 : opacity,
        x: reduceMotion ? 0 : x,
        y: reduceMotion ? 0 : y,
        scale: reduceMotion ? 1 : scale,
        rotate: reduceMotion ? finalRotate : rotate,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 639px) 48vw, (max-width: 1023px) 34vw, 22vw"
        quality={90}
        className="object-contain object-bottom drop-shadow-[0_26px_30px_rgba(0,0,0,0.5)]"
      />
    </motion.div>
  );
};

const UbeTextbookFeatureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const doctorsY = useTransform(scrollYProgress, [0, 1], ['4%', '-3%']);
  const bookY = useTransform(scrollYProgress, [0, 1], ['7%', '-5%']);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="ube-textbook-title"
      className="relative isolate overflow-hidden bg-[#061630] px-5 py-12 text-white sm:px-6 sm:py-14 md:py-20"
    >
      <motion.div
        aria-hidden="true"
        className="absolute -inset-x-[4%] -inset-y-[6%] will-change-transform"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        <Image
          src="/generated/textbooks/textbook-bg.webp"
          alt=""
          fill
          sizes="100vw"
          quality={88}
          className="object-cover object-center"
        />
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,21,0.62)_0%,rgba(3,14,31,0.18)_38%,rgba(2,10,24,0.76)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#020916]/75 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#020916]/62 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05142b]/95 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.header
          className="mx-auto max-w-4xl text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 38, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#f1cd75] sm:w-12" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#f1cd75] shadow-[0_0_14px_rgba(241,205,117,0.7)]" />
            <p className="font-montserrat text-[11px] font-bold tracking-[0.34em] text-[#f4d889] sm:text-xs">
              GLOBAL FIRST
            </p>
            <span className="h-1.5 w-1.5 rotate-45 bg-[#f1cd75] shadow-[0_0_14px_rgba(241,205,117,0.7)]" />
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#f1cd75] sm:w-12" />
          </div>

          <h2
            id="ube-textbook-title"
            className="mx-auto mt-5 max-w-4xl break-keep text-[clamp(1.85rem,4.2vw,3.65rem)] font-extrabold leading-[1.16] tracking-[-0.05em] text-white sm:mt-6"
          >
            세계 최초로 완성한
            <span className={`mt-1.5 block ${GOLD_GRADIENT}`}>
              양방향 척추내시경 교과서
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl break-keep text-sm font-medium leading-relaxed text-white/64 sm:text-base">
            연세척병원 의료진의 임상 경험과 척추내시경 술기를 세계와 공유합니다.
          </p>
        </motion.header>

        <div className="relative mt-8 grid items-end gap-1 sm:mt-10 lg:mt-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-0">
          <motion.div
            className="relative order-2 -ml-2 h-[300px] sm:h-[390px] lg:-ml-16 lg:h-[440px]"
            style={{ y: shouldReduceMotion ? 0 : doctorsY }}
            initial={shouldReduceMotion ? false : { opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.05, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute bottom-0 left-[2%] h-full w-[66%]">
              <Image
                src="/generated/doctors-lineup/trimmed/lee-nam.png"
                alt="양방향 척추내시경 교과서 집필진 이남 병원장"
                fill
                sizes="(max-width: 1023px) 58vw, 38vw"
                quality={90}
                className="scale-x-[-1] object-contain object-bottom drop-shadow-[0_24px_28px_rgba(0,0,0,0.32)]"
              />
            </div>

            <div className="absolute bottom-0 right-[1%] z-10 h-[99%] w-[66%]">
              <Image
                src="/generated/doctors-lineup/trimmed/kim-dong-han.png"
                alt="양방향 척추내시경 교과서 집필진 김동한 병원장"
                fill
                sizes="(max-width: 1023px) 58vw, 38vw"
                quality={90}
                className="object-contain object-bottom drop-shadow-[0_24px_28px_rgba(0,0,0,0.34)]"
              />
            </div>

          </motion.div>

          <motion.div
            className="relative order-1 mx-auto h-[300px] w-full max-w-[500px] sm:h-[390px] lg:mr-[-2rem] lg:h-[440px] lg:max-w-[600px]"
            style={{ y: shouldReduceMotion ? 0 : bookY }}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -80, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.05, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-x-[7%] bottom-[2%] h-[10%] rounded-[50%] bg-black/65 blur-2xl" />
            <TextbookVolume
              src="/generated/textbooks/volume-1.webp"
              alt="양방향 척추내시경 전문 교과서 1편"
              className="left-0 z-10"
              progress={scrollYProgress}
              revealAt={0.08}
              entryX={-42}
              finalRotate={-5}
              reduceMotion={Boolean(shouldReduceMotion)}
            />
            <TextbookVolume
              src="/generated/textbooks/volume-2.webp"
              alt="최소침습 척추 수술 전문 교과서 2편"
              className="left-1/4 z-20"
              progress={scrollYProgress}
              revealAt={0.2}
              entryX={0}
              finalRotate={0}
              reduceMotion={Boolean(shouldReduceMotion)}
            />
            <TextbookVolume
              src="/generated/textbooks/volume-3.webp"
              alt="양방향 척추내시경 전문 교과서 3편"
              className="right-0 z-30"
              progress={scrollYProgress}
              revealAt={0.32}
              entryX={42}
              finalRotate={5}
              reduceMotion={Boolean(shouldReduceMotion)}
            />
          </motion.div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-100vh] left-1/2 z-20 h-[calc(46%+100vh)] w-screen -translate-x-1/2 bg-[linear-gradient(to_top,rgba(5,20,43,1)_0%,rgba(5,20,43,1)_75%,rgba(5,20,43,0.92)_82%,rgba(5,20,43,0.58)_90%,rgba(5,20,43,0.16)_96%,transparent_100%)]"
          />

          <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-2 text-center sm:px-6 sm:pb-3 lg:left-1/2">
            <p className="text-[11px] font-bold tracking-[0.04em] text-[#d1aa5d] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] sm:text-sm">
              양방향 척추내시경 교과서 집필진
            </p>
            <p className="mt-1 break-keep text-lg font-extrabold tracking-[-0.03em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] sm:text-2xl">
              김동한 · 이남 병원장
            </p>
          </div>
        </div>

        <motion.div
          className="relative z-30 mx-auto mt-8 max-w-6xl sm:mt-10"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 52 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#b98a3f]/45 to-[#b98a3f]" />
            <span className="h-2 w-2 rotate-45 border border-[#c6a15b] bg-[#966522] shadow-[0_0_12px_rgba(185,138,63,0.38)]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#b98a3f]/45 to-[#b98a3f]" />
          </div>

          <div className="grid gap-8 py-8 sm:py-9 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-16 lg:py-10">
            <div>
              <div>
                <h3 className="break-keep text-[clamp(1.65rem,3vw,2.6rem)] font-extrabold leading-[1.28] tracking-[-0.045em] text-white">
                  양방향 척추내시경
                  <span className="block text-[#f3ce72]">교과서 집필진</span>
                </h3>
              </div>
              <p className="mt-6 break-keep text-sm font-semibold leading-[1.8] text-white/60 sm:text-base">
                <span className="text-white/85">Springer 출판</span>
                <span className="mx-3 text-[#e9c66d]/55">/</span>
                <span className="text-white/85">김동한·이남 병원장 집필 참여</span>
              </p>
            </div>

            <div className="space-y-5 text-[15px] font-medium leading-[1.9] text-white/72 sm:text-[17px]">
              <p className="break-keep font-bold text-white">
                연세척병원 의료진은 척추내시경과 최소침습 척추 수술의 임상 경험을
                세계적인 의학 교과서에 담았습니다.
              </p>
              <p className="break-keep">
                김동한·이남 병원장은 양방향 척추내시경 수술 교과서 집필에 지속적으로
                참여하며, 연세척병원의 술기와 치료 프로토콜을 세계 의료진과 공유하고
                있습니다.
              </p>
              <p className="break-keep">
                이 교과서는 세계적인 의학 전문 출판사 Springer에서 출판하였으며, 전 세계
                척추내시경 의료진에게 술기와 치료 방향을 전하는 전문 교과서로 활용되고
                있습니다.
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default UbeTextbookFeatureSection;

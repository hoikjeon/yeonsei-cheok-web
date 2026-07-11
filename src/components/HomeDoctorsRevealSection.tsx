'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

type HomeDoctor = {
  id: string;
  image: string;
  alt: string;
  className: string;
  imageClassName?: string;
};

const doctors: HomeDoctor[] = [
  {
    id: 'kim-beom-jun',
    image: '/generated/doctors-lineup/trimmed/kim-beom-jun.png',
    alt: '김범준 원장',
    className:
      'left-[11%] z-20 h-[50%] w-[27%] md:left-[18%] md:h-[82%] md:w-[21%] lg:left-[18%] lg:h-[86%] lg:w-[21%]',
    imageClassName: 'scale-x-[-1]',
  },
  {
    id: 'kim-dong-han',
    image: '/generated/doctors-lineup/trimmed/kim-dong-han.png',
    alt: '김동한 병원장',
    className:
      'left-[30.5%] z-30 h-[50%] w-[27%] md:left-[34%] md:h-[82%] md:w-[21%] lg:left-[34%] lg:h-[86%] lg:w-[21%]',
  },
  {
    id: 'lee-nam',
    image: '/generated/doctors-lineup/trimmed/lee-nam.png',
    alt: '이남 병원장',
    className:
      'left-[50%] z-40 h-[50%] w-[27%] md:left-[50%] md:h-[82%] md:w-[21%] lg:left-[50%] lg:h-[86%] lg:w-[21%]',
  },
  {
    id: 'choi-ho',
    image: '/generated/doctors-lineup/trimmed/choi-ho.png',
    alt: '최호 원장',
    className:
      'left-[69.5%] z-30 h-[50%] w-[27%] md:left-[66%] md:h-[82%] md:w-[21%] lg:left-[66%] lg:h-[86%] lg:w-[21%]',
  },
  {
    id: 'jang-hwi-yeol',
    image: '/generated/doctors-lineup/trimmed/jang-hwi-yeol.png',
    alt: '장휘열 원장',
    className:
      'left-[89%] z-20 h-[50%] w-[27%] md:left-[82%] md:h-[82%] md:w-[21%] lg:left-[82%] lg:h-[86%] lg:w-[21%]',
  },
];

const springConfig = { stiffness: 82, damping: 24, mass: 0.35 };

const HomeDoctorsRevealSection = () => {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 78%', 'end 24%'],
  });

  const rawBrandY = useTransform(scrollYProgress, [0, 0.28], [220, 0]);
  const rawDoctorsY = useTransform(scrollYProgress, [0, 0.18], [40, 0]);
  const rawDoctorsOpacity = useTransform(scrollYProgress, [0, 0.1], [0.12, 1]);

  const brandY = useSpring(rawBrandY, springConfig);
  const doctorsY = useSpring(rawDoctorsY, springConfig);

  return (
    <section
      ref={ref}
      className="relative isolate -mt-16 h-[90vh] min-h-[720px] overflow-clip bg-white md:-mt-28 md:h-[95vh] md:min-h-[820px]"
      aria-label="연세척병원 척추 관절 의료진"
    >
      <motion.div className="sticky top-0 flex h-screen min-h-[640px] items-end overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 bg-gradient-to-b from-[#f4f9ff] via-white to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_54%,rgba(40,74,165,0.08),rgba(255,255,255,0)_42%)]" />

        <div className="pointer-events-none absolute inset-x-0 top-[31%] z-10 flex justify-center md:top-[23%]">
          <motion.div
            className="flex select-none flex-col items-center gap-3 text-center md:gap-5"
            style={{
              y: shouldReduceMotion ? 0 : brandY,
            }}
          >
            <span className="font-sans text-[clamp(1.45rem,2.7vw,3rem)] font-black leading-tight tracking-normal text-navy-900 drop-shadow-[0_10px_28px_rgba(255,255,255,0.92)]">
              척추·관절 특화병원
            </span>
            <span className="whitespace-nowrap text-[clamp(4rem,11vw,11rem)] font-black leading-none tracking-normal text-[#1f56ad]">
              연세척병원
            </span>
          </motion.div>
        </div>

        <motion.div
          className="relative z-20 mx-auto h-[58vh] min-h-[430px] w-full max-w-[1500px] md:h-[64vh] md:min-h-[560px]"
          style={{
            opacity: shouldReduceMotion ? 1 : rawDoctorsOpacity,
            y: shouldReduceMotion ? 0 : doctorsY,
          }}
        >
          <div className="absolute inset-x-0 bottom-6 h-full md:bottom-0">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`absolute bottom-0 -translate-x-1/2 overflow-visible ${doctor.className}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-[12%] bottom-[2%] h-14 rounded-full bg-navy-950/12 blur-2xl"
                />
                <Image
                  src={doctor.image}
                  alt={doctor.alt}
                  fill
                  sizes="(min-width: 1280px) 22vw, (min-width: 768px) 24vw, 36vw"
                  className={`origin-bottom object-contain object-bottom drop-shadow-[0_28px_34px_rgba(15,29,54,0.18)] ${
                    doctor.imageClassName ?? ''
                  }`}
                />
              </div>
            ))}
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[20%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.56)_30%,rgba(255,255,255,0.9)_66%,#ffffff_94%,#ffffff_100%)] md:h-[25%]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-4 bg-white" />
      </motion.div>
    </section>
  );
};

export default HomeDoctorsRevealSection;

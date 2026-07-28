'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const careers = [
  '경희의대 졸업',
  '경희의료원 정형외과 수련',
  '경희대학교 의과대학 외래교수',
  '경희대학교 의학전문원 실습지도교수',
  '좋은삼선병원 정형외과 수련 주임과장',
  '좋은강안병원 정형외과 주임과장',
  '롯데자이언츠 주치의',
  '국내·외 다수 논문 발표',
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function KneeDoctorFeature() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const doctorY = useTransform(scrollYProgress, [0, 1], ['6%', '-3%']);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="knee-doctor-title"
      className="relative isolate overflow-hidden bg-[#061630] px-5 text-white sm:px-6"
    >
      <motion.div
        aria-hidden
        className="absolute -inset-x-[3%] -inset-y-[7%] will-change-transform"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        <div className="absolute left-[52%] top-[42%] h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(54,116,220,0.3)_0%,rgba(24,66,140,0.12)_42%,transparent_72%)]" />
        <div className="absolute -left-40 bottom-[-180px] h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[110px]" />
      </motion.div>
      <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#071A3D] to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#061630] via-[#061630]/92 to-transparent" />

      <div className="relative mx-auto grid min-h-[760px] max-w-7xl grid-cols-1 items-end gap-8 pt-16 md:grid-cols-[minmax(340px,0.88fr)_minmax(0,1.12fr)] md:gap-10 md:pt-0 lg:min-h-[820px]">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -64, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.05, ease }}
          className="relative order-2 mx-auto h-[440px] w-full max-w-[470px] md:order-1 md:h-[740px] lg:h-[790px]"
          style={{ y: shouldReduceMotion ? 0 : doctorY }}
        >
          <div className="absolute inset-x-[8%] bottom-[2%] h-[8%] rounded-[50%] bg-black/45 blur-2xl" />
          <Image
            src="/images/treatments/joint/knee-arthroscopy/doctor-choi-portrait.avif"
            alt="최호 정형외과 원장"
            fill
            sizes="(min-width: 1024px) 470px, 92vw"
            className="object-contain object-bottom drop-shadow-[0_30px_42px_rgba(0,0,0,0.35)]"
          />
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 58, y: 12, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.95, delay: 0.08, ease }}
          className="relative z-10 order-1 pb-4 pt-4 md:order-2 md:pb-24 md:pt-24"
        >
          <p className="text-[15px] font-bold text-cyan-300 sm:text-base">
            무릎 관절을 세밀하게 살피는 정형외과 전문의
          </p>
          <h2
            id="knee-doctor-title"
            className="mt-5 max-w-3xl break-keep text-[clamp(2rem,4.1vw,3.6rem)] font-extrabold leading-[1.16] tracking-[-0.05em]"
          >
            직접 확인하고,
            <br />
            필요한 치료만 선택합니다
          </h2>
          <div className="mt-7 flex items-end gap-3">
            <p className="text-h3">최호 원장</p>
            <span className="mb-1 h-px w-16 bg-gradient-to-r from-cyan-300 to-transparent" />
          </div>
          <p className="mt-5 max-w-2xl break-keep text-body-lg text-white/76">
            진찰과 영상검사를 함께 검토하고, 관절경으로 확인한 병변의 위치와 범위에 맞춰
            치료 방향을 세웁니다.
          </p>

          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {careers.map((career) => (
              <li
                key={career}
                className="group flex items-start gap-3 text-[14px] font-semibold leading-[1.6] text-white/70 transition-colors hover:text-white sm:text-[15px]"
              >
                <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/70 shadow-[0_0_12px_rgba(103,232,249,0.45)] transition group-hover:bg-cyan-200" />
                <span className="break-keep">{career}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

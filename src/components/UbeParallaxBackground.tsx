'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * 스크롤에 따라 배경 이미지가 콘텐츠보다 느리게 y축으로 흐르는 패럴랙스(Parallax) 배경.
 * 섹션이 뷰포트를 지나는 동안 이미지가 위에서 아래로 부드럽게 이동합니다.
 */
const UbeParallaxBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 이미지 자체 높이 기준 ±12% 이동 (h-[136%]/-top-[18%] 여백 안에서만 움직여 빈틈이 생기지 않음)
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      <motion.div
        className="absolute inset-x-0 -top-[18%] h-[136%] will-change-transform"
        style={{ y: shouldReduceMotion ? 0 : y }}
      >
        <Image
          src="/generated/ube/ube-comparison-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="origin-center object-cover opacity-55"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#071A3D]/55" />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#071A3D]/95 via-[#071A3D]/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#071A3D]/95 via-[#071A3D]/60 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#071A3D] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#071A3D] to-transparent" />
    </div>
  );
};

export default UbeParallaxBackground;

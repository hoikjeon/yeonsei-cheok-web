'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface KneeParallaxBackgroundProps {
  src: string;
  position?: string;
  strength?: 'soft' | 'strong';
}

export default function KneeParallaxBackground({
  src,
  position = 'center',
  strength = 'strong',
}: KneeParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const overlay = strength === 'strong' ? 'bg-[#071A3D]/78' : 'bg-[#071A3D]/62';

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      <motion.div
        className="absolute inset-x-0 -top-[16%] h-[132%] will-change-transform"
        style={{ y: shouldReduceMotion ? 0 : y }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          className="scale-[1.04] object-cover opacity-70"
          style={{ objectPosition: position }}
        />
      </motion.div>
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#071A3D] via-[#071A3D]/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#071A3D] via-[#071A3D]/72 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#071A3D] via-[#071A3D]/72 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-[#071A3D] via-[#071A3D]/72 to-transparent" />
    </div>
  );
}

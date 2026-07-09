'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealVariant = 'fade-up' | 'slide-right' | 'image' | 'metric';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  amount?: number;
}

const revealVariants: Record<RevealVariant, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: -36, y: 8, filter: 'blur(8px)' },
    visible: { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' },
  },
  image: {
    hidden: {
      opacity: 0,
      y: 24,
      scale: 0.985,
      clipPath: 'inset(10% 0 0 0 round 8px)',
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      clipPath: 'inset(0% 0 0 0 round 8px)',
      filter: 'blur(0px)',
    },
  },
  metric: {
    hidden: {
      opacity: 0,
      y: 36,
      scale: 0.96,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0% 0 0 0)', filter: 'blur(0px)' },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0% 0 0 0)', filter: 'blur(0px)' },
};

const ScrollReveal = ({
  children,
  className,
  delay = 0,
  variant = 'fade-up',
  amount = 0.24,
}: ScrollRevealProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={shouldReduceMotion ? reducedVariants : revealVariants[variant]}
      transition={{
        duration: variant === 'image' ? 0.9 : variant === 'metric' ? 0.68 : 0.72,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;

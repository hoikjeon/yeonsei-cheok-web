'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Home } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

export default function KneeArthroscopyHero() {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? false : { opacity: 0, y: 14 };

  return (
    <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
      <div className="relative isolate flex min-h-[230px] items-center overflow-hidden rounded-[1.35rem] bg-[linear-gradient(108deg,#eef2f8_0%,#edf2fa_55%,#f8f2e7_100%)] shadow-[0_24px_60px_-40px_rgba(15,29,54,0.4)] ring-1 ring-navy-900/5 sm:min-h-[300px] sm:rounded-[2.25rem] md:min-h-[360px]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-[22%] top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-[repeating-radial-gradient(circle,transparent_0,transparent_29px,rgba(226,168,88,0.15)_30px,transparent_32px)] sm:-right-[6%] sm:h-[520px] sm:w-[520px] sm:bg-[repeating-radial-gradient(circle,transparent_0,transparent_42px,rgba(226,168,88,0.14)_43px,transparent_45px)] md:right-[-1%]" />
          <div className="absolute right-[-16%] top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,220,162,0.48)_0%,rgba(255,229,190,0.15)_43%,transparent_72%)] sm:right-[-2%] sm:h-[480px] sm:w-[480px]" />
        </div>

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, x: 30, scale: 0.96, filter: 'blur(7px)' }
          }
          animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.08, ease }}
          className="absolute -bottom-[22%] -right-[15%] h-[122%] w-[64%] sm:-bottom-[19%] sm:-right-[4%] sm:h-[126%] sm:w-[55%] md:-bottom-[18%] md:right-[2%] md:h-[128%] md:w-[46%]"
        >
          <motion.div
            className="relative h-full w-full"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -3, 0, 3, 0],
                    rotate: [0, -0.2, 0, 0.2, 0],
                  }
            }
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/images/treatments/joint/knee-arthroscopy/knee-anatomy-3d.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 560px, 58vw"
              className="object-contain object-right-bottom drop-shadow-[0_20px_28px_rgba(15,29,54,0.18)]"
            />
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,242,248,0.99)_0%,rgba(238,242,248,0.94)_46%,rgba(238,242,248,0.28)_70%,transparent_100%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-5 py-9 sm:px-9 sm:py-12 md:px-12">
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            <motion.nav
              initial={initial}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease }}
              aria-label="현재 위치"
              className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] font-semibold text-slate-500 sm:gap-x-2 sm:text-[13px] md:text-sm"
            >
              <Link
                href="/"
                aria-label="홈으로"
                className="flex items-center transition-colors hover:text-primary"
              >
                <Home size={16} strokeWidth={2.2} className="text-amber-500" />
              </Link>
              <span aria-hidden className="text-[8px] text-slate-300">
                ●
              </span>
              <Link
                href="/treatments"
                className="flex items-center gap-0.5 transition-colors hover:text-primary"
              >
                관절센터
                <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
              </Link>
              <span aria-hidden className="text-[8px] text-slate-300">
                ●
              </span>
              <Link
                href="/treatments/joint/knee"
                className="flex items-center gap-0.5 transition-colors hover:text-primary"
              >
                무릎 관절
                <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
              </Link>
              <span aria-hidden className="text-[8px] text-slate-300">
                ●
              </span>
              <span className="text-slate-600">무릎관절내시경</span>
            </motion.nav>

            <div className="space-y-3">
              <motion.h1
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 20, filter: 'blur(6px)' }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.78, delay: 0.06, ease }}
                className="break-keep text-display tracking-tight text-navy-900"
              >
                무릎관절내시경
              </motion.h1>
              <motion.p
                initial={initial}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.68, delay: 0.14, ease }}
                className="max-w-xl break-keep text-[14px] font-medium leading-[1.65] text-slate-600 sm:text-base md:text-[17px] md:text-slate-500"
              >
                증상과 영상검사 결과를 함께 살펴 관절 안쪽의 원인을 세밀하게
                확인합니다.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

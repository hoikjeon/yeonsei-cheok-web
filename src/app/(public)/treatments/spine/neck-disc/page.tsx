import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, ChevronDown, Home } from 'lucide-react';
import NeckDiseaseSection from '@/components/NeckDiseaseSection';
import ScrollReveal from '@/components/ScrollReveal';
import SpineCenterStrengthSection from '@/components/SpineCenterStrengthSection';
import YonseiSpecialFeaturesSection from '@/components/YonseiSpecialFeaturesSection';

export const metadata: Metadata = {
  title: '목디스크 | 연세척병원',
  description:
    '목 통증과 팔 저림의 원인을 정밀하게 진단하고 비수술 치료로 회복을 돕는 연세척병원 목디스크 안내 페이지입니다.',
};

const marqueeText = 'YONSEI CHEOK HOSPITAL · NECK DISC CLINIC · CERVICAL DISC CENTER ·';

const symptomCards = [
  {
    title: '팔저림',
    image: '/generated/neck-disc-symptom-arm-numbness.png',
    alt: '손과 손목 저림을 표현한 의료 이미지',
  },
  {
    title: '어깨 통증',
    image: '/generated/neck-disc-symptom-shoulder.png',
    alt: '어깨 통증을 표현한 의료 이미지',
  },
  {
    title: '경추성 두통 · 어지러움',
    image: '/generated/neck-disc-symptom-headache.png',
    alt: '목 통증과 두통, 어지러움을 표현한 의료 이미지',
  },
  {
    title: '자세 변화',
    image: '/generated/neck-disc-symptom-posture.png',
    alt: '목과 상체 자세 변화를 표현한 의료 이미지',
  },
];

const causeItems = [
  '장시간 구부정한 자세',
  '높은 베개 등 불편한 수면 자세',
  '스트레스',
  '교통사고, 낙상 등의 외부충격',
  '무리한 운동이나 과도한 업무',
  '염증성 · 퇴행성 질환',
];

export default function NeckDiscPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
        <div className="relative isolate flex min-h-[230px] items-center overflow-hidden rounded-[1.35rem] bg-slate-50 shadow-[0_24px_60px_-40px_rgba(15,29,54,0.4)] ring-1 ring-navy-900/5 sm:min-h-[300px] sm:rounded-[2.25rem] md:min-h-[360px]">
          <Image
            src="/generated/neck-disc-banner-3d.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,242,248,0.98)_0%,rgba(238,242,248,0.82)_40%,rgba(238,242,248,0.12)_68%,transparent_100%)]" />

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-5 py-9 sm:px-9 sm:py-12 md:px-12">
            <div className="max-w-3xl space-y-4 sm:space-y-5">
              <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] font-semibold text-slate-500 sm:gap-x-2 sm:text-[13px] md:text-sm">
                <Link
                  href="/"
                  aria-label="홈으로"
                  className="flex items-center transition-colors hover:text-primary"
                >
                  <Home size={16} strokeWidth={2.2} className="text-amber-500" />
                </Link>
                <span className="text-[8px] text-slate-300">●</span>
                <Link
                  href="/treatments/spine"
                  className="flex items-center gap-0.5 transition-colors hover:text-primary"
                >
                  척추센터
                  <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                </Link>
                <span className="text-[8px] text-slate-300">●</span>
                <span className="flex items-center gap-0.5 text-slate-600">
                  목디스크
                  <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                </span>
              </nav>

              <div className="space-y-3">
                <h1 className="break-keep text-[1.75rem] font-bold leading-[1.18] tracking-tight text-navy-900 sm:text-4xl md:text-[3.25rem]">
                  목디스크
                </h1>
                <p className="max-w-xl break-keep text-[14px] font-medium leading-[1.65] text-slate-600 sm:text-base md:text-[17px] md:text-slate-500">
                  목과 어깨, 팔 저림까지 이어지는 통증의 원인을 정밀하게 진단합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col items-start px-5 py-14 text-left sm:px-6 md:items-center md:py-28 md:text-center">
        <div className="mx-auto max-w-5xl">
          <h1 className="break-keep text-h2 tracking-tight text-ink">
            목이 뻐근하고 움직임이 둔하다면
            <br className="hidden md:block" />
            목디스크가 진행 중일 수 있습니다.
          </h1>
        </div>

        <div className="relative mt-8 w-full max-w-5xl overflow-hidden rounded-[1.25rem] border border-slate-100 bg-slate-50 shadow-[0_30px_80px_-48px_rgba(15,29,54,0.55)] sm:mt-12 sm:rounded-[1.75rem]">
          <Image
            src="/generated/neck-disc-neutral-hero.png"
            alt="성별이 드러나지 않는 반투명 인체 모델의 목디스크 의료 일러스트"
            width={1672}
            height={941}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="mt-8 max-w-5xl space-y-4 break-keep text-base font-medium leading-[1.8] text-ink-sub sm:mt-12 sm:space-y-5 md:text-lg md:leading-relaxed">
          <p>
            목 통증은 잘못된 자세와 생활습관으로 인해 목뼈가 비정상적으로 변형되며 발생합니다.
          </p>
          <p>
            방치할 경우 신경이 눌려 어깨나 팔까지 통증이 퍼질 수 있으며, 퇴행성 디스크로 진행될 수 있어 조기 진단이 중요합니다.
          </p>
          <p>
            연세척병원에서는 통증의 원인을 정밀하게 진단하고, 비수술 치료로 회복을 도와드립니다.
          </p>
        </div>
      </section>

      <div
        aria-hidden="true"
        className="marquee-fade pointer-events-none relative -mt-5 mb-12 overflow-hidden py-4 md:-mt-12 md:mb-24 md:py-6"
      >
        <div className="marquee-track flex w-max select-none font-montserrat text-[clamp(3rem,7.2vw,6.6rem)] font-semibold uppercase leading-none tracking-[0.01em] text-navy-900/[0.055]">
          <span className="shrink-0 pr-12 md:pr-20">{marqueeText}</span>
          <span className="shrink-0 pr-12 md:pr-20">{marqueeText}</span>
        </div>
      </div>

      <section className="relative overflow-hidden px-5 pb-16 pt-2 sm:px-6 md:pb-32 md:pt-8">
        <div className="mx-auto w-full max-w-7xl">
          <ScrollReveal variant="slide-right" amount={0.22}>
            <div className="max-w-4xl">
              <h2 className="break-keep text-h2 tracking-tight text-ink">
                혹시 내 이야기 같으신가요?
                <br className="hidden md:block" />
                목 통증 주요 증상과 원인
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-12 md:mt-24">
            <ScrollReveal variant="slide-right" amount={0.3}>
              <h3 className="text-h3 tracking-tight text-ink">
                주요 증상
              </h3>
            </ScrollReveal>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 xl:grid-cols-4">
              {symptomCards.map((card, index) => (
                <ScrollReveal
                  key={card.title}
                  className="h-full"
                  delay={index * 0.08}
                  amount={0.18}
                >
                  <article className="group h-full overflow-hidden rounded-[1.1rem] bg-slate-50 ring-1 ring-slate-200/70 transition duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_-46px_rgba(15,29,54,0.6)] sm:rounded-[1.45rem]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/10 via-transparent to-primary/5 opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
                    </div>
                    <div className="flex min-h-[62px] items-center justify-center bg-slate-50 px-2 text-center sm:min-h-[76px] sm:px-4">
                      <h4 className="break-keep text-h4 leading-snug tracking-tight text-ink">
                        {card.title}
                      </h4>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-7 md:mt-28 md:gap-10 lg:grid-cols-[0.8fr_1.65fr] lg:items-start">
            <ScrollReveal variant="slide-right" amount={0.28}>
              <h3 className="text-h3 tracking-tight text-ink">
                주요 원인
              </h3>
            </ScrollReveal>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
              {causeItems.map((item, index) => (
                <ScrollReveal key={item} delay={index * 0.07} amount={0.18}>
                  <div className="flex min-h-[76px] items-center gap-3 rounded-[1rem] bg-slate-50 px-4 ring-1 ring-slate-200/70 transition duration-300 hover:bg-primary-light/70 hover:ring-primary/20 sm:min-h-[92px] sm:gap-4 sm:rounded-[1.25rem] sm:px-6">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_22px_-12px_rgba(40,74,165,0.9)]">
                      <Check size={21} strokeWidth={3.4} />
                    </span>
                    <span className="break-keep text-[0.98rem] font-extrabold leading-snug tracking-tight text-ink sm:text-[1.05rem] md:text-[1.22rem]">
                      {item}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NeckDiseaseSection />

      <YonseiSpecialFeaturesSection />
      <SpineCenterStrengthSection />
    </main>
  );
}

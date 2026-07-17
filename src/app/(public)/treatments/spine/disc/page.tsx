import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, ChevronDown, Home } from 'lucide-react';
import LumbarDiseaseSection from '@/components/LumbarDiseaseSection';
import ScrollReveal from '@/components/ScrollReveal';
import SpineCenterStrengthSection from '@/components/SpineCenterStrengthSection';
import YonseiSpecialFeaturesSection from '@/components/YonseiSpecialFeaturesSection';

export const metadata: Metadata = {
  title: '허리디스크 | 연세척병원',
  description:
    '허리 통증과 다리 저림, 당김 증상의 원인을 정밀하게 진단하고 비수술 치료부터 최소침습 치료까지 제안하는 연세척병원 허리디스크 안내 페이지입니다.',
};

const marqueeText = 'YONSEI CHEOK HOSPITAL · LUMBAR DISC CLINIC · LOW BACK PAIN CENTER ·';

const symptomCards = [
  {
    title: '허리통증',
    image: '/generated/lumbar-disc/lumbar-disc-symptom-back-pain.png',
    alt: '허리 통증을 표현한 의료 이미지',
  },
  {
    title: '다리·엉덩이 통증',
    image: '/generated/lumbar-disc/lumbar-disc-symptom-leg-hip-pain.png',
    alt: '다리와 엉덩이 통증을 표현한 의료 이미지',
  },
  {
    title: '저림·마비증상',
    image: '/generated/lumbar-disc/lumbar-disc-symptom-numbness.png',
    alt: '다리 저림과 감각 이상을 표현한 의료 이미지',
  },
  {
    title: '근력 약화',
    image: '/generated/lumbar-disc/lumbar-disc-symptom-weakness.png',
    alt: '다리 근력 약화를 표현한 의료 이미지',
  },
];

const causeItems = [
  '허리 근육 및 인대의 과도한 사용',
  '구부정하거나 짝다리 짚는 자세',
  '교통사고, 낙상 등의 외부충격',
  '과도한 체중의 비만',
  '흡연 및 스트레스',
  '염증성·퇴행성 질환',
];

const faqItems = [
  {
    question: '허리가 아프긴 한데, 꼭 병원에 가야 하나요?',
    answer:
      '통증이 며칠 이상 반복되거나 다리 저림, 감각 이상, 힘 빠짐이 함께 있다면 정확한 진단이 필요합니다. 특히 배뇨·배변 이상이나 보행 장애가 있으면 빠르게 진료를 받아야 합니다.',
  },
  {
    question: '허리디스크는 꼭 수술해야 하나요?',
    answer:
      '대부분의 허리디스크는 증상과 신경 압박 정도를 확인한 뒤 약물, 물리치료, 주사치료 같은 비수술 치료부터 고려합니다. 다만 마비가 진행되거나 통증이 심하게 지속되는 경우에는 수술적 치료가 필요할 수 있습니다.',
  },
  {
    question: '허리 통증이 허벅지나 종아리까지 저려요. 왜 그런가요?',
    answer:
      '요추 신경이 디스크나 좁아진 척추관에 눌리면 허리뿐 아니라 엉덩이, 허벅지, 종아리, 발까지 통증이나 저림이 이어질 수 있습니다.',
  },
  {
    question: '자고 일어나면 허리가 더 아파요. 왜 그런가요?',
    answer:
      '수면 자세, 매트리스 상태, 밤사이 굳어진 허리 주변 근육, 염증 반응 등이 원인이 될 수 있습니다. 아침 통증이 반복되면 단순 근육통인지 디스크나 협착증인지 확인하는 것이 좋습니다.',
  },
  {
    question: '허리 통증이 있을 때, 운동을 해도 되나요?',
    answer:
      '급성 통증이 심한 시기에는 무리한 운동을 피하고 진단 후 단계적으로 움직이는 것이 안전합니다. 통증이 줄어든 뒤에는 코어 안정화 운동과 스트레칭을 개인 상태에 맞게 시작하는 것이 도움이 됩니다.',
  },
];

export default function DiscPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
        <div className="relative isolate flex min-h-[230px] items-center overflow-hidden rounded-[1.35rem] bg-slate-50 shadow-[0_24px_60px_-40px_rgba(15,29,54,0.4)] ring-1 ring-navy-900/5 sm:min-h-[300px] sm:rounded-[2.25rem] md:min-h-[360px]">
          <Image
            src="/generated/lumbar-disc/lumbar-disc-banner-3d.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,242,248,0.98)_0%,rgba(238,242,248,0.84)_42%,rgba(238,242,248,0.12)_70%,transparent_100%)]" />

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
                  허리디스크
                  <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                </span>
              </nav>

              <div className="space-y-3">
                <h1 className="break-keep text-display tracking-normal text-navy-900">
                  허리디스크
                </h1>
                <p className="max-w-xl break-keep text-[14px] font-medium leading-[1.65] text-slate-600 sm:text-base md:text-[17px] md:text-slate-500">
                  허리 통증과 다리 저림·당김 증상을 맞춤 진단합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col items-start px-5 py-14 text-left sm:px-6 md:items-center md:py-28 md:text-center">
        <div className="mx-auto max-w-5xl">
          <h1 className="break-keep text-h2 tracking-normal text-ink">
            쑤시고 당기는 허리 통증,
            <br className="hidden md:block" />
            척추 불균형은 허리 건강의 경고 신호입니다.
          </h1>
        </div>

        <div className="relative mt-8 w-full max-w-5xl overflow-hidden rounded-[1.25rem] border border-slate-100 bg-slate-50 shadow-[0_30px_80px_-48px_rgba(15,29,54,0.55)] sm:mt-12 sm:rounded-[1.75rem]">
          <Image
            src="/generated/lumbar-disc/lumbar-disc-neutral-hero.png"
            alt="허리 통증을 표현한 반투명 요추 의료 이미지"
            width={1672}
            height={941}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="mt-8 max-w-5xl space-y-4 break-keep text-base font-medium leading-[1.8] text-ink-sub sm:mt-12 sm:space-y-5 md:text-lg md:leading-relaxed">
          <p>
            허리 통증은 디스크 돌출, 근육 긴장, 자세 불균형 등 다양한 원인으로 발생합니다.
          </p>
          <p>
            특히 장시간 앉아 있거나 무리한 동작을 반복할 경우 척추에 부담이 쌓여 만성 통증으로 이어지기 쉽습니다.
          </p>
          <p>
            연세척병원은 정확한 진단을 통해 불필요한 시술 없이, 원인에 맞는 비수술 치료를 제공합니다.
          </p>
        </div>
      </section>

      <div
        aria-hidden="true"
        className="marquee-fade pointer-events-none relative -mt-5 mb-12 overflow-hidden py-4 md:-mt-12 md:mb-24 md:py-6"
      >
        <div className="marquee-track flex w-max select-none font-montserrat text-[clamp(3rem,7.2vw,6.6rem)] font-semibold uppercase leading-none tracking-normal text-navy-900/[0.055]">
          <span className="shrink-0 pr-12 md:pr-20">{marqueeText}</span>
          <span className="shrink-0 pr-12 md:pr-20">{marqueeText}</span>
        </div>
      </div>

      <section className="relative overflow-hidden px-5 pb-16 pt-2 sm:px-6 md:pb-32 md:pt-8">
        <div className="mx-auto w-full max-w-7xl">
          <ScrollReveal variant="slide-right" amount={0.22}>
            <div className="max-w-4xl">
              <h2 className="break-keep text-h2 tracking-normal text-ink">
                혹시 내 이야기 같으신가요?
                <br className="hidden md:block" />
                허리 통증 주요 증상과 원인
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-12 md:mt-24">
            <ScrollReveal variant="slide-right" amount={0.3}>
              <h3 className="text-h3 tracking-normal text-ink">
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
                      <h4 className="break-keep text-h4 leading-snug tracking-normal text-ink">
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
              <h3 className="text-h3 tracking-normal text-ink">
                주요 원인
              </h3>
            </ScrollReveal>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
              {causeItems.map((item, index) => (
                <ScrollReveal key={item} delay={index * 0.07} amount={0.18}>
                  <div className="flex min-h-[76px] items-center gap-3 rounded-[1rem] bg-slate-50 px-4 ring-1 ring-slate-200/70 transition duration-300 hover:bg-primary-light/70 hover:ring-primary/20 sm:min-h-[92px] sm:gap-4 sm:rounded-[1.25rem] sm:px-6">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-navy-950 shadow-[0_10px_22px_-12px_rgba(245,179,0,0.9)]">
                      <Check size={21} strokeWidth={3.4} />
                    </span>
                    <span className="break-keep text-[0.98rem] font-extrabold leading-snug tracking-normal text-ink sm:text-[1.05rem] md:text-[1.22rem]">
                      {item}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LumbarDiseaseSection />

      <section className="bg-white px-5 py-16 sm:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal variant="slide-right" amount={0.22}>
            <div className="max-w-4xl">
              <h2 className="text-h2 tracking-normal text-ink">
                자주 묻는 질문
              </h2>
              <p className="mt-5 break-keep text-base font-semibold leading-[1.75] text-ink-sub sm:mt-8 md:text-xl md:leading-relaxed">
                허리 통증과 관련된 연세척의 노하우, 많은 분들이 궁금해하신 내용을 확인해 보세요.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200 sm:mt-20">
            {faqItems.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-1 py-5 text-left sm:gap-5 sm:px-2 sm:py-8 [&::-webkit-details-marker]:hidden">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white sm:h-10 sm:w-10 sm:text-[1rem]">
                    Q
                  </span>
                  <span className="flex-1 break-keep text-h4 leading-snug tracking-normal text-ink">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={28}
                    strokeWidth={2.4}
                    className="shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <div className="break-keep px-1 pb-6 text-[0.95rem] font-medium leading-[1.75] text-ink-sub sm:px-2 sm:pb-8 sm:pl-[4.25rem] sm:text-[1rem] md:text-lg md:leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <YonseiSpecialFeaturesSection />
      <SpineCenterStrengthSection />
    </main>
  );
}

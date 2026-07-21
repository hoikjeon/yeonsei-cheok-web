import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  HeartPulse,
  Home,
} from 'lucide-react';
import KneeDiseaseSection from '@/components/KneeDiseaseSection';
import KneeFaqAccordion from '@/components/KneeFaqAccordion';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: '무릎 관절 | 연세척병원 관절센터',
  description:
    '무릎 통증, 붓기, 잠김과 불안정감의 원인을 살피고 비수술 치료부터 관절내시경까지 필요한 치료를 안내하는 연세척병원 관절센터 페이지입니다.',
};

const ASSET_ROOT = '/images/treatments/joint/knee';
const marqueeText =
  'YONSEI CHEOK HOSPITAL · JOINT CENTER · KNEE PAIN CLINIC · PRECISION DIAGNOSIS · PERSONALIZED CARE ·';

const symptomCards = [
  {
    title: '움직일 때 느껴지는 통증',
    description: '걷기와 계단, 의자에서 일어날 때 통증이 나타날 수 있습니다.',
    image: `${ASSET_ROOT}/knee-symptom-locking.webp`,
    alt: '계단을 내려가며 무릎 통증을 느끼는 모습',
  },
  {
    title: '붓기와 뻣뻣함',
    description: '활동 후 붓거나 오래 쉰 뒤 무릎이 뻣뻣할 수 있습니다.',
    image: `${ASSET_ROOT}/knee-symptom-swelling-stiffness.webp`,
    alt: '붓고 뻣뻣한 무릎을 양손으로 감싸는 모습',
  },
  {
    title: '걸림·잠김과 움직임 제한',
    description: '무릎이 걸리거나 끝까지 펴고 굽히기 어려울 수 있습니다.',
    image: `${ASSET_ROOT}/knee-symptom-activity-pain.webp`,
    alt: '앉아서 불편한 무릎을 감싸는 모습',
  },
  {
    title: '휘청거림과 불안정감',
    description: '힘이 빠지거나 무릎이 꺾일 듯한 느낌이 들 수 있습니다.',
    image: `${ASSET_ROOT}/knee-symptom-instability.webp`,
    alt: '무릎 불안정감으로 벽을 짚으며 균형을 잡는 모습',
  },
];

const causeItems = [
  '나이에 따른 관절 조직의 변화',
  '체중으로 인한 반복 하중',
  '반복 사용과 갑작스러운 운동량 증가',
  '과거의 무릎 손상이나 수술',
  '비틀림·충돌·잘못된 착지',
  '관절 정렬과 주변 근육의 불균형',
];

const arthroscopyFlow = [
  {
    title: '위치와 치료 계획 확인',
    description: '증상과 진찰, 영상 소견이 일치하는지 확인하고 필요한 치료 범위를 정합니다.',
    image: `${ASSET_ROOT}/knee-arthroscopy-process-preparation.webp`,
    alt: '무릎 관절내시경 전 위치와 자세를 확인하는 모습',
  },
  {
    title: '관절 내부를 직접 확인',
    description: '작은 절개를 통해 카메라를 넣고 연골과 반월상연골, 인대 상태를 살펴봅니다.',
    image: `${ASSET_ROOT}/knee-arthroscopy-process-camera-v3.webp`,
    alt: '작은 절개로 무릎 관절내시경을 삽입하는 모습',
  },
  {
    title: '필요한 병변을 선별 치료',
    description: '정상 조직은 가능한 한 보존하면서 증상과 관련된 병변을 치료합니다.',
    image: `${ASSET_ROOT}/knee-arthroscopy-process-treatment-v3.webp`,
    alt: '무릎 관절내시경으로 필요한 병변을 치료하는 모습',
  },
  {
    title: '회복과 재활 계획 수립',
    description: '시행한 치료의 종류와 환자 상태에 맞춰 보행과 운동 회복 계획을 안내합니다.',
    image: `${ASSET_ROOT}/knee-arthroscopy-process-recovery-v3.webp`,
    alt: '관절내시경 후 작은 절개 부위를 보호한 무릎',
  },
];

const arthroscopyCandidates = [
  {
    title: '반월상연골 파열',
    description: '비수술 치료에도 걸림·잠김과 통증이 이어지거나 움직임을 막는 파열',
    image: `${ASSET_ROOT}/knee-arthroscopy-target-meniscus.webp`,
    alt: '반월상연골 파열을 표현한 의료 일러스트',
  },
  {
    title: '십자인대 손상',
    description: '방향 전환과 보행 중 반복되는 기능적 불안정성을 동반한 인대 손상',
    image: `${ASSET_ROOT}/knee-arthroscopy-target-acl.webp`,
    alt: '전방십자인대 파열을 표현한 의료 일러스트',
  },
  {
    title: '관절 안 유리체',
    description: '관절 안에서 움직이며 실제 잠김이나 반복적인 자극을 일으키는 유리체',
    image: `${ASSET_ROOT}/knee-arthroscopy-target-loose-body.webp`,
    alt: '무릎 관절 내 유리체를 표현한 의료 일러스트',
  },
  {
    title: '국소 연골 병변',
    description: '주변 연골은 비교적 보존되어 있고 한정된 부위에 확인되는 연골 손상',
    image: `${ASSET_ROOT}/knee-arthroscopy-target-cartilage.webp`,
    alt: '국소 연골 손상을 표현한 의료 일러스트',
  },
];

const careStrengths = [
  {
    title: '증상과 검사를 함께 보는 진단',
    description: '영상의 이상만 보지 않고 통증 위치와 움직임, 불안정성을 함께 확인합니다.',
  },
  {
    title: '필요한 치료만 선별',
    description: '비수술 치료를 먼저 검토하고 수술이 필요한 이유와 범위를 분명하게 설명합니다.',
  },
  {
    title: '정상 조직 보존을 우선',
    description: '반월상연골과 연골의 건강한 부분을 가능한 한 지키는 치료 방향을 우선합니다.',
  },
  {
    title: '일상 복귀까지 이어지는 관리',
    description: '시술이나 수술 이후에도 보행과 근력, 생활 습관 회복 계획을 함께 세웁니다.',
  },
];

export default function KneeJointPage() {
  return (
    <div className="overflow-x-clip bg-white">
      <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
        <div className="relative isolate flex min-h-[250px] items-center overflow-hidden rounded-[1.35rem] bg-slate-50 shadow-[0_24px_60px_-40px_rgba(15,29,54,0.4)] ring-1 ring-navy-900/5 sm:min-h-[320px] sm:rounded-[2.25rem] md:min-h-[390px]">
          <Image
            src={`${ASSET_ROOT}/knee-hero-banner.webp`}
            alt="무릎관절의 뼈와 연골, 반월상연골을 보여주는 의료 이미지"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[63%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(241,245,250,0.99)_0%,rgba(241,245,250,0.9)_42%,rgba(241,245,250,0.12)_72%,transparent_100%)]" />

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-5 py-9 sm:px-9 sm:py-12 md:px-12">
            <div className="max-w-3xl space-y-4 sm:space-y-5">
              <nav aria-label="현재 위치" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] font-semibold text-slate-500 sm:gap-x-2 sm:text-[13px] md:text-sm">
                <Link href="/" aria-label="홈으로" className="flex items-center transition-colors hover:text-primary">
                  <Home size={16} strokeWidth={2.2} className="text-amber-500" />
                </Link>
                <span aria-hidden className="text-[8px] text-slate-300">●</span>
                <Link href="/treatments" className="flex items-center gap-0.5 transition-colors hover:text-primary">
                  관절센터
                  <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                </Link>
                <span aria-hidden className="text-[8px] text-slate-300">●</span>
                <span className="flex items-center gap-0.5 text-slate-600">
                  무릎 관절
                  <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                </span>
              </nav>

              <div className="space-y-3">
                <h1 className="break-keep text-display tracking-tight text-navy-900">
                  무릎 관절
                </h1>
                <p className="max-w-xl break-keep text-[14px] font-semibold leading-[1.65] text-slate-600 sm:text-base md:text-[17px] md:text-slate-500">
                  통증과 붓기, 잠김과 불안정감의 원인을 세밀하게 살펴 필요한 치료를 찾습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-28">
        <ScrollReveal className="mx-auto max-w-5xl text-left md:text-center">
          <h2 className="break-keep text-h2 tracking-tight text-ink">
            계단이 두렵고 무릎이 욱신거린다면,
            <br className="hidden md:block" />
            관절 손상의 신호일 수 있습니다
          </h2>
        </ScrollReveal>

        <ScrollReveal variant="image" amount={0.16} className="mx-auto mt-8 max-w-5xl sm:mt-12">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-slate-50 shadow-[0_30px_80px_-48px_rgba(15,29,54,0.55)] ring-1 ring-slate-100 sm:rounded-[1.75rem]">
            <Image
              src={`${ASSET_ROOT}/knee-intro-anatomy.webp`}
              alt="무릎 통증 부위와 관절 구조를 함께 보여주는 의료 이미지"
              width={1672}
              height={941}
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-8 max-w-5xl space-y-4 text-left text-body text-ink-sub sm:mt-12 sm:space-y-5 sm:text-lg sm:leading-relaxed md:text-center">
          <p>
            무릎 통증은 관절 조직의 변화, 반복되는 하중, 과거 손상과 갑작스러운 운동량 증가 등 여러 요인이 함께 영향을 줄 수 있습니다.
          </p>
          <p>
            통증과 붓기, 잠김, 불안정감이 반복되면 일상 움직임이 줄고 주변 근력이 약해져 부담이 더 커질 수 있습니다.
          </p>
          <p>
            연세척병원 관절센터는 증상과 진찰, 영상검사를 함께 살펴 비수술 치료부터 수술 후 회복까지 환자에게 필요한 방향을 찾습니다.
          </p>
        </ScrollReveal>
      </section>

      <div aria-hidden className="marquee-fade pointer-events-none relative -mt-5 mb-12 overflow-hidden py-4 md:-mt-12 md:mb-24 md:py-6">
        <div className="marquee-track font-montserrat flex w-max select-none text-[clamp(3rem,7.2vw,6.6rem)] font-semibold uppercase leading-none tracking-[0.01em] text-navy-900/[0.055]">
          <span className="shrink-0 pr-12 md:pr-20">{marqueeText}</span>
          <span className="shrink-0 pr-12 md:pr-20">{marqueeText}</span>
        </div>
      </div>

      <section className="px-4 pb-16 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal variant="slide-right" amount={0.2}>
            <h2 className="break-keep text-h2 tracking-tight text-ink">
              혹시 내 이야기 같으신가요?
              <br className="hidden md:block" />
              무릎 통증의 주요 증상과 원인
            </h2>
          </ScrollReveal>

          <div className="mt-12 md:mt-24">
            <ScrollReveal variant="slide-right">
              <h3 className="text-h3 tracking-tight text-ink">주요 증상</h3>
            </ScrollReveal>

            <div className="mt-6 grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 sm:mt-10 sm:gap-6 xl:grid-cols-4">
              {symptomCards.map((card, index) => (
                <ScrollReveal key={card.title} delay={index * 0.06} amount={0.15} className="h-full">
                  <article className="group h-full overflow-hidden rounded-[1.1rem] bg-slate-50 ring-1 ring-slate-200/70 transition duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_-46px_rgba(15,29,54,0.6)] sm:rounded-[1.45rem]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 360px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-h-[118px] bg-slate-50 px-4 py-4 sm:min-h-[132px] sm:px-5 sm:py-5">
                      <h4 className="break-keep text-h4 leading-snug tracking-tight text-ink">{card.title}</h4>
                      <p className="mt-2 text-body leading-[1.65] text-ink-sub">{card.description}</p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-7 md:mt-28 md:gap-10 lg:grid-cols-[0.75fr_1.7fr] lg:items-start">
            <ScrollReveal variant="slide-right">
              <h3 className="text-h3 tracking-tight text-ink">주요 원인</h3>
            </ScrollReveal>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
              {causeItems.map((item, index) => (
                <ScrollReveal key={item} delay={index * 0.05} amount={0.15}>
                  <div className="flex min-h-[76px] items-center gap-3 rounded-[1rem] bg-slate-50 px-4 ring-1 ring-slate-200/70 transition duration-300 hover:bg-primary-light/70 hover:ring-primary/20 sm:min-h-[92px] sm:gap-4 sm:rounded-[1.25rem] sm:px-6">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-navy-950 shadow-[0_10px_22px_-12px_rgba(245,179,0,0.9)]">
                      <Check size={20} strokeWidth={3.4} />
                    </span>
                    <span className="text-[0.95rem] font-extrabold leading-snug tracking-tight text-ink sm:text-[1.05rem] md:text-[1.18rem]">{item}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <p className="mt-8 rounded-2xl bg-amber-50 px-4 py-4 text-[13px] font-bold leading-[1.7] text-amber-950 ring-1 ring-amber-200/70 sm:mt-10 sm:px-6 sm:text-[15px]">
            통증 없는 소리만으로 연골 손상을 진단할 수는 없습니다. 통증·붓기·잠김·불안정감이 함께 나타나면 진료가 필요합니다.
          </p>
        </div>
      </section>

      <KneeDiseaseSection />

      <section className="px-4 py-16 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <h2 className="break-keep text-h2 tracking-tight text-ink">무릎 관절내시경 치료</h2>
            <p className="mx-auto mt-5 max-w-3xl text-body-lg text-ink-sub">
              작은 절개를 통해 가느다란 카메라와 수술 기구를 넣고 관절 내부를 확인하면서 필요한 병변을 치료하는 수술입니다.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 lg:mt-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
            <ScrollReveal variant="image" className="relative min-h-[300px] overflow-hidden rounded-[1.25rem] bg-slate-100 sm:min-h-[420px] sm:rounded-[1.75rem]">
              <Image
                src={`${ASSET_ROOT}/knee-arthroscopy-concept-v3.webp`}
                alt="작은 절개를 통해 무릎 안을 확인하는 관절내시경 치료 모습"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-center"
              />
            </ScrollReveal>

            <ScrollReveal variant="soft-rise" className="flex flex-col justify-center rounded-[1.25rem] bg-navy-950 p-5 text-white sm:rounded-[1.75rem] sm:p-8 lg:p-10">
              <h3 className="break-keep text-h3">눈으로 직접 확인하고 필요한 부위만 치료합니다</h3>
              <p className="mt-5 text-body-lg text-white/85">
                MRI와 진찰로도 판단이 어려운 관절 안의 상태를 실시간 화면으로 살피고, 확인된 병변 가운데 증상과 관련된 부위를 치료합니다.
              </p>
              <div className="mt-7 space-y-3 border-t border-white/12 pt-6 text-[14px] font-bold leading-[1.65] text-white/86 sm:text-[16px]">
                <p className="flex gap-3"><Check className="mt-0.5 shrink-0 text-cyan-300" size={19} />작은 절개를 통한 관절 내부 확인</p>
                <p className="flex gap-3"><Check className="mt-0.5 shrink-0 text-cyan-300" size={19} />병변을 보면서 진단과 치료를 함께 진행</p>
                <p className="flex gap-3"><Check className="mt-0.5 shrink-0 text-cyan-300" size={19} />정상 반월상연골과 연골의 보존을 우선</p>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-16 md:mt-28">
            <ScrollReveal className="mx-auto max-w-4xl text-center">
              <h3 className="break-keep text-h3 tracking-tight text-ink">관절내시경 치료 흐름</h3>
              <p className="mt-4 text-body-lg text-ink-sub">과정과 회복 계획은 치료 부위와 환자 상태에 따라 달라질 수 있습니다.</p>
            </ScrollReveal>

            <div className="mt-8 grid gap-4 min-[480px]:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
              {arthroscopyFlow.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.06} variant="soft-rise" className="h-full">
                  <article className="h-full overflow-hidden rounded-[1.1rem] bg-white shadow-[0_24px_70px_-52px_rgba(15,29,54,0.55)] ring-1 ring-slate-200/80 sm:rounded-[1.4rem]">
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 480px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h4 className="text-h4 leading-snug tracking-tight text-ink">{item.title}</h4>
                      <p className="mt-2 text-[13px] font-medium leading-[1.7] text-ink-sub sm:text-[15px]">{item.description}</p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#0b2f78] px-4 py-16 text-white sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <h2 className="break-keep text-h2 tracking-tight">관절내시경을 고려할 수 있는 경우</h2>
            <p className="mt-5 max-w-3xl text-body-lg text-white/85">
              영상에 이상이 보인다는 이유만으로 수술하지 않습니다. 증상과 진찰 소견이 일치하고 비수술 치료 이후에도 불편이 이어지는지 함께 판단합니다.
            </p>
          </ScrollReveal>

          <div className="mt-9 grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
            {arthroscopyCandidates.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.06} variant="soft-rise" className="h-full">
                <article className="group h-full overflow-hidden rounded-[1.1rem] bg-white/[0.07] ring-1 ring-white/12 backdrop-blur-sm sm:rounded-[1.4rem]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/8">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 360px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-h4 leading-snug tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-[13px] font-medium leading-[1.7] text-white/72 sm:text-[15px]">{item.description}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-8 rounded-[1.1rem] border border-amber-300/28 bg-amber-300/10 p-4 sm:mt-10 sm:rounded-[1.4rem] sm:p-6">
            <p className="text-[14px] font-bold leading-[1.75] text-amber-50 sm:text-[16px] sm:leading-relaxed">
              무릎 골관절염 자체만을 씻거나 거친 연골을 정리하려는 목적의 관절내시경은 일반적으로 권고되지 않습니다. 반월상연골 파열이나 유리체 등 별도의 기계적 병변이 함께 있을 때 증상과의 연관성을 확인해 개별적으로 판단합니다.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <h2 className="break-keep text-h2 tracking-tight text-ink">왜 연세척병원 관절센터일까요?</h2>
          </ScrollReveal>

          <div className="mt-9 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {careStrengths.map((item, index) => (
              <ScrollReveal
                key={item.title}
                delay={0.08 + index * 0.08}
                variant="metric"
                amount={0.3}
                className="h-full"
              >
                <article className="group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-blue-glow sm:rounded-2xl sm:px-6 sm:py-7">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-light opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                  />

                  <div className="relative flex flex-1 flex-col">
                    <h3 className="text-h4 leading-snug tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-3 break-keep text-body text-ink-sub">
                      {item.description}
                    </p>
                  </div>

                  <div className="relative mt-6 h-px w-full bg-slate-200">
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gradient-to-r from-primary to-primary/40 transition-transform duration-[600ms] ease-out group-hover:scale-x-100"
                    />
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#07152d] px-4 text-white sm:px-6">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-8 py-16 md:min-h-[700px] md:grid-cols-[1fr_0.8fr] md:gap-12 md:py-0">
          <ScrollReveal className="relative z-10 order-2 md:order-1">
            <p className="text-[14px] font-bold text-cyan-300 sm:text-base">관절센터 · 정형외과 전문의</p>
            <h2 className="mt-4 break-keep text-h2 tracking-tight">
              정확한 진단과 충분한 설명으로
              <br />
              무릎 치료의 기준을 세웁니다
            </h2>
            <p className="mt-7 text-h4">최호 원장</p>
            <p className="mt-4 max-w-2xl text-body-lg text-white/85">
              무릎·어깨 등 관절 통증의 원인을 살피고 보존적 치료부터 관절내시경, 회복 관리까지 환자의 상태에 맞춰 진료합니다.
            </p>
            <ul className="mt-7 grid gap-2 text-[14px] font-semibold text-white/82 sm:grid-cols-2 sm:text-[15px]">
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-cyan-300" />경희대학교 의과대학 외래교수</li>
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-cyan-300" />좋은 강안병원 정형외과 주임과장</li>
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-cyan-300" />롯데자이언츠 주치의</li>
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-cyan-300" />무릎관절·관절내시경 진료</li>
            </ul>
            <Link href="/doctors#choi-ho" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-bold text-navy-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/30">
              최호 원장 자세히 보기
              <ArrowRight size={18} />
            </Link>
          </ScrollReveal>

          <ScrollReveal variant="image" className="relative order-1 mx-auto h-[380px] w-full max-w-[440px] overflow-hidden rounded-[1.4rem] bg-[radial-gradient(circle_at_50%_32%,rgba(84,170,232,0.28),transparent_62%)] md:order-2 md:h-[650px] md:max-w-[520px] md:rounded-none">
            <Image
              src="/최호원장.jpg"
              alt="최호 원장 프로필 사진"
              fill
              sizes="(min-width: 1024px) 520px, calc(100vw - 32px)"
              className="object-cover object-top"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#07152d] via-transparent to-transparent md:bg-gradient-to-r md:from-[#07152d]/40 md:via-transparent md:to-transparent" />
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <h2 className="text-h2 tracking-tight text-ink">자주 묻는 질문</h2>
            <p className="mt-4 text-body-lg text-ink-sub">
              무릎 통증과 검사, 관절내시경에 대해 많이 궁금해하시는 내용을 확인해 보세요.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-8 sm:mt-12">
            <KneeFaqAccordion />
          </ScrollReveal>

          <div className="mt-10 flex flex-col gap-4 rounded-[1.25rem] bg-slate-50 p-5 ring-1 ring-slate-200/70 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex min-w-0 gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                <HeartPulse size={25} />
              </span>
              <div>
                <h3 className="text-h4 text-ink">증상이 반복된다면 직접 확인해 보세요</h3>
                <p className="mt-1 text-body leading-[1.65] text-ink-sub">진찰 결과에 따라 필요한 검사와 치료 방법이 달라질 수 있습니다.</p>
              </div>
            </div>
            <Link href="/reservation" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-bold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
              진료 예약하기
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

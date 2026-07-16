import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Home } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import WristAnkleDiseaseSection from '@/components/WristAnkleDiseaseSection';
import WristAnkleFaqAccordion from '@/components/WristAnkleFaqAccordion';

export const metadata: Metadata = {
  title: '손목·발목 관절 | 연세척병원 관절센터',
  description:
    '손목 저림과 건초염, 발목 염좌와 아킬레스건염·족저근막염의 원인을 구분하고 진단부터 비수술 치료, 재활까지 안내합니다.',
};

const ASSET_ROOT = '/images/treatments/joint/wrist-ankle';
const SHOULDER_ASSET_ROOT = '/images/treatments/joint/shoulder';
const marqueeText =
  'YONSEI CHEOK HOSPITAL · JOINT CENTER · HAND AND FOOT CARE · WRIST AND ANKLE CLINIC · PERSONALIZED RECOVERY ·';

const symptoms = [
  {
    title: '찌릿하고 욱신거리는 통증',
    description: '손목이나 발목을 움직이고 체중을 실을 때 통증이 반복될 수 있습니다.',
    image: `${ASSET_ROOT}/wrist-ankle-symptom-ache.webp`,
    alt: '발목 통증 부위를 손으로 짚는 모습',
  },
  {
    title: '저림과 감각 변화',
    description: '손가락이 저리거나 전기가 오는 듯한 느낌이 밤에 더 심해질 수 있습니다.',
    image: `${ASSET_ROOT}/wrist-ankle-symptom-numbness.webp`,
    alt: '손목과 손가락의 저림을 느끼는 모습',
  },
  {
    title: '잡는 힘과 기능 저하',
    description: '물건을 놓치거나 계단과 보행 중 발목이 불안정하게 느껴질 수 있습니다.',
    image: `${ASSET_ROOT}/wrist-ankle-symptom-weakness.webp`,
    alt: '손의 힘이 약해져 컵을 잡기 어려운 모습',
  },
  {
    title: '붓기와 열감',
    description: '사용한 뒤 관절 주변이 붓고 뜨겁거나 뻣뻣한 느낌이 이어질 수 있습니다.',
    image: `${ASSET_ROOT}/wrist-ankle-symptom-warmth.webp`,
    alt: '붓고 열감이 있는 발목을 살피는 모습',
  },
];

const causes = [
  '반복적인 손목·발목 사용과 과부하',
  '낙상·접질림·스포츠 활동 중 외상',
  '손목과 발목을 오래 꺾는 자세',
  '유연성과 근력, 균형 능력의 저하',
  '과거 손상 뒤 충분하지 않은 재활',
  '당뇨·관절염 등 전신 질환과의 연관성',
];

const carePath = [
  {
    title: '증상과 기능 확인',
    description: '통증 위치와 시작 시점, 감각과 근력, 보행과 관절 안정성을 함께 살핍니다.',
    image: `${ASSET_ROOT}/wrist-ankle-path-exam.webp`,
    alt: '의료진이 손목과 발목의 움직임을 확인하는 모습',
  },
  {
    title: '필요한 검사 선택',
    description: '진찰 결과에 따라 X-ray·초음파·신경검사·MRI 중 필요한 검사를 고릅니다.',
    image: `${ASSET_ROOT}/wrist-ankle-path-ultrasound.webp`,
    alt: '의료진이 발목 힘줄을 초음파로 검사하는 모습',
  },
  {
    title: '비수술 치료 우선',
    description: '활동 조절과 보조기, 약물·주사·운동치료로 회복할 가능성을 먼저 살핍니다.',
    image: `${ASSET_ROOT}/wrist-ankle-path-brace.webp`,
    alt: '손목을 중립 위치로 지지하는 보조기를 착용한 모습',
  },
  {
    title: '재활과 재발 예방',
    description: '통증이 줄어든 뒤 유연성·근력·균형을 회복해 일상과 운동 복귀를 돕습니다.',
    image: `${ASSET_ROOT}/wrist-ankle-path-rehab.webp`,
    alt: '발목 균형과 안정성 회복 운동을 하는 모습',
  },
];

const strengths = [
  {
    title: '증상과 검사를 함께 보는 진단',
    description: '영상 결과만 보지 않고 통증 위치와 움직임, 감각과 힘의 변화를 함께 확인합니다.',
  },
  {
    title: '필요한 치료만 선별',
    description: '생활 조절과 보조기부터 주사·수술까지 현재 상태에 필요한 범위를 설명합니다.',
  },
  {
    title: '정상 조직 보존을 우선',
    description: '비수술 치료 가능성을 먼저 검토하고 꼭 필요한 경우에만 수술 범위를 정합니다.',
  },
  {
    title: '일상 복귀까지 이어지는 관리',
    description: '관절을 보호하는 기간부터 근력·균형 회복과 재발 예방까지 계획을 세웁니다.',
  },
];

export default function WristAnkleJointPage() {
  return (
    <main className="overflow-x-clip bg-white">
      <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
        <div className="relative isolate flex min-h-[270px] items-center overflow-hidden rounded-[1.35rem] bg-[#e9f0f6] shadow-[0_24px_60px_-40px_rgba(15,29,54,0.4)] ring-1 ring-navy-900/5 sm:min-h-[330px] sm:rounded-[2.25rem] md:min-h-[410px]">
          <Image
            src={`${ASSET_ROOT}/wrist-ankle-hero-banner.webp`}
            alt="손목과 발목의 뼈, 인대와 통증 부위를 보여주는 의료 이미지"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[62%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,242,247,0.99)_0%,rgba(235,242,247,0.92)_41%,rgba(235,242,247,0.2)_70%,transparent_100%)]" />

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-5 py-9 sm:px-9 sm:py-12 md:px-12">
            <div className="max-w-3xl space-y-4 sm:space-y-5">
              <nav aria-label="현재 위치" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] font-semibold text-slate-500 sm:gap-x-2 sm:text-[13px] md:text-sm">
                <Link
                  href="/"
                  aria-label="홈으로"
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <Home size={16} strokeWidth={2.2} className="text-amber-500" />
                </Link>
                <span aria-hidden className="text-[8px] text-slate-300">●</span>
                <Link href="/treatments" className="flex items-center gap-0.5 transition-colors hover:text-primary">
                  관절센터
                  <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                </Link>
                <span aria-hidden className="text-[8px] text-slate-300">●</span>
                <span className="flex items-center gap-0.5 text-slate-600">
                  손목·발목 관절
                  <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                </span>
              </nav>

              <div className="space-y-3">
                <h1 className="break-keep text-display tracking-tight text-navy-900">
                  손목·발목 관절
                </h1>
                <p className="max-w-xl break-keep text-[14px] font-semibold leading-[1.7] text-slate-600 sm:text-base md:text-[17px] md:text-slate-500">
                  자주 쓰는 손과 발의 통증, 저림과 불안정성의 원인을 구분해 필요한 치료 방향을 찾습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-28">
        <ScrollReveal className="mx-auto max-w-5xl text-left md:text-center">
          <h2 className="break-keep text-h2 tracking-tight text-ink">
            손목·발목이 자주 시큰거리나요?
            <br className="hidden md:block" />
            자주 쓸수록 빠른 확인이 필요합니다
          </h2>
        </ScrollReveal>

        <ScrollReveal variant="image" amount={0.16} className="mt-8 sm:mt-12">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-[#edf5fb] shadow-[0_30px_80px_-48px_rgba(15,29,54,0.55)] ring-1 ring-slate-100 sm:rounded-[1.75rem]">
            <Image
              src={`${ASSET_ROOT}/wrist-ankle-intro.webp`}
              alt="일상에서 손목과 발목 통증을 느끼는 사람의 모습"
              width={1672}
              height={941}
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-8 max-w-5xl space-y-4 text-left text-body-lg text-ink-sub sm:mt-12 sm:space-y-5 sm:text-lg sm:leading-relaxed md:text-center">
          <p>손과 발은 일상에서 쉬기 어려운 부위라 작은 통증도 반복 사용과 함께 오래 이어질 수 있습니다.</p>
          <p>같은 저림과 통증처럼 보여도 인대·힘줄 손상, 신경 압박과 염증 등 원인이 다를 수 있습니다.</p>
          <p>연세척병원 관절센터는 증상과 기능, 필요한 검사를 함께 살펴 비수술 치료부터 재활까지 방향을 세웁니다.</p>
        </ScrollReveal>
      </section>

      <div aria-hidden className="marquee-fade pointer-events-none relative -mt-5 mb-12 overflow-hidden py-4 md:-mt-12 md:mb-24 md:py-6">
        <div className="marquee-track font-montserrat flex w-max select-none text-[clamp(3rem,7.2vw,6.6rem)] font-semibold uppercase leading-none tracking-[0.01em] text-navy-900/[0.055]">
          <span className="shrink-0 pr-12 md:pr-20">{marqueeText}</span>
          <span className="shrink-0 pr-12 md:pr-20">{marqueeText}</span>
        </div>
      </div>

      <section id="wrist" className="scroll-mt-24 px-4 pb-16 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal variant="slide-right" amount={0.2}>
            <h2 className="break-keep text-h2 tracking-tight text-ink">
              혹시 내 이야기 같으신가요?
              <br className="hidden md:block" />
              손·발 통증의 주요 증상과 원인
            </h2>
          </ScrollReveal>

          <div className="mt-12 md:mt-24">
            <ScrollReveal variant="slide-right">
              <h3 className="text-h3 tracking-tight text-ink">주요 증상</h3>
            </ScrollReveal>

            <div className="mt-6 grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 sm:mt-10 sm:gap-6 xl:grid-cols-4">
              {symptoms.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.06} amount={0.15} className="h-full">
                  <article className="group h-full overflow-hidden rounded-[1.1rem] bg-slate-50 ring-1 ring-slate-200/70 transition duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_-46px_rgba(15,29,54,0.6)] sm:rounded-[1.45rem]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 360px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-h-[118px] px-4 py-4 sm:min-h-[132px] sm:px-5 sm:py-5">
                      <h4 className="break-keep text-h4 leading-snug tracking-tight text-ink">{item.title}</h4>
                      <p className="mt-2 text-body leading-[1.65] text-ink-sub">{item.description}</p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-7 md:mt-28 md:gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.7fr)] lg:items-start">
            <ScrollReveal variant="slide-right">
              <h3 className="text-h3 tracking-tight text-ink">주요 원인</h3>
            </ScrollReveal>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
              {causes.map((item, index) => (
                <ScrollReveal key={item} delay={index * 0.05} amount={0.15}>
                  <div className="flex min-h-[76px] items-center rounded-[1rem] bg-slate-50 px-5 ring-1 ring-slate-200/70 transition duration-300 hover:bg-primary-light/70 hover:ring-primary/20 sm:min-h-[92px] sm:rounded-[1.25rem] sm:px-6">
                    <span className="text-[0.95rem] font-extrabold leading-snug tracking-tight text-ink sm:text-[1.05rem] md:text-[1.18rem]">{item}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <p className="mt-8 rounded-2xl bg-amber-50 px-4 py-4 text-[13px] font-bold leading-[1.75] text-amber-950 ring-1 ring-amber-200/70 sm:mt-10 sm:px-6 sm:text-[15px]">
            갑작스러운 감각·근력 저하, 관절 변형, 심한 외상, 피부색 변화 또는 발열을 동반한 붓기가 있으면 지체하지 말고 의료기관에서 평가받으세요.
          </p>
        </div>
      </section>

      <div id="ankle" className="scroll-mt-24" />
      <WristAnkleDiseaseSection />

      <section className="px-4 py-16 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <h2 className="break-keep text-h2 tracking-tight text-ink">
              증상 확인부터 일상 복귀까지
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-body-lg text-ink-sub">
              치료 과정은 질환과 손상 정도, 환자의 활동 수준에 따라 달라질 수 있습니다.
            </p>
          </ScrollReveal>

          <div className="mt-9 grid gap-4 min-[480px]:grid-cols-2 sm:mt-14 lg:grid-cols-4 lg:gap-5">
            {carePath.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.06} amount={0.15} className="h-full">
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
                    <h3 className="text-h4 leading-snug tracking-tight text-ink">{item.title}</h3>
                    <p className="mt-2 text-[13px] font-medium leading-[1.7] text-ink-sub sm:text-[15px]">{item.description}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <h2 className="break-keep text-h2 tracking-tight text-ink">
              왜 연세척병원 관절센터일까요?
            </h2>
          </ScrollReveal>

          <div className="mt-9 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {strengths.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.06} amount={0.16} className="h-full">
                <article className="group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-blue-glow sm:px-6 sm:py-7">
                  <h3 className="text-h4 leading-snug tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-3 break-keep text-body text-ink-sub">{item.description}</p>
                  <div aria-hidden className="mt-auto pt-6">
                    <div className="h-px w-full bg-slate-200">
                      <span className="block h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#07152d] px-4 text-white sm:px-6">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-8 py-16 md:min-h-[700px] md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:gap-12 md:py-0">
          <ScrollReveal className="relative z-10 order-2 min-w-0 md:order-1">
            <p className="text-[14px] font-bold text-cyan-300 sm:text-base">관절센터 · 정형외과 전문의</p>
            <h2 className="mt-4 break-keep text-h2 tracking-tight">
              자주 쓰는 손과 발,
              <br /> 정확한 진단으로 기능을 지킵니다
            </h2>
            <p className="mt-7 text-h4">최호 원장</p>
            <p className="mt-4 max-w-2xl text-body-lg text-white/85">
              손목과 발목의 통증·저림·불안정성을 세밀하게 구분하고 비수술 치료부터 수술 후 재활까지 환자의 일상에 맞춰 진료합니다.
            </p>
            <ul className="mt-7 grid gap-2 text-[14px] font-semibold text-white/82 sm:grid-cols-2 sm:text-[15px]">
              <li>경희대학교 의과대학 외래교수</li>
              <li>좋은 강안병원 정형외과 주임과장</li>
              <li>롯데자이언츠 주치의</li>
              <li>손·발 관절 및 관절내시경 진료</li>
            </ul>
            <Link href="/doctors#choi-ho" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-bold text-navy-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/30">
              최호 원장 자세히 보기
              <ArrowRight size={18} />
            </Link>
          </ScrollReveal>

          <ScrollReveal variant="image" className="relative order-1 mx-auto h-[380px] w-full max-w-[440px] overflow-hidden rounded-[1.4rem] bg-[radial-gradient(circle_at_50%_32%,rgba(84,170,232,0.28),transparent_62%)] md:order-2 md:h-[650px] md:max-w-[520px] md:rounded-none">
            <Image
              src={`${SHOULDER_ASSET_ROOT}/choi-ho-doctor.webp`}
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
              손목과 발목 통증, 검사와 생활 관리에 대해 많이 궁금해하시는 내용을 확인해 보세요.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-8 sm:mt-12">
            <WristAnkleFaqAccordion />
          </ScrollReveal>

          <div className="mt-10 flex flex-col gap-4 rounded-[1.25rem] bg-slate-50 p-5 ring-1 ring-slate-200/70 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <h3 className="text-h4 text-ink">통증과 저림이 반복된다면 원인부터 확인해 보세요</h3>
              <p className="mt-1 text-body leading-[1.65] text-ink-sub">진찰 결과에 따라 필요한 검사와 치료 방법이 달라질 수 있습니다.</p>
            </div>
            <Link href="/reservation" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-bold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
              진료 예약하기
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, Home } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import ShoulderDiseaseSection from '@/components/ShoulderDiseaseSection';
import ShoulderFaqAccordion from '@/components/ShoulderFaqAccordion';

export const metadata: Metadata = {
  title: '어깨 관절 | 연세척병원 관절센터',
  description:
    '어깨 통증, 야간 통증, 운동 범위 감소의 원인을 살피고 회전근개 파열·오십견·석회성건염과 관절내시경 회전근개 봉합술을 안내합니다.',
};

const ASSET_ROOT = '/images/treatments/joint/shoulder';
const marqueeText =
  'YONSEI CHEOK HOSPITAL · JOINT CENTER · SHOULDER PAIN CLINIC · ROTATOR CUFF CARE · PERSONALIZED RECOVERY ·';

const symptomCards = [
  {
    title: '통증과 압통',
    description: '어깨 앞쪽이나 바깥쪽이 아프고 누를 때 불편할 수 있습니다.',
    image: `${ASSET_ROOT}/shoulder-symptom-tenderness.webp`,
    alt: '어깨 앞쪽 통증 부위를 손으로 짚는 모습',
  },
  {
    title: '밤에 심해지는 통증',
    description: '아픈 쪽으로 누울 때 통증이 심해져 잠에서 깰 수 있습니다.',
    image: `${ASSET_ROOT}/shoulder-symptom-night-pain.webp`,
    alt: '밤에 어깨 통증으로 잠을 이루기 어려운 모습',
  },
  {
    title: '팔을 들거나 돌릴 때 통증',
    description: '옷을 입거나 머리 위로 팔을 올리는 동작이 불편할 수 있습니다.',
    image: `${ASSET_ROOT}/shoulder-symptom-rotation-pain.webp`,
    alt: '팔을 들어 올리며 어깨 통증을 느끼는 모습',
  },
  {
    title: '운동 범위와 근력 감소',
    description: '등 뒤로 손을 돌리기 어렵거나 팔에 힘이 빠질 수 있습니다.',
    image: `${ASSET_ROOT}/shoulder-symptom-range-limited.webp`,
    alt: '의료진이 어깨 운동 범위를 확인하는 모습',
  },
];

const causeItems = [
  '나이에 따른 힘줄의 퇴행성 변화',
  '머리 위 동작과 반복적인 어깨 사용',
  '넘어짐·충돌·무거운 물건을 든 외상',
  '수술이나 골절 뒤 오랜 움직임 제한',
  '당뇨병·갑상선 질환과의 연관성',
  '힘줄 안의 석회 침착과 주변 염증',
];

const arthroscopyFlow = [
  {
    title: '증상과 파열 상태 확인',
    description: '진찰과 초음파·MRI 소견을 함께 살펴 치료 범위와 회복 계획을 정합니다.',
    image: `${ASSET_ROOT}/shoulder-arthroscopy-evaluation.webp`,
    alt: '의료진이 초음파와 진찰로 어깨 상태를 확인하는 모습',
  },
  {
    title: '관절 내부를 직접 확인',
    description: '작은 통로로 관절경을 넣어 파열 위치와 주변 연골·힘줄 상태를 살펴봅니다.',
    image: `${ASSET_ROOT}/shoulder-arthroscopy-camera.webp`,
    alt: '어깨 관절 내부를 관절경으로 확인하는 의료 일러스트',
  },
  {
    title: '힘줄을 원래 자리로 봉합',
    description: '정상 조직을 가능한 한 보존하며 파열된 힘줄을 상완골 부착 부위에 고정합니다.',
    image: `${ASSET_ROOT}/shoulder-arthroscopy-repair.webp`,
    alt: '관절경으로 회전근개 힘줄을 봉합하는 의료 일러스트',
  },
  {
    title: '회복과 재활 계획 수립',
    description: '봉합 범위와 환자 상태에 맞춰 보호 기간과 관절 운동, 근력 회복을 안내합니다.',
    image: `${ASSET_ROOT}/shoulder-arthroscopy-recovery.webp`,
    alt: '어깨 관절내시경 치료 후 재활을 시작하는 모습',
  },
];

const surgeryConsiderations = [
  {
    title: '비수술 치료 후에도 이어지는 통증',
    description: '약물·주사·운동치료를 충분히 시행했는데도 야간 통증과 일상 불편이 지속되는 경우',
  },
  {
    title: '외상 뒤 생긴 급성 파열',
    description: '넘어지거나 무거운 물건을 든 뒤 갑자기 팔을 들기 어렵고 힘이 크게 떨어진 경우',
  },
  {
    title: '기능 저하를 동반한 파열',
    description: '파열 범위와 위치가 증상·근력 저하와 일치하고 일이나 운동을 방해하는 경우',
  },
  {
    title: '봉합 가능성을 살펴야 하는 파열',
    description: '힘줄 상태와 환자 연령, 활동 수준을 고려할 때 복원 가능성을 평가할 필요가 있는 경우',
  },
];

const careStrengths = [
  {
    title: '증상과 검사를 함께 보는 진단',
    description: '영상의 파열만 보지 않고 통증 위치와 움직임, 근력 저하를 함께 확인합니다.',
  },
  {
    title: '비수술 치료를 먼저 검토',
    description: '약물·주사·운동치료 등으로 회복할 수 있는 가능성을 우선 살펴봅니다.',
  },
  {
    title: '정상 힘줄과 조직 보존을 우선',
    description: '관절내시경으로 병변을 직접 보며 필요한 범위만 치료하는 방향을 세웁니다.',
  },
  {
    title: '일상 복귀까지 이어지는 관리',
    description: '보호 기간부터 관절 운동, 근력 회복까지 단계별 재활 계획을 안내합니다.',
  },
];

export default function ShoulderJointPage() {
  return (
    <div className="overflow-x-clip bg-white">
      <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
        <div className="relative isolate flex min-h-[250px] items-center overflow-hidden rounded-[1.35rem] bg-slate-50 shadow-[0_24px_60px_-40px_rgba(15,29,54,0.4)] ring-1 ring-navy-900/5 sm:min-h-[320px] sm:rounded-[2.25rem] md:min-h-[390px]">
          <Image
            src={`${ASSET_ROOT}/shoulder-hero-banner.webp`}
            alt="어깨 관절의 뼈와 회전근개 구조를 보여주는 의료 이미지"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[64%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(241,245,250,0.99)_0%,rgba(241,245,250,0.92)_42%,rgba(241,245,250,0.16)_72%,transparent_100%)]" />

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
                  어깨 관절
                  <ChevronDown size={14} strokeWidth={2.4} className="text-slate-400" />
                </span>
              </nav>

              <div className="space-y-3">
                <h1 className="break-keep text-display tracking-tight text-navy-900">
                  어깨 관절
                </h1>
                <p className="max-w-xl break-keep text-[14px] font-semibold leading-[1.65] text-slate-600 sm:text-base md:text-[17px] md:text-slate-500">
                  밤까지 이어지는 통증과 움직임 제한의 원인을 구분해 필요한 치료 방향을 찾습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-28">
        <ScrollReveal className="mx-auto max-w-5xl text-left md:text-center">
          <h2 className="break-keep text-h2 tracking-tight text-ink">
            자고 일어나도 계속되는 어깨 통증,
            <br className="hidden md:block" />
            원인을 구분하는 것부터 회복이 시작됩니다
          </h2>
        </ScrollReveal>

        <ScrollReveal variant="image" amount={0.16} className="mx-auto mt-8 max-w-5xl sm:mt-12">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-[#edf5fb] shadow-[0_30px_80px_-48px_rgba(15,29,54,0.55)] ring-1 ring-slate-100 sm:rounded-[1.75rem]">
            <Image
              src={`${ASSET_ROOT}/shoulder-intro-anatomy.webp`}
              alt="상체와 어깨 관절의 뼈, 회전근개를 함께 보여주는 의료 이미지"
              width={1672}
              height={941}
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-8 max-w-5xl space-y-4 text-left text-body text-ink-sub sm:mt-12 sm:space-y-5 sm:text-lg sm:leading-relaxed md:text-center">
          <p>
            어깨 통증은 회전근개 힘줄과 관절낭, 점액낭, 연골 등 서로 다른 구조에서 시작될 수 있습니다.
          </p>
          <p>
            통증이 시작된 시점과 팔의 움직임, 근력과 운동 범위를 살피고 필요할 때 X-ray·초음파·MRI를 함께 확인합니다.
          </p>
          <p>
            연세척병원 관절센터는 질환 이름보다 환자가 실제로 겪는 불편을 기준으로 비수술 치료부터 수술 후 회복까지 방향을 세웁니다.
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
              어깨 통증의 주요 증상과 원인
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
            어깨 통증의 원인은 한 가지 증상만으로 구분하기 어렵습니다. 외상 뒤 팔을 들 수 없거나 심한 붓기·감각 저하·발열이 동반되면 빠른 진료가 필요합니다.
          </p>
        </div>
      </section>

      <ShoulderDiseaseSection />

      <section className="px-4 py-16 sm:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <h2 className="break-keep text-h2 tracking-tight text-ink">
              관절내시경 회전근개 봉합술
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-body-lg text-ink-sub">
              작은 절개로 관절 내부를 확인하고 파열된 힘줄을 원래 부착 부위에 다시 고정하는 수술입니다.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 lg:mt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-stretch lg:gap-6">
            <ScrollReveal
              variant="image"
              className="relative min-w-0 aspect-video overflow-hidden rounded-[1.25rem] bg-[#edf5fb] sm:rounded-[1.75rem] lg:aspect-auto"
            >
              <Image
                src={`${ASSET_ROOT}/shoulder-arthroscopy-concept.webp`}
                alt="두 개의 작은 통로로 관절경과 수술 기구를 넣어 회전근개 파열을 확인하는 의료 일러스트"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-center"
              />
            </ScrollReveal>

            <ScrollReveal className="relative z-10 flex min-w-0 flex-col justify-center rounded-[1.25rem] bg-navy-950 p-5 text-white sm:rounded-[1.75rem] sm:p-8 lg:p-10">
              <h3 className="break-keep text-h3">
                파열 부위를 눈으로 확인하고,
                <br /> 필요한 범위만 정밀하게 봉합합니다
              </h3>
              <p className="mt-5 text-body-lg text-white/85">
                관절경 화면으로 힘줄과 연골 상태를 살피고, 건강한 조직은 가능한 한 보존하면서 파열된 회전근개를 상완골 부착 부위에 고정합니다.
              </p>
              <div className="mt-7 space-y-3 border-t border-white/12 pt-6 text-[14px] font-bold leading-[1.65] text-white/86 sm:text-[16px]">
                <p className="flex gap-3"><Check className="mt-0.5 shrink-0 text-cyan-300" size={19} />작은 절개를 통한 어깨 관절 내부 확인</p>
                <p className="flex gap-3"><Check className="mt-0.5 shrink-0 text-cyan-300" size={19} />파열 크기와 힘줄 상태에 맞춘 봉합</p>
                <p className="flex gap-3"><Check className="mt-0.5 shrink-0 text-cyan-300" size={19} />수술 뒤 단계적인 보호와 재활 계획</p>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-16 md:mt-28">
            <ScrollReveal className="mx-auto max-w-4xl text-center">
              <h3 className="break-keep text-h3 tracking-tight text-ink">
                파열 상태와 봉합 후 모습
              </h3>
              <p className="mt-4 text-body-lg text-ink-sub">
                파열의 모양과 힘줄 상태에 따라 봉합 방법과 회복 계획은 달라질 수 있습니다.
              </p>
            </ScrollReveal>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:mt-12">
              <ScrollReveal variant="image">
                <figure className="overflow-hidden rounded-[1.25rem] bg-slate-50 ring-1 ring-slate-200/70 sm:rounded-[1.75rem]">
                  <div className="relative aspect-video bg-[#edf5fb]">
                    <Image
                      src={`${ASSET_ROOT}/shoulder-disease-rotator-cuff.webp`}
                      alt="상완골 부착 부위에서 찢어진 회전근개 힘줄"
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-5 py-4 text-center text-h4 text-ink">회전근개 파열 상태</figcaption>
                </figure>
              </ScrollReveal>
              <ScrollReveal variant="image" delay={0.08}>
                <figure className="overflow-hidden rounded-[1.25rem] bg-slate-50 ring-1 ring-slate-200/70 sm:rounded-[1.75rem]">
                  <div className="relative aspect-video bg-[#edf5fb]">
                    <Image
                      src={`${ASSET_ROOT}/shoulder-rotator-cuff-repaired.webp`}
                      alt="봉합 나사와 실로 원래 위치에 고정된 회전근개 힘줄"
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-5 py-4 text-center text-h4 text-ink">힘줄을 원래 자리로 봉합한 상태</figcaption>
                </figure>
              </ScrollReveal>
            </div>
          </div>

          <div className="mt-16 md:mt-28">
            <ScrollReveal className="mx-auto max-w-4xl text-center">
              <h3 className="break-keep text-h3 tracking-tight text-ink">치료 흐름</h3>
              <p className="mt-4 text-body-lg text-ink-sub">봉합 범위와 회복 속도는 파열 상태와 환자 조건에 따라 달라질 수 있습니다.</p>
            </ScrollReveal>

            <div className="mt-8 grid gap-4 min-[480px]:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
              {arthroscopyFlow.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.06} className="h-full">
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
            <h2 className="break-keep text-h2 tracking-tight">
              회전근개 봉합술을 고려할 수 있는 경우
            </h2>
            <p className="mt-5 max-w-3xl text-body-lg text-white/85">
              MRI의 파열만으로 수술하지 않습니다. 증상과 근력, 파열 시점과 범위, 활동 수준과 비수술 치료 반응을 함께 판단합니다.
            </p>
          </ScrollReveal>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
            {surgeryConsiderations.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.06} className="h-full">
                <article className="h-full rounded-[1.1rem] bg-white/[0.07] p-5 ring-1 ring-white/12 backdrop-blur-sm sm:rounded-[1.4rem] sm:p-6">
                  <h3 className="text-h4 leading-snug tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-[1.75] text-white/72 sm:text-[15px]">{item.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-8 rounded-[1.1rem] border border-amber-300/28 bg-amber-300/10 p-4 sm:mt-10 sm:rounded-[1.4rem] sm:p-6">
            <p className="text-[14px] font-bold leading-[1.75] text-amber-50 sm:text-[16px] sm:leading-relaxed">
              수술 후에는 일정 기간 보조기로 봉합 부위를 보호하고 단계적으로 운동 범위를 회복합니다. 관절 뻣뻣함, 재파열, 감염 등 합병증 가능성과 예상 회복 기간을 충분히 설명한 뒤 치료를 결정합니다.
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
              <ScrollReveal key={item.title} delay={0.06 + index * 0.06} amount={0.2} className="h-full">
                <article className="group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-blue-glow sm:rounded-2xl sm:px-6 sm:py-7">
                  <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-light opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />
                  <div className="relative flex flex-1 flex-col">
                    <h3 className="text-h4 leading-snug tracking-tight text-ink">{item.title}</h3>
                    <p className="mt-3 break-keep text-body text-ink-sub">{item.description}</p>
                  </div>
                  <div className="relative mt-6 h-px w-full bg-slate-200">
                    <span aria-hidden className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gradient-to-r from-primary to-primary/40 transition-transform duration-[600ms] ease-out group-hover:scale-x-100" />
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
              <br /> 어깨 치료의 기준을 세웁니다
            </h2>
            <p className="mt-7 text-h4">최호 원장</p>
            <p className="mt-4 max-w-2xl text-body-lg text-white/85">
              어깨 통증의 원인을 세밀하게 구분하고 비수술 치료부터 회전근개 관절내시경, 수술 후 재활까지 환자의 상태에 맞춰 진료합니다.
            </p>
            <ul className="mt-7 grid gap-2 text-[14px] font-semibold text-white/82 sm:grid-cols-2 sm:text-[15px]">
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-cyan-300" />경희대학교 의과대학 외래교수</li>
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-cyan-300" />좋은 강안병원 정형외과 주임과장</li>
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-cyan-300" />롯데자이언츠 주치의</li>
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-cyan-300" />어깨관절·관절내시경 진료</li>
            </ul>
            <Link href="/doctors#choi-ho" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-bold text-navy-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/30">
              최호 원장 자세히 보기
              <ArrowRight size={18} />
            </Link>
          </ScrollReveal>

          <ScrollReveal variant="image" className="relative order-1 mx-auto h-[380px] w-full max-w-[440px] overflow-hidden rounded-[1.4rem] bg-[radial-gradient(circle_at_50%_32%,rgba(84,170,232,0.28),transparent_62%)] md:order-2 md:h-[650px] md:max-w-[520px] md:rounded-none">
            <Image
              src={`${ASSET_ROOT}/choi-ho-doctor.webp`}
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
              어깨 통증과 검사, 회전근개 치료에 대해 많이 궁금해하시는 내용을 확인해 보세요.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-8 sm:mt-12">
            <ShoulderFaqAccordion />
          </ScrollReveal>

          <div className="mt-10 flex flex-col gap-4 rounded-[1.25rem] bg-slate-50 p-5 ring-1 ring-slate-200/70 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <h3 className="text-h4 text-ink">통증과 움직임 제한이 반복된다면 직접 확인해 보세요</h3>
              <p className="mt-1 text-body leading-[1.65] text-ink-sub">진찰 결과에 따라 필요한 검사와 치료 방법이 달라질 수 있습니다.</p>
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

import Link from 'next/link';
import { Activity, CheckCircle2, Microscope, ShieldCheck, Stethoscope } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import SubHero from '@/components/SubHero';

const BENEFITS = [
  '두 개의 작은 통로를 이용해 내시경과 수술 기구를 각각 삽입합니다.',
  '정상 조직과 근육 손상을 줄이면서 병변 부위에 정밀하게 접근합니다.',
  '환자의 상태에 따라 회복 부담을 줄이는 최소침습 치료를 지향합니다.',
];

const INDICATIONS = [
  '허리디스크',
  '목디스크',
  '척추관협착증',
  '추간공협착증',
  '재발성 디스크',
  '보존적 치료 후 호전이 더딘 신경 압박 통증',
];

const PROCESS = [
  {
    title: '정밀 진단',
    desc: '문진, 이학적 검사, 영상 검사를 바탕으로 통증의 원인과 수술 필요성을 확인합니다.',
    icon: <Stethoscope size={24} />,
  },
  {
    title: '치료 계획',
    desc: '비수술 치료 가능성을 먼저 검토하고, 필요한 경우 양방향 척추내시경을 포함한 치료 방향을 설명합니다.',
    icon: <ShieldCheck size={24} />,
  },
  {
    title: '최소침습 접근',
    desc: '내시경 시야로 병변을 확인하며 신경 압박을 줄이는 정밀 치료를 진행합니다.',
    icon: <Microscope size={24} />,
  },
  {
    title: '회복 관리',
    desc: '치료 후 통증 변화와 보행 상태를 확인하고 재활 및 생활 관리 방향을 안내합니다.',
    icon: <Activity size={24} />,
  },
];

export default function UbePage() {
  return (
    <div className="flex flex-col bg-white">
      <SubHero
        title="양방향 척추내시경"
        subtitle="절개를 최소화하고 병변에 정밀하게 접근하는 연세척병원의 척추내시경 치료입니다."
        path={[
          { name: '척추센터', href: '/treatments/spine' },
          { name: '양방향 척추내시경' },
        ]}
        bgImage="/generated/hero-spine-endoscopy.png"
      />

      <main className="w-full">
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
            <ScrollReveal className="space-y-6">
              <h2 className="text-4xl font-black leading-tight tracking-tight text-ink md:text-5xl">
                작은 통로로 접근하는
                <br />
                정밀 척추 치료
              </h2>
              <p className="text-lg font-medium leading-relaxed text-ink-sub">
                양방향 척추내시경(UBE)은 두 개의 작은 통로를 통해 내시경과 수술 기구를 각각 넣어
                병변 부위를 확인하고 치료하는 최소침습 척추 치료 방법입니다.
              </p>
              <p className="text-lg font-medium leading-relaxed text-ink-sub">
                이 페이지는 임시 구성입니다. 실제 원고와 이미지가 확정되면 치료 대상, 수술 과정,
                회복 안내, 주의사항을 병원 기준에 맞춰 업데이트할 수 있습니다.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08} className="rounded-lg border border-slate-100 bg-slate-50 p-7 md:p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Microscope size={28} />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-ink">UBE 치료의 핵심</h3>
              <div className="mt-6 space-y-4">
                {BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex gap-3 text-[17px] font-medium leading-relaxed text-ink-sub">
                    <CheckCircle2 size={20} className="mt-1 shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="benefits" className="border-y border-slate-100 bg-slate-50/70 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mb-12 max-w-3xl">
              <h2 className="text-4xl font-black leading-tight tracking-tight text-ink md:text-5xl">
                치료 장점
              </h2>
              <p className="mt-5 text-lg font-medium leading-relaxed text-ink-sub">
                절개 범위를 줄이고, 내시경 시야를 통해 병변을 확인하며 접근하는 방식입니다.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {BENEFITS.map((benefit, index) => (
                <ScrollReveal key={benefit} delay={index * 0.06}>
                  <article className="h-full rounded-lg border border-slate-100 bg-white p-7 shadow-[0_24px_70px_-58px_rgba(15,29,54,0.45)]">
                    <div className="mb-5 text-3xl font-black text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <p className="text-[17px] font-bold leading-relaxed text-ink-sub">{benefit}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="indications" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <ScrollReveal className="mb-12 max-w-3xl">
            <h2 className="text-4xl font-black leading-tight tracking-tight text-ink md:text-5xl">
              적용 질환
            </h2>
            <p className="mt-5 text-lg font-medium leading-relaxed text-ink-sub">
              환자의 증상, 영상 검사, 신경 압박 정도에 따라 치료 가능 여부를 판단합니다.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {INDICATIONS.map((item, index) => (
              <ScrollReveal key={item} delay={index * 0.04}>
                <div className="flex min-h-16 items-center gap-3 rounded-lg border border-slate-100 bg-white px-5 py-4 shadow-[0_18px_50px_-44px_rgba(15,29,54,0.45)]">
                  <CheckCircle2 size={20} className="shrink-0 text-primary" />
                  <span className="text-base font-black text-ink-sub">{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="process" className="border-y border-slate-100 bg-navy-950 px-6 py-20 text-white md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mb-12 max-w-3xl">
              <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
                치료 과정
              </h2>
              <p className="mt-5 text-lg font-medium leading-relaxed text-slate-300">
                진단부터 회복 관리까지 환자가 이해할 수 있도록 충분히 설명합니다.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((step, index) => (
                <ScrollReveal key={step.title} delay={index * 0.06}>
                  <article className="h-full rounded-lg border border-white/10 bg-white/[0.04] p-7">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-white">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{step.title}</h3>
                    <p className="mt-4 text-[16px] font-medium leading-relaxed text-slate-300">{step.desc}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <ScrollReveal className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-[0_30px_90px_-60px_rgba(15,29,54,0.45)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-4 p-8 md:p-10 lg:p-12">
              <h2 className="text-3xl font-black leading-tight tracking-tight text-ink md:text-4xl">
                내 증상에 맞는 치료인지 확인하고 싶다면
              </h2>
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-ink-sub">
                검사 자료와 증상을 바탕으로 양방향 척추내시경 적용 가능 여부를 안내해 드립니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 p-8 md:flex-row md:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-4 text-base font-black text-white transition-all hover:bg-primary-dark"
              >
                진료 예약하기
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-6 py-4 text-base font-black text-ink transition-all hover:border-primary/40 hover:text-primary"
              >
                온라인 상담
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
}

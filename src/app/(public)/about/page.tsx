import Image from 'next/image';
import { Handshake, Route, ScanSearch, Syringe } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import SubHero from '@/components/SubHero';

const INTRO_SECTIONS = [
  {
    title: '병원장 인사말',
    image: '/generated/hero-university-doctors.png',
    imageAlt: '척추 진료 상담을 진행하는 의료진과 환자',
    paragraphs: [
      '안녕하십니까. 연세척병원을 찾아주신 여러분을 진심으로 환영합니다.',
      '척추와 관절의 통증은 일상의 작은 움직임까지 무겁게 만듭니다. 오랜 진료를 통해 저는, 같은 진단명이라도 환자마다 통증의 원인과 생활 환경이 다르다는 것을 늘 마주합니다. 그래서 연세척병원은 치료에 앞서 \'정확한 진단\'을 가장 중요하게 생각합니다.',
      '저희는 무리한 치료보다 환자에게 꼭 필요한 치료를 우선합니다. 비수술적 방법으로 호전될 수 있다면 그 방법을 먼저 권해 드리고, 수술이 필요한 경우에도 몸의 부담을 줄이기 위해 절개를 최소화하는 양방향척추내시경(UBE) 등 최소침습 치료를 지향합니다.',
      '무엇보다 환자와의 소통을 소중히 여깁니다. 진단 결과와 치료 과정을 알기 쉽게 설명해 드리고, 치료의 방향을 함께 정해 나가겠습니다. 부산 시민 여러분이 통증에서 벗어나 건강한 일상으로 돌아가실 수 있도록, 정직하고 신중한 진료로 함께하겠습니다.',
      '감사합니다.',
    ],
    signature: '연세척병원 병원장 드림',
  },
  {
    title: '병원 소개',
    image: '/generated/specialty-spine-endoscopy.png',
    imageAlt: '양방향척추내시경 장비와 척추 영상',
    paragraphs: [
      '연세척병원은 부산 부산진구 당감동에 자리한 척추·관절 중점 병원입니다. 신경외과와 정형외과 전문의가 함께 진료하며, 허리디스크·목디스크·척추관협착증 등 척추 질환부터 무릎·어깨 등 관절 질환까지 폭넓게 살핍니다.',
      '저희는 통증의 원인을 정확히 찾는 진단을 가장 먼저 생각합니다. 도수치료·주사 치료 같은 비수술적 방법을 우선 검토하고, 수술이 필요한 경우에는 절개를 최소화하는 양방향척추내시경(UBE)을 비롯한 최소침습 치료를 지향합니다. 양방향척추내시경은 두 개의 작은 통로로 내시경과 수술기구를 각각 넣어, 정상 조직과 근육의 손상을 줄이면서 병변에 정밀하게 접근하는 방식입니다.',
      '연세척병원은 진단 결과와 치료 방법을 환자가 충분히 이해하도록 설명하고, 치료 방향을 함께 결정합니다. 부산 시민의 건강한 일상을 위해, 꼭 필요한 치료를 정직하게 제안하는 병원이 되겠습니다.',
    ],
  },
];

const VALUE_ITEMS = [
  {
    title: '정확한 진단을 먼저 생각합니다.',
    desc: '통증은 같아 보여도 원인은 저마다 다릅니다. 연세척병원은 무리한 치료보다 통증의 근본 원인을 정확히 찾는 진단을 우선합니다.',
    icon: <ScanSearch size={25} />,
  },
  {
    title: '비수술적 치료를 먼저 검토합니다.',
    desc: '도수치료·주사 등 보존적 치료로 호전될 수 있다면 그 방법을 먼저 권해 드립니다. 수술이 필요한 경우에도 절개를 최소화하는 양방향척추내시경(UBE) 등 최소침습 치료를 지향합니다.',
    icon: <Syringe size={25} />,
  },
  {
    title: '신경외과·정형외과가 함께 봅니다.',
    desc: '척추와 관절은 두 진료과의 시각이 함께 필요한 경우가 많습니다. 신경외과와 정형외과 전문의가 협진하여 환자에게 맞는 치료 방향을 찾습니다.',
    icon: <Route size={25} />,
  },
  {
    title: '충분히 설명하고 함께 결정합니다.',
    desc: '진단 결과와 치료 과정을 알기 쉽게 설명해 드리고, 치료의 방향을 환자와 함께 정해 나갑니다.',
    icon: <Handshake size={25} />,
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-white">
      <SubHero
        title="병원소개"
        subtitle="절개를 최소화한 양방향척추내시경(UBE)을 중심으로, 부산에서 척추와 관절을 함께 살피는 중점 병원입니다."
        path={[{ name: '병원소개', href: '/about' }, { name: '연세척병원 소개' }]}
        bgImage="/generated/hero-hospital-exterior.png"
      />

      <main className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="space-y-20 md:space-y-28">
            {INTRO_SECTIONS.map((section) => (
              <section
                key={section.title}
                className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:items-center lg:gap-16"
              >
                <ScrollReveal variant="image" className={`relative overflow-hidden rounded-lg bg-slate-100 shadow-[0_28px_70px_-44px_rgba(15,29,54,0.45)] ${
                  section.title === '병원 소개' ? 'lg:order-2' : ''
                }`}>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={section.image}
                      alt={section.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/55 via-navy-950/12 to-transparent" />
                  </div>
                </ScrollReveal>

                <div className={`space-y-7 ${
                  section.title === '병원 소개' ? 'lg:order-1' : ''
                }`}>
                  <ScrollReveal className="space-y-4" delay={0.08}>
                    <h3 className="text-3xl font-black leading-tight tracking-tight text-ink md:text-4xl">
                      {section.title}
                    </h3>
                    <div className="h-1 w-14 rounded-full bg-primary" />
                  </ScrollReveal>

                  <ScrollReveal className="space-y-5 text-[17px] font-medium leading-[1.9] text-ink-sub md:text-lg" delay={0.16}>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </ScrollReveal>

                  {section.signature ? (
                    <ScrollReveal className="border-t border-slate-100 pt-6 text-right text-lg font-black tracking-tight text-ink" delay={0.24}>
                      {section.signature}
                    </ScrollReveal>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </div>

        <section className="border-y border-slate-100 bg-slate-50/70 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-end">
              <div className="space-y-5">
                <h2 className="text-4xl font-black leading-tight tracking-tight text-ink md:text-5xl">
                  병원이 지키는 가치
                </h2>
              </div>
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-ink-sub lg:justify-self-end">
                연세척병원은 진료의 속도보다 정확함을, 치료의 크기보다 꼭 필요한 방향을 먼저 생각합니다.
              </p>
            </ScrollReveal>

            <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-[0_30px_80px_-58px_rgba(15,29,54,0.45)]">
              {VALUE_ITEMS.map((item, index) => (
                <ScrollReveal
                  key={item.title}
                  className="border-b border-slate-100 last:border-b-0"
                  delay={index * 0.08}
                  amount={0.16}
                >
                  <article className="group grid grid-cols-1 gap-5 px-6 py-7 md:grid-cols-[76px_minmax(0,0.72fr)_minmax(0,1fr)] md:items-center md:gap-7 md:px-8 md:py-8">
                    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-primary-light text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="text-2xl font-black leading-snug tracking-tight text-ink">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-[17px] font-medium leading-relaxed text-ink-sub">
                      {item.desc}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

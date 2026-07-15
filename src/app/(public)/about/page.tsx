import Image from 'next/image';
import { HeartPulse, Stethoscope, UserCheck, Zap } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import SubHero from '@/components/SubHero';
import TreatmentStepGraph from '@/components/TreatmentStepGraph';

interface DirectorCutout {
  name: string;
  image: string;
  alt: string;
  figureClassName: string;
  labelClassName: string;
  imageClassName?: string;
}

interface IntroSection {
  title: string;
  image?: string;
  imageAlt?: string;
  directors?: DirectorCutout[];
  paragraphs: string[];
  signature?: string;
}

const INTRO_SECTIONS: IntroSection[] = [
  {
    title: '병원장 인사말',
    directors: [
      {
        name: '이남 병원장',
        image: '/generated/doctors-lineup/lee-nam.png',
        alt: '이남 병원장',
        figureClassName: 'left-[35%] top-[1%] z-20 h-[145%] w-[64%]',
        labelClassName: 'left-[35%]',
      },
      {
        name: '김동한 병원장',
        image: '/generated/doctors-lineup/kim-dong-han.png',
        alt: '김동한 병원장',
        figureClassName: 'left-[65%] top-[-2%] z-10 h-[156%] w-[68%]',
        labelClassName: 'left-[65%]',
        imageClassName: 'scale-x-[-1]',
      },
    ],
    paragraphs: [
      '연세척병원은 환자마다 각기 다른 통증의 원인과 생활 환경을 세심하게 고려하여 **정확한 진단**을 내리는 것을 최우선으로 삼고 있습니다.',
      '무리한 접근보다는 환자에게 꼭 필요한 **비수술적 치료를 먼저** 권해 드리며, 수술이 불가피한 경우에도 **양방향척추내시경(UBE)**과 같은 **최소침습 방식**으로 신체적 부담을 최소화하고자 합니다.',
      '아울러 진단 결과와 치료 과정을 알기 쉽게 설명하고 환자와 함께 치료 방향을 결정하는 **열린 소통**을 바탕으로, 부산 시민 여러분이 통증에서 벗어나 **건강한 일상**을 되찾으실 수 있도록 정직하고 신중하게 진료하겠습니다.',
    ],
    signature: '연세척병원장 이남, 김동한 드림',
  },
  {
    title: '병원 소개',
    image: '/generated/specialty-spine-endoscopy.png',
    imageAlt: '양방향척추내시경 장비와 척추 영상',
    paragraphs: [
      '연세척병원은 부산 부산진구 당감동에 자리한 **척추·관절 중점 병원**입니다. **신경외과와 정형외과 전문의**가 함께 진료하며, 허리디스크·목디스크·척추관협착증 등 척추 질환부터 무릎·어깨 등 관절 질환까지 폭넓게 살핍니다.',
      '저희는 통증의 원인을 정확히 찾는 **진단을 가장 먼저** 생각합니다. 도수치료·주사 치료 같은 **비수술적 방법을 우선** 검토하고, 수술이 필요한 경우에는 절개를 최소화하는 **양방향척추내시경(UBE)**을 비롯한 최소침습 치료를 지향합니다.',
      '연세척병원은 진단 결과와 치료 방법을 환자가 충분히 이해하도록 설명하고, **치료 방향을 함께 결정**합니다. 부산 시민의 건강한 일상을 위해, **꼭 필요한 치료를 정직하게** 제안하는 병원이 되겠습니다.',
    ],
  },
];

function renderRichText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-bold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

const VALUE_ITEMS = [
  {
    title: '시술부터 수술까지!',
    desc: '대학병원 출신 신경외과·정형외과 전문의의 넓은 치료영역',
    icon: <Stethoscope size={26} />,
  },
  {
    title: '일대일 맞춤 치료',
    desc: '분야별 숙련의가 맞춤 치료 제안',
    icon: <UserCheck size={26} />,
  },
  {
    title: '올바른 사후관리',
    desc: '재활치료센터 운영, 생활습관 지도 등 치료의 처음과 끝까지!',
    icon: <HeartPulse size={26} />,
  },
  {
    title: '원스톱 진료시스템',
    desc: '내원 당일 검사, 시술까지 가능한 One stop care system',
    icon: <Zap size={26} />,
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-white">
      <SubHero
        title="병원소개"
        subtitle={'절개를 최소화한 양방향척추내시경(UBE)을 중심으로,\n부산에서 척추와 관절을 함께 살피는 중점 병원입니다.'}
        path={[{ name: '병원소개', href: '/about' }, { name: '연세척병원 소개' }]}
        bgImage="/generated/hero-hospital-exterior.png"
      />

      <main className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:py-28">
          <div className="space-y-16 md:space-y-28">
            {INTRO_SECTIONS.map((section) => (
              <section
                key={section.title}
                className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:items-center lg:gap-16"
              >
                <ScrollReveal variant="image" className={`relative ${
                  section.directors ? '' : 'overflow-hidden rounded-lg bg-slate-100 shadow-[0_28px_70px_-44px_rgba(15,29,54,0.45)]'
                } ${section.title === '병원 소개' ? 'lg:order-2' : ''}`}>
                  {section.directors ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src="/ys-logo-bg.png"
                        alt=""
                        aria-hidden="true"
                        width={1551}
                        height={1545}
                        className="pointer-events-none absolute left-1/2 top-[6%] h-[78%] w-auto -translate-x-1/2 select-none object-contain opacity-[0.03] brightness-0"
                      />

                      {section.directors.map((director) => (
                        <div
                          key={director.name}
                          className={`absolute -translate-x-1/2 ${director.figureClassName}`}
                        >
                          <Image
                            src={director.image}
                            alt={director.alt}
                            fill
                            sizes="(min-width: 1024px) 24vw, 46vw"
                            className={`object-contain object-top drop-shadow-[0_22px_30px_rgba(15,29,54,0.16)] ${director.imageClassName ?? ''}`}
                          />
                        </div>
                      ))}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[30%] bg-gradient-to-t from-white via-white/85 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={section.image ?? ''}
                        alt={section.imageAlt ?? section.title}
                        fill
                        sizes="(min-width: 1024px) 48vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/55 via-navy-950/12 to-transparent" />
                    </div>
                  )}
                </ScrollReveal>

                <div className={`space-y-7 ${
                  section.title === '병원 소개' ? 'lg:order-1' : ''
                }`}>
                  <ScrollReveal className="space-y-4" delay={0.08}>
                  <h3 className="break-keep text-[28px] font-black leading-[1.25] tracking-tight text-ink sm:text-3xl md:text-4xl">
                      {section.title}
                    </h3>
                    <div className="h-1 w-14 rounded-full bg-primary" />
                  </ScrollReveal>

                  <ScrollReveal className="space-y-5 text-[15px] font-medium leading-[1.8] text-ink-sub sm:space-y-6 sm:text-[17px] md:text-lg md:leading-[2]" delay={0.16}>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="break-keep">{renderRichText(paragraph)}</p>
                    ))}
                  </ScrollReveal>

                  {section.signature ? (
                    <ScrollReveal className="break-keep border-t border-slate-100 pt-5 text-right text-base font-black tracking-tight text-ink sm:pt-6 sm:text-lg" delay={0.24}>
                      {section.signature}
                    </ScrollReveal>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </div>

        <section className="border-t border-slate-100 bg-white px-4 py-14 sm:px-6 sm:py-16 md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mx-auto mb-9 max-w-3xl text-center sm:mb-12 md:mb-14">
              <p className="font-montserrat text-sm font-extrabold uppercase tracking-[0.34em] text-primary/75">
                Mission &amp; Vision
              </p>
              <h2 className="mt-4 break-keep text-[30px] font-black leading-[1.3] tracking-tight text-ink sm:mt-5 sm:text-4xl md:text-5xl">
                연세척의 단계적 치료 원칙
              </h2>
              <p className="mx-auto mt-4 max-w-2xl break-keep text-[15px] font-medium leading-[1.75] text-ink-sub sm:mt-5 sm:text-lg sm:leading-relaxed">
                척추·관절 치료는 처음부터 끝까지 환자 상태에 맞춰 필요한 방향을 차근히 확인합니다.
              </p>
            </ScrollReveal>

            <TreatmentStepGraph />
          </div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50/70 px-4 py-14 sm:px-6 sm:py-16 md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mx-auto mb-9 max-w-3xl text-center sm:mb-12 md:mb-14">
              <p className="font-montserrat text-sm font-extrabold uppercase tracking-[0.34em] text-primary/75">
                Core Values
              </p>
              <h2 className="mt-4 break-keep text-[30px] font-black leading-[1.3] tracking-tight text-ink sm:mt-5 sm:text-4xl md:text-5xl">
                연세척병원이 지키는 가치
              </h2>
              <p className="mx-auto mt-4 max-w-2xl break-keep text-[15px] font-medium leading-[1.75] text-ink-sub sm:mt-5 sm:text-lg sm:leading-relaxed">
                연세척병원은 진료의 속도보다 정확함을, 치료의 크기보다 꼭 필요한 방향을 먼저 생각합니다.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {VALUE_ITEMS.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.1} amount={0.2}>
                  <article className="group relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-56px_rgba(15,29,54,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-[0_42px_90px_-52px_rgba(40,74,165,0.55)] sm:p-7 md:p-9">
                    <span className="pointer-events-none absolute -right-2 -top-3 font-montserrat text-[82px] font-black leading-none text-primary/[0.05] transition-colors duration-500 group-hover:text-primary/[0.09] sm:-top-5 sm:text-[102px] md:text-[112px]">
                      0{index + 1}
                    </span>

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      {item.icon}
                    </div>

                    <h3 className="relative mt-6 break-keep text-xl font-black tracking-tight text-ink sm:mt-7 sm:text-2xl md:text-[1.7rem]">
                      {item.title}
                    </h3>
                    <p className="relative mt-3 break-keep text-[15px] font-medium leading-[1.7] text-ink-sub sm:mt-3.5 sm:text-[16px] sm:leading-relaxed md:text-[17px]">
                      {item.desc}
                    </p>

                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
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

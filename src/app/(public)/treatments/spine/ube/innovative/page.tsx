import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '질환별 양방향 척추내시경(UBE) 치료 | 부산 척추센터',
  description:
    '허리디스크·척추관 협착증·목디스크에서 양방향 척추내시경(UBE)을 어떻게 검토하는지, 진단부터 회복까지 질환별 치료 방향을 안내합니다.',
  path: '/treatments/spine/ube/innovative',
  image: '/generated/ube/ube-innovative-hero-spine-3d.png',
});

const conditions = [
  {
    no: '01',
    title: '허리디스크',
    medicalName: '요추 추간판 탈출증',
    summary: '탈출한 디스크가 신경을 압박해 허리 통증과 다리 저림·당김을 일으킬 수 있습니다.',
    approach:
      'MRI에서 신경 압박 위치와 디스크의 크기·방향을 확인한 뒤, 보존적 치료에도 증상이 지속되면 내시경으로 탈출한 디스크를 선택적으로 제거하는 방법을 검토합니다.',
    image: '/generated/ube/ube-condition-lumbar-disc.png',
    alt: '허리디스크로 신경이 압박된 요추 모형',
    href: '/treatments/spine/disc',
  },
  {
    no: '02',
    title: '척추관 협착증',
    medicalName: '요추 척추관 협착증',
    summary: '신경이 지나가는 통로가 좁아지며 걷다가 다리가 저리고 쉬어야 하는 증상이 나타날 수 있습니다.',
    approach:
      '좁아진 위치와 신경 압박 범위를 영상 검사로 확인하고, 내시경 시야 아래 신경을 누르는 인대나 뼈를 정밀하게 제거해 통로를 넓히는 감압술을 검토합니다.',
    image: '/generated/ube/ube-condition-lumbar-stenosis.png',
    alt: '신경 통로가 좁아진 요추 척추관 협착증 모형',
    href: '/treatments/spine/stenosis',
  },
  {
    no: '03',
    title: '목디스크',
    medicalName: '경추 추간판 탈출증',
    summary: '목의 디스크나 좁아진 신경 통로가 신경을 눌러 목·어깨 통증과 팔 저림을 유발할 수 있습니다.',
    approach:
      '신경 압박의 방향과 척수 상태를 확인하고, 병변 위치와 환자 상태가 적합한 경우 뒤쪽에서 접근해 신경 압박을 줄이는 치료를 검토합니다.',
    image: '/generated/ube/ube-condition-cervical-disc.png',
    alt: '목디스크로 신경이 압박된 경추 모형',
    href: '/treatments/spine/neck-disc',
  },
];

const decisionSteps = [
  {
    no: '01',
    title: '증상 확인',
    desc: '통증 위치, 저림, 근력 저하와 보행 불편 등 일상에 미치는 영향을 살핍니다.',
  },
  {
    no: '02',
    title: '영상 진단',
    desc: 'MRI·X-ray 등으로 병변의 위치와 신경 압박 정도, 척추 안정성을 확인합니다.',
  },
  {
    no: '03',
    title: '치료 선택',
    desc: '비수술 치료 경과와 검사 결과를 함께 보고 UBE 적용 여부와 접근법을 결정합니다.',
  },
  {
    no: '04',
    title: '회복 관리',
    desc: '치료 후 보행 상태를 확인하고 환자별 회복 단계에 맞춰 일상 복귀를 돕습니다.',
  },
];

const principles = [
  '질환 이름만으로 수술을 결정하지 않습니다.',
  '증상과 MRI 소견이 일치하는지 먼저 확인합니다.',
  '약물·주사·재활 등 보존적 치료의 경과를 함께 봅니다.',
  '불안정성이나 변형이 있으면 다른 수술법이 필요할 수 있습니다.',
];

export default function InnovativeSurgeryPage() {
  return (
    <div className="flex flex-col bg-white">
      <main className="w-full">
        <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
          <div className="relative isolate mx-auto flex min-h-[230px] items-center overflow-hidden rounded-[1.35rem] bg-[#f2f6fb] shadow-[0_24px_60px_-40px_rgba(15,29,54,0.4)] ring-1 ring-navy-900/5 sm:min-h-[300px] sm:rounded-[2.25rem] md:min-h-[360px]">
            <Image
              src="/generated/ube/ube-innovative-hero-spine-3d.png"
              alt="신경 압박 부위가 표시된 3D 요추 모형"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-5 py-9 sm:px-9 sm:py-12 md:px-12">
              <ScrollReveal className="max-w-3xl" variant="slide-right">
                <h1 className="break-keep text-display tracking-tight text-navy-900">
                  질환별 UBE 치료
                </h1>
                <p className="mt-3 max-w-xl break-keep text-[14px] font-medium leading-[1.65] text-slate-600 sm:text-base md:text-[17px] md:text-slate-500">
                  허리디스크·척추관 협착증·목디스크의 신경 압박 위치와 범위를 확인해
                  환자에게 필요한 양방향 척추내시경 치료를 선별합니다.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 md:py-32">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mx-auto max-w-4xl text-center">
              <h2 className="break-keep text-h2 text-ink">
                병명보다 중요한 것은
                <br className="hidden sm:block" />
                신경이 눌린 위치와 원인입니다.
              </h2>
              <p className="mx-auto mt-6 max-w-3xl break-keep text-body-lg text-ink-sub">
                UBE는 관찰용 내시경과 수술 기구를 각각 다른 통로로 넣어 병변을 확인하는 최소침습 수술입니다.
                같은 질환이라도 병변의 방향, 범위, 척추의 안정성에 따라 적용 방법은 달라질 수 있습니다.
              </p>
            </ScrollReveal>

            <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:gap-5">
              {conditions.map((condition, index) => (
                <ScrollReveal key={condition.title} delay={index * 0.08} variant="soft-rise" className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-45px_rgba(15,29,54,0.35)] transition duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_30px_80px_-40px_rgba(40,74,165,0.4)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EEF3FB]">
                      <Image
                        src={condition.image}
                        alt={condition.alt}
                        fill
                        sizes="(min-width: 1024px) 31vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 font-montserrat text-sm font-bold text-white shadow-lg">
                        {condition.no}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <p className="text-sm font-bold text-primary">{condition.medicalName}</p>
                      <h3 className="mt-2 text-h3 text-ink">{condition.title}</h3>
                      <p className="mt-4 break-keep text-body text-ink-sub">{condition.summary}</p>
                      <div className="my-5 h-px bg-slate-200" />
                      <p className="break-keep text-[15px] font-medium leading-[1.75] text-slate-600">{condition.approach}</p>
                      <Link
                        href={condition.href}
                        className="mt-6 inline-flex items-center gap-2 self-start text-sm font-bold text-primary transition-colors hover:text-primary-dark"
                      >
                        질환 자세히 보기
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#071A3D] px-5 py-20 text-white sm:px-6 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-20">
            <ScrollReveal variant="slide-from-left">
              <h2 className="break-keep text-h2 text-white">
                넓게 절개하기보다,
                <br />
                필요한 부위를 정밀하게
              </h2>
              <p className="mt-6 break-keep text-body-lg text-white/75">
                두 개의 작은 통로를 통해 한쪽으로는 병변을 확대해 보고, 다른 한쪽으로는 수술 기구를 움직입니다.
                신경 압박의 원인을 직접 확인하면서 필요한 범위의 감압을 목표로 합니다.
              </p>
              <Link
                href="/treatments/spine/ube"
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-navy-950"
              >
                UBE 수술 원리 보기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </ScrollReveal>

            <ScrollReveal variant="slide-from-right" delay={0.08}>
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/10 sm:translate-y-8">
                  <Image
                    src="/generated/ube/ube-surgery-closeup-v2.webp"
                    alt="양방향 척추내시경 수술 기구를 조작하는 장면"
                    fill
                    sizes="(min-width: 1024px) 28vw, 48vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent p-5 pt-16">
                    <p className="text-sm font-bold text-cyan-200">VIEWING PORTAL</p>
                    <p className="mt-1 font-bold">확대된 내시경 시야</p>
                  </div>
                </div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/10">
                  <Image
                    src="/generated/ube/ube-step-decompression-v2.png"
                    alt="내시경으로 신경 압박 부위를 감압하는 장면"
                    fill
                    sizes="(min-width: 1024px) 28vw, 48vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent p-5 pt-16">
                    <p className="text-sm font-bold text-cyan-200">WORKING PORTAL</p>
                    <p className="mt-1 font-bold">독립적인 기구 움직임</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-[#F4F7FC] px-5 py-20 sm:px-6 md:py-32">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <h2 className="break-keep text-h2 text-ink">진단부터 회복까지, 네 단계로 확인합니다.</h2>
              <p className="mx-auto mt-5 max-w-2xl break-keep text-body-lg text-ink-sub">
                UBE가 모든 척추 질환의 정답은 아닙니다. 증상과 검사 결과를 함께 확인해 적합한 치료를 선택합니다.
              </p>
            </ScrollReveal>

            <div className="relative mt-12 grid gap-4 md:mt-16 md:grid-cols-4 md:gap-0">
              <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-primary/25 md:block" />
              {decisionSteps.map((step, index) => (
                <ScrollReveal key={step.no} delay={index * 0.08} className="relative">
                  <article className="relative h-full rounded-2xl border border-slate-200 bg-white p-6 md:mx-2 md:border-0 md:bg-transparent md:p-4 md:text-center">
                    <span className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#F4F7FC] bg-primary font-montserrat text-sm font-bold text-white shadow-[0_10px_30px_rgba(40,74,165,0.3)]">
                      {step.no}
                    </span>
                    <h3 className="mt-5 text-h4 text-ink">{step.title}</h3>
                    <p className="mt-3 break-keep text-[15px] font-medium leading-[1.75] text-ink-sub">{step.desc}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 md:py-32">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_90px_-60px_rgba(15,29,54,0.45)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <ScrollReveal variant="image" className="relative min-h-[320px] bg-slate-100 lg:min-h-[560px]">
              <Image
                src="/generated/ube/ube-step-diagnosis-mri.webp"
                alt="척추 MRI 영상을 확인하며 진단하는 의료진"
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
            </ScrollReveal>
            <ScrollReveal className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <h2 className="break-keep text-h2 text-ink">수술 여부보다 먼저, 꼭 필요한 치료인지 살핍니다.</h2>
              <div className="mt-7 space-y-4">
                {principles.map((principle) => (
                  <div key={principle} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                      <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    <p className="break-keep text-base font-semibold leading-[1.7] text-ink-sub">{principle}</p>
                  </div>
                ))}
              </div>
              <p className="mt-7 break-keep rounded-xl bg-slate-50 p-5 text-sm font-medium leading-[1.7] text-slate-600">
                실제 수술 방법과 회복 기간은 환자의 나이, 기저질환, 병변 범위와 수술 부위에 따라 달라질 수 있습니다.
                전문의 진료와 영상 검사 후 개별적으로 안내합니다.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-6 md:pb-32">
          <ScrollReveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-[#3F6DD1] p-7 text-white shadow-blue-glow sm:p-10 lg:flex-row lg:items-center lg:p-14">
            <div>
              <p className="text-sm font-bold text-cyan-100">연세척병원 척추내시경센터</p>
              <h2 className="mt-3 break-keep text-h3 text-white">내 증상에 UBE 치료가 맞는지 확인해 보세요.</h2>
              <p className="mt-3 max-w-2xl break-keep text-base font-medium leading-[1.7] text-white/80">
                검사 자료와 현재 증상을 바탕으로 신경외과 전문의가 적용 가능 여부를 안내합니다.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-base font-bold text-primary transition hover:bg-cyan-50"
              >
                진료 예약하기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center rounded-lg border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white transition hover:bg-white/20"
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

import type { Metadata } from 'next';
import Image from 'next/image';
import { Check } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import {
  KneeArthroscopyMedia,
  KneeCartilageTreatmentSteps,
  KneeDiseaseExplorer,
} from '@/components/knee-arthroscopy';
import KneeArthroscopyHero from '@/components/knee-arthroscopy/KneeArthroscopyHero';
import KneeDoctorFeature from '@/components/knee-arthroscopy/KneeDoctorFeature';
import KneeParallaxBackground from '@/components/knee-arthroscopy/KneeParallaxBackground';

export const metadata: Metadata = {
  title: '무릎관절내시경 | 연세척병원 관절센터',
  description:
    '무릎관절내시경의 원리와 주요 적용 질환, 실제 관절경 화면, 연골 치료 과정과 진료 흐름을 안내합니다.',
};

const KNEE_ASSET_ROOT = '/images/treatments/joint/knee';
const ARTHROSCOPY_ASSET_ROOT = '/images/treatments/joint/knee-arthroscopy';

const overviewBenefits = [
  {
    title: '관절 내부를 직접 확인',
    description:
      '반월상연골과 관절연골, 인대와 활막의 상태를 확대된 화면으로 세밀하게 살펴봅니다.',
  },
  {
    title: '작은 절개로 접근',
    description:
      '가느다란 관절경과 미세 수술 기구가 들어갈 수 있는 작은 통로로 관절 안쪽에 접근합니다.',
  },
  {
    title: '확인과 치료를 연결',
    description:
      '관절 안에서 확인한 병변의 위치와 범위에 맞춰 계획된 치료를 정밀하게 진행합니다.',
  },
];

const candidates = [
  '검사 이후에도 무릎 통증의 원인이 분명하지 않고 불편이 이어지는 경우',
  '무릎을 굽히고 펼 때 걸리거나 갑자기 움직임이 막히는 경우',
  '무릎이 반복해서 붓고 특정 동작이나 각도에서 통증이 심해지는 경우',
  '약물·주사·운동치료 후에도 통증과 기능 제한이 계속되는 경우',
  '외상 이후 무릎이 빠지는 듯한 불안정감이나 힘 빠짐이 반복되는 경우',
  '무릎을 끝까지 펴거나 굽기 어렵고 관절 운동 범위가 점차 줄어드는 경우',
];

const treatmentJourney = [
  {
    title: '상담과 정밀 평가',
    description:
      '현재 증상과 움직임을 살피고 기존 영상검사를 함께 검토해 관절내시경의 필요성과 치료 방향을 정합니다.',
    image: `${KNEE_ASSET_ROOT}/knee-arthroscopy-process-preparation.webp`,
    alt: '무릎 관절내시경 수술 전 상태와 치료 계획을 확인하는 모습',
  },
  {
    title: '관절 내부 확인과 치료',
    description:
      '관절경으로 병변의 위치와 범위를 직접 확인하면서 증상과 관련된 부위에 계획된 치료를 진행합니다.',
    image: `${KNEE_ASSET_ROOT}/knee-arthroscopy-process-treatment-v3.webp`,
    alt: '무릎 관절내시경으로 병변 부위를 치료하는 모습',
  },
  {
    title: '사후 관리와 재활',
    description:
      '수술 내용과 무릎 상태에 맞춰 보행, 관절 운동 범위와 근력 회복 과정을 단계적으로 관리합니다.',
    image: `${KNEE_ASSET_ROOT}/knee-arthroscopy-process-recovery-v3.webp`,
    alt: '무릎 관절내시경 수술 후 회복과 재활 상태를 확인하는 모습',
  },
];

const sectionTitleClass = 'break-keep text-h2 tracking-tight text-ink';

export default function KneeArthroscopyPage() {
  return (
    <div className="flex flex-col overflow-x-clip bg-white">
      <KneeArthroscopyHero />

      <main className="w-full">
        <section className="mx-auto flex w-full max-w-7xl flex-col items-start px-5 py-14 text-left sm:px-6 md:items-center md:py-28 md:text-center">
          <ScrollReveal className="mx-auto max-w-5xl">
            <h2 className={sectionTitleClass}>
              무릎 안쪽의 원인을 직접 확인하고,
              <br className="hidden md:block" />
              필요한 치료를 정밀하게 이어갑니다
            </h2>
          </ScrollReveal>

          <ScrollReveal
            variant="image"
            amount={0.16}
            className="mx-auto mt-8 w-full max-w-5xl sm:mt-12"
          >
            <div className="relative overflow-hidden rounded-[1.25rem] border border-slate-100 bg-slate-50 shadow-[0_30px_80px_-48px_rgba(15,29,54,0.55)] sm:rounded-[1.75rem]">
              <Image
                src={`${ARTHROSCOPY_ASSET_ROOT}/knee-arthroscopy-consultation.jpg`}
                alt="연세척병원 의료진이 무릎 관절 모형으로 환자에게 관절 상태를 설명하는 진료 장면"
                width={1920}
                height={1280}
                priority
                sizes="(min-width: 1280px) 1024px, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal className="mx-auto mt-8 max-w-5xl space-y-4 break-keep text-base font-medium leading-[1.8] text-ink-sub sm:mt-12 sm:space-y-5 md:text-lg md:leading-relaxed">
            <p>
              무릎 통증과 걸림은 반월상연골, 관절연골, 인대와 활막 등 여러 구조의
              변화와 연관될 수 있습니다.
            </p>
            <p>
              관절내시경은 작은 절개로 가느다란 카메라를 삽입해 관절 내부를 실시간으로
              확인하고, 진찰과 영상검사에서 얻은 정보를 함께 살피는 치료입니다.
            </p>
            <p>
              병변의 위치와 형태를 직접 확인하면서 증상과 관련된 부위에 계획된 치료를
              진행하고, 주변 정상 조직은 가능한 한 보존합니다.
            </p>
          </ScrollReveal>
        </section>

        <section
          id="knee-arthroscopy-overview"
          className="overflow-hidden bg-white px-5 pb-16 sm:px-6 md:pb-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-9 sm:gap-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-center lg:gap-16">
              <ScrollReveal variant="image" amount={0.18}>
                <div className="group relative aspect-[5/4] overflow-hidden rounded-[1.25rem] border border-slate-100 bg-white shadow-[0_28px_80px_-52px_rgba(15,29,54,0.58)] sm:rounded-[1.75rem]">
                  <Image
                    src={`${ARTHROSCOPY_ASSET_ROOT}/knee-arthroscopy-procedure-v2.png`}
                    alt="관절경 끝이 무릎 관절 안쪽의 연골 손상 부위를 향하는 관절내시경 의료 일러스트"
                    fill
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                  <div
                    aria-hidden
                    className="knee-arthroscopy-procedure-glow pointer-events-none absolute left-[59%] top-[57%] h-8 w-8 rounded-full bg-[radial-gradient(circle,rgba(255,255,215,0.96)_0%,rgba(255,235,112,0.52)_44%,transparent_100%)] blur-[5px] sm:h-10 sm:w-10"
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08} className="lg:py-6">
                <h2 className={sectionTitleClass}>무릎관절내시경이란?</h2>
                <div className="mt-6 space-y-4 break-keep text-base font-medium leading-[1.8] text-ink-sub sm:mt-8 sm:space-y-5 md:text-lg md:leading-relaxed">
                  <p>
                    작은 절개를 통해 가느다란 카메라와 수술 기구를 삽입하고, 관절 내부를
                    실시간 화면으로 확인하는 수술입니다.
                  </p>
                  <p>
                    영상검사와 진찰 결과를 바탕으로 반월상연골, 관절연골, 인대와 활막의
                    상태를 직접 살펴 병변의 위치와 범위를 구체적으로 확인합니다.
                  </p>
                  <p>
                    확인된 병변 가운데 증상과 관련된 부위에 계획된 치료를 진행하고, 주변의
                    정상 조직은 가능한 한 보존합니다.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-3">
              {overviewBenefits.map((item, index) => (
                <ScrollReveal
                  key={item.title}
                  delay={0.08 + index * 0.08}
                  variant="metric"
                  amount={0.38}
                  className="h-full"
                >
                  <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-5 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-blue-glow sm:rounded-2xl md:min-h-[220px] md:px-6 md:py-8">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-light opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                    />

                    <div className="relative">
                      <h3 className="text-h4 leading-snug text-ink">{item.title}</h3>
                      <p className="mt-3 break-keep text-[15px] font-semibold leading-[1.7] text-ink-sub sm:mt-5 sm:text-base sm:leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="relative mt-5 h-px w-full bg-slate-200 sm:mt-8">
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

        <section className="relative isolate overflow-hidden bg-[#071A3D] px-5 py-16 text-white sm:px-6 md:py-24">
          <KneeParallaxBackground
            src={`${ARTHROSCOPY_ASSET_ROOT}/arthroscopy-video-poster.png`}
            position="center"
          />
          <div className="relative mx-auto max-w-4xl">
            <ScrollReveal className="text-center">
              <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[13px] font-bold tracking-tight text-cyan-200 sm:text-sm">
                MRI의 한계
              </span>
              <h2 className="mt-6 break-keep text-h2 tracking-tight text-white">
                분명 계속 아픈데…
                <br className="hidden sm:block" /> MRI 결과는 &lsquo;정상&rsquo;이라고요?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl break-keep text-lg font-bold leading-[1.7] text-white md:text-xl">
                정밀 검사의 대명사 MRI,
                <br /> 하지만 완벽하지는 않습니다.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="soft-rise" className="mt-10 sm:mt-14">
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md sm:p-9 md:p-11">
                <p className="break-keep text-base font-medium leading-[1.9] text-white/85 sm:text-lg sm:leading-[1.9]">
                  MRI는 뛰어난 검사 장비이지만, 무릎 관절 내부의{' '}
                  <b className="font-bold text-cyan-200">아주 미세한 연골 손상</b>,{' '}
                  <b className="font-bold text-cyan-200">얇게 찢어진 인대</b>,{' '}
                  <b className="font-bold text-cyan-200">슬개골의 어긋남</b>, 혹은 관절 내
                  떠돌아다니는 <b className="font-bold text-cyan-200">작은 이물질(유리체)</b> 등은
                  영상의학적 검사만으로는 명확히 잡아내기 어려울 수 있습니다.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <KneeDiseaseExplorer />

        <KneeCartilageTreatmentSteps />

        <KneeArthroscopyMedia />

        <KneeDoctorFeature />

        <section className="overflow-hidden bg-white px-5 py-16 sm:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="max-w-4xl">
              <h2 className={sectionTitleClass}>
                이런 증상이 반복된다면
                <br className="hidden sm:block" /> 관절 상태를 더 세밀하게 살펴봅니다
              </h2>
            </ScrollReveal>

            <div className="mt-8 grid grid-cols-1 border-y border-slate-200 sm:mt-12 md:grid-cols-2">
              {candidates.map((candidate, index) => (
                <ScrollReveal key={candidate} delay={index * 0.04}>
                  <div
                    className={`group relative grid min-h-[92px] grid-cols-[40px_minmax(0,1fr)] items-center gap-3 overflow-hidden border-b border-slate-200 px-1 py-4 sm:min-h-[116px] sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-4 sm:px-5 sm:py-6 md:border-r ${
                      index % 2 === 1 ? 'md:border-r-0' : ''
                    } ${index >= candidates.length - 2 ? 'md:border-b-0' : ''}`}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-navy-900 via-primary-dark to-primary transition-transform duration-500 ease-out group-hover:scale-x-100"
                    />
                    <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary text-primary transition-colors duration-500 group-hover:border-white group-hover:text-white sm:h-10 sm:w-10">
                      <Check aria-hidden size={19} strokeWidth={2.6} />
                    </span>
                    <p className="relative z-10 break-keep text-[1rem] font-bold leading-[1.65] text-ink transition-colors duration-500 group-hover:text-white sm:text-lg sm:leading-relaxed">
                      {candidate}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F5F7FA] px-5 py-16 sm:px-6 md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mx-auto max-w-4xl text-center">
              <h2 className={sectionTitleClass}>
                상담부터 회복까지
                <br className="hidden sm:block" /> 이어지는 관절내시경 진료 과정
              </h2>
              <p className="mx-auto mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
                현재 상태를 충분히 확인하고, 치료 내용에 맞는 회복 과정을 함께 설계합니다.
              </p>
            </ScrollReveal>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-3">
              {treatmentJourney.map((step, index) => (
                <ScrollReveal
                  key={step.title}
                  delay={index * 0.08}
                  variant="soft-rise"
                  className="h-full"
                >
                  <article className="group h-full overflow-hidden rounded-lg bg-white shadow-[0_18px_60px_-46px_rgba(15,29,54,0.58)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_-38px_rgba(40,74,165,0.34)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        sizes="(min-width: 1024px) 31vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-navy-950/22 via-transparent to-transparent"
                      />
                    </div>
                    <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-8 sm:pt-7">
                      <span className="font-montserrat text-xl font-bold text-primary sm:text-2xl">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-3 text-h4 leading-snug text-ink sm:mt-5">
                        {step.title}
                      </h3>
                      <p className="mt-3 break-keep text-body text-ink-sub sm:mt-4 sm:text-[17px] sm:leading-relaxed">
                        {step.description}
                      </p>
                    </div>
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

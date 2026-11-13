import type { Metadata } from 'next';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import {
  KneeArthroscopyMedia,
  KneeCartilageTreatmentSteps,
  KneeDiseaseExplorer,
} from '@/components/knee-arthroscopy';
import KneeArthroscopyHero from '@/components/knee-arthroscopy/KneeArthroscopyHero';
import KneeDoctorFeature from '@/components/knee-arthroscopy/KneeDoctorFeature';
import { createPageMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { buildProcedurePageStructuredData } from '@/lib/structuredData';

export const metadata: Metadata = createPageMetadata({
  title: '무릎관절내시경 | 부산 관절 치료',
  description:
    '부산 연세척병원 관절센터의 무릎관절내시경 안내. 반월상연골·관절연골 등 주요 적용 질환과 실제 관절경 화면, 연골 치료 과정과 진료 흐름을 안내합니다.',
  path: '/treatments/joint/knee-arthroscopy',
  image: '/images/treatments/joint/knee-arthroscopy/knee-arthroscopy-consultation.jpg',
});

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

// 아래 값은 모두 이 페이지 본문에 이미 적혀 있는 내용입니다.
// 본문에 없는 수치나 효과를 여기에 추가하지 마십시오.
const structuredData = buildProcedurePageStructuredData({
  page: {
    name: '무릎관절내시경',
    description:
      '부산 연세척병원 관절센터의 무릎관절내시경 안내. 반월상연골·관절연골 등 주요 적용 질환과 실제 관절경 화면, 연골 치료 과정과 진료 흐름을 안내합니다.',
    path: '/treatments/joint/knee-arthroscopy',
    image: '/images/treatments/joint/knee-arthroscopy/knee-arthroscopy-consultation.jpg',
  },
  procedure: {
    name: '무릎관절내시경',
    alternateName: [
      '무릎 관절내시경',
      '무릎 관절경',
      '슬관절 관절내시경',
      'Knee Arthroscopy',
    ],
    bodyLocation: '무릎 관절',
    specialty: 'https://schema.org/Musculoskeletal',
    howPerformed:
      '가느다란 관절경과 미세 수술 기구가 들어갈 수 있는 작은 통로로 관절 안쪽에 접근합니다. 반월상연골과 관절연골, 인대와 활막의 상태를 확대된 화면으로 실시간 확인하고, 진찰과 영상검사에서 얻은 정보를 함께 살펴 병변의 위치와 범위에 맞춰 계획된 치료를 진행합니다.',
    followup:
      '수술 내용과 무릎 상태에 맞춰 보행, 관절 운동 범위와 근력 회복 과정을 단계적으로 관리합니다.',
    indications: candidates,
  },
  breadcrumb: [
    { name: '홈', path: '/' },
    { name: '진료과목', path: '/treatments' },
    { name: '무릎 관절', path: '/treatments/joint/knee' },
    { name: '무릎관절내시경', path: '/treatments/joint/knee-arthroscopy' },
  ],
});

const sectionTitleClass = 'break-keep text-h2 tracking-tight text-ink';

export default function KneeArthroscopyPage() {
  return (
    <div className="flex flex-col overflow-x-clip bg-white">
      <JsonLd data={structuredData} />
      <KneeArthroscopyHero />

      <main className="w-full">
        <section className="px-5 py-12 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-center md:gap-16">
            <ScrollReveal>
              <h2 className={sectionTitleClass}>
                무릎 안쪽을 살피는<br />관절내시경 치료
              </h2>
              <p className="mt-6 max-w-xl break-keep text-base leading-[1.8] text-ink-sub md:text-lg">
                무릎 통증과 걸림은 반월상연골, 관절연골, 인대와 활막 등 여러 구조의
                변화와 연관될 수 있습니다. 관절내시경으로 병변의 위치와 형태를
                직접 살피고, 증상과 관련된 부위에 계획된 치료를 진행합니다.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={`${ARTHROSCOPY_ASSET_ROOT}/knee-arthroscopy-consultation.jpg`}
                  alt="연세척병원 의료진이 무릎 관절 모형으로 환자에게 관절 상태를 설명하는 진료 장면"
                  width={1920}
                  height={1280}
                  sizes="(min-width: 1280px) 620px, (min-width: 768px) 50vw, 100vw"
                  className="h-auto w-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section
          id="knee-arthroscopy-overview"
          className="overflow-hidden bg-white px-5 pb-12 sm:px-6 md:pb-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-9 sm:gap-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-center lg:gap-16">
              <ScrollReveal variant="fade-up" amount={0.18}>
                <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-slate-50">
                  <Image
                    src={`${ARTHROSCOPY_ASSET_ROOT}/knee-arthroscopy-procedure-v2.png`}
                    alt="관절경 끝이 무릎 관절 안쪽의 연골 손상 부위를 향하는 관절내시경 의료 일러스트"
                    fill
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="object-cover object-center"
                  />

                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08} className="lg:py-6">
                <h2 className={sectionTitleClass}>무릎관절내시경이란?</h2>
                <div className="mt-6 space-y-4 break-keep text-base font-medium leading-[1.8] text-ink-sub sm:mt-8 sm:space-y-5 md:text-lg md:leading-relaxed">
                  <p>
                    작은 절개를 통해 가느다란 스코프와 수술 기구를 삽입하고, 관절 내부를
                    실시간 화면으로 확인하고 시행하는 수술입니다.
                  </p>
                  <p>
                    영상검사와 진찰 결과를 바탕으로 반월상연골, 관절연골, 인대와 활막의
                    상태를 직접 살펴 병변의 위치와 범위를 구체적으로 확인합니다.
                  </p>
                  <p>
                    확인된 병변 가운데 증상과 관련된 부위에 계획된 치료를 진행하고, 주변의
                    정상 조직은 보존합니다.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-8 grid border-t border-slate-200 md:mt-12 md:grid-cols-3 md:gap-10">
              {overviewBenefits.map((item) => (
                <div key={item.title} className="border-b border-slate-200 py-6 md:border-b-0">
                  <h3 className="text-lg font-semibold text-[#102647]">{item.title}</h3>
                  <p className="mt-3 break-keep text-base leading-[1.8] text-ink-sub">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="knee-mri-heading"
          className="bg-[#F7F8FA] px-5 py-12 sm:px-6 md:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12 lg:gap-20">
              <ScrollReveal>
                <h2
                  id="knee-mri-heading"
                  className="break-keep text-[1.875rem] font-bold leading-[1.4] tracking-tight text-[#102647] sm:text-[2.25rem] lg:text-[2.75rem]"
                >
                  무릎 통증,
                  <br />
                  MRI만으로 설명되지
                  <br />
                  않는 경우가 있습니다.
                </h2>
                <p className="mt-5 max-w-lg break-keep text-base leading-[1.8] text-ink-sub sm:mt-7 md:text-lg">
                  MRI는 무릎 상태를 살피는 중요한 검사입니다.{' '}
                  <br className="hidden lg:block" />
                  통증이 이어진다면 검사 결과와 현재의 증상을
                  함께 살펴봐야 합니다.
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <figure>
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-slate-200">
                    <Image
                      src={`${ARTHROSCOPY_ASSET_ROOT}/mri-room.webp`}
                      alt="MRI 촬영실에서 모니터의 검사 영상을 확인하는 모습"
                      fill
                      sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-[13px] leading-relaxed text-slate-500">
                    연세척병원 MRI 검사실
                  </figcaption>
                </figure>
              </ScrollReveal>
            </div>

            <ScrollReveal className="mt-8 border-t border-slate-300/80 pt-6 sm:mt-10 md:mt-12 md:pt-8">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
                <h3 className="break-keep text-lg font-bold leading-[1.6] text-[#102647] md:text-xl">
                  영상검사로 확인하기
                  <br className="hidden md:block" /> 어려운 부분도 있습니다
                </h3>
                <p className="max-w-3xl break-keep text-base leading-[1.9] text-ink-sub md:text-[17px]">
                  미세한 연골 손상이나 얇게 찢어진 인대, 슬개골의 어긋남,
                  관절 안의 작은 유리체 등은 영상검사만으로 명확히 확인하기
                  어려울 수 있습니다.{' '}
                  <strong className="font-semibold text-primary">
                    진찰과 영상검사에서 얻은 정보를 함께 살핍니다.
                  </strong>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <KneeDiseaseExplorer />

        <KneeCartilageTreatmentSteps />

        <KneeArthroscopyMedia />

        <KneeDoctorFeature />

        <section className="overflow-hidden bg-white px-5 py-12 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="max-w-4xl">
              <h2 className={sectionTitleClass}>
                진료 시 함께 살펴보는 증상
              </h2>
            </ScrollReveal>

            <div className="mt-8 grid grid-cols-1 border-y border-slate-200 sm:mt-12 md:grid-cols-2">
              {candidates.map((candidate, index) => (
                <ScrollReveal key={candidate} delay={index * 0.04}>
                  <div
                    className={`grid grid-cols-[28px_minmax(0,1fr)] items-baseline gap-3 border-b border-slate-200 py-5 sm:gap-4 md:px-5 md:py-6 md:border-r ${
                      index % 2 === 1 ? 'md:border-r-0' : ''
                    } ${index >= candidates.length - 2 ? 'md:border-b-0' : ''}`}
                  >
                    <span aria-hidden className="text-sm tabular-nums text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="break-keep text-base leading-[1.8] text-ink-sub md:text-lg">
                      {candidate}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F7F8FA] px-5 py-12 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="max-w-4xl">
              <h2 className={sectionTitleClass}>
                상담부터 회복까지의 진료 과정
              </h2>
              <p className="mt-5 max-w-3xl break-keep text-base leading-[1.8] text-ink-sub md:text-lg">
                현재 상태를 충분히 확인하고, 치료 내용에 맞는 회복 과정을 함께 설계합니다.
              </p>
            </ScrollReveal>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-3">
              {treatmentJourney.map((step, index) => (
                <ScrollReveal
                  key={step.title}
                  delay={index * 0.08}
                  variant="fade-up"
                  className="h-full"
                >
                  <article className="h-full">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-200">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        sizes="(min-width: 1024px) 31vw, 100vw"
                        className="object-cover"
                      />

                    </div>
                    <div className="pb-2 pt-5">
                      <span className="text-sm tabular-nums text-slate-500">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-2 text-xl font-semibold leading-snug text-[#102647]">
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

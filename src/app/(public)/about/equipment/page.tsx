import type { Metadata } from 'next';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import SubHero from '@/components/SubHero';

export const metadata: Metadata = {
  title: '첨단 의료 장비 | 연세척병원',
  description:
    '정확한 진단과 안전한 치료를 돕는 연세척병원의 영상·검사·물리치료 장비를 소개합니다.',
};

type Equipment = {
  name: string;
  englishName?: string;
  category: '영상·검사장비' | '진단·검사장비' | '치료·재활장비';
  description: string;
  image: string;
  alt: string;
};

const EQUIPMENT: Equipment[] = [
  {
    name: 'C-ARM',
    category: '영상·검사장비',
    description:
      '이동형 엑스선 투시 촬영장치로, 시술 중 환부와 기구의 위치를 실시간으로 확인해 정확하고 안전한 시술을 돕습니다.',
    image: '/generated/equipment/c-arm.webp',
    alt: '연세척병원 C-ARM 이동형 엑스선 투시 촬영장치',
  },
  {
    name: 'DITI',
    englishName: '적외선 체열검사기',
    category: '진단·검사장비',
    description:
      '신체 표면의 온도 분포와 좌우 비대칭을 영상화해 통증 부위의 신경·염증·순환 상태를 평가하는 데 참고하는 검사장비입니다.',
    image: '/generated/equipment/diti.webp',
    alt: '연세척병원 DITI 적외선 체열검사기',
  },
  {
    name: 'MRI',
    category: '영상·검사장비',
    description:
      '자기장을 이용해 인체의 단층 영상을 얻는 장비로, 디스크·척추관협착증·척추종양과 관절·인대·신경 질환의 정밀 진단을 돕습니다.',
    image: '/generated/equipment/mri.webp',
    alt: '연세척병원 MRI 자기공명영상 장비',
  },
  {
    name: 'X-RAY',
    category: '영상·검사장비',
    description:
      '척추와 관절의 모양·정렬, 디스크 간격, 골절 여부 등 근골격계 전반의 상태를 빠르게 파악하는 기본 영상 검사장비입니다.',
    image: '/generated/equipment/x-ray.webp',
    alt: '연세척병원 X-RAY 영상 촬영실',
  },
  {
    name: '생화학장비',
    category: '진단·검사장비',
    description:
      '적혈구·백혈구·혈소판·혈색소량 등을 검사해 전신 건강 상태를 파악하고 진료와 치료 계획에 필요한 정보를 확인하는 검사장비입니다.',
    image: '/generated/equipment/biochemistry-analyzer.webp',
    alt: '연세척병원 임상 생화학 검사장비',
  },
  {
    name: '초음파진단기',
    category: '영상·검사장비',
    description:
      '고해상도 초음파로 근육·힘줄·인대·관절 등 근골격계 구조물을 실시간으로 확인해 정확한 진단과 안전한 주사치료를 돕습니다.',
    image: '/generated/equipment/ultrasound.webp',
    alt: '연세척병원 근골격계 초음파진단기',
  },
  {
    name: 'BMD',
    englishName: '골밀도 검사기',
    category: '진단·검사장비',
    description:
      '인체 특정 부위의 골밀도를 측정해 결과를 수치화하는 장비로, 골다공증을 조기에 발견하고 치료 방향을 정하는 데 활용합니다.',
    image: '/generated/equipment/bmd.webp',
    alt: '연세척병원 BMD 골밀도 검사기',
  },
  {
    name: 'TENS',
    englishName: '경피신경전기자극치료기',
    category: '치료·재활장비',
    description:
      '피부를 통해 통증 부위에 저주파 전기자극을 적용해 통증 완화와 근육 이완을 돕는 물리치료 장비입니다.',
    image: '/generated/equipment/tens.webp',
    alt: '연세척병원 TENS 경피신경전기자극치료기',
  },
  {
    name: 'C/L TRACTION',
    englishName: '경추·요추 견인치료기',
    category: '치료·재활장비',
    description:
      '목과 허리에 일정한 견인력을 적용해 디스크·척추관협착증·만성 요통 등의 비수술적 치료와 재활을 돕는 견인치료기입니다.',
    image: '/generated/equipment/traction.webp',
    alt: '연세척병원 C/L TRACTION 경추 요추 견인치료기',
  },
  {
    name: '자기장 치료기',
    category: '치료·재활장비',
    description:
      '신체 깊은 부위에 펄스 자기장을 전달해 신경과 근육을 자극하고, 만성 통증 완화와 근육 기능 회복을 돕는 비수술 치료장비입니다.',
    image: '/generated/equipment/magnetic-therapy.webp',
    alt: '연세척병원 자기장 통증치료기',
  },
  {
    name: 'ICT',
    englishName: '간섭파 전류치료기',
    category: '치료·재활장비',
    description:
      '두 개 이상의 중주파 전류를 교차시켜 발생하는 간섭전류로 근육과 신경을 자극해 통증 완화와 혈류 증가를 돕는 장비입니다.',
    image: '/generated/equipment/ict.webp',
    alt: '연세척병원 ICT 간섭파 전류치료기',
  },
  {
    name: 'ESWT',
    englishName: '체외충격파 치료기',
    category: '치료·재활장비',
    description:
      '병변이 있는 근골격계 부위에 충격파를 전달해 조직의 회복 반응과 혈류 개선을 유도하고 건·인대·관절 주위 통증 완화를 돕는 치료장비입니다.',
    image: '/generated/equipment/eswt.webp',
    alt: '연세척병원 ESWT 체외충격파 치료기',
  },
  {
    name: '크라이오',
    englishName: '저온 통증치료기',
    category: '치료·재활장비',
    description:
      '저온의 치료용 가스를 통증 부위에 분사해 피부 온도를 짧은 시간 낮추고, 통증과 부종 완화·근육 이완을 돕는 재활치료 장비입니다.',
    image: '/generated/equipment/cryo.webp',
    alt: '연세척병원 크라이오 저온 통증치료기',
  },
  {
    name: '고주파 열치료',
    category: '치료·재활장비',
    description:
      '고주파 에너지로 심부열을 발생시켜 혈류량과 신진대사를 높이고, 근육 이완과 조직 회복을 돕는 물리치료 장비입니다.',
    image: '/generated/equipment/radiofrequency-heat.webp',
    alt: '연세척병원 고주파 열치료기',
  },
  {
    name: '비침습적 무통증 신호요법',
    category: '치료·재활장비',
    description:
      '통증 신호가 전달되는 신경 경로에 무통 신호 정보를 적용해 만성·난치성 통증의 완화를 돕는 비침습 치료장비입니다.',
    image: '/generated/equipment/pain-signal-therapy.webp',
    alt: '연세척병원 비침습적 무통증 신호요법 치료기',
  },
];

function EquipmentCard({ item, index }: { item: Equipment; index: number }) {
  return (
    <ScrollReveal
      variant="soft-rise"
      delay={(index % 2) * 0.08}
      className="h-full"
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_60px_-36px_rgba(15,29,54,0.35)]">
        <div className="relative aspect-[190/141] overflow-hidden bg-[#f6f7f9]">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1536px) 50vw, 680px"
            quality={90}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <span className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/90 px-3.5 py-2 text-[11px] font-bold tracking-[-0.02em] text-primary shadow-sm backdrop-blur sm:right-5 sm:top-5 sm:text-xs">
            {item.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          <div className="mb-4 h-1 w-9 rounded-full bg-primary/85" />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="break-keep text-h3 tracking-[-0.035em] text-primary">
              {item.name}
            </h2>
            {item.englishName ? (
              <span className="break-keep text-caption font-semibold text-ink-muted">
                {item.englishName}
              </span>
            ) : null}
          </div>
          <p className="mt-4 break-keep text-body-lg leading-[1.8] text-ink-muted">
            {item.description}
          </p>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function EquipmentPage() {
  return (
    <div className="flex flex-col bg-white">
      <SubHero
        title="첨단 의료 장비"
        subtitle={'환자의 상태를 세심하게 살피고,\n정확한 진단과 안전한 치료를 돕습니다.'}
        path={[
          { name: '병원소개', href: '/about' },
          { name: '첨단 의료 장비' },
        ]}
      />

      <main>
        <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-28 lg:py-36">
          <ScrollReveal className="mx-auto max-w-5xl">
            <div className="space-y-2 text-[clamp(1.8rem,4.2vw,3.2rem)] font-medium leading-[1.3] tracking-[-0.045em] text-ink-sub">
              <p className="break-keep">
                정확한 진단과 <strong className="font-extrabold text-ink">안전한 치료</strong>를 돕는
              </p>
              <p className="break-keep text-left sm:text-right">
                <strong className="font-extrabold text-primary">첨단 의료 장비</strong>를 운영합니다.
              </p>
            </div>
          </ScrollReveal>
        </section>

        <section className="relative overflow-hidden bg-[#17377f] px-4 pb-36 pt-16 text-center sm:px-6 sm:pb-44 sm:pt-20 md:pb-52 md:pt-24">
          <div className="pointer-events-none absolute -right-20 top-6 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-8 top-20 h-52 w-52 rounded-full border border-white/10" />
          <ScrollReveal className="relative mx-auto max-w-4xl">
            <p className="break-keep text-body-lg font-bold text-white/80">
              진단부터 치료·회복까지 필요한 의료 장비
            </p>
            <h2 className="mt-4 break-keep text-h2 tracking-[-0.04em] text-white sm:mt-5">
              상태를 세심하게 살피는
              <span className="mt-1 block text-[#b9c9ff]">연세척병원의 정밀 장비 시스템</span>
            </h2>
          </ScrollReveal>
        </section>

        <section className="bg-slate-50 px-4 pb-16 sm:px-6 sm:pb-20 md:pb-28">
          <div className="relative mx-auto -mt-24 max-w-7xl sm:-mt-32 md:-mt-40">
            <ScrollReveal variant="image">
              <div className="hidden overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_26px_70px_-42px_rgba(10,20,40,0.45)] sm:block">
                <div className="relative aspect-[2000/650]">
                  <Image
                    src="/generated/equipment/equipment-feature.webp"
                    alt="연세척병원 3D 입체영상기와 장비 안내"
                    fill
                    sizes="(max-width: 1536px) calc(100vw - 48px), 1400px"
                    quality={90}
                    className="object-cover"
                  />
                </div>
              </div>

              <article className="overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#17377f] shadow-[0_26px_70px_-42px_rgba(10,20,40,0.5)] sm:hidden">
                <div className="relative h-64 overflow-hidden bg-white">
                  <Image
                    src="/generated/equipment/equipment-feature.webp"
                    alt="연세척병원 3D 입체영상기"
                    fill
                    sizes="calc(100vw - 32px)"
                    quality={90}
                    className="object-cover object-[22%_center]"
                  />
                </div>
                <div className="px-5 py-6 text-white">
                  <p className="text-h3 tracking-tight">3D 입체영상기</p>
                  <p className="mt-3 break-keep text-body leading-[1.75] text-white/75">
                    전신 체형을 스캔해 자세·체형 비율·밸런스를 측정하고,
                    치료 전후의 변화를 분석하는 데 활용합니다.
                  </p>
                </div>
              </article>
            </ScrollReveal>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {EQUIPMENT.map((item, index) => (
                <EquipmentCard key={item.name} item={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

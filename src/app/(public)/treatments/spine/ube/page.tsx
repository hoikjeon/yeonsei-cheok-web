import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import SubHero from '@/components/SubHero';
import UbeFaqAccordion from '@/components/UbeFaqAccordion';
import UbeParallaxBackground from '@/components/UbeParallaxBackground';
import UbeDecompressionScene from '@/components/UbeDecompressionScene';
import UbeIndicationMap from '@/components/UbeIndicationMap';

const overviewBenefits = [
  {
    title: '정밀수술 가능',
    desc: '넓은 시야 확보로 병변을 직접 확인하며 정밀한 수술이 가능합니다.',
  },
  {
    title: '안전한 시술',
    desc: '조직 손상이 적고 통증과 부작용 부담을 낮추는 데 도움이 됩니다.',
  },
  {
    title: '광범위 치료',
    desc: '디스크와 협착증 등 다양한 신경 압박 병변에 적용할 수 있습니다.',
  },
  {
    title: '높은 성공률',
    desc: '넓고 선명한 시야를 바탕으로 안정적인 치료 결과를 기대할 수 있습니다.',
  },
  {
    title: '빠른 회복',
    desc: '작은 절개와 적은 조직 손상으로 회복 부담을 줄이는 치료를 목표로 합니다.',
  },
];

const decompressionFacts = [
  { label: '절개창', value: '1cm 이하 2곳' },
  { label: '마취', value: '부분마취하 진행' },
  { label: '감압시간', value: '약 40분' },
  { label: '시야', value: '8~10배율 내시경' },
];

const indications = [
  '약물, 주사, 물리치료 후에도 통증이 지속되는 경우',
  '척추관 협착증으로 보행과 일상생활이 어려운 경우',
  '튀어나온 디스크가 신경을 눌러 다리 저림이 심한 경우',
  '거대 디스크 파열 또는 깊은 병변으로 정밀 접근이 필요한 경우',
];

const treatmentSteps = [
  {
    no: '01',
    title: '정밀 진단 및 접근',
    desc: '1cm 미만의 최소 절개 두 곳으로 특수 척추 내시경을 삽입해 병변 부위와 신경 압박 위치를 육안으로 정확히 확인합니다.',
    image: '/generated/ube/ube-step-diagnosis.png',
    alt: '척추 MRI 영상을 확인하는 정밀 진단 장면',
  },
  {
    no: '02',
    title: '원인 제거 및 감압',
    desc: '미세 수술 기구로 신경을 누르는 좁아진 협착 부위를 넓히거나 튀어나온 디스크만 선택적으로 제거합니다.',
    image: '/generated/ube/ube-step-decompression.png',
    alt: '양방향 내시경 수술 기구를 이용한 감압 장면',
  },
  {
    no: '03',
    title: '빠른 회복 및 재활',
    desc: '조직 손상과 출혈이 적어 수술 후 통증 부담을 낮추고, 짧은 입원 후 일상 복귀를 목표로 회복을 관리합니다.',
    image: '/generated/ube/ube-step-recovery.png',
    alt: '수술 후 보행 재활을 돕는 병원 복도 장면',
  },
];

const comparisonItems = [
  {
    title: '한방향 척추 수술',
    image: '/generated/ube/ube-comparison-uni.png',
    alt: '한 개 통로로 접근하는 척추 수술 일러스트',
    rows: [
      { label: '방식', desc: '한 개의 구멍을 통해 내시경과 수술 도구를 동시에 삽입하여 치료합니다.' },
      { label: '특징 및 한계', desc: '신체 부담은 적지만 기구 움직임이 제한되고 시야가 좁아 복잡한 병변 제거가 어려울 수 있습니다.' },
      { label: '치료 범위', desc: '범위가 좁아 비교적 증상이 가벼운 초기 디스크 등 일부 치료에 주로 적용됩니다.' },
    ],
  },
  {
    title: '양방향 척추내시경',
    image: '/generated/ube/ube-comparison-bi.png',
    alt: '두 개 통로로 접근하는 양방향 척추 수술 일러스트',
    rows: [
      { label: '방식', desc: '두 개의 구멍으로 내시경과 수술 도구를 각각 독립적으로 삽입하여 치료합니다.' },
      { label: '안정성 및 장점', desc: '양손을 사용하는 것과 같은 자유로운 움직임이 가능하며 넓은 시야로 더 정밀한 치료를 돕습니다.' },
      { label: '치료 범위', desc: '심한 척추관 협착증, 거대 디스크 파열 등 넓은 범위에 적용 가능하며 빠른 일상 복귀를 목표로 합니다.' },
    ],
  },
];

const faqItems = [
  {
    question: '양방향 척추내시경은 언제 해야 하나요?',
    answer:
      '약물, 주사, 물리치료 등 보존적 치료를 충분히 했음에도 통증이 지속되고 일상생활에 지장이 클 때 적극적으로 고려할 수 있습니다. 디스크나 협착증 등 다양한 척추 질환에 적용 가능하며, 특히 근육량이 많거나 피하 지방이 두꺼워 병변이 깊은 곳에 위치한 환자에게 더욱 유리한 치료법입니다.',
  },
  {
    question: '수술 시간과 회복 기간은 얼마나 걸리나요?',
    answer:
      '환자의 상태와 병변의 난이도에 따라 다르지만, 평균적으로 1부위당 약 30분에서 1시간 내외로 짧게 소요됩니다. 입원 기간은 2~3일 정도로 매우 짧으며, 수술 후 약 반나절 정도 안정을 취한 뒤에는 바로 보행이 가능할 만큼 회복 속도가 빠릅니다.',
  },
  {
    question: '고령의 환자나 만성질환자도 수술이 안전한가요?',
    answer:
      '양방향 내시경 수술은 절개 범위가 작아 출혈 및 감염, 합병증의 위험을 낮추는 데 도움이 됩니다. 전신마취가 아닌 척추 부분마취로 진행되는 경우가 많아 80대 이상의 고령 환자나 고혈압, 당뇨 등 기저질환을 앓고 계신 분들도 심폐 기능에 큰 부담 없이 치료를 고려할 수 있습니다.',
  },
  {
    question: '수술 후 흉터가 크게 남나요?',
    answer:
      '1cm 미만의 작은 구멍 2개만 내어 수술을 진행하므로, 회복 후에는 흉터가 거의 눈에 띄지 않아 미용적인 만족도도 높습니다.',
  },
];

const precautions = [
  {
    title: '수술 후 척추에 무리가 가지 않도록 주의하세요',
    desc: '수술 후 전문의 안내에 따라 어느 정도 안정을 취한 뒤 보행을 시작합니다. 퇴원 후 4~6주간은 허리를 무리하게 굽히거나 비틀기, 무거운 물건을 드는 행동은 반드시 삼가야 합니다.',
  },
  {
    title: '회복 과정에는 개인차가 있을 수 있습니다',
    desc: '환자의 연령, 체력, 특성에 따라 회복 속도에 개인차가 있습니다. 수술 부위의 일시적인 열감, 부기, 미세한 방사통 등이 동반될 수 있으며, 특이 증상이 있을 경우 즉시 의료진과 상담해 주세요.',
  },
  {
    title: '수술 후 꾸준한 관리가 재발을 막습니다',
    desc: '통증이 가라앉은 후에는 걷기 등 가벼운 운동부터 천천히 강도를 올려 허리 코어 근육을 강화해야 합니다. 체중을 적절히 유지하고 올바른 자세를 생활화하는 것이 중요합니다.',
  },
];

const strengths = [
  {
    no: '01',
    title: '신경외과 전문의 책임 진료',
    desc: '척추의 복잡하고 까다로운 해부학적 구조를 이해하고, 환자의 안전을 최우선으로 생각하는 신경외과 전문의가 진단부터 수술까지 책임 진료합니다.',
  },
  {
    no: '02',
    title: '분야별 전문의 협진',
    desc: '신경외과, 마취통증의학과, 영상의학과 등 분야별 전문의가 유기적으로 협진하여 오진율을 낮추고 더 정확하고 안전하게 치료합니다.',
  },
  {
    no: '03',
    title: '필요한 치료만 선별',
    desc: '무분별한 수술을 지양하고, 비수술 보존 치료부터 수술, 재활 회복까지 환자 상태에 맞는 체계적인 맞춤 치료를 시행합니다.',
  },
  {
    no: '04',
    title: '첨단 검사 및 수술 장비',
    desc: '3.0T MRI, 3D CT, 이동식 X-ray, 초음파 등 첨단 검사 및 수술 장비를 활용해 환자에게 적합한 정밀 치료 시스템을 제공합니다.',
  },
  {
    no: '05',
    title: '환자 중심 진료 환경',
    desc: '간호·간병 통합 서비스와 철저한 감염 관리 시스템을 갖추어 위생적이고 쾌적한 진료 환경에서 환자 중심 의료 서비스를 실현합니다.',
  },
];

const centerImages = [
  {
    src: '/generated/ube/ube-center-collaboration.png',
    alt: '척추 영상을 보며 협진하는 전문의들',
  },
  {
    src: '/generated/ube/ube-center-equipment.png',
    alt: '첨단 영상 검사 장비가 있는 병원 검사실',
  },
  {
    src: '/generated/ube/ube-center-care.png',
    alt: '청결한 병동에서 간호사가 물품을 점검하는 장면',
  },
];

const sectionTitleClass =
  'text-4xl font-extrabold leading-[1.14] tracking-tight text-ink md:text-5xl';

const blueSectionTitleClass =
  'text-4xl font-extrabold leading-[1.14] tracking-tight text-white md:text-5xl';

export default function UbePage() {
  return (
    <div className="flex flex-col bg-white">
      <SubHero
        title="양방향 척추내시경(UBE)"
        subtitle="작은 절개로 정교하게, 조직 손상은 최소화하여 일상으로의 복귀를 앞당깁니다."
        path={[
          { name: '척추센터', href: '/treatments/spine' },
          { name: '양방향 척추내시경' },
        ]}
        bgImage="/generated/ube/ube-hero-operating-room.png"
      />

      <main className="w-full">
        <section className="bg-[#F5F7FA] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal variant="image">
              <UbeDecompressionScene />
            </ScrollReveal>

            <ScrollReveal className="mx-auto mt-12 max-w-5xl">
              <div className="space-y-6">
                <h2 className={sectionTitleClass}>
                  양방향 척추내시경 감압술이란?
                </h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {decompressionFacts.map((item) => (
                    <div key={item.label} className="rounded-lg border border-slate-200 bg-white px-5 py-4">
                      <div className="text-sm font-black text-primary">{item.label}</div>
                      <div className="mt-2 text-lg font-black leading-snug text-ink md:text-xl">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-5 text-lg font-medium leading-relaxed text-ink-sub">
                  <p>
                    두 개의 1cm 이하 절개창을 이용하는 정밀 수술방법으로, 한쪽은 내시경,
                    다른 한쪽에는 수술기구를 삽입하여 감압하는 방법입니다. 부분마취하에서
                    진행하며 감압시간은 약 40분입니다.
                  </p>
                  <p>
                    기존의 현미경 수술보다 8~10배율의 내시경으로 진행하여 정밀도가 높고,
                    수술에 필요한 기구를 독립적으로 사용할 수 있기 때문에 움직임에 제한이
                    적습니다.
                  </p>
                  <p>
                    수술 시 시야가 넓고 신경이 선명하게 잘 보여 보다 정확한 치료 결과를 기대할 수
                    있습니다.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <ScrollReveal className="space-y-6">
              <h2 className={sectionTitleClass}>
                작은 절개로 접근하는
                <br />
                정밀 척추 치료
              </h2>
              <div className="space-y-5 text-lg font-medium leading-relaxed text-ink-sub">
                <p>
                  양방향 척추내시경은 병변 주변으로 약 5~7mm의 작은 구멍 두 개를 내어
                  진행하는 치료법입니다. 한 쪽에는 초고화질 특수 내시경을 삽입해 넓고 선명한
                  시야를 확보하고, 다른 한 쪽에는 미세 수술 기구를 삽입하여 병변 부위를 직접
                  보며 치료합니다.
                </p>
                <p>
                  이를 통해 출혈과 주변 정상 조직의 손상을 줄이고, 통증 부담을 낮추며 빠른 회복과
                  일상 복귀를 목표로 합니다.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08} variant="image">
              <div className="relative aspect-[16/11] overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src="/generated/ube/ube-surgery-closeup.png"
                  alt="양방향 척추내시경 기구 클로즈업"
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 md:gap-5">
            {overviewBenefits.map((item, index) => (
              <ScrollReveal
                key={item.title}
                delay={0.08 + index * 0.08}
                variant="metric"
                amount={0.38}
                className="h-full"
              >
                <div className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-blue-glow">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-light opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                  />

                  <div className="relative">
                    <h3 className="text-xl font-extrabold leading-snug text-ink md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-5 text-base font-semibold leading-relaxed text-ink-sub">
                      {item.desc}
                    </p>
                  </div>

                  <div className="relative mt-8 h-px w-full bg-slate-200">
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gradient-to-r from-primary to-primary/40 transition-transform duration-[600ms] ease-out group-hover:scale-x-100"
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="bg-[#F5F7FA] px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <ScrollReveal variant="image">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-200">
                <Image
                  src="/generated/ube/ube-specialist-monitor.png"
                  alt="내시경 화면을 확인하며 수술하는 신경외과 전문의"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08} className="space-y-7">
              <div className="space-y-5">
                <h2 className={sectionTitleClass}>
                  초고화질 내시경 시야와
                  <br />
                  숙련된 신경외과 전문의의
                  <br />
                  섬세한 술기로 안전하게 치료합니다.
                </h2>
              </div>
              <div className="space-y-5 text-lg font-medium leading-relaxed text-ink-sub">
                <p>
                  척추 수술은 심리적, 신체적으로 큰 부담이 될 수 있습니다. 수술의 정확성과
                  안정성을 높이기 위해서는 병변 부위를 오차 없이 확인하는 정확한 눈과 수술 도구를
                  미세하게 컨트롤하는 숙련된 손이 필수적입니다.
                </p>
                <p>
                  연세척병원은 척추 질환에 대한 깊은 이해와 전문성을 갖춘 신경외과 전문의가
                  진단부터 입원, 양방향 척추내시경, 재활 및 일상 복귀까지 환자 맞춤형
                  1:1 체계적 진료를 제공합니다.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="decompression-candidates" className="bg-[#F5F7FA] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="max-w-4xl">
              <h2 className={sectionTitleClass}>양방향 척추내시경 적용대상</h2>
            </ScrollReveal>

            <ScrollReveal delay={0.08} variant="image">
              <UbeIndicationMap />
            </ScrollReveal>
          </div>
        </section>

        <section id="indications" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <ScrollReveal className="max-w-4xl">
            <h2 className={sectionTitleClass}>
              보존적 치료 후에도 통증이 이어진다면
              <br />
              정밀하게 원인을 확인합니다.
            </h2>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-ink-sub">
              환자의 증상, 영상 검사, 신경 압박 정도에 따라 양방향 척추내시경의 필요성과
              적합성을 전문의가 판단합니다.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 border-y border-slate-200 md:grid-cols-2">
            {indications.map((item, index) => (
              <ScrollReveal key={item} delay={index * 0.04}>
                <div
                  className={`group relative grid min-h-28 grid-cols-[64px_minmax(0,1fr)] items-center gap-5 overflow-hidden border-b border-slate-200 py-6 md:border-r md:px-6 ${
                    index % 2 === 0 ? '' : 'md:border-r-0'
                  } ${index >= indications.length - 2 ? 'md:border-b-0' : ''}`}
                >
                  {/* hover 시 좌→우로 차오르는 배경 */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-navy-900 via-primary-dark to-primary transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />

                  <span className="relative z-10 font-montserrat text-2xl font-black text-primary transition-colors duration-500 ease-out group-hover:text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="relative z-10 text-lg font-black leading-relaxed text-ink transition-colors duration-500 ease-out group-hover:text-white">
                    {item}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="process" className="bg-[#F5F7FA] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mx-auto max-w-4xl text-center">
              <h2 className={sectionTitleClass}>
                특수 내시경으로 병변을 직접 확인하며,
                <br />
                통증의 근본 원인만 선택적으로 제거합니다.
              </h2>
              <p className="mt-6 text-lg font-medium leading-relaxed text-ink-sub">
                기존 개방형 수술과 달리 특수 내시경으로 병변 부위를 확대해 직접 확인하므로, 정상
                조직 보존율이 높고 수술 후 당일 또는 다음날 보행을 목표로 회복을 관리합니다.
              </p>
            </ScrollReveal>

            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {treatmentSteps.map((step, index) => (
                <ScrollReveal key={step.no} delay={index * 0.08}>
                  <article className="h-full overflow-hidden rounded-lg bg-white">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        sizes="(min-width: 1024px) 31vw, 100vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    <div className="px-7 pb-8 pt-7">
                      <div className="font-montserrat text-2xl font-black text-primary">{step.no}</div>
                      <h3 className="mt-5 text-2xl font-black leading-snug text-ink">{step.title}</h3>
                      <p className="mt-4 text-[17px] font-medium leading-relaxed text-ink-sub">{step.desc}</p>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#071A3D] px-5 py-10 text-white sm:px-6 md:py-14">
          <UbeParallaxBackground />

          <div className="relative mx-auto max-w-7xl">
            <ScrollReveal className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-white md:text-5xl">
                한방향 척추 수술과
                <br />
                양방향 척추내시경의 차이
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-relaxed text-white/80 md:text-lg">
                두 개의 독립 통로로 시야와 기구 움직임을 분리해 더 넓고 정밀한 접근을 돕습니다.
              </p>
            </ScrollReveal>

            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 xl:grid-cols-[minmax(0,500px)_minmax(0,500px)] xl:justify-center">
              {comparisonItems.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.08}>
                  <article
                    className={`group h-full rounded-lg border p-4 text-ink shadow-[0_24px_70px_rgba(2,12,32,0.18)] backdrop-blur-md md:p-5 ${
                      index === 1
                        ? 'border-cyan-200/80 bg-white/90 ring-1 ring-cyan-100/70'
                        : 'border-white/55 bg-white/85'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3
                        className={`text-xl font-black leading-snug md:text-2xl ${
                          index === 1 ? 'text-primary' : 'text-ink'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1024px) 44vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                      {item.rows.map((row) => (
                        <div
                          key={row.label}
                          className="grid gap-3 py-3 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-5"
                        >
                          <div>
                            <span
                              className={`inline-flex h-7 items-center whitespace-nowrap rounded-full px-3 text-sm font-black ${
                                index === 1 ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                              }`}
                            >
                              {row.label}
                            </span>
                          </div>
                          <p className="text-[15px] font-semibold leading-relaxed text-slate-700 md:text-base">
                            {row.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className={sectionTitleClass}>
              환자분들이 자주 묻는 질문에
              <br />
              연세척병원이 답합니다.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="mx-auto mt-12 max-w-5xl">
            <UbeFaqAccordion items={faqItems} />
          </ScrollReveal>
        </section>

        <section className="bg-[#F5F7FA] px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
            <ScrollReveal className="space-y-5">
              <h2 className={sectionTitleClass}>
                건강한 일상을 위한
                <br />
                회복 관리 안내
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">
                {precautions.map((item, index) => (
                  <div key={item.title} className="grid gap-4 px-6 py-7 md:grid-cols-[70px_minmax(0,1fr)] md:px-8">
                    <span className="font-montserrat text-2xl font-black text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-xl font-black leading-snug text-ink">{item.title}</h3>
                      <p className="mt-3 text-base font-medium leading-relaxed text-ink-sub md:text-[17px]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#071A3D] px-6 py-20 text-white md:py-28">
          <UbeParallaxBackground />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-stretch">
              <ScrollReveal className="space-y-6">
                <h2 className={blueSectionTitleClass}>
                  환자의 척추 건강을
                  <br />
                  평생 책임지는 척추센터
                </h2>
                <p className="text-lg font-medium leading-relaxed text-white/82">
                  척추 질환은 초기에 정확한 원인을 파악해 치료하는 것이 가장 중요합니다.
                  연세척병원 척추센터는 정밀 진단과 풍부한 임상경험을 갖춘 신경외과 전문의가
                  꼭 필요한 치료만 선별해 시행합니다.
                </p>
              </ScrollReveal>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:h-full">
                {centerImages.map((image, index) => (
                  <ScrollReveal key={image.src} delay={index * 0.06} variant="image" className="lg:h-full">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white/10 lg:aspect-auto lg:h-full lg:min-h-[220px]">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
              {strengths.map((item, index) => (
                <ScrollReveal key={item.no} delay={index * 0.04}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/40 hover:bg-white/[0.1] hover:shadow-[0_24px_60px_rgba(2,12,32,0.45)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <h3 className="text-lg font-black leading-snug text-white transition-colors duration-300 group-hover:text-cyan-400">{item.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">{item.desc}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <ScrollReveal className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-lg border border-slate-200 bg-white lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-4 p-8 md:p-10 lg:p-12">
              <h2 className="text-3xl font-black leading-tight text-ink md:text-4xl">
                내 증상에 맞는 치료인지 확인하고 싶다면
              </h2>
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-ink-sub">
                검사 자료와 증상을 바탕으로 양방향 척추내시경 적용 가능 여부를 전문의가
                안내해 드립니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 p-8 md:flex-row md:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-4 text-base font-black text-white transition-all hover:bg-primary-dark"
              >
                진료 예약하기
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-7 py-4 text-base font-black text-ink transition-all hover:border-primary hover:text-primary"
              >
                온라인 상담하기
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
}

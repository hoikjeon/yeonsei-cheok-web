import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import UbeParallaxBackground from '@/components/UbeParallaxBackground';

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

const SpineCenterStrengthSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#071A3D] px-6 py-20 text-white md:py-28">
      <UbeParallaxBackground />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-stretch">
          <ScrollReveal className="space-y-6">
            <h2 className="text-4xl font-extrabold leading-[1.14] tracking-normal text-white md:text-5xl">
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
                <h3 className="text-lg font-black leading-snug text-white transition-colors duration-300 group-hover:text-cyan-400">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">{item.desc}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpineCenterStrengthSection;

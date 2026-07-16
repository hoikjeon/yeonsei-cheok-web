import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

const specialFeatures = [
  {
    title: '해외 의료진 전수',
    desc: '연세척병원의 양방향 척추내시경 술기와 치료 프로토콜을 해외 의료진에게 전수합니다.',
    image: '/generated/ube/ube-special-overseas-training.png',
    alt: '양방향 척추내시경 교육 장면',
  },
  {
    title: '의사를 가르치는 의사',
    desc: '진료 현장에서 축적한 경험과 섬세한 술기를 바탕으로 의료진이 배우는 표준화된 치료 흐름을 만듭니다.',
    image: '/generated/ube/ube-special-doctor-teacher.png',
    alt: '척추 모형으로 내시경 술기를 교육하는 의료진',
  },
  {
    title: '원스톱 진료에서 수술까지',
    desc: '내원 당일 검사, 시술까지 가능한 One stop care system',
    image: '/generated/ube/ube-special-one-stop-care.png',
    alt: 'MRI 영상을 확인하며 수술 계획을 상담하는 척추 전문의와 환자',
  },
  {
    title: '마지막 회복까지, 나를 위한 맞춤 케어',
    desc: '수술 후 컨디션에 맞춘 1:1 전담 관리로 회복 과정과 일상 복귀를 세심하게 함께합니다.',
    image: '/generated/ube/ube-special-personal-recovery-care.png',
    alt: '수술 후 보행 회복을 1대1로 돕는 의료진과 환자',
  },
];

export default function YonseiSpecialFeaturesSection() {
  return (
    <section id="yonsei-specials" className="overflow-hidden bg-white px-5 py-16 sm:px-6 md:py-28 md:pb-44">
      <div className="mx-auto max-w-[1180px]">
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <h2 className="break-keep text-h2 tracking-tight text-ink">
            근본적인 회복을 만드는
            <br />
            연세척의 4가지 특별함
          </h2>
          <p className="mx-auto mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub sm:mt-7 md:text-xl md:leading-relaxed">
            연세척병원은 정밀 진단과 양방향 척추내시경 치료 시스템을 바탕으로 통증은 줄이고,
            <br className="hidden md:block" />
            움직임과 활력을 되찾는 선순환을 만들어갑니다.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-5 md:gap-x-10 md:gap-y-12">
          {specialFeatures.map((item, index) => (
            <ScrollReveal
              key={item.title}
              delay={index * 0.07}
              variant="soft-rise"
              amount={0.2}
              className={`h-full ${index % 2 === 1 ? 'md:translate-y-28' : ''}`}
            >
              <article className="group relative flex h-[310px] overflow-hidden rounded-[1rem] bg-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.14)] transition-all duration-500 hover:-translate-y-1 min-[420px]:h-[340px] sm:h-[430px] sm:rounded-[1.5rem] md:h-[500px] lg:h-[560px]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/18 to-transparent"
                />

                <div className="relative z-10 mt-auto w-full p-4 sm:p-7 md:p-10">
                  <h3 className="break-keep text-[1.05rem] font-bold leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] sm:text-xl md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[27rem] break-keep text-[13px] font-semibold leading-[1.55] text-white/90 sm:mt-3 sm:text-[15px] sm:leading-[1.65] md:mt-4 md:text-[17px] md:leading-relaxed md:text-white/86">
                    {item.desc}
                  </p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

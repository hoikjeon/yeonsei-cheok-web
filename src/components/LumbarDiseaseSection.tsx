'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

type DiseaseId = 'scoliosis' | 'lumbar-disc' | 'compression-fracture' | 'spinal-stenosis';

interface Disease {
  id: DiseaseId;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  symptoms: string[];
  causes: string[];
}

const diseases: Disease[] = [
  {
    id: 'scoliosis',
    title: '척추측만증',
    image: '/generated/lumbar-disc/lumbar-disease-scoliosis.png',
    imageAlt: '척추측만증을 설명하는 척추 의료 이미지',
    description:
      '척추측만증은 척추가 정면에서 볼 때 옆으로 휜 상태를 말합니다. 정상적인 척추는 정면에서 일직선이어야 하지만, 척추측만증 환자는 옆으로 휘어지고 회전 변형이 동반될 수 있습니다.',
    symptoms: [
      '외관상 비대칭(어깨 높이, 골반 높이 등)',
      '몸통 비대칭',
      '경증에서 중증까지 다양한 허리 통증',
      '심한 경우, 흉곽의 변형으로 인한 호흡 곤란',
      '심한 경우, 신경이 압박되어 다리 저림 및 감각 이상',
    ],
    causes: [
      '원인을 알 수 없는 특발성 요인',
      '유전적 요인',
      '뇌성마비, 근육병 등 신경근육 이상',
      '성장기 호르몬 불균형',
      '척추뼈의 선천적인 기형',
      '잘못된 생활 습관',
    ],
  },
  {
    id: 'lumbar-disc',
    title: '허리디스크',
    image: '/generated/lumbar-disc/lumbar-disease-disc.png',
    imageAlt: '허리디스크를 설명하는 요추 의료 이미지',
    description:
      '허리 디스크는 척추뼈 사이에 위치하여 충격을 흡수하는 디스크(추간판)가 손상되거나 탈출하여 신경을 눌러 통증을 유발하는 질환을 말합니다. 정확한 의학 용어로는 요추 추간판 탈출증이라고 합니다.',
    symptoms: [
      '허리, 엉덩이, 다리까지 이어지는 통증',
      '다리나 발에 저림 및 감각 이상',
      '다리나 발의 근력이 약해지거나 마비 증상',
      '심한 경우 배뇨 및 배변 장애',
    ],
    causes: [
      '노화로 인해 디스크 수분 함량 감소 및 탄력 감소',
      '교통사고, 낙상 등 외부 충격',
      '장시간 구부정한 자세, 허리에 무리가 가는 자세 반복',
      '허리에 부담을 주는 무거운 물건 반복적으로 드는 경우',
    ],
  },
  {
    id: 'compression-fracture',
    title: '척추압박골절',
    image: '/generated/lumbar-disc/lumbar-disease-compression-fracture.png',
    imageAlt: '척추압박골절 진료 장면을 표현한 의료 이미지',
    description:
      '척추압박골절은 외부의 강한 충격이나 골다공증과 같은 질환으로 인해 척추뼈가 눌리면서 찌그러지거나 주저앉는 골절을 말합니다. 주로 골다공증으로 뼈가 약해진 노년층에서 많이 발생하지만, 젊은 층에서도 낙상 등의 사고로 발생할 수 있습니다.',
    symptoms: [
      '골절 부위 통증',
      '허리 움직임 제한',
      '압통(누르거나 두드릴 때 심해지는 통증)',
      '심한 경우, 다리 저림, 감각 이상, 마비 등',
    ],
    causes: [
      '노화로 인한 뼈의 밀도 감소',
      '교통사고, 낙상 등 외부 충격',
      '장기간 스테로이드 사용',
      '칼슘 부족',
    ],
  },
  {
    id: 'spinal-stenosis',
    title: '척추관협착증',
    image: '/generated/lumbar-disc/lumbar-disease-stenosis.png',
    imageAlt: '척추관협착증을 설명하는 요추 의료 이미지',
    description:
      '척추관협착증은 척추 신경이 지나가는 통로인 척추관, 신경근관, 또는 추간공이 좁아져서 허리 통증이나 다리 저림 등 신경 증상을 유발하는 질환입니다.',
    symptoms: [
      '둔하고 묵직하거나 찌릿찌릿한 허리 통증',
      '다리 통증 및 저림',
      '심한 경우, 하지 마비 및 감각 이상',
      '추운 겨울, 활동 시 통증 악화',
      '따뜻하게 하거나 안정을 취하면 호전',
    ],
    causes: [
      '노화로 인한 퇴행성 변화',
      '허리디스크로 인한 신경 압박',
      '척추 골절이나 외상으로 인한 척추관 손상',
      '뼈의 비정상적 성장',
      '척추관 내 종양 및 감염',
    ],
  },
];

const findDisease = (id: DiseaseId) => diseases.find((disease) => disease.id === id) ?? diseases[0];

const diseaseMarkers = [
  {
    diseaseId: 'compression-fracture',
    point: { left: '50%', top: '34%' },
    line: { left: '50%', top: '34%', width: '15%' },
    button: { left: '66%', top: '34%' },
  },
  {
    diseaseId: 'scoliosis',
    point: { left: '50%', top: '47%' },
    line: { left: '33%', top: '47%', width: '17%' },
    button: { left: '23%', top: '47%' },
  },
  {
    diseaseId: 'spinal-stenosis',
    point: { left: '50%', top: '58%' },
    line: { left: '50%', top: '58%', width: '15%' },
    button: { left: '66%', top: '58%' },
  },
  {
    diseaseId: 'lumbar-disc',
    point: { left: '50%', top: '69%' },
    line: { left: '32%', top: '69%', width: '18%' },
    button: { left: '23%', top: '69%' },
  },
] as const satisfies ReadonlyArray<{
  diseaseId: DiseaseId;
  point: { left: string; top: string };
  line: { left: string; top: string; width: string };
  button: { left: string; top: string };
}>;

const Marker = ({
  marker,
  onSelect,
}: {
  marker: (typeof diseaseMarkers)[number];
  onSelect: (id: DiseaseId) => void;
}) => {
  const disease = findDisease(marker.diseaseId);

  return (
    <>
      <span
        aria-hidden
        className="absolute z-20 hidden border-t-2 border-dashed border-primary/75 lg:block"
        style={marker.line}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute z-30 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 lg:block"
        style={marker.point}
      >
        <span className="animate-ripple absolute inset-0 rounded-full bg-primary/30" />
        <span className="animate-ripple-delayed absolute inset-0 rounded-full bg-primary/30" />
      </span>
      <button
        type="button"
        onClick={() => onSelect(marker.diseaseId)}
        aria-label={`${disease.title} 자세히 보기`}
        className="absolute z-40 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_rgba(38,84,190,0.24)] transition duration-300 hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 lg:flex"
        style={marker.point}
      >
        <span aria-hidden className="text-[19px] font-bold leading-none">
          !
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelect(marker.diseaseId)}
        className="absolute z-50 hidden -translate-y-1/2 items-center rounded-full bg-primary px-5 py-2.5 text-[17px] font-bold tracking-tight text-white shadow-[0_14px_34px_rgba(38,84,190,0.2)] transition duration-300 hover:-translate-y-[calc(50%+2px)] hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 lg:flex"
        style={marker.button}
      >
        {disease.title}
      </button>
    </>
  );
};

const DetailBlock = ({ number, title, items }: { number: number; title: string; items: string[] }) => (
  <section>
    <h4 className="flex items-center gap-3 text-h4 tracking-tight text-ink">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[13px] font-bold text-white">
        {number}
      </span>
      {title}
    </h4>
    <ul className="mt-4 space-y-2 break-keep text-body text-ink-sub sm:text-[16px] md:text-[17px] md:leading-relaxed">
      {items.map((item) => (
        <li key={item}>· {item}</li>
      ))}
    </ul>
  </section>
);

const DiseaseModal = ({
  disease,
  onClose,
}: {
  disease: Disease;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/68 px-3 py-4 backdrop-blur-[2px] sm:px-4 sm:py-6"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }}
  >
    <article
      role="dialog"
      aria-modal="true"
      aria-labelledby="lumbar-disease-modal-title"
      className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[760px] flex-col overflow-hidden rounded-[1rem] bg-white shadow-[0_30px_100px_-40px_rgba(0,0,0,0.65)] sm:max-h-[79vh] sm:rounded-[1.15rem]"
    >
      <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 bg-navy-900 px-5 py-2 text-white sm:h-20 sm:px-7 sm:py-0">
        <h3 id="lumbar-disease-modal-title" className="break-keep text-h4 leading-tight tracking-tight">
          {disease.title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="팝업 닫기"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/20 sm:h-11 sm:w-11"
        >
          <X size={32} strokeWidth={1.8} />
        </button>
      </header>

      <div className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-8 md:px-10 md:py-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100 sm:aspect-[16/7] sm:rounded-sm">
          <Image
            src={disease.image}
            alt={disease.imageAlt}
            fill
            sizes="(min-width: 768px) 560px, calc(100vw - 56px)"
            className="object-cover"
          />
        </div>

        <p className="mt-6 break-keep text-[16px] font-semibold leading-[1.7] tracking-tight text-ink sm:mt-8 sm:text-[18px] sm:leading-relaxed md:text-[20px]">
          {disease.description}
        </p>

        <div className="my-6 h-px bg-slate-200 sm:my-8" />

        <div className="space-y-8 sm:space-y-10">
          <DetailBlock number={1} title="증상" items={disease.symptoms} />
          <DetailBlock number={2} title="원인" items={disease.causes} />
        </div>
      </div>
    </article>
  </div>
);

const LumbarDiseaseSection = () => {
  const [activeDiseaseId, setActiveDiseaseId] = useState<DiseaseId | null>(null);
  const activeDisease = activeDiseaseId ? findDisease(activeDiseaseId) : null;

  useEffect(() => {
    if (!activeDiseaseId) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDiseaseId(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDiseaseId]);

  return (
    <section className="bg-[#F5F7FA] px-5 py-16 sm:px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal amount={0.24}>
          <div className="text-center">
            <h2 className="break-keep text-h2 tracking-tight text-ink">
              지긋지긋한 허리 통증,
              <br className="hidden md:block" />
              제대로 알아야 건강을 되찾을 수 있습니다
            </h2>
            <div className="mt-6 inline-flex w-full max-w-[34rem] items-start gap-2.5 rounded-xl bg-white px-4 py-3 text-left text-[14px] font-extrabold leading-[1.55] text-navy-900 shadow-[0_18px_40px_-30px_rgba(15,29,54,0.45)] sm:mt-8 sm:w-auto sm:items-center sm:gap-3 sm:px-5 sm:text-[1rem]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">
                <span aria-hidden className="text-[13px] font-bold leading-none">
                  !
                </span>
              </span>
              관심있는 질환을 눌러 자세한 내용을 확인해 보세요.
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-12 md:mt-24" amount={0.18}>
          <div className="relative overflow-hidden rounded-[1.25rem] border border-slate-100 bg-white px-5 py-6 shadow-[0_24px_70px_rgba(15,29,54,0.07)] sm:px-7 sm:py-8 lg:min-h-[620px] lg:rounded-[28px] lg:px-14 lg:py-14">
            <h3 className="relative z-10 text-h3 tracking-tight text-ink">
              허리 통증 주요 질환
            </h3>

            <div className="absolute inset-x-[6%] bottom-[2%] top-[8%] hidden [-webkit-mask-image:linear-gradient(180deg,transparent_0%,black_9%,black_91%,transparent_100%)] [mask-image:linear-gradient(180deg,transparent_0%,black_9%,black_91%,transparent_100%)] lg:block">
              <Image
                src="/generated/lumbar-disc/lumbar-disease-map-illustration.png"
                alt=""
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-contain object-center opacity-[0.76]"
              />
            </div>

            {diseaseMarkers.map((marker) => (
              <Marker key={marker.diseaseId} marker={marker} onSelect={setActiveDiseaseId} />
            ))}

            <div className="relative z-10 mt-8 grid gap-2.5 lg:hidden">
              {diseases.map((disease) => (
                <button
                  key={disease.id}
                  type="button"
                  onClick={() => setActiveDiseaseId(disease.id)}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 text-left text-[1rem] font-bold text-white shadow-[0_16px_34px_-24px_rgba(40,74,165,0.8)] sm:rounded-2xl sm:px-5 sm:py-4 sm:text-[1.1rem]"
                >
                  <span>{disease.title}</span>
                  <span aria-hidden="true" className="shrink-0 text-[12px] font-bold text-white/75 sm:text-sm">자세히</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {activeDisease && <DiseaseModal disease={activeDisease} onClose={() => setActiveDiseaseId(null)} />}
    </section>
  );
};

export default LumbarDiseaseSection;

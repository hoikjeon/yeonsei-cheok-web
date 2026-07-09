'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

type DiseaseId = 'neck-disc' | 'cervicogenic-headache' | 'forward-head';

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
    id: 'neck-disc',
    title: '목디스크',
    image: '/generated/neck-disc-neutral-hero.png',
    imageAlt: '목디스크를 설명하는 경추 의료 이미지',
    description:
      '목 디스크는 경추(목뼈) 사이의 추간판(디스크)이 손상되어 제자리에서 밀려나와 신경을 압박하는 질환입니다. 정확한 의학 용어로는 경추 추간판 탈출증이라고 합니다.',
    symptoms: [
      '뒷목의 뻐근함과 뻣뻣함, 뒷목 통증을 동반',
      '목을 뒤로 젖힐 때 어깨, 팔과 손이 뻣뻣함',
      '팔에 힘이 빠지고 몸의 반쪽이 저리고 둔해짐',
      '두통, 현기증, 어지럼증, 이명 증상이 나타남 등',
    ],
    causes: [
      '엎드려서 책을 보거나 자는 자세',
      '높은 베개를 사용하는 경우',
      '무리한 운동이나 과도한 업무',
      '컴퓨터와 스마트폰을 나쁜 자세로 장시간 사용',
      '교통사고로 인한 후유증',
      '목에 무거운 목걸이, 카드 지갑을 걸고 다니는 경우 등',
    ],
  },
  {
    id: 'cervicogenic-headache',
    title: '경추성 두통',
    image: '/generated/neck-disc-symptom-headache.png',
    imageAlt: '경추성 두통과 목 통증을 표현한 의료 이미지',
    description:
      '경추성 두통은 목 근육과 경추 문제로 인해 발생하는 두통으로 MRI·CT는 정상이어도 자세 불균형과 목 긴장이 원인일 수 있습니다.',
    symptoms: [
      '뒤통수부터 관자놀이·눈 주변까지 이어지는 두통',
      '목과 어깨가 뻣뻣하고 묵직하게 뭉치는 느낌',
      '오래 앉아 있거나 퇴근 시간 쯤 두통이 심해짐',
      '목을 움직일 때 두통이 더 심해지는 증상 등',
    ],
    causes: [
      '거북목, 일자목 같은 잘못된 자세',
      '스마트폰·컴퓨터를 장시간 사용하는 습관',
      '목과 어깨 근육의 지속적인 긴장',
      '잘못된 수면 자세 및 높은 베개 사용',
      '교통사고, 외상 이후 목 주변 기능 저하 등',
    ],
  },
  {
    id: 'forward-head',
    title: '거북목',
    image: '/generated/neck-disc-symptom-posture.png',
    imageAlt: '거북목 자세와 목 통증을 표현한 의료 이미지',
    description:
      '거북목은 정상적인 C자 형태의 목뼈 배열이 일자로 또는 거꾸로 된 C자 형태로 변형된 상태를 말합니다.',
    symptoms: [
      '등이 굽어지고 어깨가 앞으로 굽는 자세',
      '목덜미가 뻐근하고 당기는 듯한 통증',
      '긴장성 두통 및 어지럼증',
      '눈의 피로감 및 시력 저하',
      '팔이나 손의 저림',
      '만성피로',
    ],
    causes: [
      '장시간 고개를 숙이는 자세',
      '엎드리거나 구부정한 자세로 앉는 습관',
      '목 주변 근육 불균형',
      '목뼈와 주변 조직의 퇴행성 변화',
      '외상, 신경 손상 등',
    ],
  },
];

const findDisease = (id: DiseaseId) => diseases.find((disease) => disease.id === id) ?? diseases[0];

const diseaseMarkers = [
  {
    // 왼쪽 인물(정상 자세)의 경추 중간 지점 — 라벨(왼쪽) → 점선 → 포인트 순서
    diseaseId: 'neck-disc',
    point: { left: '36.5%', top: '57.5%' },
    line: { left: '28%', top: '57.5%', width: '8.5%' },
    button: { left: '19%', top: '57.5%' },
  },
  {
    // 오른쪽 인물의 후두부(뒤통수 아래) — 포인트 → 점선 → 라벨(오른쪽) 순서
    diseaseId: 'cervicogenic-headache',
    point: { left: '66%', top: '45.5%' },
    line: { left: '66%', top: '45.5%', width: '8%' },
    button: { left: '74%', top: '45.5%' },
  },
  {
    // 오른쪽 인물(거북목)의 경추 중간 지점 — 포인트 → 점선 → 라벨(오른쪽) 순서
    diseaseId: 'forward-head',
    point: { left: '66.2%', top: '60.5%' },
    line: { left: '66.2%', top: '60.5%', width: '7.8%' },
    button: { left: '74%', top: '60.5%' },
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
        className="absolute z-20 hidden border-t-2 border-dashed border-primary/75 md:block"
        style={marker.line}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute z-30 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 md:block"
        style={marker.point}
      >
        <span className="animate-ripple absolute inset-0 rounded-full bg-primary/30" />
        <span className="animate-ripple-delayed absolute inset-0 rounded-full bg-primary/30" />
      </span>
      <button
        type="button"
        onClick={() => onSelect(marker.diseaseId)}
        aria-label={`${disease.title} 자세히 보기`}
        className="absolute z-40 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_rgba(38,84,190,0.24)] transition duration-300 hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 md:flex"
        style={marker.point}
      >
        <span aria-hidden className="text-[19px] font-black leading-none">
          !
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelect(marker.diseaseId)}
        className="absolute z-50 hidden -translate-y-1/2 items-center rounded-full bg-primary px-5 py-2.5 text-[17px] font-black tracking-tight text-white shadow-[0_14px_34px_rgba(38,84,190,0.2)] transition duration-300 hover:-translate-y-[calc(50%+2px)] hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 md:flex"
        style={marker.button}
      >
        {disease.title}
      </button>
    </>
  );
};

const DetailBlock = ({ number, title, items }: { number: number; title: string; items: string[] }) => (
  <section>
    <h4 className="flex items-center gap-3 text-[19px] font-black tracking-tight text-ink">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[13px] font-black text-white">
        {number}
      </span>
      {title}
    </h4>
    <ul className="mt-4 space-y-2 text-[16px] font-medium leading-relaxed text-ink-sub md:text-[17px]">
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
    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/68 px-4 py-6 backdrop-blur-[2px]"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }}
  >
    <article
      role="dialog"
      aria-modal="true"
      aria-labelledby="neck-disease-modal-title"
      className="flex max-h-[79vh] w-full max-w-[615px] flex-col overflow-hidden rounded-[1.15rem] bg-white shadow-[0_30px_100px_-40px_rgba(0,0,0,0.65)]"
    >
      <header className="flex h-20 shrink-0 items-center justify-between bg-navy-900 px-7 text-white">
        <h3 id="neck-disease-modal-title" className="text-[1.45rem] font-black tracking-tight">
          {disease.title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="팝업 닫기"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/20"
        >
          <X size={32} strokeWidth={1.8} />
        </button>
      </header>

      <div className="overflow-y-auto px-7 py-8 md:px-10 md:py-10">
        <div className="relative aspect-[16/7] overflow-hidden rounded-sm bg-slate-100">
          <Image
            src={disease.image}
            alt={disease.imageAlt}
            fill
            sizes="(min-width: 768px) 560px, calc(100vw - 56px)"
            className="object-cover"
          />
        </div>

        <p className="mt-8 text-[18px] font-semibold leading-relaxed tracking-tight text-ink md:text-[20px]">
          {disease.description}
        </p>

        <div className="my-8 h-px bg-slate-200" />

        <div className="space-y-10">
          <DetailBlock number={1} title="증상" items={disease.symptoms} />
          <DetailBlock number={2} title="원인" items={disease.causes} />
        </div>
      </div>
    </article>
  </div>
);

const NeckDiseaseSection = () => {
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
    <section className="bg-[#F5F7FA] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal amount={0.24}>
          <div className="text-center">
            <h2 className="text-4xl font-black leading-[1.18] tracking-tight text-ink md:text-[3.25rem]">
              작은 통증이라도, 관심을 갖고 관리해야
              <br />
              더 큰 질환을 예방할 수 있습니다.
            </h2>
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-[1rem] font-extrabold text-navy-900 shadow-[0_18px_40px_-30px_rgba(15,29,54,0.45)]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-white">
                <span aria-hidden className="text-[13px] font-black leading-none">
                  !
                </span>
              </span>
              관심있는 질환을 눌러 자세한 내용을 확인해 보세요.
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-24" amount={0.18}>
          <div className="relative min-h-[540px] overflow-hidden rounded-[28px] border border-slate-100 bg-white px-7 py-10 shadow-[0_24px_70px_rgba(15,29,54,0.07)] md:min-h-[620px] md:px-14 md:py-14">
            <h3 className="relative z-10 text-3xl font-black tracking-tight text-ink md:text-[2.25rem]">
              목 통증 주요 질환
            </h3>

            <div className="absolute inset-x-[7%] bottom-[5%] top-[12%] hidden md:block">
              <Image
                src="/generated/neck-disease-map-illustration.png"
                alt=""
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-contain object-center opacity-[0.82]"
              />
            </div>

            {diseaseMarkers.map((marker) => (
              <Marker key={marker.diseaseId} marker={marker} onSelect={setActiveDiseaseId} />
            ))}

            <div className="relative z-10 mt-12 grid gap-3 md:hidden">
              {diseases.map((disease) => (
                <button
                  key={disease.id}
                  type="button"
                  onClick={() => setActiveDiseaseId(disease.id)}
                  className="flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-left text-[1.1rem] font-black text-white shadow-[0_16px_34px_-24px_rgba(40,74,165,0.8)]"
                >
                  <span>{disease.title}</span>
                  <span aria-hidden="true">보기</span>
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

export default NeckDiseaseSection;

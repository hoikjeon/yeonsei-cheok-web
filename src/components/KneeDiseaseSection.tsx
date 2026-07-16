'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ScrollReveal from '@/components/ScrollReveal';

const ASSET_ROOT = '/images/treatments/joint/knee';

type KneeDiseaseId = 'osteoarthritis' | 'chondromalacia' | 'joint-injury';

interface KneeDisease {
  id: KneeDiseaseId;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  symptoms: string[];
  causes: string[];
  guidance: string;
}

const diseases: KneeDisease[] = [
  {
    id: 'osteoarthritis',
    title: '퇴행성관절염',
    image: `${ASSET_ROOT}/knee-disease-osteoarthritis.webp`,
    imageAlt: '무릎 퇴행성관절염의 관절 변화를 표현한 의료 일러스트',
    description:
      '퇴행성관절염은 연골만 닳는 병이 아니라 연골, 뼈, 활막, 반월상연골과 인대 등 무릎관절 전체에 변화가 생기는 질환입니다.',
    symptoms: [
      '걷기와 계단 오르내리기 같은 활동 중 통증',
      '아침이나 오래 쉰 뒤 나타나는 짧은 뻣뻣함',
      '활동 후 붓기와 운동 범위 감소',
      '무릎이 약해지거나 휘청거리는 느낌',
    ],
    causes: [
      '나이에 따른 관절 조직 변화',
      '과체중으로 인한 반복 하중',
      '과거 무릎 손상이나 수술',
      '반복 사용과 관절 정렬 문제',
    ],
    guidance:
      '치료는 운동·근력 강화·체중 관리 등 비수술 치료부터 시작합니다. 퇴행성관절염 자체만을 치료하기 위한 관절경 세척·변연절제술은 일반적으로 권고되지 않습니다.',
  },
  {
    id: 'chondromalacia',
    title: '연골연화증',
    image: `${ASSET_ROOT}/knee-disease-chondromalacia.webp`,
    imageAlt: '무릎뼈 아래 연골연화증을 표현한 의료 일러스트',
    description:
      '연골연화증은 무릎뼈 안쪽의 관절연골이 부드러워지고 손상된 상태입니다. 모든 앞무릎 통증이 연골연화증을 의미하는 것은 아닙니다.',
    symptoms: [
      '계단을 오르내릴 때 심해지는 앞무릎 통증',
      '쪼그려 앉거나 달릴 때 나타나는 통증',
      '무릎을 굽힌 채 오래 앉은 뒤 생기는 불편감',
      '무릎을 움직일 때 느껴지는 마찰감',
    ],
    causes: [
      '반복되는 무릎 굽힘과 갑작스러운 운동량 증가',
      '무릎뼈 움직임과 다리 정렬의 불균형',
      '엉덩이·허벅지 주변 근육 약화',
      '직접적인 외상이나 과사용',
    ],
    guidance:
      '활동 조절과 엉덩이·허벅지 근육을 포함한 운동치료로 좋아지는 경우가 많습니다. 증상과 진찰 소견을 함께 살펴 치료 방향을 정합니다.',
  },
  {
    id: 'joint-injury',
    title: '반월상연골·인대 손상',
    image: `${ASSET_ROOT}/knee-disease-joint-injury.webp`,
    imageAlt: '무릎 반월상연골과 십자인대 손상을 표현한 의료 일러스트',
    description:
      '반월상연골은 충격을 분산하고, 인대는 무릎이 과도하게 움직이지 않도록 잡아줍니다. 비틀림이나 충돌로 손상되면 움직임과 안정성이 떨어질 수 있습니다.',
    symptoms: [
      '관절선 주변의 통증과 붓기',
      '무릎이 걸리거나 실제로 잠기는 느낌',
      '방향을 바꿀 때 무릎이 빠질 듯한 불안정감',
      '운동 범위 감소와 반복되는 힘 빠짐',
    ],
    causes: [
      '급격한 방향 전환과 잘못된 착지',
      '스포츠 활동 중 비틀림',
      '무릎에 가해진 직접적인 충격',
      '퇴행성 변화가 있는 상태에서의 가벼운 손상',
    ],
    guidance:
      '모든 손상이 곧바로 수술을 의미하지는 않습니다. 다만 찢어진 조직이 움직임을 막는 급성 손상, 실제 잠김, 반복되는 불안정성은 조기 평가가 필요합니다.',
  },
];

const markers = [
  { id: 'osteoarthritis', left: '46%', top: '64%', align: 'left' },
  { id: 'chondromalacia', left: '50%', top: '38%', align: 'left' },
  { id: 'joint-injury', left: '54%', top: '58%', align: 'right' },
] as const satisfies ReadonlyArray<{
  id: KneeDiseaseId;
  left: string;
  top: string;
  align: 'left' | 'right';
}>;

const findDisease = (id: KneeDiseaseId) =>
  diseases.find((disease) => disease.id === id) ?? diseases[0];

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h4 className="text-[1.05rem] font-bold tracking-tight text-ink sm:text-lg">{title}</h4>
      <ul className="mt-3 space-y-2 text-body text-ink-sub sm:leading-relaxed">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function KneeDiseaseModal({ disease, onClose }: { disease: KneeDisease; onClose: () => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-navy-950/72 px-3 py-4 backdrop-blur-[3px] sm:px-5 sm:py-7"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[1.15rem] bg-white shadow-[0_36px_120px_-44px_rgba(0,0,0,0.75)] sm:max-h-[86dvh] sm:rounded-[1.5rem]"
      >
        <header className="flex min-h-16 shrink-0 items-center justify-between gap-4 bg-navy-900 px-4 text-white sm:min-h-20 sm:px-7">
          <h3 id={titleId} className="min-w-0 text-[1.15rem] font-bold leading-snug tracking-tight sm:text-2xl">
            {disease.title}
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="질환 안내 팝업 닫기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={27} strokeWidth={1.8} />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto overscroll-contain">
          <div className="relative aspect-[4/3] w-full bg-white sm:aspect-[16/9]">
            <Image
              src={disease.image}
              alt={disease.imageAlt}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-contain"
            />
          </div>

          <div className="space-y-7 px-4 py-6 sm:space-y-9 sm:px-8 sm:py-8">
            <p id={descriptionId} className="text-[15px] font-semibold leading-[1.75] text-ink sm:text-[17px] sm:leading-relaxed">
              {disease.description}
            </p>

            <div className="grid gap-7 border-t border-slate-200 pt-7 sm:grid-cols-2 sm:gap-9 sm:pt-9">
              <DetailList title="주요 증상" items={disease.symptoms} />
              <DetailList title="관련 요인" items={disease.causes} />
            </div>

            <div className="rounded-2xl bg-primary-light/75 p-4 ring-1 ring-primary/10 sm:p-5">
              <p className="text-[14px] font-bold leading-[1.7] text-primary-dark sm:text-[16px] sm:leading-relaxed">
                {disease.guidance}
              </p>
            </div>

            <p className="text-[12px] font-medium leading-relaxed text-slate-400 sm:text-[13px]">
              이미지는 질환 이해를 돕기 위한 의료 일러스트이며, 정확한 진단과 치료는 진찰 및 검사 결과에 따라 달라집니다.
            </p>
          </div>
        </div>
      </article>
    </div>,
    document.body,
  );
}

export default function KneeDiseaseSection() {
  const [activeDiseaseId, setActiveDiseaseId] = useState<KneeDiseaseId | null>(null);
  const activeDisease = activeDiseaseId ? findDisease(activeDiseaseId) : null;

  return (
    <section className="overflow-hidden bg-[#eef3fc] px-4 py-16 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal amount={0.24} className="mx-auto max-w-5xl text-center">
          <h2 className="break-keep text-h2 tracking-tight text-ink md:leading-[1.16]">
            삶의 질을 떨어뜨리는 무릎 통증,
            <br className="hidden sm:block" />
            원인부터 정확히 살펴봅니다
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-[15px] font-semibold leading-[1.75] text-ink-sub sm:text-lg sm:leading-relaxed">
            관심 있는 부위를 눌러 주요 질환의 증상과 원인을 확인해 보세요.
          </p>
        </ScrollReveal>

        <ScrollReveal amount={0.18} className="mt-12 md:mt-24">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-[#edf5fb] shadow-[0_34px_90px_-56px_rgba(10,30,72,0.45)] ring-1 ring-navy-900/5 sm:rounded-[2rem]">
            <div className="relative aspect-video w-full overflow-hidden bg-[#edf5fb]">
              <Image
                src={`${ASSET_ROOT}/knee-disease-map-single.webp`}
                alt="정면 무릎 관절의 주요 구조를 보여주는 의료 일러스트"
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-contain object-center"
              />

              {markers.map((marker) => {
                const disease = findDisease(marker.id);
                return (
                  <button
                    key={marker.id}
                    type="button"
                    onClick={() => setActiveDiseaseId(marker.id)}
                    style={{ left: marker.left, top: marker.top }}
                    className={`group absolute z-20 hidden -translate-y-1/2 items-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 lg:flex ${
                      marker.align === 'left' ? '-translate-x-full flex-row-reverse' : ''
                    }`}
                    aria-label={`${disease.title} 자세히 보기`}
                  >
                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_14px_30px_-15px_rgba(40,74,165,0.9)]">
                      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2">
                        <span className="animate-ripple absolute inset-0 rounded-full bg-primary/30" />
                        <span className="animate-ripple-delayed absolute inset-0 rounded-full bg-primary/30" />
                      </span>
                      <span aria-hidden className="relative h-2 w-2 rounded-full bg-white" />
                    </span>
                    <span className="whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-[15px] font-bold text-white shadow-[0_16px_32px_-18px_rgba(40,74,165,0.75)] transition group-hover:bg-primary-dark">
                      {disease.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-2.5 p-3 min-[360px]:grid-cols-2 sm:p-5 lg:hidden">
              {diseases.map((disease) => (
                <button
                  key={disease.id}
                  type="button"
                  onClick={() => setActiveDiseaseId(disease.id)}
                  className="flex min-h-14 items-center justify-between gap-2 rounded-xl bg-primary px-4 py-3 text-left text-[0.95rem] font-bold leading-snug text-white shadow-[0_16px_34px_-24px_rgba(40,74,165,0.8)] transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:min-h-16 sm:rounded-2xl sm:text-[1.05rem]"
                >
                  <span>{disease.title}</span>
                  <span aria-hidden className="shrink-0 text-xs font-bold text-white/75">자세히</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {activeDisease ? (
        <KneeDiseaseModal disease={activeDisease} onClose={() => setActiveDiseaseId(null)} />
      ) : null}
    </section>
  );
}

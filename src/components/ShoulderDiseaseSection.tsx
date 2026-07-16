'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ScrollReveal from '@/components/ScrollReveal';

const ASSET_ROOT = '/images/treatments/joint/shoulder';

type ShoulderDiseaseId = 'rotator-cuff' | 'frozen-shoulder' | 'calcific-tendinitis';

interface ShoulderDisease {
  id: ShoulderDiseaseId;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  symptoms: string[];
  factors: string[];
  guidance: string;
}

const diseases: ShoulderDisease[] = [
  {
    id: 'rotator-cuff',
    title: '회전근개 파열',
    image: `${ASSET_ROOT}/shoulder-disease-rotator-cuff.webp`,
    imageAlt: '상완골 부착 부위에서 찢어진 회전근개 힘줄을 보여주는 의료 일러스트',
    description:
      '회전근개 파열은 어깨를 들고 돌리는 힘줄이 부분적으로 또는 완전히 찢어진 상태입니다. 영상에서 파열이 보이더라도 통증과 근력, 생활 불편을 함께 살펴야 합니다.',
    symptoms: [
      '어깨 앞쪽과 바깥쪽으로 이어지는 통증',
      '팔을 들거나 내릴 때 심해지는 통증',
      '아픈 쪽으로 누울 때 나타나는 야간 통증',
      '팔을 들어 올리는 힘이 약해지는 느낌',
    ],
    factors: [
      '나이에 따른 힘줄의 퇴행성 변화',
      '머리 위 동작을 반복하는 일이나 운동',
      '넘어지며 팔을 짚는 급성 외상',
      '무거운 물건을 갑자기 드는 동작',
    ],
    guidance:
      '모든 파열이 수술을 의미하지는 않습니다. 파열의 크기와 발생 시점, 통증, 근력, 활동 수준과 비수술 치료 반응을 종합해 치료 방향을 정합니다.',
  },
  {
    id: 'frozen-shoulder',
    title: '오십견',
    image: `${ASSET_ROOT}/shoulder-disease-frozen.webp`,
    imageAlt: '두꺼워지고 뻣뻣해진 어깨 관절낭을 보여주는 의료 일러스트',
    description:
      '오십견은 어깨 관절을 둘러싼 관절낭이 두꺼워지고 뻣뻣해지면서 통증과 운동 제한이 나타나는 질환입니다. 스스로 움직일 때뿐 아니라 다른 사람이 움직여도 범위가 제한되는 특징이 있습니다.',
    symptoms: [
      '밤에 심해지는 묵직한 어깨 통증',
      '팔을 위로 올리거나 뒤로 돌리기 어려움',
      '옷 입기와 머리 감기 같은 일상 동작의 불편',
      '시간이 지나며 점차 심해지는 뻣뻣함',
    ],
    factors: [
      '뚜렷한 원인 없이 발생하는 경우',
      '수술이나 골절 뒤 오랜 기간의 움직임 제한',
      '당뇨병과 갑상선 질환 등과의 연관성',
      '중년 이후 증가하는 발생 경향',
    ],
    guidance:
      '대부분 비수술 치료로 호전을 기대할 수 있지만 회복에는 수개월 이상이 걸릴 수 있습니다. 통증 단계에 맞춘 운동 범위 회복과 생활 관리가 중요합니다.',
  },
  {
    id: 'calcific-tendinitis',
    title: '석회성건염',
    image: `${ASSET_ROOT}/shoulder-disease-calcific.webp`,
    imageAlt: '회전근개 힘줄 안의 석회 침착을 보여주는 의료 일러스트',
    description:
      '석회성건염은 회전근개 힘줄 안에 칼슘 성분이 쌓여 염증과 통증을 일으키는 질환입니다. 석회의 크기와 위치, 주변 염증은 X-ray와 초음파 등으로 확인할 수 있습니다.',
    symptoms: [
      '갑자기 시작되는 매우 심한 어깨 통증',
      '아픈 쪽으로 눕기 어려운 야간 통증',
      '팔을 움직일 때 생기는 통증과 운동 제한',
      '어깨 앞쪽 또는 바깥쪽의 압통',
    ],
    factors: [
      '정확한 발생 원인은 아직 명확하지 않음',
      '힘줄 세포와 조직의 변화와 연관',
      '30~60대에서 비교적 흔한 발생',
      '회전근개 힘줄 안의 칼슘 침착',
    ],
    guidance:
      '대부분은 약물과 운동치료 등 비수술 치료를 먼저 시행합니다. 통증과 기능 제한이 지속되면 체외충격파, 초음파 유도 치료 또는 관절내시경을 개별적으로 검토할 수 있습니다.',
  },
];

const markers = [
  { id: 'calcific-tendinitis', left: '37%', top: '31%', align: 'left' },
  { id: 'rotator-cuff', left: '40%', top: '40%', align: 'right' },
  { id: 'frozen-shoulder', left: '41%', top: '51%', align: 'left' },
] as const satisfies ReadonlyArray<{
  id: ShoulderDiseaseId;
  left: string;
  top: string;
  align: 'left' | 'right';
}>;

const findDisease = (id: ShoulderDiseaseId) =>
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

function ShoulderDiseaseModal({ disease, onClose }: { disease: ShoulderDisease; onClose: () => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
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
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[1.15rem] bg-white shadow-[0_36px_120px_-44px_rgba(0,0,0,0.75)] sm:max-h-[86dvh] sm:rounded-[1.5rem]"
      >
        <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 bg-navy-900 px-4 text-white sm:min-h-20 sm:px-7">
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
        </div>

        <div
          tabIndex={0}
          aria-label={`${disease.title} 상세 내용`}
          className="min-h-0 overflow-y-auto overscroll-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <div className="relative aspect-video w-full bg-[#edf5fb]">
            <Image
              src={disease.image}
              alt={disease.imageAlt}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-7 px-4 py-6 sm:space-y-9 sm:px-8 sm:py-8">
            <p id={descriptionId} className="text-[15px] font-semibold leading-[1.75] text-ink sm:text-[17px] sm:leading-relaxed">
              {disease.description}
            </p>

            <div className="grid gap-7 border-t border-slate-200 pt-7 sm:grid-cols-2 sm:gap-9 sm:pt-9">
              <DetailList title="주요 증상" items={disease.symptoms} />
              <DetailList title="관련 요인" items={disease.factors} />
            </div>

            <div className="rounded-2xl bg-primary-light/75 p-4 ring-1 ring-primary/10 sm:p-5">
              <p className="text-[14px] font-bold leading-[1.7] text-primary-dark sm:text-[16px] sm:leading-relaxed">
                {disease.guidance}
              </p>
            </div>

            <p className="text-[13px] font-medium leading-relaxed text-slate-600 sm:text-[14px]">
              이미지는 질환 이해를 돕기 위한 의료 일러스트이며, 정확한 진단과 치료는 진찰 및 검사 결과에 따라 달라집니다.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ShoulderDiseaseSection() {
  const [activeDiseaseId, setActiveDiseaseId] = useState<ShoulderDiseaseId | null>(null);
  const activeDisease = activeDiseaseId ? findDisease(activeDiseaseId) : null;

  return (
    <section className="overflow-hidden bg-[#eef3fc] px-4 py-16 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal amount={0.24} className="mx-auto max-w-5xl text-center">
          <h2 className="break-keep text-h2 tracking-tight text-ink md:leading-[1.16]">
            일상을 방해하는 어깨 통증,
            <br className="hidden sm:block" />
            정확한 이해가 회복의 시작입니다
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-[15px] font-semibold leading-[1.75] text-ink-sub sm:text-lg sm:leading-relaxed">
            관심 있는 부위를 눌러 주요 질환의 증상과 관련 요인을 확인해 보세요.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="image" amount={0.18} className="mt-12 md:mt-20">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-[#edf5fb] shadow-[0_34px_90px_-56px_rgba(10,30,72,0.45)] ring-1 ring-navy-900/5 sm:rounded-[2rem]">
            <div className="relative aspect-video w-full overflow-hidden bg-[#edf5fb]">
              <Image
                src={`${ASSET_ROOT}/shoulder-disease-map-v2.webp`}
                alt="어깨 관절과 회전근개, 관절낭 구조를 상세히 보여주는 의료 일러스트"
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-cover object-center"
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

            <div className="grid gap-2.5 bg-[#edf5fb] p-3 sm:grid-cols-3 sm:p-5 lg:hidden">
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
        <ShoulderDiseaseModal disease={activeDisease} onClose={() => setActiveDiseaseId(null)} />
      ) : null}
    </section>
  );
}

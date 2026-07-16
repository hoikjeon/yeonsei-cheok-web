'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ScrollReveal from '@/components/ScrollReveal';

const ASSET_ROOT = '/images/treatments/joint/wrist-ankle';

type WristAnkleDiseaseId = 'ankle-sprain' | 'achilles' | 'plantar' | 'dequervain' | 'carpal-tunnel';

interface WristAnkleDisease {
  id: WristAnkleDiseaseId;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  symptoms: string[];
  factors: string[];
  guidance: string;
}

const diseases: WristAnkleDisease[] = [
  {
    id: 'ankle-sprain',
    title: '발목 인대 염좌',
    image: `${ASSET_ROOT}/wrist-ankle-disease-sprain.webp`,
    imageAlt: '바깥쪽 발목 인대 손상과 부종을 보여주는 의료 일러스트',
    description:
      '발목 인대 염좌는 발목을 지지하는 인대가 정상 범위보다 과도하게 늘어나 일부 또는 전체가 손상된 상태입니다. 심한 염좌는 골절과 증상이 비슷할 수 있어 통증 위치와 보행 가능 여부를 함께 확인해야 합니다.',
    symptoms: [
      '발목 안쪽 또는 바깥쪽의 통증과 압통',
      '발목 주변의 붓기와 멍',
      '걷거나 체중을 실을 때 심해지는 통증',
      '발목이 휘청거리거나 빠질 듯한 불안정감',
    ],
    factors: [
      '울퉁불퉁한 길에서 발을 잘못 디딘 경우',
      '급정지와 방향 전환이 많은 운동',
      '발목 근력과 균형 능력의 저하',
      '과거 발목 염좌와 충분하지 않은 재활',
    ],
    guidance:
      '발목 모양이 변했거나 발가락의 색·온도·감각이 달라진 경우, 다친 뒤 체중을 싣고 걷기 어려운 경우에는 골절을 포함한 다른 손상 가능성을 확인하기 위해 빠른 진료가 필요합니다.',
  },
  {
    id: 'achilles',
    title: '아킬레스건염',
    image: `${ASSET_ROOT}/wrist-ankle-disease-achilles.webp`,
    imageAlt: '종아리 근육과 뒤꿈치뼈를 잇는 아킬레스건의 손상 부위를 보여주는 의료 일러스트',
    description:
      '아킬레스건염은 종아리 근육과 뒤꿈치뼈를 잇는 아킬레스건이 반복적인 부하로 자극되고 손상돼 통증과 뻣뻣함이 생기는 상태입니다.',
    symptoms: [
      '아침 첫걸음 때 아킬레스건의 통증과 뻣뻣함',
      '활동할수록 심해지는 뒤꿈치 뒤쪽 통증',
      '운동 다음 날 더 두드러지는 통증',
      '아킬레스건이 두꺼워지거나 붓는 느낌',
    ],
    factors: [
      '달리기·점프 운동의 반복적인 부하',
      '운동 거리나 강도를 갑자기 늘린 경우',
      '신발 종류나 운동 환경의 갑작스러운 변화',
      '종아리 근육의 유연성 부족',
    ],
    guidance:
      '뒤꿈치나 종아리 뒤에서 갑자기 뚝 하는 느낌이 들고 발끝으로 서거나 바닥을 밀어내기 어렵다면 파열 가능성이 있으므로 당일 진료가 필요합니다.',
  },
  {
    id: 'plantar',
    title: '족저근막염',
    image: `${ASSET_ROOT}/wrist-ankle-disease-plantar.webp`,
    imageAlt: '뒤꿈치부터 발가락 방향으로 이어지는 족저근막의 통증 부위를 보여주는 의료 일러스트',
    description:
      '족저근막염은 발뒤꿈치부터 발가락 방향으로 이어져 발 아치를 지지하는 족저근막에 반복적인 부담과 미세 손상이 생겨 통증이 나타나는 질환입니다.',
    symptoms: [
      '발뒤꿈치 바닥이나 발 아치 통증',
      '아침에 내딛는 첫 몇 걸음의 심한 통증',
      '오래 앉아 있다 걸을 때 나타나는 통증',
      '뒤꿈치뼈 바로 앞쪽을 눌렀을 때의 압통',
    ],
    factors: [
      '운동량이나 활동량의 갑작스러운 증가',
      '단단한 바닥에서 장시간 서 있는 생활',
      '평발 또는 아치가 매우 높은 발',
      '뻣뻣한 종아리 근육과 체중 증가',
    ],
    guidance:
      '통증이 심해 보행이 어렵거나 자가 관리 후에도 호전되지 않는 경우, 발의 저림과 감각 저하가 동반되는 경우에는 피로골절이나 신경 문제 등 다른 원인을 확인해야 합니다.',
  },
  {
    id: 'dequervain',
    title: '드퀘르벵 건초염',
    image: `${ASSET_ROOT}/wrist-ankle-disease-dequervain.webp`,
    imageAlt: '엄지 쪽 손목 힘줄과 좁아진 힘줄 통로를 보여주는 의료 일러스트',
    description:
      '드퀘르벵 건초염은 엄지손가락을 움직이는 두 힘줄이 손목 엄지 쪽의 좁은 통로에서 원활하게 움직이지 못해 통증과 붓기가 생기는 질환입니다.',
    symptoms: [
      '손목 엄지 쪽 또는 엄지 뿌리의 통증',
      '물건을 잡거나 비틀고 들 때 심해지는 통증',
      '통증이 손목에서 아래팔 방향으로 퍼지는 느낌',
      '손목 엄지 쪽의 붓기와 움직임 제한',
    ],
    factors: [
      '엄지와 손목을 반복해서 사용하는 동작',
      '강하게 잡기·비틀기·아기 들어 올리기',
      '임신과 출산 후의 부종 변화',
      '류마티스관절염 등 염증성 질환',
    ],
    guidance:
      '외상 뒤 손목 모양이 변하거나 손의 힘·감각을 갑자기 잃은 경우, 손목이 붉고 뜨겁게 붓고 발열이 동반되는 경우에는 다른 손상이나 감염 가능성을 확인하기 위해 빠른 진료가 필요합니다.',
  },
  {
    id: 'carpal-tunnel',
    title: '수근관증후군',
    image: `${ASSET_ROOT}/wrist-ankle-disease-carpal-tunnel.webp`,
    imageAlt: '손목의 수근관 안에서 압박받는 정중신경을 보여주는 의료 일러스트',
    description:
      '수근관증후군은 손목의 좁은 수근관 안에서 정중신경이 눌려 엄지부터 약지 일부까지 저림·통증·감각 저하와 손 힘 약화가 생기는 질환입니다.',
    symptoms: [
      '엄지·검지·중지와 약지 일부의 저림과 감각 저하',
      '밤에 심해져 잠에서 깨는 통증과 저림',
      '단추 채우기 등 세밀한 손동작의 어려움',
      '물건을 자주 떨어뜨리거나 엄지 힘이 약해지는 느낌',
    ],
    factors: [
      '손목을 심하게 굽히거나 편 자세를 오래 유지하는 일',
      '반복적인 손 사용과 힘줄 주변의 자극',
      '임신 중 부종과 호르몬 변화',
      '당뇨병·류마티스관절염·갑상선질환',
    ],
    guidance:
      '감각 저하가 지속되거나 엄지 근육이 눈에 띄게 줄고 물건을 자주 떨어뜨린다면 조기 평가가 필요합니다. 한쪽 손의 갑작스러운 저림과 힘 빠짐에 얼굴 처짐·말 어눌함이 동반되면 즉시 응급 진료를 받아야 합니다.',
  },
];

const markers = [
  { id: 'ankle-sprain', left: '20%', top: '52%', align: 'right' },
  { id: 'achilles', left: '9%', top: '57%', align: 'right' },
  { id: 'plantar', left: '17%', top: '72%', align: 'right' },
  { id: 'dequervain', left: '86%', top: '70%', align: 'left' },
  { id: 'carpal-tunnel', left: '74%', top: '77%', align: 'left' },
] as const satisfies ReadonlyArray<{
  id: WristAnkleDiseaseId;
  left: string;
  top: string;
  align: 'left' | 'right';
}>;

const findDisease = (id: WristAnkleDiseaseId) =>
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

function WristAnkleDiseaseModal({
  disease,
  onClose,
}: {
  disease: WristAnkleDisease;
  onClose: () => void;
}) {
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

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

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
        tabIndex={-1}
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
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
            <p
              id={descriptionId}
              className="text-[15px] font-semibold leading-[1.75] text-ink sm:text-[17px] sm:leading-relaxed"
            >
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

export default function WristAnkleDiseaseSection() {
  const [activeDiseaseId, setActiveDiseaseId] = useState<WristAnkleDiseaseId | null>(null);
  const activeDisease = activeDiseaseId ? findDisease(activeDiseaseId) : null;
  const closeModal = useCallback(() => setActiveDiseaseId(null), []);

  return (
    <section className="overflow-hidden bg-[#eef3fc] px-4 py-16 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal amount={0.24} className="mx-auto max-w-5xl text-center">
          <h2 className="break-keep text-h2 tracking-tight text-ink md:leading-[1.16]">
            일상에 지장을 주는 <span className="whitespace-nowrap">손·발 통증,</span>
            <br className="hidden sm:block" />
            빠른 대처가 빠른 회복을 만듭니다
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-[15px] font-semibold leading-[1.75] text-ink-sub sm:text-lg sm:leading-relaxed">
            관심 있는 부위를 눌러 주요 질환의 증상과 관련 요인을 확인해 보세요.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="image" amount={0.18} className="mt-12 md:mt-20">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-[#edf5fb] shadow-[0_34px_90px_-56px_rgba(10,30,72,0.45)] ring-1 ring-navy-900/5 sm:rounded-[2rem]">
            <div className="relative aspect-video w-full overflow-hidden bg-[#edf5fb]">
              <Image
                src={`${ASSET_ROOT}/wrist-ankle-disease-map.webp`}
                alt="발목의 인대와 아킬레스건, 족저근막 및 손목의 힘줄과 수근관 구조를 보여주는 의료 일러스트"
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
                    className={`group absolute z-20 hidden -translate-y-1/2 items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 lg:flex ${
                      marker.align === 'left' ? '-translate-x-full flex-row-reverse' : ''
                    }`}
                    aria-label={`${disease.title} 자세히 보기`}
                  >
                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_14px_30px_-15px_rgba(40,74,165,0.9)]">
                      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 motion-reduce:hidden">
                        <span className="animate-ripple absolute inset-0 rounded-full bg-primary/30" />
                        <span className="animate-ripple-delayed absolute inset-0 rounded-full bg-primary/30" />
                      </span>
                      <span aria-hidden className="relative h-2 w-2 rounded-full bg-white" />
                    </span>
                    <span className="whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-[15px] font-bold text-white shadow-[0_16px_32px_-18px_rgba(40,74,165,0.75)] transition group-hover:bg-primary-dark motion-reduce:transition-none">
                      {disease.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2.5 bg-[#edf5fb] p-3 sm:p-5 lg:hidden">
              {diseases.map((disease) => (
                <button
                  key={disease.id}
                  type="button"
                  onClick={() => setActiveDiseaseId(disease.id)}
                  className="flex min-h-16 items-center justify-center rounded-xl bg-primary px-3 py-3 text-center text-[0.86rem] font-bold leading-snug text-white shadow-[0_16px_34px_-24px_rgba(40,74,165,0.8)] transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 motion-reduce:transition-none min-[420px]:text-[0.95rem] sm:min-h-16 sm:rounded-2xl sm:text-[1.05rem]"
                  aria-label={`${disease.title} 자세히 보기`}
                >
                  <span className="break-keep">{disease.title}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {activeDisease ? <WristAnkleDiseaseModal disease={activeDisease} onClose={closeModal} /> : null}
    </section>
  );
}

'use client';

import Image from 'next/image';
import { ArrowUpRight, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ScrollReveal from '@/components/ScrollReveal';

const ASSET_ROOT = '/images/treatments/joint/knee-arthroscopy';

interface Disease {
  id: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  symptoms?: string[];
  detailTitle: string;
  details: string[];
}

const diseases: Disease[] = [
  {
    id: 'chondromalacia',
    title: '슬개골 연골연화증',
    summary: '무릎 앞쪽 연골과 슬개골 움직임을 함께 살펴봅니다.',
    description:
      '슬개골 아래의 관절연골이 부드러워지거나 손상된 상태로, 슬개골의 움직임과 다리 정렬을 함께 평가해 통증의 원인을 살펴봅니다.',
    image: `${ASSET_ROOT}/disease-chondromalacia.jpg`,
    imageAlt: '관절내시경으로 본 슬개골 연골연화증 관련 관절면',
    symptoms: [
      '계단을 오르내리거나 쪼그려 앉을 때 앞무릎 통증',
      '무릎을 굽힌 채 오래 앉은 뒤 느껴지는 불편감',
      '무릎을 움직일 때 나타나는 마찰감이나 걸리는 느낌',
    ],
    detailTitle: '평가할 내용',
    details: ['연골 표면의 상태와 손상 범위', '슬개골이 움직이는 경로', '주변 활막과 관절면의 변화'],
  },
  {
    id: 'meniscus',
    title: '반월상연골 파열',
    summary: '파열의 위치와 형태, 관절 움직임에 미치는 영향을 확인합니다.',
    description:
      '반월상연골은 무릎에 전달되는 충격을 분산하는 구조입니다. 스포츠 손상이나 퇴행성 변화로 파열될 수 있으며, 파열 형태와 불안정성을 함께 평가합니다.',
    image: `${ASSET_ROOT}/disease-meniscus.jpg`,
    imageAlt: '관절내시경으로 본 반월상연골 파열',
    symptoms: [
      '관절선 안쪽 또는 바깥쪽의 통증',
      '무릎을 굽히고 펼 때 걸리거나 잠기는 느낌',
      '활동 뒤 반복되는 붓기와 운동 범위 감소',
    ],
    detailTitle: '평가할 내용',
    details: ['파열의 위치와 모양', '조직의 안정성과 남아 있는 범위', '관절연골과 인대의 동반 손상'],
  },
  {
    id: 'cruciate-ligament',
    title: '십자인대 손상',
    summary: '인대의 연속성과 무릎 안정성을 종합해 평가합니다.',
    description:
      '전방·후방십자인대는 무릎이 앞뒤로 과도하게 움직이지 않도록 잡아주는 구조입니다. 손상 부위와 남아 있는 조직의 상태를 확인합니다.',
    image: `${ASSET_ROOT}/disease-cruciate-ligament.jpg`,
    imageAlt: '관절내시경으로 본 무릎 십자인대',
    symptoms: [
      '손상 직후 나타나는 통증과 빠른 부종',
      '방향을 바꿀 때 무릎이 빠지는 듯한 불안정감',
      '계단이나 운동 중 반복되는 힘 빠짐',
    ],
    detailTitle: '평가할 내용',
    details: ['인대 섬유의 연속성과 긴장도', '손상 위치와 범위', '반월상연골과 연골의 동반 손상'],
  },
  {
    id: 'cartilage',
    title: '관절연골 손상',
    summary: '손상 깊이와 주변 관절면의 상태를 세밀하게 살펴봅니다.',
    description:
      '관절 표면을 덮는 연골은 외상이나 반복적인 하중으로 손상될 수 있습니다. 손상의 크기와 깊이, 주변 연골의 안정성을 함께 확인합니다.',
    image: `${ASSET_ROOT}/disease-cartilage.jpg`,
    imageAlt: '관절내시경으로 본 무릎 관절연골 손상',
    symptoms: [
      '활동할 때 심해지는 무릎 통증',
      '반복되는 관절 부종',
      '움직일 때 걸리거나 마찰되는 느낌',
    ],
    detailTitle: '평가할 내용',
    details: ['연골 결손의 크기와 깊이', '주변 연골의 안정성', '연골 아래 뼈와 관절 전체의 상태'],
  },
  {
    id: 'plica',
    title: '추벽증후군',
    summary: '두꺼워진 활막 주름과 주변 조직의 마찰 여부를 확인합니다.',
    description:
      '추벽은 관절 안쪽의 활막 주름입니다. 반복적인 자극으로 두꺼워지거나 염증이 생기면 슬개골 주변에 통증과 걸리는 느낌을 만들 수 있습니다.',
    image: `${ASSET_ROOT}/disease-plica.jpg`,
    imageAlt: '관절내시경으로 본 무릎 관절의 추벽',
    symptoms: [
      '슬개골 안쪽에서 느껴지는 국소 통증',
      '무릎을 굽히고 펼 때 툭 걸리는 느낌',
      '반복적인 운동 뒤 나타나는 뻣뻣함과 부종',
    ],
    detailTitle: '평가할 내용',
    details: ['추벽의 두께와 염증 상태', '슬개골·대퇴골과의 마찰', '주변 연골의 자극 여부'],
  },
  {
    id: 'synovitis',
    title: '활막염',
    summary: '활막의 염증과 관절 내부의 변화를 함께 관찰합니다.',
    description:
      '활막은 관절 안쪽을 덮는 조직입니다. 외상이나 염증성 질환 등 여러 원인으로 붓고 두꺼워질 수 있어 원인 평가가 중요합니다.',
    image: `${ASSET_ROOT}/disease-synovitis.jpg`,
    imageAlt: '관절내시경으로 본 무릎 관절의 활막 변화',
    symptoms: [
      '관절의 붓기와 열감',
      '움직임과 관계없이 이어지는 둔한 통증',
      '관절 운동 범위 감소와 뻣뻣함',
    ],
    detailTitle: '평가할 내용',
    details: ['활막의 색과 두께 변화', '염증이 분포한 범위', '연골·반월상연골의 동반 변화'],
  },
  {
    id: 'loose-body',
    title: '관절 내 유리체',
    summary: '관절 안에서 움직이는 연골·뼛조각의 위치를 찾습니다.',
    description:
      '연골이나 뼈의 일부가 떨어져 관절 안에서 움직이는 상태입니다. 조각의 위치와 크기, 발생 원인이 된 병변을 함께 살펴봅니다.',
    image: `${ASSET_ROOT}/disease-loose-body.jpg`,
    imageAlt: '관절내시경으로 본 무릎 관절 내 유리체',
    symptoms: [
      '갑자기 무릎이 펴지지 않는 잠김 현상',
      '움직일 때 위치가 달라지는 통증',
      '간헐적인 부종과 관절 안의 이물감',
    ],
    detailTitle: '평가할 내용',
    details: ['유리체의 위치와 크기', '관절면에 끼이는 양상', '연골 손상 등 유리체가 생긴 원인'],
  },
  {
    id: 'synovial-biopsy',
    title: '활막 조직검사',
    summary: '필요한 경우 활막 조직을 채취해 원인을 확인합니다.',
    description:
      '원인이 명확하지 않은 활막염에서는 관절 내부를 관찰하면서 필요한 부위의 조직을 채취해 병리검사나 배양검사를 진행할 수 있습니다.',
    image: `${ASSET_ROOT}/disease-synovial-biopsy.jpg`,
    imageAlt: '관절내시경을 이용한 무릎 활막 조직 확인',
    detailTitle: '검토할 내용',
    details: ['증상과 혈액·영상검사 결과', '조직을 채취할 위치와 범위', '병리검사 또는 배양검사의 필요성'],
  },
];

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h4 className="text-h4 tracking-tight text-ink">{title}</h4>
      <ul className="mt-4 space-y-2 break-keep text-body text-ink-sub sm:text-[16px] md:text-[17px] md:leading-relaxed">
        {items.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
    </section>
  );
}

function DiseaseDialog({ disease, onClose }: { disease: Disease; onClose: () => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
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

  return createPortal(
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/68 px-3 py-4 backdrop-blur-[2px] sm:px-4 sm:py-6"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.article
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[615px] flex-col overflow-hidden rounded-[1rem] bg-white shadow-[0_30px_100px_-40px_rgba(0,0,0,0.65)] sm:max-h-[79vh] sm:rounded-[1.15rem]"
      >
        <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 bg-navy-900 px-5 py-2 text-white sm:h-20 sm:px-7 sm:py-0">
          <h3 id={titleId} className="break-keep text-h4 leading-tight tracking-tight">
            {disease.title}
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={`${disease.title} 상세 창 닫기`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/20 sm:h-11 sm:w-11"
          >
            <X aria-hidden size={32} strokeWidth={1.8} />
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

          <p
            id={descriptionId}
            className="mt-6 break-keep text-[16px] font-semibold leading-[1.7] tracking-tight text-ink sm:mt-8 sm:text-[18px] sm:leading-relaxed md:text-[20px]"
          >
            {disease.description}
          </p>

          <div className="my-6 h-px bg-slate-200 sm:my-8" />

          <div className="space-y-8 sm:space-y-10">
            {disease.symptoms && (
              <DetailList title="주로 나타나는 증상" items={disease.symptoms} />
            )}
            <DetailList title={disease.detailTitle} items={disease.details} />
          </div>
        </div>
      </motion.article>
    </motion.div>,
    document.body,
  );
}

export default function KneeDiseaseExplorer() {
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const closeDialog = useCallback(() => setSelectedDisease(null), []);

  return (
    <section
      aria-labelledby="knee-disease-explorer-title"
      className="relative isolate overflow-hidden bg-[#071A3D] px-5 py-16 text-white sm:px-6 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-52 -top-64 h-[36rem] w-[36rem] rounded-full bg-primary/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-72 -left-48 h-[38rem] w-[38rem] rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <ScrollReveal className="max-w-4xl">
          <h2
            id="knee-disease-explorer-title"
            className="break-keep text-h2 tracking-tight text-white"
          >
            관절내시경으로 살펴보는
            <br className="hidden sm:block" /> 주요 무릎 질환
          </h2>
          <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-white/72 md:text-lg">
            관절 내부의 구조를 확대해 병변의 위치와 형태를 살펴보고, 진찰과 영상검사
            결과를 함께 검토해 치료 범위를 구체화합니다.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {diseases.map((disease, index) => (
            <ScrollReveal
              key={disease.id}
              delay={index * 0.045}
              variant="image"
              amount={0.12}
              className="h-full"
            >
              <button
                type="button"
                onClick={() => setSelectedDisease(disease)}
                aria-label={`${disease.title} 자세히 보기`}
                className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/12 bg-white/[0.07] text-left shadow-[0_18px_50px_rgba(2,12,32,0.18)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-300/45 hover:bg-white/[0.11] hover:shadow-[0_24px_70px_rgba(2,12,32,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#071A3D]"
              >
                <span className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950">
                  <Image
                    src={disease.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#071A3D]/50 via-transparent to-transparent"
                  />
                </span>

                <span className="flex flex-1 flex-col p-3.5 sm:p-5">
                  <span className="break-keep text-[15px] font-bold leading-[1.5] text-white sm:text-lg">
                    {disease.title}
                  </span>
                  <span className="mt-2 hidden break-keep text-sm font-medium leading-[1.65] text-white/62 sm:block">
                    {disease.summary}
                  </span>
                  <span className="mt-auto flex items-center gap-1.5 pt-4 text-[12px] font-bold text-cyan-300 sm:text-sm">
                    자세히 보기
                    <ArrowUpRight
                      aria-hidden
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {selectedDisease && (
        <DiseaseDialog disease={selectedDisease} onClose={closeDialog} />
      )}
    </section>
  );
}

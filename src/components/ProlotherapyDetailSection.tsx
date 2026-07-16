"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  ShieldAlert,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ASSET_ROOT = "/images/treatments/non-surgical/prolotherapy";

const mechanismSteps = [
  {
    number: "01",
    title: "통증과 관련된 조직 확인",
    desc: "진찰과 필요한 영상검사를 바탕으로 힘줄 부착부, 인대 주변 또는 관절 안의 치료 목표를 확인합니다.",
    image: `${ASSET_ROOT}/prolotherapy-mechanism-01-irritated.webp`,
    alt: "힘줄이 뼈에 붙는 부위의 미세 손상과 자극을 표현한 프롤로 치료 원리 이미지",
  },
  {
    number: "02",
    title: "목표 부위 가까이에 주입",
    desc: "필요하면 초음파나 투시 영상을 보며 포도당 기반 주사액을 계획한 조직 가까이에 투여합니다.",
    image: `${ASSET_ROOT}/prolotherapy-mechanism-02-injection.webp`,
    alt: "초음파 유도 아래 힘줄 부착부 주변에 포도당 기반 주사액을 투여하는 재구성 이미지",
  },
  {
    number: "03",
    title: "반응을 확인하며 회복 계획",
    desc: "국소 조직 반응과 통증·기능 변화를 살피고 운동치료와 부하 조절 등 다음 치료 계획을 맞춥니다.",
    image: `${ASSET_ROOT}/prolotherapy-mechanism-03-response.webp`,
    alt: "시술 뒤 힘줄 부착부 주변의 조직 반응이 정돈되는 과정을 표현한 개념 이미지",
  },
];

const advantages = [
  {
    title: "진단에 맞춘 표적 접근",
    desc: "통증 위치만 보지 않고 원인 조직과 주입 목표를 먼저 확인합니다.",
  },
  {
    title: "대부분 외래에서 진행",
    desc: "부위에 따라 국소마취와 초음파·투시 영상 유도를 사용할 수 있습니다.",
  },
  {
    title: "재활치료와 함께 계획",
    desc: "운동치료와 부하 조절을 포함한 보존적 치료 안에서 검토합니다.",
  },
  {
    title: "반응을 보며 맞춤 조정",
    desc: "횟수와 간격을 고정하지 않고 증상과 기능 변화를 살펴 결정합니다.",
  },
];

const conditions = [
  {
    id: "knee",
    number: "01",
    title: "무릎",
    summary: "무릎 골관절염·일부 만성 부착부 통증",
    detail:
      "일부 환자에서 통증과 기능 개선을 보고한 연구가 있지만 결과는 일정하지 않습니다. 반월상연골이나 인대 파열을 복원하는 치료는 아닙니다.",
    image: `${ASSET_ROOT}/prolotherapy-condition-knee.webp`,
    alt: "무릎 힘줄과 인대의 통증 부위를 표현한 의료 일러스트",
  },
  {
    id: "elbow",
    number: "02",
    title: "팔꿈치",
    summary: "테니스엘보·골프엘보 등 만성 부착부 통증",
    detail:
      "운동과 부하 조절 등 보존치료 후에도 증상이 이어질 때 선택적으로 검토할 수 있습니다. 표준 농도와 횟수는 정립되지 않았습니다.",
    image: `${ASSET_ROOT}/prolotherapy-condition-elbow.webp`,
    alt: "팔꿈치 바깥쪽 힘줄 부착부 통증을 표현한 의료 일러스트",
  },
  {
    id: "hand-wrist",
    number: "03",
    title: "손·손목",
    summary: "엄지 기저부·일부 만성 힘줄 통증",
    detail:
      "손·손목 통증은 관절과 힘줄, 신경 문제를 먼저 구분해야 합니다. 수근관증후군의 신경주위 포도당 주사는 고장성 프롤로 주사와 목표가 다른 치료입니다.",
    image: `${ASSET_ROOT}/prolotherapy-condition-hand-wrist.webp`,
    alt: "엄지 기저부와 손목 주변 힘줄·인대의 통증 부위를 표현한 의료 일러스트",
  },
  {
    id: "hip",
    number: "04",
    title: "고관절 주변",
    summary: "일부 만성 힘줄·부착부 통증",
    detail:
      "골관절염, 충돌증후군, 관절순, 점액낭과 힘줄 문제를 먼저 구분합니다. 진단에 따라 다른 치료가 우선될 수 있습니다.",
    image: `${ASSET_ROOT}/prolotherapy-condition-hip.webp`,
    alt: "고관절 바깥쪽 힘줄 부착부 통증을 표현한 의료 일러스트",
  },
  {
    id: "shoulder",
    number: "05",
    title: "어깨",
    summary: "회전근개 건병증·부착부 통증",
    detail:
      "일부 만성 건병증에서 통증 개선이 보고됐지만 구조 재생 효과는 확인되지 않았습니다. 전층 파열이나 오십견을 대신하는 치료는 아닙니다.",
    image: `${ASSET_ROOT}/prolotherapy-condition-shoulder.webp`,
    alt: "어깨 회전근개 힘줄 부착부 통증을 표현한 의료 일러스트",
  },
  {
    id: "ankle-foot",
    number: "06",
    title: "발목·발",
    summary: "만성 족저근막병증·일부 아킬레스건 통증",
    detail:
      "기존 보존치료에 반응이 적은 만성 통증에서 선택적으로 검토합니다. 급성 아킬레스건 파열에는 적용할 수 없습니다.",
    image: `${ASSET_ROOT}/prolotherapy-condition-ankle-foot.webp`,
    alt: "아킬레스건과 발뒤꿈치 부착부 통증을 표현한 의료 일러스트",
  },
  {
    id: "lumbar-pelvis",
    number: "07",
    title: "허리·골반",
    summary: "제한적 근거가 있는 천장관절 통증 등 일부 상태",
    detail:
      "일반적인 허리 통증 전체에 같은 효과가 있는 치료는 아닙니다. 허리디스크나 척추관협착증 자체를 치료하는 주사로 보지 않습니다.",
    image: `${ASSET_ROOT}/prolotherapy-condition-lumbar-pelvis.webp`,
    alt: "허리와 골반 주변 인대성 통증 부위를 표현한 의료 일러스트",
  },
  {
    id: "cervical",
    number: "08",
    title: "목·척추",
    summary: "일반 적용 근거가 충분하지 않은 부위",
    detail:
      "목·척추 통증 전반에 프롤로 주사를 적용할 근거는 충분하지 않습니다. 경추 디스크, 협착증 또는 신경학적 증상은 전문 평가와 표준 치료가 우선입니다.",
    image: `${ASSET_ROOT}/prolotherapy-condition-cervical.webp`,
    alt: "목·척추 통증은 원인 감별이 우선임을 표현한 의료 일러스트",
  },
];

const procedureSteps = [
  {
    number: "01",
    title: "정확한 진단",
    desc: "문진과 진찰, 필요한 영상검사로 통증의 원인과 프롤로 주사의 적합성을 평가합니다.",
    image: `${ASSET_ROOT}/prolotherapy-process-01-assessment.webp`,
    alt: "초음파로 무릎 힘줄과 인대의 상태와 목표 위치를 확인하는 모습",
  },
  {
    number: "02",
    title: "주입 목표 확인",
    desc: "시술 부위를 소독하고 필요하면 초음파 또는 투시 영상으로 목표 조직과 주변 구조를 확인합니다.",
    image: `${ASSET_ROOT}/prolotherapy-process-02-preparation.webp`,
    alt: "주사 전 피부를 준비하고 초음파로 목표 위치를 다시 확인하는 모습",
  },
  {
    number: "03",
    title: "맞춤 주사",
    desc: "조직과 병변에 맞춘 포도당 기반 주사액을 계획한 부위에 투여하며 필요하면 국소마취를 사용합니다.",
    image: `${ASSET_ROOT}/prolotherapy-process-03-injection.webp`,
    alt: "초음파 유도 아래 힘줄 부착부 주변에 주사하는 모습",
  },
  {
    number: "04",
    title: "경과 확인과 재활",
    desc: "통증과 기능 변화를 확인하고, 추가 치료 여부와 운동·재활 계획을 반응에 맞춰 조정합니다.",
    image: `${ASSET_ROOT}/prolotherapy-process-04-follow-up.webp`,
    alt: "시술 후 상태를 확인하고 단계적인 운동 회복을 안내하는 모습",
  },
];

const treatmentPlan = [
  {
    title: "횟수와 간격은 개인별로",
    desc: "모든 환자에게 같은 횟수를 적용하지 않으며, 매 시술 후 통증과 기능 변화를 확인해 추가 치료를 결정합니다.",
  },
  {
    title: "복용약은 임의로 중단하지 않기",
    desc: "항응고제·항혈소판제와 소염진통제를 포함한 복용 계획은 반드시 의료진과 상의합니다.",
  },
  {
    title: "활동은 시술 부위에 맞게",
    desc: "운동, 샤워, 찜질과 일상 복귀 시점은 주입 부위와 시술 방법에 따라 개별 안내를 받습니다.",
  },
];

const tellDoctor = [
  "혈액응고 이상 또는 항응고·항혈소판제 복용",
  "조절되지 않는 당뇨, 면역저하 또는 임신 가능성",
  "주사 성분 알레르기, 발열 또는 시술 부위 감염",
];

export default function ProlotherapyDetailSection() {
  const carouselRef = useRef<HTMLUListElement>(null);
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(
    null,
  );
  const [carouselEdges, setCarouselEdges] = useState({
    canScrollPrev: false,
    canScrollNext: true,
  });

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const updateEdges = () => {
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      setCarouselEdges({
        canScrollPrev: carousel.scrollLeft > 4,
        canScrollNext: carousel.scrollLeft < maxScrollLeft - 4,
      });
    };

    updateEdges();
    carousel.addEventListener("scroll", updateEdges, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateEdges);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollConditions = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    carousel.scrollBy({
      left: direction * Math.min(carousel.clientWidth * 0.84, 420),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const handleConditionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    conditionId: string,
  ) => {
    if (event.key !== "Escape" || selectedConditionId !== conditionId) return;
    event.preventDefault();
    setSelectedConditionId(null);
  };

  return (
    <div
      id="prolotherapy-detail"
      className="space-y-16 sm:space-y-20 md:space-y-28"
    >
      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="prolotherapy-introduction">
          <div className="relative md:min-h-[560px] xl:min-h-[620px]">
            <div className="relative z-10 pb-7 md:absolute md:inset-y-0 md:left-0 md:flex md:w-[58%] md:items-center md:px-10 md:pb-0 lg:px-14 xl:px-16">
              <div className="max-w-[680px]">
                <p className="mb-4 break-words font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:text-[11px] sm:tracking-[0.18em] md:text-white/80">
                  Dextrose Prolotherapy
                </p>
                <h2 className="break-keep text-h2 tracking-tight text-ink sm:text-4xl md:text-[2.7rem] md:leading-[1.18] md:text-white lg:text-[3.25rem]">
                  통증 부위를 세밀하게 확인해,
                  <br className="hidden md:block" /> 필요한 조직 가까이에
                  접근합니다
                </h2>
                <p className="mt-5 max-w-[610px] break-keep text-body-lg text-ink-sub md:mt-7 md:text-white/85">
                  진찰과 필요한 영상검사를 바탕으로 목표 조직을 확인한 뒤,
                  힘줄 부착부·인대 주변 또는 관절 안에 포도당 기반 주사액을
                  투여해 통증과 기능 개선을 돕는 비수술 주사치료입니다.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-navy-950 sm:aspect-[16/10] sm:rounded-[1.75rem] md:absolute md:inset-0 md:aspect-auto md:rounded-[2rem]">
              <Image
                src={`${ASSET_ROOT}/prolotherapy-hero.png`}
                alt="초음파로 위치를 확인하며 무릎 힘줄 부착부 주변에 주사하는 프롤로 치료 개념 이미지"
                fill
                fetchPriority="high"
                sizes="(min-width: 1280px) 1280px, (min-width: 768px) 100vw, 92vw"
                className="object-cover object-[68%_center] md:object-center"
              />
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,13,32,0.98)_0%,rgba(3,16,39,0.91)_40%,rgba(4,19,45,0.43)_64%,rgba(4,19,45,0.04)_84%)] md:block"
              />
            </div>
            <p className="mt-2 px-1 break-keep text-[12px] font-semibold leading-[1.6] text-ink-sub md:absolute md:bottom-5 md:right-6 md:z-20 md:mt-0 md:rounded-full md:bg-black/35 md:px-3 md:py-1.5 md:text-white/80 md:backdrop-blur-sm">
              시술 이해를 돕기 위한 재구성 이미지입니다.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="prolotherapy-explanation">
          <div className="max-w-4xl">
            <h3 className="break-keep text-h2 tracking-tight text-ink">
              프롤로 주사, 이렇게 이해하세요
            </h3>
          </div>

          <div className="mt-9 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-premium sm:mt-12 sm:rounded-[2rem]">
            <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
              <div className="flex items-center bg-navy-950 p-5 text-white sm:p-8 md:p-10 lg:p-12">
                <div>
                  <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold text-white/80">
                    핵심 원리
                  </span>
                  <h4 className="mt-5 break-keep text-h3 md:text-[2rem]">
                    목표 조직 가까이에 주입하고
                    <br /> 반응을 세심하게 확인합니다
                  </h4>
                  <p className="mt-4 break-keep text-body-lg text-white/85">
                    같은 부위의 통증이라도 원인과 손상 정도에 따라 주입 위치와
                    치료 계획이 달라집니다.
                  </p>
                </div>
              </div>

              <figure className="bg-[#F4F7FC] p-4 sm:p-6 md:p-8">
                <div className="relative hidden aspect-[16/7] overflow-hidden rounded-[1.35rem] bg-white md:block">
                  <Image
                    src={`${ASSET_ROOT}/prolotherapy-mechanism.png`}
                    alt="손상된 힘줄 부착부 주변에 포도당 기반 용액을 주입하는 프롤로 치료 원리 일러스트"
                    fill
                    sizes="(min-width: 1024px) 760px, 92vw"
                    className="object-contain"
                  />
                </div>

                <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
                  {mechanismSteps.map((item) => (
                    <article
                      key={item.number}
                      className="w-[84%] shrink-0 snap-center overflow-hidden rounded-[1rem] border border-slate-200 bg-white shadow-[0_18px_45px_-36px_rgba(15,29,54,0.8)]"
                    >
                      <div className="relative aspect-[3/4] bg-slate-100">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          sizes="84vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <span className="font-montserrat text-[11px] font-bold tracking-[0.14em] text-primary">
                          {item.number}
                        </span>
                        <p className="mt-1 break-keep text-[14px] font-bold leading-[1.55] text-ink">
                          {item.title}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                <figcaption className="px-1 pt-4 break-keep text-[13px] font-semibold leading-[1.7] text-ink-sub sm:px-2 sm:text-[14px]">
                  조직 반응의 개념을 설명하기 위한 재구성 이미지이며, 실제 치료
                  범위와 반응은 환자 상태에 따라 달라집니다.
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3 md:gap-4">
            {mechanismSteps.map((item) => (
              <article
                key={item.number}
                className="rounded-[1rem] border border-slate-200 bg-white p-5 sm:p-6"
              >
                <span className="font-montserrat text-[12px] font-bold tracking-[0.16em] text-primary">
                  {item.number}
                </span>
                <h4 className="mt-3 break-keep text-h4 leading-snug text-ink">
                  {item.title}
                </h4>
                <p className="mt-2 break-keep text-[14px] font-medium leading-[1.7] text-ink-sub sm:text-[14px]">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="prolotherapy-features"
          className="relative overflow-hidden rounded-[1.5rem] bg-[#071A3D] px-4 py-11 text-white sm:rounded-[2rem] sm:px-8 sm:py-16 md:px-12 md:py-20"
        >
          <div
            aria-hidden
            className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-primary/25 blur-[100px]"
          />
          <div className="relative">
            <h3 className="break-keep text-h2 tracking-tight">
              프롤로 주사의 특징
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-white/80 md:text-lg">
              주사 한 번으로 결과를 단정하지 않고, 정확한 진단과 단계적인
              회복 계획 안에서 선택적으로 고려합니다.
            </p>

            <div className="mt-9 grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:mt-12 sm:gap-4 lg:grid-cols-4">
              {advantages.map((item) => (
                <article
                  key={item.title}
                  className="flex min-h-[148px] flex-col rounded-[1rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:min-h-[176px] sm:rounded-[1.3rem] sm:p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:h-9 sm:w-9">
                    <Check size={18} strokeWidth={3} />
                  </span>
                  <h4 className="mt-4 break-keep text-[15px] font-bold leading-[1.45] text-white sm:text-base">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 break-keep text-[12px] font-medium leading-[1.65] text-white/85 sm:text-[14px]">
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="prolotherapy-conditions">
          <div className="flex items-end justify-between gap-5">
            <div className="max-w-4xl">
              <h3 className="break-keep text-h2 tracking-tight text-ink">
                진단 후 고려할 수 있는 통증 부위
              </h3>
              <p className="mt-5 max-w-3xl break-keep text-body-lg text-ink-sub">
                같은 부위의 통증이라도 원인과 조직 손상 정도에 따라 치료가
                달라집니다. 카드를 눌러 적용 범위와 한계를 함께 확인하세요.
              </p>
            </div>

            <div className="hidden shrink-0 gap-2 sm:flex">
              <button
                type="button"
                aria-label="이전 통증 부위 보기"
                onClick={() => scrollConditions(-1)}
                disabled={!carouselEdges.canScrollPrev}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-200 disabled:hover:text-ink"
              >
                <ArrowLeft size={19} strokeWidth={2.4} />
              </button>
              <button
                type="button"
                aria-label="다음 통증 부위 보기"
                onClick={() => scrollConditions(1)}
                disabled={!carouselEdges.canScrollNext}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-200 disabled:hover:text-ink"
              >
                <ArrowRight size={19} strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <ul
            ref={carouselRef}
            aria-label="프롤로 주사를 진단 후 고려할 수 있는 통증 부위"
            className="-mx-1 mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-1 pb-4 [scrollbar-width:none] sm:mt-12 sm:gap-4 [&::-webkit-scrollbar]:hidden"
          >
            {conditions.map((item) => {
              const isSelected = selectedConditionId === item.id;

              return (
                <li
                  key={item.id}
                  className="min-w-0 basis-[84%] shrink-0 snap-center sm:basis-[46%] lg:basis-[31%] xl:basis-[23%]"
                >
                  <button
                    type="button"
                    aria-expanded={isSelected}
                    aria-controls={`prolotherapy-condition-detail-${item.id}`}
                    aria-label={`${item.title} ${isSelected ? "상세 설명 닫기" : "상세 설명 보기"}`}
                    onClick={() =>
                      setSelectedConditionId(isSelected ? null : item.id)
                    }
                    onKeyDown={(event) =>
                      handleConditionKeyDown(event, item.id)
                    }
                    className="group relative block w-full overflow-hidden rounded-[1.2rem] bg-slate-100 text-left shadow-[0_24px_70px_-50px_rgba(15,29,54,0.75)] transition-transform duration-500 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:rounded-[1.5rem]"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 84vw"
                        className={`object-cover transition duration-700 motion-reduce:transform-none motion-reduce:transition-none ${
                          isSelected
                            ? "scale-[1.03]"
                            : "group-hover:scale-[1.03]"
                        }`}
                      />

                      <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-navy-950 via-navy-950/72 to-transparent"
                      />

                      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                        <span className="font-montserrat text-[10px] font-bold tracking-[0.18em] text-white/75">
                          {item.number}
                        </span>
                        <h4 className="mt-1 break-keep text-[1.2rem] font-bold leading-snug sm:text-[1.35rem]">
                          {item.title}
                        </h4>
                        <p className="mt-1.5 break-keep text-[12px] font-semibold leading-[1.55] text-white/85 sm:text-[14px]">
                          {item.summary}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80">
                          <Info size={13} />
                          {isSelected ? "다시 눌러 닫기" : "눌러 자세히 보기"}
                        </span>
                      </div>

                      <div
                        id={`prolotherapy-condition-detail-${item.id}`}
                        aria-hidden={!isSelected}
                        className={`absolute inset-0 flex flex-col justify-end bg-[linear-gradient(180deg,rgba(2,10,26,0.72)_0%,rgba(2,10,26,0.93)_100%)] p-4 text-white transition-opacity duration-500 motion-reduce:transition-none sm:p-5 ${
                          isSelected
                            ? "opacity-100"
                            : "pointer-events-none opacity-0"
                        }`}
                      >
                        <span className="font-montserrat text-[10px] font-bold tracking-[0.18em] text-white/70">
                          {item.number} · CHECK POINT
                        </span>
                        <h4 className="mt-2 break-keep text-[1.25rem] font-bold leading-snug sm:text-[1.4rem]">
                          {item.title}
                        </h4>
                        <p className="mt-2 break-keep text-[12px] font-bold leading-[1.6] text-white/80 sm:text-[14px]">
                          {item.summary}
                        </p>
                        <p className="mt-3 break-keep text-[12px] font-medium leading-[1.7] text-white/80 sm:text-[14px]">
                          {item.detail}
                        </p>
                        <span className="mt-4 text-[11px] font-bold text-white/70">
                          다시 누르거나 Esc 키로 닫기
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-1 flex items-center justify-between gap-4 sm:hidden">
            <p className="break-keep text-[12px] font-semibold leading-[1.6] text-ink-sub">
              옆으로 밀어 다른 부위를 확인하세요.
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label="이전 통증 부위 보기"
                onClick={() => scrollConditions(-1)}
                disabled={!carouselEdges.canScrollPrev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft size={17} strokeWidth={2.4} />
              </button>
              <button
                type="button"
                aria-label="다음 통증 부위 보기"
                onClick={() => scrollConditions(1)}
                disabled={!carouselEdges.canScrollNext}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowRight size={17} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="prolotherapy-process">
          <div className="max-w-4xl">
            <h3 className="break-keep text-h2 tracking-tight text-ink">
              진단부터 경과 확인까지 세심하게
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-body-lg text-ink-sub">
              목표 조직을 확인하고 주변 신경과 혈관을 살피며 진행합니다. 추가
              시술은 미리 정하지 않고 실제 반응을 확인해 결정합니다.
            </p>
          </div>

          <figure className="mt-9 hidden md:block sm:mt-12">
            <div className="relative aspect-[16/7] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[#F4F7FC]">
              <Image
                src={`${ASSET_ROOT}/prolotherapy-process-overview.webp`}
                alt="초음파 평가와 시술 준비, 표적 주사, 경과 확인을 차례로 보여주는 프롤로 주사 재구성 이미지"
                fill
                sizes="(min-width: 1280px) 1200px, 92vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 px-1 break-keep text-[13px] font-semibold leading-[1.7] text-ink-sub sm:text-[14px]">
              시술 과정을 이해하기 위한 재구성 이미지이며, 실제 접근 위치와
              방법은 부위와 환자 상태에 따라 달라집니다.
            </figcaption>
          </figure>

          <ol className="-mx-1 mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3 [scrollbar-width:none] sm:mt-12 sm:gap-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {procedureSteps.map((item) => (
              <li
                key={item.number}
                className="w-[84%] shrink-0 snap-center overflow-hidden rounded-[1.1rem] border border-slate-200 bg-white shadow-[0_24px_70px_-52px_rgba(15,29,54,0.7)] sm:w-[46%] md:w-auto md:shrink"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 md:hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 640px) 46vw, 84vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-start gap-3 p-4 sm:p-5 md:block md:min-h-[214px]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-montserrat text-[11px] font-bold text-white">
                    {item.number}
                  </span>
                  <div className="min-w-0 md:mt-4">
                    <h4 className="break-keep text-[15px] font-bold leading-snug text-ink sm:text-base">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 break-keep text-[12px] font-medium leading-[1.7] text-ink-sub sm:text-[14px]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-2 break-keep text-[12px] font-semibold leading-[1.6] text-ink-sub md:hidden">
            카드를 옆으로 밀어 시술 과정을 확인하세요.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="prolotherapy-aftercare">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-6">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-premium sm:rounded-[2rem] sm:p-8 md:p-10">
              <h3 className="break-keep text-h2 tracking-tight text-ink sm:text-4xl md:text-[3rem] md:leading-[1.18]">
                치료 계획과 생활 안내
              </h3>
              <div className="mt-8 grid gap-3 sm:mt-10">
                {treatmentPlan.map((item, index) => (
                  <article
                    key={item.title}
                    className="flex items-start gap-3.5 rounded-[1rem] bg-[#F4F7FC] p-4 sm:gap-4 sm:p-5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-montserrat text-[11px] font-bold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="break-keep text-[15px] font-bold leading-snug text-ink sm:text-base">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 break-keep text-[14px] font-medium leading-[1.7] text-ink-sub sm:text-[14px]">
                        {item.desc}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-[1.5rem] bg-navy-950 p-5 text-white sm:rounded-[2rem] sm:p-8 md:p-10">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                <ShieldAlert size={21} strokeWidth={2.4} />
              </span>
              <h3 className="mt-6 break-keep text-[1.5rem] font-bold leading-tight sm:text-[1.8rem]">
                시술 전에 꼭 알려주세요
              </h3>
              <ul className="mt-7 space-y-4">
                {tellDoctor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7CA8FF]" />
                    <p className="break-keep text-[14px] font-semibold leading-[1.7] text-white/85 sm:text-[15px]">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.1}>
        <aside className="rounded-xl border border-amber-200/80 bg-amber-50 px-5 py-5 sm:px-6">
          <p className="break-keep text-body font-semibold text-amber-950/90">
            치료 효과는 질환과 환자 상태에 따라 다르며 충분한 호전이 없을 수도
            있습니다. 시술 뒤 일시적인 통증, 뻐근함, 붓기 또는 멍이 생길 수
            있고 드물게 감염, 출혈, 알레르기 반응, 신경·혈관 손상이 발생할 수
            있습니다. 발열, 점점 심해지는 붉어짐·부기, 조절되지 않는 심한
            통증, 새로 생긴 감각저하나 근력저하가 있다면 즉시 의료기관에
            연락해야 합니다.
          </p>
        </aside>
      </ScrollReveal>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import BalloonNeuroplastyDetailSection from "@/components/BalloonNeuroplastyDetailSection";
import NeuroplastyDetailSection from "@/components/NeuroplastyDetailSection";
import NucleoplastyDetailSection from "@/components/NucleoplastyDetailSection";
import ProlotherapyDetailSection from "@/components/ProlotherapyDetailSection";
import VertebroplastyDetailSection from "@/components/VertebroplastyDetailSection";

const EASE = [0.16, 1, 0.3, 1] as const;

interface TreatmentFact {
  label: string;
  value: string;
}

interface Treatment {
  id: string;
  name: string;
  engName: string;
  summary: string;
  points: string[];
  facts: TreatmentFact[];
  image?: string;
  imageAlt?: string;
}

// NOTE: 아래 문구는 임시 초안입니다. 시술별 확정 문구가 준비되면 이 배열만 교체하면 됩니다.
const treatments: Treatment[] = [
  {
    id: "neuroplasty",
    name: "신경성형술 / 경막외유착박리술",
    engName: "Percutaneous Epidural Neuroplasty",
    summary:
      "꼬리뼈의 작은 통로로 특수 카테터를 삽입해 유착된 신경 주변을 박리하고, 통증의 원인 부위에 약물을 직접 주입하는 대표적인 비수술 치료입니다.",
    points: [
      "전신마취가 아닌 국소마취로 진행되어 환자 부담 감소",
      "절개 없이 지름 1~2mm의 특수 카테터만으로 시술",
      "통증 원인 부위에 약물을 직접 주입해 빠른 통증 완화",
      "시술 당일 보행과 일상생활 복귀 가능",
      "고령 환자, 고혈압·당뇨 등 만성질환자도 시술 고려 가능",
    ],
    facts: [
      { label: "시술시간", value: "약 20~30분" },
      { label: "마취방법", value: "국소마취" },
      { label: "입원여부", value: "당일 퇴원" },
    ],
  },
  {
    id: "balloon",
    name: "경막외풍선확장술",
    engName: "Epidural Balloon Neuroplasty",
    summary:
      "끝에 작은 풍선이 달린 특수 카테터를 통증 원인 부위까지 이동시킨 뒤, 풍선을 짧게 확장해 신경 주변의 유착 완화와 표적 약물 전달을 돕는 비수술 시술입니다.",
    points: [
      "C-arm 영상으로 카테터의 위치와 약물 분포 확인",
      "미세 풍선으로 신경 주변 공간 확보와 유착 완화 보조",
      "풍선 확장 후 병변 가까이에 약물 전달",
      "증상과 영상검사, 전신 상태를 함께 평가해 적용 결정",
    ],
    facts: [
      { label: "시술시간", value: "약 20~30분" },
      { label: "마취방법", value: "국소마취" },
      { label: "회복계획", value: "상태별 결정" },
    ],
  },
  {
    id: "nucleoplasty",
    name: "고주파수핵감압술",
    engName: "Radiofrequency Nucleoplasty",
    summary:
      "C-arm으로 가는 유도 바늘과 특수 전극을 포함성 디스크의 수핵 안에 위치시킨 뒤, 수핵 일부에 미세한 감압 통로를 만들어 디스크 내부 압력을 낮추는 데 도움을 주는 시술입니다.",
    points: [
      "C-arm으로 유도 바늘과 전극의 디스크 내 위치 확인",
      "상대적으로 낮은 온도의 플라즈마로 수핵 일부를 국소 감압",
      "신경을 태우는 방식이 아닌 디스크 내부 압력 완화 원리",
      "증상과 MRI가 일치하는 포함성 디스크 돌출에서 적용 검토",
    ],
    facts: [
      { label: "시술시간", value: "약 20~30분" },
      { label: "마취방법", value: "국소마취" },
      { label: "회복계획", value: "상태별 결정" },
    ],
  },
  {
    id: "vertebroplasty",
    name: "척추체 성형술(골시멘트)",
    engName: "Percutaneous Vertebral Augmentation",
    summary:
      "최근 발생해 아직 아물지 않은 척추 압박골절이 영상검사로 확인되고 통증치료에도 심한 통증이 이어질 때, 의료용 골시멘트로 골절 부위의 안정화를 돕는 최소침습적 치료입니다.",
    points: [
      "C-arm으로 골절 부위와 바늘 위치, 골시멘트 분포 확인",
      "가느다란 바늘로 골절된 척추체 안을 보강",
      "최근·미유합 골절과 통증 위치가 일치할 때 적용 검토",
      "시술 후에도 골다공증 치료와 추가 골절 예방을 병행",
    ],
    facts: [
      { label: "평가기준", value: "진찰·MRI" },
      { label: "시술방법", value: "영상 유도" },
      { label: "회복계획", value: "상태별 결정" },
    ],
  },
  {
    id: "prolo",
    name: "프롤로 주사",
    engName: "Dextrose Prolotherapy",
    summary:
      "진찰과 필요한 영상검사를 바탕으로 목표 조직을 확인한 뒤, 힘줄 부착부·인대 주변 또는 관절 안에 포도당 기반 주사액을 투여해 통증과 기능 개선을 돕는 비수술 주사치료입니다.",
    points: [
      "진찰과 필요한 영상검사를 바탕으로 주입 목표 확인",
      "부위에 따라 초음파 또는 투시 영상 유도 활용",
      "운동치료와 부하 조절 등 보존적 치료 안에서 검토",
      "통증과 기능 변화를 확인하며 횟수와 간격을 맞춤 조정",
    ],
    facts: [
      { label: "시술시간", value: "부위별 상이" },
      { label: "진행방법", value: "대부분 외래" },
      { label: "치료계획", value: "반응별 조정" },
    ],
  },
];

const NonSurgicalTreatmentTabs = () => {
  const [activeId, setActiveId] = useState(treatments[0].id);
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const activeIndex = treatments.findIndex((item) => item.id === activeId);
  const active = treatments[activeIndex];

  useEffect(() => {
    const selectedTab = document.getElementById(`ns-tab-${activeId}`);
    selectedTab?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });

    const section = sectionRef.current;
    if (!section || section.getBoundingClientRect().top >= -120) return;

    const top = window.scrollY + section.getBoundingClientRect().top - 92;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [activeId, shouldReduceMotion]);

  const panelVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: EASE,
            delayChildren: 0.1,
            staggerChildren: 0.06,
          },
        },
        exit: {
          opacity: 0,
          y: -10,
          transition: { duration: 0.2, ease: "easeIn" },
        },
      };

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: EASE },
        },
      };

  const handleTablistKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next =
      treatments[
        (activeIndex + direction + treatments.length) % treatments.length
      ];
    setActiveId(next.id);
    document.getElementById(`ns-tab-${next.id}`)?.focus();
  };

  return (
    <div ref={sectionRef}>
      <div
        role="tablist"
        aria-label="비수술 치료 시술 목록"
        onKeyDown={handleTablistKeyDown}
        className="-mx-5 flex snap-x snap-proximity gap-2 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2.5 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0"
      >
        {treatments.map((treatment) => {
          const isActive = treatment.id === activeId;
          return (
            <button
              key={treatment.id}
              id={`ns-tab-${treatment.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`ns-panel-${treatment.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(treatment.id)}
              className={`relative shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-bold transition-colors duration-300 sm:px-5 sm:py-3 sm:text-[15px] ${
                isActive
                  ? "border-transparent text-white"
                  : "border-slate-200 bg-white text-ink-sub hover:border-primary/40 hover:text-primary"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="ns-tab-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-full bg-primary shadow-blue-glow"
                  aria-hidden
                />
              )}
              <span className="relative z-10">{treatment.name}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-1 text-center text-[12px] font-semibold text-ink-sub md:hidden">
        좌우로 밀어 치료를 선택하세요.
      </p>

      <div className="mt-8 md:mt-12">
        <AnimatePresence mode="wait" initial={false}>
          {active.id === "neuroplasty" ? (
            <motion.div
              key={active.id}
              role="tabpanel"
              id={`ns-panel-${active.id}`}
              aria-labelledby={`ns-tab-${active.id}`}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <NeuroplastyDetailSection />
            </motion.div>
          ) : active.id === "balloon" ? (
            <motion.div
              key={active.id}
              role="tabpanel"
              id={`ns-panel-${active.id}`}
              aria-labelledby={`ns-tab-${active.id}`}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <BalloonNeuroplastyDetailSection />
            </motion.div>
          ) : active.id === "nucleoplasty" ? (
            <motion.div
              key={active.id}
              role="tabpanel"
              id={`ns-panel-${active.id}`}
              aria-labelledby={`ns-tab-${active.id}`}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <NucleoplastyDetailSection />
            </motion.div>
          ) : active.id === "vertebroplasty" ? (
            <motion.div
              key={active.id}
              role="tabpanel"
              id={`ns-panel-${active.id}`}
              aria-labelledby={`ns-tab-${active.id}`}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <VertebroplastyDetailSection />
            </motion.div>
          ) : active.id === "prolo" ? (
            <motion.div
              key={active.id}
              role="tabpanel"
              id={`ns-panel-${active.id}`}
              aria-labelledby={`ns-tab-${active.id}`}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ProlotherapyDetailSection />
            </motion.div>
          ) : (
            <motion.div
              key={active.id}
              role="tabpanel"
              id={`ns-panel-${active.id}`}
              aria-labelledby={`ns-tab-${active.id}`}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-premium lg:min-h-[540px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            >
              <motion.div
                variants={itemVariants}
                className="relative min-h-[240px] overflow-hidden bg-navy-950 sm:min-h-[280px] lg:min-h-full"
              >
                {active.image ? (
                  <>
                    <Image
                      src={active.image}
                      alt={active.imageAlt ?? active.name}
                      fill
                      sizes="(min-width: 1024px) 480px, 100vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
                    />
                  </>
                ) : (
                  <>
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[radial-gradient(130%_100%_at_85%_0%,rgba(40,74,165,0.5),transparent_62%)]"
                    />
                    <div
                      aria-hidden
                      className="absolute -bottom-20 -left-14 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-8 -right-2 select-none font-montserrat text-[8.5rem] font-bold leading-none text-white/[0.05] md:text-[11rem]"
                    >
                      {String(activeIndex + 1).padStart(2, "0")}
                    </span>
                  </>
                )}

                <div className="relative flex h-full flex-col justify-between p-7 md:p-9">
                  <span className="break-all font-montserrat text-[11px] font-bold uppercase tracking-[0.24em] text-white/55 md:text-xs">
                    {active.engName}
                  </span>
                  <div className="space-y-3 pt-14">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 font-montserrat text-[11px] font-bold tracking-widest text-white/80 backdrop-blur-sm">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(treatments.length).padStart(2, "0")}
                    </span>
                    <h3 className="break-keep text-2xl font-bold leading-snug text-white md:text-[1.75rem]">
                      {active.name}
                    </h3>
                  </div>
                </div>
              </motion.div>

              <div className="p-7 sm:p-9 md:p-11">
                <motion.p
                  variants={itemVariants}
                  className="break-keep text-body-lg text-ink-sub md:leading-relaxed"
                >
                  {active.summary}
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="mt-7 grid grid-cols-3 gap-2 sm:gap-3 md:mt-8"
                >
                  {active.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3"
                    >
                      <div className="text-[11px] font-bold text-primary sm:text-xs">
                        {fact.label}
                      </div>
                      <div className="mt-1 break-keep text-[13px] font-bold leading-snug text-ink sm:text-[15px]">
                        {fact.value}
                      </div>
                    </div>
                  ))}
                </motion.div>

                <ul className="mt-6 md:mt-7">
                  {active.points.map((point, index) => (
                    <motion.li
                      key={point}
                      variants={itemVariants}
                      className="flex items-center gap-4 border-t border-slate-100 py-4 first:border-t-0 md:gap-5 md:py-[1.15rem]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-montserrat text-[13px] font-bold text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="break-keep text-[15px] font-semibold leading-relaxed text-ink md:text-base">
                        {point}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NonSurgicalTreatmentTabs;

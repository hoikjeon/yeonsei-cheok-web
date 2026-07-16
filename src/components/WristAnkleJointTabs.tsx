"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

type PartDisease = {
  number: string;
  title: string;
  desc: string;
};

type PartStep = {
  number: string;
  title: string;
  desc: string;
};

type PartContent = {
  id: "wrist" | "ankle";
  name: string;
  engName: string;
  headline: string;
  summary: string;
  diseases: PartDisease[];
  diseaseTitle: string;
  diseaseDesc: string;
  steps: PartStep[];
  urgentTitle: string;
  urgent: string[];
  notice: string;
};

// NOTE: 아래 문구는 임시 초안입니다. 부위별 확정 문구가 준비되면 이 배열만 교체하면 됩니다.
const parts: PartContent[] = [
  {
    id: "wrist",
    name: "손목·손",
    engName: "Wrist · Hand Clinic",
    headline: "하루에도 수천 번 쓰는 손목과 손, 통증의 원인부터 구분합니다",
    summary:
      "손 저림과 손목 통증은 신경 압박, 힘줄 염증, 연골 손상 등 서로 다른 원인에서 시작됩니다. 진찰과 유발검사, 필요한 영상검사를 함께 확인해 원인에 맞는 치료 방향을 세웁니다.",
    diseaseTitle: "이런 손목·손 질환을 진료합니다",
    diseaseDesc:
      "증상 위치와 악화 동작, 검사 소견을 함께 확인하고 비수술 치료부터 우선 검토합니다.",
    diseases: [
      {
        number: "01",
        title: "손목터널증후군",
        desc: "손바닥과 1~4번째 손가락 저림이 밤에 심해지고, 손을 털면 잠시 나아지는 경우가 많습니다.",
      },
      {
        number: "02",
        title: "손목 건초염(드퀘르벵)",
        desc: "엄지 쪽 손목이 아프고, 아이를 안거나 손목을 비트는 동작에서 통증이 심해집니다.",
      },
      {
        number: "03",
        title: "삼각섬유연골(TFCC) 손상",
        desc: "새끼손가락 쪽 손목 통증이 문고리를 돌리거나 손을 짚을 때 심해집니다.",
      },
      {
        number: "04",
        title: "방아쇠수지·손가락 관절염",
        desc: "손가락이 걸리거나 펴지지 않고, 손가락 마디의 통증·강직이 이어집니다.",
      },
    ],
    steps: [
      {
        number: "01",
        title: "진찰·유발검사",
        desc: "통증 위치와 악화 동작을 확인하고 신경·힘줄 유발검사를 시행합니다.",
      },
      {
        number: "02",
        title: "영상·신경 검사",
        desc: "X-ray·초음파를 기본으로 확인하고 필요하면 MRI·신경전도검사를 시행합니다.",
      },
      {
        number: "03",
        title: "비수술 치료 우선",
        desc: "약물·주사 치료, 보조기 착용과 사용 습관 조정으로 회복 가능성을 먼저 살핍니다.",
      },
      {
        number: "04",
        title: "필요한 경우에만 수술 검토",
        desc: "충분한 비수술 치료에도 증상이 이어질 때 수술의 이점과 회복 계획을 설명한 뒤 결정합니다.",
      },
    ],
    urgentTitle: "이런 손목·손 증상은 미루지 말고 진료받으세요",
    urgent: [
      "넘어진 뒤 손목이 붓고 변형이 보이거나 움직이기 어려운 경우",
      "손가락 감각이 갑자기 무뎌지거나 힘이 빠져 물건을 자주 떨어뜨리는 경우",
      "손목·손가락이 붉게 붓고 열감이 있으며 발열이 동반되는 경우",
      "밤마다 저림으로 잠에서 깨는 증상이 몇 주 이상 이어지는 경우",
    ],
    notice:
      "저림과 통증의 원인은 목(경추)에서 시작되는 경우도 있어 증상만으로 단정하지 않습니다. 치료 반응과 회복 속도는 원인 질환과 환자 상태에 따라 달라질 수 있습니다.",
  },
  {
    id: "ankle",
    name: "발목·발",
    engName: "Ankle · Foot Clinic",
    headline: "몸무게를 온전히 받치는 발목과 발, 재발을 끊는 치료를 합니다",
    summary:
      "한 번 접질린 발목은 인대가 느슨해져 반복해서 접질리기 쉽습니다. 통증 부위와 걸음, 발 모양을 함께 살피고 인대·힘줄·연골 상태를 확인해 재발까지 관리하는 치료 계획을 세웁니다.",
    diseaseTitle: "이런 발목·발 질환을 진료합니다",
    diseaseDesc:
      "통증 위치와 보행 습관, 신발·활동 요인을 함께 확인하고 원인에 맞는 치료를 진행합니다.",
    diseases: [
      {
        number: "01",
        title: "발목 염좌·인대 손상",
        desc: "접질린 뒤 붓기와 통증이 이어지거나, 같은 발목을 반복해서 접질리는 만성 불안정입니다.",
      },
      {
        number: "02",
        title: "아킬레스건염",
        desc: "뒤꿈치 위쪽이 아프고 운동을 시작할 때나 계단을 오를 때 통증이 심해집니다.",
      },
      {
        number: "03",
        title: "족저근막염",
        desc: "아침 첫발을 디딜 때 뒤꿈치 통증이 심하고, 오래 서 있으면 다시 아파집니다.",
      },
      {
        number: "04",
        title: "무지외반증·발가락 변형",
        desc: "엄지발가락이 휘면서 튀어나온 부위가 신발에 눌려 아프고 굳은살이 생깁니다.",
      },
    ],
    steps: [
      {
        number: "01",
        title: "진찰·보행 확인",
        desc: "통증 부위와 발 모양, 걸음걸이와 발목의 안정성을 확인합니다.",
      },
      {
        number: "02",
        title: "영상 검사",
        desc: "X-ray로 뼈와 정렬을 확인하고 필요하면 초음파·MRI로 인대·힘줄 상태를 살핍니다.",
      },
      {
        number: "03",
        title: "비수술 치료 우선",
        desc: "약물·주사 치료, 보조기·깔창과 재활 운동으로 회복과 재발 예방을 먼저 시도합니다.",
      },
      {
        number: "04",
        title: "필요한 경우에만 수술 검토",
        desc: "인대 손상이나 변형이 심해 일상 회복이 어려울 때 수술 이점을 평가한 뒤 결정합니다.",
      },
    ],
    urgentTitle: "이런 발목·발 증상은 미루지 말고 진료받으세요",
    urgent: [
      "접질린 뒤 체중을 싣기 어렵거나 붓기·멍이 빠르게 심해지는 경우",
      "발목이나 발의 모양이 변형되어 보이는 경우",
      "발이 붉게 붓고 열감이 있으며 발열이 동반되는 경우",
      "당뇨가 있으면서 발의 상처가 잘 낫지 않는 경우",
    ],
    notice:
      "발목·발 통증의 회복 속도는 손상 정도와 활동량, 신발 환경에 따라 달라질 수 있습니다. 재발을 줄이려면 통증이 가라앉은 뒤에도 근력·균형 운동을 이어가는 것이 중요합니다.",
  },
];

const isPartId = (value: string): value is PartContent["id"] =>
  parts.some((part) => part.id === value);

export default function WristAnkleJointTabs() {
  const [activeId, setActiveId] = useState<PartContent["id"]>(parts[0].id);
  const shouldReduceMotion = useReducedMotion();

  const activeIndex = parts.findIndex((part) => part.id === activeId);
  const active = parts[activeIndex];

  // 해시 딥링크: /treatments/joint/wrist-ankle#ankle 로 진입하면 발목 탭을 엽니다.
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (isPartId(hash)) setActiveId(hash);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const selectPart = (id: PartContent["id"]) => {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const handleTablistKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = parts[(activeIndex + direction + parts.length) % parts.length];
    selectPart(next.id);
    document.getElementById(`wa-tab-${next.id}`)?.focus();
  };

  const panelVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
      };

  return (
    <div>
      <div
        role="tablist"
        aria-label="손목·발목 부위 선택"
        onKeyDown={handleTablistKeyDown}
        className="flex justify-center gap-2 sm:gap-2.5"
      >
        {parts.map((part) => {
          const isActive = part.id === activeId;
          return (
            <button
              key={part.id}
              id={`wa-tab-${part.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`wa-panel-${part.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectPart(part.id)}
              className={`relative shrink-0 whitespace-nowrap rounded-full border px-6 py-2.5 text-[14px] font-bold transition-colors duration-300 sm:px-8 sm:py-3 sm:text-[15px] ${
                isActive
                  ? "border-transparent text-white"
                  : "border-slate-200 bg-white text-ink-sub hover:border-primary/40 hover:text-primary"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="wa-tab-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-full bg-primary shadow-blue-glow"
                  aria-hidden
                />
              )}
              <span className="relative z-10">{part.name} 관절</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 md:mt-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            role="tabpanel"
            id={`wa-panel-${active.id}`}
            aria-labelledby={`wa-tab-${active.id}`}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-14 sm:space-y-16 md:space-y-24"
          >
            {/* 인트로 */}
            <section
              id={`${active.id}-introduction`}
              className="relative overflow-hidden rounded-[1.5rem] bg-[#071A3D] px-5 py-11 text-white sm:rounded-[2rem] sm:px-8 sm:py-14 md:px-12 md:py-20"
            >
              <div
                aria-hidden
                className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-primary/25 blur-[100px]"
              />
              <div
                aria-hidden
                className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px]"
              />
              <div className="relative max-w-3xl">
                <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                  {active.engName}
                </p>
                <h3 className="mt-3 break-keep text-h2 tracking-tight">
                  {active.headline}
                </h3>
                <p className="mt-5 break-keep text-body-lg text-white/85">
                  {active.summary}
                </p>
              </div>
            </section>

            {/* 대표 질환 */}
            <section id={`${active.id}-diseases`}>
              <div className="max-w-4xl">
                <h3 className="break-keep text-h2 tracking-tight text-ink">
                  {active.diseaseTitle}
                </h3>
                <p className="mt-4 max-w-3xl break-keep text-body text-ink-sub md:text-lg">
                  {active.diseaseDesc}
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
                {active.diseases.map((item, index) => (
                  <ScrollReveal
                    key={item.number}
                    variant="soft-rise"
                    amount={0.12}
                    delay={index * 0.06}
                    className="h-full"
                  >
                    <article className="h-full rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-52px_rgba(15,29,54,0.7)] sm:rounded-[1.5rem] sm:p-7">
                      <span className="font-montserrat text-[12px] font-bold tracking-[0.16em] text-primary">
                        {item.number}
                      </span>
                      <h4 className="mt-2 break-keep text-h4 leading-snug text-ink">
                        {item.title}
                      </h4>
                      <p className="mt-2.5 break-keep text-body text-ink-sub">
                        {item.desc}
                      </p>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </section>

            {/* 진단·치료 과정 */}
            <section
              id={`${active.id}-process`}
              className="rounded-[1.5rem] bg-[#F3F6FC] px-5 py-10 sm:rounded-[2rem] sm:px-7 sm:py-14 md:px-10 md:py-16"
            >
              <div className="max-w-4xl">
                <h3 className="break-keep text-h2 tracking-tight text-ink">
                  진단부터 치료까지
                </h3>
                <p className="mt-4 max-w-3xl break-keep text-body text-ink-sub md:text-lg">
                  검사보다 진찰이 먼저입니다. 비수술 치료를 우선 검토하고, 수술은
                  필요한 경우에만 충분한 설명과 함께 결정합니다.
                </p>
              </div>
              <ol className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {active.steps.map((item) => (
                  <li
                    key={item.number}
                    className="h-full rounded-[1.15rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-50px_rgba(15,29,54,0.65)] sm:rounded-[1.4rem] sm:p-6"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-montserrat text-[12px] font-bold text-white">
                      {item.number}
                    </span>
                    <h4 className="mt-4 break-keep text-h4 leading-snug text-ink">
                      {item.title}
                    </h4>
                    <p className="mt-2 break-keep text-body text-ink-sub">
                      {item.desc}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* 즉시 진료가 필요한 증상 */}
            <section
              id={`${active.id}-urgent`}
              className="overflow-hidden rounded-[1.5rem] bg-navy-950 px-5 py-10 text-white sm:rounded-[2rem] sm:px-7 sm:py-14 md:px-10 md:py-16"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-cyan-200">
                <ShieldCheck size={23} aria-hidden />
              </span>
              <h3 className="mt-5 max-w-3xl break-keep text-h3">
                {active.urgentTitle}
              </h3>
              <ul className="mt-7 grid gap-4 md:grid-cols-2">
                {active.urgent.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Check size={15} strokeWidth={3} />
                    </span>
                    <p className="break-keep text-body font-semibold text-white/90">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 안내 문구 */}
            <aside className="rounded-xl border border-amber-200/80 bg-amber-50 px-5 py-5 sm:px-6">
              <p className="break-keep text-body font-semibold text-amber-950/90">
                {active.notice}
              </p>
            </aside>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

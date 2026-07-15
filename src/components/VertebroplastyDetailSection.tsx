import Image from "next/image";
import { Check, ShieldCheck, TriangleAlert } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ASSET_ROOT = "/images/treatments/non-surgical/vertebroplasty";

const features = [
  {
    title: "실시간 영상 유도",
    desc: "C-arm으로 골절 부위와 바늘 위치, 골시멘트 분포를 확인합니다.",
  },
  {
    title: "큰 절개 없는 접근",
    desc: "피부의 작은 통로로 골절된 척추체 안에 접근합니다.",
  },
  {
    title: "골절 부위 안정화",
    desc: "의료용 골시멘트로 골절 부위의 미세 움직임을 줄이는 데 도움을 줍니다.",
  },
  {
    title: "상태별 회복 계획",
    desc: "시술 범위와 전신 상태를 확인해 보행·퇴원 계획을 정합니다.",
  },
];

const comparison = [
  {
    label: "직접 보강",
    title: "경피적 척추성형술",
    desc: "영상으로 위치를 확인하며 가느다란 바늘을 골절된 척추체 안에 놓고, 의료용 골시멘트를 직접 주입해 골절 부위의 안정화를 돕습니다.",
    image: `${ASSET_ROOT}/vertebroplasty-concept-direct-cement.webp`,
    alt: "압박골절 척추체 안에 골시멘트를 직접 주입하는 경피적 척추성형술 재구성 이미지",
  },
  {
    label: "공간 형성 후 보강",
    title: "풍선척추성형술",
    desc: "골절된 척추체 안에서 작은 풍선으로 공간을 만든 뒤 풍선을 제거하고, 만들어진 공간에 의료용 골시멘트를 채워 안정화를 돕습니다.",
    image: `${ASSET_ROOT}/kyphoplasty-concept-balloon-cavity.webp`,
    alt: "압박골절 척추체 안에서 작은 풍선으로 공간을 만드는 풍선척추성형술 재구성 이미지",
  },
];

const candidates = [
  {
    number: "01",
    title: "골다공증성 압박골절",
    desc: "MRI 등에서 아직 아물지 않은 골절이 확인되고 통증 위치와 일치하는 경우",
    image: `${ASSET_ROOT}/vertebroplasty-candidate-osteoporotic.webp`,
    alt: "골다공증성 척추 압박골절과 골수부종을 표현한 재구성 이미지",
  },
  {
    number: "02",
    title: "낙상 후 안정형 압박골절",
    desc: "낙상 후 발생한 골절 중 척추관 침범 없이 시술 이점이 크다고 판단되는 경우",
    image: `${ASSET_ROOT}/vertebroplasty-candidate-traumatic.webp`,
    alt: "낙상 후 발생한 안정형 척추 압박골절을 표현한 재구성 이미지",
  },
  {
    number: "03",
    title: "다발골수종 관련 골절",
    desc: "통증을 일으키는 척추체 병변을 다학제 평가한 뒤 보강이 필요하다고 판단되는 경우",
    image: `${ASSET_ROOT}/vertebroplasty-candidate-myeloma.webp`,
    alt: "다발골수종과 관련된 선별적 척추체 병변을 표현한 재구성 이미지",
  },
  {
    number: "04",
    title: "전이성 척추 종양 관련 골절",
    desc: "신경 압박이 없는 선별된 병변에서 다른 치료와 함께 보강을 검토하는 경우",
    image: `${ASSET_ROOT}/vertebroplasty-candidate-metastatic.webp`,
    alt: "전이성 척추 종양과 관련된 선별적 척추체 병변을 표현한 재구성 이미지",
  },
];

const selectionCriteria = [
  "서 있거나 몸을 움직일 때 심해지는 국소적인 등·허리 통증이 지속되는 경우",
  "MRI에서 골수부종 또는 척추체 내 균열이 보여 아직 아물지 않은 골절로 판단되는 경우",
  "진찰에서 아픈 위치와 영상검사에서 확인된 골절 위치가 서로 일치하는 경우",
  "개인별로 조정한 통증치료 후에도 심한 통증과 보행·일상생활 제한이 이어지는 경우",
];

const vertebroplastySteps = [
  {
    number: "01",
    title: "골절 위치 확인",
    desc: "진찰과 MRI·CT 등으로 통증의 원인이 아직 아물지 않은 압박골절인지 확인합니다.",
    image: `${ASSET_ROOT}/vertebroplasty-process-01-planning.webp`,
    alt: "압박골절 위치와 골절 상태를 확인하는 척추성형술 재구성 이미지",
  },
  {
    number: "02",
    title: "척추체 안으로 접근",
    desc: "마취 후 C-arm을 보며 가느다란 바늘을 골절된 척추체 안의 계획된 위치에 놓습니다.",
    image: `${ASSET_ROOT}/vertebroplasty-process-02-trocar.webp`,
    alt: "바늘을 골절된 척추체 안으로 접근시키는 척추성형술 재구성 이미지",
  },
  {
    number: "03",
    title: "골시멘트 주입",
    desc: "실시간 영상으로 분포를 확인하면서 의료용 골시멘트를 천천히 주입합니다.",
    image: `${ASSET_ROOT}/vertebroplasty-process-03-cement-injection.webp`,
    alt: "척추체 안에 골시멘트를 천천히 주입하는 척추성형술 재구성 이미지",
  },
  {
    number: "04",
    title: "안정화·회복 확인",
    desc: "바늘을 제거한 뒤 신경 상태와 활력징후를 관찰하고 이후 회복 계획을 세웁니다.",
    image: `${ASSET_ROOT}/vertebroplasty-process-04-stabilization.webp`,
    alt: "골시멘트가 척추체 안에서 골절 부위를 보강한 척추성형술 재구성 이미지",
  },
];

const kyphoplastySteps = [
  {
    number: "01",
    title: "작업관 위치 확인",
    desc: "C-arm을 보며 작업관을 골절된 척추체 안의 계획된 위치에 놓습니다.",
    image: `${ASSET_ROOT}/kyphoplasty-process-01-access.webp`,
    alt: "풍선척추성형술 작업관을 척추체 안에 위치시키는 재구성 이미지",
  },
  {
    number: "02",
    title: "풍선으로 공간 형성",
    desc: "척추체 안에서 작은 풍선을 제한적으로 확장해 골시멘트를 채울 공간을 만듭니다.",
    image: `${ASSET_ROOT}/kyphoplasty-process-02-balloon-expansion.webp`,
    alt: "압박골절 척추체 안에서 작은 풍선을 확장하는 재구성 이미지",
  },
  {
    number: "03",
    title: "풍선 제거·골시멘트 주입",
    desc: "풍선을 수축해 제거한 뒤 만들어진 공간에 의료용 골시멘트를 채웁니다.",
    image: `${ASSET_ROOT}/kyphoplasty-process-03-cement-filling.webp`,
    alt: "풍선을 제거한 공간에 골시멘트를 채우는 풍선척추성형술 재구성 이미지",
  },
  {
    number: "04",
    title: "최종 분포 확인",
    desc: "골시멘트가 척추체 안에 머무는지 확인하고 기구를 제거한 뒤 상태를 관찰합니다.",
    image: `${ASSET_ROOT}/kyphoplasty-process-04-stabilization.webp`,
    alt: "골시멘트로 압박골절 부위를 보강한 풍선척추성형술 재구성 이미지",
  },
];

const evaluateFirst = [
  "통증 위치와 영상에서 확인된 골절 위치가 일치하지 않거나 증상이 이미 호전 중인 경우",
  "무증상이거나 이미 아문 오래된 골절, 또는 감염이 의심되는 경우",
  "교정되지 않은 출혈 위험이나 해결하기 어려운 조영제·사용 약물 알레르기가 있는 경우",
  "뼛조각이 척추관을 침범했거나 척추가 불안정해 신경 압박이 의심되는 경우",
];

const urgentSymptoms = [
  "새로 생기거나 빠르게 심해지는 다리 힘 빠짐·감각 저하",
  "회음부 감각 저하 또는 갑작스러운 대소변 조절 변화",
  "큰 사고 뒤 발생한 심한 척추 통증",
  "고열·오한과 함께 심해지는 등·허리 통증",
];

const recoveryPoints = [
  {
    title: "시술 직후 관찰",
    desc: "신경 상태와 활력징후, 통증 변화와 천자 부위를 확인한 뒤 보행·퇴원 시점을 정합니다.",
  },
  {
    title: "새 증상 확인",
    desc: "시술 후 흉통·호흡곤란, 새 신경 증상 또는 급격히 심해지는 통증은 즉시 알려야 합니다.",
  },
  {
    title: "골다공증 치료 병행",
    desc: "골밀도 평가와 약물치료, 영양·운동·낙상 예방을 이어가야 추가 골절 위험을 줄일 수 있습니다.",
  },
];

type ProcedureStep = (typeof vertebroplastySteps)[number];

function ProcedureCards({
  steps,
  label,
}: {
  steps: ProcedureStep[];
  label: string;
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold text-ink-sub/70 md:hidden">
        옆으로 밀어 네 단계를 확인하세요.
      </p>
      <ol
        aria-label={label}
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
      >
        {steps.map((item) => (
          <li
            key={item.number}
            className="w-[84%] shrink-0 snap-center overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white shadow-[0_22px_65px_-52px_rgba(15,29,54,0.7)] min-[440px]:w-[68%] sm:w-[56%] md:w-auto"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[#F3F6FB]">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 280px, (min-width: 768px) 45vw, 84vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
              />
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-montserrat text-[12px] font-black text-white">
                  {item.number}
                </span>
                <h4 className="break-keep text-[1.02rem] font-black leading-snug text-ink sm:text-lg">
                  {item.title}
                </h4>
              </div>
              <p className="mt-3 break-keep text-[13px] font-medium leading-[1.7] text-ink-sub sm:text-[14px]">
                {item.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function VertebroplastyDetailSection() {
  return (
    <div
      id="vertebroplasty-detail"
      className="space-y-16 sm:space-y-20 md:space-y-28"
    >
      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="vertebroplasty-introduction">
          <div className="relative md:min-h-[560px] xl:min-h-[620px]">
            <div className="relative z-10 pb-7 md:absolute md:inset-y-0 md:left-0 md:flex md:w-[57%] md:items-center md:px-10 md:pb-0 lg:px-14 xl:px-16">
              <div className="max-w-[660px]">
                <h2 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[2.7rem] md:leading-[1.18] md:text-white lg:text-[3.25rem]">
                  주저앉은 척추뼈의 통증,
                  <br className="hidden md:block" /> 필요한 경우에만 정밀하게
                  보강합니다
                </h2>
                <p className="mt-5 max-w-[600px] break-keep text-base font-medium leading-[1.8] text-ink-sub md:mt-7 md:text-[17px] md:text-white/75 lg:text-lg">
                  최근 발생해 아직 아물지 않은 척추 압박골절이 영상검사로
                  확인되고, 개인별로 조정한 통증치료에도 심한 통증이 이어질 때
                  적용 가능성을 검토하는 최소침습적 치료입니다.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-navy-950 sm:aspect-[16/10] sm:rounded-[1.75rem] md:absolute md:inset-0 md:aspect-auto md:rounded-[2rem]">
              <Image
                src={`${ASSET_ROOT}/vertebroplasty-hero.webp`}
                alt="압박골절 척추체 안에 가느다란 바늘로 골시멘트를 주입하는 척추체 보강술 재구성 이미지"
                fill
                fetchPriority="high"
                sizes="(min-width: 1280px) 1280px, (min-width: 768px) 100vw, 92vw"
                className="object-cover object-[70%_center] md:object-center"
              />
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,13,32,0.98)_0%,rgba(3,16,39,0.9)_42%,rgba(4,19,45,0.42)_66%,rgba(4,19,45,0.04)_86%)] md:block"
              />
            </div>
            <p className="mt-2 px-1 break-keep text-[11px] font-semibold leading-[1.6] text-ink-sub md:absolute md:bottom-5 md:right-6 md:z-20 md:mt-0 md:rounded-full md:bg-black/35 md:px-3 md:py-1.5 md:text-white/65 md:backdrop-blur-sm">
              시술 이해를 돕기 위한 의학 교육용 재구성 이미지입니다.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="vertebroplasty-explanation">
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              두 가지 척추체 보강술,
              <br /> 무엇이 다른가요?
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              두 치료 모두 골절된 척추뼈 안을 의료용 골시멘트로 보강해 미세한
              움직임을 줄이고 통증 완화를 돕습니다. 차이는 골시멘트를 넣기 전에
              풍선으로 공간을 만드는지 여부입니다.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:mt-12 lg:grid-cols-2 lg:gap-6">
            {comparison.map((item, index) => (
              <ScrollReveal
                key={item.title}
                variant="soft-rise"
                amount={0.12}
                delay={index * 0.07}
                className="h-full"
              >
                <article className="grid h-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-premium sm:rounded-[2rem] sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-cols-1">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F4F7FC] sm:aspect-auto sm:min-h-[340px] lg:aspect-[4/3] lg:min-h-0">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 600px, (min-width: 640px) 42vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 sm:p-7 md:p-8">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-black text-primary sm:text-xs">
                      {item.label}
                    </span>
                    <h4 className="mt-4 break-keep text-[1.35rem] font-black leading-tight text-ink sm:text-2xl">
                      {item.title}
                    </h4>
                    <p className="mt-3 break-keep text-[14px] font-medium leading-[1.8] text-ink-sub sm:text-[16px]">
                      {item.desc}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="vertebroplasty-features"
          className="relative overflow-hidden rounded-[1.5rem] bg-[#071A3D] px-4 py-11 text-white sm:rounded-[2rem] sm:px-8 sm:py-16 md:px-12 md:py-20"
        >
          <div
            aria-hidden
            className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-primary/25 blur-[100px]"
          />
          <div className="relative">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              척추체 보강술의 특징
            </h3>
            <div className="mt-9 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:mt-12 sm:gap-4 lg:grid-cols-4">
              {features.map((item, index) => (
                <ScrollReveal
                  key={item.title}
                  variant="soft-rise"
                  amount={0.15}
                  delay={index * 0.07}
                  className="h-full"
                >
                  <article className="flex h-full min-h-[152px] flex-col rounded-[1rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:min-h-[178px] sm:rounded-[1.3rem] sm:p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Check size={18} strokeWidth={3} />
                    </span>
                    <h4 className="mt-4 break-keep text-[14px] font-black leading-[1.45] text-white sm:text-base">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 break-keep text-[11px] font-medium leading-[1.65] text-white/65 sm:text-[13px]">
                      {item.desc}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="vertebroplasty-candidates">
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              이런 골절에서 적용 가능성을 확인합니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              진단명만으로 결정하지 않습니다. 통증의 양상과 골절 시기, MRI 등
              영상 소견을 함께 확인하고 기대 이점이 위험보다 큰지 판단합니다.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2">
            {candidates.map((item, index) => (
              <ScrollReveal
                key={item.number}
                variant="soft-rise"
                amount={0.12}
                delay={index * 0.06}
                className="h-full"
              >
                <article className="h-full overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_22px_65px_-52px_rgba(15,29,54,0.7)] sm:rounded-[1.5rem]">
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#F4F7FC]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="font-montserrat text-[12px] font-black tracking-[0.16em] text-primary">
                      {item.number}
                    </span>
                    <h4 className="mt-2 break-keep text-[1.15rem] font-black leading-snug text-ink sm:text-xl">
                      {item.title}
                    </h4>
                    <p className="mt-2.5 break-keep text-[13px] font-medium leading-[1.75] text-ink-sub sm:text-[15px]">
                      {item.desc}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 rounded-[1.25rem] border border-primary/15 bg-[#F3F6FC] p-5 sm:mt-10 sm:rounded-[1.5rem] sm:p-7 md:p-9">
            <h4 className="break-keep text-[1.2rem] font-black text-ink sm:text-2xl">
              최근·미유합 골절인지 먼저 확인합니다
            </h4>
            <ul className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4">
              {selectionCriteria.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  <p className="break-keep text-[13px] font-semibold leading-[1.75] text-ink sm:text-[15px]">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="vertebroplasty-process">
          <div className="max-w-4xl">
            <p className="font-montserrat text-[11px] font-black uppercase tracking-[0.18em] text-primary">
              Percutaneous Vertebroplasty
            </p>
            <h3 className="mt-3 break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              경피적 척추성형술 과정
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              영상으로 골절 위치와 바늘 끝, 골시멘트 분포를 계속 확인하며
              골절된 척추체 안을 정밀하게 보강합니다.
            </p>
          </div>
          <div className="mt-9 sm:mt-12">
            <ProcedureCards
              steps={vertebroplastySteps}
              label="경피적 척추성형술 네 단계"
            />
          </div>
          <p className="mt-4 break-keep text-[12px] font-semibold leading-[1.7] text-ink-sub sm:text-[13px]">
            시술 이해를 위한 재구성 이미지이며, 실제 접근 방향과 범위는 환자
            상태에 따라 달라질 수 있습니다.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="kyphoplasty-process"
          className="rounded-[1.5rem] bg-[#F3F6FC] px-4 py-10 sm:rounded-[2rem] sm:px-7 sm:py-14 md:px-10 md:py-20"
        >
          <div className="max-w-4xl px-1">
            <p className="font-montserrat text-[11px] font-black uppercase tracking-[0.18em] text-primary">
              Balloon Kyphoplasty
            </p>
            <h3 className="mt-3 break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              풍선척추성형술 과정
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              풍선은 골시멘트를 채울 공간을 만들기 위해 사용하며, 확장 후에는
              완전히 수축해 제거합니다.
            </p>
          </div>
          <div className="mt-9 sm:mt-12">
            <ProcedureCards
              steps={kyphoplastySteps}
              label="풍선척추성형술 네 단계"
            />
          </div>
          <p className="mt-4 px-1 break-keep text-[12px] font-semibold leading-[1.7] text-ink-sub sm:text-[13px]">
            풍선으로 척추 높이를 완전히 복원하는 시술은 아니며, 개선 정도는
            골절의 형태와 시기에 따라 달라집니다.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="vertebroplasty-safety"
          className="overflow-hidden rounded-[1.5rem] bg-navy-950 px-4 py-10 text-white sm:rounded-[2rem] sm:px-7 sm:py-14 md:px-10 md:py-20"
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-cyan-200">
                <ShieldCheck size={23} aria-hidden />
              </span>
              <h3 className="mt-5 break-keep text-[1.8rem] font-black leading-[1.25] sm:text-3xl md:text-[2.5rem]">
                이런 경우에는 다른 평가가 먼저 필요할 수 있습니다
              </h3>
              <ul className="mt-7 space-y-4">
                {evaluateFirst.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <p className="break-keep text-[13px] font-medium leading-[1.75] text-white/72 sm:text-[15px]">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.25rem] border border-amber-300/20 bg-amber-300/[0.08] p-5 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-300/15 text-amber-200">
                <TriangleAlert size={22} aria-hidden />
              </span>
              <h3 className="mt-5 break-keep text-[1.45rem] font-black leading-[1.3] sm:text-2xl">
                다음 증상은 상담을 기다리지 말고 즉시 평가받으세요
              </h3>
              <ul className="mt-6 space-y-4">
                {urgentSymptoms.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200" />
                    <p className="break-keep text-[13px] font-semibold leading-[1.75] text-white/78 sm:text-[15px]">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="vertebroplasty-recovery">
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              골시멘트 치료가 골다공증 치료의 끝은 아닙니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              치료한 척추뼈를 보강해도 뼈의 밀도 자체가 회복되는 것은 아닙니다.
              시술 후 관찰과 함께 추가 골절을 줄이기 위한 치료를 이어가야 합니다.
            </p>
          </div>
          <div className="mt-9 grid gap-3 sm:mt-12 md:grid-cols-3 md:gap-4">
            {recoveryPoints.map((item, index) => (
              <ScrollReveal
                key={item.title}
                variant="soft-rise"
                amount={0.14}
                delay={index * 0.06}
                className="h-full"
              >
                <article className="h-full rounded-[1.15rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-50px_rgba(15,29,54,0.65)] sm:rounded-[1.4rem] sm:p-7">
                  <span className="font-montserrat text-[13px] font-black tracking-[0.16em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-4 break-keep text-[1.1rem] font-black leading-snug text-ink sm:text-xl">
                    {item.title}
                  </h4>
                  <p className="mt-2.5 break-keep text-[13px] font-medium leading-[1.75] text-ink-sub sm:text-[15px]">
                    {item.desc}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.1}>
        <aside className="rounded-xl border border-amber-200/80 bg-amber-50 px-5 py-5 sm:px-6">
          <p className="break-keep text-[13px] font-semibold leading-[1.75] text-amber-950/75 sm:text-[14px]">
            통증 개선 정도는 골절 상태와 환자에 따라 다르며 모든 환자에게 효과가
            보장되지는 않습니다. 골시멘트 누출, 출혈·감염, 신경 손상, 시멘트
            색전, 알레르기 반응과 새 골절 등이 발생할 수 있어 전문의의 사전
            평가와 시술 후 관찰이 필요합니다. 항혈소판제·항응고제 복용, 감염,
            출혈성 질환 또는 조영제·약물 알레르기가 있다면 반드시 미리 알려야
            합니다.
          </p>
        </aside>
      </ScrollReveal>
    </div>
  );
}

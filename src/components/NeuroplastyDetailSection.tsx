import Image from "next/image";
import { Check } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ASSET_ROOT = "/images/treatments/non-surgical/neuroplasty";
const NEUROPLASTY_HERO_IMAGE = `${ASSET_ROOT}/neuroplasty-catheter-precision-hero.png?v=20260715-2`;

interface MediaStep {
  step: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
}

const advantages = [
  "국소마취로 부담 감소",
  "수술 부담이 큰 경우 고려",
  "비교적 빠른 회복",
  "약 20~30분의 시술",
  "병변 부위에 직접 접근",
];

const overviewSteps = [
  {
    step: "01",
    title: "최소 접근",
    desc: "꼬리뼈 주변의 작은 통로로 병변에 접근합니다.",
  },
  {
    step: "02",
    title: "카테터 삽입",
    desc: "가느다란 특수 카테터를 경막외강으로 이동합니다.",
  },
  {
    step: "03",
    title: "유착 완화",
    desc: "통증 원인 부위의 유착을 완화하고 약물을 전달합니다.",
  },
  {
    step: "04",
    title: "염증·부종 완화",
    desc: "신경 주변에 약물이 퍼지도록 해 회복을 돕습니다.",
  },
];

const candidates = [
  "허리디스크 또는 퇴행성 디스크 질환으로 신경통이 있는 경우",
  "척추관협착증으로 허리·다리 통증이나 저림이 지속되는 경우",
  "척추 수술 후에도 통증이 남아 있거나 신경 주변 유착이 의심되는 경우",
  "허리와 골반의 만성 통증이 약물·물리치료 후에도 지속되는 경우",
  "고령 또는 전신질환으로 수술 부담이 커 비수술 치료를 우선 검토하는 경우",
];

const clinicalSteps: MediaStep[] = [
  {
    step: "01",
    title: "시술 부위 확인",
    desc: "영상 장비로 위치를 확인하고 피부를 소독한 뒤 국소마취를 진행합니다.",
    image: `${ASSET_ROOT}/neuroplasty-clinical-step-01.png`,
    alt: "신경성형술 시술 부위를 확인하는 실제 시술 장면",
  },
  {
    step: "02",
    title: "특수 카테터 접근",
    desc: "꼬리뼈 주변의 작은 통로를 통해 가느다란 특수 카테터를 삽입합니다.",
    image: `${ASSET_ROOT}/neuroplasty-clinical-step-02.png`,
    alt: "신경성형술 특수 카테터를 삽입하는 실제 시술 장면",
  },
  {
    step: "03",
    title: "유착 완화와 약물 전달",
    desc: "카테터를 병변 가까이 이동시켜 유착을 완화하고 필요한 약물을 전달합니다.",
    image: `${ASSET_ROOT}/neuroplasty-clinical-step-03.png`,
    alt: "신경성형술 카테터로 치료를 진행하는 실제 시술 장면",
  },
];

const lumbarXraySteps: MediaStep[] = [
  {
    step: "01",
    title: "병변 위치 확인",
    desc: "X-ray 영상으로 목표 부위와 접근 방향을 확인합니다.",
    image: `${ASSET_ROOT}/neuroplasty-lumbar-xray-step-01.png`,
    alt: "요추 신경성형술 병변 위치를 확인하는 X-ray 영상",
  },
  {
    step: "02",
    title: "카테터 이동",
    desc: "실시간 영상을 보며 카테터를 통증 원인 부위로 이동합니다.",
    image: `${ASSET_ROOT}/neuroplasty-lumbar-xray-step-02.png`,
    alt: "요추 신경성형술 카테터 이동을 확인하는 X-ray 영상",
  },
  {
    step: "03",
    title: "약물 분포 확인",
    desc: "조영 영상으로 카테터 위치와 약물이 퍼지는 범위를 확인합니다.",
    image: `${ASSET_ROOT}/neuroplasty-lumbar-xray-step-03.png`,
    alt: "요추 신경성형술 약물 분포를 확인하는 X-ray 영상",
  },
  {
    step: "04",
    title: "치료 후 최종 확인",
    desc: "병변 부위의 치료 상태를 다시 확인한 뒤 시술을 마무리합니다.",
    image: `${ASSET_ROOT}/neuroplasty-lumbar-xray-step-04.png`,
    alt: "요추 신경성형술 치료 후 상태를 확인하는 X-ray 영상",
  },
];

const cervicalXraySteps: MediaStep[] = [
  {
    step: "01",
    title: "경추 병변 접근",
    desc: "X-ray로 경추 구조와 목표 부위를 확인하며 카테터를 접근시킵니다.",
    image: `${ASSET_ROOT}/neuroplasty-cervical-xray-step-01.png`,
    alt: "경추 신경성형술 카테터 접근을 확인하는 X-ray 영상",
  },
  {
    step: "02",
    title: "위치 확인 후 치료",
    desc: "카테터 끝의 위치를 확인하고 병변 주변에 필요한 약물을 전달합니다.",
    image: `${ASSET_ROOT}/neuroplasty-cervical-xray-step-02.png`,
    alt: "경추 신경성형술 치료 위치를 확인하는 X-ray 영상",
  },
];

const MediaStepCard = ({
  item,
  index,
  dark = false,
}: {
  item: MediaStep;
  index: number;
  dark?: boolean;
}) => (
  <ScrollReveal
    variant="soft-rise"
    amount={0.12}
    delay={index * 0.07}
    className="h-full"
  >
    <article
      className={`h-full overflow-hidden rounded-[1.15rem] border shadow-[0_24px_70px_-52px_rgba(15,29,54,0.7)] sm:rounded-[1.4rem] ${
        dark
          ? "border-white/10 bg-white/[0.07]"
          : "border-slate-200/80 bg-white"
      }`}
    >
      <div className="relative aspect-[8/5] overflow-hidden bg-slate-100">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span
          aria-hidden
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 font-montserrat text-[13px] font-black text-white backdrop-blur-sm"
        >
          {item.step}
        </span>
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h4
          className={`break-keep text-[1.05rem] font-black leading-snug sm:text-xl ${dark ? "text-white" : "text-ink"}`}
        >
          {item.title}
        </h4>
        <p
          className={`mt-2 break-keep text-[13px] font-medium leading-[1.7] sm:text-[15px] ${dark ? "text-white/70" : "text-ink-sub"}`}
        >
          {item.desc}
        </p>
      </div>
    </article>
  </ScrollReveal>
);

export default function NeuroplastyDetailSection() {
  return (
    <div
      id="neuroplasty-detail"
      className="space-y-16 sm:space-y-20 md:space-y-28"
    >
      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section>
          <div className="relative md:min-h-[560px] xl:min-h-[620px]">
            <div className="relative z-10 pb-7 md:absolute md:inset-y-0 md:left-0 md:flex md:w-[56%] md:items-center md:px-10 md:pb-0 lg:px-14 xl:px-16">
              <div className="max-w-[650px]">
                <h2 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[2.7rem] md:leading-[1.18] md:text-white lg:text-[3.25rem]">
                  통증을 일으키는 신경 가까이,
                  <br className="hidden md:block" /> 가느다란 카테터로
                  정밀하게 접근합니다
                </h2>
                <p className="mt-5 max-w-[570px] break-keep text-base font-medium leading-[1.8] text-ink-sub md:mt-7 md:text-[17px] md:text-white/75 lg:text-lg">
                  두 치료는 큰 절개 없이 통증의 원인이 되는 신경 주변에
                  접근하는 대표적인 비수술 치료입니다. 이름은 비슷하지만
                  치료의 초점을 알면 쉽게 이해할 수 있습니다.
                </p>
              </div>
            </div>

            <div
              role="img"
              aria-label="가느다란 카테터가 통증을 일으키는 요추 신경 가까이 접근하는 신경성형술 설명 이미지"
              style={{ backgroundImage: `url("${NEUROPLASTY_HERO_IMAGE}")` }}
              className="relative aspect-[16/11] overflow-hidden rounded-[1.4rem] bg-navy-950 bg-cover bg-no-repeat [background-position:67%_center] sm:rounded-[1.75rem] md:absolute md:inset-0 md:aspect-auto md:rounded-[2rem] md:[background-position:center]"
            >
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,13,32,0.96)_0%,rgba(3,16,39,0.86)_38%,rgba(4,19,45,0.38)_62%,rgba(4,19,45,0.04)_82%)] md:block"
              />
            </div>
          </div>

          <div className="group/cards mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 md:gap-6">
            <article className="relative overflow-hidden rounded-[1.25rem] bg-navy-950 p-5 transition-colors duration-500 group-has-[article:nth-of-type(2):hover]/cards:bg-[#F3F6FC] sm:p-7 md:p-9">
              <div
                aria-hidden
                className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-primary/25 opacity-100 blur-3xl transition-opacity duration-500 group-has-[article:nth-of-type(2):hover]/cards:opacity-0"
              />
              <div className="relative">
                <h3 className="break-keep text-[1.45rem] font-black leading-tight text-white transition-colors duration-500 group-has-[article:nth-of-type(2):hover]/cards:text-ink sm:text-2xl md:text-[2rem]">
                  신경성형술이란?
                </h3>
                <p className="mt-4 break-keep text-[15px] font-medium leading-[1.8] text-white/72 transition-colors duration-500 group-has-[article:nth-of-type(2):hover]/cards:text-ink-sub md:text-[17px]">
                  X-ray 영상 장비로 위치를 확인하면서 피부의 작은 통로로 가느다란
                  특수 카테터를 넣고, 통증을 일으키는 신경 가까이에 약물을 전달해
                  염증과 부종 완화를 돕는 비수술 시술입니다.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[1.25rem] bg-[#F3F6FC] p-5 transition-colors duration-500 hover:bg-navy-950 sm:p-7 md:p-9">
              <div
                aria-hidden
                className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-primary/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <h3 className="break-keep text-[1.45rem] font-black leading-tight text-ink transition-colors duration-500 group-hover:text-white sm:text-2xl md:text-[2rem]">
                  경막외유착박리술이란?
                </h3>
                <p className="mt-4 break-keep text-[15px] font-medium leading-[1.8] text-ink-sub transition-colors duration-500 group-hover:text-white/72 md:text-[17px]">
                  디스크·척추관협착증·수술 후 흉터 등으로 신경 주변에 달라붙은
                  유착 부위까지 카테터를 접근시켜 유착을 완화하고, 약물이 병변에
                  잘 퍼지도록 돕는 시술입니다.
                </p>
              </div>
            </article>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="neuroplasty-benefits"
          className="relative overflow-hidden rounded-[1.5rem] bg-[#071A3D] px-5 py-12 text-white sm:rounded-[2rem] sm:px-8 sm:py-16 md:px-12 md:py-20"
        >
          <div
            aria-hidden
            className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-primary/25 blur-[100px]"
          />
          <div className="relative">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              신경성형술 / 경막외유착박리술의 장점
            </h3>

            <div className="mt-10 flex flex-wrap justify-center gap-3 sm:mt-12 sm:gap-4 lg:gap-4 xl:gap-6">
              {advantages.map((title, index) => (
                <ScrollReveal
                  key={title}
                  variant="metric"
                  amount={0.2}
                  delay={index * 0.09}
                >
                  <div className="group relative flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/[0.05] p-6 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-300/40 hover:bg-white/[0.09] sm:h-[180px] sm:w-[180px] lg:h-[160px] lg:w-[160px] xl:h-[200px] xl:w-[200px]">
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-[radial-gradient(80%_80%_at_50%_15%,rgba(40,74,165,0.35),transparent_70%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <h4 className="relative break-keep text-[15px] font-black leading-snug text-white sm:text-base xl:text-lg">
                      {title}
                    </h4>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="neuroplasty-candidates">
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              이런 증상이 지속된다면
              <br className="hidden md:block" /> 적용 가능 여부를 확인합니다
            </h3>
          </div>

          <div className="mt-9 grid gap-3 sm:mt-12 md:grid-cols-2 md:gap-4">
            {candidates.map((item, index) => (
              <ScrollReveal
                key={item}
                variant="soft-rise"
                amount={0.15}
                delay={index * 0.06}
                className="h-full"
              >
                <article className="flex h-full items-start gap-4 rounded-[1rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-50px_rgba(15,29,54,0.65)] sm:rounded-[1.25rem] sm:p-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={20} strokeWidth={3} />
                  </span>
                  <p className="break-keep pt-1 text-[15px] font-extrabold leading-[1.7] text-ink sm:text-[17px]">
                    {item}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="neuroplasty-principle"
          className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-premium sm:rounded-[2rem] sm:p-7 md:p-10"
        >
          <div className="max-w-4xl px-1 pb-6 sm:pb-8">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              치료 원리를 한눈에 확인하세요
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl bg-[#F7F9FC] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:rounded-2xl">
            <Image
              src={`${ASSET_ROOT}/neuroplasty-process-overview.png`}
              alt="신경성형술의 최소 접근부터 카테터 이동과 약물 전달까지 보여주는 4단계 입체 의료 이미지"
              width={1774}
              height={887}
              sizes="(min-width: 768px) 1100px, 220vw"
              className="h-auto min-w-[820px] max-w-none w-[220vw] md:min-w-0 md:w-full"
            />
          </div>

          <ol className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 md:grid-cols-4">
            {overviewSteps.map((item) => (
              <li key={item.step} className="rounded-xl bg-slate-50 p-3 sm:p-4">
                <h4 className="break-keep text-[15px] font-black leading-snug text-ink sm:text-base">
                  {item.title}
                </h4>
                <p className="mt-1.5 break-keep text-[12px] font-medium leading-[1.6] text-ink-sub sm:text-[13px]">
                  {item.desc}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </ScrollReveal>

      <section id="neuroplasty-clinical-process">
        <ScrollReveal variant="soft-rise" amount={0.08}>
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              실제 시술은 이렇게 진행됩니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              첨부된 실제 시술 자료에서 단계 표기를 분리하고 장면을 선명하게
              보정했습니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-3 md:gap-5">
          {clinicalSteps.map((item, index) => (
            <MediaStepCard key={item.step} item={item} index={index} />
          ))}
        </div>
      </section>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="neuroplasty-lumbar-xray"
          className="rounded-[1.5rem] bg-navy-950 px-4 py-10 text-white sm:rounded-[2rem] sm:px-7 sm:py-14 md:px-10 md:py-20"
        >
          <div className="max-w-4xl px-1">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              신경성형술 / 경막외유착박리술
              <br className="hidden md:block" /> 시술 과정 · X-ray
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-white/70 md:text-lg">
              X-ray 영상을 실시간으로 확인하며 카테터를 병변 부위까지 정밀하게
              이동시킵니다.
            </p>
          </div>
          <div className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-5">
            {lumbarXraySteps.map((item, index) => (
              <MediaStepCard key={item.step} item={item} index={index} dark />
            ))}
          </div>
        </section>
      </ScrollReveal>

      <section id="neuroplasty-cervical-xray">
        <ScrollReveal variant="soft-rise" amount={0.08}>
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              경추 신경성형술 시술 과정 · X-ray
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              목 부위 역시 영상 장비로 목표 위치를 확인하며 안전 범위 안에서
              치료를 진행합니다.
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-5">
          {cervicalXraySteps.map((item, index) => (
            <MediaStepCard key={item.step} item={item} index={index} />
          ))}
        </div>
      </section>

      <ScrollReveal variant="soft-rise" amount={0.1}>
        <aside className="rounded-xl border border-amber-200/80 bg-amber-50 px-5 py-5 sm:px-6">
          <p className="break-keep text-[13px] font-semibold leading-[1.75] text-amber-950/75 sm:text-[14px]">
            시술 효과와 회복 기간은 환자의 상태에 따라 달라질 수 있습니다.
            드물게 출혈, 감염, 일시적 통증 악화, 신경 손상 등의 합병증이 발생할
            수 있으므로 검사 결과와 전신 상태를 바탕으로 전문의와 충분히
            상담해야 합니다.
          </p>
        </aside>
      </ScrollReveal>
    </div>
  );
}

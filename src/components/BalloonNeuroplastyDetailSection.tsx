import Image from "next/image";
import { Check } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ASSET_ROOT = "/images/treatments/non-surgical/balloon";

const principles = [
  {
    number: "01",
    title: "병변 가까이 접근",
    desc: "C-arm 영상을 확인하며 가느다란 풍선 카테터를 증상과 관련된 부위 가까이 이동합니다.",
  },
  {
    number: "02",
    title: "공간 확보·유착 완화",
    desc: "필요한 범위에서 풍선을 짧게 확장해 신경 주변의 공간 확보와 유착 완화를 돕습니다.",
  },
  {
    number: "03",
    title: "표적 약물 전달",
    desc: "조영제로 위치와 분포를 확인하며 확보된 경로를 통해 병변 가까이에 약물을 전달합니다.",
  },
];

const advantages = [
  {
    title: "국소마취로 진행",
    desc: "전신마취에 대한 부담을 낮춥니다.",
  },
  {
    title: "수술 부담을 고려한 선택지",
    desc: "전신 상태를 평가한 뒤 적용을 검토합니다.",
  },
  {
    title: "큰 절개 없는 접근",
    desc: "상태 확인 후 일상 복귀를 계획할 수 있습니다.",
  },
  {
    title: "약 20~30분 내외",
    desc: "시술 부위와 범위에 따라 달라질 수 있습니다.",
  },
];

const candidates = [
  "척추관협착증 또는 신경공협착증으로 다리 통증·저림이 이어지는 경우",
  "허리디스크 등으로 물리치료·약물치료·신경주사 후에도 통증이 지속되는 경우",
  "척추 수술 후 신경 주변 유착이 의심되며 통증이 남아 있는 경우",
  "기존 신경성형술이나 내시경 시술 후에도 개선이 충분하지 않은 경우",
  "서거나 걸을 때 통증이 악화되고 쉬면 줄어드는 신경성 파행이 있는 경우",
];

const procedureSteps = [
  {
    number: "01",
    title: "접근 경로 확보",
    desc: "꼬리뼈 주변을 국소마취한 뒤 작은 통로로 카테터를 삽입합니다.",
    position: "0%",
    alt: "꼬리뼈 주변의 작은 통로로 풍선 카테터를 삽입하는 재구성 의료 이미지",
  },
  {
    number: "02",
    title: "병변 위치 확인",
    desc: "C-arm과 조영제로 위치를 확인하며 협착 부위 가까이 이동합니다.",
    position: "33.333%",
    alt: "경막외 공간을 따라 풍선 카테터를 목표 부위로 이동하는 재구성 의료 이미지",
  },
  {
    number: "03",
    title: "풍선 확장·유착 완화",
    desc: "반응을 살피며 풍선을 짧게 확장해 공간 확보와 유착 완화를 돕습니다.",
    position: "66.666%",
    alt: "신경 주변의 좁아진 부위에서 작은 풍선을 확장하는 재구성 의료 이미지",
  },
  {
    number: "04",
    title: "표적 약물 전달",
    desc: "풍선을 수축한 뒤 목표 신경 주변에 약물을 전달하고 마무리합니다.",
    position: "100%",
    alt: "풍선 확장 후 목표 신경 주변에 약물을 전달하는 재구성 의료 이미지",
  },
];

const cArmImages = [
  {
    title: "카테터 위치 확인",
    desc: "실시간 영상으로 카테터가 목표 부위 가까이에 도달했는지 확인합니다.",
    image: `${ASSET_ROOT}/balloon-xray-catheter-position.png`,
    alt: "C-arm 영상으로 경막외 풍선 카테터의 위치를 확인하는 장면",
  },
  {
    title: "풍선 확장 범위 확인",
    desc: "필요한 위치에서 풍선이 확장되는 범위를 살피며 시술을 진행합니다.",
    image: `${ASSET_ROOT}/balloon-xray-balloon-expansion.png`,
    alt: "C-arm 영상으로 경막외 풍선의 확장 범위를 확인하는 장면",
  },
];

export default function BalloonNeuroplastyDetailSection() {
  return (
    <div
      id="balloon-detail"
      className="space-y-16 sm:space-y-20 md:space-y-28"
    >
      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="balloon-introduction">
          <div className="relative md:min-h-[560px] xl:min-h-[620px]">
            <div className="relative z-10 pb-7 md:absolute md:inset-y-0 md:left-0 md:flex md:w-[58%] md:items-center md:px-10 md:pb-0 lg:px-14 xl:px-16">
              <div className="max-w-[670px]">
                <h2 className="break-keep text-h2 tracking-tight text-ink sm:text-4xl md:text-[2.7rem] md:leading-[1.18] md:text-white lg:text-[3.25rem]">
                  좁아진 신경 주변에,
                  <br className="hidden md:block" /> 작은 풍선으로 정밀하게
                  접근합니다
                </h2>
                <p className="mt-5 max-w-[590px] break-keep text-body-lg text-ink-sub md:mt-7 md:text-white/85">
                  C-arm 영상을 확인하며 끝에 작은 풍선이 달린 특수 카테터를
                  병변 가까이 이동한 뒤, 풍선을 짧게 확장해 신경 주변의 유착
                  완화와 표적 약물 전달을 돕는 비수술 시술입니다.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-navy-950 sm:aspect-[16/10] sm:rounded-[1.75rem] md:absolute md:inset-0 md:aspect-auto md:rounded-[2rem]">
              <Image
                src={`${ASSET_ROOT}/balloon-catheter-hero.png`}
                alt="풍선 카테터가 좁아진 요추 신경 통로 가까이 접근하는 경막외풍선확장술 설명 이미지"
                fill
                fetchPriority="high"
                sizes="(min-width: 1280px) 1280px, (min-width: 768px) 100vw, 92vw"
                className="object-cover object-center md:object-[58%_center]"
              />
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,13,32,0.97)_0%,rgba(3,16,39,0.88)_40%,rgba(4,19,45,0.4)_64%,rgba(4,19,45,0.04)_84%)] md:block"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="balloon-explanation">
          <div className="max-w-4xl">
            <h3 className="break-keep text-h2 tracking-tight text-ink">
              풍선 카테터는 어떤 역할을 하나요?
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-body-lg text-ink-sub">
              신경이 지나는 경막외 공간이 좁아지거나 주변 조직이 달라붙으면
              약물이 필요한 부위까지 퍼지기 어려울 수 있습니다. 풍선 카테터는
              좁아진 공간의 확장을 돕고, 병변 가까이에 약물을 전달할 수 있도록
              사용됩니다. 척추관 자체를 영구적으로 넓히는 수술과는 다릅니다.
            </p>
          </div>

          <div className="mt-9 grid overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-premium sm:mt-12 sm:rounded-[2rem] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="flex items-center bg-navy-950 p-5 text-white sm:p-8 md:p-10 lg:p-12">
              <div>
                <h4 className="break-keep text-h3 md:text-[2rem]">
                  통로를 확인하고,
                  <br /> 필요한 만큼 확장을 돕습니다
                </h4>
                <p className="mt-4 break-keep text-body-lg text-white/85">
                  풍선을 크게 부풀리는 것이 목적이 아니라, 영상으로 위치를
                  확인하면서 치료가 필요한 범위에 제한적으로 적용하는
                  방식입니다.
                </p>
              </div>
            </div>

            <figure className="bg-[#F4F7FC] p-4 sm:p-6 md:p-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-white sm:rounded-[1.35rem]">
                <Image
                  src={`${ASSET_ROOT}/balloon-catheter-device.png`}
                  alt="경막외풍선확장술에 사용하는 특수 풍선 카테터 장치"
                  fill
                  sizes="(min-width: 1024px) 650px, 92vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="px-1 pt-4 break-keep text-[13px] font-semibold leading-[1.7] text-ink-sub sm:px-2 sm:text-[14px]">
                시술 이해를 돕기 위한 재구성 이미지입니다. 실제 시술에서는
                C-arm으로 카테터의 위치와 풍선 확장 범위를 확인합니다.
              </figcaption>
            </figure>
          </div>
        </section>
      </ScrollReveal>

      <section id="balloon-principle">
        <ScrollReveal variant="soft-rise" amount={0.08}>
          <div className="max-w-4xl">
            <h3 className="break-keep text-h2 tracking-tight text-ink">
              세 가지 원리로 통증 부위에 접근합니다
            </h3>
          </div>
        </ScrollReveal>

        <div className="mt-9 grid gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3">
          {principles.map((item, index) => (
            <ScrollReveal
              key={item.number}
              variant="soft-rise"
              amount={0.14}
              delay={index * 0.07}
              className="h-full"
            >
              <article className="h-full rounded-[1.15rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-50px_rgba(15,29,54,0.65)] sm:rounded-[1.4rem] sm:p-7">
                <h4 className="break-keep text-h4 leading-snug text-ink">
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

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="balloon-benefits"
          className="relative overflow-hidden rounded-[1.5rem] bg-[#071A3D] px-4 py-11 text-white sm:rounded-[2rem] sm:px-8 sm:py-16 md:px-12 md:py-20"
        >
          <div
            aria-hidden
            className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-primary/25 blur-[100px]"
          />
          <div className="relative">
            <h3 className="break-keep text-h2 tracking-tight">
              경막외풍선확장술의 특징
            </h3>

            <div className="mt-9 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-4 lg:grid-cols-4">
              {advantages.map((item, index) => (
                <ScrollReveal
                  key={item.title}
                  variant="soft-rise"
                  amount={0.15}
                  delay={index * 0.07}
                  className="h-full"
                >
                  <article className="flex h-full min-h-[148px] flex-col rounded-[1rem] border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur-sm sm:min-h-[170px] sm:rounded-[1.3rem] sm:p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-navy-950 sm:h-9 sm:w-9">
                      <Check size={18} strokeWidth={3} />
                    </span>
                    <h4 className="mt-4 break-keep text-[14px] font-bold leading-[1.45] text-white sm:text-base">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 break-keep text-[12px] font-medium leading-[1.6] text-white/80 sm:text-[14px]">
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
        <section id="balloon-candidates">
          <div className="max-w-4xl">
            <h3 className="break-keep text-h2 tracking-tight text-ink">
              이런 경우 적용 가능성을 확인합니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-body-lg text-ink-sub">
              같은 진단명이라도 증상과 협착 정도, 이전 치료 이력에 따라 적합한
              치료는 달라질 수 있습니다.
            </p>
          </div>

          <div className="mt-9 grid gap-3 sm:mt-12 md:grid-cols-2 md:gap-4">
            {candidates.map((item, index) => (
              <ScrollReveal
                key={item}
                variant="soft-rise"
                amount={0.14}
                delay={index * 0.05}
                className={`h-full ${index === candidates.length - 1 ? "md:col-span-2" : ""}`}
              >
                <article className="flex h-full items-start gap-3.5 rounded-[1rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-50px_rgba(15,29,54,0.65)] sm:gap-4 sm:rounded-[1.25rem] sm:p-6">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-navy-950 sm:h-9 sm:w-9">
                    <Check size={18} strokeWidth={3} />
                  </span>
                  <p className="break-keep pt-0.5 text-[14px] font-extrabold leading-[1.7] text-ink sm:pt-1 sm:text-[17px]">
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
          id="balloon-process"
          className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-premium sm:rounded-[2rem] sm:p-7 md:p-10"
        >
          <div className="max-w-4xl px-1 pb-6 sm:pb-8">
            <h3 className="break-keep text-h2 tracking-tight text-ink">
              시술 과정은 네 단계로 진행됩니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-body-lg text-ink-sub">
              시술 중에는 C-arm으로 카테터의 위치를 확인하며 각 단계를
              진행합니다.
            </p>
          </div>

          <ol className="mt-2 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-4 lg:grid-cols-4">
            {procedureSteps.map((item) => (
              <li
                key={item.number}
                className="overflow-hidden rounded-[1rem] border border-slate-100 bg-slate-50 sm:rounded-[1.25rem]"
              >
                <div className="relative aspect-[5/8] overflow-hidden bg-[#F4F7FC]">
                  <Image
                    src={`${ASSET_ROOT}/balloon-process-overview.png`}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 46vw"
                    className="object-cover"
                    style={{ objectPosition: `${item.position} center` }}
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <span className="font-montserrat text-[11px] font-bold tracking-[0.14em] text-primary">
                    {item.number}
                  </span>
                  <h4 className="break-keep text-[15px] font-bold leading-snug text-ink sm:text-base">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 break-keep text-[12px] font-medium leading-[1.65] text-ink-sub sm:text-[14px]">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 px-1 break-keep text-[13px] font-semibold leading-[1.7] text-ink-sub sm:text-[14px]">
            시술 이해를 돕기 위한 재구성 이미지이며, 실제 과정과 범위는 환자
            상태에 따라 달라질 수 있습니다.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="balloon-carm"
          className="rounded-[1.5rem] bg-navy-950 px-4 py-10 text-white sm:rounded-[2rem] sm:px-7 sm:py-14 md:px-10 md:py-20"
        >
          <div className="max-w-4xl px-1">
            <h3 className="break-keep text-h2 tracking-tight">
              C-arm으로 위치를 확인하며 진행합니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-white/80 md:text-lg">
              카테터의 끝과 풍선 확장 위치를 실시간 영상으로 살피며 목표 부위에
              접근합니다.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-5">
            {cArmImages.map((item, index) => (
              <ScrollReveal
                key={item.image}
                variant="soft-rise"
                amount={0.12}
                delay={index * 0.07}
                className="h-full"
              >
                <figure className="h-full overflow-hidden rounded-[1.15rem] border border-white/10 bg-white/[0.07] sm:rounded-[1.4rem]">
                  <div className="relative aspect-[8/5] overflow-hidden bg-black/20">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 92vw"
                      className="object-contain"
                    />
                  </div>
                  <figcaption className="p-4 sm:p-5 md:p-6">
                    <h4 className="break-keep text-[1.05rem] font-bold leading-snug text-white sm:text-xl">
                      {item.title}
                    </h4>
                    <p className="mt-2 break-keep text-[14px] font-medium leading-[1.7] text-white/80 sm:text-[15px]">
                      {item.desc}
                    </p>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.1}>
        <aside className="rounded-xl border border-amber-200/80 bg-amber-50 px-5 py-5 sm:px-6">
          <p className="break-keep text-body font-semibold text-amber-950/90">
            시술의 적용 여부와 효과, 회복 기간은 협착 정도와 증상, 전신 상태에
            따라 달라질 수 있습니다. 복용 중인 항혈소판제·항응고제, 감염,
            출혈성 질환, 조영제 알레르기가 있다면 반드시 미리 알려야 합니다.
            일시적인 통증·저림이나 두통이 나타날 수 있고 드물게 출혈, 감염,
            경막 천자, 신경 손상 등이 보고되어 전문의의 사전 평가와 시술 후
            관찰이 필요합니다.
          </p>
        </aside>
      </ScrollReveal>
    </div>
  );
}

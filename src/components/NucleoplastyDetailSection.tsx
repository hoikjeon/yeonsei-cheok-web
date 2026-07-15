import Image from "next/image";
import { Check } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ASSET_ROOT = "/images/treatments/non-surgical/nucleoplasty";

const principles = [
  {
    number: "01",
    title: "수핵 안쪽에 위치 확인",
    desc: "C-arm 영상을 보며 가는 전극을 증상과 관련된 디스크의 수핵 안쪽에 위치시킵니다.",
    image: `${ASSET_ROOT}/nucleoplasty-mechanism-01-contained.png`,
    alt: "신경 근처로 돌출한 포함성 요추 디스크 재구성 이미지",
  },
  {
    number: "02",
    title: "수핵 일부 미세 제거",
    desc: "상대적으로 낮은 온도에서 형성되는 플라즈마로 수핵 일부를 미세하게 제거합니다.",
    image: `${ASSET_ROOT}/nucleoplasty-mechanism-02-ablation.png`,
    alt: "고주파 전극으로 수핵 안쪽에 미세 감압 통로를 만드는 재구성 이미지",
  },
  {
    number: "03",
    title: "내부 압력 완화",
    desc: "여러 개의 작은 감압 통로를 만들어 디스크 내부 압력과 신경 자극 완화를 돕습니다.",
    image: `${ASSET_ROOT}/nucleoplasty-mechanism-03-decompressed.png`,
    alt: "수핵 안쪽에 감압 통로가 형성된 요추 디스크 재구성 이미지",
  },
];

const advantages = [
  {
    title: "국소마취로 진행",
    desc: "전신 상태를 확인한 뒤 적용합니다.",
  },
  {
    title: "큰 절개 없는 접근",
    desc: "가는 접근 바늘과 전극을 이용합니다.",
  },
  {
    title: "회복 계획 수립",
    desc: "시술 후 상태에 따라 복귀를 계획합니다.",
  },
  {
    title: "약 20~30분 내외",
    desc: "시술 부위와 범위에 따라 달라집니다.",
  },
];

const candidates = [
  "MRI에서 수핵이 섬유륜 안에 머무는 포함성 디스크 돌출이 확인된 경우",
  "MRI 병변 위치와 허리 통증 또는 다리 방사통의 양상이 서로 일치하는 경우",
  "약물·물리치료·주사치료 등 보존적 치료 후에도 증상이 충분히 줄지 않은 경우",
  "디스크의 바깥 섬유륜이 비교적 유지되고 수핵 조각의 이탈이 의심되지 않는 경우",
  "진찰과 영상검사를 거쳐 수술 전 비수술 치료의 적용 가능성을 검토하는 경우",
];

const mriImages = [
  {
    label: "비교 참고",
    title: "정상 범위의 디스크",
    desc: "디스크 뒤쪽 경계와 신경이 지나는 공간을 비교해 볼 수 있습니다.",
    image: `${ASSET_ROOT}/nucleoplasty-mri-normal.png`,
    alt: "정상 범위의 요추 디스크를 보여주는 축상면 MRI 참고 영상",
  },
  {
    label: "적용 검토 예시",
    title: "포함성 디스크 돌출",
    desc: "돌출 부위가 바깥 섬유륜 안에 머무는 형태인지 함께 확인합니다.",
    image: `${ASSET_ROOT}/nucleoplasty-mri-contained-protrusion.png`,
    alt: "포함성 요추 디스크 돌출을 보여주는 축상면 MRI 참고 영상",
  },
];

const procedureSteps = [
  {
    number: "01",
    title: "진찰·MRI 확인",
    desc: "증상과 MRI 병변이 일치하는지 확인하고 목표 디스크를 정합니다.",
    image: `${ASSET_ROOT}/nucleoplasty-process-01.png`,
    alt: "고주파수핵감압술 접근 바늘을 수핵 안쪽으로 이동시키는 재구성 이미지",
  },
  {
    number: "02",
    title: "접근 바늘 삽입",
    desc: "국소마취 후 C-arm을 보며 가는 바늘을 디스크 안쪽으로 접근시킵니다.",
    image: `${ASSET_ROOT}/nucleoplasty-process-02.png`,
    alt: "접근 바늘을 통해 고주파 전극을 수핵 내부에 위치시키는 재구성 이미지",
  },
  {
    number: "03",
    title: "전극 위치 확인",
    desc: "가는 고주파 전극을 수핵 내 목표 위치에 두고 안전 범위를 확인합니다.",
    image: `${ASSET_ROOT}/nucleoplasty-process-03.png`,
    alt: "수핵 내부에서 고주파 전극으로 미세 감압을 진행하는 재구성 이미지",
  },
  {
    number: "04",
    title: "감압 통로 형성",
    desc: "수핵 일부를 미세하게 제거해 여러 감압 통로를 만든 뒤 기구를 제거합니다.",
    image: `${ASSET_ROOT}/nucleoplasty-process-04.png`,
    alt: "수핵 안쪽에 여러 개의 감압 통로가 형성된 재구성 이미지",
  },
];

const cArmImages = [
  {
    title: "접근 위치 확인",
    desc: "C-arm으로 목표 디스크와 접근 바늘의 진행 방향을 확인합니다.",
    image: `${ASSET_ROOT}/nucleoplasty-carm-position-01.png`,
    alt: "C-arm으로 고주파수핵감압술 접근 바늘의 위치를 확인하는 참고 영상",
  },
  {
    title: "수핵 내 위치 확인",
    desc: "전극 끝이 계획한 수핵 안쪽에 위치하는지 확인한 뒤 감압을 진행합니다.",
    image: `${ASSET_ROOT}/nucleoplasty-carm-position-02.png`,
    alt: "C-arm으로 고주파 전극의 수핵 내 위치를 확인하는 참고 영상",
  },
];

const difficultCases = [
  "디스크 조각이 섬유륜 밖으로 빠져나온 압출형·유리형 탈출이 의심되는 경우",
  "뼈나 인대 비후로 인한 척추관·신경공 협착이 심한 경우",
  "디스크 퇴행과 높이 감소가 심해 감압할 수 있는 수핵이 충분하지 않은 경우",
  "척추전방전위증 등 분절 불안정성이 통증의 주요 원인으로 판단되는 경우",
];

export default function NucleoplastyDetailSection() {
  return (
    <div
      id="nucleoplasty-detail"
      className="space-y-16 sm:space-y-20 md:space-y-28"
    >
      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="nucleoplasty-introduction">
          <div className="relative md:min-h-[560px] xl:min-h-[620px]">
            <div className="relative z-10 pb-7 md:absolute md:inset-y-0 md:left-0 md:flex md:w-[58%] md:items-center md:px-10 md:pb-0 lg:px-14 xl:px-16">
              <div className="max-w-[670px]">
                <p className="mb-4 break-words font-montserrat text-[10px] font-black uppercase tracking-[0.14em] text-primary sm:text-[11px] sm:tracking-[0.18em] md:text-white/65">
                  Radiofrequency Nucleoplasty
                </p>
                <h2 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[2.7rem] md:leading-[1.18] md:text-white lg:text-[3.25rem]">
                  디스크 안쪽의 압력을 낮춰,
                  <br className="hidden md:block" /> 신경 자극 완화를 돕습니다
                </h2>
                <p className="mt-5 max-w-[590px] break-keep text-base font-medium leading-[1.8] text-ink-sub md:mt-7 md:text-[17px] md:text-white/75 lg:text-lg">
                  C-arm으로 위치를 확인하며 가는 전극을 수핵 안쪽에 놓고,
                  상대적으로 낮은 온도의 플라즈마로 수핵 일부를 미세하게
                  제거해 디스크 내부 압력 완화를 돕는 비수술 시술입니다.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-navy-950 sm:aspect-[16/10] sm:rounded-[1.75rem] md:absolute md:inset-0 md:aspect-auto md:rounded-[2rem]">
              <Image
                src={`${ASSET_ROOT}/nucleoplasty-hero.png`}
                alt="가는 전극이 요추 디스크의 수핵 안쪽에 접근하는 고주파수핵감압술 재구성 이미지"
                fill
                fetchPriority="high"
                sizes="(min-width: 1280px) 1280px, (min-width: 768px) 100vw, 92vw"
                className="object-cover object-[68%_center] md:object-center"
              />
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,13,32,0.98)_0%,rgba(3,16,39,0.9)_40%,rgba(4,19,45,0.42)_64%,rgba(4,19,45,0.04)_84%)] md:block"
              />
            </div>
            <p className="mt-2 px-1 break-keep text-[11px] font-semibold leading-[1.6] text-ink-sub md:absolute md:bottom-5 md:right-6 md:z-20 md:mt-0 md:rounded-full md:bg-black/35 md:px-3 md:py-1.5 md:text-white/65 md:backdrop-blur-sm">
              시술 이해를 돕기 위한 재구성 이미지입니다.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section id="nucleoplasty-explanation">
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              고주파수핵감압술, 이렇게 이해하세요
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              이 시술은 신경을 태우거나 차단하는 치료가 아니며, 밖으로 나온
              디스크 조각을 녹여 흡출하는 수술도 아닙니다. 디스크 안쪽 수핵의
              일부를 미세하게 제거해 여러 감압 통로를 만들고, 내부 압력이
              완화되도록 돕는 치료입니다.
            </p>
          </div>

          <div className="mt-9 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-premium sm:mt-12 sm:rounded-[2rem]">
            <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
              <div className="flex items-center bg-navy-950 p-5 text-white sm:p-8 md:p-10 lg:p-12">
                <div>
                  <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-black text-white/80">
                    핵심 원리
                  </span>
                  <h4 className="mt-5 break-keep text-[1.45rem] font-black leading-[1.3] sm:text-2xl md:text-[2rem]">
                    수핵의 작은 일부를 줄여
                    <br /> 내부 압력 완화를 돕습니다
                  </h4>
                  <p className="mt-4 break-keep text-[15px] font-medium leading-[1.8] text-white/70 md:text-[17px]">
                    디스크 전체를 제거하는 것이 아니라, 계획된 위치에 작은 감압
                    통로를 만드는 방식입니다.
                  </p>
                </div>
              </div>

              <figure className="bg-[#F4F7FC] p-4 sm:p-6 md:p-8">
                <div className="relative hidden aspect-[16/7] overflow-hidden rounded-[1.35rem] bg-white md:block">
                  <Image
                    src={`${ASSET_ROOT}/nucleoplasty-mechanism.png`}
                    alt="포함성 디스크 돌출에서 전극으로 수핵 일부를 미세 제거하고 감압 통로를 형성하는 원리 재구성 이미지"
                    fill
                    sizes="(min-width: 1024px) 760px, 92vw"
                    className="object-contain"
                  />
                </div>

                <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
                  {principles.map((item) => (
                    <div
                      key={item.number}
                      className="w-[82%] shrink-0 snap-center overflow-hidden rounded-[1rem] border border-slate-200 bg-white shadow-[0_18px_45px_-36px_rgba(15,29,54,0.8)]"
                    >
                      <div className="relative aspect-[3/4] bg-slate-100">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          sizes="82vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <span className="font-montserrat text-[11px] font-black tracking-[0.14em] text-primary">
                          {item.number}
                        </span>
                        <p className="mt-1 break-keep text-[14px] font-black leading-[1.55] text-ink">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <figcaption className="px-1 pt-4 break-keep text-[12px] font-semibold leading-[1.7] text-ink-sub sm:px-2 sm:text-[14px]">
                  시술 이해를 돕기 위한 재구성 이미지이며, 실제 치료 범위는 환자
                  상태에 따라 달라질 수 있습니다.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section id="nucleoplasty-principle">
        <ScrollReveal variant="soft-rise" amount={0.08}>
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              세 가지 원리로 디스크 내부를 감압합니다
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
                <span className="font-montserrat text-[13px] font-black tracking-[0.16em] text-primary">
                  {item.number}
                </span>
                <h4 className="mt-4 break-keep text-[1.15rem] font-black leading-snug text-ink sm:text-xl">
                  {item.title}
                </h4>
                <p className="mt-2.5 break-keep text-[14px] font-medium leading-[1.75] text-ink-sub sm:text-[15px]">
                  {item.desc}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="nucleoplasty-benefits"
          className="relative overflow-hidden rounded-[1.5rem] bg-[#071A3D] px-4 py-11 text-white sm:rounded-[2rem] sm:px-8 sm:py-16 md:px-12 md:py-20"
        >
          <div
            aria-hidden
            className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-primary/25 blur-[100px]"
          />
          <div className="relative">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              고주파수핵감압술의 특징
            </h3>

            <div className="mt-9 grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:mt-12 sm:gap-4 lg:grid-cols-4">
              {advantages.map((item, index) => (
                <ScrollReveal
                  key={item.title}
                  variant="soft-rise"
                  amount={0.15}
                  delay={index * 0.07}
                  className="h-full"
                >
                  <article className="flex h-full min-h-[136px] flex-col rounded-[1rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:min-h-[170px] sm:rounded-[1.3rem] sm:p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:h-9 sm:w-9">
                      <Check size={18} strokeWidth={3} />
                    </span>
                    <h4 className="mt-4 break-keep text-[15px] font-black leading-[1.45] text-white sm:text-base">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 break-keep text-[12px] font-medium leading-[1.65] text-white/75 sm:text-[13px]">
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
        <section id="nucleoplasty-candidates">
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              이런 경우 적용 가능성을 확인합니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              진단명만으로 결정하지 않으며, MRI에서 확인한 디스크의 형태와 실제
              증상이 일치하는지 함께 평가하는 과정이 중요합니다.
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
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:h-9 sm:w-9">
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
        <section id="nucleoplasty-mri">
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              MRI에서 디스크 형태를 함께 확인합니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              영상의 모양만으로 시술을 결정하지는 않습니다. 돌출된 수핵이
              섬유륜 안에 머무는지, 해당 위치가 증상과 관련되는지 함께
              판단합니다.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-5">
            {mriImages.map((item, index) => (
              <ScrollReveal
                key={item.image}
                variant="soft-rise"
                amount={0.12}
                delay={index * 0.07}
                className="h-full"
              >
                <figure className="h-full overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white shadow-[0_24px_70px_-52px_rgba(15,29,54,0.7)] sm:rounded-[1.4rem]">
                  <div className="relative aspect-square overflow-hidden bg-black">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 92vw"
                      className="object-contain"
                    />
                  </div>
                  <figcaption className="p-4 sm:p-5 md:p-6">
                    <span className="text-[11px] font-black text-primary sm:text-xs">
                      {item.label}
                    </span>
                    <h4 className="mt-1 break-keep text-[1.05rem] font-black leading-snug text-ink sm:text-xl">
                      {item.title}
                    </h4>
                    <p className="mt-2 break-keep text-[13px] font-medium leading-[1.7] text-ink-sub sm:text-[15px]">
                      {item.desc}
                    </p>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-4 break-keep text-[12px] font-semibold leading-[1.7] text-ink-sub sm:text-[13px]">
            위 이미지는 제공된 참고 영상이며, 실제 판독과 치료 결정은 전체 MRI
            소견과 진찰 결과를 바탕으로 이루어집니다.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="nucleoplasty-process"
          className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-premium sm:rounded-[2rem] sm:p-7 md:p-10"
        >
          <div className="max-w-4xl px-1 pb-6 sm:pb-8">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              시술 과정은 네 단계로 진행됩니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              접근 바늘과 전극의 위치를 C-arm으로 확인하며 계획한 수핵 범위에서
              감압을 진행합니다.
            </p>
          </div>

          <figure className="hidden md:block">
            <div className="relative aspect-[16/7] overflow-hidden rounded-[1rem] bg-[#F4F7FC] sm:rounded-[1.4rem]">
              <Image
                src={`${ASSET_ROOT}/nucleoplasty-process-overview.png`}
                alt="접근 바늘 삽입부터 고주파 전극 위치 확인과 감압 통로 형성까지 보여주는 고주파수핵감압술 재구성 이미지"
                fill
                sizes="(min-width: 1280px) 1100px, (min-width: 768px) 90vw, 92vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 px-1 break-keep text-[12px] font-semibold leading-[1.7] text-ink-sub sm:text-[13px]">
              시술 이해를 돕기 위한 재구성 이미지이며, 실제 접근 방향과 감압
              범위는 환자 상태에 따라 달라질 수 있습니다.
            </figcaption>
          </figure>

          <ol className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
            {procedureSteps.map((item) => (
              <li
                key={item.number}
                className="w-[82%] shrink-0 snap-center overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="82vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-start gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-montserrat text-[11px] font-black text-white">
                    {item.number}
                  </span>
                  <div className="min-w-0">
                    <h4 className="break-keep text-[15px] font-black leading-snug text-ink">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 break-keep text-[12px] font-medium leading-[1.65] text-ink-sub">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-3 break-keep text-[12px] font-semibold leading-[1.7] text-ink-sub md:hidden">
            카드를 옆으로 밀어 네 단계를 이어서 확인하세요.
          </p>

          <ol className="mt-5 hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
            {procedureSteps.map((item) => (
              <li
                key={item.number}
                className="flex items-start gap-3 rounded-[0.9rem] bg-slate-50 p-3.5 sm:block sm:p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-montserrat text-[11px] font-black text-white">
                  {item.number}
                </span>
                <div className="min-w-0 sm:mt-4">
                  <h4 className="break-keep text-[15px] font-black leading-snug text-ink sm:text-base">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 break-keep text-[12px] font-medium leading-[1.65] text-ink-sub sm:text-[13px]">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="nucleoplasty-carm"
          className="rounded-[1.5rem] bg-navy-950 px-4 py-10 text-white sm:rounded-[2rem] sm:px-7 sm:py-14 md:px-10 md:py-20"
        >
          <div className="max-w-4xl px-1">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              C-arm으로 수핵 내 위치를 확인합니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-white/70 md:text-lg">
              목표 디스크와 접근 방향, 전극 끝의 위치를 실시간 영상으로 살피며
              시술합니다.
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
                  <div className="relative aspect-square overflow-hidden bg-black/20">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 92vw"
                      className="object-contain"
                    />
                  </div>
                  <figcaption className="p-4 sm:p-5 md:p-6">
                    <h4 className="break-keep text-[1.05rem] font-black leading-snug text-white sm:text-xl">
                      {item.title}
                    </h4>
                    <p className="mt-2 break-keep text-[13px] font-medium leading-[1.7] text-white/70 sm:text-[15px]">
                      {item.desc}
                    </p>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-4 px-1 break-keep text-[12px] font-semibold leading-[1.7] text-white/55 sm:text-[13px]">
            위 이미지는 제공된 참고 영상이며, 실제 시술 부위와 영상 방향은 환자
            상태에 따라 달라질 수 있습니다.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.08}>
        <section
          id="nucleoplasty-limitations"
          className="rounded-[1.5rem] border border-slate-200 bg-[#F6F8FC] p-5 sm:rounded-[2rem] sm:p-8 md:p-10"
        >
          <div className="max-w-4xl">
            <h3 className="break-keep text-[1.9rem] font-black leading-[1.25] tracking-tight text-ink sm:text-4xl md:text-[3.25rem] md:leading-[1.18]">
              이런 경우에는 다른 평가가 우선입니다
            </h3>
            <p className="mt-5 max-w-3xl break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg">
              모든 디스크 질환에 적용되는 시술은 아닙니다. 다음과 같은 경우에는
              원인과 신경 압박 정도를 다시 평가해 다른 치료를 먼저 검토할 수
              있습니다.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-10 md:grid-cols-2 md:gap-4">
            {difficultCases.map((item, index) => (
              <ScrollReveal
                key={item}
                variant="soft-rise"
                amount={0.14}
                delay={index * 0.05}
                className="h-full"
              >
                <article className="flex h-full items-start gap-3.5 rounded-[1rem] border border-slate-200 bg-white p-4 sm:gap-4 sm:rounded-[1.25rem] sm:p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[14px] font-black text-slate-700">
                    !
                  </span>
                  <p className="break-keep pt-0.5 text-[14px] font-bold leading-[1.7] text-ink sm:text-[16px]">
                    {item}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <aside className="mt-4 rounded-[1rem] border border-rose-200 bg-rose-50 p-4 sm:p-5">
            <p className="break-keep text-[13px] font-bold leading-[1.75] text-rose-950/80 sm:text-[14px]">
              진행성 근력저하, 대소변 기능 변화, 회음부 감각저하 등 마미증후군이
              의심되는 증상이 있다면 시술 선택보다 신속한 진료와 신경학적
              평가가 우선입니다.
            </p>
          </aside>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="soft-rise" amount={0.1}>
        <aside className="rounded-xl border border-amber-200/80 bg-amber-50 px-5 py-5 sm:px-6">
          <p className="break-keep text-[13px] font-semibold leading-[1.75] text-amber-950/75 sm:text-[14px]">
            시술 효과와 회복 기간은 디스크 형태와 증상, 전신 상태에 따라 달라질
            수 있으며 증상이 남거나 추가 시술·수술이 필요할 수 있습니다.
            일시적인 통증, 근육 경련, 저림이 나타날 수 있고 드물게 출혈, 감염성
            추간판염, 신경·혈관 손상 등이 보고됩니다. 복용 중인 약물과
            항혈소판제·항응고제, 약물 또는 조영제 알레르기가 있다면 시술 전에
            반드시 의료진에게 알려야 합니다. 활동성 감염이나 발열, 출혈성 질환이
            있는 경우에도 사전 평가가 필요합니다.
          </p>
        </aside>
      </ScrollReveal>
    </div>
  );
}

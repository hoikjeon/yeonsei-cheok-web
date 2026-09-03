import Image from 'next/image';
import type { Metadata } from 'next';
import { Bandage, BicepsFlexed, Bone, Footprints } from 'lucide-react';
import { createPageMetadata } from '@/lib/seo';

const postoperativeRehabTargets = [
  '관절·인대 수술 후 통증이나 부종이 이어지는 분',
  '어깨 수술 후 팔을 들거나 움직이기 불편한 분',
  '무릎 수술 후 보행이나 계단 이용이 어려운 분',
  '골절 고정 수술 후 관절 움직임이 제한된 분',
  '척추 수술 후 일상 동작과 복귀에 어려움을 느끼는 분',
  '수술 후 근력 저하나 보행 불균형이 생긴 분',
  '수술 전부터 만성 통증이나 관절 기능 저하가 있었던 분',
  '직장·운동 등 단계적인 일상 복귀를 준비하는 분',
];

const postoperativeRehabGoals = [
  { title: '수술 부위\n기능 회복', icon: Bone },
  { title: '통증 완화 및\n부종 감소', icon: Bandage },
  { title: '관절 가동범위와\n근력 회복', icon: BicepsFlexed },
  { title: '일상생활 복귀 및\n재손상 방지', icon: Footprints },
];

export const metadata: Metadata = createPageMetadata({
  title: '도수·재활 클리닉 | 연세척병원',
  description:
    '손상 이전의 움직임과 기능 회복을 돕는 연세척병원 도수·재활 클리닉 안내입니다.',
  path: '/treatments/spine/rehab',
  image: '/images/treatments/spine/rehab-clinic-intro.webp',
});

export default function RehabPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <section className="mx-auto w-full max-w-7xl px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16 md:pb-28 md:pt-24 lg:pt-28">
        <div className="mx-auto max-w-[1210px]">
          <h1 className="break-keep text-[1.8rem] font-semibold leading-[1.35] tracking-normal text-ink-sub sm:text-[2.55rem] md:text-[3.15rem] lg:text-[3.25rem]">
            회복을 기다리는 시간보다
            <br />
            <strong className="font-bold text-ink">
              손상 이전의 움직임을 빠르게 되찾도록
            </strong>{' '}
            돕습니다.
          </h1>
        </div>

        <div className="mx-auto mt-10 max-w-[1210px] overflow-hidden rounded-[1.1rem] bg-slate-100 shadow-[0_24px_70px_-54px_rgba(15,29,54,0.45)] ring-1 ring-slate-200/70 sm:mt-16 sm:rounded-[1.35rem] md:mt-24">
          <Image
            src="/images/treatments/spine/rehab-clinic-intro.webp"
            alt="연세척병원 도수·재활 클리닉에서 의료진이 환자의 상지 재활 운동 치료를 돕는 모습"
            width={1024}
            height={681}
            priority
            className="h-[210px] w-full object-cover object-center sm:h-auto"
          />
        </div>

        <div className="mx-auto mt-8 w-full max-w-[1210px] text-[15px] font-medium leading-[1.8] tracking-normal text-ink-sub sm:mt-12 sm:text-[17px] md:mt-16 md:text-[20px]">
          <p className="break-keep">
            비수술 치료나 수술 이후 통증이 줄어들었다고 해도, 몸이 곧바로 이전의 균형과
            움직임을 회복한 것은 아닙니다.
          </p>
          <p className="mt-3 break-keep sm:mt-1">
            연세척병원은 치료 후 상태에 맞춰 도수치료와 물리치료, 운동 재활을 단계적으로
            연결해 기능 회복과 일상 복귀를 돕습니다.
          </p>
        </div>
      </section>

      <section
        aria-label="도수·운동 재활치료 안내"
        className="border-t border-slate-100 bg-[#FBFCFF] px-5 py-20 sm:px-8 sm:py-28 lg:py-36"
      >
        <div className="mx-auto max-w-[1210px] space-y-20 sm:space-y-28 lg:space-y-40">
          <article className="grid items-center gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 xl:gap-24">
            <div className="order-2 overflow-hidden rounded-[1.25rem] bg-slate-100 shadow-[0_28px_70px_-48px_rgba(15,29,54,0.5)] ring-1 ring-slate-200/70 lg:order-1">
              <Image
                src="/images/treatments/spine/rehab-manual-therapy.webp"
                alt="연세척병원 도수치료사가 환자의 허리와 등 부위 움직임을 섬세하게 교정 치료하는 모습"
                width={1024}
                height={682}
                sizes="(max-width: 1023px) calc(100vw - 40px), 55vw"
                className="h-[250px] w-full object-cover object-center sm:h-[360px] md:h-[440px] lg:h-[500px]"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="break-keep text-[1.75rem] font-bold leading-[1.35] tracking-[-0.025em] text-ink sm:text-[2.15rem] lg:text-[2.65rem]">
                <span className="text-primary">정확한 평가와 섬세한 도수치료로</span>
                <br />
                흐트러진 움직임의 균형을
                <br className="hidden xl:block" /> 바로잡습니다.
              </h2>

              <p className="mt-7 break-keep text-[15px] font-medium leading-[1.85] text-ink-sub sm:mt-9 sm:text-[17px]">
                통증이 느껴지는 부위만 보지 않고 관절의 가동 범위, 근육의 긴장도,
                자세와 움직임 습관을 함께 살핍니다. 치료사가 손으로 관절과
                연부조직의 움직임을 조절해 불편을 덜고, 자연스러운 움직임을
                되찾도록 돕습니다.
              </p>
            </div>
          </article>

          <article className="grid items-center gap-9 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 xl:gap-24">
            <div>
              <h3 className="break-keep text-[1.75rem] font-bold leading-[1.35] tracking-[-0.025em] text-ink sm:text-[2.15rem] lg:text-[2.65rem]">
                치료로 되찾은 움직임이
                <br />
                일상까지 이어지도록
                <br />
                <span className="text-primary">1:1 운동재활로 회복의 힘을 키웁니다.</span>
              </h3>

              <p className="mt-7 break-keep text-[15px] font-medium leading-[1.85] text-ink-sub sm:mt-9 sm:text-[17px]">
                현재의 체력과 회복 단계에 맞춰 유연성, 근력, 균형, 동작 훈련을
                순차적으로 진행합니다. 올바른 자세와 움직임을 스스로 관리할 수
                있도록 도와 안정적인 일상 복귀를 준비합니다.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.25rem] bg-slate-100 shadow-[0_28px_70px_-48px_rgba(15,29,54,0.5)] ring-1 ring-slate-200/70">
              <Image
                src="/images/treatments/spine/rehab-functional-exercise.webp"
                alt="연세척병원 재활치료실에서 치료사의 지도에 따라 환자가 1:1 균형 및 기능 운동 훈련을 진행하는 모습"
                width={1024}
                height={682}
                sizes="(max-width: 1023px) calc(100vw - 40px), 55vw"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </article>
        </div>
      </section>

      <section
        aria-labelledby="postoperative-rehab-title"
        className="border-t border-slate-100 bg-white px-5 py-20 sm:px-8 sm:py-28 lg:py-36"
      >
        <div className="mx-auto grid max-w-[1210px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 xl:gap-28">
          <div className="lg:pt-1">
            <h2
              id="postoperative-rehab-title"
              className="break-keep text-[1.8rem] font-bold leading-[1.35] tracking-[-0.025em] text-ink sm:text-[2.25rem] lg:text-[2.7rem]"
            >
              수술 후 재활에 대해
              <br />
              <span className="text-primary">전문 치료와 관리가 필요한 분</span>
            </h2>

            <p className="mt-6 break-keep text-[15px] font-medium leading-[1.85] text-ink-sub sm:mt-8 sm:text-[17px]">
              수술 부위와 회복 속도는 사람마다 다릅니다. 다음과 같은 경우에는
              의료진의 진단을 바탕으로 현재 상태에 맞는 단계별 재활 계획이
              필요합니다.
            </p>
          </div>

          <ul className="grid gap-3 sm:gap-4">
            {postoperativeRehabTargets.map((target) => (
              <li
                key={target}
                className="flex min-h-[76px] items-center gap-4 rounded-[1.15rem] border border-primary/10 bg-slate-50 px-5 py-5 shadow-[0_18px_42px_-36px_rgba(15,29,54,0.45)] sm:min-h-[88px] sm:gap-5 sm:px-7"
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_24px_-12px_rgba(40,74,165,0.9)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </span>
                <span className="break-keep text-[15px] font-bold leading-[1.6] tracking-[-0.01em] text-ink sm:text-[17px]">
                  {target}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="postoperative-rehab-goals-title"
        className="border-t border-slate-100 bg-[#F7F9FD] px-5 py-20 sm:px-8 sm:py-28 lg:py-36"
      >
        <div className="mx-auto max-w-[1210px]">
          <div className="max-w-2xl">
            <h2
              id="postoperative-rehab-goals-title"
              className="break-keep text-[1.8rem] font-bold leading-[1.35] tracking-[-0.025em] text-ink sm:text-[2.25rem] lg:text-[2.7rem]"
            >
              수술 후 재활 <span className="text-primary">치료 목표</span>
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {postoperativeRehabGoals.map((goal) => {
              const Icon = goal.icon;

              return (
                <article
                  key={goal.title}
                  className="group relative flex min-h-[148px] flex-col justify-end overflow-hidden rounded-[1.15rem] border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-56px_rgba(15,29,54,0.5)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-[0_42px_90px_-52px_rgba(40,74,165,0.55)] motion-reduce:transform-none motion-reduce:transition-none sm:min-h-[175px] sm:rounded-[1.4rem] sm:p-6 lg:min-h-[195px] lg:p-7"
                >
                  <Icon
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-3 h-[68px] w-[68px] text-primary/[0.09] transition-all duration-500 group-hover:scale-105 group-hover:text-primary/[0.17] motion-reduce:transform-none motion-reduce:transition-none sm:right-4 sm:top-4 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                    strokeWidth={1.15}
                  />

                  <h3 className="relative whitespace-pre-line break-keep text-[17px] font-bold leading-[1.5] tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-primary-dark sm:text-[20px] lg:text-[22px]">
                    {goal.title}
                  </h3>

                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

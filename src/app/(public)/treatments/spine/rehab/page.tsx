import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '도수·재활 클리닉 | 연세척병원',
  description:
    '손상 이전의 움직임과 기능 회복을 돕는 연세척병원 도수·재활 클리닉 안내입니다.',
};

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
            src="/generated/ys-rehab-manual-therapy-intro.png"
            alt="연세척병원 도수·재활 클리닉에서 의료진이 환자의 허리 움직임을 확인하는 모습"
            width={1915}
            height={821}
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
    </main>
  );
}

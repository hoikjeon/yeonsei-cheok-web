import SubHero from '@/components/SubHero';

export default function InnovativeSurgeryPage() {
  return (
    <div className="flex flex-col bg-white">
      <SubHero
        title="혁신적인 수술치료"
        subtitle="최신 수술 기법을 활용한 혁신적인 치료 안내입니다."
        path={[
          { name: '척추센터', href: '/treatments/spine' },
          { name: '양방향 척추내시경', href: '/treatments/spine/ube' },
          { name: '혁신적인 수술치료' },
        ]}
        bgImage="/generated/ube/ube-hero-operating-room.png"
      />

      <main className="w-full flex-1">
        <section className="bg-white px-6 py-32 md:py-48 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.83M11.42 15.17l2.492-3.053c.24-.294.526-.551.841-.752l2.433-1.554M11.42 15.17l-3.052 2.492c-.294.24-.551.526-.752.841l-1.554 2.433m7.359-7.359l-1.39-1.39m0 0l-1.39-1.39m1.39 1.39l-1.39 1.39m1.39-1.39l1.39-1.39" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-ink md:text-4xl">
              페이지 제작 중입니다.
            </h2>
            <p className="text-lg font-medium text-ink-sub">
              보다 나은 콘텐츠를 제공하기 위해 준비 중입니다.<br />
              빠른 시일 내에 찾아뵙겠습니다.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

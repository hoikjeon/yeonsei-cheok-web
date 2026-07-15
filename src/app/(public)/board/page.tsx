import SubHero from '@/components/SubHero';

export default function BoardPage() {
  return (
    <div className="flex flex-col">
      <SubHero 
        title="우리들의 이야기" 
        subtitle="환자분들의 생생한 치료 후기와 병원의 공지사항을 확인하실 수 있습니다."
        path={[{ name: '커뮤니티' }, { name: '우리들의 이야기' }]}
        bgImage="/hero-bg.png"
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:py-24">
        <div className="space-y-8 text-center sm:space-y-12">
          <div className="text-4xl">📢</div>
          <div className="space-y-4">
             <h2 className="break-keep text-[26px] font-bold tracking-tight text-ink sm:text-3xl">커뮤니티 기능 준비 중</h2>
             <p className="break-keep text-[15px] font-medium leading-[1.75] text-ink-muted sm:text-base">실시간 후기 및 게시판 기능은 현재 고도화 작업 중에 있습니다. <br className="hidden sm:block" />조만간 더 편리한 기능으로 찾아뵙겠습니다.</p>
          </div>
          <div className="pt-4 sm:pt-10">
             <button className="cursor-not-allowed rounded-xl bg-slate-100 px-8 py-4 font-bold text-ink-muted sm:rounded-2xl sm:px-10 sm:py-5">준비 중</button>
          </div>
        </div>
      </section>
    </div>
  );
}

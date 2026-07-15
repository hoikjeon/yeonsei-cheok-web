import SubHero from '@/components/SubHero';

export default function NoticePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SubHero 
        title="공지사항" 
        subtitle="연세척병원의 진료 일정 변경 및 다양한 소식을 안내해 드립니다."
        path={[{ name: '병원소식' }, { name: '공지사항' }]}
        bgImage="/hero-bg.png"
      />

      <section className="flex-grow bg-white py-14 sm:py-16 md:py-24">
        <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
          <div className="space-y-6 rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:space-y-8 sm:p-10 md:rounded-[2rem] md:p-24">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm sm:h-20 sm:w-20">
              <span className="text-2xl sm:text-3xl">📢</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="break-keep text-[24px] font-black tracking-tight text-ink md:text-3xl">공지사항 리뉴얼 준비 중</h2>
              <p className="break-keep text-[15px] font-medium leading-[1.75] text-ink-muted sm:text-[17px] sm:leading-relaxed">
                보다 편리하게 병원 소식을 확인하실 수 있도록 <br className="hidden md:block" />
                새로운 공지사항 게시판을 준비하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

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

      <section className="bg-white py-24 flex-grow">
        <div className="max-w-4xl mx-auto px-6 w-full text-center">
          <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-16 md:p-24 space-y-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <span className="text-3xl">📢</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-black text-ink tracking-tight">공지사항 리뉴얼 준비 중</h2>
              <p className="text-ink-muted font-medium text-[17px] leading-relaxed">
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

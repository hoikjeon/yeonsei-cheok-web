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

      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="text-center space-y-12">
          <div className="text-4xl">📢</div>
          <div className="space-y-4">
             <h2 className="text-3xl font-bold text-slate-900 tracking-tight">커뮤니티 기능 준비 중</h2>
             <p className="text-slate-500 font-medium">실시간 후기 및 게시판 기능은 현재 고도화 작업 중에 있습니다. <br />조만간 더 편리한 기능으로 찾아뵙겠습니다.</p>
          </div>
          <div className="pt-10">
             <button className="px-10 py-5 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-not-allowed">준비 중</button>
          </div>
        </div>
      </section>
    </div>
  );
}

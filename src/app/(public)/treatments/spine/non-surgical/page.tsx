import SubHero from '@/components/SubHero';
import Link from 'next/link';

const nonSurgicalTreatments = [
  {
    title: '신경 성형술 (PEN)',
    subtitle: 'Percutaneous Epidural Neuroplasty',
    description: '특수 카테터를 이용하여 유착된 신경 조직을 박리하고, 염증 부위에 직접 약물을 투여하는 비수술 시술입니다. 디스크 탈출증, 척추관 협착증에 효과적입니다.',
    duration: '약 20~30분',
    recovery: '당일 퇴원 가능',
    advantage: '전신마취 불필요',
  },
  {
    title: '경막외 스테로이드 주사',
    subtitle: 'Epidural Steroid Injection',
    description: '염증이 있는 신경 주변에 항염증 스테로이드 약물을 정밀하게 주입하여 통증과 부종을 빠르게 완화합니다. 영상 유도 하에 정확한 위치에 시술합니다.',
    duration: '약 10~15분',
    recovery: '시술 후 30분 안정',
    advantage: '즉각적 통증 완화',
  },
  {
    title: '고주파 열응고술 (RF)',
    subtitle: 'Radiofrequency Ablation',
    description: '고주파 에너지를 이용하여 통증 신호를 전달하는 신경 가지를 선택적으로 차단합니다. 만성 허리 통증, 후관절 증후군에 효과적입니다.',
    duration: '약 20~30분',
    recovery: '당일 퇴원 가능',
    advantage: '장기간 통증 완화',
  },
  {
    title: '풍선확장 신경성형술',
    subtitle: 'Balloon Neuroplasty',
    description: '풍선(balloon)을 이용하여 좁아진 척추관을 물리적으로 확장하고, 유착된 신경을 박리합니다. 기존 신경 성형술보다 한 단계 진보된 시술입니다.',
    duration: '약 30~40분',
    recovery: '1~2일 입원',
    advantage: '높은 공간 확보 효과',
  },
  {
    title: '체외충격파 치료 (ESWT)',
    subtitle: 'Extracorporeal Shockwave Therapy',
    description: '음향 충격파를 통증 부위에 가하여 혈류량을 증가시키고 조직 재생을 촉진합니다. 만성 근골격계 통증, 석회화 건염에 효과적입니다.',
    duration: '약 15~20분',
    recovery: '일상 즉시 복귀',
    advantage: '비침습적 치료',
  },
  {
    title: '인대강화주사 (프롤로)',
    subtitle: 'Prolotherapy',
    description: '손상된 인대와 힘줄에 고농도 포도당 등의 증식 물질을 주입하여 조직 재생을 유도합니다. 만성적으로 느슨해진 인대를 강화하는 데 효과적입니다.',
    duration: '약 10~15분',
    recovery: '일상 즉시 복귀',
    advantage: '근본적 인대 강화',
  },
];

export default function NonSurgicalPage() {
  return (
    <div className="flex flex-col">
      <SubHero
        title="비수술 치료"
        subtitle="수술 없이 일상을 회복하는 첨단 비수술적 치료 시스템을 운영합니다."
        path={[{ name: '척추센터', href: '/treatments/spine' }, { name: '비수술 치료' }]}
        bgImage="/hero-bg.png"
      />

      {/* 비수술 치료 철학 */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-primary font-black tracking-widest text-xs uppercase">Non-Surgical Treatment</span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              수술 없이도<br />충분히 나을 수 있습니다
            </h2>
            <div className="w-16 h-1.5 bg-primary rounded-full" />
            <p className="text-slate-500 leading-relaxed font-medium">
              연세척병원은 &ldquo;비수술 우선 원칙&rdquo;을 철저히 지킵니다. 
              척추·관절 질환의 80% 이상은 수술 없이 치료할 수 있으며, 
              최신 비수술 시술과 재활 치료를 통해 안전하고 효과적인 
              회복을 돕고 있습니다.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-3 gap-6">
            {[
              { value: '80%+', label: '비수술 치료 비율' },
              { value: '95%', label: '시술 만족도' },
              { value: '당일', label: '대부분 당일 퇴원' },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl text-center space-y-2">
                <p className="text-3xl font-black text-primary tracking-tighter">{stat.value}</p>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 비수술 치료 목록 */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-primary font-black tracking-widest text-xs uppercase">Treatment Methods</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">비수술 치료 프로그램</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {nonSurgicalTreatments.map((treatment, idx) => (
              <div key={idx} className="p-10 bg-white rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-premium transition-all group space-y-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{treatment.title}</h3>
                  <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">{treatment.subtitle}</p>
                </div>
                <p className="text-slate-500 leading-relaxed font-medium text-[15px]">{treatment.description}</p>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">소요시간</p>
                    <p className="text-sm text-slate-700 font-bold">{treatment.duration}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">회복기간</p>
                    <p className="text-sm text-slate-700 font-bold">{treatment.recovery}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">장점</p>
                    <p className="text-sm text-primary font-bold">{treatment.advantage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-950 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">Non-Surgical First</span>
          <h2 className="text-3xl font-bold text-white">수술 전, 먼저 상담하세요</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            다른 병원에서 수술을 권유받으셨나요?<br className="hidden md:block" />
            연세척병원에서 비수술 치료 가능 여부를 먼저 확인해 보세요.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/reservation" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all shadow-blue-glow">
              비수술 상담 예약 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

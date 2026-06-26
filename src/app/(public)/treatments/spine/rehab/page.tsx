import SubHero from '@/components/SubHero';
import Link from 'next/link';

const rehabPrograms = [
  {
    title: '1:1 전문 도수치료',
    subtitle: 'Manual Therapy',
    description: '전문 물리치료사가 환자의 근골격계를 직접 손으로 교정하고 치료합니다. 척추·골반의 틀어짐을 바로잡고, 주변 근육과 인대의 긴장을 풀어 근본적인 통증 원인을 해결합니다.',
    features: ['척추·골반 정렬 교정', '근막 이완 치료', '관절 가동 범위 회복', '개인별 맞춤 프로그램'],
  },
  {
    title: '운동 재활 프로그램',
    subtitle: 'Exercise Rehabilitation',
    description: '전문 운동치료사가 환자의 상태에 맞는 맞춤형 재활 운동을 설계합니다. 약화된 심부 근육을 강화하고, 올바른 자세와 움직임 패턴을 학습하여 재발을 방지합니다.',
    features: ['코어 안정화 운동', '슬링 운동 치료', '밸런스 트레이닝', '단계적 근력 강화'],
  },
  {
    title: '통증 물리치료',
    subtitle: 'Physical Therapy',
    description: '온열치료, 전기치료, 초음파 치료 등 다양한 물리치료 기법을 활용하여 급성 및 만성 통증을 완화합니다. 도수치료 및 운동 재활과 함께 시행하면 시너지 효과가 큽니다.',
    features: ['고주파 온열 치료', 'ICT / TENS 전기 치료', '초음파 심부 치료', '적외선 / 한랭 치료'],
  },
  {
    title: '체형 교정 프로그램',
    subtitle: 'Posture Correction',
    description: '체형 분석 시스템을 통해 환자의 자세 불균형을 정밀하게 평가하고, 맞춤형 교정 프로그램을 제공합니다. 거북목, 굽은등, 골반 비대칭 등을 체계적으로 교정합니다.',
    features: ['3D 체형 분석', '거북목 교정', '골반 비대칭 교정', '자세 습관 코칭'],
  },
];

const processSteps = [
  { step: '01', title: '초기 상담 & 평가', desc: '전문의 진료 후 환자의 상태를 종합적으로 평가하고, 도수치료 필요 여부를 판단합니다.' },
  { step: '02', title: '치료 계획 수립', desc: '환자의 증상, 체형, 생활 습관 등을 고려하여 개인별 맞춤 재활 계획을 수립합니다.' },
  { step: '03', title: '집중 치료 시행', desc: '1:1 전담 치료사가 매 세션마다 환자의 상태를 확인하며 체계적으로 치료를 진행합니다.' },
  { step: '04', title: '재평가 & 유지 관리', desc: '정기적으로 치료 효과를 평가하고, 자가 관리 운동을 교육하여 재발을 방지합니다.' },
];

export default function RehabPage() {
  return (
    <div className="flex flex-col">
      <SubHero
        title="도수·재활 클리닉"
        subtitle="체계적인 맞춤형 재활 시스템으로 근본적인 회복과 재발 방지를 돕습니다."
        path={[{ name: '척추센터', href: '/treatments/spine' }, { name: '도수·재활 클리닉' }]}
        bgImage="/hero-bg.png"
      />

      {/* 클리닉 소개 */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Rehabilitation Clinic</span>
            <h2 className="text-4xl font-extrabold text-ink tracking-tight">
              손끝의 정밀함으로<br />통증의 원인을 해결합니다
            </h2>
            <div className="w-16 h-1.5 bg-primary rounded-full" />
            <p className="text-ink-muted leading-relaxed font-medium">
              연세척병원 도수·재활 클리닉은 전문 물리치료사가 1:1로 환자를 전담하여 
              치료합니다. 단순한 통증 완화를 넘어, 근골격계의 구조적 문제를 교정하고 
              약화된 근육을 강화하여 재발 없는 건강한 일상을 되찾을 수 있도록 돕습니다.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-6">
            {[
              { value: '1:1', label: '전담 치료사 배정' },
              { value: '30분+', label: '1회 치료 시간' },
              { value: '맞춤형', label: '개인별 프로그램' },
              { value: '체계적', label: '단계별 재활' },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl text-center space-y-2">
                <p className="text-3xl font-black text-primary tracking-tighter">{stat.value}</p>
                <p className="text-ink-muted text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 재활 프로그램 */}
        <div className="space-y-8 mb-24">
          <div className="space-y-4">
            <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Programs</span>
            <h2 className="text-3xl font-extrabold text-ink tracking-tight">전문 재활 프로그램</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rehabPrograms.map((program, idx) => (
              <div key={idx} className="p-10 bg-white rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-premium transition-all group space-y-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-bold text-ink group-hover:text-primary transition-colors">{program.title}</h3>
                  <p className="text-[11px] text-ink-muted font-bold tracking-widest font-montserrat uppercase">{program.subtitle}</p>
                </div>
                <p className="text-ink-muted leading-relaxed font-medium text-[15px]">{program.description}</p>
                <ul className="grid grid-cols-2 gap-3">
                  {program.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-ink-sub text-[13px] font-medium">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 치료 프로세스 */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Treatment Process</span>
            <h2 className="text-3xl font-extrabold text-ink tracking-tight">치료 프로세스</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl space-y-4 hover:bg-white hover:shadow-premium border border-transparent hover:border-primary/10 transition-all relative">
                <span className="text-5xl font-black text-slate-100">{step.step}</span>
                <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute right-[-20px] top-1/2 -translate-y-1/2 text-slate-200 text-2xl z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-ink">도수치료, 제대로 받아보세요</h2>
          <p className="text-ink-muted text-lg leading-relaxed">
            1:1 전문 도수치료사의 체계적인 맞춤 치료로<br className="hidden md:block" />
            통증의 근본 원인을 해결하고 건강한 일상을 되찾으세요.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/reservation" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all shadow-blue-glow">
              도수치료 예약하기 →
            </Link>
            <Link href="/consultation" className="px-8 py-4 bg-white text-ink-sub font-bold rounded-full border border-slate-200 hover:border-primary/30 transition-all">
              온라인 상담
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

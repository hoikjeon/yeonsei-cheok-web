import SubHero from '@/components/SubHero';
import Link from 'next/link';
import { Activity, Stethoscope, Zap, Hand } from 'lucide-react';

const spineServices = [
  {
    icon: <Activity className="w-8 h-8" />,
    title: '허리/목 디스크',
    desc: '추간판 탈출로 인한 신경 압박을 정밀하게 진단하고, 비수술부터 최소침습 수술까지 최적의 맞춤형 치료를 제공합니다.',
    href: '/treatments/spine/disc',
    tags: ['경추디스크', '요추디스크', '신경근병증'],
  },
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: '척추관 협착증',
    desc: '퇴행성 변화로 좁아진 척추관을 정밀 영상 장비로 진단하고, 단계별 맞춤 치료 프로토콜을 적용합니다.',
    href: '/treatments/spine/stenosis',
    tags: ['중심성 협착', '추간공 협착', '퇴행성 변화'],
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: '비수술 치료',
    desc: '신경 성형술, 경막외 주사, 고주파 치료 등 수술 없이 통증을 완화하고 기능을 회복하는 첨단 치료법을 운영합니다.',
    href: '/treatments/spine/non-surgical',
    tags: ['신경성형술', '경막외주사', '고주파치료'],
  },
  {
    icon: <Hand className="w-8 h-8" />,
    title: '도수·재활 클리닉',
    desc: '1:1 전문 도수치료사가 환자 개개인의 상태에 맞는 체계적인 재활 프로그램을 설계하여 근본적인 회복을 돕습니다.',
    href: '/treatments/spine/rehab',
    tags: ['도수치료', '운동재활', '체형교정'],
  },
];

export default function SpineCenterPage() {
  return (
    <div className="flex flex-col">
      <SubHero
        title="척추센터"
        subtitle="통증의 근본을 찾는 정교한 진단과 치료, 세브란스의 기술력으로 일상을 회복합니다."
        path={[{ name: '진료안내', href: '/treatments' }, { name: '척추센터' }]}
        bgImage="/hero-bg.png"
      />

      {/* 척추센터 소개 */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Spine Center</span>
            <h2 className="text-4xl font-extrabold text-ink tracking-tight">
              정확한 진단이<br />치료의 시작입니다
            </h2>
            <div className="w-16 h-1.5 bg-primary rounded-full" />
            <p className="text-ink-muted leading-relaxed font-medium">
              연세척병원 척추센터는 연세대 세브란스 교수 출신의 전문 의료진이 
              대학병원급 첨단 MRI, CT 장비를 활용하여 통증의 정확한 원인을 진단합니다. 
              불필요한 수술은 하지 않으며, 환자에게 가장 안전하고 효과적인 
              치료법을 우선적으로 제안합니다.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-8">
            {[
              { value: '15,000+', label: '연간 척추 환자 진료' },
              { value: '99%', label: '환자 만족도' },
              { value: '3,000+', label: '연간 시술 건수' },
              { value: '15Y+', label: '전문의 임상 경력' },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl text-center space-y-2">
                <p className="text-3xl font-black text-primary tracking-tighter">{stat.value}</p>
                <p className="text-ink-muted text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 진료 분야 카드 */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Our Specialties</span>
            <h2 className="text-3xl font-extrabold text-ink tracking-tight">전문 진료 분야</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spineServices.map((service, idx) => (
              <Link
                key={idx}
                href={service.href}
                className="group p-10 bg-white rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-premium transition-all"
              >
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-ink-muted group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {service.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-ink group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-ink-muted leading-relaxed font-medium text-[15px]">{service.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-50 text-ink-muted text-[11px] font-bold rounded-lg border border-slate-100 font-montserrat uppercase tracking-tight">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                    자세히 보기 →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 비수술 우선 원칙 배너 */}
      <section className="bg-navy-950 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-primary text-[10px] font-black tracking-[0.3em] font-montserrat uppercase">Our Philosophy</span>
          <h2 className="text-3xl font-bold text-white">"비수술 우선, 정직한 진료"</h2>
          <p className="text-ink-muted text-lg leading-relaxed">
            연세척병원은 무조건적인 수술보다 정밀한 진단을 통해<br className="hidden md:block" />
            환자에게 가장 안전하고 효과적인 비수술적 치료법을 먼저 고민합니다.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/reservation" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all shadow-blue-glow">
              진료 상담 예약 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

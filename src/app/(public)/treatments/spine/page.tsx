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
      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 md:py-24">
        <div className="mb-16 grid grid-cols-1 items-start gap-10 md:mb-24 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 lg:col-span-5 lg:space-y-6">
            <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Spine Center</span>
            <h2 className="break-keep text-[2rem] font-extrabold leading-tight tracking-tight text-ink md:text-4xl">
              정확한 진단이<br />치료의 시작입니다
            </h2>
            <div className="w-16 h-1.5 bg-primary rounded-full" />
            <p className="break-keep text-[15px] font-medium leading-[1.75] text-ink-sub md:text-base">
              연세척병원 척추센터는 연세대 세브란스 교수 출신의 전문 의료진이 
              대학병원급 첨단 MRI 등 정밀 영상 장비를 활용하여 통증의 정확한 원인을 진단합니다.
              불필요한 수술은 하지 않으며, 환자에게 가장 안전하고 효과적인 
              치료법을 우선적으로 제안합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-7 lg:gap-8">
            {[
              { value: '15,000+', label: '연간 척추 환자 진료' },
              { value: '99%', label: '환자 만족도' },
              { value: '3,000+', label: '연간 시술 건수' },
              { value: '15Y+', label: '전문의 임상 경력' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1.5 rounded-2xl bg-slate-50 px-3 py-5 text-center sm:p-6 lg:rounded-3xl lg:p-8">
                <p className="text-[1.55rem] font-black tracking-tighter text-primary sm:text-3xl">{stat.value}</p>
                <p className="break-keep text-[12px] font-medium leading-snug text-ink-sub sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 진료 분야 카드 */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Our Specialties</span>
            <h2 className="text-[1.75rem] font-extrabold tracking-tight text-ink md:text-3xl">전문 진료 분야</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spineServices.map((service, idx) => (
              <Link
                key={idx}
                href={service.href}
                className="group rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:border-primary/20 hover:shadow-premium md:rounded-3xl md:p-10"
              >
                <div className="space-y-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                    {service.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-ink group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="break-keep text-[15px] font-medium leading-relaxed text-ink-sub">{service.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map(tag => (
                      <span key={tag} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 font-montserrat text-[11px] font-bold uppercase tracking-tight text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex translate-x-0 items-center gap-2 text-sm font-bold text-primary opacity-100 transition-all lg:-translate-x-4 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100">
                    자세히 보기 →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 비수술 우선 원칙 배너 */}
      <section className="bg-navy-950 px-5 py-14 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl space-y-6 text-center md:space-y-8">
          <span className="text-primary text-[10px] font-black tracking-[0.3em] font-montserrat uppercase">Our Philosophy</span>
          <h2 className="break-keep text-[1.75rem] font-bold leading-tight text-white md:text-3xl">&ldquo;비수술 우선, 정직한 진료&rdquo;</h2>
          <p className="break-keep text-base leading-[1.75] text-white/75 md:text-lg">
            연세척병원은 무조건적인 수술보다 정밀한 진단을 통해<br className="hidden md:block" />
            환자에게 가장 안전하고 효과적인 비수술적 치료법을 먼저 고민합니다.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/reservation" className="w-full rounded-full bg-primary px-8 py-4 font-bold text-white shadow-blue-glow transition-all hover:bg-primary-dark sm:w-auto">
              진료 상담 예약 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

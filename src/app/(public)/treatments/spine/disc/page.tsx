import SubHero from '@/components/SubHero';
import Link from 'next/link';

const discTypes = [
  {
    title: '요추 디스크 (허리디스크)',
    description: '요추(허리)에서 추간판이 돌출되어 주변 신경근을 압박하며, 허리 통증과 함께 다리로 퍼져나가는 방사통이 대표적인 증상입니다.',
    symptoms: ['허리 통증 및 뻣뻣함', '한쪽 또는 양쪽 다리 저림', '오래 앉아있을 때 통증 악화', '기침·재채기 시 통증 증가'],
  },
  {
    title: '경추 디스크 (목디스크)',
    description: '경추(목) 추간판이 탈출되어 경추 신경이나 척수를 압박하며, 목과 어깨 통증, 팔 저림 등의 증상이 나타납니다.',
    symptoms: ['목 뒤쪽 통증 및 경직', '어깨·팔·손가락 저림', '팔 근력 약화', '두통 및 어지러움'],
  },
];

const treatments = [
  { name: '약물 치료', desc: '소염진통제, 근이완제 등을 활용한 초기 통증 관리' },
  { name: '경막외 주사 치료', desc: '압박된 신경 주변에 항염증제를 정밀 투여' },
  { name: '신경 성형술', desc: '특수 카테터를 이용해 유착된 신경을 박리하고 약물 투여' },
  { name: '내시경 디스크 제거술', desc: '1cm 미만 절개로 탈출된 디스크를 직접 제거' },
  { name: '미세현미경 디스크 제거술', desc: '현미경 확대 시야에서 정밀하게 디스크를 제거' },
  { name: 'UBE (양방향 내시경)', desc: '두 개의 포트를 이용한 최소침습 척추 수술' },
];

export default function DiscPage() {
  return (
    <div className="flex flex-col">
      <SubHero
        title="허리/목 디스크"
        subtitle="정확한 진단과 맞춤형 치료로 디스크 통증의 근본 원인을 해결합니다."
        path={[{ name: '척추센터', href: '/treatments/spine' }, { name: '허리/목 디스크' }]}
        bgImage="/hero-bg.png"
      />

      {/* 질환 소개 */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="space-y-6 mb-20">
          <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Disc Herniation</span>
          <h2 className="text-4xl font-extrabold text-ink tracking-tight">디스크란 무엇인가요?</h2>
          <div className="w-16 h-1.5 bg-primary rounded-full" />
          <p className="text-ink-muted leading-relaxed font-medium max-w-3xl text-lg">
            디스크(추간판 탈출증)는 척추뼈 사이의 쿠션 역할을 하는 추간판이 돌출되어 
            주변 신경을 압박하는 질환입니다. 잘못된 자세, 무리한 운동, 노화 등 
            다양한 원인으로 발생하며, 적절한 치료 없이 방치하면 만성 통증으로 이어질 수 있습니다.
          </p>
        </div>

        {/* 디스크 유형 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24">
          {discTypes.map((disc, idx) => (
            <div key={idx} className="p-10 bg-white rounded-3xl border border-slate-100 space-y-6 hover:shadow-premium transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold text-ink">{disc.title}</h3>
                <p className="text-ink-muted leading-relaxed font-medium">{disc.description}</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-black text-ink-sub tracking-wide font-montserrat uppercase">주요 증상</h4>
                <ul className="space-y-2">
                  {disc.symptoms.map((symptom, i) => (
                    <li key={i} className="flex items-center gap-3 text-ink-muted text-[15px]">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 치료 방법 */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Treatment Options</span>
            <h2 className="text-3xl font-extrabold text-ink tracking-tight">단계별 맞춤 치료</h2>
            <p className="text-ink-muted font-medium max-w-2xl">
              연세척병원은 환자의 증상과 디스크 상태에 따라 비수술 치료부터 최소침습 수술까지 
              가장 효과적인 치료법을 제안합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((t, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl hover:bg-white hover:shadow-premium hover:border-primary/10 border border-transparent transition-all group">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 font-black text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-bold text-ink">{t.name}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-ink">디스크 통증, 참지 마세요</h2>
          <p className="text-ink-muted text-lg leading-relaxed">
            초기에 정확한 진단과 적절한 치료를 받으면 대부분 비수술적 치료만으로도<br className="hidden md:block" />
            충분히 회복할 수 있습니다. 지금 바로 전문의와 상담하세요.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/reservation" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all shadow-blue-glow">
              진료 예약하기 →
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

import SubHero from '@/components/SubHero';
import Link from 'next/link';

const treatmentCategories = [
  {
    id: 'spine',
    title: '척추 질환',
    subtitle: 'SPINE CARE',
    description: '디스크, 협착증 등 다양한 척추 질환에 대해 정확한 원인을 진단하고 최적의 치료를 시행합니다.',
    treatments: [
      { name: '허리디스크', desc: '추간판이 돌출되어 신경을 압박하는 질환' },
      { name: '척추관협착증', desc: '척추관이 좁아져 신경이 눌리는 질환' },
      { name: '척추전방전위증', desc: '척추 뼈가 위아래로 어긋나는 질환' },
      { name: '척추압박골절', desc: '척추 뼈가 내려앉아 골절되는 질환' }
    ]
  },
  {
    id: 'joint',
    title: '관절 질환',
    subtitle: 'JOINT CARE',
    description: '어깨, 무릎, 고관절 등 모든 관절 부위의 통증과 움직임을 개선하는 정밀 치료를 제공합니다.',
    treatments: [
      { name: '무릎 관절염', desc: '무릎 연골이 마모되어 통증이 발생하는 질환' },
      { name: '오십견 / 회전근개', desc: '어깨 관절의 통증과 운동 제한이 있는 질환' },
      { name: '퇴행성 관절염', desc: '관절의 노화로 인한 염증과 통증' },
      { name: '스포츠 외상', desc: '운동 중 발생하는 인대나 연골 손상' }
    ]
  },
  {
    id: 'non-surgical',
    title: '비수술 치료',
    subtitle: 'NON-SURGICAL',
    description: '수술 없이도 통증을 완화하고 기능을 회복시키는 다양한 첨단 비수술 치료 시스템입니다.',
    treatments: [
      { name: '신경 성형술', desc: '내시경을 통해 신경 압박 부위를 치료' },
      { name: '인대강화주사', desc: '인대와 힘줄을 강화하여 통증 원인 해결' },
      { name: '도수치료', desc: '전문 치료사의 손을 이용한 체형 교정' },
      { name: '체외충격파', desc: '충격파를 이용한 혈류량 증가 및 조직 재생' }
    ]
  }
];

export default function TreatmentsPage() {
  return (
    <div className="flex flex-col">
      <SubHero 
        title="진료안내" 
        subtitle="환자의 증상에 맞는 정확한 진단과 과학적인 치료 시스템을 안내해 드립니다."
        path={[{ name: '진료안내' }, { name: '질환 및 치료 정보' }]}
        bgImage="/hero-bg.png"
      />

      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 md:py-24">
        <div className="space-y-20 md:space-y-32">
          {treatmentCategories.map((category, idx) => (
            <div key={category.id} className={`flex flex-col items-start gap-9 md:gap-12 lg:flex-row lg:gap-16 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="space-y-5 lg:sticky lg:top-28 lg:w-1/3 lg:space-y-6">
                <div className="space-y-4">
                  <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">{category.subtitle}</span>
                  <h2 className="break-keep text-[2rem] font-extrabold leading-tight tracking-tight text-ink md:text-4xl">{category.title}</h2>
                  <div className="w-16 h-1.5 bg-primary rounded-full" />
                </div>
                <p className="break-keep text-[15px] font-medium leading-[1.75] text-ink-sub md:text-base">
                  {category.description}
                </p>
                <div className="pt-4">
                  <Link href="/reservation" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                    상담 예약하기 ➔
                  </Link>
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:w-2/3">
                {category.treatments.map((t, i) => (
                  <div key={i} className="group rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:border-primary/20 hover:shadow-premium md:rounded-3xl md:p-10">
                    <div className="space-y-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-xs font-black text-slate-500 transition-colors group-hover:bg-primary group-hover:text-white">
                        {i + 1}
                      </div>
                      <h3 className="text-xl font-bold text-ink">{t.name}</h3>
                      <p className="break-keep text-sm leading-relaxed text-ink-sub">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="border-y border-slate-100 bg-slate-50 px-5 py-14 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl space-y-6 text-center md:space-y-8">
           <h2 className="break-keep text-[1.75rem] font-bold leading-tight text-ink md:text-3xl">“연세척병원은 비수술 우선 치료를 원칙으로 합니다”</h2>
           <p className="break-keep text-base leading-[1.75] text-ink-sub md:text-lg">
             무조건적인 수술보다는 정밀한 진단을 통해 환자에게 가장 안전하고 효과적인 <br className="hidden md:block" />
             비수술적 치료법을 먼저 고민하며, 꼭 필요한 경우에만 최소침습 수술을 시행합니다.
           </p>
           <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
             <div className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-sub sm:px-6 sm:py-3">통증 완화</div>
             <div className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-sub sm:px-6 sm:py-3">기능 회복</div>
             <div className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-sub sm:px-6 sm:py-3">재발 방지</div>
           </div>
        </div>
      </section>
    </div>
  );
}

import SubHero from '@/components/SubHero';
import Link from 'next/link';

const stenosisTypes = [
  {
    title: '중심성 척추관 협착증',
    description: '척추관 중심부가 좁아져 척수나 마미 신경을 압박합니다. 장시간 보행 시 다리 통증과 저림이 심해지고 쉬면 완화되는 간헐적 파행이 특징입니다.',
    severity: '보행 장애',
  },
  {
    title: '추간공 협착증',
    description: '신경이 빠져나가는 구멍(추간공)이 좁아져 특정 신경근을 압박합니다. 한쪽 다리에 집중적인 방사통이 나타나며, 특정 자세에서 통증이 심해집니다.',
    severity: '방사통',
  },
  {
    title: '측방관 협착증',
    description: '척추관의 측면이 좁아져 신경을 압박하는 유형입니다. 허리를 뒤로 젖힐 때 통증이 악화되고, 앞으로 구부리면 완화되는 경향이 있습니다.',
    severity: '측면 신경 압박',
  },
];

const treatmentSteps = [
  {
    step: '1단계',
    title: '보존적 치료',
    desc: '약물 치료, 물리치료, 운동 치료를 통해 초기 증상을 관리합니다.',
    items: ['소염진통제 처방', '물리치료 (온열·전기)', '코어 근력 강화 운동'],
  },
  {
    step: '2단계',
    title: '중재적 시술',
    desc: '보존적 치료로 호전이 없을 경우, 주사 치료 및 시술을 시행합니다.',
    items: ['경막외 스테로이드 주사', '신경 차단술', '풍선확장 신경성형술'],
  },
  {
    step: '3단계',
    title: '최소침습 수술',
    desc: '시술에도 호전이 없거나 신경 손상이 진행되는 경우 수술을 고려합니다.',
    items: ['양방향 내시경 감압술 (UBE)', '미세현미경 감압술', '척추 유합술 (필요 시)'],
  },
];

export default function StenosisPage() {
  return (
    <div className="flex flex-col">
      <SubHero
        title="척추관 협착증"
        subtitle="신경 압박 해소를 위한 전문적인 진단과 단계별 치료 솔루션을 제공합니다."
        path={[{ name: '척추센터', href: '/treatments/spine' }, { name: '척추관 협착증' }]}
        bgImage="/hero-bg.png"
      />

      {/* 질환 소개 */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="space-y-6 mb-20">
          <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Spinal Stenosis</span>
          <h2 className="text-4xl font-extrabold text-ink tracking-tight">척추관 협착증이란?</h2>
          <div className="w-16 h-1.5 bg-primary rounded-full" />
          <p className="text-ink-muted leading-relaxed font-medium max-w-3xl text-lg">
            척추관 협착증은 나이가 들면서 척추의 퇴행성 변화로 인해 신경이 지나가는 
            공간(척추관)이 점점 좁아지는 질환입니다. 50~60대 이상에서 흔하며, 
            걸을 때 다리가 저리고 아파서 자주 쉬어야 하는 &ldquo;간헐적 파행&rdquo;이 
            대표적인 증상입니다.
          </p>
        </div>

        {/* 협착증 유형 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {stenosisTypes.map((type, idx) => (
            <div key={idx} className="p-10 bg-white rounded-3xl border border-slate-100 space-y-6 hover:shadow-premium transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <span className="px-3 py-1 bg-slate-50 text-ink-muted text-[11px] font-bold rounded-lg">{type.severity}</span>
              </div>
              <h3 className="text-xl font-bold text-ink">{type.title}</h3>
              <p className="text-ink-muted leading-relaxed font-medium text-[15px]">{type.description}</p>
            </div>
          ))}
        </div>

        {/* 단계별 치료 */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-primary font-black tracking-widest text-xs font-montserrat uppercase">Step-by-Step Treatment</span>
            <h2 className="text-3xl font-extrabold text-ink tracking-tight">단계별 맞춤 치료 프로토콜</h2>
            <p className="text-ink-muted font-medium max-w-2xl">
              연세척병원은 환자의 협착 정도와 증상에 따라 보존적 치료부터 시작하여, 
              필요한 경우에만 단계적으로 시술 및 수술을 진행합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {treatmentSteps.map((t, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-3xl space-y-6 hover:bg-white hover:shadow-premium border border-transparent hover:border-primary/10 transition-all group">
                <div className="space-y-4">
                  <span className="text-primary text-[11px] font-black tracking-widest font-montserrat uppercase">{t.step}</span>
                  <h3 className="text-2xl font-bold text-ink">{t.title}</h3>
                  <p className="text-ink-muted leading-relaxed font-medium text-[15px]">{t.desc}</p>
                </div>
                <ul className="space-y-3 pt-2">
                  {t.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-ink-sub text-[14px] font-medium">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-ink">걷기가 힘드신가요?</h2>
          <p className="text-ink-muted text-lg leading-relaxed">
            척추관 협착증은 정확한 진단 후 적절한 치료를 받으면<br className="hidden md:block" />
            보행 능력과 일상생활을 크게 개선할 수 있습니다.
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

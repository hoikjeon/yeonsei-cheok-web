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
      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 md:py-24">
        <div className="mb-14 space-y-5 md:mb-20 md:space-y-6">
          <span className="text-primary font-bold tracking-widest text-xs font-montserrat uppercase">Spinal Stenosis</span>
          <h2 className="break-keep text-h3 tracking-tight text-ink">척추관 협착증이란?</h2>
          <div className="w-16 h-1.5 bg-primary rounded-full" />
          <p className="max-w-3xl break-keep text-base font-medium leading-[1.75] text-ink-sub md:text-lg">
            척추관 협착증은 나이가 들면서 척추의 퇴행성 변화로 인해 신경이 지나가는 
            공간(척추관)이 점점 좁아지는 질환입니다. 50~60대 이상에서 흔하며, 
            걸을 때 다리가 저리고 아파서 자주 쉬어야 하는 &ldquo;간헐적 파행&rdquo;이 
            대표적인 증상입니다.
          </p>
        </div>

        {/* 협착증 유형 */}
        <div className="mb-16 grid grid-cols-1 gap-4 md:mb-24 lg:grid-cols-3 lg:gap-8">
          {stenosisTypes.map((type, idx) => (
            <div key={idx} className="group space-y-5 rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:shadow-premium md:rounded-3xl md:p-10 lg:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <span className="rounded-lg bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600">{type.severity}</span>
              </div>
              <h3 className="text-h4 text-ink">{type.title}</h3>
              <p className="break-keep text-[15px] font-medium leading-relaxed text-ink-sub">{type.description}</p>
            </div>
          ))}
        </div>

        {/* 단계별 치료 */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-primary font-bold tracking-widest text-xs font-montserrat uppercase">Step-by-Step Treatment</span>
            <h2 className="break-keep text-h3 tracking-tight text-ink">단계별 맞춤 치료 프로토콜</h2>
            <p className="max-w-2xl break-keep text-body text-ink-sub md:text-base">
              연세척병원은 환자의 협착 정도와 증상에 따라 보존적 치료부터 시작하여, 
              필요한 경우에만 단계적으로 시술 및 수술을 진행합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            {treatmentSteps.map((t, i) => (
              <div key={i} className="group space-y-5 rounded-2xl border border-transparent bg-slate-50 p-6 transition-all hover:border-primary/10 hover:bg-white hover:shadow-premium md:rounded-3xl md:p-10 lg:space-y-6">
                <div className="space-y-4">
                  <span className="text-primary text-[11px] font-bold tracking-widest font-montserrat uppercase">{t.step}</span>
                  <h3 className="text-h4 text-ink">{t.title}</h3>
                  <p className="break-keep text-[15px] font-medium leading-relaxed text-ink-sub">{t.desc}</p>
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
      <section className="border-y border-slate-100 bg-slate-50 px-5 py-14 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl space-y-6 text-center md:space-y-8">
          <h2 className="text-h3 leading-tight text-ink">걷기가 힘드신가요?</h2>
          <p className="break-keep text-base leading-[1.75] text-ink-sub md:text-lg">
            척추관 협착증은 정확한 진단 후 적절한 치료를 받으면<br className="hidden md:block" />
            보행 능력과 일상생활을 크게 개선할 수 있습니다.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/reservation" className="w-full rounded-full bg-primary px-8 py-4 font-bold text-white shadow-blue-glow transition-all hover:bg-primary-dark sm:w-auto">
              진료 예약하기 →
            </Link>
            <Link href="/consultation" className="w-full rounded-full border border-slate-200 bg-white px-8 py-4 font-bold text-ink-sub transition-all hover:border-primary/30 sm:w-auto">
              온라인 상담
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

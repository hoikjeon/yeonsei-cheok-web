import SubHero from '@/components/SubHero';
import Link from 'next/link';

const competencies = [
  {
    id: 1,
    title: '세브란스 외래 교수 출신 3인 협진',
    desc: '연세대 세브란스병원 출신의 숙련된 신경외과 및 정형외과 전문의 3인이 직접 진료하고 수술합니다.',
    icon: '👤👤👤'
  },
  {
    id: 2,
    title: '대학병원급 첨단 정밀 장비',
    desc: '정확한 진단이 올바른 치료의 시작입니다. 대학병원급 MRI, CT, DITI 등을 보유하여 오차 없는 진단을 시행합니다.',
    icon: '🔬'
  },
  {
    id: 3,
    title: '과잉 진료 없는 정직한 원칙',
    desc: '불필요한 수술이나 시술은 절대 권하지 않습니다. 환자의 상태를 최우선으로 고려한 1:1 맞춤형 치료법을 제시합니다.',
    icon: '⚖️'
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <SubHero 
        title="병원소개" 
        subtitle="실력을 세우고 원칙을 지키는 연세척병원을 소개합니다."
        path={[{ name: '병원소개' }, { name: '연세척병원 소개' }]}
        bgImage="/hero-bg.png"
      />

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <span className="text-primary font-black tracking-widest uppercase text-xs">Our Mission</span>
              <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tight">
                환자가 척! <br />
                낫는 그날까지.
              </h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
            </div>
            
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              연세척병원은 단순히 질환을 치료하는 곳을 넘어, <br />
              환자의 평생 척추·관절 건강을 책임지는 든든한 동반자가 되고자 합니다.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                <p className="text-slate-500"><strong>정직한 진료</strong> - 환자에게 꼭 필요한 치료만을 권합니다.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                <p className="text-slate-500"><strong>검증된 실력</strong> - 대학병원급 임상 경험을 갖춘 의료진이 집도합니다.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                <p className="text-slate-500"><strong>환자 중심</strong> - 환자의 통증과 마음까지 케어하는 따뜻한 병원입니다.</p>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-premium">
             <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-primary font-black text-4xl">
               Hospital Interior Image
             </div>
          </div>
        </div>
      </section>

      {/* Competencies Section */}
      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <span className="text-primary font-black tracking-widest uppercase text-xs">Why Yonsei Cheok</span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">연세척병원만의 핵심 경쟁력</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {competencies.map((item) => (
              <div key={item.id} className="p-12 bg-white rounded-[2.5rem] border border-slate-100/50 hover:border-primary/20 transition-all hover:shadow-premium group">
                <div className="text-4xl mb-8 group-hover:scale-125 transition-transform">{item.icon}</div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-[15px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 overflow-hidden relative">
         <div className="max-w-7xl mx-auto shadow- premium rounded-[4rem] p-24 bg-primary text-white flex flex-col md:flex-row items-center gap-20">
            <div className="space-y-8 flex-grow">
               <h2 className="text-5xl font-black leading-tight tracking-tight">
                 "실력을 세우고, <br />
                 원칙을 지킵니다."
               </h2>
               <p className="text-xl text-primary-light/80 leading-relaxed max-w-xl">
                 우리는 의료의 본질인 '치료'에 집중합니다. 
                 대학병원 수준의 의학적 근거를 바탕으로 가장 안전하고 확실한 결과를 만들어냅니다.
               </p>
               <div className="pt-10">
                  <Link href="/doctors" className="px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-xl active:scale-95">의료진 프로필 보러가기</Link>
               </div>
            </div>
            
            <div className="w-80 h-80 rounded-full border border-white/10 flex items-center justify-center p-10 bg-white/5 backdrop-blur-md">
               <div className="text-center space-y-2">
                  <p className="text-6xl font-black">Y</p>
                  <p className="text-xs font-bold tracking-widest uppercase opacity-40">Yonsei Cheok</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

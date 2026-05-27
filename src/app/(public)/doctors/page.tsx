import SubHero from '@/components/SubHero';
import Link from 'next/link';

const doctorList = [
  {
    id: 'kim-hoon',
    name: '김훈',
    title: '병원장',
    department: '척추외과',
    specialty: '신경외과 전문의',
    image: '/pic_doctor1.jpg',
    tags: ['척추 고난이도 수술', '비수술 치료'],
    history: [
      '연세대학교 의과대학 졸업',
      '연세대학교 세브란스병원 신경외과 전문의',
      '연세대학교 세브란스병원 신경외과 조교수',
      '대한척추신경외과 학회 정회원',
    ]
  },
  {
    id: 'lee-nam',
    name: '이남',
    title: '병원장',
    department: '척추외과',
    specialty: '신경외과 전문의',
    image: '/pic_doctor4.jpg',
    tags: ['척추내시경수술', '양방향 감압술'],
    history: [
      '연세대학교 의과대학 대학원 석사졸업',
      '연세대학교 세브란스병원 신경외과 레지던트 수료',
      '연세대학교 세브란스병원 척추신경외과 임상연구조교수',
      '대한 척추내시경 수술연구회(KOSESS) 총무간사',
    ]
  },
  {
    id: 'kim-dong-han',
    name: '김동한',
    title: '병원장',
    department: '척추내시경센터',
    specialty: '신경외과 전문의',
    image: '/pic_doctor7.jpg',
    tags: ['최소침습 척추수술', '내시경 레이저'],
    history: [
      '연세대학교 세브란스병원 신경외과 전문의',
      '연세대학교 세브란스병원 척추신경외과 임상강사',
      '대한 최소침습 척추학회(KOMISS) 정회원',
    ]
  }
];

export default function DoctorsPage() {
  return (
    <div className="flex flex-col">
      <SubHero 
        title="의료진 소개" 
        subtitle="연세대 세브란스 교수 출신의 숙련된 의료진이 수준 높은 의료 서비스를 제공합니다."
        path={[{ name: '병원소개' }, { name: '의료진 소개' }]}
        bgImage="/hero-bg.png"
      />

      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="space-y-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">수준 높은 진료의 시작, 연세척 의료진입니다</h2>
            <p className="text-slate-500 leading-relaxed">
              분야별 세브란스 교수 출신 의료진이 협진 시스템을 통해 <br />
              환자 한 분 한 분께 가장 적합한 1:1 맞춤 치료를 약속드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {doctorList.map((doc) => (
              <div key={doc.id} className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100/50 hover:border-primary/20 transition-all hover:shadow-premium overflow-hidden">
                <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                    {/* 실물 이미지가 없을 경우를 대비한 플레이스홀더 */}
                    <span className="text-sm font-bold uppercase tracking-widest">{doc.name} Profile Image</span>
                  </div>
                </div>
                
                <div className="p-10 space-y-8 flex flex-col flex-grow">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase rounded-full">
                        {doc.department}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {doc.name} <span className="text-lg font-medium text-slate-500 ml-1">{doc.title}</span>
                      </h3>
                      <p className="text-[15px] font-semibold text-primary/80 tracking-tight">{doc.specialty}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {doc.tags.map(tag => (
                         <span key={tag} className="text-xs font-bold text-slate-400 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">#{tag}</span>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-3 flex-grow border-t border-slate-50 pt-6">
                    <p className="text-xs font-bold text-slate-800 tracking-wider uppercase">Short History</p>
                    <ul className="space-y-2">
                      {doc.history.map((h, i) => (
                        <li key={i} className="flex gap-2 text-[13px] text-slate-500 leading-tight">
                          <span className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary transition-all active:scale-95 group-hover:shadow-lg group-hover:shadow-primary/20">
                    상세 프로필 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Consultation Shortcut */}
      <section className="bg-[#172b4d] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">상담을 원하시나요?</h2>
            <p className="text-slate-400 font-medium">실시간 온라인 예약 또는 카카오톡으로 간편하게 상담받으실 수 있습니다.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/reservation" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all">진료 예약하기</Link>
            <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all">카카오톡 문의</button>
          </div>
        </div>
      </section>
    </div>
  );
}

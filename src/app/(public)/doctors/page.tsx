import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, ChevronRight, ShieldCheck, Stethoscope, UsersRound } from 'lucide-react';
import DoctorsDirectory, { type DoctorProfile } from '@/components/DoctorsDirectory';
import ScrollReveal from '@/components/ScrollReveal';
import SubHero from '@/components/SubHero';

const doctorList: DoctorProfile[] = [
  {
    id: 'kim-dong-han',
    name: '김동한',
    title: '병원장',
    center: '척추내시경센터',
    specialty: '신경외과 전문의',
    image: '/legacy-images/contents/pic_doctor7.jpg',
    imageAlt: '김동한 병원장 프로필 사진',
    summary: '목·허리 질환에서 비수술 치료와 최소침습 척추 치료 방향을 함께 검토합니다.',
    focusAreas: ['허리디스크', '목디스크', '척추관협착증', '양방향척추내시경(UBE)'],
    schedule: '진료 일정은 예약 상담 시 확인',
    profilePoints: [
      '연세대학교 세브란스병원 신경외과 전문의',
      '연세대학교 세브란스병원 척추신경외과 임상강사',
      '대한 최소침습 척추학회(KOMISS) 정회원',
    ],
    timetable: {
      consultation: [
        { day: '월', morning: '진료', afternoon: '진료' },
        { day: '화', morning: '진료', afternoon: '-' },
        { day: '수', morning: '-', afternoon: '진료' },
        { day: '목', morning: '진료', afternoon: '진료' },
        { day: '금', morning: '진료', afternoon: '-' },
        { day: '토', morning: '교대', afternoon: '-' },
      ],
      surgery: [
        { day: '월', morning: '-', afternoon: '-' },
        { day: '화', morning: '-', afternoon: '수술' },
        { day: '수', morning: '수술', afternoon: '-' },
        { day: '목', morning: '-', afternoon: '-' },
        { day: '금', morning: '-', afternoon: '수술' },
        { day: '토', morning: '-', afternoon: '-' },
      ],
    },
  },
  {
    id: 'lee-nam',
    name: '이남',
    title: '병원장',
    center: '척추센터',
    specialty: '신경외과 전문의',
    image: '/legacy-images/contents/pic_doctor4.jpg',
    imageAlt: '이남 병원장 프로필 사진',
    summary: '척추 질환의 원인을 정확히 확인하고 환자에게 필요한 치료 단계를 제안합니다.',
    focusAreas: ['척추내시경수술', '양방향 감압술', '척추 신경질환', '비수술 치료'],
    schedule: '진료 일정은 예약 상담 시 확인',
    profilePoints: [
      '연세대학교 의과대학 대학원 석사졸업',
      '연세대학교 세브란스병원 신경외과 레지던트 수료',
      '연세대학교 세브란스병원 척추신경외과 임상연구조교수',
      '대한 척추내시경 수술연구회(KOSESS) 총무간사',
    ],
    timetable: {
      consultation: [
        { day: '월', morning: '-', afternoon: '진료' },
        { day: '화', morning: '진료', afternoon: '진료' },
        { day: '수', morning: '진료', afternoon: '-' },
        { day: '목', morning: '-', afternoon: '진료' },
        { day: '금', morning: '진료', afternoon: '진료' },
        { day: '토', morning: '교대', afternoon: '-' },
      ],
      surgery: [
        { day: '월', morning: '수술', afternoon: '-' },
        { day: '화', morning: '-', afternoon: '-' },
        { day: '수', morning: '-', afternoon: '수술' },
        { day: '목', morning: '수술', afternoon: '-' },
        { day: '금', morning: '-', afternoon: '-' },
        { day: '토', morning: '-', afternoon: '-' },
      ],
    },
  },
  {
    id: 'choi-ho',
    name: '최호',
    title: '원장',
    center: '관절센터',
    specialty: '정형외과 진료',
    image: '/legacy-images/contents/pic_doctor9.jpg',
    imageAlt: '최호 원장 프로필 사진',
    summary: '무릎·어깨 등 관절 통증의 원인을 살피고 보존적 치료부터 회복 관리까지 봅니다.',
    focusAreas: ['무릎 통증', '어깨 질환', '관절 보존치료', '수술 후 회복관리'],
    schedule: '진료 일정은 예약 상담 시 확인',
    profilePoints: [
      '무릎·어깨 관절 질환 진료',
      '관절 통증의 원인 진단과 보존적 치료 검토',
      '생활 복귀를 고려한 회복 관리 상담',
    ],
    timetable: {
      consultation: [
        { day: '월', morning: '진료', afternoon: '진료' },
        { day: '화', morning: '-', afternoon: '진료' },
        { day: '수', morning: '진료', afternoon: '진료' },
        { day: '목', morning: '진료', afternoon: '-' },
        { day: '금', morning: '-', afternoon: '진료' },
        { day: '토', morning: '교대', afternoon: '-' },
      ],
      surgery: [
        { day: '월', morning: '-', afternoon: '-' },
        { day: '화', morning: '수술', afternoon: '-' },
        { day: '수', morning: '-', afternoon: '-' },
        { day: '목', morning: '-', afternoon: '수술' },
        { day: '금', morning: '수술', afternoon: '-' },
        { day: '토', morning: '-', afternoon: '-' },
      ],
    },
  },
  {
    id: 'kim-beom-jun',
    name: '김범준',
    title: '원장',
    center: '척추·관절 통증센터',
    specialty: '척추·관절 통증 진료',
    image: '/legacy-images/contents/pic_doctor7_n.jpg',
    imageAlt: '김범준 원장 프로필 사진',
    summary: '통증의 양상과 생활 습관을 함께 확인해 필요한 비수술 치료 방향을 찾습니다.',
    focusAreas: ['목·허리 통증', '근골격계 통증', '주사치료', '재활·운동 상담'],
    schedule: '진료 일정은 예약 상담 시 확인',
    profilePoints: [
      '척추·관절 통증 진료',
      '비수술적 통증 치료 방향 상담',
      '재발 방지를 고려한 생활 관리 안내',
    ],
    timetable: {
      consultation: [
        { day: '월', morning: '-', afternoon: '진료' },
        { day: '화', morning: '진료', afternoon: '-' },
        { day: '수', morning: '-', afternoon: '진료' },
        { day: '목', morning: '진료', afternoon: '진료' },
        { day: '금', morning: '진료', afternoon: '-' },
        { day: '토', morning: '교대', afternoon: '-' },
      ],
      surgery: [
        { day: '월', morning: '-', afternoon: '-' },
        { day: '화', morning: '-', afternoon: '수술' },
        { day: '수', morning: '수술', afternoon: '-' },
        { day: '목', morning: '-', afternoon: '-' },
        { day: '금', morning: '-', afternoon: '수술' },
        { day: '토', morning: '-', afternoon: '-' },
      ],
    },
  },
];

const careSteps = [
  {
    icon: <Stethoscope size={24} />,
    title: '정확한 진단',
    desc: '영상 검사와 문진, 이학적 검사를 바탕으로 통증의 원인을 먼저 확인합니다.',
  },
  {
    icon: <UsersRound size={24} />,
    title: '센터별 협진',
    desc: '척추센터와 관절센터가 환자의 증상에 맞춰 필요한 진료 방향을 함께 검토합니다.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: '필요한 치료',
    desc: '비수술 치료를 우선 검토하고, 수술이 필요한 경우 최소침습 치료를 지향합니다.',
  },
];

export default function DoctorsPage() {
  return (
    <div className="flex flex-col bg-white">
      <SubHero
        title="의료진 소개"
        subtitle="척추와 관절을 함께 살피는 4명의 의료진이 정확한 진단과 꼭 필요한 치료를 제안합니다."
        path={[{ name: '병원소개', href: '/about' }, { name: '의료진 소개' }]}
        bgImage="/generated/hero-university-doctors.png"
      />

      <main className="w-full">
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <ScrollReveal variant="image" className="relative overflow-hidden rounded-lg border border-slate-100 bg-slate-100 shadow-[0_34px_90px_-62px_rgba(15,29,54,0.55)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/generated/doctors-group-dummy.png"
                  alt="연세척병원 의료진 4명 더미 이미지"
                  fill
                  priority
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover object-left"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal className="space-y-6" delay={0.08}>
              <div className="space-y-5">
                <h2 className="text-4xl font-black leading-tight tracking-tight text-ink md:text-5xl">
                  정확한 진단에서 회복까지
                  <br />
                  함께 보는 의료진
                </h2>
                <p className="max-w-2xl text-lg font-medium leading-relaxed text-ink-sub">
                  척추와 관절의 통증은 같은 증상처럼 보여도 원인이 다를 수 있습니다.
                  연세척병원 의료진은 환자의 상태와 생활 환경을 함께 살피고,
                  비수술 치료부터 최소침습 치료까지 필요한 방향을 신중하게 제안합니다.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <DoctorsDirectory doctors={doctorList} />

        <section className="border-y border-slate-100 bg-slate-50/70 px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
            {careSteps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.08}>
                <article className="h-full rounded-lg border border-slate-100 bg-white p-8 shadow-[0_24px_70px_-58px_rgba(15,29,54,0.45)]">
                  <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-ink">{step.title}</h3>
                  <p className="mt-4 text-[17px] font-medium leading-relaxed text-ink-sub">{step.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <ScrollReveal className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-lg bg-navy-950 text-white shadow-[0_30px_90px_-55px_rgba(10,20,40,0.7)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-4 p-8 md:p-10 lg:p-12">
              <h2 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
                어떤 의료진을 선택해야 할지 고민된다면
              </h2>
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-300">
                증상과 검사 자료를 바탕으로 적합한 진료과와 의료진을 안내해 드립니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 p-8 md:flex-row md:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-base font-black text-navy-950 transition-all hover:bg-primary-light"
              >
                <CalendarCheck size={20} />
                진료 예약하기
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-4 text-base font-black text-white transition-all hover:border-white/50 hover:bg-white/10"
              >
                온라인 상담
                <ChevronRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
}

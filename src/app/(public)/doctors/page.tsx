import Link from 'next/link';
import { CalendarCheck, ChevronRight, ShieldCheck, Stethoscope, UsersRound } from 'lucide-react';
import DoctorsDirectory, { type DoctorProfile } from '@/components/DoctorsDirectory';
import DoctorsHeroLineup from '@/components/DoctorsHeroLineup';
import ScrollReveal from '@/components/ScrollReveal';
import SubHero from '@/components/SubHero';

const doctorsMarqueeText =
  'YONSEI CHEOK DOCTORS · SPINE AND JOINT SPECIALISTS · UNIVERSITY HOSPITAL TRAINED ·';

const doctorList: DoctorProfile[] = [
  {
    id: 'kim-dong-han',
    name: '김동한',
    title: '병원장',
    center: '척추내시경센터',
    specialty: '신경외과 전문의',
    image: '/김동한병원장.jpg',
    imageAlt: '김동한 병원장 프로필 사진',
    summary: '목·허리 질환에서 비수술 치료와 최소침습 척추 치료 방향을 함께 검토합니다.',
    focusAreas: [
      '척추 질환 / 비수술 치료(시술)',
      '척추관협착증 / 양방향 감압술',
      '척추 내시경수술',
      '퇴행성 척추질환',
      '최소 침습 척추수술',
      '척추 외상',
    ],
    schedule: '진료 일정은 예약 상담 시 확인',
    profilePoints: [
      '경북대학교병원 신경외과 외래교수',
      '부산미남병원 척추센터 진료원장',
      '대한최소침습척추학회 총무위원',
      '대한척추내시경연구회 정회원',
    ],
    credentials: {
      career: [
        '경북대학교 의과대학 의학석사',
        '경북대학교병원 신경외과 전공의',
        '경북대학교병원 신경외과 임상강사',
        '박원욱병원 척추센터 진료원장',
        '부산미남병원 척추센터 진료원장',
        '경북대학교병원 신경외과 외래교수',
        'UBE (양방향 척추내시경) 연구회',
        '부울경 척추내시경연구회 학술간사',
        '대한최소침습척추학회 총무위원',
        '대한신경외과학회 정회원',
        '대한척추신경외과학회 정회원',
        '대한척추내시경연구회 정회원',
      ],
      training: [
        '미국 Tampa General Hospital 연수, 2009, Florida, USA',
        '가톨릭대학교 Spine Symposium & Cadaver Workshop, Korea, 2019',
        '10th Asia Spine Symposium, Korea, 2019',
        '해외 Cadaver Workshop Instructor',
        '1st Malaysia Endoscopic Spine Cadaveric Workshop, Kuala Lumpur, Malaysia, 2022',
        '15th ThaiSMISST, Bangkok, Thailand, 2024',
      ],
      textbooks: [
        'Springer 출판사. 2022년 1판, 2025년 2판. Biportal Endoscopic Paraspinal Approach for Lumbar Foraminal Stenosis',
      ],
      papers: [
        {
          title: 'Guiding protractor for accurate freehand placement of ventricular catheter in ventriculoperitoneal shunting.',
          authors: 'Kim D, Son W, Park J.',
          citation: 'Acta Neurochir (Wien). 2015;157(4):699-702.',
        },
        {
          title: 'Delayed Perilesional Ischemic Stroke after Gamma-knife Radiosurgery for Unruptured Deep Arteriovenous Malformation: Two Case Reports of Radiation-induced Small Artery Injury as Possible Cause.',
          authors: 'Kim DH, Kang DH, Park J, Hwang JH, Park SH, Son WS.',
          citation: 'J Cerebrovasc Endovasc Neurosurg. 2015;17(1):36-42.',
        },
        {
          title: 'Cervical Radiculopathy Caused by Spinal Epidural Arteriovenous Fistula (SEDAVF) Without Intradural Drainage: A Case Report and Literature Review.',
          authors: 'Park D, Kim D, Kang DH, Lee S, Cho DC.',
          citation: 'Korean J Neurotrauma. 2022;18(1):145-9.',
        },
        {
          title: 'Unilateral Biportal Endoscopy for Decompression of Extraforaminal Stenosis at the Lumbosacral Junction: Surgical Techniques and Clinical Outcomes.',
          authors: 'Park MK, Son SK, Park WW, Choi SH, Jung DY, Kim DH.',
          citation: 'Neurospine. 2021;18(4):871-9.',
        },
      ],
    },
    timetable: {
      consultation: [
        { day: '월', morning: '진료', afternoon: '진료' },
        { day: '화', morning: '시·수술', afternoon: '진료' },
        { day: '수', morning: '진료', afternoon: '시·수술' },
        { day: '목', morning: '시·수술', afternoon: '진료' },
        { day: '금', morning: '진료', afternoon: '진료' },
        { day: '토', morning: '순환진료', afternoon: '' },
      ],
      surgery: [
        { day: '월', morning: '-', afternoon: '-' },
        { day: '화', morning: '시·수술', afternoon: '-' },
        { day: '수', morning: '-', afternoon: '시·수술' },
        { day: '목', morning: '시·수술', afternoon: '-' },
        { day: '금', morning: '-', afternoon: '-' },
        { day: '토', morning: '-', afternoon: '-' },
      ],
    },
  },
  {
    id: 'lee-nam',
    name: '이남',
    title: '병원장',
    center: '척추내시경센터',
    specialty: '신경외과 전문의',
    image: '/이남 병원장.jpg',
    imageAlt: '이남 병원장 프로필 사진',
    summary: '척추 질환의 원인을 정확히 확인하고 환자에게 필요한 치료 단계를 제안합니다.',
    focusAreas: [
      '척추 질환 / 비수술 치료(시술)',
      '척추관협착증 / 양방향 감압술',
      '척추 내시경수술',
      '퇴행성 척추질환',
      '최소 침습 척추수술',
      '척추 외상',
    ],
    schedule: '진료 일정은 예약 상담 시 확인',
    profilePoints: [
      '연세대학교 세브란스병원 신경외과 외래부교수',
      '대한 최소침습 척추학회(KOMISS) 감사',
      '대한 척추내시경 수술연구회(KOSESS) 총무간사',
      'SCI/SCIE 논문 13편 이상',
    ],
    credentials: {
      career: [
        '연세대학교 의과대학 대학원 의학과 석사졸업',
        '연세대학교 세브란스병원 신경외과 레지던트 수료',
        '연세대학교 세브란스병원 척추신경외과 임상강사 수료',
        '연세대학교 세브란스병원 척추신경외과 임상연구조교수 수료',
        '연세대학교 세브란스병원 신경외과 외래부교수',
        '대한 최소침습 척추학회(KOMISS) 감사',
        '대한 척추내시경 수술연구회(KOSESS) 총무간사',
        '양방향 척추내시경(UBE) 연구회 학술이사',
        '부산-울산-경남 척추내시경 연구회 학술이사',
        '대한 신경외과 학회 정회원',
        '대한 신경통증 학회 특별이사',
        '대한 척추신경외과 학회 정회원',
        '대한 척추신기술 학회(KOSASS) 정회원',
      ],
      training: [
        '미국 스탠포드(Stanford) 대학교 척추신경외과 연수, 2015, Palo Alto, CA, USA',
        'Medtronic Cadaveric Workshop, 2014, Bangkok, Thailand',
        'GS Medical Cadaveric Workshop, 2015, Bangkok, Thailand',
        'DePuy Synthes Spine Cadaveric Workshop, 2016, Bangkok, Thailand',
        'NASESS Symposium 최연소 Faculty, Seoul National University, Korea, 2018, 2019',
        'KOMISS Cadaver Workshop Instructor, 2018, 2019',
      ],
      awards: [
        '연세대학교 신경외과학교실 세백회 우수논문상 및 SCI/SCIE 논문 최다 게재상 수상, 2017.1.7',
        '연세대학교 의학과 우수업적 장학금 - 우수 논문 장학금 수상, 2017.1',
        '우수연제 선정 - 대한 경추연구회, Seoul, Korea, 2015.9 - Three Level ACDF vs Multilevel Laminoplasty in Patients with CSM',
        '연세대학교 의학과 우수 연구 장학금, 2015.1',
        '대한신경통증학회 추계 학술대회 우수연제상, 2018.10.28',
        '세계양방향척추내시경연구회(UBE) 학술대회 "최우수 강의상" 수상',
      ],
      textbooks: [
        "Springer 출판사. 2022년 1판, 2025년 2판. Biportal Endoscopic Decompression for Bertolotti's Syndrome: Far-out Syndrome",
      ],
      papers: [
        {
          title: 'Usefulness of 3-dimensional Measurement of Ossification of the Posterior Longitudinal Ligament (OPLL) in Patients With OPLL-induced Myelopathy.',
          authors: 'Lee N, Ji GY, Shin HC, Ha Y, Jang JW, Shin DA.',
          citation: 'Spine (Phila Pa 1976). 2015 Oct 1;40(19):1479-86. doi: 10.1097/BRS.0000000000001072.',
        },
        {
          title: 'Paradoxical Radiographic Changes of Coflex Interspinous Device with Minimum 2-Year Follow-Up in Lumbar Spinal Stenosis.',
          authors: 'Lee N, Shin DA, Kim KN, Yoon DH, Ha Y, Shin HC, Yi S.',
          citation: 'World Neurosurg. 2016 Jan;85:177-84. doi: 10.1016/j.wneu.2015.08.069.',
        },
        {
          title: 'Finite Element Analysis of the Effect of Epidural Adhesions.',
          authors: 'Lee N, Ji GY, Yi S, Yoon do H, Shin DA, Kim KN, Ha Y, Oh CH.',
          citation: 'Pain Physician. 2016 Jul;19(5):E787-93.',
        },
        {
          title: 'Comparison of outcomes of anterior-, posterior- and transforaminal lumbar interbody fusion surgery at a single lumbar level with degenerative spinal disease.',
          authors: 'Lee N, Kim KN, Yi S, Ha Y, Shin DA, Yoon DH, Kim KS.',
          citation: 'World Neurosurg. 2017 Feb 8. pii: S1878-8750(17)30140-7. doi: 10.1016/j.wneu.2017.01.114. [Epub ahead of print]',
        },
        {
          title: 'Progression of Coronal Cobb Angle After Short-Segment Lumbar Interbody Fusion in Patients with Degenerative Lumbar Stenosis.',
          authors: 'Lee N, Yi S, Shin DA, Kim KN, Yoon do H, Ha Y.',
          citation: 'World Neurosurg. 2016 May;89:510-6. doi: 10.1016/j.wneu.2016.01.051.',
        },
        {
          title: 'Utility of an Epidural Pressure Checker in the Administration of Trans-Laminar Epidural Blocks.',
          authors: 'Lee N, Yoon do H, Kim KN, Shin HC, Shin DA, Ha Y.',
          citation: 'J Korean Neurosurg Soc. 2016 Sep;59(5):471-7. doi: 10.3340/jkns.2016.59.5.471.',
        },
        {
          title: 'Compression Angle of Ossification of the Posterior Longitudinal Ligament and Its Clinical Significance in Cervical Myelopathy.',
          authors: 'Lee N, Yi S, Shin DA, Kim KN, Yoon do H, Ha Y.',
          citation: 'World Neurosurg. 2016 May;89:510-6. doi: 10.1016/j.wneu.2016.01.051.',
        },
        {
          title: 'Matched Comparison of Fusion Rates between Hydroxyapatite Demineralized Bone Matrix and Autograft in Lumbar Interbody Fusion.',
          authors: 'Lee N, Kim DH, Shin DA, Yi S, Kim KN, Ha Y.',
          citation: 'J Korean Neurosurg Soc. 2016 Jul;59(4):363-7. doi: 10.3340/jkns.2016.59.4.363.',
        },
        {
          title: 'Distinction between Intradural and Extradural Aneurysms Involving the Paraclinoid Internal Carotid Artery with T2-Weighted Three-Dimensional Fast Spin-Echo Magnetic Resonance Imaging.',
          authors: 'Lee N, Yi S, Shin DA, Kim KN, Yoon do H, Ha Y.',
          citation: 'World Neurosurg. 2016 May;89:510-6. doi: 10.1016/j.wneu.2016.01.051.',
        },
        {
          title: 'Relationship between T1 slope and loss of lordosis after laminoplasty in patients with cervical ossification of the posterior longitudinal ligament.',
          authors: 'Kim B, Lee N, Yoon do H, Ha Y, Yi S, Shin DA, Lee CK, Kim KN.',
          citation: 'Spine J. 2016 Feb;16(2):219-25. doi: 10.1016/j.spinee.2015.10.042.',
        },
        {
          title: 'Feasibility Study of Utilization of Action Camera, GoPro Hero 4, Google Glass, and Panasonic HX-A100 in Spine Surgery.',
          authors: 'Lee CK, Lee N, Kim B, Kim D, Yi S.',
          citation: 'Spine (Phila Pa 1976). 2017 Feb 15;42(4):275-280. doi: 10.1097/BRS.0000000000001719.',
        },
        {
          title: 'Characteristics of Cervical Spine Trauma in Patients with Ankylosing Spondylitis and Ossification of the Posterior Longitudinal Ligament.',
          authors: 'Lee CK, Lee N, Yoon DH, Kim KN, Yi S, Shin DA, Kim B, Ha Y.',
          citation: 'World Neurosurg. 2016 Dec;96:202-208. doi: 10.1016/j.wneu.2016.08.110.',
        },
        {
          title: 'Feasibility Study of Utilization of action camera, GoPro Hero 4, Google Glass and Panasonic HX-A100 in Spine Surgery.',
          authors: 'Lee CK, Lee N, Kim B, Kim D, Yi S.',
          citation: 'Spine (Phila Pa 1976). 2016 Jun 17. [Epub ahead of print]',
        },
      ],
    },
    timetable: {
      consultation: [
        { day: '월', morning: '진료', afternoon: '진료' },
        { day: '화', morning: '진료', afternoon: '시·수술' },
        { day: '수', morning: '시·수술', afternoon: '진료' },
        { day: '목', morning: '진료', afternoon: '시·수술' },
        { day: '금', morning: '진료', afternoon: '진료' },
        { day: '토', morning: '순환진료', afternoon: '' },
      ],
      surgery: [
        { day: '월', morning: '-', afternoon: '-' },
        { day: '화', morning: '-', afternoon: '시·수술' },
        { day: '수', morning: '시·수술', afternoon: '-' },
        { day: '목', morning: '-', afternoon: '시·수술' },
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
    specialty: '정형외과 전문의',
    image: '/최호원장.jpg',
    imageAlt: '최호 원장 프로필 사진',
    summary: '무릎·어깨 등 관절 통증의 원인을 살피고 보존적 치료부터 회복 관리까지 봅니다.',
    focusAreas: ['비수술적 시술', '관절내시경', '무릎관절클리닉', '연골재생클리닉'],
    schedule: '진료 일정은 예약 상담 시 확인',
    profilePoints: [
      '경희대학교 의과대학 외래교수',
      '좋은 강안병원 정형외과 주임과장',
      '롯데자이언츠 주치의',
    ],
    credentials: {
      career: [
        '경희의대 졸업',
        '경희의료원 정형외과 수련',
        '경희대학교 의과대학 외래교수',
        '경희대학교 의학전문원 실습지도교수',
        '좋은 삼선병원 정형외과 수련 주임과장',
        '좋은 강안병원 정형외과 주임과장',
        '홍제병원 의무원장',
        '바로선정형외과 원장',
        '롯데자이언츠 주치의',
      ],
      training: [
        '일본 가나자와 의과대학 병원 척추센터 연수',
      ],
      papers: [
        {
          title: '척추관 협착증에 대한 최소감압술 논문 발표',
          authors: '',
          citation: '2002년 일본 나고야',
        },
        {
          title: '국내·외 다수 논문 발표',
          authors: '',
          citation: '',
        },
      ],
    },
    timetable: {
      consultation: [
        { day: '월', morning: '진료', afternoon: '진료' },
        { day: '화', morning: '진료', afternoon: '진료' },
        { day: '수', morning: '진료', afternoon: '진료' },
        { day: '목', morning: '진료', afternoon: '진료' },
        { day: '금', morning: '진료', afternoon: '진료' },
        { day: '토', morning: '순환진료', afternoon: '' },
      ],
      surgery: [
        { day: '월', morning: '-', afternoon: '-' },
        { day: '화', morning: '-', afternoon: '-' },
        { day: '수', morning: '-', afternoon: '-' },
        { day: '목', morning: '-', afternoon: '-' },
        { day: '금', morning: '-', afternoon: '-' },
        { day: '토', morning: '-', afternoon: '-' },
      ],
    },
  },
  {
    id: 'kim-beom-jun',
    name: '김범준',
    title: '원장',
    center: '척추·관절 통증센터',
    specialty: '척추·관절 통증 진료 · 마취통증의학과 전문의',
    image: '/김범준원장.jpg',
    imageAlt: '김범준 원장 프로필 사진',
    summary: '통증의 양상과 생활 습관을 함께 확인해 필요한 비수술 치료 방향을 찾습니다.',
    focusAreas: ['척추 신경주사치료', '관절마취', '척추마취'],
    schedule: '진료 일정은 예약 상담 시 확인',
    profilePoints: [
      '충남대학교 마취통증의학과 전문의',
      '대한통증학회 TPI 전문자격이수',
      '전) 제주우리병원 비수술진료센터장',
    ],
    credentials: {
      career: [
        '충남대학교 의과대학 졸업',
        '충남대학교 의학대학원(석사) 마취통증의학과',
        '충남대학교 마취통증의학과 전문의',
        '충남대학교병원 인턴',
        '충남대학교병원 레지던트',
        '대한통증학회 TPI 전문자격이수',
        '대한마취통증의학회 정회원',
        '대한통증학회 정회원',
        '대한부위마취학회 정회원',
        '전) 국군강릉병원 마취과장',
        '전) 국군부산병원 마취과장',
        '전) 제주우리병원 비수술진료센터장',
      ],
    },
    timetable: {
      consultation: [
        { day: '월', morning: '진료', afternoon: '진료' },
        { day: '화', morning: '진료', afternoon: '진료' },
        { day: '수', morning: '진료', afternoon: '진료' },
        { day: '목', morning: '진료', afternoon: '진료' },
        { day: '금', morning: '진료', afternoon: '진료' },
        { day: '토', morning: '순환진료', afternoon: '' },
      ],
      surgery: [
        { day: '월', morning: '-', afternoon: '-' },
        { day: '화', morning: '-', afternoon: '-' },
        { day: '수', morning: '-', afternoon: '-' },
        { day: '목', morning: '-', afternoon: '-' },
        { day: '금', morning: '-', afternoon: '-' },
        { day: '토', morning: '-', afternoon: '-' },
      ],
    },
  },
  {
    id: 'jang-hwi-yeol',
    name: '장휘열',
    title: '원장',
    center: '영상의학과',
    specialty: '전문의 · 의학박사',
    image: '/장휘열원장님.png',
    imageAlt: '장휘열 원장 프로필 사진',
    summary: '정확한 영상 판독과 풍부한 검사 경험을 바탕으로 진단의 완성도를 높입니다.',
    focusAreas: ['영상의학 진단', '초음파 검사', 'PET/CT 영상'],
    schedule: '진료 일정은 예약 상담 시 확인',
    profilePoints: [
      '부산대학교 영상의학과 전문의 · 의학박사',
      '전) 세계로병원 PET/CT 센터장',
      '현) 동아대학교 의과대학 영상의학과 외래교수',
    ],
    credentials: {
      career: [
        '부산대학교 의과대학 졸업',
        '부산대학교 영상의학과 전문의 · 의학박사',
        '대한영상의학회 정회원',
        '대한핵의학회 정회원',
        '대한심장혈관영상의학회 정회원',
        '대한초음파학회 정회원',
        '전) 부산영상의학과의원 원장',
        '전) 세계로병원 PET/CT 센터장',
        '전) 한국건강관리협회부산지부 영상의학과 과장 및 PET/CT 센터장',
        '현) 동아대학교 의과대학 영상의학과 외래교수',
      ],
    },
    timetable: {
      consultation: [
        { day: '월', morning: '진료', afternoon: '진료' },
        { day: '화', morning: '진료', afternoon: '진료' },
        { day: '수', morning: '진료', afternoon: '진료' },
        { day: '목', morning: '진료', afternoon: '진료' },
        { day: '금', morning: '진료', afternoon: '진료' },
        { day: '토', morning: '순환진료', afternoon: '' },
      ],
      surgery: [
        { day: '월', morning: '-', afternoon: '-' },
        { day: '화', morning: '-', afternoon: '-' },
        { day: '수', morning: '-', afternoon: '-' },
        { day: '목', morning: '-', afternoon: '-' },
        { day: '금', morning: '-', afternoon: '-' },
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
        subtitle="척추와 관절을 함께 살피는 5명의 의료진이 정확한 진단과 꼭 필요한 치료를 제안합니다."
        path={[{ name: '병원소개', href: '/about' }, { name: '의료진 소개' }]}
        bgImage="/generated/hero-university-doctors.png"
      />

      <main className="w-full">
        <DoctorsHeroLineup />

        <div
          aria-hidden="true"
          className="marquee-fade pointer-events-none relative -mt-6 mb-2 overflow-hidden py-4 md:-mt-16 md:mb-0 md:py-6"
        >
          <div className="marquee-track flex w-max select-none font-montserrat text-[clamp(3rem,7.2vw,6.6rem)] font-semibold uppercase leading-none tracking-[0.01em] text-navy-900/[0.055]">
            <span className="shrink-0 pr-12 md:pr-20">{doctorsMarqueeText}</span>
            <span className="shrink-0 pr-12 md:pr-20">{doctorsMarqueeText}</span>
          </div>
        </div>

        <DoctorsDirectory doctors={doctorList} />

        <section className="border-y border-slate-100 bg-slate-50/70 px-4 py-14 sm:px-6 sm:py-16 md:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
            {careSteps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.08}>
                <article className="h-full rounded-lg border border-slate-100 bg-white p-5 shadow-[0_24px_70px_-58px_rgba(15,29,54,0.45)] sm:p-6 md:p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary sm:mb-7">
                    {step.icon}
                  </div>
                  <h3 className="break-keep text-h4 tracking-tight text-ink">{step.title}</h3>
                  <p className="mt-3 break-keep text-body text-ink-sub sm:mt-4 sm:text-[17px] sm:leading-relaxed">{step.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 md:py-24">
          <ScrollReveal className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-lg bg-navy-950 text-white shadow-[0_30px_90px_-55px_rgba(10,20,40,0.7)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-4 p-5 sm:p-8 md:p-10 lg:p-12">
              <h2 className="break-keep text-h3 tracking-tight">
                어떤 의료진을 선택해야 할지 고민된다면
              </h2>
              <p className="max-w-2xl break-keep text-[15px] font-medium leading-[1.75] text-slate-300 sm:text-lg sm:leading-relaxed">
                증상과 검사 자료를 바탕으로 적합한 진료과와 의료진을 안내해 드립니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 p-5 sm:p-8 md:flex-row md:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-base font-bold text-navy-950 transition-all hover:bg-primary-light"
              >
                <CalendarCheck size={20} />
                진료 예약하기
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-4 text-base font-bold text-white transition-all hover:border-white/50 hover:bg-white/10"
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

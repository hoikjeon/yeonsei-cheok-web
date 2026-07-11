'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type DoctorLineupItem = {
  id: string;
  name: string;
  title: string;
  image: string;
  alt: string;
  className: string;
  isFlipped?: boolean;
};

type DoctorNameLabel = {
  id: string;
  text: string;
  className: string;
};

type DoctorHitZone = {
  id: string;
  label: string;
  className: string;
};

const doctorLineup: DoctorLineupItem[] = [
  {
    id: 'kim-beom-jun',
    name: '김범준',
    title: '원장',
    image: '/generated/doctors-lineup/kim-beom-jun.png',
    alt: '김범준 원장',
    className: 'left-[40%] top-[4%] z-20 h-[72%] w-[28%] md:left-[38.5%] md:top-[10%] md:h-[90%] md:w-[25.5%]',
    isFlipped: true,
  },
  {
    id: 'jang-hwi-yeol',
    name: '장휘열',
    title: '원장',
    image: '/generated/doctors-lineup/jang-hwi-yeol.png',
    alt: '장휘열 원장',
    className: 'left-[62%] top-[18%] z-20 h-[50%] w-[18%] md:left-[56%] md:top-[30%] md:h-[66%] md:w-[17%]',
  },
  {
    id: 'kim-dong-han',
    name: '김동한',
    title: '병원장',
    image: '/generated/doctors-lineup/kim-dong-han.png',
    alt: '김동한 병원장',
    className: 'left-[20%] top-[33%] z-40 h-[72%] w-[30%] md:left-[31%] md:top-[24%] md:h-[92%] md:w-[26%]',
  },
  {
    id: 'lee-nam',
    name: '이남',
    title: '병원장',
    image: '/generated/doctors-lineup/lee-nam.png',
    alt: '이남 병원장',
    className: 'left-[50%] top-[31%] z-50 h-[76%] w-[31%] md:left-[48%] md:top-[23%] md:h-[94%] md:w-[26%]',
  },
  {
    id: 'choi-ho',
    name: '최호',
    title: '원장',
    image: '/generated/doctors-lineup/choi-ho.png',
    alt: '최호 원장',
    className: 'left-[80%] top-[33%] z-40 h-[72%] w-[30%] md:left-[64%] md:top-[26%] md:h-[90%] md:w-[26%]',
  },
];

// ── 장휘열 원장 이름표 위치 (여기 숫자만 바꾸면 위치가 조정됩니다) ──────────────
//   left-[숫자%] : 값이 클수록 오른쪽으로 이동
//   top-[숫자%]  : 값이 클수록 아래로 이동
//   기본값(모바일)과 md:값(PC)을 각각 지정합니다. 예) 'left-[60%] top-[40%] md:left-[62%] md:top-[42%]'
const JANG_HWI_YEOL_LABEL_POSITION = 'left-[70%] top-[34%] md:left-[68%] md:top-[44%]';

const backDoctorNameLabels: DoctorNameLabel[] = [
  {
    id: 'kim-beom-jun-label',
    text: '김범준 원장',
    className: 'left-[26%] top-[34%] text-[17px] md:left-[24%] md:top-[44%] md:text-[30px] lg:text-[33px]',
  },
  {
    id: 'jang-hwi-yeol-label',
    text: '장휘열 원장',
    // 위치는 위의 JANG_HWI_YEOL_LABEL_POSITION 에서 조정하세요. (아래는 글자 크기만)
    className: `${JANG_HWI_YEOL_LABEL_POSITION} text-[17px] md:text-[30px] lg:text-[33px]`,
  },
];

const frontDoctorNameLabels: DoctorNameLabel[] = [
  {
    id: 'kim-dong-han-label',
    text: '김동한 병원장',
    className: 'left-[20%] bottom-[8%] text-[17px] md:left-[31%] md:bottom-[10%] md:text-[31px] lg:text-[34px]',
  },
  {
    id: 'lee-nam-label',
    text: '이남 병원장',
    className: 'left-[50%] bottom-[8%] text-[17px] md:left-[48%] md:bottom-[10%] md:text-[31px] lg:text-[34px]',
  },
  {
    id: 'choi-ho-label',
    text: '최호 원장',
    className: 'left-[80%] bottom-[8%] text-[17px] md:left-[65%] md:bottom-[10%] md:text-[31px] lg:text-[34px]',
  },
];

const doctorHitZones: DoctorHitZone[] = [
  {
    id: 'kim-beom-jun',
    label: '김범준 원장 상세 프로필로 이동',
    className: 'left-[40%] top-[13%] h-[32%] w-[16%] md:left-[39%] md:top-[10%] md:h-[36%] md:w-[15%]',
  },
  {
    id: 'jang-hwi-yeol',
    label: '장휘열 원장 상세 프로필로 이동',
    className: 'left-[62%] top-[17%] h-[28%] w-[15%] md:left-[61%] md:top-[16%] md:h-[35%] md:w-[14%]',
  },
  {
    id: 'kim-dong-han',
    label: '김동한 병원장 상세 프로필로 이동',
    className: 'left-[20%] top-[48%] h-[42%] w-[20%] md:left-[31%] md:top-[42%] md:h-[46%] md:w-[15%]',
  },
  {
    id: 'lee-nam',
    label: '이남 병원장 상세 프로필로 이동',
    className: 'left-[50%] top-[46%] h-[44%] w-[20%] md:left-[48%] md:top-[40%] md:h-[48%] md:w-[15%]',
  },
  {
    id: 'choi-ho',
    label: '최호 원장 상세 프로필로 이동',
    className: 'left-[80%] top-[48%] h-[42%] w-[20%] md:left-[65%] md:top-[42%] md:h-[46%] md:w-[15%]',
  },
];

const HEADER_OFFSET = 96;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const smoothScrollToId = (id: string, duration = 900) => {
  const target = document.getElementById(id);
  if (!target) return;

  const startY = window.scrollY;
  const destination = target.getBoundingClientRect().top + startY - HEADER_OFFSET;
  const distance = destination - startY;
  if (Math.abs(distance) < 2) return;

  let startTime: number | null = null;

  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

export default function DoctorsHeroLineup() {
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);

  const handleDoctorSelect = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    smoothScrollToId(id);
    if (window.history.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <section id="doctors-lineup" className="bg-white px-4 py-10 md:px-6 md:py-[4.5rem]">
      <div className="mx-auto max-w-[1500px]">
        <div className="relative isolate aspect-[16/10] min-h-[360px] overflow-hidden bg-white md:aspect-[16/8.45] md:min-h-[560px] lg:min-h-[660px] xl:min-h-[700px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(40,74,165,0.055),rgba(255,255,255,0)_42%),linear-gradient(90deg,#ffffff_0%,rgba(248,250,252,0.72)_38%,rgba(248,250,252,0.72)_62%,#ffffff_100%)]" />

          <div className="pointer-events-none absolute right-[3.5%] top-[8%] z-[60] hidden max-w-[34%] text-right md:block">
            <p className="text-[21px] font-black leading-[1.4] tracking-tight text-ink lg:text-[27px]">
              정직한 진단과
              <br />
              꼭 필요한 치료
            </p>
            <p className="mt-2.5 text-[13px] font-semibold leading-relaxed text-ink-sub lg:text-[14.5px]">
              대학병원 출신 전문의가
              <br />
              환자 곁에서 함께합니다
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0">
            {doctorLineup.map((doctor) => {
              const isActive = activeDoctorId === doctor.id;

              return (
                <div
                  key={doctor.id}
                  className={`absolute block -translate-x-1/2 overflow-visible transition-transform duration-300 ease-out ${isActive ? '-translate-y-2' : ''
                    } ${doctor.className}`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-[12%] bottom-[3%] h-12 rounded-full bg-navy-950/10 blur-xl transition-opacity duration-300 ${isActive ? 'opacity-70' : ''
                      }`}
                  />
                  <span className={`pointer-events-none absolute inset-0 ${doctor.isFlipped ? 'scale-x-[-1]' : ''}`}>
                    <Image
                      src={doctor.image}
                      alt={doctor.alt}
                      fill
                      sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 34vw"
                      className={`origin-bottom object-contain object-bottom transition duration-300 ease-out ${isActive
                        ? 'scale-[1.035] drop-shadow-[0_34px_44px_rgba(15,29,54,0.24)]'
                        : 'drop-shadow-[0_22px_30px_rgba(15,29,54,0.18)]'
                        }`}
                    />
                  </span>
                </div>
              );
            })}
          </div>

          <div className="absolute inset-0 z-[130]">
            {doctorHitZones.map((zone) => (
              <Link
                key={zone.id}
                href={`#${zone.id}`}
                aria-label={zone.label}
                onClick={(event) => handleDoctorSelect(event, zone.id)}
                onMouseEnter={() => setActiveDoctorId(zone.id)}
                onMouseLeave={() => setActiveDoctorId(null)}
                onFocus={() => setActiveDoctorId(zone.id)}
                onBlur={() => setActiveDoctorId(null)}
                className={`absolute -translate-x-1/2 cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/55 ${zone.className}`}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 z-[45] font-handwriting font-normal tracking-normal text-navy-900/90">
            {backDoctorNameLabels.map((label) => (
              <span
                key={label.id}
                className={`absolute -translate-x-1/2 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(255,255,255,0.92)] ${label.className}`}
              >
                {label.text}
              </span>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[90] h-[17%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.84)_62%,#ffffff_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[95] h-6 bg-white" />

          <div className="pointer-events-none absolute inset-0 z-[100] font-handwriting font-normal tracking-normal text-navy-900/90">
            {frontDoctorNameLabels.map((label) => (
              <span
                key={label.id}
                className={`absolute -translate-x-1/2 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(255,255,255,0.92)] ${label.className}`}
              >
                {label.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

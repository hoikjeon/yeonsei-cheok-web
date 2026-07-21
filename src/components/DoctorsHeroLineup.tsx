'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type CSSProperties, type MouseEvent } from 'react';
import styles from './DoctorsHeroLineup.module.css';

type BoxPosition = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type DoctorPosition = BoxPosition & {
  zIndex: number;
};

type ResponsiveDoctorPosition = {
  mobile: DoctorPosition;
  desktop: DoctorPosition;
};

type ResponsiveHitZone = {
  mobile: BoxPosition;
  desktop: BoxPosition;
};

type LabelPosition = {
  left: number;
  top?: number;
  bottom?: number;
  fontSize: number;
};

type ResponsiveLabelPosition = {
  mobile: LabelPosition;
  smallFontSize: number;
  desktop: LabelPosition;
  wideFontSize: number;
};

type CSSVariableStyle = CSSProperties & Record<`--${string}`, string | number>;

type DoctorLineupItem = {
  id: string;
  name: string;
  title: string;
  image: string;
  alt: string;
  position: ResponsiveDoctorPosition;
  hitZone: ResponsiveHitZone;
  isFlipped?: boolean;
};

type DoctorNameLabel = {
  id: string;
  text: string;
  position: ResponsiveLabelPosition;
};

// ── 인물 개별 조정 영역 ─────────────────────────────────────────────
// mobile: 767px 이하 / desktop: 768px 이상
// left·top은 위치(%), width·height는 인물 영역 크기(%), zIndex는 앞뒤 순서입니다.
// 숫자가 클수록 left는 오른쪽, top은 아래, width·height는 크게 보입니다.
// 인물을 옮긴 뒤에는 같은 인물의 hitZone 숫자도 함께 맞춰주세요.
const doctorLineup: DoctorLineupItem[] = [
  {
    id: 'kim-beom-jun',
    name: '김범준',
    title: '원장',
    image: '/generated/doctors-lineup/kim-beom-jun.png',
    alt: '김범준 원장',
    position: {
      mobile: { left: 24, top: 10, width: 27, height: 66, zIndex: 20 },
      desktop: { left: 31, top: 17, width: 24, height: 84, zIndex: 20 },
    },
    hitZone: {
      mobile: { left: 24, top: 20, width: 19, height: 34 },
      desktop: { left: 31, top: 27, width: 16, height: 40 },
    },
    isFlipped: true,
  },
  {
    id: 'choi-ho',
    name: '최호',
    title: '원장',
    image: '/generated/doctors-lineup/choi-ho.png',
    alt: '최호 원장',
    position: {
      mobile: { left: 50, top: 11, width: 25, height: 62, zIndex: 30 },
      desktop: { left: 50, top: 18, width: 22, height: 78, zIndex: 30 },
    },
    hitZone: {
      mobile: { left: 50, top: 20, width: 17, height: 30 },
      desktop: { left: 50, top: 27, width: 15, height: 38 },
    },
  },
  {
    id: 'jang-hwi-yeol',
    name: '장휘열',
    title: '원장',
    image: '/generated/doctors-lineup/jang-hwi-yeol.png',
    alt: '장휘열 원장',
    position: {
      mobile: { left: 76, top: 23, width: 18, height: 50, zIndex: 20 },
      desktop: { left: 69, top: 33, width: 17, height: 66, zIndex: 20 },
    },
    hitZone: {
      mobile: { left: 76, top: 23, width: 15, height: 28 },
      desktop: { left: 69, top: 33, width: 13, height: 34 },
    },
  },
  {
    id: 'kim-dong-han',
    name: '김동한',
    title: '병원장',
    image: '/generated/doctors-lineup/kim-dong-han.png',
    alt: '김동한 병원장',
    position: {
      mobile: { left: 39, top: 29, width: 31, height: 74, zIndex: 40 },
      desktop: { left: 41, top: 22, width: 27, height: 94, zIndex: 40 },
    },
    hitZone: {
      mobile: { left: 39, top: 42, width: 22, height: 48 },
      desktop: { left: 41, top: 39, width: 17, height: 51 },
    },
  },
  {
    id: 'lee-nam',
    name: '이남',
    title: '병원장',
    image: '/generated/doctors-lineup/lee-nam.png',
    alt: '이남 병원장',
    position: {
      mobile: { left: 61, top: 31, width: 30, height: 73, zIndex: 50 },
      desktop: { left: 59, top: 23, width: 26, height: 94, zIndex: 50 },
    },
    hitZone: {
      mobile: { left: 61, top: 45, width: 22, height: 45 },
      desktop: { left: 59, top: 42, width: 17, height: 48 },
    },
    isFlipped: true,
  },
];

// ── 이름표 개별 조정 영역 ───────────────────────────────────────────
// left·top·bottom은 위치(%), fontSize·smallFontSize·wideFontSize는 글자 크기(px)입니다.
// 위쪽 이름은 top, 아래쪽 이름은 bottom 숫자를 조절하면 됩니다.
const backDoctorNameLabels: DoctorNameLabel[] = [
  {
    id: 'kim-beom-jun-label',
    text: '김범준 원장',
    position: {
      mobile: { left: 13, top: 34, fontSize: 15 },
      smallFontSize: 17,
      desktop: { left: 19, top: 45, fontSize: 30 },
      wideFontSize: 33,
    },
  },
  {
    id: 'choi-ho-label',
    text: '최호 원장',
    position: {
      mobile: { left: 37, top: 32, fontSize: 15 },
      smallFontSize: 17,
      desktop: { left: 41, top: 39, fontSize: 30 },
      wideFontSize: 33,
    },
  },
  {
    id: 'jang-hwi-yeol-label',
    text: '장휘열 원장',
    position: {
      mobile: { left: 87, top: 34, fontSize: 15 },
      smallFontSize: 17,
      desktop: { left: 81, top: 45, fontSize: 30 },
      wideFontSize: 33,
    },
  },
];

const frontDoctorNameLabels: DoctorNameLabel[] = [
  {
    id: 'kim-dong-han-label',
    text: '김동한 병원장',
    position: {
      mobile: { left: 36, bottom: 8, fontSize: 15 },
      smallFontSize: 17,
      desktop: { left: 41, bottom: 10, fontSize: 31 },
      wideFontSize: 34,
    },
  },
  {
    id: 'lee-nam-label',
    text: '이남 병원장',
    position: {
      mobile: { left: 64, bottom: 8, fontSize: 15 },
      smallFontSize: 17,
      desktop: { left: 59, bottom: 10, fontSize: 31 },
      wideFontSize: 34,
    },
  },
];

const percent = (value: number) => `${value}%`;

const getDoctorPositionStyle = (position: ResponsiveDoctorPosition): CSSVariableStyle => ({
  '--doctor-left-mobile': percent(position.mobile.left),
  '--doctor-top-mobile': percent(position.mobile.top),
  '--doctor-width-mobile': percent(position.mobile.width),
  '--doctor-height-mobile': percent(position.mobile.height),
  '--doctor-z-mobile': position.mobile.zIndex,
  '--doctor-left-desktop': percent(position.desktop.left),
  '--doctor-top-desktop': percent(position.desktop.top),
  '--doctor-width-desktop': percent(position.desktop.width),
  '--doctor-height-desktop': percent(position.desktop.height),
  '--doctor-z-desktop': position.desktop.zIndex,
});

const getHitZoneStyle = (position: ResponsiveHitZone): CSSVariableStyle => ({
  '--hit-left-mobile': percent(position.mobile.left),
  '--hit-top-mobile': percent(position.mobile.top),
  '--hit-width-mobile': percent(position.mobile.width),
  '--hit-height-mobile': percent(position.mobile.height),
  '--hit-left-desktop': percent(position.desktop.left),
  '--hit-top-desktop': percent(position.desktop.top),
  '--hit-width-desktop': percent(position.desktop.width),
  '--hit-height-desktop': percent(position.desktop.height),
});

const getLabelPositionStyle = (position: ResponsiveLabelPosition): CSSVariableStyle => ({
  '--label-left-mobile': percent(position.mobile.left),
  '--label-top-mobile': position.mobile.top === undefined ? 'auto' : percent(position.mobile.top),
  '--label-bottom-mobile': position.mobile.bottom === undefined ? 'auto' : percent(position.mobile.bottom),
  '--label-font-mobile': `${position.mobile.fontSize}px`,
  '--label-font-small': `${position.smallFontSize}px`,
  '--label-left-desktop': percent(position.desktop.left),
  '--label-top-desktop': position.desktop.top === undefined ? 'auto' : percent(position.desktop.top),
  '--label-bottom-desktop': position.desktop.bottom === undefined ? 'auto' : percent(position.desktop.bottom),
  '--label-font-desktop': `${position.desktop.fontSize}px`,
  '--label-font-wide': `${position.wideFontSize}px`,
});

// 클릭 스크롤 도착 여백: 스크롤 시 헤더가 사라지므로 헤더 높이(96) 대신 살짝만 띄웁니다
const HEADER_OFFSET = 32;

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

  const handleDoctorSelect = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    smoothScrollToId(id);
    if (window.history.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <section id="doctors-lineup" className="bg-white px-4 py-8 sm:py-10 md:px-6 md:py-[4.5rem]">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate h-[340px] w-full overflow-hidden bg-white sm:h-auto sm:aspect-[16/10] sm:min-h-[360px] md:aspect-[16/8.45] md:min-h-[560px] lg:min-h-[660px] xl:min-h-[700px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(40,74,165,0.055),rgba(255,255,255,0)_42%),linear-gradient(90deg,#ffffff_0%,rgba(248,250,252,0.72)_38%,rgba(248,250,252,0.72)_62%,#ffffff_100%)]" />

          <div className="pointer-events-none absolute left-[48%] top-[62%] z-[5] w-[240px] -translate-x-1/2 -translate-y-1/2 md:top-[66%] md:w-[400px] lg:w-[480px] xl:w-[540px]">
            <Image
              src="/ys-logo-bg.png"
              alt=""
              width={540}
              height={539}
              className="h-auto w-full opacity-[0.06] grayscale"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[13%] z-[60] hidden text-center md:block">
            <p className="bg-gradient-to-b from-[#3157B2] via-primary via-40% to-navy-900 bg-clip-text text-[2rem] font-bold leading-[1.25] tracking-tight text-transparent lg:text-[2.5rem] xl:text-[3rem]">
              정직한 진단과 꼭 필요한 치료
            </p>
            <p className="mt-3 text-[15px] font-semibold leading-[1.7] text-ink-sub lg:text-[17px] xl:text-lg">
              대학병원 출신 전문의가 환자 곁에서 함께합니다
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0">
            {doctorLineup.map((doctor) => {
              const isActive = activeDoctorId === doctor.id;

              return (
                <div
                  key={doctor.id}
                  style={getDoctorPositionStyle(doctor.position)}
                  className={`absolute block -translate-x-1/2 overflow-visible transition-transform duration-300 ease-out ${styles.doctorPosition} ${isActive ? '-translate-y-2' : ''
                    }`}
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
            {doctorLineup.map((doctor) => (
              <Link
                key={doctor.id}
                href={`#${doctor.id}`}
                aria-label={`${doctor.name} ${doctor.title} 상세 프로필로 이동`}
                style={getHitZoneStyle(doctor.hitZone)}
                onClick={(event) => handleDoctorSelect(event, doctor.id)}
                onMouseEnter={() => setActiveDoctorId(doctor.id)}
                onMouseLeave={() => setActiveDoctorId(null)}
                onFocus={() => setActiveDoctorId(doctor.id)}
                onBlur={() => setActiveDoctorId(null)}
                className={`absolute -translate-x-1/2 cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/55 ${styles.hitZonePosition}`}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 z-[45] font-handwriting font-normal tracking-normal text-navy-900/90">
            {backDoctorNameLabels.map((label) => (
              <span
                key={label.id}
                style={getLabelPositionStyle(label.position)}
                className={`absolute -translate-x-1/2 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(255,255,255,0.92)] transition-transform duration-300 ease-out ${
                  activeDoctorId === label.id.replace('-label', '') ? 'scale-[1.07]' : ''
                } ${styles.nameLabelPosition}`}
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
                style={getLabelPositionStyle(label.position)}
                className={`absolute -translate-x-1/2 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(255,255,255,0.92)] transition-transform duration-300 ease-out ${
                  activeDoctorId === label.id.replace('-label', '') ? 'scale-[1.07]' : ''
                } ${styles.nameLabelPosition}`}
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

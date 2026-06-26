'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

type ScheduleMode = 'consultation' | 'surgery';

interface TimetableItem {
  day: string;
  morning: string;
  afternoon: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  center: string;
  specialty: string;
  image: string;
  imageAlt: string;
  summary: string;
  focusAreas: string[];
  schedule: string;
  profilePoints: string[];
  timetable: Record<ScheduleMode, TimetableItem[]>;
}

interface DoctorsDirectoryProps {
  doctors: DoctorProfile[];
}

const DOCTOR_ORDER = ['이남', '김동한', '최호', '김범준'];

const SCHEDULE_MODE_LABELS: Record<ScheduleMode, string> = {
  consultation: '진료',
  surgery: '수술',
};

const ScheduleTable = ({ doctor }: { doctor: DoctorProfile }) => {
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('consultation');
  const activeTimetable = doctor.timetable[scheduleMode];

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-ink">
            <CalendarDays size={18} className="text-primary" />
            시간표
          </div>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink-muted">
            실제 일정은 병원 사정에 따라 변경될 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-1">
          {(Object.keys(SCHEDULE_MODE_LABELS) as ScheduleMode[]).map((mode) => {
            const isActive = scheduleMode === mode;

            return (
              <button
                key={mode}
                type="button"
                aria-pressed={isActive}
                onClick={() => setScheduleMode(mode)}
                className={`min-h-10 rounded-md px-5 text-sm font-black transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-blue-glow'
                    : 'text-ink-sub hover:bg-primary-light hover:text-primary'
                }`}
              >
                {SCHEDULE_MODE_LABELS[mode]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-lg border border-slate-200 bg-white text-center">
          <thead>
            <tr>
              <th className="w-20 border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-sm font-black text-ink">
                구분
              </th>
              {activeTimetable.map((item) => (
                <th
                  key={item.day}
                  className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-sm font-black text-ink last:border-r-0"
                >
                  {item.day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: '오전', key: 'morning' as const },
              { label: '오후', key: 'afternoon' as const },
            ].map((row) => (
              <tr key={row.label}>
                <th className="border-r border-slate-200 px-3 py-4 text-sm font-black text-ink-sub">
                  {row.label}
                </th>
                {activeTimetable.map((item) => {
                  const value = item[row.key];
                  const isAvailable = value !== '-';

                  return (
                    <td
                      key={`${item.day}-${row.key}`}
                      className="border-r border-slate-100 px-3 py-4 text-sm font-bold text-ink-sub last:border-r-0"
                    >
                      <span className={`inline-flex min-w-14 justify-center rounded-md px-2.5 py-1.5 ${
                        isAvailable
                          ? 'bg-primary-light text-primary'
                          : 'bg-slate-50 text-ink-muted'
                      }`}>
                        {value}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor, index }: { doctor: DoctorProfile; index: number }) => {
  return (
    <ScrollReveal delay={index * 0.08} amount={0.14}>
      <article className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-[0_34px_90px_-60px_rgba(15,29,54,0.55)]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,0.34fr)_minmax(0,1fr)]">
          <div className="relative min-h-[460px] overflow-hidden bg-[#dfe4e8] md:min-h-[560px] lg:min-h-full">
            <Image
              src={doctor.image}
              alt={doctor.imageAlt}
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-navy-950/42 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/20 bg-white/90 p-5 shadow-[0_20px_55px_-40px_rgba(10,20,40,0.65)] backdrop-blur-md">
              <p className="text-sm font-black text-primary">{doctor.center}</p>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-ink">
                {doctor.name}
                <span className="ml-2 text-lg font-bold text-ink-sub">{doctor.title}</span>
              </h3>
              <p className="mt-1 text-sm font-bold text-ink-sub">{doctor.specialty}</p>
            </div>
          </div>

          <div className="space-y-7 p-7 md:p-10 lg:p-12">
            <div className="flex flex-wrap gap-2">
              {doctor.focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-lg border border-primary/10 bg-primary-light px-3 py-1.5 text-sm font-black text-primary"
                >
                  {area}
                </span>
              ))}
            </div>

            <div className="space-y-5">
              <p className="text-[28px] font-black leading-tight tracking-tight text-ink md:text-[34px]">
                {doctor.summary}
              </p>
              <p className="max-w-2xl text-[17px] font-medium leading-relaxed text-ink-sub">
                증상의 위치와 강도, 검사 결과, 일상에서 반복되는 움직임을 함께 확인해
                환자에게 필요한 진료 방향을 설명드립니다.
              </p>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-ink">
                <ClipboardList size={18} className="text-primary" />
                주요 프로필
              </div>
              <div className="space-y-2">
                {doctor.profilePoints.slice(0, 3).map((point) => (
                  <div key={point} className="flex gap-2 text-[14px] font-medium leading-relaxed text-ink-sub">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <ScheduleTable doctor={doctor} />

            <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 md:grid-cols-2">
              <Link
                href="/reservation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-navy-950 px-6 text-base font-black text-white transition-all hover:bg-primary"
              >
                <CalendarCheck size={19} />
                예약하기
              </Link>
              <Link
                href="/consultation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 text-base font-black text-ink transition-all hover:border-primary/40 hover:text-primary"
              >
                상담문의
                <ChevronRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
};

const DoctorsDirectory = ({ doctors }: DoctorsDirectoryProps) => {
  const orderedDoctors = [...doctors].sort((a, b) => (
    DOCTOR_ORDER.indexOf(a.name) - DOCTOR_ORDER.indexOf(b.name)
  ));

  return (
    <section className="border-y border-slate-100 bg-[#f6f8fb] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-12 max-w-3xl">
          <div className="space-y-5">
            <h2 className="text-4xl font-black leading-tight tracking-tight text-ink md:text-5xl">
              의료진 프로필
            </h2>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-ink-sub">
              아래로 내려 각 의료진의 전문분야와 진료 방향, 진료·수술 시간표를 확인하실 수 있습니다.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-10 md:space-y-14">
          {orderedDoctors.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsDirectory;

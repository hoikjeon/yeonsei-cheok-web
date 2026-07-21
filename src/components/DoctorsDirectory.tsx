'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

type ScheduleMode = 'consultation' | 'surgery';

interface TimetableItem {
  day: string;
  morning: string;
  afternoon: string;
}

type CredentialTabId = 'career' | 'training' | 'awards' | 'textbooks' | 'papers';

export interface DoctorPaper {
  title: string;
  authors: string;
  citation: string;
}

export interface DoctorCredentials {
  career?: string[];
  training?: string[];
  awards?: string[];
  textbooks?: string[];
  papers?: DoctorPaper[];
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
  credentials?: DoctorCredentials;
  timetable: Record<ScheduleMode, TimetableItem[]>;
}

interface DoctorsDirectoryProps {
  doctors: DoctorProfile[];
}

const DOCTOR_ORDER = ['이남', '김동한', '최호', '김범준', '장휘열'];

const DOCTOR_CAREERS: Record<string, string[]> = {
  이남: [
    '연세대학교 의과대학 대학원 석사졸업',
    '연세대학교 세브란스병원 신경외과 레지던트 수료',
    '연세대학교 세브란스병원 척추신경외과 임상연구조교수',
    '대한 척추내시경 수술연구회(KOSESS) 총무간사',
  ],
  김동한: [
    '연세대학교 세브란스병원 신경외과 전문의',
    '연세대학교 세브란스병원 척추신경외과 임상강사',
    '대한 최소침습 척추학회(KOMISS) 정회원',
    '양방향척추내시경(UBE) 척추 질환 진료',
  ],
  최호: [
    '무릎·어깨 관절 질환 진료',
    '관절 통증의 원인 진단과 보존적 치료 검토',
    '관절 수술 후 회복 관리 상담',
    '생활 복귀를 고려한 재활 방향 안내',
  ],
  김범준: [
    '충남대학교 마취통증의학과 전문의',
    '대한통증학회 TPI 전문자격이수',
    '대한마취통증의학회 정회원',
    '전) 제주우리병원 비수술진료센터장',
  ],
  장휘열: [
    '부산대학교 영상의학과 전문의 · 의학박사',
    '대한영상의학회 정회원',
    '전) 세계로병원 PET/CT 센터장',
    '현) 동아대학교 의과대학 영상의학과 외래교수',
  ],
};

const CREDENTIAL_TABS: { id: CredentialTabId; label: string }[] = [
  { id: 'career', label: '약력' },
  { id: 'training', label: '연수' },
  { id: 'awards', label: '수상' },
  { id: 'textbooks', label: '저서' },
  { id: 'papers', label: '논문' },
];

const PAPERS_PREVIEW_LIMIT = 5;

const normalizeScheduleValue = (value: string) => {
  if (value === '-' || value === '휴진') return '휴진';
  if (value === '교대') return '진료';
  return value;
};

const getCredentialCount = (credentials: DoctorCredentials | undefined, tabId: CredentialTabId) => {
  if (!credentials) return 0;

  switch (tabId) {
    case 'career':
      return credentials.career?.length ?? 0;
    case 'training':
      return credentials.training?.length ?? 0;
    case 'awards':
      return credentials.awards?.length ?? 0;
    case 'textbooks':
      return credentials.textbooks?.length ?? 0;
    case 'papers':
      return credentials.papers?.length ?? 0;
    default:
      return 0;
  }
};

const getCredentialItems = (credentials: DoctorCredentials, tabId: Exclude<CredentialTabId, 'papers'>) => {
  switch (tabId) {
    case 'career':
      return credentials.career ?? [];
    case 'training':
      return credentials.training ?? [];
    case 'awards':
      return credentials.awards ?? [];
    case 'textbooks':
      return credentials.textbooks ?? [];
    default:
      return [];
  }
};

const ScheduleTable = ({ doctor }: { doctor: DoctorProfile }) => {
  const timetable = doctor.timetable.consultation;

  return (
    <div className="space-y-3 md:space-y-5">
      <h4 className="hidden text-h4 tracking-tight text-ink md:block">진료시간표</h4>

      {/* 모바일: 요일을 가로로 둔 단일 표 */}
      <div className="rounded-xl border border-slate-200 bg-white px-2 py-1 md:hidden">
        <table className="w-full table-fixed border-collapse text-center">
          <thead>
            <tr>
              <th className="w-[42px] py-3" />
              {timetable.map((item) => (
                <th key={`m-head-${item.day}`} className="py-3 text-[15px] font-bold text-ink">
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
              <tr key={`m-${row.label}`} className="border-t border-slate-200">
                <th className="py-3.5 text-[14px] font-bold text-ink">{row.label}</th>
                {timetable.map((item) => {
                  const value = normalizeScheduleValue(item[row.key]);
                  const isOpen = value === '진료' || value === '순환진료';

                  return (
                    <td
                      key={`m-${item.day}-${row.key}`}
                      className={`break-keep px-0.5 py-3.5 text-[13px] font-bold leading-tight ${
                        isOpen ? 'text-primary' : 'text-ink-muted'
                      }`}
                    >
                      {value || ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-[#d7d7d7] bg-white md:block">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-center">
          <thead>
            <tr className="bg-[#d0d0d0]">
              <th className="w-24 px-4 py-5 text-[17px] font-bold text-ink">구분</th>
              {timetable.map((item) => (
                <th key={item.day} className="px-4 py-5 text-[17px] font-bold text-ink">
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
              <tr key={row.label} className="border-t border-[#d7d7d7]">
                <th className="border-r border-[#d7d7d7] px-4 py-5 text-[17px] font-bold text-ink">
                  {row.label}
                </th>
                {timetable.map((item) => {
                  const value = normalizeScheduleValue(item[row.key]);
                  const isOpen = value === '진료' || value === '순환진료';

                  return (
                    <td key={`${item.day}-${row.key}`} className="px-4 py-5">
                      {value ? (
                        <span
                          className={`inline-flex min-w-[58px] justify-center rounded-full px-4 py-2 text-[15px] font-bold ${
                            isOpen
                              ? 'bg-primary text-white'
                              : 'bg-[#d5d5d5] text-[#8d8d8d]'
                          }`}
                        >
                          {value}
                        </span>
                      ) : (
                        <span aria-hidden="true" className="inline-block min-h-[34px]" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-1.5 break-keep text-[13px] leading-[1.6] text-ink-muted md:space-y-2 md:text-body md:text-ink-sub md:leading-relaxed">
        <p>※ 토요일 진료는 의료진별 일정에 따라 변경될 수 있습니다.</p>
        <p>※ 진료시간표는 상황에 따라 변경될 수 있으니, 내원 전 병원에 문의해주시길 바랍니다.</p>
      </div>
    </div>
  );
};

const FocusAreaChips = ({ areas }: { areas: string[] }) => (
  <div className="flex flex-wrap gap-2.5">
    {areas.map((area) => (
      <span
        key={area}
        className="inline-flex items-center break-keep rounded-full border border-primary/15 bg-primary-light/70 px-3 py-2 text-[13px] font-extrabold leading-tight text-primary-dark sm:px-3.5 sm:text-[14px] sm:leading-none"
      >
        {area}
      </span>
    ))}
  </div>
);

const splitIntoColumns = (items: string[]) => {
  const splitIndex = Math.ceil(items.length / 2);
  return [items.slice(0, splitIndex), items.slice(splitIndex)].filter((column) => column.length > 0);
};

const CredentialBulletList = ({ items }: { items: string[] }) => (
  <div className="grid grid-cols-1 gap-x-12 gap-y-3 md:grid-cols-2">
    {splitIntoColumns(items).map((column) => (
      <ul key={column.join('|')} className="space-y-3">
        {column.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] font-medium leading-[1.75] text-ink sm:text-[17px] sm:leading-relaxed">
            <span aria-hidden="true" className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ))}
  </div>
);

const PapersList = ({ papers }: { papers: DoctorPaper[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visiblePapers = isExpanded ? papers : papers.slice(0, PAPERS_PREVIEW_LIMIT);
  const hasMorePapers = papers.length > PAPERS_PREVIEW_LIMIT;

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {visiblePapers.map((paper, index) => (
          <div
            key={`${paper.title}-${index}`}
            className="rounded-lg border border-slate-100 bg-white p-4 shadow-[0_18px_45px_-38px_rgba(15,29,54,0.45)] sm:p-5"
          >
            <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-primary/70">
              논문 {String(index + 1).padStart(2, '0')}
            </p>
            <h5 className="mt-3 text-[15px] font-bold leading-[1.7] tracking-tight text-ink [overflow-wrap:anywhere] sm:text-[17px] sm:leading-relaxed">
              {paper.title}
            </h5>
            {paper.authors ? (
              <p className="mt-2 text-[14px] font-semibold leading-relaxed text-ink-sub [overflow-wrap:anywhere] sm:text-[15px]">
                {paper.authors}
              </p>
            ) : null}
            {paper.citation ? (
              <p className="mt-2 text-[14px] font-medium leading-relaxed text-ink-muted [overflow-wrap:anywhere] sm:text-[15px]">
                {paper.citation}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {hasMorePapers ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-primary/20 bg-primary-light px-5 text-[15px] font-bold text-primary-dark transition-all hover:border-primary/35 hover:bg-primary hover:text-white"
        >
          {isExpanded ? '논문 접기' : `논문 전체보기 ${papers.length}편`}
        </button>
      ) : null}
    </div>
  );
};

const CareerList = ({ doctor }: { doctor: DoctorProfile }) => {
  const careers = DOCTOR_CAREERS[doctor.name] ?? doctor.profilePoints;

  return (
    <div className="border-t border-[#d7d7d7] pt-10">
      <h4 className="mb-7 text-2xl font-bold tracking-tight text-ink">학력 및 경력</h4>
      <CredentialBulletList items={careers} />
    </div>
  );
};

const CredentialDetails = ({ doctor }: { doctor: DoctorProfile }) => {
  const credentials = doctor.credentials;
  const availableTabs = CREDENTIAL_TABS.filter((tab) => getCredentialCount(credentials, tab.id) > 0);
  const [activeTab, setActiveTab] = useState<CredentialTabId>(availableTabs[0]?.id ?? 'career');

  if (!credentials || availableTabs.length === 0) {
    return <CareerList doctor={doctor} />;
  }

  const selectedTab = availableTabs.some((tab) => tab.id === activeTab) ? activeTab : availableTabs[0].id;
  const tabPanelId = `${doctor.id}-${selectedTab}-panel`;
  const tabButtonId = `${doctor.id}-${selectedTab}-tab`;

  return (
    <div className="border-t border-[#d7d7d7] pt-10">
      <div className="mb-7">
        <h4 className="text-2xl font-bold tracking-tight text-ink">학력 및 경력</h4>
      </div>

      <div className="-mx-1 overflow-x-auto overscroll-x-contain pb-2">
        <div
          role="tablist"
          aria-label={`${doctor.name} ${doctor.title} 상세 이력`}
          className="grid min-w-[420px] gap-1 rounded-lg bg-slate-50 p-1 sm:min-w-[520px] md:min-w-full"
          style={{ gridTemplateColumns: `repeat(${availableTabs.length}, minmax(0, 1fr))` }}
        >
          {availableTabs.map((tab) => {
            const isSelected = tab.id === selectedTab;

            return (
              <button
                key={tab.id}
                id={`${doctor.id}-${tab.id}-tab`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`${doctor.id}-${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-12 items-center justify-center whitespace-nowrap rounded-lg px-4 text-[15px] font-bold transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-[0_14px_28px_-20px_rgba(40,74,165,0.8)]'
                    : 'text-ink-sub hover:bg-white hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={tabPanelId}
        role="tabpanel"
        aria-labelledby={tabButtonId}
        className="mt-7 rounded-lg border border-slate-100 bg-slate-50/70 p-5 md:p-6"
      >
        {selectedTab === 'papers' ? (
          <PapersList papers={credentials.papers ?? []} />
        ) : (
          <CredentialBulletList items={getCredentialItems(credentials, selectedTab)} />
        )}
      </div>
    </div>
  );
};

const DoctorProfileBlock = ({
  doctor,
  index,
  onOpenDetail,
}: {
  doctor: DoctorProfile;
  index: number;
  onOpenDetail: (doctor: DoctorProfile) => void;
}) => {
  return (
    <ScrollReveal delay={index * 0.08} amount={0.14}>
      <article
        id={doctor.id}
        className="grid scroll-mt-24 grid-cols-1 gap-6 border-b border-slate-100 py-10 last:border-b-0 sm:scroll-mt-28 sm:gap-10 sm:py-16 md:gap-12 md:py-20 lg:grid-cols-[minmax(360px,0.42fr)_minmax(0,1fr)] lg:gap-16"
      >
        <div className="lg:pt-32 xl:pt-36">
          <div className="relative mx-auto max-w-[360px] overflow-hidden rounded-2xl bg-[#d5dbe8] sm:rounded-[28px] lg:max-w-none">
            {/* 모바일은 정사각에 가깝게, 태블릿 이상은 기존 3:4 비율 */}
            <div className="relative aspect-square sm:aspect-[3/4]">
              <Image
                src={doctor.image}
                alt={doctor.imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className={`object-cover object-top ${doctor.name === '최호' || doctor.name === '김범준' ? '-scale-x-110 scale-y-110' : 'scale-110'}`}
                priority={index === 0}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-10 lg:pt-5">
          <div className="space-y-3 sm:space-y-5">
            <p className="break-keep text-[15px] font-bold leading-[1.55] tracking-tight text-primary sm:text-lg md:text-xl">
              {doctor.center} · {doctor.specialty}
            </p>
            <h3 className="break-keep text-h2 tracking-tight text-ink">
              {doctor.name} {doctor.title}
            </h3>
            <p className="max-w-3xl break-keep text-body text-ink-sub sm:text-[17px] sm:leading-relaxed">
              {doctor.summary}
            </p>

            {/* 모바일: 상세 정보는 팝업으로 / 태블릿 이상: 기존처럼 펼쳐서 노출 */}
            <button
              type="button"
              onClick={() => onOpenDetail(doctor)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-primary-dark sm:hidden"
            >
              더보기
              <Plus size={16} strokeWidth={3} />
            </button>

            <div className="hidden sm:block">
              <FocusAreaChips areas={doctor.focusAreas} />
            </div>
          </div>

          <ScheduleTable doctor={doctor} />

          <div className="hidden sm:block">
            <CredentialDetails doctor={doctor} />
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
};

// 모바일 전용 의료진 상세 팝업
const DoctorDetailModal = ({
  doctor,
  onClose,
}: {
  doctor: DoctorProfile;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/60 p-4 sm:hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${doctor.name} ${doctor.title} 상세 정보`}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex shrink-0 items-center justify-between bg-primary px-5 py-4">
          <p className="text-[19px] font-black tracking-tight text-white">
            {doctor.name} <span className="text-[16px] font-bold">{doctor.title}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-white transition-opacity hover:opacity-70"
          >
            <X size={24} />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative aspect-square bg-[#d5dbe8]">
            <Image
              src={doctor.image}
              alt={doctor.imageAlt}
              fill
              sizes="440px"
              className={`object-cover object-top ${doctor.name === '최호' || doctor.name === '김범준' ? '-scale-x-110 scale-y-110' : 'scale-110'}`}
            />
          </div>

          <div className="space-y-7 px-5 pb-6 pt-8">
            <div className="space-y-3">
              <p className="break-keep text-[22px] font-black tracking-tight text-ink">
                {doctor.name} {doctor.title}{' '}
                <span className="text-[15px] font-bold text-primary">{doctor.specialty}</span>
              </p>
              <p className="break-keep text-body text-ink-sub">{doctor.summary}</p>
            </div>

            <ScheduleTable doctor={doctor} />

            <div className="space-y-2.5">
              <h4 className="text-[18px] font-bold tracking-tight text-ink">진료분야</h4>
              <p className="break-keep text-body leading-[1.75] text-ink-sub">
                {doctor.focusAreas.join(', ')}
              </p>
            </div>

            <CredentialDetails doctor={doctor} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorsDirectory = ({ doctors }: DoctorsDirectoryProps) => {
  const [detailDoctor, setDetailDoctor] = useState<DoctorProfile | null>(null);

  const orderedDoctors = [...doctors].sort((a, b) => (
    DOCTOR_ORDER.indexOf(a.name) - DOCTOR_ORDER.indexOf(b.name)
  ));

  return (
    <section id="doctor-schedule" className="scroll-mt-24 bg-white px-4 pb-4 pt-2 sm:scroll-mt-28 sm:px-6 sm:pb-8 sm:pt-4 md:pb-20 md:pt-8">
      <div className="mx-auto max-w-7xl">
        {orderedDoctors.map((doctor, index) => (
          <DoctorProfileBlock
            key={doctor.id}
            doctor={doctor}
            index={index}
            onOpenDetail={setDetailDoctor}
          />
        ))}
      </div>

      {detailDoctor && (
        <DoctorDetailModal doctor={detailDoctor} onClose={() => setDetailDoctor(null)} />
      )}
    </section>
  );
};

export default DoctorsDirectory;

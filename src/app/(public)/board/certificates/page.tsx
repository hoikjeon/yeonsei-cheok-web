import type { Metadata } from 'next';
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  ClipboardPlus,
  Clock3,
  Download,
  FileCheck2,
  FilePenLine,
  FileText,
  Files,
  FolderOpen,
  Info,
  Pill,
  Phone,
  ReceiptText,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
import SubHero from '@/components/SubHero';

export const metadata: Metadata = {
  title: '증명서 발급 안내 | 연세척병원',
  description:
    '연세척병원 제증명·진료기록 사본 발급 절차, 신청자별 구비서류, 양식 다운로드 정보를 확인하세요.',
};

type DownloadForm = {
  icon: LucideIcon;
  title: string;
  description: string;
  formats: string;
  href: string | null;
};

// 파일이 확정되면 public/documents/certificates에 추가한 뒤 href만 입력하면 됩니다.
const DOWNLOAD_FORMS: DownloadForm[] = [
  {
    icon: FileText,
    title: '진료기록 열람 및 사본발급 동의서',
    description: '환자의 친족 또는 대리인이 발급을 신청할 때 필요합니다.',
    formats: 'PDF · HWP 예정',
    href: null,
  },
  {
    icon: FilePenLine,
    title: '진료기록 열람 및 사본발급 위임장',
    description: '환자가 발급 업무를 대리인에게 위임할 때 작성해 주세요.',
    formats: 'PDF · HWP 예정',
    href: null,
  },
  {
    icon: Pill,
    title: '처방전 대리수령 신청서',
    description: '환자를 대신해 처방전을 수령해야 하는 경우 사용하는 양식입니다.',
    formats: 'HWP 예정',
    href: null,
  },
];

const COPY_PROCESS = [
  { icon: ClipboardPlus, title: '진료과 접수', description: '해당 진료과에 발급 신청' },
  { icon: FilePenLine, title: '신청서 작성', description: '열람·복사 신청서 작성' },
  { icon: Stethoscope, title: '주치의 확인', description: '주치의 면담 및 필요 서명' },
  { icon: Files, title: '사본발급 신청', description: '기록실에 사본 발급 신청' },
  { icon: ReceiptText, title: '복사비 수납', description: '원무과에서 발급 비용 수납' },
  { icon: ClipboardCheck, title: '사본 수령', description: '발급된 진료기록 확인·수령' },
];

const CERTIFICATE_PROCESSES = [
  {
    label: '외래로 신청하는 경우',
    description: '진료 당일 진료과에 신청해 주세요.',
    steps: [
      { title: '신청', description: '진료과 신청서 작성' },
      { title: '발급', description: '주치의 확인 및 발급' },
      { title: '수납 및 수령', description: '원무과 수납 후 수령' },
    ],
  },
  {
    label: '입원 중 신청하는 경우',
    description: '퇴원 당일은 발급이 어려울 수 있으므로 미리 신청해 주세요.',
    steps: [
      { title: '신청', description: '퇴원일 최소 2~3일 전 신청' },
      { title: '발급', description: '주치의 확인 및 발급' },
      { title: '수납 및 수령', description: '퇴원 시 원무과 수납 후 수령' },
    ],
  },
];

type RequirementValue = boolean | string;
type RequirementRow = {
  applicant: string;
  age: string;
  applicantId: RequirementValue;
  patientId: RequirementValue;
  relationship: RequirementValue;
  consent: RequirementValue;
  authorization: RequirementValue;
};

const REQUIREMENT_COLUMNS: { key: keyof Omit<RequirementRow, 'applicant' | 'age'>; label: string }[] = [
  { key: 'applicantId', label: '신청자 신분증' },
  { key: 'patientId', label: '환자 신분증' },
  { key: 'relationship', label: '가족관계 증명' },
  { key: 'consent', label: '환자 자필 동의서' },
  { key: 'authorization', label: '환자 자필 위임장' },
];

const REQUIREMENT_ROWS: RequirementRow[] = [
  {
    applicant: '환자 본인',
    age: '14세 미만',
    applicantId: true,
    patientId: false,
    relationship: true,
    consent: false,
    authorization: false,
  },
  {
    applicant: '환자 본인',
    age: '14세~17세 미만',
    applicantId: false,
    patientId: true,
    relationship: false,
    consent: false,
    authorization: false,
  },
  {
    applicant: '환자 본인',
    age: '17세 이상',
    applicantId: false,
    patientId: true,
    relationship: false,
    consent: false,
    authorization: false,
  },
  {
    applicant: '환자의 친족',
    age: '14세 미만',
    applicantId: true,
    patientId: false,
    relationship: true,
    consent: false,
    authorization: false,
  },
  {
    applicant: '환자의 친족',
    age: '14세~17세 미만',
    applicantId: true,
    patientId: true,
    relationship: true,
    consent: true,
    authorization: false,
  },
  {
    applicant: '환자의 친족',
    age: '17세 이상',
    applicantId: true,
    patientId: true,
    relationship: true,
    consent: true,
    authorization: false,
  },
  {
    applicant: '환자 대리인',
    age: '14세 미만',
    applicantId: true,
    patientId: '친권자 신분증 사본',
    relationship: true,
    consent: '친권자 동의서',
    authorization: '친권자 위임장',
  },
  {
    applicant: '환자 대리인',
    age: '14세~17세 미만',
    applicantId: true,
    patientId: true,
    relationship: false,
    consent: true,
    authorization: true,
  },
  {
    applicant: '환자 대리인',
    age: '17세 이상',
    applicantId: true,
    patientId: true,
    relationship: false,
    consent: true,
    authorization: true,
  },
];

const CONSENT_EXCEPTIONS = [
  {
    title: '환자가 사망한 경우',
    documents: ['신청인 신분증', '친족관계를 확인할 수 있는 서류', '제적등본·사망진단서 등 사망사실 확인 서류'],
  },
  {
    title: '의식불명 또는 중증 질환·부상으로 자필서명할 수 없는 경우',
    documents: ['신청인 신분증', '친족관계를 확인할 수 있는 서류', '자필서명이 불가능함을 확인할 수 있는 진단서'],
  },
  {
    title: '환자가 행방불명인 경우',
    documents: ['신청인 신분증', '친족관계를 확인할 수 있는 서류', '주민등록등본·법원의 실종선고 결정문 등 행방불명 확인 서류'],
  },
  {
    title: '환자가 의사무능력자인 경우',
    documents: ['신청인 신분증', '친족관계를 확인할 수 있는 서류', '법원의 금치산 선고 결정문 사본 또는 정신건강의학과 전문의 진단서'],
  },
];

type CertificateFeature = 'disease' | 'code' | 'surgery' | 'admission' | 'outpatient' | 'weeks' | 'opinion';

const CERTIFICATE_COLUMNS: { key: CertificateFeature; label: string }[] = [
  { key: 'disease', label: '병명' },
  { key: 'code', label: '질병코드' },
  { key: 'surgery', label: '수술기록' },
  { key: 'admission', label: '입원기간' },
  { key: 'outpatient', label: '통원기간' },
  { key: 'weeks', label: '진단주수' },
  { key: 'opinion', label: '소견내용' },
];

const CERTIFICATE_TYPES: { name: string; features: CertificateFeature[]; note?: string }[] = [
  { name: '진단서', features: ['disease', 'code', 'surgery', 'admission', 'weeks'] },
  { name: '소견서', features: ['disease', 'code', 'surgery', 'opinion'] },
  { name: '입원확인서', features: ['disease', 'code', 'surgery', 'admission'] },
  { name: '치료확인서', features: ['disease', 'code', 'outpatient'], note: '외래 통원치료' },
  { name: '상해진단서', features: ['disease', 'code', 'surgery', 'weeks'], note: '일반 환자' },
  { name: '진료의뢰서', features: ['disease', 'code', 'surgery', 'admission', 'opinion'], note: '타병원 전원 시' },
  { name: '의료급여 의뢰서', features: ['disease', 'code', 'surgery', 'admission', 'opinion'], note: '타병원 전원 시(보호 1·2종)' },
];

function SectionHeading({ id, title, description }: { id: string; title: string; description?: string }) {
  return (
    <div className="mb-8 space-y-3 sm:mb-10">
      <h2 id={id} className="break-keep text-h2 tracking-tight text-ink">{title}</h2>
      {description ? (
        <p className="max-w-3xl break-keep text-body-lg text-ink-sub">{description}</p>
      ) : null}
    </div>
  );
}

function RequirementMark({ value }: { value: RequirementValue }) {
  if (!value) return <span className="text-slate-300">—</span>;

  if (typeof value === 'string') {
    return <span className="break-keep text-[13px] font-semibold leading-relaxed text-ink-sub">{value}</span>;
  }

  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-primary" aria-label="필요">
      <Check size={16} strokeWidth={3} aria-hidden="true" />
    </span>
  );
}

export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-white">
      <SubHero
        title="증명서 발급 안내"
        subtitle={'발급 절차와 구비서류를 미리 확인해 주세요.\n환자의 소중한 진료정보를 안전하게 보호합니다.'}
        path={[{ name: '커뮤니티' }, { name: '증명서 발급' }]}
      />

      <section className="py-14 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-7 lg:space-y-28 xl:px-10">
          <section aria-labelledby="certificate-overview-title">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-navy-950 px-6 py-8 text-white shadow-premium sm:rounded-[2rem] sm:px-10 sm:py-11 lg:px-14">
              <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-primary/35 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-3xl">
                  <h2 id="certificate-overview-title" className="break-keep text-h3 tracking-tight">
                    진료정보 보호를 위해 본인 확인이 필요합니다.
                  </h2>
                  <p className="mt-4 break-keep text-body-lg leading-relaxed text-slate-300">
                    제증명 및 진단서는 원칙적으로 환자 본인이 신분증을 지참하고 내원해야 합니다. 가족·친인척·대리인이 신청하는 경우에는 동의서와 위임장 등 추가 서류가 필요합니다.
                  </p>
                </div>
                <a
                  href="tel:0519351004"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-6 text-[15px] font-bold text-navy-950 transition hover:-translate-y-0.5 hover:bg-primary-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                >
                  <Phone size={19} aria-hidden="true" />
                  발급 문의 051-935-1004
                </a>
              </div>
            </div>
          </section>

          <section aria-labelledby="certificate-download-title">
            <SectionHeading
              id="certificate-download-title"
              title="필요한 양식을 미리 준비해 주세요."
              description="파일은 추후 등록되면 각 카드에서 바로 다운로드할 수 있습니다."
            />
            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {DOWNLOAD_FORMS.map((form) => {
                const FormIcon = form.icon;

                return (
                  <article key={form.title} className="relative flex min-h-[280px] flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-38px_rgba(15,29,54,0.4)] sm:p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                      <FormIcon size={24} strokeWidth={1.7} aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 break-keep text-h4 tracking-tight text-ink">{form.title}</h3>
                    <p className="mt-3 flex-1 break-keep text-body text-ink-muted">{form.description}</p>
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                      <span className="text-caption font-bold text-primary">{form.formats}</span>
                      {form.href ? (
                        <a
                          href={form.href}
                          download
                          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-[14px] font-bold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                        >
                          <Download size={16} aria-hidden="true" />
                          다운로드
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-full bg-slate-100 px-4 text-[14px] font-bold text-ink-muted"
                        >
                          <Clock3 size={16} aria-hidden="true" />
                          파일 준비 중
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="copy-process-title">
            <SectionHeading
              id="copy-process-title"
              title="진료기록 사본 발급 절차"
              description="접수부터 수령까지 순서대로 안내해 드립니다."
            />
            <ol className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6 xl:gap-4">
              {COPY_PROCESS.map((step, index) => {
                const StepIcon = step.icon;

                return (
                  <li key={step.title} className="group relative flex min-h-[112px] rounded-xl border border-slate-200 bg-slate-50 p-4 sm:min-h-[210px] sm:rounded-2xl sm:p-6">
                    <StepIcon size={72} strokeWidth={1.2} className="pointer-events-none absolute right-3 top-3 hidden text-primary/[0.12] transition-transform duration-300 group-hover:-translate-y-1 sm:block" aria-hidden="true" />
                    <div className="relative my-auto w-full sm:my-0 sm:pt-20">
                      <div className="flex items-center gap-2 sm:block">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary font-montserrat text-[10px] font-bold text-white sm:hidden"
                          aria-label={`${index + 1}단계`}
                        >
                          {index + 1}
                        </span>
                        <h3 className="break-keep text-[15px] font-bold tracking-tight text-ink sm:text-[18px]">{step.title}</h3>
                      </div>
                      <p className="mt-1.5 break-keep pl-7 text-[12px] leading-relaxed text-ink-muted sm:mt-2 sm:pl-0 sm:text-caption xl:whitespace-nowrap xl:text-[12px]">{step.description}</p>
                    </div>
                    {index < COPY_PROCESS.length - 1 ? (
                      <ArrowRight size={16} className="absolute -right-[22px] top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1.5 text-primary shadow-sm xl:block" aria-hidden="true" />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="certificate-process-title">
            <SectionHeading
              id="certificate-process-title"
              title="제증명 발급 절차"
              description="외래 신청과 입원 중 신청 절차가 다르므로 방문 상황에 맞게 확인해 주세요."
            />
            <div className="grid gap-5 lg:grid-cols-2">
              {CERTIFICATE_PROCESSES.map((process, processIndex) => (
                <article
                  key={process.label}
                  className={`rounded-2xl border p-5 shadow-[0_24px_60px_-46px_rgba(15,29,54,0.5)] sm:rounded-[1.5rem] sm:p-8 ${
                    processIndex === 0
                      ? 'border-primary/20 bg-gradient-to-br from-primary-light via-white to-blue-100/70'
                      : 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-teal-100/70'
                  }`}
                >
                  <div>
                    <h3 className={`text-h4 tracking-tight ${processIndex === 0 ? 'text-primary-dark' : 'text-emerald-800'}`}>{process.label}</h3>
                    <p className="mt-1.5 break-keep text-[14px] leading-relaxed text-ink-muted sm:mt-2 sm:text-body">{process.description}</p>
                  </div>
                  <ol className="mt-5 divide-y divide-slate-200 border-t border-slate-200 sm:mt-7 sm:grid sm:grid-cols-3 sm:gap-3 sm:divide-y-0 sm:border-t-0">
                    {process.steps.map((step) => (
                      <li key={step.title} className="py-4 sm:rounded-2xl sm:bg-slate-50 sm:p-4 sm:ring-1 sm:ring-slate-200/70">
                        <h4 className="text-[16px] font-bold text-ink">{step.title}</h4>
                        <p className="mt-1.5 break-keep text-caption text-ink-muted">{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="requirements-title">
            <SectionHeading
              id="requirements-title"
              title="신청자별 구비서류"
              description="14세 미만 환자는 법정대리인이 신청합니다. 14세~17세 미만은 학생증 등 본인을 확인할 수 있는 신분증명서를, 17세 이상은 주민등록증 등 공공기관이 발급한 신분증을 준비해 주세요."
            />

            <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200 lg:block">
              <table className="w-full table-fixed border-collapse text-center text-[14px]">
                <caption className="sr-only">신청자 및 연령에 따른 증명서 발급 구비서류</caption>
                <thead className="bg-navy-950 text-white">
                  <tr>
                    <th scope="col" className="w-[13%] px-3 py-5 font-bold">구분</th>
                    <th scope="col" className="w-[14%] px-3 py-5 font-bold">연령</th>
                    {REQUIREMENT_COLUMNS.map((column) => (
                      <th key={column.key} scope="col" className="px-2 py-5 font-bold">{column.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {REQUIREMENT_ROWS.map((row, index) => (
                    <tr key={`${row.applicant}-${row.age}`} className={index % 2 === 1 ? 'bg-slate-50/70' : ''}>
                      <th scope="row" className="border-r border-slate-200 px-3 py-5 text-left font-bold text-ink">{row.applicant}</th>
                      <td className="border-r border-slate-200 px-3 py-5 font-semibold text-ink-sub">{row.age}</td>
                      {REQUIREMENT_COLUMNS.map((column) => (
                        <td key={column.key} className="border-r border-slate-100 px-2 py-5 last:border-r-0">
                          <RequirementMark value={row[column.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {REQUIREMENT_ROWS.map((row) => {
                const requiredDocuments = REQUIREMENT_COLUMNS.filter((column) => row[column.key]).map((column) => ({
                  label: column.label,
                  value: row[column.key],
                }));

                return (
                  <article key={`${row.applicant}-${row.age}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-38px_rgba(15,29,54,0.45)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[17px] font-bold text-ink">{row.applicant}</h3>
                      <span className="rounded-full bg-primary-light px-3 py-1 text-[12px] font-bold text-primary">{row.age}</span>
                    </div>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {requiredDocuments.map((document) => (
                        <li key={document.label} className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-3 text-[14px] text-ink-sub">
                          <Check size={16} className="mt-0.5 shrink-0 text-primary" strokeWidth={3} aria-hidden="true" />
                          <span>
                            {typeof document.value === 'string' ? document.value : document.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-[14px] leading-relaxed text-amber-900 ring-1 ring-amber-200/70 sm:p-5">
              <Info size={19} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
              <p className="break-keep">신청자의 관계와 환자 상태에 따라 추가 서류가 필요할 수 있습니다. 방문 전 원무과에 문의하시면 더욱 정확하게 안내받을 수 있습니다.</p>
            </div>
          </section>

          <section aria-labelledby="consent-exceptions-title">
            <SectionHeading
              id="consent-exceptions-title"
              title="환자의 동의를 받을 수 없는 경우"
              description="아래 상황에서는 환자 동의서 대신 사실을 입증할 수 있는 추가 서류가 필요합니다."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {CONSENT_EXCEPTIONS.map((exception) => (
                <article key={exception.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:rounded-[1.5rem] sm:p-7">
                  <h3 className="break-keep text-h4 tracking-tight text-ink">{exception.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {exception.documents.map((document) => (
                      <li key={document} className="flex items-start gap-2 text-body text-ink-sub">
                        <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        <span className="break-keep">{document}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="certificate-types-title">
            <SectionHeading
              id="certificate-types-title"
              title="제증명 종류 안내"
              description="용도에 따라 기재되는 내용이 다르므로 제출처에 필요한 증명서 종류를 먼저 확인해 주세요."
            />

            <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200 xl:block">
              <table className="w-full table-fixed border-collapse text-center text-[14px]">
                <caption className="sr-only">제증명 종류별 포함 내용</caption>
                <thead className="bg-navy-950 text-white">
                  <tr>
                    <th scope="col" className="w-[16%] px-3 py-5 font-bold">증명서 종류</th>
                    {CERTIFICATE_COLUMNS.map((column) => (
                      <th key={column.key} scope="col" className="px-2 py-5 font-bold">{column.label}</th>
                    ))}
                    <th scope="col" className="w-[16%] px-3 py-5 font-bold">비고</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {CERTIFICATE_TYPES.map((certificate, index) => (
                    <tr key={certificate.name} className={index % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
                      <th scope="row" className="border-r border-slate-200 px-3 py-5 text-left font-bold text-ink">{certificate.name}</th>
                      {CERTIFICATE_COLUMNS.map((column) => (
                        <td key={column.key} className="border-r border-slate-100 px-2 py-5">
                          {certificate.features.includes(column.key) ? (
                            <Check size={17} className="mx-auto text-primary" strokeWidth={3} aria-label="포함" />
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      ))}
                      <td className="break-keep px-3 py-5 text-ink-muted">{certificate.note ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:hidden">
              {CERTIFICATE_TYPES.map((certificate) => (
                <article key={certificate.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-38px_rgba(15,29,54,0.45)]">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[17px] font-bold text-ink">{certificate.name}</h3>
                    <FileCheck2 size={21} className="shrink-0 text-primary" aria-hidden="true" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {certificate.features.map((feature) => (
                      <span key={feature} className="rounded-full bg-primary-light px-3 py-1.5 text-[12px] font-bold text-primary">
                        {CERTIFICATE_COLUMNS.find((column) => column.key === feature)?.label}
                      </span>
                    ))}
                  </div>
                  {certificate.note ? <p className="mt-4 break-keep text-caption text-ink-muted">비고: {certificate.note}</p> : null}
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/70">
                <FileText size={22} className="text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-[16px] font-bold text-ink">제증명 사본</h3>
                <p className="mt-2 break-keep text-caption text-ink-muted">추가 발급 시 장당 수수료가 적용됩니다.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/70">
                <FolderOpen size={22} className="text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-[16px] font-bold text-ink">진료기록 사본 1~5매</h3>
                <p className="mt-2 break-keep text-caption text-ink-muted">초진·경과·수술 기록지, 검사 결과지 등에 적용됩니다.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/70">
                <FileText size={22} className="text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-[16px] font-bold text-ink">진료기록 사본 5매 초과</h3>
                <p className="mt-2 break-keep text-caption text-ink-muted">초과 매수에 따라 추가 수수료가 적용될 수 있습니다.</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="certificate-contact-title">
            <div className="overflow-hidden rounded-[1.5rem] bg-[linear-gradient(120deg,#E9EEFF_0%,#F8FAFC_58%,#FFF5E5_100%)] p-6 ring-1 ring-primary/10 sm:rounded-[2rem] sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div>
                <h2 id="certificate-contact-title" className="break-keep text-h3 tracking-tight text-ink">방문 전 한 번 더 확인해 주세요.</h2>
                <p className="mt-3 max-w-2xl break-keep text-body-lg text-ink-sub">발급 목적과 신청자 관계에 따라 필요한 서류가 달라질 수 있습니다.</p>
              </div>
              <a
                href="tel:0519351004"
                className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-primary px-6 text-[15px] font-bold text-white shadow-blue-glow transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 lg:mt-0 lg:w-auto"
              >
                <Phone size={19} aria-hidden="true" />
                원무과 문의하기
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

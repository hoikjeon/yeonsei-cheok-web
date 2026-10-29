import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Clock, MapPin, Phone } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { createPageMetadata } from '@/lib/seo';
import { buildProcedurePageStructuredData } from '@/lib/structuredData';

// "부산 척추수술" 검색에 답하는 진료안내 페이지입니다.
// 한 페이지에 한 주제만 둡니다: 부산 어디서, 누구에게, 어떤 과정으로 척추수술을 받는지.
// 수술 방법 자체의 설명은 양방향 척추내시경(UBE) 페이지가 맡고, 여기서는 그 페이지로 연결합니다.
// 사진은 원장님·건물·검사실 모두 실사진만 씁니다. 설명용 3D 이미지는 수술 방법 한 곳뿐입니다.
// 첫 화면 오른쪽 이미지는 아직 정해지지 않아 비워 두었습니다.

const PAGE = {
  name: '부산 척추수술 | 양방향 척추내시경(UBE) · 연세척병원',
  description:
    '부산진구 부암역 연세척병원. 신경외과 전문의가 허리디스크·척추관협착증·목디스크 척추수술을 양방향 척추내시경(UBE)으로 진료합니다.',
  path: '/treatments',
  image: '/ch-hospital.jpg',
};

export const metadata = createPageMetadata({
  title: PAGE.name,
  description: PAGE.description,
  path: PAGE.path,
  image: PAGE.image,
});

const surgeryCriteria = [
  '다리나 팔의 힘이 점점 빠지는 등 마비가 진행할 때',
  '소변·대변 조절이 어려워졌을 때',
  '약물·주사·물리치료를 충분히 받았는데도 통증으로 걷기나 일상생활이 어려울 때',
];

const ubeFacts = [
  '1cm 이하의 작은 절개 두 곳으로 내시경과 수술 기구를 각각 넣습니다.',
  '허리디스크, 척추관협착증, 목디스크에 적용을 검토합니다.',
  '입원은 상태에 따라 다르지만 보통 2~3일입니다.',
];

// 의료진 소개(src/app/(public)/doctors/page.tsx)와 UBE 페이지 FAQ에 공개된 내용과 같아야 합니다.
const surgeons = [
  {
    id: 'lee-nam',
    name: '이남',
    image: '/이남 병원장.jpg',
    points: [
      '연세대학교 세브란스병원 신경외과 외래부교수',
      '양방향 척추내시경(UBE) 연구회 학술이사',
      '부산-울산-경남 척추내시경 연구회 학술이사',
    ],
  },
  {
    id: 'kim-dong-han',
    name: '김동한',
    image: '/김동한병원장.jpg',
    points: [
      '경북대학교병원 신경외과 외래교수',
      '대한최소침습척추학회 총무위원',
      '부산-울산-경남 척추내시경 연구회 학술간사',
    ],
  },
];

const steps = [
  { title: '진찰', text: '증상과 그동안의 치료 과정을 듣고 신경 상태를 확인합니다.' },
  { title: 'MRI 검사', text: '원내 MRI로 신경을 누르는 위치와 정도를 확인합니다.' },
  { title: '수술', text: '비수술 치료로 어려운 경우 양방향 척추내시경 수술을 진행합니다.' },
  { title: '재활', text: '회복 단계에 맞춰 도수·재활 치료와 생활 관리를 안내합니다.' },
];

// 화면과 구조화 데이터(FAQPage)가 이 목록을 함께 씁니다. 문구는 이곳에서만 고칩니다.
const faqs = [
  {
    question: '척추 진료를 받으면 바로 수술해야 하나요?',
    answer:
      '아닙니다. 허리디스크와 척추관협착증은 대부분 약물·주사·물리치료 같은 비수술 치료부터 시작합니다. 마비가 진행하거나 대소변 조절이 어렵거나, 비수술 치료 후에도 일상생활이 어려울 때 수술을 검토합니다.',
  },
  {
    question: '연세척병원 척추수술은 어떤 의료진이 하나요?',
    answer:
      '척추내시경센터의 신경외과 전문의 이남 병원장과 김동한 병원장이 양방향 척추내시경(UBE) 수술을 집도합니다. 두 병원장 모두 Springer에서 출판된 양방향 척추내시경 교과서(2022년 1판, 2025년 2판) 집필에 참여했습니다.',
  },
  {
    question: '척추수술 후 입원은 며칠 하나요?',
    answer:
      '환자의 상태와 수술 범위에 따라 다르지만, 양방향 척추내시경 수술은 보통 2~3일 입원합니다. 정확한 입원 기간은 진찰과 검사 후 안내해 드립니다.',
  },
  {
    question: '처음 방문할 때 무엇을 준비하면 좋을까요?',
    answer:
      '다른 병원에서 촬영한 MRI·CT 영상 자료와 판독지, 복용 중인 약 정보를 가져오시면 진료에 도움이 됩니다. 예약과 준비 사항은 대표전화 051-935-1004로 확인해 주세요.',
  },
  {
    question: '병원 위치와 진료시간은 어떻게 되나요?',
    answer:
      '부산광역시 부산진구 가야대로 715 위너스빌딩 1~4층, 부산 지하철 2호선 부암역 6번 출구 앞에 있습니다. 평일 09:00~17:30, 토요일 09:00~13:00 진료하며 일요일·공휴일은 휴진합니다.',
  },
];

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-bold text-white shadow-blue-glow transition-all hover:bg-primary-dark"
    >
      {children}
      <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
    </Link>
  );
}

export default function TreatmentsPage() {
  return (
    <div className="flex flex-col">
      <JsonLd
        data={buildProcedurePageStructuredData({
          page: PAGE,
          procedure: {
            name: '척추수술',
            alternateName: ['부산 척추수술', '척추 수술', '허리 수술', '목 수술', '척추내시경 수술'],
            bodyLocation: '척추',
            specialty: 'https://schema.org/Neurologic',
            howPerformed: ubeFacts[0],
            indications: surgeryCriteria,
          },
          breadcrumb: [
            { name: '홈', path: '/' },
            { name: '진료안내', path: PAGE.path },
          ],
          faq: faqs,
        })}
      />

      {/* 1. 첫 화면 */}
      <section className="px-3 pt-2 sm:px-8 sm:pt-3 lg:px-14 xl:px-20">
        <div className="overflow-hidden rounded-[1.35rem] bg-[linear-gradient(100deg,#e8edf8_0%,#eef1f7_46%,#f7f0e3_100%)] ring-1 ring-navy-900/5 sm:rounded-[2.25rem]">
          <div className="mx-auto grid max-w-7xl items-end gap-8 px-5 pt-10 sm:px-9 md:grid-cols-[1.1fr_1fr] md:px-12 md:pt-14">
            <div className="space-y-6 pb-4 md:pb-16">
              <nav aria-label="현재 위치" className="flex gap-2 text-[13px] font-semibold text-slate-500">
                <Link href="/" className="hover:text-primary">홈</Link>
                <span aria-hidden>/</span>
                <span className="text-slate-600">진료안내</span>
              </nav>
              <h1 className="break-keep text-display tracking-tight text-navy-900">
                부산 척추수술,
                <br />
                연세척병원
              </h1>
              <p className="max-w-xl break-keep text-body-lg leading-[1.7] text-ink-sub">
                신경외과 전문의 두 병원장이 허리디스크·척추관협착증·목디스크를
                양방향 척추내시경(UBE)으로 수술합니다. 부산 지하철 2호선 부암역 6번 출구 앞.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <PrimaryLink href="/reservation">진료 예약하기</PrimaryLink>
                <a
                  href="tel:0519351004"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-bold text-ink transition-colors hover:border-primary/40"
                >
                  <Phone size={18} strokeWidth={2.2} aria-hidden />
                  051-935-1004
                </a>
              </div>
            </div>
            {/* 첫 화면 이미지 자리. 넣을 이미지가 정해질 때까지 높이만 잡아 둡니다. */}
            <div aria-hidden className="hidden aspect-[4/3] md:block" />
          </div>
        </div>
      </section>

      {/* 2. 수술이 필요한 경우 */}
      <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-6 md:py-24">
        <h2 className="break-keep text-h2 tracking-tight text-ink">척추수술, 언제 필요할까요?</h2>
        <p className="mt-5 max-w-3xl break-keep text-lg font-medium leading-[1.8] text-ink-sub">
          허리디스크와 척추관협착증은 대부분 수술 없이 좋아집니다. 연세척병원은 비수술 치료부터
          시작하고, 아래와 같은 경우에 수술을 검토합니다.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {surgeryCriteria.map((text) => (
            <li key={text} className="flex gap-3 rounded-2xl bg-slate-50 p-6 md:p-7">
              <Check size={22} strokeWidth={2.6} aria-hidden className="mt-0.5 shrink-0 text-primary" />
              <span className="break-keep text-[17px] font-semibold leading-relaxed text-ink">{text}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/treatments/spine/non-surgical"
          className="mt-8 inline-flex items-center gap-1.5 text-base font-bold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          비수술 치료 먼저 알아보기
          <ArrowRight size={17} strokeWidth={2.4} aria-hidden />
        </Link>
      </section>

      {/* 3. 수술 방법 */}
      <section className="bg-navy-900 px-5 py-16 text-white sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white">
            <Image
              src="/generated/ube/ube-comparison-bi-v2.webp"
              alt="두 개의 작은 통로로 내시경과 수술 기구를 넣는 양방향 척추내시경 설명 일러스트"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="text-[15px] font-bold text-sky-300">수술 방법</p>
            <h2 className="break-keep text-h2 tracking-tight">양방향 척추내시경(UBE)</h2>
            <ul className="space-y-4">
              {ubeFacts.map((fact) => (
                <li key={fact} className="flex gap-3 break-keep text-[17px] font-medium leading-relaxed text-slate-200">
                  <Check size={20} strokeWidth={2.6} aria-hidden className="mt-1 shrink-0 text-sky-300" />
                  {fact}
                </li>
              ))}
            </ul>
            <Link
              href="/treatments/spine/ube"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-bold text-navy-900 transition-colors hover:bg-slate-100"
            >
              양방향 척추내시경 자세히 보기
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. 집도 의료진 */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 md:py-24">
        <h2 className="break-keep text-h2 tracking-tight text-ink">수술하는 의료진</h2>
        <p className="mt-5 max-w-3xl break-keep text-lg font-medium leading-[1.8] text-ink-sub">
          두 병원장 모두 Springer에서 출판된 양방향 척추내시경 교과서(2022년 1판, 2025년 2판) 집필에
          참여했습니다.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {surgeons.map((surgeon) => (
            <Link
              key={surgeon.id}
              href={`/doctors#${surgeon.id}`}
              className="group flex gap-5 rounded-2xl border border-slate-200 p-5 transition-all hover:border-primary/30 hover:shadow-premium md:p-6"
            >
              <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-[#e4e6e9] sm:h-36 sm:w-28">
                <Image
                  src={surgeon.image}
                  alt={`${surgeon.name} 병원장 프로필 사진`}
                  fill
                  sizes="112px"
                  className="object-cover object-top"
                />
              </div>
              <div className="min-w-0 space-y-2">
                <h3 className="text-h4 text-ink transition-colors group-hover:text-primary">{surgeon.name} 병원장</h3>
                <p className="text-[15px] font-bold text-primary">신경외과 전문의 · 척추내시경센터</p>
                <ul className="space-y-1">
                  {surgeon.points.map((point) => (
                    <li key={point} className="break-keep text-[15px] font-medium leading-relaxed text-ink-sub">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
        <figure className="mt-5 overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/7]">
            <Image
              src="/images/special/ube-special-doctor-teacher.jpg"
              alt="모니터를 확인하며 양방향 척추내시경 술기 교육을 진행하는 의료진"
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
          <figcaption className="bg-slate-50 px-5 py-4 break-keep text-[15px] font-semibold text-ink-sub">
            국내외 의료진에게 양방향 척추내시경 술기를 교육하고 있습니다.
          </figcaption>
        </figure>
      </section>

      {/* 5. 진료부터 회복까지 */}
      <section className="bg-slate-50 px-5 py-16 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="break-keep text-h2 tracking-tight text-ink">진료부터 회복까지</h2>
            <ol className="mt-8 space-y-3">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4 rounded-2xl bg-white p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                    <p className="mt-1 break-keep text-[15px] font-medium leading-relaxed text-ink-sub">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <figure className="overflow-hidden rounded-2xl">
            <div className="relative aspect-[3/2]">
              <Image
                src="/images/daily-care/ys-daily-care-diagnosis.jpg"
                alt="연세척병원 MRI실에서 검사 영상을 확인하는 모습"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
            <figcaption className="bg-white px-5 py-4 text-[15px] font-semibold text-ink-sub">원내 MRI실</figcaption>
          </figure>
        </div>
      </section>

      {/* 6. 자주 묻는 질문: 구조화 데이터와 같은 문구가 처음부터 화면에 보이도록 펼쳐 둡니다. */}
      <section id="faq" className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-6 md:py-24">
        <h2 className="break-keep text-h2 tracking-tight text-ink">자주 묻는 질문</h2>
        <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((item) => (
            <div key={item.question} className="space-y-3 py-6">
              <dt className="break-keep text-lg font-bold leading-relaxed text-ink">{item.question}</dt>
              <dd className="break-keep text-base font-medium leading-[1.85] text-ink-sub md:text-[17px]">{item.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 break-keep text-[13px] font-medium leading-relaxed text-ink-muted">
          수술 여부와 방법, 회복 기간은 진찰과 검사 결과에 따라 개인마다 다릅니다. 이미지 중 척추 일러스트는
          이해를 돕기 위한 설명용입니다.
        </p>
      </section>

      {/* 7. 오시는 길: 실제 건물 사진 */}
      <section className="border-t border-slate-100 px-5 py-16 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src="/ch-hospital.jpg"
              alt="부암역 앞 위너스빌딩에 있는 연세척병원 건물 외관"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-5">
            <h2 className="break-keep text-h2 tracking-tight text-ink">오시는 길</h2>
            <p className="flex gap-2 break-keep text-[17px] font-semibold leading-relaxed text-ink">
              <MapPin size={20} aria-hidden className="mt-1 shrink-0 text-primary" />
              부산 부산진구 가야대로 715 위너스빌딩 1~4층
              <br className="hidden sm:block" />
              (부산 지하철 2호선 부암역 6번 출구 앞)
            </p>
            <p className="flex gap-2 break-keep text-[17px] font-medium leading-relaxed text-ink-sub">
              <Clock size={20} aria-hidden className="mt-1 shrink-0 text-primary" />
              평일 09:00–17:30 · 토요일 09:00–13:00
              <br className="hidden sm:block" />
              일요일·공휴일 휴진
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <PrimaryLink href="/reservation">진료 예약하기</PrimaryLink>
              <Link
                href="/about/location"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-7 py-4 text-base font-bold text-ink transition-colors hover:border-primary/40"
              >
                오시는 길 자세히
              </Link>
            </div>
          </div>
        </div>
        <Link
          href="/treatments/joint/knee"
          className="mx-auto mt-14 flex max-w-6xl items-center justify-between gap-4 rounded-2xl bg-slate-50 px-6 py-5 text-base font-bold text-ink transition-colors hover:text-primary"
        >
          무릎·어깨 관절 진료도 함께 하고 있습니다
          <ArrowRight size={18} strokeWidth={2.4} aria-hidden className="shrink-0 text-primary" />
        </Link>
      </section>
    </div>
  );
}

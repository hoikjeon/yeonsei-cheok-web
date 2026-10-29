import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Plus, MapPin, Phone, ScanLine } from 'lucide-react';
import { createPageMetadata } from '@/lib/seo';
import s from './preview.module.css';

export const metadata = createPageMetadata({
  title: '진료안내 리뉴얼 미리보기 | 연세척병원',
  description: '부산 연세척병원 진료 안내 개편 시안. 양방향 척추내시경과 척추·관절·비수술·재활 진료를 안내합니다.',
  path: '/treatments/preview',
  noIndex: true,
});
const spine = '/images/treatments/overview/spine-hero.webp';
const diseases = [
  { name: '허리디스크', desc: '허리 통증과 다리 저림이 있다면', tags: '요추 추간판탈출증 · 신경 압박', href: '/treatments/spine/disc', image: spine },
  { name: '척추관협착증', desc: '걷다가 쉬는 일이 잦아졌다면', tags: '보행 불편 · 허리와 다리 통증', href: '/treatments/spine/stenosis', image: '/generated/ube/ube-step-diagnosis-mri.webp' },
  { name: '목디스크', desc: '목·어깨부터 팔까지 불편하다면', tags: '경추 추간판탈출증 · 팔 저림', href: '/treatments/spine/neck-disc', image: '/generated/neck-disc-banner-3d.png' },
];
const bodyParts = [
  { label: '허리·다리', href: '/treatments/spine', image: '/images/treatments/preview/body-lower-back.webp' },
  { label: '목·팔', href: '/treatments/spine/neck-disc', image: '/images/treatments/preview/body-neck.webp' },
  { label: '무릎', href: '/treatments/joint/knee', image: '/images/treatments/preview/body-knee.webp' },
  { label: '어깨', href: '/treatments/joint/shoulder', image: '/images/treatments/preview/body-shoulder.webp' },
  { label: '손목·발목', href: '/treatments/joint/wrist-ankle', image: '/images/treatments/preview/body-wrist-ankle.webp' },
];
const faqs = [
  ['척추 진료를 받으면 바로 수술해야 하나요?', '수술 여부는 증상, 진찰과 검사 결과를 함께 살펴 결정합니다. 비수술 치료의 가능성과 수술의 필요성을 설명하고 환자 상태에 맞는 치료 방향을 상담합니다.'],
  ['양방향 척추내시경은 누구에게 필요한가요?', '허리디스크나 척추관협착증 등으로 신경이 눌린 경우 검토할 수 있는 수술 방법입니다. 모든 환자에게 적합한 것은 아니며, 병변의 위치와 상태, 기존 치료 경과 등을 바탕으로 의료진이 적용 여부를 판단합니다.'],
  ['다른 병원에서 촬영한 MRI를 가져가도 되나요?', '기존 MRI·CT 영상 자료와 판독지, 복용 중인 약 정보를 준비하면 상담에 도움이 됩니다. 추가 검사 여부는 진찰 후 결정하며, 자료 준비 방법은 병원에 문의해 주세요.'],
  ['척추 외에 관절이나 재활 진료도 받을 수 있나요?', '무릎·어깨·손목·발목 관절 진료와 도수·재활 치료도 안내하고 있습니다. 불편한 부위와 기존 치료 내용을 알려주시면 진료 분야와 일정을 안내받으실 수 있습니다.'],
  ['처음 방문할 때 어떻게 예약하나요?', '홈페이지의 진료 예약 메뉴 또는 대표전화 051-935-1004를 이용해 주세요. 의료진별 진료일과 필요한 준비 사항은 예약 시 확인하실 수 있습니다.'],
];
function Button({ href, children, outline = false }: { href: string; children: React.ReactNode; outline?: boolean }) {
  return <Link href={href} className={`${s.button} ${outline ? s.outline : ''}`}>{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>;
}
export default function TreatmentsPreview() {
  return <div className={s.page}>
    <div className={s.previewBar}><span>진료안내 리뉴얼 · 디자인 시안</span><Link href="/treatments">기존 페이지 비교 <ArrowUpRight size={13} /></Link></div>
    <section className={s.hero}>
      <Image src={spine} alt="척추와 디스크 구조를 표현한 설명용 이미지" fill preload sizes="100vw" className={s.heroImage} />
      <div className={s.heroShade} />
      <div className={s.heroInner}>
        <nav className={s.breadcrumb} aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span>진료안내</span></nav>
        <h1><span>부산 척추·관절 진료, 연세척병원</span>척추를 세심하게,<br />일상을 편안하게.</h1>
        <p className={s.heroCopy}>허리디스크·척추관협착증·목디스크부터<br />비수술 치료와 <strong>양방향 척추내시경</strong>, 재활까지.<br />지금 내 몸에 필요한 치료를 함께 찾습니다.</p>
        <div className={s.actions}><Button href="#ube">양방향 척추내시경</Button><Button href="/reservation" outline>진료 예약</Button></div>
        <p className={s.heroLocation}><MapPin size={14} /> 부산진구 · 부암역 6번 출구 앞</p>
      </div>
    </section>
    <nav className={s.sectionNav} aria-label="진료 영역 바로가기">{[['#ube', '양방향 척추내시경'], ['#spine', '척추 질환'], ['#care', '치료 방법'], ['#joint', '관절 진료'], ['#visit', '예약·오시는 길']].map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav>

    <section className={`${s.container} ${s.quick}`} aria-labelledby="quick-title">
      <h2 id="quick-title">어디가 불편하신가요?</h2>
      <div className={s.quickLinks}>{bodyParts.map(item => <Link key={item.label} href={item.href} className={s.quickCard}><div className={s.quickImage}><Image src={item.image} alt={`${item.label} 통증 부위를 표현한 설명용 이미지`} fill sizes="(max-width: 760px) 45vw, 220px" /></div><span>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></span></Link>)}</div>
    </section>

    <section id="ube" className={s.signature}>
      <div className={`${s.container} ${s.signatureGrid}`}>
        <div className={s.signatureText}><p className={s.eyebrow}>대표 치료</p><h2>척추수술의 한 방법,<br /><strong>양방향 척추내시경</strong></h2><p className={s.body}>두 개의 통로로 내시경과 수술 기구를 각각 삽입해<br className={s.desktopBreak} /> 병변을 확인하며 치료하는 척추수술입니다.</p><p className={s.body}>허리디스크·척추관협착증 등으로 불편한 일상.<br />증상과 검사 결과를 바탕으로 수술의 필요성과<br className={s.desktopBreak} /> 내 몸에 맞는 치료 방법을 살펴봅니다.</p><div className={s.tags}><span>허리디스크</span><span>척추관협착증</span><span>척추내시경 수술</span></div><Button href="/treatments/spine/ube">양방향 척추내시경 자세히 보기</Button><p className={s.note}>적용 여부와 회복 과정은 개인의 상태에 따라 다릅니다.</p></div>
        <div className={s.signatureVisual}><div className={s.visualTop}><span>두 통로, 하나의 치료 목표</span><ScanLine size={22} /></div><div className={s.ubeImage}><Image src="/generated/ube/ube-comparison-bi-v2.webp" alt="두 개의 통로를 사용하는 양방향 척추내시경 설명 일러스트" fill sizes="(max-width: 760px) 90vw, 45vw" /></div><div className={s.visualBottom}><div><b>01</b><span>병변을 확인하는<br /><strong>내시경 통로</strong></span></div><div><b>02</b><span>치료를 진행하는<br /><strong>수술 기구 통로</strong></span></div></div></div>
      </div>
    </section>

    <section id="spine" className={`${s.container} ${s.section}`}>
      <div className={s.heading}><div><h2>질환을 이해하면,<br />치료의 방향이 보입니다.</h2></div><p>부산 연세척병원의 주요 척추 진료.<br />내 증상과 관련된 질환부터 확인해 보세요.</p></div>
      <div className={s.diseaseGrid}>{diseases.map(item => <Link href={item.href} key={item.name} className={s.diseaseCard}><div className={s.diseaseImage}><Image src={item.image} alt={`${item.name} 안내를 위한 설명용 이미지`} fill sizes="(max-width: 640px) 90vw, 30vw" /><span><ArrowUpRight size={20} /></span></div><div className={s.diseaseCopy}><h3>{item.name}</h3><p>{item.desc}</p><small>{item.tags}</small></div></Link>)}</div>
      <div className={s.related}><span>함께 살펴볼 척추 진료</span><Link href="/treatments/spine">척추전방전위증 · 척추압박골절 상담 <ArrowUpRight size={16} /></Link></div>
    </section>

    <section id="care" className={s.careSection}><div className={s.container}>
      <div className={s.heading}><div><h2>치료의 기준은,<br />환자의 현재 상태입니다.</h2></div><p>진단을 바탕으로 비수술 치료와 수술의 필요성을 살피고,<br />치료 이후의 회복까지 함께 계획합니다.</p></div>
      <div className={s.careGrid}>{[
        { title: '비수술 치료', sub: '통증의 원인부터 살피는', text: '주사 치료·신경성형술 등 비수술 치료의 적용 가능성과 필요한 치료 방향을 안내합니다.', href: '/treatments/spine/non-surgical', image: '/images/treatments/preview/care-non-surgical.webp' },
        { title: '척추수술', sub: '수술이 필요한 경우에는', text: '양방향 척추내시경을 비롯한 치료 방법과 적용 여부, 예상 경과를 충분히 설명합니다.', href: '/treatments/spine/ube', image: '/images/treatments/preview/care-surgery.webp' },
        { title: '도수·재활 치료', sub: '일상의 움직임을 되찾도록', text: '상태에 맞는 도수·운동치료와 회복 관리를 통해 일상으로 돌아가는 과정을 돕습니다.', href: '/treatments/spine/rehab', image: '/images/treatments/preview/care-rehab.webp' },
      ].map(item => <Link className={s.careCard} href={item.href} key={item.title}><div className={s.careImage}><Image src={item.image} alt={`${item.title}를 표현한 설명용 이미지`} fill sizes="(max-width: 760px) 90vw, 30vw" /></div><p>{item.sub}</p><h3>{item.title}</h3><p className={s.careDescription}>{item.text}</p><span className={s.textLink}>치료 안내 보기 <ArrowRight size={17} /></span></Link>)}</div>
    </div></section>

    <section id="joint" className={`${s.container} ${s.section}`}>
      <div className={s.heading}><div><h2>척추와 함께,<br />관절의 움직임까지.</h2></div><p>무릎·어깨부터 손목·발목까지.<br />불편한 부위에 맞는 관절 진료를 만나보세요.</p></div>
      <div className={s.jointGrid}>{[
        { title: '무릎 관절', text: '퇴행성관절염 · 반월상연골 질환', href: '/treatments/joint/knee', image: '/images/treatments/overview/joint-care.webp' },
        { title: '어깨 관절', text: '회전근개 질환 · 오십견', href: '/treatments/joint/shoulder', image: '/images/treatments/joint/shoulder/shoulder-intro-anatomy.webp' },
      ].map(item => <Link href={item.href} className={s.jointCard} key={item.title}><div><h3>{item.title}</h3><p>{item.text}</p><span className={s.textLink}>진료 알아보기 <ArrowUpRight size={16} /></span></div><div className={s.jointImage}><Image src={item.image} alt={`${item.title} 구조 설명 이미지`} fill sizes="(max-width: 640px) 40vw, 23vw" /></div></Link>)}</div>
      <Link href="/treatments/joint/wrist-ankle" className={s.wrist}><span>손목·발목도 불편하신가요?</span><span>손목 저림 · 발목 염좌 등 진료 안내 <ArrowUpRight size={18} /></span></Link>
    </section>

    <section className={s.doctors}><div className={`${s.container} ${s.doctorGrid}`}><div><h2>치료를 결정하기 전,<br />의료진과 충분히 이야기하세요.</h2><p className={s.body}>불편한 증상과 그동안의 치료 과정을 듣고,<br />검사 결과와 가능한 치료 방법을 설명합니다.</p><div className={s.consultImage}><Image src="/images/treatments/preview/consult.webp" alt="척추 모형과 MRI 영상을 보며 진료 상담하는 모습을 표현한 설명용 이미지" fill sizes="(max-width: 760px) 90vw, 45vw" /></div><Button href="/doctors">의료진과 진료 분야 확인</Button></div><ol className={s.steps}>{[['증상과 원인 확인', '진찰과 필요한 검사를 통해 현재 상태를 살핍니다.'], ['치료 방향 상담', '비수술·수술의 필요성과 선택지를 설명합니다.'], ['치료와 회복 관리', '치료 경과에 따라 재활과 일상 관리를 안내합니다.']].map(([title, desc], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{desc}</p></div></li>)}</ol></div></section>

    <section className={`${s.container} ${s.section}`}><div className={s.faqHeading}><h2>진료 전, 궁금한 이야기</h2></div><div className={s.faq}>{faqs.map(([q, a], i) => <details key={q}><summary><span>Q{String(i + 1).padStart(2, '0')}</span>{q}<Plus size={20} /></summary><p>{a}</p></details>)}</div><p className={s.disclaimer}>이 페이지는 일반적인 진료 안내입니다. 진단과 치료 방법은 의료진 상담을 통해 결정되며, 이미지는 이해를 돕기 위한 설명용입니다.</p></section>

    <section id="visit" className={s.visit}><div className={`${s.container} ${s.visitGrid}`}><div><h2>편안한 일상으로,<br />첫 진료를 시작하세요.</h2><p><MapPin size={16} /> 부산 부산진구 가야대로 715 · 부암역 6번 출구 앞</p><p>평일 09:00–17:30 · 토요일 09:00–13:00</p><small>일요일·공휴일 휴진 · 의료진별 일정은 예약 시 확인해 주세요.</small></div><div className={s.visitActions}><span>진료 예약 및 상담</span><a className={s.phone} href="tel:0519351004"><Phone size={23} />051-935-1004</a><div className={s.actions}><Button href="/reservation">진료 예약하기</Button><Button href="/about/location" outline>오시는 길</Button></div></div></div></section>
  </div>;
}

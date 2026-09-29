import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Check, MapPin, Plus } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';
import styles from './treatments.module.css';

const title = '부산 척추병원 진료안내 | 연세척병원';
const description = '부산진구 부암역 연세척병원. 허리디스크·목디스크·척추관협착증부터 관절 질환까지, 비수술 치료와 양방향 척추내시경, 도수·재활 진료를 안내합니다.';
const hero = '/images/treatments/overview/spine-hero.webp';
export const metadata = createPageMetadata({ title, description, path: '/treatments', image: hero });

const conditions = [
  { name: '허리디스크', detail: '허리에서 다리까지 이어지는 통증', href: '/treatments/spine/disc', image: hero, alt: '허리 척추와 추간판을 표현한 3D 설명 이미지', position: 'right' },
  { name: '목디스크', detail: '목·어깨 통증과 팔의 저림', href: '/treatments/spine/neck-disc', image: '/generated/neck-disc-banner-3d.png', alt: '목 척추 구조를 표현한 3D 설명 이미지', position: 'right' },
  { name: '척추관협착증', detail: '걸을 때 불편한 허리와 다리', href: '/treatments/spine/stenosis', image: hero, alt: '척추관과 주변 신경을 이해하기 위한 척추 설명 이미지', position: 'right' },
  { name: '무릎·어깨 관절', detail: '일상의 움직임을 제한하는 관절 통증', href: '/treatments/joint/knee', image: '/images/treatments/overview/joint-care.webp', alt: '무릎 관절과 연골을 표현한 3D 설명 이미지', position: 'center' },
];
const care = [
  { no: '01', name: '신경성형술', label: '신경 주변에 접근하는 비수술 시술', image: '/images/treatments/non-surgical/neuroplasty/neuroplasty-catheter-precision-hero.png', href: '/treatments/spine/non-surgical' },
  { no: '02', name: '인대강화주사 · 프롤로', label: '진단에 따라 검토하는 주사 치료', image: '/images/treatments/non-surgical/prolotherapy/prolotherapy-hero.png', href: '/treatments/spine/non-surgical' },
  { no: '03', name: '도수·재활 치료', label: '통증 관리에서 움직임의 회복까지', image: '/images/treatments/spine/rehab-manual-therapy.webp', href: '/treatments/spine/rehab' },
];
const faqs = [
  { question: '부산 척추병원 추천 정보를 볼 때 무엇을 확인해야 하나요?', answer: '추천 문구만으로 결정하기보다 의료진의 진료 분야, 증상과 검사 결과에 대한 설명, 비수술·수술 치료의 선택 기준, 치료 후 재활 계획을 함께 확인해 보세요. 연세척병원 홈페이지에서 의료진 소개와 질환별 치료 정보를 확인하실 수 있습니다.' },
  { question: '연세척병원에서는 어떤 척추 질환을 진료하나요?', answer: '허리디스크, 목디스크, 척추관협착증, 척추전방전위증, 척추압박골절 등 척추 질환을 진료합니다. 무릎·어깨 관절 질환과 도수·재활 진료도 안내하고 있습니다.' },
  { question: '척추 진료를 받으면 바로 수술해야 하나요?', answer: '수술 여부는 진찰과 검사 결과, 증상의 정도를 종합해 결정합니다. 연세척병원은 비수술 치료 가능성을 먼저 검토하고, 수술이 필요한 경우에는 양방향 척추내시경 등 적용 가능한 치료 방법을 설명합니다. 치료 방법과 회복 경과는 개인마다 다릅니다.' },
  { question: '처음 방문할 때 무엇을 준비하면 좋을까요?', answer: '기존에 촬영한 MRI·CT 등 영상 자료와 판독지, 복용 중인 약 정보를 준비하면 진료 상담에 도움이 됩니다. 필요한 서류와 예약 일정은 대표전화 051-935-1004로 확인해 주세요.' },
  { question: '병원 위치와 진료시간은 어떻게 되나요?', answer: '연세척병원은 부산광역시 부산진구 가야대로 715, 위너스빌딩 1~4층에 있으며 부산 지하철 2호선 부암역 6번 출구 앞에 있습니다. 평일 09:00~17:30, 토요일 09:00~13:00 진료하며 일요일·공휴일은 휴진입니다. 일정 변경은 병원 공지사항 또는 대표전화로 확인해 주세요.' },
];
const pageUrl = absoluteUrl('/treatments');
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'MedicalWebPage', '@id': `${pageUrl}#webpage`, url: pageUrl, name: title, description, inLanguage: 'ko-KR', publisher: { '@id': absoluteUrl('/#hospital') }, isPartOf: { '@id': absoluteUrl('/#website') }, about: { '@id': absoluteUrl('/#hospital') }, primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(hero) }, breadcrumb: { '@id': `${pageUrl}#breadcrumb` }, hasPart: { '@id': `${pageUrl}#faq` } },
    { '@type': 'BreadcrumbList', '@id': `${pageUrl}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: absoluteUrl('/') }, { '@type': 'ListItem', position: 2, name: '진료안내', item: pageUrl }] },
    { '@type': 'FAQPage', '@id': `${pageUrl}#faq`, mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ],
};

function MoreLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return <Link className={`${styles.more} ${light ? styles.moreLight : ''}`} href={href}>{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>;
}

export default function TreatmentsPage() {
  return <div className={styles.page}>
    <JsonLd data={structuredData} />
    <section className={styles.hero} aria-labelledby="treatments-title">
      <Image src={hero} alt="척추뼈와 디스크, 주변 신경을 표현한 의료 설명용 3D 이미지" fill preload sizes="100vw" className={styles.heroImage} />
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        <nav aria-label="현재 위치" className={styles.breadcrumb}><Link href="/">홈</Link><span>/</span><span>진료안내</span></nav>
        <p className={styles.eyebrow}>YONSEI CHEOK · TREATMENT GUIDE</p>
        <h1 id="treatments-title"><span>부산 척추병원, 연세척병원</span>통증 너머의 일상까지<br />함께 바라봅니다.</h1>
        <p className={styles.heroDescription}>척추·관절의 진단부터 비수술 치료, 수술과 재활까지.<br />지금의 내 몸에 필요한 치료를 함께 찾겠습니다.</p>
        <MoreLink href="/reservation">진료 상담·예약</MoreLink>
      </div>
      <a className={styles.scroll} href="#care-guide">진료안내 살펴보기 <ArrowDown size={15} aria-hidden="true" /></a>
    </section>

    <nav className={styles.sectionNav} aria-label="진료안내 바로가기">
      {[['#spine-care', '척추·관절 질환'], ['#non-surgical', '비수술 치료'], ['#recovery', '치료·회복 과정'], ['#faq', '자주 묻는 질문']].map(([href, label]) => <a key={href} href={href}>{label}</a>)}
    </nav>

    <section id="care-guide" className={`${styles.container} ${styles.intro}`}>
      <div><p className={styles.eyebrow}>CARE FOR YOUR EVERYDAY</p><h2>불편한 곳을 이해하는 것부터,<br />회복의 방향이 달라집니다.</h2></div>
      <div><p>부산진구 부암역에 위치한 연세척병원은 허리와 목의 척추 질환부터 무릎·어깨의 관절 질환까지 진료합니다. 증상과 검사 결과를 함께 살펴 치료의 방향을 정합니다.</p><p>비수술 치료 가능성을 먼저 검토하고, 필요한 경우 수술과 재활까지 연결해 일상 복귀를 돕습니다.</p><MoreLink href="/doctors">함께할 의료진 만나기</MoreLink></div>
    </section>

    <section id="spine-care" className={`${styles.container} ${styles.diseases}`}>
      <div className={styles.centerHeading}><p className={styles.eyebrow}>SPINE & JOINT CARE</p><h2>어디가 불편하신가요?</h2><p>증상과 관련된 진료 내용을 먼저 살펴보세요.</p></div>
      <div className={styles.conditionGrid}>{conditions.map((item) => <Link key={item.name} href={item.href} className={styles.conditionCard}>
        <div className={styles.conditionImage}><Image src={item.image} alt={item.alt} fill sizes="(max-width: 640px) 85vw, (max-width: 1000px) 45vw, 23vw" style={{ objectPosition: item.position }} /><span className={styles.roundArrow}><ArrowUpRight size={20} aria-hidden="true" /></span></div>
        <p>{item.detail}</p><h3>{item.name}</h3>
      </Link>)}</div>
      <div className={styles.related}><span>함께 살펴볼 진료</span><Link href="/treatments/spine">척추전방전위증 · 척추압박골절 <ArrowUpRight size={15} /></Link><Link href="/treatments/joint/shoulder">오십견 · 회전근개 질환 <ArrowUpRight size={15} /></Link><Link href="/treatments/joint/wrist-ankle">스포츠 외상 · 손목·발목 <ArrowUpRight size={15} /></Link></div>
    </section>

    <section id="non-surgical" className={styles.navySection}><div className={`${styles.container} ${styles.careLayout}`}>
      <div className={styles.careHeading}><p className={styles.eyebrow}>NON-SURGICAL FIRST</p><h2>내 몸에 맞는 치료,<br />비수술 가능성부터.</h2><p>통증의 원인과 현재 상태를 살펴<br />필요한 치료를 단계적으로 검토합니다.</p><MoreLink href="/treatments/spine/non-surgical" light>비수술 치료 자세히 보기</MoreLink><div className={styles.careNote}>치료의 적용 여부와 효과는 개인의 상태에 따라 다릅니다.</div></div>
      <div className={styles.careCards}>{care.map((item) => <Link key={item.no} href={item.href} className={styles.careCard}><div className={styles.careImage}><Image src={item.image} alt={`${item.name} 안내를 위한 설명용 이미지`} fill sizes="(max-width: 640px) 85vw, 32vw" /></div><div className={styles.careCaption}><span>{item.no} / {item.label}</span><h3>{item.name}<ArrowUpRight size={20} aria-hidden="true" /></h3></div></Link>)}<div className={styles.careText}><span>함께 검토하는 치료</span><h3>체외충격파 치료</h3><p>통증 부위와 진단에 따라 적용 여부를 상담합니다.</p><MoreLink href="/reservation" light>치료 상담하기</MoreLink></div></div>
    </div></section>

    <section id="recovery" className={styles.recovery}><div className={styles.container}>
      <div className={styles.centerHeading}><p className={styles.eyebrow}>STEP BY STEP, BACK TO YOU</p><h2>치료의 끝이 아닌,<br />일상으로 이어지는 회복.</h2><p>진단부터 치료 이후까지, 지금 필요한 과정을 함께합니다.</p></div>
      <ol className={styles.steps}>{[{ title: '증상과 원인 확인', text: '불편한 부위와 생활 속 증상을 듣고, 필요한 검사를 검토합니다.' }, { title: '맞춤 치료 계획', text: '진단 결과를 바탕으로 비수술 치료와 수술의 필요성을 설명합니다.' }, { title: '치료와 경과 관찰', text: '선택한 치료를 진행하고 증상과 기능의 변화를 살핍니다.' }, { title: '재활과 일상 관리', text: '회복 상태에 맞춰 움직임과 생활 습관 관리를 안내합니다.' }].map((step, i) => <li key={step.title}><span>0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
      <div className={styles.recoveryLinks}><MoreLink href="/treatments/spine/ube">양방향 척추내시경 알아보기</MoreLink><MoreLink href="/treatments/spine/rehab">도수·재활 클리닉 알아보기</MoreLink></div>
    </div></section>

    <section className={`${styles.container} ${styles.choice}`}><div><p className={styles.eyebrow}>A THOUGHTFUL CHOICE</p><h2>부산 척추병원을 찾고 있다면,<br />이런 점을 확인해 보세요.</h2><p>나에게 맞는 병원을 선택하기 위한 질문들입니다.</p><MoreLink href="/doctors">의료진과 진료 분야 확인하기</MoreLink></div><ul>{['내 증상과 검사 결과를 충분히 설명해 주는가', '비수술 치료와 수술의 필요성을 함께 검토하는가', '치료 후 재활과 일상 관리까지 안내하는가', '꾸준히 방문할 수 있는 위치와 진료시간인가'].map(text => <li key={text}><Check size={19} aria-hidden="true" />{text}</li>)}</ul></section>

    <section id="faq" className={`${styles.container} ${styles.faq}`}><div className={styles.centerHeading}><p className={styles.eyebrow}>QUESTIONS & ANSWERS</p><h2>진료 전, 궁금한 이야기</h2></div><div className={styles.faqList}>{faqs.map(({ question, answer }, i) => <details key={question}><summary><span className={styles.questionNumber}>Q{String(i + 1).padStart(2, '0')}</span><span>{question}</span><Plus size={20} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div><p className={styles.disclaimer}>이 페이지는 일반적인 진료 안내이며, 개인별 진단과 치료는 의료진 상담을 통해 결정됩니다. 의료 이미지는 이해를 돕기 위한 설명용 이미지로 실제 환자의 검사 결과와 다릅니다.</p></section>

    <section className={styles.visit}><div className={`${styles.container} ${styles.visitInner}`}><div><p className={styles.eyebrow}>YONSEI CHEOK HOSPITAL</p><h2>가까운 곳에서 시작하는<br />당신의 다음 일상.</h2><p><MapPin size={17} aria-hidden="true" />부산진구 가야대로 715 · 부암역 6번 출구 앞</p><p className={styles.hours}>평일 09:00–17:30 · 토요일 09:00–13:00<br />일요일·공휴일 휴진</p></div><div className={styles.visitActions}><a href="tel:0519351004" className={styles.phone}>051-935-1004</a><span>진료 예약 및 상담</span><div><MoreLink href="/reservation">진료 예약하기</MoreLink><MoreLink href="/about/location">오시는 길</MoreLink></div></div></div></section>
  </div>;
}

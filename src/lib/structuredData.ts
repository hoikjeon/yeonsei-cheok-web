import { DEFAULT_SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';

// 검색엔진과 AI 크롤러가 "이 사이트 = 부산 연세척병원"이라는 사실을 사람이 읽는 문장이 아니라
// 기계가 읽는 형태로 확인할 수 있게 합니다. 새 도메인일수록 이 신호가 중요합니다.
// 값은 모두 Footer / 오시는 길 / 의료진 소개 페이지에 이미 노출된 공개 정보와 같아야 합니다.

const HOSPITAL_ID = `${SITE_URL}/#hospital`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const TELEPHONE = '+82-51-935-1004';
const FAX = '+82-51-935-1008';

// src/app/(public)/about/location/page.tsx 의 HOSPITAL_COORDS 와 같은 좌표입니다.
const COORDS = { lat: 35.157605, lng: 129.04986 };

const SOCIAL_PROFILES = [
  'https://map.naver.com/p/entry/place/35643868',
  'https://www.youtube.com/@BusanYS-tv',
  'https://blog.naver.com/sebarun_bsbs',
  'https://www.instagram.com/ys_cheok',
  'https://pf.kakao.com/_FGNLM',
];

// schema.org MedicalSpecialty 열거값만 사용합니다. 임의 문자열은 무시됩니다.
const MEDICAL_SPECIALTIES = [
  'https://schema.org/Neurologic',
  'https://schema.org/Musculoskeletal',
  'https://schema.org/Surgical',
  'https://schema.org/Anesthesia',
  'https://schema.org/Radiography',
  'https://schema.org/Physiotherapy',
];

// 대표 시술 두 가지(양방향 척추내시경 · 무릎관절내시경)는 부르는 이름이 여러 가지라
// alternateName으로 표기 차이를 흡수해야 같은 시술로 인식됩니다.
const PROCEDURES: Array<{
  name: string;
  path: string;
  alternateName?: string[];
}> = [
  {
    name: '양방향 척추내시경(UBE)',
    path: '/treatments/spine/ube',
    alternateName: [
      'UBE',
      '양방향 척추 내시경',
      '양방향 내시경 척추수술',
      '척추 내시경 수술',
      'Unilateral Biportal Endoscopy',
    ],
  },
  { name: '허리디스크 치료', path: '/treatments/spine/disc', alternateName: ['요추 추간판 탈출증'] },
  { name: '목디스크 치료', path: '/treatments/spine/neck-disc', alternateName: ['경추 추간판 탈출증'] },
  { name: '척추관협착증 치료', path: '/treatments/spine/stenosis', alternateName: ['척추관 협착증'] },
  { name: '척추 비수술 치료', path: '/treatments/spine/non-surgical' },
  { name: '도수·재활 치료', path: '/treatments/spine/rehab' },
  { name: '무릎 관절 치료', path: '/treatments/joint/knee' },
  {
    name: '무릎관절내시경',
    path: '/treatments/joint/knee-arthroscopy',
    alternateName: [
      '무릎 관절내시경',
      '무릎 관절경',
      '슬관절 관절내시경',
      'Knee Arthroscopy',
    ],
  },
  { name: '어깨 관절 치료', path: '/treatments/joint/shoulder', alternateName: ['회전근개 파열', '오십견'] },
];

// 진료권. "부산 척추", "부산 관절" 같은 지역 질의에서 이 병원이 후보에 들도록 명시합니다.
const AREA_SERVED = [
  '부산광역시',
  '부산진구',
  '사상구',
  '북구',
  '동래구',
  '연제구',
  '서구',
  '남구',
].map((name) => ({ '@type': 'AdministrativeArea', name }));

// 병원을 설명하는 주제어. 검색어 표기 그대로도 포함합니다.
const KNOWS_ABOUT = [
  '부산 척추',
  '부산 관절',
  '부산 척추병원',
  '부산 관절병원',
  '양방향 척추내시경(UBE)',
  '무릎관절내시경',
  '허리디스크',
  '목디스크',
  '척추관협착증',
  '척추 비수술 치료',
  '반월상연골 손상',
  '무릎 연골 치료',
  '회전근개 파열',
  '도수·재활 치료',
];

// 의료진 소개에 표기된 센터 구성입니다.
const DEPARTMENTS = [
  { name: '척추내시경센터', specialty: 'https://schema.org/Neurologic' },
  { name: '관절센터', specialty: 'https://schema.org/Musculoskeletal' },
  { name: '척추·관절 통증센터', specialty: 'https://schema.org/Anesthesia' },
  { name: '영상의학과', specialty: 'https://schema.org/Radiography' },
];

// src/app/(public)/doctors/page.tsx 의 doctorList 와 같은 순서·같은 id 입니다.
const PHYSICIANS: Array<{
  id: string;
  name: string;
  jobTitle: string;
  specialty: string;
  image: string;
}> = [
  { id: 'kim-dong-han', name: '김동한', jobTitle: '병원장', specialty: 'https://schema.org/Neurologic', image: '/김동한병원장.jpg' },
  { id: 'lee-nam', name: '이남', jobTitle: '병원장', specialty: 'https://schema.org/Neurologic', image: '/이남 병원장.jpg' },
  { id: 'choi-ho', name: '최호', jobTitle: '원장', specialty: 'https://schema.org/Musculoskeletal', image: '/최호원장.jpg' },
  { id: 'kim-beom-jun', name: '김범준', jobTitle: '원장', specialty: 'https://schema.org/Anesthesia', image: '/김범준원장.jpg' },
  { id: 'jang-hwi-yeol', name: '장휘열', jobTitle: '원장', specialty: 'https://schema.org/Radiography', image: '/장휘열원장님.png' },
];

// 일요일·공휴일은 항목을 두지 않는 것으로 휴진을 표현합니다.
// 없는 요일을 "휴진"으로 적는 속성은 schema.org에 없습니다.
const OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:30',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'Saturday',
    opens: '09:00',
    closes: '13:00',
  },
];

export function buildHospitalStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Hospital',
        '@id': HOSPITAL_ID,
        name: SITE_NAME,
        alternateName: ['연세척병원', 'Yonsei Cheok Hospital', '부산 연세척병원'],
        description: DEFAULT_SITE_DESCRIPTION,
        url: absoluteUrl('/'),
        logo: absoluteUrl('/ch-logo-color.png'),
        image: absoluteUrl('/generated/hero-hospital-exterior.png'),
        telephone: TELEPHONE,
        faxNumber: FAX,
        // 사업자등록번호는 Footer에 이미 공개된 값입니다.
        taxID: '605-92-44375',
        priceRange: '₩₩',
        currenciesAccepted: 'KRW',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '가야대로 715 위너스빌딩 1~4층',
          addressLocality: '부산진구',
          addressRegion: '부산광역시',
          addressCountry: 'KR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: COORDS.lat,
          longitude: COORDS.lng,
        },
        hasMap: 'https://map.naver.com/p/entry/place/35643868',
        openingHoursSpecification: OPENING_HOURS,
        medicalSpecialty: MEDICAL_SPECIALTIES,
        areaServed: AREA_SERVED,
        knowsAbout: KNOWS_ABOUT,
        department: DEPARTMENTS.map((department) => ({
          '@type': 'MedicalClinic',
          name: department.name,
          medicalSpecialty: department.specialty,
          parentOrganization: { '@id': HOSPITAL_ID },
        })),
        availableService: PROCEDURES.map((procedure) => ({
          '@type': 'MedicalProcedure',
          name: procedure.name,
          ...(procedure.alternateName ? { alternateName: procedure.alternateName } : {}),
          url: absoluteUrl(procedure.path),
        })),
        employee: PHYSICIANS.map((physician) => ({
          '@type': 'Physician',
          name: physician.name,
          jobTitle: physician.jobTitle,
          medicalSpecialty: physician.specialty,
          image: absoluteUrl(physician.image),
          url: absoluteUrl(`/doctors#${physician.id}`),
          worksFor: { '@id': HOSPITAL_ID },
        })),
        sameAs: SOCIAL_PROFILES,
        potentialAction: {
          '@type': 'ReserveAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: absoluteUrl('/reservation'),
            inLanguage: 'ko-KR',
          },
          result: { '@type': 'Reservation', name: '진료 예약' },
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: absoluteUrl('/'),
        name: SITE_NAME,
        description: DEFAULT_SITE_DESCRIPTION,
        inLanguage: 'ko-KR',
        publisher: { '@id': HOSPITAL_ID },
      },
    ],
  };
}

type ProcedurePageOptions = {
  /** 페이지 제목과 설명. metadata와 같은 내용을 씁니다. */
  page: { name: string; description: string; path: string; image?: string };
  procedure: {
    name: string;
    alternateName: string[];
    /** 시술 부위. 예: '척추', '무릎 관절' */
    bodyLocation: string;
    /** schema.org MedicalSpecialty 열거값 URL */
    specialty: string;
    /** 시술 방법. 반드시 해당 페이지에 실제로 적혀 있는 내용만 옮깁니다. */
    howPerformed: string;
    /** 적용 대상. 역시 페이지에 적힌 문장을 그대로 씁니다. */
    indications: string[];
    followup?: string;
  };
  breadcrumb: Array<{ name: string; path: string }>;
};

/**
 * 시술 상세 페이지용 구조화 데이터.
 *
 * 홈에 깔아둔 Hospital 노드만으로는 "부산 척추 / 부산 관절" 같은 질의에서
 * 어떤 시술을 하는 곳인지가 드러나지 않습니다. 대표 시술 페이지에 시술 자체를
 * 하나의 개체로 기술해 두면, AI가 시술 이름과 병원을 직접 연결할 수 있습니다.
 *
 * howPerformed와 indications에는 페이지 본문에 없는 내용을 절대 쓰지 마십시오.
 * 구조화 데이터와 본문이 어긋나면 스팸으로 처리될 뿐 아니라 의료광고 문제가 됩니다.
 */
export function buildProcedurePageStructuredData({
  page,
  procedure,
  breadcrumb,
}: ProcedurePageOptions) {
  const pageId = `${absoluteUrl(page.path)}#webpage`;
  const procedureId = `${absoluteUrl(page.path)}#procedure`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': pageId,
        url: absoluteUrl(page.path),
        name: page.name,
        description: page.description,
        inLanguage: 'ko-KR',
        ...(page.image ? { primaryImageOfPage: absoluteUrl(page.image) } : {}),
        about: { '@id': procedureId },
        mainEntity: { '@id': procedureId },
        publisher: { '@id': HOSPITAL_ID },
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumb.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: absoluteUrl(crumb.path),
          })),
        },
      },
      {
        '@type': 'MedicalProcedure',
        '@id': procedureId,
        name: procedure.name,
        alternateName: procedure.alternateName,
        procedureType: 'https://schema.org/SurgicalProcedure',
        bodyLocation: procedure.bodyLocation,
        howPerformed: procedure.howPerformed,
        ...(procedure.followup ? { followup: procedure.followup } : {}),
        indication: procedure.indications.map((text) => ({
          '@type': 'MedicalIndication',
          description: text,
        })),
        relevantSpecialty: procedure.specialty,
        url: absoluteUrl(page.path),
      },
    ],
  };
}

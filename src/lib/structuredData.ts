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

const PROCEDURES: Array<{ name: string; path: string }> = [
  { name: '양방향 척추내시경(UBE)', path: '/treatments/spine/ube' },
  { name: '허리디스크 치료', path: '/treatments/spine/disc' },
  { name: '목디스크 치료', path: '/treatments/spine/neck-disc' },
  { name: '척추관협착증 치료', path: '/treatments/spine/stenosis' },
  { name: '척추 비수술 치료', path: '/treatments/spine/non-surgical' },
  { name: '도수·재활 치료', path: '/treatments/spine/rehab' },
  { name: '무릎 관절 치료', path: '/treatments/joint/knee' },
  { name: '무릎 관절내시경', path: '/treatments/joint/knee-arthroscopy' },
  { name: '어깨 관절 치료', path: '/treatments/joint/shoulder' },
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
        availableService: PROCEDURES.map((procedure) => ({
          '@type': 'MedicalProcedure',
          name: procedure.name,
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

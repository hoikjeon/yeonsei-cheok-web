// 메인 배너 슬라이드 목록입니다.
// 서버(page.tsx)가 시작 장을 고르고, 화면(HomePageContent)이 그 장부터 넘깁니다.
export const heroSlides = [
  {
    id: 'f',
    desktopImage: '/banner/f1d.jpg',
    tabletImage: '/banner/f1t.jpg',
    mobileImage: '/banner/f1m.jpg',
    imageAlt: '김동한·이남 병원장이 이끄는 연세척병원, 척추·관절치료 처음부터 끝까지 함께하겠습니다',
  },
  {
    id: 'a',
    desktopImage: '/banner/a1d.jpg',
    tabletImage: '/banner/a1t.jpg',
    mobileImage: '/banner/a1m.jpg',
    imageAlt: '세계적 수준의 의료진이 집도하는 연세척병원 양방향 척추내시경 센터',
  },
  {
    id: 'b',
    desktopImage: '/banner/b1d.jpg',
    tabletImage: '/banner/b1t.jpg',
    mobileImage: '/banner/b1m.jpg',
    imageAlt: '해외 의료진을 가르치는 양방향 척추내시경 수술 권위자 김동한 병원장',
  },
  {
    id: 'c',
    desktopImage: '/banner/c1d.jpg',
    tabletImage: '/banner/c1t.jpg',
    mobileImage: '/banner/c1m.jpg',
    imageAlt: '해외 의사를 가르치고 양방향 척추내시경을 리드하는 연세척병원',
  },
  {
    id: 'd',
    desktopImage: '/banner/d1d.jpg',
    tabletImage: '/banner/d1t.jpg',
    mobileImage: '/banner/d1m.jpg',
    imageAlt: '비수술 치료부터 수술·재활까지 환자에게 꼭 필요한 치료에 집중하는 연세척병원',
  },
  {
    id: 'e',
    desktopImage: '/banner/e1d.jpg',
    tabletImage: '/banner/e1t.jpg',
    mobileImage: '/banner/e1m.jpg',
    imageAlt: '세계 최초 경추 라이브 서저리를 시행한 양방향 척추내시경 권위자 이남 병원장',
  },
  {
    id: 'g',
    desktopImage: '/banner/g1d.jpg',
    tabletImage: '/banner/g1t.jpg',
    mobileImage: '/banner/g1m.jpg',
    imageAlt: '입원 없이 당일 검사가 가능한 연세척병원 원데이 무릎 관절 내시경 진단',
  },
  {
    id: 'h',
    desktopImage: '/banner/h1d.jpg?v=b4bc1be1',
    tabletImage: '/banner/h1t.jpg',
    mobileImage: '/banner/h1m.jpg',
    imageAlt: '세계 최초 양방향 척추내시경 유합술 전향적 연구에 참여하는 연세척병원',
  },
];

export type HeroSlide = (typeof heroSlides)[number];

// 대표 이미지(f)는 20%, 나머지는 남은 80%를 똑같이 나눠 갖습니다.
const FEATURED_HERO_SLIDE_ID = 'f';
const FEATURED_HERO_SLIDE_WEIGHT = 0.2;

export function pickInitialHeroSlideIndex(random: number = Math.random()) {
  const featuredIndex = heroSlides.findIndex((slide) => slide.id === FEATURED_HERO_SLIDE_ID);
  if (featuredIndex === -1) return Math.floor(random * heroSlides.length);
  if (random < FEATURED_HERO_SLIDE_WEIGHT) return featuredIndex;

  const otherIndexes = heroSlides.map((_, index) => index).filter((index) => index !== featuredIndex);
  const position = Math.floor(
    ((random - FEATURED_HERO_SLIDE_WEIGHT) / (1 - FEATURED_HERO_SLIDE_WEIGHT)) * otherIndexes.length,
  );
  return otherIndexes[Math.min(position, otherIndexes.length - 1)];
}

# Effect Notes

## 2026-07-09 - 흐르는 배경 타이포그래피

- 효과 이름: `Marquee Text`, `Background Kinetic Typography`, `흐르는 배경 타이포그래피`
- 목적: 섹션 하단에 낮은 투명도의 큰 문구를 천천히 흘려 보내면서 공간감과 프리미엄한 분위기를 더한다.
- 적용 후보 위치: 목디스크 페이지 첫 소개 섹션 아래, 또는 다음 섹션으로 넘어가기 전 넓은 여백 구간.
- 현재 구현 위치: `src/app/(public)/treatments/spine/neck-disc/page.tsx`
- 사용 유틸리티: `marquee-fade`, `marquee-track`
- 추천 문구: `YONSEI CHEOK HOSPITAL · NECK DISC CLINIC · CERVICAL DISC CENTER ·`
- 목디스크 현재 조정값: `92s`, `font-semibold`, `clamp(3rem, 7.2vw, 6.6rem)`, `5.5%` 투명도

### 구현 플랜

1. 섹션 하단에 `overflow-hidden` 래퍼를 만들고, 장식 요소이므로 `aria-hidden="true"`를 적용한다.
2. 같은 문구를 두 번 이어 붙여서 끊김 없이 반복되는 마키 구조를 만든다.
3. 텍스트는 전부 대문자로 사용하고, 폰트 크기는 화면 폭에 따라 크게 반응하도록 잡는다.
4. 색상은 딥 블루 계열을 사용하되 투명도는 `6% ~ 10%` 정도로 낮춰 배경처럼 보이게 한다.
5. 애니메이션은 `translateX(0)`에서 `translateX(-50%)`로 이동시키고, `80s ~ 100s linear infinite` 정도로 천천히 흐르게 한다.
6. 사용자가 움직임 감소 설정을 켠 경우에는 `prefers-reduced-motion`에서 애니메이션을 멈춘다.

### 적용 문구 후보

```text
YONSEI CHEOK HOSPITAL · NECK DISC CLINIC · CERVICAL DISC CENTER ·
```

## 2026-07-09 - 스크롤 리빌 스태거

- 효과 이름: `Scroll Reveal`, `Staggered Reveal`, `Intersection Reveal`
- 목적: 사용자가 스크롤을 내릴 때 콘텐츠가 순차적으로 등장해 섹션의 흐름과 집중도를 높인다.
- 현재 구현 위치: `src/components/ScrollReveal.tsx`, `src/app/(public)/treatments/spine/neck-disc/page.tsx`
- 방향 구성: 섹션 제목은 왼쪽에서 오른쪽으로 들어오는 `slide-right`, 카드와 리스트는 아래에서 위로 올라오는 `fade-up`
- 시간차: 각 카드와 원인 리스트에 `0.07s ~ 0.08s` 간격의 `delay`를 적용한다.
- 접근성: 사용자가 움직임 감소 설정을 켠 경우 `useReducedMotion`으로 애니메이션을 제거한다.
- 콘텐츠 원칙: 별도 요청이 없으면 섹션 상단에 영문 보조 라벨을 추가하지 않는다.

## 2026-07-09 - 딤드 모달 팝업

- 효과 이름: `Modal Popup`, `Dimmed Overlay`, `Scrollable Dialog`
- 목적: 질환명을 클릭했을 때 페이지 이동 없이 상세 정보를 집중해서 확인하게 한다.
- 현재 구현 위치: `src/components/NeckDiseaseSection.tsx`
- 구성: 배경은 어둡게 딤 처리하고, 중앙 팝업에는 딥 블루 헤더, 이미지, 설명, 증상, 원인을 세로 스크롤로 배치한다.
- 인터랙션: 질환 버튼 클릭으로 열고, 닫기 버튼·배경 클릭·`Escape` 키로 닫는다.
- 접근성: `role="dialog"`, `aria-modal="true"`를 적용하고 팝업이 열린 동안 본문 스크롤을 잠근다.

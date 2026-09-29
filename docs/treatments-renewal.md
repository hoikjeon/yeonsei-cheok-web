# 진료안내 리뉴얼 이미지와 검색 설정

- 작업 페이지: /treatments
- 제작: 기본 제공 image_gen 도구 (imagegen 스킬), 2026-09-29
- 새 이미지: public/images/treatments/overview/spine-hero.webp, public/images/treatments/overview/joint-care.webp
- 생성 원본은 Codex generated_images에 보존, 웹용 WebP는 프로젝트에 저장.
- 기존 목디스크, 비수술 시술, 도수치료 설명 이미지는 각 진료 페이지의 자산을 재사용.
- 모든 의료 이미지는 설명용이며 실제 환자의 진단 영상 또는 실제 시술 증빙으로 표현하지 않음.

## 척추 히어로 최종 프롬프트
Use case: stylized-concept. Asset type: premium Korean spine hospital website hero, wide landscape 1536x1024. Create a refined 3D medical editorial illustration of a lumbar spine, ivory vertebrae with translucent blue intervertebral discs and fine nerve roots, a gently curved anatomically plausible segment at right, very subtle warm coral glow at one disc. Background is pale powder blue and pearl white, soft studio daylight, luxurious clean medical visual, realistic ceramic and frosted glass materials. Composition: spine occupies right 55%, generous completely empty light blue left 45% for dark navy HTML headline. No text, logos, labels, watermark, instruments, people or blood. This is conceptual educational artwork not a clinical diagnostic scan.

## 관절 카드 최종 프롬프트
Use case: stylized-concept. Asset type: premium Korean orthopedic hospital website joint-care card, portrait composition. A single anatomically plausible human knee joint in side three-quarter view, ivory femur and tibia with patella and pale blue cartilage, a subtle warm amber glow at the joint space. Elegant photoreal 3D educational concept render in frosted glass and matte ceramic, soft pearl white and pale blue background, soft studio daylight, lots of air around the subject. High-end medical brand, calm and precise. No words, no labels, no logo, no watermark, no people, no instruments, no blood. Match a pearl and navy blue spine hospital design.

## 콘텐츠와 SEO
기존 https://www.ys-cheok.com/treatments 및 각 진료 상세 페이지를 바탕으로 재구성. 병원 주소·전화·진료시간은 기존 홈페이지와 동일하게 표기. 허위 추천·순위·의료진 검수 이력·효과 보장 표현은 추가하지 않음.

서버 렌더링 본문, 단일 H1, 질환별 내부 링크, 설명형 FAQ와 동일한 FAQPage 데이터, MedicalWebPage, BreadcrumbList, 기존 Hospital 엔티티 연결, canonical·Open Graph·Twitter 이미지 적용. 기존 robots.txt는 크롤링 허용, sitemap.xml은 /treatments를 이미 포함하므로 유지. NEXT_PUBLIC_SITE_URL 미설정 시 www.ys-cheok.com을 기본값으로 사용하여 임시 도메인이나 localhost의 canonical 방지.

Google AI 기능에는 별도의 AI 텍스트 파일이나 전용 스키마가 필수라는 근거가 없어 추가하지 않음. 참고: https://developers.google.com/search/docs/appearance/ai-features

배포 후 Search Console에서 실제 /treatments URL 검사 및 색인 요청, sitemap.xml 확인이 필요. 검색 순위와 AI 인용은 보장되지 않음. 이 작업은 로컬 구현이며 배포·Search Console 계정 작업을 포함하지 않음.

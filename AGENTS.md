<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 디자인 규칙 — 반드시 준수

- 섹션의 한글 제목 위에 장식용 영문 소제목(eyebrow/kicker)을 넣지 않습니다. `TREATMENT REVIEWS` 같은 영문 라벨은 사용자 요청 없이 새로 추가하거나 복원하지 않습니다. 기존 섹션을 수정할 때도 이 규칙을 지킵니다.
- 메인 환자 후기의 이미지 프레임은 트레이닝 센터와 동일한 `rounded-xl`(12px)을 사용합니다. 이전의 4px 제한은 사용자의 후속 요청으로 대체되었습니다. 알약형 배지는 넣지 않습니다. 남색 상단 띠와 블루 포인트는 유지하되, 이중 테두리·하단 색 박스를 겹쳐 넣지 않습니다. 이미지 아래에는 제목만 배치하고 날짜와 카드별 화살표는 표시하지 않습니다. 섹션 상하 여백은 모바일 40px·PC 64px로 유지하고 과도하게 늘리지 않습니다.
- 메인 환자 후기 카드에는 장식용 따옴표와 허리·목 등 진료 부위 배지를 표시하지 않습니다. 분류 데이터 자체를 삭제할 필요는 없습니다.
- 메인 환자 후기 이미지에는 흐리게 덮는 그라데이션 오버레이를 넣지 않습니다.

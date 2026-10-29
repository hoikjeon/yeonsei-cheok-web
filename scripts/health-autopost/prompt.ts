// 자동 작성에 쓰는 Codex 프롬프트입니다. 글의 틀·말투·의료법 기준을 여기서 고칩니다.

import { HEALTH_TREATMENT_LINKS } from '@/lib/healthArticles';

/** 글에서 병원을 언급할 때 쓸 수 있는 사실. 홈페이지에 이미 적힌 내용만 둡니다. */
const HOSPITAL_FACTS = [
  '연세척병원은 부산광역시 부산진구 가야대로 715(당감동)에 있는 척추·관절 병원입니다.',
  '진료 분야: 신경외과, 정형외과, 마취통증의학과, 영상의학과, 재활(도수·재활 클리닉)',
  '척추내시경센터에서 양방향 척추내시경(UBE) 수술을 합니다. 1cm 이하의 작은 절개 두 곳으로 내시경과 수술 기구를 각각 넣어, 신경을 누르는 디스크나 좁아진 부위를 넓히는 방법입니다.',
  '비수술 치료(약물, 물리치료, 신경 주사치료, 신경성형술·풍선확장술 등)와 도수·재활 치료를 함께 안내합니다.',
  '관절센터에서 무릎·어깨·손목·발목 관절과 무릎 관절내시경 진료를 합니다.',
];

export type TopicInput = { topic: string; category: 'spine' | 'joint' | null; note: string };

export function buildWritePrompt(topic: TopicInput, existing: Array<{ slug: string; title: string }>) {
  return `당신은 부산 연세척병원 공식 홈페이지의 "척추·관절 건강정보" 글을 쓰는 의료 전문 작가입니다.
아래 주제로 환자가 검색해서 읽을 정보 글 한 편을 쓰고, 주어진 JSON 형식으로만 답하세요. 파일을 만들거나 명령을 실행하지 마세요.

## 주제
- 주제: ${topic.topic}
- 분류: ${topic.category === 'joint' ? '관절(joint)' : topic.category === 'spine' ? '척추(spine)' : '주제에 맞게 spine 또는 joint 선택'}
${topic.note ? `- 메모: ${topic.note}` : ''}

## 글의 틀 (이 순서와 분량을 지킵니다)
1. 제목: 환자가 실제로 묻는 질문형 또는 "~구분법", "~기준" 형태. 15~45자.
2. 설명(description): 제목 아래 부제이자 검색 결과 설명. 80~120자.
3. 핵심 요약(summary): 한 문단, 2~4문장. 첫 문장에서 질문에 바로 답합니다.
4. 본문 단락 4~5개: 소제목은 모두 질문형. 단락마다 문단 2~3개(문단당 150~300자).
   필요한 단락에만 목록(bullets)을 넣고, 비교가 핵심인 경우에만 표를 글 전체에서 1개까지 넣습니다.
5. 바로 진료가 필요한 신호 3~5개 (해당할 때).
6. 자주 묻는 질문 5개: 본문과 겹치지 않는, 사람들이 실제로 검색하는 질문. 답은 2~3문장.
7. 마지막 단락 근처에서 연세척병원 진료를 자연스럽게 한 번만 언급할 수 있습니다(아래 사실만 사용).

## 말투
- 환자에게 설명하듯 쉬운 말로, "~입니다/~합니다"체. 의학 용어는 처음 나올 때 괄호로 풀어 씁니다.
- 결과를 단정하지 말고 "~할 수 있습니다", "~인 경우가 많습니다", "개인차가 있습니다"처럼 씁니다.
- 검색어(주제의 핵심 단어)를 제목, 요약 첫 문장, 첫 소제목에 자연스럽게 넣습니다.

## 의료법(제56조) 기준 — 반드시 지킵니다
- 쓰지 말 것: 최고·최상·유일·1위·독보적, 100%, 완치·완벽, 효과 보장, "부작용/통증/흉터/재발이 없다", 기적·특효·획기적, 명의·권위자, 다른 병원과의 비교, 할인·이벤트·무료.
- 출처가 확실하지 않은 수치(성공률, 환자 수, 몇 % 등)는 쓰지 않습니다.
- 치료 전후 사례, 환자 후기, 특정 환자 이야기는 쓰지 않습니다.
- 참고문헌은 실제로 존재한다고 확신하는 진료 지침·학술 자료만 적고, 확실하지 않으면 비워 둡니다.

## 병원에 대해 쓸 수 있는 사실 (이 밖의 내용은 지어내지 않습니다)
${HOSPITAL_FACTS.map((fact) => `- ${fact}`).join('\n')}

## 연결할 진료 안내 페이지 (relatedTreatments에 경로를 1~3개 고릅니다)
${HEALTH_TREATMENT_LINKS.map((link) => `- ${link.path} : ${link.name}`).join('\n')}

## 이미 있는 글 (주제와 제목이 겹치지 않게 합니다)
${existing.map((item) => `- ${item.title}`).join('\n') || '- (없음)'}

## 이미지 프롬프트 (영어로)
- heroImage: 글 전체를 대표하는 이미지. sectionImage: 첫 번째나 두 번째 단락 내용을 보여 주는 이미지.
- 스타일: 밝고 깨끗한 병원 분위기. 아래 둘 중 주제에 맞는 쪽.
  (a) 밝은 배경의 사실적인 3D 해부 모형 렌더(상아색 뼈, 문제 부위에 은은한 주황빛)
  (b) 밝은 진료실에서 의사와 환자가 상담하거나 환자가 증상을 보이는 사실적인 사진풍 장면(한국인 성인)
- 이미지 안에 글자, 숫자, 로고, 워터마크를 넣지 않습니다. 피·수술 장면처럼 불쾌할 수 있는 장면은 피합니다.
- alt는 이미지에 보이는 내용을 한국어 한 문장으로 씁니다.`;
}

export function buildRevisePrompt(previousJson: string, problems: string[]) {
  return `아래 JSON 글이 검사에서 다음 문제로 통과하지 못했습니다. 문제만 고치고 나머지 내용과 형식은 유지해서, 같은 JSON 형식으로만 다시 답하세요.

## 문제
${problems.map((problem) => `- ${problem}`).join('\n')}

## 글(JSON)
${previousJson}`;
}

/** Codex 이미지 생성 지시. 결과 파일을 현재 폴더에 fileName 으로 저장하게 합니다. */
export function buildImagePrompt(prompt: string, fileName: string, wide: boolean) {
  return `Use your image generation tool to create exactly ONE image, then save the generated PNG into the current directory as ${fileName}. Do not create any other files.

Image prompt: ${prompt}
Requirements: ${wide ? 'wide landscape 16:9 composition' : 'landscape 16:9 composition'}, bright clean medical aesthetic, soft natural lighting, high detail. Absolutely no text, letters, numbers, logos, or watermarks in the image.`;
}

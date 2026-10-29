// 자동 작성 글이 발행되기 전에 거치는 문구 검사입니다.
// 의료법 제56조와 의료광고 심의 기준에서 문제가 되는 표현을 막고, 글 형식이 틀을 벗어나지 않았는지 봅니다.
// 여기서 걸리면 글은 발행되지 않고 임시저장으로 남습니다.

import type { HealthArticle } from '@/lib/healthArticles';

const BANNED: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /최고|최상|최상급|넘버\s*원|No\.?\s*1|1위|일등/i, reason: '최상급·순위 표현' },
  { pattern: /유일(한|하게)?|독보적/, reason: '유일·독보 표현' },
  { pattern: /100\s*%|백\s*퍼센트/, reason: '100% 표현' },
  { pattern: /완치|완벽(한|하게)?|확실(한|하게|히)\s*(낫|치료|효과)/, reason: '치료 결과를 단정하는 표현' },
  { pattern: /보장(합니다|해|된다|됩니다)|책임\s*지(고|겠)/, reason: '효과 보장 표현' },
  { pattern: /부작용(이|은)?\s*(전혀\s*)?없(는|습니다|어요|음)/, reason: '부작용이 없다는 표현' },
  { pattern: /(통증|흉터|재발)(이|은)?\s*(전혀\s*)?없(는|습니다|어요|음)/, reason: '통증·흉터·재발이 없다는 표현' },
  { pattern: /기적|특효|획기적|혁신적인\s*치료/, reason: '과장 표현' },
  { pattern: /(다른|타)\s*병원(보다|과\s*달리|에서는\s*못)/, reason: '다른 병원과 비교하는 표현' },
  { pattern: /할인|이벤트|무료\s*(시술|수술|치료)|특가/, reason: '가격 할인·이벤트 표현' },
  { pattern: /명의|권위자/, reason: '의료진을 과장하는 표현' },
];

/** 글에 보이는 모든 문장을 모읍니다. */
function articleTexts(article: HealthArticle) {
  return [
    article.title,
    article.seoTitle ?? '',
    article.description,
    ...article.summary,
    ...article.sections.flatMap((section) => [
      section.heading,
      section.lead ?? '',
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
      section.table?.caption ?? '',
      ...(section.table?.rows.flat() ?? []),
      section.image?.alt ?? '',
    ]),
    ...article.warningSigns,
    ...article.faq.flatMap((item) => [item.question, item.answer]),
    article.heroImage?.alt ?? '',
  ].filter(Boolean);
}

/** 문제가 있으면 사람이 읽을 수 있는 설명 목록을, 없으면 빈 배열을 돌려줍니다. */
export function lintHealthArticle(article: HealthArticle): string[] {
  const problems: string[] = [];
  for (const text of articleTexts(article)) {
    for (const { pattern, reason } of BANNED) {
      const match = text.match(pattern);
      if (match) problems.push(`${reason}: "${match[0]}" — ${text.slice(0, 60)}${text.length > 60 ? '…' : ''}`);
    }
  }
  if (article.title.length < 10 || article.title.length > 60) problems.push(`제목은 10~60자여야 합니다 (${article.title.length}자).`);
  if (article.description.length < 50 || article.description.length > 160) problems.push(`목록 설명은 50~160자여야 합니다 (${article.description.length}자).`);
  if (article.sections.length < 3 || article.sections.length > 6) problems.push(`본문 단락은 3~6개여야 합니다 (${article.sections.length}개).`);
  if (article.faq.length < 3) problems.push(`자주 묻는 질문은 3개 이상이어야 합니다 (${article.faq.length}개).`);
  const bodyLength = article.sections.flatMap((section) => [section.lead ?? '', ...(section.paragraphs ?? []), ...(section.bullets ?? [])]).join('').length;
  if (bodyLength < 1000) problems.push(`본문이 너무 짧습니다 (${bodyLength}자, 1,000자 이상).`);
  return [...new Set(problems)];
}

// 건강정보 글의 영문 주소(/health/<주소>)를 제목에서 추천합니다.
// 검색엔진은 주소의 낱말도 읽으므로 'health-20261111-ab3f' 같은 무의미한 주소보다
// 'knee-swelling-cartilage' 처럼 내용이 드러나는 주소가 유리합니다.
// 기계 번역이 아니라 자주 쓰는 척추·관절 용어 사전으로 바꾸므로, 사전에 없는 낱말은 빠집니다.

const TERMS: Record<string, string> = {
  // 척추
  허리디스크: 'lumbar-disc', 목디스크: 'cervical-disc', 디스크: 'disc', 추간판: 'disc', 척추관협착증: 'spinal-stenosis', 협착증: 'stenosis',
  척추전방전위증: 'spondylolisthesis', 전방전위증: 'spondylolisthesis', 척추측만증: 'scoliosis', 측만증: 'scoliosis', 좌골신경통: 'sciatica',
  압박골절: 'compression-fracture', 골다공증: 'osteoporosis', 척추: 'spine', 허리: 'back', 요통: 'back-pain', 거북목: 'forward-head', 일자목: 'straight-neck',
  목통증: 'neck-pain', 경추: 'cervical', 요추: 'lumbar', 신경: 'nerve',
  // 관절
  무릎: 'knee', 어깨: 'shoulder', 손목: 'wrist', 발목: 'ankle', 고관절: 'hip', 팔꿈치: 'elbow', 엉덩이: 'buttock', 다리: 'leg', 발바닥: 'sole',
  퇴행성관절염: 'osteoarthritis', 관절염: 'arthritis', 퇴행성: 'degenerative', 반월상연골: 'meniscus', 연골: 'cartilage', 십자인대: 'acl', 인대: 'ligament',
  회전근개: 'rotator-cuff', 오십견: 'frozen-shoulder', 석회성건염: 'calcific-tendinitis', 힘줄: 'tendon', 족저근막염: 'plantar-fasciitis',
  손목터널증후군: 'carpal-tunnel', 인공관절: 'joint-replacement', 관절: 'joint', 골절: 'fracture',
  // 증상
  통증: 'pain', 저림: 'numbness', 저리: 'numbness', 붓기: 'swelling', 붓고: 'swelling', 부종: 'swelling', 마비: 'weakness', 증상: 'symptoms', 초기: 'early', 원인: 'causes',
  // 진단·치료
  자가진단: 'self-check', 체크리스트: 'checklist', 진단: 'diagnosis', 검사: 'test', 비수술: 'non-surgical', 수술: 'surgery', 치료: 'treatment',
  양방향: 'biportal', 내시경: 'endoscopy', 신경차단술: 'nerve-block', 주사: 'injection', 도수치료: 'manual-therapy', 물리치료: 'physical-therapy',
  재활: 'rehab', 회복: 'recovery', 운동: 'exercise', 스트레칭: 'stretching', 자세: 'posture', 예방: 'prevention', 관리: 'care',
  차이: 'difference', 비용: 'cost', 기간: 'duration', 계단: 'stairs', 걷기: 'walking', 베개: 'pillow', 음식: 'diet', 수면: 'sleep',
};
const KEYS = Object.keys(TERMS).sort((a, b) => b.length - a.length);

function words(text: string) {
  const found: string[] = [];
  const source = text.replace(/\s+/g, '');
  for (let i = 0; i < source.length;) {
    const latin = source.slice(i).match(/^[A-Za-z][A-Za-z0-9]{1,}/);
    if (latin) { found.push(latin[0].toLowerCase()); i += latin[0].length; continue; }
    const key = KEYS.find((term) => source.startsWith(term, i));
    if (key) { found.push(TERMS[key]); i += key.length; } else i += 1;
  }
  return found;
}

/**
 * 제목(모자라면 검색어)에서 영문 주소를 추천합니다. 알아볼 낱말이 없으면 빈 문자열입니다.
 * 이미 쓰인 주소와 겹치면 뒤에 -2, -3 을 붙입니다.
 */
export function suggestHealthSlug(title: string, keywords: string, taken: string[]): string {
  let parts = [...new Set(words(title).flatMap((word) => word.split('-')))];
  if (parts.length < 2) parts = [...new Set([...parts, ...words(keywords).flatMap((word) => word.split('-'))])];
  if (!parts.length) return '';
  const base = parts.slice(0, 5).join('-').slice(0, 60).replace(/-+$/, '');
  let slug = base;
  for (let n = 2; taken.includes(slug); n += 1) slug = `${base}-${n}`;
  return slug;
}

/** 자동으로 붙인 임시 주소(health-날짜-무작위)인지 */
export const isGeneratedHealthSlug = (slug: string) => /^health-\d{8}-[a-z0-9]{4}$/.test(slug);

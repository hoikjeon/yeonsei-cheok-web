// 건강정보 자동 작성·예약 발행 스크립트
//
// 비어 있는 발행 칸(HEALTH_PUBLISH_SLOTS, 지금은 매일 09:00 한국 시간)을 찾아, 주제 대기열(health_topics)에서 주제를 하나씩 꺼내
// Codex(GPT)로 글과 이미지를 만들고 그 시각에 올라가도록 예약해 둡니다.
// 홈페이지는 발행 시각이 지난 글만 보여 주므로, 이 스크립트는 미리 며칠치를 채워 두기만 하면 됩니다.
//
// 실행: npm run health:autopost                (앞으로 3일치 빈 칸 채우기)
//       npm run health:autopost -- --dry-run   (DB에 넣지 않고 output/health-autopost 에 결과만 저장)
//       npm run health:autopost -- --dry-run --topic "척추관협착증 걷기 운동"   (대기열 대신 주제를 직접 지정)
//       npm run health:autopost -- --days 7 --max 4
//
// 필요한 것: .env.local 의 Supabase 키, 이 Mac에 로그인된 Codex(Antigravity의 ChatGPT 확장)

import { randomUUID } from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, appendFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import {
  HEALTH_PUBLISH_SLOTS,
  kstToIso,
  toKstDate,
  type HealthArticle,
} from '@/lib/healthArticles';
import { HEALTH_SLUG_PATTERN, healthArticleToRow, parseHealthArticleInput } from '@/lib/healthArticleRecord';
import { lintHealthArticle } from '@/lib/healthMedicalLint';
import { buildImagePrompt, buildRevisePrompt, buildWritePrompt, type TopicInput } from './prompt';

const ROOT = process.cwd();
loadEnvConfig(ROOT);

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string, fallback: number) => {
  const index = args.indexOf(`--${name}`);
  const value = index >= 0 ? Number(args[index + 1]) : NaN;
  return Number.isFinite(value) && value > 0 ? value : fallback;
};
const DRY_RUN = flag('dry-run');
const TOPIC_ARG = args.includes('--topic') ? args[args.indexOf('--topic') + 1] ?? '' : '';
const DAYS = option('days', 3);
const MAX = option('max', DAYS * HEALTH_PUBLISH_SLOTS.length);
const CODEX_TIMEOUT_MS = 15 * 60 * 1000;

const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-');
const WORK_DIR = path.join(ROOT, 'output', 'health-autopost', RUN_ID);
const LOG_FILE = path.join(ROOT, 'logs', 'health-autopost', `${toKstDate(new Date().toISOString())}.log`);
mkdirSync(WORK_DIR, { recursive: true });
mkdirSync(path.dirname(LOG_FILE), { recursive: true });

function log(message: string) {
  const line = `[${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}] ${message}`;
  console.log(line);
  appendFileSync(LOG_FILE, `${line}\n`);
}

/** Antigravity 확장이 업데이트되면 폴더 이름이 바뀌므로, 가장 최근 것을 찾습니다. CODEX_BIN 으로 직접 지정할 수도 있습니다. */
function findCodex() {
  if (process.env.CODEX_BIN && existsSync(process.env.CODEX_BIN)) return process.env.CODEX_BIN;
  const candidates: string[] = [];
  for (const base of ['.antigravity-ide/extensions', '.antigravity/extensions', '.vscode/extensions', '.cursor/extensions']) {
    const dir = path.join(homedir(), base);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.startsWith('openai.chatgpt-')) continue;
      const bin = path.join(dir, name, 'bin', 'macos-aarch64', 'codex');
      if (existsSync(bin)) candidates.push(bin);
    }
  }
  candidates.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  if (candidates[0]) return candidates[0];
  try { return execFileSync('/usr/bin/which', ['codex'], { encoding: 'utf8' }).trim(); } catch { /* not installed */ }
  throw new Error('Codex 실행 파일을 찾지 못했습니다. Antigravity의 ChatGPT 확장이 설치되어 있는지 확인하거나 CODEX_BIN 을 지정해주세요.');
}

const CODEX = findCodex();

/** codex exec 를 실행하고 끝날 때까지 기다립니다. 프롬프트는 stdin 으로 넘깁니다. */
function runCodex(codexArgs: string[], prompt: string, cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(CODEX, ['exec', '--skip-git-repo-check', '--ephemeral', '-C', cwd, ...codexArgs, '-'], { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    const timer = setTimeout(() => { child.kill('SIGTERM'); reject(new Error('Codex 응답 시간이 초과되었습니다.')); }, CODEX_TIMEOUT_MS);
    child.on('error', (error) => { clearTimeout(timer); reject(error); });
    child.on('close', (code) => {
      clearTimeout(timer);
      appendFileSync(path.join(cwd, 'codex.log'), `\n===== codex ${codexArgs.join(' ')} (exit ${code}) =====\n${output}`);
      if (code === 0) resolve();
      else reject(new Error(`Codex가 오류로 끝났습니다(exit ${code}). ${output.trim().split('\n').slice(-3).join(' ')}`));
    });
    child.stdin.end(prompt);
  });
}

type GeneratedArticle = {
  slug: string; category: 'spine' | 'joint'; title: string; seoTitle: string; description: string; keywords: string[]; summary: string;
  sections: Array<{ heading: string; lead: string; paragraphs: string[]; bullets: string[]; table: { caption: string; columns: string[]; rows: string[][] } }>;
  warningSigns: string[]; faq: Array<{ question: string; answer: string }>; references: Array<{ label: string; url: string }>;
  relatedTreatments: string[]; heroImage: { prompt: string; alt: string }; sectionImage: { sectionIndex: number; prompt: string; alt: string };
};

async function writeWithCodex(prompt: string, dir: string, name: string): Promise<GeneratedArticle> {
  const out = path.join(dir, `${name}.json`);
  await runCodex(['-s', 'read-only', '--output-schema', path.join(ROOT, 'scripts', 'health-autopost', 'article.schema.json'), '-o', out], prompt, dir);
  if (!existsSync(out)) throw new Error('Codex가 글 결과를 남기지 않았습니다.');
  const text = readFileSync(out, 'utf8').trim();
  // 혹시 코드 블록으로 감싸 오면 벗겨 냅니다.
  return JSON.parse(text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')) as GeneratedArticle;
}

/** 생성 결과를 사이트 글 형식으로 바꿉니다. 이미지는 아직 붙이지 않습니다. */
function toArticleInput(generated: GeneratedArticle, slug: string, relatedSlugs: string[]) {
  return {
    slug,
    category: generated.category,
    title: generated.title,
    seoTitle: generated.seoTitle && generated.seoTitle !== generated.title ? generated.seoTitle : '',
    description: generated.description,
    keywords: generated.keywords,
    summary: [generated.summary],
    sections: generated.sections.map((section) => ({
      heading: section.heading,
      lead: section.lead,
      paragraphs: section.paragraphs,
      bullets: section.bullets,
      ...(section.table?.columns?.length ? { table: section.table } : {}),
    })),
    warningSigns: generated.warningSigns,
    faq: generated.faq,
    references: generated.references,
    relatedTreatments: generated.relatedTreatments,
    relatedSlugs,
    // 자동 작성 글은 의료진 검토 전이므로 검토 표시를 붙이지 않습니다.
    reviewerId: '',
    reviewedAt: '',
    publishedAt: '',
  };
}

/** 같은 분류에서 검색어가 많이 겹치는 글을 함께 읽을 글로 고릅니다. */
function pickRelated(generated: GeneratedArticle, existing: ExistingArticle[]) {
  const words = new Set(generated.keywords.flatMap((keyword) => keyword.split(/\s+/)));
  return existing
    .map((item) => ({ item, score: (item.category === generated.category ? 2 : 0) + item.keywords.flatMap((keyword) => keyword.split(/\s+/)).filter((word) => words.has(word)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item.slug);
}

/** GPT가 지어낸 참고문헌을 거르기 위해, 주소가 열리고 그 페이지에 제목이 실제로 있는 자료만 남깁니다. 주소가 없는 자료도 뺍니다. */
async function verifyReferences(references: GeneratedArticle['references']) {
  const checked = await Promise.all(references.map(async (reference) => {
    if (!/^https:\/\//.test(reference.url)) return null;
    try {
      const response = await fetch(reference.url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh) health-autopost reference check' } });
      if (!response.ok) return null;
      // 주소가 열려도 다른 논문일 수 있어, 제목의 긴 단어 절반 이상이 페이지에 있는지 봅니다.
      const page = (await response.text()).toLowerCase();
      const words = [...new Set(reference.label.toLowerCase().match(/[a-z]{5,}/g) ?? [])];
      const found = words.filter((word) => page.includes(word)).length;
      return words.length >= 3 && found / words.length >= 0.5 ? reference : null;
    } catch { return null; }
  }));
  return checked.filter((reference) => reference !== null);
}

async function generateImage(prompt: string, dir: string, name: string) {
  const png = path.join(dir, `${name}.png`);
  await runCodex(['-s', 'workspace-write'], buildImagePrompt(prompt, `${name}.png`, name === 'hero'), dir);
  if (!existsSync(png)) throw new Error(`이미지 파일(${name}.png)이 만들어지지 않았습니다.`);
  const webp = path.join(dir, `${name}.webp`);
  await sharp(png).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(webp);
  return webp;
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function uploadImage(file: string) {
  const storagePath = `health/${randomUUID()}.webp`;
  const { error } = await supabase.storage.from('reviews').upload(storagePath, readFileSync(file), { contentType: 'image/webp', cacheControl: '31536000', upsert: false });
  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);
  return supabase.storage.from('reviews').getPublicUrl(storagePath).data.publicUrl;
}

type ExistingArticle = { slug: string; title: string; category: string; keywords: string[] };

async function loadExisting(): Promise<ExistingArticle[]> {
  const { data, error } = await supabase.from('health_articles').select('slug, title, category, content');
  if (error) throw new Error(`기존 글을 불러오지 못했습니다: ${error.message}`);
  return (data ?? []).map((row) => ({ slug: row.slug, title: row.title, category: row.category, keywords: (row.content?.keywords as string[] | undefined) ?? [] }));
}

/** 앞으로 DAYS 일 동안의 발행 칸 중 아직 글이 없는 칸 */
async function findEmptySlots() {
  const now = Date.now();
  const slots: string[] = [];
  const today = toKstDate(new Date().toISOString());
  for (let day = 0; day <= DAYS; day += 1) {
    const date = toKstDate(new Date(new Date(`${today}T00:00:00+09:00`).getTime() + day * 86_400_000).toISOString());
    // 30분 이내로 임박한 칸은 글·이미지를 만들 시간이 모자라 건너뜁니다.
    for (const time of HEALTH_PUBLISH_SLOTS) {
      const iso = kstToIso(date, time);
      if (new Date(iso).getTime() > now + 30 * 60 * 1000 && new Date(iso).getTime() <= now + DAYS * 86_400_000) slots.push(iso);
    }
  }
  if (!slots.length) return [];
  const { data, error } = await supabase.from('health_articles').select('publish_at').eq('is_published', true).gte('publish_at', slots[0]).lte('publish_at', slots.at(-1)!);
  if (error) throw new Error(`예약 현황을 확인하지 못했습니다: ${error.message}`);
  const taken = new Set((data ?? []).map((row) => new Date(row.publish_at).toISOString()));
  return slots.filter((slot) => !taken.has(slot));
}

type Topic = TopicInput & { id: string };

/** 가장 오래된 대기 주제를 하나 꺼내 "작성 중"으로 바꿉니다. 다른 실행과 겹치면 다음 주제를 봅니다. */
async function claimTopic(): Promise<Topic | null> {
  if (TOPIC_ARG) return { id: 'manual-topic', topic: TOPIC_ARG, category: null, note: '' };
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await supabase.from('health_topics').select('id, topic, category, note').eq('status', 'queued').order('created_at').limit(1).maybeSingle();
    if (error) throw new Error(`주제 대기열을 읽지 못했습니다: ${error.message}`);
    if (!data) return null;
    if (DRY_RUN) return data as Topic;
    const { data: claimed } = await supabase.from('health_topics').update({ status: 'processing', updated_at: new Date().toISOString() }).eq('id', data.id).eq('status', 'queued').select('id').maybeSingle();
    if (claimed) return data as Topic;
  }
  return null;
}

async function finishTopic(id: string, patch: { status: 'done' | 'failed' | 'queued'; article_slug?: string; error?: string | null }) {
  if (DRY_RUN || id === 'manual-topic') return;
  await supabase.from('health_topics').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
}

function uniqueSlug(base: string, taken: Set<string>) {
  let slug = HEALTH_SLUG_PATTERN.test(base) ? base.slice(0, 70) : `health-${Date.now().toString(36)}`;
  for (let n = 2; taken.has(slug); n += 1) slug = `${base.slice(0, 66)}-${n}`;
  return slug;
}

async function createArticle(topic: Topic, slot: string, existing: ExistingArticle[]) {
  const dir = path.join(WORK_DIR, topic.id);
  mkdirSync(dir, { recursive: true });

  log(`  글 작성 중: ${topic.topic}`);
  let generated = await writeWithCodex(buildWritePrompt(topic, existing), dir, 'article');
  const slug = uniqueSlug(generated.slug, new Set(existing.map((item) => item.slug)));
  const build = (value: GeneratedArticle) => parseHealthArticleInput(toArticleInput(value, slug, pickRelated(value, existing)));

  const references = await verifyReferences(generated.references);
  if (references.length < generated.references.length) log(`  참고문헌 ${generated.references.length - references.length}건은 주소가 열리지 않아 뺐습니다.`);
  generated = { ...generated, references };
  let article: HealthArticle = build(generated);
  let problems = lintHealthArticle(article);
  if (problems.length) {
    log(`  검사에서 ${problems.length}건 발견 → 한 번 고쳐 쓰기`);
    generated = await writeWithCodex(buildRevisePrompt(JSON.stringify(generated), problems), dir, 'article-revised');
    generated = { ...generated, references: await verifyReferences(generated.references) };
    article = build(generated);
    problems = lintHealthArticle(article);
  }

  // 이미지는 실패해도 글은 올립니다. 대표 이미지가 없으면 목록은 기본 썸네일을 씁니다.
  for (const [key, spec] of [['hero', generated.heroImage], ['section', generated.sectionImage]] as const) {
    if (!spec?.prompt) continue;
    try {
      log(`  이미지 생성 중: ${key}`);
      const file = await generateImage(spec.prompt, dir, key);
      const src = DRY_RUN ? path.relative(ROOT, file) : await uploadImage(file);
      const image = { src: DRY_RUN ? `/${src}` : src, alt: spec.alt.slice(0, 150) || article.title };
      if (key === 'hero') article.heroImage = image;
      else {
        const index = Math.min(Math.max(0, generated.sectionImage.sectionIndex), article.sections.length - 1);
        article.sections[index] = { ...article.sections[index], image };
      }
    } catch (error) {
      log(`  이미지(${key}) 실패, 이미지 없이 진행: ${error instanceof Error ? error.message : error}`);
    }
  }

  // 검사를 통과하지 못한 글은 발행하지 않고 임시저장으로 남겨 관리자가 고치게 합니다.
  const publishable = problems.length === 0;
  writeFileSync(path.join(dir, 'final.json'), JSON.stringify({ slot, publishable, problems, article }, null, 2));
  if (DRY_RUN) return { slug, publishable, problems };

  const row = healthArticleToRow(article, { isPublished: publishable, publishAt: slot });
  const { error } = await supabase.from('health_articles').insert({ ...row, source: 'auto' });
  if (error) throw new Error(`글 저장 실패: ${error.message}`);
  existing.push({ slug, title: article.title, category: article.category, keywords: article.keywords });
  return { slug, publishable, problems };
}

async function main() {
  log(`=== 자동 작성 시작${DRY_RUN ? ' (dry-run: DB에 넣지 않음)' : ''} · ${DAYS}일치, 최대 ${MAX}편 · codex: ${CODEX}`);
  const slots = DRY_RUN ? [kstToIso(toKstDate(new Date(Date.now() + 86_400_000).toISOString()), HEALTH_PUBLISH_SLOTS[0])] : (await findEmptySlots()).slice(0, MAX);
  if (!slots.length) { log('빈 발행 칸이 없습니다. 끝.'); return; }
  log(`빈 칸 ${slots.length}개: ${slots.map((slot) => new Date(slot).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })).join(', ')}`);

  const existing = await loadExisting();
  let made = 0;
  for (const slot of slots) {
    const topic = await claimTopic();
    if (!topic) { log('대기 중인 주제가 없습니다. 관리자 > 건강정보 관리 > 자동 작성 주제에서 추가해주세요.'); break; }
    log(`[${new Date(slot).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}] 주제: ${topic.topic}`);
    try {
      const result = await createArticle(topic, slot, existing);
      if (result.publishable) {
        await finishTopic(topic.id, { status: 'done', article_slug: result.slug, error: null });
        log(DRY_RUN ? `  ✓ 작성 완료(dry-run, 저장 안 함): ${result.slug}` : `  ✓ 예약 완료: /health/${result.slug}`);
        made += 1;
      } else {
        await finishTopic(topic.id, { status: 'failed', article_slug: result.slug, error: `문구 검사를 통과하지 못해 임시저장했습니다: ${result.problems.join(' / ').slice(0, 900)}` });
        log(`  ✗ 문구 검사 미통과 → 임시저장: ${result.problems.join(' / ')}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await finishTopic(topic.id, { status: 'failed', error: message.slice(0, 900) });
      log(`  ✗ 실패: ${message}`);
    }
  }
  log(`=== 끝: ${made}편 예약 · 작업 파일 ${path.relative(ROOT, WORK_DIR)}`);
}

main().catch((error) => {
  log(`!!! 중단: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});

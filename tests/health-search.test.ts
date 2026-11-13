import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { indexNowOutcome, parseSearchXml } from '../src/lib/healthSearchProtocol';
import { isHealthCronAuthorized } from '../src/lib/healthSearchCron';
import { auditHealthSearch } from '../src/lib/healthSearchAudit';
import { healthArticleTimes } from '../src/lib/healthArticleTimes';
import { createClient } from '@supabase/supabase-js';
import { processHealthSearchJobs } from '../src/lib/healthSearchWorker';

test('lastmod uses actual write time, never a future review date or a pre-publication edit', () => {
  const article = { publishedAt: '2026-11-13', publishAt: '2026-11-13T01:00:00Z', updatedAt: '2026-11-13T02:00:00Z', reviewedAt: '2026-12-01' };
  assert.equal(healthArticleTimes(article).modified, '2026-11-13T02:00:00.000Z');
  assert.equal(healthArticleTimes({ ...article, updatedAt: '2026-11-12T00:00:00Z' }).modified, '2026-11-13T01:00:00.000Z');
});

test('audit compares DB truth, checks broken links, rejects private entries, and does not fetch external locations', async () => {
  const base = 'https://www.ys-cheok.com';
  const requests: string[] = [];
  const mock = (async (input: string | URL | Request) => {
    const url = String(input); requests.push(url);
    if (url.endsWith('/sitemap.xml')) return new Response(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${base}/health/stale</loc><lastmod>2026-11-10</lastmod></url>
      <url><loc>${base}/health/private</loc></url><url><loc>https://external.invalid/private</loc></url></urlset>`);
    if (url.endsWith('/rss.xml')) return new Response(`<rss><channel><item><link>${base}/health/stale</link></item></channel></rss>`);
    if (url.endsWith('.txt')) return new Response('wrong key');
    return new Response(null, { status: url.endsWith('/missing') ? 404 : 200 });
  }) as typeof fetch;
  const report = await auditHealthSearch(base, [{ slug: 'missing', modified: '2026-11-13' }, { slug: 'stale', modified: '2026-11-13' }], mock);
  for (const issue of ['사이트맵 누락', '수정일 불일치', '비공개', '대표 URL 형식', 'RSS 누락', '키 파일 내용', 'HTTP 404']) assert.ok(report.issues.some((text) => text.includes(issue)), issue);
  assert.equal(requests.some((url) => url.startsWith('https://external.invalid')), false);
  assert.equal(report.checkedLinks, 3);
});

test('audit accepts matching sitemap/RSS and reports malformed XML and network errors', async () => {
  const base = 'https://www.ys-cheok.com';
  const key = 'c403158c0fa8a735b973b3123c774955';
  const mock = (async (input: string | URL | Request) => {
    const url = String(input);
    if (url.endsWith('/sitemap.xml')) return new Response(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/health/live</loc><lastmod>2026-11-13</lastmod></url></urlset>`);
    if (url.endsWith('/rss.xml')) return new Response(`<rss><channel><item><link>${base}/health/live</link></item></channel></rss>`);
    return new Response(url.endsWith('.txt') ? key : 'ok');
  }) as typeof fetch;
  assert.deepEqual((await auditHealthSearch(base, [{ slug: 'live', modified: '2026-11-13' }], mock)).issues, []);
  const failing = (async (input: string | URL | Request) => {
    if (String(input).endsWith('.xml')) return new Response('<broken>');
    throw new Error('timeout');
  }) as typeof fetch;
  const report = await auditHealthSearch(base, [{ slug: 'live', modified: '2026-11-13' }], failing);
  assert.equal(report.issues.length, 4);
});

test('IndexNow distinguishes accepted, key verification, retryable failures, permanent failures and retry limit', () => {
  assert.equal(indexNowOutcome(200, 1).status, 'accepted');
  assert.equal(indexNowOutcome(202, 1).status, 'key_pending');
  for (const status of [null, 408, 429, 500, 503]) {
    assert.equal(indexNowOutcome(status, 1, null, 0).retryAt, '1970-01-01T00:01:00.000Z');
    assert.equal(indexNowOutcome(status, 8).status, 'failed');
  }
  for (const status of [301, 400, 403, 422]) assert.equal(indexNowOutcome(status, 1).status, 'failed');
  assert.equal(indexNowOutcome(429, 2, '600', 0).retryAt, '1970-01-01T00:10:00.000Z');
  assert.equal(indexNowOutcome(503, 2, 'Thu, 01 Jan 1970 00:10:00 GMT', 0).retryAt, '1970-01-01T00:10:00.000Z');
});

test('XML parser rejects malformed sitemap, missing namespace, bad lastmod and entity declarations', () => {
  const sitemap = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.ys-cheok.com/health/test</loc><lastmod>2026-11-13T00:00:00Z</lastmod></url></urlset>';
  assert.equal(parseSearchXml(sitemap, 'sitemap')[0].url, 'https://www.ys-cheok.com/health/test');
  for (const xml of [sitemap.replace('</url>', ''), sitemap.replace(' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"', ''), sitemap.replace('2026-11-13T00:00:00Z', 'broken'), '<!DOCTYPE x><urlset/>']) assert.throws(() => parseSearchXml(xml, 'sitemap'));
  assert.equal(parseSearchXml('<rss version="2.0"><channel><item><link>https://www.ys-cheok.com/health/test</link></item></channel></rss>', 'rss').length, 1);
});

test('cron fails closed without secret and rejects forged User-Agent', () => {
  const previous = process.env.CRON_SECRET;
  try {
    delete process.env.CRON_SECRET;
    assert.equal(isHealthCronAuthorized(new Request('https://example.com', { headers: { 'user-agent': 'vercel-cron/1.0' } })), false);
    process.env.CRON_SECRET = 'test-secret';
    assert.equal(isHealthCronAuthorized(new Request('https://example.com', { headers: { authorization: 'Bearer test-secret' } })), true);
    assert.equal(isHealthCronAuthorized(new Request('https://example.com')), false);
  } finally { if (previous === undefined) delete process.env.CRON_SECRET; else process.env.CRON_SECRET = previous; }
});

test('database outbox covers direct writes, reservations, cancellations, leases, retries and delete notifications', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
      CREATE TABLE public.health_articles(slug text PRIMARY KEY, is_published boolean NOT NULL,
        publish_at timestamptz NOT NULL, updated_at timestamptz DEFAULT now(), content jsonb DEFAULT '{}');`);
    const migration = await readFile('update_health_search_automation.sql', 'utf8');
    await db.exec(`INSERT INTO health_articles VALUES ('existing', true, now() - interval '1 day', now(), '{}');`);
    await db.exec(migration);
    await db.exec(migration);
    assert.equal((await db.query('SELECT * FROM health_search_jobs')).rows.length, 0, 'past articles are not resubmitted on installation');
    await db.exec(`INSERT INTO health_articles(slug,is_published,publish_at) VALUES
      ('draft',false,now()), ('scheduled',true,now()+interval '1 day'), ('live',true,now());`);
    assert.equal((await db.query('SELECT * FROM health_search_jobs')).rows.length, 2);
    let result = await db.query<{ id: string; lease_token: string; attempts: number; slug: string }>('SELECT * FROM claim_health_search_jobs()');
    assert.equal(result.rows.length, 1);
    assert.equal(result.rows[0].slug, 'live');
    assert.equal((await db.query('SELECT * FROM claim_health_search_jobs()')).rows.length, 0, 'lease prevents duplicate claim');
    const first = result.rows[0];
    await db.query(`SELECT finish_health_search_job($1,$2,'pending',503,'temporary',now()-interval '1 second')`, [first.id, first.lease_token]);
    result = await db.query('SELECT * FROM claim_health_search_jobs()');
    assert.equal(result.rows[0].attempts, 2);
    const second = result.rows[0];
    const stale = await db.query<{ finish_health_search_job: boolean }>(`SELECT finish_health_search_job($1,$2,'accepted',200,'stale')`, [first.id, first.lease_token]);
    assert.equal(stale.rows[0].finish_health_search_job, false, 'expired lease cannot finish new attempt');
    await db.query(`SELECT finish_health_search_job($1,$2,'accepted',200,'accepted')`, [second.id, second.lease_token]);
    assert.equal((await db.query('SELECT * FROM health_search_attempts')).rows.length, 2);
    await db.exec(`UPDATE health_articles SET content='{"edit":true}', updated_at='2000-01-01' WHERE slug='live'`);
    const updated = await db.query<{ recent: boolean }>(`SELECT updated_at > now()-interval '1 minute' AS recent FROM health_articles WHERE slug='live'`);
    assert.equal(updated.rows[0].recent, true, 'DB assigns actual write time');
    await db.exec(`UPDATE health_articles SET is_published=false WHERE slug='scheduled'`);
    assert.equal((await db.query(`SELECT * FROM health_search_jobs WHERE slug='scheduled' AND status='pending'`)).rows.length, 0);
    await db.exec(`UPDATE health_articles SET is_published=false WHERE slug='live'`);
    const removal = await db.query<{ kind: string }>(`SELECT * FROM claim_health_search_jobs()`);
    assert.equal(removal.rows[0].kind, 'removed');
    await db.exec(`DELETE FROM health_articles WHERE slug='live'`);
    await db.exec(`DELETE FROM health_articles WHERE slug='draft'`);
    assert.equal((await db.query(`SELECT * FROM health_search_jobs WHERE slug='draft'`)).rows.length, 0);
    await db.exec(`UPDATE health_articles SET content='{"updated":true}' WHERE slug='existing';
      DELETE FROM health_articles WHERE slug='existing';`);
    assert.equal((await db.query<{ kind: string }>(`SELECT * FROM health_search_jobs WHERE slug='existing' AND status='pending'`)).rows[0].kind, 'removed');
  } finally { await db.close(); }
});

test('worker sends only public changes to Naver, persists responses and retries the same durable job', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
      CREATE TABLE health_articles(slug text PRIMARY KEY,is_published boolean NOT NULL,
      publish_at timestamptz NOT NULL,updated_at timestamptz DEFAULT now(),content jsonb DEFAULT '{}');`);
    await db.exec(await readFile('update_health_search_automation.sql', 'utf8'));
    const client = createClient('https://db.test.invalid', 'test-service-role', { global: { fetch: (async (input, init) => {
      const url = String(input);
      const args = init?.body ? JSON.parse(String(init.body)) : {};
      if (url.includes('/rpc/claim_health_search_jobs')) {
        const result = await db.query('SELECT * FROM claim_health_search_jobs($1,$2)', [args.batch_size, args.only_slug]);
        return Response.json(result.rows);
      }
      if (url.includes('/rpc/finish_health_search_job')) {
        const result = await db.query<{ finish_health_search_job: boolean }>('SELECT finish_health_search_job($1,$2,$3,$4,$5,$6)', [args.job_id, args.token, args.outcome, args.http_status, args.detail, args.retry_at]);
        return Response.json(result.rows[0].finish_health_search_job);
      }
      if (url.includes('/health_articles')) return Response.json((await db.query('SELECT slug,is_published,publish_at FROM health_articles')).rows);
      throw new Error(`unexpected DB request: ${url}`);
    }) as typeof fetch } });
    await db.exec(`INSERT INTO health_articles(slug,is_published,publish_at) VALUES
      ('live',true,now()),('draft',false,now()),('future',true,now()+interval '1 day');`);
    let httpStatus = 503;
    let calls = 0;
    const send = (async (input: string | URL | Request, init?: RequestInit) => {
      assert.equal(String(input), 'https://searchadvisor.naver.com/indexnow');
      const body = JSON.parse(String(init?.body));
      assert.deepEqual(body.urlList, ['https://www.ys-cheok.com/health', 'https://www.ys-cheok.com/health/live']);
      assert.equal(body.keyLocation, `https://www.ys-cheok.com/${body.key}.txt`);
      calls += 1;
      return new Response(null, { status: httpStatus });
    }) as typeof fetch;
    await processHealthSearchJobs(client, 'https://www.ys-cheok.com', undefined, send);
    let jobs = await db.query<{ status: string; attempts: number }>(`SELECT * FROM health_search_jobs WHERE slug='live'`);
    assert.equal(jobs.rows[0].status, 'pending');
    await processHealthSearchJobs(client, 'https://www.ys-cheok.com', undefined, send);
    assert.equal(calls, 1, 'not due yet: no immediate repeated submission');
    await db.exec(`UPDATE health_search_jobs SET available_at=now()-interval '1 second' WHERE slug='live'`);
    httpStatus = 200;
    await processHealthSearchJobs(client, 'https://www.ys-cheok.com', undefined, send);
    jobs = await db.query(`SELECT * FROM health_search_jobs WHERE slug='live'`);
    assert.equal(jobs.rows[0].status, 'accepted');
    assert.equal(jobs.rows[0].attempts, 2);
    await db.exec(`UPDATE health_articles SET content='{"edited":true}' WHERE slug='live'`);
    httpStatus = 202;
    await processHealthSearchJobs(client, 'https://www.ys-cheok.com', 'live', send);
    assert.equal((await db.query<{ status: string }>(`SELECT * FROM health_search_jobs WHERE slug='live' ORDER BY created_at DESC`)).rows[0].status, 'key_pending');
    await db.exec(`UPDATE health_articles SET is_published=false WHERE slug='live'`);
    httpStatus = 403;
    await processHealthSearchJobs(client, 'https://www.ys-cheok.com', 'live', send);
    assert.equal((await db.query<{ status: string }>(`SELECT * FROM health_search_jobs WHERE slug='live' ORDER BY created_at DESC`)).rows[0].status, 'failed');
    assert.equal((await db.query('SELECT * FROM health_search_attempts')).rows.length, 4);
    assert.equal(calls, 4);
  } finally { await db.close(); }
});

import { INDEXNOW_KEY, parseSearchXml } from './healthSearchProtocol';

type ExpectedArticle = { slug: string; modified: string };
export type SearchAuditReport = {
  startedAt: string; finishedAt: string; sitemapUrls: number; publicArticles: number;
  checkedLinks: number; issues: string[];
};

/** 외부 호스트나 리디렉션을 따라가지 않고 대표 사이트의 공개 URL만 확인합니다. */
export async function auditHealthSearch(base: string, articles: ExpectedArticle[], fetcher: typeof fetch = fetch): Promise<SearchAuditReport> {
  const report: SearchAuditReport = { startedAt: new Date().toISOString(), finishedAt: '', sitemapUrls: 0, publicArticles: articles.length, checkedLinks: 0, issues: [] };
  const origin = new URL(base).origin;
  const expected = new Map(articles.map((article) => [`${origin}/health/${article.slug}`, article.modified]));
  const request = (url: string) => fetcher(url, { cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(6000) });
  async function read(url: string) {
    const response = await request(url);
    if (response.status !== 200) {
      await response.body?.cancel();
      throw new Error(`HTTP ${response.status}`);
    }
    // XML/키 파일의 비정상적인 대용량 응답을 제한합니다.
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.length;
          if (size > 5_000_000) throw new Error('응답 크기 초과');
          chunks.push(value);
        }
      } finally { await reader.cancel(); }
    }
    return new TextDecoder().decode(Buffer.concat(chunks));
  }
  let entries: ReturnType<typeof parseSearchXml> = [];
  try {
    entries = parseSearchXml(await read(`${origin}/sitemap.xml`), 'sitemap');
    report.sitemapUrls = entries.length;
    if (!entries.length) report.issues.push('사이트맵 URL이 없습니다.');
    const urls = new Map(entries.map((entry) => [entry.url, entry.modified]));
    if (urls.size !== entries.length) report.issues.push('사이트맵 URL 중복');
    for (const [url, modified] of expected) {
      if (!urls.has(url)) report.issues.push(`공개 글 사이트맵 누락: ${url}`);
      else if (!urls.get(url) || Date.parse(urls.get(url)!) !== Date.parse(modified)) report.issues.push(`수정일 불일치: ${url}`);
    }
    for (const entry of entries) {
      const url = new URL(entry.url);
      if (url.origin !== origin || url.search || url.hash || url.username || url.password) report.issues.push(`대표 URL 형식 오류: ${entry.url}`);
      if (url.pathname.startsWith('/health/') && !expected.has(entry.url)) report.issues.push(`비공개·예약·없는 글이 사이트맵에 포함됨: ${entry.url}`);
    }
  } catch (error) { report.issues.push(`사이트맵 접속/형식 오류: ${String(error)}`); }

  try {
    const rss = parseSearchXml(await read(`${origin}/rss.xml`), 'rss');
    const urls = new Set(rss.map((entry) => entry.url));
    for (const article of articles.slice(0, 50)) {
      const url = `${origin}/health/${article.slug}`;
      if (!urls.has(url)) report.issues.push(`RSS 누락: ${url}`);
    }
    for (const url of urls) if (!expected.has(url)) report.issues.push(`RSS에 비공개·예약·없는 글 포함: ${url}`);
  } catch (error) { report.issues.push(`RSS 접속/형식 오류: ${String(error)}`); }
  try {
    if ((await read(`${origin}/${INDEXNOW_KEY}.txt`)).trim() !== INDEXNOW_KEY) report.issues.push('IndexNow 키 파일 내용 불일치');
  } catch (error) { report.issues.push(`IndexNow 키 파일 접속 오류: ${String(error)}`); }

  const links = [...new Set([...entries.map((entry) => entry.url), ...expected.keys()])].filter((url) => {
    try { return new URL(url).origin === origin && !new URL(url).username && !new URL(url).password; } catch { return false; }
  });
  // 실행 시간 상한을 지키고 미검사 URL을 정상으로 처리하지 않습니다.
  if (links.length > 250) report.issues.push(`링크 ${links.length}개 중 250개만 검사됨: 검사 한도 확대 필요`);
  let cursor = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (cursor < Math.min(links.length, 250)) {
      const url = links[cursor++];
      try {
        const response = await request(url);
        await response.body?.cancel();
        if (response.status !== 200) report.issues.push(`링크 오류 HTTP ${response.status}: ${url}`);
      } catch (error) { report.issues.push(`링크 접속 실패: ${url} (${String(error)})`); }
      report.checkedLinks += 1;
    }
  }));
  report.finishedAt = new Date().toISOString();
  return report;
}

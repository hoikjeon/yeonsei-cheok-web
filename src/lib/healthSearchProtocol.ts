import { XMLParser, XMLValidator } from 'fast-xml-parser';

export const INDEXNOW_KEY = 'c403158c0fa8a735b973b3123c774955';
export const INDEXNOW_ENDPOINT = 'https://searchadvisor.naver.com/indexnow';

export function indexNowOutcome(status: number | null, attempt: number, retryAfter?: string | null, now = Date.now()) {
  if (status === 200) return { status: 'accepted' as const, retryAt: null };
  if (status === 202) return { status: 'key_pending' as const, retryAt: null };
  const temporary = status === null || [408, 425, 429].includes(status) || status >= 500;
  if (!temporary || attempt >= 8) return { status: 'failed' as const, retryAt: null };
  const parsed = retryAfter ? (/^\d+$/.test(retryAfter) ? now + Number(retryAfter) * 1000 : Date.parse(retryAfter)) : now;
  const delay = Math.min(86_400_000, Math.max(60_000 * 2 ** (attempt - 1), (Number.isFinite(parsed) ? parsed : now) - now));
  return { status: 'pending' as const, retryAt: new Date(now + delay).toISOString() };
}

export function parseSearchXml(xml: string, type: 'sitemap' | 'rss') {
  if (xml.length > 5_000_000 || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('허용하지 않는 XML 형식 또는 크기');
  const valid = XMLValidator.validate(xml);
  if (valid !== true) throw new Error(`XML 형식 오류: ${valid.err.msg}`);
  const parsed = new XMLParser({ ignoreAttributes: false, parseTagValue: false }).parse(xml);
  if (type === 'rss') {
    if (!parsed.rss?.channel) throw new Error('RSS channel이 없습니다.');
    const items = parsed.rss.channel.item ?? [];
    return (Array.isArray(items) ? items : [items]).map((item: { link?: unknown }) => {
      if (typeof item.link !== 'string') throw new Error('RSS link가 없습니다.');
      return { url: item.link, modified: undefined as string | undefined };
    });
  }
  const root = parsed.urlset;
  if (!root || root['@_xmlns'] !== 'http://www.sitemaps.org/schemas/sitemap/0.9') throw new Error('사이트맵 urlset/namespace 오류');
  const entries = root.url ?? [];
  return (Array.isArray(entries) ? entries : [entries]).map((entry: { loc?: unknown; lastmod?: unknown }) => {
    if (typeof entry.loc !== 'string') throw new Error('사이트맵 loc가 없습니다.');
    if (entry.lastmod !== undefined && (typeof entry.lastmod !== 'string' || !Number.isFinite(Date.parse(entry.lastmod)))) throw new Error('잘못된 lastmod');
    return { url: entry.loc, modified: entry.lastmod as string | undefined };
  });
}

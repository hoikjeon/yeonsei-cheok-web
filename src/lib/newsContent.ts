// A versioned document in the existing text column keeps old posts readable without a DB migration.
// Keep the marker newline-free: multipart FormData normalizes line endings to CRLF.
export const NEWS_CONTENT_PREFIX = 'ys-news-rich:v1:';
export const NEWS_FONT_SIZES = ['14px', '16px', '18px', '20px', '24px', '28px', '32px'];
export const MAX_NEWS_TEXT_LENGTH = 20_000;
export const MAX_NEWS_DOCUMENT_LENGTH = 300_000;

export interface NewsMark {
  type: string;
  attrs?: Record<string, string>;
}

export interface NewsNode {
  type: string;
  text?: string;
  attrs?: Record<string, string | number>;
  marks?: NewsMark[];
  content?: NewsNode[];
}

export function safeNewsLink(value: unknown): string | null {
  if (typeof value !== 'string' || /[\u0000-\u0020\\]/.test(value)) return null;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol) && !url.username && !url.password
      ? value : null;
  } catch { return null; }
}

export function safeNewsImage(value: unknown): string | null {
  const url = safeNewsLink(value);
  return url && (url.startsWith('/') || /^https?:\/\//.test(url)) ? url : null;
}

export function newsColor(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  if (/^#[\da-f]{6}$/i.test(value)) return value.toLowerCase();
  if (/^#[\da-f]{3}$/i.test(value)) return '#' + value.slice(1).split('').map((c) => c + c).join('');
  const rgb = value.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/);
  if (rgb && rgb.slice(1).every((c) => Number(c) <= 255)) {
    return '#' + rgb.slice(1).map((c) => Number(c).toString(16).padStart(2, '0')).join('');
  }
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

/** Allow only the editor's nodes/attributes. Never render stored HTML or arbitrary CSS. */
export function normalizeNewsDocument(value: unknown, allowedImages?: ReadonlySet<string>): NewsNode {
  let visited = 0;
  const blockTypes = new Set(['paragraph', 'heading', 'bulletList', 'orderedList', 'blockquote', 'horizontalRule', 'image']);
  function normalize(input: unknown, depth: number, parent: string): NewsNode {
    if (++visited > 8_000 || depth > 16) throw new Error('본문 구성이 너무 복잡합니다. 서식을 정리해주세요.');
    const raw = record(input);
    const type = String(raw.type || '');
    const isRoot = depth === 0 && type === 'doc';
    const isInline = ['text', 'hardBreak'].includes(type) && ['paragraph', 'heading'].includes(parent);
    const isBlock = blockTypes.has(type) && ['doc', 'blockquote', 'listItem'].includes(parent);
    const isListItem = type === 'listItem' && ['bulletList', 'orderedList'].includes(parent);
    if (!isRoot && !isInline && !isBlock && !isListItem) throw new Error('지원하지 않는 본문 형식입니다.');
    const node: NewsNode = { type };
    const attrs = record(raw.attrs);
    if (type === 'doc' && typeof attrs.galleryOrder === 'string') {
      const gallery: unknown = JSON.parse(attrs.galleryOrder);
      if (!Array.isArray(gallery) || gallery.length > 10 || gallery.some((url) => !safeNewsImage(url) || (allowedImages && !allowedImages.has(url)))) throw new Error('첨부 이미지 순서가 올바르지 않습니다.');
      node.attrs = { galleryOrder: JSON.stringify([...new Set(gallery)]) };
    }
    if (type === 'text') {
      if (typeof raw.text !== 'string' || !raw.text) throw new Error('본문 텍스트 형식이 올바르지 않습니다.');
      node.text = raw.text;
      node.marks = (Array.isArray(raw.marks) ? raw.marks : []).flatMap((entry): NewsMark[] => {
        const mark = record(entry);
        const a = record(mark.attrs);
        if (['bold', 'italic', 'underline', 'strike'].includes(String(mark.type))) return [{ type: String(mark.type) }];
        if (mark.type === 'link') {
          const href = safeNewsLink(a.href);
          return href ? [{ type: 'link', attrs: { href } }] : [];
        }
        if (mark.type === 'textStyle') {
          const clean: Record<string, string> = {};
          const color = newsColor(a.color);
          const backgroundColor = newsColor(a.backgroundColor);
          if (color) clean.color = color;
          if (backgroundColor) clean.backgroundColor = backgroundColor;
          if (NEWS_FONT_SIZES.includes(String(a.fontSize))) clean.fontSize = String(a.fontSize);
          return Object.keys(clean).length ? [{ type: 'textStyle', attrs: clean }] : [];
        }
        return [];
      });
    }
    if (type === 'heading') node.attrs = { level: [2, 3, 4].includes(Number(attrs.level)) ? Number(attrs.level) : 2 };
    if (['paragraph', 'heading'].includes(type) && ['left', 'center', 'right'].includes(String(attrs.textAlign))) {
      node.attrs = { ...node.attrs, textAlign: String(attrs.textAlign) };
    }
    if (type === 'orderedList') node.attrs = { start: Math.max(1, Math.min(999, Number(attrs.start) || 1)) };
    if (type === 'image') {
      const src = safeNewsImage(attrs.src);
      if (!src || (allowedImages && !allowedImages.has(src))) throw new Error('본문 이미지를 다시 업로드해주세요.');
      node.attrs = {
        src,
        alt: typeof attrs.alt === 'string' ? attrs.alt.slice(0, 300) : '',
        caption: typeof attrs.caption === 'string' ? attrs.caption.slice(0, 500) : '',
        width: [25, 50, 75, 100].includes(Number(attrs.width)) ? Number(attrs.width) : 100,
        align: ['left', 'center', 'right'].includes(String(attrs.align)) ? String(attrs.align) : 'center',
      };
    }
    if (!['text', 'hardBreak', 'horizontalRule', 'image'].includes(type)) {
      node.content = (Array.isArray(raw.content) ? raw.content : []).map((child) => normalize(child, depth + 1, type));
      if (type === 'doc' && !node.content.length) node.content = [{ type: 'paragraph' }];
      if (type === 'listItem' && node.content[0]?.type !== 'paragraph') throw new Error('목록의 문단 형식이 올바르지 않습니다.');
      if (['bulletList', 'orderedList', 'blockquote'].includes(type) && !node.content.length) throw new Error('빈 목록의 서식을 정리해주세요.');
    }
    return node;
  }
  return normalize(value, 0, '');
}

export function parseNewsDocument(content: string | null | undefined): NewsNode | null {
  if (!content?.startsWith(NEWS_CONTENT_PREFIX) || content.length > MAX_NEWS_DOCUMENT_LENGTH) return null;
  try { return normalizeNewsDocument(JSON.parse(content.slice(NEWS_CONTENT_PREFIX.length))); }
  catch { return null; }
}

export function newsDocumentForEditor(content: string): NewsNode {
  return parseNewsDocument(content) || {
    type: 'doc',
    content: content.split(/\r?\n/).map((line) => ({
      type: 'paragraph', ...(line ? { content: [{ type: 'text', text: line }] } : {}),
    })),
  };
}

export function documentText(node: NewsNode): string {
  if (node.type === 'text') return node.text || '';
  if (node.type === 'hardBreak') return '\n';
  if (node.type === 'image') return String(node.attrs?.caption || '');
  return (node.content || []).map(documentText).join(['paragraph', 'heading'].includes(node.type) ? '' : '\n');
}

export function newsPlainText(content: string | null | undefined): string {
  const doc = parseNewsDocument(content);
  return doc ? documentText(doc) : content || '';
}

export function serializeNewsDocument(doc: NewsNode, galleryOrder?: string[]): string {
  return NEWS_CONTENT_PREFIX + JSON.stringify(galleryOrder ? { ...doc, attrs: { ...doc.attrs, galleryOrder: JSON.stringify(galleryOrder) } } : doc);
}

export function documentImages(doc: NewsNode): string[] {
  const urls: string[] = [];
  const walk = (node: NewsNode) => {
    if (node.type === 'image' && typeof node.attrs?.src === 'string') urls.push(node.attrs.src);
    node.content?.forEach(walk);
  };
  walk(doc);
  return [...new Set(urls)];
}

export function newsInlineImages(content: string): string[] {
  const doc = parseNewsDocument(content);
  return doc ? documentImages(doc) : [];
}

export function newsGalleryImages(content: string, images: string[] | null): string[] {
  const doc = parseNewsDocument(content);
  const inline = new Set(doc ? documentImages(doc) : []);
  const gallery = (images || []).filter((url) => !inline.has(url));
  const order: string[] = typeof doc?.attrs?.galleryOrder === 'string' ? JSON.parse(doc.attrs.galleryOrder) : [];
  return [...order.filter((url) => gallery.includes(url)), ...gallery.filter((url) => !order.includes(url))];
}

export function youtubeVideoId(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const id = host === 'youtu.be' ? url.pathname.slice(1) : ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)
      ? url.searchParams.get('v') || url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

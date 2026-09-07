import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NEWS_CONTENT_PREFIX, normalizeNewsDocument, newsPlainText, newsDocumentForEditor, documentImages, documentText, newsGalleryImages, serializeNewsDocument, parseNewsDocument, safeNewsLink, youtubeVideoId, type NewsNode } from '../src/lib/newsContent';
import { safeNewsReturnTo, storedNewsTypes, validNewsId } from '../src/lib/adminNews';
import { MAX_IMAGE_SIZE, MAX_NEWS_IMAGE_SIZE, validateUploadFiles } from '../src/lib/imageUploadRules';

test('hospital news allows 20MB images while review uploads stay at 10MB', () => {
  const oversizedForReviews = { type: 'image/jpeg', size: 15 * 1024 * 1024 } as File;
  assert.equal(MAX_IMAGE_SIZE, 10 * 1024 * 1024);
  assert.equal(MAX_NEWS_IMAGE_SIZE, 20 * 1024 * 1024);
  assert.equal(validateUploadFiles([oversizedForReviews]), '이미지 한 개의 크기는 10MB를 넘을 수 없습니다.');
  assert.equal(validateUploadFiles([oversizedForReviews], MAX_NEWS_IMAGE_SIZE), null);
});

test('legacy posts keep their text and newlines, and HTML remains text', () => {
  const text = '기존 게시물\n<script>alert(1)</script>\n다음 문단';
  assert.equal(newsPlainText(text), text);
  assert.equal(documentText(newsDocumentForEditor(text)), text);
  assert.equal(parseNewsDocument(text), null);
});

test('formatted words remain searchable and metadata contains only text', () => {
  const doc: NewsNode = { type: 'doc', content: [{ type: 'paragraph', content: [
    { type: 'text', text: '병원', marks: [{ type: 'bold' }] },
    { type: 'text', text: '소식', marks: [{ type: 'textStyle', attrs: { color: '#123456', fontSize: '24px' } }] },
  ] }] };
  const stored = serializeNewsDocument(normalizeNewsDocument(doc));
  assert.equal(newsPlainText(stored), '병원소식');
  assert.deepEqual(parseNewsDocument(stored), normalizeNewsDocument(doc));
  assert.ok(!newsPlainText(stored).includes('fontSize'));
});

test('rich content marker survives multipart form newline normalization', async () => {
  const form = new FormData();
  const content = serializeNewsDocument(newsDocumentForEditor('문단 하나\n문단 둘'));
  form.set('content', content);
  const request = new Request('https://example.com', { method: 'POST', body: form });
  const decoded = await request.formData();
  assert.equal(newsPlainText(String(decoded.get('content'))), '문단 하나\n문단 둘');
});

test('choosing a cover image does not change the attachment gallery order', () => {
  const first = 'https://example.com/first.png';
  const cover = 'https://example.com/cover.png';
  const content = serializeNewsDocument({ type: 'doc', content: [{ type: 'paragraph' }] }, [first, cover]);
  assert.deepEqual(newsGalleryImages(content, [cover, first]), [first, cover]);
});

test('unsafe links/styles are dropped and unknown executable nodes are rejected', () => {
  const doc = normalizeNewsDocument({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello', marks: [
    { type: 'link', attrs: { href: 'javascript:alert(1)' } },
    { type: 'textStyle', attrs: { color: 'url(https://bad.test)', backgroundColor: 'rgb(255, 0, 0)', fontSize: '999px', position: 'fixed' } },
  ] }] }] });
  assert.deepEqual(doc.content?.[0].content?.[0].marks, [{ type: 'textStyle', attrs: { backgroundColor: '#ff0000' } }]);
  assert.throws(() => normalizeNewsDocument({ type: 'doc', content: [{ type: 'iframe' }] }));
  for (const link of ['javascript:alert(1)', 'data:text/html,hello', '//bad.test', '/\\bad.test', 'https://user:pass@bad.test']) assert.equal(safeNewsLink(link), null);
  assert.equal(safeNewsLink('/news/notice'), '/news/notice');
});

test('inline images are validated, preserved on edit and excluded from top galleries', () => {
  const src = 'https://example.com/image.png';
  const other = 'https://example.com/gallery.png';
  const doc = normalizeNewsDocument({ type: 'doc', content: [{ type: 'image', attrs: { src, width: 50, align: 'right', caption: '이미지 설명' } }] }, new Set([src]));
  const stored = serializeNewsDocument(doc);
  assert.deepEqual(documentImages(newsDocumentForEditor(stored)), [src]);
  assert.deepEqual(newsGalleryImages(stored, [src, other]), [other]);
  assert.throws(() => normalizeNewsDocument(doc, new Set([other])));
  assert.throws(() => normalizeNewsDocument({ type: 'doc', content: [{ type: 'image', attrs: { src: 'data:image/png;base64,AAA' } }] }));
});

test('malformed and deeply nested documents fail safely', () => {
  assert.equal(parseNewsDocument(NEWS_CONTENT_PREFIX + '{bad'), null);
  let doc: NewsNode = { type: 'paragraph' };
  for (let i = 0; i < 18; i++) doc = { type: 'blockquote', content: [doc] };
  assert.throws(() => normalizeNewsDocument({ type: 'doc', content: [doc] }));
});

test('board and return URL validation includes pinned notices without open redirects', () => {
  assert.deepEqual(storedNewsTypes('notice'), ['notice', 'notice_pinned']);
  assert.equal(safeNewsReturnTo('https://bad.test/admin/news'), '/admin/news');
  assert.equal(safeNewsReturnTo('/admin/news/../../bad'), '/admin/news');
  assert.equal(safeNewsReturnTo('/admin/news?type=media&page=2&unexpected=yes'), '/admin/news?type=media&page=2');
  assert.ok(validNewsId('00000000-0000-4000-8000-000000000001'));
  assert.ok(!validNewsId('../bad'));
});

test('YouTube validation accepts supported formats and rejects spoofed hosts', () => {
  for (const url of ['https://youtu.be/abcdefghijk', 'https://www.youtube.com/watch?v=abcdefghijk', 'https://youtube.com/shorts/abcdefghijk']) assert.equal(youtubeVideoId(url), 'abcdefghijk');
  assert.equal(youtubeVideoId('https://fake.test/watch?v=abcdefghijk'), null);
  assert.equal(youtubeVideoId('https://youtube.com/watch?v=invalid'), null);
});

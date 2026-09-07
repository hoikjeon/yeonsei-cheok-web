import { test, expect, type Page } from '@playwright/test';
import { createHmac } from 'node:crypto';
import { parseNewsDocument, documentImages, newsPlainText } from '../src/lib/newsContent';

const fixture = 'http://127.0.0.1:4312';
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
const imageFile = { name: 'clipboard.png', mimeType: 'image/png', buffer: png };

async function write(page: Page, type: string, title: string) {
  await page.goto(`/admin/news/${type}/write`);
  await page.getByLabel(type === 'media' ? '보도 제목' : type === 'notice' ? '공지 제목' : type === 'youtube' ? '영상 제목' : '소식 제목').fill(title);
  if (type === 'youtube') await page.getByLabel('유튜브 영상 링크').fill('https://youtu.be/abcdefghijk');
  await page.getByRole('textbox', { name: '게시물 본문' }).fill('게시물 본문을 확인합니다.');
}
async function save(page: Page, editing = false) {
  await page.getByRole('button', { name: editing ? '수정 저장' : '게시물 등록', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/news\?.*saved=/);
  return new URL(page.url()).searchParams.get('saved')!;
}

test.beforeEach(async ({ context, request }) => {
  await request.post(`${fixture}/__test/reset`);
  const payload = `admin.${Date.now() + 3_600_000}`;
  const token = `${payload}.${createHmac('sha256', 'news-browser-test-secret').update(payload).digest('base64url')}`;
  await context.addCookies([{ name: 'admin_session', value: token, domain: '127.0.0.1', path: '/', httpOnly: true }]);
  await context.route(/https:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com|i\.ytimg\.com)\//, (route) => route.abort());
});

test('admin authentication, list pagination, pinned notices and plain-text search', async ({ page, context, request }) => {
  await page.goto('/admin/news');
  await expect(page.getByRole('heading', { name: '병원소식 관리', exact: true })).toBeVisible();
  await page.screenshot({ path: '/tmp/ys-news-admin-list.png', fullPage: true });
  await expect(page.locator('[id^="news-"]')).toHaveCount(20);
  await page.getByRole('navigation', { name: '게시물 페이지' }).getByRole('link', { name: '다음' }).click();
  await expect(page.locator('[id^="news-"]')).toHaveCount(6);
  await page.getByRole('navigation', { name: '게시판 필터' }).getByRole('link', { name: '공지사항', exact: true }).click();
  await expect(page.getByRole('link', { name: '기존 소식 01', exact: true })).toBeVisible();
  await page.getByLabel('제목 또는 내용 검색').fill('기존 본문 1');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  await expect(page.locator('[id^="news-"]')).toHaveCount(3);
  await page.getByLabel('제목 또는 내용 검색').fill('없는 검색 결과');
  await page.getByRole('button', { name: '검색', exact: true }).click();
  await expect(page.getByText('검색 결과가 없습니다.')).toBeVisible();
  await context.clearCookies();
  await page.goto('/admin/news/media/write');
  await expect(page).toHaveURL(/\/admin\/login/);
  const result = await request.post('/api/admin/news/images', { data: { type: 'media' } });
  expect(result.status()).toBe(401);
});

test('all five boards support create, detail, edit and confirmed delete', async ({ page, request }) => {
  test.setTimeout(180_000);
  for (const type of ['notice', 'media', 'training', 'academic', 'youtube']) {
    const title = `통합 검증 ${type}`;
    await write(page, type, title);
    if (type === 'notice') await page.getByLabel('공지사항 상단 고정').check();
    if (type === 'media') { await page.getByLabel('언론사명').fill('테스트 언론'); await page.getByLabel('보도 원문 링크').fill('https://example.com/article'); }
    const id = await save(page);
    await page.getByRole('link', { name: title, exact: true }).click();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await page.getByRole('link', { name: '수정', exact: true }).click();
    await page.locator('#news-title').fill(`${title} 수정`);
    await save(page, true);
    await page.getByRole('button', { name: `${title} 수정 삭제`, exact: true }).click();
    await expect(page.getByRole('dialog')).toContainText('복구할 수 없습니다.');
    await page.getByRole('dialog').getByRole('button', { name: '취소', exact: true }).click();
    let state = await (await request.get(`${fixture}/__test/state`)).json();
    expect(state.records.some((row: { id: string }) => row.id === id)).toBe(true);
    await page.getByRole('button', { name: `${title} 수정 삭제`, exact: true }).click();
    await page.getByRole('button', { name: '영구 삭제', exact: true }).click();
    await expect(page).toHaveURL(/deleted=1/);
    state = await (await request.get(`${fixture}/__test/state`)).json();
    expect(state.records.some((row: { id: string }) => row.id === id)).toBe(false);
  }
});

test('formatting, clipboard images, preview, draft recovery, public rendering and image cleanup', async ({ page, request }) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await write(page, 'media', '서식과 이미지 검증');
  const editor = page.getByRole('textbox', { name: '게시물 본문' });
  await editor.fill('크기와 색상이 있는 문장');
  await editor.press('ControlOrMeta+A');
  await page.getByRole('button', { name: '굵게', exact: true }).click();
  await page.getByLabel('글자 크기', { exact: true }).selectOption('24px');
  await page.getByLabel('글자 색상', { exact: true }).evaluate((element) => {
    const input = element as HTMLInputElement;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, '#dc2626');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await editor.press('ArrowRight');
  await editor.press('Enter');
  await page.evaluate((bytes) => {
    const transfer = new DataTransfer();
    transfer.items.add(new File([new Uint8Array(bytes)], 'paste.png', { type: 'image/png' }));
    document.querySelector('[aria-label="게시물 본문"]')!.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: transfer }));
  }, [...png]);
  await expect(editor.locator('figure img')).toHaveCount(1);
  await editor.locator('figure img').click();
  await page.getByLabel('이미지 너비', { exact: true }).selectOption('50');
  await page.getByLabel('이미지 설명', { exact: true }).fill('붙여넣은 사진 설명');
  await page.getByLabel('첨부 이미지 파일').setInputFiles(imageFile);
  await expect(page.getByText('본문 포함 2/10개 · 파일당 20MB')).toBeVisible();
  await page.locator('main').evaluate((main) => { main.scrollTop = 250; });
  await page.screenshot({ path: '/tmp/ys-news-admin-editor.png', fullPage: true });
  await page.getByRole('button', { name: '미리보기', exact: true }).click();
  await expect(page.getByRole('dialog').locator('.news-content figure')).toHaveCount(1);
  await page.getByRole('button', { name: '모바일', exact: true }).click();
  expect((await page.getByRole('dialog').locator('article').boundingBox())!.width).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: '미리보기 닫기' }).click();
  await expect(page.getByText(/이 브라우저에 .*임시보관됨/)).toBeVisible();
  page.on('dialog', (dialog) => dialog.accept());
  await page.reload();
  await expect(page.getByText('임시보관한 글이 있습니다.')).toBeVisible();
  await page.getByRole('button', { name: '이어서 작성', exact: true }).click();
  await expect(page.locator('#news-title')).toHaveValue('서식과 이미지 검증');
  await expect(page.getByRole('textbox', { name: '게시물 본문' }).locator('figure img')).toHaveCount(1);
  const id = await save(page);
  let state = await (await request.get(`${fixture}/__test/state`)).json();
  let post = state.records.find((row: { id: string }) => row.id === id);
  const doc = parseNewsDocument(post.content)!;
  expect(documentImages(doc)).toHaveLength(1);
  expect(JSON.stringify(doc)).toContain('24px');
  expect(JSON.stringify(doc)).toContain('#dc2626');
  expect(JSON.stringify(doc)).toContain('"width":50');
  expect(post.image_urls).toHaveLength(2);
  expect(state.files).toHaveLength(2);
  await page.goto(`/news/media/${id}`);
  await expect(page.locator('.news-content strong')).toContainText('크기와 색상이 있는 문장');
  await expect(page.locator('.news-content img')).toHaveCount(1);
  expect(await page.locator('meta[name="description"]').getAttribute('content')).not.toContain('ys-news-rich');
  await page.goto(`/admin/news/media/${id}/edit?returnTo=${encodeURIComponent('/admin/news?type=media&page=2')}`);
  await page.locator('#news-title').fill('이미지 유지 수정');
  await save(page, true);
  state = await (await request.get(`${fixture}/__test/state`)).json();
  post = state.records.find((row: { id: string }) => row.id === id);
  expect(post.image_urls).toHaveLength(2);
  expect(state.files).toHaveLength(2);
  expect(newsPlainText(post.content)).toContain('크기와 색상이 있는 문장');
  await page.goto(`/admin/news/media/${id}`);
  await page.getByRole('button', { name: '이미지 유지 수정 삭제', exact: true }).click();
  await page.getByRole('button', { name: '영구 삭제', exact: true }).click();
  await expect(page).toHaveURL(/deleted=1/);
  state = await (await request.get(`${fixture}/__test/state`)).json();
  expect(state.files).toHaveLength(0);
  await page.goto(`/news/media/${id}`);
  await expect(page.getByText('404', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('upload and save failures retain the form and allow retry; mobile layout fits', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await write(page, 'training', '실패 후 재시도');
  await request.post(`${fixture}/__test/fail-upload`);
  await page.getByLabel('본문 이미지 파일').setInputFiles(imageFile);
  await expect(page.getByRole('button', { name: '실패한 이미지 재시도', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '실패한 이미지 재시도', exact: true }).click();
  await expect(page.getByRole('textbox', { name: '게시물 본문' }).locator('img')).toHaveCount(1);
  await request.post(`${fixture}/__test/fail-save`);
  await page.getByRole('button', { name: '게시물 등록', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: '글을 저장하지 못했습니다.' })).toBeVisible();
  await expect(page.locator('#news-title')).toHaveValue('실패 후 재시도');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('main').evaluate((main) => { main.scrollTop = 140; });
  await page.screenshot({ path: '/tmp/ys-news-admin-mobile.png', fullPage: true });
  await save(page);
});

test('unsaved changes warn on links and browser back, and discarded uploads are cleaned', async ({ page, request }) => {
  await page.goto('/admin/news');
  await page.getByText('새 글 등록', { exact: true }).click();
  await page.locator('details').getByRole('link', { name: '학술소식', exact: true }).click();
  await page.locator('#news-title').fill('나가기 안내 검증');
  const linkDialog = page.waitForEvent('dialog');
  const click = page.getByRole('link', { name: '게시물 목록으로', exact: true }).click();
  await (await linkDialog).dismiss();
  await click;
  await expect(page).toHaveURL(/academic\/write/);
  const backDialog = page.waitForEvent('dialog');
  await page.evaluate(() => history.back());
  await (await backDialog).dismiss();
  await expect(page).toHaveURL(/academic\/write/);
  await page.getByLabel('첨부 이미지 파일').setInputFiles(imageFile);
  await expect(page.getByText('본문 포함 1/10개 · 파일당 20MB')).toBeVisible();
  await expect(page.getByRole('button', { name: '임시보관 버리기', exact: true })).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '임시보관 버리기', exact: true }).click();
  await expect(page.locator('#news-title')).toHaveValue('');
  await expect.poll(async () => (await (await request.get(`${fixture}/__test/state`)).json()).files.length).toBe(0);
});

test('concurrent edit is rejected without overwriting the newer post', async ({ page, context, request }) => {
  const id = '00000000-0000-4000-8000-000000000002';
  await page.goto(`/admin/news/media/${id}/edit`);
  const second = await context.newPage();
  await second.goto(`/admin/news/media/${id}/edit`);
  await expect(second.locator('#news-title')).toBeEditable();
  await page.locator('#news-title').fill('먼저 저장한 글');
  await save(page, true);
  await second.locator('#news-title').fill('이전 화면에서 덮어쓰기');
  await second.getByRole('button', { name: '수정 저장', exact: true }).click();
  await expect(second.getByRole('alert').filter({ hasText: '다른 화면에서 글이 변경되었습니다.' })).toBeVisible();
  const state = await (await request.get(`${fixture}/__test/state`)).json();
  expect(state.records.find((row: { id: string }) => row.id === id).title).toBe('먼저 저장한 글');
});

import { test, expect } from '@playwright/test';
import { createHmac } from 'node:crypto';
import { newsPlainText, parseNewsDocument } from '../src/lib/newsContent';

const fixture = 'http://127.0.0.1:4312';
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
const imageFile = { name: 'review.png', mimeType: 'image/png', buffer: png };

test.beforeEach(async ({ context, request }) => {
  await request.post(`${fixture}/__test/reset`);
  const payload = `admin.${Date.now() + 3_600_000}`;
  const token = `${payload}.${createHmac('sha256', 'news-browser-test-secret').update(payload).digest('base64url')}`;
  await context.addCookies([{ name: 'admin_session', value: token, domain: '127.0.0.1', path: '/', httpOnly: true }]);
});

test('admin can list, create, preview, edit and delete reviews; homepage uses latest records without IDs', async ({ page, request }) => {
  test.setTimeout(180_000);
  await page.goto('/admin/reviews');
  await expect(page.getByRole('heading', { name: '치료체험후기 관리', exact: true })).toBeVisible();
  await expect(page.locator('[id^="review-"]')).toHaveCount(20);
  await page.getByRole('navigation', { name: '후기 페이지' }).getByRole('link', { name: '다음' }).click();
  await expect(page.locator('[id^="review-"]')).toHaveCount(3);
  await page.getByRole('link', { name: '새 후기 등록', exact: true }).click();
  await expect(page.getByText('본문 포함 0/10개 · 파일당 10MB')).toBeVisible();
  await page.getByLabel('진료 과목').selectOption('허리');
  await page.locator('#review-title').fill('관리자에서 등록한 최신 치료후기');
  const editor = page.getByRole('textbox', { name: '치료 후기 본문' });
  await editor.fill('관리자에서 등록하고 메인 화면까지 연결되는 치료체험후기 본문입니다.');
  await editor.press('ControlOrMeta+A');
  await page.getByRole('button', { name: '굵게', exact: true }).click();
  await page.getByLabel('후기 첨부 이미지 파일').setInputFiles(imageFile);
  await expect(page.getByText('본문 포함 1/10개 · 파일당 10MB')).toBeVisible();
  await page.getByRole('button', { name: '미리보기', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('관리자에서 등록한 최신 치료후기');
  await page.getByRole('button', { name: '미리보기 닫기' }).click();
  await page.getByRole('button', { name: '후기 등록', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/reviews\?.*saved=/);
  const id = new URL(page.url()).searchParams.get('saved')!;

  let state = await (await request.get(`${fixture}/__test/state`)).json();
  let review = state.reviews.find((row: { id: string }) => row.id === id);
  expect(review.category).toBe('허리');
  expect(newsPlainText(review.content)).toContain('메인 화면까지 연결되는');
  expect(parseNewsDocument(review.content)).not.toBeNull();
  expect(review.image_urls).toHaveLength(1);

  await page.goto('/');
  const section = page.getByRole('region', { name: /환자들의 치료후기/ });
  await expect(section.getByText('관리자에서 등록한 최신 치료후기', { exact: true }).first()).toBeVisible();
  await expect(section.getByText('G*H', { exact: true })).toHaveCount(0);
  await expect(section.getByText('발목 통증으로 방문해서 2달 간 체외충격파, 도수치료 꾸준히 받고 있어요.', { exact: true })).toHaveCount(0);

  await page.goto(`/admin/reviews/${id}/edit`);
  await page.locator('#review-title').fill('수정된 최신 치료후기');
  await page.getByRole('button', { name: '수정 저장', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/reviews\?.*saved=/);
  state = await (await request.get(`${fixture}/__test/state`)).json();
  review = state.reviews.find((row: { id: string }) => row.id === id);
  expect(review.title).toBe('수정된 최신 치료후기');

  await page.getByRole('button', { name: '수정된 최신 치료후기 삭제', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: '영구 삭제', exact: true }).click();
  await expect(page).toHaveURL(/deleted=1/);
  state = await (await request.get(`${fixture}/__test/state`)).json();
  expect(state.reviews.some((row: { id: string }) => row.id === id)).toBe(false);
  expect(state.files).toHaveLength(0);
});

test('review admin routes and upload API require an admin session', async ({ page, context, request }) => {
  await context.clearCookies();
  await page.goto('/admin/reviews');
  await expect(page).toHaveURL(/\/admin\/login/);
  const response = await request.post('/api/admin/reviews/images', { data: { id: '10000000-0000-4000-8000-000000000001', mime: 'image/png', size: 10 } });
  expect(response.status()).toBe(401);
});

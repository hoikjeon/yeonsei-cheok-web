import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['news-admin.spec.ts', 'reviews-admin.spec.ts'],
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: { baseURL: 'http://127.0.0.1:3211', headless: true, trace: 'retain-on-failure' },
  outputDir: '.next/news-test-results',
  webServer: [
    { command: 'node tests/fixtures/news-api.mjs', url: 'http://127.0.0.1:4312/health', reuseExistingServer: false },
    {
      command: 'npm run dev -- --hostname 127.0.0.1 --port 3211',
      url: 'http://127.0.0.1:3211/admin/login',
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        NEWS_TEST_DIST_DIR: '.next/news-tests',
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:4312',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
        ADMIN_SESSION_SECRET: 'news-browser-test-secret',
        NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3211',
      },
    },
  ],
});

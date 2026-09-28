import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: 'non-covered-admin.spec.ts', fullyParallel: false, workers: 1,
  timeout: 120_000, expect: { timeout: 15_000 },
  use: { baseURL: 'http://127.0.0.1:3213', headless: true, trace: 'retain-on-failure' },
  outputDir: '.next/non-covered-test-results',
  webServer: [
    { command: 'npx tsx tests/fixtures/non-covered-api.ts', url: 'http://127.0.0.1:4323/health', reuseExistingServer: false },
    { command: 'npm run dev -- --hostname 127.0.0.1 --port 3213', url: 'http://127.0.0.1:3213/admin/login', reuseExistingServer: false, timeout: 120_000,
      env: { NEXT_DIST_DIR: '.next/non-covered-tests', NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:4323', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon', SUPABASE_SERVICE_ROLE_KEY: 'test-service', ADMIN_SESSION_SECRET: 'fee-test-secret', NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3213' },
    },
  ],
});

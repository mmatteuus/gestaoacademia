import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  reporter: [['list']],
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', testMatch: /desktop\.spec\.ts$/, use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', testMatch: /mobile\.spec\.ts$/, use: { ...devices['iPhone 13'] } },
    { name: 'mobile-ui', testMatch: /mobile-ui\.spec\.ts$/, use: { ...devices['iPhone 13'] } },
    { name: 'dashboard', testMatch: /dashboard-data\.spec\.ts$/, use: { ...devices['Desktop Chrome'] } },
  ],
});

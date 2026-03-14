import { defineConfig, devices } from '@playwright/test';

export default defineConfig({\n  testDir: './src/test',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 1 : undefined,\n  reporter: 'html',\n  use: {\n    baseURL: 'http://localhost:8080',\n    trace: 'on-first-retry',\n  },\n\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n  ],\n});

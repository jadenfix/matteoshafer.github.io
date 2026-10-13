const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: [['line']],
  use: {
    baseURL: 'http://127.0.0.1:4173/matteoshafer.github.io/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview:ci',
    port: 4173,
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});

// playwright.config.ts
import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npx ng serve',
    port: 4200,
    timeout: 120 * 1000,
  },
};
export default config;

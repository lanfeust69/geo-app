import { test, expect } from '@playwright/test';

test.describe('geo-app App', () => {
  test('should display Settings dialog', async ({page}) => {
    await page.goto('/');
    const menuButton = page.locator('div[id=menu-button-div] button');
    expect(menuButton).toBeTruthy();
    await menuButton.click();

    const settingsButton = page.locator('div.mat-menu-content button').first();
    expect(settingsButton).toBeTruthy();
    await settingsButton.click();
    const settingsOkButton = page.locator('geo-settings button');
    expect(settingsOkButton).toBeTruthy();
    await settingsOkButton.click();
  });
});

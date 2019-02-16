import { browser, by, element } from 'protractor';

describe('geo-app App', () => {
  it('should display Settings dialog', () => {
    browser.get('/');
    const menuButton = element(by.css('div[id=menu-button-div] button'));
    expect(menuButton).toBeTruthy();
    menuButton.click();

    // fails due to https://github.com/angular/material2/issues/10140
    const settingsButton = element(by.css('div.mat-menu-content button'));
    expect(settingsButton).toBeTruthy();
    settingsButton.click();
    const settingsOkButton = element(by.css('geo-settings button'));
    expect(settingsOkButton).toBeTruthy();
    settingsOkButton.click();
  });
});

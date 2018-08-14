import { browser, by, element } from 'protractor';

describe('geo-app App', () => {
  it('should display Settings dialog', () => {
    browser.get('/');
    const settingsButton = element(by.css('div[id=menu-button-div] button'));
    expect(settingsButton).toBeTruthy();
    settingsButton.click();
    const settingsOkButton = element(by.css('geo-settings button'));
    expect(settingsOkButton).toBeTruthy();
    settingsOkButton.click();
  });
});

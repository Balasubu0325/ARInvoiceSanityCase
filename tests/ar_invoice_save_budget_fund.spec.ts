import { test, expect } from '@playwright/test';

test('AR Invoice Save, Budget, Fund', async ({ page, context }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes
  await page.goto('https://sndrydocktest.azurewebsites.net/snacsqa');
  await page.getByPlaceholder('Username').fill('balasubu');
  await page.getByPlaceholder('Password').fill('Shipnet1');
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for navigation after login
  await page.waitForNavigation({ timeout: 60000 });

  // Assert we are not on the login page
  expect(page.url()).not.toContain('login');

  // Try to find AR Invoice link, debug if not found
  try {
    await page.getByRole('link', { name: 'AR Invoice' }).click({ timeout: 30000 });
  } catch (e) {
    await page.screenshot({ path: 'ar-invoice-link-error.png', fullPage: true });
    throw new Error('AR Invoice link not found. Screenshot saved as ar-invoice-link-error.png');
  }

  const page1Promise = context.waitForEvent('page');
  await page.getByRole('button', { name: 'New' }).click();
  const page1 = await page1Promise;

  await page1.getByLabel('Process').click();
  await page1.getByRole('option', { name: 'BUDGET NEW' }).click();

  await page1.locator('.card-body > div > .row > div:nth-child(2) > div:nth-child(1) > div > .input-group > .ng-select-container > .ng-arrow-wrapper').click();
  await page1.getByRole('option').first().click();

  await page1.locator('div:nth-child(2) > .input-container > .input-group > .ng-select-container > .ng-arrow-wrapper').click();
  await page1.getByRole('option').first().click();

  await page1.locator('div:nth-child(2) > div:nth-child(2) > .input-container > .input-group > .ng-select-container > .ng-arrow-wrapper').click();
  await page1.getByRole('option', { name: '17' }).click();

  await page1.getByRole('button', { name: 'Add Invoice Line' }).click();
  
  await page1.getByRole('gridcell', { name: 'AE16128C Open or close the drop-down window ' }).getByRole('button', { name: 'Open or close the drop-down window' }).click();
  await page1.getByRole('option').first().click();

  await page1.getByRole('button', { name: 'Save' }).click();

  await page1.getByRole('button', { name: '' }).click();
  await page1.getByRole('button', { name: 'Yes' }).click();

  await page1.getByRole('button', { name: 'Save' }).click();
  
  await page1.getByRole('button', { name: 'Workflow' }).click();
  await page1.getByRole('button', { name: 'Approve' }).click();
  await page1.getByRole('button', { name: 'Confirm' }).click();

  await page1.getByRole('button', { name: 'Workflow' }).click();
  await page1.getByRole('button', { name: 'Transfer' }).click();
  await page1.getByRole('button', { name: 'Confirm' }).click();
});


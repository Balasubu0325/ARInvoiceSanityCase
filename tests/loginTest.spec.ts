import { test, expect } from '@playwright/test';

test('Login and select option from dropdown', async ({ page }) => {
  // Step 1: Navigate to the login page
  await page.goto('https://sndrydocktest.azurewebsites.net/arinvoiceqatest');
  await page.waitForTimeout(5000);

  // Step 2: Maximize the window
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(5000);

  // Step 3: Input credentials
  await page.fill('input[name="username"]', 'balasubu');
  await page.fill('input[name="password"]', 'Shipnet1');
  await page.waitForTimeout(5000);

  // Step 4: Click the 'Login' button
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  // Step 5: Click on 'New' dropdown
  await page.click('text=New');
  await page.waitForTimeout(5000);

  // Step 6: Select the last option in the dropdown
  const dropdownOptions = await page.locator('text=New').locator('..').locator('li');
  const lastOption = dropdownOptions.last();
  await lastOption.click();
  await page.waitForTimeout(5000);

  // Step 7: Close the browser
  await page.close();
});

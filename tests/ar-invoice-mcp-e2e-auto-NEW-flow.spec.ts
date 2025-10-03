import { test, expect } from '@playwright/test';

test('AR Invoice MCP E2E Automation - New Flow', async ({ page }) => {
  test.setTimeout(90000);
  // 1. Login to the site
  await page.goto('https://sndrydocktest.azurewebsites.net/snacsqa');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForSelector('input[placeholder="Enter Username"]', { timeout: 90000 });

  // 2. Enter credentials
  await page.getByRole('textbox', { name: 'Enter Username' }).fill('balasubu');
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('Shipnet1');

  // 3. Click Login
  await page.getByRole('button', { name: 'Login' }).click();
  // Wait for navigation to dashboard by waiting for the first invoice link to appear
  await page.waitForSelector('a:has-text("*P*001572")', { timeout: 90000 });

  // 4. Click first invoice number in 'My Work Items'
  await page.getByRole('link', { name: '*P*001572' }).click();
  // Wait for invoice page to load
  await page.waitForSelector('button:has-text("Preview")', { timeout: 90000 });

  // 5. Click 'Preview' button
  await page.getByRole('button', { name: 'Preview' }).click();
  // Wait for preview dialog
  await page.waitForSelector('role=dialog', { timeout: 90000 });

  // 6. Assert that the preview dialog appears
  await expect(page.getByRole('dialog')).toBeVisible();
});

import { test, expect, chromium } from '@playwright/test';

test('MCP Invoice Preview Flow', async () => {
  test.setTimeout(600000); // Increase timeout to 10 minutes
  // Launch Chrome browser
  const browser = await chromium.launch({ headless: false, channel: 'chrome' });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Maximize window


  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://sndrydocktest.azurewebsites.net/snacsqa');
  await page.waitForSelector('input[name="loginModel.Username"]', { timeout: 60000 });

  // Login
  await page.fill('input[name="loginModel.Username"]', 'balasubu');
  await page.fill('input[name="password"]', 'Shipnet1');
  await page.click('button:has-text("Login")');
  await page.waitForNavigation({ timeout: 60000 });

  // Wait for My Work Items tab
  await page.waitForSelector('text=My Work Items', { timeout: 60000 });

  // Find and click first invoice number
  const invoiceLinks = await page.$$('table:has-text("My Work Items") a');
  if (invoiceLinks.length === 0) throw new Error('No invoice found');
  await invoiceLinks[0].click();
  await page.waitForNavigation({ timeout: 60000 });

  // Click Preview button
  await page.waitForSelector('button:has-text("Preview")', { timeout: 60000 });
  await page.click('button:has-text("Preview")');
  await page.waitForTimeout(8000); // Short wait for preview to load

  await browser.close();
});

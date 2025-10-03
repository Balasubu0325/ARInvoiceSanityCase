import { test, expect } from '@playwright/test';

test('Navigate to sndrydocktest site', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 }); // Maximize window
  await page.goto('https://sndrydocktest.azurewebsites.net/arinvoiceqatest');
  await page.waitForTimeout(5000); // Wait for 5 seconds after navigation
  await page.waitForSelector('input[placeholder="Enter Username"]', { state: 'visible' });
  await page.fill('input[placeholder="Enter Username"]', 'balasubu');
  await page.waitForSelector('input[placeholder="Enter Password"]', { state: 'visible' });
  await page.fill('input[placeholder="Enter Password"]', 'Shipnet1');
  await page.waitForTimeout(5000); // Wait for 5 seconds after filling credentials
  // ...existing code...
  await page.waitForSelector('button:has-text("Login")', { state: 'visible' });
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(5000); // Wait for 5 seconds after login
  await page.screenshot({ path: 'after-login.png', fullPage: true });

  // Hover over the 'New' menu item before the 'Magnifier' icon
  const newItem = page.locator('text=New').locator('..').locator('..').locator('..').locator('..').locator('..').locator('..').locator('..').filter({ has: page.locator('i.pi-search') });
  await newItem.hover();
  
  await page.waitForTimeout(3000); // Wait for 3 seconds to observe the hover effect
});

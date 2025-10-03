import { test, expect } from '@playwright/test';

test('Login to Shipnet Cloud', async ({ page }) => {
  // Step 1: Go to login page
  await page.goto('https://sndrydocktest.azurewebsites.net/arinvoiceqatest');

  // Step 2: Maximize window
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Step 3: Enter credentials
  await page.getByRole('textbox', { name: 'Enter Username' }).fill('balasubu');
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('Shipnet1');

  // Step 4: Click Login
  await page.getByRole('button', { name: 'Login' }).click();

  // Assert successful login by checking URL or page content
  await expect(page).toHaveURL(/azurewebsites.net\//);
  await expect(page).toHaveTitle(/Shipnet Cloud/);
});

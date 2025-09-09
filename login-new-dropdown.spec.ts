import { test, expect } from '@playwright/test';

test('Login and select last option in New dropdown', async ({ page }) => {
  test.setTimeout(60000); // Increase test timeout to 60 seconds

  // Step 1: Go to login page
  await page.goto('https://sndrydocktest.azurewebsites.net/arinvoiceqatest');

  // Step 2: Maximize window
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Step 3: Enter credentials
  await page.getByPlaceholder('Enter Username').fill('balasubu');
  await page.getByPlaceholder('Enter Password').fill('Shipnet1');

  // Step 4: Click Login
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for navigation to dashboard after login
  await page.waitForURL(/\/($|ARInvoiceHome)/, { timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 });

  // Wait for the 'New' dropdown to be visible and click
  const newDropdown = page.getByRole('menuitem', { name: 'New' });
  await newDropdown.waitFor({ state: 'visible', timeout: 30000 });
  await newDropdown.click();

  // Step 6: Select last option in dropdown
  const lastOption = page.getByRole('menuitem', { name: 'Free Test' });
  await lastOption.waitFor({ state: 'visible', timeout: 30000 });
  await lastOption.click();
});



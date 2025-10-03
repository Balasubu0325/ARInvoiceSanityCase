import { test, expect } from '@playwright/test';

test('Login and select last option in New dropdown', async ({ page }) => {
  test.setTimeout(60000); // Increase test timeout to 60 seconds

  // Step 1: Go to login page
  await page.goto('https://sndrydocktest.azurewebsites.net/arinvoiceqatest');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(5000);

  // Step 2: Enter credentials
  await page.getByPlaceholder('Enter Username').fill('balasubu');
  await page.getByPlaceholder('Enter Password').fill('Shipnet1');
  await page.waitForTimeout(5000);

  // Step 3: Click Login
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(5000);


  // Wait for dashboard to load by waiting for a known dashboard element
  // Example: Wait for the "AR Invoice" link in the sidebar
  await page.waitForSelector('a[href="/ARInvoiceHome"]', { timeout: 30000 });
  await page.waitForTimeout(5000);

  // Wait for the 'New' dropdown to be visible and click
  const newDropdown = page.getByRole('menuitem', { name: 'New' });
  await newDropdown.waitFor({ state: 'visible', timeout: 30000 });
  await newDropdown.click();
  await page.waitForTimeout(5000);


  // Step 6: Select last option in dropdown
  const lastOption = page.getByRole('menuitem', { name: 'Free Test' });
  await lastOption.waitFor({ state: 'visible', timeout: 30000 });
  await lastOption.click();
  await page.waitForTimeout(5000);

  // Step 7: Open invoice creation page
  await page.goto('https://sndrydocktest.azurewebsites.net/arInvoiceInfo/0/10/0/0');
  await page.waitForTimeout(5000);


  // Step 8: Select 'Free - New QA' in 'Process' dropdown using robust locator
  // Try to find the first visible button with the expected text or aria-label
  const processDropdownBtn = page.locator('button:has-text("Open or close the drop-down window")').first();
  await processDropdownBtn.waitFor({ state: 'visible', timeout: 10000 });
  await processDropdownBtn.click();
  await page.waitForTimeout(1000);
  await page.locator('text=Free - New QA').click();
  await page.waitForTimeout(2000);

  // Step 9: Select 'Ship Code' as 'ACAL' using direct locator
  const shipCodeLabel = page.locator('text=Ship Code');
  const shipCodeDropdownBtn = shipCodeLabel.locator('xpath=..').locator('button:has-text("Open or close the drop-down window")');
  await shipCodeDropdownBtn.waitFor({ state: 'visible', timeout: 10000 });
  await shipCodeDropdownBtn.click();
  await page.waitForTimeout(500);
  await page.locator('text=ACAL').click();
  await page.waitForTimeout(1000);

  // Step 9b: Select 'Company Code' as 'ACAL' using direct locator
  const companyCodeLabel = page.locator('text=Company Code');
  const companyCodeDropdownBtn = companyCodeLabel.locator('xpath=..').locator('button:has-text("Open or close the drop-down window")');
  await companyCodeDropdownBtn.waitFor({ state: 'visible', timeout: 10000 });
  await companyCodeDropdownBtn.click();
  await page.waitForTimeout(500);
  await page.locator('text=ACAL').click();
  await page.waitForTimeout(1000);

  // Step 10: Set 'Due Date' to '25-Sep' using direct locator
  const dueDateLabel = page.locator('text=Due Date');
  const dueDateDropdownBtn = dueDateLabel.locator('xpath=..').locator('button:has-text("Open or close the drop-down window")');
  await dueDateDropdownBtn.waitFor({ state: 'visible', timeout: 10000 });
  await dueDateDropdownBtn.click();
  await page.waitForTimeout(500);
  await page.locator('text=25-Sep').click();
  await page.waitForTimeout(1000);

  // Step 11: Fill grid below 'Add Invoice Line'
  // Wait for grid to appear
  await page.waitForSelector('text=Add Invoice Line', { timeout: 10000 });
  // Find all grid rows (assuming role=row)
  const gridRows = await page.locator('div[role="row"]').elementHandles();
  for (const row of gridRows) {
    // Select first option in 'Quantity type' combobox in each row
    const qtyTypeCombo = await row.$('select[name="QuantityType"]');
    if (qtyTypeCombo) {
      await qtyTypeCombo.selectOption({ index: 0 });
    }
    // Fill quantity as '500'
    const qtyInput = await row.$('input[name="Quantity"]');
    if (qtyInput) {
      await qtyInput.fill('500');
    }
    // Fill unit price as '1000'
    const priceInput = await row.$('input[name="UnitPrice"]');
    if (priceInput) {
      await priceInput.fill('1000');
    }
  }
  await page.waitForTimeout(1000);

  // Step 12: Click 'Save'
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(5000);

  // Step 13: Close browser
  await page.close();
});



import { test, expect, chromium } from '@playwright/test';

// Test for AR Invoice workflow automation

test.describe.configure({ timeout: 120000 });
test('AR Invoice MCP E2E Automation - New Flow', async ({ browser }) => {
  // 1. Login to the site from Chrome
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://sndrydocktest.azurewebsites.net/snacsqa');
  // 2. Maximize the window (Playwright sets viewport, so set to a large size)
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(5000);


  // 3. Give credentials ‘balasubu’ and ‘Shipnet1’ with robust selectors
  const usernameInput = await page.$('input[name="username"], input[placeholder*="User" i], input[type="text"]');
  const passwordInput = await page.$('input[name="password"], input[placeholder*="Pass" i], input[type="password"]');
  if (!usernameInput || !passwordInput) {
    throw new Error('Login fields not found');
  }
  await usernameInput.fill('balasubu');
  await passwordInput.fill('Shipnet1');
  await page.waitForTimeout(10000);


  // 4. Click 'Login'
  await page.click('button:has-text("Login"), input[type="submit"]');
  await page.waitForLoadState('load');
  await page.waitForTimeout(8000); // Keep a small wait for client-side rendering

  // 5. Search for second 'New' menu item and hover
  await page.waitForLoadState('networkidle');
  // Wait for a post-login element to appear (e.g., dashboard or main menu)
  await page.waitForSelector('text=Invoice Summary', { timeout: 20000 });
  // Find the parent container of 'Invoice Summary'
  const summaryParent = page.locator('text=Invoice Summary').locator('xpath=..');
  await summaryParent.waitFor({ state: 'visible', timeout: 10000 });
  const summarySiblings = await summaryParent.locator('xpath=./*').allTextContents();
  // Find index of 'Invoice Summary' and look for 'Export Excel' next to it
  const summaryIndex = summarySiblings.findIndex(t => t.includes('Invoice Summary'));
  const exportIndex = summarySiblings.findIndex((t, i) => i > summaryIndex && t.includes('Export Excel'));
  if (exportIndex === -1) throw new Error(`Could not find 'Export Excel' next to 'Invoice Summary'. Siblings: ${JSON.stringify(summarySiblings)}`);
  // Now find 'New' next to 'Export Excel'
  const newIndex = summarySiblings.findIndex((t, i) => i > exportIndex && t.includes('New'));
  if (newIndex === -1) throw new Error(`Could not find 'New' menu item next to 'Export Excel'. Siblings: ${JSON.stringify(summarySiblings)}`);
  const newMenu = summaryParent.locator(`xpath=./*[${newIndex + 1}]`);
  await newMenu.waitFor({ state: 'visible', timeout: 10000 });
  await newMenu.hover();
  await page.waitForTimeout(10000);

  // 6. Select the first option in the 'New' dropdown
  const dropdownOptions = await page.$$('ul[role="menu"] li, .dropdown-menu li, [role="menuitem"]');
  if (dropdownOptions.length === 0) throw new Error('No dropdown options found');
  await dropdownOptions[0].click();
  await page.waitForTimeout(10000);

  // 7. Wait for the new tab to load
  const [newTab] = await Promise.all([
    context.waitForEvent('page'),
    // The click above should open a new tab
  ]);
  await newTab.waitForLoadState('domcontentloaded');
  await newTab.bringToFront();
  await newTab.waitForTimeout(10000);

  // 8. Type 'BUDGET NEW' in the 'Process' dropdown and select
  await newTab.fill('input[aria-label*="Process"], input[placeholder*="Process"]', 'BUDGET NEW');
  await newTab.waitForTimeout(2000);
  await newTab.keyboard.press('Enter');
  await newTab.waitForTimeout(7000);

  // 9. Ship Code dropdown
  await newTab.fill('input[aria-label*="Ship Code"], input[placeholder*="Ship Code"]', 'TURC');
  await newTab.waitForTimeout(2000);
  await newTab.keyboard.press('Enter');
  await newTab.waitForTimeout(7000);

  // 10. Period From dropdown
  await newTab.click('input[aria-label*="Period From"], input[placeholder*="Period From"]');
  await newTab.waitForTimeout(2000);
  await newTab.keyboard.press('Enter');
  await newTab.waitForTimeout(7000);

  // 11. Period To dropdown
  await newTab.click('input[aria-label*="Period To"], input[placeholder*="Period To"]');
  await newTab.waitForTimeout(2000);
  await newTab.keyboard.press('ArrowDown');
  await newTab.keyboard.press('Enter');
  await newTab.waitForTimeout(7000);

  // 12. Due Date column - select current date
  await newTab.click('input[aria-label*="Due Date"], input[placeholder*="Due Date"]');
  await newTab.waitForTimeout(2000);
  // Select today in calendar (assume today is highlighted)
  await newTab.click('.ant-picker-cell-today, .mat-calendar-body-today, td[aria-current="date"]');
  await newTab.waitForTimeout(7000);

  // 13. Project dropdown - select first option
  await newTab.click('input[aria-label*="Project"], input[placeholder*="Project"]');
  await newTab.waitForTimeout(2000);
  await newTab.keyboard.press('ArrowDown');
  await newTab.keyboard.press('Enter');
  await newTab.waitForTimeout(7000);

  // 14. Click 'Save' button
  await newTab.click('button:has-text("Save")');
  await newTab.waitForTimeout(7000);

  // 15. Click 'Workflow' button
  await newTab.click('button:has-text("Workflow")');
  await newTab.waitForTimeout(7000);

  // 16. Select 'Approve' or 'Transfer' button
  const approveBtn = await newTab.$('button:has-text("Approve")');
  const transferBtn = await newTab.$('button:has-text("Transfer")');
  if (approveBtn) {
    await approveBtn.click();
  } else if (transferBtn) {
    await transferBtn.click();
  } else {
    throw new Error('Neither Approve nor Transfer button found');
  }
  await newTab.waitForTimeout(7000);

  // 18. Click on 'Confirm' button
  await newTab.click('button:has-text("Confirm")');
  await newTab.waitForTimeout(7000);

  // Close browser
  await context.close();
});

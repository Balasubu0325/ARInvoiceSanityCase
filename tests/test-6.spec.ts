import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://sndrydocktest.azurewebsites.net/arinvoiceqatest', { timeout: 120000 });
  // Screenshot after navigation to diagnose page state
  await page.screenshot({ path: 'after-navigation.png', fullPage: true });
  // Check if login page is loaded
  const usernameField = await page.$('input[name="loginModel.Username"], input[placeholder="Enter Username"]');
  if (!usernameField) {
    throw new Error('Login page not loaded. See after-navigation.png for details.');
  }
  await page.getByRole('textbox', { name: 'Enter Username' }).click({ timeout: 60000 });
  await page.getByRole('textbox', { name: 'Enter Username' }).fill('balasubu', { timeout: 60000 });
  await page.getByRole('textbox', { name: 'Enter Username' }).press('Tab', { timeout: 60000 });
  await page.getByRole('textbox', { name: 'Enter Password' }).click({ timeout: 60000 });
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('Shipnet1', { timeout: 60000 });
  await page.getByRole('button', { name: 'Login' }).click({ timeout: 60000 });
  await page.getByRole('menuitem', { name: 'New' }).click({ timeout: 60000 });
  const page1Promise = page.waitForEvent('popup', { timeout: 120000 });
  console.log('Waiting for Accounting menu item...');
  try {
    await page.getByRole('menuitem', { name: 'Accounting' }).click({ timeout: 120000 });
    console.log('Accounting menu item clicked.');
  } catch (e) {
    console.log('Accounting menu item not found, capturing screenshot...');
    await page.screenshot({ path: 'accounting-menuitem-error.png', fullPage: true });
    throw e;
  }
  const page1 = await page1Promise;
  // Debug screenshot before clicking the button
  await page1.screenshot({ path: 'before-outline-secondary-btn.png', fullPage: true });
  await page1.locator('.dxbl-btn.dxbl-btn-outline-secondary').first().click({ timeout: 60000 });
  await page1.getByRole('cell', { name: 'TEST ANNE SOFIE' }).click({ timeout: 60000 });
  await page1.locator('input[name="cboShipCode"]').click({ timeout: 60000 });
  await page1.locator('input[name="cboShipCode"]').fill('smr', { timeout: 60000 });
  await page1.getByText('SMRS', { exact: true }).click({ timeout: 60000 });
  await page1.getByRole('combobox', { name: 'SMRS - SYNERGY RECRTMNT SVCS-' }).dblclick({ timeout: 60000 });
  await page1.getByRole('combobox', { name: 'SMRS - SYNERGY RECRTMNT SVCS-' }).click({ timeout: 60000 });
  await page1.getByRole('combobox', { name: 'SMRS - SYNERGY RECRTMNT SVCS-' }).click({ timeout: 60000 });
  await page1.getByRole('combobox', { name: 'SMRS - SYNERGY RECRTMNT SVCS-' }).fill('aca', { timeout: 60000 });
  await page1.getByText('ACAL').click({ timeout: 60000 });
  await page1.getByRole('combobox', { name: 'SMRS - SYNERGY RECRUITMENT' }).click({ timeout: 60000 });
  await page1.getByRole('combobox', { name: 'SMRS - SYNERGY RECRUITMENT' }).fill('sm', { timeout: 60000 });
  await page1.getByRole('combobox', { name: 'sm Open or close the drop-' }).fill('smr', { timeout: 60000 });
  await page1.getByText('SMRS').click({ timeout: 60000 });
  await page1.locator('#id9e4a42f1-75ea-4ca6-9197-98975fff7577 > .dxbl-btn-group > .dxbl-btn').click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'Previous Month' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'Previous Month' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'Previous Month' }).click({ timeout: 60000 });
  await page1.getByText('1', { exact: true }).first().click({ timeout: 60000 });
  await page1.getByRole('combobox', { name: '06/01/2025 Open or close the' }).click({ timeout: 60000 });
  await page1.locator('#idcf3331d9-7989-4619-9214-9a99c57abe6d > .dxbl-btn-group > .dxbl-btn').click({ timeout: 60000 });
  await page1.getByRole('cell', { name: '24' }).locator('a').click({ timeout: 60000 });
  await page1.locator('input[name="cboCustomer"]').click({ timeout: 60000 });
  await page1.locator('input[name="cboCustomer"]').fill('scorpio', { timeout: 60000 });
  await page1.getByRole('cell', { name: 'SCORPIO', exact: true }).locator('div').click({ timeout: 60000 });
  await page1.locator('#idb8de9d5b-7ee1-4ef6-8c65-15d2f1597e4b > .dxbl-btn-group > .dxbl-btn').click({ timeout: 60000 });
  await page1.getByRole('cell', { name: '30' }).click({ timeout: 60000 });
  await page1.getByRole('group').getByRole('button', { name: 'Save' }).click({ timeout: 60000 });
  await page1.getByRole('row', { name: 'CREW_GEN 5120-110 Exp of Crew' }).locator('button[name="btnCancel"]').click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'Yes' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: '', exact: true }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'Cancel' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: '', exact: true }).click({ timeout: 60000 });
  await page1.getByRole('row', { name: 'Check box checked SMRS 5120-110 OTHER UNION FEE USD 150.00 11,913.05 ACAL' }).getByLabel('Check box checked').uncheck({ timeout: 60000 });
  await page1.getByRole('button', { name: 'OK' }).click({ timeout: 60000 });
  await page1.locator('dxbl-scroll-viewer').filter({ hasText: 'Line Code Account Number' }).locator('dxbl-thumb').nth(1).click({ timeout: 60000 });
  await page1.locator('dxbl-scroll-viewer').filter({ hasText: 'Line Code Account Number' }).locator('dxbl-scroll-bar').nth(1).click({ timeout: 60000 });
  await page1.getByRole('group').getByRole('button', { name: 'Save' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'Preview' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: '' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'Workflow' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'Transfer' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'Confirm' }).click({ timeout: 60000 });
  await page1.getByRole('button', { name: 'More items...' }).click({ timeout: 60000 });
  const page2Promise = page1.waitForEvent('popup', { timeout: 120000 });
  await page1.getByRole('menuitemcheckbox', { name: 'Create Credit Note' }).click({ timeout: 60000 });
  const page2 = await page2Promise;
  await page2.getByRole('group').getByRole('button', { name: 'Save' }).click({ timeout: 60000 });
  await page2.getByRole('button', { name: 'Workflow' }).click({ timeout: 60000 });
  await page2.getByRole('button', { name: 'icon: close' }).click({ timeout: 60000 });
  await page2.getByRole('button', { name: 'Transfer' }).click({ timeout: 60000 });
  await page2.getByRole('button', { name: 'Confirm' }).click({ timeout: 60000 });
  await page.getByRole('menuitem', { name: 'Refresh' }).click({ timeout: 60000 });
  await page.getByText('Transferred').click({ timeout: 60000 });
  await page.getByText('Transferred').click({ timeout: 60000 });
});
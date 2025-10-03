import { test, expect } from '@playwright/test';

test.describe('FPR Configuration Delete Functionality', () => {
  // Assume login is handled globally or in a setup file.
  // If not, add login steps here.
  test.beforeEach(async ({ page }) => {
    // Navigate to the page with the table.
    // The URL is based on the provided image.
    await page.goto('http://localhost:62534/SNACS');
    // You might need to wait for the table to be visible
    await page.waitForSelector('table');
  });

  test('should close confirmation popup when "No" is clicked', async ({ page }) => {
    // 1. Find a record and click the delete button.
    // We'll target the row with the code 'T12' as an example.
    const row = page.locator('tr:has-text("T12")');
    const deleteButton = row.locator('button[aria-label="delete"], .delete-icon'); // Adjust selector as needed

    // Assuming the delete button is a trash icon, it might be inside a button or have a specific class.
    // Let's try to find a delete button in the first row as a fallback.
    const firstDeleteButton = page.locator('tbody tr:first-child >> [aria-label*="delete"], tbody tr:first-child >> .delete-icon, tbody tr:first-child >> text=Delete').first();
    await firstDeleteButton.click();

    // 2. Verify the confirmation message is shown.
    await expect(page.locator('text=Are you sure you want to delete this record?')).toBeVisible();

    // 3. Click the "No" button.
    await page.click('text=No');

    // 4. Verify the popup closes.
    await expect(page.locator('text=Are you sure you want to delete this record?')).not.toBeVisible();

    // 5. Verify the record remains.
    // We check if the first row still exists. A more robust check would be to verify the specific record's text.
    await expect(page.locator('tbody tr:first-child')).toBeVisible();
  });

  test('should delete the record when "Yes" is clicked', async ({ page }) => {
    // We need to add a record first to safely delete it.
    // This is a placeholder for the steps to add a new record.
    // For now, we will assume a record exists that we can delete.
    
    // Let's count the rows before deletion
    const initialRowCount = await page.locator('tbody tr').count();

    // 1. Find a record and click the delete button.
    const firstDeleteButton = page.locator('tbody tr:first-child >> [aria-label*="delete"], tbody tr:first-child >> .delete-icon, tbody tr:first-child >> text=Delete').first();
    await firstDeleteButton.click();

    // 2. Verify the confirmation message is shown.
    await expect(page.locator('text=Are you sure you want to delete this record?')).toBeVisible();

    // 3. Click the "Yes" button.
    await page.click('text=Yes');

    // 4. Verify the popup closes.
    await expect(page.locator('text=Are you sure you want to delete this record?')).not.toBeVisible();

    // 5. Verify the record is deleted.
    // The row count should be one less than the initial count.
    // This might need a small delay for the UI to update.
    await page.waitForTimeout(1000); // Wait for UI to update
    const newRowCount = await page.locator('tbody tr').count();
    expect(newRowCount).toBe(initialRowCount - 1);
  });
});

const { chromium } = require('playwright');

(async () => {
    // Step 1: Launch the browser and navigate to the login page
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://sndrydocktest.azurewebsites.net/arinvoiceqatest');
    await page.waitForTimeout(5000);

    // Step 2: Maximize the browser window
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(5000);

    // Step 3: Input credentials into the login form
    await page.fill('input[name="username"]', 'balasubu');
    await page.fill('input[name="password"]', 'Shipnet1');
    await page.waitForTimeout(5000);

    // Step 4: Click the 'Login' button
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    // Step 5: Click on the 'New' dropdown next to 'Export Excel'
    await page.click('selector-for-new-dropdown');  // Replace with the actual selector
    await page.waitForTimeout(5000);

    // Step 6: Select the last option in the dropdown
    const options = await page.$$('selector-for-dropdown-options');  // Replace with the actual selector
    await options[options.length - 1].click();
    await page.waitForTimeout(5000);

    // Step 7: Close the browser
    await browser.close();
})();
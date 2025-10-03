import { test, expect, chromium, Page } from '@playwright/test';

// Helper to add an 8-second wait after each significant step
async function stepWait(page: Page) {
  await page.waitForTimeout(8000);
}

// Error-text heuristics removed; we only validate presence of previewable content.

test('SNACSQA: Login and open Preview from My Work Items (Chrome only)', async ({}, testInfo) => {
  test.setTimeout(10 * 60 * 1000); // 10 minutes

  // Launch Google Chrome headed and maximized
  const isCI = !!process.env.CI;
  const launchOptions: Parameters<typeof chromium.launch>[0] = {
    headless: isCI ? true : false,
    args: ['--start-maximized'],
  };
  // Only force channel chrome on local; on CI, default chromium is more reliable
  if (!isCI) launchOptions.channel = 'chrome';
  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({ viewport: null }); // inherit window size (maximized)
  const page = await context.newPage();

  // Helper: maximize window using CDP (works for Chrome/Chromium)
  const maximizeWindow = async (p: Page) => {
    try {
      const session = await p.context().newCDPSession(p);
      const { windowId } = await session.send('Browser.getWindowForTarget');
      await session.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'maximized' } });
    } catch {
      // Non-fatal; continue without throwing
    }
  };

  try {
    // 1) Navigate to site
    await page.goto('https://sndrydocktest.azurewebsites.net/snacsqa', { waitUntil: 'domcontentloaded' });
    await stepWait(page);

  // 2) Window already maximized via '--start-maximized' + viewport: null
  // No strict assertion here since viewportSize() is null when viewport is disabled
  await stepWait(page);

  // 3) Check if the text fields are clickable (Username & Password)
  const username = page.locator('input[name="loginModel.Username"], input[placeholder="Enter Username"]');
  const password = page.locator('input[name="password"], input[placeholder="Enter Password"]');
  await expect(username).toBeVisible({ timeout: 60_000 });
  await expect(password).toBeVisible({ timeout: 60_000 });
  await username.click();
  await expect(username).toBeFocused();
  await password.click();
  await expect(password).toBeFocused();
  await stepWait(page);

  // 4) Fill credentials from environment variables (fallbacks to blanks to force failure clearly if not set)
  const snUser = process.env.SN_USERNAME ?? '';
  const snPass = process.env.SN_PASSWORD ?? '';
  if (!snUser || !snPass) {
    throw new Error('Missing credentials: set SN_USERNAME and SN_PASSWORD as environment variables (or GitHub Secrets in CI).');
  }
  await username.fill(snUser);
  await password.fill(snPass);
  await stepWait(page);

    // 5) Click Login
    await page.getByRole('button', { name: 'Login' }).click();
    await stepWait(page);

  // 6) Wait for the screen to load (dashboard/home after login)
  // Prefer a semantic wait: look for the My Work Items tab/section
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('text=My Work Items', { timeout: 60_000 });
  await stepWait(page);

    // 7) Click on the first invoice number available in ‘My Work Items’ tab
    // If a tab needs selecting, try clicking it first (softly; ignore if already active)
    const myWorkItemsTab = page.getByRole('tab', { name: 'My Work Items' });
    if (await myWorkItemsTab.isVisible().catch(() => false)) {
      await myWorkItemsTab.click({ timeout: 30_000 }).catch(() => undefined);
      await stepWait(page);
    }

    // Try to find the first invoice link inside a table that belongs to My Work Items
    // Fallbacks included to improve robustness
    let clickedInvoice = false;
    const candidateLocators = [
      // Links inside a table that has My Work Items nearby
      page.locator('table:has-text("My Work Items") a').first(),
      // Any link within a region/section labeled My Work Items
      page.locator('section:has-text("My Work Items") a, div:has-text("My Work Items") a').first(),
      // Generic: first link in first table (as a last resort)
      page.locator('table a').first(),
    ];
    for (const loc of candidateLocators) {
      if (await loc.isVisible().catch(() => false)) {
        await loc.click({ timeout: 60_000 });
        clickedInvoice = true;
        break;
      }
    }
    expect(clickedInvoice).toBeTruthy();
    // 8) Wait for the page (invoice details) to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 60_000 }).catch(() => undefined);
    await stepWait(page);

    // 9) Click on ‘Preview’ button
  const previewBtn = page.getByRole('button', { name: 'Preview' });
    await expect(previewBtn).toBeVisible({ timeout: 60_000 });

    // Capture pages before clicking (to detect popup)
    const pagesBefore = new Set(context.pages());
  await previewBtn.click();
  await stepWait(page);

    // Attempt to detect and maximize the preview popup window
    let previewPage: Page | null = null;
    const pagesAfter = context.pages();
    for (const p of pagesAfter) {
      if (!pagesBefore.has(p)) {
        previewPage = p;
        break;
      }
    }
    // As a fallback, try waiting for a 'page' event briefly
    if (!previewPage) {
      previewPage = await context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
    }
    if (previewPage) {
      await previewPage.waitForLoadState('domcontentloaded').catch(() => undefined);
      // Collect console/network logs for diagnostics
      const consoleLogs: string[] = [];
      const requestFailures: string[] = [];
      previewPage.on('console', (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
      previewPage.on('pageerror', (err) => consoleLogs.push(`[pageerror] ${err.message}`));
      previewPage.on('requestfailed', (req) => requestFailures.push(`${req.failure()?.errorText || 'failed'} ${req.url()}`));

      // Try to detect a PDF/object/embed or a canvas/image as preview
      const previewContent = previewPage.locator('embed, object[type*="pdf"], iframe, canvas, img');
      // Give some time for preview to render
      await previewContent.first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => undefined);

      // If an explicit maximize control exists inside the preview, click it; else maximize window
      const maximizeControl = previewPage.getByRole('button', { name: /maximize|full|open/i });
      if (await maximizeControl.isVisible().catch(() => false)) {
        await maximizeControl.click({ timeout: 10_000 }).catch(() => undefined);
      } else {
        await maximizeWindow(previewPage);
      }
      await stepWait(previewPage);

      // Validate: fail only if no preview content is visible
      const hasContent = await previewContent.first().isVisible().catch(() => false);
      if (!hasContent) {
        const shot = await previewPage.screenshot({ fullPage: true });
        await testInfo.attach('popup-preview-not-loaded.png', { body: shot, contentType: 'image/png' });
        const html = await previewPage.content();
        await testInfo.attach('preview-dom.html', { body: html, contentType: 'text/html' });
        await testInfo.attach('preview-console.txt', { body: consoleLogs.join('\n'), contentType: 'text/plain' });
        await testInfo.attach('preview-network-failures.txt', { body: requestFailures.join('\n'), contentType: 'text/plain' });
        expect(hasContent, 'Preview window opened but did not load previewable content within 30s').toBeTruthy();
      }
    } else {
      // If no popup, try maximizing the current window (in case preview is inline)
      await maximizeWindow(page);
      await stepWait(page);

      // Inline preview validation on the same page
      // Collect console/network logs for diagnostics
      const consoleLogs: string[] = [];
      const requestFailures: string[] = [];
      page.on('console', (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
      page.on('pageerror', (err) => consoleLogs.push(`[pageerror] ${err.message}`));
      page.on('requestfailed', (req) => requestFailures.push(`${req.failure()?.errorText || 'failed'} ${req.url()}`));

      const previewContent = page.locator('embed, object[type*="pdf"], iframe, canvas, img');
      await previewContent.first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => undefined);
      const hasContent = await previewContent.first().isVisible().catch(() => false);
      if (!hasContent) {
        const shot = await page.screenshot({ fullPage: true });
        await testInfo.attach('inline-preview-not-loaded.png', { body: shot, contentType: 'image/png' });
        const html = await page.content();
        await testInfo.attach('preview-dom.html', { body: html, contentType: 'text/html' });
        await testInfo.attach('preview-console.txt', { body: consoleLogs.join('\n'), contentType: 'text/plain' });
        await testInfo.attach('preview-network-failures.txt', { body: requestFailures.join('\n'), contentType: 'text/plain' });
        expect(hasContent, 'Inline preview did not load previewable content within 30s').toBeTruthy();
      }
    }

    // 10) Give wait time of 8 seconds of each step (already applied above per step)
  } finally {
    // 2) Close the browser after the test is completed (always)
    await browser.close();
  }
});

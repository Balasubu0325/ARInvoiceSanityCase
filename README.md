# Playwright AR Invoice E2E

This repo contains Playwright tests for SNACS QA invoice preview flows.

## Local setup

- Requirements: Node.js 18+ (recommended 20), npm
- Install deps:

```
npm ci
```

- Install Playwright browsers:

```
npx playwright install
```

- Set environment variables for credentials (PowerShell examples):

```
$env:SN_USERNAME = "your-username"
$env:SN_PASSWORD = "your-password"
```

- Run a single test headed in Chromium:

```
npx playwright test tests/snacsqa-login-preview.spec.ts --project=chromium --headed
```

- Open last HTML report:

```
npx playwright show-report
```

## CI/CD (GitHub Actions)

A workflow at `.github/workflows/playwright.yml` runs tests on push/PR.

- Add repository secrets:
  - `SN_USERNAME`
  - `SN_PASSWORD`

The pipeline will:
- Check out code
- Install Node and dependencies
- Install Playwright browsers
- Run tests in Chromium
- Upload the HTML report as an artifact

## Notes
- The preview step fails the test and uploads a screenshot if preview content doesn’t load within 30 seconds (popup or inline).
- Locally, the test launches Chrome headed and maximized; on CI it runs headless Chromium.

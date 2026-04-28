const APP_URL = process.env.APP_URL || 'http://127.0.0.1:3000/';

(async () => {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('h1').first().waitFor({ timeout: 10000 });

  const begin = page.getByRole('button', { name: 'Begin ->' });
  if (await begin.count()) await begin.click();

  await page.locator('.card-enter').first().click();
  await page.getByRole('button', { name: 'Authority Helper' }).click();
  await page.getByPlaceholder('Ask about this card...').fill('What does FDA say about software validation?');
  await page.getByRole('button', { name: 'Ask' }).click();
  await page.getByText('From the local authority cache:').waitFor({ timeout: 10000 });

  const answerText = await page.locator('body').textContent();
  const sourceLinks = await page.locator('a[href*="fda.gov"]').count();

  await browser.close();

  const result = {
    ok: true,
    hasFDA: answerText.includes('FDA'),
    hasAuthorityLead: answerText.includes('From the local authority cache:'),
    sourceLinks,
    errorLogCount: errors.length,
    errors,
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.hasFDA || !result.hasAuthorityLead || result.sourceLinks < 1 || errors.length > 0) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

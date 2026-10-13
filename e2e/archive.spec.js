const { test, expect } = require('@playwright/test');

test('navigates the checked-in archive and updates route state', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Research project index' })).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Archive scope' })).toContainText('outside this archive');

  await page.getByRole('link', { name: /^NLP A statistical/ }).click();
  await expect(page).toHaveURL(/#\/nlp$/);
  await expect(page).toHaveTitle('NLP language model · Jaden Fix');
  await expect(page.getByRole('heading', { name: 'N-Gram Language Model for Next-Word Prediction' })).toBeVisible();
  await expect(page.locator('#research-content')).toBeFocused();
});

test('recovers a stale saved route instead of rendering blank content', async ({ page }) => {
  await page.goto('./#/retired-project');
  await expect(page.getByRole('heading', { name: 'This archive page does not exist' })).toBeVisible();
  await expect(page.getByText('/retired-project')).toBeVisible();
  await expect(page).toHaveTitle('Page not found · Jaden Fix');

  await page.getByRole('link', { name: 'Return to the verified archive index' }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole('heading', { name: 'Research project index' })).toBeVisible();
  await expect(page.locator('#research-content')).toBeFocused();
});

test('keeps all five internal project routes usable', async ({ page }) => {
  const routes = [
    ['/masters-thesis', "Integrating Deep Learning, Stochastic Modeling, & Physics-Based Methods"],
    ['/predictive-stochastic', 'Predictive Stochastic Modeling for Financial Markets'],
    ['/solana-tools', 'Solana Trading Tools Suite'],
    ['/nlp', 'N-Gram Language Model for Next-Word Prediction'],
    ['/bayesian-cnn', 'Bayesian CNN for CIFAR-10 Image Classification'],
  ];
  for (const [route, heading] of routes) {
    await page.goto(`./#${route}`);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
});

test('supports keyboard skip navigation', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#research-content')).toBeFocused();
});

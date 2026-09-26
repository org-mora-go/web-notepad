import { expect, test } from '@playwright/test';

test('notepad supports add, history, clear history, and tab close flows', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const tabTitles = () => page.locator('[role="tab"]').allTextContents();

  await expect(page).toHaveTitle(/Notepad/);

  const initialTabs = await tabTitles();
  expect(initialTabs.length).toBeGreaterThan(0);

  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabsAfterAddButton = await tabTitles();
  expect(tabsAfterAddButton.length).toBe(initialTabs.length + 1);

  await page.locator('textarea').fill('hello world');
  await page.keyboard.press('Alt+w');

  await page.locator('button[aria-controls="unsaved-history"]').click();
  await expect(page.locator('.history-item').first()).toContainText('hello world');
  await page.locator('button:has-text("Clear")').click();
  await expect(page.locator('.clear-confirm-modal p')).toContainText('Everything will be deleted.');
  await page.locator('.confirm-delete').click();
  await expect(page.locator('.history-empty p')).toContainText('Empty History');
  await expect(page.locator('button:has-text("Clear")')).toHaveCount(0);
  await page.locator('.panel-close').click();

  await page.keyboard.press('Meta+n');
  const tabsAfterMetaN = await tabTitles();
  expect(tabsAfterMetaN.length).toBe(initialTabs.length + 1);

  await page.keyboard.press('Alt+w');
  const tabsAfterAltW = await tabTitles();
  expect(tabsAfterAltW.length).toBe(tabsAfterMetaN.length - 1);
});

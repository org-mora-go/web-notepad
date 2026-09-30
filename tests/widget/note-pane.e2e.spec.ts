import { expect, test } from '@playwright/test';

test('탭 번호가 재사용되어도 새 탭이 기존 북마크를 덮어쓰지 않는다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	await page.locator('button[aria-label="새 탭 추가"]').click();
	const bookmarkedTab = page.locator('.tab-item').nth(1);
	await bookmarkedTab.locator('[role="tab"]').click();
	await page.locator('textarea').fill('bookmarked original');
	await bookmarkedTab.locator('[role="tab"]').click({ button: 'right' });
	await page.getByRole('menuitem', { name: 'Bookmark' }).click();
	await bookmarkedTab.locator('.tab-close').click();

	await page.locator('button[aria-label="새 탭 추가"]').click();
	await page.locator('textarea').fill('new tab content');
	await page.getByRole('button', { name: 'BOOKMARKS' }).click();

	await expect(page.locator('.bookmark-item p')).toHaveText('bookmarked original');
});

test('마지막 탭을 닫아도 북마크된 탭 ID는 재사용되지 않는다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const bookmarkedTab = page.locator('.tab-item').first();
	await page.locator('textarea').fill('bookmarked original');
	await bookmarkedTab.locator('[role="tab"]').click({ button: 'right' });
	await page.getByRole('menuitem', { name: 'Bookmark' }).click();
	await bookmarkedTab.locator('.tab-close').click();
	await page.locator('textarea').fill('replacement tab content');
	await page.getByRole('button', { name: 'BOOKMARKS' }).click();

	await expect(page.locator('.bookmark-item p')).toHaveText('bookmarked original');
});

test('탭을 마우스 휠 클릭하면 탭이 닫힌다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	await page.locator('button[aria-label="새 탭 추가"]').click();
	const tabs = page.locator('[role="tab"]');
	await expect(tabs).toHaveCount(2);
	await tabs.nth(1).click({ button: 'middle' });
	await expect(tabs).toHaveCount(1);
});

test('탭은 짧은 제목에 맞춰지고 제목 길이에 따라 제한 너비 내에서 늘어난다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const shortTab = page.locator('.tab-item').first();
	const shortWidth = await shortTab.evaluate((element) => element.getBoundingClientRect().width);
	const editor = page.locator('textarea').first();
	await editor.fill('A title long enough to expand this tab');

	const activeTab = page.locator('.tab-item.is-active');
	await expect(activeTab.locator('.tab-title')).toContainText('A title long enough');
	const expandedWidth = await activeTab.evaluate((element) => element.getBoundingClientRect().width);
	expect(expandedWidth).toBeGreaterThan(shortWidth);
	expect(expandedWidth).toBeLessThanOrEqual(301);
});

test('컨텍스트 메뉴에서 탭을 고정하면 닫기 버튼이 숨겨지고 가운데 클릭으로 닫히지 않는다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const tab = page.locator('.tab-item').first();
	await tab.locator('[role="tab"]').click({ button: 'right' });
	await page.getByRole('menuitem', { name: 'Pin' }).click();

	await expect(tab).toHaveClass(/is-pinned/);
	await expect(tab.locator('.tab-close')).toHaveCount(0);

	await tab.locator('[role="tab"]').click({ button: 'middle' });
	await expect(tab).toHaveClass(/is-pinned/);
});

test('고정된 탭은 Alt+W 단축키로 닫히지 않는다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const tabTitles = () => page.locator('[role="tab"]').allTextContents();
	await expect(page.locator('[role="tab"]').first()).toBeVisible();
	const initialTabCount = (await tabTitles()).length;

	const tab = page.locator('.tab-item').first();
	await tab.locator('[role="tab"]').click({ button: 'right' });
	await page.getByRole('menuitem', { name: 'Pin' }).click();

	await page.keyboard.press('Alt+w');

	expect((await tabTitles()).length).toBe(initialTabCount);
	await expect(tab).toHaveClass(/is-pinned/);
});

test('컨텍스트 메뉴에서 Escape를 누르면 아무 변경 없이 메뉴만 닫힌다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const tab = page.locator('.tab-item').first();
	await tab.locator('[role="tab"]').click({ button: 'right' });
	await expect(page.locator('[role="menu"]')).toBeVisible();

	await page.keyboard.press('Escape');

	await expect(page.locator('[role="menu"]')).toHaveCount(0);
	await expect(tab).not.toHaveClass(/is-pinned/);
	await expect(tab).not.toHaveClass(/is-bookmarked/);
});

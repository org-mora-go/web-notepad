import { expect, test } from '@playwright/test';

test('notepad supports add, bookmark, remove bookmark, and tab close flows', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const tabTitles = () => page.locator('[role="tab"]').allTextContents();

  await expect(page).toHaveTitle(/Notepad/);

  const initialTabs = await tabTitles();
  expect(initialTabs.length).toBeGreaterThan(0);

  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabsAfterAddButton = await tabTitles();
  expect(tabsAfterAddButton.length).toBe(initialTabs.length + 1);

  await page.locator('textarea').fill('hello world');
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Bookmark', exact: true }).click();
  await page.keyboard.press('Alt+w');

  await page.getByRole('button', { name: 'BOOKMARKS' }).click();
  await expect(page.locator('.bookmark-item').first()).toContainText('hello world');
  await page.locator('.remove-bookmark').first().click();
  await expect(page.locator('.bookmark-empty')).toContainText('Empty Bookmarks');
  await page.getByRole('button', { name: '북마크 닫기' }).click();

  await page.keyboard.press('Meta+n');
  const tabsAfterMetaN = await tabTitles();
  expect(tabsAfterMetaN.length).toBe(initialTabs.length + 1);

  await page.keyboard.press('Alt+w');
  const tabsAfterAltW = await tabTitles();
  expect(tabsAfterAltW.length).toBe(tabsAfterMetaN.length - 1);
});

test('a new tab does not overwrite a bookmark when a tab number is reused', async ({ page }) => {
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

test('closing the last tab does not reuse a bookmarked tab ID', async ({ page }) => {
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

test('middle-clicking a tab closes it', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabs = page.locator('[role="tab"]');
  await expect(tabs).toHaveCount(2);
  await tabs.nth(1).click({ button: 'middle' });
  await expect(tabs).toHaveCount(1);
});

test('tabs fit short titles and grow within the title-based width limit', async ({ page }) => {
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

test('line numbers stay aligned with the editor at the end of a long note', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const editor = page.locator('textarea').first();
  await editor.fill(Array.from({ length: 120 }, (_, index) => `line ${index + 1}`).join('\n'));
  await editor.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    element.dispatchEvent(new Event('scroll', { bubbles: true }));
  });

  await expect.poll(async () => {
    return page.locator('.note-editor').evaluate((element) => {
      const editor = element.querySelector('textarea');
      const lineRail = element.querySelector<HTMLElement>('.line-rail');
      if (!editor || !lineRail) return null;

      return {
        scrollOffsetDifference: editor.scrollTop - lineRail.scrollTop,
        maxScrollDifference:
          editor.scrollHeight - editor.clientHeight -
          (lineRail.scrollHeight - lineRail.clientHeight),
      };
    });
  }).toEqual({
    scrollOffsetDifference: 0,
    maxScrollDifference: 0,
  });
});

test('Tab inserts once at the caret and waits for Korean composition to finish', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const editor = page.locator('textarea').first();
  await editor.fill('left right');
  await editor.evaluate((element) => (element as HTMLTextAreaElement).setSelectionRange(4, 4));
  await page.keyboard.press('Tab');
  await expect(editor).toHaveValue('left\t right');
  await expect
    .poll(() => editor.evaluate((element) => (element as HTMLTextAreaElement).selectionStart))
    .toBe(5);

  await editor.fill('더ㅑㄹ');
  await editor.evaluate((element) => (element as HTMLTextAreaElement).setSelectionRange(1, 1));
  await editor.evaluate((element) =>
    element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true })),
  );
  await page.keyboard.press('Tab');
  await expect(editor).toHaveValue('더ㅑㄹ');

  await editor.evaluate((element) => {
    const textarea = element as HTMLTextAreaElement;
    type TestWindow = Window & {
      __tabTestQueuedFrames?: FrameRequestCallback[];
      __tabTestOriginalRequestAnimationFrame?: typeof window.requestAnimationFrame;
    };
    const testWindow = window as TestWindow;
    testWindow.__tabTestQueuedFrames = [];
    testWindow.__tabTestOriginalRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => {
      testWindow.__tabTestQueuedFrames?.push(callback);
      return testWindow.__tabTestQueuedFrames?.length ?? 0;
    };
    textarea.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
    const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    setValue?.call(textarea, '더한글ㅑㄹ');
    textarea.setSelectionRange(3, 3);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await page.keyboard.press('Tab');
  await expect(editor).toHaveValue('더한글ㅑㄹ');
  await editor.evaluate(() => {
    type TestWindow = Window & {
      __tabTestQueuedFrames?: FrameRequestCallback[];
      __tabTestOriginalRequestAnimationFrame?: typeof window.requestAnimationFrame;
    };
    const testWindow = window as TestWindow;
    const queuedFrames = testWindow.__tabTestQueuedFrames ?? [];
    const originalRequestAnimationFrame = testWindow.__tabTestOriginalRequestAnimationFrame;
    if (originalRequestAnimationFrame) {
      window.requestAnimationFrame = originalRequestAnimationFrame;
    }
    delete testWindow.__tabTestQueuedFrames;
    delete testWindow.__tabTestOriginalRequestAnimationFrame;
    for (const callback of queuedFrames) callback(performance.now());
  });
  await expect(editor).toHaveValue('더한글\tㅑㄹ');
  await expect
    .poll(() => editor.evaluate((element) => (element as HTMLTextAreaElement).selectionStart))
    .toBe(4);
});

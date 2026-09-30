import { expect, test } from "@playwright/test";

test("탭 추가, 북마크 지정, 북마크 제거, 탭 닫기 흐름이 정상 동작한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const tabTitles = () => page.locator('[role="tab"]').allTextContents();

  await expect(page).toHaveTitle(/Notepad/);

  const initialTabs = await tabTitles();
  expect(initialTabs.length).toBeGreaterThan(0);

  await page.locator('button[aria-label="새 탭 추가"]').click();
  const tabsAfterAddButton = await tabTitles();
  expect(tabsAfterAddButton.length).toBe(initialTabs.length + 1);

  await page.locator("textarea").fill("hello world");
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
  await page.keyboard.press("Alt+w");

  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator(".bookmark-item").first()).toContainText(
    "hello world",
  );
  await page.locator(".remove-bookmark").first().click();
  await expect(page.locator(".bookmark-empty")).toContainText(
    "Empty Bookmarks",
  );
  await page.getByRole("button", { name: "북마크 닫기" }).click();

  await page.keyboard.press("Meta+n");
  const tabsAfterMetaN = await tabTitles();
  expect(tabsAfterMetaN.length).toBe(initialTabs.length + 1);

  await page.keyboard.press("Alt+w");
  const tabsAfterAltW = await tabTitles();
  expect(tabsAfterAltW.length).toBe(tabsAfterMetaN.length - 1);
});

test("Cmd+A를 누르면 포커스된 에디터의 전체 텍스트가 선택된다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const editor = page.locator("textarea").first();
  await editor.fill("select all test");
  await page.keyboard.press("Meta+a");

  await expect
    .poll(() =>
      editor.evaluate((element) => {
        const textarea = element as HTMLTextAreaElement;
        return [textarea.selectionStart, textarea.selectionEnd];
      }),
    )
    .toEqual([0, "select all test".length]);
});

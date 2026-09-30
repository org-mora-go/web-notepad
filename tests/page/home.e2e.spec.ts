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

  await page.getByRole("button", { name: "BOOKMARKS" }).click();
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

test("북마크 패널에서 열기를 누르면 닫혔던 탭이 내용과 함께 복원된다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const tabTitles = () => page.locator('[role="tab"]').allTextContents();
  await expect(page.locator('[role="tab"]').first()).toBeVisible();
  const initialTabCount = (await tabTitles()).length;

  const bookmarkedTab = page.locator(".tab-item").first();
  await page.locator("textarea").fill("restored via bookmark panel");
  await bookmarkedTab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  await bookmarkedTab.locator(".tab-close").click();
  // Closing the last tab replaces it with a blank one, so the tab count is unchanged.
  expect((await tabTitles()).length).toBe(initialTabCount);

  await page.getByRole("button", { name: "BOOKMARKS" }).click();
  await page.getByRole("button", { name: "열기" }).click();

  expect((await tabTitles()).length).toBe(initialTabCount + 1);
  await expect(page.locator("textarea")).toHaveValue(
    "restored via bookmark panel",
  );
});

test("내용이 비어있는 탭을 북마크하면 빈 노트로 표시된다", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page.locator("textarea").first()).toHaveValue("");
  await page
    .locator(".tab-item")
    .first()
    .locator('[role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();

  await page.getByRole("button", { name: "BOOKMARKS" }).click();
  await expect(page.locator(".bookmark-item p")).toHaveText("Empty note");
});

test("북마크 패널이 열린 상태에서 배경을 누르면 패널이 다시 닫힌다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const bookmarksButton = page.getByRole("button", { name: "BOOKMARKS" });
  await bookmarksButton.click();
  await expect(bookmarksButton).toHaveAttribute("aria-expanded", "true");

  // The backdrop overlays the whole viewport while open, so the toggle button itself is unreachable.
  await page
    .locator(".bookmark-backdrop")
    .click({ position: { x: 10, y: 10 } });
  await expect(bookmarksButton).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

test("그룹별 노트와 북마크가 분리되고 그룹 삭제 시 Ungrouped로 이동한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  await page.getByRole("button", { name: "Ungrouped (1)" }).click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await expect(page.getByRole("button", { name: "Work (2)" })).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("");

  await page.locator("textarea").fill("Work note");
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();

  await page.getByRole("button", { name: "Work (2)" }).click();
  await expect(page.getByRole("button", { name: "Ungrouped" })).toBeVisible();
  await page.getByRole("button", { name: "Ungrouped" }).click();
  await expect(
    page.getByRole("button", { name: "Ungrouped (2)" }),
  ).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("");
  await page.getByRole("button", { name: "BOOKMARKS" }).click();
  await expect(page.locator(".bookmark-empty")).toContainText(
    "Empty Bookmarks",
  );
  await page.getByRole("button", { name: "북마크 닫기" }).click();

  await page.getByRole("button", { name: "Ungrouped (2)" }).click();
  await page.getByRole("button", { name: "Work", exact: true }).click();
  await expect(page.getByRole("button", { name: "Work (2)" })).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("Work note");
  await page.reload();
  await expect(page.getByRole("button", { name: "Work (2)" })).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("Work note");

  await page.getByRole("button", { name: "Work (2)" }).click();
  await page.getByRole("button", { name: "Work 그룹 삭제" }).click();
  await expect(
    page.getByRole("button", { name: "Ungrouped (1)" }),
  ).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("Work note");
  await page.getByRole("button", { name: "그룹 닫기" }).click();
  await page.getByRole("button", { name: "BOOKMARKS" }).click();
  await expect(page.locator(".bookmark-item")).toContainText("Work note");
});

test("기존 평면 데이터는 Ungrouped에 유지된다", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({
        state: {
          tabs: [
            {
              id: "tab-1",
              title: "Legacy note",
              content: "Legacy content",
              savedContent: "Legacy content",
              urgent: false,
              pinned: false,
              bookmarked: true,
              updatedAt: 1,
            },
          ],
          activeTabId: "tab-1",
          rightTabIds: [],
          activeRightTabId: null,
          activePane: "left",
          splitRatio: 0.5,
          nextTabNumber: 2,
          bookmarks: [
            {
              id: "bookmark-tab-1",
              sourceTabId: "tab-1",
              title: "Legacy note",
              content: "Legacy content",
              createdAt: 1,
            },
          ],
          groups: [{ id: "group-old", name: "Old group", createdAt: 1 }],
        },
        version: 0,
      }),
    );
  });
  await page.goto("http://localhost:3000");

  await expect(page.locator("textarea")).toHaveValue("Legacy content");
  await page.getByRole("button", { name: "Ungrouped (2)" }).click();
  await page.getByRole("button", { name: "Ungrouped", exact: true }).click();
  await expect(page.locator("textarea")).toHaveValue("Legacy content");
  await page.getByRole("button", { name: "BOOKMARKS" }).click();
  await expect(page.locator(".bookmark-item")).toContainText("Legacy content");
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

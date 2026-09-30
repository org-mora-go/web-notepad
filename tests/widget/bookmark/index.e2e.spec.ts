import { expect, test } from "@playwright/test";

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
  expect((await tabTitles()).length).toBe(initialTabCount);

  await page.getByRole("button", { name: "BOOKMARK" }).click();
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

  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator(".bookmark-item p")).toHaveText("Empty note");
  await expect(page.getByRole("button", { name: "더보기" })).toHaveCount(0);
});

test("북마크 패널이 열린 상태에서 배경을 누르면 패널이 다시 닫힌다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const bookmarksButton = page.getByRole("button", { name: "BOOKMARK" });
  await bookmarksButton.click();
  await expect(bookmarksButton).toHaveAttribute("aria-expanded", "true");

  await page
    .locator(".bookmark-backdrop")
    .click({ position: { x: 10, y: 10 } });
  await expect(bookmarksButton).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

test("긴 북마크 본문은 더보기와 간소화로 전체 표시를 전환한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const content = Array.from(
    { length: 10 },
    (_, index) => `line ${index + 1}`,
  ).join("\n");
  await page.locator("textarea").fill(content);
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  await page.getByRole("button", { name: "BOOKMARK" }).click();

  const item = page.locator(".bookmark-item").first();
  const preview = item.locator(".bookmark-content");
  const moreButton = item.getByRole("button", { name: "더보기" });
  await expect(moreButton).toBeVisible();
  await expect
    .poll(() =>
      preview.evaluate(
        (element) => element.clientHeight < element.scrollHeight,
      ),
    )
    .toBe(true);

  await moreButton.click();
  const compactButton = item.getByRole("button", { name: "간소화" });
  await expect(compactButton).toHaveAttribute("aria-expanded", "true");
  await expect
    .poll(() =>
      preview.evaluate(
        (element) => element.clientHeight === element.scrollHeight,
      ),
    )
    .toBe(true);

  await compactButton.click();
  await expect(moreButton).toHaveAttribute("aria-expanded", "false");
  await expect
    .poll(() =>
      preview.evaluate(
        (element) => element.clientHeight < element.scrollHeight,
      ),
    )
    .toBe(true);
});

test("북마크 제거 시 탭 표시를 해제하고 메모는 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const editor = page.locator("textarea").first();
  await editor.fill("Keep this note");
  const tab = page.locator(".tab-item.is-active");
  await tab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  await expect(tab).toHaveClass(/is-bookmarked/);

  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await page.getByRole("button", { name: "Keep this note 북마크 제거" }).click();
  await expect(page.locator(".bookmark-empty")).toContainText(
    "Empty Bookmarks",
  );
  await page.getByRole("button", { name: "북마크 닫기" }).click();

  await expect(editor).toHaveValue("Keep this note");
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});

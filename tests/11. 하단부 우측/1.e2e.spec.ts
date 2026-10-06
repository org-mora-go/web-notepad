import { expect, test } from "@playwright/test";

test("1. 상태 표시줄에 그룹과 북마크 정보를 표시하고 줄 수는 표시하지 않는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("one\ntwo");
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();

  const bookmarkButton = page
    .locator(".status-actions .status-command")
    .first();
  const groupButton = page.locator(".status-actions .status-command").nth(1);
  const bookmarkLabel = bookmarkButton.locator(".status-label");
  const bookmarkCount = bookmarkButton.locator(".status-count");
  const groupCount = groupButton.locator(".status-count");

  await expect(bookmarkLabel).toHaveText("BOOKMARK");
  await expect(bookmarkCount).toHaveText("(1)");
  await expect(groupCount).toHaveText("(1)");
  await expect(page.getByRole("button", { name: /Ungrouped/ })).toBeVisible();
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator(".status-meta")).not.toContainText(/\b\d+ LINES\b/);
    await expect(bookmarkLabel).toBeVisible();
    await expect(bookmarkCount).toBeInViewport();
    await expect(groupCount).toBeInViewport();
  }
});

import { expect, test } from "@playwright/test";

test("1. 상태 표시줄에 노트와 그룹 정보를 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("one\ntwo");
  await expect(page.locator(".status-lines")).toContainText("2 LINES");
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
});

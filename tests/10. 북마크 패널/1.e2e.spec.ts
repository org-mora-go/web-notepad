import { expect, test } from "@playwright/test";

test("1. 상태 표시줄에 북마크 라벨과 개수를 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  const bookmarkCommand = page.locator(".status-actions .status-command").first();
  await expect(bookmarkCommand.locator(".status-label")).toHaveText("BOOKMARK");
  await expect(bookmarkCommand.locator(".status-count")).toHaveText("(1)");
});

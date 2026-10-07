import { expect, test } from "@playwright/test";

test("2. 북마크 명령을 선택하면 북마크 패널을 연다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
});

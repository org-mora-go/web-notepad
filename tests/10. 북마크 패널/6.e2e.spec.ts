import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("6. 북마크 내용을 펼치거나 접을 수 있다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(
    page,
    Array.from({ length: 10 }, (_, index) => `line ${index}`).join("\n"),
  );
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await page.getByRole("button", { name: "더보기" }).click();
  const contentToggle = page.locator(".bookmark-content-toggle");
  await expect(contentToggle).toHaveAttribute("aria-expanded", "true");
  await contentToggle.click();
  await expect(contentToggle).toHaveAttribute("aria-expanded", "false");
});

import { expect, test } from "@playwright/test";

import { bookmarkActiveTab, bookmarksCommand } from "../__util__";

test("1. 북마크 내용을 펼치거나 접을 수 있다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(
    page,
    Array.from({ length: 10 }, (_, index) => `line ${index}`).join("\n"),
  );
  await bookmarksCommand(page).click();
  await page.getByRole("button", { name: "더보기" }).click();
  const contentToggle = page.locator(".expandable-content-toggle");
  await expect(contentToggle).toHaveAttribute("aria-expanded", "true");
  await contentToggle.click();
  await expect(contentToggle).toHaveAttribute("aria-expanded", "false");
});

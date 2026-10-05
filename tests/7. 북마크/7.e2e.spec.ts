import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "./__util__";

test("7. 원본 탭이 없는 북마크를 열면 북마크 내용으로 탭을 복원한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(page, "restored bookmark");
  await page.locator(".tab-item.is-active .tab-close").click();

  await expect(page.locator("textarea")).toHaveValue("");
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await page.getByRole("button", { name: "열기" }).click();

  await expect(page.locator("textarea")).toHaveValue("restored bookmark");
});

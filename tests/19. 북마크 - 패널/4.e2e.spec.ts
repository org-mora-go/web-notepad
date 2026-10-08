import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("4. 원본 탭이 남아 있는 북마크를 열면 해당 탭을 활성화한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(page, "bookmark source");
  await page.locator(".tab-item.is-active .dirty-dot").click();
  await page.locator('.line-rail [role="button"]').first().click();
  await page.locator('button[aria-label="새 탭 추가"]').click();
  await page.locator("textarea").fill("other note");

  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await page.getByRole("button", { name: "열기" }).click();

  await expect(page.locator("textarea")).toHaveValue("bookmark source");
  await expect(page.locator(".tab-item.is-active")).toHaveAttribute("data-tab-color", "gray");
  await expect(page.locator('.line-rail [role="button"]').first()).toHaveAttribute("aria-pressed", "true");
});

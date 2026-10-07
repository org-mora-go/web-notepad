import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("9. 원본 탭이 없으면 내용과 탭 색상 및 선택한 줄을 복원한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(page, "restored bookmark\nsecond\nthird");
  const colorButton = page.locator(".tab-item.is-active .dirty-dot");
  await colorButton.click();
  await colorButton.click();
  const lines = page.locator('.line-rail [role="button"]');
  await lines.nth(1).click();
  await lines.nth(2).click();
  await page.locator(".tab-item.is-active .tab-close").click();

  await expect(page.locator("textarea")).toHaveValue("");
  await page.reload();
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await page.getByRole("button", { name: "열기" }).click();

  await expect(page.locator("textarea")).toHaveValue("restored bookmark\nsecond\nthird");
  await expect(page.locator(".tab-item.is-active")).toHaveAttribute("data-tab-color", "red");
  await expect(lines.first()).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(1)).toHaveCSS("background-color", "rgba(242, 139, 130, 0.2)");
});

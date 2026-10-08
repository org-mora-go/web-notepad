import { expect, test } from "@playwright/test";

import { addTabButton } from "../__util__";

test("2. 새 탭을 추가하고 기존 탭을 선택할 수 있다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator('[role="tab"]');
  const titles = page.locator(".tab-item .tab-title");
  const editor = page.locator("textarea");
  await addTabButton(page).click();
  await expect(tabs).toHaveCount(2);
  await expect(titles.nth(1)).toHaveText("-");
  await editor.fill("second note");
  await addTabButton(page).click();
  await expect(tabs).toHaveCount(3);
  await expect(titles.nth(2)).toHaveText("-");
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(editor).toHaveValue("second note");
});

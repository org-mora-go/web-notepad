import { expect, test } from "@playwright/test";

import { addTabButton } from "../__util__";

test("1. 닫기 버튼과 가운데 클릭으로 탭을 닫을 수 있다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  await addTabButton(page).click();
  await expect(tabs).toHaveCount(2);
  await tabs.nth(1).locator(".tab-close").click();
  await expect(tabs).toHaveCount(1);

  await addTabButton(page).click();
  await tabs.nth(1).locator('[role="tab"]').click({ button: "middle" });
  await expect(tabs).toHaveCount(1);
});

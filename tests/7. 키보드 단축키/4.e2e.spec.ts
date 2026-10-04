import { expect, test } from "@playwright/test";

test("4. Alt+위아래 화살표는 탭 사이를 이동한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator('[role="tab"]')).toHaveCount(1);
  await page.locator("textarea").focus();
  await page.keyboard.press("Meta+n");
  const tabs = page.locator('[role="tab"]');
  await expect(tabs).toHaveCount(2);
  await page.keyboard.press("Alt+ArrowUp");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Alt+ArrowDown");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

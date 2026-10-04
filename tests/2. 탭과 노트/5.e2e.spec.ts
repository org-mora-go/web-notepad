import { expect, test } from "@playwright/test";

test("5. 탭의 긴급 표시와 변경 표시를 전환할 수 있다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item.is-active");
  await tab.locator(".dirty-dot").click();
  await expect(tab).toHaveClass(/is-urgent/);
  await page.locator("textarea").fill("changed");
  await expect(tab).toHaveClass(/is-dirty/);
});

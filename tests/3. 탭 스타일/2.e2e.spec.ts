import { expect, test } from "@playwright/test";

test("2. 고정 탭의 핀 아이콘은 표시 전용이다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item").first();
  await tab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin" }).click();

  const pinIndicator = tab.locator(".tab-pin-indicator");
  await expect(pinIndicator).toBeVisible();
  await expect(pinIndicator).not.toHaveRole("button");
  await pinIndicator.click();
  await expect(tab).toHaveClass(/is-pinned/);
});
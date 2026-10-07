import { expect, test } from "@playwright/test";

test("4. 그룹 명령을 선택하면 그룹 패널을 연다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "false");
});

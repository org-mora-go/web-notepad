import { expect, test } from "@playwright/test";

test("8. 그룹 패널 헤더의 위아래 패딩을 9px로 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();

  const header = page.locator("#groups-panel .group-header");
  await expect(header).toHaveCSS("min-height", "55px");
  await expect(header).toHaveCSS("height", "55px");
  await expect(header).toHaveCSS("padding-top", "9px");
  await expect(header).toHaveCSS("padding-bottom", "9px");
});

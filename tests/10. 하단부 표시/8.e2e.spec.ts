import { expect, test } from "@playwright/test";

test("8. 브라우저 뒤로가기로 열린 우측 패널을 닫는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  for (const panel of ["bookmarks", "groups", "shortcuts"]) {
    await page.locator(`button[aria-controls="${panel}-panel"]`).click();
    await expect(page.locator(`#${panel}-panel`)).toHaveAttribute("aria-hidden", "false");
    await page.goBack();
    await expect(page.locator(`#${panel}-panel`)).toHaveAttribute("aria-hidden", "true");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const panel of ["bookmarks", "groups"]) {
    await page.locator(`button[aria-controls="${panel}-panel"]`).click();
    await expect(page.locator(`#${panel}-panel`)).toHaveAttribute("aria-hidden", "false");
    await page.goBack();
    await expect(page.locator(`#${panel}-panel`)).toHaveAttribute("aria-hidden", "true");
  }
});
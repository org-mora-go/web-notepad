import { expect, test } from "@playwright/test";

test("3. 브라우저 뒤로가기로 열린 우측 패널을 닫는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const panelIds = viewport.width === 1280
      ? ["groups-panel", "bookmarks-panel", "shortcuts-panel"]
      : ["groups-panel", "bookmarks-panel"];
    for (const panelId of panelIds) {
      const panel = page.locator(`#${panelId}`);
      await page.locator(`button[aria-controls="${panelId}"]`).click();
      await expect(panel).toHaveAttribute("aria-hidden", "false");
      await page.goBack();
      await expect(panel).toHaveAttribute("aria-hidden", "true");
    }
  }
});

import { expect, test } from "@playwright/test";

import { RIGHT_PANEL_VIEWPORTS } from "./__constant__";

test("3. 브라우저 뒤로가기로 열린 우측 패널을 닫는다", async ({ page }) => {
  await page.goto("/");
  for (const { viewport, panelIds } of RIGHT_PANEL_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const panelId of panelIds) {
      const panel = page.locator(`#${panelId}`);
      await page.locator(`button[aria-controls="${panelId}"]`).click();
      await expect(panel).toHaveAttribute("aria-hidden", "false");
      await page.goBack();
      await expect(panel).toHaveAttribute("aria-hidden", "true");
    }
  }
});

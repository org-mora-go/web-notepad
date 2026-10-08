import { expect, test } from "@playwright/test";

import { RIGHT_PANEL_VIEWPORTS } from "./__constant__";

test("6. Escape로 우측 패널을 닫은 뒤에도 다시 열기와 브라우저 뒤로가기가 동작한다", async ({ page }) => {
  await page.goto("/");

  for (const { viewport, panelIds } of RIGHT_PANEL_VIEWPORTS) {
    await page.setViewportSize(viewport);

    for (const panelId of panelIds) {
      const panel = page.locator(`#${panelId}`);
      const toggle = page.locator(`button[aria-controls="${panelId}"]`);
      await toggle.click();
      await expect(panel).toHaveAttribute("aria-hidden", "false");
      await page.keyboard.press("Escape");
      await expect(panel).toHaveAttribute("aria-hidden", "true");
      await toggle.click();
      await expect(panel).toHaveAttribute("aria-hidden", "false");
      await page.goBack();
      await expect(panel).toHaveAttribute("aria-hidden", "true");
    }
  }
  const url = new URL(page.url());
  expect(url.searchParams.get("panel")).toBeNull();
  expect(url.searchParams.get("group")).toBe("ungrouped");
});

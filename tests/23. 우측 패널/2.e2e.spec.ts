import { expect, test } from "@playwright/test";

test("2. 우측 패널은 한 번에 하나만 열린다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const panelIds = ["groups-panel", "bookmarks-panel", "shortcuts-panel"];

  for (const openId of panelIds) {
    for (const nextId of panelIds) {
      if (nextId === openId) continue;
      await page.locator(`button[aria-controls="${openId}"]`).click();
      await expect(page.locator(`#${openId}`)).toHaveAttribute("aria-hidden", "false");
      await page.keyboard.press("Escape");
      await expect(page.locator(`#${openId}`)).toHaveAttribute("aria-hidden", "true");
      await page.locator(`button[aria-controls="${nextId}"]`).click();
      for (const panelId of panelIds) {
        await expect(page.locator(`#${panelId}`)).toHaveAttribute(
          "aria-hidden",
          panelId === nextId ? "false" : "true",
        );
      }
      await page.keyboard.press("Escape");
      await expect(page.locator(`#${nextId}`)).toHaveAttribute("aria-hidden", "true");
    }
  }
});

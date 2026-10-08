import { expect, test } from "@playwright/test";

test("7. Escape로 우측 패널을 닫으면 하단 패널 버튼의 포커스를 해제하고 Tab 포커스 표시는 유지한다", async ({ page }) => {
  await page.goto("/");

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const panelIds = width === 1280
      ? ["shortcuts-panel", "bookmarks-panel", "groups-panel"]
      : ["bookmarks-panel", "groups-panel"];

    for (const panelId of panelIds) {
      const toggle = page.locator(`button[aria-controls="${panelId}"]`);
      const panel = page.locator(`#${panelId}`);
      await toggle.click();
      await expect(panel).toHaveAttribute("aria-hidden", "false");
      await expect(toggle).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(panel).toHaveAttribute("aria-hidden", "true");
      await expect(toggle).not.toBeFocused();
      await expect(toggle).toHaveCSS("outline-style", "none");
      await expect(toggle).toHaveCSS("border-width", "0px");

      const neighborId = panelId === "bookmarks-panel" ? "groups-panel" : "bookmarks-panel";
      await page.locator(`button[aria-controls="${neighborId}"]`).focus();
      await page.keyboard.press(panelId === "groups-panel" ? "Tab" : "Shift+Tab");
      await expect(toggle).toBeFocused();
      await expect(toggle).not.toHaveCSS("outline-style", "none");
    }
  }
});
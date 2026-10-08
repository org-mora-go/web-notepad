import { expect, test } from "@playwright/test";

import { RIGHT_PANEL_VIEWPORTS } from "./__constant__";

test("7. Escape로 우측 패널을 닫으면 하단 패널 버튼의 포커스를 해제하고 Tab 포커스 표시는 유지한다", async ({ page }) => {
  await page.goto("/");

  for (const { viewport, panelIds } of RIGHT_PANEL_VIEWPORTS) {
    await page.setViewportSize(viewport);

    for (const panelId of [...panelIds].reverse()) {
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

      const visibleIds = await page.locator(".status-actions .status-command:visible").evaluateAll(
        (commands) => commands.map((command) => command.getAttribute("aria-controls")),
      );
      const index = visibleIds.indexOf(panelId);
      const fromNext = index < visibleIds.length - 1;
      const neighborId = visibleIds[fromNext ? index + 1 : index - 1];
      await page.locator(`button[aria-controls="${neighborId}"]`).focus();
      await page.keyboard.press(fromNext ? "Shift+Tab" : "Tab");
      await expect(toggle).toBeFocused();
      await expect(toggle).not.toHaveCSS("outline-style", "none");
    }
  }
});

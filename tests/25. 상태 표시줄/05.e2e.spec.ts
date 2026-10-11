import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";

test("5. 상태표시줄 아이콘 크기와 명령 간격을 PC·모바일에서 적용한다", async ({ page }) => {
  await page.goto("/");
  const commands = page.locator(".status-controls .status-command");

  for (const [viewport, expectedGap] of [[DESKTOP_VIEWPORT, "7px"], [MOBILE_VIEWPORT, "4px"]] as const) {
    await page.setViewportSize(viewport);
    const expectedIconSize = viewport === DESKTOP_VIEWPORT ? "16px" : "24px";
    for (const command of await commands.all()) {
      await expect(command).toHaveCSS("gap", expectedGap);
      await expect(command).toHaveCSS("flex-direction", viewport === DESKTOP_VIEWPORT ? "row" : "column");
      await expect(command.locator("svg")).toHaveCSS("width", expectedIconSize);
      await expect(command.locator("svg")).toHaveCSS("height", expectedIconSize);
    }
  }
});

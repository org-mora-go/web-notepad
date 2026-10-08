import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";

test("5. 상태표시줄 명령의 아이콘과 텍스트 간격을 PC·모바일에서 유지한다", async ({ page }) => {
  await page.goto("/");
  const commands = page.locator(".status-actions .status-command");

  for (const [viewport, expectedGap] of [[DESKTOP_VIEWPORT, "7px"], [MOBILE_VIEWPORT, "5px"]] as const) {
    await page.setViewportSize(viewport);
    for (const command of await commands.all()) {
      await expect(command).toHaveCSS("gap", expectedGap);
    }
  }
});

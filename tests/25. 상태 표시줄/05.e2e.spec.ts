import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("5. 상태표시줄 아이콘 크기와 명령 간격을 PC·모바일에서 적용한다", async ({ page }) => {
  await page.goto("/");
  const commands = page.locator(".status-meta .status-command:visible");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const mobile = viewport.width <= 640;
    for (const command of await commands.all()) {
      await expect(command).toHaveCSS("gap", mobile ? "4px" : "7px");
      await expect(command).toHaveCSS("flex-direction", mobile ? "column" : "row");
      await expect(command.locator("svg")).toHaveCSS("width", "24px");
      await expect(command.locator("svg")).toHaveCSS("height", "24px");
    }
  }
});

import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { createGroup, groupsCommand } from "../__util__";

test("4. PC 그룹명은 최대 351px이며 모바일과 함께 말줄임과 툴팁을 사용한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const name = "Very long group name for desktop ellipsis verification";
  await createGroup(page, name);
  for (const viewport of [DESKTOP_VIEWPORT, MOBILE_VIEWPORT]) {
    await page.setViewportSize(viewport);
    const groupName = page.locator(viewport.width <= 640 ? ".current-group-name" : ".group-status-name");
    await expect(groupName).toBeVisible();
    await expect(groupName).toHaveText(name);
    await expect(groupName).toHaveAttribute("title", name);
    await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
    await expect(groupName).toHaveCSS("overflow", "hidden");
    await expect(groupName).toHaveCSS("white-space", "nowrap");
    expect(await groupName.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    if (viewport.width > 640) {
      await expect(groupName).toHaveCSS("max-width", "351px");
      expect((await groupName.boundingBox())!.width).toBe(351);
    }
  }
});

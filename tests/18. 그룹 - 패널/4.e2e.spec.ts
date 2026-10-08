import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { createGroup, groupsCommand } from "../__util__";

test("4. 그룹 이름을 PC와 모바일 최대 너비에 맞춰 한 줄 말줄임한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Very long group name for ellipsis verification");
  const groupName = page.locator(".group-status-name");

  for (const { viewport, maxWidth } of [
    { viewport: DESKTOP_VIEWPORT, maxWidth: "180px" },
    { viewport: MOBILE_VIEWPORT, maxWidth: "90px" },
  ]) {
    await page.setViewportSize(viewport);
    await expect(groupName).toHaveCSS("max-width", maxWidth);
    await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
    await expect(groupName).toHaveCSS("overflow", "hidden");
    await expect(groupName).toHaveCSS("white-space", "nowrap");
    expect(await groupName.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  }
});

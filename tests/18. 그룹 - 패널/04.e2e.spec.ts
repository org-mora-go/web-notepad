import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { createGroup, groupsCommand, groupStatusName } from "../__util__";

test("4. PC 그룹 이름은 180px 말줄임하고 모바일은 고정 GROUP 라벨을 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Very long group name for ellipsis verification");
  const groupName = groupStatusName(page);

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(groupName).toHaveCSS("max-width", "180px");
  await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
  await expect(groupName).toHaveCSS("overflow", "hidden");
  await expect(groupName).toHaveCSS("white-space", "nowrap");
  expect(await groupName.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(groupName).toBeHidden();
  await expect(page.locator(".group-status-label")).toHaveText("GROUP");
  await expect(page.locator(".group-status-label")).toBeVisible();
});

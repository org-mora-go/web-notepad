import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand } from "../__util__";

test("6. 그룹 목록 항목 사이에 14px 간격을 둔다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  await createGroup(page, "Spacing check");
  const groupItems = page.locator("#groups-panel .group-item");
  const firstGroup = await groupItems.nth(0).boundingBox();
  const secondGroup = await groupItems.nth(1).boundingBox();

  expect(firstGroup).not.toBeNull();
  expect(secondGroup).not.toBeNull();
  expect(secondGroup!.y - firstGroup!.y - firstGroup!.height).toBe(14);
});

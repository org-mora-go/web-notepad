import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { groupsCommand, groupStatusName, seedStoredStateOnLoad } from "../__util__";

test("2. 그룹 전환을 URL 이력으로 기록하고 뒤로가기·앞으로가기로 복원한다", async ({ page }) => {
  const ungrouped = createGroupFixture("ungrouped", "Ungrouped", [
    createTabFixture("tab-1", "Base note"),
  ]);
  const work = createGroupFixture("work", "Work", [
    createTabFixture("tab-2", "Work note"),
  ]);
  await seedStoredStateOnLoad(page, {
    activeGroupId: ungrouped.id,
    groups: [ungrouped, work],
    nextTabNumber: 3,
  });

  await groupsCommand(page).click();
  await page.getByRole("button", { name: "Work", exact: true }).click();
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "true");
  await expect(new URL(page.url()).searchParams.get("group")).toBe("work");

  await page.goBack();
  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "false");
  await page.goForward();
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "true");
});
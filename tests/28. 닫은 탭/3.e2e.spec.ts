import { expect, test } from "@playwright/test";

import {
  activeTabItem,
  closeActiveTabWithContent,
  closedCommand,
  createGroups,
  cycleActiveTabColor,
  expectSelectedLines,
  groupStatusName,
  lineButtons,
  restoreFirstClosedTab,
  switchGroup,
} from "../__util__";

test("3. 복원하면 닫을 당시의 그룹에서 내용·색상·줄 선택을 유지한 활성 탭으로 되돌린다", async ({ page }) => {
  await page.goto("/");
  await createGroups(page, "Work");
  await page.locator("textarea").fill("restore me\nsecond\nthird");
  await cycleActiveTabColor(page, 2);
  await lineButtons(page).nth(1).click();
  await closeActiveTabWithContent(page, "restore me\nsecond\nthird");
  await switchGroup(page, "Ungrouped");

  await closedCommand(page).click();
  await restoreFirstClosedTab(page);

  await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "true");
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(page.locator("textarea")).toHaveValue("restore me\nsecond\nthird");
  await expect(activeTabItem(page)).toHaveAttribute("data-tab-color", "red");
  await expectSelectedLines(page, [false, true, false]);
});

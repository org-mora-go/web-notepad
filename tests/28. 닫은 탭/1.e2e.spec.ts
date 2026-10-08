import { expect, test } from "@playwright/test";

import { addTabButton, closeActiveTabWithContent, closedCommand, readStoredState } from "../__util__";

test("1. 내용이 있는 탭을 닫으면 닫은 탭 목록 맨 위에 보관하고 빈 탭은 보관하지 않는다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "first closed");
  await closeActiveTabWithContent(page, "second closed");
  await addTabButton(page).click();
  await page.locator(".tab-item.is-active .tab-close").click();

  const { closedTabs } = (await readStoredState(page)) as unknown as {
    closedTabs: { groupId: string; tab: { content: string } }[];
  };
  expect(closedTabs.map((entry) => entry.tab.content)).toEqual(["second closed", "first closed"]);
  expect(closedTabs.every((entry) => entry.groupId === "ungrouped")).toBe(true);

  await page.reload();
  await closedCommand(page).click();
  await expect(page.locator(".closed-item .closed-content")).toHaveText([
    "second closed",
    "first closed",
  ]);
});

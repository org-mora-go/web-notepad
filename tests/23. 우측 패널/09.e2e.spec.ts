import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../__fixture__";
import { closedCommand, seedStoredStateOnLoad } from "../__util__";

test("9. 닫은 탭이 많을 때 목록을 끝까지 스크롤해 마지막 콘텐츠를 볼 수 있다", async ({ page }) => {
  const group = createGroupFixture("work", "Work", [createTabFixture("active-tab", "Current note")]);
  const closedTabs = Array.from({ length: 24 }, (_, index) => {
    const content = index === 23 ? "bottom closed note" : `closed note ${index + 1}`;
    const tab = createTabFixture(`closed-tab-${index + 1}`, content);
    return createClosedTabFixture(`closed-${index + 1}`, group.id, tab);
  });
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 2,
    closedTabs,
  });
  await page.setViewportSize({ width: 390, height: 640 });
  await closedCommand(page).click();

  const list = page.locator(".closed-list");
  await expect.poll(() => list.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await list.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });

  const lastItem = page.locator(".closed-item").last();
  const lastContent = lastItem.locator(".expandable-content-text");
  await expect(lastContent).toHaveText("bottom closed note");
  await expect(lastContent).toBeInViewport();
  await expect.poll(async () => {
    const box = await lastItem.boundingBox();
    return box !== null && box.y + box.height <= 640;
  }).toBe(true);
});
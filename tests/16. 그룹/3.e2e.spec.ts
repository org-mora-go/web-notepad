import { expect, test } from "@playwright/test";

import {
  addTabButton,
  bookmarkActiveTab,
  createGroups,
  dragDividerBy,
  readStoredState,
  switchGroup,
} from "../__util__";

test("3. 그룹별 탭, 북마크, 활성 패널 및 분할 비율을 관리한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("ungrouped note");
  await createGroups(page, "Work");

  await bookmarkActiveTab(page, "work note");
  await addTabButton(page).click();
  await page.locator("textarea").fill("work right note");
  await page.locator("textarea").press("Alt+F12");
  await expect(page.locator(".body")).toHaveCount(2);

  await dragDividerBy(page, 120);

  const readGroup = async (name: string) => {
    const group = (await readStoredState(page)).groups.find((entry) => entry.name === name)!;
    return {
      tabs: group.tabs.map((tab) => tab.content),
      bookmarks: group.bookmarks.map((bookmark) => bookmark.content),
      activePane: group.activePane,
      splitRatio: group.splitRatio,
    };
  };

  await expect
    .poll(() => readGroup("Work"))
    .toMatchObject({
      tabs: ["work note", "work right note"],
      bookmarks: ["work note"],
      activePane: "right",
    });
  const workRatio = (await readGroup("Work")).splitRatio;
  expect(workRatio).toBeGreaterThan(0.5);

  await switchGroup(page, "Ungrouped");
  await expect(page.locator(".body")).toHaveCount(1);
  await expect(page.locator("textarea")).toHaveValue("ungrouped note");
  expect(await readGroup("Ungrouped")).toMatchObject({
    tabs: ["ungrouped note"],
    bookmarks: [],
    activePane: "left",
    splitRatio: 0.5,
  });

  await switchGroup(page, "Work");
  await expect(page.locator(".body")).toHaveCount(2);
  await expect(page.locator(".pane-slot").first().locator("textarea")).toHaveValue("work note");
  await expect(page.locator(".pane-slot").nth(1).locator("textarea")).toHaveValue("work right note");
  expect((await readGroup("Work")).splitRatio).toBe(workRatio);
});

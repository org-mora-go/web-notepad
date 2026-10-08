import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../__util__";

test("1. Ungrouped를 최상단에 고정하고 나머지 그룹은 한글 우선 한국어 문자순으로 정렬한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();

  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "Ungrouped",
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
    "Zulu",
  ]);
});

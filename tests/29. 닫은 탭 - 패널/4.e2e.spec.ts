import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, closedCommand, createGroups } from "../__util__";

test("4. 그룹 이름과 탭 내용을 대소문자 구분 없이 부분 검색한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "Alpha note");
  await createGroups(page, "Work");
  await closeActiveTabWithContent(page, "beta note");
  await closedCommand(page).click();

  const search = page.getByRole("searchbox", { name: "닫은 탭 검색" });
  await expect(search).toHaveAttribute("placeholder", "Search closed tabs");
  const contents = page.locator(".closed-item .closed-content");
  await search.fill("ALPHA");
  await expect(contents).toHaveText(["Alpha note"]);
  await search.fill("wor");
  await expect(contents).toHaveText(["beta note"]);
  await search.fill("missing");
  await expect(contents).toHaveCount(0);
  await expect(page.locator("#closed-panel .search-empty-state")).toHaveText("검색 결과가 없습니다");
});

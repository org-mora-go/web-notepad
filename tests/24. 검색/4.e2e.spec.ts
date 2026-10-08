import { expect, type Locator, test } from "@playwright/test";

import { bookmarksCommand, groupsCommand } from "../__util__";

const readTop = (search: Locator) =>
  search.evaluate((element) => element.getBoundingClientRect().top);
const readLabelMargins = (search: Locator) =>
  search.evaluate((element) => {
    const style = getComputedStyle(element.closest("label")!);
    return [style.marginTop, style.marginBottom];
  });

test("4. 북마크와 그룹 검색창의 위치와 여백을 맞추고 그룹 생성 입력란 위에 배치한다", async ({
  page,
}) => {
  await page.goto("/");
  await bookmarksCommand(page).click();
  const bookmarkSearch = page.getByRole("searchbox", { name: "북마크 검색" });
  await expect(bookmarkSearch).toBeVisible();
  const bookmarkSearchTop = await readTop(bookmarkSearch);
  const bookmarkMargins = await readLabelMargins(bookmarkSearch);
  expect(bookmarkMargins).toEqual(["14px", "6px"]);
  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await groupsCommand(page).click();
  const groupSearch = page.getByRole("searchbox", { name: "그룹 검색" });
  await expect(groupSearch).toBeVisible();
  expect(await readTop(groupSearch)).toBe(bookmarkSearchTop);
  expect(await readLabelMargins(groupSearch)).toEqual(bookmarkMargins);
  expect(await groupSearch.evaluate((element) => {
    const searchBottom = element.getBoundingClientRect().bottom;
    const formTop = element.closest("aside")!.querySelector(
      ".group-create-form",
    )!.getBoundingClientRect().top;
    return formTop > searchBottom;
  })).toBe(true);
});

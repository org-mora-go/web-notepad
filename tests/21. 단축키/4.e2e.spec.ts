import { expect, test } from "@playwright/test";

import { bookmarksCommand, groupsCommand } from "../__util__";

test("4. 편집기 외의 입력 요소에서 Cmd+A는 즉시 해당 입력 내용 전체를 선택한다", async ({ page }) => {
  await page.goto("/");
  const expectImmediateInputSelection = async (
    input: ReturnType<typeof page.locator>,
    end: number,
  ) => {
    expect(
      await input.evaluate((element) => {
        const target = element as HTMLInputElement;
        return [
          document.activeElement === target,
          target.selectionStart,
          target.selectionEnd,
        ];
      }),
    ).toEqual([true, 0, end]);
  };

  const bookmarkSearch = page.locator(
    '#bookmarks-panel input[aria-label="북마크 검색"]',
  );
  await bookmarksCommand(page).click();
  const bookmarkQuery = "북마크 검색어";
  await bookmarkSearch.fill(bookmarkQuery);
  await page.keyboard.press("Meta+a");
  await expectImmediateInputSelection(bookmarkSearch, bookmarkQuery.length);

  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await groupsCommand(page).click();
  const groupSearch = page.locator(
    '#groups-panel input[aria-label="그룹 검색"]',
  );
  const groupQuery = "그룹 검색어";
  await groupSearch.fill(groupQuery);
  await page.keyboard.press("Meta+a");
  await expectImmediateInputSelection(groupSearch, groupQuery.length);

  const groupName = page.locator(
    '#groups-panel input[aria-label="새 그룹 이름"]',
  );
  const newGroupName = "새 그룹 이름";
  await groupName.fill(newGroupName);
  await page.keyboard.press("Meta+a");
  await expectImmediateInputSelection(groupName, newGroupName.length);
});

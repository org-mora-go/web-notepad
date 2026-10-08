import { expect, test } from "@playwright/test";

test("4. 편집기 Cmd+A와 Alt+A 및 입력 요소의 Cmd+A 전체 선택을 지원한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
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

  const editor = page.locator("textarea");
  await editor.fill("select me");
  await page.keyboard.press("Meta+a");
  await expect
    .poll(() =>
      editor.evaluate((element) => [
        (element as HTMLTextAreaElement).selectionStart,
        (element as HTMLTextAreaElement).selectionEnd,
      ]),
    )
    .toEqual([0, 9]);
  await page.keyboard.press("Alt+a");
  await expect
    .poll(() =>
      editor.evaluate((element) => [
        (element as HTMLTextAreaElement).selectionStart,
        (element as HTMLTextAreaElement).selectionEnd,
      ]),
    )
    .toEqual([0, 9]);

  const bookmarkSearch = page.locator(
    '#bookmarks-panel input[aria-label="북마크 검색"]',
  );
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  const bookmarkQuery = "북마크 검색어";
  await bookmarkSearch.fill(bookmarkQuery);
  await page.keyboard.press("Meta+a");
  await expectImmediateInputSelection(bookmarkSearch, bookmarkQuery.length);

  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await page.locator('button[aria-controls="groups-panel"]').click();
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

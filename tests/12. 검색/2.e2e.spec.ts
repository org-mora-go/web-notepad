import { expect, test } from "@playwright/test";

test("2. 두 패널의 검색창 위치와 여백을 맞추고 그룹 생성 입력란 위에 배치한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  const bookmarkSearch = page.getByRole("searchbox", { name: "북마크 검색" });
  await expect(bookmarkSearch).toBeVisible();
  const bookmarkSearchTop = await bookmarkSearch.evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  const bookmarkMargins = await bookmarkSearch.evaluate((element) => {
    const style = getComputedStyle(element.closest("label")!);
    return [style.marginTop, style.marginBottom];
  });
  expect(bookmarkMargins).toEqual(["14px", "6px"]);
  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await page.locator('button[aria-controls="groups-panel"]').click();
  const groupSearch = page.getByRole("searchbox", { name: "그룹 검색" });
  await expect(groupSearch).toBeVisible();
  expect(await groupSearch.evaluate(
    (element) => element.getBoundingClientRect().top,
  )).toBe(bookmarkSearchTop);
  expect(await groupSearch.evaluate((element) => {
    const style = getComputedStyle(element.closest("label")!);
    return [style.marginTop, style.marginBottom];
  })).toEqual(bookmarkMargins);
  expect(await groupSearch.evaluate((element) => {
    const searchBottom = element.getBoundingClientRect().bottom;
    const formTop = element.closest("aside")!.querySelector(
      ".group-create-form",
    )!.getBoundingClientRect().top;
    return formTop > searchBottom;
  })).toBe(true);
});
import { expect, test } from "@playwright/test";

test("1. 북마크와 그룹 패널은 대소문자 구분 없는 부분 검색을 제공한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("Sprint planning");
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  const bookmarkSearch = page.getByRole("searchbox", { name: "북마크 검색" });
  const bookmarkSearchTop = await bookmarkSearch.evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  const bookmarkMargins = await bookmarkSearch.evaluate((element) => {
    const style = getComputedStyle(element.closest("label")!);
    return [style.marginTop, style.marginBottom];
  });
  expect(bookmarkMargins).toEqual(["14px", "6px"]);
  await bookmarkSearch.fill("SPRINT");
  await expect(page.locator(".bookmark-item")).toHaveCount(1);
  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await page.locator('button[aria-controls="groups-panel"]').click();
  const groupSearch = page.getByRole("searchbox", { name: "그룹 검색" });
  await expect(groupSearch).toBeVisible();
  expect(
    await groupSearch.evaluate((element) => element.getBoundingClientRect().top),
  ).toBe(bookmarkSearchTop);
  expect(
    await groupSearch.evaluate((element) => {
      const style = getComputedStyle(element.closest("label")!);
      return [style.marginTop, style.marginBottom];
    }),
  ).toEqual(bookmarkMargins);
  expect(
    await groupSearch.evaluate((element) => {
      const searchBottom = element.getBoundingClientRect().bottom;
      const formTop = element.closest("aside")!.querySelector(
        ".group-create-form",
      )!.getBoundingClientRect().top;
      return formTop > searchBottom;
    }),
  ).toBe(true);
  await groupSearch.fill("ungrouped");
  await expect(page.locator(".group-item")).toHaveCount(1);
});

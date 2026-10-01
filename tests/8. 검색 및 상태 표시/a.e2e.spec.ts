import { expect, test } from "@playwright/test";

test("a. 북마크와 그룹 패널은 대소문자 구분 없는 부분 검색을 제공한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("Sprint planning");
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await page.getByRole("searchbox", { name: "북마크 검색" }).fill("SPRINT");
  await expect(page.locator(".bookmark-item")).toHaveCount(1);
  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("searchbox", { name: "그룹 검색" }).fill("ungrouped");
  await expect(page.locator(".group-item")).toHaveCount(1);
});

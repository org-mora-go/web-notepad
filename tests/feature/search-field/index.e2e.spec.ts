import { expect, test } from "@playwright/test";

test("북마크 검색은 제목과 본문을 대소문자 구분 없이 찾고 초기화한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page
    .locator("textarea")
    .fill("Sprint planning\nInclude pineapple inventory in the notes");
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  await page.getByRole("button", { name: "BOOKMARK" }).click();

  const search = page.getByRole("searchbox", { name: "북마크 검색" });
  await search.fill("sprint");
  await expect(page.locator(".bookmark-item")).toHaveCount(1);
  await expect(page.locator(".bookmark-item-heading")).toContainText(
    "Sprint planning",
  );

  await search.fill("PINEAPPLE");
  await expect(page.locator(".bookmark-item")).toHaveCount(1);
  await search.fill("missing");
  await expect(page.locator(".search-empty-state")).toContainText(
    "검색 결과가 없습니다",
  );

  await search.fill("");
  await expect(page.locator(".bookmark-item")).toHaveCount(1);
});

test("그룹 검색은 대소문자 구분 없이 필터링하고 초기화 시 전체를 표시한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "Ungrouped (1)" }).click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();

  await page.getByRole("button", { name: "Work (2)" }).click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Personal");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await page.getByRole("button", { name: "Personal (3)" }).click();

  const search = page.getByRole("searchbox", { name: "그룹 검색" });
  await search.fill("WORK");
  await expect(page.locator(".group-item")).toHaveCount(1);
  await expect(page.locator(".group-item")).toContainText("Work");

  await search.fill("missing");
  await expect(page.locator(".group-item")).toHaveCount(0);
  await expect(page.locator(".search-empty-state")).toContainText(
    "검색 결과가 없습니다",
  );

  await search.fill("");
  await expect(page.locator(".group-item")).toHaveCount(3);
});

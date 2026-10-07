import { expect, test } from "@playwright/test";

test("2. 검색어 지우기 아이콘을 흰색으로 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="bookmarks-panel"]').click();

  const search = page.getByRole("searchbox", { name: "북마크 검색" });
  await search.fill("검색어");

  await expect
    .poll(() =>
      search.evaluate(() => {
        const rules = Array.from(document.styleSheets).flatMap((sheet) => {
          try {
            return Array.from(sheet.cssRules);
          } catch {
            return [];
          }
        });
        const cancelButtonRule = rules.find(
          (rule) =>
            rule instanceof CSSStyleRule &&
            rule.selectorText.includes("::-webkit-search-cancel-button"),
        );

        return cancelButtonRule instanceof CSSStyleRule
          ? cancelButtonRule.style.filter
          : "";
      }),
    )
    .toBe("brightness(0.4)");
});

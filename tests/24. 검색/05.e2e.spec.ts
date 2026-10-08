import { expect, test } from "@playwright/test";

import { bookmarksCommand } from "../__util__";

test("5. 검색어 지우기 아이콘을 패널 닫기 버튼과 같은 옅은 회색으로 표시한다", async ({ page }) => {
  await page.goto("/");
  await bookmarksCommand(page).click();

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

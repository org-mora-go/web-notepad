import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { bookmarkActiveTab, bookmarksCommand } from "../__util__";

test("5. 북마크 패널의 제목, 북마크 텍스트, 검색 입력과 빈 상태 문구 글자 크기를 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  const content = Array.from({ length: 12 }, (_, index) => `note line ${index + 1}`).join("\n");
  await bookmarkActiveTab(page, content);
  await bookmarksCommand(page).click();

  const panel = page.locator("#bookmarks-panel");
  const search = page.getByRole("searchbox", { name: "북마크 검색" });
  const item = page.locator(".bookmark-item");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(panel.locator("h2")).toHaveCSS("font-size", "22px");
    await expect(search).toHaveCSS("font-size", "14px");
    await expect(search).toHaveCSS("height", "40px");
    await expect(search.locator("xpath=..")).toHaveCSS("height", "42px");
    await expect(item.locator(".bookmark-item-heading strong")).toHaveCSS(
      "font-size",
      "15px",
    );
    await expect(item.locator("time")).toHaveCSS("font-size", "12px");
    await expect(item.locator(".expandable-content-text")).toHaveCSS(
      "font-size",
      "16px",
    );
    await expect(item.locator(".expandable-content-toggle")).toHaveCSS(
      "font-size",
      "13px",
    );
    await expect(item.locator(".bookmark-actions button").first()).toHaveCSS(
      "font-size",
      "13px",
    );
  }

  await search.fill("no matching bookmark");
  await expect(panel.locator(".search-empty-state p")).toHaveText("No search results");
  await expect(panel.locator(".search-empty-state p")).toHaveCSS(
    "font-size",
    "15px",
  );
  await search.fill("");

  await item.getByRole("button", { name: "note line 1 북마크 제거" }).click();
  await expect(panel.locator(".bookmark-empty p")).toHaveCSS(
    "font-size",
    "16px",
  );
});

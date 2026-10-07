import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("10. 북마크 패널의 제목과 북마크 텍스트 글자 크기를 키운다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const content = Array.from({ length: 12 }, (_, index) => `note line ${index + 1}`).join("\n");
  await bookmarkActiveTab(page, content);
  await page.locator('button[aria-controls="bookmarks-panel"]').click();

  const panel = page.locator("#bookmarks-panel");
  const search = page.getByRole("searchbox", { name: "북마크 검색" });
  const item = page.locator(".bookmark-item");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(panel.locator("h2")).toHaveCSS("font-size", "22px");
    await expect(search).toHaveCSS("font-size", "14px");
    await expect(search).toHaveCSS("height", "40px");
    await expect(search.locator("xpath=..")).toHaveCSS("height", "42px");
    await expect(item.locator(".bookmark-item-heading strong")).toHaveCSS(
      "font-size",
      "15px",
    );
    await expect(item.locator("time")).toHaveCSS("font-size", "12px");
    await expect(item.locator(".bookmark-content")).toHaveCSS(
      "font-size",
      "16px",
    );
    await expect(item.locator(".bookmark-content-toggle")).toHaveCSS(
      "font-size",
      "13px",
    );
    await expect(item.locator(".bookmark-actions button").first()).toHaveCSS(
      "font-size",
      "13px",
    );
  }

  await item.getByRole("button", { name: "note line 1 북마크 제거" }).click();
  await expect(panel.locator(".bookmark-empty p")).toHaveCSS(
    "font-size",
    "16px",
  );
});

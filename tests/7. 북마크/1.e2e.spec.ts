import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "./__util__";

test("1. 북마크에 제목과 내용과 생성 시각 및 탭 색상과 선택한 줄을 저장한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const content = "bookmark content\nsecond\nthird";
  await page.locator("textarea").fill(content);
  const colorButton = page.locator(".tab-item.is-active .dirty-dot");
  await colorButton.click();
  await colorButton.click();
  const lines = page.locator('.line-rail [role="button"]');
  await lines.nth(1).click();
  await lines.nth(2).click();
  await bookmarkActiveTab(page, content);
  expect(await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("web-notepad-storage")!);
    return saved.state.groups[0].bookmarks[0];
  })).toMatchObject({
    title: "bookmark content",
    content,
    createdAt: expect.any(Number),
    tabColor: "red",
    selectedLines: [1, 2],
  });
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await expect(page.locator(".bookmark-item")).toContainText(
    "bookmark content",
  );
});

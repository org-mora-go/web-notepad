import { expect, test } from "@playwright/test";

async function bookmarkActiveTab(
  page: import("@playwright/test").Page,
  content: string,
) {
  await page.locator("textarea").fill(content);
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
}

test("a. 탭을 북마크하면 제목과 내용과 생성 시각을 가진 항목이 표시된다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(page, "bookmark content");
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await expect(page.locator(".bookmark-item")).toContainText(
    "bookmark content",
  );
});

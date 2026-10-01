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

test("b. 원본 탭 내용이 바뀌면 북마크 제목과 내용도 갱신된다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(page, "original");
  await page.locator("textarea").fill("updated");
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await expect(page.locator(".bookmark-item")).toContainText("updated");
});

import { expect, test } from "@playwright/test";

test("5. 모바일에서도 북마크와 그룹 수를 표시한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("note");
  await page.locator('.tab-item.is-active [role="tab"]').dblclick();
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  await expect(page.locator(".status-label")).toBeVisible();
  const counts = page.locator(".status-actions .status-count");
  await expect(counts).toHaveText(["(1)", "(1)"]);
  for (const count of await counts.all()) {
    await expect(count).toBeInViewport();
  }
});
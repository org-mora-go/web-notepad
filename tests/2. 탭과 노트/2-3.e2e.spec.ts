import { expect, test } from "@playwright/test";

test("2-3. 첫 줄 제목을 trim하고 28자로 제한하며 빈 내용은 Untitled로 표시한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const title = page.locator(".tab-item.is-active .tab-title");
  await page.locator("textarea").fill("  First title  \nsecond line");
  await expect(title).toHaveText("First title");
  await page.locator("textarea").fill("A".repeat(40));
  await expect(title).toHaveText("A".repeat(28));
  await page.locator("textarea").fill("");
  await expect(title).toHaveText("Untitled");
});

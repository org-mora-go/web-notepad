import { expect, test } from "@playwright/test";

test("6. 탭 제목의 길이와 표기를 일관되게 유지한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const title = page.locator(".tab-item.is-active .tab-title");
  await page.locator("textarea").fill("  First title  \nsecond line");
  await expect(title).toHaveText("First title");
  await page.locator("textarea").fill("A".repeat(40));
  await expect(title).toHaveText("A".repeat(28));
  await page.locator("textarea").fill("");
  await expect(title).toHaveText("-");
});

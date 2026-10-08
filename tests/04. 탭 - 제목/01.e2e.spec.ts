import { expect, test } from "@playwright/test";

test("1. 첫 번째 비어 있지 않은 줄을 공백 제거 후 최대 28자로 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  const title = page.locator(".tab-item.is-active .tab-title");
  const editor = page.locator("textarea");
  await editor.fill("  First title  \nsecond line");
  await expect(title).toHaveText("First title");
  await editor.fill("\n   \n  Third line title  \nnext");
  await expect(title).toHaveText("Third line title");
  await editor.fill("A".repeat(40));
  await expect(title).toHaveText("A".repeat(28));
  await editor.fill(`   ${"B".repeat(28)}C   `);
  await expect(title).toHaveText("B".repeat(28));
});

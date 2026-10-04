import { expect, test } from "@playwright/test";

test("3-1. 여러 줄 텍스트와 줄 번호를 표시하고 줄 번호로 줄을 선택한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("first\nsecond\nthird");
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines).toHaveCount(3);
  await lines.nth(1).click();
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
});

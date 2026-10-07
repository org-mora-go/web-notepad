import { expect, test } from "@playwright/test";

test("1. Shift 클릭으로 기준 줄부터 지정 줄까지 범위를 선택하고 다시 해제한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("first\nsecond\nthird\nfourth\nfifth");
  const lines = page.locator('.line-rail [role="button"]');

  await lines.nth(0).click();
  await lines.nth(4).click({ modifiers: ["Shift"] });
  for (let index = 0; index < 5; index += 1) {
    await expect(lines.nth(index)).toHaveAttribute("aria-pressed", "true");
  }

  await lines.nth(4).click({ modifiers: ["Shift"] });
  for (let index = 0; index < 5; index += 1) {
    await expect(lines.nth(index)).toHaveAttribute("aria-pressed", "false");
  }
});

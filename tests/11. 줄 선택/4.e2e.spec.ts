import { expect, test } from "@playwright/test";

test("4. 줄 번호를 클릭하거나 Shift 클릭해도 포커스 테두리를 표시하지 않는다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("first\nsecond\nthird");
  const lines = page.locator('.line-rail [role="button"]');

  await lines.nth(0).click();
  await lines.nth(2).click({ modifiers: ["Shift"] });

  await expect(lines.nth(0)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(2)).toHaveCSS("outline-style", "none");
});

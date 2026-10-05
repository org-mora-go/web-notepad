import { expect, test } from "@playwright/test";

test("1. 여러 줄 텍스트와 줄 번호를 표시하고 줄 번호로 줄을 선택한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("first\nsecond\nthird");
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines).toHaveCount(3);
  await expect(lines.first()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await lines.nth(1).click();
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(1)).toHaveCSS(
    "background-color",
    "rgba(184, 184, 176, 0.2)",
  );
  await expect(lines.nth(1)).toHaveCSS("color", "rgb(184, 184, 176)");
  await expect(page.locator("textarea")).toHaveCSS(
    "background-image",
    /rgba\(184, 184, 176, 0\.2\)/,
  );
});

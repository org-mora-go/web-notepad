import { expect, test } from "@playwright/test";

test("8. 클릭과 키보드로 줄을 선택하고 첫 줄의 상단 여백까지 강조한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("first\nsecond\nthird");
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines.first()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await lines.first().click();
  await expect(lines.first()).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".line-rail")).toHaveCSS(
    "background-image",
    /rgba\(184, 184, 176, 0\.2\)/,
  );
  await expect(page.locator(".line-rail")).toHaveCSS("background-size", "100% 10px");
  await expect(editor).toHaveCSS("background-position", /0px 0px/);
  await expect(editor).toHaveCSS("background-size", "100% 43px");
  await lines.first().click();
  await lines.nth(1).focus();
  await lines.nth(1).press("Enter");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(1)).toHaveCSS("background-color", "rgba(184, 184, 176, 0.2)");
  await expect(lines.nth(1)).toHaveCSS("color", "rgb(184, 184, 176)");
  await expect(editor).toHaveCSS("background-image", /rgba\(184, 184, 176, 0\.2\)/);
});
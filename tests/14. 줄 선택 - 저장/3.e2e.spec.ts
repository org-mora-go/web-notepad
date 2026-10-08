import { expect, test } from "@playwright/test";

test("3. 줄 삽입과 삭제로 이동한 선택 위치도 저장한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  const lines = page.locator('.line-rail [role="button"]');
  await editor.fill("one\ntwo\nthree");
  await lines.nth(1).click();
  await lines.nth(2).click();
  await editor.fill("zero\none\ntwo\nthree");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(3)).toHaveAttribute("aria-pressed", "true");
  await editor.fill("zero\none\nthree");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
});
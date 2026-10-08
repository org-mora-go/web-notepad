import { expect, test } from "@playwright/test";

test("3. 탭별 실행 취소 기록을 최근 100개로 제한한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  for (let index = 0; index <= 100; index += 1) {
    await editor.fill(`entry-${index}`);
  }

  for (let index = 0; index < 100; index += 1) {
    await page.keyboard.press("Meta+z");
  }
  await expect(editor).toHaveValue("entry-0");
});

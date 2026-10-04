import { expect, test } from "@playwright/test";

test("3. Undo와 Redo 단축키가 탭별 편집 기록을 되돌리고 복원한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("first");
  await editor.fill("first second");
  await page.keyboard.press("Meta+z");
  await expect(editor).toHaveValue("first");
  await page.keyboard.press("Meta+Shift+z");
  await expect(editor).toHaveValue("first second");
});

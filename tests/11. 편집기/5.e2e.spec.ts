import { expect, test } from "@playwright/test";

test("5. 한글 IME 조합 중에도 입력을 처리한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.focus();
  await editor.dispatchEvent("compositionstart");
  await page.keyboard.insertText("한글");
  await expect(editor).toHaveValue("한글");
  await editor.dispatchEvent("compositionend");
  await expect(editor).toHaveValue("한글");
});

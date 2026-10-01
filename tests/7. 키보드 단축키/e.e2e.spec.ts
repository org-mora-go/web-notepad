import { expect, test } from "@playwright/test";

test("e. Cmd+A와 Alt+A는 에디터 전체를 선택한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("select me");
  await page.keyboard.press("Meta+a");
  await expect
    .poll(() =>
      editor.evaluate((element) => [
        (element as HTMLTextAreaElement).selectionStart,
        (element as HTMLTextAreaElement).selectionEnd,
      ]),
    )
    .toEqual([0, 9]);
  await page.keyboard.press("Alt+a");
  await expect
    .poll(() =>
      editor.evaluate((element) => [
        (element as HTMLTextAreaElement).selectionStart,
        (element as HTMLTextAreaElement).selectionEnd,
      ]),
    )
    .toEqual([0, 9]);
});

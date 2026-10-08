import { expect, test } from "@playwright/test";

test("2. Enter는 커서 위치에 줄바꿈을 삽입한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("first");
  await editor.evaluate((element) =>
    (element as HTMLTextAreaElement).setSelectionRange(2, 2),
  );
  await page.keyboard.press("Enter");
  await expect(editor).toHaveValue("fi\nrst");
  await expect
    .poll(() =>
      editor.evaluate((element) => (element as HTMLTextAreaElement).selectionStart),
    )
    .toBe(3);
});

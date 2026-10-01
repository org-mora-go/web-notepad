import { expect, test } from "@playwright/test";

test("b. Enter는 줄바꿈을, Tab은 커서 위치의 탭 문자를 삽입한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("left right");
  await editor.evaluate((element) =>
    (element as HTMLTextAreaElement).setSelectionRange(4, 4),
  );
  await page.keyboard.press("Tab");
  await expect(editor).toHaveValue("left\t right");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(editor).toHaveValue("left\t right\n");
});

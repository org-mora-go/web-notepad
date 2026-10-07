import { expect, test } from "@playwright/test";

test("1. Alt+Tab은 새 탭을 만들고 일반 Tab은 에디터에 문자를 삽입한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const tabs = page.locator('[role="tab"]');
  await expect(tabs).toHaveCount(1);
  await page.locator("textarea").focus();
  await page.keyboard.press("Alt+Tab");
  await expect(tabs).toHaveCount(2);
  const editor = page.locator("textarea").first();
  await editor.fill("text");
  await editor.focus();
  await editor.evaluate((element) =>
    (element as HTMLTextAreaElement).setSelectionRange(0, 0),
  );
  await page.keyboard.press("Tab");
  await expect(editor).toHaveValue("\ttext");
});

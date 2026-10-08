import { expect, test } from "@playwright/test";

test("1. Alt+Tab은 새 탭을 만들고 일반 Tab은 에디터에 문자를 삽입한다", async ({
  page,
}) => {
  await page.goto("/");
  const tabs = page.locator('[role="tab"]');
  const editor = page.locator("textarea");
  await expect(tabs).toHaveCount(1);
  await editor.focus();
  await page.keyboard.press("Alt+Tab");
  await expect(tabs).toHaveCount(2);
  await editor.fill("text");
  await editor.evaluate((element) =>
    (element as HTMLTextAreaElement).setSelectionRange(0, 0),
  );
  await page.keyboard.press("Tab");
  await expect(editor).toHaveValue("\ttext");
});

import { expect, test } from "@playwright/test";

test("3. 편집기에 포커스가 있을 때 Cmd+A 또는 Alt+A로 편집기 내용 전체를 선택한다", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const editor = page.locator("textarea");
  const readSelection = () =>
    editor.evaluate((element) => [
      (element as HTMLTextAreaElement).selectionStart,
      (element as HTMLTextAreaElement).selectionEnd,
    ]);
  const collapseSelection = () =>
    editor.evaluate((element) =>
      (element as HTMLTextAreaElement).setSelectionRange(0, 0),
    );

  await editor.fill("select me");
  await collapseSelection();
  await page.keyboard.press("Meta+a");
  await expect.poll(readSelection).toEqual([0, 9]);

  // The shortcut re-applies the selection once more after 50ms; wait it out before collapsing.
  await page.waitForTimeout(100);
  await collapseSelection();
  await expect.poll(readSelection).toEqual([0, 0]);
  await page.keyboard.press("Alt+a");
  await expect.poll(readSelection).toEqual([0, 9]);
  await expect(editor).toHaveValue("select me");
});

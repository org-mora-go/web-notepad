import { expect, test } from "@playwright/test";

test("3-4. Tab은 선택 영역을 탭 문자로 교체하고 커서를 삽입 위치 뒤에 둔다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("hello world");
  await editor.evaluate((element) =>
    (element as HTMLTextAreaElement).setSelectionRange(0, 5),
  );
  await page.keyboard.press("Tab");
  await expect(editor).toHaveValue("\t world");
  await expect
    .poll(() =>
      editor.evaluate((element) =>
        (element as HTMLTextAreaElement).selectionStart,
      ),
    )
    .toBe(1);
});

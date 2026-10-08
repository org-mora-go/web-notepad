import { expect, test } from "@playwright/test";

test("3. 커서가 편집기 높이를 넘어가면 편집기와 줄 번호 영역을 함께 스크롤한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 360 });
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  const longNote = Array.from({ length: 40 }, (_, index) => `line ${index + 1}`).join("\n");
  await editor.fill(longNote);
  await editor.evaluate((element) => {
    const textarea = element as HTMLTextAreaElement;
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    textarea.scrollTop = 0;
  });
  await page.keyboard.press("Enter");

  await expect
    .poll(() => editor.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await expect
    .poll(async () => {
      const editorScrollTop = await editor.evaluate(
        (element) => element.scrollTop,
      );
      const lineRailScrollTop = await page
        .locator(".line-rail")
        .evaluate((element) => element.scrollTop);
      return Math.abs(editorScrollTop - lineRailScrollTop);
    })
    .toBeLessThan(1);
  await expect
    .poll(() =>
      editor.evaluate((element) => {
        const textarea = element as HTMLTextAreaElement;
        const style = getComputedStyle(textarea);
        const lineHeight = Number.parseFloat(style.lineHeight);
        const paddingTop = Number.parseFloat(style.paddingTop);
        const paddingBottom = Number.parseFloat(style.paddingBottom);
        const caretLine = textarea.value
          .slice(0, textarea.selectionStart)
          .split("\n").length - 1;
        const caretTop = paddingTop + caretLine * lineHeight;
        const caretBottom = caretTop + lineHeight;
        return (
          caretTop >= textarea.scrollTop + paddingTop - 1 &&
          caretBottom <=
            textarea.scrollTop + textarea.clientHeight - paddingBottom + 1
        );
      }),
    )
    .toBe(true);
});

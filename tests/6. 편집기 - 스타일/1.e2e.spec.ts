import { expect, test } from "@playwright/test";

test("1. PC와 모바일의 편집기 글자 크기와 줄 높이 및 내부 레이아웃을 유지한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  const lines = page.locator('.line-rail [role="button"]');
  const getEditorFormat = () =>
    page.locator(".note-editor").evaluate((element) => {
      const lineRail = element.querySelector(".line-rail")!;
      const firstLine = lineRail.querySelector("span")!;
      const textarea = element.querySelector(".note-area")!;
      const editorStyle = getComputedStyle(element);

      return {
        lineRailWidth: lineRail.getBoundingClientRect().width,
        lineHeight: editorStyle.getPropertyValue("--editor-line-height").trim(),
        topPadding: editorStyle.getPropertyValue("--editor-top-padding").trim(),
        lineNumberPadding: getComputedStyle(firstLine).paddingRight,
        editorPadding: getComputedStyle(textarea).padding,
      };
    });

  await expect(editor).toHaveCSS("font-size", "19px");
  await expect(editor).toHaveCSS("line-height", "33px");
  await expect(lines.first()).toHaveCSS("height", "33px");
  await expect(lines.first()).toHaveCSS("line-height", "33px");
  const desktopFormat = await getEditorFormat();
  expect(desktopFormat.lineHeight).toBe("33px");
  expect(desktopFormat.topPadding).toBe("10px");
  expect(desktopFormat.editorPadding).toBe("10px 22px");
  await lines.first().click();
  await expect(editor).toHaveCSS("background-size", "100% 43px");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(editor).toHaveCSS("font-size", "19px");
  await expect(editor).toHaveCSS("line-height", "33px");
  await expect(lines.first()).toHaveCSS("height", "33px");
  await expect(lines.first()).toHaveCSS("line-height", "33px");
  await expect(editor).toHaveCSS("background-size", "100% 43px");
  expect(await getEditorFormat()).toEqual(desktopFormat);
});
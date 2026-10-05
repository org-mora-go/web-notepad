import { expect, test } from "@playwright/test";

test("1. 여러 줄 텍스트와 줄 번호를 표시하고 줄 번호로 줄을 선택한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await expect(editor).toHaveCSS("font-size", "17px");
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
  const desktopFormat = await getEditorFormat();
  expect(desktopFormat.topPadding).toBe("10px");
  expect(desktopFormat.editorPadding).toBe("10px 22px");
  await editor.fill("first\nsecond\nthird");
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines).toHaveCount(3);
  await expect(lines.first()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await lines.first().click();
  await expect(lines.first()).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".line-rail")).toHaveCSS(
    "background-image",
    /rgba\(184, 184, 176, 0\.2\)/,
  );
  await expect(page.locator(".line-rail")).toHaveCSS(
    "background-size",
    "100% 10px",
  );
  await expect(editor).toHaveCSS(
    "background-position",
    /0px 0px/,
  );
  await expect(editor).toHaveCSS(
    "background-size",
    "100% 39.75px",
  );
  await lines.first().click();
  await lines.nth(1).click();
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(1)).toHaveCSS(
    "background-color",
    "rgba(184, 184, 176, 0.2)",
  );
  await expect(lines.nth(1)).toHaveCSS("color", "rgb(184, 184, 176)");
  await expect(page.locator("textarea")).toHaveCSS(
    "background-image",
    /rgba\(184, 184, 176, 0\.2\)/,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(editor).toHaveCSS("font-size", "17px");
  expect(await getEditorFormat()).toEqual(desktopFormat);
});

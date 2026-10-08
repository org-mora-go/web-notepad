import { expect, test } from "@playwright/test";

test("8. 자동 줄바꿈에 맞춰 LINE 번호와 선택 강조를 확장한다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/");
  const editor = page.locator("textarea").first();
  const lines = page.locator('.line-rail [role="button"]');
  const content = `${"긴 메모 abc\t ".repeat(30)}\n마지막 줄\n`;
  await editor.fill(content);

  const expectedLineCount = () => editor.evaluate((element) => {
    const textarea = element as HTMLTextAreaElement;
    const clone = textarea.cloneNode() as HTMLTextAreaElement;
    const style = getComputedStyle(textarea);
    clone.value = textarea.value;
    for (const property of style) {
      clone.style.setProperty(property, style.getPropertyValue(property));
    }
    Object.assign(clone.style, {
      position: "fixed",
      visibility: "hidden",
      width: `${textarea.clientWidth}px`,
      height: "0px",
      minHeight: "0px",
      overflow: "hidden",
    });
    document.body.append(clone);
    const count = Math.round(
      (clone.scrollHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)) /
        parseFloat(style.lineHeight),
    );
    clone.remove();
    return count;
  });

  await expect.poll(() => lines.count()).toBe(await expectedLineCount());
  const desktopCount = await lines.count();
  await lines.first().click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => lines.count()).toBe(await expectedLineCount());
  const mobileCount = await lines.count();
  expect(mobileCount).toBeGreaterThan(desktopCount);
  await expect(lines).toHaveText(
    Array.from({ length: mobileCount }, (_, index) => String(index + 1).padStart(2, "0")),
  );
  await expect(lines.nth(mobileCount - 3)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(mobileCount - 2)).toHaveAttribute("aria-pressed", "false");
  await expect(editor).toHaveCSS("background-size", `100% ${(mobileCount - 2) * 33 + 10}px`);
  await lines.nth(1).click();
  await expect(page.locator(".line-rail .is-selected")).toHaveCount(0);
  await editor.fill("첫 줄\n둘째 줄");
  await expect(lines).toHaveText(["01", "02"]);
  await editor.fill(content);
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(lines).toHaveCount(desktopCount);
  await expect(editor).toHaveValue(content);
});
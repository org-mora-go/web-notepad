import { expect, test } from "@playwright/test";

test("6. PC와 모바일에서 탭 색상 아이콘은 10px이고 버튼 영역은 14px이다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const colorButton = page.locator(".tab-item.is-active .dirty-dot");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(colorButton).toHaveCSS("width", "14px");
    await expect(colorButton).toHaveCSS("height", "14px");
    await expect.poll(() => colorButton.evaluate((button) => {
      const style = getComputedStyle(button, "::before");
      return { width: style.width, height: style.height };
    })).toEqual({ width: "10px", height: "10px" });
  }
});
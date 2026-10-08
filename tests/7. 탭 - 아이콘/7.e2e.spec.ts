import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("7. PC와 모바일에서 탭 색상 아이콘은 10px이고 버튼 영역은 14px이다", async ({ page }) => {
  await page.goto("/");
  const colorButton = page.locator(".tab-item.is-active .dirty-dot");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(colorButton).toHaveCSS("width", "14px");
    await expect(colorButton).toHaveCSS("height", "14px");
    await expect.poll(() => colorButton.evaluate((button) => {
      const style = getComputedStyle(button, "::before");
      return { width: style.width, height: style.height };
    })).toEqual({ width: "10px", height: "10px" });
  }
});

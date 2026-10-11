import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("7. 탭 색상 아이콘은 PC에서 10px, 모바일에서 13px이며 버튼 영역은 14px이다", async ({ page }) => {
  await page.goto("/");
  const colorButton = page.locator(".tab-item.is-active .dirty-dot");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const iconSize = viewport.width <= 640 ? "13px" : "10px";
    await expect(colorButton).toHaveCSS("width", "14px");
    await expect(colorButton).toHaveCSS("height", "14px");
    await expect.poll(() => colorButton.evaluate((button) => {
      const style = getComputedStyle(button, "::before");
      return { width: style.width, height: style.height };
    })).toEqual({ width: iconSize, height: iconSize });
  }
});

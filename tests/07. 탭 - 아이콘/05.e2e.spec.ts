import { expect, test } from "@playwright/test";

import { tabColors } from "../__constant__";
import { chooseTabMenuItem } from "../__util__";

test("5. 고정 탭의 핀 아이콘은 고정 상태를 표시하고 탭 색상을 따른다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin");

  const pinIndicator = tab.locator(".tab-pin-indicator");
  await expect(pinIndicator).toBeVisible();
  await expect(pinIndicator).not.toHaveRole("button");

  for (const [index, color] of tabColors.entries()) {
    await expect(tab).toHaveAttribute("data-tab-color", color.name);
    await expect(pinIndicator.locator("svg")).toHaveCSS("color", color.text);
    await expect(tab.locator(".tab-title")).toHaveCSS("color", color.text);
    if (index < tabColors.length - 1) await tab.locator(".dirty-dot").click();
  }

  await pinIndicator.click();
  await expect(tab).toHaveClass(/is-pinned/);
});

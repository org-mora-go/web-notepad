import { expect, test } from "@playwright/test";

import { addTabButton } from "../__util__";

test("1. 새 탭의 기본 색상은 파스텔 그린이다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item.is-active");
  await expect(tab).toHaveAttribute("data-tab-color", "green");
  await expect
    .poll(() =>
      tab.locator(".dirty-dot").evaluate(
        (button) => getComputedStyle(button, "::before").backgroundColor,
      ),
    )
    .toContain("rgb(143, 227, 176)");

  await tab.locator(".dirty-dot").click();
  await expect(tab).toHaveAttribute("data-tab-color", "gray");
  await addTabButton(page).click();
  await expect(tab).toHaveAttribute("data-tab-color", "green");
});

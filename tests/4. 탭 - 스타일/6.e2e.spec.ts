import { expect, test } from "@playwright/test";

import { tabColors } from "./__constant__";

test("6. 탭 아이콘과 배경 및 상단 강조선의 색조를 동기화한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item").first();
  const colorButton = tab.locator(".dirty-dot");
  await tab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  const bookmarkIcon = tab.locator(".tab-bookmark-indicator svg");

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const [index, color] of tabColors.entries()) {
      await expect(tab).toHaveAttribute("data-tab-color", color.name);
      await expect(tab).toHaveCSS("background-color", color.tabBackground);
      await expect(tab).toHaveCSS("box-shadow", new RegExp(color.stripe));
      await expect(bookmarkIcon).toBeVisible();
      await expect(bookmarkIcon).toHaveCSS("color", color.text);
      await expect.poll(() => colorButton.evaluate(
        (button) => getComputedStyle(button, "::before").backgroundColor,
      )).toBe(color.text);
      if (index < tabColors.length - 1) await colorButton.click();
    }
    await page.getByRole("button", { name: "새 탭 추가" }).click();
    await expect(tab).not.toHaveClass(/is-active/);
    await expect(bookmarkIcon).toHaveCSS("color", tabColors[2].text);
    await tab.locator('[role="tab"]').click();
    await colorButton.click();
  }
});

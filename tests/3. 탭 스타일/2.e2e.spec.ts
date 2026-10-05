import { expect, test } from "@playwright/test";

test("2. 고정 탭의 핀 아이콘은 표시 전용이다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item").first();
  await tab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin" }).click();

  const pinIndicator = tab.locator(".tab-pin-indicator");
  await expect(pinIndicator).toBeVisible();
  await expect(pinIndicator).not.toHaveRole("button");
  const colors = [
    { name: "gray", rgb: "rgb(184, 184, 176)" },
    { name: "blue", rgb: "rgb(169, 201, 245)" },
    { name: "green", rgb: "rgb(143, 227, 176)" },
  ];

  for (const [index, color] of colors.entries()) {
    await expect(tab).toHaveAttribute("data-tab-color", color.name);
    await expect(pinIndicator.locator("svg")).toHaveCSS("color", color.rgb);
    await expect(tab.locator(".tab-title")).toHaveCSS("color", color.rgb);
    if (index < colors.length - 1) await tab.locator(".dirty-dot").click();
  }

  await pinIndicator.click();
  await expect(tab).toHaveClass(/is-pinned/);
});

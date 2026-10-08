import { expect, test } from "@playwright/test";

test("2. 탭 아이콘을 클릭하면 색상을 순환하고 색상별 글로우를 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item.is-active");
  const colorButton = tab.locator(".dirty-dot");
  const colors = [
    {
      name: "green",
      rgb: "rgb(143, 227, 176)",
      glow: "rgba(143, 227, 176, 0.55)",
    },
    {
      name: "gray",
      rgb: "rgb(184, 184, 176)",
      glow: "rgba(184, 184, 176, 0.55)",
    },
    {
      name: "red",
      rgb: "rgb(242, 139, 130)",
      glow: "rgba(242, 139, 130, 0.55)",
    },
  ];

  for (const [index, color] of colors.entries()) {
    await expect(tab).toHaveAttribute("data-tab-color", color.name);
    await expect
      .poll(() =>
        colorButton.evaluate(
          (button) => getComputedStyle(button, "::before").backgroundColor,
        ),
      )
      .toContain(color.rgb);
    await expect
      .poll(() =>
        colorButton.evaluate(
          (button) => getComputedStyle(button, "::before").boxShadow,
        ),
      )
      .toContain(color.glow);
    if (index < colors.length - 1) await colorButton.click();
  }
  await colorButton.click();
  await expect(tab).toHaveAttribute("data-tab-color", "green");
});

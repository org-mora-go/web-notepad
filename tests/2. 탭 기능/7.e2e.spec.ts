import { expect, test } from "@playwright/test";

test("7. 탭 색상을 순환하고 변경 표시를 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item.is-active");
  const colorButton = tab.locator(".dirty-dot");
  const initialIcon = await colorButton.evaluate((button) => {
    const iconStyle = getComputedStyle(button, "::before");
    return {
      width: iconStyle.width,
      height: iconStyle.height,
      boxShadow: iconStyle.boxShadow,
    };
  });
  await expect
    .poll(() =>
      colorButton.evaluate(
        (button) => getComputedStyle(button, "::before").boxShadow,
      ),
    )
    .toContain("rgba(184, 184, 176, 0.55)");
  await page.locator("textarea").fill("changed");
  await expect(tab).toHaveClass(/is-dirty/);
  await expect(colorButton).toHaveCSS("width", "13px");
  await expect(colorButton).toHaveCSS("height", "13px");
  const dirtyIcon = await colorButton.evaluate((button) => {
    const iconStyle = getComputedStyle(button, "::before");
    return {
      width: iconStyle.width,
      height: iconStyle.height,
      boxShadow: iconStyle.boxShadow,
      filter: iconStyle.filter,
    };
  });
  expect(dirtyIcon.width).toBe(initialIcon.width);
  expect(dirtyIcon.height).toBe(initialIcon.height);
  expect(dirtyIcon.boxShadow).toBe(initialIcon.boxShadow);
  expect(dirtyIcon.filter).toBe("brightness(1.15)");
  const colors = [
    {
      name: "gray",
      rgb: "rgb(184, 184, 176)",
      glow: "rgba(184, 184, 176, 0.55)",
    },
    {
      name: "blue",
      rgb: "rgb(169, 201, 245)",
      glow: "rgba(169, 201, 245, 0.55)",
    },
    {
      name: "green",
      rgb: "rgb(143, 227, 176)",
      glow: "rgba(143, 227, 176, 0.55)",
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
});

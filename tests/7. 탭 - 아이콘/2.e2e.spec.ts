import { expect, test } from "@playwright/test";

import { tabColors } from "../__constant__";

test("2. 탭 아이콘을 클릭하면 색상을 순환하고 색상별 글로우를 표시한다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item.is-active");
  const colorButton = tab.locator(".dirty-dot");
  const readIconStyle = (property: "backgroundColor" | "boxShadow") =>
    colorButton.evaluate(
      (button, name) => getComputedStyle(button, "::before")[name],
      property,
    );

  for (const [index, color] of tabColors.entries()) {
    await expect(tab).toHaveAttribute("data-tab-color", color.name);
    await expect.poll(() => readIconStyle("backgroundColor")).toContain(color.text);
    await expect.poll(() => readIconStyle("boxShadow")).toContain(`rgba(${color.stripe}, 0.55)`);
    if (index < tabColors.length - 1) await colorButton.click();
  }
  await colorButton.click();
  await expect(tab).toHaveAttribute("data-tab-color", "green");
});

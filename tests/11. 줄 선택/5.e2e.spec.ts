import { expect, test } from "@playwright/test";

import { tabColors } from "../__constant__";

test("5. 선택한 줄 번호는 탭 색상을 따르고 선택하지 않은 줄은 검은 배경을 유지한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("first\nsecond\nthird");
  const tab = page.locator(".tab-item.is-active");
  const colorButton = tab.locator(".dirty-dot");
  const lineNumbers = page.locator(".line-rail [role='button']");

  for (const [index, color] of tabColors.entries()) {
    await expect(tab).toHaveAttribute("data-tab-color", color.name);
    await expect(lineNumbers.nth(1)).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await lineNumbers.first().click();
    await expect(lineNumbers.first()).toHaveCSS("background-color", color.line);
    await expect(lineNumbers.first()).toHaveCSS("color", color.text);
    await lineNumbers.first().click();
    await expect(lineNumbers.first()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    if (index < tabColors.length - 1) await colorButton.click();
  }
});
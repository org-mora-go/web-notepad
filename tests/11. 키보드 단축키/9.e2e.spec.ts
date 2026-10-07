import { expect, test } from "@playwright/test";

test("9. SHORTCUT 버튼은 외곽선 없이 구분자와 14px 라벨을 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const shortcut = page.locator(".shortcut-command");
  const separator = shortcut.locator(".status-separator");
  await expect(separator).toHaveText("|");
  await expect(separator).toHaveCount(1);
  await expect(shortcut).toHaveCSS("border-top-width", "0px");
  await page.setViewportSize({ width: 1280, height: 844 });
  for (const label of await shortcut.locator("span").all()) {
    await expect(label).toHaveCSS("font-size", "14px");
  }
  await expect(separator).toHaveCSS("margin-left", "7px");
  await expect(separator).toHaveCSS("margin-right", "7px");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(separator).toHaveCSS("margin-left", "4px");
  await expect(separator).toHaveCSS("margin-right", "4px");
});

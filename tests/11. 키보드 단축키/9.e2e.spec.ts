import { expect, test } from "@playwright/test";

test("9. SHORTCUT 버튼은 외곽선 없이 구분자와 14px 라벨을 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const shortcut = page.locator(".shortcut-command");
  const separator = shortcut.locator(".status-separator");
  await expect(separator).toHaveText("|");
  await expect(separator).toHaveCount(1);
  await expect(shortcut).toHaveCSS("border-top-width", "0px");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const label of await shortcut.locator("span").all()) {
      await expect(label).toHaveCSS("font-size", "14px");
    }
  }
});

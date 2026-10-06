import { expect, test } from "@playwright/test";

test("3. 좌측 글자 크기와 외곽선 없는 SHORTCUT 구분자를 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const shortcut = page.locator(".shortcut-command");
  const separator = shortcut.locator(".status-separator");
  await expect(separator).toHaveText("|");
  await expect(separator).toHaveCount(1);
  await expect(shortcut).toHaveCSS("border-top-width", "0px");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator(".creator-credit")).toHaveCSS("font-size", "13px");
    for (const label of await shortcut.locator("span").all()) {
      await expect(label).toHaveCSS("font-size", "14px");
    }
  }
});
import { expect, test } from "@playwright/test";

test("9. 단축키 패널을 다른 패널과 동시에 열지 않고 모바일 진입을 숨긴다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const shortcuts = page.locator("#shortcuts-panel");
  for (const { panel, closeLabel } of [
    { panel: "bookmarks", closeLabel: "북마크 닫기" },
    { panel: "groups", closeLabel: "그룹 닫기" },
  ]) {
    await page.locator(`button[aria-controls="${panel}-panel"]`).click();
    await expect(page.locator(`#${panel}-panel`)).toHaveAttribute("aria-hidden", "false");
    await expect(shortcuts).toHaveAttribute("aria-hidden", "true");
    await page.getByRole("button", { name: closeLabel }).click();
    await page.getByRole("button", { name: "단축키 안내" }).click();
    await expect(shortcuts).toHaveAttribute("aria-hidden", "false");
    await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "true");
    await page.getByRole("button", { name: "단축키 닫기" }).click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "단축키 안내" })).toBeHidden();
});
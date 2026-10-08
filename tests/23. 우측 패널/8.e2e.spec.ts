import { expect, test } from "@playwright/test";

test("8. 그룹·북마크·단축키 안내 패널 헤더의 위아래 패딩을 9px로 표시한다", async ({ page }) => {
  await page.goto("/");

  for (const { panelId, headerClass } of [
    { panelId: "groups-panel", headerClass: "group-header" },
    { panelId: "bookmarks-panel", headerClass: "bookmark-header" },
    { panelId: "shortcuts-panel", headerClass: "shortcut-header" },
  ]) {
    await page.locator(`button[aria-controls="${panelId}"]`).click();
    await expect(page.locator(`#${panelId}`)).toHaveAttribute("aria-hidden", "false");

    const header = page.locator(`#${panelId} .${headerClass}`);
    await expect(header).toHaveCSS("min-height", "55px");
    await expect(header).toHaveCSS("height", "55px");
    await expect(header).toHaveCSS("padding-top", "9px");
    await expect(header).toHaveCSS("padding-bottom", "9px");

    await page.keyboard.press("Escape");
    await expect(page.locator(`#${panelId}`)).toHaveAttribute("aria-hidden", "true");
  }
});

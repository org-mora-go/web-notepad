import { expect, test } from "@playwright/test";

import { readMoveGroupState, seedMoveGroupState } from "./__util__";

test("17. PC와 모바일 탭 메뉴에서 Move Group 대상을 선택하거나 취소한다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const openMenu = async () => {
      const tab = page.getByRole("tab", { name: "Move me", exact: true });
      if (width === 1280) await tab.click({ button: "right" });
      else await tab.dblclick();
    };
    await seedMoveGroupState(page, { withTarget: false });
    await openMenu();
    await expect(page.getByRole("menuitem", { name: "Move Group", exact: true })).toBeDisabled();
    await page.keyboard.press("Escape");

    await seedMoveGroupState(page);
    const original = await readMoveGroupState(page);
    await openMenu();
    await expect(page.getByRole("menu", { name: "Tab actions", exact: true })).toHaveCSS("width", "188px");
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    const menu = page.getByRole("menu", { name: "Move Group", exact: true });
    await expect(menu).toHaveCSS("width", "188px");
    await expect(menu.locator(".move-group-option svg")).toHaveCount(0);
    await expect(menu.getByRole("menuitem", { name: "Back to tab actions" }).locator("svg")).toHaveCount(1);
    await expect(menu.getByRole("menuitem", { name: "Ungrouped", exact: true })).toHaveCount(0);
    await expect(menu.getByRole("menuitem", { name: "Target", exact: true })).toBeFocused();
    const bounds = await menu.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(8);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width - 8);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(836);
    await menu.getByRole("menuitem", { name: "Back to tab actions" }).click();
    await expect(page.getByRole("menu", { name: "Tab actions", exact: true })).toHaveCSS("width", "188px");
    await expect(page.getByRole("menuitem", { name: "Unpin", exact: true })).toBeVisible();
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await openMenu();
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.mouse.click(2, 200);
    await expect(page.getByRole("menu")).toHaveCount(0);
    expect(await readMoveGroupState(page)).toEqual(original);
  }
});
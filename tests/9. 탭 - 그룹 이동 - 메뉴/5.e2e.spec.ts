import { expect, test } from "@playwright/test";

import { seedMoveGroupState } from "../__util__";

test("5. 그룹 선택 화면과 기본 탭 메뉴의 너비를 188px로 유지한다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await seedMoveGroupState(page);
    const tab = page.getByRole("tab", { name: "Move me", exact: true });
    if (width === 1280) await tab.click({ button: "right" });
    else await tab.dblclick();
    await expect(page.getByRole("menu", { name: "Tab actions", exact: true })).toHaveCSS("width", "188px");
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    const menu = page.getByRole("menu", { name: "Move Group", exact: true });
    await expect(menu).toHaveCSS("width", "188px");
    await menu.getByRole("menuitem", { name: "Back to tab actions" }).click();
    await expect(page.getByRole("menu", { name: "Tab actions", exact: true })).toHaveCSS("width", "188px");
  }
});

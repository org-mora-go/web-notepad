import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { moveGroupSourceTab, openTabMenu, readStoredState, seedMoveGroupState } from "../__util__";

test("3. 뒤로 가기, Escape, 바깥 클릭으로 이동 없이 그룹 목록을 닫는다", async ({ page }) => {
  const moveGroup = page.getByRole("menuitem", { name: "Move Group", exact: true });
  const menu = page.getByRole("menu", { name: "Move Group", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    const original = await readStoredState(page);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await moveGroup.click();
    await menu.getByRole("menuitem", { name: "Back to tab actions" }).click();
    await expect(page.getByRole("menu", { name: "Tab actions", exact: true })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Unpin", exact: true })).toBeVisible();

    await moveGroup.click();
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);

    await openTabMenu(moveGroupSourceTab(page), viewport);
    await moveGroup.click();
    await expect(menu).toBeVisible();
    await page.mouse.click(2, 200);
    await expect(page.getByRole("menu")).toHaveCount(0);
    expect(await readStoredState(page)).toEqual(original);
  }
});

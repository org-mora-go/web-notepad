import { expect, type Locator, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState, writeStoredState } from "../__util__";

test("4. 메뉴와 그룹 목록을 화면 안에 배치하고 긴 그룹 이름은 말줄임·툴팁으로 표시한다", async ({ page }) => {
  const longName = "Very long target group name that should be truncated in the menu";
  const menu = page.getByRole("menu", { name: "Move Group", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const state = await seedMoveGroupState(page);
    state.groups[1].name = longName;
    await writeStoredState(page, state);
    await openTabMenu(moveGroupSourceTab(page), viewport);

    const expectInViewport = async (locator: Locator) => {
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(8);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width - 8);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height - 8);
    };
    await expectInViewport(page.getByRole("menu", { name: "Tab actions", exact: true }));
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await expectInViewport(menu);

    const option = menu.getByRole("menuitem", { name: longName, exact: true });
    await expect(option).toHaveAttribute("title", longName);
    const truncated = await option.evaluate((element) => {
      const target = Array.from(element.querySelectorAll<HTMLElement>("*"))
        .concat(element as HTMLElement)
        .find((node) => getComputedStyle(node).textOverflow === "ellipsis");
      return target ? target.scrollWidth > target.clientWidth : false;
    });
    expect(truncated).toBe(true);
    await expect(menu.locator(".move-group-option svg")).toHaveCount(0);
    await expect(menu.getByRole("menuitem", { name: "Back to tab actions" }).locator("svg")).toHaveCount(1);
  }
});

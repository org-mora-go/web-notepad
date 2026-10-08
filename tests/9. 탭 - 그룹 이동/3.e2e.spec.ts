import { expect, test } from "@playwright/test";

import { readMoveGroupState, seedMoveGroupState } from "../__util__";

test("3. 원래 그룹의 마지막 탭을 이동하면 빈 탭을 새로 만든다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await seedMoveGroupState(page);
    const tab = page.getByRole("tab", { name: "Move me", exact: true });
    if (width === 1280) await tab.click({ button: "right" });
    else await tab.dblclick();
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.getByRole("menuitem", { name: "Target", exact: true }).click();
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(page.getByRole("tab")).toHaveCount(1);
    await expect(page.locator("textarea")).toHaveValue("");

    const moved = await readMoveGroupState(page);
    expect(moved.groups[0].tabs).toHaveLength(1);
    expect(moved.groups[0].tabs[0].id).not.toBe("tab-1");
    expect(moved.groups[0].tabs[0].content).toBe("");
    expect(moved.groups[0].activeTabId).toBe(moved.groups[0].tabs[0].id);
  }
});

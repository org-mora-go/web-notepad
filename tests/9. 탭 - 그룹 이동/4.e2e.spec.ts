import { expect, test } from "@playwright/test";

import { readMoveGroupState, seedMoveGroupState } from "../__util__";

test("4. 그룹 이동 결과는 새로고침 후에도 유지한다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await seedMoveGroupState(page);
    const tab = page.getByRole("tab", { name: "Move me", exact: true });
    if (width === 1280) await tab.click({ button: "right" });
    else await tab.dblclick();
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.getByRole("menuitem", { name: "Target", exact: true }).click();
    await expect(page.getByRole("menu")).toHaveCount(0);

    const moved = await readMoveGroupState(page);
    await page.reload();
    expect(await readMoveGroupState(page)).toEqual(moved);
    await expect(page.getByRole("tab", { name: "Move me", exact: true })).toHaveCount(0);
    await page.locator('button[aria-controls="groups-panel"]').click();
    await page.getByRole("button", { name: "Target", exact: true }).click();
    await expect(page.getByRole("tab", { name: "Move me", exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("textarea")).toHaveValue("Move me\nselected line");
  }
});

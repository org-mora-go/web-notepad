import { expect, test } from "@playwright/test";

import { readMoveGroupState, seedMoveGroupState } from "./__util__";

test("2. 그룹 이동 시 탭과 북마크를 보존하고 마지막 탭은 빈 탭으로 대체한다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const original = await seedMoveGroupState(page);
    const tab = page.getByRole("tab", { name: "Move me", exact: true });
    if (width === 1280) await tab.click({ button: "right" });
    else await tab.dblclick();
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.getByRole("menuitem", { name: "Target", exact: true }).click();
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(page.locator("textarea")).toHaveValue("");

    const moved = await readMoveGroupState(page);
    expect(moved.activeGroupId).toBe("ungrouped");
    expect(moved.groups[0].tabs).toHaveLength(1);
    expect(moved.groups[0].tabs[0].id).not.toBe("tab-1");
    expect(moved.groups[0].bookmarks).toEqual([]);
    expect(moved.groups[1].tabs.at(-1)).toEqual(original.groups[0].tabs[0]);
    expect(moved.groups[1].bookmarks).toEqual(original.groups[0].bookmarks);
    expect(moved.groups[1].activeTabId).toBe("tab-1");
    expect(moved.groups[1].activePane).toBe("left");
    await page.reload();
    expect(await readMoveGroupState(page)).toEqual(moved);
    await page.locator('button[aria-controls="groups-panel"]').click();
    await page.getByRole("button", { name: "Target", exact: true }).click();
    await expect(page.locator("textarea")).toHaveValue("Move me\nselected line");
    await expect(page.locator(".tab-item.is-active")).toHaveClass(/is-pinned/);
    await expect(page.locator(".tab-item.is-active")).toHaveClass(/is-bookmarked/);
    await expect(page.locator(".tab-item.is-active")).toHaveAttribute("data-tab-color", "red");
    await expect(page.locator('.line-rail [role="button"]').nth(1)).toHaveAttribute("aria-pressed", "true");
    await page.locator('button[aria-controls="bookmarks-panel"]').click();
    await expect(page.locator("#bookmarks-panel strong")).toHaveText("Move me");
    await page.getByRole("button", { name: "열기", exact: true }).click();
    await expect(page.getByRole("tab")).toHaveCount(2);
    await expect(page.locator("textarea")).toHaveValue("Move me\nselected line");
  }
});
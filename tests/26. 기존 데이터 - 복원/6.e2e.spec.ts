import { expect, test } from "@playwright/test";

test("6. 저장된 선택 줄의 중복·범위 초과·잘못된 인덱스를 제거하고 정렬해 복원한다", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("web-notepad-storage", JSON.stringify({
      state: {
        activeGroupId: "ungrouped",
        groups: [{
          id: "ungrouped",
          name: "Ungrouped",
          activeTabId: "tab-1",
          tabs: [{
            id: "tab-1",
            content: "one\ntwo\nthree",
            selectedLines: [2, 1, 1, -1, 3, 0.5, "0", null],
          }],
        }],
      },
      version: 0,
    }));
  });
  await page.goto("http://localhost:3000");
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines.first()).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await page.locator('[role="tab"]').click();
  expect(await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("web-notepad-storage")!);
    return saved.state.groups[0].tabs[0].selectedLines;
  })).toEqual([1, 2]);
});
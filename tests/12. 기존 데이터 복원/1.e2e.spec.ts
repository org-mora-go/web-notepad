import { expect, test } from "@playwright/test";

test("1. 누락되거나 잘못된 저장 필드를 기본값으로 정규화한다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({
        state: {
          activeGroupId: "ungrouped",
          groups: [
            {
              id: "ungrouped",
              name: "Ungrouped",
              tabs: [
                { id: "tab-1", content: "normalized", urgent: true },
                { id: "tab-2", tabColor: "invalid" },
                { id: "tab-3" },
                { id: "tab-4", urgent: false },
              ],
            },
          ],
        },
        version: 0,
      }),
    );
  });
  await page.goto("http://localhost:3000");
  await expect(page.locator("textarea")).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("normalized");
  await expect(page.locator(".tab-item")).toHaveCount(4);
  for (const index of [0, 1, 2]) {
    await expect(page.locator(".tab-item").nth(index)).toHaveAttribute(
      "data-tab-color",
      "green",
    );
  }
  await expect(page.locator(".tab-item").nth(3)).toHaveAttribute(
    "data-tab-color",
    "gray",
  );
  await expect(page.locator('.line-rail [role="button"]').first()).toHaveAttribute("aria-pressed", "false");
});

test("1. 저장된 선택 줄의 중복과 잘못된 인덱스를 정리한다", async ({ page }) => {
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

import { expect, test } from "@playwright/test";

test("1. 누락되거나 잘못된 저장 필드를 그린·선택 없음 기본값으로 정규화한다", async ({
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
                { id: "tab-1", content: "normalized\nsecond", tabColor: "invalid" },
                { id: "tab-2" },
                { id: "tab-3", tabColor: 42, pinned: "yes" },
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
  await expect(page.locator("textarea")).toHaveValue("normalized\nsecond");
  const tabs = page.locator(".tab-item");
  await expect(tabs).toHaveCount(3);
  for (const index of [0, 1, 2]) {
    await expect(tabs.nth(index)).toHaveAttribute("data-tab-color", "green");
  }
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines).toHaveCount(2);
  await expect(lines.nth(0)).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
});

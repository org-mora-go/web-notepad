import { expect, test } from "@playwright/test";

test("2. 이전 긴급 표시 값은 참이면 그린, 거짓이면 그레이로 변환한다", async ({ page }) => {
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
                { id: "tab-1", content: "urgent", urgent: true },
                { id: "tab-2", content: "calm", urgent: false },
              ],
            },
          ],
        },
        version: 0,
      }),
    );
  });
  await page.goto("http://localhost:3000");
  await expect(page.locator("textarea")).toHaveValue("urgent");
  const tabs = page.locator(".tab-item");
  await expect(tabs).toHaveCount(2);
  await expect(tabs.nth(0)).toHaveAttribute("data-tab-color", "green");
  await expect(tabs.nth(1)).toHaveAttribute("data-tab-color", "gray");
});

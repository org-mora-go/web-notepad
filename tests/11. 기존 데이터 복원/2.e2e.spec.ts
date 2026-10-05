import { expect, test } from "@playwright/test";

test("2. 존재하지 않는 그룹과 탭 선택을 유효한 기본 선택으로 정리한다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({
        state: {
          activeGroupId: "missing-group",
          groups: [
            {
              id: "ungrouped",
              name: "Ungrouped",
              activeTabId: "missing-tab",
              tabs: [{ id: "valid-tab", content: "fallback note" }],
              rightTabIds: ["missing-tab"],
              activeRightTabId: "missing-tab",
              activePane: "right",
            },
          ],
        },
        version: 0,
      }),
    );
  });
  await page.goto("http://localhost:3000");
  await expect(page.locator("textarea")).toHaveValue("fallback note");
  await expect(page.locator(".note-pane-body")).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Ungrouped/ })).toBeVisible();
});

import { expect, test } from "@playwright/test";

test("a. 누락되거나 잘못된 저장 필드를 기본값으로 정규화하고 잘못된 선택을 정리한다", async ({
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
              tabs: [{ id: "tab-1", content: "normalized" }],
            },
          ],
        },
        version: 0,
      }),
    );
  });
  await page.goto("http://localhost:3000");
  await expect(page.locator("textarea")).toBeVisible();
  await expect(page.locator(".tab-item")).toHaveCount(1);
});

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
              tabs: [{ id: "tab-1", content: "normalized", urgent: true }],
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
  await expect(page.locator(".tab-item")).toHaveCount(1);
  await expect(page.locator(".tab-item")).toHaveAttribute(
    "data-tab-color",
    "green",
  );
});

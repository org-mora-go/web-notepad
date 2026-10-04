import { expect, test } from "@playwright/test";

test("4. 고정 탭은 닫기 버튼과 가운데 클릭으로 닫히지 않는다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item").first();
  await tab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin" }).click();
  await expect(tab).toHaveClass(/is-pinned/);
  await expect(tab.locator(".tab-pin-indicator")).toBeVisible();
  await expect(tab.locator(".tab-pin-indicator")).not.toHaveRole("button");
  await expect(tab.locator(".tab-close")).toHaveCount(0);
  await tab.locator(".tab-pin-indicator").click();
  await expect(tab).toHaveClass(/is-pinned/);
  await tab.locator('[role="tab"]').click({ button: "middle" });
  await expect(tab).toHaveClass(/is-pinned/);
});

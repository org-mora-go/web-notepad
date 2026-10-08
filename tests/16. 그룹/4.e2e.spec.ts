import { expect, test } from "@playwright/test";

test("4. 기본 Ungrouped 그룹은 삭제할 수 없다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();

  await expect(page.getByRole("button", { name: "Work 그룹 삭제" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ungrouped 그룹 삭제" })).toHaveCount(0);
  await expect(
    page.locator(".group-item").filter({ hasText: "Ungrouped" }).locator('button[title="그룹 삭제"]'),
  ).toHaveCount(0);
});

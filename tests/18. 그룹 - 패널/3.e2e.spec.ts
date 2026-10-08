import { expect, test } from "@playwright/test";

test("3. 그룹을 생성해도 그룹 패널을 열린 상태로 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();

  const panel = page.locator("#groups-panel");
  await panel.getByRole("textbox", { name: "새 그룹 이름" }).fill("New group");
  await panel.getByRole("button", { name: "그룹 생성" }).click();

  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(
    panel.locator(".group-item").filter({ hasText: "New group" }),
  ).toBeVisible();
});

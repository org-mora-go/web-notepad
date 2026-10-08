import { expect, test } from "@playwright/test";

test("7. Ungrouped를 다른 그룹보다 옅은 색으로 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();

  const ungrouped = page
    .locator("#groups-panel .group-item")
    .filter({ hasText: "Ungrouped" })
    .locator("strong");
  const created = page
    .locator("#groups-panel .group-item")
    .filter({ hasText: "Work" })
    .locator("strong");
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();

  await expect(ungrouped).toHaveCSS("color", "rgb(133, 133, 127)");
  await expect(created).toHaveCSS("color", "rgb(143, 227, 176)");
});

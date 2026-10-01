import { expect, test } from "@playwright/test";

test("b. 그룹별 탭과 활성 패널 상태를 분리해 관리한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await page.locator("textarea").fill("work note");
  await page
    .locator(".group-item")
    .filter({ hasText: "Ungrouped" })
    .locator(".group-select")
    .click({ force: true });
  await expect(page.locator("textarea")).toHaveValue("");
});

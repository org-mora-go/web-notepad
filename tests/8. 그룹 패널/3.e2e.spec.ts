import { expect, test } from "@playwright/test";

test("3. 상태 표시줄에 현재 그룹 이름과 그룹 수를 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const groupCommand = page.locator(".group-status-command");
  await expect(groupCommand).toContainText("Ungrouped");
  await expect(groupCommand.locator(".status-count")).toHaveText("(1)");
});

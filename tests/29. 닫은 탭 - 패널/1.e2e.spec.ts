import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, closedCommand, createGroups } from "../__util__";

test("1. CLOSED 명령으로 패널을 열고 항목 제목에 그룹 이름, 내용에 닫은 탭 내용과 닫은 시각을 표시한다", async ({ page }) => {
  await page.goto("/");
  await createGroups(page, "Work");
  await closeActiveTabWithContent(page, "closed in work");

  await closedCommand(page).click();
  const panel = page.locator("#closed-panel");
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(panel.locator(".side-panel-header h2")).toHaveText("Closed");
  const item = panel.locator(".closed-item");
  await expect(item.locator(".closed-item-heading strong")).toHaveText("Work");
  await expect(item.locator(".expandable-content-text")).toHaveText("closed in work");
  await expect(item.locator("time")).toBeVisible();
});

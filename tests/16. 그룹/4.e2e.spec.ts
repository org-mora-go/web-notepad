import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand } from "../__util__";

test("4. 기본 Ungrouped 그룹은 삭제할 수 없다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");

  await expect(page.getByRole("button", { name: "Work 그룹 삭제" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ungrouped 그룹 삭제" })).toHaveCount(0);
  await expect(
    page.locator(".group-item").filter({ hasText: "Ungrouped" }).locator('button[title="그룹 삭제"]'),
  ).toHaveCount(0);
});

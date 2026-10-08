import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand } from "../__util__";

test("1. 그룹 패널은 그룹 이름을 대소문자 구분 없이 부분 검색하며 placeholder는 Search groups다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  const search = page.getByRole("searchbox", { name: "그룹 검색" });
  const items = page.locator(".group-item");
  await expect(search).toBeVisible();
  await expect(search).toHaveAttribute("placeholder", "Search groups");
  await expect(items).toHaveCount(2);

  await search.fill("work");
  await expect(items).toHaveCount(1);
  await expect(items).toContainText("Work");
  await search.fill("OR");
  await expect(items).toHaveCount(1);
  await expect(items).toContainText("Work");
  await search.fill("ungrouped");
  await expect(items).toHaveCount(1);
  await expect(items).toContainText("Ungrouped");
  await search.fill("missing");
  await expect(items).toHaveCount(0);
});

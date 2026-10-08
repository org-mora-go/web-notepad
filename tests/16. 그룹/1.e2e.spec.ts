import { expect, test } from "@playwright/test";

import { createGroups, switchGroup } from "../__util__";

test("1. Ungrouped 외에 이름 있는 그룹을 만들고 전환할 수 있다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("textarea").fill("ungrouped note");
  await createGroups(page, "Work");
  await expect(page.locator(".group-status-name")).toHaveText("Work");
  await expect(page.locator("textarea")).toHaveValue("");

  await switchGroup(page, "Ungrouped");
  await expect(page.locator(".group-status-name")).toHaveText("Ungrouped");
  await expect(page.locator("textarea")).toHaveValue("ungrouped note");

  await switchGroup(page, "Work");
  await expect(page.locator(".group-status-name")).toHaveText("Work");
  await expect(page.locator("textarea")).toHaveValue("");
});

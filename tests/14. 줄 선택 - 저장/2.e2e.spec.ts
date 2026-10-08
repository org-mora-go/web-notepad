import { test } from "@playwright/test";

import {
  addTabButton,
  createGroup,
  expectSelectedLines,
  groupsCommand,
  lineButtons,
  switchGroup,
} from "../__util__";

test("2. 그룹 전환과 분할 패널 이동 후에도 선택한 줄을 복원한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("one\ntwo\nthree");
  const lines = lineButtons(page);
  await lines.nth(1).click();
  await lines.nth(2).click();
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  await expectSelectedLines(page, [false]);
  await page.getByRole("button", { name: "그룹 닫기" }).click();
  await switchGroup(page, "Ungrouped");
  await expectSelectedLines(page, [false, true, true]);

  await addTabButton(page).click();
  await page.locator('[role="tab"]').first().click();
  await page.locator("textarea").press("Alt+F12");
  const rightPane = page.locator(".pane-slot").nth(1);
  await expectSelectedLines(rightPane, [false, true, true]);
  await page.reload();
  await expectSelectedLines(rightPane, [false, true, true]);
});

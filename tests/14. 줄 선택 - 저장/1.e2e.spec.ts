import { test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { addTabButton, expectSelectedLines, lineButtons } from "../__util__";

test("1. 줄 선택과 해제를 탭별로 저장하고 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill("one\ntwo\nthree");
  await lines.nth(1).click();
  await lines.nth(2).click();
  await addTabButton(page).click();
  await editor.fill("other\nnote");
  await expectSelectedLines(page, [false]);
  await lines.first().click();
  await page.locator('[role="tab"]').first().click();
  await expectSelectedLines(page, [false, true, true]);
  await page.reload();
  await expectSelectedLines(page, [false, true, true]);
  await lines.nth(1).click();
  await page.reload();
  await expectSelectedLines(page, [false, false, true]);
  await page.locator('[role="tab"]').nth(1).click();
  await expectSelectedLines(page, [true, false]);
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.reload();
  await expectSelectedLines(page, [true, false]);
});

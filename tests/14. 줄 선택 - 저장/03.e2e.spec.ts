import { test } from "@playwright/test";

import { expectSelectedLines, lineButtons } from "../__util__";

test("3. 줄 삽입과 삭제로 이동한 선택 위치도 저장한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill("one\ntwo\nthree");
  await lines.nth(1).click();
  await lines.nth(2).click();
  await editor.fill("zero\none\ntwo\nthree");
  await expectSelectedLines(page, [false, false, true, true]);
  await editor.fill("zero\none\nthree");
  await expectSelectedLines(page, [false, false, true]);
  await page.reload();
  await expectSelectedLines(page, [false, false, true]);
});

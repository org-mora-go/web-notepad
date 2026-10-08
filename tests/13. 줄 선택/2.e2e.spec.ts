import { test } from "@playwright/test";

import { expectSelectedLines, lineButtons } from "../__util__";

test("2. Shift 클릭으로 대상 줄이 속한 연속 선택 블록만 해제한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("textarea").fill("one\ntwo\nthree\nfour\nfive\nsix");
  const lines = lineButtons(page);

  for (const index of [0, 1, 3, 4, 5]) {
    await lines.nth(index).click();
  }
  await lines.nth(5).click({ modifiers: ["Shift"] });

  await expectSelectedLines(page, [true, true, false, false, false, false]);
});

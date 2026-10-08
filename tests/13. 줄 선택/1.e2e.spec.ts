import { test } from "@playwright/test";

import { expectSelectedLines, lineButtons } from "../__util__";

test("1. Shift 클릭으로 기준 줄부터 지정 줄까지 범위를 선택하고 다시 해제한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("textarea").fill("first\nsecond\nthird\nfourth\nfifth");
  const lines = lineButtons(page);

  await lines.nth(0).click();
  await lines.nth(4).click({ modifiers: ["Shift"] });
  await expectSelectedLines(page, Array(5).fill(true));

  await lines.nth(4).click({ modifiers: ["Shift"] });
  await expectSelectedLines(page, Array(5).fill(false));
});

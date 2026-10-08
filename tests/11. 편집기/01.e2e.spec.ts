import { expect, test } from "@playwright/test";

import { lineButtons } from "../__util__";

test("1. 여러 줄 텍스트와 줄 번호를 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("first\nsecond\nthird");
  const lines = lineButtons(page);
  await expect(lines).toHaveCount(3);
  await expect(lines).toHaveText(["01", "02", "03"]);
});

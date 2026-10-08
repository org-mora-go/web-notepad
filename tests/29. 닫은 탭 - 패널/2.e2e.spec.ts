import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, closedCommand } from "../__util__";

test("2. 더보기·간소화 버튼으로 닫은 탭 내용을 펼치거나 접는다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(
    page,
    Array.from({ length: 10 }, (_, index) => `line ${index}`).join("\n"),
  );
  await closedCommand(page).click();

  const content = page.locator(".expandable-content-text");
  const toggle = page.locator(".expandable-content-toggle");
  const collapsedHeight = (await content.boundingBox())!.height;
  await toggle.click();
  await expect(toggle).toHaveText("간소화");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect((await content.boundingBox())!.height).toBeGreaterThan(collapsedHeight);
  await toggle.click();
  await expect(toggle).toHaveText("더보기");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { addTabButton, dragDividerBy, lineButtons } from "../__util__";
import { WRAPPED_NOTE as content } from "./__constant__";
import { countWrappedLines } from "./__util__";

test("6. 자동 줄바꿈된 표시 줄 수에 맞춰 LINE 번호를 늘리고 줄인다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea").first();
  const lines = lineButtons(page);
  const numbers = (count: number) =>
    Array.from({ length: count }, (_, index) => String(index + 1).padStart(2, "0"));

  await editor.fill(content);
  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const desktopCount = await lines.count();
  expect(desktopCount).toBeGreaterThan(3);
  await expect(lines).toHaveText(numbers(desktopCount));

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const mobileCount = await lines.count();
  expect(mobileCount).toBeGreaterThan(desktopCount);
  await expect(lines).toHaveText(numbers(mobileCount));

  await editor.fill("첫 줄\n둘째 줄");
  await expect(lines).toHaveText(["01", "02"]);
  await editor.fill(content);
  await expect(lines).toHaveCount(mobileCount);

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(lines).toHaveCount(desktopCount);
  await expect(editor).toHaveValue(content);

  await addTabButton(page).click();
  await editor.fill("right");
  await editor.press("Alt+F12");
  const leftPane = page.locator(".pane-slot").nth(0);
  const leftEditor = leftPane.locator("textarea");
  const leftLines = lineButtons(leftPane);
  await expect(leftEditor).toHaveValue(content);
  await expect.poll(() => leftLines.count()).toBe(await countWrappedLines(leftEditor));
  const splitCount = await leftLines.count();
  expect(splitCount).toBeGreaterThan(desktopCount);

  await dragDividerBy(page, 300);
  await expect.poll(() => leftLines.count()).toBeLessThan(splitCount);
  await expect.poll(async () => (await leftLines.count()) === (await countWrappedLines(leftEditor))).toBe(true);
  await expect(leftLines).toHaveText(numbers(await leftLines.count()));
});

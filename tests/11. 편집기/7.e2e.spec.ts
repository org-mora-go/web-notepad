import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { expectSelectedLines, lineButtons, readActiveGroup } from "../__util__";
import { WRAPPED_NOTE as content } from "./__constant__";
import { countWrappedLines } from "./__util__";

test("7. 자동 줄바꿈된 번호를 선택하면 원본 줄의 모든 표시 줄을 강조하고 개행 기준 선택을 유지한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const editor = page.locator("textarea").first();
  const lines = lineButtons(page);
  await editor.fill(content);

  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const wrappedCount = await lines.count();
  const firstSourceLineCount = wrappedCount - 2;
  expect(firstSourceLineCount).toBeGreaterThan(1);

  await lines.first().click();
  await expectSelectedLines(page, [...Array(firstSourceLineCount).fill(true), false]);
  await expect(editor).toHaveCSS("background-size", `100% ${firstSourceLineCount * 33 + 10}px`);

  const storedSelection = async () => {
    const group = await readActiveGroup(page);
    return group.tabs.find((tab) => tab.id === group.activeTabId)!.selectedLines;
  };
  await expect.poll(storedSelection).toHaveLength(1);
  const selection = await storedSelection();

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const desktopCount = await lines.count();
  expect(desktopCount).toBeLessThan(wrappedCount);
  await expectSelectedLines(page, [...Array(desktopCount - 2).fill(true), false]);
  expect(await storedSelection()).toEqual(selection);

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(lines).toHaveCount(wrappedCount);
  await lines.nth(1).click();
  await expect(page.locator(".line-rail .is-selected")).toHaveCount(0);
  await expect.poll(storedSelection).toEqual([]);
});

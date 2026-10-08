import { expect, test } from "@playwright/test";

import { countWrappedLines } from "./__util__";

test("7. 자동 줄바꿈된 번호를 선택하면 원본 줄의 모든 표시 줄을 강조하고 개행 기준 선택을 유지한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea").first();
  const lines = page.locator('.line-rail [role="button"]');
  const content = `${"긴 메모 abc\t ".repeat(30)}\n마지막 줄\n`;
  await editor.fill(content);

  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const wrappedCount = await lines.count();
  const firstSourceLineCount = wrappedCount - 2;
  expect(firstSourceLineCount).toBeGreaterThan(1);

  await lines.first().click();
  for (let index = 0; index < firstSourceLineCount; index += 1) {
    await expect(lines.nth(index)).toHaveAttribute("aria-pressed", "true");
  }
  await expect(lines.nth(wrappedCount - 2)).toHaveAttribute("aria-pressed", "false");
  await expect(editor).toHaveCSS("background-size", `100% ${firstSourceLineCount * 33 + 10}px`);

  const storedSelection = () =>
    page.evaluate(() => {
      const stored = JSON.parse(localStorage.getItem("web-notepad-storage") ?? "{}");
      const group = stored.state.groups.find(
        (entry: { id: string }) => entry.id === stored.state.activeGroupId,
      );
      return group.tabs.find((tab: { id: string }) => tab.id === group.activeTabId).selectedLines;
    });
  await expect.poll(storedSelection).toHaveLength(1);
  const selection = await storedSelection();

  await page.setViewportSize({ width: 1280, height: 844 });
  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const desktopCount = await lines.count();
  expect(desktopCount).toBeLessThan(wrappedCount);
  for (let index = 0; index < desktopCount - 2; index += 1) {
    await expect(lines.nth(index)).toHaveAttribute("aria-pressed", "true");
  }
  await expect(lines.nth(desktopCount - 2)).toHaveAttribute("aria-pressed", "false");
  expect(await storedSelection()).toEqual(selection);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(lines).toHaveCount(wrappedCount);
  await lines.nth(1).click();
  await expect(page.locator(".line-rail .is-selected")).toHaveCount(0);
  await expect.poll(storedSelection).toEqual([]);
});

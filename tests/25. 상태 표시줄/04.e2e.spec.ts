import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { bookmarksCommand } from "../__util__";

test("4. PC 명령 정렬을 유지하고 모바일에서는 네 메뉴를 균등 배치한다", async ({
  page,
}) => {
  await page.goto("/");

  const closed = page.locator(".closed-command");
  const shortcut = page.locator(".shortcut-command");
  const search = page.locator(".global-search-command");
  const bookmark = bookmarksCommand(page);
  const group = page.locator(".group-status-command");
  const separators = page.locator(".status-meta .status-separator");
  const expectShortcutLeftAligned = async () => {
    const alignment = await shortcut.evaluate((command) => {
      const statusBar = command.closest(".status-bar");
      if (!statusBar) return null;

      const barBounds = statusBar.getBoundingClientRect();
      const commandBounds = command.getBoundingClientRect();
      const paddingRight = parseFloat(getComputedStyle(statusBar).paddingRight);
      return {
        commandLeft: commandBounds.left,
        contentLeft: barBounds.left + paddingRight,
      };
    });

    expect(alignment).not.toBeNull();
    expect(
      Math.abs(alignment!.commandLeft - alignment!.contentLeft),
    ).toBeLessThan(1);
  };
  const expectMetaRightAligned = async () => {
    const alignment = await page.locator(".status-meta").evaluate((meta) => {
      const statusBar = meta.closest(".status-bar");
      const group = meta.querySelector(".group-status-command");
      if (!statusBar || !group) return null;

      const barBounds = statusBar.getBoundingClientRect();
      const groupBounds = group.getBoundingClientRect();
      const paddingRight = parseFloat(getComputedStyle(statusBar).paddingRight);
      return {
        groupRight: groupBounds.right,
        contentRight: barBounds.right - paddingRight,
      };
    });

    expect(alignment).not.toBeNull();
    expect(
      Math.abs(alignment!.groupRight - alignment!.contentRight),
    ).toBeLessThan(1);
  };
  const expectSearchLeftAligned = async () => {
    const alignment = await search.evaluate((command) => {
      const statusBar = command.closest(".status-bar");
      if (!statusBar) return null;

      const barBounds = statusBar.getBoundingClientRect();
      const commandBounds = command.getBoundingClientRect();
      const paddingLeft = parseFloat(getComputedStyle(statusBar).paddingLeft);
      return { commandLeft: commandBounds.left, contentLeft: barBounds.left + paddingLeft };
    });

    expect(alignment).not.toBeNull();
    expect(Math.abs(alignment!.commandLeft - alignment!.contentLeft)).toBeLessThan(1);
  };

  await expect(page.locator(".status-light, .save-state")).toHaveCount(0);
  const actionOrder = await page.locator(".status-controls .status-command").evaluateAll(
    (commands) => commands.map((command) => command.textContent?.trim()),
  );
  expect(actionOrder[0]).toContain("SEARCH");
  expect(actionOrder[1]).toContain("CLOSED");
  expect(actionOrder[2]).toContain("BOOKMARK");
  expect(actionOrder[3]).toContain("Ungrouped");
  await expect(separators).toHaveCount(3);
  await expect(search.locator(".status-separator")).toHaveText("|");
  await expect(closed.locator(".status-separator")).toHaveText("|");
  await expect(shortcut.locator(".status-separator")).toHaveCount(0);
  await expect(bookmark.locator(".status-separator")).toHaveText("|");
  await expect(group.locator(".status-separator")).toHaveCount(0);
  await expect(bookmark).toHaveCSS("border-top-width", "0px");
  await expect(group).toHaveCSS("border-top-width", "0px");
  await expect(shortcut).toHaveCSS("border-top-width", "0px");
  await expect(search).toHaveCSS("border-top-width", "0px");
  await expect(closed).toHaveCSS("border-top-width", "0px");
  await expect(page.getByRole("button", { name: "BOOKMARK" })).toBeVisible();
  await expectShortcutLeftAligned();
  await expectMetaRightAligned();

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(search.locator(".global-search-label")).toBeVisible();
  await expect(group.locator("svg")).toHaveCount(1);
  await expect(group.locator(".group-status-label")).toBeInViewport();
  const commands = [search, closed, bookmark, group];
  for (const [index, command] of commands.entries()) {
    const bounds = (await command.boundingBox())!;
    expect(bounds.width).toBeCloseTo(MOBILE_VIEWPORT.width / 4, 1);
    expect(bounds.x).toBeCloseTo(index * MOBILE_VIEWPORT.width / 4, 1);
  }
  await expectSearchLeftAligned();
  await expectMetaRightAligned();
});

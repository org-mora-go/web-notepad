import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { bookmarksCommand, chooseTabMenuItem } from "../__util__";

test("1. PC와 모바일에서 CLOSED와 BOOKMARK 라벨 및 개수를 표시한다", async ({ page }) => {
  await page.goto("/");
  await chooseTabMenuItem(page, "Bookmark");
  const label = bookmarksCommand(page).locator(".status-label");
  const count = bookmarksCommand(page).locator(".status-count");
  const closedLabel = page.locator(".closed-command .status-label");
  const closedCount = page.locator(".closed-command .status-count");
  await page.locator("textarea").fill("closed note");
  await page.locator(".tab-item.is-active .tab-close").click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(label).toHaveText("BOOKMARK");
  await expect(label).toBeInViewport();
  await expect(count).toHaveText("(1)");
  await expect(count).toBeInViewport();
  await expect(closedLabel).toHaveText("CLOSED");
  await expect(closedLabel).toBeVisible();
  await expect(closedCount).toHaveText("(1)");
  await expect(closedCount).toBeInViewport();

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(label).toBeVisible();
  await expect(count).toHaveText("(1)");
  await expect(count).toBeInViewport();
  await expect(bookmarksCommand(page).locator("svg")).toBeInViewport();
  await expect(closedLabel).toBeVisible();
  await expect(closedCount).toHaveText("(1)");
  await expect(closedCount).toBeInViewport();
  for (const badge of [count, closedCount]) {
    await expect(badge).toHaveCSS("position", "absolute");
    await expect(badge).toHaveCSS("top", "0px");
  }
});

import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../__constant__";
import { bookmarksCommand, chooseTabMenuItem } from "../__util__";

test("1. PC와 모바일에서 BOOKMARK 라벨과 북마크 개수를 표시한다", async ({ page }) => {
  await page.goto("/");
  await chooseTabMenuItem(page, "Bookmark");
  const label = bookmarksCommand(page).locator(".status-label");
  const count = bookmarksCommand(page).locator(".status-count");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(label).toHaveText("BOOKMARK");
  await expect(label).toBeInViewport();
  await expect(count).toHaveText("(1)");
  await expect(count).toBeInViewport();

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(label).toHaveText("BOOKMARK");
  await expect(label).toBeInViewport();
  await expect(count).toHaveText("(1)");
  await expect(count).toBeInViewport();
  await expect(bookmarksCommand(page).locator("svg")).toBeInViewport();
});

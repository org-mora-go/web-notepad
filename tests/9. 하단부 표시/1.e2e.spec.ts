import { expect, test } from "@playwright/test";

test("1. 상태 표시줄에 줄 수와 그룹 및 북마크 수를 표시하고 패널을 연다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const creatorCredit = page.locator(".creator-credit");
  await expect(creatorCredit).toBeVisible();
  await expect(creatorCredit).toHaveAttribute("aria-label", "HYUN-WOO YOO");
  await expect(creatorCredit).toHaveText("HYUN-WOO YOO");
  await page.locator("textarea").fill("one\ntwo");
  await expect(page.locator(".status-lines")).toContainText("2 LINES");
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();

  const bookmarkButton = page.locator(".status-actions .status-command").first();
  const groupButton = page.locator(".status-actions .status-command").nth(1);
  const bookmarkLabel = bookmarkButton.locator(".status-label");
  const bookmarkCount = bookmarkButton.locator(".status-count");
  const groupCount = groupButton.locator(".status-count");

  await expect(bookmarkLabel).toHaveText("BOOKMARK");
  await expect(bookmarkCount).toHaveText("(1)");
  await expect(groupCount).toHaveText("(1)");
  await expect(page.getByRole("button", { name: /Ungrouped/ })).toBeVisible();
  await bookmarkButton.click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await groupButton.click();
  await expect(page.locator("#groups-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(creatorCredit).toBeVisible();
  await expect(creatorCredit).toHaveText("HYUN-WOO YOO");
  await expect(bookmarkLabel).toBeVisible();
  await expect(bookmarkCount).toBeInViewport();
  await expect(groupCount).toBeInViewport();
});
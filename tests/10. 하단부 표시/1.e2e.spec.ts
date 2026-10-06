import { expect, test } from "@playwright/test";

test("1. 상태 표시줄에 노트와 그룹 정보를 표시한다", async ({ page }) => {
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

  const bookmarkButton = page
    .locator(".status-actions .status-command")
    .first();
  const groupButton = page.locator(".status-actions .status-command").nth(1);
  const bookmarkLabel = bookmarkButton.locator(".status-label");
  const bookmarkCount = bookmarkButton.locator(".status-count");
  const groupCount = groupButton.locator(".status-count");
  const groupName = groupButton.locator(".group-status-name");
  const shortcutLabel = page.locator(
    ".shortcut-command > span:not(.status-separator)",
  );

  await expect(creatorCredit).toHaveCSS("font-size", "13px");
  await expect(page.locator(".status-lines")).toHaveCSS("font-size", "14px");
  await expect(shortcutLabel).toHaveCSS("font-size", "14px");
  await expect(page.locator(".status-separator").first()).toHaveCSS(
    "font-size",
    "14px",
  );
  await expect(bookmarkLabel).toHaveCSS("font-size", "14px");
  await expect(bookmarkCount).toHaveCSS("font-size", "14px");
  await expect(groupCount).toHaveCSS("font-size", "14px");
  await expect(groupName).toHaveCSS("font-size", "14px");
  await expect(groupName).toHaveCSS("max-width", "180px");
  await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
  await expect(bookmarkLabel).toHaveText("BOOKMARK");
  await expect(bookmarkCount).toHaveText("(1)");
  await expect(groupCount).toHaveText("(1)");
  await expect(page.getByRole("button", { name: /Ungrouped/ })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(bookmarkLabel).toHaveCSS("font-size", "14px");
  await expect(bookmarkCount).toHaveCSS("font-size", "14px");
  await expect(groupCount).toHaveCSS("font-size", "14px");
  await expect(groupName).toHaveCSS("font-size", "14px");
  await expect(groupName).toHaveCSS("max-width", "90px");
  await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
  await expect(creatorCredit).toHaveCSS("font-size", "13px");
  await expect(creatorCredit).toBeVisible();
  await expect(creatorCredit).toHaveText("HYUN-WOO YOO");
  await expect(bookmarkLabel).toBeVisible();
  await expect(bookmarkCount).toBeInViewport();
  await expect(groupCount).toBeInViewport();
});

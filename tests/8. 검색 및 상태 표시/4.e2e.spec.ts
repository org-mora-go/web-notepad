import { expect, test } from "@playwright/test";

test("4. 상태 표시줄 항목을 외곽선 없이 구분하고 모바일 구분자를 조정한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const shortcut = page.locator(".shortcut-command");
  const lines = page.locator(".status-lines");
  const bookmark = page.locator(".status-actions .status-command").first();
  const group = page.locator(".status-actions .status-command").nth(1);
  const separators = page.locator(".status-separator");

  await expect(separators).toHaveCount(3);
  await expect(separators).toHaveText(["|", "|", "|"]);
  await expect(shortcut.locator(".status-separator")).toHaveCount(1);
  await expect(lines.locator(".status-separator")).toHaveCount(0);
  await expect(bookmark.locator(".status-separator")).toHaveCount(1);
  await expect(group.locator(".status-separator")).toHaveCount(1);
  await expect(shortcut).toHaveCSS("border-top-width", "0px");
  await expect(bookmark).toHaveCSS("border-top-width", "0px");
  await expect(group).toHaveCSS("border-top-width", "0px");
  await expect(page.getByRole("button", { name: "BOOKMARK" })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(shortcut).toBeHidden();
  await expect(lines).toBeHidden();
  await expect(page.locator(".status-separator:visible")).toHaveCount(2);
});

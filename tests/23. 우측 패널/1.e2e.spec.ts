import { expect, test } from "@playwright/test";

test("1. 상태 표시줄의 그룹, BOOKMARK, SHORTCUT 명령을 선택하면 해당 우측 패널을 연다", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.locator('button[aria-controls="groups-panel"]').click();
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "그룹 닫기" }).click();
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "true");

  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "북마크 닫기" }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("aria-hidden", "true");

  const shortcutButton = page.getByRole("button", { name: "단축키 안내" });
  await expect(page.locator(".status-actions > .shortcut-command")).toHaveCount(1);
  await expect(shortcutButton).toBeVisible();
  await shortcutButton.click();
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "false");
  await page.getByRole("button", { name: "단축키 닫기" }).click();
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "true");
});

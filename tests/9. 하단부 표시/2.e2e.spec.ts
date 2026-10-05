import { expect, test } from "@playwright/test";

test("2. SHORTCUT 안내 패널은 왼쪽에 표시되고 패널별 단축키를 설명한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const shortcutButton = page.getByRole("button", { name: "단축키 안내" });
  await expect(page.locator(".save-state + .shortcut-command")).toHaveCount(1);
  await expect(shortcutButton).toBeVisible();
  await shortcutButton.click();

  const shortcutsPanel = page.locator("#shortcuts-panel");
  await expect(shortcutsPanel).toHaveAttribute("aria-hidden", "false");
  await expect(shortcutsPanel).toContainText("Option + F12");
  await expect(shortcutsPanel).toContainText("Option + F11");
  await page.getByRole("button", { name: "단축키 닫기" }).click();
  await expect(shortcutsPanel).toHaveAttribute("aria-hidden", "true");

  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await page.getByRole("button", { name: "북마크 닫기" }).click();

  await page.getByRole("button", { name: /Ungrouped/ }).click();
  await expect(page.locator("#groups-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
});
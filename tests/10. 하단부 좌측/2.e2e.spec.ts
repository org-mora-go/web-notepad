import { expect, test } from "@playwright/test";

test("2. SHORTCUT 패널에 키보드 단축키와 줄 범위 선택 안내를 표시한다", async ({
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
  await expect(shortcutsPanel).toContainText("Shift + 클릭");
  await page.getByRole("button", { name: "단축키 닫기" }).click();
  await expect(shortcutsPanel).toHaveAttribute("aria-hidden", "true");
});

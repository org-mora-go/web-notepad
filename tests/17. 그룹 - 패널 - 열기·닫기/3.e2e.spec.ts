import { expect, test } from "@playwright/test";

test("3. Escape로 그룹 패널을 닫고 다시 열 수 있다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const panel = page.locator("#groups-panel");
  const toggle = page.locator('button[aria-controls="groups-panel"]');
  await editor.fill("Preserve note when closing groups");

  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await toggle.click();
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await panel.getByPlaceholder("Search groups").fill("Ungrouped");
    await page.keyboard.press("Escape");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await expect(editor).toHaveValue("Preserve note when closing groups");
    await toggle.click();
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expect(panel.getByText("Ungrouped", { exact: true })).toBeVisible();
    await page.goBack();
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  }
  await page.keyboard.press("Escape");
  await expect(editor).toHaveValue("Preserve note when closing groups");
});
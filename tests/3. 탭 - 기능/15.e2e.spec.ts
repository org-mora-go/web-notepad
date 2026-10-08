import { expect, test } from "@playwright/test";

test("15. 탭 삭제 취소 시 내용과 포커스를 유지한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const tabs = page.getByRole("tab");
  const popup = page.getByRole("alertdialog", { name: "Delete tab" });
  await editor.fill("Do not delete this note");

  for (const action of ["escape", "cancel", "close", "backdrop"]) {
    await editor.focus();
    await page.keyboard.press("Alt+Backspace");
    await expect(popup).toBeVisible();
    await expect(popup.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(popup.getByRole("button", { name: "Delete", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(popup.getByRole("button", { name: "Close deletion confirmation" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(popup.getByRole("button", { name: "Delete", exact: true })).toBeFocused();

    if (action === "escape") await page.keyboard.press("Escape");
    if (action === "cancel") await popup.getByRole("button", { name: "Cancel", exact: true }).click();
    if (action === "close") await popup.getByRole("button", { name: "Close deletion confirmation" }).click();
    if (action === "backdrop") await page.mouse.click(5, 5);
    await expect(popup).toHaveCount(0);
    await expect(tabs).toHaveCount(1);
    await expect(editor).toHaveValue("Do not delete this note");
    await expect(editor).toBeFocused();
  }
  await page.reload();
  await expect(editor).toHaveValue("Do not delete this note");
});
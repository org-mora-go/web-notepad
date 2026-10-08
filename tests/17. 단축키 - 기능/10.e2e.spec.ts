import { expect, test } from "@playwright/test";

test("10. Escape로 단축키 패널을 닫고 다시 열 수 있다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("Preserve note when closing shortcuts");
  const panel = page.locator("#shortcuts-panel");
  const toggle = page.getByRole("button", { name: "단축키 안내" });

  await toggle.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("textarea")).toHaveValue("Preserve note when closing shortcuts");
  await toggle.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await page.goBack();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});
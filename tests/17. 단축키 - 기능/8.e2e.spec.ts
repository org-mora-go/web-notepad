import { expect, test } from "@playwright/test";

test("8. 브라우저 뒤로가기로 단축키 패널을 닫는다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "단축키 안내" }).click();
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "false");
  await page.goBack();
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "true");
});
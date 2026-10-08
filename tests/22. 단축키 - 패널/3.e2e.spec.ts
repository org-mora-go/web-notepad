import { expect, test } from "@playwright/test";

test("3. Shortcut 안내 콘텐츠는 설명을 15px, 키 표시를 12px로 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "단축키 안내" }).click();

  const panel = page.locator("#shortcuts-panel");
  await expect(panel.locator(".shortcut-row dt").first()).toHaveCSS(
    "font-size",
    "15px",
  );
  await expect(panel.locator(".shortcut-row kbd").first()).toHaveCSS(
    "font-size",
    "12px",
  );
});

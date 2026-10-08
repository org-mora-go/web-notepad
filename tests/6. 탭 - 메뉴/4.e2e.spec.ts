import { expect, test } from "@playwright/test";

test.use({ hasTouch: true });

test("4. 모바일에서는 한 번 탭하거나 우클릭·길게 누르기로 탭 메뉴를 열지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "새 탭 추가" }).tap();
  const tab = page.locator(".tab-item").first();
  const tabButton = tab.locator('[role="tab"]');

  await tabButton.tap();
  await expect(tabButton).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await tabButton.click({ button: "right" });
  await expect(page.getByRole("menu")).toHaveCount(0);
  await tabButton.dispatchEvent("contextmenu", { clientX: 60, clientY: 20 });
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(tab).not.toHaveClass(/is-pinned/);
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});

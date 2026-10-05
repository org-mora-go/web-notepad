import { expect, test } from "@playwright/test";

test("7. 핀 아이콘은 표시 전용이며 우클릭 메뉴에서 고정과 북마크를 전환한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item").first();
  const tabButton = tab.locator('[role="tab"]');

  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin" }).click();
  const pinIndicator = tab.locator(".tab-pin-indicator");
  await expect(pinIndicator).toBeVisible();
  await expect(pinIndicator).not.toHaveRole("button");
  await pinIndicator.click();
  await expect(tab).toHaveClass(/is-pinned/);

  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Unpin" }).click();
  await expect(tab).not.toHaveClass(/is-pinned/);

  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  await expect(tab).toHaveClass(/is-bookmarked/);
  await expect(tab.locator(".tab-bookmark-indicator")).toBeVisible();
});

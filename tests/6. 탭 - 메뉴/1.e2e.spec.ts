import { expect, test } from "@playwright/test";

test("1. PC 우클릭 메뉴에서 탭의 고정과 북마크를 전환할 수 있다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item").first();
  const tabButton = tab.locator('[role="tab"]');

  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin", exact: true }).click();
  await expect(tab).toHaveClass(/is-pinned/);

  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Unpin", exact: true }).click();
  await expect(tab).not.toHaveClass(/is-pinned/);

  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
  await expect(tab).toHaveClass(/is-bookmarked/);

  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Remove bookmark", exact: true }).click();
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});

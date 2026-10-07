import { expect, test } from "@playwright/test";

test("6. 우클릭 메뉴에서 탭의 고정과 북마크를 전환할 수 있다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item").first();
  const tabButton = tab.locator('[role="tab"]');

  await tabButton.dblclick();
  await expect(page.getByRole("menu")).toHaveCount(0);
  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin" }).click();
  await expect(tab).toHaveClass(/is-pinned/);

  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Unpin" }).click();
  await expect(tab).not.toHaveClass(/is-pinned/);

  await tabButton.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  await expect(tab).toHaveClass(/is-bookmarked/);
});

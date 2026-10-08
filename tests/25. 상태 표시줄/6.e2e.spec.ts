import { expect, test } from "@playwright/test";

test("6. PC와 모바일에서 북마크·그룹 라벨, 개수와 구분자를 14px로 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("note");
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const labels = page.locator(".status-meta .status-command > span");
    for (const label of await labels.all()) {
      await expect(label).toHaveCSS("font-size", "14px");
    }
  }
});

import { expect, test } from "@playwright/test";

test("5. PC와 모바일에서 상태 표시줄 글자 크기를 동일하게 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("note");
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator(".creator-credit")).toHaveCSS("font-size", "13px");
    const labels = page.locator(
      ".status-lines, .status-command > span",
    );
    for (const label of await labels.all()) {
      await expect(label).toHaveCSS("font-size", "14px");
    }
  }
});
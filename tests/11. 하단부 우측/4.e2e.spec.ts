import { expect, test } from "@playwright/test";

test("4. PC와 모바일에서 우측 글자 크기를 14px로 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("note");
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const labels = page.locator(
      ".status-meta .status-command > span",
    );
    for (const label of await labels.all()) {
      await expect(label).toHaveCSS("font-size", "14px");
    }
  }
});
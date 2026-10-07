import { expect, test } from "@playwright/test";

test("8. 일반 탭과 고정 탭 및 추가 버튼의 좌우 테두리 없이 상단 강조선을 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("pinned note");
  const pinnedTab = page.locator(".tab-item").first();
  await pinnedTab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin", exact: true }).click();
  await page.getByRole("button", { name: "새 탭 추가" }).click();

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const items = page.locator(".tab-item, .add-tab");
    for (const item of await items.all()) {
      await expect(item).toHaveCSS("border-left-width", "0px");
      await expect(item).toHaveCSS("border-right-width", "0px");
    }
    await expect(pinnedTab).toHaveClass(/is-pinned/);
    await expect(page.locator(".tab-item.is-active")).toHaveCSS("box-shadow", /0px 2px 0px 0px inset/);
    await pinnedTab.locator('[role="tab"]').click();
    await expect(pinnedTab).toHaveCSS("box-shadow", /0px 2px 0px 0px inset/);
  }
});
import { expect, test } from "@playwright/test";

test("6. 탭 메뉴의 Pin과 Bookmark 글자 크기를 14px로 표시한다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const tab = page.getByRole("tab").first();

    for (const name of ["Pin", "Bookmark", "Unpin", "Remove bookmark"]) {
      if (width === 1280) {
        await tab.click({ button: "right" });
      } else {
        await tab.dblclick();
      }
      const item = page.getByRole("menuitem", { name, exact: true });
      await expect(item).toBeVisible();
      await expect(item).toHaveCSS("font-size", "14px");
      await expect(item.locator("span")).toHaveCSS("font-size", "14px");
      await expect(item.locator("svg")).toHaveAttribute("width", "14");
      await expect(item.locator("svg")).toHaveAttribute("height", "14");
      await item.click();
    }
  }
});
import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { addTabButton, chooseTabMenuItem } from "../__util__";

test("8. 일반 탭과 고정 탭 및 추가 버튼의 좌우 테두리 없이 상단 강조선을 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("pinned note");
  const pinnedTab = page.locator(".tab-item").first();
  await chooseTabMenuItem(page, "Pin");
  await addTabButton(page).click();

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
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

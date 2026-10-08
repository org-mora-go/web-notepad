import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { addTabButton } from "../__util__";

test("1. PC와 모바일의 모든 텍스트 입력 커서는 탭 색상과 무관하게 그레이다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await expect(editor).toBeVisible();
  const activeTab = page.locator(".tab-item.is-active");
  const gray = "rgb(184, 184, 176)";

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const color of ["green", "gray", "red"]) {
      await expect(activeTab).toHaveAttribute("data-tab-color", color);
      await editor.focus();
      await expect(editor).toHaveCSS("caret-color", gray);
      await activeTab.locator(".dirty-dot").click();
    }

    await addTabButton(page).click();
    await expect(editor).toHaveCSS("caret-color", gray);
    await page.locator('.tab-item [role="tab"]').first().click();
    await expect(editor).toHaveCSS("caret-color", gray);
    const inputs = page.locator("input");
    expect(await inputs.count()).toBeGreaterThan(0);
    for (const input of await inputs.all()) {
      await expect(input).toHaveCSS("caret-color", gray);
    }
  }
});

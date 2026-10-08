import { expect, test } from "@playwright/test";

test("1. PC와 모바일의 모든 텍스트 입력 커서는 탭 색상과 무관하게 그레이다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await expect(editor).toBeVisible();
  const activeTab = page.locator(".tab-item.is-active");
  const gray = "rgb(184, 184, 176)";

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const color of ["green", "gray", "red"]) {
      await expect(activeTab).toHaveAttribute("data-tab-color", color);
      await editor.focus();
      await expect(editor).toHaveCSS("caret-color", gray);
      await activeTab.locator(".dirty-dot").click();
    }

    await page.getByRole("button", { name: "새 탭 추가" }).click();
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
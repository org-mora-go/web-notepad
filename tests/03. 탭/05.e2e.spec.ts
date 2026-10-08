import { expect, test } from "@playwright/test";

import { activeTabItem } from "../__util__";

test("5. 저장 기준과 다른 내용에 변경 표시를 보여준다", async ({ page }) => {
  await page.goto("/");
  const tab = activeTabItem(page);
  const colorButton = tab.locator(".dirty-dot");
  const editor = page.locator("textarea");
  const readIcon = () => colorButton.evaluate((button) => {
    const style = getComputedStyle(button, "::before");
    return { width: style.width, height: style.height, boxShadow: style.boxShadow, filter: style.filter };
  });
  await expect(tab).not.toHaveClass(/is-dirty/);
  const initialIcon = await readIcon();
  await editor.fill("changed");
  await expect(tab).toHaveClass(/is-dirty/);
  await expect(colorButton).toHaveCSS("width", "14px");
  await expect(colorButton).toHaveCSS("height", "14px");
  const dirtyIcon = await readIcon();
  expect(dirtyIcon.width).toBe(initialIcon.width);
  expect(dirtyIcon.height).toBe(initialIcon.height);
  expect(dirtyIcon.boxShadow).toBe(initialIcon.boxShadow);
  expect(dirtyIcon.filter).toBe("brightness(1.15)");
  await editor.fill("");
  await expect(tab).not.toHaveClass(/is-dirty/);
});

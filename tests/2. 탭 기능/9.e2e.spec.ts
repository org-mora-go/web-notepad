import { expect, test } from "@playwright/test";

test("9. 저장 기준과 다른 내용에 변경 표시를 보여준다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item.is-active");
  const colorButton = tab.locator(".dirty-dot");
  await expect(tab).not.toHaveClass(/is-dirty/);
  const initialIcon = await colorButton.evaluate((button) => {
    const style = getComputedStyle(button, "::before");
    return { width: style.width, height: style.height, boxShadow: style.boxShadow };
  });
  await page.locator("textarea").fill("changed");
  await expect(tab).toHaveClass(/is-dirty/);
  await expect(colorButton).toHaveCSS("width", "14px");
  await expect(colorButton).toHaveCSS("height", "14px");
  const dirtyIcon = await colorButton.evaluate((button) => {
    const style = getComputedStyle(button, "::before");
    return {
      width: style.width,
      height: style.height,
      boxShadow: style.boxShadow,
      filter: style.filter,
    };
  });
  expect(dirtyIcon.width).toBe(initialIcon.width);
  expect(dirtyIcon.height).toBe(initialIcon.height);
  expect(dirtyIcon.boxShadow).toBe(initialIcon.boxShadow);
  expect(dirtyIcon.filter).toBe("brightness(1.15)");
  await page.locator("textarea").fill("");
  await expect(tab).not.toHaveClass(/is-dirty/);
});
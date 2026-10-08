import { expect, test } from "@playwright/test";

test("3. 클릭과 키보드로 줄을 선택하고 첫 줄의 상단 여백까지 강조한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("first\nsecond\nthird");
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines.first()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await lines.first().click();
  await expect(lines.first()).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".line-rail")).toHaveCSS(
    "background-image",
    /rgba\(143, 227, 176, 0\.2\)/,
  );
  await expect(page.locator(".line-rail")).toHaveCSS("background-size", "100% 10px");
  await expect(editor).toHaveCSS("background-position", /0px 0px/);
  await expect(editor).toHaveCSS("background-size", "100% 43px");
  await lines.first().click();
  await lines.nth(1).focus();
  await lines.nth(1).press("Enter");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(1)).toHaveCSS("background-color", "rgba(143, 227, 176, 0.2)");
  await expect(lines.nth(1)).toHaveCSS("color", "rgb(143, 227, 176)");
  await expect(editor).toHaveCSS("background-image", /rgba\(143, 227, 176, 0\.2\)/);

  await lines.nth(1).press("Enter");
  await editor.fill(Array.from({ length: 80 }, (_, index) => `line ${index + 1}`).join("\n"));
  const rail = page.locator(".line-rail");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await editor.evaluate((element) => {
      element.scrollTop = 0;
      element.dispatchEvent(new Event("scroll"));
    });
    await lines.first().click();
    await expect(rail).toHaveCSS("background-attachment", "local");
    await editor.evaluate((element) => {
      element.scrollTop = 330;
      element.dispatchEvent(new Event("scroll"));
    });
    await expect.poll(() => rail.evaluate((element) => element.scrollTop)).toBe(330);
    const bounds = (await rail.boundingBox())!;
    const clip = { x: bounds.x + 2, y: bounds.y + 1, width: 20, height: 8 };
    const selectedTop = await page.screenshot({ clip });
    await lines.first().dispatchEvent("click");
    await expect(lines.first()).toHaveAttribute("aria-pressed", "false");
    const unselectedTop = await page.screenshot({ clip });
    expect(selectedTop.equals(unselectedTop)).toBe(true);
  }
});
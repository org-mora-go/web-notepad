import { expect, test } from "@playwright/test";

test("9. PC와 모바일 하단 메뉴는 스크롤 없이 표시되고 각 패널을 열고 닫는다", async ({ page }) => {
  await page.goto("/");
  const commands = page.locator(".status-meta .status-command:visible");
  for (const width of [320, 390, 640, 641, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const count = width <= 640 ? 4 : 5;
    await expect(commands).toHaveCount(count);
    for (const command of await commands.all()) {
      await expect(command).toBeInViewport();
      const bounds = (await command.boundingBox())!;
      if (width <= 640) {
        expect(bounds.width).toBeCloseTo(width / count, 1);
      }
      expect(bounds.height).toBe(width <= 640 ? 51 : 35);
      const label = command.locator(".status-label:visible, .global-search-label:visible, .group-status-label:visible, .group-status-name:visible");
      await expect(label).toBeVisible();
      const labelBounds = (await label.boundingBox())!;
      const iconBounds = (await command.locator("svg").boundingBox())!;
      if (width <= 640) {
        expect(labelBounds.y).toBeGreaterThanOrEqual(iconBounds.y + iconBounds.height);
      } else {
        expect(labelBounds.x).toBeGreaterThanOrEqual(iconBounds.x + iconBounds.width);
        expect(labelBounds.y + labelBounds.height / 2).toBeCloseTo(iconBounds.y + iconBounds.height / 2, 1);
      }
      expect(labelBounds.x).toBeGreaterThanOrEqual(bounds.x);
      expect(labelBounds.x + labelBounds.width).toBeLessThanOrEqual(bounds.x + bounds.width);
    }
    expect(await page.locator(".status-bar").evaluate((bar) => bar.scrollWidth <= bar.clientWidth)).toBe(true);
  }

  for (const command of await commands.all()) {
    const panelId = await command.getAttribute("aria-controls");
    await command.click();
    await expect(command).toHaveAttribute("aria-expanded", "true");
    await expect(command).toHaveClass(/is-active/);
    await expect(page.locator(`#${panelId}`)).toHaveAttribute("aria-hidden", "false");
    await page.keyboard.press("Escape");
    await expect(command).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(`#${panelId}`)).toHaveAttribute("aria-hidden", "true");
  }
});
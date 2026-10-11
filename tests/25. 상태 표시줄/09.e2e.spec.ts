import { expect, test } from "@playwright/test";

test("9. 모바일 하단 네 메뉴는 스크롤 없이 표시되고 각 패널을 열고 닫는다", async ({ page }) => {
  await page.goto("/");
  const commands = page.locator(".status-controls .status-command");
  for (const width of [320, 390, 640]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(commands).toHaveCount(4);
    for (const command of await commands.all()) {
      await expect(command).toBeInViewport();
      const bounds = (await command.boundingBox())!;
      expect(bounds.width).toBeCloseTo(width / 4, 1);
      expect(bounds.height).toBeGreaterThanOrEqual(48);
      const label = command.locator(".status-label, .global-search-label, .group-status-label");
      await expect(label).toBeVisible();
      const labelBounds = (await label.boundingBox())!;
      const iconBounds = (await command.locator("svg").boundingBox())!;
      expect(labelBounds.y).toBeGreaterThanOrEqual(iconBounds.y + iconBounds.height);
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
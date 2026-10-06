import { expect, test } from "@playwright/test";

test("1. PC와 모바일에서 좌측 제작자 이름을 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const creator = page.locator(".status-left .creator-credit");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(creator).toHaveText("HYUN-WOO YOO");
    await expect(creator).toHaveAttribute("aria-label", "HYUN-WOO YOO");
    await expect(creator).toBeInViewport();
  }
});
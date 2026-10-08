import { expect, test } from "@playwright/test";

import { seedSplitState } from "./__util__";

test("7. 앱 재접속 시 분할 비율을 중앙으로 초기화한다", async ({ page }) => {
  await seedSplitState(page, 0.7);
  await page.goto("http://localhost:3000");

  const paneGroup = page.locator(".pane-group");
  const divider = page.getByRole("separator", { name: "영역 크기 조절" });
  const distanceFromCenter = async () => {
    const paneBounds = await paneGroup.boundingBox();
    const dividerBounds = await divider.boundingBox();
    if (!paneBounds || !dividerBounds) return Number.POSITIVE_INFINITY;
    const paneCenter = paneBounds.x + paneBounds.width / 2;
    const dividerCenter = dividerBounds.x + dividerBounds.width / 2;
    return Math.abs(dividerCenter - paneCenter);
  };

  await expect.poll(distanceFromCenter).toBeLessThan(10);
});

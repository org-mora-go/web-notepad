import { expect, test } from "@playwright/test";

import { seedSplitState } from "./__util__";

test("8. 오른쪽 패널에 새 탭을 추가하면 분할선을 중앙으로 조정한다", async ({ page }) => {
  await seedSplitState(page);
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

  const dividerBounds = (await divider.boundingBox())!;
  await page.mouse.move(
    dividerBounds.x + dividerBounds.width / 2,
    dividerBounds.y + dividerBounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    dividerBounds.x + dividerBounds.width / 2 + 70,
    dividerBounds.y + dividerBounds.height / 2,
    { steps: 3 },
  );
  await page.mouse.up();
  await expect.poll(distanceFromCenter).toBeGreaterThan(50);

  await page
    .locator(".pane-slot")
    .nth(1)
    .getByRole("button", { name: "새 탭 추가" })
    .click();
  await expect(page.locator(".pane-slot").nth(1).getByRole("tab")).toHaveCount(2);
  await expect.poll(distanceFromCenter).toBeLessThan(10);
});

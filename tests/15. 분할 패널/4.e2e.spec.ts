import { expect, test } from "@playwright/test";

import { dragDividerTo } from "../__util__";
import { seedSplitState } from "./__util__";

test("4. 구분선 드래그로 너비 비율을 조정하고 20%~80%로 제한한다", async ({ page }) => {
  await seedSplitState(page);
  const group = page.locator(".pane-group");
  const left = page.locator(".pane-slot").first();
  const right = page.locator(".pane-slot").nth(1);
  const initial = (await left.boundingBox())!;
  const groupBox = (await group.boundingBox())!;

  const ratio = async () => {
    const leftWidth = (await left.boundingBox())?.width ?? 0;
    const rightWidth = (await right.boundingBox())?.width ?? 0;
    return leftWidth / (leftWidth + rightWidth);
  };

  await dragDividerTo(page, initial.x + initial.width + 70);
  await expect
    .poll(async () => (await left.boundingBox())?.width ?? 0)
    .toBeGreaterThan(initial.width + 30);

  await dragDividerTo(page, groupBox.x + groupBox.width - 2);
  await expect.poll(ratio).toBeGreaterThan(0.78);
  await expect.poll(ratio).toBeLessThan(0.82);

  await dragDividerTo(page, groupBox.x + 2);
  await expect.poll(ratio).toBeGreaterThan(0.18);
  await expect.poll(ratio).toBeLessThan(0.22);
});

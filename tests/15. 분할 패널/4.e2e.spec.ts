import { expect, test } from "@playwright/test";

import { seedSplitState } from "./__util__";

test("4. 구분선 드래그로 너비 비율을 조정하고 20%~80%로 제한한다", async ({ page }) => {
  await seedSplitState(page);
  await page.goto("http://localhost:3000");
  const divider = page.getByRole("separator", { name: "영역 크기 조절" });
  const group = page.locator(".pane-group");
  const left = page.locator(".pane-slot").first();
  const right = page.locator(".pane-slot").nth(1);
  const initial = (await left.boundingBox())!;
  const groupBox = (await group.boundingBox())!;

  const dragDividerTo = async (x: number) => {
    const box = (await divider.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(x, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
  };
  const ratio = async () => {
    const leftWidth = (await left.boundingBox())?.width ?? 0;
    const rightWidth = (await right.boundingBox())?.width ?? 0;
    return leftWidth / (leftWidth + rightWidth);
  };

  await dragDividerTo(initial.x + initial.width + 70);
  await expect
    .poll(async () => (await left.boundingBox())?.width ?? 0)
    .toBeGreaterThan(initial.width + 30);

  await dragDividerTo(groupBox.x + groupBox.width - 2);
  await expect.poll(ratio).toBeGreaterThan(0.78);
  await expect.poll(ratio).toBeLessThan(0.82);

  await dragDividerTo(groupBox.x + 2);
  await expect.poll(ratio).toBeGreaterThan(0.18);
  await expect.poll(ratio).toBeLessThan(0.22);
});

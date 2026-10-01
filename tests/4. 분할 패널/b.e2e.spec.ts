import { expect, test } from "@playwright/test";

import { seedSplitState } from "./__util__";

test("b. 구분선을 드래그하면 패널 너비 비율이 변경된다", async ({ page }) => {
  await seedSplitState(page);
  await page.goto("http://localhost:3000");
  const divider = page.getByRole("separator", { name: "영역 크기 조절" });
  const box = await divider.boundingBox();
  const left = page.locator(".pane-slot").first();
  const initial = await left.boundingBox();
  expect(box).not.toBeNull();
  expect(initial).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box!.x + box!.width / 2 + 70,
    box!.y + box!.height / 2,
    { steps: 3 },
  );
  await page.mouse.up();
  await expect
    .poll(async () => (await left.boundingBox())?.width ?? 0)
    .toBeGreaterThan(initial!.width + 30);
});

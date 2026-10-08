import { expect, test } from "@playwright/test";

import { countWrappedLines } from "./__util__";

test("6. 자동 줄바꿈된 표시 줄 수에 맞춰 LINE 번호를 늘리고 줄인다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea").first();
  const lines = page.locator('.line-rail [role="button"]');
  const content = `${"긴 메모 abc\t ".repeat(30)}\n마지막 줄\n`;
  const numbers = (count: number) =>
    Array.from({ length: count }, (_, index) => String(index + 1).padStart(2, "0"));

  await editor.fill(content);
  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const desktopCount = await lines.count();
  expect(desktopCount).toBeGreaterThan(3);
  await expect(lines).toHaveText(numbers(desktopCount));

  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => lines.count()).toBe(await countWrappedLines(editor));
  const mobileCount = await lines.count();
  expect(mobileCount).toBeGreaterThan(desktopCount);
  await expect(lines).toHaveText(numbers(mobileCount));

  await editor.fill("첫 줄\n둘째 줄");
  await expect(lines).toHaveText(["01", "02"]);
  await editor.fill(content);
  await expect(lines).toHaveCount(mobileCount);

  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(lines).toHaveCount(desktopCount);
  await expect(editor).toHaveValue(content);

  await page.getByRole("button", { name: "새 탭 추가" }).click();
  await editor.fill("right");
  await editor.press("Alt+F12");
  const leftEditor = page.locator(".pane-slot").nth(0).locator("textarea");
  const leftLines = page.locator(".pane-slot").nth(0).locator('.line-rail [role="button"]');
  await expect(leftEditor).toHaveValue(content);
  await expect.poll(() => leftLines.count()).toBe(await countWrappedLines(leftEditor));
  const splitCount = await leftLines.count();
  expect(splitCount).toBeGreaterThan(desktopCount);

  const divider = page.getByRole("separator", { name: "영역 크기 조절" });
  const box = (await divider.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 300, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect.poll(() => leftLines.count()).toBeLessThan(splitCount);
  await expect.poll(async () => (await leftLines.count()) === (await countWrappedLines(leftEditor))).toBe(true);
  await expect(leftLines).toHaveText(numbers(await leftLines.count()));
});

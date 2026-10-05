import { expect, test } from "@playwright/test";

test("6. Shift 클릭으로 기준 줄부터 지정 줄까지 범위를 선택하고 다시 해제한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("first\nsecond\nthird\nfourth\nfifth");
  const lines = page.locator('.line-rail [role="button"]');

  await lines.nth(0).click();
  await lines.nth(4).click({ modifiers: ["Shift"] });
  for (let index = 0; index < 5; index += 1) {
    await expect(lines.nth(index)).toHaveAttribute("aria-pressed", "true");
  }

  await lines.nth(4).click({ modifiers: ["Shift"] });
  for (let index = 0; index < 5; index += 1) {
    await expect(lines.nth(index)).toHaveAttribute("aria-pressed", "false");
  }
});

test("6. Shift 클릭으로 대상 줄이 속한 연속 선택 블록만 해제한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("one\ntwo\nthree\nfour\nfive\nsix");
  const lines = page.locator('.line-rail [role="button"]');

  for (const index of [0, 1, 3, 4, 5]) {
    await lines.nth(index).click();
  }
  await lines.nth(5).click({ modifiers: ["Shift"] });

  for (const index of [0, 1]) {
    await expect(lines.nth(index)).toHaveAttribute("aria-pressed", "true");
  }
  for (const index of [2, 3, 4, 5]) {
    await expect(lines.nth(index)).toHaveAttribute("aria-pressed", "false");
  }
});

import { expect, test } from "@playwright/test";

test("5. Option+F12는 활성 탭을 오른쪽 패널로, Option+F11은 왼쪽 패널로 이동한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("existing note");
  await page.locator('button[aria-label="새 탭 추가"]').click();
  await page.locator("textarea").fill("moving note");

  await page.locator("textarea").press("Alt+F12");
  await expect(page.locator(".body")).toHaveCount(2);
  await expect(
    page.locator(".pane-slot").nth(1).locator("textarea"),
  ).toHaveValue("moving note");
  await expect(
    page.locator(".pane-slot").nth(1).locator("textarea"),
  ).toBeFocused();

  const rightPane = page.locator(".pane-slot").nth(1);
  await rightPane.locator('button[aria-label="새 탭 추가"]').click();
  await rightPane.locator(".tab-item").first().locator(".tab-select").click();
  await expect(rightPane.locator("textarea")).toHaveValue("moving note");
  await expect(rightPane.locator("textarea")).toBeFocused();

  await page.locator(".pane-slot").nth(1).locator("textarea").press("Alt+F11");
  await expect(page.locator(".body")).toHaveCount(2);
  await expect(
    page.locator(".pane-slot").first().locator("textarea"),
  ).toHaveValue("moving note");
  await expect(
    page.locator(".pane-slot").first().locator("textarea"),
  ).toBeFocused();
});

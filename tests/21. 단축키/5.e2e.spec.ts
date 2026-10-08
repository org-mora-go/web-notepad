import { expect, test } from "@playwright/test";

import { addTabButton } from "../__util__";

test("5. Option+F12는 활성 탭을 오른쪽 패널로, Option+F11은 왼쪽 패널로 이동한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("textarea").fill("existing note");
  await addTabButton(page).click();
  await page.locator("textarea").fill("moving note");

  await page.locator("textarea").press("Alt+F12");
  await expect(page.locator(".body")).toHaveCount(2);
  const leftEditor = page.locator(".pane-slot").first().locator("textarea");
  const rightPane = page.locator(".pane-slot").nth(1);
  const rightEditor = rightPane.locator("textarea");
  await expect(rightEditor).toHaveValue("moving note");
  await expect(rightEditor).toBeFocused();

  await rightPane.locator('button[aria-label="새 탭 추가"]').click();
  await rightPane.locator(".tab-item").first().locator(".tab-select").click();
  await expect(rightEditor).toHaveValue("moving note");
  await expect(rightEditor).toBeFocused();

  await rightEditor.press("Alt+F11");
  await expect(page.locator(".body")).toHaveCount(2);
  await expect(leftEditor).toHaveValue("moving note");
  await expect(leftEditor).toBeFocused();
});

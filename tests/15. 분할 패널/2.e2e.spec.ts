import { expect, test } from "@playwright/test";

import { addTabButton } from "../__util__";

test("2. 왼쪽 탭을 오른쪽 분할 영역에 드롭하면 분할 화면을 만든다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("first");
  await addTabButton(page).click();
  await editor.fill("second");
  await expect(page.locator(".body")).toHaveCount(1);

  const tab = page.locator(".tab-item").filter({ hasText: "first" });
  const body = page.locator(".body");
  const tabBox = (await tab.boundingBox())!;
  const bodyBox = (await body.boundingBox())!;
  await page.mouse.move(tabBox.x + tabBox.width / 2, tabBox.y + tabBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(bodyBox.x + bodyBox.width / 2, bodyBox.y + bodyBox.height / 2, {
    steps: 5,
  });
  const splitZone = page.locator(".note-pane-drop.is-half");
  await expect(splitZone).toHaveText("Split right");
  const zoneBox = (await splitZone.boundingBox())!;
  await page.mouse.move(zoneBox.x + zoneBox.width / 2, zoneBox.y + zoneBox.height / 2, {
    steps: 5,
  });
  await page.mouse.up();

  await expect(page.locator(".body")).toHaveCount(2);
  await expect(page.locator(".pane-slot").nth(0).locator("textarea")).toHaveValue("second");
  await expect(page.locator(".pane-slot").nth(1).locator("textarea")).toHaveValue("first");
});

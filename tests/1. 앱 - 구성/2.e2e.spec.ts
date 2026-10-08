import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../__constant__";

test("2. 노트 상태는 web-notepad-storage 키로 저장되고 새로고침 후 복원된다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea").first();
  await editor.fill("persisted note");
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY))
    .toContain("persisted note");
  await page.reload();
  await expect(editor).toHaveValue("persisted note");
});

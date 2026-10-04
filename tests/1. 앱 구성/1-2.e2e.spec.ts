import { expect, test } from "@playwright/test";

test("1-2. 노트 상태는 web-notepad-storage 키로 저장되고 새로고침 후 복원된다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea").first();
  await editor.fill("persisted note");
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("web-notepad-storage")),
    )
    .toContain("persisted note");
  await page.reload();
  await expect(editor).toHaveValue("persisted note");
});

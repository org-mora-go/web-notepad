import { expect, test } from "@playwright/test";

test("4. 빈 탭은 확인 팝업 없이 바로 닫는다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  const editor = page.locator("textarea");
  const popup = page.getByRole("alertdialog", { name: "Delete tab" });
  const addTabButton = page.getByRole("button", { name: "새 탭 추가", exact: true });

  await editor.fill("Keep this note");
  await addTabButton.click();
  await expect(tabs).toHaveCount(2);
  await tabs.last().locator(".tab-close").click();
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep this note");

  await addTabButton.click();
  await expect(tabs).toHaveCount(2);
  await tabs.last().getByRole("tab").click({ button: "middle" });
  await expect(popup).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep this note");
});

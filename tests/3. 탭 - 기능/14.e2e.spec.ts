import { expect, test } from "@playwright/test";

test("14. 내용이 있는 탭은 확인 후 삭제하고 빈 탭은 바로 닫는다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  const editor = page.locator("textarea");
  const popup = page.getByRole("alertdialog", { name: "Delete tab" });

  for (const action of ["close", "middle"]) {
    await editor.fill("Keep this note until confirmed");
    await page.getByRole("button", { name: "새 탭 추가", exact: true }).click();
    const target = tabs.first();
    if (action === "close") {
      await target.locator(".tab-close").click();
    } else {
      await target.getByRole("tab").click({ button: "middle" });
    }
    await expect(popup).toBeVisible();
    await expect(popup).toContainText("Do you want to delete this tab?");
    await expect(tabs).toHaveCount(2);
    await popup.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(popup).toHaveCount(0);
    await expect(tabs).toHaveCount(1);
    await expect(editor).toHaveValue("");
  }

  await page.getByRole("button", { name: "새 탭 추가", exact: true }).click();
  await tabs.last().locator(".tab-close").click();
  await expect(tabs).toHaveCount(1);
  await expect(popup).toHaveCount(0);
  await editor.fill("Last tab note");
  await tabs.first().locator(".tab-close").click();
  await popup.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(editor).toHaveValue("");
  await expect(tabs).toHaveCount(1);
});
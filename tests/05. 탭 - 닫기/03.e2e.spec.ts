import { expect, test } from "@playwright/test";

import { addTabButton, deleteTabPopup } from "../__util__";

test("3. 내용이 있는 탭은 확인 팝업에서 Delete를 선택해야 삭제한다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  const editor = page.locator("textarea");
  const popup = deleteTabPopup(page);
  const deleteButton = popup.getByRole("button", { name: "Delete", exact: true });

  for (const action of ["close", "middle"]) {
    await editor.fill("Keep this note until confirmed");
    await addTabButton(page).click();
    const target = tabs.first();
    if (action === "close") {
      await target.locator(".tab-close").click();
    } else {
      await target.getByRole("tab").click({ button: "middle" });
    }
    await expect(popup).toBeVisible();
    await expect(popup).toContainText("Do you want to delete this tab?");
    await expect(tabs).toHaveCount(2);
    await deleteButton.click();
    await expect(popup).toHaveCount(0);
    await expect(tabs).toHaveCount(1);
    await expect(editor).toHaveValue("");
  }

  await editor.fill("Last tab note");
  await tabs.first().locator(".tab-close").click();
  await expect(popup).toBeVisible();
  await deleteButton.click();
  await expect(editor).toHaveValue("");
  await expect(tabs).toHaveCount(1);
});

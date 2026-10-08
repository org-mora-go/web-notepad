import { expect, test } from "@playwright/test";

test("5. 그룹 삭제 확인 팝업이 열린 상태의 Escape는 팝업 취소를 우선하고 그룹 패널을 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const panel = page.locator("#groups-panel");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Archive");
  await page.getByRole("button", { name: "그룹 생성" }).click();

  const popup = page.getByRole("alertdialog", { name: "Delete group" });
  await page.getByRole("button", { name: "Archive 그룹 삭제" }).click();
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).toHaveCount(0);
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(panel.locator(".group-item")).toContainText(["Archive"]);

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

import { expect, test } from "@playwright/test";

test("9. 줄 선택과 해제를 탭별로 저장하고 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  const lines = page.locator('.line-rail [role="button"]');
  await editor.fill("one\ntwo\nthree");
  await lines.nth(1).click();
  await lines.nth(2).click();
  await page.getByRole("button", { name: "새 탭 추가" }).click();
  await editor.fill("other\nnote");
  await expect(lines.first()).toHaveAttribute("aria-pressed", "false");
  await lines.first().click();
  await page.locator('[role="tab"]').first().click();
  await expect(lines.first()).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await lines.nth(1).click();
  await page.reload();
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await page.locator('[role="tab"]').nth(1).click();
  await expect(lines.first()).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(lines.first()).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
});

test("9. 그룹 전환과 분할 패널 이동 후에도 선택한 줄을 복원한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("one\ntwo\nthree");
  const lines = page.locator('.line-rail [role="button"]');
  await lines.nth(1).click();
  await lines.nth(2).click();
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await expect(lines.first()).toHaveAttribute("aria-pressed", "false");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.locator(".group-item").getByRole("button", { name: "Ungrouped", exact: true }).click();
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "새 탭 추가" }).click();
  await page.locator('[role="tab"]').first().click();
  await page.locator("textarea").press("Alt+F12");
  const rightLines = page.locator(".pane-slot").nth(1).locator('.line-rail [role="button"]');
  await expect(rightLines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(rightLines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(rightLines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(rightLines.nth(2)).toHaveAttribute("aria-pressed", "true");
});

test("9. 줄 삽입과 삭제로 이동한 선택 위치도 저장한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  const lines = page.locator('.line-rail [role="button"]');
  await editor.fill("one\ntwo\nthree");
  await lines.nth(1).click();
  await lines.nth(2).click();
  await editor.fill("zero\none\ntwo\nthree");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(3)).toHaveAttribute("aria-pressed", "true");
  await editor.fill("zero\none\nthree");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
});
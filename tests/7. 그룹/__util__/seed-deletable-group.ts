import type { Page } from "@playwright/test";

export async function seedDeletableGroup(page: Page) {
  await page.goto("http://localhost:3000");
  const toggle = page.locator('button[aria-controls="groups-panel"]');
  await toggle.click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Archive");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await page.getByRole("button", { name: "그룹 닫기" }).click();
  await page.locator("textarea").fill("archived note");
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
  return { toggle };
}

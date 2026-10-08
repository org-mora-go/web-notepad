import { expect, test } from "@playwright/test";

test("1. Ungrouped 외에 이름 있는 그룹을 만들고 전환할 수 있다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("ungrouped note");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await page.getByRole("button", { name: "그룹 닫기" }).click();
  await expect(page.locator(".group-status-name")).toHaveText("Work");
  await expect(page.locator("textarea")).toHaveValue("");

  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.locator(".group-item").getByRole("button", { name: "Ungrouped", exact: true }).click();
  await expect(page.locator(".group-status-name")).toHaveText("Ungrouped");
  await expect(page.locator("textarea")).toHaveValue("ungrouped note");

  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.locator(".group-item").getByRole("button", { name: "Work", exact: true }).click();
  await expect(page.locator(".group-status-name")).toHaveText("Work");
  await expect(page.locator("textarea")).toHaveValue("");
});

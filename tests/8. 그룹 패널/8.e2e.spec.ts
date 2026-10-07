import { expect, test } from "@playwright/test";

test("8. 그룹 패널의 제목과 입력란 및 그룹 이름 글자 크기를 키운다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();

  const panel = page.locator("#groups-panel");
  const search = panel.locator('.search-field input[placeholder="Search groups"]');
  const createInput = panel.locator('input[aria-label="새 그룹 이름"]');
  await createInput.fill("Alpha");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await page.locator('button[aria-controls="groups-panel"]').click();

  await panel.locator('button[aria-label="Alpha 그룹 수정"]').click();
  const editInput = panel.locator('input[aria-label="Alpha 그룹 이름 수정"]');
  await expect(editInput).toHaveCSS("font-size", "15px");
  await editInput.press("Escape");

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(panel.locator("h2")).toHaveCSS("font-size", "22px");
    await expect(search).toHaveCSS("font-size", "14px");
    await expect(createInput).toHaveCSS("font-size", "14px");
    await expect(
      panel.locator('.group-item:has-text("Alpha") strong'),
    ).toHaveCSS("font-size", "15px");
  }

  await search.fill("no matching group");
  await expect(page.locator(".search-empty-state p")).toHaveCSS(
    "font-size",
    "15px",
  );
});
